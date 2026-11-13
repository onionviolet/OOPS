// A failed handoff keeps its batch in the interrupted record. The successor
// owns the remaining steps. The previous record stays available as history.
import {check, object} from './basics.js';
import {BREW_LAW} from './brew_law.js';
import {startEngineWorking} from './engine_world.js';

const recoverable = {
    pour: new Set(['flask-out-of-reach', 'empty-flask-unavailable']),
    'stir-by-operator': new Set(['brew-operator-out-of-reach', 'brew-operator-unfocused', 'brew-operator-short-stamina']),
};

function resumeBrewStep(engine, {from, id, flask}, operation, description) {
    const entry = Object.hasOwn(engine.records.workings, from) && engine.records.workings[from];
    const record = entry?.record;
    const failure = record?.receipts.at(-1);
    check(record?.law === BREW_LAW.ref && record.status === 'interrupted' &&
        failure?.op === operation && record.method.steps[record.cursor]?.op === operation &&
        failure.cause === 'operation' && recoverable[operation].has(failure.reason),
        `The brew has no recoverable interrupted ${description}.`);
    check(record.pace === undefined, 'The brew needs its original pace provider to continue.');
    check(!entry.continuedBy, 'The interrupted brew already has a continuation.');
    const steps = record.method.steps.slice(record.cursor);
    const method = {...record.method, steps};
    const bindings = {...record.bindings};
    if (flask !== undefined) {
        check(object(flask) && flask.kind === 'flask', 'A replacement must be a flask.');
        bindings[steps[0].bindings.flask] = flask;
    }
    // Claim the remaining work before settling an immediate retry. Starting
    // is immutable, so an exception leaves the caller's engine untouched.
    const claimed = {...engine, records: {...engine.records, workings: {
        ...engine.records.workings, [from]: {...entry, continuedBy: id},
    }}};
    return startEngineWorking(claimed, {law: BREW_LAW, method, id, bindings, facts: record.facts, payer: entry.payer});
}

export function resumeBrewPour(engine, options = {}) {
    return resumeBrewStep(engine, options, 'pour', 'pour');
}

export function resumeBrewStir(engine, {from, id} = {}) {
    return resumeBrewStep(engine, {from, id}, 'stir-by-operator', 'operator stir');
}
