---
'livekit-server-sdk': patch
---

Keep the base path of the server URL in API requests, so a server reached under a path (e.g. `https://example.com/livekit` behind a reverse proxy) is called at `https://example.com/livekit/twirp/...` instead of `https://example.com/twirp/...`, as the Go and Python server SDKs do. A URL that carries a path the server does not serve the API under should drop that path.
