---
'@livekit/rtc-node': patch
---

Add `LocalParticipant.sendBytes` to send an in-memory buffer as a complete byte stream in one call, letting short payloads be inlined and larger ones compressed.
