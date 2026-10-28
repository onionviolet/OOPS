#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const CODEX = '/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex';
export const STRIPPED_KEYS = ['OPENAI_API_KEY', 'CODEX_API_KEY', 'ANTHROPIC_API_KEY'];

export function laneRecord({ lane, pid, session_id = null, cwd, brief, model, effort, log, last_message }) {
  return { lane, pid, session_id, started_at: new Date().toISOString(), cwd, brief, model, effort, log, last_message };
}

export function stripApiKeys(env) {
  const clean = { ...env };
  for (const key of STRIPPED_KEYS) delete clean[key];
  return clean;
}

export function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!['preflight', 'launch', 'resume', 'status'].includes(command)) throw new Error('usage: codex_lane.mjs preflight | launch <lane-id> <brief.md> --model <m> --effort <e> | resume <lane-id> <message.md> | status');
  if (command === 'preflight' || command === 'status') {
    if (rest.length) throw new Error(`${command} takes no arguments`);
    return { command };
  }
  if (rest.length < 2) throw new Error(`${command} requires lane-id and ${command === 'launch' ? 'brief.md' : 'message.md'}`);
  const [lane, file, ...opts] = rest;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(lane)) throw new Error('invalid lane-id');
  const options = {};
  for (let i = 0; i < opts.length; i++) {
    if (!['--model', '--effort'].includes(opts[i]) || !opts[i + 1]) throw new Error(`invalid option: ${opts[i]}`);
    options[opts[i].slice(2)] = opts[++i];
  }
  if (command === 'launch' && (!options.model || !options.effort)) throw new Error('launch requires --model and --effort');
  if (command === 'resume' && Object.keys(options).length) throw new Error('resume takes no options');
  return { command, lane, file, ...options };
}

function rpcPreflight() {
  return new Promise((resolve, reject) => {
    const proc = spawn(CODEX, ['app-server'], { stdio: ['pipe', 'pipe', 'pipe'] });
    let buffer = '';
    let stderr = '';
    const replies = {};
    const timer = setTimeout(() => { proc.kill(); reject(new Error('Codex app-server preflight timed out')); }, 20000);
    const send = (message) => proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);
    const finish = () => {
      clearTimeout(timer);
      const account = replies.account?.result?.account?.type;
      const limits = replies.limits?.result;
      proc.kill();
      if (replies.account?.error || replies.limits?.error) return reject(new Error(replies.account?.error?.message || replies.limits?.error?.message || 'Codex usage query failed'));
      const windows = Object.values(limits?.rateLimitsByLimitId || {}).flatMap((v) => [v?.primary?.usedPercent, v?.secondary?.usedPercent]).filter(Number.isFinite);
      if (account !== 'chatgpt') return reject(new Error(`account type is ${account || 'unknown'}, expected chatgpt`));
      if (limits?.ordinaryUsageAllowed !== true || limits?.rateLimitReachedType) return reject(new Error('ordinary Codex usage is unavailable'));
      if (!windows.length) return reject(new Error('Codex usage windows were not returned'));
      if (windows.some((used) => used >= 100)) return reject(new Error('a Codex usage window is at 100%'));
      resolve(`PASS account=chatgpt ordinary-usage=allowed windows-under-100=${windows.length}`);
    };
    proc.on('error', (e) => { clearTimeout(timer); reject(e); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('exit', (code) => {
      if (!replies.account || !replies.limits) {
        clearTimeout(timer);
        reject(new Error(`Codex app-server exited before replying (${code}): ${stderr.trim() || 'no diagnostic'}`));
      }
    });
    proc.stdout.on('data', (chunk) => {
      buffer += chunk;
      let end;
      while ((end = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
        let msg; try { msg = JSON.parse(line); } catch { continue; }
        if (msg.id === 1) {
          send({ method: 'initialized' });
          send({ id: 2, method: 'account/read', params: { refreshToken: false } });
          send({ id: 3, method: 'account/rateLimits/read', params: { excludeResetCreditDetails: true, supportsLunaReserve: false } });
        } else if (msg.id === 2 || msg.id === 3) {
          replies[msg.id === 2 ? 'account' : 'limits'] = msg;
          if (replies.account && replies.limits) finish();
        }
      }
    });
    send({ id: 1, method: 'initialize', params: { clientInfo: { name: 'codex_lane_preflight', version: '1.0' }, capabilities: {} } });
  });
}

function taskRoot() { return path.join(os.homedir(), '.codex', 'lanes', 'protagonist-life-2026-10-27'); }
function safeLane(lane) { if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(lane)) throw new Error('invalid lane-id'); }

async function launchOrResume(args) {
  safeLane(args.lane);
  const briefPath = path.resolve(args.file);
  const brief = await readFile(briefPath, 'utf8');
  const root = taskRoot(), dir = path.join(root, args.lane);
  await mkdir(dir, { recursive: true });
  const recordPath = path.join(dir, 'lane.json');
  let previous = {};
  try { previous = JSON.parse(await readFile(recordPath, 'utf8')); } catch {}
  if (args.command === 'launch') {
    const result = await rpcPreflight(); console.log(result);
    const prompt = `You are a Codex lane in the shared YAIRPG checkout. Your brief is ${briefPath}. Read it and AGENTS.md first, then do exactly that brief. Other sessions edit this checkout: touch only your owned files, do not commit (the Codex sandbox cannot write .git; the coordinating session commits your owned files); never stash, reset, force or push. Finish with a short report: files, checks (command, result, gaps).\n`;
    await writeFile(path.join(dir, 'prompt.md'), prompt);
    const cmd = [CODEX, 'exec', '--json', '-C', process.cwd(), '-s', 'workspace-write', '-m', args.model, '-c', `model_reasoning_effort="${args.effort}"`, '-o', path.join(dir, 'LAST_MESSAGE.md'), '-'];
    const proc = spawn(cmd[0], cmd.slice(1), { cwd: process.cwd(), detached: true, stdio: ['pipe', 'pipe', 'pipe'], env: stripApiKeys(process.env) });
    const record = laneRecord({ lane: args.lane, pid: proc.pid, session_id: previous.session_id || null, cwd: process.cwd(), brief: briefPath, model: args.model, effort: args.effort, log: path.join(dir, 'run.log'), last_message: path.join(dir, 'LAST_MESSAGE.md') });
    await writeFile(recordPath, JSON.stringify(record, null, 2) + '\n');
    const log = await import('node:fs').then(({ createWriteStream }) => createWriteStream(path.join(dir, 'run.log'), { flags: 'a' }));
    let jsonBuffer = '';
    proc.stdout.on('data', (chunk) => {
      log.write(chunk); jsonBuffer += chunk.toString();
      let end;
      while ((end = jsonBuffer.indexOf('\n')) >= 0) {
        const line = jsonBuffer.slice(0, end); jsonBuffer = jsonBuffer.slice(end + 1);
        try {
          const event = JSON.parse(line);
          const session = event.thread_id || event.thread?.id || event.session_id;
          if (session) {
            record.session_id = session;
            void writeFile(recordPath, JSON.stringify(record, null, 2) + '\n');
          }
        } catch {}
      }
    });
    proc.stderr.pipe(log);
    proc.stdin.end(prompt);
    proc.unref(); console.log(`launched ${args.lane} pid=${proc.pid}`); return 0;
  }
  if (!previous.session_id) throw new Error(`no session_id recorded for ${args.lane}; cannot resume safely`);
  // `exec resume` has no -s flag; the config override keeps the original sandbox.
  const codexArgs = ['exec', 'resume', '--json', '-c', 'sandbox_mode="workspace-write"', previous.session_id, '-o', previous.last_message, '-'];
  const env = stripApiKeys(process.env);
  const proc = spawn(CODEX, codexArgs, { cwd: process.cwd(), detached: true, stdio: ['pipe', 'pipe', 'pipe'], env });
  const log = await import('node:fs').then(({ createWriteStream }) => createWriteStream(previous.log, { flags: 'a' }));
  proc.stdout.pipe(log); proc.stderr.pipe(log); proc.stdin.end(brief);
  previous.pid = proc.pid; previous.resumed_at = new Date().toISOString();
  await writeFile(recordPath, JSON.stringify(previous, null, 2) + '\n');
  proc.unref(); console.log(`resumed ${args.lane} pid=${proc.pid} session=${previous.session_id}`); return 0;
}

async function status() {
  const root = taskRoot(); let dirs = [];
  try { dirs = await readdir(root, { withFileTypes: true }); } catch {}
  const rows = [];
  for (const ent of dirs.filter((x) => x.isDirectory())) {
    try {
      const r = JSON.parse(await readFile(path.join(root, ent.name, 'lane.json'), 'utf8'));
      const alive = r.pid && spawnSync('kill', ['-0', String(r.pid)]).status === 0;
      let last = ''; try { last = (await readFile(r.last_message, 'utf8')).trim().split('\n')[0] || ''; } catch {}
      rows.push(`${ent.name}: ${alive ? 'running' : 'exited'}${last ? `; ${last}` : ''}`);
    } catch {}
  }
  console.log(rows.length ? rows.join('\n') : 'No lane records.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.command === 'preflight') console.log(await rpcPreflight());
    else if (args.command === 'status') await status();
    else process.exitCode = await launchOrResume(args);
  } catch (e) { console.error(`codex_lane: ${e.message}`); process.exitCode = 1; }
}
