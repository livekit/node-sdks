# @livekit/rtc-node

## 0.13.24

### Patch Changes

- Add userdata constructor param to AudioFrame - [#594](https://github.com/livekit/node-sdks/pull/594) ([@1egoman](https://github.com/1egoman))

- Add RoomEvent.TokenRefreshed - [#605](https://github.com/livekit/node-sdks/pull/605) ([@lukasIO](https://github.com/lukasIO))

- Temporarily disable pino-pretty transport - [#604](https://github.com/livekit/node-sdks/pull/604) ([@lukasIO](https://github.com/lukasIO))

## 0.13.23

### Patch Changes

- Add frame processor support for audio streams - [#583](https://github.com/livekit/node-sdks/pull/583) ([@1egoman](https://github.com/1egoman))

- update rust ffi to 0.12.43 - [#589](https://github.com/livekit/node-sdks/pull/589) ([@davidzhao](https://github.com/davidzhao))

## 0.13.22

### Patch Changes

- Hold lock on all ffi events - [#579](https://github.com/livekit/node-sdks/pull/579) ([@lukasIO](https://github.com/lukasIO))

- fix disconnect - [#575](https://github.com/livekit/node-sdks/pull/575) ([@simllll](https://github.com/simllll))

- added AsyncQueue-based AudioMixer - [#567](https://github.com/livekit/node-sdks/pull/567) ([@simllll](https://github.com/simllll))

## 0.13.21

### Patch Changes

- Ensure FFI events are processed sequentially - [#547](https://github.com/livekit/node-sdks/pull/547) ([@lukasIO](https://github.com/lukasIO))

- Don't throw on failure to process events - [#569](https://github.com/livekit/node-sdks/pull/569) ([@lukasIO](https://github.com/lukasIO))

- Wait for disconnect response on disconnect - [#562](https://github.com/livekit/node-sdks/pull/562) ([@lukasIO](https://github.com/lukasIO))

- Bump ffi to v0.12.36 - [#551](https://github.com/livekit/node-sdks/pull/551) ([@lukasIO](https://github.com/lukasIO))

- Add support for data channel encryption - [#549](https://github.com/livekit/node-sdks/pull/549) ([@lukasIO](https://github.com/lukasIO))

## 0.13.20

### Patch Changes

- Fix clearQueue not setting queue size to 0 - [#542](https://github.com/livekit/node-sdks/pull/542) ([@matej-dataqueue](https://github.com/matej-dataqueue))

## 0.13.19

### Patch Changes

- add agent dispatch config to room create options - [#540](https://github.com/livekit/node-sdks/pull/540) ([@paulwe](https://github.com/paulwe))

- Fix negative queue size on captureFrame - [#539](https://github.com/livekit/node-sdks/pull/539) ([@matej-dataqueue](https://github.com/matej-dataqueue))

- add an environment varaible to log all room events - [#536](https://github.com/livekit/node-sdks/pull/536) ([@Shubhrakanti](https://github.com/Shubhrakanti))

## 0.13.18

### Patch Changes

- Bugfix: Queue FFI events from rust and always process them in order - [#508](https://github.com/livekit/node-sdks/pull/508) ([@Shubhrakanti](https://github.com/Shubhrakanti))

## 0.13.17

### Patch Changes

- add public getters to resamplers - [#505](https://github.com/livekit/node-sdks/pull/505) ([@Shubhrakanti](https://github.com/Shubhrakanti))

## 0.13.16

### Patch Changes

- Handle room updates, move participant - [#496](https://github.com/livekit/node-sdks/pull/496) ([@davidzhao](https://github.com/davidzhao))

- Fix memory leak of AudioSource - [#486](https://github.com/livekit/node-sdks/pull/486) ([@typester](https://github.com/typester))

## 0.13.15

### Patch Changes

- Bump '@types/node' pkg version and remove all explicit `ReadableStream` imports - [#487](https://github.com/livekit/node-sdks/pull/487) ([@toubatbrian](https://github.com/toubatbrian))

## 0.13.14

### Patch Changes

- update rust-sdk to rust-sdks/livekit-ffi@0.12.25 - [#481](https://github.com/livekit/node-sdks/pull/481) ([@typester](https://github.com/typester))

- fix issue with bun hot reload - [#479](https://github.com/livekit/node-sdks/pull/479) ([@theomonnom](https://github.com/theomonnom))

## 0.13.13

### Patch Changes

- add log on room connecting - [#474](https://github.com/livekit/node-sdks/pull/474) ([@Shubhrakanti](https://github.com/Shubhrakanti))

## 0.13.12

### Patch Changes

- Use node stream for AudioStream and VideoStream (#458) - [#471](https://github.com/livekit/node-sdks/pull/471) ([@Shubhrakanti](https://github.com/Shubhrakanti))

- bugfix: no more negative timeouts being set on AudioSource - [#467](https://github.com/livekit/node-sdks/pull/467) ([@Shubhrakanti](https://github.com/Shubhrakanti))

## 0.13.11

### Patch Changes

- Add AudioFilter plugin support - [#457](https://github.com/livekit/node-sdks/pull/457) ([@typester](https://github.com/typester))

## 0.13.10

### Patch Changes

- Fix memory leak with FFI Handle on VideoFrame creation - [#454](https://github.com/livekit/node-sdks/pull/454) ([@Shubhrakanti](https://github.com/Shubhrakanti))

## 0.13.9

### Patch Changes

- Allow sender identity to be passed in streamText method - [#447](https://github.com/livekit/node-sdks/pull/447) ([@lukasIO](https://github.com/lukasIO))

- Bugfix with memory leak in VideoStream and AudioStream - [#448](https://github.com/livekit/node-sdks/pull/448) ([@Shubhrakanti](https://github.com/Shubhrakanti))

## 0.13.8

### Patch Changes

- fix(rtc): error on closed source for video as well - [#437](https://github.com/livekit/node-sdks/pull/437) ([@nbsp](https://github.com/nbsp))

## 0.13.7

### Patch Changes

- error on closed source on captureFrame - [#435](https://github.com/livekit/node-sdks/pull/435) ([@nbsp](https://github.com/nbsp))

## 0.13.6

### Patch Changes

- fix: pass through correct disconnect reason - [#428](https://github.com/livekit/node-sdks/pull/428) ([@davidzhao](https://github.com/davidzhao))

## 0.13.5

### Patch Changes

- Add auto chunking for text streams - [#416](https://github.com/livekit/node-sdks/pull/416) ([@lukasIO](https://github.com/lukasIO))

- Fix utf8 split operation - [#420](https://github.com/livekit/node-sdks/pull/420) ([@lukasIO](https://github.com/lukasIO))

## 0.13.4

### Patch Changes

- Update FFI to 0.12.10 - [#409](https://github.com/livekit/node-sdks/pull/409) ([@bcherry](https://github.com/bcherry))

- Default stride in VideoFrame to 0 - [#403](https://github.com/livekit/node-sdks/pull/403) ([@lukasIO](https://github.com/lukasIO))

- Add data stream support - [#361](https://github.com/livekit/node-sdks/pull/361) ([@lukasIO](https://github.com/lukasIO))

## 0.13.3

### Patch Changes

- Fix RPC invocation and room sid update - [#391](https://github.com/livekit/node-sdks/pull/391) ([@lukasIO](https://github.com/lukasIO))

## 0.13.2

### Patch Changes

- fix(e2ee): Create e2eeManager only if set - [#386](https://github.com/livekit/node-sdks/pull/386) ([@lukasIO](https://github.com/lukasIO))

## 0.13.1

### Patch Changes

- e2ee: types can include undefined - [#376](https://github.com/livekit/node-sdks/pull/376) ([@nbsp](https://github.com/nbsp))

- fixed Participant.unpublishTrack error - [#379](https://github.com/livekit/node-sdks/pull/379) ([@s-hamdananwar](https://github.com/s-hamdananwar))

## 0.13.0

### Minor Changes

- feat(rtc): expose DisconnectReason - [#372](https://github.com/livekit/node-sdks/pull/372) ([@nbsp](https://github.com/nbsp))

### Patch Changes

- add close method to AudioSource and VideoSource - [#365](https://github.com/livekit/node-sdks/pull/365) ([@davidzhao](https://github.com/davidzhao))

## 0.12.2

### Patch Changes

- Fix types export for CJS and build config - [#359](https://github.com/livekit/node-sdks/pull/359) ([@lukasIO](https://github.com/lukasIO))

## 0.12.1

### Patch Changes

- Enable verbatimModuleSyntax and isolatedModules - [#341](https://github.com/livekit/node-sdks/pull/341) ([@lukasIO](https://github.com/lukasIO))

## 0.12.0

### Minor Changes

- natively support CommonJS - [#334](https://github.com/livekit/node-sdks/pull/334) ([@nbsp](https://github.com/nbsp))

### Patch Changes

- chore(tsconfig): enable `noUncheckedIndexedAccess` - [#336](https://github.com/livekit/node-sdks/pull/336) ([@nbsp](https://github.com/nbsp))

## 0.11.1

### Patch Changes

- fix(proto): don't crash on plain JavaScript - [#322](https://github.com/livekit/node-sdks/pull/322) ([@nbsp](https://github.com/nbsp))

## 0.11.0

### Minor Changes

- Native RPC support - [#276](https://github.com/livekit/node-sdks/pull/276) ([@bcherry](https://github.com/bcherry))

### Patch Changes

- update to ffi-v0.12.2 - [#318](https://github.com/livekit/node-sdks/pull/318) ([@bcherry](https://github.com/bcherry))

- Enable strict type checking and update ffi to use proto2 syntax - [#303](https://github.com/livekit/node-sdks/pull/303) ([@lukasIO](https://github.com/lukasIO))

- Use shared mutex helper lib - [#301](https://github.com/livekit/node-sdks/pull/301) ([@lukasIO](https://github.com/lukasIO))

- Rename responseTimeoutMs to responseTimeout, other RPC updates - [#314](https://github.com/livekit/node-sdks/pull/314) ([@bcherry](https://github.com/bcherry))

- Send SDK override and version to FFI - [#305](https://github.com/livekit/node-sdks/pull/305) ([@bcherry](https://github.com/bcherry))

- Adopt FFI v0.12.1 - [#311](https://github.com/livekit/node-sdks/pull/311) ([@bcherry](https://github.com/bcherry))

## 0.10.4

### Patch Changes

- Fix undefined bigint conversion - [#298](https://github.com/livekit/node-sdks/pull/298) ([@lukasIO](https://github.com/lukasIO))

## 0.10.3

### Patch Changes

- Add chat API support - [#278](https://github.com/livekit/node-sdks/pull/278) ([@lukasIO](https://github.com/lukasIO))

## 0.10.2

### Patch Changes

- export properly, fix audioresampler - [#291](https://github.com/livekit/node-sdks/pull/291) ([@nbsp](https://github.com/nbsp))

## 0.10.1

### Patch Changes

- export AudioResampler - [#288](https://github.com/livekit/node-sdks/pull/288) ([@nbsp](https://github.com/nbsp))

## 0.10.0

### Minor Changes

- add AudioResampler, combineAudioFrames - [#286](https://github.com/livekit/node-sdks/pull/286) ([@nbsp](https://github.com/nbsp))

### Patch Changes

- Fix mutex in livekit-rtc - [#287](https://github.com/livekit/node-sdks/pull/287) ([@bcherry](https://github.com/bcherry))
  Fix linter warnings in livekit-server-sdk

## 0.9.2

### Patch Changes

- expose VideoCodec - [#283](https://github.com/livekit/node-sdks/pull/283) ([@nbsp](https://github.com/nbsp))

## 0.9.1

### Patch Changes

- Fix ms conversion bug in AudioSource - [#279](https://github.com/livekit/node-sdks/pull/279) ([@bcherry](https://github.com/bcherry))

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
