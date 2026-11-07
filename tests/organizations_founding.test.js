import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureOrganizations, foundingCost} from '../src/organizations_domain.js';
import {groupsOf, groupLines, loadOrganizations, organizationsSlice, validateOrganizations, migrateOrganizations, MAX_ACTIVE_PER_WORLD} from '../src/organizations.js';
import {positionsOf} from '../src/positions.js';
import {meetsOn} from '../src/gatherings.js';
import '../src/management/group_source.js';

const WORLD = 'base.frontier';
let box;
const make = (over = {}) => {
    box = {state: {clock: 3000, actors: {player: {worldId: WORLD, facts: {'mg.opened': true}}}}, money: 100, where: 'Village', reject: false, writable: true, ...over};
    domainRegistry.initialize();
    configureOrganizations({root: () => box.state, actor: () => ({money: box.money}), world: () => box.state.actors.player.worldId, location: () => box.where, idle: () => true,
        writable: () => box.writable, blocked: () => '', logMessage() {}, plan: () => ({state: structuredClone(box.state), external: {money: box.money}}),
        commit: plan => { if (box.reject) throw Error('disk full'); box.state = plan.state; box.money = plan.external.money; }});
};
const cmd = n => domainRegistry.command('organizations', n);
const found = (over = {}) => cmd('found')({name: 'Lantern Circle', ...over});
const save = () => domainRegistry.save({});

test('founding pays the cost once, shows beside authored groups, and a same-name second founding is refused', () => {
    make();
    const g = found();
    assert.equal(box.money, 70);
    assert.equal(g.status, 'active');
    const gs = groupsOf(box.state);
    assert.deepEqual(gs.map(x => x.name), ['Lantern Circle'], 'courtyard is not opened by this fixture state (no simulation), only the founded group shows');
    assert.match(groupLines(gs)[0], /^Lantern Circle, a club \(active\)\. Members: You \(founder\)\. Meets every 7 days\.$/);
    assert.throws(() => found({name: 'lantern  circle'}), /already run a group called/);
    assert.equal(box.money, 70, 'a refused founding costs nothing');
    assert.equal(groupsOf(box.state).length, 1);
});
test('a hidden group costs more; too little money, wrong place and a missing courtyard refuse with a reason', () => {
    make();
    assert.equal(foundingCost(WORLD, {secrecy: 'hidden'}), 40);
    box.money = 29;
    assert.throws(() => found(), /need 30 coins/);
    box.money = 100; box.where = 'Forest';
    assert.throws(() => found(), /Found a group at the Market courtyard/);
    box.where = 'Village'; box.state.actors.player.facts = {};
    assert.throws(() => found(), /Market courtyard/);
    assert.equal(cmd('quote')({name: 'X'}).eligible, false);
    box.state.actors.player.facts = {'mg.opened': true}; box.writable = false;
    assert.throws(() => found(), /writable/);
    make({state: {clock: 0, actors: {player: {worldId: 'book.other', facts: {}}}}});
    assert.throws(() => found(), /No way to found a group in this world/);
    assert.equal(box.money, 100);
});
test('charter dials and the name are validated; the cap per world holds', () => {
    make();
    for (const bad of [{admission: 'anyone'}, {dues: 'tribute'}, {secrecy: 'loud'}, {rhythm: 'daily'}]) assert.throws(() => found(bad), /must be one of/);
    for (const name of ['ab', 'x'.repeat(41), '<b>hi</b>', 'Lan—tern']) assert.throws(() => found({name}), /A group name is/);
    assert.throws(() => cmd('found')({}), /Name the group/);
    assert.equal(box.money, 100);
    const g = found({admission: 'vouched', dues: 'coin', secrecy: 'hidden', rhythm: 'monthly', name: "Ana's Table"});
    assert.deepEqual(g.charter, {admission: 'vouched', dues: 'coin', secrecy: 'hidden', rhythm: 'monthly'});
    assert.equal(box.money, 60);
    const gat = cmd('gathering')(g.id);
    assert.equal(gat.dial.secrecy, 1);
    assert.equal(meetsOn(gat, Math.floor(g.founded / 1440) + 30), true);
    box.money = 200;
    for (let i = 1; i < MAX_ACTIVE_PER_WORLD; i++) found({name: `Group ${i}`});
    assert.throws(() => found({name: 'One too many'}), /Dissolve one first/);
});
test('groupsOf lists a founded group in its own world only', () => {
    make(); found();
    assert.equal(groupsOf(box.state).length, 1);
    assert.deepEqual(groupsOf(box.state, {world: 'book.other'}), []);
    assert.equal(groupsOf({actors: {player: {worldId: 'book.other'}}}).length, 0);
});
test('the founder holds a member post through positions; dissolving ends the group and the post reads ended', () => {
    make();
    const g = found();
    let rows = positionsOf(box.state).filter(r => r.institution === 'Lantern Circle');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].role, 'Founder'); assert.equal(rows[0].term.type, 'member'); assert.equal(rows[0].term.startedAt, 3000); assert.equal(rows[0].ended, undefined);
    box.state.clock = 5000;
    cmd('dissolve')({id: g.id});
    assert.equal(groupsOf(box.state)[0].status, 'dissolved');
    assert.match(groupLines(groupsOf(box.state))[0], /\(dissolved\)/);
    rows = positionsOf(box.state).filter(r => r.institution === 'Lantern Circle');
    assert.deepEqual(rows[0].ended, {kind: 'dissolve', at: 5000, reason: 'You dissolved the group.'});
    assert.throws(() => cmd('dissolve')({id: g.id}), /already dissolved/);
    assert.throws(() => cmd('dissolve')({id: 'nope'}), /no such group/);
    assert.doesNotThrow(() => found(), 'a dissolved name can be founded again');
    assert.equal(positionsOf({actors: {player: {worldId: 'book.other'}}}).filter(r => r.source === 'organizations.js').length, 0);
});
test('a failed save rolls the slice and the purse back', () => {
    make(); box.reject = true;
    assert.throws(() => found(), /disk full/);
    assert.equal(box.money, 100); assert.equal(groupsOf(box.state).length, 0); assert.equal(organizationsSlice().serial, 0);
    box.reject = false; const g = found(); box.reject = true;
    assert.throws(() => cmd('dissolve')({id: g.id}), /disk full/);
    assert.equal(groupsOf(box.state)[0].status, 'active');
});
test('save, reload and literal import round trip; a hand-edited slice is refused on import', () => {
    make();
    const g = found({rhythm: 'fortnightly'}); cmd('dissolve')({id: g.id}); found({name: 'Second Table'});
    const env = save();
    assert.equal(env.organizations.family, 'organizations@1');
    const text = JSON.stringify(env), again = JSON.parse(text);
    domainRegistry.validate(again);
    loadOrganizations(null);
    assert.equal(groupsOf(box.state).length, 0);
    domainRegistry.load(again);
    const gs = groupsOf(box.state);
    assert.deepEqual(gs.map(x => [x.name, x.status]), [['Lantern Circle', 'dissolved'], ['Second Table', 'active']]);
    assert.equal(organizationsSlice().serial, 2);
    const bad = structuredClone(again); bad.organizations.groups[g.id].name = '<script>';
    assert.throws(() => domainRegistry.validate(bad), /unreadable/);
    assert.throws(() => validateOrganizations({family: 'organizations@1', serial: 1, groups: {x: {}}}), /unreadable/);
    assert.deepEqual(migrateOrganizations(bad.organizations).groups[g.id], undefined, 'migrate drops the unreadable group and keeps the rest');
});
test('failure scenario: an untouched life writes no key; absent or foreign slices load fresh', () => {
    make();
    assert.equal('organizations' in save(), false);
    loadOrganizations({family: 'someone.else@1', serial: 9, groups: {}});
    assert.equal(organizationsSlice().serial, 0);
    found(); loadOrganizations(undefined);
    assert.equal('organizations' in save(), false);
    assert.deepEqual(groupsOf(box.state), []);
});
