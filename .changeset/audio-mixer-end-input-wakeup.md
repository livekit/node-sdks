---
'@livekit/rtc-node': patch
---

`AudioMixer.endInput()` now ends iteration when no streams are left. Before, a consumer already waiting for a frame stayed blocked forever if `endInput()` was called after the last stream was removed (or before any was added).
