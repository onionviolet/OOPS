// W2a (LT7 Klein): Old Neil's Seer brew through the shared craft engine, and the binding onto the pack's brew and drink acts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {brewSeer, bindSeerBrew, SEER_BREW_BINDING, SEER_BREW_FACTS} from '../src/lotm_seer_brew.js';

test('the formula batch has the Seer’s power and no madness; the same inputs give the same product', () => {
    const p = brewSeer();
    assert.deepEqual(p.outputs, {beyonder: {seer: 57}});
    assert.equal(brewSeer().id, p.id);
});

test('the dose law reads only the crucial two: slightly less is tolerated, slightly more leaves madness, water does nothing', () => {
    assert.deepEqual(brewSeer({'Lavos Squid blood': 9}).outputs, {beyonder: {seer: 54}});
    assert.equal(brewSeer({'Lavos Squid blood': 11}).outputs.spirit.madness, 1);
    assert.equal(brewSeer({'Star Crystal': 40}).outputs.spirit.madness, 2, 'too little crystal leaves the blood unbound');
    const diluted = brewSeer({'Distilled water': 300, 'Gold mint leaf': 20});
    assert.deepEqual(diluted.outputs, brewSeer().outputs);
    assert.notEqual(diluted.id, brewSeer().id, 'a different batch is a different product, with the same reading');
});

test('binding puts the engine product on the brew act and gates the drink on it; without the pack acts it binds nothing', () => {
    assert.equal(bindSeerBrew([{id: 'other', effects: []}]), 0);
    const brew = {id: SEER_BREW_BINDING.brewAct, effects: [{type: 'fact', key: 'x'}]};
    const drink = {id: SEER_BREW_BINDING.consumer, effects: [], requires: {all: [{fact: 'a', op: 'eq', value: true}]}};
    assert.equal(bindSeerBrew([brew, drink]), 2);
    const set = Object.fromEntries(brew.effects.filter(e => e.scope === 'actor').map(e => [e.key, e.value]));
    assert.equal(set[SEER_BREW_FACTS.product], brewSeer().id);
    assert.equal(set[SEER_BREW_FACTS.seer], 57);
    assert.equal(set[SEER_BREW_FACTS.madness], 0);
    for(const k of ['requires', 'completionRequires']) assert.deepEqual(drink[k].all.at(-1), {fact: `actor.${SEER_BREW_FACTS.seer}`, op: 'gte', value: 1, reason: 'The potion has to be brewed first.'});
    assert.equal(drink.requires.all[0].all[0].fact, 'a', 'the pack gate is kept');
});
