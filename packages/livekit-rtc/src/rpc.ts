// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

// TODO: This implementation is only a prototype
//       The final version will use a protocol types where possible
export class RpcRequest {
  id: string;
  method: string;
  payload: string;
  responseTimeoutMs: number;

  constructor({
    method,
    payload,
    responseTimeoutMs,
    id = crypto.randomUUID(),
  }: {
    method: string;
    payload: string;
    responseTimeoutMs: number;
    id?: string;
  }) {
    this.id = id;
    this.method = method;
    this.payload = payload;
    this.responseTimeoutMs = responseTimeoutMs;
  }
}

export class RpcAck {
  requestId: string;

  constructor({ requestId }: { requestId: string }) {
    this.requestId = requestId;
  }
}

export class RpcResponse {
  requestId: string;
  payload?: string;
  error?: string;

  constructor({
    requestId,
    payload,
    error,
  }: {
    requestId: string;
    payload?: string;
    error?: string;
  }) {
    this.requestId = requestId;
    this.payload = payload;
    this.error = error;
  }
}

/**
 * Specialized error handling for RPC methods.
 * 
 * Instances of this type, when thrown in a method handler, will have their `message`
 * serialized and sent across the wire. The sender will receive an equivalent error on the other side.
 * 
 * Build-in types are included but developers may use any string, with a max length of 256 bytes.
 */

export class RpcError extends Error {
  static MAX_BYTES = 256;

  static ErrorType = {
    CONNECTION_TIMEOUT: 'lk-rpc.connection-timeout',
    RESPONSE_TIMEOUT: 'lk-rpc.response-timeout',
    UNSUPPORTED_METHOD: 'lk-rpc.unsupported-method',
    RECIPIENT_DISCONNECTED: 'lk-rpc.recipient-disconnected',
    UNCAUGHT_ERROR: 'lk-rpc.uncaught-error',
    MALFORMED_RESPONSE: 'lk-rpc.malformed-response',
    PAYLOAD_TOO_LARGE: 'lk-rpc.payload-too-large',
  };

  constructor(message: string | keyof typeof RpcError.ErrorType) {
    if (message in RpcError.ErrorType) {
      super(RpcError.ErrorType[message as keyof typeof RpcError.ErrorType]);
    } else {
      if (byteLength(message) > RpcError.MAX_BYTES) {
        console.warn("Error message longer than 256 bytes will be truncated");
        message = truncateBytes(message, RpcError.MAX_BYTES);
      }
      super(message);
    }
    this.name = 'LKRPCError';
  }
}

/**
 * @internal
 */
export const MAX_PAYLOAD_BYTES = 15360; // 15 KB

/**
 * @internal
 */
export function byteLength(str: string): number {
  const encoder = new TextEncoder();
  return encoder.encode(str).length;
}

/**
 * @internal
 */
export function truncateBytes(str: string, maxBytes: number): string {
  if (byteLength(str) <= maxBytes) {
    return str;
  }
  
  let low = 0;
  let high = str.length;
  const encoder = new TextEncoder();
  
  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    if (encoder.encode(str.slice(0, mid)).length <= maxBytes) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  
  return str.slice(0, low);
}
