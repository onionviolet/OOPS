// FA13: sharpened knife -> cut log -> dry stave -> bind recovered pin into a kit -> deliver kits.
const T = 'Fitting tools & materials', F = "Eda's bench fieldcraft";
const pick = s => { const i = inv(s); return {clock: s.expansion.clock, money: s.character.money, sharp: i['Field fitting knife'] || 0, dull: i['Dulled field fitting knife'] || 0,
  log: i['Rough wood log'], wet: i['Wet repair stave'] || 0, sound: i['Sound repair stave'] || 0, pin: i['Recovered fitting pin'] || 0, resin: i['Set repair resin'] || 0,
  kits: i['Prepared survey kit'] || 0, jobs: s.expansion.simulation.jobs.map(j => j.commandId)}; };
const enabledButton = async (label, prefix) => { await openSec(label);
  const all = secLocator(label).locator('button', {hasText: prefix}); const n = await all.count();
  for (let i = 0; i < n; i++) { const b = all.nth(i); if ((await b.textContent()).startsWith('Do this')) { await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(300); return i; } }
  throw Error('no enabled ' + prefix); };
const out = {start: pick(await save())};
await enabledButton(T, 'Cut one actual log into two wet staves');
out.cutPending = pick(await stored()); await waitJobs(); out.cut = pick(await save());
await enabledButton(T, 'Dry in the ordinary sheltered rack');
await waitJobs(); out.dried = pick(await save());
const k = await keyAct(F, 'Bind one pin, sound stave and set resin');
out.bindPending = pick(await stored()); await waitJobs(); out.bound = pick(await save());
await enabledButton(T, 'Deliver two real survey kits');
await waitJobs(); out.delivered = pick(await save());
await record('stave-pin-kit-delivered', out);
const cp = await checkpoint2('fa13-pin-kit-delivered');
out.cp = {reload: cp.reloadExact, exp: cp.exportEqual, imp: cp.importEqual, other: cp.exportImportOtherDiffs, errs: cp.pageErrors};
out.bindKeyboard = {tabs: k.tabs, focusAfter: k.focusAfter};
return out;
