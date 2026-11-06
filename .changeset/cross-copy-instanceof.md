---
'@livekit/rtc-node': patch
---

Make `instanceof` work across a dual-loaded copy of the package for the plain data classes `AudioFrame`, `VideoFrame`, `RpcError` and `ConnectError`. When a process reaches this package through both `import` (`dist/index.js`) and `require` (`dist/index.cjs`) — which happens whenever a dependency uses `createRequire` — those are two separate module graphs with two separate class objects, so `frame instanceof AudioFrame` used to be `false` for a frame built by the other copy. These classes now brand their prototype with a `Symbol.for()` key from the global symbol registry and match on the brand. Classes that own an FFI handle (`Room`, `AudioStream`, `AudioSource`, participants, tracks, ...) are deliberately left on prototype identity.
