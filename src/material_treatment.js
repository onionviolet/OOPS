// Original hide preparation routes. The treatment is a process-derived lot fact;
// later recipes read it, so the same pelt stock can become different products.
// Pure: callers supply inventory counts, skill and played clock.
import {planProcessedMaterial, readMaterialLineage} from './material_lineage.js';

export const HIDE_TREATMENTS = Object.freeze({
    smoked: {label: 'Smoke three rat pelts over a slow fire', supply: 'Rough wood log', requires: null,
        note: 'Smoke sets the fur: processed rat pelts gain 10 quality; dehaired leather loses 5.',
        shift: {'Processed rat pelt': 10, 'Piece of wolf rat leather': -5}},
    oiled: {label: 'Dress three rat pelts with lamp oil', supply: 'Lamp oil', requires: {skill: 'Crafting', level: 5},
        note: 'Oil loosens hair and softens the hide: wolf rat leather gains 10 quality; fur pelts lose 10.',
        shift: {'Piece of wolf rat leather': 10, 'Processed rat pelt': -10}},
});
export const HIDE_BATCH = 3;
const idOf = key => {try {return key.startsWith('{') ? JSON.parse(key).id : key;} catch {return null;}};
export const treatmentOf = key => readMaterialLineage(key)?.facts.treatment ?? null;

// inventory: {itemKey: count}. Picks the first untreated pelt stack that can
// supply a whole batch; one quote is both the preview and the executed plan.
export function quoteHideTreatment({treatmentId, inventory, skillLevel, clock, world}) {
    const t = HIDE_TREATMENTS[treatmentId];
    if (!t) return {eligible: false, reason: 'Choose a supported hide preparation.'};
    if (t.requires && !(skillLevel >= t.requires.level)) return {eligible: false, treatmentId, reason: `Learn ${t.requires.skill} to level ${t.requires.level} to dress hides with oil.`};
    const pelt = Object.entries(inventory).find(([key, n]) => idOf(key) === 'Rat pelt' && n >= HIDE_BATCH && !treatmentOf(key))?.[0];
    if (!pelt) return {eligible: false, treatmentId, reason: `Needs ${HIDE_BATCH} untreated rat pelts from one stack.`};
    const supply = Object.entries(inventory).find(([key, n]) => idOf(key) === t.supply && n >= 1)?.[0];
    if (!supply) return {eligible: false, treatmentId, reason: `Needs one ${t.supply}.`};
    const facts = readMaterialLineage(pelt)?.facts, quality = facts?.quality ?? (pelt.startsWith('{') ? JSON.parse(pelt).quality : undefined);
    const planned = planProcessedMaterial({stock: {[pelt]: inventory[pelt]}, inputs: [{item_key: pelt, count: HIDE_BATCH}],
        output: {id: 'Rat pelt', family: 'animal-hide', count: HIDE_BATCH, ...(quality != null ? {quality} : {}), treatment: treatmentId},
        process: {id: `hide.${treatmentId}`, revision: 1, at: clock, world_id: world, parameters: {supply: t.supply}}});
    return {eligible: true, treatmentId, reason: '', spend: [{key: pelt, count: HIDE_BATCH}, {key: supply, count: 1}],
        receive: [{key: planned.item_key, count: HIDE_BATCH}], summary: `${t.label}. ${t.note}`};
}

// Reader for the existing recipe executor: weighted quality change for the
// exact allocated inputs. Untreated inputs contribute nothing.
export function treatmentQualityShift(resultId, allocations) {
    let total = 0, weight = 0;
    for (const row of allocations) {
        weight += row.count;
        const t = HIDE_TREATMENTS[treatmentOf(row.item_key)];
        total += row.count * (t?.shift[resultId] ?? 0);
    }
    return weight ? Math.round(total / weight / 5) * 5 : 0;
}
export function treatedRecipeQuality(base, resultId, allocations) {
    const shift = treatmentQualityShift(resultId, allocations);
    return base == null || !shift ? base : Math.max(5, Math.min(1000, base + shift));
}
