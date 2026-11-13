// Companion work orders (CPR15) and opinion kept apart from allegiance (CPR18), FRC55. First caller: the kept Gu.
import test from 'node:test';
import assert from 'node:assert/strict';
import {kId as id, kKey as key, KEEPER_DAY as DAY, KEEPER_GU} from '../src/world_packs/book_gu_keeper.js';
import {keeperHouseView, validateKeeperEnvelope} from '../src/book_world_gu_keeper_domain.js';
import {guOpinionRows, GU_OPINION} from '../src/companion_work_gu_domain.js';
import {defineWorkOrder, readWorkOrder, outputFor} from '../src/companion_work.js';
import {GU_ORDERS} from '../src/companion_work_gu.js';
import {readKeeperOpinion, rememberAbout, opinionBand} from '../src/companion_opinion.js';
import {domainRegistry} from '../src/domain_registry.js';
import {validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {setup} from './helpers/gu_keeper_fixture.mjs';

const resetThoughts = () => domainRegistry.list().find(d => d.id === 'moodThoughts').load(undefined);
const gu = (f, s) => f.p.state.simulation.people[id(s)];
const larder = (f, s, food) => f.p.state.simulation.owners[id(s)]?.[key(food)] || 0;
const stones = f => f.p.gameplay.player.inventory[key('stone')] || 0;
const reserve = f => f.p.state.simulation.energies.player[id('primeval')].reserve;
const row = (f, s) => keeperHouseView(f.p.state, f.d, f.record, f.ctx()).gu.find(r => r.id === s);
// What a written plan stages: the producer's keyed rows (the stage hook the persistence boundary calls).
const stage = f => domainRegistry.stage({state: f.p.state});
const valid = f => { validateStructuredEnvelope(f.envelope()); validateKeeperEnvelope(f.envelope()); };
const refined = () => { for(let seed = 1; seed <= 60; seed++) { const g = setup(seed); g.start('take_moon'); g.start('buy_petals'); g.start('buy_lees');
    g.p.state.simulation.seed = seed * 2654435761 % 4294967295 + 1; g.start('fuse'); if(gu(g, 'moon').vitals.health === 4) return g; } assert.fail('some seed refines'); };

test('seam: an order needs a kind, a being, a place and output; opinion shifts output only for a minded creature', () => {
    assert.throws(() => defineWorkOrder({id: 'x', kind: 'sing', being: 'a', beingLabel: 'A', place: {id: 'p', label: 'P'}, interval: 10, output: []}), /kind/);
    const o = defineWorkOrder({id: 'x', kind: 'tend', being: 'a', beingLabel: 'A', place: {id: 'p', label: 'P'}, interval: 10, minded: true, output: [{to: 'home', key: 'k', label: 'petals', count: 2}]});
    assert.deepEqual([outputFor(o, 'fond')[0].count, outputFor(o, 'even')[0].count, outputFor(o, 'cool')[0].count], [3, 2, 1]);
    assert.equal(outputFor({...o, minded: false}, 'fond')[0].count, 2, 'a held creature has no opinion to put in');
    const r = readWorkOrder(o, {kept: true, alive: true, condition: 2, sound: 3, worked: false, willing: true, essence: 5, opinion: null});
    assert.equal(r.will, false); assert.match(r.line, /too hungry/);
    assert.deepEqual([opinionBand(-5), opinionBand(0), opinionBand(8)], ['cool', 'even', 'fond']);
});

test('a standing tend order works on the played clock: after its meal the Moonlight Gu brings petals into its own larder', () => {
    resetThoughts();
    const f = setup(); f.start('take_moon'); f.start('feed_moon');
    assert.equal(f.quote('order.moon_tend.off').eligible, false);
    f.start('order.moon_tend.on');
    assert.equal(row(f, 'moon').work.set, true); assert.match(row(f, 'moon').work.line, /Tend: the Moon Orchid beds.*2 Moon Orchid petals into its own store/);
    const before = larder(f, 'moon', 'petals'), e0 = reserve(f);
    f.step(DAY);
    // Meal (4 petals) first, then the order (+2): the boundary order is eat, then work.
    assert.equal(larder(f, 'moon', 'petals'), before - 4 + 2);
    assert.equal(f.p.state.actors[id('moon')].facts[id('moon_kept.worked')], true);
    assert.ok(reserve(f) < e0 + 24, 'essence was spent on the order (regen also ran)');
    assert.equal(f.quote('work_moon').eligible, false, 'the hand verb shares the window: one working each');
    assert.equal(stones(f), 3, 'tend output lands in its larder, not your bag');
    valid(f);
});

test('the order reads care: a hungry Gu at condition 2 idles with a reason and makes nothing', () => {
    resetThoughts();
    const f = setup(); f.start('take_moon'); f.start('order.moon_tend.on');
    f.p.state.simulation.people[id('moon')].vitals.health = 2;
    f.p.state.simulation.owners[id('moon')] = {};
    assert.match(row(f, 'moon').work.line, /idle: too hungry to work/);
    f.step(DAY);
    assert.equal(larder(f, 'moon', 'petals'), 0);
    assert.equal(f.p.state.actors[id('moon')].facts[id('moon_kept.worked')], false);
});

test('fetch and guard orders earn the steward’s pay into your bag on their own windows (2 and 3 days)', () => {
    resetThoughts();
    const f = setup(); f.p.gameplay.player.inventory[key('stone')] = 20;
    f.start('buy_lees'); f.start('buy_jade'); f.start('buy_jade');
    for(const s of ['worm', 'jade']) { f.start('take_' + s); f.start('feed_' + s); f.start(`order.${s}_${s === 'worm' ? 'fetch' : 'guard'}.on`); }
    const s0 = stones(f);
    f.step(3 * DAY);
    // worm: one window by day 2 (+1); jade: one window at day 3 (+2).
    assert.equal(stones(f), s0 + 1 + 2);
    assert.match(row(f, 'jade').work.line, /Guard: the clan store shelf/);
    valid(f);
});

test('opinion is apart from allegiance: a bound Gu’s order reads it, it is written per window, and it outlasts giving the Gu back (CPR18)', () => {
    resetThoughts();
    const f = refined(); f.p.gameplay.player.inventory[key('petals')] = 40; f.start('order.moon_tend.on');
    assert.equal(row(f, 'moon').being.grain, 'tied');
    // Two well-kept windows: fed and worked each time -> 2 x (2 + 2) = 8, fond.
    for(let i = 0; i < 2; i++) { f.start('feed_moon'); f.step(DAY); stage(f); stage(f); }
    const o = readKeeperOpinion(id('moon'), 'player', f.p.state.clock);
    assert.equal(o.band, 'fond', JSON.stringify(o)); assert.equal(o.rows.length, 4, 'keyed per window: staging twice adds nothing');
    // Fond: the next window's order brings 3, not 2.
    f.start('feed_moon'); const before = larder(f, 'moon', 'petals'); f.step(DAY);
    assert.equal(larder(f, 'moon', 'petals'), before - 3 + 3, 'refined meal 3, fond tend 3');
    assert.match(f.p.state.simulation.knowledge.player[id('work')].value, /gladly/);
    // Give it back: claim, control and tie end; the order ends; the opinion stays.
    f.start('return_moon');
    const back = row(f, 'moon');
    assert.equal(back.kept, false); assert.equal(back.being.grain, 'held'); assert.equal(f.p.state.actors.player.facts[id('order_moon')], 'none');
    assert.equal(readKeeperOpinion(id('moon'), 'player', f.p.state.clock).band, 'fond');
    assert.match(back.work.remembers, /remembers you: fond/);
    valid(f);
    f.step(DAY); stage(f);
    assert.equal(guOpinionRows(f.p.state).length, 0, 'a Gu in the steward’s care leaves no new rows about you');
    // Take it back: same Gu, the tie returns with the refinement, and it still thinks well of you.
    f.start('retake_moon');
    assert.equal(row(f, 'moon').being.grain, 'tied');
    assert.equal(readKeeperOpinion(id('moon'), 'player', f.p.state.clock).band, 'fond');
    valid(f);
});

test('pushed hungry, a bound Gu cools on you and its order stops until fed; a held Gu leaves no opinion rows', () => {
    resetThoughts();
    const f = refined(); f.start('order.moon_tend.on');
    f.p.state.simulation.people[id('moon')].vitals.health = 2;
    f.start('work_moon_weak_bound'); stage(f);
    const o = readKeeperOpinion(id('moon'), 'player', f.p.state.clock);
    assert.equal(o.band, 'cool'); assert.equal(o.rows[0].line, GU_OPINION.pushed.line);
    f.p.state.simulation.people[id('moon')].vitals.health = 4;
    assert.match(row(f, 'moon').work.line, /holds being worked hungry against you/);
    const h = setup(); h.start('take_moon'); h.start('feed_moon'); h.start('order.moon_tend.on'); h.step(DAY);
    assert.equal(guOpinionRows(h.p.state).length, 0, 'an unrefined Gu is held: no mind, no opinion');
});

test('one push is one memory however long it goes unfed; once fed the cool Gu works its order one petal short (CPR18 cool band)', () => {
    resetThoughts();
    const f = refined(); f.p.gameplay.player.inventory[key('petals')] = 40; f.start('order.moon_tend.on');
    f.p.state.simulation.owners[id('moon')] = {};
    f.p.state.simulation.people[id('moon')].vitals.health = 2;
    f.start('work_moon_weak_bound');
    for(let i = 0; i < 3; i++) { stage(f); f.step(DAY); stage(f); }
    const pushed = readKeeperOpinion(id('moon'), 'player', f.p.state.clock).rows.filter(r => r.line === GU_OPINION.pushed.line);
    assert.equal(pushed.length, 1, 'one push, one row');
    f.start('feed_moon'); assert.equal(row(f, 'moon').resents, false);
    f.p.state.simulation.people[id('moon')].vitals.health = 4;
    assert.equal(readKeeperOpinion(id('moon'), 'player', f.p.state.clock).band, 'cool');
    const before = larder(f, 'moon', 'petals'); f.step(DAY);
    assert.equal(larder(f, 'moon', 'petals'), before - 3 + 1, 'refined meal 3, cool tend 1');
    assert.match(f.p.state.simulation.knowledge.player[id('work')].value, /grudgingly/);
});

test('every Gu with a work order has its events sort after its care rows at the shared boundary', () => {
    const f = setup();
    // Gu added after the work lane (light, glow) have no order row yet; guWorkOrder returns null for them by design.
    for(const g of KEEPER_GU.filter(g => GU_ORDERS[g.slot])) {
        const care = f.d.simulation.events.filter(e => e.id.startsWith(id(`care.${g.slot}.`))).map(e => e.id).sort();
        assert.match(care.at(-1), /\.e_order_/, g.slot);
    }
});
