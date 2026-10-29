import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCrosswalk, classifyAction, discoverLeadPersonas, hasTime, inSlice, runtimeCatalogue, run} from '../scripts/lead_run/build_crosswalk.mjs';
const slice = {from: 'en b1 c1 p1', to: 'en b1 c4 p9999'};
const registry = [
    {id: 'mol.person.iris', kind: 'person', label: 'Iris Vale'},
    {id: 'mol.person.ren', kind: 'person', label: 'Ren', aliases: ['R']},
    {id: 'mol.place.study', kind: 'place', label: 'North study', aliases: ['upstairs study']},
    {id: 'mol.organization.school', kind: 'organization', label: 'School'},
    {id: 'mol.item.book', kind: 'item', label: 'Primer'},
];
const scene = {beat: 'lr.fixture.1', pov: 'lead', evidence: [{locator: 'en b1 c2 p1'}], place: 'upstairs study',
    present: ['mol.person.iris'], touched: [
        {id: 'mol.person.iris', kind: 'person', status: 'present'},
        {id: 'mol.organization.school', kind: 'organization', status: 'partial'},
        {id: 'mol.item.book', kind: 'item', status: 'present'},
        {id: 'mol.item.absent', kind: 'item', status: 'missing'},
    ], outcomes: [{fact: 'fixture.completed', value: true}]};
const runtime = {ids: new Set(['book.mol.iris']), people: [{id: 'book.mol.iris', name: 'Iris Vale'}]};
const make = (extra = {}) => buildCrosswalk({registry, scenes: [scene], extras: [], world: 'mol', slice, runtime, ...extra});

test('all present/partial kinds map; missing does not; exact pack person names map', () => {
    const {crosswalk: c} = make();
    assert.equal(c.mapping['mol.person.iris'], 'book.mol.iris');
    for (const id of ['mol.organization.school', 'mol.item.book', 'mol.place.study']) assert.match(c.mapping[id], /^new:mol\./);
    assert.equal(c.mapping['mol.item.absent'], undefined);
    assert.equal(c.places['upstairs study'], 'mol.place.study');
});
test('uncertain ids with identical names stay distinct and proposals survive row reorder', () => {
    const rows = [...registry, {id: 'mol.person.iris-two', kind: 'person', label: 'Iris Vale'}];
    const sc = {...scene, touched: [...scene.touched, {id: 'mol.person.iris-two', kind: 'person', status: 'partial'}]};
    const noRuntime = runtime;
    const a = make({registry: rows, scenes: [sc], runtime: noRuntime}).crosswalk;
    const b = make({registry: [...rows].reverse(), scenes: [sc], runtime: noRuntime}).crosswalk;
    assert.notEqual(a.mapping['mol.person.iris'], a.mapping['mol.person.iris-two']);
    assert.deepEqual(a.mapping, b.mapping);
});
test('ambiguous free-text places get separate proposals, reviewed place join must exist', () => {
    const rows = [...registry, {id: 'mol.place.other-study', kind: 'place', label: 'North study'}];
    const sc = {...scene, place: 'North study'};
    const a = make({registry: rows, scenes: [sc]}).crosswalk;
    assert.match(a.mapping['North study'], /^new:mol.place\./);
    assert.deepEqual(a.ambiguousPlaces, ['North study']);
    assert.equal(make({registry: rows, scenes: [sc], review: {places: {'North study': 'mol.place.study'}}}).crosswalk.places['North study'], 'mol.place.study');
    assert.throws(() => make({review: {places: {'upstairs study': 'mol.person.iris'}}}), /valid place id/);
});
test('slice uses source volume, earliest locator, lead POV, inclusive boundaries', () => {
    assert.equal(inSlice({locator: 'en b1 c4 p9999'}, slice), true);
    assert.equal(inSlice({locator: 'en b2 c2 p1'}, slice), false);
    assert.equal(inSlice({evidence: [{locator: 'en b1 c5 p1'}, {locator: 'en b1 c4 p1'}]}, slice), true);
    const result = make({scenes: [scene, {...scene, pov: 'mol.person.iris'}, {...scene, evidence: [{locator: 'en b1 c5 p1'}]}]});
    assert.equal(result.report.leadScenes, 1);
    assert.throws(() => inSlice(scene, {from: slice.to, to: slice.from}), /ordered/);
});
test('whole-book slice crosses volume boundaries and counts an evidence-linked lead persona', () => {
    const whole = {from: 'zh 第1章 p1', to: 'zh b8 第99999章 p99999'};
    const cover = {...scene, beat: 'lr.fixture.cover', pov: 'mol.person.cover', evidence: [{locator: 'zh b2 第1章 p1'}]};
    assert.equal(inSlice(cover, whole), true);
    assert.equal(inSlice({...cover, evidence: [{locator: 'zh b9 第1章 p1'}]}, whole), false);
    const result = make({scenes: [{...scene, evidence: [{locator: 'zh 第2章 p1'}]}, cover], slice: whole, leadPovIds: ['mol.person.cover']});
    assert.equal(result.report.leadScenes, 2);
    assert.match(result.crosswalk.mapping['mol.person.cover'], /^new:mol\.person\./);
});
test('lead persona discovery uses reveal evidence and leaves unreviewed candidates for private review', () => {
    const extras = [{extra: 'people', id: 'mol.person.cover', locator: 'zh b2 第1章 p1', reveals: [{same_as: 'mol.person.lead', locator: 'zh b2 第1章 p2'}]}];
    const found = discoverLeadPersonas(extras, {leadId: 'mol.person.lead'});
    assert.deepEqual(found.leadPovIds, ['mol.person.cover', 'mol.person.lead']);
    assert.deepEqual(found.unresolved, [{id: 'mol.person.cover', locator: 'zh b2 第1章 p2'}]);
    assert.deepEqual(discoverLeadPersonas(extras, {leadId: 'mol.person.lead', review: {redirect: {'mol.person.cover': 'mol.person.lead'}}}).unresolved, []);
});
test('registry kind remains authoritative when selected scene rows disagree', () => {
    const result = make({scenes: [{...scene, touched: [{id: 'mol.person.iris', kind: 'place', status: 'present'}]}]});
    assert.equal(result.crosswalk.entities['mol.person.iris'].kind, 'person');
});
test('fitness requires resolvable relations, actual time, outcome, and explicit known costs', () => {
    const loc = 'en b1 c2 p5';
    const extras = [{extra: 'people', locator: loc,
        relations: [{with: 'R'}, {with: 'missing'}],
        routine: [{place: 'upstairs study', days: 'weekday mornings'}, {place: 'upstairs study', days: 'weekdays'}, {place: 'unknown room', time: 'noon'}],
        reacts: [{to: 'asks for a lesson'}, {to: 'the blue thing'}, {to: ''}]},
    ...['stated', 'stated-free', 'not-mentioned', undefined].map(costStated => ({extra: 'rules', locator: loc, costStated}))];
    const {report: r} = make({extras});
    assert.deepEqual(r.sliceFitness.relations, {usable: 1, total: 2, rate: .5});
    assert.equal(r.sliceFitness.routines.usable, 1);
    assert.equal(r.sliceFitness.routines.total, 3);
    assert.equal(r.sliceFitness.routines.proposedPlaceAndTime, 1);
    assert.equal(r.sliceFitness.reacts.usable, 1);
    assert.equal(r.sliceFitness.rules.usable, 2);
    assert.equal(r.sliceFitness.rules.costStatedField, 3);
    assert.equal(r.sliceFitness.scenes.usable, 1);
    assert.equal(make({scenes: [{...scene, outcomes: []}]}).report.sliceFitness.scenes.usable, 0);
});
test('per-item locators exclude future rows even inside an early people record', () => {
    const r = make({extras: [{extra: 'people_other', locator: 'en b1 c1 p1', relations: [{with: 'R', locator: 'en b1 c5 p1'}]}]}).report;
    assert.equal(r.sliceFitness.relations.total, 0);
    assert.equal(r.allFitness.relations.total, 1);
});
test('no numerator for missing outcome, no false zero-data rate', () => {
    const r = make({scenes: [{...scene, outcomes: [{fact: 'fixture', value: null}]}]}).report;
    assert.equal(r.sliceFitness.scenes.usable, 0);
    assert.equal(r.sliceFitness.rules.rate, null);
});
test('hasTime rejects recurrence and unknown precision, accepts midnight zero', () => {
    for (const s of [{days: 'weekdays'}, {time: 'unknown'}, {timeOfDay: {precision: 'day'}}, {window: {anchor: 'fixture'}}]) assert.equal(hasTime(s), false);
    for (const s of [{time: 0}, {timeOfDay: {value: 'night'}}, {days: 'daily at 8:30'}, {window: {from: 'morning', to: 'noon'}}]) assert.equal(hasTime(s), true);
});
test('classifier is reusable, deterministic and has no generic other fallback', () => {
    for (const [text, cls] of [['Threatens the clerk', 'fight'], ['Pays the fee', 'trade'], ['a wounded friend', 'care'], ['Reading a primer', 'study'], ['practicing a drill', 'practice'], ['Arriving home', 'travel'], ['asking a question', 'socialize']]) assert.equal(classifyAction(text), cls);
    assert.equal(classifyAction('THE BLUE THING'), null);
    assert.equal(classifyAction(null), null);
});
test('explicit mappings validate runtime target, proposal syntax and skip reason', () => {
    assert.throws(() => make({review: {entities: {'mol.person.iris': 'book.mol.absent'}}}), /Unknown runtime/);
    assert.throws(() => make({review: {entities: {'mol.person.iris': 'new:bad'}}}), /Invalid new/);
    assert.throws(() => make({review: {entities: {'mol.person.iris': 'skip:'}}}), /Empty skip/);
    assert.equal(make({review: {entities: {'mol.person.iris': 'skip:outside-branch'}}}).crosswalk.counts.skipped, 1);
});
test('runtime catalogue uses named pack people; original LOTM roles do not stand in for canon', () => {
    assert.ok(runtimeCatalogue('mol').people.some(p => p.id === 'book.mol.zorian'));
    assert.equal(runtimeCatalogue('lotm').people.length, 0);
    assert.throws(() => runtimeCatalogue('unknown'), /world/);
});
test('CLI refuses nonprivate output before opening index rows', () => {
    assert.throws(() => run(['tests']), /private directory/);
});

test('organization references used as routine places do not collapse the institution into a location', () => {
    const {crosswalk: c, report: r} = make({extras: [{extra: 'people', locator: 'en b1 c2 p1', routine: [{place: 'mol.organization.school', time: 'noon'}]}]});
    assert.equal(c.entities['mol.organization.school'].kind, 'organization');
    assert.notEqual(c.places['mol.organization.school'], 'mol.organization.school');
    assert.equal(r.sliceFitness.routines.usable, 0);
    assert.equal(r.sliceFitness.routines.proposedPlaceAndTime, 1);
});

test('free-text place entries expose a valid proposed place id, not a text self-reference', () => {
    const c = make({scenes: [{...scene, place: 'unmapped room'}]}).crosswalk;
    assert.match(c.places['unmapped room'], /^mol\.place\.cast-/);
    assert.equal(c.mapping['unmapped room'], 'new:' + c.places['unmapped room']);
});

test('classifier does not mistake a train, forgetting, or a lieutenant for those actions', () => {
    assert.equal(classifyAction('the train station'), null);
    assert.equal(classifyAction('forgetting a name'), null);
    assert.equal(classifyAction('a lieutenant nearby'), null);
    assert.equal(classifyAction('forging a tool'), 'craft');
});

test('classifier recognizes concrete reaction cues while leaving scenery unclassified', () => {
    for (const [text, cls] of [
        ['strangling the captain', 'fight'], ['charging into a crowd', 'fight'],
        ['headaches from the link', 'care'], ['apologizing after the argument', 'care'],
        ['decoding the notebook', 'study'], ['a warning about the assignment', 'study'],
        ['the interview and case', 'research'], ['moving to a new flat', 'travel'],
        ['overtime after layoffs', 'work'], ['a family comparison', 'socialize'],
        ['the train station', null], ['a lieutenant nearby', null],
    ]) assert.equal(classifyAction(text), cls, text);
});
