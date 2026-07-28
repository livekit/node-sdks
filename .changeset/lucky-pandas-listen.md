---
'@livekit/rtc-node': patch
---

Close audio streams when their track is unsubscribed. An unsubscribed track never receives `eos` from the FFI, so any `AudioStream` attached to it kept delivering frames — after a reconnect that meant the stale stream and the new subscription's stream both delivered the publisher's audio.
