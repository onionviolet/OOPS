// A world plugs in its own form of progression (AD46): the shared view inherits no world's ladder. A form is a kind name and a function from a
// world's data to a figure spec. The built-ins cover the shapes ability_graph.js and ability_ladder_figure.js already draw; a world registers
// more (a stat sheet, an equipment tier, a knowledge tree) without editing a shared module. Pure; the registry is per call site, not global state.
import {ladderFigureSpec} from './ability_ladder_figure.js';
import {graphFigureSpec} from './ability_graph.js';

const BUILT_IN = {
    ladder: ({view, options}) => ladderFigureSpec(view, options),
    graph: ({graph}) => graphFigureSpec(graph),
    list: ({graph}) => graphFigureSpec({...graph, shape: 'list'}),
};

/** forms: {kind: data => figure spec} a world adds. Returns progressionFigure(kind, data); an unknown kind throws, so a world cannot silently fall back to a ladder. */
export function progressionForms(forms = {}) {
    const table = {...BUILT_IN, ...forms};
    return (kind, data) => {
        if (!Object.hasOwn(table, kind)) throw new Error(`No progression form "${kind}"; register it for this world.`);
        return table[kind](data);
    };
}
