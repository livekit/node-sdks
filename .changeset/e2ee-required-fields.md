---
'@livekit/rtc-node': patch
---

Fix E2EE requests that could not be encoded: `KeyProvider.setKey` now takes the key to install, and `FrameCryptor` keeps its track SID so `setEnabled` and `setKeyIndex` work
