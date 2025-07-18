import { Room } from '@livekit/rtc-node';
import { Hono } from 'hono';
import { AccessToken, WebhookReceiver } from 'livekit-server-sdk';

const livekitUrl = process.env.LIVEKIT_URL!;
const livekitApiKey = process.env.LIVEKIT_API_KEY!;
const livekitApiSecret = process.env.LIVEKIT_API_SECRET!;

const livekitReceiver = new WebhookReceiver(livekitApiKey, livekitApiSecret);
const connectToLivekitRoom = async ({ roomName }: { roomName: string }) => {
  const token = new AccessToken(livekitApiKey, livekitApiSecret, {
    identity: 'phonic-sts-websocket',
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
  });

  const jwt = await token.toJwt();
  console.log(`Created JWT for room ${roomName} \n\n`);
  const room = new Room();
  console.log(`Created Livekit room ${roomName} \n\n`);
  await room.connect(livekitUrl, jwt);
  console.log(`Connected to room ${roomName} \n\n`);

  return {
    data: room,
    error: null,
  };
};

const app = new Hono();

// Basic route
app.post('/v1/conversations/inbound_call', async (c) => {
  const bodyString = await c.req.text();
  const authHeader = c.req.header('Authorization');
  const event = await livekitReceiver.receive(bodyString, authHeader);

  console.log(`Received event: ${event.event}`);
  if (event.event !== 'room_started' || !event.room?.name.startsWith('call')) {
    // Not the event that we're interested. Just return success is true.
    console.log(`Not the event that we're interested. Just return success is true. \n\n`);
    return c.json({ success: true });
  }

  const roomName = event.room.name;
  const roomResult = await connectToLivekitRoom({ roomName });

  if (roomResult.error !== null) {
    console.log(`Failed to connect to room ${roomName}: ${roomResult.error} \n\n`);
    return c.json(roomResult.error, 500);
  }

  const room = roomResult.data;
  room.disconnect();

  console.log(`Disconnected from room ${roomName} \n\n`);

  return c.text('Received event ', 200);
});

console.log(`Listening on http://localhost:3510`);

Bun.serve({
  port: 3510,
  fetch: app.fetch,
});
