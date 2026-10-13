import {validateItemKey} from './gameplay_transactions.js';
import {createContentRegistry} from './expansion_engine.js';
import {stableId, jsonData} from './simulation_contracts.js';
import {validateStructuredRecord,validateStructuredSelection} from './structured_pack_state.js';
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const check=(ok,message)=>{if(!ok)throw Error(message);};
const scalar=v=>['string','boolean','number'].includes(typeof v)&& (typeof v!=='number'||Number.isFinite(v));
export const emptyPackState=()=>({schema:1,packs:{}});
export function validatePackState(state) {
    check(object(state)&&state.schema===1&&object(state.packs),'Unsupported optional content state.');jsonData(state);
    validateStructuredRecord(state.structured);
    validateStructuredSelection(state.pendingStructured);
    check(!(state.structured&&state.pendingStructured),'A beginning cannot be pending and initialized.');
    for(const [id,row] of Object.entries(state.packs)) {
        check(stableId(id)&&object(row)&&stableId(row.worldId)&&Array.isArray(row.locationIds)&&row.locationIds.every(stableId)&&typeof row.active==='boolean'&&object(row.values),'Invalid optional content visit.');
        check(Object.values(row.values).every(scalar),'Invalid optional content values.');
        check(row.job===null||object(row.job)&&stableId(row.job.actionId)&&Number.isSafeInteger(row.job.remaining)&&row.job.remaining>0,'Invalid optional content work.');
    }
    if(state.registered!=null) {
        check(object(state.registered),'Invalid optional registration provenance.');
        for(const [id,row] of Object.entries(state.registered)) {
            check(stableId(id)&&object(row)&&stableId(row.worldId)&&row.worldId.startsWith(id+'.')&&Array.isArray(row.locationIds)&&row.locationIds.length>0&&new Set(row.locationIds).size===row.locationIds.length&&row.locationIds.every(l=>stableId(l)&&l.startsWith(id+'.')),'Invalid optional registration provenance.');
            if(row.itemIds!=null)check(Array.isArray(row.itemIds)&&new Set(row.itemIds).size===row.itemIds.length&&row.itemIds.every(item=>stableId(item)&&item.startsWith(id+'.')),'Invalid optional native item provenance.');
            if(row.inventoryBindings!=null)check(Array.isArray(row.inventoryBindings)&&new Set(row.inventoryBindings.map(b=>b.id)).size===row.inventoryBindings.length&&row.inventoryBindings.every(b=>b.category==='storage'&&stableId(b.id)&&b.id.startsWith(id+'.')),'Invalid optional native inventory provenance.');
            if(row.native!=null) {
                check(object(row.native)&&object(row.native.locations)&&object(row.native.availability),'Invalid dormant optional records.');
                check([...Object.keys(row.native.locations),...Object.keys(row.native.availability)].every(l=>row.locationIds.includes(l)),'Unowned dormant optional record.');
                if(row.native.inventories!=null) {
                    check(object(row.native.inventories),'Invalid dormant native inventory records.');
                    for(const [category,owners]of Object.entries(row.native.inventories)) {
                        check(object(owners),'Invalid dormant native owners.');
                        for(const [owner,rows]of Object.entries(owners)) {
                            check(row.inventoryBindings?.some(b=>b.category===category&&b.id===owner)&&object(rows),'Unowned dormant native inventory.');
                            for(const [key,value]of Object.entries(rows)){validateItemKey(key);check(object(value)&&Number.isSafeInteger(value.count)&&value.count>0,'Invalid dormant native quantity.');}
                        }
                    }
                }
                if(row.native.itemAvailability!=null)check(object(row.native.itemAvailability)&&Object.keys(row.native.itemAvailability).every(item=>row.itemIds?.includes(item)),'Unowned dormant optional item availability.');
            }
        }
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
export async function loadContentPacks({registry,locations,makeLocation,registerStructured,fetchFile=fetch,onError=()=>{}}) {
    const loaded=new Map();
    try {
        const response=await fetchFile('private_packs/manifest.json');if(response.status===404)return loaded;
        check(response.ok,'Optional manifest unavailable.');const manifest=await response.json();
        check(manifest.schema===1&&Array.isArray(manifest.packs)&&manifest.packs.every(p=>typeof p==='string'&&/^[a-z0-9_-]+\/pack\.json$/i.test(p)),'Invalid optional manifest.');
        for(const path of manifest.packs)try {
            const file=await fetchFile('private_packs/'+path);if(file.status===404)continue;check(file.ok,'Optional content unavailable.');
            const data=await file.json();check(!loaded.has(data.id),'Duplicate optional pack.');const d=data.schema===2&&registerStructured?await registerStructured(data):registerPack(data,registry,locations,makeLocation);loaded.set(d.id,d);
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
// Registration provenance is distinct from a visit: installing content earns no
// actions, custody, work or wages. Existing visited schema-1 saves supply their
// own provenance; legacy unvisited records without it remain protected unknowns.
export function packSaveState(state,definitions) {
    validatePackState(state);const next=structuredClone(state);next.registered??={};
    for(const [id,d] of definitions) {
        const prior=next.registered[id],locationIds=d.locations.map(l=>l.id);
        check(!prior||prior.worldId===d.world.id&&JSON.stringify(prior.locationIds)===JSON.stringify(locationIds),'Optional registration needs an explicit migration.');
        const itemIds=(d.items||[]).map(item=>item.id);
        check(prior?.itemIds==null||JSON.stringify(prior.itemIds)===JSON.stringify(itemIds),'Optional item registration needs an explicit migration.');
        const inventoryBindings=(d.simulation?.containers||[]).map(c=>({category:c.category,id:c.id}));
        check(prior?.inventoryBindings==null||JSON.stringify(prior.inventoryBindings)===JSON.stringify(inventoryBindings),'Optional inventory registration needs an explicit migration.');
        next.registered[id]={...prior,worldId:d.world.id,locationIds,...(d.schema===2?{itemIds,...(inventoryBindings.length?{inventoryBindings}:{})}:{})};
    }
    return validatePackState(next);
}
// Unavailable native records are parked, not discarded. Restore only the exact
// registered identity; arbitrary unknown native locations keep loader protection.
export function preparePackSave(original,definitions) {
    const save=structuredClone(original);if(save.content_packs==null)return save;
    validatePackState(save.content_packs);save.content_packs.registered??={};
    for(const [id,row] of Object.entries(save.content_packs.packs))
        save.content_packs.registered[id]??={worldId:row.worldId,locationIds:[...row.locationIds]};
    for(const [id,registration] of Object.entries(save.content_packs.registered)) {
        const d=definitions.get(id),row=save.content_packs.packs[id];
        if(d) {
            if(registration.inventoryBindings!=null)check(JSON.stringify(registration.inventoryBindings)===JSON.stringify((d.simulation?.containers||[]).map(c=>({category:c.category,id:c.id}))), 'Optional inventory restoration needs an explicit migration.');
            if(registration.itemIds!=null)check(JSON.stringify(registration.itemIds)===JSON.stringify((d.items||[]).map(i=>i.id)), 'Optional item restoration needs an explicit migration.');
            check(registration.worldId===d.world.id&&JSON.stringify(registration.locationIds)===JSON.stringify(d.locations.map(l=>l.id)),'Optional registration needs an explicit migration.');
            if(registration.native) {
                Object.assign(save.locations??={},registration.native.locations);
                Object.assign((save.availabilities??={}).location??={},registration.native.availability);
                if(Object.keys(registration.native.itemAvailability||{}).length)Object.assign(save.availabilities.item??={},registration.native.itemAvailability);
                for(const [category,owners]of Object.entries(registration.native.inventories||{}))Object.assign((save.inventories??={})[category]??={},owners);
                delete registration.native;
            }
            continue;
        }
        const native=registration.native??={locations:{},availability:{}};
        for(const binding of registration.inventoryBindings||[])if(Object.hasOwn(save.inventories?.[binding.category]||{},binding.id)) {
            (native.inventories??={})[binding.category]??={};native.inventories[binding.category][binding.id]=save.inventories[binding.category][binding.id];delete save.inventories[binding.category][binding.id];
        }
        for(const item of registration.itemIds||[])if(Object.hasOwn(save.availabilities?.item??{},item)){(native.itemAvailability??={})[item]=save.availabilities.item[item];delete save.availabilities.item[item];}
        for(const location of registration.locationIds) {
            if(Object.hasOwn(save.locations??{},location)){native.locations[location]=save.locations[location];delete save.locations[location];}
            if(Object.hasOwn(save.availabilities?.location??{},location)){native.availability[location]=save.availabilities.location[location];delete save.availabilities.location[location];}
        }
        if(row?.active) {row.active=false;row.resumeAvailable=true;save['current location']='Village';}
        if(save.expansion?.actors?.player.worldId===registration.worldId)save.expansion.actors.player.worldId='base.frontier';
        if(row&&save.expansion?.worlds?.[registration.worldId]) {row.domain=save.expansion.worlds[registration.worldId];delete save.expansion.worlds[registration.worldId];}
        if(save.expansion?.simulation?.people?.player?.location&&registration.locationIds.includes(save.expansion.simulation.people.player.location))save.expansion.simulation.people.player.location='Village';
    }
    validatePackState(save.content_packs);return save;
}
