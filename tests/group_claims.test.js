// OB11 (lane W11-B): a founded group claims ground. authorityOver names the group, the homestead row says so, another claim is refused.
import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureOrganizations, FOUNDING_ROUTES, settlerDues} from '../src/organizations_domain.js';
import {organizationsSlice, loadOrganizations, validateOrganizations, migrateOrganizations} from '../src/organizations.js';
import {authorityOver} from '../src/authority.js';
import {livelihoodsOf, livelihoodLine} from '../src/livelihoods.js';
import '../src/livelihood_sources.js';
import {HOME_SITE} from '../src/home_content.js';

const W = 'base.frontier';
let box;
const make = (over = {}) => {
    box = {state: {clock: 3000, actors: {player: {worldId: W, facts: {'mg.opened': true}}}}, gameplay: {player: {reputation: {Village: 20}}}, money: 100, where: 'Village', writable: true, ...over};
    domainRegistry.initialize();
    configureOrganizations({root: () => box.state, actor: () => ({money: box.money, reputation: {Village: 20}}), world: () => W,
        location: () => box.where, idle: () => true, writable: () => box.writable, blocked: () => '', logMessage() {},
        plan: () => ({state: structuredClone(box.state), external: {money: box.money}, gameplay: structuredClone(box.gameplay)}),
        commit: plan => { box.state = plan.state; box.money = plan.external.money; box.gameplay = plan.gameplay; }});
};
const cmd = n => domainRegistry.command('organizations', n);
const shelter = {id: 'shelter', name: 'Willow clearing shelter', access: true};
const homestead = () => livelihoodsOf(box.state, {homes: [shelter]}).find(r => r.id === 'frontier.homestead.shelter');
const group = (name = 'Lantern Circle') => { const g = cmd('found')({name, dues: 'coin'}); cmd('invite')({id: g.id, npc: 'mg.sela'}); return g; };

test('the claimable place is the wilds stead the authority source knows', () => {
    assert.ok(FOUNDING_ROUTES[W].claims[HOME_SITE]);
});

test('claiming: refused away from the ground, without a member, without coin; then it changes authorityOver and the homestead row', () => {
    make(); const g = cmd('found')({name: 'Lantern Circle', dues: 'coin'});
    assert.equal(authorityOver(box.state, {world: W, place: HOME_SITE}).claimant, null);
    assert.match(homestead().detail, /no one claims/);
    assert.match(cmd('claimQuote')({id: g.id})[0].reasons[0], /Go to the wilds stead/);
    box.where = HOME_SITE;
    assert.match(cmd('claimQuote')({id: g.id})[0].reasons[0], /needs 1 member/);
    box.where = 'Village'; cmd('invite')({id: g.id, npc: 'mg.sela'});
    box.where = HOME_SITE; box.money = 3;
    assert.throws(() => cmd('claim')({id: g.id, place: HOME_SITE}), /8 coins/);
    box.money = 100;
    cmd('claim')({id: g.id, place: HOME_SITE});
    const a = authorityOver(box.state, {world: W, place: HOME_SITE});
    assert.deepEqual([a.claimant, a.reach, a.knows], [g.id, true, true]);
    assert.match(a.short, /your group Lantern Circle claims this land/);
    const row = homestead();
    assert.match(row.detail, /your group Lantern Circle claims this land/); assert.equal(row.authority.who, 'Lantern Circle');
    assert.match(livelihoodLine(row), /your group Lantern Circle claims this land/);
    // the village's own ground is untouched
    assert.equal(authorityOver(box.state, {world: W, place: 'Village'}).claimant, 'village');
});

test('another claim is refused while one is held; a dissolved group lets go; releasing frees it', () => {
    make(); const a = group('Lantern Circle'); box.where = HOME_SITE;
    cmd('claim')({id: a.id, place: HOME_SITE});
    box.where = 'Village'; const b = cmd('found')({name: 'Second Hearth', dues: 'coin'}); cmd('invite')({id: b.id, npc: 'mg.sela'}); box.where = HOME_SITE;
    const q = cmd('claimQuote')({id: b.id})[0];
    assert.equal(q.eligible, false); assert.match(q.reasons[0], /Lantern Circle already holds the wilds stead/);
    assert.throws(() => cmd('claim')({id: b.id, place: HOME_SITE}), /already holds/);
    assert.throws(() => cmd('claim')({id: a.id, place: HOME_SITE}), /already claims/);
    box.where = 'Village'; cmd('dissolve')({id: a.id}); box.where = HOME_SITE;
    assert.equal(authorityOver(box.state, {world: W, place: HOME_SITE}).claimant, null, 'a dissolved group holds nothing');
    assert.equal(cmd('claimQuote')({id: b.id})[0].eligible, true);
    cmd('claim')({id: b.id, place: HOME_SITE});
    cmd('release')({id: b.id, place: HOME_SITE});
    assert.equal(authorityOver(box.state, {world: W, place: HOME_SITE}).claimant, null);
});

test('outsiders who settle in a claim owe its holder by rule; unclaimed ground owes no one', () => {
    make(); assert.equal(settlerDues(W, HOME_SITE), null);
    const g = group(); box.where = HOME_SITE; cmd('claim')({id: g.id, place: HOME_SITE});
    const d = settlerDues(W, HOME_SITE);
    assert.equal(d.holder, 'Lantern Circle'); assert.equal(d.coinsPerWeek, 1); assert.match(d.why, /anyone settling there owes it 1 coin a week/);
    assert.equal(cmd('settlerDues')({world: W, place: HOME_SITE}).group, g.id);
});

test('saves round trip; an old group without claims loads; junk claims are refused on import and dropped on load', () => {
    make(); const g = group(); box.where = HOME_SITE; cmd('claim')({id: g.id, place: HOME_SITE});
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({}).organizations));
    assert.deepEqual(Object.keys(saved.groups[g.id].claims), [HOME_SITE]);
    loadOrganizations(saved); assert.equal(authorityOver(box.state, {world: W, place: HOME_SITE}).claimant, g.id);
    validateOrganizations(saved);
    const bad = structuredClone(saved); bad.groups[g.id].claims = {x: {at: -1}};
    assert.throws(() => validateOrganizations(bad)); assert.deepEqual(migrateOrganizations(bad).groups, {});
    const old = structuredClone(saved); delete old.groups[g.id].claims;
    loadOrganizations(old); assert.equal(authorityOver(box.state, {world: W, place: HOME_SITE}).claimant, null);
    assert.equal(Object.keys(organizationsSlice().groups).length, 1);
});
