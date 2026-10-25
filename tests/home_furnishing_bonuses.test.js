import test from 'node:test';
import assert from 'node:assert/strict';
import {furnitureProjection, furnitureSkillMultiplier, furnitureRecovery, furniturePresentation} from '../src/absorb_b/furniture.js';
import {PROTO23_IDS as P, PROTO23_KEYS as K, PROTO23_LOCATIONS as L} from '../src/proto23_world_ids.js';
import {HOME_FURNISHING_IDS as H, homeFurnishingDefinitions as D, homeFurnishingProjects} from '../src/home_furnishing_content.js';
const key = id => JSON.stringify({id});
const input = () => ({state: {schema: 11, clock: 100, sequence: 100, actors: {player: {worldId: 'base.frontier', facts: {}, completed: {}}}, worlds: {}, simulation: {}},
    locationId: 'Shack', housingAccessible: true, nativeInventory: {}, chestInventory: {}, bookStats: {}});
const fixtures = () => {
    const x = input(), s = x.state;
    s.proto23Village = {schema: 1}; s.actors.player.facts['proto23.cottageRight'] = true;
    s.actors.player.completed['proto23.cottage_agreement'] = 1;
    s.simulation.sites = {[P.site]: {capacity: 1}};
    s.simulation.claims = {'proto23.cottage_right': {owner: 'player', status: 'settled'}};
    s.worlds[P.world] = {facts: {}};
    for(const f of ['bed', 'hearth', 'bookstand']) {
        s.actors.player.completed[`proto23.install_${f}`] = 1;
        s.worlds[P.world].facts[`proto23.${f}Installed`] = true;
        s.simulation.claims[`proto23.fixture.${f}`] = {owner: 'player', status: 'settled'};
    }
    return x;
};

test('native housing bonuses are local, readable, and absent on old missing owners', () => {
    const x = input(), p = furnitureProjection(x);
    assert.equal(furnitureSkillMultiplier(p, 'Sleeping'), 1.05);
    assert.equal(furnitureRecovery(p, 20), 21);
    assert.equal(p.total.storageAccess, true);
    assert.match(furniturePresentation(x).sections[0].records[0].text, /\+5% Sleeping XP/);
    assert.equal(furnitureProjection({...x, housingAccessible: false}).total.rest, 1);
    assert.equal(furnitureProjection({...x, state: {}}).rows.length, 0);
    assert.equal(furnitureProjection({...x, state: {...x.state, actors: {player: {worldId: 'elsewhere'}}}}).rows.length, 0);
    assert.throws(() => furnitureRecovery(p, -1), /nonnegative/);
});

test('book bonus needs completed owned books, counts distinct works and caps ten', () => {
    const x = input();
    for(let i = 0; i < 12; i++) {x.bookStats['Book ' + i] = {required_time: 3, accumulated_time: 3}; x.chestInventory[key('Book ' + i)] = 5;}
    x.nativeInventory[key('Book 0')] = 10;
    x.bookStats.Unfinished = {required_time: 5, accumulated_time: 4}; x.nativeInventory[key('Unfinished')] = 1;
    x.bookStats.Remembered = {required_time: 1, accumulated_time: 1};
    const p = furnitureProjection(x);
    assert.equal(p.readBooks, 12); assert.equal(p.total.xp.Literacy, 1.1);
    x.state.simulation.custody = {loan: {key: key('Book 0'), holder: 'player', owner: 'lender', count: 10}};
    x.chestInventory = {};
    assert.equal(furnitureProjection(x).readBooks, 0);
    assert.equal(furnitureProjection({...x, nativeInventory: {[key('Book 0')]: 0.5}}).readBooks, 0);
});

test('counted carried furniture is inert; only settled installed local fixtures earn bonuses', () => {
    const x = fixtures();
    x.nativeInventory = {[K.bed]: 100, [K.hearth]: 10};
    assert.equal(furnitureProjection(x).total.xp.Regeneration, undefined);
    x.state.actors.player.worldId = P.world; x.locationId = L.cottage;
    const p = furnitureProjection(x);
    assert.equal(p.total.rest, 1.08); assert.equal(p.total.xp.Regeneration, 1.03); assert.equal(p.total.xp.Literacy, 1.03);
    assert.equal(p.rows.filter(r => r.active).length, 3);
    delete x.state.simulation.claims['proto23.fixture.bed'];
    assert.equal(furnitureProjection(x).total.rest, 1);
    x.locationId = L.center;
    assert.equal(furnitureProjection(x).total.xp.Regeneration, undefined);
    assert.match(furniturePresentation(x).sections[0].records[0].text, /Active at Proto23 visitor cottage/);
});

test('Shack project flags alone earn nothing; existing earned phased fixture owners do', () => {
    const x = input(), s = x.state, a = s.actors.player;
    s.worlds[H.world] = {facts: {'home_furnishings.rackBuilt': true, 'home_furnishings.benchBuilt': true}};
    assert.equal(furnitureProjection(x).total.xp.Literacy, undefined);
    s.auditRemainder = {schema: 1, definitionRevision: 1}; s.referenceGameplay = {schema: 1};
    a.facts['audit_remainder.enrolled'] = true; a.completed['audit_remainder.enroll'] = 1;
    a.facts['field.facility'] = true; a.completed['field.workshop.assembly'] = 1;
    s.worlds[H.world].facts['project.field.workshop.assembly'] = true;
    s.simulation.sites = {[H.site]: {owner: 'player', capacity: 1}};
    a.facts['home_furnishings.right'] = H.site; a.completed[H.survey] = 1;
    const receipt = D.commands.find(d => d.id === H.survey).effects.find(e => e.type === 'knowledge');
    s.simulation.knowledge = {player: {[receipt.key]: {stage: receipt.stage, value: receipt.value, basis: receipt.basis, at: 1, cause: 'simulation:1'}}};
    for(const project of homeFurnishingProjects) {
        s.worlds[H.world].facts[`project.${project.id}.started`] = true;
        for(const phase of ['frame', 'finish']) {a.completed[`${project.id}.${phase}`] = 1; s.worlds[H.world].facts[`project.${project.id}.${phase}`] = true;}
    }
    const p = furnitureProjection(x);
    assert.equal(p.total.xp.Literacy, 1.03); assert.equal(p.total.xp.Regeneration, 1.02);
    x.locationId = 'Village'; x.housingAccessible = false;
    assert.deepEqual(furnitureProjection(x).total.xp, {});
});

test('home kit requires earned adaptation plus current owned physical kit; copies and reload never stack', () => {
    const x = fixtures(); x.nativeInventory[K.kit] = 4;
    assert.equal(furnitureProjection(x).total.xp['Crafting mastery'], undefined);
    x.state.actors.player.completed['proto23.home_kit'] = 12;
    const before = structuredClone(x), p = furnitureProjection(x);
    assert.equal(p.total.xp['Crafting mastery'], 1.02);
    for(let n = 0; n < 4; n++) assert.deepEqual(furnitureProjection(JSON.parse(JSON.stringify(x))), p);
    assert.deepEqual(x, before);
    x.state.simulation.custody = {loan: {key: K.kit, holder: 'player', owner: 'other', count: 4}};
    assert.equal(furnitureProjection(x).total.xp['Crafting mastery'], undefined);
    delete x.nativeInventory[K.kit]; x.chestInventory[K.kit] = 5;
    assert.equal(furnitureProjection(x).total.xp['Crafting mastery'], undefined);
});
