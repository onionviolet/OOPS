import test from 'node:test';
import assert from 'node:assert/strict';
import {livelihoodsOf, livelihoodLine, validateLivelihood, registerLivelihoodSource} from '../src/livelihoods.js';
import '../src/livelihood_sources.js';
import '../src/book_world_lotm_livelihoods.js';
import {returnDigest} from '../src/return_digest.js';
import {createReturnDigestRow} from '../src/return_digest_ui.js';
import {HABITAT, planHabitatAction} from '../src/habitat_care.js';
import {bare, run, hostOver, registry} from './lotm_helpers.js';

// Lane E read side: one stage record per livelihood, derived from existing owners; no save key.
const frontier = facts => ({clock: 0, actors: {player: {facts}}});
const row = (state, id, ctx) => livelihoodsOf(state, ctx).find(r => r.id === id);

test('Village courtyard plot: stage follows the MG06 facts; an untouched save projects nothing and gains no key', () => {
    const untouched = frontier({});
    const before = JSON.stringify(untouched);
    assert.deepEqual(livelihoodsOf(untouched), []);
    assert.deepEqual(livelihoodsOf({}), [], 'a state with no actors is fine');
    assert.equal(JSON.stringify(untouched), before, 'read only');
    assert.deepEqual(Object.keys(untouched), ['clock', 'actors']);
    const id = 'frontier.village.courtyard_plot';
    const stage = f => row(frontier(f), id)?.stage;
    assert.equal(stage({'mg.plotRight': true}), 'set up');
    assert.equal(stage({'mg.plotRight': true, 'mg.cropStage': 'planted', 'mg.cropType': 'greens'}), 'running');
    const ready = row(frontier({'mg.plotRight': true, 'mg.cropStage': 'ready', 'mg.cropType': 'grain'}), id);
    assert.equal(ready.stage, 'running'); assert.match(ready.detail, /grain ready to harvest/);
    assert.equal(stage({'mg.plotRight': true, 'mg.cropStage': 'harvested'}), 'set up');
    assert.deepEqual(ready.authority, {known: true, who: 'Mira'});
    assert.equal(ready.obligations.kind, 'none', 'MG06 rent is a one-time payment: no recurring due to point at');
    assert.match(livelihoodLine(ready), /^Village courtyard plot: running, grain ready to harvest\./);
});

test('Village meadow pen: unknown to any authority, so no tax or rent obligation; stage follows the pen owner', () => {
    const ctxFor = (owner, clock) => ({habitat: {owner, clock}});
    const ctx = {clock: 100, money: 100, inventory: {}, location: HABITAT.location, world: HABITAT.world, ready: true};
    const built = planHabitatAction(null, 'build', ctx).owner ?? planHabitatAction(null, 'build', ctx);
    const owner = built.owner ?? built.next ?? built.habitat ?? Object.values(built).find(v => v?.site);
    assert.ok(owner?.site, 'fixture: a built pen');
    const s = frontier({});
    const pen = row(s, 'frontier.village.meadow_pen', ctxFor(owner, 100));
    assert.equal(pen.stage, 'set up'); assert.equal(pen.detail, 'no sheep yet');
    assert.equal(pen.authority.known, false);
    assert.equal(pen.obligations.kind, 'none'); assert.match(pen.obligations.why, /no rent or tax/);
    assert.equal(row(s, 'frontier.village.meadow_pen'), undefined, 'no host owner passed: no row');
    const adopted = structuredClone(owner); adopted.animal = {id: HABITAT.animal, owner: 'player', site: owner.site.id, adoptedAt: 100, welfare: 'sheltered_safe'};
    assert.equal(row(s, 'frontier.village.meadow_pen', ctxFor(adopted, 100)).stage, 'running');
});

test('the record refuses a tax or rent from an authority that does not know of the place (OB8, OB12)', () => {
    const ok = {id: 'x', world: 'w', kind: 'farm', label: 'Cabin plot', stage: 'running', runBy: 'self', income: null,
        obligations: {kind: 'none', pointer: null, why: 'Empty land.'}, authority: {known: false, who: null}};
    assert.ok(validateLivelihood(ok));
    assert.throws(() => validateLivelihood({...ok, obligations: {kind: 'tax', pointer: null, why: 'Tax.'}}), /nothing is owed/);
    assert.throws(() => validateLivelihood({...ok, stage: 'bogus'}), /unknown stage/);
    // A source that emits such a row has it dropped, and a throwing source is skipped, not fatal.
    registerLivelihoodSource('test.homestead', () => [{...ok, obligations: {kind: 'rent', pointer: null, why: 'Rent.'}}, {...ok, id: 'good'}]);
    registerLivelihoodSource('test.broken', () => { throw Error('boom'); });
    const rows = livelihoodsOf(frontier({}), {worldId: 'test.homestead'});
    assert.deepEqual(rows.map(r => r.id), ['good']);
    assert.deepEqual(rows[0].obligations.kind, 'none');
    assert.deepEqual(livelihoodsOf(frontier({}), {worldId: 'test.broken'}), []);
});

test('Tingen civil clerk: idea until the contract is signed, then a running wage with its weekly income', () => {
    const o = hostOver(bare(50)); o.host.enroll('civil');
    let p = run(o.box.p, 'report_in');
    const id = 'lotm.civil_staff_wage';
    const idea = row(p.state, id);
    assert.equal(idea.stage, 'idea'); assert.equal(idea.income, null);
    p = run(p, 'sign_contract');
    const live = row(p.state, id);
    assert.equal(live.stage, 'running'); assert.match(live.detail, /1 week of pay uncollected/);
    assert.equal(live.income.amount, 3 * 240); assert.equal(live.world, 'book.lotm');
    assert.equal(live.authority.known, true);
    p = run(p, 'collect_pay');
    assert.match(row(p.state, id).detail, /pay collected/);
    // A probationer life has no wage row.
    const q = hostOver(bare(50)); q.host.enroll('probationer');
    assert.equal(row(q.box.p.state, id), undefined);
});

test('both worlds project through one call, and the Reports digest row shows the lines', () => {
    const o = hostOver(bare(50)); o.host.enroll('civil');
    const p = run(run(o.box.p, 'report_in'), 'sign_contract');
    const state = structuredClone(p.state);
    Object.assign(state.actors.player.facts, {'mg.plotRight': true, 'mg.cropStage': 'ready', 'mg.cropType': 'greens'});
    const worlds = new Set(livelihoodsOf(state).map(r => r.world));
    assert.ok(worlds.has('base.frontier') && worlds.has('book.lotm'));
    const before = JSON.stringify(state);
    const d = returnDigest(state, registry, {facts: {}, seenAt: 0});
    assert.equal(JSON.stringify(state), before, 'read only');
    assert.equal(d.livelihoods.filter(l => !/Cabin plot/.test(l)).length, 2, 'plot and wage (test-only sources excluded)');
    assert.ok(d.livelihoods.some(l => /Village courtyard plot: running, greens ready to harvest/.test(l)));
    // UI: the row prints them when the digest is visible, and prints nothing extra when there are none.
    const els = [];
    const doc = {createElement: tag => { const n = {tag, children: [], hidden: false, textContent: '', dataset: {}, className: '', append(...c) { this.children.push(...c); }, replaceChildren(...c) { this.children = c; }, addEventListener() {}, setAttribute() {}}; els.push(n); return n; }};
    const row2 = createReturnDigestRow({doc, markRead() {}});
    row2.update({visible: true, spanText: 'about a day', groups: [], livelihoods: d.livelihoods});
    const works = els.find(n => n.className === 'return-digest-livelihoods');
    assert.match(works.textContent, /^Your work: .*Village courtyard plot/);
    row2.update({visible: true, spanText: 'about 2 days', groups: [], livelihoods: []});
    assert.equal(works.hidden, true); assert.equal(works.textContent, '');
});
