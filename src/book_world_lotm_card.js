// Seer rungs for the pathway card (Round 13 R6): authored requirement definitions over the facts and actions the LOTM owners already
// expose through the host view. Reads the view; stores nothing (AR3, LSD440). Labels come from the path's own crossings; the lines
// here add only the family overrides, provenance, ways and what a shortfall does. Art and group headers come from the private hook.
import {ladderToGraph} from './ascension_graph.js';
import {factsFromView} from './pathway_requirements.js';
import {pathwayCard} from './pathway_card.js';
import {cardArtFor, loadCardArt, setCardArt} from './pathway_card_art.js';

const A = id => `book.lotm.${id}`;
// Rung requirement definitions by crossing id. `routes` name host actions; a route shows only when the host lists that action now.
const BY_CROSSING = {
    seer_dose: {provenance: 'canon', routes: [{kind: 'allotment', action: A('accept_allocation')}, {kind: 'prepare', action: A('ingest')}]},
    acting: {provenance: 'canon', short: {signs: 'The potion stays undigested and the persona slips', outcome: 'Taking the next dose early risks loss of control'}},
    assessment: {provenance: 'canon-derived', routes: [{kind: 'service', action: A('request_assessment')}]},
    exam: {provenance: 'canon-derived', routes: [{kind: 'exam', action: A('request_exam_seer')}], short: {signs: 'The examiner finds the digestion incomplete', outcome: 'A delay; the dose is not released'}},
    clown_dose: {provenance: 'canon', routes: [{kind: 'prepare', action: A('ingest_clown')}]},
};
const CONDITION = {id: 'clean_path', family: 'condition', label: 'No other pathway\'s potion taken', fact: 'cleanPath', provenance: 'canon',
    short: {signs: 'Whispers and headaches', outcome: 'Loss of control'}};

/**
 * v: the LOTM host view ({path, actions, actingGuidance, cause}); path: the descriptor behind v.path (the Seer path or the advancement ladder).
 * Returns a pathway card model, or null when the view has no ladder (a civil life).
 */
export function lotmPathwayCard(v, path) {
    const p = v?.path;
    if (!p || p.path !== path.id) return null;
    const graph = ladderToGraph(path), ids = path.stages.map(s => s.id);
    const actions = {};
    for (const a of v.actions ?? []) actions[a.id] = {label: a.label, eligible: a.eligible, reason: a.reasons?.join(' ') || null, minutes: a.duration || null};
    const guided = (v.actingGuidance ?? []).filter(a => a.visible && !a.completed);
    for (const a of guided) actions[a.id] = {label: a.label.split(' · ')[0], eligible: a.eligible, reason: a.reasons?.join(' ') || null, minutes: a.duration || null};
    const facts = {...factsFromView(path, p), cleanPath: !v.cause?.line};
    // Knowledge: a rung the view cannot name is level 1; the next rung's terms open as the character learns them.
    const knowledge = {};
    p.ladder.forEach((r, i) => { if (r.label === '???') knowledge[ids[i]] = 1; });
    const edgeId = `to_${ids[p.position + 1]}`, assessed = facts.assessed === true;
    if (ids[p.position + 1]) knowledge[edgeId] = p.next === '???' ? 1 : 4;
    const defs = {byCrossing: {...BY_CROSSING, acting: {...BY_CROSSING.acting, routes: [{kind: 'study', action: A('lesson')}, ...guided.map(a => ({kind: 'practice', action: a.id}))]},
        // The examination's terms are not known until the assessment is done; the dose is a name only until the exam is known.
        ...(p.position >= 1 && !assessed ? {exam: {...BY_CROSSING.exam, level: 2}, clown_dose: {...BY_CROSSING.clown_dose, level: 3}} : {})},
        extras: ids.slice(1, 3).reduce((o, id) => ({...o, [`to_${id}`]: [CONDITION]}), {})};
    const art = cardArtFor(path.id);
    return pathwayCard({group: art?.group ?? 'Potion sequence', name: p.label, emblem: art?.emblem, art: art?.art, summary: art?.summary ?? `Held: ${p.stage}.`, graph,
        held: [ids[p.position]], facts, knowledge, actions, defs});
}

// Private builds only: art, emblems and the publisher's group header and summary arrive from the pack supplement when it is listed.
if (typeof document !== 'undefined') loadCardArt().then(pack => { if (pack) setCardArt(pack); });
