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

      // Add the second example
      console.log('\nStarting second example with JSON data...');
      await Promise.all([
        participant1JsonBody(room1),
        participant2JsonBody(room2)
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
    console.log('[Participant 1] Sending RPC request to participant 2');
    room.localParticipant?.performRpcRequest(
      'participant-2',
      'greeting',
      'Hello from participant 1!'
    )
      .then((response) => {
        console.log('[Participant 1] RPC response received:', response);
        resolve();
      })
      .catch((error) => {
        console.error('[Participant 1] RPC call failed:', error);
        reject(error);
      });
  });
};

const participant2Body = (room: Room): Promise<void> => {
  return new Promise((resolve) => {
    const handleRpcRequest = (request: RpcRequest, sender: RemoteParticipant, sendAck: () => void, sendResponse: (response: string) => void) => {
      console.log('[Participant 2] Received RPC request from', sender.identity, ':', request.data);
      sendAck();
      console.log('[Participant 2] Processing request...');
      setTimeout(() => {
        const response = 'Hello from participant 2!';
        console.log('[Participant 2] Sending response to participant 1');
        sendResponse(response);
        resolve();
      }, 2000);
    };

    room.on(RoomEvent.RpcRequestReceived, handleRpcRequest);
  });
};

const participant1JsonBody = async (room: Room): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('[Participant 1] Sending JSON RPC request to participant 2');
    const jsonData = {
      message: 'Hello from participant 1!',
      number: 42,
      nested: {
        value: 'Transform me!'
      }
    };
    room.localParticipant?.performRpcRequest(
      'participant-2',
      'json-greeting',
      JSON.stringify(jsonData)
    )
      .then((response) => {
        console.log('[Participant 1] JSON RPC response received:', response);
        const parsedResponse = JSON.parse(response);
        console.log('[Participant 1] Parsed response:', parsedResponse);
        resolve();
      })
      .catch((error) => {
        console.error('[Participant 1] JSON RPC call failed:', error);
        reject(error);
      });
  });
};

const participant2JsonBody = (room: Room): Promise<void> => {
  return new Promise((resolve) => {
    const handleJsonRpcRequest = (request: RpcRequest, sender: RemoteParticipant, sendAck: () => void, sendResponse: (response: string) => void) => {
      console.log('[Participant 2] Received JSON RPC request from', sender.identity);
      sendAck();
      console.log('[Participant 2] Processing JSON request...');
      
      try {
        const jsonData = JSON.parse(request.data);
        console.log('[Participant 2] Parsed request data:', jsonData);
        
        // Transform the nested.value
        const transformedValue = jsonData.nested.value.toUpperCase();
        
        const response = {
          originalMessage: jsonData.message,
          transformedValue: transformedValue,
          numberSquared: jsonData.number * jsonData.number
        };
        
        console.log('[Participant 2] Sending JSON response to participant 1');
        sendResponse(JSON.stringify(response));
        resolve();
      } catch (error) {
        console.error('[Participant 2] Error processing JSON request:', error);
        sendResponse(JSON.stringify({ error: 'Failed to process JSON request' }));
        resolve();
      }
    };

    room.on(RoomEvent.RpcRequestReceived, (request, sender, sendAck, sendResponse) => {
      if (request.method === 'json-greeting') {
        handleJsonRpcRequest(request, sender, sendAck, sendResponse);
      }
    });
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
    console.log(`[${identity}] Disconnected from room`);
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
