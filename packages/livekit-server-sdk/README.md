<!--
SPDX-FileCopyrightText: 2024 LiveKit, Inc.

SPDX-License-Identifier: Apache-2.0
-->

# LiveKit Server API for JS

Use this SDK to manage <a href="https://livekit.io/">LiveKit</a> rooms and create access tokens from your JavaScript/Node.js backend.

> [!NOTE]
> This is v2 of the server-sdk-js which runs in NodeJS, Deno and Bun!
> (It theoretically now also runs in every major browser, but that's not recommended due to the security risks involved with exposing your API secrets)
> Read the [migration section](#migrate-from-v1x-to-v2x) below for a detailed overview on what has changed.

## Installation

### Pnpm

```
pnpm add livekit-server-sdk
```

### Yarn

```
yarn add livekit-server-sdk
```

### NPM

```
npm install livekit-server-sdk --save
```

## Usage

### Environment Variables

You may store credentials in environment variables. If api-key or api-secret is not passed in when creating a `RoomServiceClient` or `AccessToken`, the values in the following env vars will be used:

- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

`LiveKitAPI` additionally falls back to `LIVEKIT_URL` for the host and `LIVEKIT_TOKEN` for a pre-signed token. Values you pass explicitly take precedence; the environment variables are used only as a fallback for arguments you omit — an ambient `LIVEKIT_TOKEN`, for example, won't override an explicitly-provided API key and secret.

### Creating Access Tokens

Creating a token for participant to join a room.

```typescript
import { AccessToken } from 'livekit-server-sdk';

// if this room doesn't exist, it'll be automatically created when the first
// client joins
const roomName = 'name-of-room';
// identifier to be used for participant.
// it's available as LocalParticipant.identity with livekit-client SDK
const participantName = 'user-name';

const at = new AccessToken('api-key', 'secret-key', {
  identity: participantName,
});
at.addGrant({ roomJoin: true, room: roomName });

const token = await at.toJwt();
console.log('access token', token);
```

By default, the token expires after 6 hours. you may override this by passing in `ttl` in the access token options. `ttl` is expressed in seconds (as number) or a string describing a time span [vercel/ms](https://github.com/vercel/ms). eg: '2 days', '10h'.

### Permissions in Access Tokens

It's possible to customize the permissions of each participant:

```typescript
const at = new AccessToken('api-key', 'secret-key', {
  identity: participantName,
});

at.addGrant({
  roomJoin: true,
  room: roomName,
  canPublish: false,
  canSubscribe: true,
});
```

This will allow the participant to subscribe to tracks, but not publish their own to the room.

### Authentication

Every request to the server APIs is authenticated. `LiveKitAPI` (and each service client) supports two modes:

- **API key & secret** — recommended for backend use. The SDK signs a short-lived token per request from your key and secret. Keep your API secret on the server; never ship it to a client.
- **Access token** — for frontend / client-side use, where the API secret must not be exposed. Pass a pre-signed [access token](https://docs.livekit.io/frontends/reference/tokens-grants/) that already carries the grants for the operations you'll perform; the SDK sends it verbatim. Mint it on your backend and hand it to the client.

```typescript
import { LiveKitAPI } from 'livekit-server-sdk';

// Backend (API key & secret): set LIVEKIT_URL, LIVEKIT_API_KEY, and
// LIVEKIT_API_SECRET as env vars, then construct with no arguments:
const api = new LiveKitAPI();

// ...or pass any of them explicitly to override the corresponding env var:
const api = new LiveKitAPI({ host: 'https://my.livekit.host', apiKey: 'api-key', secret: 'secret-key' });

// Frontend (pre-signed access token): with LIVEKIT_URL set, pass just the token
// (or override the host too). Its grants must cover the calls you make.
const api = new LiveKitAPI({ token });
```

### Managing Rooms

`LiveKitAPI` is a single entry point to every server API, exposing each service as a property: `room`, `egress`, `ingress`, `sip`, `agentDispatch`, and `connector`. Construct it with your credentials (see [Authentication](#authentication)).

`RoomServiceClient`, reached via `api.room`, gives you APIs to list, create, and delete rooms and to moderate their participants.

```typescript
import { LiveKitAPI } from 'livekit-server-sdk';

// authenticate with an API key and secret, or `{ token }` for a pre-signed token
const api = new LiveKitAPI({
  host: 'https://my.livekit.host',
  apiKey: 'api-key',
  secret: 'secret-key',
});

// list rooms
const rooms = await api.room.listRooms();
console.log('existing rooms', rooms);

// create a new room
const room = await api.room.createRoom({
  name: 'myroom',
  emptyTimeout: 10 * 60, // timeout in seconds
  maxParticipants: 20,
});
console.log('room created', room);

// delete a room
await api.room.deleteRoom('myroom');

// other services are reached the same way, e.g. api.egress, api.sip
await api.egress.listEgress({});
```

### Agent dispatch

[Agent dispatch](https://docs.livekit.io/agents/server/agent-dispatch/) assigns an agent to a room. Explicit dispatch, via `api.agentDispatch`, gives you full control over when and how agents join and lets you pass job-specific metadata. The target agent is selected by its `agentName`, and the room is created if it doesn't exist. The example below reuses the `api` from above.

```typescript
// dispatch an agent into a room
const dispatch = await api.agentDispatch.createDispatch('myroom', 'my-agent', {
  metadata: '{}',
});

// list dispatches in a room
const dispatches = await api.agentDispatch.listDispatch('myroom');

// delete a dispatch
await api.agentDispatch.deleteDispatch(dispatch.id, 'myroom');
```

### Error handling

A failed server API call throws a `ServerError`, which carries the error `code`, `message`, and any server-provided `metadata`. SIP dialing calls throw a `SipCallError` (a `ServerError` subclass) that also exposes the SIP response status:

```typescript
import { ServerError, SipCallError } from 'livekit-server-sdk';

try {
  await api.sip.createSipParticipant('trunk-id', '+15105550100', 'my-room', {
    waitUntilAnswered: true,
  });
} catch (e) {
  if (e instanceof SipCallError) {
    console.log(e.message); // e.g. "SIP call failed: 486 Busy Here (resource_exhausted)"
    if (e.sipStatusCode === 486) {
      // callee is busy
    }
  } else if (e instanceof ServerError) {
    console.log(e.code, e.message); // any other API error
  }
}
```

## Webhooks

The JS SDK also provides helper functions to decode and verify webhook callbacks. While verification is optional, it ensures the authenticity of the message. See [webhooks guide](https://docs.livekit.io/home/server/webhooks/) for details.

LiveKit POSTs to webhook endpoints with `Content-Type: application/webhook+json`. Please ensure your server is able to receive POST body with that MIME.

Check out [example projects](examples) for full examples of webhooks integration.

```typescript
import { WebhookReceiver } from 'livekit-server-sdk';

const receiver = new WebhookReceiver('apikey', 'apisecret');

// In order to use the validator, WebhookReceiver must have access to the raw POSTed string (instead of a parsed JSON object)
// if you are using express middleware, ensure that `express.raw` is used for the webhook endpoint
// app.use(express.raw({type: 'application/webhook+json'}));

app.post('/webhook-endpoint', async (req, res) => {
  // event is a WebhookEvent object
  const event = await receiver.receive(req.body, req.get('Authorization'));
});
```

## Migrate from v1.x to v2.x

### Token generation

Because the `jsonwebtoken` lib got replaced with `jose`, there are a couple of APIs that are now async, that weren't before:

```typescript
const at = new AccessToken('api-key', 'secret-key', {
  identity: participantName,
});
at.addGrant({ roomJoin: true, room: roomName });

// v1
// const token = at.toJWT();

// v2
const token = await at.toJwt();

// v1
// const grants = v.verify(token);

// v2
const grants = await v.verify(token);

app.post('/webhook-endpoint', async (req, res) => {
  // v1
  // const event = receiver.receive(req.body, req.get('Authorization'));

  // v2
  const event = await receiver.receive(req.body, req.get('Authorization'));
});
```

### Egress API

Egress request types have been updated from interfaces to classes in the latest version. Additionally, `oneof` fields now require an explicit `case` field to specify the value type.

For example, to create a RoomComposite Egress:

```typescript
// v1
// const fileOutput = {
//   fileType: EncodedFileType.MP4,
//   filepath: 'livekit-demo/room-composite-test.mp4',
//   s3: {
//     accessKey: 'aws-access-key',
//     secret: 'aws-access-secret',
//     region: 'aws-region',
//     bucket: 'my-bucket',
//   },
// };

// const info = await egressClient.startRoomCompositeEgress('my-room', {
//   file: fileOutput,
// });

// v2 - current
const fileOutput = new EncodedFileOutput({
  filepath: 'dz/davids-room-test.mp4',
  output: {
    case: 's3',
    value: new S3Upload({
      accessKey: 'aws-access-key',
      secret: 'aws-access-secret',
      bucket: 'my-bucket',
    }),
  },
});

const info = await egressClient.startRoomCompositeEgress('my-room', {
  file: fileOutput,
});
```
