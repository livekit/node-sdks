---
'@livekit/rtc-node': patch
---

Fix `Room.getSid()` hanging forever when the join response carries an empty room SID and the SID arrives before `getSid()` is called. The SID is now stored on the room info as soon as it is received, and a late SID delivered through a room update also resolves a pending `getSid()`.
