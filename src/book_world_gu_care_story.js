// Story director, second world (AD51/FND5, STY10, STY11): the Moonlight Gu care events of the Reverend Insanity academy annex
// (`book_gu_life.js`) surface in the Events list through `story_director.js`, the same pacing core as the Tingen deck.
// The simulation already caused and committed every occurrence; this file only chooses which daily care notice the lead takes in
// and when (STY30). It writes nothing and saves nothing: the run is derived from the occurrence log on every read.
// Dials (default, reason):
//   window        one played day, the care check's own interval: the Gu eats once a day, so at most one care notice a day stands out.
//   routine       a fed Gu is of the moment (hold 0), and one meal notice keeps the next out for two days (cooldown by kind: a daily
//                 meal is not news every day); it fades while the Gu is going hungry and returns after a lull.
//   pressure      a missed meal may wait two days for attention and grows with recent hunger; a recheck drops it once the Gu has died.
//   tension       missed meals in the last three days, two or more reading as full tension (a mechanism fact, not a world kind, WKR1).
//   death         a fixed point: it never passes through the director and shows on its day, like Tingen's calendar days.
// Limits: the simulation keeps the last hundred terminal occurrences (`occur` in simulation.js), so on a long life the earliest
// windows lose their candidates and the derived run is recomputed from what is left. The care status panel stays the truth.
import {runDirector, validateDirector, whyLine} from './story_director.js';
import {guId as id} from './world_packs/book_gu_life.js';

const GU = id('moonlight'), RESET = id('care.a_reset'), DEATH = id('care.b_death');
const CATEGORY = Object.freeze({[id('care.c_meal')]: 'routine', [id('care.d_hunger')]: 'pressure'});
export const GU_DIRECTED = Object.freeze(Object.keys(CATEGORY));
export const GU_CARE_DIRECTOR = validateDirector({id: 'gu.annex.care', quiet: 2, tensionQuiet: .8, cooldown: 0, attempts: 2, dry: {after: 2, relief: .6, floor: .2},
    categories: {routine: {weight: 2, hold: 0, cooldown: 2, tension: -.7, comfort: 1}, pressure: {weight: 2, hold: 2, tension: 4}}});
export const GU_WHY_WORDS = Object.freeze({tense: 'Your Gu has been going hungry, so this is what you notice.',
    lull: 'The annex has been quiet for a few days, so this catches your eye.', calm: 'Nothing else in the annex claimed your attention.',
    late: 'You only took it in a day or two later.'});

// Gate on the care mechanism itself: the living Gu, its daily check and the lead sharing its world.
function careClock(state) {
    const s = state?.simulation, c = s?.checks?.[RESET], gu = s?.people?.[GU];
    if(!c || !gu || !(c.interval > 0) || state.actors?.[GU]?.worldId !== state.actors?.player?.worldId || !Number.isFinite(state.clock)) return null;
    const epoch = c.due - (c.count + 1) * c.interval;
    return {epoch, day: c.interval, window: at => Math.floor((at - epoch) / c.interval)};
}
// The director's run over the care occurrences the lead has seen. Empty outside a Gu annex life.
export function guCareDirected(state) {
    const clock = careClock(state);
    if(!clock) return {run: [], byId: new Map(), clock: null};
    const seen = Object.values(state.simulation.events || {}).filter(e => e.discoveredBy?.includes('player'));
    const rows = seen.filter(e => CATEGORY[e.definitionId]).sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
    const death = seen.find(e => e.definitionId === DEATH), deathWindow = death ? clock.window(death.at) : Infinity;
    const byWindow = new Map(), byId = new Map(rows.map(e => [e.id, e]));
    for(const e of rows) { const w = clock.window(e.at); byWindow.set(w, [...(byWindow.get(w) || []), e]); }
    const hungerIn = w => (byWindow.get(w) || []).filter(e => CATEGORY[e.definitionId] === 'pressure').length;
    const factsAt = w => ({tension: Math.min(1, (hungerIn(w) + hungerIn(w - 1) + hungerIn(w - 2)) / 2), dead: w >= deathWindow});
    const born = w => (byWindow.get(w) || []).map(e => ({id: e.id, kind: e.definitionId, category: CATEGORY[e.definitionId], weight: 1,
        ...(CATEGORY[e.definitionId] === 'pressure' ? {recheck: f => !f.dead} : {})}));
    const upto = Math.max(0, clock.window(state.clock));
    const signature = `${rows.map(e => e.id).join(',')}|${deathWindow}`;
    return {run: runDirector(GU_CARE_DIRECTOR, state.simulation?.seed ?? state.streams?.root ?? 1, upto, born, factsAt, signature), byId, clock};
}
// The feed adapter: the directed care notices as news rows, keeping the generic `simulation:news:<occurrence>` ids. `skip` lists
// the definition ids the feed must leave to this adapter; death and every other occurrence stay on the generic route.
export function guCareNews(state) {
    const {run, byId, clock} = guCareDirected(state);
    if(!clock) return {skip: new Set(), news: []};
    const news = run.filter(o => o.surfaced).map(o => {
        const e = byId.get(o.surfaced.id);
        return {id: `simulation:news:${e.id}`, at: o.surfaced.born < o.window ? clock.epoch + o.window * clock.day : e.at, text: e.label, why: whyLine(o.receipt, GU_WHY_WORDS)};
    });
    return {skip: new Set(GU_DIRECTED), news};
}
