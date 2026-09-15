// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import {
  type RpcCallInfo,
  RpcError,
  type RpcInterceptor,
  type RpcInvocationData,
  chainIncoming,
  chainOutgoing,
} from './rpc.js';

const call: RpcCallInfo = {
  destinationIdentity: 'callee',
  method: 'greet',
  payload: 'hi',
  responseTimeout: 1000,
};

const invocation: RpcInvocationData = {
  requestId: 'req-1',
  callerIdentity: 'caller',
  payload: 'hi',
  responseTimeout: 1000,
  method: 'greet',
};

/** An interceptor that records when it runs, in both directions. */
function recording(name: string, log: string[]): RpcInterceptor {
  return {
    async interceptOutgoing(c, next) {
      log.push(`${name}:out:before`);
      try {
        return await next(c);
      } finally {
        log.push(`${name}:out:after`);
      }
    },
    async interceptIncoming(inv, next) {
      log.push(`${name}:in:before`);
      try {
        return await next(inv);
      } finally {
        log.push(`${name}:in:after`);
      }
    },
  };
}

describe('rpc interceptor chains', () => {
  it('runs interceptors in registration order, the first outermost', async () => {
    const log: string[] = [];
    const perform = chainOutgoing([recording('a', log), recording('b', log)], async (c) => {
      log.push(`terminal:${c.method}`);
      return 'pong';
    });
    await expect(perform(call)).resolves.toBe('pong');
    expect(log).toEqual([
      'a:out:before',
      'b:out:before',
      'terminal:greet',
      'b:out:after',
      'a:out:after',
    ]);

    log.length = 0;
    const handle = chainIncoming([recording('a', log), recording('b', log)], async (inv) => {
      log.push(`terminal:${inv.method}`);
      return 'pong';
    });
    await expect(handle(invocation)).resolves.toBe('pong');
    expect(log).toEqual([
      'a:in:before',
      'b:in:before',
      'terminal:greet',
      'b:in:after',
      'a:in:after',
    ]);
  });

  it('passes through interceptors that do not implement a direction', async () => {
    const seen: string[] = [];
    const outgoingOnly: RpcInterceptor = {
      async interceptOutgoing(c, next) {
        seen.push('outgoing');
        return next(c);
      },
    };
    await expect(chainOutgoing([outgoingOnly, {}], async () => 'ok')(call)).resolves.toBe('ok');
    await expect(chainIncoming([outgoingOnly, {}], async () => 'ok')(invocation)).resolves.toBe(
      'ok',
    );
    expect(seen).toEqual(['outgoing']);
  });

  it('is the terminal alone when there are no interceptors', async () => {
    const terminal = async () => 'ok';
    expect(chainOutgoing([], terminal)).toBe(terminal);
    expect(chainIncoming([], terminal)).toBe(terminal);
  });

  it('lets an interceptor hand a modified call to the next step', async () => {
    const addHeader: RpcInterceptor = {
      async interceptOutgoing(c, next) {
        return next({ ...c, payload: JSON.stringify({ traceparent: 'abc', body: c.payload }) });
      },
    };
    let received: RpcCallInfo | undefined;
    await chainOutgoing([addHeader], async (c) => {
      received = c;
      return '';
    })(call);
    expect(received).toEqual({ ...call, payload: '{"traceparent":"abc","body":"hi"}' });
  });

  it('lets an interceptor short-circuit the call', async () => {
    let terminalRan = false;
    const cached: RpcInterceptor = {
      async interceptOutgoing() {
        return 'from-cache';
      },
    };
    await expect(
      chainOutgoing([cached], async () => {
        terminalRan = true;
        return 'from-remote';
      })(call),
    ).resolves.toBe('from-cache');
    expect(terminalRan).toBe(false);
  });

  it('propagates errors from the terminal through every interceptor unchanged', async () => {
    const seen: unknown[] = [];
    const observe: RpcInterceptor = {
      async interceptIncoming(inv, next) {
        try {
          return await next(inv);
        } catch (error) {
          seen.push(error);
          throw error;
        }
      },
    };
    const unsupported = RpcError.builtIn('UNSUPPORTED_METHOD');
    await expect(
      chainIncoming([observe, observe], async () => {
        throw unsupported;
      })(invocation),
    ).rejects.toBe(unsupported);
    // both layers saw the same RpcError, with its built-in code intact
    expect(seen).toEqual([unsupported, unsupported]);
    expect((seen[0] as RpcError).code).toBe(RpcError.ErrorCode.UNSUPPORTED_METHOD);

    const boom = new Error('handler exploded');
    await expect(
      chainIncoming([observe], async () => {
        throw boom;
      })(invocation),
    ).rejects.toBe(boom);
  });

  it('binds `this` so class-based interceptors can use their own state', async () => {
    class Counter implements RpcInterceptor {
      calls = 0;
      async interceptOutgoing(c: RpcCallInfo, next: (c: RpcCallInfo) => Promise<string>) {
        this.calls++;
        return next(c);
      }
    }
    const counter = new Counter();
    const perform = chainOutgoing([counter], async () => 'ok');
    await perform(call);
    await perform(call);
    expect(counter.calls).toBe(2);
  });
});
