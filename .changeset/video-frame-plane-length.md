---
'@livekit/rtc-node': patch
---

Fix the buffer length of NV12 and I420A video frames received from native code. The chroma planes were sized by the chroma width instead of the chroma height, so non-square frames copied too many or too few bytes.
