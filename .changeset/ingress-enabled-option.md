---
'livekit-server-sdk': patch
---

Add `enabled` option to `createIngress` and `updateIngress`. Setting `enabled: false` lets you disable an ingress session (reject new connection attempts) without deleting it, so the stream key is preserved. The field already exists on the protobuf `CreateIngressRequest`/`UpdateIngressRequest`; this exposes it through the typed `CreateIngressOptions`/`UpdateIngressOptions`.
