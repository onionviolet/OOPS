// Lord of the Mysteries ingredient bridge (TSW11: one importer per world).
// Pure: takes the private pack object (built by tools/build_lotm_ingredient_pack.mjs,
// never committed) and returns a craft_materials catalogue, formula slot specs and
// a substitute ranker. No disk reads, game wiring or save state. Quantities keep the
// units the source states (TSW9). Symbolic tags are proposals, never accepted design.
import {defineCatalogue, materialTags} from './craft_materials.js';
import {compareCodePoints} from './gen_kit.js';

const fail = message => { throw new Error(message); };
export const LAYERS = Object.freeze(['physical', 'functional', 'symbolic']);
// Symbolic fit counts double: a sun-blooded substitute matters more than a matching texture (PZ-L8).
export const LAYER_WEIGHT = Object.freeze({physical: 1, functional: 1, symbolic: 2});
export const DEFAULT_FLOOR = 0.5;
const KIND = {physical: 'physical', functional: 'functional', symbolic: 'symbolic_proposal'};
const sorted = list => [...list].sort(compareCodePoints);
const PHASE_BY_TAG = [['liquid', 'liquid'], ['powder', 'powder']];

// Slot spec compatible with craft_recipes selectors: `selector` is {tags: query} or null.
// `require` is the hard physical layer; `prefer` is scored but not required.
function slotSpec(slot, formula, qtyOverride) {
    const physical = slot.traits.physical.filter(t => t !== 'substance');
    const qty = qtyOverride?.to ?? slot.qty;
    return {id: slot.id, formula: formula.id, role: slot.role, reference: slot.ref ?? null, alternates: [...slot.alternates ?? []],
        qty: qty ? {...qty} : null, tier: qtyOverride?.tier ?? slot.tier, override: qtyOverride?.id ?? slot.override ?? null,
        require: {physical}, prefer: {functional: [...slot.traits.functional], symbolic: [...slot.traits.symbolic]},
        selector: physical.length ? {tags: physical.length === 1 ? physical[0] : {all: physical}} : null,
        traitsFrom: slot.traitsFrom ?? 'ingredient'};
}

export function buildLotmCatalogue(pack) {
    if(!pack || !Array.isArray(pack.ingredients) || !Array.isArray(pack.formulas) || !pack.vocab) fail('Pack needs vocab, ingredients and formulas.');
    const tags = [];
    for(const layer of LAYERS) for(const t of pack.vocab[layer] ?? []) tags.push({id: t.id, kind: KIND[layer], parents: t.parents ?? [], revision: 1});
    const layerOf = new Map();
    for(const layer of LAYERS) for(const t of pack.vocab[layer] ?? []) layerOf.set(t.id, layer);
    const materials = pack.ingredients.map(i => {
        const all = [...i.traits.physical, ...i.traits.functional, ...i.traits.symbolic];
        const phase = PHASE_BY_TAG.find(([t]) => all.includes(t))?.[1] ?? 'solid';
        return {id: i.id, revision: 1, name: i.en, tags: all, phase, properties: {}};
    });
    const catalogue = defineCatalogue({id: 'world.lotm', revision: 1, basis: 1000, axes: [], tags, materials});
    const ingredients = new Map(pack.ingredients.map(i => [i.id, i]));
    const overrideBySlot = new Map((pack.overrides ?? []).map(o => [o.slot, o]));
    const formulas = new Map(), slots = new Map();
    for(const f of pack.formulas) {
        const specs = f.slots.map(s => {
            for(const layer of LAYERS) for(const t of s.traits[layer]) if(!catalogue.registry.has(t)) fail(`Slot ${s.id} uses unknown tag: ${t}.`);
            if(s.ref != null && !ingredients.has(s.ref)) fail(`Slot ${s.id} names unknown ingredient: ${s.ref}.`);
            return slotSpec(s, f, overrideBySlot.get(s.id));
        });
        const formula = {id: f.id, name: f.name, nameCn: f.name_cn ?? null, pathway: f.pathway, seq: f.seq, tier: f.tier ?? null, slots: specs};
        formulas.set(f.id, formula);
        for(const s of specs) slots.set(s.id, s);
    }
    const index = {catalogue, ingredients, formulas, slots, tagLayer: id => layerOf.get(id) ?? null, overrides: [...overrideBySlot.values()]};
    return Object.freeze({...index,
        materialFor: id => catalogue.materials[id] ?? null,
        ingredientFor: id => ingredients.get(id) ?? null,
        formulaFor: id => formulas.get(id) ?? null,
        slotsFor: formulaId => formulas.get(formulaId)?.slots ?? [],
        slotFor: id => slots.get(id) ?? null,
        // Ingredient ids that carry every tag of the query layer lists, sorted.
        withTags: query => sorted([...ingredients.keys()].filter(id => (query ?? []).every(t => materialTags(catalogue, catalogue.materials[id]).has(t)))),
        substitutesFor: (slot, available, options) => substitutesFor(index, slot, available, options)});
}

// Ranks `available` (material ids or materials) as substitutes for `slot` (a slot spec or slot id).
// Score = weighted share of the slot's wanted tags the candidate carries, per layer, symbolic doubled.
// Rejects a candidate that lacks every required physical tag or scores under `floor`, with a reason.
// Returns {slot, ranked: [{id, score, matched, missing}], rejected: [{id, reason}]}; ties break by id.
function substitutesFor(index, slot, available, {floor = DEFAULT_FLOOR} = {}) {
    const spec = typeof slot === 'string' ? index.slots.get(slot) ?? fail(`Unknown slot: ${slot}.`) : slot;
    const wanted = {physical: spec.require.physical, functional: spec.prefer.functional, symbolic: spec.prefer.symbolic};
    const ranked = [], rejected = [];
    for(const entry of available) {
        const material = typeof entry === 'string' ? index.catalogue.materials[entry] : entry;
        if(!material) { rejected.push({id: String(entry), reason: 'not in this catalogue'}); continue; }
        const have = materialTags(index.catalogue, material), matched = [], missing = [];
        let total = 0, weight = 0;
        for(const layer of LAYERS) {
            if(!wanted[layer].length) continue;
            const hit = wanted[layer].filter(t => have.has(t));
            matched.push(...hit); missing.push(...wanted[layer].filter(t => !have.has(t)));
            total += LAYER_WEIGHT[layer] * hit.length / wanted[layer].length; weight += LAYER_WEIGHT[layer];
        }
        const score = weight ? Math.round(total / weight * 1000) / 1000 : 1;
        if(wanted.physical.length && !wanted.physical.some(t => have.has(t))) rejected.push({id: material.id, reason: `no physical match, needs ${wanted.physical.join(' + ')}`});
        else if(score < floor) rejected.push({id: material.id, reason: `fit ${score} is below floor ${floor}, missing ${sorted(missing).join(', ')}`});
        else ranked.push({id: material.id, score, matched: sorted(matched), missing: sorted(missing)});
    }
    ranked.sort((a, b) => b.score - a.score || compareCodePoints(a.id, b.id));
    rejected.sort((a, b) => compareCodePoints(a.id, b.id));
    return {slot: spec.id, ranked, rejected};
}
