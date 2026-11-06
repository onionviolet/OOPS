// Injected at document start by the Tauri host (YAIRPG_HARNESS_SCRIPT), after
// the driver prepends `window.__harness = {...}`. Synthetic saves only.
(() => {
  const cfg = window.__harness;
  const errors = [];
  // CPU probe: the same loop is about 0.4 s on this Mac's performance cores in jsc.
  const cpuProbe = () => { const t = performance.now(); let x = 0; for (let i = 0; i < 3e8; i++) x = (x + i * 7) % 1000003; return Math.round(performance.now() - t) + (x < 0 ? 1 : 0); };
  const cpuStartMs = cpuProbe();
  // Call cost during load: storage and JSON, by method.
  const costs = {};
  const wrap = (obj, name, label) => { const orig = obj[name]; obj[name] = function (...a) { const t = performance.now(); try { return orig.apply(this, a); } finally { const c = costs[label] ??= [0, 0]; c[0]++; if (cfg.sample && c[0] % 200 === 0) { const st = (new Error().stack || '').split('\n').slice(1, 5).map(l => l.replace(/@.*\//, '@')).join(' < '); const m = (window.__samples ??= {})[label] ??= {}; m[st] = (m[st] || 0) + 1; } c[1] += performance.now() - t; } }; };
  wrap(Storage.prototype, 'getItem', 'storage.getItem'); wrap(Storage.prototype, 'setItem', 'storage.setItem');
  wrap(JSON, 'parse', 'JSON.parse'); wrap(JSON, 'stringify', 'JSON.stringify');
  if (window.structuredClone) wrap(window, 'structuredClone', 'structuredClone');
  if (cfg.normalizeVisibility) {
    Object.defineProperty(document, 'hidden', {get: () => false});
    Object.defineProperty(document, 'visibilityState', {get: () => 'visible'});
  }
  window.addEventListener('error', e => errors.push(String(e.message)));
  window.addEventListener('unhandledrejection', e => errors.push(String(e.reason)));
  const send = data => fetch(cfg.report, {method: 'POST', body: JSON.stringify({...data, at: Date.now()})}).catch(() => {});
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const shown = el => el && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0;
  const wait = async (fn, label) => {
    const start = performance.now();
    while (!fn()) { if (performance.now() - start > 90000) throw Error('Timed out: ' + label); await delay(25); }
  };
  const save = () => JSON.parse(localStorage.getItem('save data'));
  const clock = () => { const t = save()?.['current time']; return t ? (t.day_count * 24 + t.hour) * 60 + t.minute : null; };
  if (cfg.phase === 'first') localStorage.setItem('save data', JSON.stringify(cfg.fixture));
  // Loading trace: status text changes and main-thread blocks over 250 ms.
  const trace = {status: [], blocks: []};
  let beat = performance.now(), lastStatus = null;
  const beatTimer = setInterval(() => {
    const now = performance.now();
    if (now - beat > 250) trace.blocks.push([Math.round(beat), Math.round(now - beat)]);
    beat = now;
    const text = document.getElementById('loading_screen_status')?.textContent?.trim().slice(0, 80) ?? null;
    if (text !== lastStatus) { trace.status.push([Math.round(now), text]); lastStatus = text; }
  }, 50);
  const ready = async () => {
    await wait(() => shown(document.querySelector('#loading_screen_play_button:not(.none_display)')), 'PLAY');
    const playMs = performance.now();
    clearInterval(beatTimer);
    const res = performance.getEntriesByType('resource');
    trace.resources = {count: res.length, slowest: res.sort((a, b) => b.duration - a.duration).slice(0, 8).map(r => [r.name.split('/').slice(-2).join('/'), Math.round(r.startTime), Math.round(r.duration)])};
    await send({type: 'loading-trace', samples: window.__samples, costs: Object.fromEntries(Object.entries(costs).map(([k, [n, ms]]) => [k, [n, Math.round(ms)]])), cpuStartMs, cpuAfterMs: cpuProbe(), ...trace});
    document.querySelector('#loading_screen_play_button').click();
    const ws = () => shown(document.querySelector('#location_actions_div .location_choice_dropdown'));
    await wait(() => shown(document.querySelector('#hero_creation_panel_confirmation')) || ws(), 'workspace');
    if (shown(document.querySelector('#hero_creation_panel_confirmation'))) document.querySelector('#hero_creation_panel_confirmation').click();
    await wait(() => ws() && typeof window.saveProgress === 'function', 'ready');
    return playMs;
  };
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const domMs = performance.now();
      const playMs = await ready();
      if (cfg.phase === 'relaunch') {
        const s = save();
        await send({type: 'relaunched', clock: clock(), name: s?.character?.name, readyMs: performance.now(), errors});
        await send({type: 'done'});
        return;
      }
      window.saveProgress();
      await send({type: 'ready', domMs, playMs, readyMs: performance.now(), viewport: [innerWidth, innerHeight],
        visibility: document.visibilityState, userAgent: navigator.userAgent, clock: clock(), errors});
      await delay(4000);
      const lags = [];
      let last = performance.now();
      const timer = setInterval(() => { const now = performance.now(); lags.push(Math.max(0, now - last - 100)); last = now; }, 100);
      const c0 = clock(), t0 = performance.now();
      await delay(cfg.idleMs);
      window.saveProgress();
      clearInterval(timer);
      const idleWallMs = performance.now() - t0;
      await send({type: 'idle', clockStart: c0, clockEnd: clock(), idleWallMs, lags, errors});
      const saveMs = [];
      for (let i = 0; i < 5; i++) {
        const t = performance.now(); document.querySelector('#save_button').click(); saveMs.push(performance.now() - t);
        await delay(300);
      }
      const s = save();
      await send({type: 'saved', saveMs, saveBytes: new TextEncoder().encode(JSON.stringify(s)).length,
        clock: clock(), name: s.character.name, errors});
      await send({type: 'done'});
      if (cfg.exit === 'clean') fetch('/__harness/exit', {method: 'POST'});
    } catch (error) { await send({type: 'failed', error: String(error), errors}); await send({type: 'done'}); }
  });
})();
