import {structuredSelectionIdentity} from './structured_pack_identity.js';
import {check,object} from './basics.js';
import {riStonePending} from './ri_stone_pieces.js';
import {evaluateRule} from './rules.js';
const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_.:-]+$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);
const hash=v=>typeof v==='string'&&/^sha256:[a-f0-9]{64}$/.test(v);
export const extensionFact=id=>`structured.extension.${id}.admitted`;
// A bundled, separately pinned method can supply explicit alternate means for
// one exact installed continuation. It does not change completed-event facts.
export function structuredSupportRule(base,target,rule,commandId=null) {
    if(rule==null)return rule;
    let result=rule;
    for(const provider of base.extensions||[])for(const a of provider.supportAlternatives||[]) {
        if(a.target.id!==target.id||a.target.revision!==target.revision||a.target.contentHash!==target.contentHash||
            !(commandId==null?a.admission:a.commands.includes(commandId)))continue;
        const replace=current=>{
            if(JSON.stringify(current)===JSON.stringify(a.replaces))return {any:[current,{all:[{fact:extensionFact(provider.id),op:'eq',value:true},a.requires]}]};
            for(const join of ['all','any'])if(current?.[join])return {...current,[join]:current[join].map(replace)};
            return current;
        };
        result=replace(result);
    }
    return result;
}
export function structuredSupportCommand(base,target,command) {
    return {...command,...Object.fromEntries(['requires','visibleWhen','completionRequires'].filter(field=>Object.hasOwn(command,field)).map(field=>
        [field,structuredSupportRule(base,target,command[field],command.id)]))};
}
// Frozen pending work can contain the alternatives installed when it began.
// Contract only exact declared receipt substitutions back to their original
// predicate; every surrounding condition and other support field stays exact.
export function normaliseStructuredSupportRule(base,target,rule,commandId) {
    const allowed=(base.extensions||[]).flatMap(provider=>(provider.supportAlternatives||[])
        .filter(a=>a.target.id===target.id&&a.target.revision===target.revision&&a.target.contentHash===target.contentHash&&a.commands.includes(commandId))
        .map(a=>({receipt:a.replaces,branch:{all:[{fact:extensionFact(provider.id),op:'eq',value:true},a.requires]}})));
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    const visit=current=>{
        if(!current)return current;
        for(const join of ['all','any'])if(current[join]) {
            const children=current[join].map(visit),result={...current,[join]:children};
            if(join==='any'&&Object.keys(result).length===1&&children.length===2) {
                const match=allowed.find(a=>same(children[0],a.receipt)&&same(children[1],a.branch));
                if(match)return match.receipt;
            }
            return result;
        }
        return current;
    };
    return visit(rule);
}
export function validateExtensionRefs(record) {
    if(record?.extensions==null)return;
    check(Array.isArray(record.extensions)&&record.extensions.length>0&&new Set(record.extensions.map(r=>r?.id)).size===record.extensions.length,'Invalid structured extension pins.');
    for(const r of record.extensions)check(object(r)&&Object.keys(r).sort().join(',')==='contentHash,id,revision'&&id(r.id)&&r.id.startsWith(record.packId+'.')&&Number.isSafeInteger(r.revision)&&r.revision>0&&hash(r.contentHash),'Invalid structured extension pin.');
}
export function requireExtensionBase(extension,base) {
    check(extension?.base?.id===base?.id&&extension.base.revision===base.revision&&extension.base.contentHash===base.contentHash,'Restore the exact base content for this extension.');
}
export function requireStructuredExtensions(record,base,state) {
    validateExtensionRefs(record);
    for(const pin of record?.extensions||[]) {
        const e=base?.extensions?.find(e=>e.id===pin.id);
        check(e&&e.revision===pin.revision&&e.contentHash===pin.contentHash,'Restore the exact school extension content. Your saved life has been preserved.');
        requireExtensionBase(e,base);
        check((e.dependsOn||[]).every(id=>record.extensions.some(required=>required.id===id)), 'Restore the required continuation before loading this save.');
    }
    // Only the installed command extension's declared outputs are considered.
    // A settled counter or witnessed note still belongs to its saved identity.
    if(state)for(const e of base?.extensions||[]) {
        const produced=e.commands.some(c=>(state.actors?.player?.completed?.[c.id]||0)>0||[...(c.effects||[]),...(c.outcomes||[]).flatMap(o=>o.effects||[])].some(effect=>effect.type==='knowledge'&&Object.hasOwn(state.simulation?.knowledge?.player||{},effect.key)));
        const learned=e.energies?.some(d=>Object.hasOwn(state.simulation?.energies?.player||{},d.id));
        check(!(produced||learned)||record?.extensions?.some(pin=>pin.id===e.id),'Settled extension work requires its saved content pin.');
    }
    if(state)for(const job of state.simulation?.jobs||[]) {
        const e=base?.extensions?.find(e=>job.commandId.startsWith(e.id+'.'));
        if(!e)continue;
        check(record?.extensions?.some(pin=>pin.id===e.id),'Pending extension work requires its saved content pin.');
        const d=e.commands.find(c=>c.id===job.commandId);
        const participants=d?.targetId?[d.actorId,d.targetId]:[d?.actorId];
        // The simulation freezes a spawning command's person definition into its job.
        // Rebuild those bytes from the admitted extension when verifying a saved job.
        const boundPiece=riStonePending(state,job,d);
        const effects=boundPiece?.effects||d?.effects.map(effect=>{
            if(effect.type!=='spawn')return effect;
            const template=e.roles?.find(role=>role.id===effect.definitionId);
            check(template,'Pending introduction requires its saved person definition.');
            return {...effect,template};
        });
        check(d&&job.revision===d.revision&&JSON.stringify(job.costs)===JSON.stringify(boundPiece?.costs||d.costs)&&JSON.stringify(job.effects)===JSON.stringify(effects)&&job.cancellation===d.cancellation&&job.reservationReturns===d.reservationReturns&&job.targetId===(d.targetId??null)&&job.actorId===d.actorId&&JSON.stringify(job.participants)===JSON.stringify(participants)&&JSON.stringify(job.audience)===JSON.stringify([d.actorId])&&JSON.stringify({...job.completionSupport,requires:normaliseStructuredSupportRule(base,e,job.completionSupport?.requires,job.commandId)})===JSON.stringify({schema:1,requires:d.completionRequires,coLocated:!!d.completionCoLocated,location:d.location,failure:d.completionFailure}),'Restore the exact pending school extension command. Your saved work has been preserved.');
    }
}
export function admittedExtensionCommands(base,record) {
    requireStructuredExtensions(record,base);
    return (base.extensions||[]).filter(e=>record?.extensions?.some(pin=>pin.id===e.id)).flatMap(e=>e.commands);
}
export function structuredAdmittedLocations(base,record) {
    return [...(base?.locations||[]),...(record?.extensions||[]).flatMap(pin=>
        base?.extensions?.find(e=>e.id===pin.id)?.locations||[])];
}
export function structuredPeoplePresentation(base,record){
 return {...base.presentation.people,...Object.fromEntries((base.extensions||[]).filter(e=>record?.extensions?.some(pin=>pin.id===e.id)).flatMap(e=>(e.roles||[]).map(role=>[role.id,{introductionKnowledgeKey:role.introductionKnowledgeKey}])))};
}
export function previewStructuredExtension(state,base,record,e,context,facts) {
    requireExtensionBase(e,base);
    const reasons=[];
    const start=record?.schema===2?base.starts?.[record.choice]:null;
    const sameIdentity=record?.contentHash===base.contentHash||start&&structuredSelectionIdentity(base,record,start);
    if(record?.packId!==base.id||!sameIdentity)reasons.push('Begin this school life first.');
    if(record?.extensions?.some(pin=>pin.id===e.id))reasons.push('This optional continuation is already admitted.');
    if(context.busy||state.pending.length||state.simulation?.jobs.length||state.chronicle?.session||state.chronicle?.life.endedAt!=null||Object.values(state.actors.player.techniques||{}).some(t=>t.practice))reasons.push('Finish your current work before admitting this continuation.');
    if(context.nativeAlive!==true||context.nativeReady!==true||state.simulation?.people.player?.life!=='alive'||context.vitals?.player&&!(context.vitals.player.health>0))reasons.push('Continue with a ready living body.');
    if(!(e.dependsOn||[]).every(id=>record?.extensions?.some(pin=>pin.id===id))||!evaluateRule(structuredSupportRule(base,e,e.requires),facts).met)reasons.push(e.reason);
    return {id:e.id,revision:e.revision,contentHash:e.contentHash,label:e.label,description:e.description,eligible:!reasons.length,reasons};
}
// A plan only: the host publishes the pin through its existing content_packs
// nativePatch after durable validation/storage succeeds. No gameplay is granted.
export function planStructuredExtension(state,base,record,request,context,facts) {
    requireStructuredExtensions(record,base,state);
    const e=base.extensions?.find(e=>e.id===request.id);
    check(e&&e.revision===request.revision&&e.contentHash===request.contentHash,'This extension confirmation is stale.');
    const quote=previewStructuredExtension(state,base,record,e,context,facts);
    check(quote.eligible,quote.reasons.join(' '));
    const next=structuredClone(record);(next.extensions??=[]).push({id:e.id,revision:e.revision,contentHash:e.contentHash});
    next.locationIds=structuredAdmittedLocations(base,next).map(l=>l.id);
    return {record:next,plan:{state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),vitals:structuredClone(context.vitals||{}),acquisitions:[],unlocks:[]}};
}

