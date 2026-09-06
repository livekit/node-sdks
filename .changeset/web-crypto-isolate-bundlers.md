---
'livekit-server-sdk': patch
---

Remove `node:crypto` fallbacks from Web Crypto helpers so isolate/edge bundlers can import the SDK.
