import {acquireCreature, creatureHealth, restoreCreatureLifecycle, settleCohortStock, transferCreature} from './creature_lifecycle.js';
import {moonlightBlade, moonlightFocusBonus, moonlightFocusSpecimen, moonbladeSheets} from './gu_ability_profiles.js';
import {isMoonlightStockOperation, moonlightStock, moonlightStockFacts, settleMoonlightStock} from './gu_moonlight_stock.js';
import {resolveGuActivation} from './gu_activation.js';
import {beginGuProjection, invokeProjectedGu} from './gu_projection.js';

const keeper = 'book.ri.keeper';
export const moonlightTrial = `${keeper}.moonlight_trial`;
export const moonlightProspect = `${keeper}.moonlight_prospect`;
export const moonlightTrialWorld = `${keeper}.world`;
export const prospectWorkMinutes = 30;
export const prospectWindowMinutes = 20;
const factKey = `${moonlightTrial}.specimens`;
const prospectKey = `${moonlightProspect}.plan`;
const moon = `${keeper}.moon`;
const steward = `${keeper}.steward`;
const kind = 'moonlight';
const cohort = `${moonlightTrial}.loan_stock`;
const habitat = keeper => ({id: `${moonlightTrial}.${keeper === 'player' ? 'player' : 'steward'}`,
    capacity: 1, supportedSpecies: [kind]});
const operations = ['borrow', 'return_loan', 'tune', 'cast_clan', 'cast_loan'];
const prospectOperations = ['prepare', 'open', 'cast_future', 'finish', 'cancel'];

export function isMoonlightTrialEffect(effect) {
    return effect.type === 'guMoonlightTrial' && effect.actor === 'player' && moonlightTrialEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

export function moonlightTrialEffectPack(operation) {
    if (operations.includes(operation)) return moonlightTrial;
    if (isMoonlightStockOperation(operation)) return moonlightStock;
    return prospectOperations.includes(operation) ? moonlightProspect : null;
}

const admitted = (record, pack = moonlightTrial) => record?.extensions?.some(pin => pin.id === pack);
const done = (state, action) => state.actors.player.completed[`${moonlightTrialEffectPack(action)}.${action}`] ?? 0;
const tuned = state => done(state, 'tune') + done(state, 'finish') === 1;

function readTrial(state) {
    const raw = state.worlds[moonlightTrialWorld]?.facts?.[factKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid Moonlight Gu trial record.');
    const {lifecycle: saved, marks} = JSON.parse(raw);
    const lifecycle = restoreCreatureLifecycle(saved);
    const [id] = Object.keys(lifecycle.individuals);
    const gu = lifecycle.individuals[id];
    if (!gu || Object.keys(lifecycle.individuals).length !== 1 || gu.species !== kind || gu.origin !== cohort ||
        ![steward, 'player'].includes(gu.keeper) || gu.habitat !== habitat(gu.keeper).id ||
        gu.traits.focus !== 'tight' || gu.bornAt > state.clock || gu.health.lastAt > state.clock ||
        !marks || ![null, 4].includes(marks.clan) || ![null, 5, 6].includes(marks.loan)) {
        throw Error('The Moonlight Gu and its trial records disagree.');
    }
    return {id, lifecycle, marks};
}

function readProspect(state) {
    const raw = state.worlds[moonlightTrialWorld]?.facts?.[prospectKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 512) throw Error('Invalid future Moonlight plan.');
    const plan = JSON.parse(raw);
    const {number, specimen, custody, preparedAt, openedAt, castAt, cut, endedAt, status} = plan;
    const at = (time, earliest) => Number.isSafeInteger(time) && time >= earliest && time <= state.clock;
    if (!Number.isSafeInteger(number) || number < 1 || typeof specimen !== 'string' ||
        !Number.isSafeInteger(custody) || custody < 1 || !at(preparedAt, 0) ||
        openedAt !== null && !at(openedAt, preparedAt) ||
        (castAt === null ? cut !== null : openedAt === null || !at(castAt, openedAt) ||
            castAt >= openedAt + prospectWindowMinutes || cut !== (1 + 2 * moonlightFocusBonus) * 4) ||
        !['pending', 'complete', 'cancelled'].includes(status) ||
        (status === 'pending' ? endedAt !== null : !at(endedAt, castAt ?? openedAt ?? preparedAt) ||
            status === 'complete' && endedAt < preparedAt + prospectWorkMinutes)) {
        throw Error('The future Moonlight plan and its times disagree.');
    }
    return plan;
}

function loanReady(state, trial) {
    return trial?.lifecycle.individuals[trial.id].keeper === 'player' &&
        !creatureHealth(trial.lifecycle, trial.id, state.clock).injury;
}

function reaches(state, trial, plan) {
    return plan?.status === 'pending' && !tuned(state) && trial?.id === plan.specimen &&
        trial.lifecycle.revision === plan.custody && loanReady(state, trial);
}

function prospectActions(state, trial, plan) {
    const reachable = reaches(state, trial, plan);
    return {prepare: !!loanReady(state, trial) && !tuned(state) && plan?.status !== 'pending',
        open: reachable && plan.openedAt === null,
        cast_future: reachable && plan.openedAt !== null && plan.castAt === null &&
            state.clock < plan.openedAt + prospectWindowMinutes,
        finish: reachable && state.clock >= plan.preparedAt + prospectWorkMinutes,
        cancel: plan?.status === 'pending'};
}

function available(state, trial, plan) {
    const loan = trial?.lifecycle.individuals[trial.id];
    const held = loan?.keeper === 'player';
    const ready = !!loanReady(state, trial);
    const p = state.simulation.people[moon];
    const clanReady = p?.life === 'alive' && p.body.controllerId === 'player' && p.vitals.health === p.vitals.max_health &&
        state.simulation.claims[`${keeper}.moon_title`]?.owner === 'player';
    return {borrow: !held, return_loan: held, tune: ready && !tuned(state) && plan?.status !== 'pending',
        cast_clan: !!trial && clanReady, cast_loan: ready, ...prospectActions(state, trial, plan)};
}

export function validateMoonlightTrial(state, record) {
    const trial = readTrial(state);
    const plan = readProspect(state);
    const borrows = done(state, 'borrow'), returns = done(state, 'return_loan');
    const preparations = done(state, 'prepare'), ends = done(state, 'finish') + done(state, 'cancel');
    if (!trial && !plan && ![...operations, ...prospectOperations].some(action => done(state, action))) return;
    if (!trial || !admitted(record) || borrows < 1 ||
        borrows - returns !== Number(trial.lifecycle.individuals[trial.id].keeper === 'player') ||
        done(state, 'tune') + done(state, 'finish') > 1 || (trial.marks.clan !== null) !== (done(state, 'cast_clan') > 0) ||
        (trial.marks.loan !== null) !== (done(state, 'cast_loan') > 0) || trial.marks.loan === 6 && !tuned(state)) {
        throw Error('The Moonlight trial needs its matching loan and casting receipts.');
    }
    if (!!plan !== (preparations > 0) || done(state, 'open') > preparations ||
        done(state, 'cast_future') > done(state, 'open') || preparations - ends !== Number(plan?.status === 'pending') ||
        (plan && (!admitted(record, moonlightProspect) || plan.number !== preparations || plan.specimen !== trial.id ||
            plan.custody > trial.lifecycle.revision || plan.preparedAt < trial.lifecycle.individuals[trial.id].bornAt ||
            (plan.status === 'complete') !== (done(state, 'finish') > 0) ||
            plan.openedAt !== null && !done(state, 'open') || plan.castAt !== null && !done(state, 'cast_future')))) {
        throw Error('The future Moonlight plan needs its matching refinement and casting receipts.');
    }
}

export function moonlightTrialFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== moonlightTrialWorld) return {};
    return {...Object.fromEntries(Object.entries(available(state, readTrial(state), readProspect(state)))
        .map(([action, allowed]) => [`${moonlightTrialEffectPack(action)}.can_${action}`, allowed])), ...moonlightStockFacts(state)};
}

export function moonlightTrialView(state) {
    const trial = readTrial(state);
    if (!trial) return null;
    const {id, lifecycle, marks} = trial;
    const plan = readProspect(state);
    const reachable = reaches(state, trial, plan);
    return {id, held: lifecycle.individuals[id].keeper === 'player', tuned: tuned(state), marks,
        ...(plan && {prospect: {status: plan.status === 'pending' && !reachable ? 'lost' : plan.status,
            workRemaining: Math.max(0, plan.preparedAt + prospectWorkMinutes - state.clock),
            windowRemaining: reachable && plan.openedAt !== null && plan.castAt === null ?
                Math.max(0, plan.openedAt + prospectWindowMinutes - state.clock) : 0,
            opened: plan.openedAt !== null, cut: plan.cut}})};
}

function moveTrialGu(trial, to, clock) {
    const {lifecycle, id} = trial;
    const next = transferCreature(lifecycle, {revision: lifecycle.revision, id, fromKeeper: lifecycle.individuals[id].keeper,
        toKeeper: to, destination: habitat(to), clock});
    return {...trial, lifecycle: next};
}

function newTrial(clock) {
    const empty = restoreCreatureLifecycle(null);
    const stocked = settleCohortStock(empty, {revision: empty.revision, id: cohort, species: kind,
        habitat: habitat(steward), delta: 1});
    const loan = acquireCreature(stocked, {revision: stocked.revision, cohortId: cohort, destination: habitat(steward),
        keeper: steward, traits: {focus: 'tight'}, clock});
    return {id: loan.id, lifecycle: loan.state, marks: {clan: null, loan: null}};
}

export function applyMoonlightTrialEffect(state, effect, context) {
    const {operation} = effect;
    const pack = moonlightTrialEffectPack(operation);
    if (!isMoonlightTrialEffect(effect) || context.actorId !== 'player' || !admitted(context.structuredNative) ||
        !admitted(context.structuredNative, pack) ||
        state.actors.player?.worldId !== moonlightTrialWorld ||
        state.simulation.people.player.location !== `${keeper}.annex`) throw Error('Compare the Moonlight Gu at the Gu house.');
    if (pack === moonlightStock) {
        settleMoonlightStock(state, operation);
        return;
    }
    const {clock} = state;
    let trial = readTrial(state);
    const plan = readProspect(state);
    if (!available(state, trial, plan)[operation]) throw Error('The Moonlight Gu is not ready for that trial.');
    if (pack === moonlightProspect) {
        state.worlds[moonlightTrialWorld].facts[prospectKey] = JSON.stringify(settleProspect(state, trial, plan, operation));
        return;
    }
    if (operation === 'borrow') trial = moveTrialGu(trial ?? newTrial(clock), 'player', clock);
    else if (operation === 'return_loan') trial = moveTrialGu(trial, steward, clock);
    else if (operation !== 'tune') {
        const loan = operation === 'cast_loan';
        const specimen = loan ? loanSpecimen(trial.id, tuned(state), clock) : {id: moon, kind, rank: 1, fedThrough: clock};
        const activation = resolveGuActivation({
            stages: [{gu: specimen, operator: 'player', ability: moonlightBlade}],
            reserves: {player: {primeval: moonlightBlade.cost}}, day: clock,
        });
        trial.marks[loan ? 'loan' : 'clan'] = moonbladeSheets(activation);
    }
    if (operation !== 'tune') state.worlds[moonlightTrialWorld].facts[factKey] = JSON.stringify({
        lifecycle: trial.lifecycle, marks: trial.marks,
    });
}

function loanSpecimen(id, refined, clock) {
    return moonlightFocusSpecimen(id, 'tight', refined, clock);
}

function settleProspect(state, trial, plan, operation) {
    const {clock} = state;
    if (operation === 'prepare') {
        return {number: done(state, 'prepare') + 1, specimen: trial.id, custody: trial.lifecycle.revision,
            preparedAt: clock, openedAt: null, castAt: null, cut: null, endedAt: null, status: 'pending'};
    }
    if (operation === 'open') return {...plan, openedAt: clock};
    if (operation === 'cast_future') {
        const anchor = `${moonlightProspect}.preparation-${plan.number}`;
        const specimen = loanSpecimen(plan.specimen, true, clock);
        const projection = beginGuProjection({anchor, operator: 'player', now: plan.openedAt,
            duration: prospectWindowMinutes, rankLimit: 1, profile: {rank: specimen.rank,
                capabilities: [{kind, rank: specimen.rank, traits: specimen.traits, ability: moonlightBlade}],
                reserves: {primeval: moonlightBlade.cost}}});
        const result = invokeProjectedGu({projection, anchor, operator: 'player', now: clock, kind});
        return {...plan, castAt: clock, cut: moonbladeSheets(result)};
    }
    return {...plan, endedAt: clock, status: operation === 'finish' ? 'complete' : 'cancelled'};
}
