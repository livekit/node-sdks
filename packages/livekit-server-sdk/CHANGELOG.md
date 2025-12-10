# livekit-server-sdk

## 2.15.0

### Minor Changes

- feat(connector): initial client impl - [#573](https://github.com/livekit/node-sdks/pull/573) ([@anunaym14](https://github.com/anunaym14))

## 2.14.2

### Patch Changes

- re-export types from @livekit/protocol - [#574](https://github.com/livekit/node-sdks/pull/574) ([@davidzhao](https://github.com/davidzhao))

- Add media encryption field to inbound and outbound SIP trunks - [#570](https://github.com/livekit/node-sdks/pull/570) ([@chrisackermann](https://github.com/chrisackermann))

## 2.14.1

### Patch Changes

- Add observability grant - [#565](https://github.com/livekit/node-sdks/pull/565) ([@toubatbrian](https://github.com/toubatbrian))

- Add outbound trunk configuration for sip participant. - [#563](https://github.com/livekit/node-sdks/pull/563) ([@cloudwebrtc](https://github.com/cloudwebrtc))

- Add optional timeouts to clients in server APIs - [#560](https://github.com/livekit/node-sdks/pull/560) ([@bryfox](https://github.com/bryfox))

## 2.14.0

### Minor Changes

- Added displayName field to CreateSipParticipantOptions - [#544](https://github.com/livekit/node-sdks/pull/544) ([@alexlivekit](https://github.com/alexlivekit))

## 2.13.3

### Patch Changes

- Add webhook event participant_connection_aborted - [#528](https://github.com/livekit/node-sdks/pull/528) ([@boks1971](https://github.com/boks1971))

## 2.13.2

### Patch Changes

- feat(webhooks): Add webhooks to `EgressClient` - [#517](https://github.com/livekit/node-sdks/pull/517) ([@davidzhao](https://github.com/davidzhao))

## 2.13.1

### Patch Changes

- Add support for destination_country in outbound trunk - [#489](https://github.com/livekit/node-sdks/pull/489) ([@biglittlebigben](https://github.com/biglittlebigben))

## 2.13.0

### Minor Changes

- Support moving participant to another room - [#473](https://github.com/livekit/node-sdks/pull/473) ([@cnderrauber](https://github.com/cnderrauber))

## 2.12.0

### Minor Changes

- Add destinationRoom to VideoGrant - [#460](https://github.com/livekit/node-sdks/pull/460) ([@cnderrauber](https://github.com/cnderrauber))

## 2.11.0

### Minor Changes

- Add ForwardParticipant to room service - [#440](https://github.com/livekit/node-sdks/pull/440) ([@cnderrauber](https://github.com/cnderrauber))

### Patch Changes

- chore: Add a clock tolerance parameter to support clock skew for webhooks - [#442](https://github.com/livekit/node-sdks/pull/442) ([@Wundero](https://github.com/Wundero))

## 2.10.2

### Patch Changes

- fix: expose sipNumber in SipClient.CreateSIPParticipant - [#427](https://github.com/livekit/node-sdks/pull/427) ([@davidzhao](https://github.com/davidzhao))

## 2.10.1

### Patch Changes

- rename enableKrisp -> krispEnabled for consistency - [#414](https://github.com/livekit/node-sdks/pull/414) ([@davidzhao](https://github.com/davidzhao))

## 2.10.0

### Minor Changes

- Improve error insight for twirp related requests, changes the error signature to custom TwirpError - [#390](https://github.com/livekit/node-sdks/pull/390) ([@lukasIO](https://github.com/lukasIO))

### Patch Changes

- Update protocol and add SendDataRequest nonce - [#400](https://github.com/livekit/node-sdks/pull/400) ([@lukasIO](https://github.com/lukasIO))

## 2.9.7

### Patch Changes

- Fix cjs usage of WebhookReceiver - [#382](https://github.com/livekit/node-sdks/pull/382) ([@lukasIO](https://github.com/lukasIO))

## 2.9.6

### Patch Changes

- fix(deps): move @bufbuild/protobuf to dependencies - [#351](https://github.com/livekit/node-sdks/pull/351) ([@danielmahon](https://github.com/danielmahon))

- Export enums `AudioCodec` and `VideoCodec` from @livekit/protocol - [#375](https://github.com/livekit/node-sdks/pull/375) ([@Philzen](https://github.com/Philzen))

## 2.9.5

### Patch Changes

- updated SIP APIs to include new API options - [#364](https://github.com/livekit/node-sdks/pull/364) ([@davidzhao](https://github.com/davidzhao))

## 2.9.4

### Patch Changes

- Fix screenshare option not being applied to participant egress - [#362](https://github.com/livekit/node-sdks/pull/362) ([@chrisackermann](https://github.com/chrisackermann))

- Fix types export for CJS and build config - [#359](https://github.com/livekit/node-sdks/pull/359) ([@lukasIO](https://github.com/lukasIO))

## 2.9.3

### Patch Changes

- support for node v18 - [#349](https://github.com/livekit/node-sdks/pull/349) ([@lalitkapoor](https://github.com/lalitkapoor))

## 2.9.2

### Patch Changes

- fix(cjs): don't default export ServiceBase - [#346](https://github.com/livekit/node-sdks/pull/346) ([@nbsp](https://github.com/nbsp))

## 2.9.1

### Patch Changes

- Enable verbatimModuleSyntax and isolatedModules - [#341](https://github.com/livekit/node-sdks/pull/341) ([@lukasIO](https://github.com/lukasIO))

- Update protocol dependency - [#344](https://github.com/livekit/node-sdks/pull/344) ([@lukasIO](https://github.com/lukasIO))

- Update protocol dependency - [#342](https://github.com/livekit/node-sdks/pull/342) ([@lukasIO](https://github.com/lukasIO))

## 2.9.0

### Minor Changes

- natively support CommonJS - [#334](https://github.com/livekit/node-sdks/pull/334) ([@nbsp](https://github.com/nbsp))

- SIP: Add missing params in CreateSIPParticipant - [#337](https://github.com/livekit/node-sdks/pull/337) ([@umarniz](https://github.com/umarniz))

### Patch Changes

- SIP: added headers options to SIP inbound and output create requests - [#332](https://github.com/livekit/node-sdks/pull/332) ([@s-hamdananwar](https://github.com/s-hamdananwar))

## 2.8.1

### Patch Changes

- Fix incorrect import in AgentDispatchClient - [#331](https://github.com/livekit/node-sdks/pull/331) ([@davidzhao](https://github.com/davidzhao))

## 2.8.0

### Minor Changes

- Explicit agent dispatch via API and token - [#324](https://github.com/livekit/node-sdks/pull/324) ([@davidzhao](https://github.com/davidzhao))

## 2.7.3

### Patch Changes

- Allow requesting dialtone during transfer - [#307](https://github.com/livekit/node-sdks/pull/307) ([@biglittlebigben](https://github.com/biglittlebigben))

## 2.7.2

### Patch Changes

- Fix ingress creation parameter inline documentation - [#296](https://github.com/livekit/node-sdks/pull/296) ([@biglittlebigben](https://github.com/biglittlebigben))

## 2.7.1

### Patch Changes

- Support canSubscribeMetrics - [#293](https://github.com/livekit/node-sdks/pull/293) ([@boks1971](https://github.com/boks1971))

## 2.7.0

### Minor Changes

- Implement transferSipParticipant - [#281](https://github.com/livekit/node-sdks/pull/281) ([@biglittlebigben](https://github.com/biglittlebigben))

### Patch Changes

- Fix mutex in livekit-rtc - [#287](https://github.com/livekit/node-sdks/pull/287) ([@bcherry](https://github.com/bcherry))
  Fix linter warnings in livekit-server-sdk

## 2.6.2

### Patch Changes

- Include support for SRT Egress - [#266](https://github.com/livekit/node-sdks/pull/266) ([@bcherry](https://github.com/bcherry))

## 2.6.1

### Patch Changes

- Export EgressStatus enum - [#247](https://github.com/livekit/node-sdks/pull/247) ([@lukasIO](https://github.com/lukasIO))

## 2.6.0

### Minor Changes

- Added ability to update Participant attributes - [#242](https://github.com/livekit/node-sdks/pull/242) ([@lukasIO](https://github.com/lukasIO))

## 2.5.1

### Patch Changes

- Export RoomEgress to make it possible to use AutoEgress - [#222](https://github.com/livekit/node-sdks/pull/222) ([@davidzhao](https://github.com/davidzhao))

## 2.5.0

### Minor Changes

- Support new SIP Inbound/Outbound Trunks and grants. - [#219](https://github.com/livekit/node-sdks/pull/219) ([@dennwc](https://github.com/dennwc))

### Patch Changes

- Added kind and attributes to AccessToken generation - [#215](https://github.com/livekit/node-sdks/pull/215) ([@davidzhao](https://github.com/davidzhao))

- Adds missing await to startParticipantEgress #221 - [#220](https://github.com/livekit/node-sdks/pull/220) ([@lukasIO](https://github.com/lukasIO))

## 2.4.0

### Minor Changes

- Accept new SIP metadata. - [#182](https://github.com/livekit/node-sdks/pull/182) ([@dennwc](https://github.com/dennwc))

### Patch Changes

- Update dependency @livekit/protocol to v1.17.0 - [#185](https://github.com/livekit/node-sdks/pull/185) ([@renovate](https://github.com/apps/renovate))

## 2.3.0

### Minor Changes

- Add SIP service. - [#173](https://github.com/livekit/server-sdk-js/pull/173) ([@dennwc](https://github.com/dennwc))

## 2.2.0

### Minor Changes

- Bump minimum engine requirement to node 19 - [#155](https://github.com/livekit/server-sdk-js/pull/155) ([@lukasIO](https://github.com/lukasIO))

- Add support for enableTranscoding - [#171](https://github.com/livekit/server-sdk-js/pull/171) ([@biglittlebigben](https://github.com/biglittlebigben))

### Patch Changes

- Allow user to set participant metadata when creating Ingress - [#152](https://github.com/livekit/server-sdk-js/pull/152) ([@davidzhao](https://github.com/davidzhao))

## 2.1.2

### Patch Changes

- Support for departure timeout in CreateRoom - [#150](https://github.com/livekit/server-sdk-js/pull/150) ([@davidzhao](https://github.com/davidzhao))

## 2.1.1

### Patch Changes

- Make use of @livekit/protocol package - [#147](https://github.com/livekit/server-sdk-js/pull/147) ([@lukasIO](https://github.com/lukasIO))

## 2.1.0

### Minor Changes

- Expose protobuf TrackSource and map TrackSource claims to string - [#145](https://github.com/livekit/server-sdk-js/pull/145) ([@lukasIO](https://github.com/lukasIO))

### Patch Changes

- Add support for Egress Image Output - [#143](https://github.com/livekit/server-sdk-js/pull/143) ([@biglittlebigben](https://github.com/biglittlebigben))

## 2.0.4

### Patch Changes

- Add agent field to VideoGrant - [#141](https://github.com/livekit/server-sdk-js/pull/141) ([@lukasIO](https://github.com/lukasIO))

## 2.0.3

### Patch Changes

- Export types needed for Egress - [#137](https://github.com/livekit/server-sdk-js/pull/137) ([@davidzhao](https://github.com/davidzhao))

## 2.0.2

### Patch Changes

- Fix issue decoding unknown fields in webhook receiver - [#135](https://github.com/livekit/server-sdk-js/pull/135) ([@davidzhao](https://github.com/davidzhao))

## 2.0.1

### Patch Changes

- Ignore unknown fields in protobuf parsing - [#132](https://github.com/livekit/server-sdk-js/pull/132) ([@lukasIO](https://github.com/lukasIO))

## 2.0.0

### Major Changes

- Change module type to ESM - [#118](https://github.com/livekit/server-sdk-js/pull/118) ([@lukasIO](https://github.com/lukasIO))

- Require node 18 as minimum version - [#118](https://github.com/livekit/server-sdk-js/pull/118) ([@lukasIO](https://github.com/lukasIO))

- Make `WebhookEvent` names type safe - [#125](https://github.com/livekit/server-sdk-js/pull/125) ([@lukasIO](https://github.com/lukasIO))

- Token generation is now async (replaced jsonwebtoken with jose for better JS runtime support) - [#118](https://github.com/livekit/server-sdk-js/pull/118) ([@lukasIO](https://github.com/lukasIO))

- Replace protobufjs with protobuf-es - [#118](https://github.com/livekit/server-sdk-js/pull/118) ([@lukasIO](https://github.com/lukasIO))

### Minor Changes

- Use globally available web crypto API instead of nodeJS crypto module - [#122](https://github.com/livekit/server-sdk-js/pull/122) ([@lukasIO](https://github.com/lukasIO))

### Patch Changes

- Throw error on bad Twirp response status and use async/await instead of promise chaining for improved error catching - [#124](https://github.com/livekit/server-sdk-js/pull/124) ([@lukasIO](https://github.com/lukasIO))
