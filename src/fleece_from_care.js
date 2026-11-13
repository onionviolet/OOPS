// FRC56 / CPR23 produce from care (proposal under AD56). The meadow sheep's fleece reads three things other owners keep:
// its keeper tie (derived from the pen's own care counters, no friendship store), its mood (the sum of its own thought rows in
// mood_thoughts, no mood store) and whether it was fed (the needs seam). Pure: no clock, no save slice, no native writes.
//
// Calibration (SKR21): Stardew's stated deluxe-produce roll, from the decoded FarmAnimalData schema
// (docs/research/stardew-valley/ANIMAL_CARE_DIGEST.md A2):
//   happiness > 200 -> modifier = happiness * 1.5; > 100 -> 0; else happiness - 100
//   chance = (friendship + modifier) / 1200, with friendship >= 200 required for the deluxe item
// Adaptations, with reasons:
// - Friendship 0..1000 is the keeper tie: 15 per brushing (Stardew's petting chore) and 5 per hay meal. Stardew's per-day gains
//   are a capture gap; these are authored so a steadily kept sheep reaches the 200 gate in about ten care cycles.
// - Happiness 0..255 is 100 plus 8 per point of running mood. A thought runs a few care intervals, not days, because one pen
//   ration is 12 played minutes; day-long rows would stack to the cap and pin every sheep at warm.
// - Sheep have no deluxe item in Stardew. Here the same chance sets the fleece grade (plain to 150) and the deluxe roll adds
//   two locks of wool ("a dense fleece"). Neglect never takes the fleece below plain: a missed meal is cheap and nothing
//   declines on its own (AD55); an ignored sheep simply gives ordinary wool.
// - No friendship decay (Stardew drops it for an unfed or unpetted animal): AD55, and Weibao's "a missed day is cheap".
import {drawFraction} from './gen_kit.js';
import {readNeed} from './needs.js';

export const FLEECE = Object.freeze({
    divisor: 1200, deluxeMinimum: 200, maxFriendship: 1000, perBrush: 15, perMeal: 5,
    happinessBase: 100, perMoodPoint: 8, maxHappiness: 255,
    base: 5, deluxeBonus: 2, plain: 100, top: 150, step: 5,
    // Thought rows the pen writes about the keeper, in care rations (one ration = 12 played minutes for the sheep).
    thoughts: Object.freeze({
        fed: Object.freeze({magnitude: 3, rations: 3, line: 'Ate fresh hay from your hand.'}),
        brushed: Object.freeze({magnitude: 4, rations: 3, line: 'Was brushed and checked over by you.'}),
        sheltered: Object.freeze({magnitude: 1, rations: 3, line: 'Slept dry in its shelter.'}),
        hungry: Object.freeze({magnitude: -2, cap: 3, rations: 2, line: 'Went hungry before you came back with hay.'})
    })
});
export const WOOL_ID = 'Wool';
export const SHEEP_HOLDER = 'meadow.fleece_sheep';
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const natural = v => Number.isSafeInteger(v) && v >= 0;

// The keeper tie in Stardew friendship points, read from the pen's counters (one authority per fact, AR3).
export const keeperTie = owner => !owner?.animal ? 0 :
    Math.min(FLEECE.maxFriendship, FLEECE.perBrush * (owner.attentions || 0) + FLEECE.perMeal * (owner.feeds || 0));
export const happinessOf = moodTotal => clamp(Math.round(FLEECE.happinessBase + FLEECE.perMoodPoint * (moodTotal || 0)), 0, FLEECE.maxHappiness);
// Stardew's three branches, as stated in the schema comment.
export const happinessModifier = h => h > 200 ? h * 1.5 : h > 100 ? 0 : h - 100;
export const fleeceChance = (friendship, happiness) => clamp((friendship + happinessModifier(happiness)) / FLEECE.divisor, 0, 1);
export const fleeceQuality = chance => Math.min(FLEECE.top, FLEECE.plain + FLEECE.step * Math.floor(clamp(chance, 0, 1) * 10));
// Plain wool keeps the ordinary key, so it stacks with bought wool; finer wool is a graded {id, quality} stack (ITM1).
export const fleeceKey = quality => quality <= FLEECE.plain ? JSON.stringify({id: WOOL_ID}) : JSON.stringify({id: WOOL_ID, quality});
export const isWoolKey = key => { try { return JSON.parse(key).id === WOOL_ID; } catch { return false; } };
export const gradeWord = quality => quality >= 140 ? 'prime' : quality >= 125 ? 'fine' : quality > FLEECE.plain ? 'good' : 'plain';

// The fleece a batch gives now. `mood` is moodOf(...) for the sheep; `draw` is the batch's keyed fraction (fleeceDraw).
export function readFleece({owner, mood, draw}) {
    const friendship = keeperTie(owner), total = mood?.total ?? 0, happiness = happinessOf(total);
    const modifier = happinessModifier(happiness), chance = fleeceChance(friendship, happiness), quality = fleeceQuality(chance);
    const gate = friendship >= FLEECE.deluxeMinimum, deluxe = gate && Number.isFinite(draw) && draw < chance;
    const amount = FLEECE.base + (deluxe ? FLEECE.deluxeBonus : 0);
    const why = [
        `Tie to you: ${friendship}/${FLEECE.maxFriendship} from ${owner?.attentions || 0} brushings and ${owner?.feeds || 0} meals.`,
        `Mood ${total > 0 ? '+' : ''}${total} (${mood?.band ?? 'even'}): happiness ${happiness}/${FLEECE.maxHappiness}${modifier > 0 ? ', content enough to help' : modifier < 0 ? ', unhappy enough to hurt' : ''}.`,
        `Chance of a dense fleece ${Math.round(chance * 100)}%${gate ? '' : `; it needs a tie of ${FLEECE.deluxeMinimum} first`}.`
    ];
    return {friendship, happiness, modifier, chance, quality, grade: gradeWord(quality), deluxe, amount, key: fleeceKey(quality), why};
}
// One reproducible draw per batch: the pen and its batch count, so a reload or import cannot reroll it.
export const fleeceDraw = owner => drawFraction('meadow_pen.fleece', `${owner.site.id}:${owner.builtAt}:${owner.collected}`);

// Thought rows a care action writes, about the keeper. `before` is the pen as it was, `after` as planned, `ration` the sheep's
// ration in minutes. Keyed by the pen event so a replayed action is a no-op in mood_thoughts.
export function careThoughts(before, after, action, clock, ration) {
    if(!after?.animal || !natural(clock) || !(ration > 0)) return [];
    const T = FLEECE.thoughts, base = `pen:${after.builtAt}`;
    const row = (source, t, magnitude = t.magnitude) => ({holder: SHEEP_HOLDER, subject: 'player', source, magnitude,
        minutes: t.rations * ration, line: t.line, key: `${base}:${source}:${source === 'brushed' ? after.attentions : after.feeds}`});
    if(action === 'attend') return [row('brushed', T.brushed)];
    if(action !== 'feed') return [];
    const out = [row('fed', T.fed)];
    if(after.site?.sheltered) out.push(row('sheltered', T.sheltered));
    // The needs seam says how many rations the sheep went without since its last meal; the next feeding reveals the gap.
    const last = before?.lastMealAt;
    if(natural(last)) {
        const need = readNeed({body: 'sheep', sinceMeal: clock - last});
        if(need.missed > 0) out.push(row('hungry', T.hungry, T.hungry.magnitude * Math.min(T.hungry.cap, need.missed)));
    }
    return out;
}
