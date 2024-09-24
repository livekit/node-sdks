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

  name: string;
  data?: string;

  constructor(name: string, message: string, data?: string) {
    super(message);
    this.name = name;
    this.message = truncateBytes(message, RpcError.MAX_MESSAGE_BYTES);
    this.data = data ? truncateBytes(data, RpcError.MAX_DATA_BYTES) : undefined;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      data: this.data,
    };
  }

  static Name = {
    CONNECTION_TIMEOUT: 'lk.connection-timeout',
    RESPONSE_TIMEOUT: 'lk.response-timeout',
    UNSUPPORTED_METHOD: 'lk.unsupported-method',
    RECIPIENT_DISCONNECTED: 'lk.recipient-disconnected',
    UNCAUGHT_ERROR: 'lk.uncaught-error',
    MALFORMED_RESPONSE: 'lk.malformed-response',
    PAYLOAD_TOO_LARGE: 'lk.payload-too-large',
  } as const;

  /** @internal */
  static builtIn(name: keyof typeof RpcError.Name, data?: string): RpcError {
    return new RpcError(RpcError.Name[name], RpcError.getMessage(name), data);
  }

  private static getMessage(name: keyof typeof RpcError.Name): string {
    switch (name) {
      case 'CONNECTION_TIMEOUT':
        return 'Connection timed out';
      case 'RESPONSE_TIMEOUT':
        return 'Response timed out';
      case 'UNSUPPORTED_METHOD':
        return 'Method is not supported';
      case 'RECIPIENT_DISCONNECTED':
        return 'Recipient has disconnected';
      case 'UNCAUGHT_ERROR':
        return 'An uncaught error occurred';
      case 'MALFORMED_RESPONSE':
        return 'Response is malformed';
      case 'PAYLOAD_TOO_LARGE':
        return 'Payload exceeds size limit';
    }
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
