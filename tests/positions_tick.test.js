import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,run,hostOver} from './lotm_helpers.js';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/positions_domain.js';
import {registerPositionsPort} from '../src/positions_domain.js';
import {freshPositions, loadPositions, savePositions, positionsOf} from '../src/positions.js';
import {LOTM_YEAR_MINUTES} from '../src/book_world_lotm_positions.js';

const DAY = 1440;
const tick = () => domainRegistry.list().find(d => d.id === 'positions').tick(2 * DAY);
const civil = () => { const o = hostOver(bare(50)); o.host.enroll('civil'); o.box.p = run(run(o.box.p, 'report_in'), 'sign_contract'); return o; };
const signedAt = s => s.simulation.knowledge.player['book.lotm.contract'].at;

test('a contract one day short of five years ends at endsAt as term_end across a 2-day step, once', () => {
    loadPositions(freshPositions());
    const o = civil(), s = o.box.p.state, start = signedAt(s);
    s.clock = start + 5 * LOTM_YEAR_MINUTES - DAY;
    tick();
    assert.equal(savePositions(), undefined, 'one day early: nothing settled, no key');
    s.clock += 2 * DAY;
    tick();
    const row = positionsOf(s)[0];
    assert.equal(row.ended.kind, 'term_end');
    assert.equal(row.ended.at, start + 5 * LOTM_YEAR_MINUTES);
    const once = JSON.stringify(savePositions());
    tick();
    assert.equal(JSON.stringify(savePositions()), once, 'a second tick changes nothing');
});

test('a life with no position writes no positions key after ticks', () => {
    loadPositions(freshPositions());
    const o = hostOver(bare(50)); o.host.enroll('probationer');
    o.box.p.state.clock += 400 * DAY;
    tick(); tick();
    assert.equal(savePositions(), undefined);
});

test('a non-live port is skipped and a throwing port does not stop the others', () => {
    loadPositions(freshPositions());
    const o = civil(), s = o.box.p.state;
    s.clock = signedAt(s) + 6 * LOTM_YEAR_MINUTES;
    let called = 0;
    registerPositionsPort('dead', () => { called++; return null; });
    registerPositionsPort('boom', () => { throw Error('not ready'); });
    tick();
    assert.equal(called, 1);
    assert.equal(positionsOf(s)[0].ended.kind, 'term_end', 'the lotm port still settled');
});

test('the died command ends open posts at the given time', () => {
    loadPositions(freshPositions());
    const o = civil(), s = o.box.p.state;
    const at = signedAt(s) + 10 * DAY;
    domainRegistry.list().find(d => d.id === 'positions').commands.died({state: s, at});
    const row = positionsOf(s)[0];
    assert.equal(row.ended.kind, 'died');
    assert.equal(row.ended.at, at);
});
