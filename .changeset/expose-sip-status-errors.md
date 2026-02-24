---
"livekit-server-sdk": patch
---

Expose SIP status codes in TwirpError for transfer and participant creation failures. This allows developers to handle SIP-level failures (busy, no-answer, rejected) when the error metadata contains sip_status or sip_status_code.
