export class RpcRequest {
  id: string;
  name: string;
  data: string;
}

export class RpcAck {
  requestId: string;
}

export class RpcResponse {
  requestId: string;
  data: string;
  errorCode: number; // Use 0 for success; non-zero for errors.
  errorData?: string; // Optional error message.
}

export const RPC_ERROR_ACK_TIMEOUT = 1001;
export const RPC_ERROR_RESPONSE_TIMEOUT = 1002;

