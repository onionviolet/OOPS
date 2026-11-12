import {acquireCreature, creatureHealth, practiceWithCreature, restoreCreatureLifecycle,
    settleCohortStock, transferCreature} from './creature_lifecycle.js';
import {recordGuAidMilestone, requestGuAid, requestProjectedGuAid} from './gu_cooperation.js';
import {beginGuProjection, borrowGuMilestone} from './gu_projection.js';

const prefix = 'book.ri.keeper';
export const keeperCooperation = `${prefix}.insight_moth`;
export const keeperCooperationWorld = `${prefix}.world`;
export const mothMeal = 2;
export const mothLightMinutes = 30;
export const mothClue = `${keeperCooperation}.grove_clue`;
export const keeperFutureMoth = `${prefix}.future_moth`;
export const keeperWitnessedMoth = `${prefix}.witnessed_moth`;
export const mothLessonMinutes = 20;
export const mothSealMinutes = 10;
const mealMinutes = 1440;
const key = `${keeperCooperation}.encounter`;
const species = 'insight-moth';
const steward = `${prefix}.steward`;
const annex = `${prefix}.annex`;
const cohort = `${keeperCooperation}.cohort`;
const habitat = keeper => ({id: `${keeperCooperation}.${keeper === 'player' ? 'desk' : 'steward_desk'}`,
    capacity: 1, supportedSpecies: [species]});
const ability = {fuel: 'meal', cost: 1, effect: {kind: 'light-of-insight', magnitude: 1}};
const operations = ['meet', 'feed', 'leave', 'recall', 'ask', 'steward_asks'];
const futureOperations = ['pledge', 'reach', 'cancel', 'teach'];
const witnessedOperations = ['mark_aid', 'open_aid', 'ask_witnessed', 'steward_witnessed'];
const hasPin = (record, id = keeperCooperation) => record?.extensions?.some(pin => pin.id === id);
export const keeperCooperationEffectPack = operation => futureOperations.includes(operation) ? keeperFutureMoth :
    witnessedOperations.includes(operation) ? keeperWitnessedMoth : keeperCooperation;
const done = (state, operation) => state.actors.player.completed[`${keeperCooperationEffectPack(operation)}.${operation}`] ?? 0;

export function isKeeperCooperationEffect(effect) {
    return effect.type === 'guCooperation' && effect.actor === 'player' &&
        (operations.includes(effect.operation) || futureOperations.includes(effect.operation) || witnessedOperations.includes(effect.operation)) &&
        Object.keys(effect).every(field => ['type', 'actor', 'operation'].includes(field));
}

function readEncounter(state) {
    const raw = state.worlds[keeperCooperationWorld]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid Insight Moth record.');
    const {id, lifecycle: saved, agreement, meal, response, litAt, future, witnessed} = JSON.parse(raw);
    const lifecycle = restoreCreatureLifecycle(saved);
    const gu = lifecycle.individuals[id];
    const knownKeeper = actor => actor === 'player' || actor === steward;
    const past = at => Number.isSafeInteger(at) && at >= gu?.bornAt && at <= state.clock;
    if (Object.keys(lifecycle.individuals).length !== 1 || gu?.species !== species || gu.origin !== cohort ||
        !knownKeeper(gu.keeper) || gu.habitat !== habitat(gu.keeper).id || gu.bornAt > state.clock ||
        gu.health.lastAt > state.clock || agreement?.actor !== 'player' ||
        typeof agreement.body !== 'string' || !agreement.body ||
        Object.entries(gu.experience).some(([actor, entry]) => !knownKeeper(actor) || !past(entry.lastAt)) ||
        (meal !== null && (!meal || !past(meal.at) || !knownKeeper(meal.by) || typeof meal.spent !== 'boolean' ||
            (gu.experience[meal.by]?.lastAt ?? -1) < meal.at)) ||
        (response !== null && (!response || !knownKeeper(response.actor) || !['lit', 'quiet'].includes(response.result) ||
            response.result === 'lit' && (response.actor !== agreement.actor && future?.status !== 'kept' || litAt === null))) ||
        (litAt !== null && (!past(litAt) || !meal || meal.at <= litAt && !meal.spent))) {
        throw Error('The Insight Moth and its encounter record disagree.');
    }
    return {id, lifecycle, agreement, meal, response, litAt, ...(future && {future}), ...(witnessed && {witnessed})};
}

function readyMeal(encounter, clock) {
    return !!encounter?.meal && !encounter.meal.spent && clock < encounter.meal.at + mealMinutes;
}

function lightPresent(encounter, clock) {
    return encounter?.litAt != null && clock < encounter.litAt + mothLightMinutes;
}

function futureRemaining(state, encounter) {
    const plan = encounter?.future;
    return plan?.status === 'pending' && plan.litAt !== null &&
        state.simulation.people[steward]?.body.id === plan.body ?
        Math.max(0, Math.min(plan.litAt + mothSealMinutes, plan.at + mothLessonMinutes) - state.clock) : 0;
}

function witnessedRemaining(state, encounter) {
    const mark = encounter?.witnessed;
    return mark?.openedAt != null && state.simulation.people.player.body.id === mark.body
        ? Math.max(0, mark.openedAt + mothSealMinutes - state.clock) : 0;
}

function options(state, encounter) {
    const person = state.simulation.people[steward];
    const present = person?.life === 'alive' && person.location === annex;
    const gu = encounter?.lifecycle.individuals[encounter.id];
    const keeper = gu?.keeper;
    const fed = readyMeal(encounter, state.clock);
    const plan = encounter?.future;
    const atDesk = present && keeper === steward;
    const pending = plan?.status === 'pending';
    const sameBody = person?.body.id === plan?.body;
    const mark = encounter?.witnessed;
    const pastOpen = witnessedRemaining(state, encounter) > 0;
    return {meet: !encounter && present, feed: !!encounter && !fed && (keeper === 'player' || present) &&
        (gu.experience[keeper]?.lastAt ?? -1) < state.clock,
        leave: present && keeper === 'player', recall: present && keeper === steward,
        ask: fed, steward_asks: fed && present && keeper === steward,
        pledge: atDesk && !pending && plan?.status !== 'kept',
        reach: atDesk && pending && sameBody && plan.litAt === null && state.clock < plan.at + mothLessonMinutes,
        cancel: pending, teach: atDesk && pending && sameBody && state.clock >= plan.at + mothLessonMinutes &&
            (gu.experience[steward]?.lastAt ?? -1) < state.clock,
        mark_aid: !mark && lightPresent(encounter, state.clock) && encounter.response?.actor === 'player' &&
            encounter.response.result === 'lit' && state.simulation.people.player.body.id === encounter.agreement.body,
        open_aid: !!mark && mark.openedAt === null && mark.at < state.clock && state.simulation.people.player.body.id === mark.body,
        ask_witnessed: pastOpen && mark.litAt === null,
        steward_witnessed: pastOpen && present && mark.refusedAt === null,
        study: (lightPresent(encounter, state.clock) || atDesk && futureRemaining(state, encounter) > 0 ||
            pastOpen && mark.litAt !== null) && !done(state, 'study'),
        gather: done(state, 'study') === 1 && !done(state, 'gather')};
}

export function keeperCooperationFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperCooperationWorld) return {};
    return Object.fromEntries(Object.entries(options(state, readEncounter(state)))
        .map(([operation, allowed]) => [`${keeperCooperationEffectPack(operation)}.can_${operation}`, !!allowed]));
}

export function validateKeeperCooperation(state, record) {
    const encounter = readEncounter(state);
    const met = done(state, 'meet');
    const studied = done(state, 'study'), gathered = done(state, 'gather');
    const note = state.simulation.knowledge.player?.[mothClue];
    const plan = encounter?.future;
    const pledged = done(state, 'pledge'), reached = done(state, 'reach'), taught = done(state, 'teach');
    const gu = encounter?.lifecycle.individuals[encounter.id];
    const mark = encounter?.witnessed;
    const marked = done(state, 'mark_aid'), opened = done(state, 'open_aid');
    const pastLit = done(state, 'ask_witnessed'), refused = done(state, 'steward_witnessed');
    const validMinute = at => Number.isSafeInteger(at) && at >= gu?.bornAt && at <= state.clock;
    const withinSeal = at => validMinute(at) && at >= mark.openedAt && at < mark.openedAt + mothSealMinutes;
    if (marked !== Number(!!mark) || opened > marked || pastLit > opened || refused > opened ||
        mark && (!hasPin(record, keeperWitnessedMoth) || !validMinute(mark.at) || !done(state, 'ask') ||
            mark.body !== encounter.agreement.body || mark.specimen !== encounter.id ||
            opened !== Number(mark.openedAt !== null) || pastLit !== Number(mark.litAt !== null) ||
            refused !== Number(mark.refusedAt !== null) ||
            opened && (!validMinute(mark.openedAt) || mark.openedAt <= mark.at) ||
            pastLit && !withinSeal(mark.litAt) || refused && !withinSeal(mark.refusedAt))) {
        throw Error('The witnessed light needs its earlier visit and seal receipts.');
    }
    if (!!plan !== (pledged > 0) || reached > pledged || done(state, 'cancel') + taught > pledged || taught > 1 ||
        (!plan && futureOperations.some(operation => done(state, operation))) ||
        (plan && (!hasPin(record, keeperFutureMoth) || !['pending', 'kept', 'cancelled', 'broken'].includes(plan.status) ||
            !Number.isSafeInteger(plan.at) || plan.at < gu.bornAt || plan.at > state.clock ||
            typeof plan.body !== 'string' || !plan.body || (plan.status === 'kept') !== (taught === 1) ||
            plan.status === 'pending' && gu.keeper !== steward ||
            plan.litAt !== null && (!reached || !Number.isSafeInteger(plan.litAt) || plan.litAt < plan.at ||
                plan.litAt > state.clock || plan.litAt >= plan.at + mothLessonMinutes)))) {
        throw Error('The future light needs a paid lesson and a reached state.');
    }
    if (met !== Number(!!encounter) || studied > 1 || gathered > studied ||
        !!note !== !!studied || (!encounter && operations.some(operation => done(state, operation))) ||
        (encounter && (!hasPin(record) || encounter.lifecycle.individuals[encounter.id].bornAt < record.initializedAt ||
            Number(encounter.lifecycle.individuals[encounter.id].keeper === steward) !== done(state, 'leave') - done(state, 'recall') ||
            !!encounter.meal !== (done(state, 'feed') > 0) ||
            !!encounter.response !== (done(state, 'ask') + done(state, 'steward_asks') > 0) ||
            studied && encounter.litAt === null && !reached && !pastLit))) {
        throw Error('The Insight Moth needs its encounter and field notes.');
    }
}

export function keeperCooperationView(state) {
    const encounter = readEncounter(state);
    if (!encounter) return null;
    const gu = encounter.lifecycle.individuals[encounter.id];
    return {withSteward: gu.keeper === steward, fed: readyMeal(encounter, state.clock), response: encounter.response,
        witnessed: encounter.witnessed && {opened: encounter.witnessed.openedAt !== null,
            remaining: witnessedRemaining(state, encounter), lit: encounter.witnessed.litAt !== null,
            refused: encounter.witnessed.refusedAt !== null},
        future: encounter.future && {status: encounter.future.status, reached: encounter.future.litAt !== null,
            remaining: futureRemaining(state, encounter), lesson: Math.max(0, encounter.future.at + mothLessonMinutes - state.clock)},
        lightRemaining: lightPresent(encounter, state.clock) ? encounter.litAt + mothLightMinutes - state.clock : 0,
        gathered: done(state, 'gather') > 0};
}

function useWitnessedAid(state, encounter, operation) {
    const clock = state.clock;
    if (operation === 'mark_aid') {
        encounter.witnessed = {specimen: encounter.id, body: encounter.agreement.body, at: encounter.litAt,
            openedAt: null, litAt: null, refusedAt: null};
        return;
    }
    const mark = encounter.witnessed;
    if (operation === 'open_aid') {
        mark.openedAt = clock;
        return;
    }
    const anchor = `${keeperWitnessedMoth}.seal`;
    const milestone = recordGuAidMilestone({id: anchor, operator: 'player', at: mark.at,
        gu: {id: mark.specimen, kind: species, rank: 1}, agreement: {actor: 'player', body: mark.body}, ability, reserve: 1});
    const projection = borrowGuMilestone({milestone, anchor, operator: 'player', now: mark.openedAt,
        duration: mothSealMinutes, rankLimit: 1});
    if (mark.litAt !== null) projection.reserves.meal = 0;
    const actor = operation === 'ask_witnessed' ? 'player' : steward;
    const visitor = {actor, body: state.simulation.people[actor].body.id};
    const result = requestProjectedGuAid({projection, anchor, operator: 'player', now: clock, kind: species, visitor});
    if (actor === steward && !result) mark.refusedAt = clock;
    else if (actor === 'player' && result?.projection.reserves.meal === 0) mark.litAt = clock;
    else throw Error('The witnessed agreement no longer answers that request.');
}

function meet(state) {
    const empty = restoreCreatureLifecycle(null);
    const home = habitat('player');
    const stocked = settleCohortStock(empty, {revision: empty.revision, id: cohort, species, habitat: home, delta: 1});
    const {id, state: lifecycle} = acquireCreature(stocked, {revision: stocked.revision, cohortId: cohort,
        destination: home, keeper: 'player', clock: state.clock});
    return {id, lifecycle, agreement: {actor: 'player', body: state.simulation.people.player.body.id},
        meal: null, response: null, litAt: null};
}

export function applyKeeperCooperationEffect(state, effect, context) {
    const encounter = readEncounter(state);
    const {operation} = effect;
    if (!isKeeperCooperationEffect(effect) || !hasPin(context.structuredNative) ||
        !hasPin(context.structuredNative, keeperCooperationEffectPack(operation)) ||
        context.actorId !== 'player' || state.actors.player?.worldId !== keeperCooperationWorld ||
        state.simulation.people.player.location !== annex || !options(state, encounter)[operation]) {
        throw Error('The Insight Moth is unavailable for that visit.');
    }
    const next = encounter ?? meet(state);
    const {id, lifecycle} = next;
    const gu = lifecycle.individuals[id];
    const clock = state.clock;
    if (operation === 'leave' || operation === 'recall') {
        const keeper = operation === 'leave' ? steward : 'player';
        next.lifecycle = transferCreature(lifecycle, {revision: lifecycle.revision, id, fromKeeper: gu.keeper,
            toKeeper: keeper, destination: habitat(keeper), clock});
        if (operation === 'recall' && next.future?.status === 'pending') next.future.status = 'broken';
    } else if (operation === 'feed') {
        next.lifecycle = practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor: gu.keeper,
            clock, minimumGap: 1, bondGain: 15});
        next.meal = {at: clock, by: gu.keeper, spent: false};
    } else if (operation === 'ask' || operation === 'steward_asks') {
        const actor = operation === 'ask' ? 'player' : steward;
        const aid = requestGuAid({gu: {id, kind: species, rank: 1, fedThrough: next.meal.at + mealMinutes - 1,
            injured: !!creatureHealth(lifecycle, id, clock).injury}, visitor: {actor, body: state.simulation.people[actor].body.id},
            agreement: actor === steward && next.future?.status === 'kept' ?
                {actor: steward, body: next.future.body} : next.agreement, ability, reserve: 1, now: clock});
        const lit = aid?.effects.some(row => row.kind === ability.effect.kind);
        next.response = {actor, result: lit ? 'lit' : 'quiet'};
        if (lit) {
            next.litAt = clock;
            next.meal = {...next.meal, spent: aid.remaining[id].meal === 0};
        }
    } else if (operation === 'pledge') {
        next.future = {at: clock, body: state.simulation.people[steward].body.id, status: 'pending', litAt: null};
    } else if (operation === 'reach') {
        const {body, at} = next.future;
        const anchor = `${keeperFutureMoth}.${done(state, 'pledge')}`;
        const projection = beginGuProjection({anchor, operator: 'player', now: clock,
            duration: Math.min(mothSealMinutes, at + mothLessonMinutes - clock), rankLimit: 1,
            profile: {rank: 1, capabilities: [{kind: species, rank: 1, ability,
                witness: {specimen: id, agreement: {actor: steward, body}}}], reserves: {meal: 1}}});
        const visitor = {actor: steward, body: state.simulation.people[steward].body.id};
        const result = requestProjectedGuAid({projection, anchor, operator: 'player', now: clock, kind: species, visitor});
        if (!result?.effects.some(row => row.kind === ability.effect.kind) || result.projection.reserves.meal !== 0) {
            throw Error('The reached moth stayed quiet.');
        }
        next.future.litAt = clock;
    } else if (operation === 'cancel') next.future.status = 'cancelled';
    else if (operation === 'teach') {
        next.lifecycle = practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor: steward,
            clock, minimumGap: 1, bondGain: 15});
        next.future.status = 'kept';
    } else if (witnessedOperations.includes(operation)) useWitnessedAid(state, next, operation);
    state.worlds[keeperCooperationWorld].facts[key] = JSON.stringify(next);
}
