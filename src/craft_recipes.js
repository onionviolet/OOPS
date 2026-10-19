// Crafting engine: recipe grammar, matching and seeded discovery recipes.
// A recipe is role slots plus an optional process. Slots select by exact
// material, tag query or property threshold (audit C1: exact, profile and
// mixed-role recipes coexist). matchRecipe explains every miss so UI and
// NPCs share one answer. generateRecipe builds a world's secret recipe from an
// authored grammar (audit "seeded discovery recipe"); the caller freezes it.
import {natural as nat, positive as pos} from './basics.js';
import {address, compareCodePoints, drawU32, indexFromU32, withRetries, hash64} from './gen_kit.js';
import {MATRIX, deepFreeze, matchesQuery, materialTags, pickMaterial, validateMaterial, versioned} from './craft_materials.js';
import {resolveBatch} from './craft_resolver.js';

export const RECIPE_GENERATOR = 'craft.recipe@1';
const ROLES = ['base', 'active', 'solvent', 'binder', 'catalyst', 'additive'];
const fail = message => { throw new Error(message); };
const text = (value, label) => typeof value === 'string' && value.length ? value : fail(`${label} must be non-empty text.`);
const only = (value, allowed, label) => {
    if(!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object.`);
    for(const key of Object.keys(value)) if(!allowed.includes(key)) fail(`Unknown ${label} field: ${key}.`);
};
const hex = (root, key) => { const {lo, hi} = hash64(root, key); return hi.toString(16).padStart(8, '0') + lo.toString(16).padStart(8, '0'); };

function checkSelector(catalogue, sel) {
    only(sel, ['material', 'tags', 'property', 'all'], 'selector');
    const kinds = Object.keys(sel);
    if(kinds.length !== 1) fail('A selector names exactly one of material, tags, property or all.');
    if(sel.material != null) text(sel.material, 'Selector material');
    if(sel.tags != null) matchesQuery(sel.tags, new Set()); // shape check
    if(sel.property != null) {
        only(sel.property, ['axis', 'min', 'max'], 'property selector');
        if(!catalogue.axes[sel.property.axis] || sel.property.axis === MATRIX) fail(`Unknown selector axis: ${sel.property.axis}.`);
        if((sel.property.min != null && !nat(sel.property.min)) || (sel.property.max != null && !nat(sel.property.max))) fail('Property bounds must be integers.');
    }
    if(sel.all != null) { if(!Array.isArray(sel.all) || !sel.all.length) fail('all needs selectors.'); sel.all.forEach(s => checkSelector(catalogue, s)); }
}

export function defineRecipe(catalogue, spec) {
    only(spec, ['id', 'revision', 'name', 'law', 'station', 'slots', 'process', 'origin'], 'recipe');
    if(!pos(spec.revision)) fail('Recipe revision must be a positive integer.');
    if(!Array.isArray(spec.slots) || !spec.slots.length || spec.slots.length > 8) fail('A recipe needs 1-8 slots.');
    const slots = spec.slots.map(slot => {
        only(slot, ['id', 'role', 'select', 'qty'], 'slot');
        if(!ROLES.includes(slot.role)) fail(`Unknown slot role: ${slot.role}.`);
        checkSelector(catalogue, slot.select);
        const [min, max] = slot.qty ?? [1, 1];
        if(!pos(min) || !Number.isSafeInteger(max) || max < min) fail(`Invalid quantity for slot ${slot.id}.`);
        return {id: text(slot.id, 'Slot ID'), role: slot.role, select: structuredClone(slot.select), qty: [min, max]};
    });
    if(new Set(slots.map(s => s.id)).size !== slots.length) fail('Duplicate slot ID.');
    const process = spec.process == null ? null : spec.process.map(step => {
        only(step, ['op', 'levels'], 'recipe step');
        const [min, max] = step.levels ?? [1, 1];
        if(!pos(min) || max < min) fail('Invalid recipe step levels.');
        return {op: text(step.op, 'Recipe op'), levels: [min, max]};
    });
    return deepFreeze({id: text(spec.id, 'Recipe ID'), revision: spec.revision, ref: versioned(spec.id, spec.revision),
        name: spec.name ?? spec.id, law: spec.law ?? null, station: spec.station ?? null, slots, process,
        ...(spec.origin ? {origin: structuredClone(spec.origin)} : {})});
}

// Returns 'yes' | 'no' | 'unknown'. knows(materialId, axis) gates property
// tests to what the maker has observed; omitted means true knowledge (NPC
// with full lore, or the physical check at commit time). Truth still decides
// the batch; knowledge only changes recommendations (audit C2).
export function selectorMatches(catalogue, sel, material, knows) {
    if(sel.material != null) return sel.material === material.id ? 'yes' : 'no';
    if(sel.tags != null) return matchesQuery(sel.tags, materialTags(catalogue, material)) ? 'yes' : 'no';
    if(sel.property != null) {
        const {axis, min, max} = sel.property;
        if(knows && !knows(material.id, axis)) return 'unknown';
        const value = catalogue.axes[axis].kind === 'fraction' ? Math.floor(material.properties[axis] * 1000 / catalogue.basis) : material.properties[axis];
        return (min == null || value >= min) && (max == null || value <= max) ? 'yes' : 'no';
    }
    const results = sel.all.map(s => selectorMatches(catalogue, s, material, knows));
    return results.includes('no') ? 'no' : results.includes('unknown') ? 'unknown' : 'yes';
}

// inputs: [{material, qty, role?}]. Each input fills one slot. Returns the
// slot assignment, or problems naming what is missing, extra or unknown.
export function matchRecipe(catalogue, recipe, inputs, {knows, process} = {}) {
    const lots = inputs.map(input => ({...input, material: validateMaterial(catalogue, input.material)}));
    const fits = (slot, lot) => {
        if((slot.role === 'catalyst') !== (lot.role === 'catalyst')) return 'no';
        if(lot.qty < slot.qty[0] || lot.qty > slot.qty[1]) return 'no';
        return selectorMatches(catalogue, slot.select, lot.material, knows);
    };
    let best = null;
    const used = new Set(), assignment = {};
    const search = (index, unknown) => {
        if(index === recipe.slots.length) {
            if(used.size === lots.length && (!best || unknown.length < best.unknown.length)) best = {assignment: {...assignment}, unknown: [...unknown]};
            return best && !best.unknown.length;
        }
        const slot = recipe.slots[index];
        for(let i = 0; i < lots.length; i++) {
            if(used.has(i)) continue;
            const fit = fits(slot, lots[i]);
            if(fit === 'no') continue;
            used.add(i); assignment[slot.id] = {material: lots[i].material.id, qty: lots[i].qty};
            if(search(index + 1, fit === 'unknown' ? [...unknown, slot.id] : unknown)) return true;
            used.delete(i); delete assignment[slot.id];
        }
        return false;
    };
    search(0, []);
    const problems = [];
    if(!best) {
        for(const slot of recipe.slots) if(!lots.some(lot => fits(slot, lot) !== 'no')) problems.push({slot: slot.id, reason: 'no input fits'});
        if(lots.length > recipe.slots.length) problems.push({slot: null, reason: 'extra inputs'});
        if(!problems.length) problems.push({slot: null, reason: 'inputs cannot fill every slot at once'});
    }
    if(recipe.process && process) {
        if(process.length !== recipe.process.length) problems.push({slot: null, reason: 'process differs'});
        else recipe.process.forEach((step, i) => {
            const s = process[i];
            if(s.op !== step.op || s.level < step.levels[0] || s.level > step.levels[1]) problems.push({slot: null, reason: `step ${i + 1} differs`});
        });
    }
    return {ok: !!best && !problems.length && !best.unknown.length, assignment: best?.assignment ?? null, unknown: best?.unknown ?? [], problems};
}

// grammar: {id, revision, law, station?, slots:[{id, role, pool, select:'material'|'tags'|'property', qty:[lo,hi]}],
//   process:{choices:[{op, levels:[lo,hi]}], steps:[min,max]}, route, fallback:{recipe spec, witness}}
// Validation: distinct materials and the witness batch yields a positive
// output on grammar.route (GR6 + GR12: a worthwhile, makeable result).
export function generateRecipe(law, grammar, {root, scope, index, overlays, extra} = {}) {
    const {catalogue} = law;
    if(!nat(index)) fail('Recipe index must be a non-negative integer.');
    const base = address('craft.recipe', law.ref, versioned(grammar.id, grammar.revision), text(scope, 'Recipe scope'), index);
    const id = `genrecipe:${grammar.id}:${hex(root, base)}`;
    const make = key => {
        const chosen = [], slots = [], witness = [];
        for(const slot of grammar.slots) {
            const {value: material} = pickMaterial(catalogue, slot.pool, {root, key: address(key, 'slot', slot.id), overlays, extra, exclude: chosen});
            if(!material) return null;
            chosen.push(material.id);
            const [lo, hi] = slot.qty ?? [1, 1];
            const qty = lo + indexFromU32(drawU32(root, address(key, 'qty', slot.id)), hi - lo + 1);
            let select;
            if(slot.select === 'material') select = {material: material.id};
            else if(slot.select === 'tags') select = {tags: {all: [...materialTags(catalogue, material)].sort(compareCodePoints)}};
            else {
                const axes = Object.keys(material.properties).filter(a => a !== MATRIX && catalogue.axes[a].kind === 'fraction' && material.properties[a] > 0);
                if(!axes.length) return null;
                const axis = axes.sort((a, b) => material.properties[b] - material.properties[a] || compareCodePoints(a, b))[0];
                select = {all: [{tags: slot.pool}, {property: {axis, min: Math.floor(material.properties[axis] * 1000 / catalogue.basis * 7 / 10)}}]};
            }
            slots.push({id: slot.id, role: slot.role, select, qty: [qty, qty]});
            witness.push({material, qty, role: slot.role === 'catalyst' ? 'catalyst' : 'consumed'});
        }
        const [smin, smax] = grammar.process.steps;
        const count = smin + indexFromU32(drawU32(root, address(key, 'steps')), smax - smin + 1);
        const choices = [...grammar.process.choices], process = [];
        for(let i = 0; i < count && choices.length; i++) {
            const choice = choices.splice(indexFromU32(drawU32(root, address(key, 'step', i)), choices.length), 1)[0];
            const level = choice.levels[0] + indexFromU32(drawU32(root, address(key, 'level', i)), choice.levels[1] - choice.levels[0] + 1);
            process.push({op: choice.op, level});
        }
        return {spec: {id, revision: 1, name: grammar.name ?? grammar.id, law: law.ref, station: grammar.station ?? null, slots,
            process: process.map(s => ({op: s.op, levels: [s.level, s.level]}))}, witness: {inputs: witness, process}};
    };
    const worthwhile = candidate => {
        if(!candidate) return false;
        try {
            const {product} = resolveBatch(law, {...candidate.witness, stations: grammar.station ? [grammar.station] : []});
            return Object.values(product.outputs[grammar.route] ?? {}).some(v => v > 0);
        } catch { return false; }
    };
    const {value, receipt} = withRetries(make, worthwhile, {max: 12, fallback: {id: `${grammar.id}:fallback`, value: grammar.fallback}, address: base});
    const origin = {generator: RECIPE_GENERATOR, grammar: versioned(grammar.id, grammar.revision), scope, index, ...(receipt.fallbackUsed ? {fallback: true} : {})};
    const recipe = defineRecipe(catalogue, {...value.spec, origin});
    return {value: recipe, witness: {inputs: value.witness.inputs.map(w => ({material: w.material.id, qty: w.qty, role: w.role})), process: value.witness.process}, receipt};
}
