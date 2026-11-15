// The wolves behind Fang Yuan's wolf tide (foundation run 2026-11-14; engine-only, consumers pending: the day lane's patrol and the
// combat lane's hunt opener). Pure: a creature table for the Gu Yue outer wall (creature_populations.js), the patrol weights it implies
// and the wolf a fight meets. The population lives in one actor fact as JSON, the way frontier_bow.js keeps its meadow (no save slice):
// no fact means the wall's woods are full. Every number is a dial with its reason; counts and refill are authored.
import {defineCreatureTable, createPopulationState, validatePopulationState, populationAt, recordKill, populationLine} from './creature_populations.js';
import {drawFraction} from './gen_kit.js';
import {RI_PATROL_ENCOUNTERS} from './ri_lead_day_facts.js';

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
    const view = riWolfTideView(state), o = share(view, RI_WOLF_SPECIES.ordinary), l = share(view, RI_WOLF_SPECIES.large);
    const scale = {ordinary: o, large: l, any: Math.max(o, l), thin: 2000 - o, none: 1000};
    return Object.fromEntries(RI_PATROL_ENCOUNTERS.map(row => [row.id, Math.round(row.weight * scale[RI_PATROL_SCALING[row.id] ?? 'none'] / 1000)]));
}

// The wolf a fight at the wall meets. The size is the combat lane's keyed draw (same seed and hour, same wolf on a replay); a big wolf can
// only come while big wolves are left at the wall, and an ordinary one stands in once they are hunted out.
export function riWolfFoe(state) {
    const hour = Math.floor((state?.clock || 0) / 60);
    const drawn = drawFraction(seedOf(state), `ri.wolf.tide:size:${hour}`) < D.largeChance.value;
    const largeLeft = riWolfTideView(state).rows.find(r => r.id === RI_WOLF_SPECIES.large).left > 0;
    const large = drawn && largeLeft;
    return {large, species: large ? RI_WOLF_SPECIES.large : RI_WOLF_SPECIES.ordinary,
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
