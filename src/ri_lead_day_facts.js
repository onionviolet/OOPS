// Fang Yuan's ordinary day (lead core-flow audit, ordinary-day round, 2026-11-14; proposal under AD32). Pure: the diet table for the
// Gu his own life holds, and the facts its day extension (world_packs/book_gu_lead_day.js) reads. Hunger is read through the one
// needs seam via living_upkeep (LVR13): the time since a Gu's last meal is the `at` of the knowledge note its feed command writes,
// so nothing here ticks or saves. A Gu never fed through the day extension reads as due and hungry: its next meal is the first
// thing the day asks for (dial: an anchor at adoption instead).
import {validateDiet, dietNeed} from './living_upkeep.js';
import {APERTURE_LAW, apertureGrade} from './gu_aperture.js';

export const RI_LEAD_DAY = 'book.ri.lead.day';
const key = id => JSON.stringify({id});
const DAY = 1440;
// Item ids his own life already uses (the story continuations own them; this module only reads and spends them).
export const RI_DAY_ITEMS = Object.freeze({
    petals: 'book.ri.lead.dorm.petals', wine: 'book.ri.lead.vital.bamboo_wine', stone: 'book.ri.lead.refinement.primeval_stone',
    merit: 'book.ri.lead.ear_grass.merit', eye: 'book.ri.lead.ear_grass.cached_wolf_eyes', jade: `${RI_LEAD_DAY}.jade_rock`, wildGu: `${RI_LEAD_DAY}.wild_gu`,
    moonglow: 'book.ri.lead.moonglow.moonglow_gu', worm: 'book.ri.lead.river_toad.four_flavours_liquor_worm', whiteJade: 'book.ri.lead.white_jade.white_jade_gu'});
// Diets, one row per Gu that eats. `basis` says where each number comes from (AD49): canon figures are fixed points; a Gu whose diet
// the source does not state eats like the Gu it was made from (dial: replace the row when a later reading finds the figure).
export const RI_DAY_DIETS = Object.freeze([
    Object.freeze({slot: 'moonglow', label: 'Moonglow Gu', gu: RI_DAY_ITEMS.moonglow, food: RI_DAY_ITEMS.petals, foodLabel: 'Moon Orchid petals', perMeal: 2, interval: DAY / 2,
        basis: 'Moonlight Gu eats two petals a meal, morning and evening (ch23). Moonglow is made from Moonlight and its food is unstated, so it eats the same (authored).'}),
    Object.freeze({slot: 'worm', label: 'Four Flavours Liquor Worm', gu: RI_DAY_ITEMS.worm, food: RI_DAY_ITEMS.wine, foodLabel: 'jar of green bamboo wine', perMeal: 1, interval: 4 * DAY,
        basis: 'One jar of green bamboo wine lasts a Liquor Worm four days (ch23). The fused worm\'s food is unstated, so it keeps the same jar (authored).'}),
    Object.freeze({slot: 'jade', label: 'White Jade Gu', gu: RI_DAY_ITEMS.whiteJade, food: RI_DAY_ITEMS.jade, foodLabel: 'parcel of jade rock (eight liang)', perMeal: 1, interval: 20 * DAY,
        basis: 'Eight liang of jade rock every twenty days (the White Jade Gu item text, ch98-100). One parcel of eight liang is one meal.'})
].map(d => Object.freeze({...d, fed: `${RI_LEAD_DAY}.fed.${d.slot}`, diet: Object.freeze(validateDiet({holder: `${RI_LEAD_DAY}.${d.slot}`, label: d.label,
    food: key(d.food), perMeal: d.perMeal, interval: d.interval, maxCondition: 4, flag: `${RI_LEAD_DAY}.${d.slot}.kept`, lethal: false}))})));
// `food` and `gu` stay plain item ids (the commands encode them); `diet` is the living_upkeep row the needs seam reads.
// Compatibility: these numbers and the diet text reach the day extension's labels, so they are part of its content hash. Changing one
// strands saves that adopted the extension ("Restore the exact school extension content"); pair a change with a revision bump and an
// identityAliases row, or state the break (old saves are disposable). See the lead core-flow audit, ordinary-day build.
// Prices and yields, each with its reason. Canon: petals and wine (ch12, ch23), merit exchange and the wolf eye (ch127, ch132).
// Authored: jade rock, the stone's parts, the patrol and its encounters.
export const RI_DAY_DIALS = Object.freeze({
    petalBag: Object.freeze({count: 10, stones: 1, why: 'Ten petals for one stone (ch23).'}),
    wineJar: Object.freeze({stones: 2, why: 'A jar of green bamboo wine is two stones (ch12, ch23).'}),
    jadeParcel: Object.freeze({stones: 6, why: 'Authored: the source gives no price. Six stones keeps the White Jade the dearest mouth over twenty days without rivalling the petals\' daily cost.'}),
    stoneParts: Object.freeze({parts: 30, minutes: 30, why: 'His own story draws fifteen parts from a stone and calls it half drawn (assessment and caravan items), so a whole stone holds about thirty parts. Thirty minutes keeps the story\'s pace of fifteen parts in fifteen.'}),
    meritPerStone: Object.freeze({merit: 25, why: '25 battle merit buys a primeval stone on the alliance board (ch127).'}),
    eyeMerit: Object.freeze({merit: 10, why: 'A lightning wolf eye is worth ten merit (ch132).'}),
    patrol: Object.freeze({parts: 15, minutes: 180, restMinutes: 360, why: 'Authored: a watch on the outer wall takes up to fifteen parts, the most a heavy night costs; what the night did not use returns when you report.'})
});
// What comes out of the trees on a patrol: one seeded draw when you report to the board (the engine's outcome draw, from the save's
// seed). Authored weights and yields (dial: per row, and per wolf-tide phase later). A bigger pack pays more merit and keeps more of the
// fifteen parts spent (`back` is what returns). `fight` marks the rows the combat lane can replace with the live fight (hook:
// RI_PATROL_FIGHT_ROWS); until then each is a compressed routine (ACR1). Expected merit is about 49 a patrol (eyes counted at ten), about two stones.
export const RI_PATROL_ENCOUNTERS = Object.freeze([
    Object.freeze({id: 'quiet', weight: 20, merit: 25, back: 10, line: 'A quiet watch. Two stray wolves came out of the trees and the Moonglow took both. 25 merit on the board.'}),
    Object.freeze({id: 'small_pack', weight: 28, merit: 50, back: 5, line: 'A small pack of five tested the wall. You cut down two before they broke off. 50 merit on the board.'}),
    Object.freeze({id: 'large_pack', weight: 12, merit: 100, back: 0, line: 'A pack of a dozen came at the wall with a lightning wolf leading. Your sea ran dry before they turned. 100 merit on the board.'}),
    Object.freeze({id: 'carcasses', weight: 12, merit: 25, back: 8, eyes: 2, line: 'Little came out tonight, but two carcasses lay where an earlier patrol left them. You cut out their eyes. 25 merit, and two eyes kept back.'}),
    Object.freeze({id: 'wild_gu', weight: 4, merit: 25, back: 8, wildGu: 1, line: 'In the brush under the wall something small glowed and did not run. A wild Gu, unrefined. 25 merit on the board.'}),
    Object.freeze({id: 'injured', weight: 8, merit: 25, back: 0, injured: true, line: 'A wolf got under your blade and opened your arm. You finished the watch, but you need to bind it and rest before going out again. 25 merit on the board.'}),
    Object.freeze({id: 'met_scout', weight: 8, merit: 50, back: 5, line: 'A scout from another clan’s patrol shared your stretch of the wall and talked more than he should have about their losses. 50 merit on the board.'}),
    Object.freeze({id: 'wolf_attack', weight: 8, merit: 75, back: 0, injured: true, fight: true, line: 'A lightning wolf leapt the wall and came straight at you. You killed it, though it marked you. 75 merit on the board.'})
]);
export const RI_PATROL_FIGHT_ROWS = Object.freeze(RI_PATROL_ENCOUNTERS.filter(r => r.fight).map(r => r.id));
// Natural recovery: the sea refills on its own at the aptitude's pace (gu_aperture.js holds the stated law: C grade recovers 4 points
// of the aperture an hour, ch10). His pool is measured in points of the aperture (44 at C grade), so a C sea gains one part each
// fifteen minutes. A stone does it faster (about half an hour to the cap, ch10).
export const riSeaMinutesPerPart = aptitude => Math.ceil(60 / apertureGrade(APERTURE_LAW, aptitude).hourlyPoints);
// The facts the day extension's commands read: per Gu, held, due (its meal window is open) and hungry (a meal missed). Absent
// outside his life, so other lives never see them.
export function riLeadDayFacts(state) {
    const a = state?.actors?.player;
    if(!a || a.worldId !== 'book.ri.lead.world') return {};
    const known = state.simulation?.knowledge?.player || {}, out = {};
    // Patrol state as plain booleans (an unset actor fact is unknown to the rule engine, so it could never satisfy "not out").
    out[`${RI_LEAD_DAY}.on_watch`] = a.facts?.[`${RI_LEAD_DAY}.patrol_out`] === true;
    out[`${RI_LEAD_DAY}.hurt`] = a.facts?.[`${RI_LEAD_DAY}.injured`] === true;
    for(const d of RI_DAY_DIETS) {
        const n = riDayNeed(d, known[d.fed]?.at, state.clock);
        out[`${RI_LEAD_DAY}.${d.slot}.due`] = n.stage !== 'fed';
        out[`${RI_LEAD_DAY}.${d.slot}.hungry`] = n.stage === 'hungry' || n.stage === 'starved';
    }
    return out;
}
export const riDayNeed = (row, fedAt, clock) => dietNeed(row.diet, Number.isFinite(fedAt) ? Math.max(0, clock - fedAt) : null);
