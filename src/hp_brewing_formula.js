// The Polyjuice formula as a shared-envelope process row (DWF101). Pure adapter: validates the pack's formula and rules through
// defineProcess and changes no save shape. The state machine keeps its own slice ('hp_brewing' schema 1); it only asks this row for the timing.
import {packNative} from './world_pack_registry.js';
import {defineProcess} from './dose_process.js';
import {inspectMaterialEvidence} from './material_inspector.js';

const PACK = packNative('book.hp');
const F = PACK.formula, R = PACK.rules;
export const HP_PROCESS = defineProcess({id: F.id, world: 'book.hp', name: 'Polyjuice Potion', pathway: 'Potions', status: 'brewable', minutes: R.brewMinutes, bench: 'cauldron',
    slots: F.slots.map(s => ({id: s.id, role: 'ingredient', select: {material: s.ingredient}, qty: 1, evidence: s.evidence?.join(' ') ?? null,
        require: {form: s.form, ...(s.provenance ? {provenance: s.provenance} : {}), ...(s.minStewMinutes ? {minStewMinutes: s.minStewMinutes} : {})}})),
    product: {key: F.product, kind: 'dose'}, evidence: F.evidence,
    gaps: ['The sample is added at the glass after the pot is ready, not as a slot (book.hp.ev.sample_last).']});

// Read the observer projection, never lot truth. This is a comparison with the
// pinned method, not an eligibility gate or a forecast for every original mixture.
export function assessHpPreparation(projected, selections = {}) {
    const held = new Map((projected.lots ?? []).map(lot => [lot.id, lot]));
    const seen = new Set();
    const rows = F.slots.map(slot => {
        const id = selections[slot.id], lot = held.get(id);
        const row = (status, reason) => ({slot: slot.id, lotId: id ?? null, status, reason, evidence: [...(slot.evidence ?? [])]});
        if(!id) return row('incomplete', 'No held lot selected for this condition.');
        if(!lot) return row('stale', 'This selected lot is no longer held. Select a current lot.');
        if(seen.has(id)) return row('stale', 'One lot cannot fill two slots.');
        seen.add(id);
        if(lot.ingredient !== slot.ingredient) return row('unsupported', 'The pinned method does not predict this ingredient replacement. Experimenting remains possible.');
        if(lot.stewing) return row('incomplete', 'Still on the stew pot. Finish or take it off before brewing.');
        if(lot.form !== slot.form) return row('deviation', `This method calls for ${slot.form}; the held lot is ${lot.form}.`);
        if(slot.minStewMinutes) {
            if(!lot.stewedKnown) return row('uncertain', 'Stewing duration is unverified. A supplier claim is not an observation; assay or stew your own lot.');
            if(lot.stewedKnown === 'short of twenty-one days') return row('deviation', 'Observed preparation is short of the full twenty-one days.');
            if(lot.stewedKnown !== 'twenty-one days') return row('unsupported', 'No supported duration reading for this preparation.');
        }
        if(slot.provenance) {
            if(!lot.provenance || lot.provenance === 'unknown') return row('uncertain', 'Picking conditions are unverified. Assay or use your own witnessed harvest.');
            if(lot.provenance !== slot.provenance) return row('deviation', 'Observed picking conditions differ from the pinned method.');
        }
        if(lot.variant) {
            const variant = PACK.variants.find(v => v.label === lot.variant);
            if(!variant) return row('unsupported', 'No supported preparation reading for this method.');
            if(variant.gradePermille < 1000) return row('deviation', 'This coarser preparation weakens the pinned result (original game tuning).');
        }
        return row('supported', 'Observed identity and preparation meet this condition.');
    });
    const condition = projected.cauldron?.condition;
    const apparatus = condition === 'clean' ? 'Clean cauldron: no known wear penalty.'
        : condition === 'sooty' || condition === 'badly fouled' ? 'Cauldron wear weakens the result. Scour before repeating a clean-pot method (original game tuning).'
        : 'Cauldron condition is not known; apparatus prediction is unsupported.';
    const status = ['stale', 'incomplete', 'unsupported', 'deviation', 'uncertain'].find(s => rows.some(r => r.status === s))
        ?? (condition === 'clean' ? 'supported' : condition === 'sooty' || condition === 'badly fouled' ? 'deviation' : 'unsupported');
    return {status, rows, apparatus, coverage: 'Comparison covers the selected held lots and the pinned method. It does not search every possible substitute.',
        cost: `Consumes each selected lot once; occupies the cauldron for ${HP_PROCESS.minutes / 1440} played days. One glass then uses one dose and one sample.`};
}

export function inspectHpPreparation(projected, selections = {}) {
    const assessment = assessHpPreparation(projected, selections);
    return assessment.rows.map(row => {
        const lot = projected.lots?.find(l => l.id === row.lotId);
        const observed = ['supported', 'deviation', 'stale'].includes(row.status);
        const properties = lot ? [
            {id: 'form', status: 'observed', value: lot.form, source: lot.id},
            ...(lot.variant ? [{id: 'preparation', status: 'observed', value: lot.variant, source: lot.id}] : []),
            ...(row.slot === 'fluxweed' ? [{id: 'picking', status: lot.provenance && lot.provenance !== 'unknown' ? 'observed' : 'unknown', value: lot.provenance, source: lot.id}] : []),
            ...(row.slot === 'lacewing' ? [{id: 'stewing', status: lot.stewedKnown ? 'observed' : 'unknown', value: lot.stewedKnown, source: lot.id}] : []),
            ...(lot.claim ? [{id: 'acquisition', status: 'claim', value: lot.claim, source: `Held lot ${lot.id} acquisition note`}] : []),
        ] : [];
        return inspectMaterialEvidence({
            identity: lot ? {id: lot.ingredient, name: lot.name, source: 'book.hp'} : {},
            lot: lot ? {id: lot.id, form: lot.form, custody: lot.custody} : null,
            properties,
            conditions: [{id: row.slot, status: observed ? 'observed' : row.status === 'unsupported' ? 'unsupported' : 'unknown',
                value: row.status === 'supported', reason: row.reason, source: row.evidence.join(' ')}],
            method: {id: F.id},
            consumer: {id: F.product, description: 'One dose with one sample is used by the HP transformation action.', source: 'book.hp'},
            coverage: {searched: lot ? 1 : 0, total: projected.lots?.length ?? 0, reason: assessment.coverage},
        });
    });
}
