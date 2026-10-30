---
'livekit-server-sdk': patch
---

Add `addDestinations` to `EgressClient.updateStream` and export `StreamDestination`, so a stream started with `StreamOutput.destinations` or added to a running egress carries an id that egress reports back on `StreamInfo.id` (livekit/egress#1462). Update @livekit/protocol to 1.53.1.
