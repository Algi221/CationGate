import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

mkdirSync('.next', { recursive: true });
const log = createWriteStream('.next/dev-monitor.log', { flags: 'a' });
const stamp = () => new Date().toISOString();
const line = (msg) => {
  const out = `[${stamp()}] ${msg}\n`;
  process.stdout.write(out);
  log.write(out);
};

const extraArgs = process.argv.slice(2);
const child = spawn(process.execPath, [
  '--max-old-space-size=8192',
  '--trace-uncaught',
  '--trace-warnings',
  'node_modules/next/dist/bin/next',
  'dev',
  '--hostname',
  '127.0.0.1',
  ...extraArgs,
], {
  env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS || '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

line(`started next dev pid=${child.pid}`);
child.stdout.on('data', (buf) => log.write(buf));
child.stderr.on('data', (buf) => log.write(buf));
child.on('exit', (code, signal) => {
  line(`next dev exited code=${code} signal=${signal}`);
  process.exit(code ?? (signal ? 1 : 0));
});
child.on('error', (err) => {
  line(`next dev spawn error ${err.stack || err}`);
  process.exit(1);
});

for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => {
    line(`monitor received ${sig}; forwarding to next pid=${child.pid}`);
    child.kill(sig);
  });
}

while (true) {
  await delay(5000);
  try {
    const res = await fetch('http://127.0.0.1:3000/health');
    line(`health ${res.status}`);
  } catch (err) {
    line(`health failed ${err?.message || err}`);
  }
}
