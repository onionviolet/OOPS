import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {createFieldFixture, fieldCommand, fieldAdvance, fieldContext, fieldReload} from '../scripts/field_fixtures.mjs';
import {observerView} from '../src/observer_view.js';
import {validateFigureSpec, figureText} from '../src/ui/figure.js';
import {LEVER_PRACTICE_BRACE as brace} from '../src/lever_practice_supply.js';
import {RESEARCH_PROJECTS} from '../src/research_content.js';
import {researchView, researchLadderSpec, researchMapSpec, projectLines, findingLine} from '../src/research_view.js';

const view = p => researchView(observerView(p.state), p.state);
const lever = p => view(p).projects.find(x => x.id === 'frontier.lever');
const ask = (p, id) => fieldCommand(p, `field.lp1.${id}`, 'Village', {targetId: 'oldCraftsman'});
const ready = () => fieldAdvance(ask(ask(createFieldFixture(), 'demonstrate'), 'hand'), 6);

test('every study row names a real command, power and duration (rows cannot drift from the lesson)', () => {
    for (const row of RESEARCH_PROJECTS) {
        for (const step of row.steps) {
            const d = registry.simulation.commands.get(step.command);
            assert.ok(d, `${row.id}: unknown command ${step.command}`);
            if (d.duration) assert.equal(step.minutes, d.duration, `${step.command} minutes`);
            for (const id of step.after) assert.ok(row.steps.some(s => s.id === id), `${step.id} after ${id}`);
        }
        assert.ok(registry.simulation.powers.get(row.opens.power), `${row.id}: unknown power`);
        assert.ok(registry.simulation.commands.get(row.opens.command), `${row.id}: unknown opens command`);
        assert.equal(row.levels[0].needs.length, 0);
    }
});

test('a fresh life sees the lesson as something it could study, with nothing done and the whole path ahead', () => {
    const p = lever(createFieldFixture());
    assert.equal(p.status, 'available');
    assert.equal(p.level.label, 'Curious');
    assert.equal(p.findings.length, 0);
    assert.equal(p.opens.state, 'closed');
    assert.equal(p.timeLeft.minutes, 9);
    assert.match(p.timeLeft.text, /9 min/);
    assert.equal(p.steps.find(s => s.id === 'explain').status, 'locked');
    assert.match(p.steps.find(s => s.id === 'explain').blocker, /Return both records/);
    assert.equal(p.nextStep, 'hand');
});

test('evidence in either order reaches Checked; partial findings keep their words and cause', () => {
    let p = ask(createFieldFixture(), 'demonstrate');
    let v = lever(p);
    assert.equal(v.level.id, 'seen');
    assert.equal(v.findings.length, 1);
    assert.equal(v.findings[0].stage, 'seen');
    assert.equal(v.findings[0].provenance, 'You were shown');
    assert.equal(v.steps.find(s => s.id === 'return').status, 'locked');
    p = fieldAdvance(ask(p, 'hand'), 6);
    p = ask(p, 'return');
    v = lever(p);
    assert.equal(v.level.id, 'checked');
    assert.equal(v.steps.find(s => s.id === 'hand').status, 'done');
    assert.equal(v.steps.find(s => s.id === 'explain').status, 'ready');
    assert.equal(v.next.label, 'Explained');
    assert.deepEqual(v.next.needs, ['Explain the pivot rule']);
});

test('practice shows time left while it runs, then the finished study opens the lever work', () => {
    let p = ask(ask(ready(), 'return'), 'explain');
    p.gameplay.player.inventory[brace] = 1;
    p = ask(p, 'practice');
    let v = lever(p);
    assert.equal(v.status, 'doing');
    const step = v.steps.find(s => s.id === 'practice');
    assert.equal(step.status, 'doing');
    assert.equal(step.left, 3);
    assert.match(v.timeLeft.text, /3 min/);
    p = fieldAdvance(p, 2);
    assert.equal(lever(p).steps.find(s => s.id === 'practice').left, 1);
    p = fieldAdvance(p, 1);
    v = lever(p);
    assert.equal(v.status, 'done');
    assert.equal(v.level.id, 'practised');
    assert.equal(v.opens.state, 'open');
    assert.equal(v.timeLeft.text, 'Finished');
    assert.equal(v.understanding.done, v.understanding.total);
    assert.equal(v.usability.done, 1);
    assert.ok(v.findings.some(f => f.stage === 'understood' && f.provenance === 'You were taught'));
    // The consumer is real: the opened power makes the repeatable command previewable.
    assert.ok(previewSimulationCommand(p.state, registry, 'field.lp1.lever_work', fieldContext(p)));
});

test('the view survives save and reload unchanged and is a pure read of state', () => {
    let p = ask(ready(), 'return');
    const before = JSON.stringify(p.state);
    const a = view(p);
    assert.equal(JSON.stringify(p.state), before);
    const b = view(fieldReload(p));
    assert.deepEqual(a.projects.map(x => [x.id, x.level.id, x.status]), b.projects.map(x => [x.id, x.level.id, x.status]));
});

test('sealed situation truth and other seats\' records never reach the view', () => {
    const p = ask(createFieldFixture(), 'demonstrate');
    const text = JSON.stringify(view(p));
    assert.doesNotMatch(text, /ordinaryTimber|privateTruth/);
    const outside = structuredClone(p.state);
    outside.actors.player.worldId = 'book.other';
    const v = researchView(observerView(outside), outside);
    assert.equal(v.projects.length, 0);
    assert.match(v.empty, /Nothing here can be studied yet/);
});

test('figures validate and share their facts with the text form (UR37)', () => {
    const p = lever(ready());
    for (const spec of [researchLadderSpec(p), researchMapSpec(p)]) {
        validateFigureSpec(spec);
        assert.match(figureText(spec), /Curious|Work a wedged log/);
    }
    const map = researchMapSpec(p);
    assert.equal(map.nodes.length, p.steps.length + 1);
    assert.ok(map.edges.some(e => e.kind === 'opens'));
    assert.ok(projectLines(p).length >= 8);
    assert.match(findingLine({stageLabel: 'Seen', text: 't', provenance: 'You saw it', when: 'today'}), /Seen: t/);
});
