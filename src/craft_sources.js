// Crafting engine: obtaining materials. Location sources (herb patches, ore
// seams, fishing spots, salvage heaps...) with regional generated variants,
// game-time-keyed yield rolls, tool/skill/hour/season gates, depletion and
// regrowth, rare finds with optional pity, an odds forecast and bounded idle
// gathering. Pure: callers pass the node owner and receive the next one.
// Draw addresses follow GR2/GR14/GR17: world, location, source, game minute
// and the node's own harvest ordinal; never a shared counter or wall clock.
import {natural as nat, positive as pos} from './basics.js';
import {address, compareCodePoints, drawU32, indexFromU32, pickWeighted, pity} from './gen_kit.js';
import {deepFreeze, generateMaterial, matchesQuery, validateMaterial, versioned} from './craft_materials.js';

export const MINUTES_PER_DAY = 1440;
export const MAX_IDLE_HARVESTS = 500;
const KINDS = ['gather', 'mine', 'fish', 'hunt', 'salvage', 'tap', 'other'];
const fail = message => { throw new Error(message); };
const text = (value, label) => typeof value === 'string' && value.length ? value : fail(`${label} must be non-empty text.`);
const only = (value, allowed, label) => {
    if(!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object.`);
    for(const key of Object.keys(value)) if(!allowed.includes(key)) fail(`Unknown ${label} field: ${key}.`);
};
const range = (value, label, fallback) => {
    const [lo, hi] = value ?? fallback;
    if(!nat(lo) || !Number.isSafeInteger(hi) || hi < lo) fail(`Invalid ${label} range.`);
    return [lo, hi];
};

function normalizeYield(catalogue, y, label) {
    only(y, ['id', 'material', 'family', 'weight', 'qty', 'tool', 'skill', 'hours', 'season'], label);
    if((y.material == null) === (y.family == null)) fail(`${label} names exactly one of material or family.`);
    if(y.material != null && !catalogue.materials[y.material]) fail(`Unknown yield material: ${y.material}.`);
    if(y.family != null && !catalogue.families[y.family]) fail(`Unknown yield family: ${y.family}.`);
    for(const tag of [y.tool, y.season].filter(t => t != null)) if(!catalogue.registry.has(tag)) fail(`Unknown gate tag: ${tag}.`);
    const weight = y.weight ?? 1;
    if(!nat(weight)) fail('Yield weight must be a non-negative integer.');
    const hours = y.hours == null ? null : range(y.hours, 'hours');
    if(hours && hours[1] > 24) fail('Hours run 0-24 (from may exceed to for overnight).');
    return {id: text(y.id ?? y.material ?? y.family, 'Yield ID'), material: y.material ?? null, family: y.family ?? null, weight,
        qty: range(y.qty, 'yield quantity', [1, 1]), tool: y.tool ?? null, skill: y.skill ?? 0, hours, season: y.season ?? null};
}

// table spec: {id, revision, sources:[{id, kind, at, capacity, regenPerDay, variants?, yields, rare?, quality?, skillBonus?}]}
//   at:       tag query over location tags (where the source appears)
//   variants: {familyId: count} regional generated materials per location
//   rare:     {permille, every?, yields:[...]}  every = pity interval
//   quality:  [lo, hi] base grade; skillBonus: grade per skill point (permille)
export function defineSourceTable(catalogue, spec) {
    only(spec, ['id', 'revision', 'sources'], 'source table');
    if(!pos(spec.revision)) fail('Source table revision must be a positive integer.');
    const sources = {};
    for(const s of spec.sources ?? []) {
        only(s, ['id', 'name', 'kind', 'at', 'capacity', 'regenPerDay', 'variants', 'yields', 'rare', 'quality', 'skillBonus'], 'source');
        const id = text(s.id, 'Source ID');
        if(sources[id]) fail(`Duplicate source: ${id}.`);
        if(!KINDS.includes(s.kind)) fail(`Unknown source kind: ${s.kind}.`);
        matchesQuery(s.at, new Set());
        if(!pos(s.capacity) || !nat(s.regenPerDay ?? 0)) fail(`Source ${id} needs capacity and regrowth integers.`);
        const variants = {};
        for(const [family, count] of Object.entries(s.variants ?? {})) {
            if(!catalogue.families[family] || !pos(count) || count > 12) fail(`Invalid variants for ${id}.${family}.`);
            variants[family] = count;
        }
        const yields = (s.yields ?? []).map((y, i) => normalizeYield(catalogue, y, `yield ${id}[${i}]`));
        if(!yields.length) fail(`Source ${id} needs yields.`);
        for(const y of yields) if(y.family && !variants[y.family]) fail(`Source ${id} yields family ${y.family} without variants.`);
        let rare = null;
        if(s.rare) {
            only(s.rare, ['permille', 'every', 'yields'], 'rare');
            if(!nat(s.rare.permille) || s.rare.permille > 1000 || (s.rare.every != null && !pos(s.rare.every))) fail(`Invalid rare odds for ${id}.`);
            rare = {permille: s.rare.permille, every: s.rare.every ?? null,
                yields: s.rare.yields.map((y, i) => normalizeYield(catalogue, y, `rare ${id}[${i}]`))};
            for(const y of rare.yields) if(y.family && !variants[y.family]) fail(`Rare yield family ${y.family} needs variants.`);
        }
        const quality = range(s.quality, 'quality', [40, 60]);
        if(quality[1] > 100) fail('Quality runs 0-100.');
        sources[id] = {id, name: s.name ?? id, kind: s.kind, at: s.at ?? null, capacity: s.capacity, regenPerDay: s.regenPerDay ?? 0,
            variants, yields, rare, quality, skillBonus: s.skillBonus ?? 500};
    }
    return deepFreeze({id: text(spec.id, 'Source table ID'), revision: spec.revision, ref: versioned(spec.id, spec.revision), catalogue, sources});
}

// Sources present at a location, by its tags (GR7: content joins by tagging).
export function sourcesAt(table, locationTags) {
    const tags = new Set(table.catalogue.registry.expand(locationTags));
    return Object.values(table.sources).filter(s => matchesQuery(s.at, tags)).sort((a, b) => compareCodePoints(a.id, b.id));
}

// Regional variants (audit P7): the same family yields different, coherent
// local materials per world/location. Callers freeze the ones the player sees.
export function localVariants(table, sourceId, {root, world, location}) {
    const source = table.sources[sourceId] ?? fail(`Unknown source: ${sourceId}.`);
    const out = {};
    for(const [family, count] of Object.entries(source.variants)) {
        out[family] = Array.from({length: count}, (_, index) =>
            generateMaterial(table.catalogue, family, {root, scope: `${text(world, 'World')}/${text(location, 'Location')}`, index}).value);
    }
    return out;
}

export const nodeKey = (world, location, sourceId) => `${world}/${location}/${sourceId}`;

// Node owner: {schema:1, nodes:{key:{stock, updatedAt, harvests, misses}}}.
// Absent nodes are full (GR4 lazy); old saves with no owner need nothing.
export function createSourceState() { return {schema: 1, nodes: {}}; }
export function validateSourceState(state, table) {
    only(state, ['schema', 'nodes'], 'source state');
    if(state.schema !== 1) fail('Unsupported source state schema.');
    for(const [key, node] of Object.entries(state.nodes)) {
        only(node, ['stock', 'updatedAt', 'harvests', 'misses', 'carry'], 'node');
        const source = table?.sources[key.split('/').at(-1)];
        if(table && !source) fail(`Node ${key} names an unknown source.`);
        if(!nat(node.stock) || (source && node.stock > source.capacity) || !nat(node.updatedAt) || !nat(node.harvests) || !nat(node.misses) || !nat(node.carry ?? 0) || (node.carry ?? 0) >= MINUTES_PER_DAY) fail(`Invalid node ${key}.`);
    }
    return state;
}

// Stock after regrowth up to `at` (game minutes). `carry` keeps the exact
// leftover growth (minute x regenPerDay units below one stock unit), so many
// short checks always equal one long check, whatever the daily rate.
export function nodeAt(source, node, at) {
    if(!nat(at)) fail('Game time must be a non-negative integer minute.');
    const current = node ?? {stock: source.capacity, updatedAt: at, harvests: 0, misses: 0};
    if(at < current.updatedAt) fail('Game time moved backwards for this node.');
    if(current.stock >= source.capacity || !source.regenPerDay) return {...current, stock: Math.min(current.stock, source.capacity), updatedAt: at, carry: 0};
    const total = (at - current.updatedAt) * source.regenPerDay + (current.carry ?? 0);
    const stock = Math.min(source.capacity, current.stock + Math.floor(total / MINUTES_PER_DAY));
    return {...current, stock, updatedAt: at, carry: stock >= source.capacity ? 0 : total % MINUTES_PER_DAY};
}

function gate(y, actor, at) {
    const reasons = [];
    if(y.tool && !actor.tools.has(y.tool)) reasons.push(`needs ${y.tool}`);
    if(actor.skill < y.skill) reasons.push(`needs skill ${y.skill}`);
    if(y.hours) {
        const hour = Math.floor(at % MINUTES_PER_DAY / 60), [from, to] = y.hours;
        const open = from <= to ? hour >= from && hour < to : hour >= from || hour < to;
        if(!open) reasons.push(`only ${from}:00-${to}:00`);
    }
    if(y.season && !actor.season.has(y.season)) reasons.push(`only in ${y.season}`);
    return reasons;
}
function actorOf(table, actor = {}) {
    only(actor, ['tools', 'skill', 'season', 'luck'], 'actor');
    const skill = actor.skill ?? 0, luck = actor.luck ?? 0;
    if(!nat(skill) || !Number.isSafeInteger(luck)) fail('Actor skill and luck must be integers.');
    return {tools: new Set(table.catalogue.registry.expand(actor.tools ?? [])), skill, luck,
        season: new Set(table.catalogue.registry.expand(actor.season ? [actor.season] : []))};
}

// Odds lens with reasons; takes no draw (GR9, generation-cheat friendly).
export function forecastHarvest(table, sourceId, {at, actor, node} = {}) {
    const source = table.sources[sourceId] ?? fail(`Unknown source: ${sourceId}.`);
    const who = actorOf(table, actor), state = nodeAt(source, node, at);
    const rows = source.yields.map(y => ({id: y.id, weight: y.weight, blocked: gate(y, who, at)}));
    const total = rows.filter(r => !r.blocked.length).reduce((n, r) => n + r.weight, 0);
    return {stock: state.stock, capacity: source.capacity,
        yields: rows.map(r => ({...r, permille: r.blocked.length || !total ? 0 : Math.floor(r.weight * 1000 / total)})),
        rare: source.rare ? {permille: Math.max(0, Math.min(1000, source.rare.permille + who.luck)), every: source.rare.every,
            misses: state.misses} : null};
}

function resolveYield(table, y, {root, world, location, source}, key) {
    if(y.material) return table.catalogue.materials[y.material];
    const variants = localVariants(table, source.id, {root, world, location})[y.family];
    return variants[indexFromU32(drawU32(root, address(key, 'variant')), variants.length)];
}

// One harvest. Returns {result, node, receipt}; result.items is
// [{material, qty, quality}] with full material records so the caller can
// freeze generated ones on reveal (GR3). Depleted or fully gated nodes
// return an empty result with reasons instead of throwing.
export function harvest(table, {root, world, location, source: sourceId, at, actor, node}) {
    const source = table.sources[sourceId] ?? fail(`Unknown source: ${sourceId}.`);
    const who = actorOf(table, actor), state = nodeAt(source, node, at);
    const key = address('craft.harvest', table.ref, text(world, 'World'), text(location, 'Location'), sourceId, {at, n: state.harvests});
    const where = {root, world, location, source};
    if(!state.stock) return {result: {items: [], reason: 'depleted', nextAt: source.regenPerDay ? state.updatedAt + Math.ceil((MINUTES_PER_DAY - (state.carry ?? 0)) / source.regenPerDay) : null},
        node: state, receipt: {address: key}};
    const open = source.yields.filter(y => !gate(y, who, at).length);
    const pick = pickWeighted(open, y => ({weight: y.weight, reason: y.tool ? `tool:${y.tool}` : 'base'}), drawU32(root, address(key, 'yield')));
    if(!pick.value) return {result: {items: [], reason: 'nothing you can take here now'}, node: state, receipt: {address: key, pick: pick.receipt}};
    const y = pick.value;
    const bonus = Math.floor(who.skill * source.skillBonus / 1000);
    const want = y.qty[0] + indexFromU32(drawU32(root, address(key, 'qty')), y.qty[1] - y.qty[0] + 1);
    const qty = Math.min(state.stock, want);
    const [qlo, qhi] = source.quality;
    const quality = Math.min(100, qlo + indexFromU32(drawU32(root, address(key, 'quality')), qhi - qlo + 1) + bonus);
    const items = [{material: resolveYield(table, y, where, key), qty, quality}];
    let next = {...state, stock: state.stock - qty, harvests: state.harvests + 1};
    const receipt = {address: key, pick: pick.receipt, qty: {want, took: qty}, quality};
    if(source.rare) {
        const permille = Math.max(0, Math.min(1000, source.rare.permille + who.luck));
        const hit = indexFromU32(drawU32(root, address(key, 'rare')), 1000) < permille;
        const rareOpen = source.rare.yields.filter(r => !gate(r, who, at).length);
        // A rare roll with nothing takeable right now is a miss, so the pity
        // guarantee is never spent on a blocked (wrong season/tool) find.
        const p = source.rare.every ? pity(state.misses, hit && rareOpen.length > 0, {every: source.rare.every})
            : {hit: hit && rareOpen.length > 0, forced: false, misses: hit && rareOpen.length ? 0 : state.misses + 1};
        const granted = p.hit && rareOpen.length > 0;
        next = {...next, misses: granted ? 0 : p.forced ? state.misses + 1 : p.misses};
        if(granted) {
            const r = pickWeighted(rareOpen, ry => ry.weight, drawU32(root, address(key, 'rare.pick'))).value;
            const rq = r.qty[0] + indexFromU32(drawU32(root, address(key, 'rare.qty')), r.qty[1] - r.qty[0] + 1);
            items.push({material: resolveYield(table, r, where, address(key, 'rare')), qty: rq, quality: Math.min(100, qhi + bonus), rare: true});
            receipt.rare = {forced: p.forced, id: r.id};
        }
    }
    return {result: {items}, node: next, receipt};
}

// Idle gathering: repeat at an interval from `from` to `to`, stopping on
// depletion, gating or the GR11 budget. Pure; combines identical stacks.
export function gatherIdle(table, {root, world, location, source, from, to, every, actor, node}) {
    if(!nat(from) || !nat(to) || to < from || !pos(every)) fail('Idle gathering needs from <= to and a positive interval.');
    let current = node, at = from, count = 0, stopped = 'time';
    const stacks = new Map();
    while(at <= to) {
        if(count >= MAX_IDLE_HARVESTS) { stopped = 'budget'; break; }
        const step = harvest(table, {root, world, location, source, at, actor, node: current});
        current = step.node;
        if(!step.result.items.length) {
            stopped = step.result.reason;
            if(step.result.nextAt == null || step.result.nextAt > to) break;
            at = Math.max(at + every, step.result.nextAt);
            continue;
        }
        for(const item of step.result.items) {
            const k = `${item.material.id}\u0000${item.quality}`;
            stacks.set(k, {...item, qty: (stacks.get(k)?.qty ?? 0) + item.qty});
        }
        count++; at += every;
    }
    return {items: [...stacks.values()].sort((a, b) => compareCodePoints(a.material.id, b.material.id) || a.quality - b.quality),
        node: current, harvests: count, stopped};
}

// Frozen materials for validation in a save owner (GR3).
export function freezeHarvested(table, items) { return items.map(i => validateMaterial(table.catalogue, i.material)); }
