// F7 (LARGER_FOUNDATIONS): staking ground inside an authority's bounds is one known act toward it; settlers' dues carry a policy from the OB1 set.
import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureOrganizations, settlerDues} from '../src/organizations_domain.js';
import {registerAuthoritySource} from '../src/authority.js';
import {POLICIES} from '../src/recurring_duties.js';
import '../src/heat.js';
import {HOME_SITE} from '../src/home_content.js';

const W = 'base.frontier';
let box;
const make = () => {
    box = {state: {clock: 3000, actors: {player: {worldId: W, facts: {'mg.opened': true}}}}, gameplay: {player: {}}, money: 100, where: 'Village', fail: false};
    domainRegistry.initialize();
    configureOrganizations({root: () => box.state, actor: () => ({money: box.money, reputation: {Village: 20}}), world: () => W,
        location: () => box.where, idle: () => true, writable: () => true, blocked: () => '', logMessage() {},
        plan: () => ({state: structuredClone(box.state), external: {money: box.money}, gameplay: structuredClone(box.gameplay)}),
        commit: plan => { if (box.fail) throw new Error('commit refused'); box.state = plan.state; box.money = plan.external.money; box.gameplay = plan.gameplay; }});
};
const cmd = n => domainRegistry.command('organizations', n);
const heatActs = () => domainRegistry.save({}).heat?.acts ?? [];
const readyGroup = () => { const g = cmd('found')({name: 'Lantern Circle', dues: 'coin'}); cmd('invite')({id: g.id, npc: 'mg.sela'}); box.where = HOME_SITE; return g; };
const cover = claimant => registerAuthoritySource(W, (state, {place}) => place === HOME_SITE ? {claimant, label: 'the town', inBounds: true} : null);

test('a claim inside a covering authority\'s bounds adds one known act; reload and a repeat add none', () => {
    cover('tingen'); make(); const g = readyGroup();
    assert.equal(heatActs().length, 0);
    cmd('claim')({id: g.id, place: HOME_SITE});
    const [a, ...rest] = heatActs();
    assert.equal(rest.length, 0); assert.equal(a.authority, 'tingen_police'); assert.equal(a.weight, 1);
    assert.match(a.witness, /^you, /); assert.ok(a.witness.length <= 60);
    const saved = structuredClone(domainRegistry.save({})); domainRegistry.load(saved);
    assert.equal(heatActs().length, 1);
    assert.throws(() => cmd('claim')({id: g.id, place: HOME_SITE}), /already claims/);
    assert.equal(heatActs().length, 1);
});

test('a claim with no covering authority adds nothing', () => {
    cover(null); make(); const g = readyGroup();
    cmd('claim')({id: g.id, place: HOME_SITE});
    assert.equal(heatActs().length, 0);
});

test('a refused claim (commit fails, too little coin, ground held by another group) records nothing', () => {
    cover('tingen'); make(); const g = readyGroup();
    box.fail = true;
    assert.throws(() => cmd('claim')({id: g.id, place: HOME_SITE}), /commit refused/);
    assert.equal(heatActs().length, 0);
    box.fail = false; box.money = 2;
    assert.throws(() => cmd('claim')({id: g.id, place: HOME_SITE}), /coins/);
    assert.equal(heatActs().length, 0);
    box.money = 100; cmd('claim')({id: g.id, place: HOME_SITE});
    box.where = 'Village'; const h = cmd('found')({name: 'Second Lamp', dues: 'coin'}); cmd('invite')({id: h.id, npc: 'mg.sela'}); box.where = HOME_SITE;
    assert.throws(() => cmd('claim')({id: h.id, place: HOME_SITE}), /already holds/);
    assert.equal(heatActs().length, 1);
});

test('settlers pay on time while the group is strong and a week late when it slips (OB1 set, derived)', () => {
    cover(null); make(); const g = readyGroup();
    cmd('claim')({id: g.id, place: HOME_SITE});
    let d = settlerDues(W, HOME_SITE);
    assert.ok(POLICIES.includes(d.policy)); assert.equal(d.policy, 'pay_late');
    box.where = 'Village'; cmd('invite')({id: g.id, npc: 'mg.mira'});
    d = settlerDues(W, HOME_SITE);
    assert.equal(d.policy, 'pay_on_time'); assert.equal(d.coinsPerWeek, 1);
});
