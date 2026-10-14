// Away ledger gate (OT1-OT4, OT9; offline audit S1). READ-ONLY for workers. Exit 0 pass, 1 fail.
import {pathToFileURL} from 'node:url';
const WT = process.env.WT || '/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg';
let M; try { M = await import(pathToFileURL(WT + '/src/away_ledger.js').href); } catch (e) { console.log('FAIL A0_module_loads ' + e.message); process.exit(1); }
const {computeAway} = M; const results = []; const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${JSON.stringify(d)}`); };
const tryRun = (id, fn) => { try { fn(); } catch (e) { rec(id, false, 'threw ' + e.message); } };
const MIN = 60000, T0 = 1_700_000_000_000;
const med = {id: 'meditate', xpPerMinute: 2};
tryRun('A1_basic', () => { const r = computeAway({lastSeen: T0, now: T0 + 30 * MIN, capMinutes: 480, activity: med});
  rec('A1_basic', r.appliedMinutes === 30 && r.gains.xp === 60 && r.stoppedBy === null && r.nextLastSeen === T0 + 30 * MIN && r.remainderMs === 0, r); });
tryRun('A2_cap_drop', () => { const r = computeAway({lastSeen: T0, now: T0 + 600 * MIN, capMinutes: 480, activity: med});
  rec('A2_cap_drop', r.appliedMinutes === 480 && r.overflowMinutes === 120 && r.bankedMinutes === 0 && r.gains.xp === 960, r); });
tryRun('A3_cap_bank', () => { const r = computeAway({lastSeen: T0, now: T0 + 600 * MIN, capMinutes: 480, overflow: 'bank', bankedMinutes: 10, activity: med});
  rec('A3_cap_bank', r.appliedMinutes === 480 && r.bankedMinutes === 130 && r.overflowMinutes === 120, r); });
tryRun('A4_barrier_stops', () => { const r = computeAway({lastSeen: T0, now: T0 + 300 * MIN, capMinutes: 480, activity: med, barriers: [{at: 200, id: 'late'}, {at: 100, id: 'tournament'}]});
  rec('A4_barrier_stops', r.appliedMinutes === 100 && r.stoppedBy === 'tournament' && r.gains.xp === 200 && r.nextLastSeen === T0 + 100 * MIN, r); });
tryRun('A5_diminishing', () => { const r = computeAway({lastSeen: T0, now: T0 + 200 * MIN, capMinutes: 480, activity: {id: 'meditate', xpPerMinute: 1, diminishAfter: 120, diminishFactor: 0.5}});
  rec('A5_diminishing', r.appliedMinutes === 200 && r.gains.xp === 160, r); });
tryRun('A6_remainder_carries', () => { const a = computeAway({lastSeen: T0, now: T0 + 90000, capMinutes: 480, activity: med});
  const b = computeAway({lastSeen: a.nextLastSeen, now: T0 + 120000, capMinutes: 480, activity: med, remainderMs: a.remainderMs});
  rec('A6_remainder_carries', a.appliedMinutes === 1 && a.remainderMs === 30000 && b.appliedMinutes === 1 && b.remainderMs === 0, {a, b}); });
tryRun('A7_clock_back', () => { const r = computeAway({lastSeen: T0, now: T0 - 5 * MIN, capMinutes: 480, activity: med});
  rec('A7_clock_back', r.appliedMinutes === 0 && r.gains.xp === 0 && r.stoppedBy === 'clock-back' && r.nextLastSeen === T0, r); });
tryRun('A8_ratio', () => { const r = computeAway({lastSeen: T0, now: T0 + 30 * MIN, capMinutes: 480, gameMinutesPerRealMinute: 2, activity: med});
  rec('A8_ratio', r.appliedMinutes === 60 && r.gains.xp === 120 && r.nextLastSeen === T0 + 30 * MIN, r); });
tryRun('A9_no_activity_and_purity', () => { const input = {lastSeen: T0, now: T0 + 10 * MIN, capMinutes: 480, activity: med, barriers: [{at: 5, id: 'x'}]}; const before = JSON.stringify(input);
  const a = computeAway(input), b = computeAway(input), n = computeAway({lastSeen: T0, now: T0 + 10 * MIN, capMinutes: 480});
  rec('A9_no_activity_and_purity', JSON.stringify(input) === before && JSON.stringify(a) === JSON.stringify(b) && n.appliedMinutes === 10 && n.gains.xp === 0, {n}); });
process.exit(results.every(Boolean) ? 0 : 1);
