import * as jwt from 'jsonwebtoken';
import { AccessToken } from './AccessToken';

const testApiKey = 'abcdefg';
const testSecret = 'abababa';

test('encodes valid access tokens', () => {
  const t = new AccessToken(testApiKey, testSecret, {
    identity: 'me',
  });
  t.addGrant({ room: 'myroom' });
  const token = t.toJwt();

  const decoded = <any>jwt.verify(token, testSecret, { jwtid: 'me' });
  expect(decoded).not.toBe(undefined);
  expect(decoded.video).toBeTruthy;
  expect(decoded.video.room).toEqual('myroom');
});
