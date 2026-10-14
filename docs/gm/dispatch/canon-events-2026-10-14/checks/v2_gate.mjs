// Event format v2 gate (pilot asks: knowledge, reveal axis, windows, loop reset). READ-ONLY for workers.
import {pathToFileURL} from 'node:url';
const WT = process.env.WT || '/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg';
let M; try { M = await import(pathToFileURL(WT + '/src/anchor_snapshots.js').href); } catch (e) { console.log('FAIL V0_module_loads ' + e.message); process.exit(1); }
const {deriveSnapshot, deriveIncremental} = M;
const results = []; const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const tryRun = (id, fn) => { try { fn(); } catch (e) { rec(id, false, 'threw ' + e.message); } };
const world = () => ({id: 'fixture.loopvillage', revision: 1,
  base: {facts: {raid_done: false, bridge_up: true, festival: false}},
  events: [
    {id: 'secret', at: 10, reveal_at: 60, loop: true, effects: [{set: {cult_formed: true}}]},
    {id: 'fest', at: 20, loop: true, effects: [{set: {festival: true}}]},
    {id: 'mayor_closes', at: 25, loop: true, requires: [{knows: 'mayor', fact: 'raid_coming', eq: true}], effects: [{set: {bridge_up: false}}]},
    {id: 'raid', at: 30, loop: true, requires: [{fact: 'bridge_up', eq: true}], effects: [{set: {raid_done: true}}]},
    {id: 'market', window: {from: 40, to: 50}, effects: [{set: {market: true}}]},
  ],
  anchors: [{id: 'a0', at: 0}, {id: 'a1', at: 35}]});
const F = r => r?.snapshot?.facts || {}; const K = r => r?.snapshot?.knowledge || {};
const warn = {at: 15, tell: {to: 'mayor', facts: {raid_coming: true}, channel: 'letter'}, cause: 'life1:letter'};

tryRun('V1_knowledge_separate_from_facts', () => { const fresh = deriveSnapshot(world(), 'a1'); const r = deriveSnapshot(world(), 'a1', {branch: {changes: [warn]}});
  rec('V1_knowledge_separate_from_facts', F(fresh).raid_done === true && K(r).mayor?.raid_coming?.value === true && !('raid_coming' in F(r)) && F(r).bridge_up === false && F(r).raid_done === false && r.applied.includes('mayor_closes') && !!r.skipped.find(s => s.id === 'raid'), {facts: F(r), knowledge: K(r)}); });
tryRun('V2_knowledge_has_channel_and_time', () => { const r = deriveSnapshot(world(), 'a1', {branch: {changes: [warn]}}); const k = K(r).mayor?.raid_coming;
  rec('V2_knowledge_has_channel_and_time', k?.channel === 'letter' && k?.at === 15, k); });
tryRun('V3_reveal_axis', () => { const a = deriveSnapshot(world(), 'a1'), b = deriveSnapshot(world(), 70);
  rec('V3_reveal_axis', a.applied.includes('secret') && !(a.revealed || []).includes('secret') && (a.revealed || []).includes('fest') && (b.revealed || []).includes('secret'), {at35: a.revealed, at70: b.revealed}); });
tryRun('V4_windows_seeded', () => { const ts = ['s1', 's2', 's3', 's4', 's5', 's6'].map(seed => deriveSnapshot(world(), 60, {seed}).resolvedAt?.market);
  const again = deriveSnapshot(world(), 60, {seed: 's1'}).resolvedAt?.market; const inWin = ts.every(t => Number.isInteger(t) && t >= 40 && t <= 50);
  const t1 = ts[0]; const before = deriveSnapshot(world(), t1 - 1, {seed: 's1'}), at = deriveSnapshot(world(), t1, {seed: 's1'});
  const inc = deriveIncremental(world(), deriveSnapshot(world(), 'a1', {seed: 's1'}), 60);
  rec('V4_windows_seeded', inWin && again === t1 && new Set(ts).size >= 2 && F(before).market === undefined && F(at).market === true && F(inc).market === true, {ts}); });
const loopChanges = [{at: 12, tell: {to: 'hero', facts: {loop_known: true}, channel: 'memory'}}, warn, {at: 40, reset: {to: 'a0', keepKnowledge: ['hero']}, cause: 'loop'}];
tryRun('V5_reset_restores_and_keeps_knowledge', () => { const r = deriveSnapshot(world(), 40, {branch: {changes: loopChanges}});
  rec('V5_reset_restores_and_keeps_knowledge', eq(F(r), {raid_done: false, bridge_up: true, festival: false}) && K(r).hero?.loop_known?.value === true && !K(r).mayor && r.localAt === 0, {facts: F(r), knowledge: K(r), localAt: r.localAt}); });
tryRun('V6_loop_events_replay_after_reset', () => { const r = deriveSnapshot(world(), 70, {branch: {changes: loopChanges}});
  rec('V6_loop_events_replay_after_reset', F(r).festival === true && F(r).cult_formed === true && F(r).raid_done === true && r.localAt === 30, {facts: F(r), localAt: r.localAt}); });
tryRun('V7_pure_and_deterministic', () => { const w = world(); const before = JSON.stringify(w); const a = deriveSnapshot(w, 70, {branch: {changes: loopChanges}, seed: 'x'}), b = deriveSnapshot(w, 70, {branch: {changes: loopChanges}, seed: 'x'});
  rec('V7_pure_and_deterministic', JSON.stringify(w) === before && eq(a, b), 'ok'); });
process.exit(results.every(Boolean) ? 0 : 1);
