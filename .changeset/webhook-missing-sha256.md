---
'livekit-server-sdk': patch
---

`WebhookReceiver.receive` reports a token without a `sha256` claim as "sha256 was not found in the token" instead of "sha256 checksum of body does not match", as the Python server SDK does.
