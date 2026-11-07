// Frontier job for hired_hands.js: a villager tends the Village courtyard plot (MG06 facts on the player actor) for a weekly wage.
// The plot's facts (mg.cropStage, mg.cropType) stay the one authority; the hire itself lives in the hired_hands slice. The player's own commands stay available
// (a missing fact cannot gate a rule without a save migration), so the hand yields only for a crop still standing in the bed (no double harvest) and never sows over the player's crop.
// Real inputs only (AD38, MG06 "creates no seeds or food"): every cycle takes one seed packet from the player's stock; the harvest goes into the player's stock.
// The crop goes to storage. A standing sell order (W11-E, OB12) sells grain above a count to the Village market on the clock, at the market's own saturated
// price; see sellSurplus. It does not use Bram's finite purse: his purse is an authored, validated resident balance (management/validation.js), the market is not.
import {registerHandJob} from './hired_hands.js';
import {I, K} from './management/shared.js';
import {loot_sold_count, get_loot_price_multiple, calculate_total_saturation, capped_at} from './market_saturation.js';
export const PLOT_JOB = 'frontier.courtyard_plot';
// Sell-order dials (OB12). The grain's base value is the management item's own (foundation.js 'Courtyard grain', 3).
export const SELL_DIALS = Object.freeze({
    suggestedAbove: {value: 10, why: 'Two full grain cycles (5 portions each) stay in the store for Mira\'s meals and gatherings, which each use a real portion; only a pile beyond that is surplus.'},
    minPriceShare: {value: .5, why: 'The market buys at its saturated price, but a village does not take a whole pile at any price: below half the base value the order holds the rest rather than dump it, and the market recovers.'},
    region: {value: 'Village', why: 'The courtyard sits in the Village market region; its sold counts are the saturation the player\'s own sales also move.'}
});
const GRAIN = Object.freeze({group: 'Courtyard grain', value: 3, tier: 0, word: 'grain'});
const DAY = 1440;
// Dials. Days one crop takes under a hand: by hand it is 6 played minutes of growing, but a hand keeps their own day and stamina (ACR10),
// so one bed is one crop at a time, grain slower than greens. Yield matches the player's own harvest commands.
export const HAND_CROPS = Object.freeze({grain: {days: 3, yield: 5, key: K.grain, word: 'grain'}, greens: {days: 2, yield: 3, key: K.greens, word: 'greens'}});
// Pace multiplies the days (lower is quicker). Wage is coins a week, paid ahead: Sela is steady and cheap; Orin is quick and wants the bench time paid for.
export const HAND_CANDIDATES = Object.freeze([
    {id: I.sela, name: 'Sela', wage: 5, pace: 1, crops: ['grain', 'greens'], line: 'She will keep the bed turning at her own steady pace.'},
    {id: I.orin, name: 'Orin', wage: 8, pace: 2 / 3, crops: ['grain', 'greens'], line: 'He is quick with the bed, but he is leaving his bench for it.'}]);
export const cycleMinutes = rec => Math.max(DAY, Math.round(HAND_CROPS[rec.crop].days * DAY * rec.pace));
const facts = plan => plan.state.actors.player.facts;
const inv = plan => (((plan.gameplay ||= {}).player ||= {}).inventory ||= {});
const have = (plan, key) => (inv(plan)[key] || 0);
const take = (plan, key, n) => { const i = inv(plan); i[key] = (i[key] || 0) - n; if (i[key] <= 0) delete i[key]; };
const give = (plan, key, n) => { const i = inv(plan); i[key] = (i[key] || 0) + n; };
const sync = (plan, rec) => { // the bed's facts always show where the crop really is
    const f = facts(plan);
    if (rec.cycleAt != null) { f['mg.cropStage'] = 'tended'; f['mg.cropType'] = rec.crop; }
    else if (f['mg.cropStage'] !== 'harvested') f['mg.cropStage'] = 'harvested';
};
function tendPlot(plan, rec, from, to, tally) {
    const c = HAND_CROPS[rec.crop], len = cycleMinutes(rec);
    let guard = 0;
    const stage = facts(plan)['mg.cropStage'], playerCrop = stage === 'planted' || stage === 'tended' || stage === 'ready';
    let standing = rec.cycleAt == null || playerCrop; // the hand's own crop is still in the bed (the player did not take it)
    if (rec.cycleAt == null) {
        if (playerCrop) { sync(plan, rec); return; } // the player sowed it first: the bed is busy, the hand waits for it to come in
        if (to > from && have(plan, K.seed) > 0) { take(plan, K.seed, 1); rec.cycleAt = to; } else { tally.noSeed = true; sync(plan, rec); return; }
    }
    while (rec.cycleAt != null && rec.cycleAt + len <= to && guard++ < 5000) {
        const t = rec.cycleAt + len;
        if (standing) { give(plan, c.key, c.yield); tally.cycles++; tally.yielded += c.yield; }
        standing = true; rec.cycleAt = null;
        if (have(plan, K.seed) > 0) { take(plan, K.seed, 1); rec.cycleAt = t; } else { tally.noSeed = true; }
    }
    sync(plan, rec);
}

// Standing order: sell grain above rec.sellAbove to the Village market, unit by unit at the saturated price, until the price falls under the dial's share of base.
// Works on a clone of the market counts (plan.market is what the host publishes); nothing sells while the player is not in the Frontier or the region is unknown.
function sellSurplus(plan, rec, tally) {
    if(!Number.isInteger(rec.sellAbove)) return;
    if(plan.state.actors.player.worldId !== 'base.frontier') return;
    const region = SELL_DIALS.region.value, read = plan.market || loot_sold_count; // read-only until something sells
    if(!read[region]) return;
    const surplus = have(plan, K.grain) - rec.sellAbove;
    if(surplus <= 0) return;
    const tiers = read[region][GRAIN.group] || [];
    const start = calculate_total_saturation({sold_by_tier: tiers.map(t => Math.max(0, t.sold - t.recovered)), target_tier: GRAIN.tier, cap: capped_at});
    let n = 0, coins = 0;
    while(n < surplus) {
        const price = Math.max(1, get_loot_price_multiple({value: GRAIN.value, start_count: start + n, how_many_to_trade: 1, is_group: false, is_selling: true, stop_multiplier_at: Infinity}));
        if(price < GRAIN.value * SELL_DIALS.minPriceShare.value) break;
        n++; coins += price;
    }
    if(!n) return;
    const market = plan.market || (plan.market = structuredClone(loot_sold_count)), list = market[region][GRAIN.group] ||= [];
    while(list.length <= GRAIN.tier) list.push({sold: 0, recovered: 0});
    list[GRAIN.tier].sold += n; list[GRAIN.tier].recovered = Math.min(list[GRAIN.tier].recovered, list[GRAIN.tier].sold);
    take(plan, K.grain, n); plan.external.money = (plan.external.money || 0) + coins;
    tally.sold += n; tally.coins += coins;
}
registerHandJob(PLOT_JOB, {
    label: 'Village courtyard plot',
    available(plan) {
        const f = facts(plan);
        if (plan.state.actors.player.worldId !== 'base.frontier') return 'The courtyard plot is in the Village.';
        return f['mg.plotRight'] === true ? '' : 'Rent the plot from Mira first.';
    },
    candidates: () => HAND_CANDIDATES.map(c => ({...c})),
    contact(plan, c) {
        const people = plan.state.simulation?.people || {}, here = people.player?.location;
        return here && people[c.id]?.location === here ? '' : `${c.name} is not here.`;
    },
    busy(plan) {
        const st = facts(plan)['mg.cropStage'];
        if (st === 'planted' || st === 'tended' || st === 'ready') return 'Bring in or clear your own crop first; the hand takes over an empty bed.';
        if ((plan.state.simulation?.jobs || []).some(j => j.actorId === 'player' && String(j.commandId).startsWith('mg.farm.'))) return 'Finish your own work on the plot first.';
        return '';
    },
    hire(plan, rec) { if (have(plan, K.seed) > 0) { take(plan, K.seed, 1); rec.cycleAt = rec.since; } sync(plan, rec); },
    release(plan, rec) { sync(plan, rec); },
    // Work in [from, to]. Planting needs a seed; a hand with no seed leaves the bed empty and says so. Idle hands notice seed at the end of the pass.
    work(plan, rec, from, to, tally) { tendPlot(plan, rec, from, to, tally); sellSurplus(plan, rec, tally); },
    sells: GRAIN,
    report(rec, tally, span) {
        const c = HAND_CROPS[rec.crop], parts = [];
        if (tally.cycles) parts.push(`${rec.name}: Over ${span} I brought in ${tally.yielded} ${c.word} and put it in your store${rec.cycleAt != null ? '; the bed is sown again' : ''}.`);
        if (tally.noSeed && rec.cycleAt == null && rec.status === 'active') parts.push(`${parts.length ? 'I' : `${rec.name}: I`} have no seed packets to sow, so the bed sits empty.`);
        if(tally.sold) parts.push(`${parts.length ? 'I' : `${rec.name}: I`} sold ${tally.sold} ${GRAIN.word} above your ${rec.sellAbove} at the Village market for ${tally.coins} coin${tally.coins === 1 ? '' : 's'}.`);
        return parts.join(' ') || null;
    },
    income(rec) {
        const c = HAND_CROPS[rec.crop], n = Math.floor(7 * DAY / cycleMinutes(rec)) * c.yield;
        return {amount: n, unit: c.word, text: `up to about ${n} ${c.word} (one seed packet a cycle), less ${rec.wage} coins in wages`};
    }
});
