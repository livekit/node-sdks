// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { RpcError as RpcError_Proto } from './proto/rpc_pb.js';

/** Parameters for initiating an RPC call */
export interface PerformRpcParams {
  /** The `identity` of the destination participant */
  destinationIdentity: string;
  /** The method name to call */
  method: string;
  /** The method payload */
  payload: string;
  /** Timeout for receiving a response after initial connection (milliseconds). Default: 10000 */
  responseTimeout?: number;
}

/**
 * Data passed to method handler for incoming RPC invocations
 */
export interface RpcInvocationData {
  /**
   * The unique request ID. Will match at both sides of the call, useful for debugging or logging.
   */
  requestId: string;

  /**
   * The unique participant identity of the caller.
   */
  callerIdentity: string;

  /**
   * The payload of the request. User-definable format, typically JSON.
   */
  payload: string;

  /**
   * The maximum time the caller will wait for a response.
   */
  responseTimeout: number;
}

/**
 * Specialized error handling for RPC methods.
 *
 * Instances of this type, when thrown in a method handler, will have their `message`
 * serialized and sent across the wire. The caller will receive an equivalent error on the other side.
 *
 * Built-in types are included but developers may use any string, with a max length of 256 bytes.
 */

export class RpcError extends Error {
  code: typeof RpcError.ErrorCode | number;
  data?: string;

  /**
   * Creates an error object with the given code and message, plus an optional data payload.
   *
   * If thrown in an RPC method handler, the error will be sent back to the caller.
   *
   * Error codes 1001-1999 are reserved for built-in errors (see RpcError.ErrorCode for their meanings).
   */
  constructor(code: number, message: string, data?: string) {
    super(message);
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static fromProto(proto: RpcError_Proto) {
    return new RpcError(proto.code!, proto.message!, proto.data);
  }

  toProto() {
    return {
      code: this.code as number,
      message: this.message,
      data: this.data,
    } as RpcError_Proto;
  }

  static ErrorCode = {
    APPLICATION_ERROR: 1500,
    CONNECTION_TIMEOUT: 1501,
    RESPONSE_TIMEOUT: 1502,
    RECIPIENT_DISCONNECTED: 1503,
    RESPONSE_PAYLOAD_TOO_LARGE: 1504,
    SEND_FAILED: 1505,

    UNSUPPORTED_METHOD: 1400,
    RECIPIENT_NOT_FOUND: 1401,
    REQUEST_PAYLOAD_TOO_LARGE: 1402,
    UNSUPPORTED_SERVER: 1403,
  } as const;

  /**
   * @internal
   */
  static ErrorMessage: Record<keyof typeof RpcError.ErrorCode, string> = {
    APPLICATION_ERROR: 'Application error in method handler',
    CONNECTION_TIMEOUT: 'Connection timeout',
    RESPONSE_TIMEOUT: 'Response timeout',
    RECIPIENT_DISCONNECTED: 'Recipient disconnected',
    RESPONSE_PAYLOAD_TOO_LARGE: 'Response payload too large',
    SEND_FAILED: 'Failed to send',

    UNSUPPORTED_METHOD: 'Method not supported at destination',
    RECIPIENT_NOT_FOUND: 'Recipient not found',
    REQUEST_PAYLOAD_TOO_LARGE: 'Request payload too large',
    UNSUPPORTED_SERVER: 'RPC not supported by server',
  } as const;

  /**
   * Creates an error object from the code, with an auto-populated message.
   *
   * @internal
   */
  static builtIn(key: keyof typeof RpcError.ErrorCode, data?: string): RpcError {
    return new RpcError(RpcError.ErrorCode[key], RpcError.ErrorMessage[key], data);
  }
}
