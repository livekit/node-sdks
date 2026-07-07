---
'livekit-server-sdk': minor
---

Add `SipCallError`, a `TwirpError` subclass thrown by `SipClient.createSipParticipant` / `transferSipParticipant` when a call fails with a SIP status. It exposes the SIP response code and reason as `sipStatusCode` / `sipStatus` getters, while other error metadata remains available via `metadata`.
