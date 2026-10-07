// These are views of existing saved conditions and the actual native frame.
// No native effect, body, clock, inventory or reward is created by a read.
import {STATUS_CARE_IDS as I, statusCareDefinitions as D} from './status_care_content.js';

const natural = n => Number.isSafeInteger(n) && n >= 0;
const check = (ok, message) => {if(!ok) throw new Error(message);};
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
export const STATUS_CARE_POLICY = Object.freeze({
    [I.warmed]: {duration:20, stats:{cold_tolerance:{flat:3}}, description:'Sheltered warmth: +3 native cold tolerance. Existing Wet and cold still keep their own effects.'},
    [I.lined]: {duration:18, stats:{}, description:'Prepared lining halves the existing native rain or snow accumulation and permits the lined kit-packing approach.'},
    [I.steady]: {duration:18, stats:{dexterity:{multiplier:1.05}}, description:'Steady grip: native dexterity ×1.05 and access to precise kit packing. It must last through that work.'},
    [I.tired]: {duration:12, stats:{dexterity:{multiplier:0.92},stamina_efficiency:{multiplier:0.9}}, description:'Tired hands: native dexterity ×0.92 and stamina efficiency ×0.9. Rest or played time clears it; authored work costs remain fixed.'},
    [I.focused]: {duration:12, stats:{intuition:{multiplier:1.05}}, description:'Settled focus: native intuition ×1.05. This is preparation, not a learned technique or free energy.'},
});

export function statusCareCondition(state,id,actor='player') {
    const c=state.simulation?.conditions?.[actor]?.[id];
    return c && c.intensity>0 && c.expiresAt!=null && c.expiresAt>state.clock ? c : null;
}
export function statusCareEnrolled(state) {
    const actor=state.actors?.player;
    return actor?.facts?.[I.prefix+'enrolled']===true && actor.completed?.[I.begin]===1;
}
export function statusCareSupportedBody(state,context={}) {
    const own=state.simulation?.people?.player?.body;
    const b=own?.id && own.form ? own : context.nativeBody;
    return !!b && context.nativeAlive===true && String(b.form).toLowerCase()==='human' && b.ownerId==='player' &&
        b.controllerId==='player' && b.hands>=2 && b.mobile===true && !['dead','departed','incapacitated'].includes(state.simulation?.people?.player?.life);
}
export function statusCareEffectsSupported(state,context={}) {
    return statusCareEnrolled(state) && state.actors?.player?.worldId===I.world && statusCareSupportedBody(state,context);
}
export function statusCareFacts(state,context={}) {
    const c=context.nativeCareFrame, here=context.facts?.location;
    const clock=!!c && natural(c.clock) && c.clock<=state.clock && natural(c.calendarMinute);
    const local=state.actors?.player?.worldId===I.world && ['Village','Shack'].includes(here) && clock;
    const supportedBody=statusCareSupportedBody(state,context);
    const expiredBy=Math.max(0,state.clock-(c?.clock ?? state.clock));
    const wet=Number.isFinite(c?.effects?.Wet?.duration) && c.effects.Wet.duration>expiredBy;
    const tender=['body.sore_hands','body.scraped_hands'].some(id=>statusCareCondition(state,id));
    const irritation=statusCareCondition(state,'mood.irritated','oldCraftsman');
    const craftsman=state.actors?.oldCraftsman;
    return {'statusCare.enrolled':statusCareEnrolled(state),'statusCare.local':local,'statusCare.supportedBody':supportedBody,
        'statusCare.handsUsable':supportedBody&&!tender,'statusCare.sheltered':local&&here==='Shack'&&c.underRoof===true&&context.facts?.['village.shackUnlocked']===true,
        'statusCare.nativeWet':wet,'statusCare.noNativeBattle':c?.battleRunning===false,
        'statusCare.craftsmanWilling':!irritation&&!craftsman?.facts?.['work.order']&&!craftsman?.facts?.['field.partsOrder'],
        ...Object.fromEntries(['warmed','lined','steady','tired','focused'].map(k=>['statusCare.'+k,!!statusCareCondition(state,I[k])]))};
}

export function projectStatusCareEffects(state,registry,context={}) {
    const records=state.simulation?.conditions?.player || {}, result={};
    const supported=statusCareEffectsSupported(state,context);
    for(const [id,c] of Object.entries(records)) {
        if(!(c.intensity>0) || c.expiresAt!=null && c.expiresAt<=state.clock) continue;
        const definition=registry.simulation.conditions.get(id), policy=STATUS_CARE_POLICY[id];
        if(policy ? !supported : !definition?.bioVisible && !id.startsWith('mood.')) continue;
        if(!definition) continue;
        const key='simulation:'+id;
        result[key]={id:key,name:definition.label,duration:c.expiresAt==null?null:c.expiresAt-state.clock,
            description:policy?.description || definition.bioDetail || 'An existing condition of your current character.',
            effects:{stats:structuredClone(policy?.stats || {}),bonus_skill_levels:{},xp_multipliers:{}},
            tags:{effect:true,...(id===I.tired?{debuff:true}:policy?{buff:true}:{})},affected_by_travel:true};
    }
    return result;
}
export function statusCareRainMultiplier(state,context={}) {
    return statusCareEffectsSupported(state,context)&&statusCareCondition(state,I.lined) ? 0.5 : 1;
}

export function validateStatusCareState(state,registry) {
    const actor=state.actors?.player, s=state.simulation;
    if(!actor) return;
    const ownFacts=Object.keys(actor.facts).filter(k=>k.startsWith(I.prefix));
    const ownDone=Object.keys(actor.completed).filter(k=>k.startsWith(I.prefix));
    const ownKnown=Object.entries(s?.knowledge?.player || {}).filter(([k])=>k.startsWith(I.prefix));
    const ownConditions=Object.entries(s?.conditions?.player || {}).filter(([k])=>k.startsWith(I.prefix));
    const ownJobs=(s?.jobs || []).filter(j=>j.commandId?.startsWith(I.prefix));
    const program=s?.programs?.player;
    check(!program?.commandId?.startsWith(I.prefix),'No automated care program is admitted.');
    if(!ownFacts.length&&!ownDone.length&&!ownKnown.length&&!ownConditions.length&&!ownJobs.length) return;
    check(!!s&&statusCareEnrolled(state),'Care records need explicit supported enrollment.');
    check(ownFacts.every(k=>[I.prefix+'enrolled',I.prefix+'dryReceipt'].includes(k)&&actor.facts[k]===true),'Unknown care record.');
    const definitions=new Map(D.commands.map(d=>[d.id,d]));
    check(ownDone.every(k=>definitions.has(k)&&natural(actor.completed[k])&&actor.completed[k]>0),'Invalid care completion.');
    check(!actor.facts[I.prefix+'dryReceipt']||actor.completed[I.dryOff]>0,'Drying receipt needs completed work.');
    for(const [id,c] of ownConditions) {
        const policy=STATUS_CARE_POLICY[id];
        check(policy&&c.intensity===1&&natural(c.expiresAt)&&c.expiresAt<=state.clock+policy.duration&&typeof c.cause==='string','Invalid care condition.');
    }
    const keys=new Set(D.commands.flatMap(d=>d.effects.filter(e=>e.type==='knowledge').map(e=>e.key)));
    check(ownKnown.every(([k,v])=>keys.has(k)&&['seen','understood'].includes(v.stage)&&natural(v.at)&&v.at<=state.clock&&typeof v.value==='string'),'Invalid care knowledge.');
    for(const [id,records] of Object.entries(s.conditions)) if(id!=='player')
        check(!Object.keys(records).some(k=>k.startsWith(I.prefix)),'Local care is not another actor body.');
    for(const job of ownJobs) {
        const d=definitions.get(job.commandId);
        check(d&&d.duration>0&&job.actorId==='player'&&job.revision===d.revision&&job.reservationReturns===1&&
            same(job.costs,d.costs)&&same(job.effects,d.effects)&&job.cancellation==='refund'&&
            same(job.participants,d.targetId?['player',d.targetId]:['player'])&&job.siteId===null&&job.claim===null&&
            job.due<=state.clock+d.duration&&job.completionSupport?.failure==='refund'&&
            same(job.completionSupport.requires,d.completionRequires)&&job.completionSupport.coLocated===!!d.completionCoLocated,
            'This care job differs from its exact admitted work.');
        if(registry)check(registry.simulation.commands.get(d.id)?.group===I.group,'Unknown care job consumer.');
    }
}
