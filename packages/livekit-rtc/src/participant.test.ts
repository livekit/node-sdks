import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalParticipant, RemoteParticipant } from './participant';
import { type OwnedParticipant, ParticipantKind } from './proto/participant_pb';
import { RpcRequest } from './rpc';

describe('LocalParticipant', () => {
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

  describe('registerRpcMethod', () => {
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

    it('should handle errors thrown by the RPC method handler', async () => {
      const methodName = 'errorMethod';
      const errorMessage = 'Test error';
      const handler = vi.fn().mockRejectedValue(new Error(errorMessage));

      localParticipant.registerRpcMethod(methodName, handler);

      const mockRequest = new RpcRequest({
        id: 'test-error-request-id',
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
        handle: { id: BigInt('0xabcdef0123456789') },
      } as unknown as OwnedParticipant);

      localParticipant.publishData = vi.fn();

      // Spy on console.warn to check for error logging
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await localParticipant['handleIncomingRpcRequest'](mockRequest, mockSender);

      expect(handler).toHaveBeenCalledWith(mockRequest, mockSender);
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(localParticipant.publishData).toHaveBeenCalledTimes(2); // ACK and error response

      consoleWarnSpy.mockRestore();
    });
  });
});
