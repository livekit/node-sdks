import * as jwt from 'jsonwebtoken';
import { AccessToken } from './AccessToken';

const testApiKey = 'abcdefg';
const testSecret = 'abababa';

describe('encoded tokens are valid', () => {
  const t = new AccessToken(testApiKey, testSecret, {
    identity: 'me',
  });
  t.addGrant({ room: 'myroom' });
  const token = t.toJwt();

  const decoded = <any>jwt.verify(token, testSecret, { jwtid: 'me' });
  it('can be decoded', () => {
    expect(decoded).not.toBe(undefined);
  });

  it('has video grants set', () => {
    expect(decoded.video).toBeTruthy();
    expect(decoded.video.room).toEqual('myroom');
  });
});

describe('identity is required for only join grants', () => {
  it('allows empty identity for create', () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.addGrant({ roomCreate: true });

    expect(t.toJwt()).toBeTruthy();
  });
  it('throws error when identity is not provided for join', () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.addGrant({ roomJoin: true });

    expect(() => {
      t.toJwt();
    }).toThrow();
  });
});
