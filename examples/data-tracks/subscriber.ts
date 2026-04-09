import { type RemoteDataTrack, Room, RoomEvent } from '@livekit/rtc-node';
import { config } from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

config({ path: '.env.local', override: false });
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
  throw new Error('Missing required environment variables. Please check your .env.local file.');
}

async function subscribe(track: RemoteDataTrack) {
  console.log(
    `Subscribing to '${track.info.name}' published by '${track.publisherIdentity}'`,
  );
  const stream = track.subscribe();
  for await (const frame of stream) {
    console.log(`Received frame (${frame.payload.byteLength} bytes)`);

    if (frame.userTimestamp) {
      const latencyMs = Date.now() - Number(frame.userTimestamp);
      console.log(`Latency: ${latencyMs}ms`);
    }
  }
}

const main = async () => {
  const roomName = 'data-track-demo';
  const identity = 'subscriber';
  const token = await createToken(identity, roomName);

  const room = new Room();

  room.on(RoomEvent.DataTrackPublished, (track: RemoteDataTrack) => {
    subscribe(track).catch((e) => {
      console.error(`Failed to subscribe to '${track.info.name}':`, e);
    });
  });

  await room.connect(LIVEKIT_URL, token);
  console.log('connected to room', room.name);
};

const createToken = async (identity: string, roomName: string) => {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    roomCreate: true,
    canSubscribe: true,
  });
  return await token.toJwt();
};

main();
