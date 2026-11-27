---
'@livekit/rtc-node': patch
---

Stop capturing native logs: nothing consumed them, and every record down to trace level (including a libwebrtc dump of each data channel packet) was decoded and dispatched to every room. RUST_LOG now controls the native logs again.
