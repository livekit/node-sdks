---
'@livekit/rtc-node': patch
---

Audio stream events and capture callbacks go straight to the stream or waiter they belong to instead of to every FFI listener, and rooms skip events that are neither room events nor RPC invocations before taking their event lock. Dispatch cost no longer grows with the number of audio streams and rooms in the process.
