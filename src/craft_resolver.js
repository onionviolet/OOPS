// Crafting engine: craft laws and the pure batch resolver.
// resolveBatch(law, request) -> {product, debits, retained, trace}. Same
// inputs, process, stations and law revision always give the same product; no
// draws are taken, so previews, NPC makers and sandboxes can call it freely
// (crafting palette II1, GR13). Integer math only; mass is conserved and
// every constituent, including traces, is retained (audit R4, C3).
import {natural as nat, positive as pos} from './basics.js';
import {address, compareCodePoints} from './gen_kit.js';
import {MATRIX, deepFreeze, matchesQuery, materialTags, validateMaterial, versioned} from './craft_materials.js';

export const BATCH_FAMILY = 'craft.batch@1';
export const MAX_INPUT_QTY = 999;
export const MAX_STEPS = 12;
const fail = message => { throw new Error(message); };
const text = (value, label) => typeof value === 'string' && value.length ? value : fail(`${label} must be non-empty text.`);
const only = (value, allowed, label) => {
    if(!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object.`);
    for(const key of Object.keys(value)) if(!allowed.includes(key)) fail(`Unknown ${label} field: ${key}.`);
};
const safe = n => Number.isSafeInteger(n) ? n : fail('Crafting arithmetic left the safe integer range.');
const sortKeys = object => Object.fromEntries(Object.keys(object).sort(compareCodePoints).map(key => [key, object[key]]));

// Law spec: {id, revision, catalogue, carrier, ops, reactions, outputs, tagLaws}.
//  op:       {id, station?, levels:[min,max], converts:[{from,to,permille,perLevel?,minLevel?}], availability:{axis:permille}}
//  reaction: {id, priority?, after?:opId, catalyst?:tagQuery, station?, limit?:permille, reactants:{axis:n}, products:{axis:n}}
//  output:   {id, route, effect, axis, per, mode:'dose'|'total'|'scalar'}
//  tagLaw:   {tag, axis, min}  (fraction axes: permille concentration; scalar: value)
export function defineCraftLaw(spec) {
    only(spec, ['id', 'revision', 'catalogue', 'carrier', 'ops', 'reactions', 'outputs', 'tagLaws','directions','thermal'], 'law');
    const catalogue = spec.catalogue ?? fail('Law needs a catalogue.');
    const axis = (id, kind) => {
        const def = catalogue.axes[id] ?? fail(`Unknown law axis: ${id}.`);
        if(kind && def.kind !== kind) fail(`Axis ${id} must be a ${kind} axis.`);
        return id;
    };
    if(!pos(spec.revision)) fail('Law revision must be a positive integer.');
    const ops = {};
    for(const op of spec.ops ?? []) {
        only(op, ['id', 'station', 'levels', 'converts', 'availability', 'label'], 'op');
        if(ops[text(op.id, 'Op ID')]) fail(`Duplicate op: ${op.id}.`);
        const [min, max] = op.levels ?? [1, 1];
        if(!pos(min) || !Number.isSafeInteger(max) || max < min) fail(`Invalid levels for ${op.id}.`);
        if(op.station != null && !catalogue.registry.has(op.station)) fail(`Unknown station tag: ${op.station}.`);
        const converts = (op.converts ?? []).map(c => {
            only(c, ['from', 'to', 'permille', 'perLevel', 'minLevel'], 'convert');
            axis(c.from, 'fraction'); axis(c.to, 'fraction');
            if(c.from === c.to || !nat(c.permille) || c.permille > 1000 || !Number.isSafeInteger(c.perLevel ?? 0) || !pos(c.minLevel ?? min)) fail(`Invalid convert in ${op.id}.`);
            return {from: c.from, to: c.to, permille: c.permille, perLevel: c.perLevel ?? 0, minLevel: c.minLevel ?? min};
        });
        const availability = {};
        for(const [id, permille] of Object.entries(op.availability ?? {})) { axis(id); if(!nat(permille)) fail('Availability must be an integer permille.'); availability[id] = permille; }
        ops[op.id] = {id: op.id, label: op.label ?? op.id, station: op.station ?? null, levels: [min, max], converts, availability: sortKeys(availability)};
    }
    const reactions = (spec.reactions ?? []).map(r => {
        only(r, ['id', 'priority', 'after', 'catalyst', 'station', 'limit', 'reactants', 'products'], 'reaction');
        text(r.id, 'Reaction ID');
        if(r.after != null && !ops[r.after]) fail(`Reaction ${r.id} follows unknown op ${r.after}.`);
        const sum = side => Object.entries(side ?? {}).reduce((n, [id, k]) => { axis(id, 'fraction'); if(!pos(k)) fail(`Reaction ${r.id} needs positive integer ratios.`); return n + k; }, 0);
        if(!sum(r.reactants) || sum(r.reactants) !== sum(r.products)) fail(`Reaction ${r.id} must conserve mass.`);
        const limit = r.limit ?? 1000;
        if(!nat(limit) || limit > 1000 || !Number.isSafeInteger(r.priority ?? 0)) fail(`Invalid limit or priority in ${r.id}.`);
        return {id: r.id, priority: r.priority ?? 0, after: r.after ?? null, catalyst: r.catalyst ?? null, station: r.station ?? null, limit,
            reactants: sortKeys({...r.reactants}), products: sortKeys({...r.products})};
    }).sort((a, b) => b.priority - a.priority || compareCodePoints(a.id, b.id));
    if(new Set(reactions.map(r => r.id)).size !== reactions.length) fail('Duplicate reaction ID.');
    const outputs = (spec.outputs ?? []).map(o => {
        only(o, ['id', 'route', 'effect', 'axis', 'per', 'mode'], 'output');
        text(o.id, 'Output ID'); text(o.route, 'Route'); text(o.effect, 'Effect');
        const mode = o.mode ?? 'dose';
        if(!['dose', 'total', 'scalar'].includes(mode)) fail(`Unknown output mode in ${o.id}.`);
        axis(o.axis, mode === 'scalar' ? 'scalar' : 'fraction');
        if(!Number.isSafeInteger(o.per)) fail(`Output ${o.id} needs an integer per.`);
        return {id: o.id, route: o.route, effect: o.effect, axis: o.axis, per: o.per, mode};
    });
    const tagLaws = (spec.tagLaws ?? []).map(t => {
        only(t, ['tag', 'axis', 'min'], 'tag law');
        if(!catalogue.registry.has(t.tag)) fail(`Unknown derived tag: ${t.tag}.`);
        axis(t.axis);
        if(!nat(t.min)) fail('Tag law minimum must be a non-negative integer.');
        return {tag: t.tag, axis: t.axis, min: t.min};
    });
    const directions=(spec.directions||[]).map(r=>{
        only(r,['before','after','from','to','permille'],'direction');axis(r.from,'fraction');axis(r.to,'fraction');
        if(!catalogue.registry.has(r.before)||!catalogue.registry.has(r.after)||!nat(r.permille)||r.permille>1000||r.from===r.to)fail('Invalid directional reaction.');
        return {...r};
    });
    const thermal=spec.thermal;
    if(thermal){only(thermal,['op','from','to','safePerInput'],'thermal');axis(thermal.from,'fraction');axis(thermal.to,'fraction');if(!ops[thermal.op]||!pos(thermal.safePerInput))fail('Invalid thermal law.');}
    return deepFreeze({id: text(spec.id, 'Law ID'), revision: spec.revision, ref: versioned(spec.id, spec.revision),
        directions,thermal:thermal?{...thermal}:null,catalogue, carrier: text(spec.carrier ?? 'Crafted batch', 'Carrier'), ops, reactions, outputs, tagLaws});
}

function canonicalInputs(law, inputs) {
    if(!Array.isArray(inputs) || !inputs.length) fail('Choose at least one input.');
    const merged = new Map();
    for(const input of inputs) {
        only(input, ['material', 'qty', 'role'], 'input');
        const material = validateMaterial(law.catalogue, input.material);
        const role = input.role ?? 'consumed';
        if(!['consumed', 'catalyst'].includes(role)) fail('Input role must be consumed or catalyst.');
        if(!pos(input.qty) || input.qty > MAX_INPUT_QTY) fail(`Use whole quantities from 1 to ${MAX_INPUT_QTY}.`);
        const key = `${role}\u0000${material.id}`;
        const prior = merged.get(key);
        if(prior && prior.material.revision !== material.revision) fail(`Two revisions of ${material.id} in one batch.`);
        const qty = (prior?.qty ?? 0) + input.qty;
        if(qty > MAX_INPUT_QTY) fail(`Use whole quantities from 1 to ${MAX_INPUT_QTY}.`);
        merged.set(key, {material, qty, role});
    }
    return [...merged.values()].sort((a, b) => compareCodePoints(a.role, b.role) || compareCodePoints(a.material.id, b.material.id));
}

// request: {inputs:[{material, qty, role?}], process:[{op, level}], stations?:[tag], recipe?:{ref}}
export function resolveBatch(law, {inputs, process = [], stations = [], recipe = null, order, control=0}) {
    const {catalogue} = law, basis = catalogue.basis;
    const lots = canonicalInputs(law, inputs);
    const consumed = lots.filter(l => l.role === 'consumed'), catalysts = lots.filter(l => l.role === 'catalyst');
    if(!consumed.length) fail('A batch needs at least one consumed input.');
    if(!Array.isArray(stations)) fail('Stations must be a tag list.');
    const stationTags = new Set(catalogue.registry.expand(stations));
    const catalystTags = new Set(catalysts.flatMap(l => [...materialTags(catalogue, l.material)]));
    const mass = safe(consumed.reduce((n, l) => n + l.qty * basis, 0));
    const amounts = {}, scalarSums = {}, availability = {};
    for(const def of Object.values(catalogue.axes)) {
        if(def.kind === 'fraction') amounts[def.id] = 0; else scalarSums[def.id] = 0;
        availability[def.id] = 1000;
    }
    for(const {material, qty} of consumed) for(const [id, value] of Object.entries(material.properties)) {
        if(catalogue.axes[id].kind === 'fraction') amounts[id] = safe(amounts[id] + qty * value);
        else scalarSums[id] = safe(scalarSums[id] + qty * basis * value);
    }
    const trace = [];
    let ordered=[];
    if(law.directions.length){
        ordered=order||consumed.map(l=>l.material.id);
        if(!Array.isArray(ordered)||ordered.length!==consumed.length||new Set(ordered).size!==consumed.length||ordered.some(id=>!consumed.some(l=>l.material.id===id)))fail('Order must name each consumed material exactly once.');
        for(let i=0;i+1<ordered.length;i++)for(const r of law.directions){
            const a=consumed.find(l=>l.material.id===ordered[i]).material,b=consumed.find(l=>l.material.id===ordered[i+1]).material;
            if(!materialTags(catalogue,a).has(r.before)||!materialTags(catalogue,b).has(r.after))continue;
            const moved=Math.floor(amounts[r.from]*r.permille/1000);amounts[r.from]-=moved;amounts[r.to]+=moved;
            trace.push({kind:'direction',before:a.id,after:b.id,from:r.from,to:r.to,moved});
        }
    }

    const react = (after, step) => {
        for(const r of law.reactions) {
            if(r.after !== after) continue;
            if(r.station && !stationTags.has(r.station)) continue;
            if(r.catalyst != null && !matchesQuery(r.catalyst, catalystTags)) continue;
            let extent = Infinity;
            for(const [id, k] of Object.entries(r.reactants)) extent = Math.min(extent, Math.floor(Math.floor(amounts[id] * r.limit / 1000) / k));
            if(!extent) continue;
            for(const [id, k] of Object.entries(r.reactants)) amounts[id] -= safe(k * extent);
            for(const [id, k] of Object.entries(r.products)) amounts[id] = safe(amounts[id] + k * extent);
            trace.push({step, kind: 'reaction', id: r.id, extent});
        }
    };
    if(!Array.isArray(process) || process.length > MAX_STEPS) fail(`Use at most ${MAX_STEPS} process steps.`);
    const steps = process.map((s, step) => {
        only(s, ['op', 'level'], 'process step');
        const op = law.ops[s.op] ?? fail(`Unknown process: ${s.op}.`);
        const level = s.level ?? op.levels[0];
        if(!Number.isSafeInteger(level) || level < op.levels[0] || level > op.levels[1]) fail(`${op.label} level must be ${op.levels[0]}-${op.levels[1]}.`);
        if(op.station && !stationTags.has(op.station)) fail(`${op.label} needs a ${op.station} station.`);
        for(const c of op.converts) {
            if(level < c.minLevel) continue;
            const permille = Math.max(0, Math.min(1000, c.permille + c.perLevel * (level - c.minLevel)));
            const moved = Math.floor(amounts[c.from] * permille / 1000);
            if(!moved) continue;
            amounts[c.from] -= moved; amounts[c.to] = safe(amounts[c.to] + moved);
            trace.push({step, kind: 'convert', op: op.id, from: c.from, to: c.to, moved});
        }
        for(const [id, permille] of Object.entries(op.availability)) availability[id] = safe(Math.floor(availability[id] * permille / 1000));
        react(op.id, step);
        return {op: op.id, level};
    });
    react(null, steps.length);
    let thermal;
    if(law.thermal){
        if(!nat(control)||control>100)fail('Invalid batch control.');
        const heat=steps.filter(s=>s.op===law.thermal.op).reduce((n,s)=>n+s.level,0),safeHeat=consumed.length*law.thermal.safePerInput+Math.floor(control/10),residual=Math.max(0,heat-safeHeat);
        const moved=Math.floor(amounts[law.thermal.from]*Math.min(900,residual*100)/1000);
        amounts[law.thermal.from]-=moved;amounts[law.thermal.to]+=moved;
        thermal={control,heat,safeHeat,residual,impurity:moved,grade:Math.max(1,new Set(ordered).size),tier:Math.max(1,...consumed.map(l=>Math.ceil((l.material.properties.hardness||0)/25)))};
        trace.push({kind:'heat',...thermal});
    }

    if(Object.values(amounts).reduce((n, v) => n + v, 0) !== mass || Object.values(amounts).some(v => v < 0)) fail('Batch does not conserve mass.');
    const scalars = Object.fromEntries(Object.entries(scalarSums).map(([id, sum]) => [id, Math.floor(sum / mass)]));
    const outputs = {};
    for(const o of law.outputs) {
        const avail = availability[o.axis];
        const value = o.mode === 'scalar' ? Math.floor(safe(scalars[o.axis] * avail * o.per) / 1000000)
            : o.mode === 'total' ? Math.floor(safe(amounts[o.axis] * avail * o.per) / 1000000)
            : Math.floor(safe(amounts[o.axis] * avail * o.per) / safe(mass * 1000));
        if(value) ((outputs[o.route] ??= {})[o.effect] = (outputs[o.route][o.effect] ?? 0) + value);
    }
    const tags = law.tagLaws.filter(t => catalogue.axes[t.axis].kind === 'scalar' ? scalars[t.axis] >= t.min
        : Math.floor(amounts[t.axis] * 1000 / mass) >= t.min).map(t => t.tag);
    const identity = {family: BATCH_FAMILY, law: law.ref, catalogue: catalogue.ref, recipe: recipe?.ref ?? null,
        inputs: lots.map(l => [l.role, l.material.id, l.material.revision, l.qty]), process: steps.map(s => [s.op, s.level]),
        stations: [...stationTags].sort(compareCodePoints).filter(t => steps.some(s => law.ops[s.op].station === t) || law.reactions.some(r => r.station === t)),
        composition: sortKeys({...amounts}), mass,...(law.directions.length?{order:[...ordered]}:{}),...(thermal?{thermal}: {})};
    const product = {id: 'cb1:' + address(identity), ...identity, scalars: sortKeys(scalars),
        availability: sortKeys(availability), outputs: sortKeys(Object.fromEntries(Object.entries(outputs).map(([r, e]) => [r, sortKeys(e)]))),
        tags: [...new Set(tags)].sort(compareCodePoints), carrier: law.carrier};
    return deepFreeze({product,
        debits: consumed.map(l => ({material: l.material.id, qty: l.qty})),
        retained: catalysts.map(l => ({material: l.material.id, qty: l.qty})), trace});
}

// Re-resolves a retained product under its own law revision (audit R6): the
// caller supplies the law for product.law and the frozen input materials.
export function validateBatchProduct(law, product, materialsById) {
    if(product?.family !== BATCH_FAMILY) fail('Unsupported crafted product family.');
    if(product.law !== law.ref || product.catalogue !== law.catalogue.ref) fail(`Product needs law ${product.law}, not ${law.ref}.`);
    const inputs = product.inputs.map(([role, id, revision, qty]) => {
        const material = materialsById[id] ?? fail(`Missing retained material ${id}.`);
        if(material.revision !== revision) fail(`Retained material ${id} changed revision.`);
        return {material, qty, role};
    });
    const again = resolveBatch(law, {inputs, process: product.process.map(([op, level]) => ({op, level})), stations: product.stations,
        recipe: product.recipe ? {ref: product.recipe} : null,order:product.order,control:product.thermal?.control??0}).product;
    if(JSON.stringify(again) !== JSON.stringify(product)) fail('Product disagrees with its retained law and materials.');
    return product;
}
