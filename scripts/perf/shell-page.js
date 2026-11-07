// Injected into the scratch HTML before the unchanged game bundle, in both hosts.
(() => {
  const cfg = window.__shellConfig;
  const errors = [];
  // Workload normalization, not a claim that these hidden windows paint visibly.
  if (cfg.normalizeVisibility) {
    Object.defineProperty(document, 'hidden', {get:()=>false});
    Object.defineProperty(document, 'visibilityState', {get:()=> 'visible'});
  }
  window.addEventListener('error', e => errors.push(e.message));
  window.addEventListener('unhandledrejection', e => errors.push(String(e.reason)));
  const send = data => fetch(cfg.report, {method:'POST', headers:{'Content-Type':'text/plain'}, body:JSON.stringify(data)});
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const shown = el => el && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0;
  const wait = async (fn, label) => {
    const start = performance.now();
    while (!fn()) { if (performance.now()-start > 60000) throw Error('Timed out: '+label); await delay(25); }
  };
  const save = () => JSON.parse(localStorage.getItem('save data'));
  const clock = () => { const t=save()?.['current time']; return t ? (t.day_count*24+t.hour)*60+t.minute : null; };
  const isReload = sessionStorage.getItem('shell-seeded');
  if (!isReload) {
    localStorage.setItem('save data', JSON.stringify(cfg.fixture));
    sessionStorage.setItem('shell-seeded','1');
  }
  window.alert = message => errors.push('alert: '+message);
  window.confirm = () => false;
  window.prompt = () => null;
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      await wait(() => shown(document.querySelector('#loading_screen_play_button:not(.none_display)')), 'PLAY');
      const playMs = performance.now();
      document.querySelector('#loading_screen_play_button').click();
      await wait(() => shown(document.querySelector('#hero_creation_panel_confirmation')) || shown(document.querySelector('#location_actions_div .location_choice_dropdown')), 'workspace');
      if (shown(document.querySelector('#hero_creation_panel_confirmation'))) document.querySelector('#hero_creation_panel_confirmation').click();
      await wait(() => shown(document.querySelector('#location_actions_div .location_choice_dropdown')) && typeof window.saveProgress === 'function', 'ready');
      if (isReload) {
        const expected = JSON.parse(sessionStorage.getItem('shell-check'));
        const kept=save();
        await send({type:'reloaded', clock:clock(), expected, sameCharacter:kept.character.name===expected.name,
          hasHero:kept.global_flags.is_hero_created, errors});
        return;
      }
      window.saveProgress();
      await send({type:'ready', playMs, readyMs:performance.now(), viewport:[innerWidth,innerHeight], visibility:document.visibilityState,
        userAgent:navigator.userAgent, clock:clock(), character:save().character.name,
        location:save()['current location'], actions:[...document.querySelectorAll('#location_actions_div .location_choice_dropdown')].map(x=>x.textContent.trim()).slice(0,8), errors});
      await delay(4000);
      const lags=[];
      let last=performance.now();
      const timer=setInterval(()=>{const now=performance.now();lags.push(Math.max(0,now-last-100));last=now;},100);
      await send({type:'phase', phase:'idle', clock:clock()});
      await delay(cfg.durationMs);
      window.saveProgress();
      await send({type:'idle-done', clock:clock(), lags, errors});
      clearInterval(timer);
      // Same five real Save button operations in each host, not a synthetic serializer.
      await send({type:'phase',phase:'save-burst'});
      const saveMs=[];
      for(let i=0;i<5;i++) {
        const t=performance.now();document.querySelector('#save_button').click();saveMs.push(performance.now()-t);
        await delay(500);
      }
      const s=save();
      const expected={clock:clock(),name:s.character.name};
      sessionStorage.setItem('shell-check',JSON.stringify(expected));
      await send({type:'saved',saveMs,saveBytes:new TextEncoder().encode(JSON.stringify(s)).length,clock:clock(), errors});
      location.reload();
    } catch(error) { await send({type:'failed',error:String(error),errors}); }
  });
})();
