---
'@livekit/rtc-node': patch
---

Deduplicate getSid() listeners to prevent event listener leak on concurrent calls
