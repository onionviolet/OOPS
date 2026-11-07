// AT17 PROTOTYPE, second consumer (proposal under AD32, not an accepted rule): the pack's own Dunn Smith holds a durable note once the player first files
// the weekly expense application with him (docs/audits/RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07.md, "Second consumer"). The fixture mirrors the shipped
// pack where it matters: 1,502 people (the large-pack case), Dunn at his real pack id as a principal listed in householdActs.requiredPeople.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const evidence = {label: 'I', locator: 'fixture p1'};
const DUNN = 'lotm.person.cast-618f4df49af02c7da45e';
const person = (id, name, tier = 'principal', indexId = id) => ({id, indexId, name, tier, relations: [], knows: [], wants: [], ...evidence});
const people = [person('fixture.person.lead', 'Lead'), person(DUNN, 'Dunn Smith', 'principal', 'lotm.person.dunn-smith')];
for(let n = 0; n < 1500; n++) people.push(person(`fixture.person.role${n}`, `Role ${n}`, 'role'));
const place = id => ({id, indexId: id, name: id.split('.').pop(), openingHours: [], travel: {district: 'evernight', basis: 'fixture'}, ...evidence});
const fixture = {schema: 'lotm-cast/1', people, references: [], remoteWhereabouts: [], placeAliases: [], clockClaims: [], beats: [], anchors: [], schedule: [],
    places: [place('fixture.place.home'), place('fixture.place.office')],
    host: {profile: {id: 'lotm.early_tingen.canon_beside@1', key: 'beside', blurb: 'Fixture'}, situation: {label: 'Fixture'}},
    householdActs: {objects: [], acts: [], requiredPeople: [DUNN]},
    bindings: {days: [{scene: 'fixture.scene', day: 1, from: 0, to: 1440}], schedule: [], beats: []},
    leadLife: {actorId: 'fixture.person.lead', profile: {id: 'book.lead.be@1', key: 'be', label: 'Be a person', beyonderTrack: false, cash: 1, home: null, start: 'fixture.place.home', blurb: 'Begin at home.'},
        knownPlaces: ['fixture.place.home', 'fixture.place.office'], history: [], relations: [], intentions: [], untakenChoices: []}};
const savedFetch = globalThis.fetch;
globalThis.fetch = async path => ({ok: true, json: async () => String(path).endsWith('manifest.json') ? {schema: 1, supplements: ['lotm-cast/cast.json']} : structuredClone(fixture)});
const {whenCastLoaded} = await import('../src/book_world_lotm_cast_days.js');
await whenCastLoaded(); globalThis.fetch = savedFetch;
const {wakeCastPerson, castEnrollmentPeople} = await import('../src/book_world_lotm_cast_host.js');
const {DUNN_ID, EXPENSE_FILED_KEY, EXPENSE_FILED_LINE, noteExpenseFiled} = await import('../src/book_world_lotm_colleagues.js');
const {LOTM_DUTIES} = await import('../src/book_world_lotm_duties.js');
const {domainRegistry} = await import('../src/domain_registry.js');
const {registerDutySet} = await import('../src/duties_domain.js');
const {bare, hostOver, registry, wait} = await import('./lotm_helpers.js');
const {validateSimulationState} = await import('../src/simulation_contracts.js');
const {validateLotmState} = await import('../src/book_world_lotm_state.js');
const {loadExpansionState} = await import('../src/expansion_engine.js');

const WEEK = 7 * 24 * 60;
const live = {box: null};
// The real 'lotm' set reads the panel host's state; this test's host is its own, so it registers the same defs over its own box.
registerDutySet('colleague_test', {defs: LOTM_DUTIES, state: () => live.box.p.state, active: st => st?.lotm?.entryProfile === 'book.lead.be@1', minute: st => st.clock});
const bytes = s => JSON.stringify(s);
function life() { domainRegistry.load({}); const o = hostOver(bare()); o.host.enroll('be', {independent: true}); live.box = o.box; return o; }
// The native wait stops at cast boundaries, so step until the target minute.
const advance = (o, minutes) => { const to = o.box.p.state.clock + minutes; for(let i = 0; i < 50 && o.box.p.state.clock < to; i++) { const at = o.box.p.state.clock; o.box.p = wait(o.box.p, to - at); domainRegistry.tick(o.box.p.state.clock - at); } };
const note = s => s.simulation.knowledge?.[DUNN]?.[EXPENSE_FILED_KEY];
const valid = s => { validateLotmState(s); validateSimulationState(s.simulation, s, registry.simulation); };

test('the fixture is the shipped shape: a large pack where Dunn is a principal enrolled at the start', () => {
    assert.equal(DUNN_ID, DUNN);
    assert.equal(fixture.people.length, 1502);
    assert.ok(castEnrollmentPeople().some(p => p.id === DUNN));
    const s = life().box.p.state;
    assert.ok(s.simulation.people[DUNN] && s.actors[DUNN], 'Dunn has his body from the start');
    assert.equal(s.simulation.people['fixture.person.role7'], undefined, 'roles stay registry-only');
});

test('an untouched life is byte-identical: Dunn holds no note until the first filing', () => {
    const a = life().box.p.state, b = life().box.p.state;
    assert.equal(bytes(a), bytes(b));
    assert.equal(note(a), undefined);
    assert.ok(!bytes(a).includes(EXPENSE_FILED_KEY));
    assert.equal(domainRegistry.save({}).duties, undefined, 'the duties slice stays out of an untouched save');
});

test('the first filing writes Dunn\'s note; encode, import and reload validate', () => {
    const o = life();
    o.host.fileExpense();
    const s = o.box.p.state, row = note(s);
    assert.equal(row.value, EXPENSE_FILED_LINE); assert.equal(row.stage, 'seen');
    assert.equal(s.simulation.people[DUNN].life, 'alive');
    assert.ok(domainRegistry.save({}).duties.lastDone['lotm.expense_claim'] != null, 'the duty is attended');
    valid(s);
    const loaded = loadExpansionState(JSON.parse(bytes(s)), registry);
    assert.deepEqual(loaded.simulation.knowledge[DUNN], s.simulation.knowledge[DUNN]);
    assert.deepEqual(loaded.simulation.people[DUNN], s.simulation.people[DUNN]);
    valid(loaded);
    assert.equal(bytes(loadExpansionState(JSON.parse(bytes(loaded)), registry)), bytes(loaded), 'a second encode and import changes nothing');
});

test('no re-promotion: a second week\'s filing and a replayed note leave Dunn and his note alone', () => {
    const o = life();
    o.host.fileExpense();
    const first = structuredClone(o.box.p.state.simulation.people[DUNN]), row = structuredClone(note(o.box.p.state));
    assert.throws(() => o.host.fileExpense(), 'the same week cannot be filed twice');
    assert.deepEqual(note(o.box.p.state), row);
    advance(o, WEEK);
    assert.ok(o.box.p.state.clock >= WEEK, 'the next week has opened');
    o.host.fileExpense();
    assert.deepEqual(o.box.p.state.simulation.people[DUNN], first);
    assert.deepEqual(note(o.box.p.state), row, 'the note records the first filing');
    const replay = {state: structuredClone(o.box.p.state)};
    assert.equal(noteExpenseFiled(replay, registry), false);
    assert.equal(bytes(replay.state), bytes(o.box.p.state));
    valid(o.box.p.state);
});

test('a life where Dunn has no body yet wakes the pack\'s own Dunn, not a second one', () => {
    const o = life(), s = structuredClone(o.box.p.state);
    delete s.simulation.people[DUNN]; delete s.actors[DUNN]; delete s.simulation.owners[DUNN];
    const plan = {state: s};
    assert.equal(noteExpenseFiled(plan, registry), true);
    assert.equal(s.simulation.people[DUNN].definitionId, DUNN);
    assert.equal(s.simulation.people[DUNN].bornAt, s.lotm.initializedAt, 'aged like his enrolled neighbours');
    assert.ok(note(s));
    assert.equal(Object.keys(s.simulation.people).filter(id => s.simulation.people[id].definitionId === DUNN).length, 1);
    valid(s);
    assert.equal(wakeCastPerson(s, DUNN), false, 'waking twice creates nobody');
    assert.equal(wakeCastPerson(s, 'fixture.person.nobody'), false, 'an id outside the pack wakes nobody');
});

test('pack absent: a filed save still loads and validates, and the life is read-only', () => {
    const o = life(); o.host.fileExpense();
    const data = bytes(o.box.p).replaceAll('fixture.person.lead', 'lotm.person.cast-aaaaaaaaaaaaaaaaaaaa')
        .replaceAll('fixture.place.home', 'lotm.place.cast-cccccccccccccccccccc').replaceAll('fixture.place.office', 'lotm.place.cast-dddddddddddddddddddd');
    const script = `import assert from 'node:assert/strict';
 import fs from 'node:fs';globalThis.fetch=async()=>({ok:false});
 const {hostOver,registry}=await import('./tests/lotm_helpers.js');
 const {whenCastLoaded}=await import('./src/book_world_lotm_cast_days.js');await whenCastLoaded();
 const {restoreUnavailableCast}=await import('./src/book_world_lotm_cast_host.js');
 const {validateLotmState}=await import('./src/book_world_lotm_state.js');
 const {validateSimulationState}=await import('./src/simulation_contracts.js');
 const {loadExpansionState}=await import('./src/expansion_engine.js');
 const p=JSON.parse(fs.readFileSync(0,'utf8'));restoreUnavailableCast(p.state,registry);validateLotmState(p.state);
 const loaded=loadExpansionState(structuredClone(p.state),registry);validateSimulationState(loaded.simulation,loaded,registry.simulation);
 assert.ok(loaded.simulation.knowledge['${DUNN}']['${EXPENSE_FILED_KEY}']);
 assert.throws(()=>hostOver(p).host.fileExpense(),/private pack absent/);`;
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {input: data, encoding: 'utf8'});
    assert.equal(run.status, 0, run.stderr);
});
