// Frontier job for hired_hands.js: a villager tends the Village courtyard plot (MG06 facts on the player actor) for a weekly wage.
// The plot's facts (mg.cropStage, mg.cropType) stay the one authority; the hire itself lives in the hired_hands slice. The player's own commands stay available
// (a missing fact cannot gate a rule without a save migration), so the hand yields only for a crop still standing in the bed (no double harvest) and never sows over the player's crop.
// Real inputs only (AD38, MG06 "creates no seeds or food"): every cycle takes one seed packet from the player's stock; the harvest goes into the player's stock.
// Smallest honest path for the crop: storage. Selling by a standing order through Bram's finite purse is a later rung (not built).
import {registerHandJob} from './hired_hands.js';
import {I, K} from './management/shared.js';
export const PLOT_JOB = 'frontier.courtyard_plot';
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
    work(plan, rec, from, to, tally) {
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
    },
    report(rec, tally, span) {
        const c = HAND_CROPS[rec.crop], parts = [];
        if (tally.cycles) parts.push(`${rec.name}: Over ${span} I brought in ${tally.yielded} ${c.word} and put it in your store${rec.cycleAt != null ? '; the bed is sown again' : ''}.`);
        if (tally.noSeed && rec.cycleAt == null && rec.status === 'active') parts.push(`${parts.length ? 'I' : `${rec.name}: I`} have no seed packets to sow, so the bed sits empty.`);
        return parts.join(' ') || null;
    },
    income(rec) {
        const c = HAND_CROPS[rec.crop], n = Math.floor(7 * DAY / cycleMinutes(rec)) * c.yield;
        return {amount: n, unit: c.word, text: `up to about ${n} ${c.word} (one seed packet a cycle), less ${rec.wage} coins in wages`};
    }
});
