---
'@livekit/rtc-node': patch
---

Fix `AudioMixer` dropping audio from a stream whose read times out. The mixer now keeps the pending read and awaits it again, instead of issuing a new `next()` and discarding the frame the first read later resolves with.
