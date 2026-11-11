// Kept Gu work orders and opinion: the house-view reader and the opinion producer (CPR15, CPR18, FRC55; proposal under AD32).
// The producer runs at the domain `stage` boundary, just before a plan is written, never on render. It reads what the plan's
// state settled for each bound (refined, kept) Gu this meal window and leaves one keyed thought row per occasion about you:
// kept fed, worked its order in peace, pushed to work hungry. Keys carry the window, so replays and later saves add nothing twice.
// A held Gu has no mind (CPR10) and leaves no rows. Rows outlast giving the Gu back: that is the Qud shape (CPR18).
// Missed windows while away leave only the last window's rows (the plan's end state); a known limit, not a rule.
import {registerDomain} from './domain_registry.js';
import {KEEPER_GU, KEEPER_DAY, kId as id, kKey as key} from './world_packs/book_gu_keeper.js';
import {guWorkOrder, orderFactFor} from './companion_work_gu.js';
import {readWorkOrder} from './companion_work.js';
import {readKeeperOpinion, rememberAbout} from './companion_opinion.js';

// Calibration hints (SKR11), dials: small and stacking to three per cause, so a few good windows reach fond and one push cools it.
export const GU_OPINION = Object.freeze({
    fed: {source: 'gu.fed', magnitude: 2, minutes: 4 * KEEPER_DAY, line: 'you kept its larder full'},
    worked: {source: 'gu.order', magnitude: 2, minutes: 4 * KEEPER_DAY, line: 'it worked its order in peace'},
    pushed: {source: 'gu.pushed', magnitude: -6, minutes: 8 * KEEPER_DAY, line: 'you worked it hungry'}});

const facts = (state, who) => state.actors?.[who]?.facts || {};
// Pure: the rows this state settles. [{row, now}].
export function guOpinionRows(state) {
    const s = state?.simulation; if(!s?.people?.[id(KEEPER_GU[0].slot)] || !Number.isSafeInteger(state.clock)) return [];
    const out = [];
    for(const g of KEEPER_GU) {
        if(!g.refinedMeal) continue;
        const gu = id(g.slot), f = facts(state, gu);
        if(s.claims[id(g.slot + '_title')]?.owner !== 'player' || !f[id(g.slot + '_refined')] || s.people[gu]?.life !== 'alive') continue;
        const w = s.checks[id(`care.${g.slot}.a_reset`)]?.count ?? 0, order = facts(state, 'player')[orderFactFor(id, g.slot)];
        const add = (r, tag) => out.push({...r, holder: gu, subject: 'player', key: `${gu}.${tag}.w${w}`});
        if(f[id(g.slot + '_kept.fed')]) add(GU_OPINION.fed, 'fed');
        // A push is one act, not a state: key it by how many times you have worked it hungry, so a push left unfed for three
        // windows is still one memory (the Qud reapply cooldown for this cause). Fed and worked are new acts each window.
        if(f[id(g.slot + '_resents')]) { const pushes = state.actors?.player?.completed?.[id(`work_${g.slot}_weak_bound`)] || 0; out.push({...GU_OPINION.pushed, holder: gu, subject: 'player', key: `${gu}.pushed.n${pushes}`}); }
        else if(f[id(g.slot + '_kept.worked')] && order && order !== 'none') add(GU_OPINION.worked, 'order');
    }
    return out;
}
registerDomain({id: 'companionWork', deps: ['moodThoughts'], stage: plan => { for(const r of guOpinionRows(plan.state)) rememberAbout(r, plan.state.clock); }});

// House-view reader for one Gu row (keeperHouseView row). Read-only.
export function guWorkView(state, g, row) {
    const order = guWorkOrder(g, {ids: id, keys: key, interval: g.days * KEEPER_DAY}), gu = id(g.slot);
    const opinion = readKeeperOpinion(gu, 'player', state.clock);
    const remembers = opinion.rows.length ? `It remembers you: ${opinion.band} (${[...new Set(opinion.rows.map(r => r.line))].slice(0, 2).join('; ')}).` : null;
    if(!order) return {order: null, line: null, opinion, remembers};
    const set = facts(state, 'player')[orderFactFor(id, g.slot)] === order.id;
    const reserve = state.simulation.energies.player?.[id('primeval')]?.reserve ?? 0;
    const read = readWorkOrder(order, {kept: row.kept, alive: row.alive, condition: row.condition, sound: 3, worked: row.worked,
        willing: !row.resents, why: 'it holds being worked hungry against you; feed it', essence: reserve, opinion: order.minded && row.refined ? opinion : null});
    return {order: order.id, set, place: order.place.label, read, line: set ? read.line : `No standing order (it could ${order.kind}: ${order.place.label})`, opinion, remembers};
}
