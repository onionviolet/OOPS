// The Polyjuice formula as a shared-envelope process row (DWF101). Pure adapter: validates the pack's formula and rules through
// defineProcess and changes no save shape. The state machine keeps its own slice ('hp_brewing' schema 1); it only asks this row for the timing.
import {packNative} from './world_pack_registry.js';
import {defineProcess} from './dose_process.js';

const PACK = packNative('book.hp');
const F = PACK.formula, R = PACK.rules;
export const HP_PROCESS = defineProcess({id: F.id, world: 'book.hp', name: 'Polyjuice Potion', pathway: 'Potions', status: 'brewable', minutes: R.brewMinutes, bench: 'cauldron',
    slots: F.slots.map(s => ({id: s.id, role: 'ingredient', select: {material: s.ingredient}, qty: 1, evidence: s.evidence?.join(' ') ?? null,
        require: {form: s.form, ...(s.provenance ? {provenance: s.provenance} : {}), ...(s.minStewMinutes ? {minStewMinutes: s.minStewMinutes} : {})}})),
    product: {key: F.product, kind: 'dose'}, evidence: F.evidence,
    gaps: ['The sample is added at the glass after the pot is ready, not as a slot (book.hp.ev.sample_last).']});
