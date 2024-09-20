import { Room, RoomEvent } from '@livekit/rtc-node';
import { AccessToken } from 'livekit-server-sdk';
import { randomBytes } from 'crypto';
import { config } from 'dotenv';

// Load environment variables from .env.local file
config({ path: '.env.local', override: false });

// Check for required environment variables and assign them to constants
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
  throw new Error('Missing required environment variables. Please check your .env.local file.');
}

// Generate a random room name
const roomName = `room-${randomBytes(4).toString('hex')}`;

// Create access token from API credentials
const createToken = (identity: string) => {
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

// Define a type for the customization function
type ParticipantBodyFunc = (room: Room) => void;

// Function to connect a participant to the room with customization
const connectParticipant = async (participantId: string, body: ParticipantBodyFunc) => {
  const room = new Room();
  const token = await createToken(`participant-${participantId}`);
  
  room.on(RoomEvent.Disconnected, () => {
    console.log(`Participant ${participantId} disconnected from room`);
  });

  await room.connect(LIVEKIT_URL, token, {
    autoSubscribe: true,
    dynacast: true,
  });

  // Wait for the other participant to join the room
  await new Promise<void>((resolve) => {
    if (room.remoteParticipants.size > 0) {
      resolve();
    } else {
      const onParticipantConnected = () => {
        room.off(RoomEvent.ParticipantConnected, onParticipantConnected);
        resolve();
      };
      room.on(RoomEvent.ParticipantConnected, onParticipantConnected);
    }
  });

  body(room);

  return room;
};

// Customization for participant 1
const customizeParticipant1: ParticipantBodyFunc = (room) => {
  console.log('Hello from participant 1');


  // Add specific behavior for participant 1 here
};

// Customization for participant 2
const customizeParticipant2: ParticipantBodyFunc = (room) => {
  console.log('Hello from participant 2');
  // Add specific behavior for participant 2 here
};

// Main function to set up and connect participants
async function main() {
  try {
    console.log(`Connecting participants to room: ${roomName}`);

    const [room1, room2] = await Promise.all([
      connectParticipant('1', customizeParticipant1),
      connectParticipant('2', customizeParticipant2)
    ]);

    // Keep the rooms connected for a while
    console.log('Participants connected. Waiting for 60 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Disconnect
    console.log('Disconnecting participants...');
    await room1.disconnect();
    await room2.disconnect();

    console.log('Participants disconnected. Example completed.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Ensure we clean up resources and exit the process
    process.exit(0);
  }
}

main();
