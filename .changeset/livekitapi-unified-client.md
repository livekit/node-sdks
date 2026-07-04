---
'livekit-server-sdk': minor
---

Add `LiveKitAPI`, a unified entry point that exposes every server API through a property (`api.room`, `api.egress`, `api.ingress`, `api.sip`, `api.agentDispatch`, `api.connector`). It can be constructed with an API key and secret, or with a pre-signed token (no secret required, so it can run client-side), and falls back to the `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and `LIVEKIT_TOKEN` environment variables. Individual clients also accept a `token` via `ClientOptions`.
