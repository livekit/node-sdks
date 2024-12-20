import { RemoteParticipant, Room, RoomEvent, type TextStreamReader } from '@livekit/rtc-node';
import { config } from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

config({ path: '.env.local', override: false });
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
  throw new Error('Missing required environment variables. Please check your .env.local file.');
}

const greetParticipant = async (room: Room, recipient: RemoteParticipant) => {
  const greeting = 'Hi this is just a text sample';
  const streamWriter = await room.localParticipant?.streamText({
    destinationIdentities: [recipient.identity],
  });

  for (const c of greeting) {
    await streamWriter?.write(c);
  }

  await streamWriter?.close();
};

const main = async () => {
  const roomName = `dev`;
  const identity = 'tester';
  const token = await createToken(identity, roomName);

  const room = new Room();

  const finishedPromise = new Promise((resolve) => {
    room.on(RoomEvent.ParticipantDisconnected, resolve);
  });

  room.on(RoomEvent.TextStreamReceived, async (reader: TextStreamReader) => {
    for await (const { collected } of reader) {
      console.log(collected);
    }
  });

  room.on(RoomEvent.ParticipantConnected, async (participant) => {
    await greetParticipant(room, participant);
  });

  await room.connect(LIVEKIT_URL, token);

  await finishedPromise;
};

const createToken = async (identity: string, roomName: string) => {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });
  return await token.toJwt();
};

main();
