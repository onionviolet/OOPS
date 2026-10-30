import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathView, definePath} from '../src/ascension_paths.js';
import {groupLadders, pathPicker, pathPickerText, systemGlance, sourceList, ABILITY_SOURCES} from '../src/ability_ladders.js';
import {ladderFigureSpec} from '../src/ability_ladder_figure.js';
import {figureText} from '../src/ui/figure.js';
import {LANTERN_PATH, REED_PATH, BELL_PATH} from '../src/ui/preview/fixtures/abilities.js';

// Ratchet (P5): the ability UI modules name no world, pathway or system. A world's host and adapter supply those as data.
const NEUTRAL = ['src/ability_ladder_figure.js', 'src/ability_ladders.js', 'src/ability_skill_rows.js', 'src/ability_graph.js', 'src/progression_forms.js', 'src/ui/figure_graph.js', 'src/ui/skills_tab.js', 'src/ui/ladder_groups.js', 'src/read_models/ability_ladder_bridge.js', 'src/read_models/learn_tab_bridge.js'];
const FORBIDDEN = /\b(lotm|seer|mistglass|tingen|nighthawk|evernight|sequence \d|book\.[a-z]+\.[a-z]+|cultivation|hogwarts|reverend)\b/i;
test('ability UI modules name no pathway, world or system', () => {
    for (const file of NEUTRAL) {
        const hit = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8').split('\n').map((line, i) => [i + 1, line]).find(([, line]) => FORBIDDEN.test(line));
        assert.equal(hit, undefined, `${file}:${hit?.[0]} names a world or path: ${hit?.[1]?.trim()}`);
    }
});

const view = (path, position, facts, opts) => pathView(path, position, facts, opts);

test('several ladders group by system and read in source order, the first full size and the rest compact', () => {
    const groups = groupLadders([
        {system: 'Realm', source: 'cheat', view: view(REED_PATH, 1, {hours: 10}, {known: 3})},
        {system: 'Potion sequence', source: 'rung', view: view(LANTERN_PATH, 1, {acting: 2}, {known: 3, ceiling: 2}), felt: 'settling'},
        {system: 'Realm', source: 'learned', view: view(BELL_PATH, 2, {hours: 5}, {known: 10})},
    ]);
    assert.deepEqual(groups.map(g => g.system), ['Realm', 'Potion sequence'], 'first-seen system order');
    assert.deepEqual(groups[0].ladders.map(l => l.source), ['learned', 'cheat'], 'sources sort by reading order, not input order');
    assert.equal(groups[0].ladders[0].spec.tracks[0].orient, 'vertical', 'the first ladder is full size');
    assert.ok(groups.slice(1).concat(groups[0].ladders.slice(1)).flatMap(g => g.ladders ?? [g]).every(l => l.spec.tracks[0].orient === 'horizontal'));
    assert.equal(new Set(groups.flatMap(g => g.ladders.map(l => l.spec.id))).size, 3, 'figure ids stay unique');
    assert.deepEqual(ABILITY_SOURCES, ['rung', 'learned', 'item', 'contract', 'cheat']);
});

test('the path picker lists only heard-of paths and never says how many exist', () => {
    const rows = pathPicker([
        {view: view(LANTERN_PATH, 0, {}, {known: 2}), heard: true},
        {view: view(REED_PATH, 0, {}, {known: 1}), heard: false},
    ]);
    assert.deepEqual(rows.map(r => r.label), ['Lantern-Reader pathway']);
    assert.equal(rows[0].rungs.filter(g => g.unknown).length, 1, 'unnamed rungs collapse to one');
    const text = pathPickerText(rows);
    assert.match(text, /Ordinary clerk > First rung · Lantern-Reader > Not yet known\./);
    assert.doesNotMatch(text, /Reed|Dust|Still Lake/);
    assert.equal(pathPickerText([]), 'No paths known yet.');
});

test('switch, branch and loss are states the ladder can draw, with words', () => {
    const v = view(LANTERN_PATH, 1, {acting: 2}, {known: 3, ceiling: 2});
    const spec = ladderFigureSpec(v, {events: [{at: 0, kind: 'switch', label: 'the reed-breath realms'}, {at: 1, kind: 'branch', label: 'Wick-Turner or Glass-Warden'}, {at: 2, kind: 'loss', label: 'to a failed draught'}]});
    const steps = spec.tracks[0].steps;
    assert.match(steps[0].note, /switched from here to the reed-breath realms/);
    assert.match(steps[1].note, /branches into Wick-Turner or Glass-Warden/);
    assert.equal(steps[2].state, 'broken');
    assert.match(figureText(spec), /Second rung · Wick-Turner \(broken; lost to a failed draught\)/);
    const witness = ladderFigureSpec(v, {perspective: 'witness', seen: 1, events: [{at: 1, kind: 'loss', label: 'x'}]});
    assert.doesNotMatch(figureText(witness), /lost/, 'a witness is not told');
    assert.ok(definePath, 'path module loads');
});

import {graphFigureSpec} from '../src/ability_graph.js';
import {renderFigure} from '../src/ui/figure.js';
import {createDom} from '../scripts/headless/dom.mjs';

test('a branching path draws as a tree, gated by what the character has learned, with markers for here, trail, rumour and source', () => {
    const graph = {id: 'fork', label: 'The fork', shape: 'tree', here: 'b', trail: ['a', 'b'], nodes: [
        {id: 'a', label: 'Start', known: 'odds', held: true}, {id: 'b', label: 'Left road', known: 'costs', held: true, benefits: ['steady hands'], costs: ['a bad name']},
        {id: 'c', label: 'Right road', known: 'benefits', source: 'insight', benefits: ['night sight'], costs: ['secret cost']}, {id: 'd', label: 'Hidden road', known: 'exists'},
        {id: 'e', label: 'Rumoured road', known: 'name', confirmed: false}],
        edges: [{from: 'a', to: 'b', known: 'odds'}, {from: 'a', to: 'c', known: 'mix', mix: {outcome: 'madness', odds: 'usually', warning: 'two ends at once'}}, {from: 'a', to: 'd', known: 'exists'}, {from: 'a', to: 'e', known: 'name'}]};
    const spec = graphFigureSpec(graph), by = id => spec.nodes.find(n => n.id === id);
    assert.equal(by('d').label, 'Unknown');
    assert.equal(by('d').state, 'unknown');
    assert.equal(by('b').state, 'current');
    assert.equal(by('e').state, 'guessed');
    assert.ok(by('a').at[1] > by('b').at[1], 'the tree climbs from its root');
    const notes = spec.notes.map(n => n.text).join(' ');
    assert.match(notes, /Left road: gives steady hands, costs a bad name, you are here\./);
    assert.match(notes, /Right road: gives night sight, shown by insight\./);
    assert.doesNotMatch(notes, /secret cost/, 'costs stay off until learned');
    assert.equal(spec.edges.find(e => e.to === 'c').label, 'warning: two ends at once · ends in madness', 'odds stay off until learned');
    const odds = graphFigureSpec({...graph, edges: [{from: 'a', to: 'c', known: 'odds', mix: {outcome: 'madness', odds: 'usually'}}]});
    assert.equal(odds.edges[0].label, 'ends in madness · usually');
    assert.equal(spec.edges.find(e => e.to === 'c').state, 'strained');
    assert.equal(spec.edges.find(e => e.to === 'b').state, 'done', 'the trail edge reads taken');
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const {text} = renderFigure(dom.document.getElementById('host'), spec, {text: true});
    assert.match(text, /Hidden road|Unknown/);
    assert.doesNotMatch(text, /Hidden road/, 'an unnamed node never leaks its name');
});

test('a demoted character keeps the trail: a node no longer held still reads taken', () => {
    const spec = graphFigureSpec({id: 'down', label: 'Down', shape: 'chain', trail: ['a', 'b'], here: 'a', nodes: [{id: 'a', label: 'One', known: 'name', held: true}, {id: 'b', label: 'Two', known: 'name', held: false}]});
    assert.equal(spec.nodes.find(n => n.id === 'b').state, 'done');
});

import {progressionForms} from '../src/progression_forms.js';

test('a world plugs in its own progression form; an unregistered kind never falls back to a ladder', () => {
    const figure = progressionForms({stats: ({rows}) => ({id: 'stats', title: 'Stats', nodes: rows.map((r, i) => ({id: `s${i}`, label: r, at: [0, i / 4]})), edges: [], notes: [], legend: []})});
    assert.equal(figure('stats', {rows: ['Strength', 'Craft']}).nodes.length, 2);
    assert.equal(figure('ladder', {view: view(LANTERN_PATH, 1, {}, {known: 3}), options: {}}).tracks[0].orient, 'vertical');
    assert.equal(figure('graph', {graph: {id: 'g', label: 'G', shape: 'tree', nodes: [{id: 'a', label: 'A', known: 'name'}], edges: []}}).nodes[0].label, 'A');
    assert.throws(() => figure('equipment-tier', {}), /No progression form/);
});

test('the sheet glance is one line per system in its own words, capped at three; a path-less list groups by source', () => {
    const e = (system, words) => ({system, words});
    assert.deepEqual(systemGlance([e('Rank', 'Clown'), e('Grades', 'Charms, O')]), ['Rank: Clown', 'Grades: Charms, O']);
    assert.deepEqual(systemGlance([e('A', 'a'), e('B', 'b'), e('C', 'c'), e('D', 'd'), e('E', 'e')]), ['A: a', 'B: b', 'C: c', 'and 2 more']);
    const groups = sourceList([{source: 'cheat', label: 'Second sight'}, {source: 'rung', label: 'Quiet step'}, {source: 'item', label: 'Ringing bell'}, {source: 'rung', label: 'Long breath'}]);
    assert.deepEqual(groups.map(g => g.source), ['rung', 'item', 'cheat']);
    assert.deepEqual(groups[0].items, ['Quiet step', 'Long breath']);
});
