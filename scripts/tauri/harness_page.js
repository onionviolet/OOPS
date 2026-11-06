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
  // DOM reads that force layout and DOM writes (--profile): where crowded UI time goes.
  const wrapProp = (proto, name, label, kind) => {
    const d = Object.getOwnPropertyDescriptor(proto, name); if (!d) return;
    const fn = kind === 'set' ? d.set : d.get; if (!fn) return;
    const box = {f: fn}; wrap(box, 'f', label);
    Object.defineProperty(proto, name, {...d, [kind]: function (...a) { return box.f.apply(this, a); }});
  };
  if (cfg.profile) {
    for (const m of ['getBoundingClientRect', 'getClientRects', 'scrollIntoView', 'replaceChildren', 'append', 'insertAdjacentHTML']) wrap(Element.prototype, m, 'Element.' + m);
    for (const m of ['appendChild', 'insertBefore', 'removeChild', 'replaceChild']) wrap(Node.prototype, m, 'Node.' + m);
    wrap(window, 'getComputedStyle', 'getComputedStyle');
    for (const m of ['offsetWidth', 'offsetHeight', 'offsetTop', 'offsetLeft']) wrapProp(HTMLElement.prototype, m, 'HTMLElement.' + m, 'get');
    for (const m of ['scrollHeight', 'scrollWidth', 'clientHeight', 'clientWidth', 'scrollTop']) wrapProp(Element.prototype, m, 'Element.' + m, 'get');
    wrapProp(Element.prototype, 'innerHTML', 'Element.innerHTML=', 'set');
    wrapProp(Node.prototype, 'textContent', 'Node.textContent=', 'set');
    wrapProp(HTMLElement.prototype, 'innerText', 'HTMLElement.innerText=', 'set');
    wrap(Element.prototype, 'setAttribute', 'Element.setAttribute');
  }
  const costSnapshot = () => Object.fromEntries(Object.entries(costs).map(([k, [n, ms]]) => [k, [n, Math.round(ms)]]));
  const resetCosts = () => { for (const k of Object.keys(costs)) delete costs[k]; window.__samples = {}; };
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
  // Recovery page (N1/N2): report what it offers, then restore the newest copy.
  if (location.pathname === '/__host/recover.html') {
    window.addEventListener('DOMContentLoaded', async () => {
      const start = performance.now();
      while (!document.body.dataset.backups && performance.now() - start < 10000) await delay(100);
      await send({type: 'recover', reason: new URLSearchParams(location.search).get('reason'), backups: Number(document.body.dataset.backups || 0),
        heading: document.getElementById('recover_reason')?.textContent});
      const latest = document.querySelector('button[data-backup="latest"]');
      if (cfg.restore && latest) { sessionStorage.setItem('harness-restoring', '1'); latest.click(); }
      else await send({type: 'done'});
    });
    return;
  }
  const restoring = sessionStorage.getItem('harness-restoring');
  if (cfg.phase !== 'relaunch' && !restoring && !sessionStorage.getItem('harness-seeded')) {
    localStorage.setItem('save data', JSON.stringify(cfg.fixture));
    sessionStorage.setItem('harness-seeded', '1');
  }
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
      if (restoring) {
        sessionStorage.removeItem('harness-restoring');
        const s = save();
        await send({type: 'restored', clock: clock(), name: s?.character?.name, errors});
        await send({type: 'done'});
        return;
      }
      if (sessionStorage.getItem('harness-resetting')) {
        sessionStorage.removeItem('harness-resetting');
        await send({type: 'after-reset', clock: clock(), hasSave: !!localStorage.getItem('save data'), errors});
        await send({type: 'done'});
        return;
      }
      if (cfg.phase === 'reset') {
        // N3: hard reset asks through the in-page typed dialog, not window.prompt.
        window.hardReset();
        await wait(() => document.querySelector('dialog.typed-confirm[open]'), 'reset dialog');
        const dialog = document.querySelector('dialog.typed-confirm'), input = dialog.querySelector('input'), [cancel, confirm] = dialog.querySelectorAll('button');
        input.value = 'nope'; input.dispatchEvent(new Event('input'));
        const blockedWrong = confirm.disabled;
        input.value = 'reset'; input.dispatchEvent(new Event('input'));
        await send({type: 'reset-dialog', title: dialog.querySelector('h2').textContent, blockedWrong, enabledRight: !confirm.disabled, clockBefore: clock(), errors});
        sessionStorage.setItem('harness-resetting', '1');
        confirm.click();
        return;
      }
      if (cfg.phase === 'hang') {
        window.saveProgress();
        const s = save();
        await send({type: 'saved', clock: clock(), name: s.character.name, errors});
        await delay(cfg.mirrorWaitMs || 5000);
        await send({type: 'hanging'});
        if (cfg.hang === 'loop') for (;;) {}
        fetch('/__harness/kill', {method: 'POST'});
        return;
      }
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
      if (cfg.profile) resetCosts();
      const c0 = clock(), t0 = performance.now();
      await delay(cfg.idleMs);
      window.saveProgress();
      clearInterval(timer);
      const idleWallMs = performance.now() - t0;
      await send({type: 'idle', costs: cfg.profile ? costSnapshot() : undefined, samples: cfg.profile ? window.__samples : undefined, clockStart: c0, clockEnd: clock(), idleWallMs, lags, errors});
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
