// REPL helpers loaded into the harness process (sent through repl.sh).
globalThis.openSec = async label => page.evaluate(label => {
  const p = document.getElementById('feature_expansion_panel'); p.open = true;
  const d = [...p.querySelectorAll('details.notebook_preparation')].find(x => x.querySelector('summary').textContent === label);
  if (!d) throw Error('no section ' + label); d.open = true; return true;
}, label);
globalThis.sec = async label => { await openSec(label); return page.evaluate(label => {
  const d = [...document.querySelectorAll('#feature_expansion_panel details.notebook_preparation')].find(x => x.querySelector('summary').textContent === label);
  return {work: [...d.querySelectorAll(':scope > .expedition_preview')].map(x => x.textContent).join(' '),
    buttons: [...d.querySelectorAll('button')].map(b => ({label: b.textContent, disabled: b.disabled,
      reasons: b.parentElement?.querySelector('.expedition_requirements')?.textContent || ''})),
    records: [...d.querySelectorAll('.expedition_history li')].map(li => li.textContent),
    notice: document.querySelector('#feature_expansion_panel > .expedition_notice')?.textContent};
}, label); };
globalThis.secLocator = label => page.locator('#feature_expansion_panel details.notebook_preparation', {has: page.locator(`summary:text-is("${label}")`)});
// Click a section action by label prefix, using a real mouse click.
globalThis.act = async (label, prefix) => { await openSec(label);
  const b = secLocator(label).locator('button', {hasText: prefix}).first();
  await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(300);
  return page.evaluate(() => document.querySelector('#feature_expansion_panel > .expedition_notice')?.textContent); };
globalThis.waitJobs = async () => { for (let i = 0; i < 600; i++) { const s = await save(); if (!s.expansion.simulation.jobs.filter(j => j.actorId === 'player').length) return brief(s); await page.waitForTimeout(1000); } throw Error('job wait timeout'); };
globalThis.waitClock = async target => { for (let i = 0; i < 600; i++) { const s = await save(); if (s.expansion.clock >= target) return brief(s); await page.waitForTimeout(1000); } throw Error('clock wait timeout'); };
globalThis.steps = globalThis.steps || [];
globalThis.record = async (name, extra = {}) => { const s = await save(); const row = {name, ...brief(s),
  facts: Object.fromEntries(Object.entries(s.expansion.actors.player.facts).filter(([k]) => /boh|fieldcraft|assay/.test(k))), ...extra};
  steps.push(row); await fs.writeFile(path.join(dir, 'evidence', (globalThis.runName || 'run') + '-steps.json'), JSON.stringify(steps, null, 1)); return row; };
// Keyboard operation: focus the section summary, real Tab presses until the target control has
// focus, then a real Enter (or Space) press.
globalThis.keyAct = async (label, prefix, key = 'Enter') => {
  await openSec(label); await secLocator(label).locator('summary').first().focus(); let tabs = 0;
  for (; tabs < 80; tabs++) { const t = await page.evaluate(() => document.activeElement?.textContent || ''); if (t.includes(prefix) && !t.includes('\n')) break; await page.keyboard.press('Tab'); }
  const focused = await page.evaluate(() => { const a = document.activeElement, cs = getComputedStyle(a);
    return {tag: a.tagName, text: a.textContent, focusVisible: a.matches(':focus-visible'), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor}; });
  if (!focused.text.includes(prefix)) throw Error('not reached by Tab: ' + prefix);
  await page.keyboard.press(key); await page.waitForTimeout(400);
  const notice = await page.evaluate(() => document.querySelector('#feature_expansion_panel > .expedition_notice')?.textContent);
  const focusAfter = await page.evaluate(() => ({tag: document.activeElement?.tagName, text: (document.activeElement?.textContent || '').slice(0, 80)}));
  return {tabs, focused, key, notice, focusAfter};
};
globalThis.diff = (a, b, p = '', out = []) => {
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) { out.push([p, JSON.stringify(a)?.slice(0, 150), JSON.stringify(b)?.slice(0, 150)]); return out; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], p + '.' + k, out); return out;
};
// Save -> reload (clock stopped before PLAY) -> genuine Export -> literal-file Import of that file.
// Reload and Import are compared strictly against the saved state over seven groups. The exported
// text is also decoded; its only expected differences are derived equipment display fields that
// the native exporter adds (stats/inventory_key/rarity), which are listed, not hidden.
globalThis.checkpoint2 = async name => {
  const before = await save();
  await reload(); const reloaded = await stored();
  const ex = await exportFile(name); const exported = await decodeFile(ex.file);
  await importFile(ex.file); const imported = await stored();
  await fs.writeFile(path.join(dir, 'evidence', name + '.json'), JSON.stringify(brief(before), null, 1));
  const derived = /^\.0\.equipment\.[^.]+\.(stats|bonus_skill_levels|attack_power|inventory_key|rarity|defense_value|component_stats)$/;
  const rest = (a, b) => diff(groups(a), groups(b)).filter(([p]) => !derived.test(p));
  const exportDiff = diff(groups(before), groups(exported)), importDiff = diff(groups(before), groups(imported));
  const row = {name, clock: before.expansion.clock, exportHash: ex.hash,
    reloadExact: same(before, reloaded), reloadDiff: diff(groups(before), groups(reloaded)).slice(0, 10),
    // Strict except for derived equipment display caches that only the exporter writes.
    exportEqual: rest(before, exported).length === 0, importEqual: rest(before, imported).length === 0,
    exportImportOtherDiffs: [...rest(before, exported), ...rest(before, imported)].slice(0, 10),
    derivedEquipmentFieldsOnlyInExport: [...new Set([...exportDiff, ...importDiff].filter(([p]) => derived.test(p)).map(([p]) => p))],
    bundle: await bundleBinding(name), pageErrors: [...errors]};
  log.push({checkpoint: row});
  await fs.writeFile(path.join(dir, 'evidence', 'persistence-' + (globalThis.runName || 'run') + '.json'), JSON.stringify(log, null, 1));
  await play(); return row;
};
return 'ok';
