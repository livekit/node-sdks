---
'@livekit/rtc-node': minor
---

Surface the `ParticipantActive` FFI event as `RoomEvent.ParticipantActive` and expose `Participant.state`.

A remote participant can only receive data messages once it reaches `ParticipantState.ACTIVE`;
until now JS had no way to observe that transition, so code waiting on `ParticipantConnected`
could send to a participant that was not yet reachable. This brings the Node SDK in line with the
Python SDK's `participant_active` event.

`Participant.state` also now reports `DISCONNECTED` once the participant is gone — both when it
departs individually and when the room itself disconnects, since a room-level disconnect is not
reported as each participant departing.
