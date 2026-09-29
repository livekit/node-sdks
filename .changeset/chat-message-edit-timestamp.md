---
'@livekit/rtc-node': patch
---

Fix `ChatMessage.editTimestamp` being `NaN` instead of `undefined` for a message that was never edited.
