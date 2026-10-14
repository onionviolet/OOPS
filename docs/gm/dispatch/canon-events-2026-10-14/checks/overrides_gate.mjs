// Override-kinds gate (OV1, OV2, OV5, OV6, OV12). READ-ONLY for workers. Exit 0 all pass, 1 any fail.
import {pathToFileURL} from 'node:url';
const WT = process.env.WT || '/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg';
let M; try { M = await import(pathToFileURL(WT + '/src/anchor_snapshots.js').href); } catch (e) { console.log('FAIL O0_module_loads ' + e.message); process.exit(1); }
const {deriveSnapshot, deriveIncremental, explainFact} = M;
const results = []; const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const tryRun = (id, fn) => { try { fn(); } catch (e) { rec(id, false, 'threw ' + e.message); } };
const world = () => ({id: 'fixture.mill2', revision: 1,
  base: {facts: {miller_alive: true, mill_standing: true, carpenter_alive: true, square_open: true, flour: 0}},
  events: [
    {id: 'e1', at: 10, requires: [{fact: 'miller_alive', eq: true}], effects: [{add: {flour: 5}}]},
    {id: 'e2', at: 20, requires: [{fact: 'mill_standing', eq: true}], effects: [{set: {mill_upgraded: true}}],
      alternatives: [{id: 'rebuild_elsewhere', requires: [{fact: 'carpenter_alive', eq: true}], effects: [{set: {mill_upgraded: true, mill_moved: true}}]}]},
    {id: 'e3', at: 30, requires: [{fact: 'mill_upgraded', eq: true}], effects: [{add: {flour: 10}}]},
    {id: 'e4', at: 40, fixed: true, requires: [{fact: 'square_open', eq: true}], effects: [{set: {festival_held: true}}]},
    {id: 'e5', at: 42, effects: [{set: {bread: true}}]},
  ],
  anchors: [{id: 'a1', at: 15}, {id: 'a3', at: 50}]});
const F = r => r?.snapshot?.facts || {};
const changes = [
  {at: 15, set: {mill_standing: false}, cause: 'life2:arson'},
  {at: 25, cancel: 'e5', cause: 'life2:bought_the_bakery'},
  {at: 35, set: {square_open: false}, cause: 'life2:riot'},
  {at: 45, insert: {id: 'shop', at: 45, effects: [{set: {shop_open: true}}]}, cause: 'life2:opened_shop'},
];

tryRun('O1_timed_changes_and_kinds', () => { const r = deriveSnapshot(world(), 'a3', {branch: {changes}}); const f = F(r);
  rec('O1_timed_changes_and_kinds', f.mill_standing === false && f.square_open === false && f.shop_open === true && f.bread === undefined && r.applied.includes('shop') && !r.applied.includes('e5') && /cancel/.test((r.skipped.find(s => s.id === 'e5') || {}).reason || ''), {facts: f, applied: r.applied, skipped: r.skipped}); });
tryRun('O2_substitution', () => { const r = deriveSnapshot(world(), 'a3', {branch: {changes}}); const f = F(r); const s = (r.substituted || []).find(x => x.id === 'e2');
  rec('O2_substitution', f.mill_upgraded === true && f.mill_moved === true && f.flour === 15 && !!s && s.alt === 'rebuild_elsewhere' && r.applied.includes('e3'), {facts: f, substituted: r.substituted}); });
tryRun('O3_substitution_fails_cleanly', () => { const w = world(); w.base.facts.carpenter_alive = false; const r = deriveSnapshot(w, 'a3', {branch: {changes}}); const f = F(r);
  rec('O3_substitution_fails_cleanly', f.mill_upgraded === undefined && f.flour === 5 && !!r.skipped.find(s => s.id === 'e2') && !!r.skipped.find(s => s.id === 'e3'), {facts: f, skipped: r.skipped}); });
tryRun('O4_fixed_point_resists', () => { const r = deriveSnapshot(world(), 'a3', {branch: {changes}}); const res = (r.resisted || []).find(x => x.id === 'e4');
  rec('O4_fixed_point_resists', F(r).festival_held === true && r.applied.includes('e4') && !!res && /square_open/.test(res.reason || ''), {resisted: r.resisted}); });
tryRun('O5_provenance', () => { const r = deriveSnapshot(world(), 'a3', {branch: {changes}});
  const a = explainFact(r, 'mill_standing'), b = explainFact(r, 'flour'), c = explainFact(r, 'shop_open'), d = explainFact(r, 'miller_alive');
  rec('O5_provenance', a?.by === 'change' && a?.cause === 'life2:arson' && a?.at === 15 && b?.by === 'event' && b?.id === 'e3' && c?.by === 'change' && c?.cause === 'life2:opened_shop' && d?.by === 'base', {a, b, c, d}); });
tryRun('O6_backward_compatible', () => { const w = world(); const old = deriveSnapshot(w, 'a3', {branch: {divergeAt: 15, overrides: {mill_standing: false}}});
  const neu = deriveSnapshot(w, 'a3', {branch: {changes: [{at: 15, set: {mill_standing: false}}]}});
  rec('O6_backward_compatible', eq(F(old), F(neu)) && eq(old.applied, neu.applied), {old: F(old), neu: F(neu)}); });
tryRun('O7_incremental_with_changes', () => { const w = world(); const r1 = deriveSnapshot(w, 'a1', {branch: {changes}}); const r2 = deriveIncremental(w, r1, 'a3'); const full = deriveSnapshot(w, 'a3', {branch: {changes}});
  rec('O7_incremental_with_changes', eq(F(r2), F(full)), {inc: F(r2), full: F(full)}); });
tryRun('O8_change_order_and_purity', () => { const w = world(); const before = JSON.stringify(w); const shuffled = [changes[3], changes[0], changes[2], changes[1]];
  const a = deriveSnapshot(w, 'a3', {branch: {changes}}), b = deriveSnapshot(w, 'a3', {branch: {changes: shuffled}});
  rec('O8_change_order_and_purity', eq(F(a), F(b)) && JSON.stringify(w) === before, 'order-independent input, world unchanged'); });
process.exit(results.every(Boolean) ? 0 : 1);
