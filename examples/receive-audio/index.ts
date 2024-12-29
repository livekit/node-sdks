import { AudioStream, Room, RoomEvent, TrackKind } from '@livekit/rtc-node';
import type { AudioFrame } from '@livekit/rtc-node/src';
import { Buffer } from 'buffer';
import { config } from 'dotenv';
import * as fs from 'fs';
import { AccessToken } from 'livekit-server-sdk';

config();

// Constants for WAV file
const BITS_PER_SAMPLE = 16;
const WAV_FILE = 'output.wav';

function writeWavHeader(writer: fs.WriteStream, frame: AudioFrame) {
  const header = Buffer.alloc(44);
  const byteRate = (frame.sampleRate * frame.channels * BITS_PER_SAMPLE) / 8;
  const blockAlign = (frame.channels * BITS_PER_SAMPLE) / 8;

  writer = fs.createWriteStream(WAV_FILE);
  // Write the RIFF header
  header.write('RIFF', 0); // ChunkID
  header.writeUInt32LE(0, 4); // ChunkSize placeholder
  header.write('WAVE', 8); // Format

  // Write the fmt subchunk
  header.write('fmt ', 12); // Subchunk1ID
  header.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (PCM = 1)
  header.writeUInt16LE(frame.channels, 22); // NumChannels
  header.writeUInt32LE(frame.sampleRate, 24); // SampleRate
  header.writeUInt32LE(byteRate, 28); // ByteRate
  header.writeUInt16LE(blockAlign, 32); // BlockAlign
  header.writeUInt16LE(16, 34); // BitsPerSample

  // Write the data subchunk
  header.write('data', 36); // Subchunk2ID
  header.writeUInt32LE(0, 40); // Subchunk2Size placeholder

  // Write the header to the stream
  writer.write(header);
}

function updateWavHeader(path: string) {
  // Update the size of the audio data in the header
  const stats = fs.statSync(path);
  const fileSize = stats.size;

  const chunkSize = fileSize - 8;
  const subchunk2Size = fileSize - 44;
  const header = Buffer.alloc(8);
  header.writeUInt32LE(chunkSize, 0);
  header.writeUInt32LE(subchunk2Size, 4);

  // Reopen the file for updating the header
  const fd = fs.openSync(path, 'r+');
  fs.writeSync(fd, header, 0, 4, 4); // Update ChunkSize
  fs.writeSync(fd, header, 4, 4, 40); // Update Subchunk2Size
  fs.closeSync(fd);
}

// create access token from API credentials
const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
  identity: 'example-participant',
});
token.addGrant({
  room: 'test-room',
  roomJoin: true,
  roomCreate: true,
  canPublish: true,
  canPublishData: true,
});
const jwt = await token.toJwt();

// set up room
const room = new Room();

let trackToProcess: string | null = null;
let writer: fs.WriteStream | null = null;

room.on(RoomEvent.TrackSubscribed, async (track, publication, participant) => {
  console.log('subscribed to track', track.sid, publication, participant.identity);
  if (track.kind === TrackKind.KIND_AUDIO) {
    const stream = new AudioStream(track);
    trackToProcess = track.sid;

    for await (const frame of stream) {
      if (!trackToProcess) {
        return;
      }

      if (writer == null) {
        // create file on first frame
        // also guard when track is unsubscribed
        writer = fs.createWriteStream('output.wav');
        writeWavHeader(writer, frame);
      }

      if (writer) {
        const buf = Buffer.from(frame.data.buffer);
        writer.write(buf);
      }
    }
  }
});

const finishedPromise = new Promise<void>((resolve) => {
  room.on(RoomEvent.TrackUnsubscribed, (_, publication, participant) => {
    console.log('unsubscribed from track', publication.sid, participant.identity);
    if (publication.sid === trackToProcess) {
      trackToProcess = null;
      if (writer) {
        writer.close();
        // update header
        updateWavHeader(WAV_FILE);
      }
      resolve();
    }
  });
});

await room.connect(process.env.LIVEKIT_URL, jwt, { autoSubscribe: true, dynacast: true });
console.log('connected to room', room);

// stay in the room until publisher leaves
await finishedPromise;
