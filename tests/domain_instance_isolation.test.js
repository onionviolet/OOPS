import test from 'node:test';
import assert from 'node:assert/strict';
import {createDomainRegistry, domainRegistry} from '../src/domain_registry.js';
import {createLamplightDomain, LAMP, OIL, LAMP_LIGHT} from '../src/lamplight_factory.js';

function host({oil = 1, ambient = 30} = {}) {
    const inventory = {[LAMP]: 1, [OIL]: oil}, sources = new Map(), readers = new Map();
    const env = {minute: 0, ambient, writes: 0, fail: false};
    const bind = map => reader => {const id = Symbol(); map.set(id, reader); return () => map.delete(id);};
    const actor = {nativeLightBonus: () => [...sources.values()].reduce((n, read) => n + read(), 0)};
    const operations = {actor: () => actor, count: id => inventory[id] || 0,
        itemOwners: () => [inventory], assertSpend: id => {if (!inventory[id]) throw Error('Not held.');},
        removeItem: (id, n) => {inventory[id] -= n;},
        persist: mark => {if (env.fail) throw Error('Rejected write.'); env.writes++; mark();},
        writable: () => true, location: () => 'Village', refresh() {}, logMessage() {},
        locationRevealed: () => false, revealLocation() {},
        ambientLight: () => env.ambient, clockPosition: () => env.minute,
        bindLightSource: bind(sources), bindReadingLightReader: bind(readers)};
    return {operations, inventory, env, sources, readers, actor,
        reading: minutes => [...readers.values()].at(-1)?.(minutes)};
}
function instance(operations) {
    const registry = createDomainRegistry(), domain = createLamplightDomain(operations);
    registry.registerDomain(domain); registry.initialize();
    return {domain, registry, use: () => domain.commands.execute(domain.commands.quote())};
}

test('direct construction is ready for commands without global enrollment or registry initialization', () => {
    const a = host(), count = domainRegistry.list().length;
    const domain = createLamplightDomain(a.operations);
    try {
        assert.equal(domainRegistry.list().length, count);
        assert.equal(domain.commands.quote().eligible, true);
        domain.commands.execute(domain.commands.quote());
        assert.equal(domain.save().oil, 240);
        const saved = domain.save();
        domain.load(domain.migrate(undefined));
        domain.load(domain.migrate(saved));
        assert.deepEqual(domain.save(), saved);
    } finally { domain.dispose(); }
});

test('two domains interleave stock, commands, time and independent save/load, then dispose one', () => {
    const a = host({oil: 2, ambient: 30}), b = host({oil: 0, ambient: 70});
    const first = instance(a.operations), second = instance(b.operations);
    second.registry.load({lamplight: {schema: 1, lit: false, oil: 7, noticed: {}}});
    const before = JSON.stringify([first.registry.save({}), second.registry.save({}), a.inventory, b.inventory]);
    assert.equal(first.domain.commands.quote().spend, 1);
    assert.equal(second.domain.commands.quote().spend, 0);
    assert.equal(JSON.stringify([first.registry.save({}), second.registry.save({}), a.inventory, b.inventory]), before);
    first.use(); second.use();
    assert.deepEqual([a.inventory[OIL], b.inventory[OIL], a.env.writes, b.env.writes], [1, 0, 1, 1]);
    first.registry.tick(2); second.registry.tick(3);
    assert.deepEqual([first.domain.getState().oil, second.domain.getState().oil], [238, 4]);
    assert.deepEqual([a.reading(2).light, b.reading(3).light], [70, 100]);
    const savedA = JSON.parse(JSON.stringify(first.registry.save({})));
    const savedB = JSON.parse(JSON.stringify(second.registry.save({})));
    first.registry.load({}); second.registry.validate(savedB);
    first.registry.load(savedA);
    assert.deepEqual(first.registry.save({}), savedA);
    assert.deepEqual(second.registry.save({}), savedB);
    first.domain.dispose(); first.domain.dispose();
    assert.deepEqual([a.sources.size, a.readers.size, b.sources.size, b.readers.size], [0, 0, 1, 1]);
    assert.equal(a.actor.nativeLightBonus(), 0);
    assert.equal(b.actor.nativeLightBonus(), LAMP_LIGHT);
    assert.throws(() => first.use(), /inactive/);
    first.registry.tick(50);
    assert.deepEqual(first.registry.save({}), savedA, 'disposed registry retains saved state without ticking');
    second.registry.tick(5);
    assert.deepEqual([second.domain.getState().lit, second.domain.getState().oil], [false, 0]);
    assert.deepEqual(b.reading(5).intervals.map(p => [p.minutes, p.light]), [[4, 100], [1, 70]]);
    const expired = second.registry.save({});
    second.registry.load({}); second.registry.load(expired);
    assert.deepEqual(second.registry.save({}), expired);
    assert.equal(b.reading(5).intervals, undefined, 'load invalidates only this instance elapsed interval');
    second.domain.dispose();
});

test('reconfiguration detaches old actor/reader and invalidates its settled interval', () => {
    const old = host(), replacement = host({oil: 4, ambient: 10}), peer = host();
    const first = instance(old.operations), second = instance(peer.operations);
    first.use(); second.use(); first.registry.tick(1);
    assert.equal(old.reading(1).intervals.length, 2);
    first.domain.configure(replacement.operations);
    assert.deepEqual([old.sources.size, old.readers.size, replacement.sources.size, replacement.readers.size], [0, 0, 1, 1]);
    assert.equal(old.actor.nativeLightBonus(), 0);
    assert.equal(replacement.actor.nativeLightBonus(), LAMP_LIGHT);
    assert.equal(replacement.reading(1).intervals, undefined);
    assert.equal(first.domain.getState().oil, 239);
    first.use();
    assert.equal(replacement.actor.nativeLightBonus(), 0);
    assert.equal(peer.actor.nativeLightBonus(), LAMP_LIGHT);
    second.registry.tick(2);
    assert.equal(second.domain.getState().oil, 238);
    first.domain.dispose(); second.domain.dispose();
    assert.throws(() => first.domain.configure(old.operations), /disposed/);
});

test('a rejected write rolls back only its instance and stock, leaving the other writable', () => {
    const a = host(), b = host();
    const first = instance(a.operations), second = instance(b.operations);
    a.env.fail = true;
    assert.throws(first.use, /Rejected write/);
    assert.equal(a.inventory[OIL], 1); assert.equal(first.domain.getState().oil, 0);
    second.use();
    assert.equal(b.inventory[OIL], 0); assert.equal(second.domain.getState().oil, 240);
    assert.equal(a.actor.nativeLightBonus(), 0); assert.equal(b.actor.nativeLightBonus(), LAMP_LIGHT);
    first.domain.dispose(); second.domain.dispose();
});

test('failed callback installation releases earlier installation without a stale actor source', () => {
    const a = host();
    assert.throws(() => createLamplightDomain({...a.operations, bindReadingLightReader: () => {throw Error('Reader unavailable.');}}), /Reader unavailable/);
    assert.equal(a.sources.size, 0);
    assert.equal(a.readers.size, 0);
});

test('native reading bindings restore the prior live reader and ignore stale/idempotent cleanup', async () => {
    const {bindReadingLightReader, readingLightFactor, setReadingLightReader} = await import('../src/reveal_chain.js');
    setReadingLightReader(() => ({ambient: 30, bonus: 10}));
    const first = bindReadingLightReader(() => ({ambient: 30, bonus: 20}));
    const second = bindReadingLightReader(() => ({ambient: 30, bonus: 60}));
    assert.equal(readingLightFactor(), 1.3);
    first(); first();
    assert.equal(readingLightFactor(), 1.3, 'disposing an older binding leaves the active reader');
    second();
    assert.equal(readingLightFactor(), 1.05, 'the legacy reader survives scoped hosts');
    const third = bindReadingLightReader(() => ({ambient: 30, bonus: 20}));
    const fourth = bindReadingLightReader(() => ({ambient: 30, bonus: 60}));
    fourth();
    assert.equal(readingLightFactor(), 1.1, 'disposing newest restores the remaining live reader');
    third(); setReadingLightReader(null);
    assert.equal(readingLightFactor(), 1);
});

test('two factory instances detach only their own light bindings on the real native Hero', async t => {
    const {boot} = await import('../scripts/headless/runner.mjs');
    const {bindReadingLightReader, readingLightFactor} = await import('../src/reveal_chain.js');
    const game = await boot(null, {seed: 11, heroName: null});
    t.after(() => game.close());
    const actor = game.internals.character, baseline = actor.nativeLightBonus();
    const a = host(), b = host({ambient: 70});
    const nativePorts = h => ({...h.operations, actor: () => actor,
        bindLightSource: reader => actor.bindNativeLightSource(reader), bindReadingLightReader});
    const first = instance(nativePorts(a)), second = instance(nativePorts(b));
    t.after(() => {first.domain.dispose(); second.domain.dispose();});
    first.use(); second.use();
    assert.equal(actor.nativeLightBonus(), baseline + 2 * LAMP_LIGHT);
    first.domain.dispose();
    assert.equal(actor.nativeLightBonus(), baseline + LAMP_LIGHT);
    assert.equal(readingLightFactor(), 1.15, 'remaining reader still uses its own ambient place');
    second.registry.tick(2);
    assert.equal(second.domain.getState().oil, 238);
    second.domain.dispose();
    assert.equal(actor.nativeLightBonus(), baseline);
    assert.equal(readingLightFactor(), 1);
    assert.deepEqual(game.errors, []);
});
