import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/world_pack_registry.js';
import {beginContinuation, planContinuation} from '../src/continuation_state.js';

// The wired world_packs slice (SAVES 2026-11-04): one pack (book.mol), one instance, one crossing.
const PACK = 'book.mol', INSTANCE = 'book.mol.main', IMAYA = 'book.mol.imaya', ILSA = 'book.mol.ilsa';
const cmd = name => domainRegistry.command('world_packs', name);
const roundTrip = v => JSON.parse(JSON.stringify(v));
const reload = envelope => { domainRegistry.validate(roundTrip(envelope)); domainRegistry.load(roundTrip(envelope)); };
const written = base => domainRegistry.save({...structuredClone(base)});
const fresh = () => ({'game version': 'v0.0.1', 'current time': {year: 1, month: 1, day: 1, hour: 8, minute: 0}, character: {name: 'A', money: 10, bio: {race: 'human'}, xp: {total_xp: 0}},
    levels: {person: {main_character: {total_xp: 0, skill_xp: {Literacy: 0}}}}, inventories: {person: {main_character: {}}}, global_flags: {is_hero_created: true},
    expansion: {actors: {player: {worldId: 'base.frontier'}}, rng: 17, worlds: {'base.frontier': {stock: 5}}}, options: {}, quests: {}});
let token = 0;
const cross = (s, command) => planContinuation(s, command, {expectedSequence: s.continuation.sequence, token: `wps-${++token}`});

test('an unplayed life writes no world_packs key and an older save loads inert', () => {
    domainRegistry.load({});
    assert.equal(Object.hasOwn(written({}), 'world_packs'), false);
    assert.equal(cmd('view')().saves, null);
});

test('revealed people survive save, reload and a second round trip unchanged', () => {
    domainRegistry.load({});
    cmd('reveal')(PACK, INSTANCE, IMAYA);
    cmd('reveal')(PACK, INSTANCE, ILSA, 'known');
    const saved = written({});
    const section = saved.world_packs.sections[PACK];
    assert.deepEqual(Object.keys(section.delta.instances[INSTANCE].people).sort(), [ILSA, IMAYA]);
    assert.equal(section.delta.instances[INSTANCE].people[ILSA].rung, 'known');
    reload(saved);
    assert.deepEqual(written({}).world_packs, saved.world_packs);
    assert.deepEqual(cmd('view')().dormant, []);
});

test('a section of an unloaded pack is carried verbatim and does not refuse the save', () => {
    const slice = {schema: 1, sections: {'book.gone': {packId: 'book.gone', packRevision: 3, schema: 1, delta: {instances: {}, retired: {}}}}};
    reload({world_packs: slice});
    assert.deepEqual(written({}).world_packs, slice);
    assert.equal(cmd('view')().dormant[0].code, 'pack-missing');
    assert.throws(() => domainRegistry.validate({world_packs: {schema: 99, sections: {}}}), /Unsupported world pack save schema/);
});

test('a crossing and a return keep the latest world history, not the paused snapshot (OD5)', () => {
    domainRegistry.load({});
    cmd('reveal')(PACK, INSTANCE, IMAYA);
    let s = beginContinuation(Object.assign(fresh(), written({})), 'wps-journey');
    s = cross(s, 'branch:' + encodeURIComponent('Elsewhere'));          // cross: the snapshot of life-1 holds only Imaya
    domainRegistry.load(s); cmd('reveal')(PACK, INSTANCE, ILSA);          // play in the other life
    s = Object.assign(s, written({}));
    const back = cross(s, 'resume:life-1');                               // return: life-1's stale copy must not win
    assert.deepEqual(Object.keys(back.world_packs.sections[PACK].delta.instances[INSTANCE].people).sort(), [ILSA, IMAYA]);
    // A save without any world_packs state does not resurrect a stale one either.
    const bare = beginContinuation(fresh(), 'bare');
    assert.equal(Object.hasOwn(cross(bare, 'branch:' + encodeURIComponent('X')), 'world_packs'), false);
});
