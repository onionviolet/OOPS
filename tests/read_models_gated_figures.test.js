import test from 'node:test';
import assert from 'node:assert/strict';
import {benchWithRite} from '../src/read_models/rite_state_bridge.js';
import {withPursuitRange} from '../src/read_models/chase_range_bridge.js';
import {studyProjectFromLearn} from '../src/read_models/study_bridge.js';
import {placeHistorySpec} from '../src/read_models/place_history_bridge.js';
import {riteCircleSpec, makingSpec, riskLedger} from '../src/ui/rite_figure.js';
import {chaseSituation} from '../src/ui/combat_situation.js';
import {researchLadderSpec, researchMapSpec, projectLines} from '../src/research_view.js';
import {buildEventBook} from '../src/world_events.js';

test('rite bridge: figure and ledger run on a graded rite; any unlearned condition withholds the rite and its odds', () => {
    const graded = {grade: 'partial', odds: 62, recoveryDays: 7, conditions: [
        {id: 'a', label: 'Under a bell', status: 'met', fit: 1, loss: 0, via: 'a cracked bell', principle: 'SECRET PRINCIPLE', rejected: [{text: 'LEAK'}]},
        {id: 'b', label: 'Before dawn', status: 'absent', fit: 0, loss: 1, via: null, wanted: 'the small hours'}]};
    const base = {id: 'bench', name: 'Bell', slots: [], formulaKnown: true, brewing: false, ready: false, left: 0, doses: 0, minutes: 60};
    const d = benchWithRite(base, graded, {label: 'Rite of the Bell', known: new Set(['a', 'b'])});
    const spec = riteCircleSpec(d);
    assert.equal(spec.nodes[0].label, '62% risk');
    assert.equal(spec.slots.length, 2);
    assert.ok(riskLedger(d).rows.length === 2);
    assert.ok(!JSON.stringify(d).includes('LEAK') && !JSON.stringify(d).includes('SECRET'));
    assert.equal(benchWithRite(base, graded, {label: 'Rite', known: new Set(['a'])}).rite, null, 'one unknown condition hides the rite');
    assert.equal(riteCircleSpec(benchWithRite(base, graded, {label: 'Rite'})), null);
    assert.ok(makingSpec(d) !== undefined);
});

test('chase range: route minutes from where the pursuer was last seen; unseen means unknown, not a guess', () => {
    const view = {definitionId: 'x', label: 'Followed', status: 'following', text: 'Someone follows.'};
    const routes = [{from: 'a', to: 'b', minutes: 3}, {from: 'b', to: 'c', minutes: 4}, {from: 'a', to: 'c', minutes: 20}];
    const labelOf = p => ({a: 'Gate', b: 'Lane', c: 'Yard'})[p] ?? null;
    const seen = withPursuitRange(chaseSituation(view), {routes, here: 'c', pursuerSeenAt: 'a', labelOf});
    assert.deepEqual(seen.tracks[1].steps.map(s => s.label), ['Gate (last seen)', 'Lane', 'Yard (you)']);
    assert.match(seen.tracks[1].label, /7 min/);
    assert.ok(!seen.notes.some(n => /not modelled/.test(n.text)));
    const unseen = withPursuitRange(chaseSituation(view), {routes, here: 'c', pursuerSeenAt: null, labelOf});
    assert.equal(unseen.tracks.length, 1);
    assert.match(unseen.notes[0].text, /not seen/);
    assert.match(withPursuitRange(chaseSituation(view), {routes: [], here: 'c', pursuerSeenAt: 'a', labelOf}).notes[0].text, /no way/);
    assert.match(withPursuitRange(chaseSituation(view), {routes, here: 'c', pursuerSeenAt: 'c', labelOf}).notes[0].text, /right where you are/);
    assert.equal(withPursuitRange(null, {}), null);
});

test('study bridge: a learnView becomes a project the research figures and text accept; unheard-of cards and thresholds stay out', () => {
    const view = {id: 'spell', stage: 'practicing', canLearn: false, refusedBy: [], gates: [{label: 'A teacher', met: true}, {label: 'A prior spell', met: true}],
        mastery: 2, masteryNeeded: 5, practiceMinutes: 30, sign: 'A faint warmth.', nextSignAt: 3, unstated: ['hidden cost']};
    const p = studyProjectFromLearn(view, {label: 'Spark', known: new Set(['spell'])});
    assert.equal(p.level.label, 'Practicing');
    assert.equal(researchLadderSpec(p).tracks[0].steps.filter(s => s.state === 'current').length, 1);
    const map = researchMapSpec(p);
    assert.ok(map.nodes.some(n => n.id === 'practice' && n.state === 'current') && map.edges.length >= 3);
    assert.ok(projectLines(p).length >= 5);
    assert.ok(!JSON.stringify(p).includes('hidden cost') && !JSON.stringify(p).includes('nextSignAt'));
    assert.equal(studyProjectFromLearn(view, {label: 'Spark'}), null);
    const locked = studyProjectFromLearn({...view, stage: 'unlearned', gates: [{label: 'A teacher', met: false}]}, {label: 'Spark', known: new Set(['spell'])});
    assert.equal(locked.steps.find(s => s.id === 'learn').status, 'locked');
    assert.equal(locked.steps.find(s => s.id === 'learn').blocker, 'After: A teacher');
    researchMapSpec(locked);
});

test('place history: only learned, worded, already-begun events at the place, grouped by era', () => {
    const rec = (id, extra) => ({id, key: id, kind: 'public_event', placement: 'dated', scope: 'public', evidence: 'S', lineKey: `l.${id}`, place: 'port', ...extra});
    const book = buildEventBook([rec('old', {when: {day: 2}}), rec('now', {when: {day: 40, endDay: 42}}), rec('future', {when: {day: 90}}), rec('away', {when: {day: 3}, place: 'hill'}),
        rec('secret', {when: {day: 4}, scope: 'private'}), rec('mute', {when: {day: 5}, lineKey: undefined})]);
    const ctx = {presence: (p, d) => ([2, 40, 41, 42].includes(d) ? 'port' : null), channels: () => new Set()};
    const text = k => ({'l.old': 'A flood.', 'l.now': 'A fair.', 'l.future': 'LEAK', 'l.away': 'LEAK2', 'l.secret': 'LEAK3'})[k] ?? null;
    const eras = [{id: 'early', label: 'Early years', fromDay: 0, toDay: 30}, {id: 'late', label: 'Recent', fromDay: 31, toDay: 100}];
    const spec = placeHistorySpec(book, 'me', 'port', 41, ctx, {eras, textOf: text, placeLabel: p => (p === 'port' ? 'The port' : null)});
    assert.deepEqual(spec.tracks.map(t => [t.label, t.steps.map(s => `${s.label}:${s.state}`)]), [['Early years', ['A flood.:done']], ['Recent', ['A fair.:current']]]);
    assert.ok(!/LEAK/.test(JSON.stringify(spec)));
    assert.equal(placeHistorySpec(book, 'me', 'nowhere', 41, ctx, {eras, textOf: text, placeLabel: () => null}), null);
    const none = placeHistorySpec(book, 'me', 'port', 41, {presence: () => null, channels: () => new Set()}, {eras, textOf: text, placeLabel: () => 'The port'});
    assert.equal(none.tracks.length, 0);
});
