# RPC Example

This example demonstrates how to use RPC between two participants with LiveKit.

The example includes two scenarios:
1. A simple greeting exchange.
2. A contrived function-calling service with JSON data payloads and multiple method types.

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

To run the example, use the following command:

```
pnpm run start
```

The example will log to your terminal.
