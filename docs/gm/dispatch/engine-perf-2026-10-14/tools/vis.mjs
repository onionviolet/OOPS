// Visibility emulation: headless tabs never become hidden, so override the getters and fire the real event.
export const VIS_INIT = () => {
  Object.defineProperty(Document.prototype,'hidden',{configurable:true,get(){return !!window.__forceHidden;}});
  Object.defineProperty(Document.prototype,'visibilityState',{configurable:true,get(){return window.__forceHidden?'hidden':'visible';}});
};
export const setHidden = (page, h) => page.evaluate(h => {window.__forceHidden = h; document.dispatchEvent(new Event('visibilitychange'));}, h);
export async function openGameVis(L, browser, url, fixtureText) {
  const context = await browser.newContext({viewport: {width: 1366, height: 768}});
  await context.addInitScript(VIS_INIT);
    await context.addInitScript(([d]) => {
    if (d && !sessionStorage.getItem('perf-seeded')) { localStorage.setItem('save data', d); sessionStorage.setItem('perf-seeded', '1'); }
    const o = Storage.prototype.setItem; window.__ls = {n: 0, bytes: 0, ms: 0};
    Storage.prototype.setItem = function (k, v) { const a = performance.now(); o.call(this, k, v); const s = window.__ls; s.n++; s.bytes += String(v).length; s.ms += performance.now() - a; };
    window.__lt = []; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({type: 'longtask', buffered: true}); } catch {}
  }, [fixtureText || null]);
  const page = await context.newPage(); page.setDefaultTimeout(30000);
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(url, {waitUntil: 'load'});
  const play = page.getByText('PLAY', {exact: true}); await play.waitFor({state: 'visible', timeout: 30000}); await play.click({noWaitAfter: true});
  const confirm = page.getByText('Confirm', {exact: true}); await page.waitForTimeout(500);
  if (await confirm.isVisible().catch(() => false)) await confirm.click({noWaitAfter: true});
  await page.waitForFunction(() => typeof window.saveProgress === 'function' && !!localStorage.getItem('save data'), null, {polling: 250});
  return {context, page, errors};
}
