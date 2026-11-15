// Fang Yuan's ordinary day: the meal clock his day extension reads (ri_lead_day_facts.js) and the extension's shape.
// The played journey on his ch140 save is in ri_lead_day_journey.test.js (slow tier).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {riLeadDayFacts, RI_DAY_DIETS, RI_DAY_DIALS, RI_DAY_ITEMS, RI_LEAD_DAY, RI_MEAT_NOTE, RI_PATROL_ENCOUNTERS, RI_PATROL_FIGHT_ROWS, RI_WOLF_AT_WALL, RI_WOLF_PART_ITEMS, riSeaMinutesPerPart} from '../src/ri_lead_day_facts.js';
import {settleSea, stageSea} from '../src/ri_lead_sea_domain.js';
import {guLeadDay, GU_LEAD_DAY_BOARD, patrolYield} from '../src/world_packs/book_gu_lead_day.js';
import {RI_WOLF_PARTS} from '../src/ri_wolf_tide.js';

const life = (clock, fed = {}) => ({clock, actors: {player: {worldId: 'book.ri.lead.world'}},
    simulation: {knowledge: {player: Object.fromEntries(Object.entries(fed).map(([slot, at]) => [`${RI_LEAD_DAY}.fed.${slot}`, {at}]))}}});
const f = (state, slot, k) => riLeadDayFacts(state)[`${RI_LEAD_DAY}.${slot}.${k}`];

test('a Gu never fed through the day is due and hungry, so the first day starts with a meal', () => {
    for(const d of RI_DAY_DIETS) {assert.equal(f(life(0), d.slot, 'due'), true); assert.equal(f(life(0), d.slot, 'hungry'), true);}
});

test('the Moonglow eats morning and evening: refused just after a meal, due after six hours, hungry after a missed meal', () => {
    const fedAt = 10_000;
    assert.equal(f(life(fedAt + 60, {moonglow: fedAt}), 'moonglow', 'due'), false);
    assert.equal(f(life(fedAt + 7 * 60, {moonglow: fedAt}), 'moonglow', 'due'), true);
    assert.equal(f(life(fedAt + 7 * 60, {moonglow: fedAt}), 'moonglow', 'hungry'), false);
    assert.equal(f(life(fedAt + 13 * 60, {moonglow: fedAt}), 'moonglow', 'hungry'), true);
});

test('the Liquor Worm\'s jar lasts four days and the White Jade\'s parcel twenty (canon rows)', () => {
    assert.equal(f(life(3 * 1440, {worm: 0}), 'worm', 'hungry'), false);
    assert.equal(f(life(4 * 1440 + 1, {worm: 0}), 'worm', 'hungry'), true);
    assert.equal(f(life(19 * 1440, {jade: 0}), 'jade', 'hungry'), false);
    assert.equal(f(life(20 * 1440 + 1, {jade: 0}), 'jade', 'hungry'), true);
});

test('other lives never see the day\'s facts', () => {
    assert.deepEqual(riLeadDayFacts({clock: 0, actors: {player: {worldId: 'book.ri.keeper.world'}}}), {});
});

test('the extension pays real costs; the patrol reads hunger, the sea and the last watch, and the report draws the night', () => {
    const cmd = name => guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.${name}`);
    assert.ok(guLeadDay.commands.every(c => c.once === false), 'every day verb repeats');
    const patrol = JSON.stringify(cmd('patrol').requires);
    assert.match(patrol, /book\.ri\.lead\.day\.moonglow\.hungry/);
    assert.match(patrol, /energy\.book\.ri\.lead\.primeval\.reserve/);
    assert.match(patrol, /book\.ri\.lead\.day\.hurt/);
    assert.deepEqual(cmd('buy_petals').costs, [{type: 'item', actor: 'player', key: JSON.stringify({id: 'book.ri.lead.refinement.primeval_stone'}), amount: -RI_DAY_DIALS.petalBag.stones}]);
    assert.ok(cmd('feed_moonglow').costs.some(c => c.key === JSON.stringify({id: 'book.ri.lead.dorm.petals'}) && c.amount === -2));
    const report = cmd('report');
    assert.equal(report.duration, 0);
    assert.equal(report.outcomes.length, RI_PATROL_ENCOUNTERS.length);
    for(const o of report.outcomes) assert.ok(o.effects.some(e => e.type === 'knowledge' && e.key === `${RI_LEAD_DAY}.patrol` && e.value), `${o.id} leaves a result line`);
    assert.ok(RI_PATROL_ENCOUNTERS.every(r => r.back <= RI_DAY_DIALS.patrol.parts), 'a night never returns more than it took');
    assert.deepEqual(RI_PATROL_FIGHT_ROWS, ['wolf_attack']);
});

test('the sea refills on its own at the C-grade pace, the same over one long write or many short ones, and banks nothing while full', () => {
    assert.equal(riSeaMinutesPerPart(44), 15);
    const long = settleSea({reserve: 3, capacity: 44, anchor: 0, now: 600, per: 15});
    let split = {reserve: 3, anchor: 0};
    for(let t = 7; t <= 600; t += 7) split = settleSea({...split, capacity: 44, now: t, per: 15});
    split = settleSea({...split, capacity: 44, now: 600, per: 15});
    assert.deepEqual(split, long);
    assert.deepEqual(long, {reserve: 43, anchor: 600});
    assert.deepEqual(settleSea({reserve: 44, capacity: 44, anchor: 0, now: 6000, per: 15}), {reserve: 44, anchor: 6000});
    assert.deepEqual(settleSea({reserve: 40, capacity: 44, anchor: 0, now: 6000, per: 15}), {reserve: 44, anchor: 6000});
});

test('the sea is settled only in his life and only once the ordinary day has begun', () => {
    const plan = (known, clock = 0, world = 'book.ri.lead.world') => ({state: {clock, actors: {player: {worldId: world}},
        simulation: {knowledge: {player: known}, energies: {player: {'book.ri.lead.primeval': {policy: {capacity: 44}, reserve: 3}}}}}});
    const story = plan({'book.ri.lead.ice_crystal.ice': {at: 0}}, 0); stageSea(story); const later = plan({'book.ri.lead.ice_crystal.ice': {at: 0}}, 600); stageSea(later);
    assert.equal(later.state.simulation.energies.player['book.ri.lead.primeval'].reserve, 3, 'story replays keep their numbers');
    const day = {[`${RI_LEAD_DAY}.drawn`]: {at: 0}};
    stageSea(plan(day, 0)); const after = plan(day, 600); stageSea(after);
    assert.equal(after.state.simulation.energies.player['book.ri.lead.primeval'].reserve, 43);
    const elsewhere = plan(day, 1200, 'book.ri.keeper.world'); stageSea(elsewhere);
    assert.equal(elsewhere.state.simulation.energies.player['book.ri.lead.primeval'].reserve, 3);
});

test('a wolf attack leaves the wolf at the wall: the patrol waits until the live hunt or the watch settles it', () => {
    const cmd = name => guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.${name}`);
    const wolf = cmd('report').outcomes.find(o => o.id === `${RI_LEAD_DAY}.patrol.wolf_attack`);
    assert.ok(wolf.effects.some(e => e.type === 'fact' && e.key === RI_WOLF_AT_WALL.fact && e.value === true));
    assert.ok(!wolf.effects.some(e => e.type === 'item'), 'merit waits for how the wolf is settled');
    assert.match(JSON.stringify(cmd('patrol').requires), /book\.ri\.lead\.day\.wolf_waiting/);
    const drive = cmd('drive_off');
    assert.equal(drive.duration, 0);
    assert.ok(drive.effects.some(e => e.key === RI_WOLF_AT_WALL.fact && e.value === false));
    assert.ok(drive.effects.some(e => e.type === 'item' && e.key === JSON.stringify({id: RI_WOLF_AT_WALL.tally}) && e.amount === 1), 'a wolf that runs leaves a tally, not merit');
    const facts = waiting => riLeadDayFacts({clock: 0, actors: {player: {worldId: 'book.ri.lead.world', facts: waiting ? {[RI_WOLF_AT_WALL.fact]: true} : {}}}, simulation: {knowledge: {player: {}}}});
    assert.equal(facts(false)[`${RI_LEAD_DAY}.wolf_waiting`], false);
    assert.equal(facts(true)[`${RI_LEAD_DAY}.wolf_waiting`], true);
});

const MERIT = JSON.stringify({id: RI_DAY_ITEMS.merit});
// Until the combat lane's hunt drops parts instead of paying merit (it then removes itself here).
const KNOWN_MERIT_WRITERS = [];

test('a patrol night yields wolf parts, never merit: the alliance board is the one merit writer', () => {
    const writers = guLeadDay.commands.flatMap(c => [c.effects || [], ...(c.outcomes || []).map(o => o.effects)].flat()
        .filter(e => e.type === 'item' && e.key === MERIT && e.amount > 0).map(() => c.id));
    assert.deepEqual([...new Set(writers)].sort(), [...GU_LEAD_DAY_BOARD].sort());
    const src = new URL('../src/', import.meta.url);
    const outside = readdirSync(src).filter(f => f.endsWith('.js') && !['ri_lead_day_facts.js', ...KNOWN_MERIT_WRITERS].includes(f))
        .filter(f => /RI_DAY_ITEMS\.merit|ear_grass\.merit|killMerit|driveOffMerit/.test(readFileSync(new URL(f, src), 'utf8')));
    assert.deepEqual(outside, [], 'no runtime module outside the day writes battle merit');
    assert.ok(RI_PATROL_ENCOUNTERS.every(r => !('merit' in r)));
    const report = guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.report`);
    const large = report.outcomes.find(o => o.id.endsWith('large_pack')).effects;
    for(const id of Object.values(RI_WOLF_PART_ITEMS)) assert.ok(large.some(e => e.type === 'item' && e.key === JSON.stringify({id}) && e.amount > 0), `a large pack yields ${id}`);
    assert.ok(large.some(e => e.type === 'knowledge' && e.key === RI_MEAT_NOTE), 'meat that comes back starts its spoil clock');
    for(const id of Object.values(RI_WOLF_PART_ITEMS).filter(id => id !== RI_DAY_ITEMS.eye)) assert.ok(guLeadDay.items.some(i => i.id === id), `${id} is named in Inventory`);
});

test('wolf meat sells while fresh and is thrown out once it has turned (about three days)', () => {
    const facts = (clock, at) => riLeadDayFacts({clock, actors: {player: {worldId: 'book.ri.lead.world', facts: {}}}, simulation: {knowledge: {player: at == null ? {} : {[RI_MEAT_NOTE]: {at}}}}})[`${RI_LEAD_DAY}.meat_fresh`];
    assert.equal(facts(0), true, 'no meat yet reads as nothing spoiled');
    assert.equal(facts(2 * 1440, 0), true);
    assert.equal(facts(3 * 1440 + 1, 0), false);
    const cmd = name => guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.${name}`);
    assert.match(JSON.stringify(cmd('sell_meat').requires), /meat_fresh[^}]*"value":true/);
    assert.match(JSON.stringify(cmd('throw_meat').requires), /meat_fresh[^}]*"value":false/);
    assert.ok(cmd('sell_pelt').effects.some(e => e.key === JSON.stringify({id: RI_DAY_ITEMS.stone}) && e.amount === RI_DAY_DIALS.peltSale.stones));
});

test('one source of wolf yields: the patrol counts dead wolves, ri_wolf_tide.js says what a wolf gives (PS2, RWT1)', () => {
    for(const r of RI_PATROL_ENCOUNTERS) for(const field of ['eyes', 'pelts', 'meat', 'merit']) assert.ok(!(field in r), `${r.id} carries no ${field} count of its own`);
    const quiet = patrolYield(RI_PATROL_ENCOUNTERS.find(r => r.id === 'quiet'));
    assert.equal(quiet.eye, 2 * RI_WOLF_PARTS.eye.ordinary, 'eyes are the wolves times the table');
    assert.equal(quiet.meat, Math.min(2 * RI_WOLF_PARTS.meat.ordinary, RI_DAY_DIALS.carry.meat), 'meat is capped by what one man carries');
    assert.deepEqual(Object.keys(patrolYield(RI_PATROL_ENCOUNTERS.find(r => r.id === 'carcasses'))), ['eye'], 'old carcasses keep only their eyes');
    const report = guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.report`);
    for(const r of RI_PATROL_ENCOUNTERS) {
        const effects = report.outcomes.find(o => o.id === `${RI_LEAD_DAY}.patrol.${r.id}`).effects;
        for(const [part, id] of Object.entries(RI_WOLF_PART_ITEMS)) {
            const given = effects.filter(e => e.type === 'item' && e.key === JSON.stringify({id})).reduce((n, e) => n + e.amount, 0);
            assert.equal(given, patrolYield(r)[part] ?? 0, `${r.id} gives the table's ${part}`);
        }
    }
});

test('a refined wild Moonlight Gu eats like any Moonlight Gu, and each feed verb shows only while that Gu is held', () => {
    const wild = RI_DAY_DIETS.find(d => d.slot === 'wild_moonlight');
    assert.equal(wild.gu, 'book.ri.lead.wild_refinement.moonlight_gu');
    assert.deepEqual([wild.perMeal, wild.interval], [2, 720]);
    for(const d of RI_DAY_DIETS) {
        const feed = guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.feed_${d.slot}`);
        assert.match(JSON.stringify(feed.visibleWhen), new RegExp(`item\\.\\{\\\\"id\\\\":\\\\"${d.gu.replaceAll('.', '\\.')}\\\\"\\}`), `${d.slot} shows only while held`);
        assert.ok(feed.effects[0].value.endsWith(d.fedLine));
    }
});

test('the report draws with the tide: each night row weighs what riEncounterWeights says, and a dateless life keeps the static weights', async () => {
    const {riLeadDayTideFacts, riPatrolWeightFact} = await import('../src/ri_lead_day_tide.js');
    const report = guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.report`);
    for(const r of RI_PATROL_ENCOUNTERS) assert.deepEqual(report.outcomes.find(o => o.id === `${RI_LEAD_DAY}.patrol.${r.id}`).weight, {fact: riPatrolWeightFact(r.id)});
    const dateless = {...life(0), simulation: {seed: 1, knowledge: {player: {}}}};
    const facts = riLeadDayTideFacts(dateless);
    for(const r of RI_PATROL_ENCOUNTERS) assert.equal(facts[riPatrolWeightFact(r.id)], r.weight, r.id);
    assert.equal(facts['book.ri.lead.wolf_tide.phase'], 'off', 'a dateless life reads the tide as off');
    assert.deepEqual(riLeadDayTideFacts({clock: 0, actors: {player: {worldId: 'book.hp.lead.world'}}}), {}, 'other lives publish nothing');
});

test('player words carry no source notes (PRS1), say "1 stone", and a meal offers no repeat', () => {
    const shown = [guLeadDay.label, guLeadDay.description, ...guLeadDay.items.flatMap(i => [i.label, i.description]), ...guLeadDay.commands.flatMap(c => [c.label, c.description || ''])];
    for(const t of shown) assert.doesNotMatch(t, /\(ch\d|Authored|the source|\b1 stones\b/, t);
    for(const d of RI_DAY_DIETS) assert.equal(guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.feed_${d.slot}`).duration, 0, 'repeatable means not once and longer than zero');
});
