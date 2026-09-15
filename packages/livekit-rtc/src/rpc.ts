// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { RpcError as RpcError_Proto } from '@livekit/rtc-ffi-bindings';

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

  /**
   * The name of the invoked RPC method.
   */
  method: string;
}

/**
 * An outgoing RPC call, as passed to {@link RpcInterceptor.interceptOutgoing}.
 *
 * Mirrors the parameters of `LocalParticipant.performRpc`. An interceptor may pass a modified
 * copy to `next` (for example to add a header to a JSON payload).
 */
export interface RpcCallInfo {
  /** The identity of the participant being called. */
  destinationIdentity: string;
  /** The method name. */
  method: string;
  /** The request payload. */
  payload: string;
  /** Milliseconds to wait for a response, or `undefined` for the default. */
  responseTimeout?: number;
}

/** Continuation handed to {@link RpcInterceptor.interceptOutgoing}: performs the call. */
export type OutgoingRpcNext = (call: RpcCallInfo) => Promise<string>;

/** Continuation handed to {@link RpcInterceptor.interceptIncoming}: runs the handler. */
export type IncomingRpcNext = (invocation: RpcInvocationData) => Promise<string>;

/**
 * Observe or wrap RPC calls made and handled by a `LocalParticipant`.
 *
 * Register with `LocalParticipant.addRpcInterceptor`. Each method receives the call and a `next`
 * continuation and must return (or throw) what `next` returns (or throws), unless it
 * deliberately short-circuits the call. Interceptors run in registration order: the first one
 * added is the outermost. Both methods are optional, so implement only the direction you care
 * about.
 *
 * Errors flow through the chain unchanged: an {@link RpcError} thrown by the remote side
 * (outgoing) or by the handler (incoming) is visible to every interceptor before it reaches the
 * caller. On the incoming side, any other error thrown by the handler is also visible; the SDK
 * converts it to `APPLICATION_ERROR` only after the chain settles. Calls for methods nobody
 * registered are normally rejected by the transport before the SDK is involved; should one
 * reach the chain anyway, `next` throws `UNSUPPORTED_METHOD`.
 *
 * @example
 * Time every RPC in both directions:
 * ```typescript
 * const timing: RpcInterceptor = {
 *   async interceptOutgoing(call, next) {
 *     const start = performance.now();
 *     try {
 *       return await next(call);
 *     } finally {
 *       console.log(`call ${call.method} -> ${call.destinationIdentity}: ${performance.now() - start}ms`);
 *     }
 *   },
 *   async interceptIncoming(invocation, next) {
 *     const start = performance.now();
 *     try {
 *       return await next(invocation);
 *     } finally {
 *       console.log(`handled ${invocation.method} from ${invocation.callerIdentity}: ${performance.now() - start}ms`);
 *     }
 *   },
 * };
 * room.localParticipant!.addRpcInterceptor(timing);
 * ```
 */
export interface RpcInterceptor {
  /** Wrap an outgoing `LocalParticipant.performRpc`. Return the response payload. */
  interceptOutgoing?(call: RpcCallInfo, next: OutgoingRpcNext): Promise<string>;
  /** Wrap the handling of an incoming invocation. Return the response payload. */
  interceptIncoming?(invocation: RpcInvocationData, next: IncomingRpcNext): Promise<string>;
}

/**
 * Compose `interceptors` around `terminal`; the first interceptor is outermost. Interceptors
 * without an `interceptOutgoing` method are pass-through.
 *
 * @internal
 */
export function chainOutgoing(
  interceptors: readonly RpcInterceptor[],
  terminal: OutgoingRpcNext,
): OutgoingRpcNext {
  let callNext = terminal;
  for (let i = interceptors.length - 1; i >= 0; i--) {
    const interceptor = interceptors[i]!;
    const intercept = interceptor.interceptOutgoing;
    if (!intercept) continue;
    const inner = callNext;
    callNext = (call) => intercept.call(interceptor, call, inner);
  }
  return callNext;
}

/**
 * Compose `interceptors` around `terminal`; the first interceptor is outermost. Interceptors
 * without an `interceptIncoming` method are pass-through.
 *
 * @internal
 */
export function chainIncoming(
  interceptors: readonly RpcInterceptor[],
  terminal: IncomingRpcNext,
): IncomingRpcNext {
  let callNext = terminal;
  for (let i = interceptors.length - 1; i >= 0; i--) {
    const interceptor = interceptors[i]!;
    const intercept = interceptor.interceptIncoming;
    if (!intercept) continue;
    const inner = callNext;
    callNext = (invocation) => intercept.call(interceptor, invocation, inner);
  }
  return callNext;
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
