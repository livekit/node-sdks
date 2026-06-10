import { WebhookReceiver } from 'livekit-server-sdk';

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

export async function POST(req: Request) {
  const body = await req.text();
  const event = await receiver.receive(body, req.headers.get('Authorization') ?? undefined);
  console.log('received webhook event', event);
  return new Response(null, { status: 200 });
}
