import {FIELD_CARE_IDS as I,fieldCareDefinitions as D} from './field_care_content.js';
import {statusCareSupportedBody,statusCareCondition} from './status_care_facts.js';
import {PARADISE_IDS as P,PARADISE_LOCATIONS as L} from './book_world_paradise_ids.js';
const check=(ok,message)=>{if(!ok)throw new Error(message);},natural=n=>Number.isSafeInteger(n)&&n>=0;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fieldCareRecord(value){if(value==null)return null;check(typeof value==='string','Field care receipts must use canonical JSON text.');let out;try{out=JSON.parse(value);}catch{throw new Error('Invalid field care receipt.');}check(out&&typeof out==='object'&&!Array.isArray(out)&&JSON.stringify(out)===value,'Invalid canonical field care receipt.');return out;}
export const FIELD_VENOMS=Object.freeze(['Dragonfly venom','Dragonfly queen venom','Weak necrotizing venom','Mild necrotizing venom']);
export function fieldCareEnrolled(state){return state.actors.player.facts[I.prefix+'enrolled']===true&&state.actors.player.completed[I.begin]===1;}
export function fieldCareSupported(state,context={}){return statusCareSupportedBody(state,context)&&['base.frontier',P.hub,P.goa].includes(state.actors.player.worldId);}
export function fieldCareFacts(state,context={}){
    const frame=context.nativeCareFrame,elapsed=Math.max(0,state.clock-(frame?.clock??state.clock));
    const remaining=id=>Math.max(0,(frame?.effects?.[id]?.duration||0)-elapsed);
    const world=state.actors.player.worldId,location=context.facts?.location;
    const safe=(world==='base.frontier'&&['Village','Shack'].includes(location))||
        !!state.bookWorldCampaign&&(world===P.hub&&[L.hub,L.training].includes(location)||world===P.goa&&location===L.pier);
    const supported=fieldCareSupported(state,context),facts=state.actors.player.facts;
    return {'fieldCare.enrolled':fieldCareEnrolled(state),'fieldCare.supportedBody':supported,'fieldCare.safePlace':safe&&frame?.battleRunning===false,
        'fieldCare.sticky':remaining('Sticky')>0,'fieldCare.venom':FIELD_VENOMS.some(id=>remaining(id)>0),'fieldCare.cut':!!statusCareCondition(state,I.cut),
        'fieldCare.armed':facts[I.prefix+'armed']===true,'fieldCare.watchAvailable':!!(state.referenceGameplay||state.auditRemainder)&&facts['feature.battle.seen']===true&&!facts['feature.battle.routeCleared']&&!facts[I.prefix+'armed']&&!facts[I.prefix+'watch']};
}
export function projectFieldCareEffects(state,registry,context={}){
    const c=statusCareCondition(state,I.cut);if(!c||!fieldCareSupported(state,context))return {};
    const id='simulation:'+I.cut;
    return {[id]:{id,name:'Open cut',duration:c.expiresAt-state.clock,description:'Mild qualifying pole cut: dexterity ×0.95 and flat/percent health regeneration ×0.5. Dress with actual Linen cloth/Golmoon leaf or wait twelve played minutes. The strike’s health loss is separate; no extra health drain.',
        effects:{stats:{dexterity:{multiplier:.95},health_regeneration_flat:{multiplier:.5},health_regeneration_percent:{multiplier:.5}},bonus_skill_levels:{},xp_multipliers:{}},tags:{effect:true,debuff:true},affected_by_travel:true}};
}
export function validateFieldCareState(state,registry){
    const a=state.actors.player,s=state.simulation;
    const facts=Object.entries(a.facts).filter(([k])=>k.startsWith(I.prefix)),done=Object.entries(a.completed).filter(([k])=>k.startsWith(I.prefix));
    const known=Object.entries(s?.knowledge.player||{}).filter(([k])=>k.startsWith(I.prefix)),conditions=Object.entries(s?.conditions.player||{}).filter(([k])=>k.startsWith(I.prefix));
    const jobs=(s?.jobs||[]).filter(j=>j.commandId.startsWith(I.prefix));
    if(!facts.length&&!done.length&&!known.length&&!conditions.length&&!jobs.length)return;
    check(s&&fieldCareEnrolled(state),'Field care needs actual optional enrollment.');
    const allowed=['enrolled','armed','wipeReceipt','venomReceipt','watch','wound'];
    for(const [k,v]of facts){const suffix=k.slice(I.prefix.length);check(allowed.includes(suffix),'Unknown field care fact.');
        if(['enrolled','wipeReceipt','venomReceipt'].includes(suffix))check(v===true,'Invalid field care receipt.');
        if(suffix==='armed')check(typeof v==='boolean','Invalid field injury consent.');
    }
    const commands=new Map(D.commands.map(d=>[d.id,d]));
    check(done.every(([k,n])=>commands.has(k)&&natural(n)&&n>0),'Unknown field care completion.');
    for(const [fact,id]of [['wipeReceipt',I.wipe],['venomReceipt',I.venom]])check(!a.facts[I.prefix+fact]||a.completed[id]>0,'Care receipt lacks completed work.');
    const w=fieldCareRecord(a.facts[I.prefix+'watch']);
    if(w!=null)check(Object.keys(w).sort().join(',')==='at,sequence,sessionId'&&natural(w.at)&&w.at<=state.clock&&natural(w.sequence)&&w.sequence<=state.sequence&&
        a.completed[I.arm]>0&&s.sessions.player?.id===w.sessionId&&[4,5].includes(s.sessions.player?.nativeBattle?.schema),'Unsupported current field-wound watch.');
    const r=fieldCareRecord(a.facts[I.prefix+'wound']);
    if(r!=null)check(Object.keys(r).sort().join(',')==='action,at,attackerId,cause,damage,sequence,sessionId'&&/^simulation:[1-9][0-9]*$/.test(r.sessionId)&&
        natural(r.action)&&r.action>0&&natural(r.at)&&r.at<=state.clock&&r.attackerId==='featureBattleHook'&&Number.isFinite(r.damage)&&r.damage>0&&
        natural(r.sequence)&&r.sequence>Number(r.sessionId.split(':')[1])&&r.sequence<=state.sequence&&r.cause===`feature-action:${r.sequence}`&&a.completed[I.arm]>0&&
        s.knowledge.player?.[I.prefix+'wound_account']?.cause===r.cause&&s.knowledge.player[I.prefix+'wound_account'].at===r.at,'Unsupported retained qualifying wound receipt.');
    for(const [id,c]of conditions)check(id===I.cut&&c.intensity===1&&natural(c.expiresAt)&&c.expiresAt<=state.clock+12&&r&&c.cause===r.cause,'Invalid mild cut cause/duration.');
    const keys=new Set(D.commands.flatMap(d=>d.effects.filter(e=>e.type==='knowledge').map(e=>e.key)));keys.add(I.prefix+'wound_account');
    check(known.every(([id,k])=>keys.has(id)&&k.stage==='understood'&&natural(k.at)&&k.at<=state.clock&&typeof k.value==='string'),'Invalid field-care knowledge.');
    for(const j of jobs){const d=commands.get(j.commandId);check(d?.duration>0&&j.actorId==='player'&&j.revision===1&&j.reservationReturns===1&&same(j.costs,d.costs)&&same(j.effects,d.effects)&&
        j.cancellation==='refund'&&same(j.participants,['player'])&&j.siteId===null&&j.claim===null&&j.due<=state.clock+d.duration&&j.completionSupport?.failure==='refund'&&same(j.completionSupport.requires,d.completionRequires),'Invalid exact field-care work.');
        if(registry)check(registry.simulation.commands.get(j.commandId)?.group===I.group,'Missing field-care consumer.');}
    check(!s.programs.player?.commandId?.startsWith(I.prefix),'Field care is chosen deliberately, without a routine.');
    for(const [id,records]of Object.entries(s.conditions))if(id!=='player')check(!Object.keys(records).some(k=>k.startsWith(I.prefix)),'A player cut cannot be copied to another body.');
}
