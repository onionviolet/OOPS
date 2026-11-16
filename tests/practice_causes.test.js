import test from 'node:test';
import assert from 'node:assert/strict';
import {practiceCause, practiceCauseLines, registerPracticeGate} from '../src/practice_causes.js';

test('PS168: a shut gate names its cause; an open one or an unknown fact says nothing', () => {
    assert.equal(practiceCause('Iron skin', {wearingArmor: true}), 'your armour takes the hits it learns from');
    assert.equal(practiceCause('Iron skin', {wearingArmor: false}), '');
    assert.equal(practiceCause('Fortitude', {woundsTaken: 0}), 'it learns from wounds, and nothing has hurt you yet');
    assert.equal(practiceCause('Fortitude', {}), '', 'no reading of wounds is not the same as no wounds');
    assert.equal(practiceCause('Poison resistance', {poisoned: false}), 'it builds while poison is in you, and none has taken hold');
    assert.equal(practiceCause('Cooking', {wearingArmor: true}), '', 'a skill with no known gate stays unexplained');
});

test('PS168: lines follow the quiet skills in order, named by the caller, and a world can add a gate', () => {
    const lines = practiceCauseLines(['Iron skin', 'Evasion', 'Combat'], {wearingArmor: true, usingShield: true}, id => id === 'Iron skin' ? 'Wooden skin' : id);
    assert.deepEqual(lines, ['Wooden skin: your armour takes the hits it learns from.', 'Evasion: you block with a shield instead of dodging.']);
    registerPracticeGate('Spear dance', f => f.inArmour ? 'the dance needs a light step' : '');
    assert.deepEqual(practiceCauseLines(['Spear dance'], {inArmour: true}), ['Spear dance: the dance needs a light step.']);
    assert.throws(() => registerPracticeGate('x', 'nope'));
});
