import { VideoStream, Room, RoomEvent, TrackKind } from '@livekit/rtc-node';
import { config } from 'dotenv';
import * as fs from 'fs';
import { AccessToken } from 'livekit-server-sdk';

config();

// create access token from API credentials
const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
  identity: 'node-agent',
});
token.addGrant({
  room: 'test-room',
  roomJoin: true,
  roomCreate: true,
  canPublish: true,
  canPublishData: true,
});

const token2 = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
  identity: 'laptop-camera',
});
token2.addGrant({
  room: 'test-room',
  roomJoin: true,
});
console.log('Please join the room by going to the following url:')
console.log('https://meet.livekit.io/custom?liveKitUrl='+process.env.LIVEKIT_URL+'&token='+await token2.toJwt());
const jwt = await token.toJwt();

// set up room
const room = new Room();

let trackToProcess: string | null = null;

room.on(RoomEvent.TrackSubscribed, async (track, publication, participant) => {
  if (track.kind === TrackKind.KIND_VIDEO) {
    trackToProcess = track.sid;
    const stream = new VideoStream(track);
    const [stream1, stream2] = stream.tee();
    let i = 0;
    for await (const frame of stream1) {
        i++;
        console.log('loop 1 timestamp', frame.timestampUs);
        if (i > 5) {
          console.log('breaking out of loop 1');
          break;
        }
    }
    console.log('finished loop 1');
    for await (const frame of stream2) {
      i++;
      console.log('loop 2 timestamp', frame.timestampUs);
      if (i > 10) {
        console.log('breaking out of loop 2');
        break;
      }
    }
    console.log('finished loop 2');
   }
});


// setInterval(() => {
//   const used = process.memoryUsage();
//   console.log('Memory usage');
//   console.log({
//     heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
//     heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
//     rss: Math.round(used.rss / 1024 / 1024) + 'MB',
//   });
// }, 3000);

await room.connect(process.env.LIVEKIT_URL, jwt, { autoSubscribe: true, dynacast: true });

// // Keep the process running indefinitely for monitoring
// await new Promise(() => {});


