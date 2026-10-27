import test from 'node:test';
import assert from 'node:assert/strict';
import {defineBeats, newBeatState, resolveBeats, beatReport} from '../src/beat_records.js';
import {Game_Time} from '../src/game_time.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';
import {eq, deepFreeze} from '../src/basics.js';

// Illustrative nouns only: the resolver knows none of them.
const BEATS = [
    {id: 'b.market-fire', dayIndex: 10, kind: 'great', actor: 'lead', needs: [eq('market.open')],
        effects: [{fact: 'market.state', value: 'burned'}, {fact: 'notice.posted', value: true}],
        altered: [{when: eq('market.closed.reason', 'festival'), effects: [{fact: 'notice.posted', value: 'closed'}]}],
        scope: {footprint: ['market'], aftermath: ['lane'], ripple: ['gate'], modes: ['follow']},
        notes: {present: 'You see the fire.', aftermath: 'The lane smells of smoke.', heard: 'Word of a fire at the market.', lapsed: 'The market stayed shut.'}},
    {id: 'b.hire', dayIndex: 12, actor: 'lead', deps: [{id: 'b.market-fire', kind: 'needs'}], needs: [eq('notice.posted')],
        effects: [{fact: 'lead.hired', value: true}, {fact: 'lead.wage', add: 3}], scope: {holds: eq('works.at.market')}},
];
const lives = deepFreeze([
    {id: 'lead', mode: 'be', places: {default: 'market'}},
    {id: 'follower', mode: 'follow', places: {default: 'home'}},
    {id: 'far', mode: 'beside', places: {default: 'farm'}},
    {id: 'clerk', mode: 'beside', places: {default: 'lane'}},
    {id: 'bystander', mode: 'beside', places: {default: 'market'}},
]);
const lookup = (res, life) => res.lives.find(l => l.life === life);

test('L3 scope: one life sees the beat with a miss note, the far life sees nothing', () => {
    const {results} = resolveBeats(BEATS, newBeatState({'market.open': true}), 10, {lives});
    assert.equal(results.length, 1);
    const fire = results[0];
    assert.equal(fire.status, 'carried');
    assert.deepEqual(lookup(fire, 'follower'), {life: 'follower', result: 'seen', exposure: 'heard', miss: true,
        note: {key: 'b.market-fire/heard', text: 'Word of a fire at the market.'}});
    assert.equal(lookup(fire, 'far').result, 'nothing');
    assert.equal(lookup(fire, 'clerk').exposure, 'aftermath');
    assert.equal(lookup(fire, 'bystander').miss, false);
    assert.equal(lookup(fire, 'bystander').exposure, 'present');
});

test('L3 a changed input flips a downstream fact, and the lapse leaves a trace', () => {
    const run = facts => resolveBeats(BEATS, newBeatState(facts), 12, {lives});
    const canon = run({'market.open': true});
    assert.equal(canon.state.facts['lead.hired'], true);
    assert.equal(canon.state.facts['lead.wage'], 3);
    const changed = run({'market.open': false});
    assert.equal(changed.state.facts['lead.hired'], undefined);
    const [fire, hire] = changed.results;
    assert.equal(fire.status, 'lapsed');
    assert.deepEqual(fire.causes, [{fact: 'market.open', op: 'eq', want: true, have: false}]);
    assert.equal(hire.status, 'blocked');
    assert.deepEqual(hire.causes[0], {beat: 'b.market-fire', status: 'lapsed'});
    // The attached follower still gets a trace line; the lead does not carry the beat.
    assert.equal(lookup(fire, 'follower').note.key, 'b.market-fire/lapsed');
    assert.equal(lookup(fire, 'lead').result, 'nothing');
    assert.equal(beatReport(BEATS, changed.state).reached, 0);
});

test('L3 an altered record applies when an input changed in a way the beat names', () => {
    const {state, results} = resolveBeats(BEATS, newBeatState({'market.open': false, 'market.closed.reason': 'festival'}), 12, {lives});
    assert.equal(results[0].status, 'altered');
    assert.equal(results[0].altered, 0);
    assert.equal(state.facts['notice.posted'], 'closed');
    assert.equal(state.facts['market.state'], undefined);
    // Downstream: the hire needs notice.posted === true; the altered form ('closed') flips it off.
    assert.equal(state.facts['lead.hired'], undefined);
    assert.equal(results[1].status, 'lapsed');
    assert.deepEqual(results[0].diffs, [{beat: 'b.market-fire', fact: 'notice.posted', was: undefined, now: 'closed', day: 10}]);
});

test('M4 null player: the lead as an NPC life carries every reachable beat on its date', () => {
    const lead = [{id: 'lead', mode: 'be', places: {default: 'market'}}];
    const start = {'market.open': true};
    const run = resolveBeats(BEATS, newBeatState(start), 20, {lives: lead});
    assert.deepEqual(run.results.map(r => [r.beat, r.day, r.status]), [['b.market-fire', 10, 'carried'], ['b.hire', 12, 'carried']]);
    for (const r of run.results) assert.equal(lookup(r, 'lead').result, 'carried');
    assert.deepEqual(beatReport(BEATS, run.state), {n: 2, reached: 2, counts: {carried: 2, altered: 0, deferred: 0, lapsed: 0, blocked: 0}, unreached: []});
    // Same facts with no lives at all (the world carries on without anyone watching),
    // when stepped a day at a time, and when run twice.
    const bare = resolveBeats(BEATS, newBeatState(start), 20);
    assert.deepEqual(bare.state.facts, run.state.facts);
    let step = newBeatState(start);
    for (let d = 1; d <= 20; d++) step = resolveBeats(BEATS, step, d, {lives: lead}).state;
    assert.deepEqual(step, run.state);
    assert.deepEqual(resolveBeats(BEATS, newBeatState(start), 20, {lives: lead}), run);
});

test('C1 the through day can be a world clock; both clocks resolve the same', () => {
    const home = WORLD_CALENDAR_PROFILES['base.frontier'].anchor;
    const calendar = new Game_Time(home); calendar.goUp(960 + 1440 * 11); // day 13
    const a = resolveBeats(BEATS, newBeatState({'market.open': true}), {calendar});
    const b = resolveBeats(BEATS, newBeatState({'market.open': true}), {clock: 960 + 1440 * 11});
    assert.equal(a.state.day, 13);
    assert.deepEqual(a, b);
    assert.equal(a.state.facts['lead.hired'], true);
});

test('PX8 deferred: a missing precondition retries inside its window, then carries or lapses', () => {
    const beats = [{id: 'w', dayIndex: 5, until: 7, needs: [eq('door.open')], effects: [{fact: 'seen', value: true}]}];
    let r = resolveBeats(beats, newBeatState(), 6);
    assert.deepEqual(r.results.map(x => x.status), ['deferred', 'deferred']);
    r = resolveBeats(beats, {...r.state, facts: {...r.state.facts, 'door.open': true}}, 7);
    assert.equal(r.results[0].status, 'carried');
    assert.equal(r.results[0].canonDay, 5);
    assert.equal(r.results[0].day, 7);
    assert.equal(resolveBeats(beats, newBeatState(), 9).state.done.w.status, 'lapsed');
});

test('PX5 attachment dial: free and background lives get no note even when present', () => {
    const quiet = [{id: 'x', mode: 'follow', leans: 'free', places: {default: 'market'}}, {id: 'y', mode: 'follow', leans: 'background'}];
    const res = resolveBeats(BEATS, newBeatState({'market.open': true}), 10, {lives: quiet}).results[0];
    assert.deepEqual(res.lives.map(l => l.result), ['nothing', 'nothing']);
});

test('ENGINE CARD E3-1 (not built): a mechanism beat is reported blocked, never faked, and blocks its dependents', () => {
    const beats = [
        {id: 'm1', dayIndex: 2, actor: 'lead', mechanism: 'cheat-space', effects: [{fact: 'power', value: true}]},
        {id: 'm2', dayIndex: 3, actor: 'lead', deps: [{id: 'm1', kind: 'needs'}], effects: [{fact: 'next', value: true}]},
        {id: 'm3', dayIndex: 4, actor: 'lead', deps: [{id: 'm1', kind: 'after'}], effects: [{fact: 'routine', value: true}]},
    ];
    const run = resolveBeats(beats, newBeatState(), 5, {lives: [{id: 'lead'}]});
    assert.deepEqual(run.results.map(r => r.status), ['blocked', 'blocked', 'carried']);
    assert.deepEqual(run.results[0].causes, [{mechanism: 'cheat-space'}]);
    assert.equal(run.state.facts.power, undefined);
    assert.equal(run.state.facts.routine, true, 'order-only deps and later ordinary beats keep running (LP9)');
    assert.equal(beatReport(beats, run.state).reached, 1);
    const offered = resolveBeats(beats, newBeatState(), 5, {mechanisms: ['cheat-space']});
    assert.deepEqual(offered.results.map(r => r.status), ['carried', 'carried', 'carried']);
});

test('defineBeats rejects duplicate ids, bad days, backward deps and ambiguous effects', () => {
    const ok = {id: 'a', dayIndex: 1, effects: []};
    assert.throws(() => defineBeats([ok, ok]), /duplicate/);
    assert.throws(() => defineBeats([{...ok, dayIndex: 0}]), /dayIndex/);
    assert.throws(() => defineBeats([{id: 'b', dayIndex: 1, deps: [{id: 'c', kind: 'after'}]}, {id: 'c', dayIndex: 2}]), /not earlier/);
    assert.throws(() => defineBeats([{...ok, effects: [{fact: 'f', value: 1, add: 1}]}]), /effect/);
});

test('inputs are not modified and results are deterministic', () => {
    const state = deepFreeze(newBeatState({'market.open': true}));
    const beats = deepFreeze(BEATS.map(b => structuredClone(b)));
    const a = resolveBeats(beats, state, 12, {lives});
    assert.deepEqual(a, resolveBeats(beats, state, 12, {lives}));
    assert.equal(state.day, 0);
    assert.deepEqual(state.facts, {'market.open': true});
});
