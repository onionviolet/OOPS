// Scene layer spike (CBD254, proposal). Done check: the same place gives the same spots
// twice; a changed spot persists after leaving and an unchanged place stores nothing;
// moving or removing a recorded thing changes the scene and an available action; the
// duelling club's hand-built places are a hall layout plus overrides.
import test from 'node:test';
import assert from 'node:assert/strict';
import {applyWorldOps, composeSubstrate, createWorld, restoreWorld, serializeWorld} from '../src/world_substrate.js';
import {addressable, enterSceneOps, HANDS, leaveSceneOps, planScene, readKept, sceneActions, sceneOpen,
    SCENE_PROPERTIES} from '../src/scene_layer.js';
import {startDuellingClub} from '../src/world_packs/hp_duelling_club.js';

const rules = composeSubstrate({packs: [{id: 'scene'}], properties: [...SCENE_PROPERTIES, {id: 'marks', type: 'set'}],
    quantities: [{id: 'noise', unit: 'loudness grade', min: 0, max: 100}]});
const apply = (world, ops, cause = 'test') => ops.length ? applyWorldOps(rules, world, ops, cause) : world;
const enter = (world, place, opts) => apply(world, enterSceneOps(world, place, opts), 'scene.enter');
const leave = (world, place, opts) => apply(world, leaveSceneOps(world, place, opts), 'scene.leave');
// What a save keeps apart from the effect log (see the unchanged-place test).
const record = world => { const {chain, seq, ...rest} = serializeWorld(world); return rest; };

// One shared start, cloned per test (applyWorldOps never changes its input).
const START = createWorld(rules, {
    holders: [
        {id: 'lane', kind: 'place', tags: ['lane']},
        {id: 'yard', kind: 'place', properties: {scene_kind: 'slope'}},
        {id: 'wren', kind: 'body', place: 'lane'},
        {id: 'cart', kind: 'thing', place: 'lane', properties: {heavy: true}},
        {id: 'lamp', kind: 'thing', place: 'lane', properties: {lit: true, brittle: true, liquid: true, scene_spot: 'far-end'}},
        {id: 'key', kind: 'thing', place: 'lane', properties: {scene_spot: 'far-end'}},
    ],
    links: [{id: 'gate', kind: 'door', from: 'lane', to: 'yard'}],
});
const ids = rows => rows.map(row => row.id);

test('the same place gives the same spots twice, from its kind, its things and its ways out', () => {
    const plan = planScene(START, 'lane');
    assert.deepEqual(planScene(START, 'lane'), plan);
    assert.equal(plan.kind, 'lane');
    const core = ['lane.by-cart', 'lane.far-end', 'lane.middle', 'lane.near-end'];
    assert.deepEqual(ids(plan.spots).filter(id => id !== 'lane.recess'), core);
    assert.deepEqual(ids(plan.links).filter(id => !id.includes('recess') && id !== 'lane.step-aside'),
        ['lane.along', 'lane.cart.way', 'lane.far-walk', 'lane.near-walk', 'lane.out.gate']);
    assert.deepEqual(plan.at, {cart: 'lane.by-cart', key: 'lane.far-end', lamp: 'lane.far-end', wren: 'lane.near-end'});
    // The world's gate is seen from inside as a door off an exit spot.
    assert.deepEqual(plan.links.find(l => l.id === 'lane.out.gate'),
        {id: 'lane.out.gate', kind: 'door', from: 'lane.near-end', to: 'yard', cost: 1, state: 'open', oneWay: false});

    // Entering, leaving and entering again unfolds the same holders and links.
    const once = enter(START, 'lane'), again = enter(leave(once, 'lane'), 'lane');
    assert.equal(sceneOpen(once, 'lane'), true);
    assert.deepEqual(record(again), record(once));
    assert.equal(once.holders['lane.middle'].detail, 'near');
    assert.equal(once.holders.cart.place, 'lane.by-cart');

    // The keyed extra spot depends on the place and the root, never on the call.
    const roots = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(root => ids(planScene(START, 'lane', {root}).spots).includes('lane.recess'));
    assert.ok(roots.includes(true) && roots.includes(false));
    // A kind with no layout row is still a place one can look at closely.
    const bare = createWorld(rules, {holders: [{id: 'heath', kind: 'place'}]});
    assert.deepEqual(ids(planScene(bare, 'heath').spots), ['heath.ground']);
});

test('an unchanged place stores nothing extra after leaving', () => {
    const inside = enter(START, 'lane');
    // Things changed on the thing itself need no scene storage: the lamp is the world's lamp.
    const after = leave(inside, 'lane');
    assert.deepEqual(record(after), record(START));
    assert.equal(readKept(after, 'lane'), null);
    assert.equal(sceneOpen(after, 'lane'), false);
    assert.deepEqual(leaveSceneOps(after, 'lane'), []);
    // Substrate gap, recorded in the findings: placing holders uses `move`, which writes
    // departed and arrived rows into the capped effect log. The log is the only growth.
    assert.equal(after.chain.length, 16);
    assert.ok(after.chain.every(row => ['departed', 'arrived'].includes(row.kind)));
});

test('what changed in a scene persists after leaving, through a save, and clears when put back', () => {
    let world = enter(START, 'lane');
    world = apply(world, [
        {op: 'property', holder: 'lane.middle', property: 'slick', value: true}, // a flooded step (CBD171)
        {op: 'link_set', id: 'lane.far-walk', state: 'closed'},                   // a blocked way
        {op: 'move', holder: 'lamp', to: 'lane.near-end'},                        // a thing left somewhere else
        {op: 'property', holder: 'lamp', property: 'broken', value: true},        // damage, on the thing
        {op: 'link_set', id: 'lane.out.gate', state: 'closed'},                   // the gate barred from inside
        {op: 'move', holder: 'wren', to: 'lane.far-end'},                         // people are not kept at spots
    ]);
    const folded = leave(world, 'lane');
    assert.deepEqual(readKept(folded, 'lane'), {
        spots: {'lane.middle': {properties: {slick: true}}},
        links: {'lane.far-walk': {state: 'closed'}},
        at: {lamp: 'lane.near-end'},
    });
    assert.deepEqual(Object.keys(folded.holders).sort(), Object.keys(START.holders).sort());
    assert.equal(folded.holders.lamp.place, 'lane');
    assert.equal(folded.holders.lamp.properties.broken, true);
    assert.equal(folded.links.find(l => l.id === 'gate').state, 'closed'); // written to the world's own link
    assert.equal(folded.links.length, 1);

    const back = enter(restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(folded)))), 'lane');
    assert.equal(back.holders['lane.middle'].properties.slick, true);
    assert.equal(back.links.find(l => l.id === 'lane.far-walk').state, 'closed');
    assert.equal(back.links.find(l => l.id === 'lane.out.gate').state, 'closed');
    assert.equal(back.holders.lamp.place, 'lane.near-end');
    assert.equal(back.holders.wren.place, 'lane.near-end');
    assert.equal(back.holders.key.place, 'lane.far-end');

    // Mop the step, clear the way, carry the lamp back: the place stores nothing again.
    const tidy = leave(apply(back, [
        {op: 'property', holder: 'lane.middle', property: 'slick', value: null},
        {op: 'link_set', id: 'lane.far-walk', state: 'open'},
        {op: 'move', holder: 'lamp', to: 'lane.far-end'},
    ]), 'lane');
    assert.equal(readKept(tidy, 'lane'), null);
    assert.equal('scene' in tidy.holders.lane.state, false);
});

test('a pushed cart, a dug pit and a removed link are kept as differences from the plan', () => {
    let world = enter(START, 'lane');
    world = apply(world, [
        {op: 'link_set', id: 'lane.cart.way', from: 'lane.far-end'}, // the cart pushed to the far end
        {op: 'link_remove', id: 'lane.along'},                        // the long view cut off
        {op: 'holder_add', value: {id: 'lane.pit', kind: 'place', detail: 'near', tags: ['scene.spot'], refs: {scene: 'lane'}}},
        {op: 'link_add', link: {id: 'lane.pit.edge', kind: 'path', from: 'lane.middle', to: 'lane.pit'}},
    ]);
    const folded = leave(world, 'lane');
    const kept = readKept(folded, 'lane');
    assert.deepEqual(kept.links['lane.cart.way'], {from: 'lane.far-end'});
    assert.equal(kept.links['lane.along'], null);
    assert.deepEqual(kept.spots['lane.pit'], {tags: ['scene.spot'], properties: {}, added: true});
    // Unfolded again it is the scene that was left. The kept slice stays on the place
    // while the scene is open and is rewritten or dropped at the next leave.
    const back = record(enter(folded, 'lane'));
    delete back.holders.lane.state.scene;
    assert.deepEqual(back, record(world));
});

test('a ward, a noise level and pack state left on a spot fold away and come back', () => {
    let world = enter(START, 'lane');
    world = apply(world, [
        {op: 'law_add', field: {id: 'ward', scope: 'lane.middle', kind: 'ward', params: {against: 'entry'}}},
        {op: 'law_add', field: {id: 'brief', scope: 'lane.middle', kind: 'hush', until: 5}},
        {op: 'carry', holder: 'lane.far-end', quantity: 'noise'},
        {op: 'add', holder: 'lane.far-end', quantity: 'noise', amount: 30, source: 'shout'},
        {op: 'state', holder: 'lane.near-end', pack: 'x.tracks', value: {prints: 2}},
    ]);
    const folded = leave(world, 'lane'); // without the fold, a law field with no scope fails the world check
    assert.deepEqual(folded.laws, []);
    const kept = readKept(folded, 'lane');
    assert.deepEqual(Object.keys(kept.laws), ['brief', 'ward']);
    assert.deepEqual(kept.spots['lane.far-end'], {properties: {}, quantities: {noise: 30}, ledger: {noise: {shout: 30}}});
    const back = enter(folded, 'lane');
    assert.deepEqual(back.laws, world.laws);
    assert.equal(back.holders['lane.far-end'].quantities.noise, 30);
    assert.deepEqual(back.holders['lane.near-end'].state, {'x.tracks': {prints: 2}});
    // A field whose time ran out while the place was folded does not come back.
    const late = enter({...folded, clock: 9, decidedAt: 9}, 'lane');
    assert.deepEqual(late.laws.map(f => f.id), ['ward']);
});

test('two neighbouring scenes open at once fold cleanly in either order', () => {
    const both = enter(enter(START, 'lane'), 'yard');
    assert.deepEqual(both.links.filter(l => l.id.includes('.out.')).map(l => l.id), ['lane.out.gate', 'yard.out.gate']);
    assert.deepEqual(record(leave(leave(both, 'lane'), 'yard')), record(START));
    assert.deepEqual(record(leave(leave(both, 'yard'), 'lane')), record(START));
});

test('moving or removing one recorded thing changes the scene and one available action', () => {
    const shelter = world => sceneActions(world, 'wren').filter(a => a.verb === 'shelter').map(a => a.subject);
    const here = enter(START, 'lane');
    assert.ok(here.holders['lane.by-cart']);
    assert.deepEqual(shelter(here), ['cart']);
    assert.deepEqual(sceneActions(here, 'wren').map(a => `${a.verb} ${a.subject}`),
        ['push cart', 'shelter cart', 'take key', 'throw key', 'take lamp', 'throw lamp', 'snuff lamp', 'pour lamp', 'break lamp']);

    // The day before, someone wheels the cart into the yard (CBD71).
    const moved = apply(START, [{op: 'move', holder: 'cart', to: 'yard'}]);
    const lane = enter(moved, 'lane');
    assert.equal(lane.holders['lane.by-cart'], undefined);
    assert.equal(lane.links.some(l => l.id === 'lane.cart.way'), false);
    assert.deepEqual(shelter(lane), []);
    // The same cart is now cover on the slope, with no row written for it.
    const yard = enter(moved, 'yard');
    assert.deepEqual(yard.holders['yard.by-cart'].refs, {scene: 'yard', thing: 'cart'});

    // A fixed thing recorded as standing in for a layout spot takes that spot's links.
    const pine = apply(START, [{op: 'holder_add', value: {id: 'pine', kind: 'thing', place: 'yard',
        properties: {fixed: true, scene_replaces: 'treeline'}}}]);
    const plan = planScene(pine, 'yard');
    assert.deepEqual(ids(plan.spots), ['yard.by-pine', 'yard.high', 'yard.low']);
    assert.equal(plan.links.find(l => l.id === 'yard.into-trees').to, 'yard.by-pine');
    // Breaking the lamp removes pour and break and leaves the remains to take or throw.
    const smashed = apply(here, [{op: 'property', holder: 'lamp', property: 'broken', value: true}]);
    assert.deepEqual(sceneActions(smashed, 'wren').filter(a => a.subject === 'lamp').map(a => a.verb), ['take', 'throw', 'snuff']);
});

test('perceive, reach and means each fail with their own reason (CBD169)', () => {
    const world = enter(START, 'lane');
    const ask = (w, verb, subject, opts) => { const {ok, fails, why, link, means} = addressable(w, {actor: 'wren', subject, verb}, opts);
        return {ok, fails, why, ...(link ? {link} : {}), means}; };

    // Seen down the lane, too far for a hand.
    assert.deepEqual(ask(world, 'snuff', 'lamp'), {ok: false, fails: 'reach', why: 'apart', means: null});
    const walked = apply(world, [{op: 'move', holder: 'wren', to: 'lane.far-end'}]);
    assert.deepEqual(ask(walked, 'snuff', 'lamp'), {ok: true, fails: null, why: null, means: 'hands'});
    // A means that carries along a sightline reaches from where she stands.
    const gust = {id: 'gust', verbs: ['snuff'], links: 1, kinds: ['sightline']};
    assert.deepEqual(ask(world, 'snuff', 'lamp', {means: [HANDS, gust]}), {ok: true, fails: null, why: null, means: 'gust'});

    // Means: hands cannot throw what is heavy; a means that does not mind weight can.
    const beside = apply(world, [{op: 'move', holder: 'wren', to: 'lane.by-cart'}]);
    assert.deepEqual(ask(beside, 'throw', 'cart'), {ok: false, fails: 'means', why: 'is:heavy', means: null});
    assert.deepEqual(ask(beside, 'snuff', 'cart'), {ok: false, fails: 'means', why: 'lacks:lit', means: null});
    const lift = {id: 'lift', verbs: ['throw'], ignores: ['heavy'], links: 0};
    assert.equal(ask(beside, 'throw', 'cart', {means: [lift]}).ok, true);
    assert.equal(ask(beside, 'open', 'cart', {means: [lift]}).why, 'no-means');

    // Perceive: darkness hides the key and not the lit lamp (CBD205); snuffing the lamp hides it too.
    const dark = apply(walked, [{op: 'property', holder: 'lane.far-end', property: 'dark', value: true}]);
    assert.deepEqual(ask(dark, 'take', 'key'), {ok: false, fails: 'perceive', why: 'dark', means: null});
    assert.equal(ask(dark, 'take', 'lamp').ok, true);
    const snuffed = apply(dark, [{op: 'property', holder: 'lamp', property: 'lit', value: null}]);
    assert.equal(ask(snuffed, 'take', 'lamp').fails, 'perceive');
    // A thing in her own grip needs no light and no way.
    const held = apply(dark, [{op: 'property', holder: 'key', property: 'marks', value: ['grip:wren']}]);
    assert.equal(ask(held, 'throw', 'key').ok, true);
    // Out of every line: the yard is another scene.
    const away = apply(world, [{op: 'move', holder: 'key', to: 'yard'}]);
    assert.deepEqual(ask(away, 'take', 'key'), {ok: false, fails: 'perceive', why: 'no-line', means: null});

    // Reach names the closed link in the way; the sightline still shows the key.
    const reachy = {id: 'pole', verbs: ['take'], links: 2, kinds: ['path']};
    assert.equal(ask(world, 'take', 'key', {means: [reachy]}).ok, true);
    const shut = apply(world, [{op: 'link_set', id: 'lane.far-walk', state: 'closed'}]);
    assert.deepEqual(ask(shut, 'take', 'key', {means: [reachy]}),
        {ok: false, fails: 'reach', why: 'closed', link: 'lane.far-walk', means: null});
    // All three answers are there for a caller that wants more than the first failure.
    assert.deepEqual(addressable(dark, {actor: 'wren', subject: 'cart', verb: 'snuff'}).tests,
        {perceive: {ok: true}, reach: {ok: false, why: 'apart'}, means: {ok: false, why: 'lacks:lit'}});
});

// The hand-built club (src/world_packs/hp_duelling_club.js) as a hall plus overrides.
// From the hall row: `floor` (renamed far-floor) and `doorway`. From overrides: the dais
// dropped, two platforms added, bare ids, all three links, and who stands where.
const CLUB = {
    kind: 'hall', ids: 'bare', linksReplace: true, rename: {floor: 'far-floor'}, entry: 'far-floor',
    spots: {dais: null, 'west-platform': {}, 'east-platform': {}},
    links: [{id: 'platform', kind: 'sightline', from: 'west-platform', to: 'east-platform'},
        {id: 'exit', kind: 'path', from: 'east-platform', to: 'doorway'}],
    place: {harry: 'west-platform', draco: 'east-platform'},
};
const CLUB_VARIANTS = {
    practice: CLUB,
    pursuit: {...CLUB, links: [...CLUB.links, {id: 'platform-walk', kind: 'path', from: 'west-platform', to: 'east-platform'}]},
    // The plain student exchange has no doorway and Snape stands on the west platform.
    exchange: {...CLUB, spots: {...CLUB.spots, doorway: null}, links: [CLUB.links[0]], place: {...CLUB.place, snape: 'west-platform'}},
};

for (const [variant, override] of Object.entries(CLUB_VARIANTS)) test(`the duelling club (${variant}) is a hall layout plus overrides`, () => {
    const hand = startDuellingClub({students: true, ...(variant === 'exchange' ? {} : {disarmDrill: variant})}).world;
    const people = Object.values(hand.holders).filter(h => h.kind === 'body').map(h => h.id);
    const hall = createWorld(rules, {holders: [{id: 'great-hall', kind: 'place', tags: ['hall']},
        ...people.flatMap(id => [{id, kind: 'body', place: 'great-hall'},
            {id: `${id}-wand`, kind: 'thing', place: 'great-hall', properties: {marks: [`grip:${id}`]}}])]});
    const made = enter(hall, 'great-hall', {overrides: {'great-hall': override}});

    const places = world => Object.values(world.holders).filter(h => h.kind === 'place' && h.id !== 'great-hall').map(h => h.id).sort();
    assert.deepEqual(places(made), places(hand));
    assert.deepEqual(made.links, hand.links); // same ids, kinds, ends, cost, state
    const where = world => Object.fromEntries(Object.values(world.holders).filter(h => h.kind !== 'place').map(h => [h.id, h.place]).sort());
    assert.deepEqual(where(made), where(hand)); // wands follow the hand that holds them
    // What differs, exactly: the generated spots know their place and run near; the
    // hand-built ones are top-level places with no parent, tags or detail.
    for (const id of places(made)) {
        assert.deepEqual(made.holders[id].refs, {scene: 'great-hall'});
        assert.deepEqual([hand.holders[id].refs, hand.holders[id].tags, hand.holders[id].detail], [{}, [], undefined]);
    }
    assert.equal(leave(made, 'great-hall').holders['west-platform'], undefined);
});
