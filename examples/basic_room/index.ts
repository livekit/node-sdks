import { Room } from '@livekit/rtc-node';

const room = new Room();
room.connect('ws://localhost:7880', 'my-token');

console.log('room', room);
