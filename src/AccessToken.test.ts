import * as jose from 'jose';
import { AccessToken, TokenVerifier } from './AccessToken';

const testApiKey = 'abcdefg';
const testSecret = 'abababa';

describe('encoded tokens are valid', async () => {
  const t = new AccessToken(testApiKey, testSecret, {
    identity: 'me',
    name: 'myname',
  });
  t.addGrant({ room: 'myroom' });
  const token = await t.toJwt();

  const { payload } = await jose.jwtVerify(token, Buffer.from(testSecret), { subject: 'me' });
  it('can be decoded', () => {
    expect(payload).not.toBe(undefined);
  });

  it('has name set', () => {
    expect(payload.name).toBe('myname');
  });

  it('has video grants set', () => {
    expect(payload.video).toBeTruthy();
    // @ts-ignore
    expect(payload.video.room).toEqual('myroom');
  });
});

describe('identity is required for only join grants', () => {
  it('allows empty identity for create', async () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.addGrant({ roomCreate: true });

    expect(await t.toJwt()).toBeTruthy();
  });
  it('throws error when identity is not provided for join', () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.addGrant({ roomJoin: true });

    expect(async () => {
      await t.toJwt();
    }).toThrow();
  });
});

describe('verify token is valid', () => {
  it('can decode encoded token', async () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.sha256 = 'abcdefg';
    t.addGrant({ roomCreate: true });

    const v = new TokenVerifier(testApiKey, testSecret);
    const decoded = v.verify(await t.toJwt());

    expect(decoded).not.toBe(undefined);
    expect(decoded.sha256).toEqual('abcdefg');
    expect(decoded.video?.roomCreate).toBeTruthy();
  });
});
