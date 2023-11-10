# Using Webhooks with a Next.JS app

This example was generated using [create-next-app](https://nextjs.org/docs/api-reference/create-next-app).

We've made the following modifications to the generated project:

- `pnpm add livekit-server-sdk`
- [webhook.ts](pages/api/webhook.ts)
- added API key and secret to [next.config.js](next.config.js)

Follow these steps to see this demo in action:

- Ensure livekit-server has webhooks configured:

  ```
  webhook:
    urls:
      - http://localhost:3000/api/webhook
    api_key: <your-key>
  ```

- Start livekit-server locally
- Open next.config.js and fill in your API key and secret pair
- Run this example with `pnpm dev`
- Connect a client to livekit-server
- Observe the following in your Next.js app logs:

  ```
  received webhook event {
    event: 'participant_joined',
    ...
  }
  ```
