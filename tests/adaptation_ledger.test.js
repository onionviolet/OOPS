import test from 'node:test';
import assert from 'node:assert/strict';
import {createLedger, expose, advance, rest, response, mitigate, setBearer, validateLedger, keyAt, TURN} from '../src/adaptation_ledger.js';
import {ADAPTIVE_WHEEL as W, BODY_TOLERANCE as B} from '../src/adaptation_catalogue.js';

const hit = (L, key, at, on = 'wheel', from = 'foe') => expose(W, L, {key, at, on, from});
const types = r => r.events.map(e => e.type);

test('first hit starts analysis; one turn counters a simple cut, heals and reveals it', () => {
    let r = hit(createLedger(W, {holder: 'wheel'}), 'slash.cutting.invisible', 0);
    assert.deepEqual(types(r), ['analyzing']);
    assert.equal(response(W, r.ledger, 'slash.cutting').defense, 0);
    r = advance(W, r.ledger, {at: 60});
    assert.deepEqual(types(r), ['turn', 'adapted']);
    assert.equal(r.events[0].heal, true);
    const res = response(W, r.ledger, 'slash.cutting');
    assert.equal(res.defense, TURN); assert.equal(res.sees, true); assert.equal(res.answers, false);
    assert.equal(mitigate(W, r.ledger, 'slash.cutting', 40), 0);
    validateLedger(W, r.ledger);
});

test('repeat hits speed the analysis', () => {
    let once = hit(createLedger(W, {holder: 'wheel'}), 'light.beam', 0);
    let twice = hit(hit(createLedger(W, {holder: 'wheel'}), 'light.beam', 0).ledger, 'light.beam', 10);
    assert.equal(types(advance(W, once.ledger, {at: 50})).includes('adapted'), false);
    assert.equal(types(advance(W, twice.ledger, {at: 50})).includes('adapted'), true);
});

test('a complex phenomenon takes five turns, defense grows per turn, then one more turn answers it', () => {
    let r = hit(createLedger(W, {holder: 'wheel'}), 'space.infinity', 0);
    r = advance(W, r.ledger, {at: 240});
    assert.equal(r.events.filter(e => e.type === 'turn').length, 4);
    assert.equal(response(W, r.ledger, 'space.infinity').stage, 'partial');
    assert.equal(response(W, r.ledger, 'space.infinity').defense, 800);
    r = advance(W, r.ledger, {at: 300});
    assert.ok(types(r).includes('adapted'));
    assert.equal(response(W, r.ledger, 'space.infinity').answers, false, 'analysis stops at adaptation without new exposure');
    assert.equal(types(advance(W, r.ledger, {at: 1000})).length, 0);
    r = hit(r.ledger, 'space.infinity', 1000);
    r = advance(W, r.ledger, {at: 1060});
    assert.ok(types(r).includes('answered'));
    assert.equal(response(W, r.ledger, 'space.infinity').answers, true);
});

test('the bearer feeds the wheel; only the holder gets the result', () => {
    let L = setBearer(createLedger(W, {holder: 'wheel'}), 'tamer');
    assert.throws(() => hit(L, 'space.domain', 0, 'bystander'), /does not bear/);
    let r = advance(W, hit(L, 'space.domain', 0, 'tamer').ledger, {at: 60});
    assert.equal(response(W, r.ledger, 'space.domain', 'tamer').defense, 0);
    assert.equal(response(W, r.ledger, 'space.domain').defense, TURN);
});

test('a paused wheel makes no progress', () => {
    let r = hit(createLedger(W, {holder: 'wheel'}), 'slash.cutting', 0);
    r = advance(W, r.ledger, {at: 500, paused: true});
    assert.equal(r.events.length, 0);
    assert.equal(types(advance(W, r.ledger, {at: 560})).includes('adapted'), true);
});

test('counters: a different attack is unanswered, a related one is partly covered, novelty fills the slots', () => {
    let r = hit(createLedger(W, {holder: 'wheel'}), 'slash.cutting', 0);
    r = advance(W, r.ledger, {at: 60});
    assert.equal(response(W, r.ledger, 'fire.flame').defense, 0);
    assert.equal(response(W, r.ledger, 'slash.domain_barrage').defense, 250, 'spill to the parent family covers related slashes');
    r = hit(r.ledger, 'fire.flame', 61); r = hit(r.ledger, 'impact.fist', 62);
    r = hit(r.ledger, 'gravity.pull', 63);
    assert.deepEqual(types(r), ['unanalyzed']);
    assert.equal(keyAt(W, 'slash.cutting.revision_two'), 'slash.cutting', 'tweaking a technique below the read grain does not dodge it');
});

test('over-adaptation: once adapted to a pull it cannot use that pull', () => {
    let r = advance(W, hit(createLedger(W, {holder: 'wheel'}), 'gravity.pull', 0).ledger, {at: 60});
    assert.equal(response(W, r.ledger, 'gravity.pull').blocksBenefit, true);
});

test('body tolerance (second case): steps on rest after dosing, stops at resistant, fades, blunts the drug', () => {
    const dose = (L, at) => expose(B, L, {key: 'poison.nightshade', at, on: 'self'});
    let L = createLedger(B, {holder: 'self'});
    assert.equal(rest(B, L, {at: 100}).events.length, 0, 'no exposure, no step');
    for(let day = 0; day < 4; day++) L = rest(B, dose(L, day * 1440).ledger, {at: day * 1440 + 600}).ledger;
    let res = response(B, L, 'poison.nightshade');
    assert.equal(res.stage, 'adapted'); assert.equal(res.defense, 600); assert.equal(res.blocksBenefit, true);
    assert.equal(mitigate(B, L, 'poison.nightshade', 10), 4);
    assert.throws(() => advance(W, L, {at: 0}), /only moves forward/);
    const faded = advance(B, L, {at: 3 * 1440 + 600 + 7 * 1440});
    assert.equal(faded.events[0].type, 'faded');
    assert.equal(response(B, faded.ledger, 'poison.nightshade').defense, 450);
    assert.throws(() => rest(W, L, {at: 0}), /does not adapt on rest/);
});

test('transitions are pure and the ledger validates', () => {
    const L = createLedger(W, {holder: 'wheel'}), snap = structuredClone(L);
    hit(L, 'slash.cutting', 0);
    assert.deepEqual(L, snap);
    assert.throws(() => validateLedger(W, {...L, family: 'x'}), /Unsupported/);
    assert.throws(() => hit(L, 'Bad Key', 0), /Invalid phenomenon key/);
});
