// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import * as jose from 'jose';
import { describe, expect, it } from 'vitest';
import { AccessToken, TokenVerifier } from './AccessToken';
import type { ClaimGrants } from './grants';

const testApiKey = 'abcdefg';
const testSecret = 'abababa';

describe('encoded tokens are valid', () => {
  const t = new AccessToken(testApiKey, testSecret, {
    identity: 'me',
    name: 'myname',
  });
  t.addGrant({ room: 'myroom' });
  const EncodedTestSecret = new TextEncoder().encode(testSecret);
  it('can be decoded', async () => {
    const { payload } = await jose.jwtVerify(await t.toJwt(), EncodedTestSecret, {
      issuer: testApiKey,
    });

    expect(payload).not.toBe(undefined);
  });

  it('has name set', async () => {
    const { payload } = await jose.jwtVerify(await t.toJwt(), EncodedTestSecret, {
      issuer: testApiKey,
    });

    expect(payload.name).toBe('myname');
  });

  it('has video grants set', async () => {
    const { payload } = await jose.jwtVerify(await t.toJwt(), EncodedTestSecret, {
      issuer: testApiKey,
    });

    expect(payload.video).toBeTruthy();
    expect((payload as ClaimGrants).video?.room).toEqual('myroom');
  });
});

describe('identity is required for only join grants', () => {
  it('allows empty identity for create', async () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.addGrant({ roomCreate: true });

    expect(await t.toJwt()).toBeTruthy();
  });
  it('throws error when identity is not provided for join', async () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.addGrant({ roomJoin: true });

    await expect(async () => {
      await t.toJwt();
    }).rejects.toThrow();
  });
});

describe('verify token is valid', () => {
  it('can decode encoded token', async () => {
    const t = new AccessToken(testApiKey, testSecret);
    t.sha256 = 'abcdefg';
    t.kind = 'agent';
    t.addGrant({ roomCreate: true });
    t.attributes = { foo: 'bar', live: 'kit' };

    const v = new TokenVerifier(testApiKey, testSecret);
    const decoded = await v.verify(await t.toJwt());

    expect(decoded).not.toBe(undefined);
    expect(decoded.sha256).toEqual('abcdefg');
    expect(decoded.video?.roomCreate).toBeTruthy();
    expect(decoded.kind).toEqual('agent');
    expect(decoded.attributes).toEqual(t.attributes);
  });
});

describe('adding grants should not overwrite existing grants', () => {
  const EncodedTestSecret = new TextEncoder().encode(testSecret);

  it('should not overwrite existing grants', async () => {
    const t = new AccessToken(testApiKey, testSecret, {
      identity: 'me',
      name: 'myname',
    });
    t.addGrant({ roomCreate: true });
    t.addGrant({ roomJoin: true });

    const { payload }: jose.JWTVerifyResult<ClaimGrants> = await jose.jwtVerify(
      await t.toJwt(),
      EncodedTestSecret,
      { issuer: testApiKey },
    );
    expect(payload.video?.roomCreate).toBeTruthy();
    expect(payload.video?.roomJoin).toBeTruthy();
  });
});
