import { Room, RoomEvent } from '@livekit/rtc-node';
import { AccessToken } from 'livekit-server-sdk';
import { randomBytes } from 'crypto';
import { config } from 'dotenv';

// Load environment variables from .env.local file
config({ path: '.env.local', override: false });

// Generate a random room name
const roomName = `room-${randomBytes(4).toString('hex')}`;

// Create access token from API credentials
const createToken = (identity: string) => {
  const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
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

// Function to connect a participant to the room
const connectParticipant = async (participantId: string) => {
  const room = new Room();
  const token = await createToken(`participant-${participantId}`);

  room.on(RoomEvent.Connected, () => {
    console.log(`Participant ${participantId} connected to room: ${room.name}`);
  });

  room.on(RoomEvent.ParticipantConnected, (participant) => {
    console.log(`Participant ${participantId}: Another participant connected: ${participant.identity}`);
  });

  room.on(RoomEvent.Disconnected, () => {
    console.log(`Participant ${participantId} disconnected from room`);
  });

  await room.connect(process.env.LIVEKIT_URL, token, {
    autoSubscribe: true,
    dynacast: true,
  });

  return room;
};

// Main function to set up and connect participants
async function main() {
  try {
    console.log(`Connecting participants to room: ${roomName}`);

    const room1 = await connectParticipant('1');
    const room2 = await connectParticipant('2');

    // Keep the rooms connected for a while
    console.log('Participants connected. Waiting for 60 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Disconnect
    console.log('Disconnecting participants...');
    await room1.disconnect();
    await room2.disconnect();

    console.log('Participants disconnected. Example completed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
