// Derived-snapshots gate. READ-ONLY for workers. Prints PASS|FAIL lines. Exit 0 all pass, 1 any fail, 3 broken.
import {pathToFileURL} from 'node:url';
const WT = '/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg';
let M; try { M = await import(pathToFileURL(WT + '/src/anchor_snapshots.js').href); } catch (e) { console.log('FAIL G0_module_loads ' + e.message); process.exit(1); }
const {deriveSnapshot, deriveIncremental, diffSnapshots, lintWorld} = M;
const results = []; const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const world = () => ({id: 'fixture.mill', revision: 3,
  base: {facts: {miller_alive: true, mill_standing: true, flour: 0, festival_held: false}},
  events: [
    {id: 'e1', at: 10, requires: [{fact: 'miller_alive', eq: true}], effects: [{add: {flour: 5}}], evidence: {label: 'SHOWN', locator: 'fixture:1'}},
    {id: 'e2', at: 20, requires: [{fact: 'mill_standing', eq: true}], effects: [{set: {mill_upgraded: true}}], evidence: {label: 'STATED', locator: 'fixture:2'}},
    {id: 'e3', at: 30, requires: [{fact: 'mill_upgraded', eq: true}], effects: [{add: {flour: 10}}], evidence: {label: 'SHOWN', locator: 'fixture:3'}},
    {id: 'e4', at: 40, effects: [{set: {festival_held: true}}], evidence: {label: 'INFERRED', locator: 'fixture:4'}},
    {id: 'e5', at: 40, requires: [{fact: 'flour', exists: true}], effects: [{set: {bread: true}}]},
  ],
  anchors: [{id: 'a0', at: 0}, {id: 'a1', at: 15}, {id: 'a2', at: 35}, {id: 'a3', at: 50}]});
const facts = r => r?.snapshot?.facts || {};
const tryRun = (id, fn) => { try { fn(); } catch (e) { rec(id, false, 'threw ' + e.message); } };

tryRun('G1_fresh_canon', () => { const r = deriveSnapshot(world(), 'a3'); const f = facts(r);
  rec('G1_fresh_canon', f.flour === 15 && f.mill_upgraded === true && f.festival_held === true && f.bread === true && eq(r.applied, ['e1', 'e2', 'e3', 'e4', 'e5']) && r.skipped.length === 0, {facts: f, applied: r.applied}); });
tryRun('G2_incremental_equals_full', () => { const w = world(); let r = deriveSnapshot(w, 'a1'); const applied = [...r.applied];
  r = deriveIncremental(w, r, 'a2'); applied.push(...r.applied.filter(x => !applied.includes(x))); r = deriveIncremental(w, r, 'a3');
  const full = deriveSnapshot(w, 'a3'); rec('G2_incremental_equals_full', eq(facts(r), facts(full)) && r.at === full.at, {inc: facts(r), full: facts(full)}); });
const branch = {divergeAt: 15, overrides: {mill_standing: false}};
tryRun('G3_branch_skips_and_cascades', () => { const r = deriveSnapshot(world(), 'a3', {branch}); const f = facts(r);
  const s2 = r.skipped.find(s => s.id === 'e2'), s3 = r.skipped.find(s => s.id === 'e3');
  rec('G3_branch_skips_and_cascades', f.flour === 5 && f.festival_held === true && f.mill_standing === false && !!s2 && /mill_standing/.test(s2.reason) && !!s3 && /mill_upgraded/.test(s3.reason) && r.applied.includes('e4') && !r.applied.includes('e2'), {facts: f, skipped: r.skipped, applied: r.applied}); });
tryRun('G4_evidence_for_applied_only', () => { const r = deriveSnapshot(world(), 'a3', {branch}); const ids = r.evidence.map(e => e.id);
  rec('G4_evidence_for_applied_only', eq(ids, ['e1', 'e4']) && r.evidence[0].locator === 'fixture:1' && r.evidence[1].label === 'INFERRED', r.evidence); });
tryRun('G5_diff', () => { const a = deriveSnapshot(world(), 'a3'), b = deriveSnapshot(world(), 'a3', {branch}); const d = diffSnapshots(a.snapshot, b.snapshot);
  const by = Object.fromEntries(d.map(x => [x.key, x])); const keys = d.map(x => x.key);
  rec('G5_diff', by.flour?.from === 15 && by.flour?.to === 5 && by.mill_standing?.from === true && by.mill_standing?.to === false && by.mill_upgraded?.from === true && by.mill_upgraded?.to === undefined && eq(keys, [...keys].sort()) && !by.festival_held, d); });
tryRun('G6_pure', () => { const w = world(); const before = JSON.stringify(w); deriveSnapshot(w, 'a3', {branch}); deriveIncremental(w, deriveSnapshot(w, 'a1'), 'a3'); lintWorld(w);
  rec('G6_pure', JSON.stringify(w) === before, 'world unchanged'); });
tryRun('G7_lint', () => { const w = world(); w.events.push({id: 'e6', at: 45, requires: [{fact: 'dragon', eq: true}], effects: [{set: {hoard: 1}}]});
  w.events.push({id: 'e7', at: 40, effects: [{set: {festival_held: false}}]});
  const L = lintWorld(w); const never = L.find(x => x.kind === 'never-fires'), clash = L.find(x => x.kind === 'same-time-conflict');
  rec('G7_lint', !!never && never.ids.includes('e6') && !!clash && clash.ids.includes('e4') && clash.ids.includes('e7') && !lintWorld(world()).length, L); });
tryRun('G8_anchor_and_revision', () => { const r1 = deriveSnapshot(world(), 'a2'), r2 = deriveSnapshot(world(), 35);
  rec('G8_anchor_and_revision', eq(facts(r1), facts(r2)) && r1.revision === 3 && r1.at === 35, {at: r1.at, revision: r1.revision}); });
tryRun('G9_deterministic_and_order', () => { const a = deriveSnapshot(world(), 'a3', {branch}), b = deriveSnapshot(world(), 'a3', {branch});
  const w = world(); w.events.reverse(); const c = deriveSnapshot(w, 'a3');
  rec('G9_deterministic_and_order', eq(a, b) && eq(facts(c), facts(deriveSnapshot(world(), 'a3'))) && c.applied.indexOf('e1') < c.applied.indexOf('e3'), {orderFromReversed: c.applied}); });
process.exit(results.every(Boolean) ? 0 : 1);
