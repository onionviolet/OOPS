import {compileStructuredPack,mergeStructuredPack,stageStructuredNativeObjects,registerStructuredCommandExtension} from './structured_pack_definitions.js';
import {validateStructuredBootstrap} from './structured_pack_runtime.js';
export async function structuredContentHash(raw) {
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(raw)));
    return 'sha256:'+Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
}
// Existing constructor staging, content identity and registry publication,
// extracted from the composition root without changing the base definition.
export function createStructuredNativeRegistration({registry,locations,items,inventories,availabilities,definitions,makeLocation,makeItem,makeInventory}) {
    const register=async raw=>{
        const compiled=compileStructuredPack(raw,registry);
        for(const l of raw.locations)if(locations[l.id])throw Error('Structured native location collision.');
        for(const i of raw.items||[])if(items[i.id])throw Error('Structured native item collision.');
        for(const c of raw.simulation.containers||[])if(inventories[c.category]?.[c.id])throw Error('Structured native inventory collision.');
        const contentHash=await structuredContentHash(raw),localLocations={};
        const staged=stageStructuredNativeObjects(raw,{availabilities,makeLocation:l=>localLocations[l.id]=makeLocation(l),makeItem,makeInventory});
        const starts=raw.starts?await Promise.all(raw.starts.map(async start=>{
            const snapshot={...start};delete snapshot.snapshotHash;
            return {...start,snapshotHash:await structuredContentHash(snapshot)};
        })):null;
        const admitted={...compiled.definition,contentHash,...(starts?{starts}:{})};validateStructuredBootstrap(admitted);
        const d={...mergeStructuredPack(compiled,registry),...admitted};
        for(const [id,l]of staged.locations){const authored=raw.locations.find(row=>row.id===id);if(authored.combat){l.parent_location=localLocations[authored.combat.parentId];l.parent_location.connected_locations.push({location:l,travel_time:1});}locations[id]=l;}
        for(const [id,item]of staged.items)items[id]=item;
        for(const [category,id,inventory]of staged.inventories){inventories[category]||={};inventories[category][id]=inventory;}
        definitions.set(d.id,d);return d;
    };
    register.extension=async(raw,base)=>registerStructuredCommandExtension(raw,await structuredContentHash(raw),base,registry);
    return register;
}
