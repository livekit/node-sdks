---
'livekit-server-sdk': patch
---

Fix `AccessToken.toJwt()` throwing on its second call when the token has `canPublishSources`. Converting the grants to JWT claims no longer replaces the token's `TrackSource` values with strings.
