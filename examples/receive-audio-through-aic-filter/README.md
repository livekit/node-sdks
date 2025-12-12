# Receive audio example (through an ai-coustics noise cancellation filter)

This example demonstrates receiving the first audio track published in a room, passing it through an
[ai-coustics audio filter](https://ai-coustics.com/), and writing that audio data to a wav file.

To run the example:

- Copy .env.example to .env and fill in the values
- Run `pnpm install` in the root folder of this repo
- Run `tsx index.ts` in this folder
- From another client, join the room `test-room` and publish an audio track
