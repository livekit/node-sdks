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
  payload?: string; 
  error?: string;
}

export const RPC_ERROR_ACK_TIMEOUT = 'lk-rpc.ack-timeout';
export const RPC_ERROR_RESPONSE_TIMEOUT = 'lk-rpc.response-timeout';
export const RPC_ERROR_UNSUPPORTED_METHOD = 'lk-rpc.unsupported-method';

