// Copyright 2023 LiveKit, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @generated by protoc-gen-es v2.2.0 with parameter "target=ts"
// @generated from file rpc.proto (package livekit.proto, syntax proto2)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file rpc.proto.
 */
export const file_rpc: GenFile = /*@__PURE__*/
  fileDesc("CglycGMucHJvdG8SDWxpdmVraXQucHJvdG8iNwoIUnBjRXJyb3ISDAoEY29kZRgBIAIoDRIPCgdtZXNzYWdlGAIgAigJEgwKBGRhdGEYAyABKAkikQEKEVBlcmZvcm1ScGNSZXF1ZXN0EiAKGGxvY2FsX3BhcnRpY2lwYW50X2hhbmRsZRgBIAIoBBIcChRkZXN0aW5hdGlvbl9pZGVudGl0eRgCIAIoCRIOCgZtZXRob2QYAyACKAkSDwoHcGF5bG9hZBgEIAIoCRIbChNyZXNwb25zZV90aW1lb3V0X21zGAUgASgNIkwKGFJlZ2lzdGVyUnBjTWV0aG9kUmVxdWVzdBIgChhsb2NhbF9wYXJ0aWNpcGFudF9oYW5kbGUYASACKAQSDgoGbWV0aG9kGAIgAigJIk4KGlVucmVnaXN0ZXJScGNNZXRob2RSZXF1ZXN0EiAKGGxvY2FsX3BhcnRpY2lwYW50X2hhbmRsZRgBIAIoBBIOCgZtZXRob2QYAiACKAkilgEKIlJwY01ldGhvZEludm9jYXRpb25SZXNwb25zZVJlcXVlc3QSIAoYbG9jYWxfcGFydGljaXBhbnRfaGFuZGxlGAEgAigEEhUKDWludm9jYXRpb25faWQYAiACKAQSDwoHcGF5bG9hZBgDIAEoCRImCgVlcnJvchgEIAEoCzIXLmxpdmVraXQucHJvdG8uUnBjRXJyb3IiJgoSUGVyZm9ybVJwY1Jlc3BvbnNlEhAKCGFzeW5jX2lkGAEgAigEIhsKGVJlZ2lzdGVyUnBjTWV0aG9kUmVzcG9uc2UiHQobVW5yZWdpc3RlclJwY01ldGhvZFJlc3BvbnNlIjQKI1JwY01ldGhvZEludm9jYXRpb25SZXNwb25zZVJlc3BvbnNlEg0KBWVycm9yGAIgASgJIl8KElBlcmZvcm1ScGNDYWxsYmFjaxIQCghhc3luY19pZBgBIAIoBBIPCgdwYXlsb2FkGAIgASgJEiYKBWVycm9yGAMgASgLMhcubGl2ZWtpdC5wcm90by5ScGNFcnJvciK+AQoYUnBjTWV0aG9kSW52b2NhdGlvbkV2ZW50EiAKGGxvY2FsX3BhcnRpY2lwYW50X2hhbmRsZRgBIAIoBBIVCg1pbnZvY2F0aW9uX2lkGAIgAigEEg4KBm1ldGhvZBgDIAIoCRISCgpyZXF1ZXN0X2lkGAQgAigJEhcKD2NhbGxlcl9pZGVudGl0eRgFIAIoCRIPCgdwYXlsb2FkGAYgAigJEhsKE3Jlc3BvbnNlX3RpbWVvdXRfbXMYByACKA1CEKoCDUxpdmVLaXQuUHJvdG8");

/**
 * @generated from message livekit.proto.RpcError
 */
export type RpcError = Message<"livekit.proto.RpcError"> & {
  /**
   * @generated from field: required uint32 code = 1;
   */
  code: number;

  /**
   * @generated from field: required string message = 2;
   */
  message: string;

  /**
   * @generated from field: optional string data = 3;
   */
  data: string;
};

/**
 * Describes the message livekit.proto.RpcError.
 * Use `create(RpcErrorSchema)` to create a new message.
 */
export const RpcErrorSchema: GenMessage<RpcError> = /*@__PURE__*/
  messageDesc(file_rpc, 0);

/**
 * FFI Requests
 *
 * @generated from message livekit.proto.PerformRpcRequest
 */
export type PerformRpcRequest = Message<"livekit.proto.PerformRpcRequest"> & {
  /**
   * @generated from field: required uint64 local_participant_handle = 1;
   */
  localParticipantHandle: bigint;

  /**
   * @generated from field: required string destination_identity = 2;
   */
  destinationIdentity: string;

  /**
   * @generated from field: required string method = 3;
   */
  method: string;

  /**
   * @generated from field: required string payload = 4;
   */
  payload: string;

  /**
   * @generated from field: optional uint32 response_timeout_ms = 5;
   */
  responseTimeoutMs: number;
};

/**
 * Describes the message livekit.proto.PerformRpcRequest.
 * Use `create(PerformRpcRequestSchema)` to create a new message.
 */
export const PerformRpcRequestSchema: GenMessage<PerformRpcRequest> = /*@__PURE__*/
  messageDesc(file_rpc, 1);

/**
 * @generated from message livekit.proto.RegisterRpcMethodRequest
 */
export type RegisterRpcMethodRequest = Message<"livekit.proto.RegisterRpcMethodRequest"> & {
  /**
   * @generated from field: required uint64 local_participant_handle = 1;
   */
  localParticipantHandle: bigint;

  /**
   * @generated from field: required string method = 2;
   */
  method: string;
};

/**
 * Describes the message livekit.proto.RegisterRpcMethodRequest.
 * Use `create(RegisterRpcMethodRequestSchema)` to create a new message.
 */
export const RegisterRpcMethodRequestSchema: GenMessage<RegisterRpcMethodRequest> = /*@__PURE__*/
  messageDesc(file_rpc, 2);

/**
 * @generated from message livekit.proto.UnregisterRpcMethodRequest
 */
export type UnregisterRpcMethodRequest = Message<"livekit.proto.UnregisterRpcMethodRequest"> & {
  /**
   * @generated from field: required uint64 local_participant_handle = 1;
   */
  localParticipantHandle: bigint;

  /**
   * @generated from field: required string method = 2;
   */
  method: string;
};

/**
 * Describes the message livekit.proto.UnregisterRpcMethodRequest.
 * Use `create(UnregisterRpcMethodRequestSchema)` to create a new message.
 */
export const UnregisterRpcMethodRequestSchema: GenMessage<UnregisterRpcMethodRequest> = /*@__PURE__*/
  messageDesc(file_rpc, 3);

/**
 * @generated from message livekit.proto.RpcMethodInvocationResponseRequest
 */
export type RpcMethodInvocationResponseRequest = Message<"livekit.proto.RpcMethodInvocationResponseRequest"> & {
  /**
   * @generated from field: required uint64 local_participant_handle = 1;
   */
  localParticipantHandle: bigint;

  /**
   * @generated from field: required uint64 invocation_id = 2;
   */
  invocationId: bigint;

  /**
   * @generated from field: optional string payload = 3;
   */
  payload: string;

  /**
   * @generated from field: optional livekit.proto.RpcError error = 4;
   */
  error?: RpcError;
};

/**
 * Describes the message livekit.proto.RpcMethodInvocationResponseRequest.
 * Use `create(RpcMethodInvocationResponseRequestSchema)` to create a new message.
 */
export const RpcMethodInvocationResponseRequestSchema: GenMessage<RpcMethodInvocationResponseRequest> = /*@__PURE__*/
  messageDesc(file_rpc, 4);

/**
 * FFI Responses
 *
 * @generated from message livekit.proto.PerformRpcResponse
 */
export type PerformRpcResponse = Message<"livekit.proto.PerformRpcResponse"> & {
  /**
   * @generated from field: required uint64 async_id = 1;
   */
  asyncId: bigint;
};

/**
 * Describes the message livekit.proto.PerformRpcResponse.
 * Use `create(PerformRpcResponseSchema)` to create a new message.
 */
export const PerformRpcResponseSchema: GenMessage<PerformRpcResponse> = /*@__PURE__*/
  messageDesc(file_rpc, 5);

/**
 * @generated from message livekit.proto.RegisterRpcMethodResponse
 */
export type RegisterRpcMethodResponse = Message<"livekit.proto.RegisterRpcMethodResponse"> & {
};

/**
 * Describes the message livekit.proto.RegisterRpcMethodResponse.
 * Use `create(RegisterRpcMethodResponseSchema)` to create a new message.
 */
export const RegisterRpcMethodResponseSchema: GenMessage<RegisterRpcMethodResponse> = /*@__PURE__*/
  messageDesc(file_rpc, 6);

/**
 * @generated from message livekit.proto.UnregisterRpcMethodResponse
 */
export type UnregisterRpcMethodResponse = Message<"livekit.proto.UnregisterRpcMethodResponse"> & {
};

/**
 * Describes the message livekit.proto.UnregisterRpcMethodResponse.
 * Use `create(UnregisterRpcMethodResponseSchema)` to create a new message.
 */
export const UnregisterRpcMethodResponseSchema: GenMessage<UnregisterRpcMethodResponse> = /*@__PURE__*/
  messageDesc(file_rpc, 7);

/**
 * @generated from message livekit.proto.RpcMethodInvocationResponseResponse
 */
export type RpcMethodInvocationResponseResponse = Message<"livekit.proto.RpcMethodInvocationResponseResponse"> & {
  /**
   * @generated from field: optional string error = 2;
   */
  error: string;
};

/**
 * Describes the message livekit.proto.RpcMethodInvocationResponseResponse.
 * Use `create(RpcMethodInvocationResponseResponseSchema)` to create a new message.
 */
export const RpcMethodInvocationResponseResponseSchema: GenMessage<RpcMethodInvocationResponseResponse> = /*@__PURE__*/
  messageDesc(file_rpc, 8);

/**
 * FFI Callbacks
 *
 * @generated from message livekit.proto.PerformRpcCallback
 */
export type PerformRpcCallback = Message<"livekit.proto.PerformRpcCallback"> & {
  /**
   * @generated from field: required uint64 async_id = 1;
   */
  asyncId: bigint;

  /**
   * @generated from field: optional string payload = 2;
   */
  payload: string;

  /**
   * @generated from field: optional livekit.proto.RpcError error = 3;
   */
  error?: RpcError;
};

/**
 * Describes the message livekit.proto.PerformRpcCallback.
 * Use `create(PerformRpcCallbackSchema)` to create a new message.
 */
export const PerformRpcCallbackSchema: GenMessage<PerformRpcCallback> = /*@__PURE__*/
  messageDesc(file_rpc, 9);

/**
 * FFI Events
 *
 * @generated from message livekit.proto.RpcMethodInvocationEvent
 */
export type RpcMethodInvocationEvent = Message<"livekit.proto.RpcMethodInvocationEvent"> & {
  /**
   * @generated from field: required uint64 local_participant_handle = 1;
   */
  localParticipantHandle: bigint;

  /**
   * @generated from field: required uint64 invocation_id = 2;
   */
  invocationId: bigint;

  /**
   * @generated from field: required string method = 3;
   */
  method: string;

  /**
   * @generated from field: required string request_id = 4;
   */
  requestId: string;

  /**
   * @generated from field: required string caller_identity = 5;
   */
  callerIdentity: string;

  /**
   * @generated from field: required string payload = 6;
   */
  payload: string;

  /**
   * @generated from field: required uint32 response_timeout_ms = 7;
   */
  responseTimeoutMs: number;
};

/**
 * Describes the message livekit.proto.RpcMethodInvocationEvent.
 * Use `create(RpcMethodInvocationEventSchema)` to create a new message.
 */
export const RpcMethodInvocationEventSchema: GenMessage<RpcMethodInvocationEvent> = /*@__PURE__*/
  messageDesc(file_rpc, 10);

