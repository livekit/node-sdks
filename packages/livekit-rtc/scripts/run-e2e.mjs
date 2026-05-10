// Spins up `livekit-server --dev` with a known dev key, runs the e2e
// vitest suite against it, then tears the server down on exit.
//
// Requires `livekit-server` on PATH.
import { spawn } from 'node:child_process';
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

const KEYS = 'devkey: secret';
const HOST = '127.0.0.1';
const PORT = 7880;
const URL = `ws://${HOST}:${PORT}`;
const API_KEY = 'devkey';
const API_SECRET = 'secret';

async function tcpReady(host, port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ok = await new Promise((resolve) => {
      const s = net.createConnection({ host, port });
      s.once('connect', () => {
        s.end();
        resolve(true);
      });
      s.once('error', () => resolve(false));
    });
    if (ok) return;
    await delay(200);
  }
  throw new Error(`livekit-server not reachable at ${host}:${port} within ${timeoutMs}ms`);
}

async function isPortOpen(host, port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ host, port });
    s.once('connect', () => {
      s.end();
      resolve(true);
    });
    s.once('error', () => resolve(false));
  });
}

const reuseExisting = await isPortOpen(HOST, PORT);
let server;
let serverExited = !reuseExisting ? false : true;
if (reuseExisting) {
  console.log(`[run-e2e] reusing existing livekit-server on ${HOST}:${PORT}`);
} else {
  server = spawn('livekit-server', ['--dev'], {
    env: { ...process.env, LIVEKIT_KEYS: KEYS },
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  server.on('exit', (code, signal) => {
    serverExited = true;
    if (code && code !== 0 && signal !== 'SIGTERM') {
      console.error(`livekit-server exited unexpectedly: code=${code} signal=${signal}`);
    }
  });
}

let testProc;
const stopServer = () => {
  if (server && !serverExited) server.kill('SIGTERM');
};
const onSignal = (sig) => {
  if (testProc && !testProc.killed) testProc.kill(sig);
  stopServer();
};
process.on('SIGINT', () => onSignal('SIGINT'));
process.on('SIGTERM', () => onSignal('SIGTERM'));

try {
  await tcpReady(HOST, PORT, 15_000);

  const args = ['exec', 'vitest', 'run', 'src/tests/e2e.test.ts', ...process.argv.slice(2)];
  testProc = spawn('pnpm', args, {
    env: {
      ...process.env,
      LIVEKIT_URL: URL,
      LIVEKIT_API_KEY: API_KEY,
      LIVEKIT_API_SECRET: API_SECRET,
    },
    stdio: 'inherit',
  });
  const code = await new Promise((resolve) => testProc.on('exit', resolve));
  process.exitCode = code ?? 0;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  stopServer();
}
