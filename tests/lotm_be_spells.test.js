// W2b (proposal, AD32, LT2): the shared cast lowering's second world caller. Klein's Spirit Vision runs the same lowering as Harry's charm
// with LOTM's law: cost is spirituality, no failure number, so the command stays plain.
import test from 'node:test';
import assert from 'node:assert/strict';
import {lotmBeSpellSet, lotmBeSpellCommands, lotmBeSpellFacts, lotmBeChanceFact} from '../src/lotm_be_spells.js';
import {hpLeadSpellCommands} from '../src/hp_lead_spells.js';
import {lowerSpellCasts} from '../src/spell_cast_lowering.js';
import {BE_SPIRIT_VISION, BE_SPIRIT_EXHAUSTION, BE_SEER_ENERGY, BE_SEER_ENERGY_ID, beSeerUse, beSpiritVisionOnRequires, beSpiritVisionOnEffects} from '../src/book_world_lotm_be_seer.js';
import {createSimulationRegistry, meets, validateSimulationEffect} from '../src/simulation_contracts.js';

const [cmd] = lotmBeSpellCommands;
const base = {'actor.life': 'alive', 'lotm.beSeer.supported': true, [`condition.${BE_SPIRIT_VISION}`]: 0, [`condition.${BE_SPIRIT_EXHAUSTION}`]: 0};

test('the same lowering gives two worlds different laws: LOTM stays plain, Harry gets outcomes', () => {
    assert.equal(lotmBeSpellCommands.length, 2);
    assert.equal(lotmBeSpellSet.spells.spirit_vision.failure.chance, null);
    assert.ok(cmd.effects && !cmd.outcomes, 'no fizzle: LOTM states no failure number');
    assert.deepEqual(lotmBeSpellFacts({simulation: {powers: {player: {}}}}), {});
    assert.equal(lowerSpellCasts(lotmBeSpellSet).find(c => c.id === cmd.id).outcomes, undefined);
    assert.ok(hpLeadSpellCommands[0].outcomes && !hpLeadSpellCommands[0].effects, 'Harry: same function, outcomes');
    assert.deepEqual(lotmBeChanceFact(cmd.id).split('.').slice(0, 3), ['lotm', 'be', 'spell']);
});

test('the cast spends spirituality through the energy use effect, not stamina', () => {
    assert.deepEqual(cmd.costs, [beSeerUse()]);
    assert.equal(cmd.costs[0].type, 'energy'); assert.equal(cmd.costs[0].energyId, BE_SEER_ENERGY_ID);
    assert.ok(!cmd.costs.some(c => c.type === 'vital'));
    for(const c of cmd.costs) validateSimulationEffect(c);
    for(const e of cmd.effects) validateSimulationEffect(e);
});

test('it opens the same Spirit Vision condition the story switch turns on, repeatably, for a while', () => {
    const cond = cmd.effects.find(e => e.type === 'condition');
    assert.equal(cond.id, BE_SPIRIT_VISION); assert.equal(cond.operation, 'apply'); assert.equal(cond.actor, 'player');
    assert.deepEqual({...cond, duration: undefined}, {...beSpiritVisionOnEffects()[0], duration: undefined});
    assert.ok(cond.duration > 0, 'a timed opening');
    assert.equal(cmd.once, undefined, 'repeatable');
    assert.equal(cmd.group, 'book_lotm'); assert.equal(cmd.worldId, 'book.lotm.tingen');
    assert.ok(cmd.effects.some(e => e.type === 'knowledge'), 'leaves a plain note');
});

test('it needs the Seer source, a closed vision and a rested mind: the story\'s own gate', () => {
    assert.ok(cmd.requires.all.some(r => JSON.stringify(r) === JSON.stringify(beSpiritVisionOnRequires())));
    assert.equal(meets(cmd.requires, base), true);
    assert.equal(meets(cmd.requires, {...base, 'lotm.beSeer.supported': false}), false, 'no Seer source, no cast');
    assert.equal(meets(cmd.requires, {...base, [`condition.${BE_SPIRIT_VISION}`]: 1}), false, 'already open');
    assert.equal(meets(cmd.requires, {...base, [`condition.${BE_SPIRIT_EXHAUSTION}`]: 3}), false, 'too worn');
    assert.equal(meets(cmd.requires, {...base, 'actor.life': 'dead'}), false);
});

test('the registry accepts the command with the spirituality pool', () => {
    const defs = createSimulationRegistry({commands: [cmd], energies: [BE_SEER_ENERGY]});
    assert.ok(defs.commands.get(cmd.id));
});

test('player-facing strings carry no engine words', () => {
    const strings = [cmd.label, cmd.requires.reason, ...JSON.stringify(cmd.requires).match(/"reason":"[^"]+"/g).map(s => s.slice(10, -1)),
        ...cmd.effects.filter(e => e.type === 'knowledge').map(e => e.value)];
    for(const s of strings) assert.doesNotMatch(s, /outcome|weight|\bfact\b|chance|failChance|energy|condition|\.[a-z_]+\./i, s);
});
