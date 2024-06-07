import { readFileSync } from 'node:fs';
import {
  AudioFrame,
  AudioSource,
  LocalAudioTrack,
  Room,
  TrackPublishOptions,
  TrackSource,
} from '@livekit/rtc-node';
import { AccessToken } from 'livekit-server-sdk';
import { join } from 'node:path';

// create access token from API credentials
const token = await new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET).toJwt()

// set up room
const room = new Room();
await room.connect(process.env.LIVEKIT_URL, token, { autoSubscribe: true, dynacast: true });
console.log('connected to room', room);

// set up audio track
const source = new AudioSource(16000, 1);
const track = LocalAudioTrack.createAudioTrack('audio', source);
const options = new TrackPublishOptions();
options.source = TrackSource.SOURCE_MICROPHONE;

// read file into Uint16Array
const sample = readFileSync(join(import.meta.dirname, '../speex.wav'));
var buffer = new Uint16Array(sample.buffer);

await room.localParticipant.publishTrack(track, options);
await source.captureFrame(new AudioFrame(buffer, 16000, 1, buffer.byteLength / 2))
