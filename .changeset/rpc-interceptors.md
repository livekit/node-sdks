---
'@livekit/rtc-node': minor
---

Add `RpcInterceptor` support: `LocalParticipant.addRpcInterceptor()` wraps every RPC the participant performs or handles, for logging, tracing, or payload metadata. `RpcInvocationData` now carries the invoked `method`.
