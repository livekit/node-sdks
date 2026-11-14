---
'@livekit/rtc-node': patch
---

Keep the audio of an `AudioMixer` input whose frame arrives after `streamTimeoutMs`, instead of dropping that frame and the ones queued behind it.
