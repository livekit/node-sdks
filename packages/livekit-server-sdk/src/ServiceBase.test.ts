// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import * as jose from 'jose';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RoomServiceClient } from './RoomServiceClient.js';
import { ServiceBase, type TokenSource } from './ServiceBase.js';
import { SipClient } from './SipClient.js';
import type { ClaimGrants } from './grants.js';

const testApiKey = 'abcdefg';
const testSecret = 'abababa';

describe('token source', () => {
  it('is called with the grants a call needs, and its token is sent', async () => {
    const tokenSource = vi.fn<TokenSource>(async () => 'source-token');
    const base = new ServiceBase({ tokenSource });

    const header = await base.authHeader({ roomAdmin: true, room: 'myroom' }, { call: true });

    expect(header).toEqual({ Authorization: 'Bearer source-token' });
    expect(tokenSource).toHaveBeenCalledWith({
      video: { roomAdmin: true, room: 'myroom' },
      sip: { call: true },
    });
  });

  it('is used by the service clients', async () => {
    const tokenSource = vi.fn<TokenSource>(async () => 'source-token');
    const fetchMock = vi.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({ participants: [] }), {
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const rooms = new RoomServiceClient('http://localhost:7880', undefined, undefined, {
      tokenSource,
    });
    await rooms.listParticipants('myroom');

    expect(tokenSource).toHaveBeenCalledWith({ video: { roomAdmin: true, room: 'myroom' } });
    const headers = new Headers(fetchMock.mock.calls[0]![1]!.headers);
    expect(headers.get('Authorization')).toEqual('Bearer source-token');

    // SIP calls ask for the SIP grant
    const sip = new SipClient('http://localhost:7880', undefined, undefined, { tokenSource });
    fetchMock.mockImplementationOnce(
      async () =>
        new Response(JSON.stringify({ items: [] }), {
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    await sip.listSipInboundTrunk();
    expect(tokenSource).toHaveBeenLastCalledWith({ video: {}, sip: { admin: true } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
});

describe('API key and secret', () => {
  it('signs each call with the grants it needs', async () => {
    const base = new ServiceBase({ apiKey: testApiKey, secret: testSecret });

    const header = await base.authHeader({ roomAdmin: true, room: 'myroom' });
    const jwt = header.Authorization!.replace('Bearer ', '');
    const { payload } = await jose.jwtVerify<ClaimGrants>(
      jwt,
      new TextEncoder().encode(testSecret),
      { issuer: testApiKey },
    );

    expect(payload.video).toEqual({ roomAdmin: true, room: 'myroom' });
    expect(payload.exp! - payload.nbf!).toEqual(600);
  });
});
