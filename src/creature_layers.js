// Templates as removable layers on a creature (PFA8 proposal, 2026-11-04).
// Pure: no clock, no randomness, never mutates its input. A layer is a list of
// changes ({path, op}) applied over a body. The creature keeps `base` (the body
// before any layer, set on first apply) and `layerDefs`; removal recomputes from
// base by reapplying the remaining layers in order, so removal order never
// corrupts values. Default: layers are removable; `permanent: true` refuses
// removal (dial) because the world says the change cannot simply be undone,
// and the refusal returns the reason. Edits made outside layers after the first
// apply are not tracked; change `base` to change the body underneath.
// Ops: add (numeric sum), set (replace), tag/untag (membership in an array at
// the path). Calibration layers paraphrase PF1 monster templates (OGL).

const OPS = ['add', 'set', 'tag', 'untag'];

export function defineLayer(d) {
    if (!d?.id) throw Error('A layer needs an id.');
    if (!Array.isArray(d.changes) || !d.changes.length) throw Error(`${d.id}: a layer needs at least one change.`);
    for (const c of d.changes) {
        if (typeof c.path !== 'string' || !c.path) throw Error(`${d.id}: every change needs a path.`);
        if (!OPS.includes(c.op)) throw Error(`${d.id}: unknown op '${c.op}'.`);
        if (c.op === 'add' && !Number.isFinite(c.value)) throw Error(`${d.id}: add needs a numeric value at ${c.path}.`);
        if ((c.op === 'tag' || c.op === 'untag') && typeof c.value !== 'string') throw Error(`${d.id}: ${c.op} needs a string value at ${c.path}.`);
    }
    for (const [slot, n] of Object.entries(d.uses ?? {})) if (!(Number.isInteger(n) && n > 0)) throw Error(`${d.id}: uses.${slot} must be a positive whole number.`);
    return Object.freeze({label: d.id, permanent: false, source: null, ...d,
        changes: Object.freeze(d.changes.map(c => Object.freeze({...c})))});
}

const parts = p => p.split('.');
function getAt(obj, path) { return parts(path).reduce((o, k) => o?.[k], obj); }
function setAt(obj, path, v) {
    const ks = parts(path);
    let o = obj;
    for (const k of ks.slice(0, -1)) o = (o[k] ??= {});
    o[ks.at(-1)] = v;
}

// Mutates `body` (a private clone) and returns [{path, before, after}].
function runChanges(body, layer) {
    const log = [];
    for (const c of layer.changes) {
        const before = structuredClone(getAt(body, c.path));
        let after;
        if (c.op === 'add') after = (before ?? 0) + c.value;
        else if (c.op === 'set') after = structuredClone(c.value);
        else {
            const list = Array.isArray(before) ? [...before] : [];
            after = c.op === 'tag' ? (list.includes(c.value) ? list : [...list, c.value]) : list.filter(t => t !== c.value);
        }
        setAt(body, c.path, after);
        log.push({path: c.path, op: c.op, before, after: structuredClone(after)});
    }
    return log;
}

const META = ['base', 'layers', 'layerDefs', 'layerLog'];
const bodyOf = creature => { const b = structuredClone(creature); for (const k of META) delete b[k]; return b; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Capacity (PFA9, AB21): a layer may use a bodily budget, `uses: {slot: n}`
// (an implant fills body capacity), against the creature's `capacity`. The
// default is unlimited for a slot the creature does not name. Ask fitsLayer
// first; applyLayer refuses a layer that does not fit.
export function fitsLayer(creature, layer) {
    for (const [slot, n] of Object.entries(layer.uses ?? {})) {
        const max = creature.capacity?.[slot];
        if (max == null) continue;
        const used = (creature.layerDefs ?? []).reduce((a, d) => a + (d.uses?.[slot] ?? 0), 0);
        if (used + n > max) return {ok: false, slot, used, max, reason: `Not enough ${slot} capacity: ${used} of ${max} used, this needs ${n}.`};
    }
    return {ok: true};
}

export function applyLayer(creature, layer) {
    const defs = creature.layerDefs ?? [];
    if (defs.some(d => d.id === layer.id)) throw Error(`${layer.id}: layer already applied.`);
    const fit = fitsLayer(creature, layer);
    if (!fit.ok) throw Error(`${layer.id}: ${fit.reason}`);
    const next = structuredClone(creature);
    next.base ??= bodyOf(creature);
    next.layerDefs = [...defs.map(d => structuredClone(d)), structuredClone(layer)];
    const log = runChanges(next, layer);
    next.layers = next.layerDefs.map(d => d.id);
    next.layerLog = [...(creature.layerLog ?? []), {layer: layer.id, action: 'apply', changes: log}];
    return next;
}

export function removeLayer(creature, layerId) {
    const defs = creature.layerDefs ?? [];
    const target = defs.find(d => d.id === layerId);
    if (!target) return {ok: false, reason: `${layerId} is not applied.`};
    if (target.permanent) return {ok: false, reason: `${target.label ?? layerId} is permanent and cannot be removed.`};
    const remaining = defs.filter(d => d.id !== layerId);
    const rebuilt = structuredClone(creature.base);
    for (const d of remaining) runChanges(rebuilt, d);
    const changes = [];
    for (const path of new Set(target.changes.map(c => c.path))) {
        const before = getAt(creature, path), after = getAt(rebuilt, path);
        if (!same(before, after)) changes.push({path, before: structuredClone(before), after: structuredClone(after)});
    }
    rebuilt.base = structuredClone(creature.base);
    rebuilt.layerDefs = remaining.map(d => structuredClone(d));
    rebuilt.layers = remaining.map(d => d.id);
    rebuilt.layerLog = [...(creature.layerLog ?? []), {layer: layerId, action: 'remove', changes}];
    return {ok: true, creature: rebuilt};
}

// Calibration layers (paraphrased from PF1 templates; numbers are points, not law).
export const GHOSTLY = defineLayer({id: 'ghostly', label: 'Ghostly', source: 'PF1 ghost template (OGL), paraphrased', changes: [
    {path: 'tags', op: 'tag', value: 'incorporeal'},
    {path: 'tags', op: 'untag', value: 'needs_breath'},
    {path: 'hp.bonus', op: 'add', value: 10}]});
export const HALF_DRAGON = defineLayer({id: 'half_dragon', label: 'Half-dragon', source: 'PF1 half-dragon template (OGL), paraphrased', changes: [
    {path: 'armor.natural', op: 'add', value: 4},
    {path: 'tags', op: 'tag', value: 'dragon_blooded'},
    {path: 'resist.fire', op: 'add', value: 10}]});

// Original implant calibration: a reflex wire filling two points of a body's
// implant capacity, the PF1 technology pack's cybertech pattern (OGL) in outline.
export const REFLEX_WIRE = defineLayer({id: 'reflex_wire', label: 'Reflex wire', uses: {implant: 2}, source: 'original, after PF1 cybertech implant capacity (OGL)',
    changes: [{path: 'stats.initiative', op: 'add', value: 2}, {path: 'tags', op: 'tag', value: 'augmented'}]});
