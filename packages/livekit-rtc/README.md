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
```

### RPC

LiveKit now supports RPC, allowing participants to call methods on other participants in the room. This feature is especially useful in combination with [Agents](https://docs.livekit.io/agents).

#### Registering an RPC method

To make a method available for remote calls, you need to register it (on the participant who will receive the call):

```typescript
room.localParticipant?.registerRpcMethod(
  'greet',
  async (request: RpcRequest, sender: RemoteParticipant) => {
    console.log(`Received greeting from ${sender.identity}: ${request.payload}`);
    return `Hello, ${sender.identity}!`;
  }
);
```

#### Performing an RPC request

To call a method on a remote participant:

```typescript
try {
  const response = await room.localParticipant!.performRpcRequest(
    'recipient-identity',
    'greet',
    'Hello from RPC!'
  );
  console.log('RPC response:', response);
} catch (error) {
  console.error('RPC call failed:', error);
}
```

#### Error Handling

LiveKit is a dynamic realtime environment and calls can fail for various reasons:

The recipient doesn't support the requested method (RPC_ERROR_UNSUPPORTED_METHOD)
The call times out waiting for an acknowledgment (RPC_ERROR_ACK_TIMEOUT)
The call times out waiting for a response (RPC_ERROR_RESPONSE_TIMEOUT)

In addition, you may throw errors in your method handler to return an error back to the caller.

## Examples

- [`publish-wav`](https://github.com/livekit/node-sdks/tree/main/examples/publish-wav): connect to a room and publish a wave file


## Getting help / Contributing

Please join us on [Slack](https://livekit.io/join-slack) to get help from our devs/community. We welcome your contributions and details can be discussed there.
