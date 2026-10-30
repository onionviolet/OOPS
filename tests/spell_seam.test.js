import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defineSpells, defineSpellAdapter, spellView, settleSpellCast, failureChance, spellRoll} from '../src/spell_seam.js';
import {hpSpellAdapter, hpFormula, spellFromLearnRow} from '../src/spell_adapter_hp.js';
import {lotmSpellAdapter, spellFromTyped, spellFromDivination} from '../src/spell_adapter_lotm.js';
import {LOTM_DIVINATION_ROWS} from '../src/lotm_divination_rows.js';
import {createExpansionState, createContentRegistry, advanceSimulation} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';

const eq = (fact, value = true) => ({fact, op: 'eq', value});
const item = id => ({type: 'item', actor: 'player', key: JSON.stringify({id}), amount: 1});
// Synthetic HP-shaped rows (paraphrased shape only, no source text).
const hpRows = () => [
    {key: 'lighten', label: 'Lightening charm', sourceId: 'hp.sp.wand', formula: hpFormula({words: 'lighten'}), effects: [item('hp.lightened')],
        origin: {kind: 'teacher', gate: {label: 'In a charms lesson', reason: 'Taught in a charms lesson.', requires: eq('actor.hp.in_lesson')}},
        practice: {minutes: 30, mastery: 1}, masteryNeeded: 2, signs: [{at: 1, text: 'It wobbles.'}]},
    {key: 'ward', label: 'Ward charm', sourceId: 'hp.sp.wand', formula: hpFormula(), effects: [item('hp.warded')], prepare: {minutes: 5},
        origin: {kind: 'text', gate: {label: 'Has the primer', reason: 'Needs the primer.', requires: eq('actor.hp.has_primer')}, prerequisites: [{label: 'Knows the lightening charm', reason: 'Learn lightening first.', requires: eq('power.hp.sp.power.lighten.owned')}]},
        practice: {minutes: 30, mastery: 1}, masteryNeeded: 1}];

function world(set, sourceId, facts) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}, {id: set.adapter.worldId, label: 'W'}], sources: set.definition.sources,
        simulation: {commands: set.commands, powers: set.powers, people: [], onEnroll: [{type: 'source', sourceId, operation: 'grant', awakened: true, active: true}, ...set.seeds]}});
    const state = createExpansionState();
    state.actors.player.worldId = set.adapter.worldId; state.worlds[set.adapter.worldId] = {facts: {}, resources: {}, completed: {}};
    Object.assign(state.actors.player.facts, facts);
    const context = {actorId: 'player', worldId: set.adapter.worldId, facts: {}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}, external: {}};
    const f = {set, registry, context, plan: enrollSimulation(state, registry, context)};
    f.q = id => previewSimulationCommand(f.plan.state, f.registry, id, {...f.context, gameplay: f.plan.gameplay});
    f.run = (id, minutes = 0) => {
        const r = commitSimulationCommand(f.plan.state, f.registry, {id}, {...f.context, gameplay: f.plan.gameplay});
        f.plan = {...f.plan, state: r.state, gameplay: r.gameplay};
        if(minutes) { const d = advanceSimulation(r.state, f.registry, minutes, r.external, r.gameplay); f.plan = {...f.plan, state: d.state, gameplay: d.gameplay ?? r.gameplay}; }
        return r;
    };
    return f;
}

test('HP: taught by a lesson, prerequisite spell and primer, practiced, prepared, then cast and the preparation is consumed', () => {
    const set = defineSpells(hpRows(), hpSpellAdapter());
    const f = world(set, 'hp.sp.wand', {'hp.wand_held': true, 'hp.can_speak': true, 'hp.in_lesson': true});
    assert.equal(f.q('hp.sp.learn.lighten').eligible, true);
    assert.match(f.q('hp.sp.learn.ward').reasons.join(' '), /primer|lightening/i, 'refused before its text and prerequisite');
    f.run('hp.sp.learn.lighten');
    assert.equal(f.q('hp.sp.use.lighten').eligible, false, 'known but not practiced');
    for(let i = 0; i < 2; i++) f.run('hp.sp.practice.lighten', 30);
    assert.equal(f.q('hp.sp.use.lighten').eligible, true);
    f.plan.state.actors.player.facts['hp.has_primer'] = true;
    f.run('hp.sp.learn.ward'); f.run('hp.sp.practice.ward', 30);
    assert.equal(f.q('hp.sp.use.ward').eligible, false, 'not prepared');
    f.run('hp.sp.prepare.ward', 5);
    assert.equal(f.q('hp.sp.use.ward').eligible, true);
    f.run('hp.sp.use.ward');
    assert.equal(f.q('hp.sp.use.ward').eligible, false, 'preparation spent by the cast');
    f.plan.state.actors.player.facts['hp.wand_held'] = false;
    assert.equal(f.q('hp.sp.use.lighten').eligible, false, 'no wand, no cast');
});

test('HP: failure falls with mastery, the draw is seeded and repeatable, and strain is refused because the world has no backlash ledger', () => {
    const set = defineSpells(hpRows(), hpSpellAdapter()), s = set.spells.lighten;
    assert.equal(failureChance(s, 2, 2), 0.4);
    assert.ok(Math.abs(failureChance(s, 5, 2) - 0.1) < 1e-9);
    assert.equal(failureChance(s, 99, 2), 0);
    assert.equal(spellRoll(7, 'hp.sp.lighten', 3), spellRoll(7, 'hp.sp.lighten', 3));
    assert.notEqual(spellRoll(7, 'hp.sp.lighten', 3), spellRoll(7, 'hp.sp.lighten', 4));
    const out = settleSpellCast(s, 'hp.sp.lighten', {seed: 7, castIndex: 0, mastery: 2, masteryNeeded: 2, add: () => assert.fail('no ledger')});
    assert.equal(out.strain, null);
    assert.throws(() => defineSpells([{...hpRows()[0], strain: {carrier: 'x', source: 'y', weight: 1}}], hpSpellAdapter()), /no backlash ledger/);
    const v = spellView(set, 'lighten', {facts: {}});
    assert.equal(v.origin.kind, 'teacher'); assert.match(v.failure, /40%/); assert.ok(v.unstated.includes('failure chance') || v.failure);
});

test('the seam refuses an origin the world does not teach by, and a bad adapter', () => {
    assert.throws(() => defineSpells([{...hpRows()[0], origin: {kind: 'sequence'}}], hpSpellAdapter()), /does not teach by "sequence"/);
    assert.throws(() => defineSpellAdapter({worldId: 'w.x', prefix: 'w.x', origins: {bogus: {reason: 'x'}}}), /known kind/);
    assert.throws(() => defineSpells([{...hpRows()[0], surprise: 1}], hpSpellAdapter()), /Unsupported spell field/);
});

test('HP adapter imports nothing from LOTM', () => {
    assert.doesNotMatch(readFileSync(new URL('../src/spell_adapter_hp.js', import.meta.url), 'utf8'), /^import .*lotm/mi);
    assert.doesNotMatch(readFileSync(new URL('../src/spell_seam.js', import.meta.url), 'utf8'), /^import .*lotm/mi);
});

const typed = {id: 'x.ability.flame-jump', name: 'Flame jump', notes: 2, conditions: [{label: 'Fire at hand', fact: 'actor.lotm.fire_at_hand', locator: 'l1'}],
    blockers: [{label: 'Heavy rain', fact: 'actor.lotm.heavy_rain', locator: 'l3'}], stated: [{kind: 'range', value: 1000, unit: 'm', label: 'Range nearly 1000 m', locator: 'l4'}], costs: []};

test('LOTM: a typed ability becomes a sequence-held spell, refused without the sequence or in the rain, and says what it leaves unstated', () => {
    const row = spellFromTyped(typed, {sourceId: 'lotm.sp.seer', sequenceFact: 'actor.lotm.seq9'});
    const set = defineSpells([row], lotmSpellAdapter());
    const v = k => spellView(set, 'flame_jump', {facts: k});
    assert.equal(v({}).ready, false);
    assert.ok(v({}).refusedBy.includes('Holds the sequence'));
    assert.equal(v({'actor.lotm.seq9': true, 'actor.lotm.fire_at_hand': true}).ready, true);
    assert.deepEqual(v({'actor.lotm.seq9': true, 'actor.lotm.fire_at_hand': true, 'actor.lotm.heavy_rain': true}).refusedBy, ['blocked by Heavy rain']);
    assert.ok(v({}).unstated.includes('effect (a generic marker stands in)') && v({}).unstated.includes('failure chance'));
    assert.equal(set.spells.flame_jump.learned, false);
});

test('LOTM: a divination query maps with its means, contact, prepare step and ritual odds; strain lands in the injected ledger, cut by protections', () => {
    const query = LOTM_DIVINATION_ROWS.queries[0];
    const row = spellFromDivination({...query, ritual: undefined}, {sourceId: 'lotm.sp.div'});
    assert.deepEqual(row.formula[0].requires, query.means);
    const set = defineSpells([row], lotmSpellAdapter());
    assert.ok(set.commands.some(c => c.id.startsWith('lotm.sp.prepare.')), 'prepare step becomes a command');
    assert.equal(set.spells[row.key].failure.basis, 'none');
    // strain with a protection
    const s = defineSpells([{...spellFromTyped(typed, {sourceId: 'lotm.sp.seer', sequenceFact: 'actor.lotm.seq9'}), failure: {chance: 1},
        strain: {carrier: 'lotm.body', source: 'lotm.backlash', weight: 5, protections: [{rule: eq('actor.lotm.warded'), reduces: 2}]}}], lotmSpellAdapter()).spells.flame_jump;
    const seen = [];
    const a = settleSpellCast(s, 'lotm.sp.flame_jump', {seed: 1, castIndex: 0, facts: {}, add: (c, x) => seen.push([c, x])});
    assert.equal(a.failed, true); assert.deepEqual(seen, [['lotm.body', {source: 'lotm.backlash', weight: 5}]]);
    seen.length = 0;
    settleSpellCast(s, 'lotm.sp.flame_jump', {seed: 1, castIndex: 1, facts: {'actor.lotm.warded': true}, add: (c, x) => seen.push([c, x])});
    assert.equal(seen[0][1].weight, 3);
});

test('a pack row in the learnable-spells shape maps to a teacher-origin spell', () => {
    const ability = hpRows()[0], pack = {key: 'k', label: 'K', sourceId: 'hp.sp.wand', conditions: ability.formula, cost: [], limit: {kind: 'none'}, effects: ability.effects, ruleId: 'r',
        learn: {teacher: ability.origin.gate, practice: ability.practice, masteryNeeded: 2}};
    const set = defineSpells([spellFromLearnRow(pack)], hpSpellAdapter());
    assert.equal(set.spells.k.origin.kind, 'teacher');
});
