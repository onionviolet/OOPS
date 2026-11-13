import {measureCreatureCapability, planCreatureMethod} from './creature_methods.js';
import {creatureIncubationConditions, creatureMaturityAt} from './creature_lifecycle.js';
import {expressGenes, geneContributions, validateIVs} from './heredity.js';

export const FINE_WOOL_KEY = JSON.stringify({id: 'Fine wool'});
const law = 'village.fleece.v1';
const fineness = {id: 'fleece.fineness', unit: 'grade', combine: 'max'};
const yieldMeasure = {id: 'fleece.yield', unit: 'bundle', combine: 'sum'};
const method = {id: 'shear', revision: 1, law, steps: [{op: 'shear', bindings: {animal: 'subject'}}]};
const operations = {
    shear: {roles: {animal: 'creature'}, resolve({bound, facts}) {
        const fine = bound.animal.traits.fleece === 'fine';
        const measured = measureCreatureCapability(fineness, [
            {source: 'lineage.fleece', unit: fineness.unit, value: fine ? 65 : 40},
        ]);
        // Lineage picks the kind of wool; a care grade above plain (100) rides the key as a graded stack (ITM1).
        const kind = measured.value >= 65 ? 'Fine wool' : 'Wool';
        return {ok: true, facts: {fineness: measured}, effects: [{
            key: JSON.stringify(facts.quality > 100 ? {id: kind, quality: facts.quality} : {id: kind}), amount: facts.yield,
        }]};
    }},
};

export function planMeadowFleece(id, sheep, amount, {
    genome, clock, environment, conditions, incubationConditions = creatureIncubationConditions(sheep), care,
} = {}) {
    if (sheep.deadAt !== undefined) return {ok: false, operation: 'shear', reason: 'The sheep has died.'};
    const traits = {...sheep.traits};
    if (genome) {
        const mature = clock >= creatureMaturityAt(sheep, clock);
        if (!mature) return {ok: false, operation: 'shear', reason: 'Fleece is still growing.'};
        if (sheep.genes) {
            const expressedConditions = [...(conditions ?? []), ...incubationConditions];
            const expression = expressGenes(genome, sheep.genes, {mature, environment, conditions: expressedConditions});
            if (expression.fleece) traits.fleece = expression.fleece.level === 2 ? 'fine' : 'ordinary';
            amount = measureCreatureCapability(yieldMeasure, [
                {source: 'harvest.base', unit: yieldMeasure.unit, value: amount},
                ...geneContributions(genome, expression, yieldMeasure),
            ]).value;
        }
        if (genome.ivs?.stats.includes('woolYield') && sheep.ivs) {
            const {woolYield} = validateIVs(genome.ivs, sheep.ivs);
            amount += Math.floor(woolYield / 10);
        }
    }
    // Care input (fleece_from_care.js readFleece): a grade for the key and extra locks from a dense fleece.
    if (care?.bonus > 0) amount += care.bonus;
    return planCreatureMethod(method, {law, operations, facts: {yield: amount, quality: care?.quality ?? 100},
        bindings: {subject: {kind: 'creature', id, traits}}});
}
