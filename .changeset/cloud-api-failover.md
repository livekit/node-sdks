---
'livekit-server-sdk': patch
---

Retry LiveKit Cloud API (`cloud-api.livekit.io`) requests on transport errors instead of failing after a single attempt, add full jitter to the failover backoff, and retry a 503 only when it carries Retry-After, waiting the indicated delay.
