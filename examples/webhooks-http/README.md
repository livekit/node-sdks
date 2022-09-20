# Using Webhooks with a Node.JS app

A simple example showing how LiveKit's Webhooks work.
Follow these steps to see this demo in action:

- Ensure livekit-server has webhooks configured:

  ```
  webhook:
    urls:
      - http://localhost:3000/
    api_key: <your-key>
  ```

- Start livekit-server locally
- Set environment variables LIVEKIT_API_KEY and LIVEKIT_API_SECRET with your API key and secret
- Run this example with `node webhook.js`
- Connect a client to livekit-server
- Observe the following in your Next.js app logs:

  ```
  received webhook event {
    event: 'participant_joined',
    ...
  }
  ```
