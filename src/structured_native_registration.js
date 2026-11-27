import {compileStructuredPack,mergeStructuredPack,stageStructuredNativeObjects,registerStructuredCommandExtension} from './structured_pack_definitions.js';
import {validateStructuredBootstrap} from './structured_pack_runtime.js';
export async function structuredContentHash(raw) {
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(raw)));
    return 'sha256:'+Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
}
// Acknowledged identity drift. A pack's content hash moves whenever tracked code changes what it compiles to, which strands
// every save and local continuation that pinned the old hash. A pack may declare compatibility.identityAliases:
// [{from, to, reason}], meaning "content that hashes to `from` today is the same life as `to`". The declaration stays out
// of the hash. Any further drift changes `from`, the alias stops matching, and old saves fail loudly again until someone
// looks and re-declares (tests/lead_saves_load.test.js boots the local lead saves). Default: no aliases.
// A reviewed pack alias may opt into preserveCurrent to retain its already-issued
// raw content/start pair too. The saved pair is checked together; unmarked aliases
// retain their prior behavior. Snapshot aliases use the same exact declarations.
const hashShape=/^sha256:[a-f0-9]{64}$/;
export function structuredIdentitySource(raw) {
    if(raw?.compatibility?.identityAliases==null)return raw;
    const compatibility={...raw.compatibility};delete compatibility.identityAliases;
    return {...raw,compatibility};
}
function validPreviousIdentities(editions, raw) {
    if(editions==null)return true;
    if(!Array.isArray(editions)||!editions.length)return false;
    const startIds=(raw.starts||[]).map(start=>start.id).sort();
    const seen=new Set();
    return editions.every(edition=>{
        if(!edition||Object.keys(edition).sort().join(',')!=='contentHash,starts'
            ||!hashShape.test(edition.contentHash)||!Array.isArray(edition.starts)
            ||!startIds.length||edition.starts.length!==startIds.length)return false;
        if(edition.starts.some(start=>!start||Object.keys(start).sort().join(',')!=='id,snapshotHash'
            ||typeof start.id!=='string'||!hashShape.test(start.snapshotHash)))return false;
        const ids=edition.starts.map(start=>start.id).sort();
        if(JSON.stringify(ids)!==JSON.stringify(startIds))return false;
        const signature=JSON.stringify([edition.contentHash,edition.starts]);
        if(seen.has(signature))return false;
        seen.add(signature);return true;
    });
}
export function structuredIdentityAliases(raw,table=new Map()) {
    const rows=raw?.compatibility?.identityAliases;
    if(rows==null)return table;
    if(!Array.isArray(rows)||rows.some(r=>!r||!hashShape.test(r.from)||!hashShape.test(r.to)||r.from===r.to||typeof r.reason!=='string'||!r.reason||r.preserveCurrent!=null&&typeof r.preserveCurrent!=='boolean'||!validPreviousIdentities(r.previousIdentities,raw)||table.has(r.from)&&table.get(r.from)!==r.to))throw Error('Invalid identity alias declaration.');
    for(const r of rows)table.set(r.from,r.to);
    return table;
}
// Existing constructor staging, content identity and registry publication,
// extracted from the composition root without changing the base definition.
export function createStructuredNativeRegistration({registry,locations,items,inventories,availabilities,definitions,makeLocation,makeItem,makeInventory}) {
    const aliases=new Map(),identity=async raw=>{const own=await structuredContentHash(structuredIdentitySource(raw));return aliases.get(own)??own;};
    const register=async raw=>{
        structuredIdentityAliases(raw,aliases);
        const compiled=compileStructuredPack(raw,registry);
        for(const l of raw.locations)if(locations[l.id])throw Error('Structured native location collision.');
        for(const i of raw.items||[])if(items[i.id])throw Error('Structured native item collision.');
        for(const c of raw.simulation.containers||[])if(inventories[c.category]?.[c.id])throw Error('Structured native inventory collision.');
        const rawContentHash=await structuredContentHash(structuredIdentitySource(raw));
        const contentHash=aliases.get(rawContentHash)??rawContentHash,localLocations={};
        const reviewedAlias=raw.compatibility?.identityAliases?.find(row=>row.from===rawContentHash&&row.to===contentHash);
        const staged=stageStructuredNativeObjects(raw,{availabilities,makeLocation:l=>localLocations[l.id]=makeLocation(l),makeItem,makeInventory});
        const rawStarts=[];
        const starts=raw.starts?await Promise.all(raw.starts.map(async start=>{
            const snapshot={...start};delete snapshot.snapshotHash;
            const snapshotHash=await structuredContentHash(snapshot);
            rawStarts.push({id:start.id,snapshotHash});
            return {...start,snapshotHash:aliases.get(snapshotHash)??snapshotHash};
        })):null;
        // Keep an issued post-copy identity as one coherent pair, rather than
        // independently accepting content and start hashes in crossed combinations.
        const identityAlternatives=[];
        if(reviewedAlias&&starts&&rawContentHash!==contentHash){
            if(reviewedAlias.preserveCurrent===true)identityAlternatives.push({contentHash:rawContentHash,starts:rawStarts});
            if(reviewedAlias.previousIdentities)identityAlternatives.push(...structuredClone(reviewedAlias.previousIdentities));
        }
        const admitted={...compiled.definition,contentHash,...(starts?{starts}:{}),
            ...(identityAlternatives.length?{identityAlternatives}:{})};validateStructuredBootstrap(admitted);
        const d={...mergeStructuredPack(compiled,registry),...admitted};
        for(const [id,l]of staged.locations){const authored=raw.locations.find(row=>row.id===id);if(authored.combat){l.parent_location=localLocations[authored.combat.parentId];l.parent_location.connected_locations.push({location:l,travel_time:1});}locations[id]=l;}
        for(const [id,item]of staged.items)items[id]=item;
        for(const [category,id,inventory]of staged.inventories){inventories[category]||={};inventories[category][id]=inventory;}
        definitions.set(d.id,d);return d;
    };
    const extension=async(raw,base,options)=>registerStructuredCommandExtension(raw,await identity(raw),base,registry,(rows,places)=>{
        if(rows.some(row=>Object.hasOwn(items,row.id)))throw Error('Structured native item collision.');
        if(places.some(row=>Object.hasOwn(locations,row.id)))throw Error('Structured native location collision.');
        const staged=stageStructuredNativeObjects({locations:places,items:rows,simulation:{}},{availabilities,makeLocation,makeItem,makeInventory});
        for(const [id,item] of staged.items)items[id]=item;
        for(const [id,location] of staged.locations)locations[id]=location;
    },options);
    register.extension=(raw,base,options)=>extension(raw,base,options);
    register.bundledInstantExtension=(raw,base)=>extension(raw,base,{bundledInstant:true});
    return register;
}
