import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {ssRankPath, SS_KNOWN_RUNGS} from '../src/ascension_paths_ss.js';
import {pathView} from '../src/ascension_paths.js';
import {structuredLadderViews, validateLadderPresentation} from '../src/structured_ladder_view.js';
import {definePath} from '../src/ascension_paths.js';
import {ladderFigureSpec} from '../src/ability_ladder_figure.js';
import {validateFigureSpec} from '../src/ui/figure.js';
import {shadowSlaveTrial as raw} from '../src/world_packs/book_shadow_slave_trial.js';
import {createExpansionState, createContentRegistry, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign, structuredCampaignView} from '../src/structured_pack_runtime.js';
import {validateStructuredEnvelope, requireStructuredContent} from '../src/structured_pack_state.js';
import {commitSimulationCommand, cancelSimulationJob, advanceSimulationBoundary, previewSimulationCommand} from '../src/simulation.js';
import {projectStructuredEquipment} from '../src/structured_equipment_runtime.js';
import {readWornEquipment} from '../src/worn_equipment_comparison.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';
const P = raw.id, id = n => `${P}.${n}`, key = n => JSON.stringify({id: id(n)});
const hash = o => 'sha256:' + createHash('sha256').update(JSON.stringify(o)).digest('hex');
function setup() {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash: hash(raw), starts: raw.starts.map(b => ({...b, snapshotHash: hash(b)}))};
    const state = createExpansionState(712);
    const context = {registry, actorId: 'player', worldId: 'base.frontier', external: {money: 0}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}},
        vitals: {player: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}}, equipment: {player: {}},
        nativeAlive: true, nativeReady: true, nativeBody: {id: 'native.player.body', ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult'}, facts: {location: 'Village'}, busy: false};
    const selection = planStructuredSelection(state, d, context);
    const start = beginStructuredCampaign(selection.plan.state, d, context, null, selection.selection);
    let p = {...start.plan, equipment: {player: {}}};
    const ctx = () => ({...context, worldId: d.world.id, nativeBody: p.state.simulation.people.player.body, facts: {location: p.state.simulation.people.player.location},
        external: p.external, gameplay: p.gameplay, vitals: p.vitals, equipment: p.equipment,
        structuredNative: {bound: true, worldId: d.world.id, bodyId: p.state.simulation.people.player.body.id, locationIds: d.locations.map(l => l.id)}});
    const api = {registry, d, record: start.record, get p() {return p;}, ctx,
        start(n) {p = commitSimulationCommand(p.state, registry, {id: id(n)}, {...ctx(),targetId:d.simulation.commands.find(c=>c.id===id(n))?.targetId}); return p;},
        step(n = 5) {const out = structuredClone(p); out.state.clock += n; advanceSimulationBoundary(out, registry, {player: ctx()}); p = out; return p;},
        cancel() {p = cancelSimulationJob(p.state, registry, p.state.simulation.jobs[0].id, ctx()); return p;},
        quote(n) {return previewSimulationCommand(p.state, registry, id(n), {...ctx(),targetId:d.simulation.commands.find(c=>c.id===id(n))?.targetId});},
        envelope() {const save = {character: {money: 0, equipment: {}}, expansion: p.state, content_packs: {schema: 1, packs: {}, structured: start.record},
            'current location': id('hall'), inventories: {person: {main_character: {}}}, levels: {person: {main_character: {}}}};
            writeGameplayToEnvelope(save, p.gameplay, {player: {category: 'person', id: 'main_character'}}); return save;}
    };
    return api;
}

const facts = f => f.p.state.actors.player.facts, hp = f => f.p.vitals.player.health;
const run = (f, n, mins) => {f.start(n); f.step(mins);};

test('second world ladder works on the shared seam with no LOTM code', () => {
    for (const file of ['ascension_paths_ss.js', 'structured_ladder_view.js']) assert.doesNotMatch([...readFileSync(new URL('../src/' + file, import.meta.url), 'utf8').matchAll(/from '([^']+)'/g)].map(m => m[1]).join(' '), /lotm/i);
    const v = pathView(ssRankPath, 1, {}, {known: SS_KNOWN_RUNGS});
    assert.deepEqual(v.ladder.map(r => r.label), ['Unwoken', 'Woken', 'Risen', 'Crowned', '???', '???', '???']);
    assert.equal(v.next, 'Risen'); assert.equal(v.crossings[0].irreversible, true); assert.equal(v.ready, false);
    assert.equal(pathView(ssRankPath, 1, {secondTrial: true}).ready, true);
    validateFigureSpec(ladderFigureSpec(v));
});

test('trial: rushed crossing costs health and injury, settling promotes the ladder, treatment gates the next attempt', () => {
    const f = setup(); validateStructuredEnvelope(f.envelope());
    assert.equal(structuredLadderViews(f.d, facts(f))[0].stage, 'Woken');
    assert.equal(f.quote('enter').eligible, false); assert.equal(f.quote('shallows').eligible, false);
    run(f, 'prepare', 5); assert.equal(f.p.gameplay.player.inventory[key('supplies')], 2);
    run(f, 'enter', 10); assert.equal(f.quote('steady').eligible, true);
    const before = hp(f); run(f, 'rushed', 5);
    assert.equal(before - hp(f), 25); assert.equal(facts(f)[id('injury')], 1);
    assert.equal(structuredLadderViews(f.d, facts(f))[0].stage, 'Woken', 'rank holds until the trial is settled');
    run(f, 'settle', 5);
    const view = structuredLadderViews(f.d, facts(f))[0];
    assert.equal(view.stage, 'Risen'); assert.equal(f.p.gameplay.player.inventory[key('fragment')], 1);
    assert.equal(f.quote('prepare').eligible, false, 'injury and rank block another attempt');
    assert.equal(f.quote('shallows').eligible, true);
    run(f, 'treat', 5); assert.equal(facts(f)[id('injury')], 0); assert.equal(f.p.gameplay.player.inventory[key('salve')], undefined);
    validateStructuredEnvelope(f.envelope());
});

test('a character can hold a second ladder beside the rank ladder, one figure per path with its own ids', () => {
    const second = definePath({id: 'test.track', world: 'book.ss', label: 'Method track', shape: 'ladder', stages: [
        {id: 'a', label: 'Learning', crossings: [], grants: []}, {id: 'b', label: 'Practiced', crossings: [{id: 'p', type: 'quota', label: 'Practice', fact: 'minutes', need: 10}], grants: []}]});
    const d = structuredClone(raw); d.presentation.ladders.push({id: 'track', path: second, positionKey: 'x.track', facts: {minutes: 'x.minutes'}});
    validateLadderPresentation(d.presentation.ladders);
    const views = structuredLadderViews(d, {[id('rank')]: 2, 'x.track': 0, 'x.minutes': 4});
    assert.deepEqual(views.map(v => [v.id, v.stage]), [['rank', 'Risen'], ['track', 'Learning']]);
    assert.notEqual(views[0].spec.id, views[1].spec.id);
    assert.throws(() => validateLadderPresentation([d.presentation.ladders[0], d.presentation.ladders[0]]));
});

test('retreat brings you home with no promotion; steady route leaves no injury', () => {
    const f = setup(); run(f, 'prepare', 5); run(f, 'enter', 10); run(f, 'retreat', 5);
    assert.equal(structuredLadderViews(f.d, facts(f))[0].stage, 'Woken'); assert.equal(facts(f)[id('phase')], 4);
    run(f, 'prepare', 5); run(f, 'enter', 10); run(f, 'steady', 12); assert.equal(facts(f)[id('injury')], 0);
    run(f, 'settle', 5); assert.equal(structuredLadderViews(f.d, facts(f))[0].stage, 'Risen');
});
