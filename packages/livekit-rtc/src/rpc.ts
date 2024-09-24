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
  error?: RpcError;

  constructor({
    requestId,
    payload,
    error,
  }: {
    requestId: string;
    payload?: string;
    error?: RpcError;
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
  static MAX_NAME_BYTES = 64;
  static MAX_MESSAGE_BYTES = 256;
  static MAX_DATA_BYTES = 15360; // 15 KB

  code: number;
  data?: string;

  constructor(code: number, message: string, data?: string) {
    super(message);
    this.code = code;
    this.message = truncateBytes(message, RpcError.MAX_MESSAGE_BYTES);
    this.data = data ? truncateBytes(data, RpcError.MAX_DATA_BYTES) : undefined;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }

  static ErrorCodes = {
    UNCAUGHT_ERROR: 1001,
    UNSUPPORTED_METHOD: 1002,
    CONNECTION_TIMEOUT: 1003,
    RESPONSE_TIMEOUT: 1004,
    RECIPIENT_DISCONNECTED: 1005,
    PAYLOAD_TOO_LARGE: 1006,
    MALFORMED_RESPONSE: 1007,
  } as const;

  static ErrorMessages = {
    UNCAUGHT_ERROR: 'Uncaught application error',
    UNSUPPORTED_METHOD: 'Method not supported at destination',
    CONNECTION_TIMEOUT: 'Connection timeout',
    RESPONSE_TIMEOUT: 'Response timeout',
    RECIPIENT_DISCONNECTED: 'Recipient disconnected',
    PAYLOAD_TOO_LARGE: 'Payload too large',
    MALFORMED_RESPONSE: 'Malformed response',
  } as const;

  /** @internal */
  static builtIn(
    key: keyof typeof RpcError.ErrorCodes & keyof typeof RpcError.ErrorMessages,
    data?: string,
  ): RpcError {
    return new RpcError(RpcError.ErrorCodes[key], RpcError.ErrorMessages[key], data);
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
