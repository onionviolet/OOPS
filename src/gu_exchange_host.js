import {guCatalogue} from './gu_catalogue.js';
import {asBoundGu, guAbility, guExchangeMethod, guRef, guWorkingLaw} from './gu_working_law.js';
import {beginWorking, settleWorking} from './kernel_working.js';

// The native job owns the real reserve and clock. The kernel reads that
// reservation as its budget and returns a receipt, without charging it again.
export function settleGuExchange(row, {actor, parts, at = 0, minutes}) {
    const casts = row.casts.map(kind => {
        const price = guCatalogue[kind]?.leadActivation?.value;
        if (price?.fuel !== 'primeval' || !Number.isSafeInteger(price.cost) || price.cost <= 0) {
            throw Error(`No lead activation price for ${kind}.`);
        }
        return {kind, ability: {...guAbility(kind), ...price}};
    });
    const method = guExchangeMethod(row.id, casts, row.contest, minutes);
    const bindings = {operator: {kind: 'operator', id: actor},
        ...Object.fromEntries(row.casts.map(kind => [kind, guRef(kind)]))};
    const ports = {read: ref => ref.kind === 'operator' ? ref : asBoundGu({id: ref.id, kind: ref.id})};
    const reserve = {reserves: {[actor]: {primeval: parts}}};
    const working = beginWorking(guWorkingLaw, method, {id: row.id, bindings, facts: reserve, at});
    const {record} = settleWorking(guWorkingLaw, working, {now: at + minutes, ports});
    const costs = record.receipts.flatMap(receipt => receipt.truth.costs ?? []);
    if (record.status !== 'complete') return {status: record.status, costs, reason: record.receipts.at(-1).reason};
    const {contest} = record.facts;
    return {status: record.status, costs, contest, effects: row.results[contest.held ? 'held' : 'failed']};
}

// Lower the scene for the structured command's preview and its pinned save
// shape. Settlement reruns the same row against the accepted reservation.
export function quoteGuExchange(row, actor, minutes) {
    const result = settleGuExchange(row, {actor, parts: Number.MAX_SAFE_INTEGER, minutes});
    if (result.status !== 'complete') throw Error('The Gu exchange could not be quoted.');
    const costs = result.costs.map(({cost}) => ({type: 'energy', actor, energyId: row.energyId,
        operation: 'use', output: cost, control: 1}));
    return {costs, parts: costs.reduce((sum, cost) => sum + cost.output, 0), effects: result.effects};
}

export function settleGuExchangeJob(row, job, minutes) {
    const parts = job.costs.reduce((sum, cost) => sum + cost.output, 0);
    const result = settleGuExchange(row, {actor: job.actorId, parts, at: job.due - minutes, minutes});
    if (result.status !== 'complete') throw Error('The accepted Gu exchange lost its reservation.');
    return result.effects;
}
