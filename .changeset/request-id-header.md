---
'livekit-server-sdk': minor
---

Send an `X-Livekit-Request-Id` idempotency key on every server API request. The same id is replayed on each region failover attempt, so the server can identify and deduplicate a retried request.
