// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalParticipant, RemoteParticipant } from './participant';
import { type OwnedParticipant, ParticipantKind } from './proto/participant_pb';
import { RpcRequest, RpcError, RpcResponse } from './rpc';

describe('LocalParticipant', () => {
  describe('registerRpcMethod', () => {
    let localParticipant: LocalParticipant;

    beforeEach(() => {
      // Mock the OwnedParticipant object
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

      // Create a mock RpcRequest and RemoteParticipant
      const mockRequest = new RpcRequest({
        id: 'test-request-id',
        method: methodName,
        payload: 'test payload',
        responseTimeoutMs: 5000, // Add a default timeout
      });
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

      // Mock the publishData method to avoid actual data publishing
      localParticipant.publishData = vi.fn();

      // Call the internal method that would be triggered by an incoming RPC request
      await localParticipant['handleIncomingRpcRequest'](mockRequest, mockSender);

      // Verify that the handler was called with the correct arguments
      expect(handler).toHaveBeenCalledWith(mockRequest, mockSender);

      // Verify that publishData was called to send the response
      expect(localParticipant.publishData).toHaveBeenCalledTimes(2); // Once for ACK, once for response
    });

    it('should catch and transform unhandled errors in the RPC method handler', async () => {
      const methodName = 'errorMethod';
      const errorMessage = 'Test error';
      const handler = vi.fn().mockRejectedValue(new Error(errorMessage));

      localParticipant.registerRpcMethod(methodName, handler);

      const mockRequest = new RpcRequest({
        id: 'test-error-request-id',
        method: methodName,
        payload: 'test payload',
        responseTimeoutMs: 5000,
      });
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

      localParticipant.publishData = vi.fn();

      await localParticipant['handleIncomingRpcRequest'](mockRequest, mockSender);

      expect(handler).toHaveBeenCalledWith(mockRequest, mockSender);
      expect(localParticipant.publishData).toHaveBeenCalledTimes(2); // ACK and error response

      // Verify that the error response contains the correct error name
      const errorResponse = localParticipant.publishData.mock.calls[1][0];
      const parsedResponse = JSON.parse(new TextDecoder().decode(errorResponse));
      expect(parsedResponse.error.name).toBe('lk.UNCAUGHT_ERROR');

    });

    it('should pass through RpcError thrown by the RPC method handler', async () => {
      const methodName = 'rpcErrorMethod';
      const errorName = 'some-error';
      const errorMessage = 'some-error-message';
      const handler = vi.fn().mockRejectedValue(new RpcError(errorName, errorMessage));

      localParticipant.registerRpcMethod(methodName, handler);

      const mockRequest = new RpcRequest({
        id: 'test-rpc-error-request-id',
        method: methodName,
        payload: 'test payload',
        responseTimeoutMs: 5000,
      });
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

      localParticipant.publishData = vi.fn();

      await localParticipant['handleIncomingRpcRequest'](mockRequest, mockSender);

      expect(handler).toHaveBeenCalledWith(mockRequest, mockSender);
      expect(localParticipant.publishData).toHaveBeenCalledTimes(2); // ACK and error response

      // Verify that the error response contains the correct RpcError
      const errorResponse = localParticipant.publishData.mock.calls[1][0];
      const parsedResponse = JSON.parse(new TextDecoder().decode(errorResponse));
      expect(parsedResponse.error.name).toBe(errorName);
      expect(parsedResponse.error.message).toBe(errorMessage);
    });
  });

  describe('performRpcRequest', () => {
    let localParticipant: LocalParticipant;
    let mockRemoteParticipant: RemoteParticipant;

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

      localParticipant.publishData = vi.fn();
    });

    it('should send RPC request and receive successful response', async () => {
      const method = 'testMethod';
      const payload = 'testPayload';
      const responsePayload = 'responsePayload';

      // Mock the publishData method to simulate sending the request
      localParticipant.publishData.mockImplementationOnce((data) => {
        const request = JSON.parse(new TextDecoder().decode(data));
        // Simulate receiving a response
        setTimeout(() => {
          const response = new RpcResponse({
            requestId: request.id,
            payload: responsePayload,
          });
          localParticipant['handleIncomingRpcResponse'](response);
        }, 10);
      });

      const result = await localParticipant.performRpcRequest(mockRemoteParticipant.identity, method, payload);

      expect(localParticipant.publishData).toHaveBeenCalledTimes(1);
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
        timeoutMs
      );

      // Mock the publishData method to simulate a delay longer than the timeout
      localParticipant.publishData.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, timeoutMs + 10);
        });
      });

      // Start the timer
      const startTime = Date.now();

      // Wait for the promise to reject
      await expect(resultPromise).rejects.toThrow('Connection timed out');

      // Check that the time elapsed is close to the timeout value
      const elapsedTime = Date.now() - startTime;
      expect(elapsedTime).toBeGreaterThanOrEqual(timeoutMs);
      expect(elapsedTime).toBeLessThan(timeoutMs + 50); // Allow some margin for test execution

      // Verify that publishData was called
      expect(localParticipant.publishData).toHaveBeenCalledTimes(1);

      await expect(resultPromise).rejects.toThrow('Connection timed out');
    });

    it('should handle RPC error response', async () => {
      const method = 'errorMethod';
      const payload = 'errorPayload';
      const errorName = 'TEST_ERROR';
      const errorMessage = 'Test error message';

      localParticipant.publishData.mockImplementationOnce((data) => {
        const request = JSON.parse(new TextDecoder().decode(data));
        // Simulate receiving an error response
        setTimeout(() => {
          const response = new RpcResponse({
            requestId: request.id,
            error: new RpcError(errorName, errorMessage),
          });
          localParticipant['handleIncomingRpcResponse'](response);
        }, 10);
      });

      await expect(localParticipant.performRpcRequest(mockRemoteParticipant.identity, method, payload))
        .rejects.toThrow(errorMessage);
    });

    it('should handle participant disconnection during RPC request', async () => {
      const method = 'disconnectMethod';
      const payload = 'disconnectPayload';

      const resultPromise = localParticipant.performRpcRequest(mockRemoteParticipant.identity, method, payload);

      // Simulate participant disconnection
      localParticipant['handleParticipantDisconnected'](mockRemoteParticipant.identity);

      await expect(resultPromise).rejects.toThrow('Recipient has disconnected');
    });
  });
});
