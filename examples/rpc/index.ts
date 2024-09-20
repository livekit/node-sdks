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
  
      console.log('\n\nRunning greeting example...');
      await Promise.all([
        participant1Greeting(room1),
        participant2Greeting(room2)
      ]);

      console.log('\n\nRunning math example...');
      await Promise.all([
        squareRoot(room1).then(() => {
          return new Promise(resolve => setTimeout(() => resolve(), 2000))
        }).then(() => quantumHypergeometricSeries(room1)),
        mathGenius(room2)
      ]);
  
      console.log('\n\nParticipants done, disconnecting...');
      await room1.disconnect();
      await room2.disconnect();
  
      console.log('Participants disconnected. Example completed.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      process.exit(0);
    }
  }

const participant1Greeting = async (room: Room): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('[Participant 1] Sending RPC request to participant 2');
    room.localParticipant?.performRpcRequest(
      'participant-2',
      'greeting',
      'Hello from participant 1!'
    )
      .then((response) => {
        console.log(`[Participant 1] I heard back: "${response}"`);
        resolve();
      })
      .catch((error) => {
        console.error('[Participant 1] RPC call failed:', error);
        reject(error);
      });
  });
};

const participant2Greeting = (room: Room): Promise<void> => {
  return new Promise((resolve) => {
    const handleRpcRequest = (request: RpcRequest, sender: RemoteParticipant, sendAck: () => void, sendResponse: (response: string) => void) => {
      console.log(`[Participant 2] Oh participant 1 says "${request.payload}"`);
      sendAck();
      setTimeout(() => {
        sendResponse('Hi nice to meet you, I\'m participant 2!');
        resolve();
      }, 2000);
    room.off(RoomEvent.RpcRequestReceived, handleRpcRequest);
    };

    room.on(RoomEvent.RpcRequestReceived, handleRpcRequest);
  });
};

const squareRoot = async (room: Room): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('[Math Novice] What\'s the square root of 16?');
    room.localParticipant?.performRpcRequest(
      'participant-2',
      'square-root',
      JSON.stringify({ number: 16 })
    )
      .then((response) => {
        const parsedResponse = JSON.parse(response);
        console.log(`[Math Novice] Nice, the answer was ${parsedResponse.result}`);
        resolve();
      })
      .catch((error) => {
        console.error('[Math Novice] RPC call failed:', error);
        reject(error);
      });
  });
};

const quantumHypergeometricSeries = async (room: Room): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('[Math Novice] What\'s the quantum hypergeometric series of 42?');
      room.localParticipant?.performRpcRequest(
        'participant-2',
        'quantum-hypergeometric-series',
        JSON.stringify({ number: 42 })
      )
        .then((response) => {
          const parsedResponse = JSON.parse(response);
          console.log(`[Math Novice] Nice, the answer was ${parsedResponse.result}`);
          resolve();
        })
        .catch((error) => {
        if (error.code == 1) {
            console.log(`[Math Novice] Aww I guess that was too hard. The genius said "${error.data}"`);
            resolve();
        } else {
          console.error('[Math Novice] Unexpected error:', error);
          reject(error);
        }
      });
    });
};

const mathGenius = (room: Room): Promise<void> => {
  return new Promise((resolve) => {
    const handleJsonRpcRequest = (request: RpcRequest, sender: RemoteParticipant, sendAck: () => void, sendResponse: (payload: string | null, errorCode?: number, errorData?: string) => void) => {
        if (request.method === 'square-root') {
            const jsonData = JSON.parse(request.payload);
            const number = jsonData.number;
            console.log(`[Math Genius] I guess participant 1 wants the square root of ${number}. I can do that but it will take a few seconds...`);
            sendAck();
            
            console.log(`[Math Genius] *doing math*…`);
            setTimeout(() => {
                try {
                    const result = Math.sqrt(number);
                    console.log(`[Math Genius] Aha! It's ${result}`);
                    sendResponse(JSON.stringify({ result }));
                    resolve();
                } catch (error) {
                    console.error('[Math Genius] Error processing JSON request:', error);
                    sendResponse(null, 1, 'error');
                    resolve();
                }
            }, 2000);
        } else {
            console.log(`[Math Genius] Oops, I don't know how to handle ${request.method}, I'd better decline.`);
            sendAck();
            sendResponse(null, 1, 'That math is too hard for me');
        }
    };

    room.on(RoomEvent.RpcRequestReceived, (request, sender, sendAck, sendResponse) => {
      handleJsonRpcRequest(request, sender, sendAck, sendResponse);
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
