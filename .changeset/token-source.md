---
'livekit-server-sdk': minor
---

Add a `tokenSource` client option, which gets the token for each call from the grants the call needs, in place of signing it with an API key and secret. Add `AccessToken.toClaimsJson()`, which returns the claims as JSON without signing them; an `AccessToken` now needs an API key and secret only to sign.
