import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,run,hostOver} from './lotm_helpers.js';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/positions_domain.js';
import {freshPositions, loadPositions, savePositions, positionsOf} from '../src/positions.js';
import {beginContinuation} from '../src/continuation_state.js';
import {createContinuationHost} from '../src/continuation_host.js';

const DAY = 1440;
const tick = () => domainRegistry.list().find(d => d.id === 'positions').tick(DAY);
const died = args => domainRegistry.command('positions', 'died')(args);
const signedAt = s => s.simulation.knowledge.player['book.lotm.contract'].at;
const civil = () => { const o = hostOver(bare(50)); o.host.enroll('civil'); o.box.p = run(run(o.box.p, 'report_in'), 'sign_contract'); return o; };
const post = s => positionsOf(s)[0];

test('an old-age end with a held post closes it as died at endedAt, once', () => {
    loadPositions(freshPositions());
    const o = civil(), s = o.box.p.state, end = signedAt(s) + 3 * DAY;
    s.chronicle = {life: {endedAt: end}}; s.clock = end + 40 * DAY;
    tick();
    assert.equal(post(s).ended.kind, 'died');
    assert.equal(post(s).ended.at, end, 'the chronicle end, not the minute it was seen');
    const once = JSON.stringify(savePositions());
    tick(); died({state: s, at: s.clock}); // a second observer, e.g. the LOTM loss of control
    assert.equal(JSON.stringify(savePositions()), once, 'two observers leave one exit');
});

test('a living chronicle closes nothing', () => {
    loadPositions(freshPositions());
    const o = civil(), s = o.box.p.state;
    s.chronicle = {life: {endedAt: null}}; s.clock += 40 * DAY;
    tick();
    assert.equal(post(s).ended, undefined);
    assert.equal(savePositions(), undefined);
});

test('a life with no post writes no positions key at its end', () => {
    loadPositions(freshPositions());
    const o = hostOver(bare(50)), s = o.box.p.state;
    s.chronicle = {life: {endedAt: 100}}; s.clock = 500;
    tick();
    assert.equal(savePositions(), undefined);
});

test('diedInSave closes the save own posts, leaves the live slice and a post-less save alone', () => {
    loadPositions(freshPositions());
    const o = civil(), s = o.box.p.state, now = signedAt(s) + 5 * DAY;
    s.clock = now;
    const save = domainRegistry.command('positions', 'diedInSave')({expansion: s});
    assert.equal(Object.values(save.positions.records)[0].exit.kind, 'died');
    assert.equal(Object.values(save.positions.records)[0].exit.at, now);
    assert.equal(savePositions(), undefined, 'the live slice is untouched');
    const again = JSON.stringify(save.positions);
    domainRegistry.command('positions', 'diedInSave')(save);
    assert.equal(JSON.stringify(save.positions), again, 'a second pass changes nothing');
    const bareSave = domainRegistry.command('positions', 'diedInSave')({expansion: hostOver(bare(50)).box.p.state});
    assert.equal('positions' in bareSave, false);
});

test('a continuation die closes the dying life posts in the published save', async () => {
    loadPositions(freshPositions());
    const o = civil(), s = o.box.p.state;
    s.clock = signedAt(s) + 2 * DAY;
    const save = {'game version': 'v0.0.1', 'current time': {year: 1, month: 1, day: 1, hour: 8, minute: 0}, character: {name: 'A', money: 10, bio: {race: 'human'}, xp: {total_xp: 0}},
        levels: {person: {main_character: {total_xp: 0, skill_xp: {}}}}, inventories: {person: {main_character: {}}}, global_flags: {is_hero_created: true}, expansion: s};
    const source = beginContinuation(save, 'test-journey'); let published = null;
    const host = createContinuationHost({capture: () => structuredClone(source), ownsSave: () => true, revision: () => 1, freeze() {}, thaw() {}, preflight: async () => {}, publish: n => { published = n; }, reload() {}});
    await host.command('die:loss_of_control', {expectedSequence: source.continuation.sequence, token: 'die-1'});
    const rec = Object.values(published.positions.records)[0];
    assert.equal(rec.exit.kind, 'died');
    assert.equal(rec.exit.at, s.clock);
    assert.equal(savePositions(), undefined);
});
