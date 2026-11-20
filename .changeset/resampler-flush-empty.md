---
'@livekit/rtc-node': patch
---

Return no frames from `AudioResampler.flush()` when nothing is buffered, instead of one empty frame.
