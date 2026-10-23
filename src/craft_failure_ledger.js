// Failure record for crafting (IM22, gaps G33/G37; AD9): a plain-JSON ledger
// of what failed and why, keyed by the consumed-material set, and a forecast
// that reads only the ledger. The forecast never calls resolveBatch, so it can
// say nothing the player has not already seen. Embed the ledger in a save slice
// as-is; validateFailureLedger runs on load. Not wired into live gameplay yet
// (the crafting pack is not live; see docs/CRAFTING_ENGINE.md).
import {compareCodePoints} from './gen_kit.js';

export const LEDGER_FAMILY = 'craft.failures@1';
export const MAX_PAIRS = 200;
export const MAX_TRIES_PER_PAIR = 12;
const fail = message => { throw new Error(message); };
const isCount = n => Number.isSafeInteger(n) && n > 0;

export const createFailureLedger = () => ({family: LEDGER_FAMILY, pairs: {}});

const pairKey = ids => [...new Set(ids)].sort(compareCodePoints).join('\u0000');
const processKey = process => process.map(([op, level]) => `${op}#${level}`).join('>');

// Why a batch failed, from its own trace: reactions that fired explain the
// loss; an unexplained empty result is 'inert'.
export function failureReasons(result) {
    const fired = [...new Set(result.trace.filter(t => t.kind === 'reaction').map(t => t.id))].sort(compareCodePoints);
    return fired.length ? fired.map(id => `reaction:${id}`) : ['inert'];
}

// The leftover: non-matrix composition the batch ended with, as axis -> amount.
export function residueOf(result, matrixAxis = 'matrix') {
    const out = {};
    for(const [axis, amount] of Object.entries(result.product.composition)) if(axis !== matrixAxis && amount > 0) out[axis] = amount;
    return out;
}

// Records a resolved batch. A batch with no outputs is a failure; any other is
// ignored (returns the same ledger). Returns a new ledger; the input is untouched.
export function recordBatchAttempt(ledger, result) {
    const {product} = result;
    if(Object.keys(product.outputs).length) return ledger;
    const consumed = product.inputs.filter(i => i[0] === 'consumed').map(i => i[1]);
    const key = pairKey(consumed);
    const prior = ledger.pairs[key];
    const process = processKey(product.process);
    const same = prior?.tries.find(t => t.process === process);
    const entry = {materials: [...new Set(consumed)].sort(compareCodePoints), tries: prior ? prior.tries.map(t => ({...t})) : [], count: (prior?.count ?? 0) + 1};
    if(same) { const t = entry.tries.find(x => x.process === process); t.count += 1; }
    else {
        entry.tries.push({process, count: 1, reasons: failureReasons(result), residue: residueOf(result)});
        if(entry.tries.length > MAX_TRIES_PER_PAIR) entry.tries.shift();
    }
    const pairs = {...ledger.pairs, [key]: entry};
    const keys = Object.keys(pairs);
    if(keys.length > MAX_PAIRS) delete pairs[keys[0]];
    return {family: LEDGER_FAMILY, pairs};
}

// Reads the ledger only. request: {materials:[id], process:[[op, level]]}.
// verdict: 'untried' | 'near' (same materials, other process) | 'known-fail'.
export function forecastFromLedger(ledger, {materials, process = []}) {
    const entry = ledger.pairs[pairKey(materials)];
    if(!entry) return {verdict: 'untried', tries: 0, reasons: [], residue: {}};
    const exact = entry.tries.find(t => t.process === processKey(process));
    if(exact) return {verdict: 'known-fail', tries: exact.count, reasons: exact.reasons, residue: exact.residue};
    const last = entry.tries[entry.tries.length - 1];
    return {verdict: 'near', tries: 0, reasons: last.reasons, residue: last.residue, otherProcesses: entry.tries.map(t => t.process)};
}

export function validateFailureLedger(ledger) {
    if(ledger?.family !== LEDGER_FAMILY || !ledger.pairs || typeof ledger.pairs !== 'object') fail('Unsupported failure ledger.');
    for(const [key, e] of Object.entries(ledger.pairs)) {
        if(!Array.isArray(e.materials) || key !== pairKey(e.materials) || !isCount(e.count) || !Array.isArray(e.tries) || !e.tries.length) fail('Corrupt failure ledger entry.');
        for(const t of e.tries) if(typeof t.process !== 'string' || !isCount(t.count) || !Array.isArray(t.reasons) || !t.residue || typeof t.residue !== 'object') fail('Corrupt failure ledger try.');
    }
    return ledger;
}
