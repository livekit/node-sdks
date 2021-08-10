import { AccessToken } from './AccessToken';
import { WebhookEvent } from './proto/livekit_webhook';
import { WebhookReceiver } from './WebhookReceiver';

const testApiKey = 'abcdefg';
const testSecret = 'abababa';

describe('webhook receiver', () => {
  const body = '{"type":"room_started", "room":{"sid":"RM_TkVjUvAqgzKz", "name":"mytestroom", "emptyTimeout":300, "creationTime":"1628545903", "turnPassword":"ICkSr2rEeslkN6e9bXL4Ji5zzMD5Z7zzr6ulOaxMj6N", "enabledCodecs":[{"mime":"audio/opus"}, {"mime":"video/VP8"}]}}';
  const sha = 'GtHiN0xN5VL9eINaNRBBqBv6uwcN6paHVeW0joe0iFY=';
  const t = new AccessToken(testApiKey, testSecret);
  t.sha256 = sha;
  const token = t.toJwt();
  const receiver = new WebhookReceiver(testApiKey, testSecret);

  it('should receive and decode WebhookEvent', () => {
    const event = receiver.receive(body, token);
    expect(event).toBeTruthy();
    expect(event.room?.name).toBe('mytestroom');
    expect(event.type).toBe('room_started');
  });
});

describe('decoding json payload', () => {
  it('should allow server to return extra fields', () => {
    const obj = {
      type: 'room_started',
      room: {
        sid: 'RM_TkVjUvAqgzKz',
        name: 'mytestroom',
      },
      extra: 'extra',
    };

    const event = WebhookEvent.fromJSON(obj);
    expect(event).toBeTruthy();
    expect(event.room?.name).toBe('mytestroom');
  });
});
