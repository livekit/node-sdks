# Using Webhooks with a Next.js app

This example shows how to receive [LiveKit webhooks](https://docs.livekit.io/home/server/webhooks/)
in a Next.js (App Router) application using `livekit-server-sdk`.

The webhook handler lives in [app/api/webhook/route.ts](app/api/webhook/route.ts) and reads your
API key and secret from environment variables.

Follow these steps to see this demo in action:

- Ensure livekit-server has webhooks configured:

  ```
  webhook:
    urls:
      - http://localhost:3000/api/webhook
    api_key: <your-key>
  ```

- Start livekit-server locally
- Provide your API key and secret, e.g. in a `.env.local` file:

  ```
  LIVEKIT_API_KEY=your-api-key
  LIVEKIT_API_SECRET=your-api-secret
  ```

- Run this example with `pnpm dev`
- Connect a client to livekit-server
- Observe the following in your Next.js app logs:

  ```
  received webhook event {
    event: 'participant_joined',
    ...
  }
  ```
