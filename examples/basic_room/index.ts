import {
  AudioFrame,
  AudioSource,
  LocalAudioTrack,
  Room,
  TrackPublishOptions,
  TrackSource,
  dispose,
} from '@livekit/rtc-node';
import { config } from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

config();

// create access token from API credentials
const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
  identity: 'example-participant',
});
token.addGrant({
  room: 'example-room',
  roomJoin: true,
  roomCreate: true,
  canPublish: true,
});
const jwt = await token.toJwt();

// set up room
const room = new Room();
await room.connect(process.env.LIVEKIT_URL, jwt, { autoSubscribe: true, dynacast: true });
console.log('connected to room', room);

// read relevant metadata from wav file
// this example assumes valid encoding little-endian
const sample = readFileSync(join(process.cwd(), './speex.wav'));
const channels = sample.readUInt16LE(22);
const sampleRate = sample.readUInt32LE(24);
const dataSize = sample.readUInt32LE(40) / 2;

// set up audio track
const source = new AudioSource(sampleRate, channels);
const track = LocalAudioTrack.createAudioTrack('audio', source);
const options = new TrackPublishOptions();
options.source = TrackSource.SOURCE_MICROPHONE;

const buffer = new Uint16Array(sample.buffer.slice(44));
await room.localParticipant.publishTrack(track, options);
await new Promise((resolve) => setTimeout(resolve, 1000)); // wait a bit so the start doesn't cut off
await source.captureFrame(new AudioFrame(buffer, sampleRate, channels, dataSize));

await room.disconnect();
await dispose();
