// Original native adapters for the selected rat-material chain. Actual owners
// provide settled output, consumed keys and played clock; this has no state.
import {planProcessedMaterial, readMaterialLineage} from './material_lineage.js';
export {treatedRecipeQuality} from './material_treatment.js';
const FAMILIES = {'Portable leatherworking kit':'workshop-tool','Rat pelt':'animal-hide','Rat tail':'animal-tail','Rat fang':'animal-bone',
    'Piece of wolf rat leather':'animal-hide','Processed rat pelt':'animal-hide','Rat meat chunks':'animal-food'};
export const isLineageMaterial = id => Object.hasOwn(FAMILIES, id);
export function harvestedMaterialOutput(specimen, output, context) {
    const sourceKey = JSON.stringify({id:'harvested-carcass',specimen:specimen.key});
    const plan = planProcessedMaterial({stock:{[sourceKey]:1},inputs:[{item_key:sourceKey,count:1}],
        output:{id:JSON.parse(output.item_key).id,family:FAMILIES[JSON.parse(output.item_key).id],count:output.count,quality:output.quality,completeness:output.completeness},
        process:{id:`harvest.${output.part}`,revision:1,at:context.clock,world_id:'base.frontier',parameters:{skill:context.skill,tool:context.tool,part:output.part,yield:output.count}},
        sourceFacts:{[sourceKey]:{born:specimen.born,origin_world:'base.frontier',evidence:{specimen:structuredClone(specimen),processed_at:context.clock}}},
        // One real carcass yields several parts under the existing harvest law.
        yieldRatio:{numerator:output.count,denominator:1}});
    return {...output,item_key:plan.item_key};
}
export function recipeMaterialOutput({resultId,count,quality,allocations,recipeId,clock,world}) {
    if(!isLineageMaterial(resultId) || !allocations.some(r => readMaterialLineage(r.item_key))) return null;
    const stock=Object.fromEntries(allocations.map(r=>[r.item_key,r.count]));
    return planProcessedMaterial({stock,inputs:allocations,output:{id:resultId,family:FAMILIES[resultId],count,...(quality!=null?{quality}:{})},
        process:{id:recipeId,revision:1,at:clock,world_id:world,parameters:{yield:count}}}).item_key;
}
// This records the exact existing recipe allocator's chosen decrements BEFORE
// it spends them. It never chooses a substitute, reserves stock or rolls output.
export function allocatedRecipeInputs(materials, requirements, attempts) {
    const spent=new Map();
    for(let i=0;i<requirements.length;i++) {
        let left=(materials[i].need??requirements[i].count)*attempts;
        for(const row of materials[i].items) {
            const key=row.item.getInventoryKey(),take=Math.min(row.count-(spent.get(key)||0),left);
            if(take>0){spent.set(key,(spent.get(key)||0)+take);left-=take;}
            if(left<=0)break;
        }
        if(left>0)throw Error('Selected material stock changed before processing.');
    }
    return [...spent].map(([item_key,count])=>({item_key,count}));
}
export function lineagePresentation(key,clock) {
    const l=readMaterialLineage(key);if(!l)return null;
    const process=l.history.at(-1),observations=[],visited=new Set([key]),seenObservations=new Set();
    function visit(lineage) {
        for(const e of lineage.history) for(const input of e.inputs) {
            const specimen=input.facts?.evidence?.specimen;
            for(const o of specimen?.observations||[]) {
                // Two preparations of one source can meet again in a recipe.
                // Keep both causal parents, but display each source reading once.
                const identity=JSON.stringify([specimen.key,o]);
                if(seenObservations.has(identity))continue;
                seenObservations.add(identity);
                observations.push({at:o.at,min:o.ageEstimate.min,max:o.ageEstimate.max,skill:o.skill,freshness:o.freshness,integrity:o.integrity});
            }
            if(!visited.has(input.item_key)) {
                visited.add(input.item_key);
                const parent=readMaterialLineage(input.item_key);if(parent)visit(parent);
            }
        }
    }
    visit(l);
    return {process:process.process_id,at:process.at,parents:process.inputs.length,observations,
        // A mixed output has batch provenance, not an invented exact birth of
        // each unit. Old readings remain observations of their original source.
        note:'One processed cohort. Split units retain this batch history; unlike cohorts remain separately selectable.',
        elapsed:Math.max(0,clock-process.at)};
}
