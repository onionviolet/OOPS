import {stageAcquisition} from './acquisition.js';
import {applyEnergyEffect} from './energy_resources.js';
import {validateItemKey} from './gameplay_transactions.js';

const check=(ok,message)=>{if(!ok)throw Error(message);};
const id=v=>typeof v==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(v)&&!['__proto__','constructor','prototype'].includes(v);
const natural=v=>Number.isSafeInteger(v)&&v>=0;
const dimensions=v=>Array.isArray(v)&&v.length===3&&v.every(n=>natural(n)&&n>0);
const definitions=registry=>registry?.simulation?.containers||registry?.containers;
const definition=(registry,key,frozen)=>{const d=definitions(registry)?.get(key)||(!registry?frozen:null);check(d,'Unsupported inventory compartment.');return d;};
const owner=(plan,context,key)=>plan.ownership?.[key]??context.inventoryOwners?.[key];
const objectFor=(d,key)=>d.objects.find(o=>o.key===key||o.expiredKey===key);
const energyRegistry=registry=>registry.simulation||registry;

export function validateContainerDefinition(d){
    check(d&&id(d.id)&&natural(d.revision)&&d.revision>0&&typeof d.label==='string'&&d.holder==='player'&&id(d.worldId)&&id(d.sourceId)&&id(d.energyId)&&d.category==='storage'&&natural(d.capacity)&&d.capacity>0&&dimensions(d.aperture)&&id(d.knowledgeKey),'Invalid inventory compartment definition.');
    for(const k of ['output','control','trainedOutput','developmentThreshold'])check(natural(d[k])&&d[k]>0,'Invalid compartment access policy.');
    check(d.trainedOutput<=d.output&&Array.isArray(d.objects)&&d.objects.length>0,'Invalid compartment development policy.');
    if(d.accessCosts!=null) {
        check(Array.isArray(d.accessCosts)&&d.accessCosts.length>0&&d.accessCosts[0]?.development===0,'Invalid compartment access stages.');
        let previous=-1,output=d.output;
        for(const stage of d.accessCosts) {
            check(stage&&Object.keys(stage).every(k=>['development','output'].includes(k))&&natural(stage.development)&&stage.development>previous&&natural(stage.output)&&stage.output>0&&stage.output<=output,'Invalid compartment access stage.');
            previous=stage.development;output=stage.output;
        }
    }
    const units=new Set(),keys=new Set();
    for(const o of d.objects){
        validateItemKey(o.key);
        if(o.deferred!=null)check(o.deferred===true,'Invalid deferred compartment object.');
        check(id(o.unitId)&&!units.has(o.unitId)&&!keys.has(o.key)&&dimensions(o.dimensions)&&natural(o.volume)&&o.volume>0&&id(o.titleClaimId)&&id(o.titleOwner),'Invalid identified compartment object.');
        units.add(o.unitId);keys.add(o.key);
        if(o.expiresAfter!=null){validateItemKey(o.expiredKey);check(natural(o.expiresAfter)&&o.expiresAfter>0&&o.expiredKey!==o.key&&!keys.has(o.expiredKey),'Invalid object exposure policy.');keys.add(o.expiredKey);}
        else check(o.expiredKey==null,'Expired condition requires an exposure policy.');
    }
}
export function validateContainerEffect(e){
    check(e&&e.type==='container'&&id(e.containerId)&&['prepare','install','open','close','store','retrieve'].includes(e.operation),'Invalid compartment operation.');
    if(['store','retrieve'].includes(e.operation)){validateItemKey(e.key);check(e.whole===true&&e.count==null,'Transfer only one complete identified object.');}
    else check(e.key==null&&e.count==null,'Unexpected compartment object.');
}
export function validateContainerState(s,state,registry,person){
    if(s.containers==null&&s.objectClocks==null)return;
    check(s.schema>=6,'Compartment state needs its declared schema.');
    check(s.containers&&typeof s.containers==='object'&&!Array.isArray(s.containers)&&s.objectClocks&&typeof s.objectClocks==='object'&&!Array.isArray(s.objectClocks),'Invalid compartment state.');
    const expected=new Set();
    for(const [key,r]of Object.entries(s.containers)){
        const d=definition(registry,key,r.definition);validateContainerDefinition(d);person(d.holder);
        check(r.definition&&JSON.stringify(r.definition)===JSON.stringify(d),'Saved compartment policy differs.');
        check(r.schema===1&&r.revision===d.revision&&r.holder===d.holder&&r.worldId===d.worldId&&typeof r.open==='boolean'&&(r.installed==null||typeof r.installed==='boolean')&&(r.installed!==false||r.open===false),'Compartment binding differs.');
        for(const o of d.objects){expected.add(o.unitId);const c=s.objectClocks[o.unitId];check(c&&c.containerId===d.id&&typeof c.key==='string'&&(c.key===o.key||c.key===o.expiredKey)&&natural(c.elapsed)&&natural(c.lastAt)&&c.lastAt<=state.clock,'Invalid identified object clock.');}
    }
    check(Object.keys(s.objectClocks).every(key=>expected.has(key)),'Unbound identified object clock.');
}
function access(plan,d,context,registry){
    const state=plan.state,s=state.simulation,a=state.actors[d.holder],p=s.people[d.holder],physical=context.nativeBody,body=p?.body,source=a?.sources?.[d.sourceId],faculty=s.faculties?.[d.holder]?.[d.sourceId];
    const vitals=plan.vitals?.[d.holder]||context.vitals?.[d.holder]||context.vitals||p?.vitals;
    check(a?.worldId===d.worldId&&p?.life==='alive'&&context.nativeAlive===true&&context.nativeReady!==false&&vitals?.health>0&&physical?.ownerId===d.holder&&physical.controllerId===d.holder&&physical.hands>0&&physical.mobile!==false&&body?.mobile!==false&&body?.hands>0&&body?.channel>0&&body.control>=d.control,'This body cannot support compartment access.');
    check(source&&(source.expiresAt==null||source.expiresAt>state.clock)&&faculty?.awakened&&faculty.active&&!faculty.suppressed,'The actual installed source is unavailable.');
    const output=d.accessCosts?d.accessCosts.filter(stage=>stage.development<=(faculty.development||0)).at(-1).output:faculty.development>=d.developmentThreshold?d.trainedOutput:d.output;
    applyEnergyEffect(state,d.holder,{type:'energy',energyId:d.energyId,operation:'use',output,control:d.control},energyRegistry(registry));
}
function authority(state,d,o){
    const s=state.simulation,title=s.claims[o.titleClaimId];
    check(title?.owner===o.titleOwner&&title.status==='held','The identified title is unavailable.');
    check(o.titleOwner===d.holder||Object.values(s.custody).some(c=>c.owner===o.titleOwner&&c.holder===d.holder&&(c.key===o.key||c.key===o.expiredKey)&&c.count===1),'This carrier has no exact custody authority.');
}
export function applyContainerEffect(plan,e,context,registry,bindings){
    validateContainerEffect(e);const d=definition(registry,e.containerId);validateContainerDefinition(d);
    check(context.actorId===d.holder,'Only the actual holder can operate this compartment.');
    const s=plan.state.simulation;s.containers??={};s.objectClocks??={};
    if(e.operation==='install'&&s.containers[d.id]?.installed===false) {
        const r=s.containers[d.id];
        check(r.revision===d.revision&&r.holder===d.holder&&r.worldId===d.worldId&&JSON.stringify(r.definition)===JSON.stringify(d)&&plan.state.actors[d.holder]?.worldId===d.worldId&&!r.open,'Prepared compartment policy differs.');
        check(Object.keys(owner(plan,context,d.id)||{}).length===0,'Prepared native inventory must be empty.');
        advanceContainerClocks(plan,registry,context,bindings);
        r.installed=true;return;
    }
    if(['prepare','install'].includes(e.operation)){
        check(!s.containers[d.id]&&plan.state.actors[d.holder]?.worldId===d.worldId,'This compartment cannot be installed again.');
        if(e.operation==='prepare')check(Object.keys(owner(plan,context,d.id)||{}).length===0,'Prepared native inventory must be empty.');
        check(d.objects.every(o=>!s.objectClocks[o.unitId]),'Identified object clock already exists.');
        s.schema=Math.max(s.schema||1,6);
        s.containers[d.id]={schema:1,revision:d.revision,holder:d.holder,worldId:d.worldId,open:false,installed:e.operation==='install',definition:structuredClone(d)};
        for(const o of d.objects) {
            const variants=[o.key,...(o.expiredKey?[o.expiredKey]:[])];
            const owners=[...Object.values(s.owners||{}),...Object.values(plan.gameplay||{}).map(p=>p.inventory),owner(plan,context,d.id)||{}];
            const found=variants.filter(key=>owners.some(rows=>rows?.[key]));
            if(o.deferred===true&&!s.claims[o.titleClaimId]&&found.length===0) {
                s.objectClocks[o.unitId]={containerId:d.id,key:o.key,elapsed:0,lastAt:plan.state.clock};
                continue;
            }
            if(e.operation==='prepare')check(s.claims[o.titleClaimId]?.owner===o.titleOwner&&s.claims[o.titleClaimId]?.status==='held','Prepare against the actual identified title.');
            check(found.length===1&&owners.reduce((n,rows)=>n+(rows?.[found[0]]||0),0)===1,'Install against the actual identified object condition.');
            s.objectClocks[o.unitId]={containerId:d.id,key:found[0],elapsed:0,lastAt:plan.state.clock};
        }
        return;
    }
    const r=s.containers[d.id];check(r&&r.revision===d.revision&&r.installed!==false,'Install this compartment first.');
    advanceContainerClocks(plan,registry,context,bindings);
    if(e.operation==='close'){r.open=false;return;}
    if(e.operation==='open'){check(!r.open,'Compartment is already open.');access(plan,d,context,registry);r.open=true;return;}
    check(r.open,'Open the compartment before accessing an object.');
    const o=objectFor(d,e.key);check(o&&s.objectClocks[o.unitId]?.key===e.key,'Unsupported or stale identified object.');authority(plan.state,d,o);
    const cargo=owner(plan,context,d.id);check(cargo,'Missing actual native inventory owner.');
    const carried=bindings.readInventory(plan,d.holder);
    check(d.objects.every(x=>(cargo[x.key]||0)+(x.expiredKey?cargo[x.expiredKey]||0:0)<=1),'Duplicated identified compartment object.');
    check(Object.keys(cargo).every(k=>objectFor(d,k)),'Unsupported compartment stock.');
    if(e.operation==='store'){
        check(o.dimensions.every((v,i)=>v<=d.aperture[i]),'Complete object does not fit the aperture.');
        const used=d.objects.reduce((n,x)=>n+x.volume*((cargo[x.key]||0)+(x.expiredKey?cargo[x.expiredKey]||0:0)),0);
        check(used+o.volume<=d.capacity,'The actual compartment has insufficient geometric volume.');
    }
    const from=e.operation==='store'?'person':'container',to=from==='person'?'container':'person';
    check(e.operation==='store'?carried[e.key]===1&&!cargo[e.key]:cargo[e.key]===1&&!carried[e.key],'Identified object quantity is duplicated or unavailable.');
    const next=stageAcquisition({person:carried,container:cargo},{transfers:[{from,to,key:e.key,count:1}]});
    access(plan,d,context,registry);
    bindings.writeInventory(plan,d.holder,next.person);(plan.ownership??={})[d.id]=next.container;
    s.objectClocks[o.unitId].lastAt=plan.state.clock;
}
export function containerFacts(state,context,registry){
    const facts={},s=state.simulation;
    for(const [id,c]of Object.entries(s?.objectClocks||{})){const d=definition(registry,c.containerId,s.containers?.[c.containerId]?.definition),o=d.objects.find(o=>o.unitId===id);facts[`object.${id}.fresh`]=c.key===o.key&&(o.deferred!==true||s.claims[o.titleClaimId]?.status==='held');facts[`object.${id}.elapsed`]=c.elapsed;}
    for(const [key,r]of Object.entries(s?.containers||{})){
        const d=definition(registry,key,r.definition),cargo=context.inventoryOwners?.[key]||{};
        facts[`container.${key}.installed`]=r.installed!==false;facts[`container.${key}.open`]=r.open;
        facts[`container.${key}.known`]=!!s.knowledge?.[context.actorId||'player']?.[d.knowledgeKey];
        facts[`container.${key}.development`]=s.faculties?.[d.holder]?.[d.sourceId]?.development||0;
        facts[`container.${key}.energyReserve`]=s.energies?.[d.holder]?.[d.energyId]?.reserve||0;
        facts[`container.${key}.usedVolume`]=d.objects.reduce((n,o)=>n+o.volume*((cargo[o.key]||0)+(o.expiredKey?cargo[o.expiredKey]||0:0)),0);
        for(const o of d.objects){facts[`container.${key}.item.${o.key}`]=cargo[o.key]||0;if(o.expiredKey)facts[`container.${key}.item.${o.expiredKey}`]=cargo[o.expiredKey]||0;}
    }
    return facts;
}
export function advanceContainerClocks(out,registry,contexts,bindings){
    const state=out.state,s=state.simulation,context=contexts.player||contexts;
    for(const [unitId,c]of Object.entries(s?.objectClocks||{})){
        const d=definition(registry,c.containerId,s.containers?.[c.containerId]?.definition),o=d.objects.find(o=>o.unitId===unitId);check(o,'Unbound identified exposure clock.');
        check(natural(c.lastAt)&&c.lastAt<=state.clock,'Object exposure clock runs backward.');
        const title=s.claims[o.titleClaimId];
        if(o.deferred===true&&!title){c.lastAt=state.clock;continue;}
        if(o.deferred===true&&title?.status==='held'&&c.elapsed===0&&title.at>=c.lastAt) {
            const variants=[o.key,...(o.expiredKey?[o.expiredKey]:[])];
            const present=variants.filter(key=>(owner(out,context,d.id)||{})[key]||Object.keys(s.people).some(actor=>bindings.readInventory(out,actor)?.[key]));
            check(present.length===1,'Newly acquired object has no unique actual condition.');
            c.key=present[0];
        }
        const cargo=owner(out,context,d.id)||{},inside=cargo[c.key]||0;
        if(!inside)c.elapsed+=state.clock-Math.max(c.lastAt,o.deferred===true?title.at:0);
        c.lastAt=state.clock;check(natural(c.elapsed),'Object exposure overflow.');
        if(inside||o.expiresAfter==null||c.key===o.expiredKey||c.elapsed<o.expiresAfter)continue;
        const holders=Object.keys(s.people).filter(id=>bindings.readInventory(out,id)?.[c.key]);
        if(!holders.length&&s.claims[o.titleClaimId]?.status==='settled')continue;
        const reservations=(s.jobs||[]).flatMap(job=>(job.costs||[]).filter(e=>e.type==='item'&&e.amount===-1&&e.key===c.key).map(effect=>({job,effect})));
        if(!holders.length&&reservations.length===1) {
            reservations[0].effect.key=o.expiredKey;
            for(const custody of Object.values(s.custody))if(custody.key===c.key&&custody.count===1)custody.key=o.expiredKey;
            c.key=o.expiredKey;continue;
        }
        check(holders.length===1,'Identified expiring object has no unique actual owner.');
        const holder=holders[0],inventory=bindings.readInventory(out,holder);
        check(inventory[c.key]===1,'Identified expiration quantity differs.');
        const next=stageAcquisition({person:inventory},{consumes:[{owner:'person',key:c.key,count:1}],grants:[{owner:'person',key:o.expiredKey,count:1}]}).person;
        bindings.writeInventory(out,holder,next);
        for(const custody of Object.values(s.custody))if(custody.key===c.key&&custody.count===1)custody.key=o.expiredKey;
        c.key=o.expiredKey;
    }
}

// The common scheduler uses this boundary. No independent ticking loop exists.
export function nextContainerBoundary(state,registry,contexts={}) {
    const s=state.simulation,context=contexts.player||contexts;let due=Infinity;
    for(const c of Object.values(s?.objectClocks||{})) {
        const d=definition(registry,c.containerId,s.containers?.[c.containerId]?.definition),o=d.objects.find(o=>o.unitId===c.unitId||o.key===c.key||o.expiredKey===c.key);
        if(!o||o.expiresAfter==null||c.key===o.expiredKey||o.deferred===true&&!s.claims[o.titleClaimId]||s.claims[o.titleClaimId]?.status==='settled'||context.inventoryOwners?.[d.id]?.[c.key])continue;
        due=Math.min(due,state.clock+Math.max(0,o.expiresAfter-c.elapsed-(state.clock-c.lastAt)));
    }
    return due;
}
