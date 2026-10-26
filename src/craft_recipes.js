// Crafting engine: recipe grammar, matching and seeded discovery recipes.
// A recipe is role slots plus an optional process. Slots select by exact
// material, tag query or property threshold (audit C1: exact, profile and
// mixed-role recipes coexist). matchRecipe explains every miss so UI and
// NPCs share one answer. generateRecipe builds a world's secret recipe from an
// authored grammar (audit "seeded discovery recipe"); the caller freezes it.
import {natural as nat, positive as pos} from './basics.js';
import {address, compareCodePoints, drawU32, indexFromU32, withRetries, hash64} from './gen_kit.js';
import {MATRIX, deepFreeze, matchesQuery, materialTags, pickMaterial, validateMaterial, validateMaterialQuery, validateMaterialProperty, versioned} from './craft_materials.js';
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

export function checkSelector(catalogue, sel) {
    only(sel, ['material', 'tags', 'property', 'all'], 'selector');
    const kinds = Object.keys(sel);
    if(kinds.length !== 1) fail('A selector names exactly one of material, tags, property or all.');
    if(sel.material != null) text(sel.material, 'Selector material');
    if(sel.tags != null) validateMaterialQuery(catalogue, sel.tags);
    if(sel.property != null) {
        only(sel.property, ['axis', 'min', 'max'], 'property selector');
        validateMaterialProperty(catalogue, sel.property.axis);
        if(sel.property.axis === MATRIX) fail(`Unknown selector axis: ${sel.property.axis}.`);
        if((sel.property.min != null && !nat(sel.property.min)) || (sel.property.max != null && !nat(sel.property.max))) fail('Property bounds must be integers.');
        if(sel.property.min != null && sel.property.max != null && sel.property.max < sel.property.min) fail('Property bounds are reversed.');
    }
    if(sel.all != null) { if(!Array.isArray(sel.all) || !sel.all.length) fail('all needs selectors.'); sel.all.forEach(s => checkSelector(catalogue, s)); }
}

export function defineRecipe(catalogue, spec) {
    only(spec, ['id', 'revision', 'name', 'law', 'station', 'slots', 'process', 'origin'], 'recipe');
    if(!pos(spec.revision)) fail('Recipe revision must be a positive integer.');
    if(!Array.isArray(spec.slots) || !spec.slots.length || spec.slots.length > 8) fail('A recipe needs 1-8 slots.');
    const slots = spec.slots.map(slot => {
        only(slot, ['id', 'role', 'select', 'qty', 'share'], 'slot');
        if(!ROLES.includes(slot.role)) fail(`Unknown slot role: ${slot.role}.`);
        checkSelector(catalogue, slot.select);
        const [min, max] = slot.qty ?? [1, 1];
        if(!pos(min) || !Number.isSafeInteger(max) || max < min) fail(`Invalid quantity for slot ${slot.id}.`);
        return {id: text(slot.id, 'Slot ID'), role: slot.role, select: structuredClone(slot.select), qty: [min, max],
            ...(slot.share != null ? {share: text(slot.share, 'Shared function group')} : {})};
    });
    if(new Set(slots.map(s => s.id)).size !== slots.length) fail('Duplicate slot ID.');
    allocationGroups(slots); // reject incompatible authored simultaneous functions
    const process = spec.process == null ? null : spec.process.map(step => {
        only(step, ['op', 'levels'], 'recipe step');
        const [min, max] = step.levels ?? [1, 1];
        if(!pos(min) || !Number.isSafeInteger(max) || max < min) fail('Invalid recipe step levels.');
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

// Sharing is authored simultaneous use of the same matter. Without a share
// group, roles compete for quantity, including held catalyst capacity.
function allocationGroups(slots) {
    const groups = new Map();
    for(const slot of slots) {
        const key = slot.share == null ? `slot:${slot.id}` : `share:${slot.share}`;
        const group = groups.get(key) ?? {slots: [], min: 0, max: Number.MAX_SAFE_INTEGER, catalyst: slot.role === 'catalyst'};
        if(group.catalyst !== (slot.role === 'catalyst')) fail('Consumed and retained functions cannot share matter.');
        group.slots.push(slot);
        group.min = Math.max(group.min, slot.qty[0]); group.max = Math.min(group.max, slot.qty[1]);
        if(group.min > group.max) fail('Shared function quantities do not overlap.');
        groups.set(key, group);
    }
    return [...groups.values()];
}

// Integer lower/upper-capacity circulation. All selected amounts are used,
// not just a convenient minimum. Lot/group edges may split amounts in either
// direction, so blends and competing roles need no exponential partition scan.
function allocateLots(lots, groups, fits, allowUnknown) {
    const source = 0, firstLot = 1, firstGroup = firstLot + lots.length;
    const sink = firstGroup + groups.length, start = sink + 1, end = sink + 2;
    const edges = Array.from({length: end + 1}, () => []), demand = edges.map(() => 0);
    const add = (from, to, capacity) => {
        const forward = {to, capacity, initial: capacity, reverse: edges[to].length};
        const backward = {to: from, capacity: 0, initial: 0, reverse: edges[from].length};
        edges[from].push(forward); edges[to].push(backward); return forward;
    };
    const bound = (from, to, min, max) => {
        demand[from] -= min; demand[to] += min; return add(from, to, max - min);
    };
    const total = lots.reduce((n, lot) => n + lot.qty, 0);
    if(!Number.isSafeInteger(total) || total > Number.MAX_SAFE_INTEGER / 2) fail('Selected quantity exceeds safe arithmetic.');
    lots.forEach((lot, i) => bound(source, firstLot + i, lot.qty, lot.qty));
    const links = groups.map((group, g) => lots.map((lot, i) =>
        fits[g][i] === 'yes' || (allowUnknown && fits[g][i] === 'unknown')
            ? add(firstLot + i, firstGroup + g, lot.qty) : null));
    groups.forEach((group, g) => bound(firstGroup + g, sink, group.min, group.max));
    add(sink, source, total);
    let needed = 0;
    demand.forEach((amount, node) => {
        if(amount > 0) { add(start, node, amount); needed += amount; }
        else if(amount < 0) add(node, end, -amount);
    });
    let delivered = 0;
    while(delivered < needed) {
        const previous = edges.map(() => null), queue = [start]; previous[start] = true;
        for(let q = 0; q < queue.length && !previous[end]; q++) {
            const node = queue[q];
            for(const edge of edges[node]) if(edge.capacity > 0 && !previous[edge.to]) {
                previous[edge.to] = {node, edge}; queue.push(edge.to);
            }
        }
        if(!previous[end]) return null;
        let amount = needed - delivered;
        for(let node = end; node !== start; node = previous[node].node) amount = Math.min(amount, previous[node].edge.capacity);
        for(let node = end; node !== start; node = previous[node].node) {
            const {node: from, edge} = previous[node];
            edge.capacity -= amount; edges[node][edge.reverse].capacity += amount;
        }
        delivered += amount;
    }
    return links.map(rows => rows.map(edge => edge ? edge.initial - edge.capacity : 0));
}

// inputs: [{material, qty, role?, key?}]. Keys are optional exact-stock handles,
// not a second inventory. The host validates availability/custody at commit.
// assignment describes functions; debits/retained describe physical amounts.
export function matchRecipe(catalogue, recipe, inputs, {knows, process} = {}) {
    if(!Array.isArray(inputs)) fail('Inputs must be a list.');
    const keys = new Set();
    const lots = inputs.map(input => {
        if(!Number.isSafeInteger(input.qty) || input.qty < 1) fail('Input quantities must be positive whole units.');
        if(input.role != null && !['consumed', 'catalyst'].includes(input.role)) fail('Input role must be consumed or catalyst.');
        if(input.key != null) {
            text(input.key, 'Input key');
            if(keys.has(input.key)) fail('Select each physical input key once.');
            keys.add(input.key);
        }
        return {...input, material: validateMaterial(catalogue, input.material)};
    });
    const groups = allocationGroups(recipe.slots);
    const fits = groups.map(group => lots.map(lot => {
        if(group.catalyst !== (lot.role === 'catalyst')) return 'no';
        const results = group.slots.map(slot => selectorMatches(catalogue, slot.select, lot.material, knows));
        return results.includes('no') ? 'no' : results.includes('unknown') ? 'unknown' : 'yes';
    }));
    const allocation = allocateLots(lots, groups, fits, false) ?? allocateLots(lots, groups, fits, true);
    const physical = (lot, input, qty) => ({input, material: lot.material.id, qty, ...(lot.key != null ? {key: lot.key} : {})});
    const entries = [], unknown = [], problems = [];
    if(allocation) groups.forEach((group, g) => {
        const rows = lots.flatMap((lot, i) => allocation[g][i] ? [physical(lot, i, allocation[g][i])] : []);
        for(const slot of group.slots) {
            entries.push([slot.id, {material: rows.length === 1 ? rows[0].material : null,
                qty: rows.reduce((n, row) => n + row.qty, 0), allocations: rows}]);
            if(rows.some(row => selectorMatches(catalogue, slot.select, lots[row.input].material, knows) === 'unknown')) unknown.push(slot.id);
        }
    });
    else {
        groups.forEach((group, g) => {
            if(lots.reduce((n, lot, i) => n + (fits[g][i] !== 'no' ? lot.qty : 0), 0) < group.min)
                for(const slot of group.slots) problems.push({slot: slot.id, reason: 'no input fits'});
        });
        if(!problems.length) problems.push({slot: null, reason: 'selected amounts cannot fill every slot at once'});
    }
    if(recipe.process && process != null) {
        if(!Array.isArray(process) || process.length !== recipe.process.length) problems.push({slot: null, reason: 'process differs'});
        else recipe.process.forEach((step, i) => {
            const s = process[i];
            if(!s || s.op !== step.op || !Number.isSafeInteger(s.level) || s.level < step.levels[0] || s.level > step.levels[1]) problems.push({slot: null, reason: `step ${i + 1} differs`});
        });
    }
    const amounts = allocation ? lots.map((lot, i) => physical(lot, i, lot.qty)) : [];
    return {ok: !!allocation && !problems.length && !unknown.length,
        assignment: allocation ? Object.fromEntries(entries) : null, unknown, problems,
        debits: amounts.filter(row => lots[row.input].role !== 'catalyst'),
        retained: amounts.filter(row => lots[row.input].role === 'catalyst')};
}

// Named recognition checks the actual physical recipe and procedure. A recipe
// ref attached to a resolver request is provenance, not this recognition proof.
// The observer uses matchRecipe with knows; this helper evaluates truth.
export function recognizeRecipe(catalogue, recipe, inputs, {process, law, stations = []} = {}) {
    const result = matchRecipe(catalogue, recipe, inputs, {process});
    if(!Array.isArray(process)) result.problems.push({slot: null, reason: 'recognition needs the actual process'});
    if(recipe.law && law !== recipe.law) result.problems.push({slot: null, reason: 'law differs'});
    if(recipe.station && (!Array.isArray(stations) || !stations.includes(recipe.station))) result.problems.push({slot: null, reason: 'station differs'});
    const ok = result.ok && !result.problems.length;
    return {...result, ok, recognized: ok, ref: ok ? recipe.ref : null};
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
