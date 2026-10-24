import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {settleCappedSkillGain, bankedSkillXP, skillOverflowRow} from '../src/skill_overflow_domain.js';

const reset = () => domainRegistry.load({});
const frontier = {worldId: 'base.frontier', cap: 10, xpToNext: 100};

test('frontier banks excess past the single-gain cap and drains it into later gains', () => {
    reset();
    assert.equal(settleCappedSkillGain({...frontier, skillId: 'Herbalism', xp: 35}), 10);
    assert.equal(bankedSkillXP('Herbalism', 'base.frontier'), 25);
    assert.equal(settleCappedSkillGain({...frontier, skillId: 'Herbalism', xp: 4}), 8, 'a gain releases as much again');
    assert.equal(bankedSkillXP('Herbalism', 'base.frontier'), 21);
    assert.equal(settleCappedSkillGain({...frontier, skillId: 'Herbalism', xp: 7}), 10, 'never past the cap');
    assert.equal(bankedSkillXP('Herbalism', 'base.frontier'), 18);
    assert.equal(settleCappedSkillGain({...frontier, skillId: 'Herbalism', xp: 0.1}), 0.2, 'a trivial gain releases a trivial amount');
    assert.equal(bankedSkillXP('Literacy', 'base.frontier'), 0);
    reset();
    settleCappedSkillGain({...frontier, skillId: 'Breathing', xp: 3});
    assert.equal(domainRegistry.save({}).skill_overflow, undefined, 'gains under the cap leave no empty slice');
});

test('the bank holds at most the world dial (one level of XP on the frontier)', () => {
    reset();
    settleCappedSkillGain({...frontier, skillId: 'Herbalism', xp: 500});
    assert.equal(bankedSkillXP('Herbalism', 'base.frontier'), 100);
});

test('unlisted worlds keep the stated loss, and a frontier bank does not drain elsewhere', () => {
    reset();
    settleCappedSkillGain({...frontier, skillId: 'Herbalism', xp: 30});
    assert.equal(skillOverflowRow('p23.mistglass').policy, 'lost');
    assert.equal(settleCappedSkillGain({worldId: 'p23.mistglass', cap: 10, xpToNext: 100, skillId: 'Herbalism', xp: 30}), 10);
    assert.equal(settleCappedSkillGain({worldId: 'p23.mistglass', cap: 10, xpToNext: 100, skillId: 'Herbalism', xp: 2}), 2);
    assert.equal(bankedSkillXP('Herbalism', 'p23.mistglass'), 0);
    assert.equal(bankedSkillXP('Herbalism', 'base.frontier'), 20);
});

test('the bank survives a save envelope round trip, old saves start empty, bad slices are refused', () => {
    reset();
    settleCappedSkillGain({...frontier, skillId: 'Herbalism', xp: 30});
    const envelope = domainRegistry.save({});
    assert.deepEqual(envelope.skill_overflow, {schema: 1, bank: {'base.frontier': {Herbalism: 20}}});
    reset();
    assert.equal(bankedSkillXP('Herbalism', 'base.frontier'), 0);
    domainRegistry.validate(envelope); domainRegistry.load(envelope);
    assert.equal(bankedSkillXP('Herbalism', 'base.frontier'), 20);
    assert.throws(() => domainRegistry.validate({skill_overflow: {schema: 1, bank: {'base.frontier': {Herbalism: -3}}}}), /skill overflow/);
});
