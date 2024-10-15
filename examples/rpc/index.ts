import { Room } from '@livekit/rtc-node';
import { randomBytes } from 'crypto';
import { config } from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

config({ path: '.env.local', override: false });
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
  throw new Error('Missing required environment variables. Please check your .env.local file.');
}

async function main() {
  const roomName = `data-test-${randomBytes(4).toString('hex')}`;

  console.log(`Connecting participants to room: ${roomName}`);

  const [senderRoom, receiverRoom] = await Promise.all([
    connectParticipant('sender', roomName),
    connectParticipant('receiver', roomName),
  ]);

  // Generate 256KB of random data in 32KB chunks
  const totalSize = 256 * 1024;
  const chunkSize = 32 * 1024;
  const numChunks = totalSize / chunkSize;
  const data = new Uint8Array(totalSize);

  for (let i = 0; i < numChunks; i++) {
    const chunk = new Uint8Array(chunkSize);
    crypto.getRandomValues(chunk);
    data.set(chunk, i * chunkSize);
  }

  // Set up receiver to log received data
  let totalReceivedBytes = 0;
  const dataReceivedPromise = new Promise<void>((resolve) => {
    receiverRoom.on('dataReceived', (payload: Uint8Array, topic?: string) => {
      totalReceivedBytes += payload.byteLength;
      console.log(`[Receiver] Received data:`);
      console.log(`  Size: ${payload.byteLength} bytes`);
      console.log(`  Total received: ${totalReceivedBytes} bytes`);
      console.log(`  First 10 bytes: ${Array.from(payload.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
      console.log(`  Last 10 bytes: ${Array.from(payload.slice(-10)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
      if (topic) {
        console.log(`  Topic: ${topic}`);
      }
      if (totalReceivedBytes >= totalSize) {
        resolve();
      }
    });
  });

  // Send data
  console.log('[Sender] Sending 256KB of data...');
  await senderRoom.localParticipant.publishData(data, { reliable: true });
  console.log('[Sender] Data sent');

  // Wait for all data to be received
  console.log('Waiting for all data to be received...');
  await dataReceivedPromise;
  console.log('All data received.');

  console.log('\nDisconnecting participants...');
  await senderRoom.disconnect();
  await receiverRoom.disconnect();

  console.log('Participants disconnected. Example completed.');

  process.exit(0);
}

const createToken = (identity: string, roomName: string) => {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });
  return token.toJwt();
};

const connectParticipant = async (identity: string, roomName: string): Promise<Room> => {
  const room = new Room();
  const token = await createToken(identity, roomName);

  room.on('disconnected', () => {
    console.log(`[${identity}] Disconnected from room`);
  });

  await room.connect(LIVEKIT_URL, token);

  await Promise.race([
    new Promise<void>((resolve) => {
      if (room.remoteParticipants.size > 0) {
        resolve();
      } else {
        const onParticipantConnected = () => {
          room.off('participantConnected', onParticipantConnected);
          resolve();
        };
        room.on('participantConnected', onParticipantConnected);
      }
    }),
    new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Timed out waiting for participants')), 5000);
    }),
  ]);

  return room;
};

main();
