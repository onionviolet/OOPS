import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry} from '../src/expedition_content.js';
import {enrollSimulation} from '../src/simulation.js';
import {previewParadiseCommand, commitParadiseCommand} from '../src/book_world_paradise_host.js';

// GTR11: the chart command is the entry that enrols living-world services, so its
// admission facts must be read from the enrolled copy, not the pre-enrolment state.
const CHART = {type: 'book_paradise', id: 'book.paradise.chart'};
const fresh = () => {
    const state = initializeExpedition(createExpansionState(17));
    state.actors.player.facts['village.discovered'] = true; state.campaign.facts.anchor = true;
    return state;
};
const context = (elderMet = true, location = 'Village') => ({actorId: 'player', worldId: 'base.frontier', nativeAlive: true,
    external: {money: 20}, gameplay: {player: {inventory: {}, skills: {}, reputation: {Village: 0}}},
    facts: {location, 'village.elderMet': elderMet, calendarMinute: 1440 * 360000 + 480}});
const commit = (state, ctx, command = CHART) => commitParadiseCommand(state, expeditionRegistry, command, ctx);

test('chart commits on a fresh state before any living-world enrolment, matching its eligible preview', () => {
    const state = fresh();
    assert.equal(state.simulation == null, true);
    const preview = previewParadiseCommand(state, expeditionRegistry, CHART.id, context());
    assert.equal(preview.eligible, true);
    const plan = commit(state, context());
    assert.ok(plan.state.simulation, 'committing the chart enrols the living-world services');
    assert.equal(plan.state.simulation.people.player.location, 'Village');
    assert.equal(state.simulation == null, true, 'the live state is only changed when the caller persists the plan');
});

test('the chart reaches the same plan whether or not services were enrolled by another route first', () => {
    const viaChart = commit(fresh(), context());
    const prior = fresh(), enrolled = enrollSimulation(prior, expeditionRegistry, context());
    const afterOther = commit(enrolled.state, context());
    assert.ok(viaChart.state.simulation && afterOther.state.simulation);
    assert.deepEqual(Object.keys(viaChart.state.simulation.people).sort(), Object.keys(afterOther.state.simulation.people).sort());
});

test('a refused chart command leaves the state, sequence and enrolment untouched', () => {
    for (const [label, ctx] of [['elder not met', context(false)], ['away from the Village', context(true, 'Forest')],
        ['native body not alive', {...context(), nativeAlive: false}]]) {
        const state = fresh(), before = JSON.stringify(state);
        assert.throws(() => commit(state, ctx), undefined, label);
        assert.equal(JSON.stringify(state), before, `${label}: no mutation on refusal`);
        assert.equal(state.simulation == null, true, `${label}: no enrolment on refusal`);
        assert.equal(state.sequence, 0);
    }
});

test('commands that are not the chart still need the campaign and refuse without it', () => {
    const state = fresh(), before = JSON.stringify(state);
    assert.throws(() => commit(state, context(), {type: 'book_paradise', id: 'book.paradise.enroll'}));
    assert.equal(JSON.stringify(state), before);
});
