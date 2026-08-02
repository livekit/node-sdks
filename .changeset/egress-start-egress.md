---
'livekit-server-sdk': minor
---

Add `EgressClient.startEgress()`, a unified convenience method that calls the v2 `Egress.StartEgress` RPC with a `StartEgressRequest` (or a partial init object). The existing per-type start helpers are unchanged.
