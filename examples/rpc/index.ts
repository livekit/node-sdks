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
    room.localParticipant.performRpcRequest(
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
    room.localParticipant.registerRpcMethod('greeting', async (request: RpcRequest, sender: RemoteParticipant) => {
      console.log(`[Participant 2] Oh participant 1 says "${request.payload}"`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      resolve();
      return 'Hi nice to meet you, I\'m participant 2!';
    });
  });
};

const squareRoot = async (room: Room): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('[Math Novice] What\'s the square root of 16?');
    room.localParticipant.performRpcRequest(
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
      room.localParticipant.performRpcRequest(
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
    room.localParticipant.registerRpcMethod('square-root', async (request: RpcRequest, sender: RemoteParticipant) => {
      const jsonData = JSON.parse(request.payload);
      const number = jsonData.number;
      console.log(`[Math Genius] I guess participant 1 wants the square root of ${number}. I can do that but it will take a few seconds...`);
      
      console.log(`[Math Genius] *doing math*…`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = Math.sqrt(number);
      console.log(`[Math Genius] Aha! It's ${result}`);
      resolve();
      return JSON.stringify({ result });
    });

    room.localParticipant.registerRpcMethod('quantum-hypergeometric-series', async (request: RpcRequest, sender: RemoteParticipant) => {
      console.log(`[Math Genius] Oops, I don't know how to handle quantum-hypergeometric-series, I'd better decline.`);
      throw new Error('That math is too hard for me');
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

  room.on('disconnected', () => {
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
          room.off('participantConnected', onParticipantConnected);
          resolve();
        };
        room.on('participantConnected', onParticipantConnected);
      }
    }),
    new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Timed out waiting for participants')), 5000);
    })
  ]);

  return room;
};

main();
