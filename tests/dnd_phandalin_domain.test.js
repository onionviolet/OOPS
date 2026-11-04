import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/dnd_phandalin_domain.js';

const cmd = name => domainRegistry.command('dnd_phandalin', name);
const run = request => { const q = cmd('quote')(request); assert.equal(q.eligible, true, q.reason); return cmd('execute')(q); };
const view = () => domainRegistry.project('dnd_phandalin');
const reload = () => { const env = domainRegistry.save({}); domainRegistry.validate(JSON.parse(JSON.stringify(env))); domainRegistry.load(JSON.parse(JSON.stringify(env))); return env; };

test('journey: a torn Sack blocks the crossing until Mending repairs it, then delivery settles once', () => {
    domainRegistry.load({});
    assert.equal(view().started, false);
    run({type: 'start'});
    assert.equal(cmd('quote')({type: 'start'}).eligible, false);
    assert.match(view().bag, /not yet inspected/);
    const blocked = cmd('quote')({type: 'cross', approach: 'rush'});
    assert.equal(blocked.eligible, false);
    assert.match(blocked.reason, /torn and cannot hold loose cargo/);
    run({type: 'inspect'});
    assert.match(view().bag, /six-inch tear/);
    run({type: 'cast'});
    assert.equal(cmd('quote')({type: 'cast'}).eligible, false, 'one casting at a time');
    domainRegistry.tick(0.5);
    assert.ok(view().cast, 'still casting before the minute is up');
    const mid = reload();
    assert.ok(mid.dnd_phandalin.cast, 'unfinished cast survives save/reload');
    domainRegistry.tick(1);
    assert.equal(view().cast, null);
    assert.match(view().bag, /whole, holds 30 lb/);
    const cross = request => { const q = cmd('quote')(request); return q.eligible ? cmd('execute')(q) : q; };
    cross({type: 'cross', approach: 'rush'});
    const first = domainRegistry.save({}).dnd_phandalin;
    cross({type: 'cross', approach: 'rush'}); // same approach: replay, no new roll
    assert.deepEqual(domainRegistry.save({}).dnd_phandalin.tried, first.tried);
    if (!first.crossed) cross({type: 'cross', approach: 'test each stone'});
    assert.equal(domainRegistry.save({}).dnd_phandalin.tried.length <= 2, true);
    assert.equal(cmd('quote')({type: 'deliver'}).eligible, domainRegistry.save({}).dnd_phandalin.crossed);
});

test('no dead end: the dry path needs no roll and finishes the job; a torn Sack blocks it too', () => {
    domainRegistry.load({});
    run({type: 'start'});
    assert.match(cmd('quote')({type: 'dryPath'}).reason, /torn/);
    run({type: 'cast'}); domainRegistry.tick(1);
    run({type: 'dryPath'}); // needs no roll, so it is reachable whatever the stones would have done
    assert.equal(cmd('quote')({type: 'cross', approach: 'rush'}).eligible, false, 'already across');
    assert.equal(cmd('quote')({type: 'dryPath'}).eligible, false, 'crossing happens once');
    run({type: 'deliver'});
    assert.equal(domainRegistry.save({}).dnd_phandalin.settled, true);
    assert.equal(cmd('quote')({type: 'deliver'}).eligible, false, 'settles once');
});

test('interruption repairs nothing and spends nothing; a fresh cast takes a new full minute', () => {
    domainRegistry.load({});
    run({type: 'start'}); run({type: 'cast'}); run({type: 'interrupt'});
    assert.match(view().bag, /not yet inspected/);
    assert.equal(domainRegistry.save({}).dnd_phandalin.bag.damage.state, 'open');
    run({type: 'cast' }); domainRegistry.tick(1);
    assert.equal(domainRegistry.save({}).dnd_phandalin.bag.damage.state, 'repaired');
});

test('save: absent slice loads clean, round trip is stable, and an edited roll is rejected', () => {
    domainRegistry.load({});
    assert.equal(domainRegistry.save({}).dnd_phandalin, undefined, 'a life that never began writes no key');
    run({type: 'start'}); run({type: 'cast' }); domainRegistry.tick(1);
    const q = cmd('quote')({type: 'cross', approach: 'rush'}); cmd('execute')(q);
    const env = reload();
    assert.deepEqual(domainRegistry.save({}).dnd_phandalin, env.dnd_phandalin);
    const bad = JSON.parse(JSON.stringify(env));
    bad.dnd_phandalin.tried[0].receipt.dice[0].candidates[0].dice[0].value += 1;
    assert.throws(() => domainRegistry.validate(bad));
    const settledWithoutCrossing = JSON.parse(JSON.stringify(env)); settledWithoutCrossing.dnd_phandalin.crossed = false; settledWithoutCrossing.dnd_phandalin.settled = true;
    assert.throws(() => domainRegistry.validate(settledWithoutCrossing));
});
