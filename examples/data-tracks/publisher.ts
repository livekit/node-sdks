import {
  type DataTrackFrame,
  DataTrackPushFrameError,
  type LocalDataTrack,
  Room,
} from '@livekit/rtc-node';
import { config } from 'dotenv';
import { setTimeout } from 'node:timers/promises';
import { AccessToken } from 'livekit-server-sdk';

config({ path: '.env.local', override: false });
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
  throw new Error('Missing required environment variables. Please check your .env.local file.');
}

async function readSensor(): Promise<Uint8Array> {
  return new Uint8Array(256).fill(0xfa);
}

async function pushFrames(track: LocalDataTrack) {
  while (true) {
    console.log('Pushing frame');
    const data = await readSensor();
    try {
      const frame: DataTrackFrame = {
        payload: data,
        userTimestamp: BigInt(Date.now()),
      };
      track.tryPush(frame);
    } catch (e) {
      if (e instanceof DataTrackPushFrameError) {
        console.error('Failed to push frame:', e.message);
      } else {
        throw e;
      }
    }
    await setTimeout(500);
  }
}

const main = async () => {
  const roomName = 'data-track-demo';
  const identity = 'publisher';
  const token = await createToken(identity, roomName);

  const room = new Room();
  await room.connect(LIVEKIT_URL, token);
  console.log('connected to room', room.name);

  const track = await room.localParticipant.publishDataTrack({ name: 'my_sensor_data' });
  await pushFrames(track);
};

const createToken = async (identity: string, roomName: string) => {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
  });
  return await token.toJwt();
};

main();
