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

// read file into Uint16Array
const sample = readFileSync(pathToFile);
var buffer = new Uint16Array(sample.buffer);

await room.localParticipant.publishTrack(track, options);
await source.captureFrame(new AudioFrame(buffer, 16000, 1, buffer.byteLength / 2));
```

## Examples

- [`publish-wav`](https://github.com/livekit/node-sdks/tree/main/examples/publish-wav): connect to a room and publish a wave file

## Getting help / Contributing

Please join us on [Slack](https://livekit.io/join-slack) to get help from our devs/community. We welcome your contributions and details can be discussed there.
