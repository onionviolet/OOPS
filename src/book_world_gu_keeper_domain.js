// Gu keeper life (book.ri.keeper): save validation and the Gu house projection. Reads existing owners only; no saved slice,
// stock writer, tick or timer. Upkeep predictions come from living_upkeep.js; stones, larders and checks stay where the
// simulation keeps them, so there is one authority per fact.
import {registerDomain} from './domain_registry.js';
import {keeperColonyView, validateKeeperColony} from './gu_keeper_colony.js';
import {keeperWildView, validateKeeperWild} from './gu_keeper_wild.js';
import {keeperRefinementView, validateKeeperRefinement} from './gu_keeper_refinement.js';
import {keeperGateSky, keeperStargateSky} from './gu_stargate.js';
import {moonlightTrialView, validateMoonlightTrial} from './gu_keeper_moonlight_trial.js';
import {moonlightStockView, validateMoonlightStock} from './gu_moonlight_stock.js';
import {keeperMoveTrialView, keeperTrayMoveView, validateKeeperMoveTrial} from './gu_keeper_move_trial.js';
import {keeperFireTrialView} from './world_packs/book_gu_keeper_fire_trial.js';
import {keeperRainbowView, validateKeeperRainbow} from './world_packs/book_gu_keeper_sustained.js';
import {keeperPropagationView, validateKeeperPropagation} from './gu_keeper_propagation.js';
import {keeperVitalityView} from './world_packs/book_gu_keeper_gardens.js';
import {hostedWolfView, validateHostedWolf} from './gu_hosted_wolf.js';
import {keeperFusionView, validateKeeperFusion} from './gu_keeper_fusion.js';
import {keeperGoalView, validateKeeperGoal} from './gu_keeper_goal.js';
import {keeperChainView} from './gu_keeper_chain.js';
import {keeperSignalView} from './gu_keeper_signal.js';
import {keeperSpiritView, validateKeeperSpirit} from './gu_keeper_spirit.js';
import {keeperProcedureView, validateKeeperProcedure} from './gu_keeper_procedure.js';
import {giantHandView} from './gu_keeper_giant_hand.js';
import {keeperAntNestView, validateKeeperAntNest} from './gu_keeper_ant_nest.js';
import {keeperAttitudeView, validateKeeperAttitude} from './gu_keeper_attitude.js';
import {keeperFixedForgeView, validateKeeperFixedForge} from './gu_keeper_fixed_forge.js';
import {keeperFixedTravelView, validateKeeperFixedTravel} from './gu_keeper_immortal_travel.js';
import {keeperCooperationView, validateKeeperCooperation} from './gu_keeper_cooperation.js';
import {validateKeeperTime} from './gu_keeper_time.js';
import {energyCharge} from './energy_resources.js';
import {guKeeperLife as life, kId as id, kKey as key, KEEPER_GU, KEEPER_DIALS as DIAL, KEEPER_DAY, keeperDiets} from './world_packs/book_gu_keeper.js';
import {nextMeal, starvation, sustainable, dailyCost, dailyFood, mealSize, stipendAgreement} from './living_upkeep.js';
import {guCard} from './being_gu.js';
import {guWorkView} from './companion_work_gu_domain.js';
import {createObligations, writeObligation} from './obligations_ledger.js';
const check = (ok, message) => { if(!ok) throw Error(message); };
const own = (rows, k) => rows?.[k] || 0;

export function validateKeeperEnvelope(save) {
    const state = save?.expansion, record = save?.content_packs?.structured;
    if(record?.packId !== life.id) { check(state?.actors?.player?.worldId !== life.world.id, 'The Gu keeper life needs its beginning receipt.'); return; }
    const s = state.simulation, elapsed = state.clock - record.initializedAt;
    validateKeeperColony(state, record);
    validateKeeperTime(state, record);
    validateHostedWolf(state, record);
    validateKeeperCooperation(state, record);
    validateKeeperFixedTravel(state, record);
    validateKeeperFixedForge(state, record);
    validateKeeperAttitude(state, record);
    validateKeeperAntNest(state, record);
    validateKeeperProcedure(state, record);
    validateKeeperSpirit(state, record);
    validateKeeperGoal(state, record);
    validateKeeperFusion(state, record);
    validateKeeperPropagation(state, record, save.inventories?.person?.main_character);
    validateKeeperRainbow(state, record);
    validateMoonlightTrial(state, record);
    validateMoonlightStock(state, record);
    validateKeeperMoveTrial(state, record);
    validateKeeperWild(state, record);
    validateKeeperRefinement(state, record);
    for(const g of KEEPER_GU) {
        const p = s.people[id(g.slot)], title = s.claims[id(g.slot + '_title')], diet = keeperDiets.find(d => d.holder === id(g.slot));
        check(p?.body?.id === id(g.slot + '_body') && p.body.ownerId === id(g.slot) && ['alive', 'dead'].includes(p.life), `The ${g.label} identity has changed.`);
        check((title?.status === 'held' || g.slot === 'worm' && title?.status === 'settled') &&
            [id('steward'), 'player'].includes(title.owner) && p.body.controllerId === (title.owner === 'player' ? 'player' : id(g.slot)), `${g.label} title and control disagree.`);
        check(Number.isInteger(p.vitals?.health) && p.vitals.health >= 0 && p.vitals.health <= diet.maxCondition && p.vitals.max_health === diet.maxCondition && (p.life === 'alive' ? p.vitals.health > 0 : p.vitals.health === 0), `Invalid ${g.label} condition.`);
        const larder = own(s.owners[id(g.slot)], key(g.food));
        check(Number.isSafeInteger(larder) && larder >= 0, `Invalid ${g.label} larder.`);
    }
    // Every authored event keeps its calendar. The stipend check may retire once its authored weeks are paid.
    for(const row of life.simulation.events) {
        const c = s.checks[row.id], expected = Math.floor(elapsed / row.interval);
        if(row.id === id('stipend') && expected >= row.maxOccurrences) { check(!c || c.count >= row.maxOccurrences, 'Keeper stipend schedule has changed.'); continue; }
        check(c && c.interval === row.interval && c.count === expected && c.due === record.initializedAt + (expected + 1) * row.interval, `Keeper schedule ${row.id.split('.').slice(3).join('.')} is missing or changed.`);
    }
    const energy = s.energies.player?.[id('primeval')];
    check(energy && energy.policy.capacity === DIAL.capacity && energy.reserve <= DIAL.capacity, 'The aperture cap has changed.');
}

const days = minutes => minutes >= KEEPER_DAY ? `${(minutes / KEEPER_DAY).toFixed(minutes % KEEPER_DAY ? 1 : 0)} days` : `${Math.max(0, Math.round(minutes / 60))} hours`;
// Prices in stones per food unit, for the sustainability gauge.
const unitPrice = g => g.bundlePrice / g.bundle;

// Gu house projection. All numbers come from the save; nothing is cached.
export function keeperHouseView(state, definition, record, context) {
    if(definition.id !== life.id) return null;
    const s = state.simulation, now = state.clock, anchor = record.initializedAt;
    const inventory = context.gameplay?.player?.inventory || {};
    const stones = own(inventory, key('stone'));
    const energy = s.energies.player?.[id('primeval')], charge = energy && energyCharge(energy.policy, {output: 1});
    const gauge = energy && {now: energy.reserve, max: energy.policy.capacity, fullSea: DIAL.fullSea, aptitudePercent: DIAL.aptitudePercent, regenPerHour: DIAL.regenPerHour,
        nextRegenIn: 60 - ((now - anchor) % 60), perActivation: charge, text: `${energy.reserve}/${energy.policy.capacity} primeval essence · aptitude ${DIAL.aptitudePercent}% caps the sea at ${energy.policy.capacity} of ${DIAL.fullSea} · +${DIAL.regenPerHour}/hour`};
    const held = [];
    const rows = KEEPER_GU.map(g => {
        const p = s.people[id(g.slot)], diet = keeperDiets.find(d => d.holder === id(g.slot)), kept = s.claims[id(g.slot + '_title')]?.owner === 'player';
        const refined = !!state.actors?.[id(g.slot)]?.facts?.[id(g.slot + '_refined')];
        const stock = own(s.owners[id(g.slot)], key(g.food)), cond = p.vitals.health;
        const altStock = g.alt ? own(s.owners[id(g.slot)], key(g.alt.food)) : 0, worked = !!state.actors?.[id(g.slot)]?.facts?.[id(g.slot + '_kept.worked')];
        const resents = !!state.actors?.[id(g.slot)]?.facts?.[id(g.slot + '_resents')];
        const order = !!state.actors?.player?.facts?.[id('auto_' + g.slot)], bag = own(inventory, key(g.food));
        const row = {id: g.slot, label: g.label, food: g.foodLabel, kept, alive: p.life === 'alive',
            consumed: s.claims[id(g.slot + '_title')]?.status === 'settled', condition: cond, maxCondition: diet.maxCondition, stock, altStock, altFood: g.alt?.foodLabel || null, refined,
            meal: mealSize(diet, refined), everyDays: g.days, price: g.price, perDayStones: dailyCost(diet, unitPrice(g), refined), lethal: diet.lethal !== false,
            order, resents, canRefine: !!g.refinedMeal, bagMeals: Math.floor(bag / mealSize(diet, refined)), worked, yield: g.yield,
            ability: null};
        if(kept && row.alive) {
            const st = starvation(diet, {stock, altStock, condition: cond, now, anchor, refined});
            Object.assign(row, {nextMealIn: st.nextMeal - now, mealsStocked: st.meals, firstMissIn: st.firstMiss - now, starvesIn: st.deathAt == null ? null : st.deathAt - now,
                starvedOutIn: st.starvedOutAt - now, willEat: st.meals > 0, poorMeals: st.altMeals > 0 && st.mainMeals === 0});
            held.push({id: g.slot, perDay: row.perDayStones});
        }
        // CPR10: the shared being record reads this row. Its care reader owns the work-ability words; grain and custody show beside them.
        row.being = guCard(row);
        row.ability = row.being.care.ability ?? (row.alive ? row.ability : null);
        // CPR15/CPR18: the standing work order and what the Gu thinks of you (kept apart from the claim and tie above).
        row.work = guWorkView(state, g, row);
        return row;
    });
    const weeklyIncome = DIAL.stipendStones / DIAL.stipendDays;
    const cap = sustainable(held, weeklyIncome);
    for(const r of rows) if(r.kept && r.alive) r.sustained = cap.fed.includes(r.id);
    const paid = Math.min(DIAL.stipendWeeks, Math.floor((now - anchor) / (DIAL.stipendDays * KEEPER_DAY))), done = (id2 => state.actors?.player?.completed?.[id(id2)] || 0);
    const agreement = stipendAgreement({amount: DIAL.stipendStones, intervalDays: DIAL.stipendDays, paid, remaining: DIAL.stipendWeeks - paid});
    const ledger = writeObligation(createObligations(), agreement);
    const nextStipend = paid < DIAL.stipendWeeks ? anchor + (paid + 1) * DIAL.stipendDays * KEEPER_DAY - now : null;
    const spentOnGu = KEEPER_GU.filter(g => done('take_' + g.slot)).reduce((n, g) => n + g.price, 0);
    const foodBought = KEEPER_GU.map(g => ({g, n: done('buy_' + g.food)})).filter(x => x.n);
    const spentOnFood = foodBought.reduce((n, x) => n + x.n * x.g.bundlePrice, 0), chores = done('chores') * DIAL.choreStones;
    const projects = (definition.extensions || []).map(extension => {
        const amount = extension.commands.reduce((sum, command) => {
            const cost = command.costs.filter(effect => effect.type === 'item' && effect.key === key('stone') && effect.amount < 0)
                .reduce((total, effect) => total + effect.amount, 0);
            return sum + cost * (state.actors.player.completed[command.id] || 0);
        }, 0);
        return {label: extension.label, amount, note: 'Gu house costs'};
    }).filter(row => row.amount !== 0);
    const income = paid * DIAL.stipendStones + chores;
    const spent = spentOnGu + spentOnFood - projects.reduce((sum, row) => sum + row.amount, 0);
    return {gauge, gu: rows, stones, colony: keeperColonyView(state), wildWorm: keeperWildView(state, record), refinement: keeperRefinementView(state), moonlightTrial: moonlightTrialView(state), moonlightStock: moonlightStockView(state), moveTrial: keeperMoveTrialView(state, record), trayMove: keeperTrayMoveView(state, record), fireTrial: keeperFireTrialView(state, record), rainbow: keeperRainbowView(state, record), propagation: keeperPropagationView(state, record), vitalityGarden: keeperVitalityView(state, record), hostedWolf: hostedWolfView(state, record), cooperation: keeperCooperationView(state), fixedTravel: keeperFixedTravelView(state, record, inventory), fixedForge: keeperFixedForgeView(state, record, inventory), attitude: keeperAttitudeView(state, record), antNest: keeperAntNestView(state, record), procedure: keeperProcedureView(state, record), giantHand: giantHandView(state, record, inventory), spirit: keeperSpiritView(state, record), goalResearch: keeperGoalView(state, record), moonFusion: keeperFusionView(state, record),
        bladeChains: keeperChainView(state, record), lightReaders: keeperSignalView(state, record),
        gateSky: record.extensions?.some(pin => pin.id === keeperGateSky) ? keeperStargateSky(state, context) : null, feedingCap: {held: held.length, sustained: cap.fed.length, line: held.length ? `At this week's stipend you can afford to feed ${cap.fed.length} of ${held.length} Gu you hold${cap.starving.length ? `; ${cap.starving.map(i => KEEPER_GU.find(g => g.slot === i).label).join(', ')} would go short. Each Gu starves from its own larder, so the timers below are what decides.` : '.'}` : 'You hold no Gu yet.'},
        ledger: {stones, agreement: ledger.rows[0], nextStipendIn: nextStipend, lines: [
            {label: 'Stipend received', amount: paid * DIAL.stipendStones, note: `${paid} of ${DIAL.stipendWeeks} weekly payments`},
            {label: 'Chores', amount: chores, note: `${done('chores')} jobs`},
            {label: 'Gu taken in', amount: 0 - spentOnGu || 0, note: KEEPER_GU.filter(g => done('take_' + g.slot)).map(g => g.label).join(', ') || 'none'},
            {label: 'Food bought', amount: 0 - spentOnFood || 0, note: foodBought.map(x => `${x.n}× ${x.g.bundle} ${x.g.foodLabel}`).join(', ') || 'none'},
            ...projects],
            net: income - spent}};
}
registerDomain({id: 'gu_keeper', validate: (_slice, envelope) => validateKeeperEnvelope(envelope)});
