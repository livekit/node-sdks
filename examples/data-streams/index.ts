import {
  type ByteStreamReader,
  type RemoteParticipant,
  Room,
  RoomEvent,
  type TextStreamReader,
} from '@livekit/rtc-node';
import { config } from 'dotenv';
import fs from 'fs';
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
    topic: 'chat',
  });

  for (const c of greeting) {
    await streamWriter?.write(c);
  }

  streamWriter?.close();
};

const sendFile = async (room: Room, recipient: RemoteParticipant) => {
  console.log('sending file');
  await room.localParticipant?.sendFile('./assets/maybemexico.jpg', {
    destinationIdentities: [recipient.identity],
    name: 'mex.jpg',
    topic: 'files',
    mimeType: 'image/jpg',
  });
  console.log('done sending file');
};

const main = async () => {
  const roomName = `dev`;
  const identity = 'tester';
  const token = await createToken(identity, roomName);

  const room = new Room();

  const finishedPromise = new Promise((resolve) => {
    room.on(RoomEvent.ParticipantDisconnected, resolve);
  });

  room.registerTextStreamHandler('chat', async (reader: TextStreamReader, { identity }) => {
    console.log(`chat message from ${identity}: ${await reader.readAll()}`);
    // for await (const { collected } of reader) {
    //   console.log(collected);
    // }
  });

  room.registerByteStreamHandler('files', async (reader: ByteStreamReader, { identity }) => {
    console.log(`welcome image received from ${identity}: ${reader.info.name}`);

    // create write stream and write received file to disk, make sure ./temp folder exists
    const writer = fs.createWriteStream(`./temp/${reader.info.name}`, {});

    for await (const chunk of reader) {
      writer.write(chunk);
    }
    writer.close();
  });

  room.on(RoomEvent.ParticipantConnected, async (participant) => {
    await sendFile(room, participant);
    await greetParticipant(room, participant);
  });

  await room.connect(LIVEKIT_URL, token);

  for (const [, p] of room.remoteParticipants) {
    await sendFile(room, p);
    await greetParticipant(room, p);
  }

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
