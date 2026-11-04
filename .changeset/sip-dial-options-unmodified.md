---
'livekit-server-sdk': patch
---

Stop `createSipParticipant` and `transferSipParticipant` from writing `ringingTimeout` and `timeout` into the options object passed in. Frozen options no longer throw.
