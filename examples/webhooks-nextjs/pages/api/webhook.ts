// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebhookReceiver } from 'livekit-server-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

const receiver = new WebhookReceiver(
  serverRuntimeConfig.livekitApiKey,
  serverRuntimeConfig.livekitApiSecret,
);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = receiver.receive(req.body as string, req.headers.authorization);
  console.log('received webhook event', event);
  res.status(200).end();
}
