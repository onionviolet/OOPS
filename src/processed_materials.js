import {MISTGLASS_ARTIFACT} from './artifact_refining.js';
import {tingenSilverFamily} from './lotm_amulet_crafting.js';
// Original native adapters for the selected rat-material chain. Actual owners
// provide settled output, consumed keys and played clock; this has no state.
import {planMaterialPartition, planProcessedMaterial, readMaterialLineage} from './material_lineage.js';
export {treatedRecipeQuality} from './material_treatment.js';
const FAMILIES = {'Portable leatherworking kit':'workshop-tool','Rat pelt':'animal-hide','Rat tail':'animal-tail','Rat fang':'animal-bone',
    'Piece of wolf rat leather':'animal-hide','Processed rat pelt':'animal-hide','Rat meat chunks':'animal-food'};
const AXE_HEADS = new Map([
    ['Low quality iron ingot', 'Cheap iron axe head'],
    ['Iron ingot', 'Iron axe head'],
    ['Steel ingot', 'Steel axe head']
]);
const HANDLE_WOOD = new Map([
    ['Processed rough wood', {log: 'Rough wood log', handle: 'Simple wooden medium handle'}],
    ['Processed wood', {log: 'Wood log', handle: 'Wooden medium handle'}],
    ['Processed ash wood', {log: 'Ash wood log', handle: 'Ash wood medium handle'}],
    ['Processed hickory wood', {log: 'Hickory wood log', handle: 'Hickory wood medium handle'}]
]);
const MEDIUM_HANDLES = new Set([...HANDLE_WOOD.values()].map(row => row.handle));
const CHOPPING_AXES = new Set(['Iron chopping axe', 'Steel chopping axe']);
export const FORGE_OFFCUT = 'Mixed forge offcuts';
export const IRON_SLAG = 'Iron smelting slag';
const IRON_ORES = new Map([['Iron ore', 'Iron ingot'], ['Low quality iron ore', 'Low quality iron ingot']]);
export function nativeLineageFamily(id) {
    if (id === MISTGLASS_ARTIFACT) return 'refined-artifact';
    const silverFamily=tingenSilverFamily(id);
    if (silverFamily) return silverFamily;
    if ([...AXE_HEADS.values()].includes(id)) return 'axe-head';
    if (HANDLE_WOOD.has(id)) return 'handle-wood';
    if (MEDIUM_HANDLES.has(id)) return 'wooden-handle';
    if (CHOPPING_AXES.has(id)) return 'assembled-axe';
    if (id === FORGE_OFFCUT) return 'forge-offcut';
    if (id === 'Low quality iron ingot') return 'reclaimed-iron';
    if (id === 'Iron ingot') return 'smelted-iron';
    if (IRON_ORES.has(id)) return 'iron-ore';
    if (id === IRON_SLAG) return 'iron-slag';
    return Object.hasOwn(FAMILIES, id) ? FAMILIES[id] : null;
}

// Axe heads and medium handles combine compatible lots. The selected lot
// goes first, then other spendable lots of the same grade in stable key order.
export function componentInputLots(inventory, selectedKey, resultId, world, canSpend) {
    const selected = inventory[selectedKey];
    if (!selected?.count || !canSpend(selectedKey)) return [];
    const rows = [{item_key: selectedKey, count: selected.count}];
    if (world !== 'base.frontier' || (AXE_HEADS.get(selected.item.id) !== resultId && HANDLE_WOOD.get(selected.item.id)?.handle !== resultId)) return rows;
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

// Original Village accounting units. Each native method preserves its
// material grade. Mixed offcuts feed the lower-grade reclaim route.
export function forgeAxeHeadOutputs({resultId, allocations, stock, crafted, clock, world}) {
    if (world !== 'base.frontier' || AXE_HEADS.get(JSON.parse(allocations[0].item_key).id) !== resultId) return null;
    if (allocations.some(row => AXE_HEADS.get(JSON.parse(row.item_key).id) !== resultId)) {
        throw Error('Axe-head stock must share the selected metal grade.');
    }
    const heads = Object.entries(crafted).map(([quality, count]) => ({
        output: {id: resultId, family: 'axe-head', quality: Number(quality), count}, unitsPerItem: 360
    }));
    const batches = heads.reduce((n, row) => n + row.output.count, 0);
    return planMaterialPartition({
        stock, inputs: allocations,
        unit: 'forge material unit', unitsPerInput: () => 100,
        outputs: [...heads, {output: {id: FORGE_OFFCUT, family: 'forge-offcut', count: batches}, unitsPerItem: 20}],
        losses: [{reason: 'forge scale', amount: 20 * batches}],
        process: {id: 'forge.axe_head', revision: 1, at: clock, world_id: world,
            parameters: {headUnits: 360, offcutUnits: 20, scaleUnits: 20}}
    }).outputs;
}
// The two pieces cut to a handle remain traceable after the native quality
// roll. Legacy stacks can still supply stock and are not assigned a source site.
export function componentCraftEntries({parsedKey, allocations, crafted, clock, world}) {
    const rows = Object.entries(crafted).map(([quality, count]) => ({quality: Number(quality), count}));
    if (world === 'base.frontier' && MEDIUM_HANDLES.has(parsedKey.id)) {
        if (allocations.some(row => HANDLE_WOOD.get(JSON.parse(row.item_key).id)?.handle !== parsedKey.id)) {
            throw Error('Medium handle stock must share the selected wood grade.');
        }
        return planMaterialPartition({
            stock: Object.fromEntries(allocations.map(row => [row.item_key, row.count])), inputs: allocations,
            unit: 'wood stock unit', unitsPerInput: () => 1,
            outputs: rows.map(row => ({output: {id: parsedKey.id, family: 'wooden-handle', ...row}, unitsPerItem: 2})),
            process: {id: 'woodworking.medium-handle', revision: 1, at: clock, world_id: world}
        }).outputs;
    }
    return rows.map(({quality, count}) => ({item_key: JSON.stringify({...parsedKey, quality}), count}));
}

// Gathering owns the draw and quantity. This attaches its actual location and
// activity to the awarded lot using the same native lineage key as other sources.
export function gatheredIronKey({id, count, world, location, activity, clock}) {
    if (world !== 'base.frontier' || !IRON_ORES.has(id)) return null;
    const source = JSON.stringify({id: 'iron-vein', location, activity});
    return planProcessedMaterial({
        stock: {[source]: count}, inputs: [{item_key: source, count}],
        output: {id, family: 'iron-ore', count},
        process: {id: 'mining.iron', revision: 1, at: clock, world_id: world, parameters: {location, activity}},
        sourceFacts: {[source]: {origin_world: world}}
    }).item_key;
}

// The native smelting result determines what settles. Each attempt consumes
// 125 ore units, of which 25 become slag. A failed reduction leaves its metal
// trapped in waste. Fuel is a spent support outside this ore balance.
export function smeltIronOutputs({resultId, recipeId, count, attempts, allocations, clock, world}) {
    if (world !== 'base.frontier' || recipeId !== resultId || ![...IRON_ORES.values()].includes(resultId)) return null;
    const inputs = [], supportInputs = [];
    for (const row of allocations) {
        if (IRON_ORES.get(JSON.parse(row.item_key).id) === resultId) inputs.push(row);
        else supportInputs.push({...row, disposition: 'consumed'});
    }
    if (!Number.isSafeInteger(count) || count < 0 || count > attempts) throw Error('Invalid iron smelting yield.');
    const output = {id: resultId, family: nativeLineageFamily(resultId), count};
    const outputs = [
        ...(count ? [{output, unitsPerItem: 100}] : []),
        {output: {id: IRON_SLAG, family: 'iron-slag', count: attempts}, unitsPerItem: 25}
    ];
    return planMaterialPartition({
        stock: Object.fromEntries(allocations.map(row => [row.item_key, row.count])), inputs, supportInputs,
        unit: 'forge material unit', unitsPerInput: () => 25, outputs,
        losses: count < attempts ? [{reason: 'metal trapped in failed reduction', amount: 100 * (attempts - count)}] : [],
        process: {id: 'smelting.iron', revision: 1, at: clock, world_id: world,
            parameters: {attempts, ingots: count, slag: attempts, lostMetalUnits: 100 * (attempts - count)}}
    }).outputs;
}

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
    const family=nativeLineageFamily(resultId);
    const stock=Object.fromEntries(allocations.map(r=>[r.item_key,r.count]));
    const wood=HANDLE_WOOD.get(resultId);
    if(world==='base.frontier' && wood && recipeId===resultId) {
        if(allocations.some(row=>JSON.parse(row.item_key).id!==wood.log)) throw Error('Processed wood needs its selected log grade.');
        const lost=3*allocations.reduce((sum,row)=>sum+row.count,0)-count;
        return planMaterialPartition({
            stock,inputs:allocations,unit:'wood stock unit',unitsPerInput:()=>3,
            outputs:[{output:{id:resultId,family,count},unitsPerItem:1}],
            losses:lost?[{reason:'unrecovered cut stock',amount:lost}]:[],
            process:{id:'woodworking.prepare-log',revision:1,at:clock,world_id:world,parameters:{yield:count,unrecovered:lost}}
        }).outputs[0].item_key;
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
