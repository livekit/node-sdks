# Data Tracks Example

This example demonstrates how to publish and subscribe to [data tracks](https://docs.livekit.io/transport/data/data-tracks/) in LiveKit. It consists of two scripts:

- **publisher** — Connects to a room, publishes a data track, and pushes frames at a regular interval.
- **subscriber** — Connects to a room, listens for published data tracks, subscribes, and logs received frames.

## Prerequisites

Before running this example, make sure you have:

1. Node.js installed on your machine.
2. A LiveKit server running (either locally or remotely).
3. LiveKit API key and secret.

## Setup

1. Install dependencies:

   ```
   pnpm install
   ```

2. Create a `.env.local` file in the example directory with your LiveKit credentials:

   ```
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   LIVEKIT_URL=your_livekit_url
   ```

## Running the Example

Start the subscriber in one terminal:

```
pnpm run subscriber
```

Then start the publisher in another terminal:

```
pnpm run publisher
```

The subscriber will log received frames and their latency to the terminal.
