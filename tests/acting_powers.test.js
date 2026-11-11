// AGT1-AGT5, AGT14, STY24-STY26 (LLR26 answered): one record for acting powers, two worlds on it.
import test from 'node:test';
import assert from 'node:assert/strict';
import {definePower, registerPower, powerById, powersFor, budgetLeft, answer, answerActive, detects, powerView, canTouch, withinReach} from '../src/acting_powers.js';
import {defineBeats, newBeatState} from '../src/beat_records.js';
import {emptyPull, resolveWithPull, validateCanonPull} from '../src/canon_pull.js';
import {EVERNIGHT_CHURCH, canonPullTick, PULL_KNOWN, PULL_PRESENT, PULL_REACHED} from '../src/canon_pull_host.js';
import {HEAVENS_WILL, heavensWill, guHeavensWillStatus} from '../src/ri_heavens_will.js';
import {GU_LEAD, riLeadId} from '../src/world_packs/book_gu_lead_life.js';

const base = {id: 't.p', world: 't', kind: 'god', label: 'T', reach: {detects: {fact: 'x', gte: 2}, touches: ['t.']}, budget: {kind: 'acts', amount: 2}};

test('a power states its reach and budget, and an act cannot touch outside its reach (AGT3-AGT5)', () => {
    assert.throws(() => definePower({...base, budget: undefined}), /budget/);
    assert.throws(() => definePower({...base, acts: [{id: 'a', kind: 'grant', touches: ['t.'], effects: [{fact: 'other.f', value: 1}]}]}), /outside its declared reach/);
    assert.throws(() => definePower({...base, kind: 'banana'}), /kind/);
    const p = definePower({...base, acts: [{id: 'a', kind: 'grant', touches: ['t.'], effects: [{fact: 't.f', value: 1}]}]});
    assert.ok(canTouch(p, 't.f') && !canTouch(p, 'u.f'));
    assert.equal(withinReach(p, [{fact: 'u.f', value: 1}]), false);
    assert.equal(detects(p, {x: 1}), false); assert.equal(detects(p, {x: 2}), true);
    assert.equal(detects(definePower({...base, reach: {detects: null, touches: []}}), {}), null);   // unknown reach is a value the world holds
});

test('a budget refills by the day, derived from when it was spent; unbudgeted never runs out (AGT4)', () => {
    const p = definePower({...base, budget: {kind: 'acts', amount: 2, refillDays: 10}});
    assert.equal(budgetLeft(p, {spentAt: [3, 4]}, 5), 0);
    assert.equal(budgetLeft(p, {spentAt: [3, 4]}, 13), 1);
    assert.equal(budgetLeft(p, {spentAt: [3, 4]}, 14), 2);
    assert.equal(budgetLeft(definePower(base), {spent: 5}, 99), 0);
    assert.equal(budgetLeft(definePower({...base, budget: {kind: 'unbudgeted'}}), {spent: 99}), Infinity);
});

test('an answer is an ordinary effect list with a window (FRC47, AGT5)', () => {
    const p = definePower({...base, acts: [{id: 'bless', kind: 'grant', touches: ['t.'], effects: [{fact: 't.luck', add: 1}], windowDays: 5, severity: 'minor', probability: 0.5}]});
    const a = answer(p, 'bless', 10);
    assert.deepEqual(a.effects, [{fact: 't.luck', add: 1}]);
    assert.ok(answerActive(a, 14) && !answerActive(a, 15) && !answerActive(a, 9));
    assert.throws(() => answer(p, 'nope', 1), /no act/);
});

test('LOTM church: the bare id resolves, its alias too, and the beat is carried as before (RCL16, AGT11)', () => {
    const church = powerById(EVERNIGHT_CHURCH);
    assert.equal(powerById('church'), church);
    assert.equal(church.institution, 'evernight');
    assert.equal(church.faith, null); assert.equal(church.terms, null);
    let seen = 0;
    for (let s = 0; s < 300; s++) {
        const r = canonPullTick({...emptyPull(), spent: {fate: 1}}, {facts: {[PULL_KNOWN]: true, [PULL_PRESENT]: false}, day: 4, seat: 'be', worldSeed: s});
        const rec = r.records[0];
        if (rec.outcome !== 'substituted') continue;
        seen++;
        assert.equal(rec.agent, EVERNIGHT_CHURCH); assert.equal(rec.kind, 'institution'); assert.match(rec.sign, /Nighthawk/);
        assert.deepEqual(r.effects.map(e => e.key), [PULL_REACHED]);
        assert.equal(r.pull.spent[EVERNIGHT_CHURCH], 1);
    }
    assert.ok(seen > 200);
});

test('legacy spend under the old id still counts; a spent church leaves the beat bent (AGT4)', () => {
    for (let s = 0; s < 40; s++) {
        const r = canonPullTick({...emptyPull(), spent: {fate: 1, church: 1}}, {facts: {[PULL_KNOWN]: true, [PULL_PRESENT]: false}, day: 4, worldSeed: s});
        assert.equal(r.records[0].outcome, 'deviated');
    }
});

test('an agent outside its power\'s reach is not drawn, and a refilling budget returns the agent (AGT3, AGT4)', () => {
    registerPower({...base, id: 't.rogue', world: 't', kind: 'patron', reach: {detects: null, touches: ['t.']}, budget: {kind: 'acts', amount: 1, refillDays: 2}, reason: 'r', sign: 's'});
    const beats = defineBeats([{id: 't.b', dayIndex: 1, until: 1, kind: 'great', needs: {fact: 't.ready', value: true}, effects: [{fact: 't.done', value: true}],
        pull: {agents: [{id: 't.rogue', substitute: [{fact: 'elsewhere.fact', value: true}]}]}}]);
    const run = (pull, seed) => resolveWithPull(beats, newBeatState({}), 1, {pull: {state: pull, worldSeed: seed, world: 't', seat: 'be', ceiling: 1}});
    for (let s = 0; s < 20; s++) assert.notEqual(run(emptyPull(), s).records[0]?.outcome, 'substituted');
    const ok = defineBeats([{...beats[0], pull: {agents: [{id: 't.rogue', substitute: [{fact: 't.done', value: true}]}]}}]);
    const go = (pull, day, seed) => resolveWithPull(ok, {...newBeatState({}), day: day - 1}, day, {pull: {state: pull, worldSeed: seed, world: 't', ceiling: 1}});
    const first = go(emptyPull(), 1, 1);
    assert.equal(first.records[0].outcome, 'substituted');
    assert.deepEqual(first.pull.spentAt, {'t.rogue': [1]});
    assert.doesNotThrow(() => validateCanonPull(first.pull));
    assert.equal(budgetLeft(powerById('t.rogue'), {spent: 1, spentAt: first.pull.spentAt['t.rogue']}, 2), 0);
    assert.equal(budgetLeft(powerById('t.rogue'), {spent: 1, spentAt: first.pull.spentAt['t.rogue']}, 3), 1);
    assert.equal(powersFor('t').map(p => p.id).includes('t.rogue'), true);
});

test('Reverend Insanity: Heaven\'s Will is a fate power with a level, a reach and no stated budget; its motive stays sealed (STY24-STY26, AGT6)', () => {
    const p = powerById(HEAVENS_WILL);
    assert.equal(p, heavensWill);
    assert.deepEqual(p.fate, {level: 'F2', modifiers: ['F6']});
    assert.equal(p.budget.kind, 'unbudgeted');
    const v = powerView(p, {rank: 1});
    assert.equal(v.sees, false); assert.deepEqual(v.sealed, ['ri.heavens_will.motive']);
    assert.equal(powerView(p, {rank: 6}).sees, true);
    assert.doesNotMatch(JSON.stringify(v), /motive":"/);
});

test('the returned youth reads it only after the awakening, as a pressure that names its cause as far as he knows', () => {
    const record = {packId: GU_LEAD}, none = {simulation: {knowledge: {player: {}}}};
    assert.deepEqual(guHeavensWillStatus(none, record), []);
    assert.deepEqual(guHeavensWillStatus(none, {packId: 'other'}), []);
    const known = {simulation: {knowledge: {player: {[riLeadId('awakening')]: {value: 'x'}}}}};
    const [row] = guHeavensWillStatus(known, record);
    assert.equal(row.label, 'Heaven’s Will');
    assert.match(row.value, /Not looking your way/);
    assert.doesNotMatch(row.value, /\b(budget|reach|F2|fate level)\b/i);
});
