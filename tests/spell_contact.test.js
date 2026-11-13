import assert from 'node:assert/strict';
import test from 'node:test';
import {
    advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking,
} from '../src/engine_world.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../src/spell_pack_hogwarts.js';
import {labelSpellRow} from '../src/spell_grammar.js';
import {cancelSpellCast, quoteSpells, SPELL_EFFECT_LAW, spellEffectMethod, spellUsesCastingSlot} from '../src/spell_law.js';
import {sentenceFromIntent, sharedEffect} from '../src/spell_effects.js';
import {substratePort} from '../src/world_substrate.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';

const spell = id => sentenceFromIntent(labelSpellRow(HP_SPELL_ROWS.find(row => row.id === id), HP_SPELL_WORLD).parts);
const config = {
    packs: ['w.sky'],
    shared: {
        properties: Object.values(WORLD_PROPERTIES),
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 10}],
    },
    host: {
        laws: [SPELL_EFFECT_LAW],
        costs: {accounts: {stamina: {quantity: 'stamina'}}},
        effects: {read: sharedEffect},
    },
};
const thing = (id, place, marks = []) => ({id, kind: 'thing', as: ['object'], place, properties: {marks}});
const body = (id, place) => ({id, kind: 'body', as: ['creature'], place, quantities: {stamina: 10, vitality: 20}});
const disarm = {
    sentence: spell('disarm'), target: {id: 'duellist'}, minutes: 2,
    grip: {caster: 'caster', implement: 'caster-wand'},
    contact: {links: 1, kinds: ['door'], held: true},
    details: {to: 'floor', cost: 3},
};
const lift = {
    sentence: spell('levitation'), target: {id: 'feather'}, minutes: 3,
    grip: {caster: 'duellist', implement: 'duellist-wand'},
    details: {to: 'overhead', cost: 2},
};
const release = (engine, row, id) => startEngineWorking(engine, {
    ...spellEffectMethod([row]), id, payer: row.grip.caster,
});
const advance = (engine, at) => {
    const {engine: next, pending} = advanceEngineWorld(engine, at);
    assert.equal(pending, false);
    return next;
};
const roundTrip = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);

test('a paid page reveal distinguishes empty writing from a warded page after restore', () => {
    const page = (id, writing) => ({
        ...thing(id, 'library'), properties: writing ? {concealed: ['ink', 'other'], writing} : {concealed: []},
    });
    const pageConfig = {...config, shared: {...config.shared,
        properties: [...config.shared.properties, {id: 'writing', type: 'label'}]}};
    const scene = createEngineWorld({...pageConfig, holders: [
        {id: 'library', kind: 'place'}, body('caster', 'library'),
        thing('caster-wand', 'library', ['grip:caster']),
        page('blank'), page('resistant', 'meeting-code'), page('control', 'meeting-code'),
    ], lawFields: [{id: 'page-ward', scope: 'resistant', kind: 'block',
        params: {verb: 'release', object: 'spell-contact'}}]});
    // The ordinary ink release is an authored comparison for the diary attempt.
    const cast = target => release(scene, {
        sentence: spell('aparecium'),
        target: {id: target}, minutes: 1, grip: {caster: 'caster', implement: 'caster-wand'},
        contact: {links: 0}, requiresSpeech: true, details: {channel: 'other', cost: 2},
    }, 'reveal-page');
    const run = target => {
        const pending = cast(target);
        const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pending))), pageConfig);
        const end = advance(restored, 1);
        assert.deepEqual(serializeEngineWorld(end), serializeEngineWorld(advance(pending, 1)));
        assert.equal(end.world.holders.caster.quantities.stamina, 8);
        return {world: end.world, landing: end.records.workings['reveal-page'].landed[0]};
    };
    const blank = run('blank'), resistant = run('resistant'), control = run('control');
    const read = (result, id) => {
        const {concealed, writing} = result.world.holders[id].properties;
        return concealed.includes('ink') ? undefined : writing;
    };
    assert.deepEqual(blank.landing, {step: 0, at: 1, status: 'idle'});
    assert.match(resistant.landing.reason, /intercepted by page-ward/);
    assert.deepEqual(resistant.world.holders.resistant.properties.concealed, ['ink', 'other']);
    assert.equal(control.landing.status, 'landed');
    assert.deepEqual(control.world.holders.control.properties.concealed, ['other']);
    assert.equal(read(blank, 'blank'), undefined);
    assert.equal(read(resistant, 'resistant'), undefined);
    assert.equal(read(control, 'control'), 'meeting-code');
});

function begin() {
    const engine = createEngineWorld({...config,
        holders: [
            ...['hall', 'platform', 'floor', 'overhead'].map(id => ({id, kind: 'place'})),
            body('caster', 'hall'), body('duellist', 'platform'), body('bystander', 'platform'),
            thing('caster-wand', 'hall', ['grip:caster']),
            thing('duellist-wand', 'platform', ['grip:duellist', 'maker-mark']),
            thing('bystander-wand', 'platform', ['grip:bystander']),
            thing('spare-wand', 'platform'),
            thing('feather', 'platform'),
        ],
        links: [{id: 'arch', kind: 'door', from: 'hall', to: 'platform'}],
    });
    const quote = quoteSpells([disarm], {ports: {read: ref => substratePort(engine.world)(ref)}});
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.effects[0].details.target, {shape: 'holder', id: 'duellist'});
    return release(release(engine, disarm, 'disarm'), lift, 'levitation');
}

test('Expelliarmus moves the actual wand and interrupts an already-started Levitation Charm', () => {
    const inFlight = begin();
    assert.equal(inFlight.records.workings.levitation.record.status, 'running');
    const result = advance(inFlight, 3);
    const {holders, chain} = result.world;
    assert.deepEqual([holders['duellist-wand'].place, holders['duellist-wand'].properties.marks], ['floor', ['maker-mark']]);
    assert.deepEqual(holders['bystander-wand'].properties.marks, ['grip:bystander']);
    assert.equal(holders.duellist.quantities.vitality, 20);
    assert.equal(holders.feather.place, 'platform');
    assert.equal(holders.caster.quantities.stamina, 7);
    assert.equal(holders.duellist.quantities.stamina, 10);
    assert.equal(result.records.workings.disarm.record.receipts[0].truth.paid.lines[0].paid[0].taken, 3);
    assert.deepEqual(chain.filter(row => row.kind === 'effect.move').map(row => row.detail.target), ['duellist-wand']);
    const reply = result.records.workings.levitation;
    assert.equal(reply.record.status, 'interrupted');
    assert.match(reply.record.receipts[0].reason, /out of your hand/);
    assert.deepEqual(reply.landed, []);
    const restored = advance(roundTrip(advance(roundTrip(inFlight), 1)), 3);
    assert.deepEqual(serializeEngineWorld(restored), serializeEngineWorld(result));
    assert.deepEqual(serializeEngineWorld(advance(roundTrip(result), 3)), serializeEngineWorld(result));
});

test('a closed path or a position ward stops the released charm, while the reply still works', () => {
    const cases = [
        [{op: 'link_set', id: 'arch', state: 'closed'}, /no clear path/],
        [{op: 'law_add', field: {id: 'screen', kind: 'block', scope: 'duellist-wand',
            params: {verb: 'move', object: 'position'}}}, /intercepted by screen/],
    ];
    for (const [op, reason] of cases) {
        const ready = applyEngineOps(advance(begin(), 1), [op], 'changed-after-quote');
        const result = advance(roundTrip(ready), 3);
        assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(ready, 3)));
        const {holders} = result.world;
        assert.equal(holders['duellist-wand'].place, 'platform');
        assert.ok(holders['duellist-wand'].properties.marks.includes('grip:duellist'));
        assert.equal(holders.feather.place, 'overhead');
        assert.equal(holders.caster.quantities.stamina, 7);
        assert.equal(holders.duellist.quantities.stamina, 8);
        const [landing] = result.records.workings.disarm.landed;
        assert.equal(landing.status, 'idle');
        assert.match(landing.reason, reason);
    }
});

test('the named duellist remains the aim across movement, and the spell reads their current held implement', () => {
    const ready = applyEngineOps(advance(begin(), 1), [
        {op: 'move', holder: 'duellist', to: 'hall'},
        {op: 'move', holder: 'spare-wand', to: 'hall'},
        {op: 'property', holder: 'duellist-wand', property: 'marks', value: ['maker-mark']},
        {op: 'property', holder: 'spare-wand', property: 'marks', value: ['grip:duellist']},
        {op: 'link_set', id: 'arch', state: 'closed'},
    ], 'wand-changed');
    const {holders, chain} = advance(roundTrip(ready), 2).world;
    assert.equal(holders['duellist-wand'].place, 'platform');
    assert.equal(holders['spare-wand'].place, 'floor');
    assert.deepEqual(chain.filter(row => row.kind === 'effect.move').map(row => row.detail.target), ['spare-wand']);
});

test('Relashio releases a particular fastening and a later grip-dependent cast reads the loss', () => {
    // Authored grip comparison in addition to the canonical cuffs case.
    const engine = createEngineWorld({...config, holders: [
        ...['platform', 'overhead'].map(id => ({id, kind: 'place'})),
        body('caster', 'platform'), body('duellist', 'platform'),
        thing('caster-wand', 'platform', ['grip:caster']),
        thing('duellist-wand', 'platform', ['grip:duellist', 'maker-mark']),
        thing('feather', 'platform'),
    ]});
    const unfasten = {
        sentence: spell('relash'), target: {id: 'duellist-wand'}, minutes: 1,
        grip: {caster: 'caster', implement: 'caster-wand'}, details: {mark: 'grip:duellist', cost: 1},
    };
    const running = release(release(engine, unfasten, 'unfasten'), lift, 'levitation');
    const loosened = advance(roundTrip(running), 1);
    const end = advance(roundTrip(loosened), 3);
    assert.deepEqual(serializeEngineWorld(end), serializeEngineWorld(advance(running, 3)));
    assert.deepEqual(end.world.holders['duellist-wand'].properties.marks, ['maker-mark']);
    assert.equal(end.world.holders['duellist-wand'].place, 'platform');
    assert.equal(end.world.holders.caster.quantities.stamina, 9);
    assert.equal(end.world.holders.duellist.quantities.stamina, 10);
    assert.equal(end.world.holders.feather.place, 'platform');
    assert.equal(end.records.workings.levitation.record.status, 'interrupted');
});

test('Point Me changes which route a lost traveller takes after restoring the compass reading', () => {
    const navigation = {...config, shared: {...config.shared,
        properties: [...config.shared.properties, {id: 'bearing', type: 'label'}]}};
    const initial = createEngineWorld({...navigation,
        holders: [
            ...['maze', 'north-exit', 'west-loop'].map(id => ({id, kind: 'place'})),
            body('caster', 'maze'),
            {id: 'wand', kind: 'thing', place: 'maze', as: ['implement'],
                properties: {marks: ['grip:caster'], bearing: 'west'}},
        ],
        links: [
            {id: 'north', kind: 'path', from: 'maze', to: 'north-exit'},
            {id: 'west', kind: 'path', from: 'maze', to: 'west-loop'},
        ],
    });
    const followWand = engine => {
        const direction = engine.world.holders.wand.properties.bearing;
        const here = engine.world.holders.caster.place;
        const path = engine.world.links.find(link => link.from === here && link.id === direction && link.state === 'open');
        return path ? applyEngineOps(engine, [{op: 'move', holder: 'caster', to: path.to}], 'follow-bearing') : engine;
    };
    const pointed = release(initial, {
        sentence: spell('point'), target: {id: 'wand'}, minutes: 1,
        grip: {caster: 'caster', implement: 'wand'}, details: {properties: {bearing: 'north'}, cost: 1},
    }, 'orient');
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), navigation);
    const result = followWand(reload(advance(reload(pointed), 1)));
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(followWand(advance(pointed, 1))));
    assert.equal(followWand(initial).world.holders.caster.place, 'west-loop');
    assert.equal(result.world.holders.caster.place, 'north-exit');
    assert.equal(result.world.holders.caster.quantities.stamina, 9);
});

test('a paid fizzle preserves the target and the saved draw, while a hit applies once', () => {
    const scene = () => createEngineWorld({...config, drawRoot: 'spell-contact',
        holders: [
            ...['platform', 'overhead'].map(id => ({id, kind: 'place'})),
            body('duellist', 'platform'),
            thing('duellist-wand', 'platform', ['grip:duellist']),
            thing('feather', 'platform'),
        ],
    });
    const roll = odds => {
        const pending = release(scene(), {...lift, odds}, 'trial');
        const end = advance(roundTrip(advance(roundTrip(pending), 1)), 3);
        assert.deepEqual(serializeEngineWorld(end), serializeEngineWorld(advance(pending, 3)));
        assert.deepEqual(serializeEngineWorld(advance(roundTrip(end), 4)), serializeEngineWorld(advance(end, 4)));
        const record = end.records.workings.trial.record;
        const [receipt] = record.receipts;
        assert.equal(end.world.holders.duellist.quantities.stamina, 8);
        assert.equal(receipt.truth.paid.lines.length, 1);
        assert.equal(receipt.truth.paid.lines[0].paid[0].taken, 2);
        return {end, receipt};
    };
    const miss = roll(0), hit = roll(1000);
    assert.equal(miss.receipt.truth.draw.roll, hit.receipt.truth.draw.roll);
    assert.equal(miss.receipt.truth.draw.hit, false);
    assert.equal(miss.receipt.observed.seen, 'The spell fizzles.');
    assert.deepEqual(miss.end.records.workings.trial.landed, []);
    assert.equal(miss.end.world.holders.feather.place, 'platform');
    assert.equal(hit.receipt.truth.draw.hit, true);
    assert.equal(hit.end.records.workings.trial.landed.length, 1);
    assert.equal(hit.end.world.holders.feather.place, 'overhead');
    assert.equal(quoteSpells([{...lift, odds: 0}], {
        ports: {read: ref => substratePort(scene().world)(ref)},
    }).odds[0], 0);
});

test('canceling a composed cast preserves its first lift and debit after restore', () => {
    const initial = createEngineWorld({...config, holders: [
        ...['platform', 'overhead'].map(id => ({id, kind: 'place'})),
        body('duellist', 'platform'),
        thing('duellist-wand', 'platform', ['grip:duellist']),
        thing('feather', 'platform'), thing('weight', 'platform'),
    ]});
    const method = spellEffectMethod([{...lift, minutes: 1}, {...lift, target: {id: 'weight'}}]);
    const running = startEngineWorking(initial, {...method, id: 'practice', payer: 'duellist'});
    const halfway = roundTrip(advance(running, 1));
    assert.deepEqual(cancelSpellCast(halfway, {id: 'practice', actor: 'someone-else'}),
        {engine: halfway, ok: false, reason: 'not-caster'});
    const stop = cancelSpellCast(halfway, {id: 'practice', actor: 'duellist'});
    assert.equal(stop.ok, true);
    const canceled = stop.engine;
    const end = advance(roundTrip(canceled), 5);
    assert.deepEqual(serializeEngineWorld(end), serializeEngineWorld(advance(canceled, 5)));
    const completed = advance(halfway, 5);
    assert.equal(end.world.holders.feather.place, 'overhead');
    assert.equal(end.world.holders.weight.place, 'platform');
    assert.equal(completed.world.holders.weight.place, 'overhead');
    assert.equal(end.world.holders.duellist.quantities.stamina, 8);
    assert.equal(completed.world.holders.duellist.quantities.stamina, 6);
    const entry = end.records.workings.practice;
    assert.equal(entry.landed.length, 1);
    assert.deepEqual(entry.record.receipts.map(row => [row.step, row.ok, row.cause]), [[0, true, undefined], [1, false, 'host']]);
    assert.deepEqual(cancelSpellCast(end, {id: 'practice', actor: 'duellist'}),
        {engine: end, ok: false, reason: 'not-running'});
});

test('Nox ends the bound wandlight after restore and closes a reading opportunity', () => {
    const lighting = {...config, host: {...config.host, effects: {...config.host.effects, keys: {light: 'wand'}}}};
    const initial = createEngineWorld({...lighting, holders: [
        {id: 'archive', kind: 'place'}, body('caster', 'archive'),
        {id: 'wand', kind: 'thing', as: ['implement', 'effect'], place: 'archive',
            properties: {marks: ['grip:caster']}, quantities: {'light:wand': 0}},
        {id: 'other-wand', kind: 'thing', place: 'archive', quantities: {'light:wand': 10}},
    ]});
    const wandLight = (engine, row, id) => release(engine, {
        sentence: spell(row), target: {id: 'wand'}, minutes: 1,
        grip: {caster: 'caster', implement: 'wand'}, details: {amount: 40, cost: 1},
    }, id);
    const readInscription = engine => Object.values(engine.world.holders)
        .some(holder => holder.place === 'archive' && (holder.quantities['light:wand'] ?? 0) >= 30);
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), lighting);
    const lit = advance(wandLight(initial, 'light', 'lumos'), 1);
    assert.equal(readInscription(initial), false);
    assert.equal(readInscription(lit), true);
    const ending = wandLight(restore(lit), 'extinguish', 'nox');
    const dark = advance(restore(ending), 2);
    assert.deepEqual(serializeEngineWorld(dark), serializeEngineWorld(advance(ending, 2)));
    assert.equal(readInscription(dark), false);
    assert.equal(dark.world.holders['other-wand'].quantities['light:wand'], 10);
    assert.equal(dark.world.holders.caster.quantities.stamina, 8);
    assert.equal(dark.records.workings.lumos.landed.length, 1);
    assert.equal(dark.records.workings.nox.landed.length, 1);
});

test('a paid Obliviate backfire affects the caster and changes what a later Legilimens can read', () => {
    const memoryConfig = {...config, packs: ['a.mind'],
        shared: {...config.shared, properties: config.shared.properties.filter(p => !['senses', 'concealed'].includes(p.id))}};
    const scene = () => createEngineWorld({...memoryConfig, drawRoot: 'memory-cast', holders: [
        {id: 'platform', kind: 'place'},
        ...['caster', 'duellist', 'reader'].map(id => ({...body(id, 'platform'),
            properties: {mind_awake: true, mind_memory: ['last-meeting']}})),
        thing('caster-wand', 'platform', ['grip:caster']),
        thing('reader-wand', 'platform', ['grip:reader']),
    ]});
    const obliviate = {
        sentence: spell('memory'), target: {id: 'duellist'}, minutes: 2, odds: 1000, onMiss: 'backfire',
        implementFault: {mark: 'split-core', odds: 0},
        grip: {caster: 'caster', implement: 'caster-wand'}, contact: {links: 0},
        details: {cost: 3, mind: {faculty: 'memory', record: 'last-meeting'}},
    };
    assert.throws(() => spellEffectMethod([{...obliviate, sentence: lift.sentence}]), /direct body or creature target/);
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), memoryConfig);
    const readMemory = (engine, target) => release(engine, {
        sentence: spell('legilimency'), target: {id: target},
        grip: {caster: 'reader', implement: 'reader-wand'}, contact: {links: 0},
        details: {minutes: 2, channel: 'mind', mind: {faculty: 'memory'}},
    }, `read.${target}`);
    const pending = release(scene(), obliviate, 'forget');
    const damage = engine => applyEngineOps(engine, [{
        op: 'property', holder: 'caster-wand', property: 'marks', value: ['grip:caster', 'split-core'],
    }], 'wand-damaged');
    const damaged = damage(advance(pending, 1));
    const result = advance(restore(damage(advance(restore(pending), 1))), 2);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(damaged, 2)));
    const [receipt] = result.records.workings.forget.record.receipts;
    assert.equal(receipt.truth.draw.hit, false);
    assert.equal(receipt.truth.paid.lines.length, 1);
    assert.equal(receipt.truth.effects[0].target, 'caster');
    assert.equal(result.world.holders.caster.quantities.stamina, 7);
    assert.deepEqual(result.world.holders.duellist.properties.mind_memory, ['last-meeting']);
    assert.deepEqual(result.world.holders.caster.properties.mind_memory, []);
    assert.equal(readMemory(restore(result), 'caster').world.holders.reader.properties.mind_access, undefined);
    assert.deepEqual(readMemory(result, 'duellist').world.holders.reader.properties.mind_access,
        [JSON.stringify(['duellist', 'last-meeting'])]);

    const success = advance(pending, 2);
    assert.deepEqual(success.world.holders.caster.properties.mind_memory, ['last-meeting']);
    assert.deepEqual(success.world.holders.duellist.properties.mind_memory, []);
    assert.equal(success.world.holders.caster.quantities.stamina, 7);

    const protectedCaster = applyEngineOps(scene(), [{
        op: 'law_add', field: {id: 'screen', kind: 'block', scope: 'caster',
            params: {verb: 'transform', object: 'spell-contact'}},
    }], 'screen');
    const stopped = advance(release(damage(protectedCaster), obliviate, 'forget'), 2);
    assert.match(stopped.records.workings.forget.landed[0].reason, /intercepted by screen/);
    assert.deepEqual(stopped.world.holders.caster.properties.mind_memory, ['last-meeting']);
    assert.equal(stopped.world.holders.caster.quantities.stamina, 7);
});

test('a stray spell hits the actual recipient through live reach and defense after restore', () => {
    const strike = {
        sentence: spell('sectum'), target: {id: 'duellist'}, minutes: 2,
        grip: {caster: 'caster', implement: 'caster-wand'}, contact: {links: 1, kinds: ['door']},
        odds: 0, misfireTarget: 'bystander', details: {amount: 3, cost: 2},
    };
    const scene = () => createEngineWorld({...config, drawRoot: 'stray-cast', holders: [
        ...['hall', 'platform', 'behind-door'].map(id => ({id, kind: 'place'})),
        body('caster', 'hall'), body('duellist', 'platform'), body('bystander', 'hall'),
        thing('caster-wand', 'hall', ['grip:caster']),
    ], links: [{id: 'arch', kind: 'door', from: 'hall', to: 'platform'}]});
    const start = (odds = 0) => release(scene(), {...strike, odds}, 'strike');
    const resolve = engine => {
        const end = advance(roundTrip(engine), 2);
        assert.deepEqual(serializeEngineWorld(end), serializeEngineWorld(advance(engine, 2)));
        const {holders} = end.world;
        assert.equal(holders.caster.quantities.stamina, 8);
        const [receipt] = end.records.workings.strike.record.receipts;
        assert.equal(receipt.truth.paid.lines.length, 1);
        assert.equal(receipt.truth.paid.lines[0].paid[0].taken, 2);
        return {harm: [holders.duellist.quantities.vitality, holders.bystander.quantities.vitality],
            landing: end.records.workings.strike.landed[0], recipient: receipt.truth.effects[0].target};
    };
    const missed = resolve(start());
    assert.deepEqual(missed.harm, [20, 17]);
    assert.equal(missed.recipient, 'bystander');
    assert.deepEqual(resolve(start(1000)).harm, [17, 20]);

    const pending = advance(start(), 1);
    const warded = applyEngineOps(pending, [{op: 'law_add', field: {id: 'side-screen', kind: 'block',
        scope: 'bystander', params: {verb: '*', object: 'spell-contact'}}}], 'side-ward');
    const intercepted = resolve(warded);
    assert.match(intercepted.landing.reason, /intercepted by side-screen/);
    assert.deepEqual(intercepted.harm, [20, 20]);
    const gone = applyEngineOps(pending, [{op: 'move', holder: 'bystander', to: 'behind-door'}], 'left-the-line');
    const outOfReach = resolve(gone);
    assert.match(outOfReach.landing.reason, /no clear path/);
    assert.deepEqual(outOfReach.harm, [20, 20]);
    const removed = applyEngineOps(pending, [{op: 'holder_remove', holder: 'bystander'}], 'left-the-scene');
    const absent = advance(roundTrip(removed), 2);
    assert.equal(absent.world.holders.duellist.quantities.vitality, 20);
    assert.equal(absent.world.holders.caster.quantities.stamina, 8);
    assert.match(absent.records.workings.strike.landed[0].reason, /no clear path/);
});

test('a released spell keeps its origin and meets a shield raised during flight after restore', () => {
    const scene = createEngineWorld({...config, holders: [
        ...['hall', 'platform', 'cover'].map(id => ({id, kind: 'place'})),
        {...body('duellist', 'platform'), as: ['creature', 'self']},
        body('caster', 'hall'),
        thing('caster-wand', 'hall', ['grip:caster']),
        thing('duellist-wand', 'platform', ['grip:duellist']),
    ], links: [{id: 'arch', kind: 'door', from: 'hall', to: 'platform'}]});
    const strike = {
        sentence: spell('sectum'), target: {id: 'duellist'}, minutes: 1, flightMinutes: 2,
        grip: {caster: 'caster', implement: 'caster-wand'}, contact: {links: 1, kinds: ['door']},
        details: {amount: 3, cost: 2},
    };
    const windingUp = roundTrip(release(scene, strike, 'strike'));
    const stoppedCast = cancelSpellCast(windingUp, {id: 'strike', actor: 'caster'});
    assert.equal(stoppedCast.ok, true);
    const noRelease = advance(roundTrip(stoppedCast.engine), 3);
    assert.equal(noRelease.world.holders.caster.quantities.stamina, 10);
    assert.equal(noRelease.world.holders.duellist.quantities.vitality, 20);
    const launched = advance(windingUp, 1);
    const midFlight = roundTrip(launched);
    assert.equal(spellUsesCastingSlot(midFlight.records.workings.strike, 'caster'), false);
    const composed = startEngineWorking(scene, {
        ...spellEffectMethod([strike, {...strike, flightMinutes: undefined}]), id: 'sequence', payer: 'caster',
    });
    const composedFlight = roundTrip(advance(composed, 1));
    assert.equal(spellUsesCastingSlot(composedFlight.records.workings.sequence, 'caster'), true);
    assert.equal(spellUsesCastingSlot(composedFlight.records.workings.sequence, 'duellist'), false);
    assert.deepEqual(cancelSpellCast(midFlight, {id: 'strike', actor: 'caster'}),
        {engine: midFlight, ok: false, reason: 'already-released'});
    assert.equal(launched.world.holders.caster.quantities.stamina, 8);
    assert.equal(launched.world.holders.duellist.quantities.vitality, 20);
    assert.deepEqual(launched.records.workings.strike.landed, []);

    const movingCaster = applyEngineOps(launched, [
        {op: 'move', holder: 'caster', to: 'cover'},
        {op: 'property', holder: 'caster-wand', property: 'marks', value: []},
    ], 'after-release');
    const landed = advance(roundTrip(movingCaster), 3);
    assert.deepEqual(serializeEngineWorld(landed), serializeEngineWorld(advance(movingCaster, 3)));
    assert.equal(landed.world.holders.duellist.quantities.vitality, 17);
    assert.equal(landed.world.holders.caster.quantities.stamina, 8);
    assert.deepEqual(landed.records.workings.strike.landed, [{step: 1, at: 3, status: 'landed'}]);

    const protectedTarget = release(roundTrip(movingCaster), {
        sentence: spell('shield'), target: {id: 'duellist'}, minutes: 1,
        grip: {caster: 'duellist', implement: 'duellist-wand'},
        details: {field: 'protego', minutes: 3, cost: 1, params: {verb: '*', object: 'spell-contact'}},
    }, 'shield');
    const defended = advance(roundTrip(advance(protectedTarget, 2)), 3);
    assert.deepEqual(serializeEngineWorld(defended), serializeEngineWorld(advance(protectedTarget, 3)));
    assert.equal(defended.world.holders.duellist.quantities.vitality, 20);
    assert.equal(defended.world.holders.duellist.quantities.stamina, 9);
    assert.equal(defended.world.holders.caster.quantities.stamina, 8);
    assert.match(defended.records.workings.strike.landed[0].reason, /intercepted by protego/);

    const obstructed = applyEngineOps(launched, [{op: 'link_set', id: 'arch', state: 'closed'}], 'close-in-flight');
    const stopped = advance(roundTrip(obstructed), 3);
    assert.match(stopped.records.workings.strike.landed[0].reason, /no clear path/);
    assert.equal(stopped.world.holders.duellist.quantities.vitality, 20);
    assert.equal(stopped.world.holders.caster.quantities.stamina, 8);

    const fizzled = advance(roundTrip(advance(release(scene, {...strike, odds: 0}, 'fizzle'), 1)), 3);
    assert.equal(fizzled.records.workings.fizzle.record.receipts[0].truth.draw.hit, false);
    assert.deepEqual(fizzled.records.workings.fizzle.landed, []);
    assert.equal(fizzled.world.holders.duellist.quantities.vitality, 20);
    assert.equal(fizzled.world.holders.caster.quantities.stamina, 8);
});

test('reflecting a paid spell sends it back through live reach and defenses after restore', () => {
    const scene = createEngineWorld({...config, holders: [
        ...['hall', 'platform', 'cover'].map(id => ({id, kind: 'place'})),
        ...[['caster', 'hall'], ['duellist', 'platform']].flatMap(([id, place]) => [
            {...body(id, place), as: ['creature', 'self']},
            thing(`${id}-wand`, place, [`grip:${id}`]),
        ]),
    ], links: [{id: 'arch', kind: 'door', from: 'hall', to: 'platform'}]});
    const strike = {
        sentence: spell('sectum'), target: {id: 'duellist'}, minutes: 1, flightMinutes: 3,
        grip: {caster: 'caster', implement: 'caster-wand'}, contact: {links: 1, kinds: ['door'], reflectable: true},
        details: {amount: 3, cost: 2},
    };
    const shield = (engine, actor) => release(engine, {
        sentence: spell('shield'), target: {id: actor}, minutes: 1,
        grip: {caster: actor, implement: `${actor}-wand`},
        details: {field: `${actor}-protego`, minutes: 3, cost: 1,
            params: {verb: 'remove', object: 'spell-contact', reflect: true}},
    }, `shield-${actor}`);
    const launched = roundTrip(advance(release(scene, strike, 'strike'), 1));
    const guarded = advance(shield(launched, 'duellist'), 2);
    const hit = advance(roundTrip(guarded), 4);
    const impact = engine => engine.records.workings.strike.landed[0];
    const status = engine => ['caster', 'duellist'].map(id => {
        const {vitality, stamina} = engine.world.holders[id].quantities;
        return [vitality, stamina];
    });
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(guarded, 4)));
    assert.deepEqual(status(hit), [[17, 8], [20, 9]]);
    assert.deepEqual(impact(hit), {step: 1, at: 4, status: 'landed', reason: 'The spell was reflected by duellist-protego.'});

    const moved = applyEngineOps(guarded, [{op: 'move', holder: 'caster', to: 'cover'}], 'seek-cover');
    const miss = advance(roundTrip(moved), 4);
    assert.deepEqual(status(miss), [[20, 8], [20, 9]]);
    assert.match(impact(miss).reason, /reflected.*no clear path/);

    const both = advance(roundTrip(advance(shield(guarded, 'caster'), 3)), 4);
    assert.deepEqual(status(both), [[20, 7], [20, 9]]);
    assert.match(impact(both).reason, /reflected.*intercepted by caster-protego/);

    const ordinary = {...strike, contact: {...strike.contact, reflectable: false}};
    const absorbed = advance(shield(advance(release(scene, ordinary, 'strike'), 1), 'duellist'), 4);
    assert.deepEqual(status(absorbed), [[20, 8], [20, 9]]);
    assert.match(impact(absorbed).reason, /intercepted by duellist-protego/);
});
