import { AccessToken } from './AccessToken';
import { WebhookEvent } from './proto/livekit_webhook';
import { WebhookReceiver } from './WebhookReceiver';

const testApiKey = 'abcdefg';
const testSecret = 'abababa';

describe('webhook receiver', async () => {
  const body =
    '{"event":"room_started", "room":{"sid":"RM_TkVjUvAqgzKz", "name":"mytestroom", "emptyTimeout":300, "creationTime":"1628545903", "turnPassword":"ICkSr2rEeslkN6e9bXL4Ji5zzMD5Z7zzr6ulOaxMj6N", "enabledCodecs":[{"mime":"audio/opus"}, {"mime":"video/VP8"}]}}';
  const sha = 'CoEQz1chqJ9bnZRcORddjplkvpjmPujmLTR42DbefYI=';
  const t = new AccessToken(testApiKey, testSecret);
  t.sha256 = sha;
  const token = await t.toJwt();
  const receiver = new WebhookReceiver(testApiKey, testSecret);

  it('should receive and decode WebhookEvent', async () => {
    const event = await receiver.receive(body, token);
    expect(event).toBeTruthy();
    expect(event.room?.name).toBe('mytestroom');
    expect(event.event).toBe('room_started');
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
