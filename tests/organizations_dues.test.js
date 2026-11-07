import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureOrganizations} from '../src/organizations_domain.js';
import {groupsOf, groupLines, organizationsSlice, loadOrganizations, validateOrganizations, migrateOrganizations, saveOrganizations, DUES_COIN} from '../src/organizations.js';
import {meetsOn} from '../src/gatherings.js';
import '../src/management/group_source.js';

const WORLD = 'base.frontier', DAY = 1440;
let box;
const make = (over = {}) => {
    box = {state: {clock: 3000, actors: {player: {worldId: WORLD, facts: {'mg.opened': true}}}}, gameplay: {player: {reputation: {Village: 12}}}, money: 100, where: 'Village', writable: true, commits: 0, ...over};
    domainRegistry.initialize();
    configureOrganizations({root: () => box.state, actor: () => ({money: box.money, reputation: {Village: box.gameplay.player.reputation.Village}}), world: () => WORLD,
        location: () => box.where, idle: () => true, writable: () => box.writable, blocked: () => '', logMessage() {},
        plan: () => ({state: structuredClone(box.state), external: {money: box.money}, gameplay: structuredClone(box.gameplay)}),
        commit: plan => { if (box.reject) throw Error('disk full'); box.commits++; box.state = plan.state; box.money = plan.external.money; box.gameplay = plan.gameplay; }});
};
const cmd = n => domainRegistry.command('organizations', n);
const found = (over = {}) => cmd('found')({name: 'Lantern Circle', dues: 'coin', ...over});
// First meeting of a weekly group founded at clock 3000 (day 2): day 9 at 20:00.
const afterMeetings = (g, n) => { box.state.clock = (9 + 7 * (n - 1)) * DAY + 20 * 60 + 5; };
const group = () => Object.values(organizationsSlice().groups)[0];

test('invite: a villager above the bar joins, one below it refuses with a reason, and a second ask is refused', () => {
    make(); const g = found();
    assert.equal(cmd('invite')({id: g.id, npc: 'mg.mira'}).name, 'Mira');
    assert.deepEqual(Object.keys(group().members), ['mg.mira']);
    assert.throws(() => cmd('invite')({id: g.id, npc: 'mg.mira'}), /already in Lantern Circle/);
    assert.throws(() => cmd('invite')({id: g.id, npc: 'mg.orin'}), /does not hand coin to a box/);
    assert.throws(() => cmd('invite')({id: g.id, npc: 'nobody'}), /Nobody here/);
    const q = cmd('inviteQuote')({id: g.id});
    assert.deepEqual(q.map(x => [x.name, x.eligible]), [['Mira', false], ['Sela', true], ['Orin', false], ['Bram', false]]);
    assert.equal(q.find(x => x.name === 'Orin').needs, 14);
    box.gameplay.player.reputation.Village = 14;
    assert.equal(cmd('inviteQuote')({id: g.id}).find(x => x.name === 'Orin').eligible, true);
    box.where = 'Forest';
    assert.throws(() => cmd('invite')({id: g.id, npc: 'mg.sela'}), /Do this at the Market courtyard/);
});
test('admission shifts the bar: open asks less of a stranger, vouched more', () => {
    make(); const o = found({admission: 'open', name: 'Open Door'}), v = found({admission: 'vouched', name: 'Vouched Door'});
    assert.equal(cmd('inviteQuote')({id: o.id}).find(x => x.name === 'Orin').needs, 12);
    assert.equal(cmd('inviteQuote')({id: v.id}).find(x => x.name === 'Orin').needs, 18);
    assert.equal(cmd('inviteQuote')({id: o.id}).find(x => x.name === 'Orin').eligible, true);
});
test('dues are collected once per meeting into the treasury, however often settle runs', () => {
    make(); const g = found(); cmd('invite')({id: g.id, npc: 'mg.mira'}); cmd('invite')({id: g.id, npc: 'mg.sela'});
    box.state.clock = 9 * DAY; // the meeting day, before 20:00
    assert.equal(cmd('pending')({id: g.id}), 0);
    afterMeetings(g, 1);
    assert.equal(cmd('pending')({id: g.id}), 1);
    const r = cmd('settle')({id: g.id});
    assert.deepEqual([r.held, r.collected], [1, 2 * DUES_COIN.weekly]);
    assert.equal(group().treasury, 4);
    const commits = box.commits;
    assert.equal(cmd('settle')({id: g.id}).held, 0);
    assert.equal(box.commits, commits, 'nothing held means nothing written');
    assert.equal(group().treasury, 4);
    afterMeetings(g, 3); // two more meetings
    assert.equal(cmd('settle')({id: g.id}).collected, 8);
    assert.equal(group().treasury, 12);
    assert.equal(box.money, 70, 'dues never touch the founder purse');
    const rec = groupsOf(box.state)[0];
    assert.equal(rec.treasury.coin, 12);
    assert.match(groupLines([rec])[0], /Treasury: 12 coins\.$/);
});
test('a member who cannot pay is recorded late and charged nothing; a member who joined after a meeting owes nothing for it', () => {
    make({gameplay: {player: {reputation: {Village: 30}}}}); const g = found(); cmd('invite')({id: g.id, npc: 'mg.bram'});
    afterMeetings(g, 1);
    const r = cmd('settle')({id: g.id});
    assert.deepEqual([r.collected, r.late, r.paid], [0, ['Bram'], []]);
    assert.equal(group().treasury, 0);
    assert.equal(group().members['mg.bram'].late, 1);
    afterMeetings(g, 2); cmd('settle')({id: g.id});
    assert.equal(group().members['mg.bram'].late, 2);
    assert.equal(groupsOf(box.state)[0].members[1].lateMeetings, 2);
    // a joiner after the clock passed a meeting is not charged for it
    make({gameplay: {player: {reputation: {Village: 30}}}}); const h = found(); afterMeetings(h, 1);
    cmd('invite')({id: h.id, npc: 'mg.mira'});
    assert.equal(cmd('settle')({id: h.id}).collected, 0);
    assert.equal(group().members['mg.mira'].late, 0);
});
test('dues none or goods collect nothing and keep no treasury', () => {
    make(); const g = found({dues: 'none'}); cmd('invite')({id: g.id, npc: 'mg.mira'}); afterMeetings(g, 2);
    assert.equal(cmd('settle')({id: g.id}).held, 0);
    assert.equal(group().treasury, undefined);
    assert.equal(groupsOf(box.state)[0].treasury, undefined);
    assert.equal(cmd('abilityQuote')({id: g.id})[0].eligible, false);
});
test('feast: spends the treasury once per meeting and raises Village standing; the lookout lifts the next meeting secrecy', () => {
    make(); const g = found({secrecy: 'quiet'}); cmd('invite')({id: g.id, npc: 'mg.mira'}); cmd('invite')({id: g.id, npc: 'mg.sela'});
    assert.throws(() => cmd('spend')({id: g.id, ability: 'feast'}), /treasury holds 0 coins/);
    afterMeetings(g, 4); // 4 meetings x 4 coins = 16
    const before = box.gameplay.player.reputation.Village;
    cmd('spend')({id: g.id, ability: 'feast'});
    assert.equal(group().treasury, 4, 'dues collected first, then 12 spent');
    assert.equal(box.gameplay.player.reputation.Village, before + 2);
    assert.throws(() => cmd('spend')({id: g.id, ability: 'feast'}), /Already done before the next meeting|treasury holds 4/);
    assert.equal(cmd('gathering')(g.id).dial.secrecy, 0.5);
    assert.throws(() => cmd('spend')({id: g.id, ability: 'lookout'}), /treasury holds 4 coins; this costs 6/);
});
test('lookout raises secrecy for the next meeting only', () => {
    make(); const g = found({secrecy: 'quiet'}); cmd('invite')({id: g.id, npc: 'mg.mira'}); cmd('invite')({id: g.id, npc: 'mg.sela'});
    afterMeetings(g, 2); // 8 coins
    cmd('spend')({id: g.id, ability: 'lookout'});
    assert.equal(group().treasury, 2);
    assert.equal(cmd('gathering')(g.id).dial.secrecy, 1);
    assert.deepEqual(cmd('gathering')(g.id).seats.map(s => s.id), ['founder', 'm:mg.mira', 'm:mg.sela']);
    assert.throws(() => cmd('spend')({id: g.id, ability: 'lookout'}), /Already done before the next meeting/);
    box.state.clock = (9 + 7 * 2) * DAY + 21 * 60; // the covered meeting has happened
    assert.equal(cmd('gathering')(g.id).dial.secrecy, 0.5);
    assert.equal(meetsOn(cmd('gathering')(g.id), 9 + 14), true);
});
test('a refused spend or a failed commit changes nothing', () => {
    make(); const g = found(); cmd('invite')({id: g.id, npc: 'mg.mira'}); afterMeetings(g, 6); cmd('settle')({id: g.id});
    const before = structuredClone(organizationsSlice()), rep = box.gameplay.player.reputation.Village;
    box.reject = true;
    assert.throws(() => cmd('spend')({id: g.id, ability: 'feast'}), /disk full/);
    assert.deepEqual(organizationsSlice(), before);
    assert.equal(box.gameplay.player.reputation.Village, rep);
    box.reject = false; box.where = 'Forest';
    assert.throws(() => cmd('spend')({id: g.id, ability: 'feast'}), /Do this at/);
    assert.throws(() => cmd('spend')({id: g.id, ability: 'nope'}), /no such ability/);
    assert.deepEqual(organizationsSlice(), before);
});
test('dissolve shares the treasury back to the members who paid in; it never reaches the founder purse', () => {
    make(); const g = found(); cmd('invite')({id: g.id, npc: 'mg.mira'}); afterMeetings(g, 3); cmd('settle')({id: g.id});
    assert.equal(group().treasury, 6);
    const purse = box.money;
    cmd('dissolve')({id: g.id});
    assert.equal(box.money, purse);
    assert.equal(group().treasury, undefined);
    assert.equal(group().shared, 6);
    assert.equal(group().status, 'dissolved');
    assert.throws(() => cmd('invite')({id: g.id, npc: 'mg.sela'}), /no such group/);
    assert.throws(() => cmd('settle')({id: g.id}), /no such group/);
});
test('save and reload keep members, treasury and used abilities; Import refuses a bad dues shape', () => {
    make(); const g = found(); cmd('invite')({id: g.id, npc: 'mg.mira'}); afterMeetings(g, 3); cmd('spend')({id: g.id, ability: 'lookout'});
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    const want = organizationsSlice();
    domainRegistry.initialize(); assert.equal(Object.keys(organizationsSlice().groups).length, 0);
    domainRegistry.validate(saved); domainRegistry.load(saved);
    assert.deepEqual(organizationsSlice(), want);
    assert.equal(group().treasury, 0);
    assert.equal(group().used.lookout, 30);
    assert.equal(cmd('settle')({id: g.id}).held, 0, 'already collected meetings stay collected after reload');
    for (const bad of [{treasury: -1}, {treasury: 1.5}, {members: {x: {name: '', joined: 0, paid: 0, late: 0}}}, {used: {feast: 'now'}}, {extra: 1}]) {
        const s = structuredClone(saved.organizations), id = Object.keys(s.groups)[0];
        Object.assign(s.groups[id], bad);
        assert.throws(() => validateOrganizations(s), /unreadable/);
        assert.equal(Object.keys(migrateOrganizations(s).groups).length, 0, 'load drops only the unreadable group');
    }
});
test('failure scenario: a group saved before dues existed loads unchanged, collects nothing without members and writes the same bytes', () => {
    make(); const g = found({dues: 'coin'});
    const before = JSON.stringify(domainRegistry.save({}));
    afterMeetings(g, 3);
    assert.equal(cmd('settle')({id: g.id}).held, 3);
    assert.equal(JSON.stringify(group().members), undefined, 'no members key appears without a member');
    const old = JSON.parse(before); // 2026-11-06 shape: no members, treasury, settled or used
    for (const k of ['members', 'treasury', 'settled', 'used', 'shared']) assert.equal(k in old.organizations.groups[g.id], false);
    domainRegistry.initialize(); domainRegistry.validate(old); domainRegistry.load(old);
    assert.equal(JSON.stringify(domainRegistry.save({})), before, 'load then save is byte-identical');
    make(); assert.equal(saveOrganizations(), undefined, 'an untouched life writes no key');
    make(); found(); cmd('invite')({id: Object.keys(organizationsSlice().groups)[0], npc: 'mg.mira'});
    loadOrganizations(undefined); assert.equal(saveOrganizations(), undefined);
});
