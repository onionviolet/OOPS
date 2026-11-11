// FRC news, Tingen caller (proposal, AD56): Dunn's memory of a filed weekly application reaches Old Neil along the pack's staff line,
// and what reached him opens one question. Fixture mirrors the shipped pack where it matters: Dunn and Neil are at their
// real pack ids (Neil is a recurring person, as in the pack), and the relation line is the pack's own shape ({withId, kind}).
import test from 'node:test';
import assert from 'node:assert/strict';

const evidence = {label: 'I', locator: 'fixture p1'};
const DUNN = 'lotm.person.cast-618f4df49af02c7da45e', NEIL = 'lotm.person.cast-6aaa65265bb46e581535';
const person = (id, name, relations = [], tier = 'principal') => ({id, indexId: id, name, tier, relations, knows: [], wants: [], ...evidence});
const people = [person('fixture.person.lead', 'Lead'), person(DUNN, 'Dunn Smith', [{withId: 'fixture.person.lead', kind: 'investigator', ...evidence}]),
    person(NEIL, 'Old Neil', [{withId: DUNN, kind: 'staff member', ...evidence}, {withId: 'fixture.person.lead', kind: 'archive colleague', ...evidence}], 'recurring')];
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
const {tieExpenseFiled} = await import('../src/book_world_lotm_colleagues.js');
const {tingenNewsTies, newsDay, TINGEN_NEWS_DRIFT, castAcquainted} = await import('../src/book_world_lotm_news.js');
const {newsPorts} = await import('../src/news_reach.js');
const {memoryForPlan} = await import('../src/person_memory_effects.js');
const {readMemories, freshMemory} = await import('../src/person_memory.js');
const {payload} = await import('../src/person_episode.js');
const {tieOfferView, tieOfferEffects} = await import('../src/person_ties.js');
const {reputationView} = await import('../src/reputation_view.js');
const {castKnown} = await import('../src/book_world_lotm_cast_host.js');
const {domainRegistry} = await import('../src/domain_registry.js');
const {bare, hostOver, registry} = await import('./lotm_helpers.js');

const OFFER = 'book.lotm.tie.neil_costs';
function life({together = true, leadAt = 'fixture.place.office'} = {}) {
    domainRegistry.load({});
    const o = hostOver(bare()); o.host.enroll('be', {independent: true});
    const s = o.box.p.state, known = s.simulation.knowledge.player ||= {};
    for(const id of [DUNN, NEIL]) known[`book.lotm.cast.known.${id}`] = {stage: 'understood', value: id, at: 0, cause: 'fixture'};
    s.simulation.people[DUNN].location = 'fixture.place.office';
    s.simulation.people[NEIL].location = together ? 'fixture.place.office' : 'fixture.place.home';
    s.simulation.people.player.location = leadAt;
    return o;
}
// The real persistence path in miniature: the filing's plan, then memoryForPlan with the news ports (expansion_persistence.js).
function fileAndPersist(o, day, memory = freshMemory()) {
    const plan = {state: o.box.p.state};
    assert.equal(tieExpenseFiled(plan, registry), true);
    return memoryForPlan({memory, plan, day, news: newsPorts});
}
const publish = memory => domainRegistry.command('memory', 'publish')(memory);
const neil = s => tieOfferView(s).find(o => o.id === OFFER);

test('the pack\'s relation lines are the channel; the lead\'s own line and unplaced people are not', () => {
    const s = life().box.p.state;
    const ties = tingenNewsTies(s);
    assert.deepEqual(ties.filter(t => t.other === DUNN), [{holder: NEIL, other: DUNN, kind: 'staff member'}], 'the line is read as written; newsPorts makes it two-way');
    assert.ok(!ties.some(t => [t.holder, t.other].includes('fixture.person.lead')));
    s.simulation.people[NEIL].location = 'Whereabouts unplaced';
    assert.ok(!tingenNewsTies(s).some(t => t.holder === NEIL || t.other === NEIL));
    assert.equal(s.simulation.relationships?.[DUNN]?.[NEIL], undefined, 'nothing written to the edge store');
});

test('Dunn saw the filing; Neil, at the office with him, hears it from him as an account, labelled heard', () => {
    const o = life(), day = newsDay(), out = fileAndPersist(o, day);
    const [own] = readMemories(out.memory, DUNN, day), [heard] = readMemories(out.memory, NEIL, day);
    assert.equal(own.source, 'saw'); assert.equal(payload(own).topic, 'filed_on_time');
    assert.deepEqual(heard.source, {teller: DUNN});
    assert.ok(['filed_on_time', TINGEN_NEWS_DRIFT.filed_on_time.to].includes(payload(heard).topic), 'the account or its bent version');
    assert.equal(heard.certainty, Math.round((100 - 15) * 90 / 100), 'Tingen telling numbers');
});

test('apart, Neil hears nothing and his question stays shut with a reason', () => {
    const o = life({together: false}), day = newsDay(), out = fileAndPersist(o, day);
    assert.equal(readMemories(out.memory, NEIL, day).length, 0);
    publish(out.memory);
    const row = neil(o.box.p.state);
    assert.equal(row.eligible, false); assert.match(row.reasons[0], /nobody he trusts has spoken for you/);
    assert.throws(() => tieOfferEffects(o.box.p.state, OFFER), /nobody he trusts/);
});

test('good word from the captain opens Neil\'s question and shows as what he has heard; a bent account keeps it shut', () => {
    const o = life(), s = o.box.p.state, day = newsDay(), out = fileAndPersist(o, day);
    publish(out.memory);
    const [heard] = readMemories(out.memory, NEIL, day), bent = payload(heard).topic !== 'filed_on_time';
    const rows = reputationView(s, {known: id => castKnown(s, id)}).filter(r => r.heard);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].audienceId, NEIL); assert.equal(rows[0].owner, 'memory');
    assert.match(rows[0].line, bent ? /^from Dunn Smith, that you are angling/ : /^from Dunn Smith, that you hand in your weekly expense application on time\.$/);
    assert.equal(neil(s).eligible, !bent);
    if(!bent) assert.equal(tieOfferEffects(s, OFFER)[0].basis.attributedTo, NEIL);
    if(bent) assert.match(neil(s).reasons[0], /nobody he trusts/);
    // KNW6: away from Neil, the lead cannot read what he heard; the gate is his, so it still reads it.
    s.simulation.people.player.location = 'fixture.place.home';
    assert.equal(reputationView(s, {known: id => castKnown(s, id)}).filter(r => r.heard).length, 0);
    assert.equal(neil(s).eligible, !bent);
});

test('bent and plain accounts both occur across seeds: drift is live at its Tingen chance', () => {
    const topics = new Set();
    for(let seed = 1; seed <= 40 && topics.size < 2; seed++) {
        const o = life(); o.box.p.state.simulation.seed = seed;
        const day = newsDay(), out = fileAndPersist(o, day);
        topics.add(payload(readMemories(out.memory, NEIL, day)[0]).topic);
    }
    assert.deepEqual([...topics].sort(), ['currying_favour', 'filed_on_time']);
});

test('acquainted: someone who has told the lead something counts as met, even with no known-key (earned lives reach Neil this way)', () => {
    const s = life().box.p.state, known = s.simulation.knowledge.player;
    delete known[`book.lotm.cast.known.${NEIL}`];
    assert.equal(castKnown(s, NEIL), false); assert.equal(castAcquainted(s, NEIL), false);
    known['book.fixture.neil.room'] = {stage: 'seen', value: 'Neil showed you the archive room.', at: 0, cause: 'fixture', basis: {kind: 'observation', attributedTo: NEIL, situationId: 'fixture'}};
    assert.equal(castAcquainted(s, NEIL), true);
    assert.equal(castAcquainted(s, 'fixture.person.nobody'), false);
});
