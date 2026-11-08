// W1b (proposal, AD32, LT2): the shared cast executor. Failure is an engine-drawn outcome weighted by one fact per spell.
import test from 'node:test';
import assert from 'node:assert/strict';
import {defineSpells} from '../src/spell_seam.js';
import {hpSpellAdapter} from '../src/spell_adapter_hp.js';
import {lowerSpellCasts, spellCastFacts, defaultChanceFact} from '../src/spell_cast_lowering.js';
import {hpLeadSpellSet, hpLeadSpellCommands, hpLeadSpellFacts, hpLeadChanceFact} from '../src/hp_lead_spells.js';
import {HP_SPELL_ROWS} from '../src/book_world_hp_lessons.js';
import {HP_LEVITATION} from '../src/world_packs/book_hp_lead_life_data.js';
import {createExpansionState, createContentRegistry} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';

const know = value => ({type: 'knowledge', key: 'test.note', stage: 'understood', value});
const rows = (extra = {}) => [{key: 'lift', label: 'Lift a feather', sourceId: 'x.sp.src', origin: {kind: 'teacher'}, fn: 'support', cost: [{type: 'vital', key: 'stamina', amount: -1}],
    formula: [{label: 'At school', requires: {fact: 'actor.hp.here', op: 'eq', value: true}}], effects: [know('It rose.')],
    practice: {minutes: 30, mastery: 1}, masteryNeeded: 1, ...extra}];
const withFailure = f => rows({failure: f});
const stateAt = (powerId, mastery) => ({simulation: {powers: {player: {[powerId]: {owned: true, mastery}}}}});

test('a spell with a chance lowers to cast and fizzled outcomes weighted from one fact', () => {
    const set = defineSpells(withFailure({chance: 0.5, perMastery: 0.1, outcome: [know('It shivered.')]}), hpSpellAdapter({worldId: 'x.world', prefix: 'x.sp'}));
    const cmd = lowerSpellCasts(set).find(c => c.id === set.ids.lift.command), fact = defaultChanceFact(cmd.id);
    assert.equal(cmd.effects, undefined);
    assert.deepEqual(cmd.outcomes.map(o => o.id), ['cast', 'fizzled']);
    assert.deepEqual(cmd.outcomes[0].weight, {fact, scale: -1, add: 1});
    assert.deepEqual(cmd.outcomes[1].weight, {fact});
    assert.equal(cmd.outcomes[0].effects[0].value, 'It rose.');
    assert.equal(cmd.outcomes[1].effects[0].value, 'It shivered.');
    assert.deepEqual(cmd.costs, [{type: 'vital', key: 'stamina', amount: -1}], 'cost stays on the command, spent either way');
    assert.ok(lowerSpellCasts(set).some(c => c.id === set.ids.lift.learn), 'other commands pass through');
});

test('the chance facts fall as mastery rises: 0.4 at the needed mastery, 0.1 less per extra point (HP adapter)', () => {
    const set = defineSpells(rows(), hpSpellAdapter({worldId: 'x.world', prefix: 'x.sp'})), id = set.ids.lift.command, f = m => spellCastFacts(stateAt(set.ids.lift.power, m), set)[defaultChanceFact(id)];
    assert.equal(f(1), 0.4);
    assert.ok(Math.abs(f(3) - 0.2) < 1e-9);
    assert.equal(f(9), 0);
    assert.equal(spellCastFacts({}, set)[defaultChanceFact(id)], 0.4, 'no power state reads as mastery 0, never above the default');
});

test('a spell with no failure chance keeps its plain command', () => {
    const adapter = hpSpellAdapter({worldId: 'x.world', prefix: 'x.sp', failure: {chance: null, reason: 'none'}});
    const set = defineSpells(rows(), adapter), cmd = lowerSpellCasts(set).find(c => c.id === set.ids.lift.command);
    assert.ok(cmd.effects && !cmd.outcomes);
    assert.deepEqual(spellCastFacts({}, set), {});
});

test('Harry: the cast binds to the learned levitation power, spends stamina and agrees with the Charms class dial', () => {
    const [cmd] = hpLeadSpellCommands;
    assert.equal(hpLeadSpellCommands.length, 2);
    assert.equal(cmd.powerId, HP_LEVITATION);
    assert.ok(cmd.requires.all.some(r => r.fact === `power.${HP_LEVITATION}.owned` && r.value === true));
    assert.ok(cmd.requires.all.some(r => r.fact === 'actor.hp.lead.atSchool'));
    assert.deepEqual(cmd.costs, [{type: 'vital', key: 'stamina', amount: -1}]);
    assert.equal(cmd.group, 'structured_local'); assert.equal(cmd.worldId, 'book.hp.lead.world'); assert.deepEqual(cmd.audience, ['$actor']);
    assert.equal(cmd.location, 'book.hp.lead.school_hall');
    const fact = hpLeadChanceFact(cmd.id);
    assert.deepEqual(cmd.outcomes.map(o => o.weight.fact), [fact, fact]);
    assert.deepEqual(HP_SPELL_ROWS[0].failure, {chance: 0.6, perMastery: 0.1});
    assert.equal(hpLeadSpellFacts(stateAt(HP_LEVITATION, 0))[fact], HP_SPELL_ROWS[0].failure.chance);
    assert.ok(hpLeadSpellSet.cards.levitation_charm.unstated.some(u => /^wand/.test(u)), 'wand is recorded as a gap');
});

test('failure scenario: at mastery 0 a cast can fizzle; at high mastery the fizzle weight is 0', () => {
    const [cmd] = hpLeadSpellCommands, fact = hpLeadChanceFact(cmd.id);
    const weights = m => { const c = hpLeadSpellFacts(stateAt(HP_LEVITATION, m))[fact]; return {cast: 1 - c, fizzled: c}; };
    assert.ok(weights(0).fizzled > 0);
    assert.equal(weights(12).fizzled, 0);
    assert.equal(weights(12).cast, 1);
});

test('the engine draws the lowered command: both outcomes occur at the first-try chance, and a zero chance only ever casts', () => {
    const [cmd] = hpLeadSpellCommands, { location, ...local } = cmd;
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}, {id: cmd.worldId, label: 'W'}],
        simulation: {commands: [local], powers: [{id: HP_LEVITATION, revision: 1, label: 'Levitation charm', model: 'practice', capacity: 1, cooldown: 0}], people: [], onEnroll: [{type: 'power', powerId: HP_LEVITATION, operation: 'learn'}]}});
    const draw = (chance, seeds) => {
    const seen = new Set();
    for(let seed = 1; seed <= seeds && (chance === 0 || seen.size < 2); seed++) {
        const state = createExpansionState(seed);
        state.actors.player.worldId = cmd.worldId; state.worlds[cmd.worldId] = {facts: {}, resources: {}, completed: {}};
        state.actors.player.facts['hp.lead.atSchool'] = true;
        const context = {actorId: 'player', worldId: cmd.worldId, facts: {[hpLeadChanceFact(cmd.id)]: chance}, vitals: {player: {health: 100, stamina: 100, max_health: 100, max_stamina: 100}},
            gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}, external: {}};
        const plan = enrollSimulation(state, registry, context);
        const r = commitSimulationCommand(plan.state, registry, {id: cmd.id}, {...context, gameplay: plan.gameplay, vitals: plan.vitals ?? context.vitals});
        const k = r.state.simulation.knowledge.player['book.hp.lead.spell.levitation.last'];
        seen.add(/rose/.test(k.value) ? 'cast' : 'fizzled');
    }
    return [...seen].sort(); };
    assert.deepEqual(draw(0.6, 60), ['cast', 'fizzled']);
    assert.deepEqual(draw(0, 15), ['cast']);
});

test('player-facing strings carry no engine words', () => {
    const [cmd] = hpLeadSpellCommands, strings = [cmd.label, cmd.requires.reason, ...cmd.requires.all.map(r => r.reason).filter(Boolean),
        ...cmd.outcomes.flatMap(o => o.effects.map(e => e.value).filter(v => v != null))];
    for(const s of strings) assert.doesNotMatch(s, /outcome|weight|\bfact\b|chance|failChance|\.[a-z_]+\./i, s);
});

test('practice: every cast adds to the power, lifted or not (Harry), and to the faculty for a plain command (Klein)', async () => {
    const {HP_LEVITATION} = await import('../src/world_packs/book_hp_lead_life_data.js');
    const [cmd] = hpLeadSpellCommands;
    for(const o of cmd.outcomes) assert.deepEqual(o.effects.at(-1), {type: 'power', powerId: HP_LEVITATION, operation: 'refine', amount: 1}, o.id);
    const {lotmBeSpellCommands} = await import('../src/lotm_be_spells.js');
    const {BE_SEER_SOURCE} = await import('../src/book_world_lotm_be_seer.js');
    assert.deepEqual(lotmBeSpellCommands[0].effects.at(-1), {type: 'source', sourceId: BE_SEER_SOURCE, operation: 'develop', amount: 1});
    assert.throws(() => lowerSpellCasts(hpLeadSpellSet, {practice: {amount: 1}}), /one power or source/);
    assert.throws(() => lowerSpellCasts(hpLeadSpellSet, {practice: {powerOf: () => 'x', sourceOf: () => 'y', amount: 1}}), /one power or source/);
});
