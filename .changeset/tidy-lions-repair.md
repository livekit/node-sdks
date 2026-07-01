---
'@livekit/rtc-node': patch
---

Fix AudioSource.waitForPlayout resolving immediately with audio still queued. The internal playout promise could be left resolved ("latched") by the drain timer firing during a gap between captures, or by clearQueue()/pause; a later waitForPlayout() then consumed the stale resolution and reported playout complete ~queueSizeMs early, clipping the tail of agent speech on every turn in downstream consumers.
