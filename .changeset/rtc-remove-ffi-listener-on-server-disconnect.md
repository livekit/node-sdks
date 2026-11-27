---
'@livekit/rtc-node': patch
---

Stop routing FFI events to a room once the server disconnects it. A room disconnected server-side (for example deleted with `RoomServiceClient.deleteRoom`) used to keep its FFI event listener for the life of the process.
