import test from 'node:test';
import assert from 'node:assert/strict';
import {
    composeSubstrate, createWorld, advanceWorld, applyWorldOps, serializeWorld, restoreWorld,
    readQuantity, resolveRef, substratePort, readScarcity, SUBSTRATE_REVISION,
} from '../src/world_substrate.js';
import {applyEffect, resolveTargets, EFFECT_VERBS} from '../src/world_effects.js';
import {WORLD_QUANTITIES as Q, WORLD_PROPERTIES as P} from '../src/world_quantities.js';

const allQ = Object.values(Q), allP = Object.values(P);
// A pack that only declares vocabulary, so a world can carry any shared name.
const vocab = {id: 'w.vocabulary', quantities: allQ, properties: allP};
const rules = composeSubstrate({packs: [vocab]});

function hall(extra = []) {
    return createWorld(rules, {clock: 0, holders: [
        {id: 'hall', kind: 'place', quantities: {temperature: 20, noise: 0, cover: 10, 'stock:bread': 12}},
        {id: 'vault', kind: 'place', quantities: {temperature: 15}},
        {id: 'mage', kind: 'body', place: 'hall', quantities: {vitality: 30, 'energy:mana': 20, 'energy:stamina': 10, 'want:bread': 3},
            properties: {alive: true, senses: ['sight', 'spirit'], form: 'mage'}},
        {id: 'thief', kind: 'body', place: 'hall', quantities: {vitality: 20, 'want:bread': 2}, properties: {alive: true, senses: ['sight'], form: 'thief'}},
        {id: 'chest', kind: 'thing', place: 'hall', quantities: {'stock:bread': 2}, properties: {material: 'oak', flammable: true, ignites_at: 250}},
        ...extra,
    ]});
}
const act = (w, a, cause = 'test') => applyEffect(rules, w, a, cause);

test('E1 keyed families: one unit per family, any key, declarations cover the family or one key', () => {
    const w = hall();
    assert.equal(readQuantity(w, 'mage', 'energy:mana'), 20);
    assert.throws(() => createWorld(rules, {holders: [{id: 'p', kind: 'place', quantities: {energy: 3}}]}), /undeclared quantity energy/);
    assert.throws(() => createWorld(rules, {holders: [{id: 'p', kind: 'place', quantities: {'humidity:x': 3}}]}), /undeclared quantity/);
    const rate = (writes, quantity) => composeSubstrate({packs: [vocab, {id: 'x', writes, laws: [{id: 'drain', appliesTo: h => h.id === 'mage',
        rates: (view, id) => [{holder: id, quantity, perMinute: -1}]}]}]});
    assert.equal(readQuantity(advanceWorld(rate(['energy'], 'energy:mana'), hall(), 5).world, 'mage', 'energy:mana'), 15, 'family declaration covers every key');
    assert.throws(() => advanceWorld(rate(['energy:mana'], 'energy:stamina'), hall(), 5), /does not declare writing energy:stamina/);
    assert.throws(() => composeSubstrate({packs: [vocab, {id: 'y', quantities: [{id: 'energy', unit: 'joule', min: 0, max: 5, keyed: true}]}]}), /different unit/);
});

test('E2 laws read properties, not categories (PFP22): any heat source lights whatever is flammable', () => {
    // A fire law that never asks what a thing is, only what it is like.
    const fire = {id: 't.fire', reads: ['temperature', 'flammable', 'ignites_at'], writes: ['aspects'],
        reactors: [{id: 'catch', on: ['effect.add'], appliesTo: h => h.properties.flammable === true, react: (view, id) => {
            const t = view.amount(view.placeOf(id), 'temperature'), at = view.property(id, 'ignites_at');
            const aspects = view.property(id, 'aspects') ?? [];
            return at != null && t >= at && !aspects.includes('burning') ? [{op: 'property', holder: id, property: 'aspects', value: [...aspects, 'burning']}] : [];
        }}]};
    const r = composeSubstrate({packs: [vocab, fire]});
    const make = () => createWorld(r, {clock: 0, holders: [
        {id: 'barn', kind: 'place', quantities: {temperature: 20}},
        {id: 'hay', kind: 'thing', place: 'barn', properties: {flammable: true, ignites_at: 150}},
        {id: 'cloth', kind: 'thing', place: 'barn', properties: {flammable: true, ignites_at: 260}},
        {id: 'stone', kind: 'thing', place: 'barn', properties: {material: 'granite', hardness: 70}},
        {id: 'gu', kind: 'body', place: 'barn', tags: ['gu'], properties: {alive: true, aspects: ['fire'], flammable: false}},
    ]});
    // Four different carriers: a Gu's heat, a fire charm, a hot stone, a burning neighbour.
    let w = make();
    for (const [by, amount] of [['gu.heat', 60], ['charm.incendio', 40], ['stone.hot', 50], ['neighbour.fire', 30]])
        w = applyEffect(r, w, {verb: 'add', object: 'temperature', target: {shape: 'holder', id: 'barn'}, amount, by}, by).world;
    assert.equal(readQuantity(w, 'barn', 'temperature'), 200);
    assert.deepEqual(w.holders.hay.properties.aspects, ['burning']);
    assert.equal(w.holders.cloth.properties.aspects, undefined, 'cloth needs more heat');
    assert.equal(w.holders.stone.properties.aspects, undefined);
    assert.deepEqual(w.holders.gu.properties.aspects, ['fire'], 'a fire-aspected Gu is not flammable');
    const order = make();
    const hot = applyEffect(r, order, {verb: 'add', object: 'temperature', target: {shape: 'holder', id: 'barn'}, amount: 180, by: 'one.blast'}, 'blast').world;
    assert.deepEqual(hot.holders.hay.properties, w.holders.hay.properties, 'the source does not matter, only the heat');
});

test('E3 every verb runs on W objects, and its counter is another verb', () => {
    assert.deepEqual([...EFFECT_VERBS].sort(), ['add', 'alter', 'bind', 'block', 'conceal', 'copy', 'move', 'remove', 'sense', 'transform']);
    let w = hall();
    // add and remove stay in bounds and report what landed.
    let r = act(w, {verb: 'add', object: 'noise', target: {shape: 'holder', id: 'hall'}, amount: 250});
    assert.equal(readQuantity(r.world, 'hall', 'noise'), 100);
    assert.equal(r.outcome.applied[0].amount, 100);
    r = act(w, {verb: 'remove', object: 'vitality', target: {shape: 'holders', ids: ['mage', 'thief']}, amount: 25});
    assert.deepEqual(['mage', 'thief'].map(id => readQuantity(r.world, id, 'vitality')), [5, 0]);
    // move: a body to a place, and an amount between holders, conserved.
    r = act(w, {verb: 'move', object: 'position', target: {shape: 'holder', id: 'thief'}, to: 'vault'});
    assert.equal(r.world.holders.thief.place, 'vault');
    assert.ok(r.world.chain.some(e => e.kind === 'departed' && e.by === 'thief'));
    r = act(w, {verb: 'move', object: 'stock:bread', target: {shape: 'holder', id: 'hall'}, to: 'chest', amount: 20});
    assert.deepEqual([readQuantity(r.world, 'hall', 'stock:bread'), readQuantity(r.world, 'chest', 'stock:bread')], [0, 14], 'moves what there is');
    // transform: one quantity into another by a ratio, or a property to a value.
    r = act(w, {verb: 'transform', object: 'energy:mana', into: 'energy:stamina', ratio: {numerator: 1, denominator: 2}, amount: 9, target: {shape: 'holder', id: 'mage'}});
    assert.deepEqual([readQuantity(r.world, 'mage', 'energy:mana'), readQuantity(r.world, 'mage', 'energy:stamina')], [11, 14]);
    // copy: Polyjuice-shaped, the thief wears the mage's form.
    r = act(w, {verb: 'copy', object: 'property:form', from: 'mage', target: {shape: 'holder', id: 'thief'}});
    assert.equal(r.world.holders.thief.properties.form, 'mage');
    // bind, then target everything bound to the mark.
    w = act(w, {verb: 'bind', mark: 'oath.house', target: {shape: 'holders', ids: ['mage', 'chest']}}).world;
    assert.deepEqual(resolveTargets(w, {shape: 'marked', mark: 'oath.house'}), ['chest', 'mage']);
    // conceal defeats sense on that channel only; a sensor needs the channel.
    w = act(w, {verb: 'conceal', channel: 'sight', target: {shape: 'holder', id: 'thief'}}).world;
    const look = (channel, by = 'mage') => act(w, {verb: 'sense', channel, by, reads: ['vitality', 'property:form'], target: {shape: 'present', place: 'hall'}}).outcome;
    assert.deepEqual(look('sight').observed.map(o => o.target), ['chest', 'mage']);
    assert.deepEqual(look('sight').skipped, [{target: 'thief', reason: 'concealed'}]);
    assert.deepEqual(look('spirit').observed.find(o => o.target === 'thief'), {target: 'thief', channel: 'spirit', vitality: 20, 'property:form': 'thief'});
    assert.deepEqual(look('spirit', 'thief').skipped, [{target: 'thief', reason: 'no-sense', channel: 'spirit'}]);
    // block: a ward on the vault stops moving things out of it; alter dispels it; a guard on alter protects it.
    let v = act(hall(), {verb: 'move', object: 'position', target: {shape: 'holder', id: 'chest'}, to: 'vault'}).world;
    v = act(v, {verb: 'block', params: {verb: 'move', object: 'position'}, target: {shape: 'holder', id: 'chest'}, field: 'ward.chest'}).world;
    r = act(v, {verb: 'move', object: 'position', target: {shape: 'holder', id: 'chest'}, to: 'hall'});
    assert.deepEqual(r.outcome.blocked, [{target: 'chest', by: 'ward.chest'}]);
    assert.equal(r.world.holders.chest.place, 'vault');
    const dispelled = act(v, {verb: 'alter', remove: 'ward.chest', target: {shape: 'holder', id: 'chest'}}).world;
    assert.equal(act(dispelled, {verb: 'move', object: 'position', target: {shape: 'holder', id: 'chest'}, to: 'hall'}).world.holders.chest.place, 'hall');
    const guarded = act(v, {verb: 'block', params: {verb: 'alter', object: '*'}, target: {shape: 'holder', id: 'chest'}, field: 'ward.anchor'}).world;
    assert.deepEqual(act(guarded, {verb: 'alter', remove: 'ward.chest', target: {shape: 'holder', id: 'chest'}}).outcome.blocked, [{target: 'chest', by: 'ward.anchor'}]);
    // Each applied act lands as an effect in the target's place, for anything there to answer.
    assert.ok(dispelled.chain.some(e => e.kind === 'effect.alter' && e.place === 'vault'));
});

test('E4 sustained effects are law fields that lapse at a minute, the same in one jump or many', () => {
    const start = act(hall(), {verb: 'conceal', channel: 'sight', until: 30, target: {shape: 'holder', id: 'thief'}, field: 'veil'}).world;
    const seen = w => act(w, {verb: 'sense', channel: 'sight', by: 'mage', target: {shape: 'holder', id: 'thief'}}).outcome.observed.length;
    assert.equal(seen(start), 0);
    assert.equal(seen(advanceWorld(rules, start, 29).world), 0);
    const one = advanceWorld(rules, start, 45);
    assert.equal(seen(one.world), 1);
    let many = start;
    for (const t of [3, 17, 29, 30, 31, 45]) many = advanceWorld(rules, many, t).world;
    assert.deepEqual(many, one.world);
    assert.deepEqual(restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(advanceWorld(rules, start, 30).world)))), advanceWorld(rules, start, 30).world);
    const lapse = one.world.chain.find(e => e.kind === 'law.lapsed');
    assert.equal(lapse.at, 30);
    assert.ok(one.segments <= 2, `the lapse is a segment boundary (${one.segments})`);
});

test('E5 one identity, several kinds (SC7): kernel bindings resolve to one holder', () => {
    const w = hall([{id: 'gu.moonlight.1', kind: 'body', place: 'hall', as: ['gu', 'item'], refs: {item: '{"id":"Moonlight Gu"}', lifecycle: 'moonlight.1'},
        quantities: {vitality: 5}, properties: {alive: true, aspects: ['moon']}}]);
    assert.equal(resolveRef(w, {kind: 'gu', id: 'gu.moonlight.1'}), 'gu.moonlight.1');
    assert.equal(resolveRef(w, {kind: 'item', id: '{"id":"Moonlight Gu"}'}), 'gu.moonlight.1', 'the inventory key finds the same body');
    assert.equal(resolveRef(w, {kind: 'lifecycle', id: 'moonlight.1'}), 'gu.moonlight.1');
    assert.equal(resolveRef(w, {kind: 'body', id: 'gu.moonlight.1'}), 'gu.moonlight.1', 'its physical kind binds too');
    assert.equal(resolveRef(w, {kind: 'place', id: 'gu.moonlight.1'}), null);
    const read = substratePort(w);
    assert.deepEqual(read({kind: 'item', id: '{"id":"Moonlight Gu"}'}, 0).properties, {alive: true, aspects: ['moon']});
    assert.throws(() => read({kind: 'gu', id: 'gu.moonlight.1'}, 5), /asked for minute 5/);
    const twice = hall([{id: 'a', kind: 'thing', place: 'hall', refs: {item: 'k'}}, {id: 'b', kind: 'thing', place: 'hall', refs: {item: 'k'}}]);
    assert.throws(() => resolveRef(twice, {kind: 'item', id: 'k'}), /two holders claim/);
});

test('E6 scarcity is read from stock and want, never stored (A, M)', () => {
    const w = hall();
    assert.deepEqual(readScarcity(w, 'hall', 'bread'), {good: 'bread', place: 'hall', stock: 14, want: 5, days: 2, short: false});
    const eaten = act(w, {verb: 'remove', object: 'stock:bread', target: {shape: 'having', place: 'hall', property: 'material', value: 'oak'}, amount: 2}).world;
    const bare = act(eaten, {verb: 'remove', object: 'stock:bread', target: {shape: 'holder', id: 'hall'}, amount: 10}).world;
    assert.deepEqual(readScarcity(bare, 'hall', 'bread'), {good: 'bread', place: 'hall', stock: 2, want: 5, days: 0, short: true});
    assert.equal(readScarcity(w, 'vault', 'bread').days, Infinity);
});

test('E7 a revision 0 save migrates to revision 1 and keeps its world', () => {
    const r0 = {schema: 'oops.world-substrate', revision: 0, clock: 12, decidedAt: 12, seq: 1,
        holders: {hall: {id: 'hall', kind: 'place', place: null, tags: [], quantities: {temperature: 21}, ledger: {temperature: {heat: 1}}, state: {}}},
        laws: [], chain: [{seq: 1, at: 12, kind: 'x', place: 'hall', by: 'y', depth: 0, cause: null, quantity: null, amount: 0, landed: 0, reactions: []}]};
    assert.equal(SUBSTRATE_REVISION, 1);
    const w = restoreWorld(rules, r0);
    assert.equal(w.revision, 1);
    assert.deepEqual([w.holders.hall.properties, w.holders.hall.as, w.holders.hall.refs], [{}, [], {}]);
    assert.equal(readQuantity(w, 'hall', 'temperature'), 21);
    assert.deepEqual(restoreWorld(rules, serializeWorld(w)), w);
});

test('E8 canon sentences lower to acts: the boundary P composes on', () => {
    // Paraphrased sentences from the plan. P owns shape, time, carrier and cost; W runs the verb on resolved targets.
    let w = hall([{id: 'boar', kind: 'body', place: 'hall', quantities: {vitality: 12}, properties: {alive: true}},
        {id: 'idol', kind: 'thing', place: 'hall', properties: {aspects: ['hidden'], concealed: ['sight']}}]);
    // Moonblade-style attack: remove vitality along a line (X resolved the line to these holders), instant.
    const blade = act(w, {verb: 'remove', object: 'vitality', amount: 8, target: {shape: 'holders', ids: ['boar', 'thief']}, by: 'moonlight.gu'});
    assert.deepEqual(['boar', 'thief'].map(id => readQuantity(blade.world, id, 'vitality')), [4, 12]);
    // Polyjuice: transform form to a donor's (copy), self, lasting.
    assert.equal(act(w, {verb: 'copy', object: 'property:form', from: 'mage', target: {shape: 'self', id: 'thief'}}).world.holders.thief.properties.form, 'mage');
    // Spirit Vision: sense hidden properties, area around self, through the spirit channel.
    const vision = act(w, {verb: 'sense', channel: 'spirit', by: 'mage', reads: ['property:aspects'], target: {shape: 'present', place: 'hall'}});
    assert.deepEqual(vision.outcome.observed.find(o => o.target === 'idol')['property:aspects'], ['hidden']);
    // Protego-shaped ward: block remove vitality on everyone bound to the house, sustained ten minutes.
    w = act(w, {verb: 'bind', mark: 'house', target: {shape: 'holders', ids: ['mage', 'thief']}}).world;
    w = act(w, {verb: 'block', params: {verb: 'remove', object: 'vitality'}, until: 10, target: {shape: 'marked', mark: 'house'}}).world;
    const struck = act(w, {verb: 'remove', object: 'vitality', amount: 8, target: {shape: 'present', place: 'hall'}});
    assert.deepEqual(struck.outcome.blocked.map(b => b.target), ['mage', 'thief']);
    assert.equal(readQuantity(struck.world, 'boar', 'vitality'), 4);
    const later = advanceWorld(rules, w, 10).world;
    assert.equal(act(later, {verb: 'remove', object: 'vitality', amount: 8, target: {shape: 'holder', id: 'mage'}}).outcome.blocked.length, 0, 'the ward lapses');
});
