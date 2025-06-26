<!--
SPDX-FileCopyrightText: 2024 LiveKit, Inc.

SPDX-License-Identifier: Apache-2.0
-->

# 📹🎙️Node.js realtime SDK for LiveKit

[![npm](https://img.shields.io/npm/v/%40livekit%2Frtc-node.svg)](https://npmjs.com/package/@livekit/rtc-node)
[![livekit-rtc CI](https://github.com/livekit/node-sdks/actions/workflows/rtc-node.yml/badge.svg?branch=main)](https://github.com/livekit/node-sdks/actions/workflows/rtc-node.yml)

Use this SDK to add realtime video, audio and data features to your Node app. By connecting to a self- or cloud-hosted <a href="https://livekit.io/">LiveKit</a> server, you can quickly build applications like interactive live streaming or video calls with just a few lines of code.


> This SDK is currently in Developer Preview mode and not ready for production use. There will be bugs and APIs may change during this period.
>
> We welcome and appreciate any feedback or contributions. You can create issues here or chat live with us in the #dev channel within the [LiveKit Community Slack](https://livekit.io/join-slack).

### Warning

Avoid running this with hot reloads (ex. [bun's hot reload](https://bun.sh/guides/http/hot)). This is known to cause issues with WebRTC connectivity.

## Using realtime SDK

### Connecting to a room

```typescript
import {
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  dispose,
} from '@livekit/rtc-node';

const room = new Room();
await room.connect(url, token, { autoSubscribe: true, dynacast: true });
console.log('connected to room', room);

// add event listeners
room
  .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
  .on(RoomEvent.Disconnected, handleDisconnected)
  .on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);

process.on('SIGINT', () => {
  await room.disconnect();
  await dispose();
});
```

### Publishing a track

```typescript
import {
  AudioFrame,
  AudioSource,
  LocalAudioTrack,
  TrackPublishOptions,
  TrackSource,
} from '@livekit/rtc-node';
import { readFileSync } from 'node:fs';

// set up audio track
const source = new AudioSource(16000, 1);
const track = LocalAudioTrack.createAudioTrack('audio', source);
const options = new TrackPublishOptions();
options.source = TrackSource.SOURCE_MICROPHONE;

// note: if converting from Uint8Array to Int16Array, *do not* use buffer.slice!
// it is marked unstable by Node and can cause undefined behaviour, such as massive chunks of
// noise being added to the end.
// it is recommended to use buffer.subarray instead.
const sample = readFileSync(pathToFile);
var buffer = new Int16Array(sample.buffer);

await room.localParticipant.publishTrack(track, options);
await source.captureFrame(new AudioFrame(buffer, 16000, 1, buffer.byteLength / 2));

// cleanup resources
await track.close();
```

### RPC

Perform your own predefined method calls from one participant to another. 

This feature is especially powerful when used with [Agents](https://docs.livekit.io/agents), for instance to forward LLM function calls to your client application.

#### Registering an RPC method

The participant who implements the method and will receive its calls must first register support:

```typescript
room.localParticipant?.registerRpcMethod(
   // method name - can be any string that makes sense for your application
  'greet',

  // method handler - will be called when the method is invoked by a RemoteParticipant
  async (data: RpcInvocationData) => {
    console.log(`Received greeting from ${data.callerIdentity}: ${data.payload}`);
    return `Hello, ${data.callerIdentity}!`;
  }
);
```

In addition to the payload, your handler will also receive `responseTimeout`, which informs you the maximum time available to return a response. If you are unable to respond in time, the call will result in an error on the caller's side.

#### Performing an RPC request

The caller may then initiate an RPC call like so:

```typescript
try {
  const response = await room.localParticipant!.performRpc({
    destinationIdentity: 'recipient-identity',
    method: 'greet',
    payload: 'Hello from RPC!',
  });
  console.log('RPC response:', response);
} catch (error) {
  console.error('RPC call failed:', error);
}
```

You may find it useful to adjust the `responseTimeout` parameter, which indicates the amount of time you will wait for a response. We recommend keeping this value as low as possible while still satisfying the constraints of your application.

#### Errors

LiveKit is a dynamic realtime environment and calls can fail for various reasons. 

You may throw errors of the type `RpcError` with a string `message` in an RPC method handler and they will be received on the caller's side with the message intact. Other errors will not be transmitted and will instead arrive to the caller as `1500` ("Application Error"). Other built-in errors are detailed in `RpcError`.

## Examples

- [`publish-wav`](https://github.com/livekit/node-sdks/tree/main/examples/publish-wav): connect to a room and publish a .wave file
- [`rpc`](https://github.com/livekit/node-sdks/tree/main/examples/rpc): simple back-and-forth RPC interaction


## Getting help / Contributing

Please join us on [Slack](https://livekit.io/join-slack) to get help from our devs & community. We welcome your contributions and details can be discussed there.
