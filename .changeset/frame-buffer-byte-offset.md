---
'@livekit/rtc-node': patch
---

Fix `AudioFrame` and `VideoFrame` passing native code the start of the backing `ArrayBuffer` instead of their own data when `data` is a view at a non-zero `byteOffset` (e.g. from `subarray()` or a pooled `Buffer`). This affected `AudioResampler`, `AudioSource.captureFrame`, `VideoSource.captureFrame` and `VideoFrame.convert`/`getPlane` (#679).
