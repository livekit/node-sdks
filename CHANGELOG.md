# livekit-server-sdk

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
