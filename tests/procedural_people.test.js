import test from 'node:test';
import assert from 'node:assert/strict';
import {readVillageObtainability} from '../scripts/village_supply_tables.mjs';
import {
    advanceGeneratedPeople, createGeneratedPeople, generatedPeopleView,
    interactGeneratedPerson, validateGeneratedPeople,
} from '../src/generated_people.js';
import {wantNeeds} from '../src/quest_needs.js';
import {createStreams} from '../src/seeded_streams.js';
import {ensureWorldHistory, villageHistoryContext} from '../src/world_history_consumers.js';

const enrollment = 1000;
const index = readVillageObtainability();
const frontier = historySeed => {
    const state = {clock: 0, streams: createStreams(historySeed)};
    return {state, history: ensureWorldHistory(state)};
};
// Hold the people stream fixed when changing just the history input.
const enroll = history => createGeneratedPeople(42, enrollment, [], {streams: createStreams(42)}, {
    revision: 2, index, context: {history},
});
const roundTrip = value => JSON.parse(JSON.stringify(value));

test('stored Frontier wars add attributable travelers with repeatable enrollment', () => {
    const {state, history} = frontier(1);
    const context = villageHistoryContext(state);
    const enrolled = enroll(context);

    assert.equal(history.wars.length, 2);
    assert.equal(enrolled.people.length, 5);
    assert.deepEqual(enrolled, enroll(villageHistoryContext(frontier(1).state)));
    assert.deepEqual(enrolled, enroll(villageHistoryContext(roundTrip(state))));
    assert.deepEqual(validateGeneratedPeople(roundTrip(enrolled)), enrolled);

    const changed = frontier(5);
    const other = enroll(villageHistoryContext(changed.state));
    assert.equal(changed.history.wars.length, 1);
    assert.equal(other.people.length, 4);
    for (const [population, wars] of [[enrolled, history.wars], [other, changed.history.wars]]) {
        assert.deepEqual(population.people.slice(3).map(p => p.origin), wars.map(war => ({
            faction: war.defender, kind: 'refugee', war: war.id,
        })));
    }
    const first = enrolled.people[3];
    const second = other.people[3];
    assert.notEqual(first.origin.faction, second.origin.faction);
    assert.equal(first.name, second.name);
    assert.deepEqual(first.traits, second.traits);
    assert.deepEqual(first.goal, second.goal);
});

test('a war-caused traveler supplies a live want after meeting and discloses traits through talk', () => {
    const {state} = frontier(1);
    const enrolled = enroll(villageHistoryContext(state));
    const refugee = enrolled.people[3];
    const viewOf = people => generatedPeopleView(people).find(p => p.id === refugee.id);
    const wantsOf = people => wantNeeds(people.people).filter(want => want.subject === refugee.id);

    assert.equal(viewOf(enrolled), undefined);
    const arrived = advanceGeneratedPeople(validateGeneratedPeople(roundTrip(enrolled)), refugee.arrivedAt);
    const unmet = viewOf(arrived);
    assert.equal(unmet.name, 'Unmet traveler');
    assert.deepEqual(unmet.traits, []);
    assert.equal(unmet.undiscovered, null);
    assert.equal(unmet.goal, null);
    assert.equal(unmet.need, null);
    assert.equal(Object.hasOwn(unmet, 'origin'), false);
    assert.deepEqual(wantsOf(arrived), []);

    const met = interactGeneratedPerson(arrived, refugee.id, 'meet').state;
    assert.deepEqual(viewOf(met).origin, refugee.origin);
    assert.deepEqual(viewOf(met).traits, []);
    const [want] = wantsOf(met);
    assert.deepEqual(wantsOf(met).map(row => row.route), [{
        verb: 'story_request', personId: refugee.id, item: refugee.goal.item,
    }]);
    assert.equal(want.kind, 'want');
    const talked = interactGeneratedPerson(met, refugee.id, 'talk').state;
    assert.deepEqual(viewOf(talked).traits, refugee.traits.slice(0, 1));
    assert.equal(Object.hasOwn(viewOf(talked), 'possessions'), false);

    const helped = interactGeneratedPerson(talked, refugee.id, 'help', {
        suppliedItem: refugee.goal.item, suppliedQuantity: refugee.goal.quantity,
    });
    assert.equal(helped.reward, refugee.goal.reward);
    assert.deepEqual(wantsOf(helped.state), []);
});

test('peaceful and unknown histories add no refugees, and a legacy traveler has no origin to disclose', () => {
    const peaceful = frontier(3);
    assert.deepEqual(peaceful.history.wars, []);
    const wayfarers = enroll(villageHistoryContext(peaceful.state)).people;
    assert.equal(wayfarers.length, 3);
    assert.ok(wayfarers.every(p => p.origin.kind === 'wayfarer' && p.origin.war === null));

    const unknown = villageHistoryContext(frontier(1).state, 'unknown.world');
    assert.equal(unknown, null);
    const withoutHistory = enroll(unknown);
    assert.equal(withoutHistory.people.length, 3);
    assert.ok(withoutHistory.people.every(p => !Object.hasOwn(p, 'origin')));

    const legacy = validateGeneratedPeople(roundTrip(createGeneratedPeople(42, enrollment)));
    const id = legacy.people[0].id;
    assert.equal(legacy.generationRevision, undefined);
    const unmet = generatedPeopleView(legacy).find(p => p.id === id);
    assert.deepEqual(unmet.traits, []);
    assert.equal(Object.hasOwn(unmet, 'origin'), false);
    const met = interactGeneratedPerson(legacy, id, 'meet').state;
    assert.equal(Object.hasOwn(generatedPeopleView(met).find(p => p.id === id), 'origin'), false);
});
