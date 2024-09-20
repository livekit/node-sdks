import { Room, RoomEvent, RemoteParticipant, RpcRequest } from '@livekit/rtc-node';
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
    const roomName = `rpc-test-${randomBytes(4).toString('hex')}`;

    try {
      console.log(`Connecting participants to room: ${roomName}`);
  
      const [room1, room2] = await Promise.all([
        connectParticipant('participant-1', roomName),
        connectParticipant('participant-2', roomName),
      ]);
  
      await Promise.all([
        participant1Body(room1),
        participant2Body(room2)
      ]);
  
      console.log('Participants done, disconnecting...');
      await room1.disconnect();
      await room2.disconnect();
  
      console.log('Participants disconnected. Example completed.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      process.exit(0);
    }
  }

const participant1Body = async (room: Room): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('sending rpc request to participant 2');
    room.localParticipant?.performRpcRequest(
      'participant-2',
      'greeting',
      JSON.stringify({ message: 'Hello from participant 1!' }),
    )
      .then((response) => {
        console.log('RPC response received:', response);
        resolve();
      })
      .catch((error) => {
        console.error('RPC call failed:', error);
        reject(error);
      });
  });
};

const participant2Body = (room: Room): Promise<void> => {
  return new Promise((resolve) => {
    const handleRpcRequest = (request: RpcRequest, sender: RemoteParticipant, sendAck: () => void, sendResponse: (response: string) => void) => {
      console.log('Acking RPC request from', sender.identity, ':');
      sendAck();
      console.log('working…');
      setTimeout(() => {
        const responseData = JSON.stringify({ message: 'Hello from participant 2!' });
        console.log('sending response to participant 1');
        sendResponse(responseData);
      }, 5000);
      resolve(); // Resolve the promise after handling the RPC request
    };

    room.on(RoomEvent.RpcRequestReceived, handleRpcRequest);
  });
};

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

  room.on(RoomEvent.Disconnected, () => {
    console.log(`Participant ${identity} disconnected from room`);
  });

  await room.connect(LIVEKIT_URL, token, {
    autoSubscribe: true,
    dynacast: true,
  });

  await Promise.race([
    new Promise<void>((resolve) => {
      if (room.remoteParticipants.size > 0) {
        resolve();
      } else {
        const onParticipantConnected = () => {
          room.off(RoomEvent.ParticipantConnected, onParticipantConnected);
          resolve();
        };
        room.on(RoomEvent.ParticipantConnected, onParticipantConnected);
      }
    }),
    new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Timed out waiting for participants')), 5000);
    })
  ]);

  return room;
};

main();
