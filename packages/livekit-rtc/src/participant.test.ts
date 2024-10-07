// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalParticipant, RemoteParticipant } from './participant';
import { type OwnedParticipant, ParticipantKind } from './proto/participant_pb';
import { RpcError } from './rpc';

describe('LocalParticipant', () => {
  describe('registerRpcMethod', () => {
    let localParticipant: LocalParticipant;

    beforeEach(() => {
      const mockOwnedParticipant = {
        info: {
          sid: 'test-sid',
          identity: 'test-identity',
          name: 'Test Participant',
          metadata: '',
          attributes: {},
          kind: ParticipantKind.STANDARD,
        },
        handle: { id: BigInt('0x1234567890abcdef') },
      } as unknown as OwnedParticipant;

      localParticipant = new LocalParticipant(mockOwnedParticipant);
    });

    it('should register an RPC method handler', async () => {
      const methodName = 'testMethod';
      const handler = vi.fn().mockResolvedValue('test response');

      localParticipant.registerRpcMethod(methodName, handler);

      const mockSender = new RemoteParticipant({
        info: {
          sid: 'remote-sid',
          identity: 'remote-identity',
          name: 'Remote Participant',
          metadata: '',
          attributes: {},
          kind: ParticipantKind.STANDARD,
        },
        handle: { id: BigInt('0x9876543210fedcba') },
      } as unknown as OwnedParticipant);

      localParticipant.publishRpcAck = vi.fn();
      localParticipant.publishRpcResponse = vi.fn();

      // Call the internal method that would be triggered by an incoming RPC request
      await localParticipant['handleIncomingRpcRequest'](mockSender, 'test-request-id', methodName, 'test payload', 5000);

      // Verify that the handler was called with the correct arguments
      expect(handler).toHaveBeenCalledWith(mockSender, 'test-request-id', 'test payload', 5000);

      // Verify that publishRpcAck and publishRpcResponse were called
      expect(localParticipant.publishRpcAck).toHaveBeenCalledTimes(1);
      expect(localParticipant.publishRpcResponse).toHaveBeenCalledTimes(1);
    });

    it('should catch and transform unhandled errors in the RPC method handler', async () => {
      const methodName = 'errorMethod';
      const errorMessage = 'Test error';
      const handler = vi.fn().mockRejectedValue(new Error(errorMessage));

      localParticipant.registerRpcMethod(methodName, handler);

      const mockSender = new RemoteParticipant({
        info: {
          sid: 'remote-sid',
          identity: 'remote-identity',
          name: 'Remote Participant',
          metadata: '',
          attributes: {},
          kind: ParticipantKind.STANDARD,
        },
        handle: { id: BigInt('0xabcdef0123456789') },
      } as unknown as OwnedParticipant);

      const mockPublishAck = vi.fn();
      const mockPublishResponse = vi.fn();
      localParticipant.publishRpcAck = mockPublishAck;
      localParticipant.publishRpcResponse = mockPublishResponse;

      await localParticipant['handleIncomingRpcRequest'](mockSender, 'test-error-request-id', methodName, 'test payload', 5000);

      expect(handler).toHaveBeenCalledWith(mockSender, 'test-error-request-id', 'test payload', 5000);
      expect(mockPublishAck).toHaveBeenCalledTimes(1);
      expect(mockPublishResponse).toHaveBeenCalledTimes(1);

      // Verify that the error response contains the correct error
      const errorResponse = mockPublishResponse.mock.calls[0][3];
      expect(errorResponse).toBeInstanceOf(RpcError);
      expect(errorResponse.code).toBe(RpcError.ErrorCode.UNCAUGHT_ERROR);
    });

    it('should pass through RpcError thrown by the RPC method handler', async () => {
      const methodName = 'rpcErrorMethod';
      const errorCode = 101;
      const errorMessage = 'some-error-message';
      const handler = vi.fn().mockRejectedValue(new RpcError(errorCode, errorMessage));

      localParticipant.registerRpcMethod(methodName, handler);

      const mockSender = new RemoteParticipant({
        info: {
          sid: 'remote-sid',
          identity: 'remote-identity',
          name: 'Remote Participant',
          metadata: '',
          attributes: {},
          kind: ParticipantKind.STANDARD,
        },
        handle: { id: BigInt('0xabcdef0123456789') },
      } as unknown as OwnedParticipant);

      const mockPublishAck = vi.fn();
      const mockPublishResponse = vi.fn();
      localParticipant.publishRpcAck = mockPublishAck;
      localParticipant.publishRpcResponse = mockPublishResponse;

      await localParticipant['handleIncomingRpcRequest'](mockSender, 'test-rpc-error-request-id', methodName, 'test payload', 5000);

      expect(handler).toHaveBeenCalledWith(mockSender, 'test-rpc-error-request-id', 'test payload', 5000);
      expect(localParticipant.publishRpcAck).toHaveBeenCalledTimes(1);
      expect(localParticipant.publishRpcResponse).toHaveBeenCalledTimes(1);

      // Verify that the error response contains the correct RpcError
      const errorResponse = mockPublishResponse.mock.calls[0][3];
      expect(errorResponse).toBeInstanceOf(RpcError);
      expect(errorResponse.code).toBe(errorCode);
      expect(errorResponse.message).toBe(errorMessage);
    });
  });

  describe('performRpcRequest', () => {
    let localParticipant: LocalParticipant;
    let mockRemoteParticipant: RemoteParticipant;
    let mockPublishRequest: ReturnType<typeof vi.fn>;
    beforeEach(() => {
      localParticipant = new LocalParticipant({
        info: {
          sid: 'local-sid',
          identity: 'local-identity',
          name: 'Local Participant',
          metadata: '',
          attributes: {},
          kind: ParticipantKind.STANDARD,
        },
        handle: { id: BigInt('0x1234567890abcdef') },
      } as unknown as OwnedParticipant);

      mockRemoteParticipant = new RemoteParticipant({
        info: {
          sid: 'remote-sid',
          identity: 'remote-identity',
          name: 'Remote Participant',
          metadata: '',
          attributes: {},
          kind: ParticipantKind.STANDARD,
        },
        handle: { id: BigInt('0xabcdef0123456789') },
      } as unknown as OwnedParticipant);

      mockPublishRequest = vi.fn();
      localParticipant.publishRpcRequest = mockPublishRequest;
    });

    it('should send RPC request and receive successful response', async () => {
      const method = 'testMethod';
      const payload = 'testPayload';
      const responsePayload = 'responsePayload';

      mockPublishRequest.mockImplementationOnce((_, requestId) => {
        setTimeout(() => {
          localParticipant['handleIncomingRpcAck'](requestId);
          setTimeout(() => {
            localParticipant['handleIncomingRpcResponse'](requestId, responsePayload, null);
          }, 10);
        }, 10);
      });

      const result = await localParticipant.performRpcRequest(
        mockRemoteParticipant.identity,
        method,
        payload,
      );

      expect(mockPublishRequest).toHaveBeenCalledTimes(1);
      expect(result).toBe(responsePayload);
    });

    it('should handle RPC request timeout', async () => {
      const method = 'timeoutMethod';
      const payload = 'timeoutPayload';

      // Set a short timeout for the test
      const timeoutMs = 50;

      const resultPromise = localParticipant.performRpcRequest(
        mockRemoteParticipant.identity,
        method,
        payload,
        timeoutMs,
      );

      // Mock the publishRpcRequest method to simulate a delay longer than the timeout
      mockPublishRequest.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, timeoutMs + 10);
        });
      });

      const startTime = Date.now();

      // Wait for the promise to reject
      await expect(resultPromise).rejects.toThrow('Connection timeout');

      // Check that the time elapsed is close to the timeout value
      const elapsedTime = Date.now() - startTime;
      expect(elapsedTime).toBeGreaterThanOrEqual(timeoutMs);
      expect(elapsedTime).toBeLessThan(timeoutMs + 50); // Allow some margin for test execution

      expect(localParticipant.publishRpcRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle RPC error response', async () => {
      const method = 'errorMethod';
      const payload = 'errorPayload';
      const errorCode = 101;
      const errorMessage = 'Test error message';

      mockPublishRequest.mockImplementationOnce((_, requestId) => {
        setTimeout(() => {
          localParticipant['handleIncomingRpcAck'](requestId);
          localParticipant['handleIncomingRpcResponse'](requestId, null, new RpcError(errorCode, errorMessage));
        }, 10);
      });

      await expect(
        localParticipant.performRpcRequest(mockRemoteParticipant.identity, method, payload),
      ).rejects.toThrow(errorMessage);
    });

    it('should handle participant disconnection during RPC request', async () => {
      const method = 'disconnectMethod';
      const payload = 'disconnectPayload';

      const resultPromise = localParticipant.performRpcRequest(
        mockRemoteParticipant.identity,
        method,
        payload,
      );

      // Simulate participant disconnection
      localParticipant['handleParticipantDisconnected'](mockRemoteParticipant.identity);

      await expect(resultPromise).rejects.toThrow('Recipient disconnected');
    });
  });
});