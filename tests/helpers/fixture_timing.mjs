import {readFileSync, writeFileSync} from 'node:fs';

const now = () => Number(process.hrtime.bigint()) / 1e6;
const cpuNow = () => process.cpuUsage();
const cpuMs = (before, after) => ((after.user - before.user) + (after.system - before.system)) / 1000;

function persist(path, state) {
  writeFileSync(path, JSON.stringify(state, null, 2));
}

export function createFixtureTiming(path, fixture) {
  let state;
  try { state = JSON.parse(readFileSync(path, 'utf8')); }
  catch { state = {schema: 1, fixture, stages: [], active: []}; }
  const stack = [];

  async function measure(name, run, {cpu = true} = {}) {
    const frame = {name, wallStart: now(), cpuStart: cpu ? cpuNow() : null};
    stack.push(frame);
    state.active = stack.map(({name}) => name);
    state.lastReached = name;
    persist(path, state);
    try {
      return await run();
    } catch (error) {
      frame.error = String(error?.message || error);
      throw error;
    } finally {
      const wallMs = now() - frame.wallStart;
      const cpuMsSpent = frame.cpuStart ? Math.round(cpuMs(frame.cpuStart, cpuNow())) : null;
      stack.pop();
      state.stages.push({name, outcome: frame.error ? 'error' : 'ok', wallMs: Math.round(wallMs), cpuMs: cpuMsSpent});
      state.active = stack.map(({name}) => name);
      if (!frame.error) state.lastCompleted = name;
      state.lastEnded = name;
      if (frame.error) state.lastError = {stage: name, message: frame.error};
      persist(path, state);
    }
  }

  function snapshot() {
    try { return JSON.parse(readFileSync(path, 'utf8')); }
    catch { return state; }
  }

  return {measure, snapshot};
}

export function formatFixtureTiming(state) {
  if (!state) return 'stage receipt unavailable';
  const phases = state.stages.map(({name, wallMs, cpuMs}) => `${name} ${wallMs}ms wall${cpuMs == null ? '' : `/${cpuMs}ms CPU`}`).join('; ');
  const active = state.active?.length ? `; active: ${state.active.join(' > ')}` : '';
  const failure = state.lastError ? `; error in ${state.lastError.stage}: ${state.lastError.message}` : '';
  return `${phases || 'no completed stages'}; last completed: ${state.lastCompleted || 'none'}; last reached: ${state.lastReached || 'none'}${active}${failure}`;
}

export function readFixtureTiming(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return null; }
}

export function scheduleFixtureTimingReport(t, path, delayMs) {
  let finished = false;
  const timer = setTimeout(() => {
    if (!finished) t.diagnostic('Fixture timing at worker deadline: ' + formatFixtureTiming(readFixtureTiming(path)));
  }, delayMs);
  timer.unref?.();
  return () => { finished = true; clearTimeout(timer); };
}
