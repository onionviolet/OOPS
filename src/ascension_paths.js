// Paths of ascension as world data (ASC1-ASC3, docs/RESEARCH_CULTIVATION_PATHS.md).
// A world or method declares its own ladder; this leaf only validates the
// descriptor and evaluates crossings against facts the owning domain supplies.
// It holds no state, no clock and no save slice (AR3, AR12). Rank, potion,
// condensate and practice remain with their owners.
import {check, deepFreeze, natural, object} from './basics.js';

export const pathShapes = Object.freeze(['ladder','tree','web','wheel','stack','field']);
// Crossing vocabulary from the canon table. A type names how the edge is crossed;
// the owner decides what its fact means.
export const crossingTypes = Object.freeze(['quota','structure','insight','trial','ingest','digest','consume','recognition','bodyPoint']);
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.-]*$/.test(v);
const factKey = v => typeof v === 'string' && /^[a-zA-Z][a-zA-Z0-9_.]*$/.test(v);
const text = v => typeof v === 'string' && v.length > 0;

function validateCrossing(c, where) {
    check(object(c) && id(c.id) && crossingTypes.includes(c.type) && text(c.label) && factKey(c.fact), `Invalid crossing at ${where}.`);
    check(c.need === true || natural(c.need), `Invalid crossing need at ${where}.${c.id}.`);
    check(c.irreversible === undefined || typeof c.irreversible === 'boolean', `Invalid crossing irreversibility at ${where}.${c.id}.`);
}
function validateStage(s, i, path) {
    const where = `${path.id}.${s?.id}`;
    check(object(s) && id(s.id) && text(s.label), `Invalid stage ${i} in ${path.id}.`);
    check(Array.isArray(s.crossings) && (i === 0 ? s.crossings.length === 0 : s.crossings.length > 0), `Stage ${where} needs crossings except at the entry.`);
    s.crossings.forEach(c => validateCrossing(c, where));
    check(new Set(s.crossings.map(c => c.id)).size === s.crossings.length, `Duplicate crossing in ${where}.`);
    check(Array.isArray(s.grants) && s.grants.every(text), `Invalid grants at ${where}.`);
    check(s.failure === undefined || (object(s.failure) && text(s.failure.signs) && text(s.failure.outcome)), `Invalid failure at ${where}.`);
}
// Returns a frozen copy. Stages are ordered: index 0 is the entry state, and
// each later stage lists what crosses into it from the one before.
export function definePath(desc) {
    check(object(desc) && id(desc.id) && id(desc.world) && text(desc.label) && pathShapes.includes(desc.shape), 'Invalid ascension path.');
    check(Array.isArray(desc.stages) && desc.stages.length >= 2, `Path ${desc.id} needs at least two stages.`);
    desc.stages.forEach((s, i) => validateStage(s, i, desc));
    check(new Set(desc.stages.map(s => s.id)).size === desc.stages.length, `Duplicate stage in ${desc.id}.`);
    return deepFreeze(structuredClone(desc));
}

const met = (c, facts) => c.need === true ? facts[c.fact] === true : natural(facts[c.fact]) && facts[c.fact] >= c.need;
// Observer-safe projection (AR8). `known` is how many stages the observer can
// name; later ones show as ??? (ASC6, PFA056). `ceiling` is a stage index the
// owner imposes (a world cap, a flame count); crossings past it are blocked even
// when every fact is met.
export function pathView(path, position, facts = {}, {known = path.stages.length, ceiling = path.stages.length - 1} = {}) {
    check(natural(position) && position < path.stages.length, `Invalid position on ${path.id}.`);
    check(object(facts) && natural(known) && natural(ceiling), `Invalid view options on ${path.id}.`);
    const name = i => i < Math.max(known, position + 1) ? path.stages[i].label : '???';
    const nextIndex = position + 1 < path.stages.length ? position + 1 : null;
    const next = nextIndex === null ? null : path.stages[nextIndex];
    const crossings = next ? next.crossings.map(c => ({id:c.id, type:c.type, label:c.label, need:c.need,
        have:c.need === true ? facts[c.fact] === true : (natural(facts[c.fact]) ? facts[c.fact] : 0), met:met(c, facts), irreversible:c.irreversible === true})) : [];
    const capped = nextIndex !== null && nextIndex > ceiling;
    return {path:path.id, world:path.world, label:path.label, position, stage:path.stages[position].label,
        grants:[...path.stages[position].grants], previous:position > 0 ? name(position - 1) : null,
        next:nextIndex === null ? null : name(nextIndex), crossings, capped,
        ready:next !== null && !capped && crossings.every(c => c.met),
        failure:next?.failure ? {...next.failure} : null,
        ladder:path.stages.map((s, i) => ({label:name(i), reached:i <= position}))};
}
