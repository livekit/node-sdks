// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { SipCallError, ServerError } from './TwirpRPC.js';

describe('SipCallError', () => {
  it('renders the SIP status, Twirp code, and extra metadata', () => {
    const err = SipCallError.fromServerError(
      new ServerError(
        'Too Many Requests',
        'twirp error: sip status 486',
        429,
        'resource_exhausted',
        {
          sip_status_code: '486',
          sip_status: 'Busy Here',
          error_details: 'CAgS...base64...',
          region: 'us-east',
        },
      ),
    );

    expect(err).toBeInstanceOf(ServerError);
    expect(err.name).toBe('SipCallError');
    expect(err.sipStatusCode).toBe(486);
    expect(err.sipStatus).toBe('Busy Here');

    const printed = err.toString();
    expect(printed).toContain('SipCallError');
    expect(printed).toContain('486');
    expect(printed).toContain('Busy Here');
    expect(printed).toContain('resource_exhausted');
    expect(printed).toContain('region=us-east'); // other metadata is surfaced
    expect(printed).not.toContain('error_details'); // opaque blob is omitted
  });

  it('falls back to the original message when there is no SIP status', () => {
    const err = SipCallError.fromServerError(new ServerError('Internal', 'boom', 500, 'internal'));
    expect(err.message).toBe('boom');
  });
});
