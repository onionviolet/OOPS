// Fang Yuan's ordinary day (lead core-flow audit, ordinary-day round, 2026-11-14; proposal under AD32). Pure: the diet table for the
// Gu his own life holds, and the facts its day extension (world_packs/book_gu_lead_day.js) reads. Hunger is read through the one
// needs seam via living_upkeep (LVR13): the time since a Gu's last meal is the `at` of the knowledge note its feed command writes,
// so nothing here ticks or saves. A Gu never fed through the day extension reads as due and hungry: its next meal is the first
// thing the day asks for (dial: an anchor at adoption instead).
import {validateDiet, dietNeed} from './living_upkeep.js';
import {APERTURE_LAW, apertureGrade} from './gu_aperture.js';
import {readSpoilage} from './spoilage.js';
import {detectGuApproach} from './gu_senses.js';

export const RI_LEAD_DAY = 'book.ri.lead.day';
export const RI_DAILY_POWERS = 'book.ri.lead.daily_powers';
export const RI_ACADEMY_ELDER = 'book.ri.lead.academy_elder';
export const RI_MOONGLOW_SALE_NOTE = `${RI_DAILY_POWERS}.sale`;
const key = id => JSON.stringify({id});
const DAY = 1440;
// Item ids his own life already uses (the story continuations own them; this module only reads and spends them).
export const RI_DAY_ITEMS = Object.freeze({
    petals: 'book.ri.lead.dorm.petals', wine: 'book.ri.lead.vital.bamboo_wine', stone: 'book.ri.lead.refinement.primeval_stone',
    merit: 'book.ri.lead.ear_grass.merit', eye: 'book.ri.lead.ear_grass.cached_wolf_eyes', jade: `${RI_LEAD_DAY}.jade_rock`, wildGu: `${RI_LEAD_DAY}.wild_gu`,
    pelt: `${RI_LEAD_DAY}.wolf_pelt`, meat: `${RI_LEAD_DAY}.wolf_meat`, tally: `${RI_LEAD_DAY}.watch_tally`,
    moonglow: 'book.ri.lead.moonglow.moonglow_gu', wildMoonlight: 'book.ri.lead.wild_refinement.moonlight_gu', worm: 'book.ri.lead.river_toad.four_flavours_liquor_worm', whiteJade: 'book.ri.lead.white_jade.white_jade_gu'});
// Diets, one row per Gu that eats. `basis` says where each number comes from (AD49) and stays in code; `say` is the player's words (PRS1): canon figures are fixed points; a Gu whose diet
// the source does not state eats like the Gu it was made from (dial: replace the row when a later reading finds the figure).
export const RI_DAY_DIETS = Object.freeze([
    Object.freeze({slot: 'moonglow', label: 'Moonglow Gu', gu: RI_DAY_ITEMS.moonglow, food: RI_DAY_ITEMS.petals, foodLabel: 'Moon Orchid petals', perMeal: 2, interval: DAY / 2,
        basis: 'Moonlight Gu eats two petals a meal, morning and evening (ch23). Moonglow is made from Moonlight and its food is unstated, so it eats the same (authored).',
        say: 'Made from a Moonlight Gu, it eats like one: two petals a meal, morning and evening.',
        fedLine: 'It will want petals again this evening or tomorrow morning.'}),
    // A Moonlight Gu refined from a patrol find (ri_wild_gu.js riWildGuItem('moonlight'); the wild-refinement pack owns the item).
    Object.freeze({slot: 'wild_moonlight', label: 'Moonlight Gu (wild)', gu: RI_DAY_ITEMS.wildMoonlight, food: RI_DAY_ITEMS.petals, foodLabel: 'Moon Orchid petals', perMeal: 2, interval: DAY / 2,
        basis: 'Moonlight Gu eats two petals a meal, morning and evening (ch23).',
        say: 'A Moonlight Gu eats two petals a meal, morning and evening.', fedLine: 'It will want petals again this evening or tomorrow morning.'}),
    Object.freeze({slot: 'worm', label: 'Four Flavours Liquor Worm', gu: RI_DAY_ITEMS.worm, food: RI_DAY_ITEMS.wine, foodLabel: 'jar of green bamboo wine', perMeal: 1, interval: 4 * DAY,
        basis: 'One jar of green bamboo wine lasts a Liquor Worm four days (ch23). The fused worm\'s food is unstated, so it keeps the same jar (authored).',
        say: 'Like any Liquor Worm, it drinks a jar of green bamboo wine every four days.',
        fedLine: 'The jar will last it four days.'}),
    Object.freeze({slot: 'jade', label: 'White Jade Gu', gu: RI_DAY_ITEMS.whiteJade, food: RI_DAY_ITEMS.jade, foodLabel: 'parcel of jade rock (eight liang)', perMeal: 1, interval: 20 * DAY,
        basis: 'Eight liang of jade rock every twenty days (the White Jade Gu item text, ch98-100). One parcel of eight liang is one meal.',
        say: 'It eats eight liang of jade rock every twenty days, one parcel a meal.',
        fedLine: 'That parcel lasts it twenty days.'})
].map(d => Object.freeze({...d, fed: `${RI_LEAD_DAY}.fed.${d.slot}`, diet: Object.freeze(validateDiet({holder: `${RI_LEAD_DAY}.${d.slot}`, label: d.label,
    food: key(d.food), perMeal: d.perMeal, interval: d.interval, maxCondition: 4, flag: `${RI_LEAD_DAY}.${d.slot}.kept`, lethal: false}))})));
// `food` and `gu` stay plain item ids (the commands encode them); `diet` is the living_upkeep row the needs seam reads.
// Compatibility: these numbers and the diet text reach the day extension's labels, so they are part of its content hash. Changing one
// strands saves that adopted the extension ("Restore the exact school extension content"); pair a change with a revision bump and an
// identityAliases row, or state the break (old saves are disposable). See the lead core-flow audit, ordinary-day build.
// Prices and yields, each with its reason. Canon: petals and wine (ch12, ch23), merit exchange and the wolf eye (ch127, ch132).
// Authored: jade rock, the stone's parts, the patrol and its encounters.
// Each dial: `why` is the source or authoring note (code only); `say` is what the player reads (PRS1).
export const RI_DAY_DIALS = Object.freeze({
    petalBag: Object.freeze({count: 10, stones: 1, why: 'Ten petals for one stone (ch23).', say: 'The stalls sell ten petals for a stone.'}),
    wineJar: Object.freeze({stones: 2, why: 'A jar of green bamboo wine is two stones (ch12, ch23).', say: 'The tavern asks two stones a jar.'}),
    jadeParcel: Object.freeze({stones: 6, why: 'Authored: the source gives no price. Six stones keeps the White Jade the dearest mouth over twenty days without rivalling the petals\' daily cost.', say: 'The stone dealer asks six stones for a parcel.'}),
    stoneParts: Object.freeze({parts: 30, minutes: 30, why: 'His own story draws fifteen parts from a stone and calls it half drawn (assessment and caravan items), so a whole stone holds about thirty parts. Thirty minutes keeps the story\'s pace of fifteen parts in fifteen.', say: 'A whole stone holds about thirty parts, drawn in half an hour.'}),
    meritPerStone: Object.freeze({merit: 25, why: '25 battle merit buys a primeval stone on the alliance board (ch127).', say: 'The alliance board gives a primeval stone for 25 battle merit.'}),
    eyeMerit: Object.freeze({merit: 10, why: 'A lightning wolf eye is worth ten merit (ch132). Eyes at the board are how the clan credits wolf-tide kills (ch127).', say: 'The board pays ten merit for each lightning wolf eye; eyes are how the clan counts wolf-tide kills.'}),
    tallyMerit: Object.freeze({merit: 10, why: 'Authored: a watch tally is the captain’s word that you stood in a shared fight. The board pays it like one eye, the share of a kill you did not finish yourself.', say: 'The board pays a tally like one eye, your share of a kill you did not finish yourself.'}),
    peltSale: Object.freeze({stones: 1, why: 'Authored: the source gives no price for a lightning wolf hide. One stone, a day and a half of petals: worth carrying home, not worth hunting for.', say: 'The leather seller pays a stone a hide: worth carrying home, not worth hunting for.'}),
    meatSale: Object.freeze({jin: 6, stones: 1, why: 'Authored: rice is five merit a jin at the board (ch132); wolf meat is tough and plentiful in a wolf tide, so the village kitchens give a stone for six jin.', say: 'Wolf meat is tough and plentiful in a wolf tide, so the kitchens give a stone for six jin.'}),
    patrol: Object.freeze({parts: 15, minutes: 180, restMinutes: 360, why: 'Authored: a watch on the outer wall takes up to fifteen parts, the most a heavy night costs; what the night did not use returns when you report.', say: 'A watch takes up to fifteen parts of essence, what a heavy night costs; what the night did not use comes back when you report.'}),
    carry: Object.freeze({pelt: 1, meat: 6, why: 'Authored: one man walking the wall carries every eye he cut, one hide and about six jin of meat; the rest of the night’s kill goes to the watch’s kitchen.'})
});
// What comes out of the trees on a patrol: one seeded draw when you report to the board (the engine's outcome draw, from the save's
// seed). Weibao 2026-11-14: "Rather than merit immediately it could be like part of the wolf drops and then I can trade that in for merit
// or something". A row says what happened: how many dead wolves you took parts from (`wolves`, of which `large`), which parts survived
// (`keep`, for carcasses left too long) and how many watch tallies the captain gave for shared kills. What a dead wolf yields is not here:
// ri_wolf_tide.js owns the wolves and their parts (RI_WOLF_PARTS, riWolfParts; PS2, RWT1), and the day extension multiplies them out,
// capped by what one man carries (RI_DAY_DIALS.carry). Merit is written only by the board hand-ins (PS3). Authored weights (dial: per row;
// the wall's population can scale them later, riEncounterWeights). `back` is the essence that returns. `fight` marks the rows the live hunt
// replaces (RI_PATROL_FIGHT_ROWS); until then each is a compressed routine (ACR1). About 1.6 eyes, two thirds of a hide, four jin of meat
// and 0.6 tallies a night: some 55 merit's worth before a wolf at the wall is settled.
export const RI_PATROL_ENCOUNTERS = Object.freeze([
    Object.freeze({id: 'quiet', weight: 20, back: 10, wolves: 2, line: 'A quiet watch. Two stray wolves came out of the trees and the Moonglow took both.'}),
    Object.freeze({id: 'small_pack', weight: 28, back: 5, wolves: 2, tallies: 1, line: 'A small pack of five tested the wall. You cut down two; the watch finished two more, and the captain gave you a tally for your share.'}),
    Object.freeze({id: 'large_pack', weight: 12, back: 0, wolves: 3, large: 1, tallies: 2, line: 'A pack of a dozen came at the wall with a big lightning wolf leading. Your sea ran dry before they turned; the leader was one of yours, and the captain gave you tallies for the kills you shared.'}),
    Object.freeze({id: 'carcasses', weight: 12, back: 8, wolves: 2, keep: Object.freeze(['eye']), line: 'Little came out tonight, but two carcasses lay where an earlier patrol left them. The hides and meat had spoiled; the eyes were still good.'}),
    Object.freeze({id: 'wild_gu', weight: 4, back: 8, wildGu: 1, line: 'In the brush under the wall something small glowed and did not run. A wild Gu, unrefined.'}),
    Object.freeze({id: 'injured', weight: 8, back: 0, wolves: 1, injured: true, line: 'A wolf got under your blade and opened your arm. You killed it, but you need to bind the cut and rest before going out again.'}),
    Object.freeze({id: 'met_scout', weight: 8, back: 5, tallies: 1, line: 'A scout from another clan’s patrol shared your stretch of the wall and talked more than he should have about their losses. The captain gave you a tally for the wolf you turned together.'}),
    Object.freeze({id: 'wolf_attack', weight: 8, back: 0, fight: true, line: 'A lightning wolf leapt the wall and is still out there, circling under the lamps. Face it, or let the watch drive it off.'})
]);
export const RI_PATROL_FIGHT_ROWS = Object.freeze(RI_PATROL_ENCOUNTERS.filter(r => r.fight).map(r => r.id));
// A fight row leaves a wolf at the wall (actor fact below). It is settled either by the live hunt (tempo_lead_fights.js, opener
// ri.wolf.tide, which reads `wolf_waiting` and clears the fact) or by the compressed fallback in the day extension, "Let the watch drive it
// off". A kill drops the wolf's parts (RI_WOLF_PARTS in ri_wolf_tide.js, as items RI_WOLF_PART_ITEMS); a drive-off, a held-back or a fled
// wolf brings back no parts, only one watch tally (`tally`), which the board pays `witnessedMerit` for.
export const RI_WOLF_AT_WALL = Object.freeze({fact: `${RI_LEAD_DAY}.wolf_at_wall`, tally: RI_DAY_ITEMS.tally, witnessedMerit: RI_DAY_DIALS.tallyMerit.merit});
// The day's item for each part name in RI_WOLF_PARTS (ri_wolf_tide.js owns the parts and their counts; this owns the items).
export const RI_WOLF_PART_ITEMS = Object.freeze({eye: RI_DAY_ITEMS.eye, pelt: RI_DAY_ITEMS.pelt, meat: RI_DAY_ITEMS.meat});
// Meat is one shared lot (spoilage.js PERISHABLE_LOTS): its clock starts at the `at` of the last note under RI_MEAT_NOTE, written by
// whatever brings meat back (a patrol report, the hunt's after-hook). Spoiled meat stays meat (ITM22); it cannot be sold, only thrown
// out. Dial: the lot's life. Gap: fresh meat added to a spoiled lot restarts the whole lot's clock.
export const RI_MEAT_NOTE = `${RI_LEAD_DAY}.meat_got`;
export const riMeatState = (state, at = state?.simulation?.knowledge?.player?.[RI_MEAT_NOTE]?.at) =>
    Number.isFinite(at) ? readSpoilage(JSON.stringify({id: RI_DAY_ITEMS.meat}), Math.max(0, state.clock - at)) : null;
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
    out[`${RI_LEAD_DAY}.wolf_waiting`] = a.facts?.[RI_WOLF_AT_WALL.fact] === true;
    out[`${RI_LEAD_DAY}.meat_fresh`] = riMeatState(state)?.state !== 'spoiled';
    const elder = state.simulation?.people?.[RI_ACADEMY_ELDER];
    const here = state.simulation?.people?.player?.location;
    // The kitchen cut is an exposed Moonblade. Only the elder's reachable
    // sight counts while he is here in this life.
    out[`${RI_DAILY_POWERS}.seen`] = !!here && elder?.life === 'alive' && elder.location === here &&
        state.actors[RI_ACADEMY_ELDER]?.worldId === a.worldId &&
        detectGuApproach({senses: {sight: {reach: 1}}}) === 'sight';
    for(const d of RI_DAY_DIETS) {
        const n = riDayNeed(d, known[d.fed]?.at, state.clock);
        out[`${RI_LEAD_DAY}.${d.slot}.due`] = n.stage !== 'fed';
        out[`${RI_LEAD_DAY}.${d.slot}.hungry`] = n.stage === 'hungry' || n.stage === 'starved';
    }
    return out;
}
export const riDayNeed = (row, fedAt, clock) => dietNeed(row.diet, Number.isFinite(fedAt) ? Math.max(0, clock - fedAt) : null);
