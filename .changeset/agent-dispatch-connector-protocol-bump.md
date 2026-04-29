---
'livekit-server-sdk': patch
---

Bump `@livekit/protocol` to `1.45.6` and surface new fields on the agent dispatch and connector clients:

- `AgentDispatchClient.createDispatch`: new `restartPolicy` option (cloud only)
- `ConnectorClient.dialWhatsAppCall` / `acceptWhatsAppCall`: new `ringingTimeout` option (and `waitUntilAnswered` on accept)
- `ConnectorClient.disconnectWhatsAppCall`: new optional `disconnectReason` parameter
- Re-export `JobRestartPolicy` and `DisconnectWhatsAppCallRequest_DisconnectReason`
