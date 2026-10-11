import {createContentRegistry} from './expansion_engine.js';
import {stableId, jsonData} from './simulation_contracts.js';
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const check=(ok,message)=>{if(!ok)throw Error(message);};
const scalar=v=>['string','boolean','number'].includes(typeof v)&& (typeof v!=='number'||Number.isFinite(v));
export const emptyPackState=()=>({schema:1,packs:{}});
export function validatePackState(state) {
    check(object(state)&&state.schema===1&&object(state.packs),'Unsupported optional content state.');jsonData(state);
    for(const [id,row] of Object.entries(state.packs)) {
        check(stableId(id)&&object(row)&&stableId(row.worldId)&&Array.isArray(row.locationIds)&&row.locationIds.every(stableId)&&typeof row.active==='boolean'&&object(row.values),'Invalid optional content visit.');
        check(Object.values(row.values).every(scalar),'Invalid optional content values.');
        check(row.job===null||object(row.job)&&stableId(row.job.actionId)&&Number.isSafeInteger(row.job.remaining)&&row.job.remaining>0,'Invalid optional content work.');
    }
    check(Object.values(state.packs).filter(r=>r.active).length<=1,'Overlapping optional visits.');return state;
}
export function packConditions(values,conditions=[]) {
    return conditions.every(c=>c.op==='eq'?values[c.field]===c.value:c.op==='gte'?values[c.field]>=c.value:values[c.field]<=c.value);
}
function patch(values,changes={}) {
    for(const [key,value] of Object.entries(changes.set||{}))values[key]=value;
    for(const [key,amount] of Object.entries(changes.add||{})) {check(typeof values[key]==='number'&&Number.isFinite(values[key]+amount)&&values[key]+amount>=0,'Insufficient local resource.');values[key]+=amount;}
}
export function validatePack(definition) {
    jsonData(definition);const d=structuredClone(definition);
    check(d.schema===1&&stableId(d.id)&&typeof d.title==='string'&&object(d.world)&&stableId(d.world.id)&&typeof d.world.label==='string','Invalid optional pack header.');
    check(d.world.id.startsWith(d.id+'.')&&Array.isArray(d.locations)&&d.locations.length>0&&Array.isArray(d.people)&&Array.isArray(d.activities)&&object(d.initial),'Invalid optional pack content.');
    check(Object.values(d.initial).every(scalar),'Invalid initial values.');
    const ids=new Set();
    for(const item of [...d.locations,...d.people,...d.activities]) {check(stableId(item.id)&&item.id.startsWith(d.id+'.')&&!ids.has(item.id)&&typeof item.label==='string','Invalid or duplicate optional content ID.');ids.add(item.id);}
    for(const action of d.activities) {
        check(Number.isSafeInteger(action.duration)&&action.duration>=0&&typeof action.description==='string','Invalid optional activity.');
        for(const rules of [action.requires||[],action.visibleWhen||[]])for(const rule of rules)check(Object.hasOwn(d.initial,rule.field)&&['eq','gte','lte'].includes(rule.op)&&scalar(rule.value),'Invalid optional condition.');
        for(const changes of [action.start||{},action.complete||{}]) {
            for(const [key,val] of Object.entries(changes.set||{}))check(Object.hasOwn(d.initial,key)&&typeof val===typeof d.initial[key]&&scalar(val),'Invalid optional state change.');
            for(const [key,val] of Object.entries(changes.add||{}))check(typeof d.initial[key]==='number'&&Number.isFinite(val),'Invalid optional resource change.');
        }
    }
    for(const p of d.people)check(d.locations.some(l=>l.id===p.location),'Unknown optional person location.');
    const registry=createContentRegistry({worlds:[d.world],simulation:{people:d.people.map(p=>({...p,revision:1,worldId:d.world.id,inventory:'simulation',provision:false}))},actions:d.activities.map(a=>({id:a.id,worldId:d.world.id,label:a.label,description:a.description,revision:1,group:'optional_pack',duration:a.duration,repeatable:true,completionScope:'actor',costs:[],outcomes:[{id:'complete',label:a.label,chance:1,effects:[]}],visibleWhen:{fact:'optional.internal',op:'eq',value:true}}))});
    return {definition:d,registry};
}
export function registerPack(pack,registry,locations,makeLocation) {
    const {definition:d,registry:extra}=validatePack(pack);
    for(const family of ['worlds','actions'])for(const id of extra[family].keys())check(!registry[family].has(id),'Optional content conflicts with existing content.');
    for(const id of extra.simulation.people.keys())check(!registry.simulation.people.has(id),'Optional person conflicts with existing content.');
    for(const l of d.locations)check(!Object.hasOwn(locations,l.id),'Optional location conflicts with existing content.');
    // Construct only after every definition and collision is checked.
    const native=d.locations.map(l=>[l.id,makeLocation(l)]);
    for(const family of ['worlds','actions'])for(const [id,value] of extra[family])registry[family].set(id,value);
    for(const [id,value] of extra.simulation.people)registry.simulation.people.set(id,value);
    for(const [id,value] of native)locations[id]=value;
    return d;
}
export async function loadContentPacks({registry,locations,makeLocation,fetchFile=fetch,onError=()=>{}}) {
    const loaded=new Map();
    try {
        const response=await fetchFile('private_packs/manifest.json');if(response.status===404)return loaded;
        check(response.ok,'Optional manifest unavailable.');const manifest=await response.json();
        check(manifest.schema===1&&Array.isArray(manifest.packs)&&manifest.packs.every(p=>typeof p==='string'&&/^[a-z0-9_-]+\/pack\.json$/i.test(p)),'Invalid optional manifest.');
        for(const path of manifest.packs)try {
            const file=await fetchFile('private_packs/'+path);if(file.status===404)continue;check(file.ok,'Optional content unavailable.');
            const data=await file.json();check(!loaded.has(data.id),'Duplicate optional pack.');const d=registerPack(data,registry,locations,makeLocation);loaded.set(d.id,d);
        }catch(error){onError(error);}
    }catch(error){onError(error);}
    return loaded;
}
export function enterPack(state,d) {
    validatePackState(state);check(!Object.values(state.packs).some(r=>r.active),'Return from your current visit first.');const next=structuredClone(state);
    next.packs[d.id]??={worldId:d.world.id,locationIds:d.locations.map(l=>l.id),active:false,values:structuredClone(d.initial),job:null};
    const row=next.packs[d.id];check(row.worldId===d.world.id&&JSON.stringify(row.locationIds)===JSON.stringify(d.locations.map(l=>l.id)),'Optional pack needs an explicit migration.');
    for(const [key,value] of Object.entries(d.initial))row.values[key]??=value;
    if(row.job)check(d.activities.some(a=>a.id===row.job.actionId),'Saved optional activity is unavailable.');row.active=true;return validatePackState(next);
}
export function leavePack(state,id) {const next=structuredClone(state);check(next.packs[id]?.active,'No active optional visit.');next.packs[id].active=false;return validatePackState(next);}
export function actPack(state,d,actionId) {
    const next=structuredClone(state),row=next.packs[d.id],action=d.activities.find(a=>a.id===actionId);
    check(row?.active&&action&&!row.job&&packConditions(row.values,action.requires),'This optional activity is unavailable.');
    patch(row.values,action.start);if(action.duration)row.job={actionId,remaining:action.duration};else patch(row.values,action.complete);
    return validatePackState(next);
}
export function advancePack(state,definitions,minutes) {
    check(Number.isSafeInteger(minutes)&&minutes>=0,'Invalid optional clock.');const next=structuredClone(state);
    for(const [id,row] of Object.entries(next.packs))if(row.active&&row.job) {
        const action=definitions.get(id)?.activities.find(a=>a.id===row.job.actionId);check(action,'Saved optional activity is unavailable.');
        row.job.remaining-=Math.min(minutes,row.job.remaining);if(row.job.remaining===0){patch(row.values,action.complete);row.job=null;}
    }
    return validatePackState(next);
}
// Unavailable packs retain their opaque state while native loading uses Village.
export function preparePackSave(original,definitions) {
    const save=structuredClone(original);if(save.content_packs==null)return save;
    validatePackState(save.content_packs);
    for(const [id,row] of Object.entries(save.content_packs.packs))if(!definitions.has(id)) {
        if(row.active) {row.active=false;row.resumeAvailable=true;save['current location']='Village';}
        for(const location of row.locationIds) {delete save.locations?.[location];delete save.availabilities?.location?.[location];}
        if(save.expansion?.actors?.player.worldId===row.worldId)save.expansion.actors.player.worldId='base.frontier';
        if(save.expansion?.worlds?.[row.worldId]) {row.domain=save.expansion.worlds[row.worldId];delete save.expansion.worlds[row.worldId];}
        if(save.expansion?.simulation?.people?.player?.location&&row.locationIds.includes(save.expansion.simulation.people.player.location))save.expansion.simulation.people.player.location='Village';
    }
    return save;
}
