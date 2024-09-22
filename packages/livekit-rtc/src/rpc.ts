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

export const RPC_ERROR_CONNECTION_TIMEOUT = 'lk-rpc.connection-timeout';
export const RPC_ERROR_RESPONSE_TIMEOUT = 'lk-rpc.response-timeout';
export const RPC_ERROR_UNSUPPORTED_METHOD = 'lk-rpc.unsupported-method';
export const RPC_ERROR_RECIPIENT_DISCONNECTED = 'lk-rpc.recipient-disconnected';
