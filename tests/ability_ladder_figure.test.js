import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec} from '../src/ui/figure.js';
import {ladderFigureSpec, ladderGlance, rungFill, plannedFill, abilityLines} from '../src/ability_ladder_figure.js';
import {pathView, definePath} from '../src/ascension_paths.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {LOTM_DIGEST_ACTS} from '../src/book_world_lotm_ids.js';
import {ABILITY_FIXTURES, LANTERN_PATH, LANTERN_ABILITIES} from '../src/ui/preview/fixtures/abilities.js';
import {FIGURE_FIXTURES} from '../src/ui/preview/figure_fixtures.js';

const draw = spec => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host');
    return {host, ...renderFigure(host, spec, {text: true})};
};
const all = (node, keep) => [node, ...[...node.children].flatMap(child => all(child, keep))].filter(keep);
const cls = (node, name) => (node.getAttribute('class') || '').split(/\s+/).includes(name);
const fixture = id => ABILITY_FIXTURES.find(spec => spec.id === id);

test('vertical tracks climb from the bottom, fill draws a partial ring and the text form keeps its words', () => {
    const spec = {id: 'v', title: 'V', tracks: [{id: 't', label: 'Ladder', orient: 'vertical', progress: 'standing on two', steps: [
        {label: 'one', state: 'done'}, {label: 'two', state: 'current', fill: .5}, {label: 'three', state: 'guessed', note: 'rumoured'}]}]};
    const {svg, text} = draw(spec);
    const pips = all(svg, n => cls(n, 'fig-step')).map(g => Number(all(g, n => cls(n, 'fig-body'))[0].getAttribute('cy')));
    assert.ok(pips[0] > pips[1] && pips[1] > pips[2], 'first step sits lowest');
    assert.equal(all(svg, n => cls(n, 'fig-fill')).length, 1);
    assert.match(text, /Track Ladder, standing on two: 1\. one \(done\); 2\. two \(current; 50% filled\); 3\. three \(guessed; rumoured\)\./);
    assert.ok(all(svg, n => cls(n, 'fig-track--vertical')).length);
    for (const [bad, pattern] of [[{orient: 'up'}, /orient/], [{steps: [{label: 'a', fill: 2}]}, /fill/], [{progress: ''}, /progress/]])
        assert.throws(() => validateFigureSpec({id: 'x', title: 'X', tracks: [{id: 't', steps: [{label: 'a'}], ...bad}]}), pattern);
});

test('a self ladder marks crossed, current, known, rumoured and unknown rungs, with one unknown rung and never a count', () => {
    const spec = fixture('ladder-lantern-self'), steps = spec.tracks[0].steps;
    assert.deepEqual(steps.map(s => s.state), ['done', 'current', 'pending', 'guessed', 'unknown']);
    assert.equal(steps[1].fill, 4 / 6);
    assert.match(steps[1].note, /feels settling, 4 of 6/);
    assert.equal(spec.tracks[1].steps[0].state, 'current');
    assert.ok(spec.notes.some(n => n.state === 'strained'));
    const deeper = ladderFigureSpec(pathView(LANTERN_PATH, 1, {}, {known: 2, ceiling: 2}));
    assert.equal(deeper.tracks[0].steps.filter(s => s.state === 'unknown').length, 1, 'runs of unknown rungs collapse to one');
    assert.doesNotMatch(figureText(deeper), /of 5|5 rungs/);
});

test('a witness sees only rungs it saw used: no fill, crossings, grants or rungs above', () => {
    const spec = fixture('ladder-lantern-witness'), text = figureText(spec);
    assert.equal(spec.tracks.length, 1);
    assert.ok(spec.tracks[0].steps.every(s => s.fill === undefined));
    assert.deepEqual(spec.tracks[0].steps.map(s => s.state), ['done', 'current', 'unknown']);
    assert.doesNotMatch(text, /Wick-Turner|Glass-Warden|4 of 6|settling|lamp-smoke/);
});

test('the home can drop the crossing track it already lists', () => {
    const view = pathView(LANTERN_PATH, 1, {acting: 2}, {known: 3, ceiling: 2});
    const spec = ladderFigureSpec(view, {crossings: false});
    assert.equal(spec.tracks.length, 1);
    assert.ok(!spec.notes.some(n => /Risk/.test(n.text)));
    assert.equal(rungFill(view).fill, 2 / 6);
});

test('a fresh and a digesting book life give a valid ladder figure from real facts', () => {
    const fresh = ladderFigureSpec(lotmPathView({}, {}));
    validateFigureSpec(fresh);
    assert.equal(fresh.tracks[0].steps[0].state, 'current');
    assert.ok(fresh.tracks[0].steps.every(s => s.fill === undefined));
    const digesting = ladderFigureSpec(lotmPathView({}, {'lotm.flag.allocated': true, 'lotm.flag.ingested': true, 'lotm.acting': 2, 'lotm.digested': false}), {felt: 'settling'});
    const current = digesting.tracks[0].steps.find(s => s.state === 'current');
    assert.equal(current.fill, 2 / LOTM_DIGEST_ACTS);
    assert.match(figureText(digesting), new RegExp(`feels settling, 2 of ${LOTM_DIGEST_ACTS}`));
    const {svg} = draw(digesting);
    assert.equal(all(svg, n => cls(n, 'fig-fill')).length, 2, 'current rung and the counted crossing both fill');
});

test('ability fixtures register in the gallery list once', () => {
    for (const spec of ABILITY_FIXTURES) assert.equal(FIGURE_FIXTURES.filter(f => f.id === spec.id).length, 1);
    for (const spec of ABILITY_FIXTURES) draw(spec);
});

const bells = n => definePath({id: `t.bells${n}`, world: 't.w', label: 'Bells', shape: 'ladder', stages: Array.from({length: n}, (_, i) => ({
    id: `s${i}`, label: `Rung ${i + 1}`, grants: [`g${i}`, `h${i}`], crossings: i ? [{id: 'p', type: 'quota', label: 'Ring', fact: 'hrs', need: 5}] : []}))});

test('pathView names the next stage grants only when the observer can name that stage', () => {
    assert.deepEqual(pathView(bells(5), 1, {}).nextGrants, ['g2', 'h2']);
    assert.deepEqual(pathView(bells(5), 1, {}, {known: 2}).nextGrants, []);
    assert.deepEqual(pathView(bells(5), 4, {}).nextGrants, []);
});

test('the next rung note shows when named and open, and not when capped', () => {
    const open = ladderFigureSpec(pathView(bells(5), 1, {}));
    assert.ok(open.notes.some(n => n.text === 'What the next rung gives: g2; h2.'));
    const capped = ladderFigureSpec(pathView(bells(5), 1, {}, {ceiling: 1}));
    assert.ok(!capped.notes.some(n => /next rung gives/.test(n.text)));
    assert.match(ladderFigureSpec(pathView(bells(5), 1, {hrs: 2})).tracks[0].steps[1].note, /2 of 5 toward the next rung/);
});

test('ten rungs fold crossed rungs but the one below current; five do not fold', () => {
    const steps = ladderFigureSpec(pathView(bells(10), 6, {})).tracks[0].steps;
    assert.equal(steps.filter(s => /rungs crossed/.test(s.label)).length, 1);
    assert.equal(steps[0].label, '5 rungs crossed');
    assert.equal(steps[0].note, 'Rung 1 to Rung 5');
    assert.equal(steps[1].label, 'Rung 6');
    assert.equal(steps.find(s => s.state === 'current').label, 'Rung 7');
    assert.equal(ladderFigureSpec(pathView(bells(5), 3, {})).tracks[0].steps.length, 5);
});

test('compact layout draws the rungs horizontally', () => {
    const view = pathView(bells(5), 1, {});
    assert.equal(ladderFigureSpec(view).tracks[0].orient, 'vertical');
    assert.equal(ladderFigureSpec(view, {layout: 'compact'}).tracks[0].orient, 'horizontal');
});

test('insight names unknown rungs as guessed with a note; a witness ignores it', () => {
    const view = pathView(bells(5), 1, {}, {known: 2});
    const spec = ladderFigureSpec(view, {insight: {stages: [, , , 'Seen Rung'], thresholds: true}});
    const shown = spec.tracks[0].steps.find(s => s.label === 'Seen Rung');
    assert.equal(shown.state, 'guessed');
    assert.equal(shown.note, 'shown by insight');
    assert.ok(spec.notes.some(n => /shown by insight/.test(n.text)));
    assert.ok(!ladderFigureSpec(view).notes.some(n => /shown by insight/.test(n.text)));
    const witness = ladderFigureSpec(view, {perspective: 'witness', seen: 1, insight: {stages: [, , , 'Seen Rung']}});
    assert.doesNotMatch(figureText(witness), /Seen Rung|insight/);
});

test('glance gives one plain line for fresh, digesting and ready views', () => {
    assert.equal(ladderGlance(pathView(bells(5), 0, {})), 'Rung 1 · 0 of 5 toward Rung 2');
    assert.equal(ladderGlance(pathView(bells(5), 1, {hrs: 2}), {felt: 'settling'}), 'Rung 2 · feels settling · 2 of 5 toward Rung 3');
    assert.equal(ladderGlance(pathView(bells(5), 1, {hrs: 5})), 'Rung 2 · 5 of 5 toward Rung 3 · ready for Rung 3');
    assert.equal(ladderGlance(pathView(bells(5), 4, {})), 'Rung 5');
});

test('a planned act draws a ghost past the fill on the rung and its crossing, in words too; a witness never sees it', () => {
    const view = pathView(LANTERN_PATH, 1, {acting: 4}, {known: 3, ceiling: 2});
    const spec = ladderFigureSpec(view, {felt: 'settling', planned: {label: 'the night round'}});
    const rung = spec.tracks[0].steps.find(s => s.state === 'current'), act = spec.tracks[1].steps.find(s => s.ghost !== undefined);
    assert.equal(rung.ghost, 5 / 6);
    assert.match(rung.note, /after the night round: 5 of 6/);
    assert.equal(act.label, 'Acts in the Lantern-Reader role');
    const {svg, text} = draw(spec);
    assert.equal(all(svg, n => cls(n, 'fig-ghost')).length, 2);
    assert.match(text, /after the night round: 5 of 6/);
    assert.equal(ladderGlance(view, {planned: {label: 'a round', adds: 3}}), 'First rung · Lantern-Reader · 4 of 6 toward Second rung · Wick-Turner · after a round: 6 of 6');
    assert.equal(plannedFill(pathView(LANTERN_PATH, 1, {acting: 6}, {known: 3}), {label: 'x'}), null, 'nothing to preview once the count is met');
    assert.doesNotMatch(figureText(ladderFigureSpec(view, {perspective: 'witness', seen: 1, planned: {label: 'the night round'}})), /after/);
    assert.match(figureText({id: 'g', title: 'G', tracks: [{id: 't', steps: [{label: 'a', state: 'current', fill: .25, ghost: .5}]}]}), /25% filled, 50% after the planned act/);
    assert.throws(() => validateFigureSpec({id: 'g', title: 'G', tracks: [{id: 't', steps: [{label: 'a', fill: .5, ghost: .25}]}]}), /ghost/);
});

test('typed ability records give per-ability lines with inferred costs marked, and unnamed next rungs hide them', () => {
    assert.deepEqual(abilityLines(LANTERN_ABILITIES.here), ['Read lamp-smoke: 1 lamp oil', 'Steady hands by night: cost not stated']);
    assert.deepEqual(abilityLines(LANTERN_ABILITIES.next), ['Turn a flame: 2 spirit (inferred); recovers in 15 min (inferred)']);
    const named = ladderFigureSpec(pathView(LANTERN_PATH, 1, {}, {known: 3}), {abilities: LANTERN_ABILITIES});
    assert.ok(named.notes.some(n => n.text === 'What the next rung gives: Turn a flame: 2 spirit (inferred); recovers in 15 min (inferred).'));
    const unnamed = ladderFigureSpec(pathView(LANTERN_PATH, 1, {}, {known: 2}), {abilities: LANTERN_ABILITIES});
    assert.doesNotMatch(figureText(unnamed), /Turn a flame/);
    assert.match(figureText(unnamed), /What this rung gives: Read lamp-smoke: 1 lamp oil/);
});

import {renderSkillsTab, skillsTabText, EMPTY_SKILLS} from '../src/ui/skills_tab.js';
import {SKILL_ROWS, SKILL_VIEWS} from '../src/ui/preview/fixtures/skills.js';

test('the skills tab shows one row per heard-of card with every fact in words, and nothing for an unheard-of card', () => {
    assert.deepEqual(SKILL_ROWS.map(r => r.id), ['lamp_read', 'smoke_turn', 'wick_cut']);
    const text = skillsTabText(SKILL_ROWS);
    assert.match(text, /Turn the smoke · Practicing · 2 of 6\./);
    assert.match(text, /Cannot learn yet: The harbour warden has not agreed to teach you\./);
    assert.match(text, /Not yet: A teacher: the harbour warden/);
    assert.match(text, /The next sign comes at 3\./, 'an understood card shows its threshold');
    assert.doesNotMatch(text, /Night oil|hidden cost|night_oil/);
    assert.equal(skillsTabText([]), EMPTY_SKILLS);
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host'), {text: drawn} = renderSkillsTab(host, SKILL_ROWS);
    assert.equal(drawn, text);
    assert.equal(all(host, n => n.getAttribute('data-skill')).length, 3);
    assert.equal(all(host, n => cls(n, 'skills-meter')).length, 1, 'only a practicing row carries a meter');
    assert.equal(SKILL_VIEWS.length, 4);
});

import {defineAbilityRecords} from '../src/ability_records.js';
import {rungCards, skillRows} from '../src/ability_skill_rows.js';

test('the skills feed is path-neutral: a potion rung and a cultivation realm give rows by held source only, and the next rung stays unseen', () => {
    const teacher = {label: 'A teacher is present', reason: 'No one here can teach it.', requires: {fact: 'actor.teacherHere', op: 'eq', value: true}};
    const row = (prefix, key, label, source, extra = {}) => ({key, label, sourceId: `${prefix}.${source}`, conditions: [], cost: [], limit: {kind: 'none'},
        effects: [{type: 'item', actor: 'player', key: `{"id":"${prefix}.${key}"}`, amount: 1}], learn: {teacher, practice: {minutes: 20, mastery: 1}, masteryNeeded: 3, ...extra}});
    const potion = defineAbilityRecords([row('pot', 'glow', 'Lamp glow', 'r1'), row('pot', 'deep', 'Deep glow', 'r2')], {prefix: 'pot', world: {id: 'pot.w'}});
    const realm = defineAbilityRecords([row('cul', 'reed_breath', 'Reed breath', 'reed')], {prefix: 'cul', world: {id: 'cul.w'}});
    const potionRows = skillRows(potion.cards, {facts: {'actor.teacherHere': true}, held: ['pot.r1']});
    assert.deepEqual(potionRows.map(r => r.label), ['Lamp glow'], 'only the held rung shows');
    assert.equal(potionRows[0].canLearn, true);
    assert.deepEqual(skillRows(realm.cards, {held: ['cul.reed']}).map(r => r.label), ['Reed breath']);
    assert.deepEqual(skillRows(realm.cards, {}), [], 'nothing held, nothing heard of');
    assert.match(skillsTabText(skillRows(realm.cards, {held: ['cul.reed']})), /Reed breath · Not learned\./);
    const adv = {path: {stages: [{id: 'a'}, {id: 'b'}, {id: 'c'}]}, rungs: {b: {abilities: potion}, c: {abilities: realm}}};
    assert.equal(rungCards(adv, 0).next.length, 2, 'the next rung holds its cards');
    assert.equal(rungCards(adv, 2).here.length, 1);
});
