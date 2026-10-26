import test from 'node:test';
import assert from 'node:assert/strict';
import {configureUiPorts} from '../src/ui_ports.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHpBrewingDomain, execute, quote} from '../src/hp_brewing_domain.js';

const clock = {year: 1, month: 1, day: 1, hour: 8, minute: 0,
    getMoonPhase: () => 0, getMoonPhaseName: () => 'Full'};
const saved = () => domainRegistry.save({}).hp_brewing;
const acquire = {type: 'acquire', ingredient: 'book.hp.ing.bicorn_horn', route: 'book.hp.route.trusted_supplier'};
function host(persist = mark => mark()) {
    configureUiPorts({gameTime: () => clock});
    domainRegistry.load({});
    configureHpBrewingDomain({persist, writable: () => true});
}

test('HP native boundary refuses unavailable or read-only saving before any payment or setup', () => {
    host();
    configureHpBrewingDomain(null);
    assert.equal(quote({type: 'begin'}).eligible, false);
    assert.throws(() => execute({type: 'begin', seed: 21}), /writable saving/);
    assert.equal(saved(), undefined);
    configureHpBrewingDomain({persist: () => assert.fail('must not write'), writable: () => false});
    assert.throws(() => execute({type: 'begin', seed: 21}), /writable saving/);
    assert.equal(saved(), undefined);
});

test('HP native boundary serializes tentative state and rolls back begin and paid acquisition on writer failure', () => {
    host(() => {assert.ok(saved(), 'envelope sees tentative HP state'); throw Error('disk full');});
    assert.throws(() => execute({type: 'begin', seed: 21}), /disk full/);
    assert.equal(saved(), undefined, 'failed setup does not mint a bench or purse');
    configureHpBrewingDomain({persist: mark => mark(), writable: () => true});
    execute({type: 'begin', seed: 21});
    const before = saved();
    configureHpBrewingDomain({writable: () => true, persist: () => {
        const next = saved();
        assert.equal(next.purse, before.purse - 14);
        assert.equal(Object.keys(next.lots).length, 1);
        throw Error('disk full');
    }});
    assert.throws(() => execute(acquire), /disk full/);
    assert.deepEqual(saved(), before, 'payment, serial, held lot and knowledge restored exactly');
    assert.equal(quote(acquire).eligible, true, 'failed attempt remains payable');
    assert.deepEqual(saved(), before, 'quote does not retry persistence or spend');
});

test('HP durable publication is retained when a later native callback fails', () => {
    host();
    execute({type: 'begin', seed: 21});
    const before = saved();
    let bytes;
    configureHpBrewingDomain({writable: () => true, persist: mark => {
        bytes = JSON.stringify(saved());
        mark();
        throw Error('publication failure after durability');
    }});
    assert.throws(() => execute(acquire), /after durability/);
    assert.deepEqual(saved(), JSON.parse(bytes));
    assert.equal(saved().purse, before.purse - 14);
    assert.equal(Object.keys(saved().lots).length, 1);
    domainRegistry.load({hp_brewing: JSON.parse(bytes)});
    assert.deepEqual(saved(), JSON.parse(bytes), 'registered save/load retains the durable outcome');
});

test('native suspension input is exact current custody, not a menu-arrival or canonical-name substitute', () => {
    host(); execute({type: 'begin', seed: 21});
    const key = JSON.stringify({id: 'Bonemeal'}), inventory = {[key]: {count: 2}};
    let world = 'base.frontier', writes = 0;
    configureHpBrewingDomain({writable: () => true, persist: mark => {writes++; mark();},
        inventory: () => inventory, itemOwners: () => [inventory], world: () => world,
        assertSpend: () => {}, removeExact: () => assert.fail('refused request must not remove native stock')});
    const request = {type: 'brew', method: 'book.hp.abrasive-suspension@1', slots: {}, materialInputs: [{key, qty: 2}]};
    const before = saved();
    assert.equal(quote(request).eligible, false);
    assert.throws(() => execute(request), /Carry.*HP/);
    world = 'book.hp.school.world';
    assert.throws(() => execute({...request, materialInputs: [{key, qty: 3}]}), /exact selected/);
    assert.throws(() => execute({...request, method: undefined}), /explicit ORIGINAL/);
    assert.deepEqual(saved(), before); assert.equal(inventory[key].count, 2); assert.equal(writes, 0);
    const projected = domainRegistry.project('hp_brewing');
    assert.equal(projected.substitution.choices[0].stockAvailable, true);
    assert.doesNotMatch(JSON.stringify(projected.substitution), /strength|hardness|originWorld/);
});
