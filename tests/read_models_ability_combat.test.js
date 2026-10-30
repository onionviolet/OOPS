import test from 'node:test';
import assert from 'node:assert/strict';
import {seerPathway} from '../src/book_world_lotm_path.js';
import {advanceLadder, abilityViews} from '../src/lotm_advancement.js';
import {ladderViewFromRecord, abilityGlanceRows} from '../src/read_models/ability_ladder_bridge.js';
import {threatWithRung, outcomeWord, intentFromReadiedAbility, versusWithEngine} from '../src/read_models/combat_situation_bridge.js';

const eq = (fact, value = true) => ({fact, op: 'eq', value});
const pack = {rungs: {seq7: {label: 'Rung seven', crossings: [
    {id: 'digest7', type: 'digest', label: 'Acts', fact: 'acting7', need: 4}, {id: 'dose7', type: 'ingest', label: 'Dose', fact: 'heldSeven', need: true, irreversible: true}],
    grants: ['A new faculty'], failure: {signs: 'Pressure', outcome: 'Owned elsewhere'},
    abilities: [{key: 'step', label: 'Step', sourceId: 'book.lotm.rungseven', conditions: [{label: 'Ready', requires: eq('actor.ready')}],
        cost: [{type: 'resource', scope: 'actor', key: 'spirit', amount: -1}], limit: {kind: 'cooldown', minutes: 5},
        effects: [{type: 'condition', id: 'book.lotm.rungseven.step', operation: 'apply', duration: 3}], failure: {hook: 'lotm.backlash'}}]}}};
const rungOf = f => f === 1 ? null : ['shaken', 'bruised', 'wounded', 'maimed', 'dying'][Math.min(4, Math.floor((1 - f) * 5))];

test('ladder view carries the rep contract shape and the next rung grants when the rung is named', () => {
    const adv = advanceLadder(seerPathway, pack);
    const v = ladderViewFromRecord(adv, {position: 2, facts: {acting7: 4, heldSeven: true}, known: 4, ceiling: 3});
    for (const k of ['path', 'label', 'stage', 'position', 'next', 'grants', 'nextGrants', 'capped', 'ready', 'failure', 'crossings', 'ladder']) assert.ok(k in v, k);
    assert.equal(v.ready, true);
    assert.deepEqual(v.nextGrants, ['A new faculty']);
    assert.deepEqual(v.crossings.map(c => c.type), ['digest', 'ingest']);
    assert.equal(v.crossings[0].have, 4);
});

test('an unnamed next rung leaks neither grants, crossings nor failure', () => {
    const adv = advanceLadder(seerPathway, pack);
    const v = ladderViewFromRecord(adv, {position: 2, facts: {acting7: 4, heldSeven: true}, known: 2});
    assert.equal(v.next, '???');
    assert.deepEqual([v.nextGrants, v.crossings, v.failure, v.ready], [[], [], null, false]);
    assert.ok(!JSON.stringify(v).includes('A new faculty') && !JSON.stringify(v).includes('Pressure'));
});

test('ability glance rows drop the failure hook and unstated list', () => {
    const adv = advanceLadder(seerPathway, pack);
    const rows = abilityGlanceRows(abilityViews(adv, {facts: {'actor.ready': true}, held: ['book.lotm.adv.rungseven']}));
    assert.equal(rows.length, 1);
    assert.equal(rows[0].ready, true);
    assert.ok(!('failureHook' in rows[0]) && !('unstated' in rows[0]));
});

const versus = () => ({you: {name: 'You', hp: {current: 20, max: 20}, allies: 0}, together: null, opponents: [
    {id: 'a', name: 'A', down: false, threat: {level: 'heavy', word: 'Heavy', blow: 12}, intent: {known: false, word: 'Intent unread'}},
    {id: 'b', name: 'B', down: true, threat: {level: 'down', word: 'Down'}, intent: null}]});

test('threat reaches a harm rung; a lethal blow is dying, never dead (AD19)', () => {
    assert.equal(threatWithRung({level: 'heavy', blow: 12}, {current: 20, max: 20}, rungOf).rung, 'maimed');
    assert.equal(threatWithRung({level: 'lethal', blow: 25}, {current: 20, max: 20}, rungOf).rung, 'dying');
    const t = {level: 'unknown', word: 'Not sized up'};
    assert.equal(threatWithRung(t, {current: 20, max: 20}, rungOf), t);
});

test('versus: rung, outcome word, intent only with a read, abilities for you', () => {
    const adv = advanceLadder(seerPathway, pack);
    const youViews = abilityViews(adv, {facts: {'actor.ready': true}, held: ['book.lotm.adv.rungseven']});
    const out = versusWithEngine(versus(), {health: {current: 20, max: 20}, rungOf, outcomes: {b: 'fled'}, youViews,
        readied: {a: youViews[0]}});
    assert.equal(out.opponents[0].threat.rung, 'maimed');
    assert.deepEqual(out.opponents[0].intent, {known: false, word: 'Intent unread'});   // readied ability known, but no read: stays unread
    assert.equal(out.opponents[1].threat.word, 'Fled');
    assert.equal(out.you.abilities[0].label, 'Step');
    const read = versusWithEngine(versus(), {health: {current: 20, max: 20}, rungOf, readied: {a: youViews[0]}, reads: {a: {source: 'insight', label: 'insight'}}});
    assert.deepEqual([read.opponents[0].intent.known, read.opponents[0].intent.source], [true, 'insight']);
    assert.equal(versus().opponents[0].threat.rung, undefined);   // input untouched
    assert.equal(outcomeWord('weird'), 'Down');
    assert.deepEqual(intentFromReadiedAbility(null, {source: 'x'}), {known: false, word: 'Intent unread'});
});
