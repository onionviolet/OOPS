// Native adapters from the existing recipe, gathering and harvest owners to
// the shared fabrication law (craft_assembly.js). Actual owners provide
// settled output, consumed keys and played clock; this has no state. Which
// item is made from what, in which unit and with what remainder is pack data
// (craft_assembly_village.js and the other packs), never a branch here.
import {fabricationPack, findProcess, knownFabricationFamily, planPartitionProcess, processYield} from './craft_assembly.js';
import './craft_assembly_packs.js';
import {planProcessedMaterial, readMaterialLineage} from './material_lineage.js';
export {FORGE_OFFCUT, IRON_SLAG} from './craft_assembly_village.js';
export {treatedRecipeQuality} from './material_treatment.js';
const idOf = key => JSON.parse(key).id;
export const nativeLineageFamily = id => knownFabricationFamily(id);
const familiesOf = world => fabricationPack(world)?.families ?? {};

// Component stock pools compatible lots: the selected lot goes first, then
// other spendable lots of the same item in stable key order, when the
// world's process for this component pools its inputs.
export function componentInputLots(inventory, selectedKey, resultId, world, canSpend) {
    const selected = inventory[selectedKey];
    if (!selected?.count || !canSpend(selectedKey)) return [];
    const rows = [{item_key: selectedKey, count: selected.count}];
    const process = findProcess(world, 'component', resultId);
    if (!process?.pool || processYield(process, selected.item.id) !== resultId) return rows;
    for (const key of Object.keys(inventory).sort()) {
        if (key !== selectedKey && inventory[key].item.id === selected.item.id && inventory[key].count && canSpend(key)) {
            rows.push({item_key: key, count: inventory[key].count});
        }
    }
    return rows;
}

export function allocateComponentLots(lots, required) {
    const allocations = [];
    for (const row of lots) {
        if (required === 0) break;
        const count = Math.min(row.count, required);
        allocations.push({item_key: row.item_key, count});
        required -= count;
    }
    if (required !== 0) throw Error('Selected component material is no longer sufficient.');
    return allocations;
}

// A component process with remainders (the forge) settles here when its
// first allocation is that process's own stock; otherwise the native
// grant stands.
export function forgeAxeHeadOutputs({resultId, allocations, stock, crafted, clock, world}) {
    const process = findProcess(world, 'component', resultId);
    if (!process?.remainders || processYield(process, idOf(allocations[0].item_key)) !== resultId) return null;
    return planPartitionProcess(process, {resultId, allocations, stock, crafted, clock, world, families: familiesOf(world)}).outputs;
}
// Pooled components without remainders (medium handles) stay traceable
// after the native quality roll. Legacy stacks still supply stock.
export function componentCraftEntries({parsedKey, allocations, crafted, clock, world}) {
    const rows = Object.entries(crafted).map(([quality, count]) => ({quality: Number(quality), count}));
    const process = findProcess(world, 'component', parsedKey.id);
    if (process && !process.remainders) {
        return planPartitionProcess(process, {resultId: parsedKey.id, allocations, crafted, clock, world,
            families: familiesOf(world)}).outputs;
    }
    return rows.map(({quality, count}) => ({item_key: JSON.stringify({...parsedKey, quality}), count}));
}

// Gathering owns the draw and quantity. This attaches its actual location and
// activity to the awarded lot using the same native lineage key as other sources.
export function gatheredIronKey({id, count, world, location, activity, clock}) {
    const row = fabricationPack(world)?.gathered?.find(g => g.ids.includes(id));
    if (!row) return null;
    const source = JSON.stringify({id: row.source, location, activity});
    return planProcessedMaterial({
        stock: {[source]: count}, inputs: [{item_key: source, count}],
        output: {id, family: row.family, count},
        process: {id: row.process, revision: row.revision, at: clock, world_id: world, parameters: {location, activity}},
        sourceFacts: {[source]: {origin_world: world}}
    }).item_key;
}

// The native smelting result determines what settles; the process row says
// what each attempt's ore holds, what becomes slag and what a failed
// reduction traps. Fuel is a spent support outside the ore balance.
export function smeltIronOutputs({resultId, recipeId, count, attempts, allocations, clock, world}) {
    const process = findProcess(world, 'attempts', resultId);
    if (!process || recipeId !== resultId) return null;
    return planPartitionProcess(process, {resultId, allocations, count, attempts, clock, world, families: familiesOf(world)}).outputs;
}

export function harvestedMaterialOutput(specimen, output, context) {
    const sourceKey = JSON.stringify({id:'harvested-carcass',specimen:specimen.key});
    const plan = planProcessedMaterial({stock:{[sourceKey]:1},inputs:[{item_key:sourceKey,count:1}],
        output:{id:JSON.parse(output.item_key).id,family:nativeLineageFamily(JSON.parse(output.item_key).id),count:output.count,quality:output.quality,completeness:output.completeness},
        process:{id:`harvest.${output.part}`,revision:1,at:context.clock,world_id:'base.frontier',parameters:{skill:context.skill,tool:context.tool,part:output.part,yield:output.count}},
        sourceFacts:{[sourceKey]:{born:specimen.born,origin_world:'base.frontier',evidence:{specimen:structuredClone(specimen),processed_at:context.clock}}},
        // One real carcass yields several parts under the existing harvest law.
        yieldRatio:{numerator:output.count,denominator:1}});
    return {...output,item_key:plan.item_key};
}
export function recipeMaterialOutput({resultId,count,quality,allocations,recipeId,clock,world}) {
    const family=nativeLineageFamily(resultId);
    const stock=Object.fromEntries(allocations.map(r=>[r.item_key,r.count]));
    const process=findProcess(world,'recipe',resultId);
    if(process && recipeId===resultId) {
        return planPartitionProcess(process,{resultId,allocations,count,clock,world,families:familiesOf(world)}).outputs[0].item_key;
    }
    if(!family || !allocations.some(r => readMaterialLineage(r.item_key))) return null;
    return planProcessedMaterial({stock,inputs:allocations,output:{id:resultId,family,count,...(quality!=null?{quality}:{})},
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
