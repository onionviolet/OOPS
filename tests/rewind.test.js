import test from 'node:test';
import assert from 'node:assert/strict';
import * as K from '../src/rewind_kit.js';
import {commands, configureRewind, registerRewind, rewindStore, restoreIndex, restoreAddress} from '../src/rewind_domain.js';
import {domainRegistry} from '../src/domain_registry.js';

// In-memory "domains": the same slice values the save holds.
function world(init) {
    domainRegistry.list().find(d => d.id === 'rewind').load(null);
    const slices = structuredClone(init), cell = {clock: 0, loaded: []};
    configureRewind({clock: () => cell.clock, read: id => structuredClone(slices[id]),
        validate: (id, s) => { if (s && s.bad) throw Error(`${id} refused`); return s; },
        load: (id, s) => { cell.loaded.push(id); if (s === undefined) delete slices[id]; else slices[id] = structuredClone(s); }, pinned: () => false});
    return {slices, cell};
}
const base = () => ({
    body: {hands: 'whole', legs: 'whole'}, shop: {door: 'open', till: 5}, hall: {door: 'closed'},
    minds: {holders: {hero: {notes: ['h1']}, rowan: {notes: ['r1']}, mira: {notes: ['m1']}}},
});
const spec = (over = {}) => ({id: 't', kind: 'global', label: 'Test', track: ['body', 'shop', 'hall', 'minds'], awareness: {}, ...over});
const change = w => { w.slices.body.hands = 'maimed'; w.slices.shop.till = 99; w.slices.minds.holders.rowan.notes.push('r2'); w.slices.minds.holders.hero.notes.push('h2'); };
const setup = (over, init = base()) => { const w = world(init); registerRewind(spec(over)); commands.mark('t', 'the mark'); w.cell.clock = 30; return w; };

test('global rewind restores every tracked cell to the pin', () => {
    const w = setup(); change(w);
    const r = commands.rewind('t');
    assert.equal(r.ok, true);
    assert.deepEqual(w.slices, base());
});
test('area rewind restores one place only', () => {
    const w = setup({kind: 'area', select: {area: 'shop'}, areas: {shop: ['shop']}}); change(w);
    assert.equal(commands.rewind('t').ok, true);
    assert.equal(w.slices.shop.till, 5); assert.equal(w.slices.body.hands, 'maimed');
});
test('object rewind restores one thing (a wound) and leaves the rest', () => {
    const w = setup({kind: 'object', select: {paths: ['body/hands']}}); change(w);
    commands.rewind('t');
    assert.equal(w.slices.body.hands, 'whole'); assert.equal(w.slices.shop.till, 99);
});
test('personal return: the holder keeps memory, the world returns, others forget or feel it was familiar', () => {
    const w = setup({kind: 'personal', holder: 'hero', minds: ['minds/holders/{actor}'], actorsFrom: 'minds/holders', awareness: {'*': 'deja_vu'}}); change(w);
    const r = commands.rewind('t');
    assert.deepEqual(w.slices.minds.holders.hero.notes, ['h1', 'h2']);      // carried
    assert.deepEqual(w.slices.minds.holders.rowan.notes, ['r1']);            // forgot
    assert.equal(w.slices.body.hands, 'whole');
    assert.deepEqual(rewindStore().echoes.rowan.map(e => e.level), ['deja_vu']);
    assert.ok(r.lines.some(l => /rowan: feels it was familiar/.test(l)));
});
test('awareness levels: full keeps memory, fragments leave an echo, none leaves nothing', () => {
    const w = setup({kind: 'personal', holder: 'hero', minds: ['minds/holders/{actor}'], actorsFrom: 'minds/holders', awareness: {rowan: 'full', mira: 'fragments'}}); change(w);
    w.slices.minds.holders.mira.notes.push('m2');
    commands.rewind('t');
    assert.deepEqual(w.slices.minds.holders.rowan.notes, ['r1', 'r2']);
    assert.deepEqual(w.slices.minds.holders.mira.notes, ['m1']);
    const e = rewindStore().echoes;
    assert.equal(e.mira[0].level, 'fragments'); assert.equal(e.rowan?.[0].level, 'full');
});
test('perception rewind resets only others\' memory', () => {
    const w = setup({kind: 'perception', holder: 'hero', minds: ['minds/holders/{actor}'], actorsFrom: 'minds/holders', awareness: {}}); change(w);
    commands.rewind('t');
    assert.deepEqual(w.slices.minds.holders.rowan.notes, ['r1']);
    assert.deepEqual(w.slices.minds.holders.hero.notes, ['h1', 'h2']);
    assert.equal(w.slices.body.hands, 'maimed'); assert.equal(w.slices.shop.till, 99);
});
test('per-actor horizons: outside keeps their time, shorter uses a nearer capture, none fine enough keeps their time', () => {
    const sp = spec({minds: ['minds/holders/{actor}'], actorsFrom: 'minds/holders', horizons: {rowan: 'outside', mira: 10}});
    const at0 = {clock: 0, slices: {minds: {holders: {rowan: {n: 0}, mira: {n: 0}}}}}, at30 = {clock: 30, slices: {minds: {holders: {rowan: {n: 1}, mira: {n: 1}}}}};
    let st = K.capture(K.freshStore(), at0, {label: 'old', patterns: ['minds']}).store;
    const live = {clock: 40, slices: {minds: {holders: {rowan: {n: 2}, mira: {n: 2}}}}};
    const none = K.planRewind(live, st, sp, {capture: st.captures[0], actors: ['rowan', 'mira']});
    assert.equal(none.actors.find(a => a.actor === 'mira').outcome, 'kept');
    assert.equal(none.actors.find(a => a.actor === 'rowan').outcome, 'outside');
    assert.deepEqual(K.applyPlan(live.slices, none), live.slices);                       // both keep their time
    st = K.capture(st, at30, {label: 'mid', patterns: ['minds']}).store;
    const near = K.planRewind(live, st, sp, {capture: st.captures[0], actors: ['rowan', 'mira']});
    assert.equal(near.actors.find(a => a.actor === 'mira').outcome, 'shorter');
    const out = K.applyPlan(live.slices, near);
    assert.deepEqual(out.minds.holders.mira, {n: 1});          // her ten minutes only
    assert.deepEqual(out.minds.holders.rowan, {n: 2});
});
test('nesting: the higher rank wins, then earliest; a loser is named', () => {
    const early = {id: 'a', at: 10, cells: {}}, late = {id: 'b', at: 50, cells: {}};
    const r = K.resolvePin([{capture: late, owner: 'mine', rank: 1, own: true}, {capture: early, owner: 'villain', rank: 3}]);
    assert.equal(r.winner.owner, 'villain'); assert.match(r.lost[0].reason, /mine|villain/);
    assert.equal(K.resolvePin([{capture: late, owner: 'x'}, {capture: early, owner: 'y'}], 'latest').winner.owner, 'x');
    assert.equal(K.resolvePin([{capture: early, owner: 'x'}, {capture: late, owner: 'y', own: true}], 'own').winner.owner, 'y');
});
test('a pinned path survives every rewind (the pin store wins)', () => {
    const w = world(base()); configureRewind({clock: () => 0, read: id => structuredClone(w.slices[id]), validate: (i, s) => s, load: (i, s) => { w.slices[i] = s; }, pinned: p => p === 'shop'});
    registerRewind(spec()); commands.mark('t', 'm'); change(w);
    commands.rewind('t');
    assert.equal(w.slices.shop.till, 99); assert.equal(w.slices.body.hands, 'whole');
});
test('undo one action recomputes from the log and reports what it cannot', () => {
    const log = [{id: 'e1', at: 1, writes: [{path: 'shop/till', before: 5, after: 8}, {path: 'body/hands', before: 'whole', after: 'cut'}]},
        {id: 'e2', at: 2, writes: [{path: 'shop/till', before: 8, after: 12}], reads: ['body/hands']}];
    const live = {shop: {till: 12}, body: {hands: 'cut'}};
    const p = K.planUndo(log, 'e1', live);
    assert.deepEqual(p.writes.map(w => w.path), ['body/hands']);
    assert.equal(p.settled[0].by, 'e2'); assert.equal(p.recompute[0].id, 'e2');
});
test('undo through the domain writes only paths nobody wrote since', () => {
    const w = setup(); commands.record({id: 'e1', at: 1, writes: [{path: 'body/hands', before: 'whole', after: 'maimed'}]});
    w.slices.body.hands = 'maimed';
    const r = commands.undo('e1', 't');
    assert.equal(r.ok, true); assert.equal(w.slices.body.hands, 'whole');
});
test('branching keeps the old line reachable', () => {
    const w = setup({kind: 'branch'}); change(w);
    commands.rewind('t');
    const branches = rewindStore().branches; assert.equal(branches.length, 1);
    assert.equal(w.slices.shop.till, 5);
    const r = commands.switchBranch('t', branches[0].capture);
    assert.equal(r.ok, true); assert.equal(w.slices.shop.till, 99);
    assert.ok(rewindStore().branches.length >= 2);
});
test('a moving anchor advances on a period and on events; a fixed one does not', () => {
    const mv = spec({anchor: {kind: 'moving', every: 60, on: ['rest']}}), st = {...K.freshStore(), anchors: {t: {capture: 'c', movedAt: 0}}};
    assert.equal(K.anchorDue(mv, st, {clock: 59}), false); assert.equal(K.anchorDue(mv, st, {clock: 60}), true);
    assert.equal(K.anchorDue(mv, st, {clock: 10, events: ['rest']}), true);
    assert.equal(K.anchorDue(spec(), st, {clock: 9999}), false);
});
test('nothing is captured or saved until a first mark exists, and a tick failure never throws into the registry', () => {
    world(base()); registerRewind(spec({anchor: {kind: 'moving', every: 60, on: ['rest']}}));
    const dom = domainRegistry.list().find(d => d.id === 'rewind');
    dom.tick(30);
    assert.equal(rewindStore().captures.length, 0); assert.equal(dom.save(), undefined);
    commands.event('rest'); assert.ok(rewindStore().captures.length >= 1);
    configureRewind({clock: () => { throw Error('clock down'); }}); assert.doesNotThrow(() => dom.tick(30));
});
test('a refused restore changes nothing (a restored slice a domain rejects)', () => {
    const w = setup(); change(w);
    // tamper the stored capture so the restored slice is invalid
    const store = rewindStore(); store.captures[0].cells.body = {v: {bad: true}};
    domainRegistry.list(); const slice = structuredClone(store);
    // load through the domain's own path
    const dom = domainRegistry.list().find(d => d.id === 'rewind'); dom.load(slice);
    const before = structuredClone(w.slices);
    const r = commands.rewind('t');
    assert.equal(r.ok, false); assert.match(r.reason, /refused/);
    assert.deepEqual(w.slices, before); assert.deepEqual(w.cell.loaded, []);
});
test('a slice that fails to load midway is rolled back', () => {
    const w = setup(); change(w); const orig = structuredClone(w.slices);
    let n = 0; configureRewind({clock: () => 30, read: id => structuredClone(w.slices[id]), validate: (i, s) => s, pinned: () => false,
        load: (id, s) => { if (++n === 2) throw Error('disk'); w.slices[id] = structuredClone(s); }});
    const r = commands.rewind('t');
    assert.equal(r.ok, false); assert.match(r.reason, /rolled back/); assert.deepEqual(w.slices, orig);
});
test('the saved slice validates, round trips, and rejects a malformed or newer one', () => {
    setup();
    const slice = JSON.parse(JSON.stringify(domainRegistry.save({}).rewind)); K.validateStore(slice);
    const dom = domainRegistry.list().find(d => d.id === 'rewind');
    assert.equal(dom.migrate(null).schema, 1);
    assert.throws(() => dom.migrate({schema: 9}), /newer/);
    assert.throws(() => dom.validate({...slice, captures: 'x'}), /invalid/);
    assert.throws(() => K.validateStore({...slice, captures: [{id: 'a', at: 1, cells: {x: {oops: 1}}}]}), /cell/);
    assert.equal(dom.save && domainRegistry.list().length > 0, true);
});
test('captures are bounded and a prototype-key path is refused', () => {
    let s = K.freshStore();
    for (let i = 0; i < 30; i++) s = K.capture(s, {clock: i, slices: {a: {n: i}}}, {label: 'm', patterns: ['a']}).store;
    assert.equal(s.captures.length, K.REWIND_DIALS.maxCaptures.value);
    const plan = {writes: [{path: '__proto__/x', to: 1, keep: []}]};
    assert.throws(() => K.applyPlan({}, plan), /prototype/);
});
test('inspector lines say what came back, what stayed and who remembers, without engine words', () => {
    const w = setup({kind: 'personal', holder: 'hero', minds: ['minds/holders/{actor}'], actorsFrom: 'minds/holders', awareness: {'*': 'none'}, names: {body: 'your body', minds: 'what people remember'}}); change(w);
    const lines = commands.rewind('t').lines.join(' ');
    assert.match(lines, /Came back to how it was at the mark/); assert.match(lines, /Stayed as it is/); assert.match(lines, /rowan: remembers nothing/);
    assert.doesNotMatch(lines, /slice|path|capture/i);
});
test('held restore points are indexed by pin address with a time and a digest', () => {
    setup(); const idx = restoreIndex(), cap = rewindStore().anchors.t.capture;
    const row = idx[restoreAddress('t', cap)];
    assert.equal(row.at, 0); assert.ok(Number.isSafeInteger(row.digest));
    assert.deepEqual(idx[restoreAddress('t', cap)], restoreIndex()[restoreAddress('t', cap)]);
});
