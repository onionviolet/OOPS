// Wild creature populations (FRC19/FRC41, proposal LVR26-LVR29): the pure table reader and its one consumer, the Frontier meadow-edge hunt.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove, tempoView} from '../src/tempo_fight.js';
import {tempoOpener} from '../src/tempo_starters.js';
import {defineCreatureTable, createPopulationState, populationAt, recordKill, populationLine, validatePopulationState} from '../src/creature_populations.js';
import {BOW_ITEM, ARROW_ITEM, BOAR, MEADOW_FACT, MEADOW_PLACE, MEADOW_POPULATION, huntOpenerId, meadowView} from '../src/frontier_bow.js';

const DAY = 1440;
const table = defineCreatureTable({id: 't', revision: 1, places: [{id: 'glen', name: 'Glen', creatures: [
    {id: 'elk', name: 'Elk', weight: 3, chance: 1000, number: [1, 2], cap: 4, refillPerDay: 2},
    {id: 'fox', name: 'Fox', weight: 1, chance: 1000, number: [1, 1], cap: 3, refillPerDay: 1},
    {id: 'owl', name: 'Owl', weight: 1, chance: 0, number: [1, 1], cap: 1, refillPerDay: 0}]}]});
const view = (state, at, root = 7) => populationAt(table, state, {root, world: 'w', place: 'glen', at});

test('an untouched place is full, an absent species is never present, and a read writes nothing', () => {
    const s = createPopulationState(), v = view(s, 0);
    assert.deepEqual(v.rows.map(r => [r.id, r.left, r.present]), [['elk', 4, true], ['fox', 3, true], ['owl', 1, false]]);
    assert.deepEqual(s, createPopulationState());
    assert.deepEqual(view(s, 0), v, 'same inputs, same answer (keyed draws)');
});

test('kills fall to the count, never below zero, and refill by the stated rate on played minutes', () => {
    let s = recordKill(table, createPopulationState(), {world: 'w', place: 'glen', species: 'elk', n: 4, at: 100});
    assert.equal(view(s, 100).rows[0].left, 0);
    assert.throws(() => recordKill(table, s, {world: 'w', place: 'glen', species: 'elk', at: 100}), /left to take/);
    assert.equal(view(s, 100).rows[0].nextAt, 100 + DAY / 2, 'two a day: the first returns after half a day');
    assert.equal(view(s, 100 + DAY / 2).rows[0].left, 1);
    assert.equal(view(s, 100 + DAY).rows[0].left, 2);
    assert.equal(view(s, 100 + 10 * DAY).rows[0].left, 4, 'capped');

    s = recordKill(table, s, {world: 'w', place: 'glen', species: 'fox', at: 100 + DAY / 2});
    assert.equal(view(s, 100 + DAY).rows[0].left, 2, 'another species killed does not reset the elk clock');
});

test('the next sighting follows weight among the species about, and never more animals than are left', () => {
    const seen = {elk: 0, fox: 0};
    for(let root = 1; root <= 400; root++) { const n = view(createPopulationState(), 0, root).next; seen[n.id]++; assert.ok(n.number >= 1 && n.number <= 2); }
    assert.ok(seen.elk > seen.fox * 2 && seen.fox > 0, JSON.stringify(seen));
    const one = recordKill(table, recordKill(table, createPopulationState(), {world: 'w', place: 'glen', species: 'elk', n: 3, at: 0}), {world: 'w', place: 'glen', species: 'fox', n: 3, at: 0});
    for(let root = 1; root <= 50; root++) assert.deepEqual([view(one, 0, root).next.id, view(one, 0, root).next.number], ['elk', 1]);
    assert.equal(view(recordKill(table, one, {world: 'w', place: 'glen', species: 'elk', at: 0}), 0).next, null);
});

test('state validates against the table, and a stranger or an overfull node is refused', () => {
    const s = recordKill(table, createPopulationState(), {world: 'w', place: 'glen', species: 'elk', at: 5});
    assert.doesNotThrow(() => validatePopulationState(JSON.parse(JSON.stringify(s)), table, 'w'));
    const bad = JSON.parse(JSON.stringify(s)); Object.values(bad.nodes)[0].stock = 99;
    assert.throws(() => validatePopulationState(bad, table, 'w'));
    assert.throws(() => validatePopulationState({schema: 1, nodes: {'w/t/glen/dragon': {stock: 1, updatedAt: 0, harvests: 0, misses: 0}}}, table, 'w'));
});

test('an empty place says why and when it recovers', () => {
    const s = recordKill(table, createPopulationState(), {world: 'w', place: 'glen', species: 'elk', n: 4, at: 0});
    assert.match(populationLine(view(s, 0), 'elk'), /hunted out for now; elk should return in about a day/);
});

// ---- the consumer: the Frontier boar hunt ----
const key = id => JSON.stringify({id});
const vitals = {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}};
const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .3, crit_multiplier: 1.5, stamina_efficiency: 1};
const me = {stats, attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const helpers = {me, vitals: vitals.player, parts: {}, enemyProfile: () => ({stats: {...stats, attack_points: 12, crit_rate: .05}, attackPower: 4, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5})};
function fresh(clock = 0) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 5; p.state.clock = clock;
    Object.assign(p.gameplay.player.inventory, {[key(BOW_ITEM)]: 1, [key(ARROW_ITEM)]: 40});
    return p;
}
const ctx = p => fieldContext(p, 'Village', {vitals});
// A day on which the boar is about, found by asking the reader.
function aboutDay(p) { for(let d = 0; d < 40; d++) { p.state.clock = d * DAY; if(meadowView(p.state).next) return d; } throw Error('no day'); }
function winHunt(p) {
    const opener = tempoOpener(huntOpenerId('arrow'));
    let plan = beginTempoFight(p.state, registry, ctx(p), opener.spec(p.state, ctx(p), helpers));
    plan.state.simulation.sessions.player.nativeBattle.fighters[BOAR.id].hp = 1;
    const c = ctx({...p, gameplay: plan.gameplay, external: plan.external});
    for(let i = 0; i < 120 && plan.state.simulation.sessions.player; i++) {
        const v = tempoView(plan.state.simulation.sessions.player.nativeBattle);
        const use = id => v.moves.find(x => x.id === id && x.usable);
        plan = commitTempoMove(plan.state, registry, c, {moveId: use('shoot') ? 'shoot' : use('reload') ? 'reload' : 'yield'});
    }
    return plan;
}

test('a won hunt takes a boar from the meadow edge in the same commit; it comes back on played minutes, and reload keeps the count', () => {
    const p = fresh(); aboutDay(p);
    const at = p.state.clock, opener = tempoOpener(huntOpenerId('arrow'));
    assert.equal(meadowView(p.state).rows[0].left, 2);
    assert.equal(p.state.actors.player.facts[MEADOW_FACT], undefined, 'an untouched life writes nothing');
    const plan = winHunt(p);
    assert.equal(plan.state.actors.player.facts['tempo.lastResult'], 'won');
    const after = meadowView(plan.state);
    assert.equal(after.rows[0].left, 1);
    const reloaded = loadExpansionState(JSON.parse(JSON.stringify(plan.state)), registry);
    assert.equal(meadowView(reloaded).rows[0].left, 1, 'save and reload keep the depletion; reload grants nothing');
    // clear the edge: the quote says why and when
    const emptied = structuredClone(plan.state); emptied.actors.player.facts[MEADOW_FACT] = JSON.stringify(recordKill(
        MEADOW_POPULATION, JSON.parse(emptied.actors.player.facts[MEADOW_FACT]), {world: 'base.frontier', place: MEADOW_PLACE, species: BOAR.id, at}));
    emptied.clock = at;
    const q = opener.quote(emptied, ctx({...p, state: emptied}));
    assert.deepEqual([q.visible, q.eligible], [true, false]);
    assert.match(q.reason, /hunted out for now; boar should return in about a day/);
    assert.equal(meadowView({...emptied, clock: at + DAY}).rows[0].left, 1);
    assert.equal(meadowView({...emptied, clock: at + DAY}).rows[0].present, meadowView({...emptied, clock: at + DAY}).rows[0].about);
    assert.throws(() => opener.spec(emptied, ctx({...p, state: emptied}), helpers), /no boar/);
});

test('a yielded hunt takes no boar', () => {
    const p = fresh(); aboutDay(p);
    const opener = tempoOpener(huntOpenerId('arrow'));
    let plan = beginTempoFight(p.state, registry, ctx(p), opener.spec(p.state, ctx(p), helpers));
    const c = ctx({...p, gameplay: plan.gameplay, external: plan.external});
    for(let i = 0; i < 200 && plan.state.simulation.sessions.player; i++) {
        const v = tempoView(plan.state.simulation.sessions.player.nativeBattle);
        plan = commitTempoMove(plan.state, registry, c, {moveId: ['yield', 'withdraw'].find(id => v.moves.some(x => x.id === id && x.usable)) ?? 'guard'});
    }
    assert.notEqual(plan.state.actors.player.facts['tempo.lastResult'], 'won');
    assert.equal(plan.state.simulation.sessions.player, undefined);
    assert.equal(meadowView(plan.state).rows[0].left, 2);
});
