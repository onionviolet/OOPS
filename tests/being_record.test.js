import test from 'node:test';
import assert from 'node:assert/strict';
import {readBeing, readCare, readTie, validateBeing, defineFamily, advanceStage, bodyAtStage, beingCard} from '../src/being_record.js';
import {NORBERT, RIDGEBACK, norbertBeing, norbertCard} from '../src/being_norbert.js';
import {guBeing, guCard, guDef} from '../src/being_gu.js';
import {HP_LEAD_NORBERT} from '../src/book_world_hp_lead_norbert.js';

const state = (...acts) => ({actors: {player: {completed: Object.fromEntries(acts.map(a => [`${HP_LEAD_NORBERT}.${a}`, 1]))}}});

test('Norbert moves from egg (held) to hatchling (tied) and keeps his id (CPR1, CPR10)', () => {
    assert.equal(norbertBeing(state()), null);
    const egg = norbertBeing(state('hut'));
    assert.deepEqual([egg.grain, egg.stage, egg.holder], ['held', 'egg', 'Hagrid']);
    assert.equal(egg.ties.length, 0);
    const hatched = norbertBeing(state('hut', 'hatch'));
    assert.deepEqual([hatched.id, hatched.grain, hatched.stage], [egg.id, 'tied', 'hatchling']);
    assert.deepEqual(hatched.body.tags, ['stage:hatchling']);
    assert.equal(hatched.custody.length, 2);
    for (const r of [egg, hatched, norbertBeing(state('hut', 'hatch', 'collect', 'handoff'))]) validateBeing(JSON.parse(JSON.stringify(r)));
});

test('custody history survives the grain change and the handoff (CPR7, ITM4)', () => {
    const end = norbertBeing(state('hut', 'hatch', 'collect', 'handoff'));
    assert.deepEqual(end.custody.map(c => c.step), ['egg', 'hatched', 'crated', 'handed']);
    assert.equal(end.holder, 'Charlie’s friends');
    assert.deepEqual(end.custody.map(c => c.grain), ['held', 'tied', 'tied', 'tied']);
});

test('the egg and adult stages come from one family row (CPR24)', () => {
    assert.deepEqual(RIDGEBACK.stages.map(s => s.id), ['egg', 'hatchling', 'adult']);
    const moved = advanceStage(bodyAtStage(RIDGEBACK, 'egg'), RIDGEBACK, 'egg', 'adult');
    assert.equal(moved.ok, true);
    assert.equal(moved.creature.stage, 'adult');
    assert.deepEqual(moved.creature.tags, ['stage:adult']);
    assert.equal(moved.creature.eats, true);
    assert.equal(bodyAtStage(RIDGEBACK, 'egg').eats, false);
});

test('the tie reader changes what the creature does; a held Gu has no tie to read (TIE19, CPR3)', () => {
    const t = readTie(norbertBeing(state('hut', 'hatch')));
    const by = Object.fromEntries(t.rows.map(r => [r.who, r.behaviours.join(',')]));
    assert.match(by.Hagrid, /settles with Hagrid.*follows Hagrid/);
    assert.match(by.Ron, /snaps at Ron/);
    assert.match(by.you, /warns you off/);
    const hungry = readTie(norbertBeing(state('hut', 'hatch')), {state: 'hungry'});
    assert.match(hungry.rows[0].behaviours[0], /refuses to be handled/);
    const gu = guBeing({id: 'moon', label: 'Moonlight Gu', kept: true});
    assert.equal(gu.grain, 'held');
    assert.equal(readTie(gu).rows.length, 0);
    assert.match(readTie(gu).line, /Held, not tied/);
});

const row = o => ({id: 'moon', label: 'Moonlight Gu', kept: true, alive: true, condition: 4, maxCondition: 4, willEat: true, worked: false, lethal: false, refined: false, ...o});
test('one care reader serves both creatures; Gu work ability keeps its words (CPR2, FLR4)', () => {
    const ability = o => guCard(row(o)).care.ability;
    assert.equal(ability({}), 'sound');
    assert.equal(ability({worked: true}), 'worked this window');
    assert.equal(ability({condition: 2}), 'works through hunger at risk');
    assert.equal(ability({condition: 1}), 'starved out');
    assert.equal(guCard(row({condition: 2, willEat: false})).care.state, 'hungry');
    assert.equal(guCard(row({kept: false})).care.state, 'not in your care');
    assert.equal(guCard(row({kept: false})).custody.length, 1);
    assert.equal(guCard(row()).custody.length, 2);
    const eggCare = readCare(norbertBeing(state('hut')), {kind: 'provisioned', by: 'Hagrid', stocked: false});
    assert.equal(eggCare.state, 'no meals');
    const crated = norbertCard(state('hut', 'hatch', 'collect'));
    assert.equal(crated.care.state, 'provisioned');
    assert.equal(norbertCard(state('hut', 'hatch')).care.state, 'kept by another');
});

test('a refined Gu is a layer on the same body; grains are a world dial', () => {
    assert.deepEqual(guBeing(row({refined: true})).body.tags, ['stage:living', 'refined']);
    assert.throws(() => readBeing({...guDef(row()), grains: ['tied']}, {}), /no held grain/);
    assert.throws(() => defineFamily({id: 'x', label: 'x', stages: []}), /stages/);
    assert.equal(beingCard(norbertBeing(state('hut')), null).grain, 'held');
});
