// Deeds: achievements read from what actually happened (G6 widened 2026-11-10, STY33, RCL14). PROPOSAL rows.
// A deed is a profile-level achievement (achievements.js keeps the store, its key and its compatibility decision);
// this module owns only the readers and the catalog. Every reader reads a record another owner already keeps:
//   beat routes   resolved results' `via` (beat_records.js) as they resolve, plus the saved ledger's 'altered' rows
//   canon pull    the canonPull slice's outcome records (canon_pull.js)
//   firsts        the manor brood roster, Cyoria's run count and loop attempts, the HP exam bands
//   lives         the chronicle's heir generation, ended continuation lives, the life record's world crossings
// No new counter and no save field. A deed grants no power (AD38). Pure: no storage, no clock read.
import {SUBJECT_IDS} from './hp_exam_model.js';
import {loopStartOf} from './mol_zorian_loop.js';

export const DEED_GROUPS = Object.freeze([
    {id: 'another_way', label: 'Another way'},
    {id: 'firsts', label: 'Firsts'},
    {id: 'lives', label: 'Lives'},
]);

// Writers whose facts mean the player's own doing rather than the book's (constraint_store.js PROVENANCE_CODES).
const OWN_ROUTE = new Set(['emergent', 'divergent']);
const object = v => v && typeof v === 'object' && !Array.isArray(v);

/** True when a resolved result reached its turning by a route other than the book's: the beat's other
 *  branch held ('altered'), or a fact that met it was written by the player's own play (STY33, RCL14). */
export function routeIsOwn(result) {
    if (!object(result)) return false;
    if (result.status === 'altered') return true;
    return result.status === 'carried' && Array.isArray(result.via) && result.via.some(v => OWN_ROUTE.has(v?.by));
}

// Results resolve inside one tick and their `via` is not saved (beat_ledger.js keeps status, day, causes).
// The host hands this module the lead's results as they resolve; the deeds domain reads the set on refresh
// and the profile keeps the unlock. Losing the set on reload loses nothing already unlocked.
const seenRoutes = new Set();
export function observeBeatRoutes(results, leadIds = ['player']) {
    const leads = new Set(leadIds.filter(Boolean));
    for (const r of results || []) if (leads.has(r?.actor) && routeIsOwn(r)) seenRoutes.add(r.beat);
    return seenRoutes.size;
}
export const observedRoutes = () => [...seenRoutes];
export const clearObservedRoutes = () => seenRoutes.clear();

const HP_WORLD = 'book.hp.lead.world';
function examBands(expansion) {
    const a = expansion?.actors?.player;
    if (a?.worldId !== HP_WORLD) return [];
    return SUBJECT_IDS.map(s => a.facts?.[`hp.lead.exam.band.${s}`]).filter(b => typeof b === 'string');
}
function hatched(residences) {
    return Object.values(residences?.properties || {})
        .some(h => (h?.brood?.roster || []).some(r => r.stage && r.stage !== 'egg'));
}

/** sources: {expansion, residences, beatLedger, canonPull, continuation, lifeRecord, routes}. Every field optional. */
export function deedFacts({expansion = null, residences = null, beatLedger = null, canonPull = null, continuation = null, lifeRecord = null, routes = []} = {}) {
    const records = Array.isArray(canonPull?.records) ? canonPull.records : [];
    const altered = Object.values(beatLedger?.done || {}).filter(d => d?.status === 'altered').length;
    const lives = Object.values(continuation?.lives || {});
    // Cyoria keeps its own run count (`motherOfLearning.runs`, 2 after the first restart); a looped continuation life counts too.
    const loops = Math.max((expansion?.motherOfLearning?.runs || 1) - 1, lives.filter(l => loopStartOf(l?.initial) && (l.attempt?.count || 0) >= 1).length);
    const crossings = Object.values(lifeRecord?.observed?.crossings || {}).reduce((a, n) => a + (Number.isFinite(n) ? n : 0), 0);
    const generation = expansion?.chronicle?.life?.experience?.generation || 1;
    return {
        ownRoutes: routes.length + altered,
        foundYou: records.filter(r => r.outcome === 'restored').length,
        carriedForYou: records.filter(r => r.outcome === 'substituted').length,
        wentAnotherWay: records.filter(r => r.outcome === 'deviated').length,
        hatched: hatched(residences),
        loopsLived: loops,
        papersSat: examBands(expansion).length,
        topPapers: examBands(expansion).filter(b => b === 'top').length,
        livesEnded: Math.max(generation - 1, lives.filter(l => l?.ended).length),
        crossings,
    };
}

// Rows: {id, group, name, text, hidden?, test}. Hidden rows show nothing until earned (a turning in a sealed
// book is named by no row text; receipts use the row id). Names follow NMR, text follows PRS4/PRS6.
export const deed_catalog = Object.freeze([
    {id: 'deed.own_road', group: 'another_way', name: 'By Your Own Road', text: 'Reach a turning the story knows by a road of your own.', test: f => f.ownRoutes >= 1},
    {id: 'deed.found_you', group: 'another_way', hidden: true, name: 'It Found You Anyway', text: 'You were somewhere else when the day came, and it still reached you.', test: f => f.foundYou >= 1},
    {id: 'deed.in_your_place', group: 'another_way', hidden: true, name: 'In Your Place', text: 'You stepped away, and someone else carried the day for you.', test: f => f.carriedForYou >= 1},
    {id: 'deed.off_the_page', group: 'another_way', hidden: true, name: 'Off the Page', text: 'You stepped away, and the day went another way for good.', test: f => f.wentAnotherWay >= 1},
    {id: 'deed.first_hatch', group: 'firsts', name: 'Cracked Shell', text: 'An egg in your brood chamber hatches.', test: f => f.hatched},
    {id: 'deed.month_again', group: 'firsts', name: 'The Same Month Twice', text: 'Wake in Cyoria at the start of the month again.', test: f => f.loopsLived >= 1},
    {id: 'deed.exams_sat', group: 'firsts', name: 'Marks on the Board', text: 'Sit all seven end-of-year papers at Hogwarts.', test: f => f.papersSat >= SUBJECT_IDS.length},
    {id: 'deed.top_paper', group: 'firsts', name: 'Top of the Paper', text: 'Earn the best mark on an end-of-year paper.', test: f => f.topPapers >= 1},
    {id: 'deed.second_life', group: 'lives', name: 'A Second Life', text: 'Carry one life to its end and begin another.', test: f => f.livesEnded >= 1},
    {id: 'deed.many_lives', group: 'lives', name: 'Many Lives', text: 'Carry three lives to their end.', test: f => f.livesEnded >= 3},
    {id: 'deed.crossing', group: 'lives', name: 'Across the Threshold', text: 'Cross from one world into another.', test: f => f.crossings >= 1},
]);

/** The panel's rows: earned or open rows by group; hidden rows appear only once earned, the rest are counted. */
export function deedView(profile, catalog = deed_catalog) {
    const held = id => !!profile?.unlocked?.[id];
    return DEED_GROUPS.map(g => {
        const rows = catalog.filter(d => d.group === g.id);
        return {id: g.id, label: g.label,
            rows: rows.filter(d => !d.hidden || held(d.id)).map(d => ({id: d.id, name: d.name, text: d.text, held: held(d.id), at: profile?.unlocked?.[d.id]?.at ?? null})),
            unfound: rows.filter(d => d.hidden && !held(d.id)).length};
    });
}
