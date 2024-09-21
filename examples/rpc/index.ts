import { RemoteParticipant, Room, RoomEvent, RpcRequest } from '@livekit/rtc-node';
import { RPC_ERROR_UNSUPPORTED_METHOD } from '@livekit/rtc-node/dist/rpc';
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

  console.log(`Connecting participants to room: ${roomName}`);

  const [requestersRoom, greetersRoom, mathGeniusRoom] = await Promise.all([
    connectParticipant('requester', roomName),
    connectParticipant('greeter', roomName),
    connectParticipant('math-genius', roomName),
  ]);

  // Register all methods for the receiving participant
  await registerReceiverMethods(greetersRoom, mathGeniusRoom);

  try {
    console.log('\n\nRunning greeting example...');
    await Promise.all([performGreeting(requestersRoom)]);
  } catch (error) {
    console.error('Error:', error);
  }

  try {
    console.log('\n\nRunning math example...');
    await Promise.all([
      performSquareRoot(requestersRoom)
        .then(() => new Promise<void>((resolve) => setTimeout(resolve, 2000)))
        .then(() => performQuantumHypergeometricSeries(requestersRoom)),
    ]);
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\n\nParticipants done, disconnecting...');
  await requestersRoom.disconnect();
  await greetersRoom.disconnect();
  await mathGeniusRoom.disconnect();

  console.log('Participants disconnected. Example completed.');

  process.exit(0);
}

const registerReceiverMethods = async (greetersRoom: Room, mathGeniusRoom: Room): Promise<void> => {
  greetersRoom.localParticipant?.registerRpcMethod(
    'arrival',
    async (request: RpcRequest, sender: RemoteParticipant) => {
      console.log(`[Greeter] Oh ${sender.identity} arrived and said "${request.payload}"`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return "Welcome and have a wonderful day!";
    },
  );

  mathGeniusRoom.localParticipant?.registerRpcMethod(
    'square-root',
    async (request: RpcRequest, sender: RemoteParticipant) => {
      const jsonData = JSON.parse(request.payload);
      const number = jsonData.number;
      console.log(
        `[Math Genius] I guess ${sender.identity} wants the square root of ${number}. I've only got ${request.responseTimeoutMs / 1000} seconds to respond but I think I can pull it off.`,
      );

      console.log(`[Math Genius] *doing math*…`);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = Math.sqrt(number);
      console.log(`[Math Genius] Aha! It's ${result}`);
      return JSON.stringify({ result });
    },
  );
};

const performGreeting = async (room: Room): Promise<void> => {
  console.log('[Requester] Letting the greeter know that I\'ve arrived');
  try {
    const response = await room.localParticipant!.performRpcRequest('greeter', 'arrival', 'Hello');
    console.log(`[Requester] That's nice, the greeter said: "${response}"`);
  } catch (error) {
    console.error('[Requester] RPC call failed:', error);
    throw error;
  }
};

const performSquareRoot = async (room: Room): Promise<void> => {
  console.log("[Requester] What's the square root of 16?");
  try {
    const response = await room.localParticipant!.performRpcRequest('math-genius', 'square-root', JSON.stringify({ number: 16 }));
    const parsedResponse = JSON.parse(response);
    console.log(`[Requester] Nice, the answer was ${parsedResponse.result}`);
  } catch (error) {
    console.error('[Requester] RPC call failed:', error);
    throw error;
  }
};
const performQuantumHypergeometricSeries = async (room: Room): Promise<void> => {
  console.log("[Requester] What's the quantum hypergeometric series of 42?");
  try {
    const response = await room.localParticipant!.performRpcRequest(
      'math-genius',
      'quantum-hypergeometric-series',
      JSON.stringify({ number: 42 })
    );
    const parsedResponse = JSON.parse(response);
    console.log(`[Requester] genius says ${parsedResponse.result}!`);
  } catch (error) {
    if (error instanceof Error && error.message === RPC_ERROR_UNSUPPORTED_METHOD) {
      console.log(`[Requester] Aww looks like the genius doesn't know that one.`);
    } else {
      console.error('[Requester] Unexpected error:', error);
      throw error;
    }
  }
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
    }),
  ]);

  return room;
};

main();
