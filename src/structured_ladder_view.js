// Generic ladder surface for structured packs. A pack declares presentation.ladders =
// [{id, path: <definePath descriptor>, positionKey, facts: {pathFactName: actorFactKey}, known?}]; one entry per
// ladder a character holds (rank, method track, creature rank...). This reads the actor's saved facts and returns
// one observer-safe view plus figure spec per entry. No world's names here.
import {definePath} from './ascension_paths.js';
import {ladderViewFromRecord} from './read_models/ability_ladder_bridge.js';
import {ladderFigureSpec} from './ability_ladder_figure.js';

export function validateLadderPresentation(ladders) {
    if(ladders === undefined) return;
    if(!Array.isArray(ladders) || new Set(ladders.map(l => l?.id)).size !== ladders.length) throw new Error('Invalid ladder presentation.');
    for(const l of ladders) {
        const path = definePath(l.path);
        if(typeof l.id !== 'string' || typeof l.positionKey !== 'string' || typeof l.facts !== 'object' || !l.facts) throw new Error('Invalid ladder presentation.');
        if(l.known !== undefined && !(Number.isInteger(l.known) && l.known >= 1 && l.known <= path.stages.length)) throw new Error('Invalid ladder known rungs.');
    }
}

export function structuredLadderViews(d, actorFacts = {}) {
    return (d.presentation?.ladders || []).map(l => {
        const path = definePath(l.path), raw = actorFacts[l.positionKey];
        const position = Number.isInteger(raw) ? Math.max(0, Math.min(path.stages.length - 1, raw)) : 0;
        const facts = {};
        for(const [name, key] of Object.entries(l.facts)) if(actorFacts[key] !== undefined) facts[name] = actorFacts[key];
        const view = ladderViewFromRecord(path, {position, facts, known: l.known});
        return {id: l.id, label: view.label, stage: view.stage, next: view.next, ready: view.ready, crossings: view.crossings, spec: ladderFigureSpec(view, {crossings: true, layout: 'compact', id: `${path.id}`})};
    });
}
