import { Room } from 'livekit-rtc-node'

let room = new Room();
room.connect("ws://localhost:7880", "my-token");

console.log("room", room);
