// (fixture reused from recurring_colleagues.test.js)
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

const WEEK = 7 * 24 * 60, DAY = 1440;
const {addThought, moodOf, freshThoughts, validateThoughts, THOUGHT_LIMITS} = await import('../src/mood_thoughts.js');
const {readMood} = await import('../src/mood_thoughts_domain.js');
const {tieOfferView, tieOfferEffects, tieFacts, tieShownView} = await import('../src/person_ties.js');
const live = {box: null};
registerDutySet('mood_test', {defs: LOTM_DUTIES, state: () => live.box.p.state, active: st => st?.lotm?.entryProfile === 'book.lead.be@1', minute: st => st.clock});
function life() { domainRegistry.load({}); const o = hostOver(bare()); o.host.enroll('be', {independent: true}); live.box = o.box; return o; }
const advance = (o, minutes) => { const to = o.box.p.state.clock + minutes; for(let i = 0; i < 80 && o.box.p.state.clock < to; i++) { const at = o.box.p.state.clock; o.box.p = wait(o.box.p, to - at); domainRegistry.tick(o.box.p.state.clock - at); } };
const {applySimulationEffects} = await import('../src/simulation_effects.js');
const {LOTM_CAST_SITUATION} = await import('../src/book_world_lotm_cast_host.js');
const meet = s => applySimulationEffects({state: s}, [{type: 'knowledge', actor: 'player', key: `book.lotm.cast.met.${DUNN}`, stage: 'seen', value: 'You spoke with Dunn.', basis: {kind: 'observation', attributedTo: 'player', situationId: LOTM_CAST_SITUATION}}], {actorId: 'player'}, registry, 'test.meet');
const offer = s => tieOfferView(s).find(o => o.id === 'book.lotm.tie.dunn_funding');

test('the reader sums running thoughts, softens them at the end and drops them at expiry (MND5)', () => {
    let s = addThought(freshThoughts(), {holder: 'a', subject: 'b', source: 'x', magnitude: -8, minutes: 4 * DAY, line: 'insult'}, 100);
    s = addThought(s, {holder: 'a', subject: 'b', source: 'y', magnitude: 6, minutes: DAY, line: 'thanks'}, 100);
    assert.equal(moodOf(s, 'a', 100).total, -2);
    assert.equal(moodOf(s, 'a', 100 + 3 * DAY).total, Math.round(-8 * (DAY - 0) / DAY) + 0, 'only the insult is left, at the start of its fade');
    assert.ok(moodOf(s, 'a', 100 + 4 * DAY - 10).total > -1, 'it softens over its last quarter');
    assert.equal(moodOf(s, 'a', 100 + 4 * DAY).rows.length, 0, 'it is gone at expiry');
    assert.equal(moodOf(s, 'someone', 100).total, 0);
});
test('a keyed replay is a no-op and one cause about one person keeps only its newest few', () => {
    let s = freshThoughts();
    const add = (n, key) => { s = addThought(s, {holder: 'a', subject: 'b', source: 'x', magnitude: 3, minutes: DAY, line: 'n', key}, 10 + n); };
    add(0, 'k'); add(1, 'k');
    assert.equal(s.rows.length, 1);
    for(let n = 2; n < 8; n++) add(n, `k${n}`);
    assert.equal(s.rows.length, THOUGHT_LIMITS.stack);
    assert.throws(() => validateThoughts({schema: 1, rows: [{holder: 'a', subject: 'b', source: 'x', magnitude: 0, at: 1, until: 2, line: 'z'}]}));
});

test('filing on time leaves Dunn warm; a lapsed week leaves him sour and shuts the funding question until it passes', () => {
    const o = life(); meet(o.box.p.state);
    o.host.fileExpense(); advance(o, WEEK); o.host.fileExpense(); // regard 2, both on time
    let s = o.box.p.state;
    assert.equal(readMood(DUNN, s.clock).band, 'warm');
    assert.equal(offer(s).eligible, true, 'a warm Dunn takes the question');
    assert.match(tieShownView(s)[0].line, /good humour with you: you handed in the weekly application on time/);
    advance(o, 3 * WEEK); // two weeks close unfiled
    s = o.box.p.state;
    assert.equal(readMood(DUNN, s.clock).rows.length, 0, 'the warm thought has run out');
    o.host.fileExpense(); s = o.box.p.state;
    assert.equal(readMood(DUNN, s.clock).band, 'sour');
    assert.equal(offer(s).eligible, false);
    assert.match(offer(s).reasons.join(' '), /not taking questions about paperwork.*short with you/);
    assert.throws(() => tieOfferEffects(s, 'book.lotm.tie.dunn_funding'), /not taking questions/);
    assert.ok(tieFacts(s)['mood.dunn'] <= -5);
    // Saved and reloaded: the rows come back, the mood is recomputed, the gate agrees.
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({}))), rows = saved.moodThoughts.rows.length;
    assert.ok(rows >= 1); assert.equal(saved.moodThoughts.rows.every(r => 'until' in r) && !JSON.stringify(saved).includes('"band"'), true, 'thoughts are stored, a mood is not');
    domainRegistry.load(saved);
    assert.equal(readMood(DUNN, s.clock).band, 'sour');
    advance(o, 5 * DAY); s = o.box.p.state;
    assert.equal(offer(s).eligible, true, 'it clears by itself after five days');
});
test('an untouched life writes no mood key', () => { life(); assert.equal(domainRegistry.save({}).moodThoughts, undefined); });
