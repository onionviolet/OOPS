import {check,object} from './basics.js';
import {evaluateRule} from './rules.js';
const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_.:-]+$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);
const hash=v=>typeof v==='string'&&/^sha256:[a-f0-9]{64}$/.test(v);
export const extensionFact=id=>`structured.extension.${id}.admitted`;
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
    }
    // Only the installed command extension's declared outputs are considered.
    // A settled counter or witnessed note still belongs to its saved identity.
    if(state)for(const e of base?.extensions||[]) {
        const produced=e.commands.some(c=>(state.actors?.player?.completed?.[c.id]||0)>0||c.effects.some(effect=>effect.type==='knowledge'&&Object.hasOwn(state.simulation?.knowledge?.player||{},effect.key)));
        check(!produced||record?.extensions?.some(pin=>pin.id===e.id),'Settled extension work requires its saved content pin.');
    }
    if(state)for(const job of state.simulation?.jobs||[]) {
        const e=base?.extensions?.find(e=>job.commandId.startsWith(e.id+'.'));
        if(!e)continue;
        check(record?.extensions?.some(pin=>pin.id===e.id),'Pending extension work requires its saved content pin.');
        const d=e.commands.find(c=>c.id===job.commandId);
        check(d&&job.revision===d.revision&&JSON.stringify(job.costs)===JSON.stringify(d.costs)&&JSON.stringify(job.effects)===JSON.stringify(d.effects)&&job.cancellation===d.cancellation&&job.reservationReturns===d.reservationReturns&&job.targetId===d.targetId&&job.actorId===d.actorId&&JSON.stringify(job.participants)===JSON.stringify([d.actorId,d.targetId])&&JSON.stringify(job.audience)===JSON.stringify([d.actorId])&&JSON.stringify(job.completionSupport)===JSON.stringify({schema:1,requires:d.completionRequires,coLocated:!!d.completionCoLocated,location:d.location,failure:d.completionFailure}),'Restore the exact pending school extension command. Your saved work has been preserved.');
    }
}
export function admittedExtensionCommands(base,record) {
    requireStructuredExtensions(record,base);
    return (base.extensions||[]).filter(e=>record?.extensions?.some(pin=>pin.id===e.id)).flatMap(e=>e.commands);
}
export function previewStructuredExtension(state,base,record,e,context,facts) {
    requireExtensionBase(e,base);
    const reasons=[];
    if(record?.packId!==base.id||record.contentHash!==base.contentHash)reasons.push('Begin this school life first.');
    if(record?.extensions?.some(pin=>pin.id===e.id))reasons.push('This optional continuation is already admitted.');
    if(context.busy||state.pending.length||state.simulation?.jobs.length||state.chronicle?.session||state.chronicle?.life.endedAt!=null||Object.values(state.actors.player.techniques||{}).some(t=>t.practice))reasons.push('Finish your current work before admitting this continuation.');
    if(context.nativeAlive!==true||context.nativeReady!==true||state.simulation?.people.player?.life!=='alive'||context.vitals?.player&&!(context.vitals.player.health>0))reasons.push('Continue with a ready living body.');
    if(!evaluateRule(e.requires,facts).met)reasons.push(e.reason);
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
    return {record:next,plan:{state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),vitals:structuredClone(context.vitals||{}),acquisitions:[],unlocks:[]}};
}
