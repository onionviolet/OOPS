import {withSimulationFrame, inSimulationFrame} from './simulation_render.js';

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
// Display refreshes that may also run inside an existing pass over the same state
// join that pass, so they reuse its builds instead of hiding them behind a new frame.
export function withDisplayFactsFrame(state, run) {
    return inSimulationFrame(state) && (!enabled || current?.state === state) ? run() : withFactsFrame(state, run);
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
function frameRow(frame, state, context, registry, build) {
    const dependencies = inputs(frame, state, context, registry);
    // Keep one compact identity vector per read, rather than a Map node per
    // field/value. Large native contexts made that trie far larger than the
    // facts it cached. Actor/target buckets keep comparison lists local; every
    // dependency and explicit invalidation version still participates.
    let actors=frame.rows.get(registry);
    if(!actors)frame.rows.set(registry,actors=new Map());
    let targets=actors.get(context.actorId);
    if(!targets)actors.set(context.actorId,targets=new Map());
    let rows=targets.get(context.targetId);
    if(!rows)targets.set(context.targetId,rows=[]);
    for(const row of rows)if(sameInputs(row.dependencies,dependencies))return row.value;
    const value=build();rows.push({dependencies,value});return value;
}
function sameInputs(a,b){
    if(a.length!==b.length)return false;
    // Map keys used SameValueZero: NaN equals NaN and -0 equals +0.
    for(let i=0;i<a.length;i++)if(a[i]!==b[i]&&!Object.is(a[i],b[i]))return false;
    return true;
}
// The same cached row as readFactsFrame, without its defensive copy: the
// caller reads it and never changes it. Null outside a frame for this state,
// so the caller keeps its own uncached path.
export function peekFactsFrame(state, context, registry, build) {
    if(mutationDepth) return build();
    const frame = current;
    return frame && frame.state === state ? frameRow(frame, state, context, registry, build) : null;
}
export function readFactsFrame(state, context, registry, build, fallback = build) {
    if(mutationDepth) return build();
    const frame = current;
    if(!frame || frame.state !== state) return fallback();
    return {...frameRow(frame, state, context, registry, build)};
}
