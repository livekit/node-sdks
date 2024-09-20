// TODO: This implementation is only a prototype
//       The final version will use a protocol types where possible
export class RpcRequest {
  id: string;
  method: string;
  payload: string;
}

export class RpcAck {
  requestId: string;
}

export class RpcResponse {
  requestId: string;
  payload?: string; // Response payload for successful requests
  errorCode?: number; // Non-zero for errors, omitted for success
  errorData?: string; // Optional error details, omitted for success
}

export const RPC_ERROR_ACK_TIMEOUT = 1001;
export const RPC_ERROR_RESPONSE_TIMEOUT = 1002;

