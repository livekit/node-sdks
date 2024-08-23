# Receive audio example

This example demonstrates receiving the first audio track published in a room and receiving all audio frames until the track is unsubscribed.

To run the example:

- Copy .env.example to .env and fill in the values
- Run `npm install`
- Run `tsx index.ts`
- From another client, join the room `test-room` and publish an audio track
