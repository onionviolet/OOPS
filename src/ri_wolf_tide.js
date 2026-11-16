// The wolves behind Fang Yuan's wolf tide (foundation run 2026-11-14; engine-only, consumers pending: the day lane's patrol and the
// combat lane's hunt opener). Pure: a creature table for the Gu Yue outer wall (creature_populations.js), the patrol weights it implies
// and the wolf a fight meets. The population lives in one actor fact as JSON, the way frontier_bow.js keeps its meadow (no save slice):
// no fact means the wall's woods are full. Every number is a dial with its reason; counts and refill are authored.
import {defineCreatureTable, createPopulationState, validatePopulationState, populationAt, recordKill, populationLine} from './creature_populations.js';
import {drawFraction} from './gen_kit.js';
import {RI_PATROL_ENCOUNTERS} from './ri_lead_day_facts.js';
import {buildEventBook, standingOn} from './world_events.js';
import {resolveWorldCalendar, calendarDayIndex} from './world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';

export const RI_WOLF_TIDE_WORLD = 'book.ri.lead.world', RI_WOLF_TIDE_PLACE = 'outer_wall';
export const RI_WOLF_TIDE_FACT = 'book.ri.lead.wolf_tide.pop';
export const RI_WOLF_SPECIES = Object.freeze({ordinary: 'ri.lightning_wolf', large: 'ri.lightning_wolf.large', frenzy: 'ri.lightning_wolf.frenzy'});

export const RI_WOLF_TIDE_DIALS = Object.freeze({
    ordinary: Object.freeze({cap: 24, refillPerDay: 6, weight: 10, chance: 1000,
        why: 'Authored: the tide keeps coming while it lasts, so ordinary wolves are always about and a stretch of wall refills in about four days. Packs of five to a dozen (patrol rows) fit inside two dozen.'}),
    large: Object.freeze({cap: 4, refillPerDay: 1, weight: 2, chance: 900,
        why: 'Authored: a pack\'s strong members; the source\'s packs are led by bigger wolves (ch122-123). Fewer and slower to replace.'}),
    frenzy: Object.freeze({cap: 1, refillPerDay: 0, weight: 1, chance: 150,
        why: 'Frenzy lightning wolves carry Thunderclap Gu (ch150). Rare at this stretch of wall and not replaced once killed (dial: refill for a later phase of the tide).'}),
    ordinaryHp: Object.freeze({value: 30, why: 'One ordinary lightning wolf: a patrol meets two (the patrol dial), so one is half a patrol (combat lane\'s wolfHp).'}),
    largeHp: Object.freeze({value: 44, why: 'Authored: half again an ordinary wolf, four clean throws rather than three (combat lane\'s largeHp).'}),
    ordinaryAttack: Object.freeze({value: 5, why: 'Authored: an ordinary wolf\'s bite (combat lane\'s current value).'}),
    largeAttack: Object.freeze({value: 7, why: 'Authored: a big wolf bites harder (combat lane\'s current value).'}),
    largeChance: Object.freeze({value: .2, why: 'Authored: about one wolf in five that comes close is a big one, a pack\'s strong member (ch122-123).'}),
});
const D = RI_WOLF_TIDE_DIALS;

export const RI_WOLF_TIDE = defineCreatureTable({id: 'ri.wolf_tide', revision: 1, places: [{id: RI_WOLF_TIDE_PLACE, name: 'Outer wall', creatures: [
    {id: RI_WOLF_SPECIES.ordinary, name: 'Lightning wolves', weight: D.ordinary.weight, chance: D.ordinary.chance, number: [2, 5], cap: D.ordinary.cap, refillPerDay: D.ordinary.refillPerDay},
    {id: RI_WOLF_SPECIES.large, name: 'Large lightning wolves', weight: D.large.weight, chance: D.large.chance, number: [1, 1], cap: D.large.cap, refillPerDay: D.large.refillPerDay},
    {id: RI_WOLF_SPECIES.frenzy, name: 'Frenzy lightning wolf', weight: D.frenzy.weight, chance: D.frenzy.chance, number: [1, 1], cap: D.frenzy.cap, refillPerDay: D.frenzy.refillPerDay},
]}]});

// RWT25, RWT27 (TMR1, TMR8, TMR13; OD7, OD8): the tide comes round every year as one recurring row in the event book, and its phases
// (early, peak, ebb) are read from the world's calendar, never counted here. Every number is a dial: the source dates the first tide
// to mid-to-late July (lead-run beat 213101) and a second one the same year (214901, "the second wolf tide this year"); its length,
// phases and strength are authored.
export const RI_TIDE_EVENT = 'ri.wolf_tide';
export const RI_TIDE_DIALS = Object.freeze({
    window: Object.freeze({fromYear: 2, month: 7, day: 15, days: 45, phases: Object.freeze([['early', 15], ['peak', 15], ['ebb', 15]]),
        why: 'Beat 213101 puts the first tide in the second year, mid-to-late July, and 216103 has the end of summer after it; the first year shows only a small beast tide in winter (09501). Forty-five days, in three of fifteen, is authored (dial: from year 1, other lengths). The second tide of the year, his first night at the wall (214901), falls in the peak.'}),
});
const tideProfile = WORLD_CALENDAR_PROFILES[RI_WOLF_TIDE_WORLD];
const W = RI_TIDE_DIALS.window;
export const RI_TIDE_BOOK = buildEventBook([{id: RI_TIDE_EVENT, key: 'ri.wolf_tide', kind: 'public_event', placement: 'recurring', scope: 'public', evidence: 'I',
    place: RI_WOLF_TIDE_PLACE, recur: {every: {years: 1}, fromDay: calendarDayIndex(tideProfile, {year: W.fromYear, month: W.month, day: W.day}), durationDays: W.days,
        phaseDays: W.phases.map(([id, days]) => ({id, days}))}}], {calendar: tideProfile});
// What each phase does to the wall: crowd scales the ordinary wolves about, strong the big ones (permille of the table's own weights),
// largeChance is the share of close wolves that are big. `off` is neutral on purpose: the day lane's patrol assumes a wall under tide, so
// a life with no date, or a date outside the window, keeps today's weights (dial: a quiet wall out of season).
export const RI_TIDE_PHASES = Object.freeze({
    off: Object.freeze({crowd: 1000, strong: 1000, largeChance: D.largeChance.value, line: 'The wall is quiet. The packs have gone back up into the mountains.',
        why: 'Neutral by default so the patrol does not change outside a dated tide.'}),
    early: Object.freeze({crowd: 700, strong: 500, largeChance: .1, line: 'The first packs are coming down off the ridge. The wall is not yet crowded.',
        why: 'Authored: a tide builds. Mostly ordinary wolves at first; the strong ones follow the packs in.'}),
    peak: Object.freeze({crowd: 1300, strong: 1500, largeChance: .3, line: 'The tide is at its height. The wolves come thick and the big ones lead them.',
        why: 'Authored: the peak is when the wolf king is about (canon dates the king to the tide; ch122-123 packs are led by large wolves), so more wolves and more big ones.'}),
    ebb: Object.freeze({crowd: 600, strong: 400, largeChance: .1, line: 'The tide is ebbing. Fewer wolves come each night, and the big ones have gone.',
        why: 'Authored: the strong wolves withdraw first; the stragglers are ordinary.'}),
});
// Where the tide stands for this life today: {id: 'off'|'early'|'peak'|'ebb', active, dayInPhase, nextDay, year}. Reads the world calendar
// (a life with no date reads 'off'); consumers (patrol weights, prices, mood lines) read this one answer, never the calendar themselves.
export function riWolfTidePhase(state) {
    let view = null;
    try {view = state?.actors?.player?.worldId === RI_WOLF_TIDE_WORLD ? resolveWorldCalendar(state, null) : null;} catch {view = null;}
    if (!view) return {id: 'off', active: false, dayInPhase: 0, nextDay: null, year: null, dated: false};
    const at = standingOn(RI_TIDE_BOOK, RI_TIDE_EVENT, view.absoluteLocalDay);
    return {id: at.active ? at.phase.id : 'off', active: at.active, dayInPhase: at.phase?.dayInPhase ?? 0, nextDay: at.nextDay ?? null, year: view.year, dated: true,
        startDay: at.active ? at.day : null}; // the occurrence's first day, a key for this tide (ri_tide_ledger.js)
}
export const riWolfTidePhaseLine = phase => RI_TIDE_PHASES[phase?.id ?? 'off'].line;

const seedOf = state => state?.simulation?.seed ?? 1;
export function riWolfTideState(state) {
    const raw = state?.actors?.player?.facts?.[RI_WOLF_TIDE_FACT];
    return raw ? validatePopulationState(JSON.parse(raw), RI_WOLF_TIDE, RI_WOLF_TIDE_WORLD) : createPopulationState();
}
export const riWolfTideView = state => populationAt(RI_WOLF_TIDE, riWolfTideState(state),
    {root: seedOf(state), world: RI_WOLF_TIDE_WORLD, place: RI_WOLF_TIDE_PLACE, at: state?.clock ?? 0});
export const riWolfTideLine = (state, species = RI_WOLF_SPECIES.ordinary) => populationLine(riWolfTideView(state), species);

// One wolf killed at the wall. Returns the JSON string for RI_WOLF_TIDE_FACT; the caller stores it beside its other facts so the kill and
// the count commit together. Nothing is touched here. A kill when the counted pool is empty changes nothing: that wolf came from deeper
// in the tide than this stretch of wall counts.
export function riRecordWolfKill(state, {large = false, n = 1, at = state?.clock ?? 0} = {}) {
    const species = large ? RI_WOLF_SPECIES.large : RI_WOLF_SPECIES.ordinary;
    const pop = riWolfTideState(state);
    const left = populationAt(RI_WOLF_TIDE, pop, {root: seedOf(state), world: RI_WOLF_TIDE_WORLD, place: RI_WOLF_TIDE_PLACE, at})
        .rows.find(row => row.id === species).left;
    const taken = Math.min(n, left);
    return JSON.stringify(taken > 0 ? recordKill(RI_WOLF_TIDE, pop, {world: RI_WOLF_TIDE_WORLD, place: RI_WOLF_TIDE_PLACE, species, n: taken, at}) : pop);
}

// Share of a species still about at the wall today, in permille (0 when it is not about or is hunted out).
const share = (view, species) => {
    const row = view.rows.find(r => r.id === species);
    return row.present ? Math.round(1000 * row.left / row.cap) : 0;
};
// The patrol rows' weights given who is left at the wall. Wolf rows scale with the wolves about; when the wall is thinned the quiet watch
// grows to take their place; finds and the scout do not depend on wolves. Integer weights keyed by RI_PATROL_ENCOUNTERS ids.
// Authored scaling (dial: per row). A full wall returns the static weights unchanged.
export const RI_PATROL_SCALING = Object.freeze({
    quiet: 'thin', small_pack: 'ordinary', large_pack: 'large', injured: 'any', wolf_attack: 'any', carcasses: 'none', wild_gu: 'none', met_scout: 'none',
});
export function riEncounterWeights(state) {
    const view = riWolfTideView(state), tide = RI_TIDE_PHASES[riWolfTidePhase(state).id];
    const o = Math.round(share(view, RI_WOLF_SPECIES.ordinary) * tide.crowd / 1000), l = Math.round(share(view, RI_WOLF_SPECIES.large) * tide.strong / 1000);
    const scale = {ordinary: o, large: l, any: Math.max(o, l), thin: 2000 - o, none: 1000};
    return Object.fromEntries(RI_PATROL_ENCOUNTERS.map(row => [row.id, Math.round(row.weight * scale[RI_PATROL_SCALING[row.id] ?? 'none'] / 1000)]));
}

// The wolf a fight at the wall meets. The size is the combat lane's keyed draw (same seed and hour, same wolf on a replay); a big wolf can
// only come while big wolves are left at the wall, and an ordinary one stands in once they are hunted out.
export function riWolfFoe(state) {
    const hour = Math.floor((state?.clock || 0) / 60);
    const phase = riWolfTidePhase(state), tide = RI_TIDE_PHASES[phase.id];
    const drawn = drawFraction(seedOf(state), `ri.wolf.tide:size:${hour}`) < tide.largeChance;
    const largeLeft = riWolfTideView(state).rows.find(r => r.id === RI_WOLF_SPECIES.large).left > 0;
    const large = drawn && largeLeft;
    return {large, phase: phase.id, species: large ? RI_WOLF_SPECIES.large : RI_WOLF_SPECIES.ordinary,
        hp: large ? D.largeHp.value : D.ordinaryHp.value, attack: large ? D.largeAttack.value : D.ordinaryAttack.value,
        why: large ? `${D.largeChance.why} ${D.largeHp.why}` : drawn ? 'A big wolf would have come, but the big wolves at this stretch of wall are hunted out for now.' : D.ordinaryHp.why};
}

// What one dead wolf yields (PS2: this table owns the wolf and its parts; Weibao 2026-11-14 "part of the wolf drops and then I can trade
// that in for merit"). Part names only: the day lane owns the item ids, the hand-in and selling; the combat lane's after-hook drops them.
// The eye is the proof the alliance board pays for (ten merit an eye, ch132); every other part is something to sell, eat or keep.
// Counts are authored dials (AD49 source check of how the clan credits kills still open); a large wolf gives more pelt and meat.
export const RI_WOLF_PARTS = Object.freeze({
    eye: Object.freeze({ordinary: 1, large: 1, proof: true,
        why: 'The board pays per eye handed in (ch132). One eye a wolf is the authored default: the other is usually ruined in the kill (dial: 2).'}),
    pelt: Object.freeze({ordinary: 1, large: 1, why: 'Authored: one hide a wolf; a large wolf\'s is bigger, not more (its worth is the day lane\'s price dial).'}),
    meat: Object.freeze({ordinary: 6, large: 9, unit: 'jin', why: 'Authored: usable meat in jin, half again for a large wolf; it spoils within days (the day lane\'s spoil dial).'}),
});
export function riWolfParts(foe = {}) {
    const size = foe.large ? 'large' : 'ordinary';
    return Object.fromEntries(Object.entries(RI_WOLF_PARTS).map(([part, row]) => [part, row[size]]));
}
