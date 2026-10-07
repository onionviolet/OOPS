// Pure admission/projection of existing saved people, conditions and means.
import {BOOK_CARE_IDS as I, BOOK_CARE_CASES as C, bookCareDefinitions as D} from './book_care_content.js';
import {paradiseFacts} from './book_world_paradise_actions.js';
import {PARADISE_IDS as P} from './book_world_paradise_ids.js';
import {STATUS_CARE_IDS as B} from './status_care_content.js';
import {statusCareCondition,statusCareEnrolled} from './status_care_facts.js';
import {validateBookCareControllerState} from './book_care_runtime.js';

const check=(ok,message)=>{if(!ok)throw Error(message);};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const actorIds=['player',P.employee,P.porter];
export const BOOK_CARE_POLICY=Object.freeze({
    [I.braced]:{duration:20,actors:['player'],stats:{},description:'A real ordinary load brace permits precise kit packing while it remains active. It grants no general source compatibility.'},
    [I.strain]:{duration:18,actors:actorIds,stats:{dexterity:{multiplier:0.9},stamina_efficiency:{multiplier:0.92}},description:'Temporary load strain: native dexterity ×0.9 and stamina efficiency ×0.92. Book-world precise work waits for recovery; health spent on the work is recovered separately.'},
    [I.restored]:{duration:16,actors:[P.employee,P.porter],stats:{},description:'The consenting worker received actual supplied recovery and can attempt one supported owned-cargo handover before readiness expires.'},
});
export function bookCareCondition(state,id,actor='player') {
    const c=state.simulation?.conditions?.[actor]?.[id];
    return c&&c.intensity>0&&(c.expiresAt==null||c.expiresAt>state.clock)?c:null;
}
export function bookCareEnrolled(state) {
    const a=state.actors?.player;
    return a?.facts?.[I.prefix+'enrolled']===true&&(a.completed?.[I.hubBegin]||0)+(a.completed?.[I.goaBegin]||0)===1;
}
export function bookCareSupportedBody(state,context={}) {
    return paradiseFacts(state,context)['paradise.playerSupported']===true&&state.bookWorldCampaign?.bodyPolicy==='same_native_body';
}
export function bookCareEffectsSupported(state,context={}) {
    const p=state.simulation?.people?.player,b=p?.body,n=context.nativeBody||context.paradiseNative?.body,d=state.bookWorldCampaign;
    const world=state.actors?.player?.worldId;
    const visit=d?.visits?.find(v=>v.id===d.activeVisitId&&v.status==='active'&&v.actorId==='player');
    return bookCareEnrolled(state)&&d?.bodyPolicy==='same_native_body'&&[P.hub,P.goa].includes(world)&&visit?.endpoint?.worldId===world&&
        p?.life==='alive'&&p.inventory==='native'&&context.nativeAlive===true&&b?.id==='native.player.body'&&b.form==='human'&&
        b.ownerId==='player'&&b.controllerId==='player'&&b.hands>=2&&b.mobile===true&&n?.id===b.id&&n.form===b.form&&
        n.ownerId===b.ownerId&&n.controllerId===b.controllerId&&n.hands>=2&&n.mobile===true;
}
// This adapts only the earned grip's explicit new packing consumer. It never
// widens old care's native stat/rain projection, expiry rules or saved history.
export function bookCareCarriedBaseCareSupported(state,context={}) {
    return bookCareEnrolled(state)&&bookCareSupportedBody(state,context)&&statusCareEnrolled(state)&&
        state.actors.player.completed?.[B.grip]>0&&!!statusCareCondition(state,B.steady);
}
export function bookCareFacts(state,context={}) {
    const old=paradiseFacts(state,context),s=state.simulation,a=state.actors?.player,enrolled=bookCareEnrolled(state);
    const supported=old['paradise.playerSupported']===true&&state.bookWorldCampaign?.bodyPolicy==='same_native_body';
    const vitals=id=>context.vitals?.[id]||context.vitalsByActor?.[id]||s?.people?.[id]?.vitals;
    const p=vitals('player'),tender=[I.strain,'body.sore_hands','body.scraped_hands'].some(id=>bookCareCondition(state,id));
    const f={
        'bookCare.enrolled':enrolled,'bookCare.supportedBody':supported,'bookCare.playerTender':tender,
        'bookCare.handsUsable':supported&&!tender,'bookCare.canRush':Number.isFinite(p?.health)&&p.health>3,
        'bookCare.preciseReady':supported&&!tender&&(!!bookCareCondition(state,I.braced)||bookCareCarriedBaseCareSupported(state,context)),
        'bookCare.playerNeedsRecovery':supported&&(tender||Number.isFinite(p?.health)&&p.health<p.max_health||Number.isFinite(p?.stamina)&&p.stamina<p.max_stamina),
    };
    for(const c of C) {
        const worker=state.actors?.[c.worker],person=s?.people?.[c.worker],v=vitals(c.worker);
        f[`bookCare.playerAt.${c.slug}`]=supported&&a.worldId===c.world&&s.people.player.location===c.place;
        f[`bookCare.workerAt.${c.worker}`]=old[`paradise.support.${c.worker}`]===true&&person.location===c.place;
        f[`bookCare.workerCanInspect.${c.worker}`]=Number.isFinite(v?.health)&&v.health>3&&Number.isFinite(v?.stamina)&&v.stamina>=6;
        for(const key of ['requested','surveyDone','aidOffered','cargoDone'])f[`bookCare.${key}.${c.worker}`]=worker?.facts?.[I.prefix+key]===true;
        f[`bookCare.restored.${c.worker}`]=!!bookCareCondition(state,I.restored,c.worker)&&!bookCareCondition(state,I.strain,c.worker);
        f[`bookCare.workerNeedsRecovery.${c.worker}`]=f[`bookCare.surveyDone.${c.worker}`]&&
            (!!bookCareCondition(state,I.strain,c.worker)||Number.isFinite(v?.health)&&v.health<v.max_health||Number.isFinite(v?.stamina)&&v.stamina<v.max_stamina);
    }
    return f;
}
export function projectBookCareEffects(state,registry,context={}) {
    if(!bookCareEffectsSupported(state,context))return {};
    const out={};
    for(const [id,policy] of Object.entries(BOOK_CARE_POLICY)) {
        const record=bookCareCondition(state,id),definition=registry.simulation.conditions.get(id);
        if(!record||!definition||!policy.actors.includes('player'))continue;
        const key='simulation:'+id;
        out[key]={id:key,name:definition.label,duration:record.expiresAt==null?null:record.expiresAt-state.clock,
            description:policy.description,effects:{stats:structuredClone(policy.stats),bonus_skill_levels:{},xp_multipliers:{}},
            tags:{effect:true,...(id===I.strain?{debuff:true}:{buff:true})},affected_by_travel:true};
    }
    return out;
}

export function validateBookCareState(state,registry) {
    const s=state.simulation,definitions=new Map(D.commands.map(d=>[d.id,d]));
    const present=Object.entries(state.actors||{}).some(([,a])=>[a.facts,a.completed,a.resources,a.sources].some(b=>Object.keys(b||{}).some(k=>k.startsWith(I.prefix))))||
        Object.values(s?.knowledge||{}).some(b=>Object.keys(b).some(k=>k.startsWith(I.prefix)))||
        Object.values(s?.conditions||{}).some(b=>Object.keys(b).some(k=>k.startsWith(I.prefix)))||
        (s?.jobs||[]).some(j=>j.commandId?.startsWith(I.prefix))||Object.keys(s?.controllers||{}).some(k=>k.startsWith(I.prefix))||
        Object.keys(s?.claims||{}).some(k=>k.startsWith(I.prefix));
    if(!present)return true;
    check(!!s&&state.bookWorldCampaign?.schema===1&&state.bookWorldCampaign.bodyPolicy==='same_native_body'&&bookCareEnrolled(state),
        'Book care needs its explicit existing retained-body campaign and one deliberate enrollment.');
    check((state.actors.player.completed[I.hubBegin]||0)<=1&&(state.actors.player.completed[I.goaBegin]||0)<=1,'Book care entry cannot run twice.');
    for(const [actor,a] of Object.entries(state.actors)) {
        const facts=Object.entries(a.facts||{}).filter(([k])=>k.startsWith(I.prefix));
        const done=Object.entries(a.completed||{}).filter(([k])=>k.startsWith(I.prefix));
        const known=Object.entries(s.knowledge[actor]||{}).filter(([k])=>k.startsWith(I.prefix));
        const conditions=Object.entries(s.conditions[actor]||{}).filter(([k])=>k.startsWith(I.prefix));
        check(actorIds.includes(actor)||!facts.length&&!done.length&&!known.length&&!conditions.length,'Book care cannot invent another actor/body history.');
        check(!Object.keys(a.resources||{}).some(k=>k.startsWith(I.prefix))&&!Object.keys(a.sources||{}).some(k=>k.startsWith(I.prefix)),
            'Care has no separate resource or source entitlement.');
        if(!actorIds.includes(actor))continue;
        check(facts.every(([key,value])=>typeof value==='boolean'&&(actor==='player'?key===I.prefix+'enrolled'&&value===true:
            ['requested','surveyDone','aidOffered','cargoDone'].some(k=>key===I.prefix+k))),'Unsupported exact book-care fact.');
        check(done.every(([key,count])=>definitions.get(key)?.actorId===actor&&natural(count)&&count>0&&(!definitions.get(key).once||count===1)),
            'Invalid book-care completed work owner/count.');
        const allowedKnowledge=new Map(D.commands.flatMap(d=>d.effects.filter(e=>e.type==='knowledge'&&e.actor===actor).map(e=>[e.key,e])));
        for(const [key,r] of known) {
            const e=allowedKnowledge.get(key),m=/^simulation:([1-9][0-9]*)$/.exec(r.cause||'');
            check(e&&r.stage===e.stage&&r.value===e.value&&same(r.basis,e.basis)&&natural(r.at)&&r.at<=state.clock&&m&&Number(m[1])<=state.sequence,
                'Book-care knowledge needs its exact actually authored receipt.');
        }
        for(const [id,c] of conditions) {
            const policy=BOOK_CARE_POLICY[id];
            const sequence=/^simulation:([1-9][0-9]*)$/.exec(c.cause||'');
            check(policy?.actors.includes(actor)&&c.intensity===1&&natural(c.expiresAt)&&c.expiresAt<=state.clock+policy.duration&&
                sequence&&Number(sequence[1])<=state.sequence,'Invalid bounded book-care condition owner/duration/cause.');
        }
        check(!s.programs[actor]?.commandId?.startsWith(I.prefix),'Care commands cannot become automatic player routines.');
    }
    for(const c of C) {
        const a=state.actors[c.worker],f=a.facts,k=s.knowledge[c.worker]||{};
        const inspect=I.prefix+c.slug+'.npc.inspect',aid=I.prefix+c.slug+'.aid_worker',cargo=I.prefix+c.slug+'.npc.cargo';
        check(!f[I.prefix+'surveyDone']||a.completed[inspect]===1&&k[I.prefix+c.slug+'.own_inspection']?.stage==='understood',
            'Worker survey readiness needs their actually completed own inspection.');
        check(!f[I.prefix+'aidOffered']||f[I.prefix+'surveyDone']&&!state.actors.player.completed[aid],
            'Worker recovery consent belongs to their completed inspection and unused aid choice.');
        check(!bookCareCondition(state,I.restored,c.worker)||state.actors.player.completed[aid]===1&&f[I.prefix+'surveyDone']&&!f[I.prefix+'cargoDone'],
            'Recovered cargo readiness needs the actual supplied care and uncompleted cargo.');
        check(!f[I.prefix+'cargoDone']||a.completed[cargo]===1&&state.actors.player.completed[aid]===1&&k[I.prefix+c.slug+'.own_cargo']?.stage==='understood',
            'Completed cargo needs its actual independent job and supplied recovery.');
    }
    for(const job of s.jobs.filter(j=>j.commandId?.startsWith(I.prefix))) {
        const d=definitions.get(job.commandId),participants=[d?.actorId,...(d?.targetId?[d.targetId]:[])];
        check(d&&d.duration>0&&job.actorId===d.actorId&&job.revision===d.revision&&job.targetId===(d.targetId||null)&&
            job.reservationReturns===1&&same(job.costs,d.costs)&&same(job.effects,d.effects)&&same(job.participants,participants)&&
            job.cancellation==='refund'&&job.siteId===null&&job.claim===(d.claim||null)&&job.due<=state.clock+d.duration&&
            job.completionSupport?.schema===1&&job.completionSupport.failure==='refund'&&same(job.completionSupport.requires,d.completionRequires)&&
            job.completionSupport.coLocated===!!d.completionCoLocated&&job.completionSupport.location===d.location,
            'Book-care job differs from its exact admitted work, ownership or refund support.');
        if(registry)check(registry.simulation.commands.get(d.id)?.group===d.group,'Unknown book-care executable command.');
    }
    for(const [id,claim] of Object.entries(s.claims).filter(([id])=>id.startsWith(I.prefix))) {
        const d=D.commands.find(d=>d.claim===id),sequence=/^simulation:([1-9][0-9]*)$/.exec(claim.cause||'');
        check(d&&claim.owner===d.actorId&&['held','settled'].includes(claim.status)&&sequence&&Number(sequence[1])<=state.sequence&&
            natural(claim.at)&&claim.at<=state.clock&&(claim.status==='held'?s.jobs.some(j=>j.claim===id&&j.id===claim.cause):
                state.actors[d.actorId].completed[d.id]===1),'Book-care claims need their actual owned reservation or completed work.');
    }
    validateBookCareControllerState(state,registry);return true;
}
