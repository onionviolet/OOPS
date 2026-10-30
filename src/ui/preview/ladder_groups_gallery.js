// Gallery section: one character holding several ladders (grouped by system and source), the path picker for what it has heard of, and
// switch, branch and loss drawn as states. Invented paths only.
import {pathView} from '../../ascension_paths.js';
import {groupLadders, pathPicker} from '../../ability_ladders.js';
import {renderLadderGroups, renderPathPicker} from '../ladder_groups.js';
import {ladderFigureSpec} from '../../ability_ladder_figure.js';
import {renderFigure} from '../figure.js';
import {LANTERN_PATH, REED_PATH, BELL_PATH} from './fixtures/abilities.js';
import {graphFigureSpec} from '../../ability_graph.js';
import {GRAPH_PATHS} from './fixtures/graph_paths.js';

export function mountLadderGroupsGallery(main) {
    const doc = main.ownerDocument;
    const section = (id, title) => { const s = doc.createElement('section'); s.className = 'fig-gallery-section'; s.dataset.fixture = id; const h = doc.createElement('h2'); h.textContent = title; const host = doc.createElement('div'); s.append(h, host); main.append(s); return host; };
    renderLadderGroups(section('ladders-several', 'Several ladders: grouped by system, then by where each ability comes from'), groupLadders([
        {system: 'Potion sequence', source: 'rung', view: pathView(LANTERN_PATH, 1, {acting: 4}, {known: 3, ceiling: 2}), felt: 'settling'},
        {system: 'Realm', source: 'learned', view: pathView(REED_PATH, 1, {hours: 37}, {known: 3})},
        {system: 'Realm', source: 'cheat', view: pathView(BELL_PATH, 2, {hours: 5}, {known: 10})},
    ]));
    renderPathPicker(section('path-picker', 'Path picker: only paths this character has heard of'), pathPicker([
        {view: pathView(LANTERN_PATH, 1, {}, {known: 3}), heard: true}, {view: pathView(REED_PATH, 0, {}, {known: 2}), heard: true}, {view: pathView(BELL_PATH, 0, {}, {known: 1}), heard: false}]));
    for (const g of GRAPH_PATHS) renderFigure(section(`graph-${g.id}`, `Path shape: ${g.shape}`), graphFigureSpec(g), {idPrefix: `lg-${g.id}`});
    const host = section('ladder-events', 'Switch, branch and loss as states');
    renderFigure(host, ladderFigureSpec(pathView(LANTERN_PATH, 1, {acting: 4}, {known: 3, ceiling: 2}), {id: 'ladder-events', events: [
        {at: 0, kind: 'switch', label: 'the reed-breath realms'}, {at: 1, kind: 'branch', label: 'Wick-Turner or Glass-Warden'}, {at: 2, kind: 'loss', label: 'to a failed draught'}]}), {idPrefix: 'lg-events'});
}
