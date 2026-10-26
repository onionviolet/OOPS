import {object} from './basics.js';
import {validateExtensionRefs,requireStructuredExtensions} from './structured_pack_extensions.js';
import {canonicalDurabilityKey} from './absorb_e2/durability.js';
const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_.:-]+$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);
export function validateStructuredRecord(r) {
    if(r==null)return;
    validateExtensionRefs(r);
    if(!object(r)||![1,2].includes(r.schema)||!id(r.packId)||!Number.isSafeInteger(r.revision)||r.revision<1||!id(r.startId)||!id(r.instanceId)||!id(r.worldId)||!id(r.locationId)||!Number.isSafeInteger(r.initializedAt)||r.initializedAt<0||typeof r.contentHash!=='string'||!/^sha256:[a-f0-9]{64}$/.test(r.contentHash))throw Error('Invalid structured campaign receipt.');
    if(!Number.isSafeInteger(r.seed)||r.seed<1||r.seed>0xffffffff||!Number.isSafeInteger(r.originSequence)||r.originSequence<1||r.instanceId!==`${r.packId}.run.${r.seed}.${r.originSequence}`||!Array.isArray(r.peopleIds)||!Array.isArray(r.locationIds)||new Set(r.peopleIds).size!==r.peopleIds.length||new Set(r.locationIds).size!==r.locationIds.length||![...r.peopleIds,...r.locationIds,r.startId,r.worldId].every(v=>id(v)&&v.startsWith(r.packId+'.'))||!r.locationIds.includes(r.locationId))throw Error('Invalid structured instance binding.');
    if(r.schema===2){validateStructuredSelection(r);validateStructuredLifetime(r);}
    if(r.containerBindings!=null&&(!Array.isArray(r.containerBindings)||new Set(r.containerBindings.map(c=>c.id)).size!==r.containerBindings.length||r.containerBindings.some(c=>!id(c.id)||!c.id.startsWith(r.packId+'.')||c.category!=='storage'||c.holder!=='player'||!Number.isSafeInteger(c.revision)||c.revision<1)))throw Error('Invalid structured inventory owner binding.');
    if(!Array.isArray(r.units)||r.units.some(u=>!id(u.id)||(u.titleOwner!=='player'&&!r.peopleIds.includes(u.titleOwner))||!id(u.titleClaimId)||!Array.isArray(u.keys)||!u.keys.length||new Set(u.keys).size!==u.keys.length||u.keys.some(key=>{try{return !id(JSON.parse(key).id);}catch{return true;}})))throw Error('Invalid structured unit binding.');
    for(const unit of r.units)if(unit.titleRecipients!=null&&(!Array.isArray(unit.titleRecipients)||!unit.titleRecipients.length||new Set(unit.titleRecipients).size!==unit.titleRecipients.length||unit.titleRecipients.some(owner=>owner!=='player'&&!r.peopleIds.includes(owner))))throw Error('Invalid structured title recipient.');
    for(const unit of r.units)if(unit.deferred!=null&&unit.deferred!==true)throw Error('Invalid deferred structured unit.');
}
const hash=v=>typeof v==='string'&&/^sha256:[a-f0-9]{64}$/.test(v);
export function validateStructuredSelection(r) {
    if(r==null)return;
    if(!object(r)||r.schema!==2||!id(r.packId)||!Number.isSafeInteger(r.revision)||r.revision<1||!hash(r.contentHash)||!hash(r.snapshotHash)||![r.startId,r.worldId,r.locationId].every(v=>id(v)&&v.startsWith(r.packId+'.'))||!id(r.bodyId)||r.controllerId!=='player'||r.playerActorId!=='player'||r.life!=='alive'||!Number.isSafeInteger(r.seed)||r.seed<1||r.seed>0xffffffff||!Number.isSafeInteger(r.originSequence)||r.originSequence<1||r.instanceId!==`${r.packId}.run.${r.seed}.${r.originSequence}`||!Number.isSafeInteger(r.startCount)||r.startCount<1||!Number.isSafeInteger(r.choice)||r.choice!==Math.floor(r.seed/0x100000000*r.startCount))throw Error('Invalid durable beginning selection.');
}
export function validateStructuredLifetime(r){
    if(r.lifeId!=null&&(r.lifeId!==r.instanceId+'.life'||r.bodyInstanceId!==r.instanceId+'.body'))throw Error('Invalid native lifetime binding.');
    if(r.bodyInstanceId!=null&&r.lifeId==null)throw Error('Invalid native lifetime binding.');
}
export function requireStructuredSelection(selection,definitions) {
    if(selection==null)return;
    validateStructuredSelection(selection);validateStructuredLifetime(selection);
    const d=definitions.get(selection.packId),b=d?.starts?.[selection.choice];
    if(!b||d.revision!==selection.revision||d.contentHash!==selection.contentHash||d.starts.length!==selection.startCount||b.id!==selection.startId||b.snapshotHash!==selection.snapshotHash||d.world.id!==selection.worldId||b.locationId!==selection.locationId||b.body.id!==selection.bodyId||b.body.controllerId!==selection.controllerId)throw Error('Restore the exact beginning content to resume this character. The saved beginning has been preserved.');
}
export function requireStructuredContent(record,definitions,state) {
    validateStructuredRecord(record);if(!record)return;
    const d=definitions.get(record.packId);
    requireStructuredExtensions(record,d,state);
    if(record.schema===2)requireStructuredSelection(record,definitions);
    const b=record.schema===2?d?.starts?.find(b=>b.id===record.startId):d?.bootstrap;
    if(!d||d.revision!==record.revision||d.contentHash!==record.contentHash||d.world.id!==record.worldId||b?.id!==record.startId||b?.locationId!==record.locationId||JSON.stringify(d.locations.map(l=>l.id))!==JSON.stringify(record.locationIds)||JSON.stringify((d.simulation.people||[]).map(p=>p.id))!==JSON.stringify(record.peopleIds)||JSON.stringify(record.units)!==JSON.stringify(d.units||[])||JSON.stringify(record.containerBindings||[])!==JSON.stringify((d.simulation.containers||[]).map(c=>({id:c.id,category:c.category,holder:c.holder,revision:c.revision}))))throw Error('Restore the exact beginning content to resume this character. The saved beginning has been preserved.');
}
export function validateStructuredEnvelope(save) {
    const pending=save.content_packs?.pendingStructured;
    const r=save.content_packs?.structured;validateStructuredRecord(r);
    if(pending!=null) {
        validateStructuredSelection(pending);validateStructuredLifetime(pending);
        const state=save.expansion,owned=id=>id.startsWith(pending.packId+'.');
        if(state&&(Object.keys(state.actors||{}).some(owned)||Object.keys(state.simulation?.claims||{}).some(owned)||Object.keys(state.actors?.player?.sources||{}).some(owned)))throw Error('Pending beginning already published origin content.');
        if(r||!state||pending.seed!==state.rng||pending.originSequence>state.sequence||state.actors?.player?.worldId!=='base.frontier'||state.worlds?.[pending.worldId]?.facts?.[`${pending.packId}.instance`]!=null||state.simulation?.claims?.[`${pending.packId}.origin`])throw Error('Pending beginning and saved native snapshot disagree.');
    }
    if(!r)return;
    const state=save.expansion,s=state?.simulation;
    if(!state||r.initializedAt>state.clock||r.originSequence>state.sequence||state.actors?.player?.worldId!==r.worldId||!r.locationIds.includes(save['current location'])||s?.people?.player?.location!==save['current location']||state.worlds?.[r.worldId]?.facts?.[`${r.packId}.instance`]!==r.instanceId||s?.claims?.[`${r.packId}.origin`]?.cause!==r.instanceId||s.claims[`${r.packId}.origin`].status!=='settled'||r.peopleIds.some(id=>!s.people[id]||state.actors[id]?.worldId!==r.worldId))throw Error('Structured beginning and saved native snapshot disagree.');
    if(r.schema===2&&r.lifeId!=null&&(s.people.player.lifeId!==r.lifeId||s.people.player.body?.instanceId!==r.bodyInstanceId))throw Error('Structured native lifetime disagrees.');
    if(r.schema===2&&(s.people.player.body?.form!==save.character.bio?.race&&save.character.bio?.race!=null))throw Error('Structured form and actual native body disagree.');
    if(r.schema===2&&(s.people.player.body?.id!==r.bodyId||s.people.player.body?.ownerId!==r.playerActorId||s.people.player.body?.controllerId!==r.controllerId||s.people.player.inventory!=='native'))throw Error('Structured body identity disagrees.');
    for(const c of r.containerBindings||[]) {
        const saved=s.containers?.[c.id];
        if(r.schema===2&&!saved) {
            if(Object.keys(save.inventories?.[c.category]?.[c.id]||{}).length)throw Error('Undeployed structured inventory contains stock.');
            continue;
        }
        if(saved?.installed===false&&Object.keys(save.inventories?.[c.category]?.[c.id]||{}).length)throw Error('Prepared structured inventory contains stock.');
        if(!saved||saved.holder!==c.holder||saved.revision!==c.revision||saved.worldId!==r.worldId||!save.inventories?.[c.category]?.[c.id])throw Error('Structured native inventory owner disagrees.');
    }
    for(const c of r.containerBindings||[]) {
        if(r.schema===2&&!s.containers?.[c.id])continue;
        const d=s.containers[c.id].definition,cargo=save.inventories[c.category][c.id];
        const permitted=new Set(d.objects.flatMap(o=>[o.key,...(o.expiredKey?[o.expiredKey]:[])]));
        if(Object.keys(cargo).some(key=>!permitted.has(key)))throw Error('Unsupported stock in a structured native owner.');
        for(const o of d.objects) {
            const clock=s.objectClocks[o.unitId],title=s.claims[o.titleClaimId];
            const native=Object.values(save.inventories||{}).flatMap(rows=>Object.values(rows));
            const variants=[...Object.values(s.owners),...native.map(rows=>Object.fromEntries(Object.entries(rows).map(([key,row])=>[key,row.count])))];
            const actualKeys=[o.key,o.expiredKey].filter(key=>key&&(variants.some(owner=>owner[key])||s.jobs.some(job=>(job.costs||[]).some(e=>e.type==='item'&&e.amount<0&&e.key===key))));
            if(title?.status==='held'&&(actualKeys.length!==1||actualKeys[0]!==clock.key||o.expiresAfter!=null&&clock.key===o.key&&clock.elapsed>=o.expiresAfter))throw Error('Identified object condition and exposure clock disagree.');
        }
    }
    for(const unit of r.units) {
        const title=s.claims[unit.titleClaimId];
        const inventories=[...Object.values(s.owners),...Object.values(save.inventories||{}).flatMap(owners=>Object.values(owners)).map(rows=>Object.fromEntries(Object.entries(rows).map(([key,row])=>[key,row.count])))];
        const equipped=[...Object.values(save.character?.equipment||{}).filter(Boolean).map(item=>item.inventory_key||JSON.stringify({id:item.id,...(item.quality?{quality:item.quality}:{})})),...Object.values(save.npc_equipment||{}).flatMap(slots=>Object.values(slots))];
        const held=inventories.reduce((n,owner)=>n+Object.entries(owner).filter(([key])=>unit.keys.includes(canonicalDurabilityKey(key))).reduce((n,[,count])=>n+count,0),0)+equipped.filter(key=>unit.keys.includes(canonicalDurabilityKey(key))).length;
        const reserved=s.jobs.reduce((n,job)=>n+(job.costs||[]).filter(e=>e.type==='item'&&e.amount<0&&unit.keys.includes(e.key)).reduce((n,e)=>n-e.amount,0),0);
        if(unit.deferred===true&&!title&&held+reserved===0)continue;
        if(!title||![unit.titleOwner,...(unit.titleRecipients||[])].includes(title.owner)||!['held','settled'].includes(title.status)||held+reserved!==(title.status==='held'?1:0))throw Error('Identified unit, custody and title disagree.');
    }
}
