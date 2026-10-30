// A path that is not a ladder (G5-G7): a branching tree, a wheel, a web or a plain list of powers, drawn through the figure primitive with the
// layout that matches its shape (ui/figure_graph.js). Path-neutral: a world's adapter names the shape and the nodes; nothing here knows a world.
// Knowledge gates depth, one step at a time: DEPTH is exists, name, benefits, costs, mix (what mixing two ends in), odds. A node or edge shows
// only what the character has learned; an unlearned node reads "Unknown", its benefits stay off the figure, and nothing sealed is read here
// (the adapter must not pass what the character cannot know). What came by a cheat or insight, and what is only rumoured, is marked.
import {withLayout} from './ui/figure_graph.js';

export const DEPTH = Object.freeze(['exists', 'name', 'benefits', 'costs', 'mix', 'odds']);
const at = (item, level) => DEPTH.indexOf(item.known ?? 'exists') >= DEPTH.indexOf(level);
const SOURCE_WORD = {cheat: 'shown by a gift you cannot explain', insight: 'shown by insight', learned: 'learned'};
const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * graph: {id, label, shape: 'tree'|'wheel'|'web'|'list'|'chain', nodes: [{id, label, known, held?, confirmed?, source?, benefits?[], costs?[]}],
 *   edges: [{from, to, known, kind?, label?, mix?: {outcome, odds?, warning?}}], trail?: [node ids taken, in order], here?: node id}
 * Returns a figure spec. `trail` survives a demotion: a trail node that is no longer held still reads as taken. `here` is the "you are here" marker.
 */
export function graphFigureSpec(graph) {
    const trail = new Set(graph.trail ?? []);
    const nodes = graph.nodes.map(n => {
        const named = at(n, 'name'), here = n.id === graph.here;
        const state = here ? 'current' : trail.has(n.id) ? 'done' : n.held ? 'done' : !named ? 'unknown' : n.confirmed === false ? 'guessed' : 'pending';
        return {id: n.id, label: named ? n.label : 'Unknown', state, glyph: undefined};
    });
    const edges = (graph.edges ?? []).filter(e => at(e, 'exists')).map(e => {
        const mixing = at(e, 'mix') && e.mix, taken = trail.has(e.from) && trail.has(e.to);
        const label = [e.label, mixing?.warning ? `warning: ${mixing.warning}` : null, mixing ? `ends in ${mixing.outcome}` : null, mixing && at(e, 'odds') && mixing.odds ? mixing.odds : null].filter(Boolean).join(' · ');
        return {from: e.from, to: e.to, kind: e.kind ?? 'leads to', state: mixing?.warning ? 'strained' : taken ? 'done' : 'pending', ...(label ? {label} : {})};
    });
    const notes = [];
    for (const n of graph.nodes) {
        const parts = [];
        if (at(n, 'benefits') && n.benefits?.length) parts.push(`gives ${n.benefits.join('; ')}`);
        if (at(n, 'costs') && n.costs?.length) parts.push(`costs ${n.costs.join('; ')}`);
        if (at(n, 'name') && n.source) parts.push(SOURCE_WORD[n.source] ?? n.source);
        if (at(n, 'name') && n.confirmed === false) parts.push('rumoured, not confirmed');
        if (n.id === graph.here) parts.push('you are here');
        if (parts.length) notes.push({text: `${n.label}: ${parts.join(', ')}.`});
    }
    const spec = {id: `graph-${slug(graph.id)}`, size: 560, title: graph.label, summary: `A ${graph.shape} of paths. Only what you have learned is shown; the rest reads Unknown.`, nodes, edges, notes,
        legend: [{state: 'current', label: 'you are here'}, {state: 'done', label: 'taken or held'}, {state: 'pending', label: 'known, not taken'}, {state: 'guessed', label: 'rumoured'}, {state: 'unknown', label: 'not yet known'}]};
    return withLayout(spec, graph.shape);
}
