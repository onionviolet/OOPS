import {withSimulationFrame} from './simulation_render.js';

// Publication is a synchronous, read-only phase over a committed state. Mutable
// planning/clock work stays outside this frame unless its writers invalidate the
// input explicitly. No frame, version or projected fact is persisted.
let current = null;
let enabled = true;
let mutationDepth = 0;
const factFields = Symbol('fact fields');
export function setFactsFrameEnabledForTests(value) {
    const previous = enabled;
    enabled = value;
    return previous;
}
export function withFactsFrame(state, run) {
    const outer = current;
    current = enabled ? {state, rows: new Map(), versions: new Map(), parent: outer} : null;
    try {return withSimulationFrame(state, () => run());}
    finally {current = outer;}
}
export function invalidateFactsInput(input) {
    for(let frame = current; frame; frame = frame.parent)
        frame.versions.set(input, (frame.versions.get(input) || 0) + 1);
}
// A transaction can write the same input more than once, and can fail after a
// partial write to its disposable plan. No intermediate read may use a cache.
export function withFactsMutation(inputs, run) {
    mutationDepth++;
    try {return run();}
    finally {
        mutationDepth--;
        for(const input of inputs) invalidateFactsInput(input);
    }
}
// Identity vector, not a recursive value comparison: spread contexts and their
// scalar fact dictionaries may be new objects, but each supplied input retains
// its identity. Nested mutation requires its owner's explicit invalidation.
function inputs(frame, state, context, registry) {
    const values = [Object.keys(context).length, registry, state.clock, state.sequence, frame.versions.get(state) || 0,
        frame.versions.get(registry) || 0, frame.versions.get(context) || 0];
    for(const key of Object.keys(context).sort()) {
        values.push(key);
        const value = context[key];
        if(key === 'facts' && value && typeof value === 'object') {
            values.push(factFields, Object.keys(value).length, frame.versions.get(value) || 0);
            for(const fact of Object.keys(value).sort()) values.push(fact, value[fact]);
        } else values.push(value, frame.versions.get(value) || 0);
    }
    return values;
}
export function readFactsFrame(state, context, registry, build, fallback = build) {
    if(mutationDepth) return build();
    const frame = current;
    if(!frame || frame.state !== state) return fallback();
    const dependencies = inputs(frame, state, context, registry);
    let row = frame.rows;
    for(const input of dependencies) {
        if(!row.has(input)) row.set(input, new Map());
        row = row.get(input);
    }
    if(!row.has(readFactsFrame)) row.set(readFactsFrame, build());
    return {...row.get(readFactsFrame)};
}
