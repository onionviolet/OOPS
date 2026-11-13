// Gu abilities and killer moves in the keeper life (GKM1, GKM2, GKM5-GKM8, GKM10; SKR21 calibration).
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {guKeeperLife as raw, kId as id, kKey as key, KEEPER_DAY as DAY, KEEPER_MOVES} from '../src/world_packs/book_gu_keeper.js';
import {createContentRegistry, createExpansionState, advanceSimulation, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign, structuredCampaignView} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand, previewSimulationCommand} from '../src/simulation.js';
import {defineRecipe, assignments, composeMove, moveReadiness, moveCost} from '../src/composed_moves.js';
import {guReadiness, keeperMoveFacts} from '../src/gu_keeper_move_view.js';
import {validateKeeperEnvelope} from '../src/book_world_gu_keeper_domain.js';
import {guBeing} from '../src/being_gu.js';

const hash = o => 'sha256:' + createHash('sha256').update(JSON.stringify(o)).digest('hex');
function setup(seed = 909) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash: hash(raw), starts: raw.starts.map(b => ({...b, snapshotHash: hash(b)}))};
    const base = createExpansionState(seed), nativeBody = {id: 'native.body', ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult'};
    const context = {registry, actorId: 'player', worldId: 'base.frontier', nativeAlive: true, nativeReady: true, nativeBody, busy: false, facts: {location: 'Village'}, external: {money: 0},
        gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}, vitals: {player: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}}, equipment: {player: {}}};
    const selected = planStructuredSelection(base, d, context), start = beginStructuredCampaign(selected.plan.state, d, context, null, selected.selection);
    let p = start.plan;
    const ctx = () => ({...context, worldId: d.world.id, nativeBody: p.state.simulation.people.player.body, facts: {location: id('annex')}, external: p.external, gameplay: p.gameplay, vitals: p.vitals});
    const publish = out => { p = {...out, vitals: out.vitals || p.vitals}; };
    const target = cid => d.simulation.commands.find(c => c.id === cid)?.targetId;
    return {registry, d, record: start.record, ctx, get p() { return p; },
        run(cid) { publish(commitSimulationCommand(p.state, registry, {id: cid}, {...ctx(), targetId: target(cid)})); },
        quote(cid) { return previewSimulationCommand(p.state, registry, cid, {...ctx(), targetId: target(cid)}); },
        step(n) { publish(advanceSimulation(p.state, registry, n, p.external, p.gameplay, {player: {...ctx(), vitals: p.vitals.player, equipment: {}}})); },
        envelope() { return {character: {money: 0, equipment: {}}, expansion: p.state, content_packs: {schema: 1, packs: {}, structured: start.record}, 'current location': id('annex')}; }};
}
const move = k => KEEPER_MOVES.set.ids[k].command;
const stones = f => f.p.gameplay.player.inventory[key('stone')] || 0;
const health = (f, slot) => f.p.state.simulation.people[id(slot)].vitals.health;
const buyStones = (f, n) => { f.p.gameplay.player.inventory[key('stone')] = stones(f) + n; };
function stocked() {
    const f = setup();
    buyStones(f, 20);
    for(const n of ['take_moon', 'buy_moss', 'take_light', 'buy_moss', 'feed_light', 'feed_moon', 'buy_jade', 'buy_jade', 'take_jade', 'feed_jade']) f.run(id(n));
    return f;
}

test('the ability is the Gu’s use, read from its being record (GKM1)', () => {
    const b = guBeing({id: 'moon', label: 'Moonlight Gu', use: {fn: 'cut', rank: 1, essence: 1}});
    assert.deepEqual(b.use, {fn: 'cut', rank: 1, essence: 1});
    assert.deepEqual(Object.keys(KEEPER_MOVES.uses).sort(), ['glow', 'jade', 'light', 'moon', 'worm']);
});

test('composition: roles bend the core, a second augment of one kind is paid for but adds nothing (GKM6, ch106)', () => {
    const uses = {moon: {fn: 'cut', rank: 1, essence: 1, base: {magnitude: 1, range: 1}}, l1: {fn: 'brighten', rank: 1, essence: 1, augment: {kind: 'brighten', scale: {magnitude: 2, range: 2}}},
        l2: {fn: 'brighten', rank: 1, essence: 1, augment: {kind: 'brighten', scale: {magnitude: 2, range: 2}}}, jade: {fn: 'guard', rank: 2, essence: 2, augment: {kind: 'guard', add: {magnitude: 1}}}};
    const twice = defineRecipe({id: 'twice', label: 'Twice bright', origin: 'original', roles: [{id: 'blade', label: 'Blade', core: true, needs: {fn: 'cut'}},
        {id: 'a', label: 'A', needs: {fn: 'brighten'}}, {id: 'b', label: 'B', needs: {fn: 'brighten'}}, {id: 'g', label: 'G', optional: true, needs: {fn: 'guard'}}]});
    const parts = Object.entries(uses).map(([id, use]) => ({id, use}));
    const all = assignments(twice, parts);
    assert.equal(all.length, 4, 'two orders of the two lights, each with or without the optional guard; one Gu fills one role');
    const full = all.find(a => a.roles.g), c = composeMove(twice, full, s => uses[s]);
    assert.deepEqual([c.magnitude, c.range, c.tier], [3, 2, 2], 'scale once, then add; tier is the highest rank');
    // Cost read (GKM13, GKM16, GKM17): every Gu used is paid for, in typed essence; a gap costs more and risks backlash, never refuses.
    const own = {grade: 1, owner: 'you', source: 'aperture'}, cost = moveCost(full, s => uses[s], () => own);
    assert.deepEqual(cost.lines.map(l => [l.part, l.amount, l.gap, l.grade, l.owner, l.source]), [['moon', 1, 0, 1, 'you', 'aperture'], ['l1', 1, 0, 1, 'you', 'aperture'], ['l2', 1, 0, 1, 'you', 'aperture'], ['jade', 4, 1, 1, 'you', 'aperture']]);
    assert.deepEqual([cost.gap, cost.risk], [1, 0.25]);
    const vial = moveCost(full, s => uses[s], s => s === 'jade' ? {grade: 2, owner: 'you', source: 'stored'} : own);
    assert.deepEqual([vial.lines[3].amount, vial.gap, vial.risk], [2, 0, 0], 'essence of its own grade pays the plain cost');
    assert.throws(() => moveCost(full, s => uses[s], () => ({grade: 1})), /owner and a source/);
    assert.deepEqual(c.bends.map(b => [b.kind, b.applied]), [['brighten', true], ['brighten', false], ['guard', true]]);
    assert.throws(() => defineRecipe({id: 'x', label: 'X', origin: 'canon', roles: [{id: 'c', label: 'C', core: true, needs: {fn: 'cut'}}]}), /locator/);
    const r = moveReadiness(full, s => s === 'l2' ? {blocks: [], shortfall: 1} : s === 'jade' ? {blocks: ['above your rank'], shortfall: 0} : {blocks: [], shortfall: 0});
    assert.deepEqual([r.blocks, r.shortfall], [['above your rank'], 1]);
});

test('calibration: the canon pairing doubles the moonblade, the substitute reaches the same kill by its own mechanism (SKR21)', () => {
    const byKey = Object.fromEntries(KEEPER_MOVES.moves.map(m => [m.key, m]));
    assert.equal(Object.keys(byKey).length, 12, 'every way the five keeper Gu fill each recipe, by fuel plan');
    const [plain, pair, guard] = ['moonblade__moon__own', 'little_light_moonblade__moon_light__own', 'jade_guarded_moonblade__moon_jade__own'].map(k => byKey[k]);
    assert.deepEqual([plain.parts.magnitude, plain.parts.range, plain.minutes], [1, 1, 60]);
    assert.deepEqual([pair.parts.magnitude, pair.parts.range, pair.minutes, pair.cost.lines.map(l => l.amount)], [2, 2, 30, [1, 1]], 'ch70: twice the size and reach; one essence per Gu');
    const glowOwn = byKey['moonblade__glow__own'], glowVial = byKey['moonblade__glow__stored'];
    assert.deepEqual([glowOwn.parts.magnitude, glowOwn.cost.lines[0].amount, glowOwn.cost.risk], [3, 2, 0.25], 'ch106: a Moonglow blade is three times; above your rank it costs double and can backfire');
    assert.deepEqual([glowVial.cost.lines[0].source, glowVial.cost.risk], ['stored', 0]);
    assert.deepEqual([guard.parts.magnitude, guard.parts.range, guard.minutes], [2, 1, 60], 'jade skin adds a kill, not reach');
    assert.match(pair.recipe.locator, /ch62.*ch70.*ch106/);
    assert.equal(guard.recipe.origin, 'original');
});

test('use, learn, cast, backfire when a role is unfed, busy Gu, and saved recipes (GKM2, GKM7, GKM8, GKM10)', () => {
    const f = stocked();
    // The lone Moonlight Gu is an ability you know by holding it.
    assert.equal(f.quote(move('moonblade__moon__own')).eligible, true);
    // The pairing needs the steward first; the substitute needs the pairing and the jade.
    assert.equal(f.quote(move('little_light_moonblade__moon_light__own')).eligible, false);
    assert.equal(f.quote(id('km_work_out_guard')).eligible, false);
    f.run(id('km_learn_pairing'));
    const q = f.quote(move('little_light_moonblade__moon_light__own'));
    assert.equal(q.eligible, true, q.reasons.join(' '));
    assert.equal(q.costs.filter(c => c.type === 'energy').length, 2, 'the quote names both Gu’s essence');
    const before = stones(f), reserve = f.p.state.simulation.energies.player[id('primeval')].reserve;
    f.run(move('little_light_moonblade__moon_light__own'));
    // Busy: both Gu are held by the running move; the lone moonblade and the Moonlight Gu’s clan work refuse.
    assert.equal(guReadiness(f.p.state, 'moon').busy !== null, true);
    assert.equal(f.quote(move('moonblade__moon__own')).eligible, false);
    f.step(30);
    assert.equal(stones(f), before + 2);
    assert.equal(f.p.state.simulation.energies.player[id('primeval')].reserve <= reserve - 2 + 1, true, 'two essence spent (one hour of regen at most returned)');
    // Work out the substitute: guessed until a clean cast settles it.
    f.run(id('km_work_out_guard')); f.step(20);
    const knownKey = KEEPER_MOVES.knownKey(KEEPER_MOVES.recipes[2]);
    assert.equal(f.p.state.simulation.knowledge.player[knownKey].stage, 'interpreted');
    // Let the Little Light Gu go hungry: its larder runs dry and it misses meals.
    delete f.p.state.simulation.owners[id('light')][key('moss')];
    f.step(DAY * 2 + 5);
    buyStones(f, 10);
    for(const n of ['buy_petals', 'feed_moon', 'buy_jade', 'buy_jade', 'feed_jade']) f.run(id(n));
    while(f.p.state.simulation.energies.player[id('primeval')].reserve < 3) f.step(60);
    const light = guReadiness(f.p.state, 'light');
    assert.equal(light.shortfall > 0, true, `the Little Light Gu is ${light.word}`);
    const facts = keeperMoveFacts(f.p.state, {actorId: 'player'});
    assert.deepEqual([facts['guKm.little_light_moonblade__moon_light__own.drivable'], facts['guKm.little_light_moonblade__moon_light__own.fail']], [true, 1]);
    const moonBefore = health(f, 'moon'), stonesBefore = stones(f);
    const qq = f.quote(move('little_light_moonblade__moon_light__own'));
    assert.equal(qq.eligible, true, 'hunger does not stop the cast: ' + qq.reasons.join(' '));
    f.run(move('little_light_moonblade__moon_light__own')); f.step(30);
    assert.equal(stones(f), stonesBefore, 'a backfired move fells nothing');
    assert.equal(health(f, 'moon') < moonBefore, true, 'the core Gu takes the recoil');
    assert.match(f.p.state.simulation.knowledge.player[id('km_last')].value, /came apart/);
    // The guarded form without the hungry Gu still works, and the clean cast settles the worked-out recipe as known.
    buyStones(f, 10);
    while(health(f, 'moon') < 3) { f.run(id('buy_petals')); f.run(id('feed_moon')); f.step(DAY); }
    f.run(id('buy_jade')); f.run(id('buy_jade')); f.run(id('feed_jade'));
    while(f.p.state.simulation.energies.player[id('primeval')].reserve < 2) f.step(60);
    const g = f.quote(move('jade_guarded_moonblade__moon_jade__own'));
    assert.equal(g.eligible, true, g.reasons.join(' '));
    assert.equal(keeperMoveFacts(f.p.state)['guKm.jade_guarded_moonblade__moon_jade__own.fail'], 0);
    f.run(move('jade_guarded_moonblade__moon_jade__own')); f.step(60);
    assert.equal(f.p.state.simulation.knowledge.player[knownKey].stage, 'understood', 'a clean cast settles the worked-out recipe as known (KNW3)');
    // Saved and reloaded, the known recipes stay (the knowledge owner keeps them).
    const saved = JSON.parse(JSON.stringify(f.envelope())); validateKeeperEnvelope(saved);
    const loaded = loadExpansionState(saved.expansion, f.registry);
    assert.deepEqual(Object.keys(loaded.simulation.knowledge.player).filter(k => k.includes('.km.recipe.')).sort(), Object.keys(f.p.state.simulation.knowledge.player).filter(k => k.includes('.km.recipe.')).sort());
    assert.equal(loaded.simulation.knowledge.player[KEEPER_MOVES.knownKey(KEEPER_MOVES.recipes[1])].stage, 'understood');
});

test('panel model lists roles, which owned Gu fill them and how ready they are', () => {
    const f = stocked();
    f.run(id('km_learn_pairing'));
    const view = structuredCampaignView(f.p.state, f.d, f.record, {...f.ctx(), registry: f.registry});
    const pair = view.house.moves.find(m => m.id === 'little_light_moonblade');
    assert.equal(pair.knowingWord, 'known');
    assert.deepEqual(pair.roles.map(r => [r.label, r.fillers.map(x => x.label)]), [['Blade', ['Moonlight Gu', 'Moonglow Gu']], ['Brighten', ['Little Light Gu']]]);
    assert.match(pair.roles[1].fillers[0].word, /^ready/);
    assert.deepEqual(pair.forms.map(x => x.state), ['ready']);
    assert.equal(view.house.moves.find(m => m.id === 'jade_guarded_moonblade').knowingWord, 'not known');
    assert.ok(view.actions.some(a => a.id === move('little_light_moonblade__moon_light__own') && a.eligible));
});

test('above your rank: a rank-two Gu runs on your own essence at a cost and risk, or on a stored vial of its grade (GKM13, GKM14, GKM16)', () => {
    const f = stocked();
    buyStones(f, 20);
    for(const n of ['take_glow', 'buy_petals', 'buy_petals', 'feed_glow', 'buy_vial']) f.run(id(n));
    const facts = keeperMoveFacts(f.p.state);
    assert.deepEqual([facts['guKm.moonblade__glow__own.drivable'], facts['guKm.moonblade__glow__own.fail'], facts['guKm.moonblade__glow__stored.fail']], [true, 0.25, 0], 'rank is priced, not gated');
    const own = f.quote(move('moonblade__glow__own'));
    assert.equal(own.eligible, true, own.reasons.join(' '));
    assert.equal(own.costs.filter(c => c.type === 'energy').length, 2, 'double essence for one rank of gap');
    assert.match(f.d.simulation.commands.find(c => c.id === move('moonblade__glow__own')).label, /rank 2, 1 above you\), 25% backlash, 3 stones/);
    const vials = () => f.p.gameplay.player.inventory[key('vial')] || 0, before = stones(f);
    assert.equal(vials(), 1);
    f.run(move('moonblade__glow__stored')); f.step(60);
    assert.deepEqual([vials(), stones(f) - before], [0, 3], 'the vial is spent once and the Moonglow blade fells three');
    assert.equal(f.quote(move('moonblade__glow__stored')).eligible, false, 'no vial, no stored form');
    const view = structuredCampaignView(f.p.state, f.d, f.record, {...f.ctx(), registry: f.registry});
    const plain = view.house.moves.find(m => m.id === 'moonblade');
    assert.match(plain.roles[0].fillers.find(x => x.label === 'Moonglow Gu').word, /rank 2: 1 above yours/);
    assert.deepEqual(plain.forms.map(x => [x.plan, x.state]), [['own', 'ready'], ['own', 'ready, 25% backlash'], ['stored', 'ready']]);
});
