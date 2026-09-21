---
'@livekit/rtc-node': patch
---

`performRpc` accepts `maxRoundTripLatency`, the time to wait for the destination to acknowledge the request before failing with `CONNECTION_TIMEOUT` (default 7s). `RpcCallInfo` carries it so interceptors can adjust it.
