import type { RemoteTrack } from '@livekit/rtc-node';
import { AudioStream, Room, RoomEvent, TrackKind } from '@livekit/rtc-node';
import { config } from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

config();

// create access token from API credentials
const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
  identity: 'example-participant',
});
token.addGrant({
  room: 'test-room',
  roomJoin: true,
  roomCreate: true,
  canPublish: true,
  canPublishData: true,
});
const jwt = await token.toJwt();

// set up room
const room = new Room();

let trackToProcess: RemoteTrack | null = null;

room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  console.log('subscribed to track', track.sid, publication, participant.identity);
  if (track.kind === TrackKind.KIND_AUDIO) {
    const stream = new AudioStream(track);
    trackToProcess = track;
    stream.on('frameReceived', (ev) => {
      // 48khz raw PCM audio
      // console.log('frame received', ev.frame);
    });
  }
});

const finishedPromise = new Promise<void>((resolve) => {
  room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
    console.log('unsubscribed from track', track.sid, publication, participant.identity);
    if (track === trackToProcess) {
      resolve();
    }
  });
});

await room.connect(process.env.LIVEKIT_URL, jwt, { autoSubscribe: true, dynacast: true });
console.log('connected to room', room);

// stay in the room until publisher leaves
await finishedPromise;
