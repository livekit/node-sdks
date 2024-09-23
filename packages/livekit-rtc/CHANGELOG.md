# @livekit/rtc-node

## 0.9.0

### Minor Changes

- make AudioStream use AsyncIterableIterator instead of typed EventEmitter - [#272](https://github.com/livekit/node-sdks/pull/272) ([@nbsp](https://github.com/nbsp))

### Patch Changes

- bump ffi to v0.10.2 - [#271](https://github.com/livekit/node-sdks/pull/271) ([@nbsp](https://github.com/nbsp))

## 0.8.1

### Patch Changes

- add waitForSubscription - [#268](https://github.com/livekit/node-sdks/pull/268) ([@bcherry](https://github.com/bcherry))

## 0.8.0

### Minor Changes

- publishTranscription - [#266](https://github.com/livekit/node-sdks/pull/266) ([@bcherry](https://github.com/bcherry))

### Patch Changes

- audiostream: add resampling options - [#266](https://github.com/livekit/node-sdks/pull/266) ([@bcherry](https://github.com/bcherry))

## 0.7.0

### Minor Changes

- bump(ffi): LocalTrackSubscribed, DisconnectReason - [#256](https://github.com/livekit/node-sdks/pull/256) ([@nbsp](https://github.com/nbsp))

## 0.6.2

### Patch Changes

- correctly calculate VideoFrame stride - [#253](https://github.com/livekit/node-sdks/pull/253) ([@nbsp](https://github.com/nbsp))

## 0.6.1

### Patch Changes

- Update rust SDKs - [#246](https://github.com/livekit/node-sdks/pull/246) ([@lukasIO](https://github.com/lukasIO))

- properly call SipDtmf FFI request - [#244](https://github.com/livekit/node-sdks/pull/244) ([@nbsp](https://github.com/nbsp))

## 0.6.0

### Minor Changes

- Update rust-sdk dependency to latest - [#239](https://github.com/livekit/node-sdks/pull/239) ([@lukasIO](https://github.com/lukasIO))

### Patch Changes

- Add publishDtmf method on local participant - [#239](https://github.com/livekit/node-sdks/pull/239) ([@lukasIO](https://github.com/lukasIO))

- doc: add warning about buffer.slice - [#232](https://github.com/livekit/node-sdks/pull/232) ([@nbsp](https://github.com/nbsp))

- Add support for setting and listening to participant attribute changes - [#239](https://github.com/livekit/node-sdks/pull/239) ([@lukasIO](https://github.com/lukasIO))

- Add enableQueue argument to AudioSource constructor - [#239](https://github.com/livekit/node-sdks/pull/239) ([@lukasIO](https://github.com/lukasIO))

## 0.5.1

### Patch Changes

- only remove onFfiEvent from Room conn - [`b48d8aca359407a4e1e85ec350597579e2bb504a`](https://github.com/livekit/node-sdks/commit/b48d8aca359407a4e1e85ec350597579e2bb504a) ([@nbsp](https://github.com/nbsp))

- livekit-rtc: remove FfiClient listener cap - [#225](https://github.com/livekit/node-sdks/pull/225) ([@nbsp](https://github.com/nbsp))

## 0.5.0

### Minor Changes

- livekit-rtc/audio_frame: Uint16Array -> Int16Array - [#218](https://github.com/livekit/node-sdks/pull/218) ([@nbsp](https://github.com/nbsp))

## 0.4.4

### Patch Changes

- Explicitly add native modules as optional dependencies - [#204](https://github.com/livekit/node-sdks/pull/204) ([@lukasIO](https://github.com/lukasIO))

## 0.4.3

### Patch Changes

- Fix naming of binary artifacts - [#202](https://github.com/livekit/node-sdks/pull/202) ([@lukasIO](https://github.com/lukasIO))

## 0.4.2

### Patch Changes

- ffi_client: wire up livekit_dispose - [#200](https://github.com/livekit/node-sdks/pull/200) ([@nbsp](https://github.com/nbsp))

## 0.4.1

### Patch Changes

- Re-hide dispose, allow ThreadsafeFunction to exit - [#187](https://github.com/livekit/node-sdks/pull/187) ([@nbsp](https://github.com/nbsp))

## 0.4.0

### Minor Changes

- Change callback signatures to be aligned with livekit-client (#14) - [#19](https://github.com/livekit/node-sdks/pull/19) ([@lukasIO](https://github.com/lukasIO))

- Remove all object and FfiClient listeners (#15) - [#19](https://github.com/livekit/node-sdks/pull/19) ([@lukasIO](https://github.com/lukasIO))

### Patch Changes

- Wire up livekit_dispose (#15) - [#19](https://github.com/livekit/node-sdks/pull/19) ([@lukasIO](https://github.com/lukasIO))
