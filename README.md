<!--BEGIN_BANNER_IMAGE-->
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/.github/banner_dark.png">
    <source media="(prefers-color-scheme: light)" srcset="/.github/banner_light.png">
    <img style="width:100%;" alt="The LiveKit icon, the name of the repository and some sample code in the background." src="/.github/banner_light.png">
  </picture>
  <!--END_BANNER_IMAGE-->

# LiveKit Server API for JS

<!--BEGIN_DESCRIPTION-->Use this SDK to manage <a href="https://livekit.io/">LiveKit</a> rooms and create access tokens from your JavaScript/Node.js backend.<!--END_DESCRIPTION-->

> [!NOTE]
> This is v2 of the server-sdk-js which runs in NodeJS, Deno and Bun!
> (It theoretically now also runs in every major browser, but that's not recommended due to the security risks involved with exposing your API secrets)
> Read the section below for a detailed overview on what has changed.

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

### Managing Rooms

`RoomServiceClient` gives you APIs to list, create, and delete rooms. It also requires a pair of api key/secret key to operate.

```typescript
import { RoomServiceClient, Room } from 'livekit-server-sdk';
const livekitHost = 'https://my.livekit.host';
const svc = new RoomServiceClient(livekitHost, 'api-key', 'secret-key');

// list rooms
svc.listRooms().then((rooms: Room[]) => {
  console.log('existing rooms', rooms);
});

// create a new room
const opts = {
  name: 'myroom',
  // timeout in seconds
  emptyTimeout: 10 * 60,
  maxParticipants: 20,
};
svc.createRoom(opts).then((room: Room) => {
  console.log('room created', room);
});

// delete a room
svc.deleteRoom('myroom').then(() => {
  console.log('room deleted');
});
```

## Webhooks

The JS SDK also provides helper functions to decode and verify webhook callbacks. While verification is optional, it ensures the authenticity of the message. See [webhooks guide](https://docs.livekit.io/guides/webhooks) for details.

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

<!--BEGIN_REPO_NAV-->

<br/><table>

<thead><tr><th colspan="2">LiveKit Ecosystem</th></tr></thead>
<tbody>
<tr><td>Client SDKs</td><td><a href="https://github.com/livekit/components-js">Components</a> · <a href="https://github.com/livekit/client-sdk-js">JavaScript</a> · <a href="https://github.com/livekit/client-sdk-swift">iOS/macOS</a> · <a href="https://github.com/livekit/client-sdk-android">Android</a> · <a href="https://github.com/livekit/client-sdk-flutter">Flutter</a> · <a href="https://github.com/livekit/client-sdk-react-native">React Native</a> · <a href="https://github.com/livekit/client-sdk-rust">Rust</a> · <a href="https://github.com/livekit/client-sdk-python">Python</a> · <a href="https://github.com/livekit/client-sdk-unity-web">Unity (web)</a> · <a href="https://github.com/livekit/client-sdk-unity">Unity (beta)</a></td></tr><tr></tr>
<tr><td>Server SDKs</td><td><b>Node.js</b> · <a href="https://github.com/livekit/server-sdk-go">Golang</a> · <a href="https://github.com/livekit/server-sdk-ruby">Ruby</a> · <a href="https://github.com/livekit/server-sdk-kotlin">Java/Kotlin</a> · <a href="https://github.com/agence104/livekit-server-sdk-php">PHP (community)</a> · <a href="https://github.com/tradablebits/livekit-server-sdk-python">Python (community)</a></td></tr><tr></tr>
<tr><td>Services</td><td><a href="https://github.com/livekit/livekit">Livekit server</a> · <a href="https://github.com/livekit/egress">Egress</a> · <a href="https://github.com/livekit/ingress">Ingress</a></td></tr><tr></tr>
<tr><td>Resources</td><td><a href="https://docs.livekit.io">Docs</a> · <a href="https://github.com/livekit-examples">Example apps</a> · <a href="https://livekit.io/cloud">Cloud</a> · <a href="https://docs.livekit.io/oss/deployment">Self-hosting</a> · <a href="https://github.com/livekit/livekit-cli">CLI</a></td></tr>
</tbody>
</table>
<!--END_REPO_NAV-->
