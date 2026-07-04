// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
// API tests that drive the unified LiveKitAPI against the mock LiveKit server.
// See mock.ts for setup. Because the mock enforces the same per-method grants as
// the real server, a call that resolves also proves the SDK attached the right
// grants automatically. The smoke tests fully populate each request so they
// double as a reference for a complete call and exercise field serialization.
import {
  ConnectTwilioCallRequest_TwilioCallDirection,
  DataPacket_Kind,
  DirectFileOutput,
  DisconnectWhatsAppCallRequest_DisconnectReason,
  EncodedFileOutput,
  EncodedFileType,
  IngressAudioEncodingPreset,
  IngressAudioOptions,
  IngressInput,
  IngressVideoEncodingPreset,
  IngressVideoOptions,
  JobRestartPolicy,
  RoomAgentDispatch,
  S3Upload,
  SIPDispatchRule,
  SIPDispatchRuleDirect,
  SIPDispatchRuleInfo,
  SIPHeaderOptions,
  SIPInboundTrunkInfo,
  SIPMediaConfig,
  SIPMediaEncryption,
  SIPOutboundTrunkInfo,
  SIPTransport,
  SegmentedFileOutput,
  SegmentedFileProtocol,
  SessionDescription,
  StreamOutput,
  StreamProtocol,
} from '@livekit/protocol';
import { describe, expect, it } from 'vitest';
import { AccessToken, LiveKitAPI, SipCallError, TwirpError } from '../../src/index.js';
import { BASE, TEST_API_KEY, TEST_API_SECRET, newApi, reachable, withMock } from './mock.js';

const d = reachable ? describe : describe.skip;

d('LiveKitAPI', () => {
  const api = newApi();

  describe('room (smoke)', () => {
    it('createRoom', () =>
      api.room.createRoom({
        name: 'test-room',
        emptyTimeout: 300,
        departureTimeout: 60,
        maxParticipants: 50,
        metadata: JSON.stringify({ scene: 'lobby' }),
        minPlayoutDelay: 100,
        maxPlayoutDelay: 2000,
        syncStreams: true,
        agents: [new RoomAgentDispatch({ agentName: 'greeter', metadata: '{"lang":"en"}' })],
      }));
    it('listRooms', () => api.room.listRooms(['test-room', 'lobby']));
    it('deleteRoom', () => api.room.deleteRoom('test-room'));
    it('updateRoomMetadata', () =>
      api.room.updateRoomMetadata('test-room', JSON.stringify({ scene: 'intro' })));
    it('listParticipants', () => api.room.listParticipants('test-room'));
    it('getParticipant', () => api.room.getParticipant('test-room', 'participant-42'));
    it('removeParticipant', () => api.room.removeParticipant('test-room', 'participant-42'));
    it('forwardParticipant', () =>
      api.room.forwardParticipant('test-room', 'participant-42', 'overflow-room'));
    it('moveParticipant', () =>
      api.room.moveParticipant('test-room', 'participant-42', 'breakout-room'));
    it('mutePublishedTrack', () =>
      api.room.mutePublishedTrack('test-room', 'participant-42', 'TR_video1', true));
    it('updateParticipant', () =>
      api.room.updateParticipant('test-room', 'participant-42', {
        name: 'Alice',
        metadata: JSON.stringify({ role: 'host' }),
        attributes: { seat: '1A' },
        permission: { canPublish: true, canSubscribe: true, canPublishData: true },
      }));
    it('updateSubscriptions', () =>
      api.room.updateSubscriptions('test-room', 'participant-42', ['TR_video1'], true));
    it('sendData', () =>
      api.room.sendData(
        'test-room',
        new TextEncoder().encode('hello world'),
        DataPacket_Kind.RELIABLE,
        { topic: 'chat', destinationIdentities: ['participant-42'] },
      ));
  });

  describe('egress (smoke)', () => {
    const s3 = () => ({
      case: 's3' as const,
      value: new S3Upload({ bucket: 'recordings', region: 'us-east-1' }),
    });
    it('startRoomCompositeEgress', () =>
      api.egress.startRoomCompositeEgress(
        'test-room',
        {
          file: new EncodedFileOutput({
            fileType: EncodedFileType.MP4,
            filepath: 'room.mp4',
            output: s3(),
          }),
        },
        {
          layout: 'grid',
          audioOnly: false,
          videoOnly: false,
          customBaseUrl: 'https://example.com/scene',
        },
      ));
    it('startWebEgress', () =>
      api.egress.startWebEgress(
        'https://example.com/scene',
        {
          stream: new StreamOutput({
            protocol: StreamProtocol.RTMP,
            urls: ['rtmps://a.example.com/live/key'],
          }),
        },
        { awaitStartSignal: true },
      ));
    it('startParticipantEgress', () =>
      api.egress.startParticipantEgress(
        'test-room',
        'participant-42',
        {
          file: new EncodedFileOutput({
            fileType: EncodedFileType.MP4,
            filepath: 'participant.mp4',
            output: s3(),
          }),
        },
        { screenShare: true },
      ));
    it('startTrackCompositeEgress', () =>
      api.egress.startTrackCompositeEgress(
        'test-room',
        {
          segments: new SegmentedFileOutput({
            protocol: SegmentedFileProtocol.HLS_PROTOCOL,
            filenamePrefix: 'segments/track',
            playlistName: 'playlist.m3u8',
            segmentDuration: 6,
            output: s3(),
          }),
        },
        { audioTrackId: 'TR_audio1', videoTrackId: 'TR_video1' },
      ));
    it('startTrackEgress', () =>
      api.egress.startTrackEgress(
        'test-room',
        new DirectFileOutput({ filepath: 'track.mp4', output: s3() }),
        'TR_video1',
      ));
    it('updateLayout', () => api.egress.updateLayout('EG_abc123', 'speaker'));
    it('updateStream', () =>
      api.egress.updateStream(
        'EG_abc123',
        ['rtmps://b.example.com/live/key'],
        ['rtmps://a.example.com/live/key'],
      ));
    it('listEgress', () =>
      api.egress.listEgress({ roomName: 'test-room', egressId: 'EG_abc123', active: true }));
    it('stopEgress', () => api.egress.stopEgress('EG_abc123'));
  });

  describe('ingress (smoke)', () => {
    it('createIngress', () =>
      api.ingress.createIngress(IngressInput.RTMP_INPUT, {
        name: 'stream-input',
        roomName: 'test-room',
        participantIdentity: 'ingress-bot',
        participantName: 'Live Stream',
        participantMetadata: JSON.stringify({ source: 'rtmp' }),
        enableTranscoding: true,
        audio: new IngressAudioOptions({
          name: 'audio',
          encodingOptions: { case: 'preset', value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS },
        }),
        video: new IngressVideoOptions({
          name: 'video',
          encodingOptions: {
            case: 'preset',
            value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
          },
        }),
      }));
    it('updateIngress', () =>
      api.ingress.updateIngress('IN_abc123', {
        name: 'stream-input-v2',
        roomName: 'test-room',
        participantIdentity: 'ingress-bot',
        participantName: 'Live Stream',
        enableTranscoding: true,
      }));
    it('listIngress', () =>
      api.ingress.listIngress({ roomName: 'test-room', ingressId: 'IN_abc123' }));
    it('deleteIngress', () => api.ingress.deleteIngress('IN_abc123'));
  });

  describe('sip (smoke)', () => {
    it('createSipInboundTrunk', () =>
      api.sip.createSipInboundTrunk('inbound-trunk', ['+15105550100'], {
        metadata: JSON.stringify({ provider: 'telco' }),
        allowedAddresses: ['203.0.113.0/24'],
        allowedNumbers: ['+15105550111'],
        authUsername: 'sip-user',
        authPassword: 'sip-pass',
        includeHeaders: SIPHeaderOptions.SIP_X_HEADERS,
        krispEnabled: true,
        media: new SIPMediaConfig({ encryption: SIPMediaEncryption.SIP_MEDIA_ENCRYPT_ALLOW }),
        ringingTimeout: 30,
      }));
    it('createSipOutboundTrunk', () =>
      api.sip.createSipOutboundTrunk('outbound-trunk', 'sip.telco.example.com', ['+15105550100'], {
        transport: SIPTransport.SIP_TRANSPORT_TLS,
        metadata: JSON.stringify({ provider: 'telco' }),
        authUsername: 'sip-user',
        authPassword: 'sip-pass',
        destinationCountry: 'US',
      }));
    it('updateSipInboundTrunk', () =>
      api.sip.updateSipInboundTrunk(
        'ST_abc123',
        new SIPInboundTrunkInfo({
          sipTrunkId: 'ST_abc123',
          name: 'inbound-v2',
          numbers: ['+15105550100'],
          authUsername: 'sip-user',
          authPassword: 'sip-pass',
        }),
      ));
    it('updateSipOutboundTrunk', () =>
      api.sip.updateSipOutboundTrunk(
        'ST_abc123',
        new SIPOutboundTrunkInfo({
          sipTrunkId: 'ST_abc123',
          name: 'outbound-v2',
          address: 'sip.telco.example.com',
          numbers: ['+15105550100'],
          transport: SIPTransport.SIP_TRANSPORT_TLS,
        }),
      ));
    it('listSipInboundTrunk', () =>
      api.sip.listSipInboundTrunk({ trunkIds: ['ST_abc123'], numbers: ['+15105550100'] }));
    it('listSipOutboundTrunk', () => api.sip.listSipOutboundTrunk({ trunkIds: ['ST_abc123'] }));
    it('listSipTrunk', () => api.sip.listSipTrunk());
    it('deleteSipTrunk', () => api.sip.deleteSipTrunk('ST_abc123'));
    it('createSipDispatchRule', () =>
      api.sip.createSipDispatchRule(
        { type: 'direct', roomName: 'support', pin: '1234' },
        {
          name: 'direct-to-support',
          metadata: JSON.stringify({ team: 'support' }),
          trunkIds: ['ST_abc123'],
          hidePhoneNumber: false,
          attributes: { source: 'pstn' },
        },
      ));
    it('updateSipDispatchRule', () =>
      api.sip.updateSipDispatchRule(
        'SDR_abc123',
        new SIPDispatchRuleInfo({
          sipDispatchRuleId: 'SDR_abc123',
          name: 'direct-v2',
          trunkIds: ['ST_abc123'],
          rule: new SIPDispatchRule({
            rule: {
              case: 'dispatchRuleDirect',
              value: new SIPDispatchRuleDirect({ roomName: 'support', pin: '1234' }),
            },
          }),
        }),
      ));
    it('listSipDispatchRule', () =>
      api.sip.listSipDispatchRule({ dispatchRuleIds: ['SDR_abc123'], trunkIds: ['ST_abc123'] }));
    it('deleteSipDispatchRule', () => api.sip.deleteSipDispatchRule('SDR_abc123'));
  });

  describe('connector (smoke)', () => {
    it('dialWhatsAppCall', () =>
      api.connector.dialWhatsAppCall({
        whatsappPhoneNumberId: '123456789012345',
        whatsappToPhoneNumber: '+15105550100',
        whatsappApiKey: 'wa-secret-key',
        whatsappCloudApiVersion: '23.0',
        roomName: 'test-room',
        participantIdentity: 'whatsapp-caller',
        participantName: 'WhatsApp Caller',
        destinationCountry: 'US',
        ringingTimeout: 30,
      }));
    it('acceptWhatsAppCall', () =>
      api.connector.acceptWhatsAppCall({
        whatsappPhoneNumberId: '123456789012345',
        whatsappApiKey: 'wa-secret-key',
        whatsappCloudApiVersion: '23.0',
        whatsappCallId: 'wacid.HBgLABC',
        sdp: new SessionDescription({ type: 'answer', sdp: 'v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\n' }),
        roomName: 'test-room',
        participantIdentity: 'whatsapp-callee',
      }));
    it('connectWhatsAppCall', () =>
      api.connector.connectWhatsAppCall(
        'wacid.HBgLABC',
        new SessionDescription({ type: 'offer', sdp: 'v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\n' }),
      ));
    it('disconnectWhatsAppCall', () =>
      api.connector.disconnectWhatsAppCall(
        'wacid.HBgLABC',
        'wa-secret-key',
        DisconnectWhatsAppCallRequest_DisconnectReason.BUSINESS_INITIATED,
      ));
    it('connectTwilioCall', () =>
      api.connector.connectTwilioCall({
        twilioCallDirection: ConnectTwilioCallRequest_TwilioCallDirection.INBOUND,
        roomName: 'test-room',
        participantIdentity: 'twilio-caller',
        destinationCountry: 'US',
      }));
  });

  describe('agentDispatch (smoke)', () => {
    it('createDispatch', () =>
      api.agentDispatch.createDispatch('test-room', 'inbound-agent', {
        metadata: JSON.stringify({ lang: 'en' }),
        restartPolicy: JobRestartPolicy.JRP_ON_FAILURE,
      }));
    it('getDispatch', () => api.agentDispatch.getDispatch('AD_abc123', 'test-room'));
    it('listDispatch', () => api.agentDispatch.listDispatch('test-room'));
    it('deleteDispatch', () => api.agentDispatch.deleteDispatch('AD_abc123', 'test-room'));
  });

  // CreateRoom in depth: the mock echoes request fields into the response.
  describe('createRoom (deep)', () => {
    it('echoes request fields', async () => {
      const room = await api.room.createRoom({
        name: 'echo-room',
        metadata: JSON.stringify({ scene: 'lobby' }),
        emptyTimeout: 300,
        maxParticipants: 50,
      });
      expect(room.name).toBe('echo-room');
      expect(room.metadata).toBe(JSON.stringify({ scene: 'lobby' }));
      expect(room.emptyTimeout).toBe(300);
      expect(room.maxParticipants).toBe(50);
      expect(room.sid).not.toBe(''); // placeholder assigned by the mock
    });

    it('propagates twirp errors', async () => {
      await expect(
        withMock({ failRegions: [0], failStatus: 400, failTwirpCode: 'invalid_argument' }, () =>
          api.room.createRoom({ name: 'test-room' }),
        ),
      ).rejects.toMatchObject({ code: 'invalid_argument' });
    });
  });

  // createSipParticipant/transferSipParticipant block until answered in the mock,
  // so skip that wait with delayMs:0 except in the dial-timeout test.
  describe('sip participant (deep)', () => {
    it('createSipParticipant echoes fields', async () => {
      const p = await api.sip.createSipParticipant('ST_abc123', '+15105550100', 'test-room', {
        participantIdentity: 'sip-caller',
        participantName: 'SIP Caller',
        participantMetadata: JSON.stringify({ source: 'pstn' }),
        dtmf: '1234#',
        playDialtone: true,
        maxCallDuration: 3600,
      });
      expect(p.roomName).toBe('test-room');
      expect(p.participantIdentity).toBe('sip-caller');
    });

    it('createSipParticipant waitUntilAnswered', () =>
      withMock({ delayMs: 0 }, () =>
        api.sip.createSipParticipant('ST_abc123', '+15105550100', 'test-room', {
          waitUntilAnswered: true,
          ringingTimeout: 2,
        }),
      ));

    it('transferSipParticipant', () =>
      withMock({ delayMs: 0 }, () =>
        api.sip.transferSipParticipant('test-room', 'sip-caller', 'tel:+15105550122', {
          playDialtone: true,
          ringingTimeout: 2,
        }),
      ));
  });

  // A pre-signed token is sent verbatim (no secret), enabling client-side use.
  it('authenticates with a pre-signed token', async () => {
    const at = new AccessToken(TEST_API_KEY, TEST_API_SECRET);
    at.addGrant({ roomCreate: true });
    const token = await at.toJwt();

    const tokenApi = new LiveKitAPI(BASE, { token });
    const room = await tokenApi.room.createRoom({ name: 'token-room' });
    expect(room.name).toBe('token-room');
  });

  // SIP dialing must outlast ringing: when the answer takes longer than the dial
  // budget (ringing timeout + margin) the call times out, while a prompt answer
  // within the budget succeeds.
  describe('sip dial timeout', () => {
    it('times out when the answer exceeds the dial budget', async () => {
      // ringing 1s -> ~3s request budget; the mock delays the answer past it.
      const err = await withMock({ delayMs: 4000 }, () =>
        api.sip.createSipParticipant('ST_abc123', '+15105550100', 'test-room', {
          waitUntilAnswered: true,
          ringingTimeout: 1,
        }),
      ).catch((e: unknown) => e);
      expect((err as Error).name).toBe('TimeoutError');
      expect(err).not.toBeInstanceOf(TwirpError);
    });

    it('succeeds within the dial budget', () =>
      withMock({ delayMs: 200 }, () =>
        api.sip.createSipParticipant('ST_abc123', '+15105550100', 'test-room', {
          waitUntilAnswered: true,
        }),
      ));
  });

  // A failed dial surfaces the SIP response status as a SipCallError, whose
  // getters expose the SIP code/reason while the generic Twirp code is preserved.
  describe('sip call errors', () => {
    it('surfaces a busy signal (resource_exhausted)', async () => {
      const err = await withMock({ sipStatus: { code: 486, status: 'Busy Here' } }, () =>
        api.sip.createSipParticipant('ST_abc123', '+15105550100', 'test-room'),
      ).catch((e: unknown) => e);

      expect(err).toBeInstanceOf(SipCallError);
      expect(err).toBeInstanceOf(TwirpError);
      const sipErr = err as SipCallError;
      expect(sipErr.code).toBe('resource_exhausted');
      expect(sipErr.sipStatusCode).toBe(486);
      expect(sipErr.sipStatus).toBe('Busy Here');
      // printable representation makes the failure clear
      expect(sipErr.name).toBe('SipCallError');
      expect(String(sipErr)).toContain('486');
      expect(String(sipErr)).toContain('Busy Here');
    });

    it('surfaces a carrier decline (permission_denied)', async () => {
      const err = await withMock({ sipStatus: { code: 603 } }, () =>
        api.sip.createSipParticipant('ST_abc123', '+15105550100', 'test-room'),
      ).catch((e: unknown) => e);

      expect(err).toBeInstanceOf(SipCallError);
      const sipErr = err as SipCallError;
      expect(sipErr.code).toBe('permission_denied');
      expect(sipErr.sipStatusCode).toBe(603);
    });

    it('surfaces SIP errors from transferSipParticipant', async () => {
      // delayMs:0 skips transfer's built-in answer latency so the failure is immediate.
      const err = await withMock(
        { delayMs: 0, sipStatus: { code: 486, status: 'Busy Here' } },
        () => api.sip.transferSipParticipant('test-room', 'sip-caller', 'tel:+15105550122'),
      ).catch((e: unknown) => e);

      expect(err).toBeInstanceOf(SipCallError);
      expect((err as SipCallError).sipStatusCode).toBe(486);
    });
  });
});
