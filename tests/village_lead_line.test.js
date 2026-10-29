// PL-H1: Village harness (PX64 checks 1-5, 7). Beats are data; the resolver is generic.
// Check 7 here is HEADLESS save/export/import/reload (Node DOM), not a browser run.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {VILLAGE_BEATS, LEAD_FACTS, LEAD_ID, leadStartFacts, villageLeadRunRows} from '../src/world_packs/village_lead_line.js';
import {resolveBeats, newBeatState, beatReport} from '../src/beat_records.js';
import {runVillageLeadLine, DATES} from '../scripts/headless/lead_runs/village_lead_line.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const CHILD = `import {runVillageLeadLine, DATES} from './scripts/headless/lead_runs/village_lead_line.mjs';
const r = await runVillageLeadLine(); const out = JSON.stringify({minutes: r.minutes, log: r.log}); r.bot.close();
(await import('node:fs')).writeSync(1, out);`;
const GREAT = VILLAGE_BEATS.filter(b => b.kind === 'great');
const run = (facts = {}, ctx = {}, through = 5) =>
    resolveBeats(VILLAGE_BEATS, newBeatState({...leadStartFacts(), ...facts}), through, ctx);
const statusOf = (r, id) => r.state.done[id]?.status;

test('check 1: five rows with dates, places, dependencies, touched facts and a label', () => {
    const rows = villageLeadRunRows();
    assert.equal(rows.length, 5);
    assert.deepEqual(rows.map(r => r.date.dayIndex), [2, 2, 3, 3, 3]);
    for (const r of rows) {
        assert.ok(r.place && r.touched.length && ['S', 'I', 'U'].includes(r.label), r.beat);
        for (const d of r.deps) assert.ok(rows.some(x => x.beat === d.id));
    }
    assert.equal(rows.filter(r => r.deps.length).length, 3);
});

test('check 2: every touched fact resolves to a Village record, and the lead is a Village dialogue id', () => {
    const village = readFileSync(new URL('../src/village_content.js', import.meta.url), 'utf8');
    const touched = new Set(villageLeadRunRows().flatMap(r => r.touched));
    for (const f of touched) {
        assert.ok(LEAD_FACTS[f], `no pack record for ${f}`);
        const key = LEAD_FACTS[f].record.replace(/^village\./, '');
        assert.ok(village.includes(`"${LEAD_FACTS[f].record}"`) || village.includes(`"${key}"`) || village.includes(`${key}:`) || village.includes(`"village.${key}"`) || village.includes(`key: "${key}"`), `Village has no record ${f}`);
    }
    for (const f of Object.keys(LEAD_FACTS)) assert.ok(touched.has(f), `unused pack record ${f}`);
    assert.ok(readFileSync(new URL('../scripts/headless/village_route.mjs', import.meta.url), 'utf8').includes(LEAD_ID));
});

test('check 4: a null-player run carries all five beats on their dates', () => {
    const r = run();
    assert.equal(r.results.length, 5);
    for (const b of VILLAGE_BEATS) {
        const res = r.results.find(x => x.beat === b.id);
        assert.equal(res.status, 'carried', b.id);
        assert.equal(res.day, b.dayIndex);
    }
    assert.deepEqual(beatReport(VILLAGE_BEATS, r.state).counts.carried, 5);
    assert.equal(r.state.facts.crossing, 'unrepaired');
    assert.equal(r.state.facts['village.routeOrigin'], 'teacher');
});

test('check 5: one poke per great beat flips the outcome and a downstream fact', () => {
    const base = run();
    const pokes = {
        'vl.token_returned': {facts: {'village.craftsmanPresent': false}, flips: 'village.tokenReturned', downstream: 'vl.route_taught'},
        'vl.route_taught': {facts: {'village.teacherHours': false}, flips: 'village.routeOrigin'},
        'vl.dry_bank_surveyed': {facts: {'campaign.anchor': false}, flips: 'village.surveyed', downstream: 'vl.morning_circle_held'},
    };
    assert.deepEqual(Object.keys(pokes), GREAT.map(b => b.id));
    for (const [id, p] of Object.entries(pokes)) {
        const poked = run(p.facts);
        assert.notEqual(statusOf(poked, id), 'carried', id);
        assert.notEqual(poked.state.facts[p.flips], base.state.facts[p.flips], `${id} outcome fact`);
        if (p.downstream) assert.notEqual(statusOf(poked, p.downstream), 'carried', `${id} downstream beat`);
    }
    // the teacher's absence with Perception 3 is altered (field route), not lost; with Perception 1 the route is lost
    assert.equal(statusOf(run({'village.teacherHours': false}), 'vl.route_taught'), 'altered');
    const lost = run({'village.teacherHours': false, perception: 1});
    assert.equal(statusOf(lost, 'vl.route_taught'), 'lapsed');
    assert.equal(statusOf(lost, 'vl.dry_bank_surveyed'), 'blocked');
    assert.equal(lost.state.facts.crossing, undefined);
});

test('scope: a life at the aftermath place sees a beat with a miss note; an unattached life sees nothing', () => {
    const lives = [{id: 'shack', mode: 'bystander', places: {default: 'Shack'}}, {id: 'far', mode: 'unattached', places: {default: 'Elsewhere'}}];
    const r = run({}, {lives});
    const token = r.results.find(x => x.beat === 'vl.token_returned');
    const shack = token.lives.find(l => l.life === 'shack'), far = token.lives.find(l => l.life === 'far');
    assert.equal(shack.result, 'seen');
    assert.equal(shack.miss, true);
    assert.equal(shack.note.key, 'vl.token_returned/aftermath');
    assert.ok(shack.note.text);
    assert.equal(far.result, 'nothing');
    assert.equal(token.lives.find(l => l.life === LEAD_ID), undefined);   // the lead is not in this run's lives
});

test('the lead is "carried" for its own beats and replaying from day 0 reproduces state', () => {
    const r = run({}, {lives: [{id: LEAD_ID, mode: 'be', places: {default: 'Village'}}]});
    assert.ok(r.results.every(x => x.lives[0].result === 'carried'));
    const stepwise = [2, 3, 4, 5].reduce((s, d) => resolveBeats(VILLAGE_BEATS, s, d).state, newBeatState(leadStartFacts()));
    assert.deepEqual(stepwise, r.state);
});

test('check 3 + 7: bot route reaches all five dates twice identically; HEADLESS save/export/import/reload keeps the line', async () => {
    // The runner installs process globals, so the second boot runs in a fresh child process, in parallel.
    // The child takes about 93 s alone; allow headroom for concurrent full-suite load.
    const childRun = promisify(execFile)(process.execPath, ['--input-type=module', '-e', CHILD], {cwd: ROOT, encoding: 'utf8', timeout: 240000, env: {...process.env, NODE_TEST_CONTEXT: ''}});
    const a = await runVillageLeadLine();
    try {
        assert.deepEqual(a.minutes.map(m => Math.floor(m / 1440)), [1, ...DATES]);
        const viaBot = resolveBeats(VILLAGE_BEATS, newBeatState(leadStartFacts()), Math.floor(a.minutes.at(-1) / 1440));
        assert.equal(viaBot.results.filter(x => x.status === 'carried').length, 5);
        assert.deepEqual(viaBot.state, run({}, {}, 3).state);
        // HEADLESS persistence (Node DOM, not a browser): the ledger has no save slice, so it must be
        // re-derivable from the day after export, import and reload.
        const game = a.bot.game, dayBefore = game.internals.current_game_time.day_count;
        const bytes = await game.exportFile();
        assert.ok(bytes && bytes.length > 100);
        await game.importFile(bytes);
        await game.reload();
        const dayAfter = game.internals.current_game_time.day_count;
        assert.equal(dayAfter, dayBefore);
        assert.deepEqual(resolveBeats(VILLAGE_BEATS, newBeatState(leadStartFacts()), dayAfter).state, viaBot.state);
        const child = JSON.parse((await childRun).stdout);
        assert.deepEqual(child.minutes, a.minutes);
        assert.deepEqual(child.log, a.log);
    } finally { try { a.bot.close(); } catch {} }
});
