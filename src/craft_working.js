// A working is a saved sequence of verbs and material roles. The host binds
// carried lots and stations for each execution, and owns payment and settlement.
import {defineRecipe, recognizeRecipe} from './craft_recipes.js';
import {resolveBatch} from './craft_resolver.js';
import {validateItemKey} from './inventory_key.js';
import {readMaterialLineage} from './material_lineage.js';

export function craftOperationDictionary(law) {
    return Object.values(law.ops).map(({id,label,station,levels})=>({id,label,station,levels:[...levels]}));
}

export function compileCraftWorking(working, {world, law, stock, lots, materialForKey, stations=[], control=0, parts=[]}) {
    if(working.world!==world || working.law!==law.ref)throw Error('This workshop uses a different version of the law.');
    if(!Array.isArray(working.steps)||!working.steps.length)throw Error('Choose at least one operation.');
    const process=working.steps.flatMap(step=>{
        if(step.part===undefined)return [step];
        if(step.op!==undefined||step.level!==undefined)throw Error('Choose a part or an individual operation.');
        const matches=parts.filter(part=>part.id===step.part&&part.revision===step.revision&&part.law===law.ref);
        if(matches.length!==1||!Array.isArray(matches[0].steps)||!matches[0].steps.length)
            throw Error('That version of the part is unavailable here.');
        return matches[0].steps;
    }).map(({op,level})=>{
        if(!Object.hasOwn(law.ops,op)||!Number.isSafeInteger(level))throw Error('That operation is unavailable here.');
        return {op,level};
    });
    const recipe=defineRecipe(law.catalogue,{id:working.id,revision:working.revision,law:law.ref,
        slots:working.slots,process:process.map(({op,level})=>({op,levels:[level,level]}))});
    const allocated=new Map();
    const inputs=lots.map(({key,qty,role='consumed'})=>{
        validateItemKey(key);
        const used=(allocated.get(key)??0)+qty;
        if(!Number.isSafeInteger(qty)||qty<=0||used>(stock[key]??0))throw Error('The selected stock is no longer available.');
        allocated.set(key,used);
        const material=materialForKey(key,readMaterialLineage(key));
        if(!material)throw Error('The workshop cannot identify the selected stock.');
        return {key,qty,role,material};
    });
    const fit=recognizeRecipe(law.catalogue,recipe,inputs,{process,law:law.ref,stations});
    if(!fit.recognized)throw Error(fit.problems.map(({reason})=>reason).join(' ')||'The selected stock does not fit the working.');
    const batch=resolveBatch(law,{inputs:inputs.map(({qty,role,material})=>({qty,role,material})),process,stations,control});
    const method={id:recipe.id,revision:recipe.revision,world,law:law.ref,slots:recipe.slots,steps:process};
    // This is the actual binding for one trial. The reusable method stays
    // independent of the selected lots. A host can record the setup in its
    // experiment log after settling payment and observing the result.
    const setup={
        revision:1,law:law.ref,
        inputs:inputs.map(({key,qty,role,material})=>({
            key,qty,role,material:material.id,materialRevision:material.revision
        })),
        process:process.map(({op,level})=>[op,level]),
        conditions:{world,stations:[...new Set(stations)].sort(),control,
            consumedUnits:fit.debits.reduce((sum,row)=>sum+row.qty,0)}
    };
    return {working:structuredClone(method),process,consumed:fit.debits,retained:fit.retained,batch,setup};
}
