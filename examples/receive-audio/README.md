# Receive audio example

This example demonstrates receiving the first audio track published in a room and receiving all audio frames until the track is unsubscribed.

To run the example:

- Copy .env.example to .env and fill in the values
- Run `pnpm install` in the root folder of this repo
- Run `tsx index.ts` in this folder
- From another client, join the room `test-room` and publish an audio track
