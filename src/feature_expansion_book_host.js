// Native admission bridge only. Backlog stages carriers; the existing publisher saves.
import {copy, object} from './basics.js';
import {evaluateOriginalFrontierOfficeReplacement,originalFrontierOfficeRuleContract as C} from './feature_expansion_book_roster.js';
import {REPLACEMENT_IDS as I,REPLACEMENT_CONTRACT} from './backlog_expansion_replacement.js';
import {bodyNativeInputs} from './backlog_expansion_body.js';
import {simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';

const canonical=v=>v===undefined?'undefined':JSON.stringify(v,(_,value)=>object(value)?Object.fromEntries(Object.keys(value).sort().map(k=>[k,value[k]])):value);
const equal=(a,b)=>canonical(a)===canonical(b);
const without=(v,keys)=>Object.fromEntries(Object.entries(v||{}).filter(([key])=>!keys.includes(key)));
const fail=message=>{throw new Error(message);};
const status=(status,explanation)=>({status,explanation,grants:[],mutations:[],clockChanges:[]});
const staff=()=>[I.holder,I.clerk,I.witness];
const DUTY='backlog.registry.seals_owed';

/** Fresh transient proof from the actual native character, never from saved flags. */
export function readBookNativeInputs(state,{character,locationId}={}) {
    if(!character||typeof character.getTotalXP!=='function'||typeof character.getLevelableComponent!=='function')return {};
    const native=bodyNativeInputs(state,{character,locationId});
    const heroXp=character.getTotalXP(),skills=character.getLevelableComponent()?.skill_progress;
    if(!native.nativeBody||!Number.isFinite(heroXp)||heroXp<0||!object(skills)||
        Object.values(skills).some(s=>!object(s)||!Number.isFinite(s.total_xp)||s.total_xp<0))return {};
    return {...native,nativeProgression:{schema:1,sequence:state.sequence,actorId:'player',heroXp,skills:copy(skills)}};
}
export function bookNativeContext(state,context,nativeInputs) {
    return {...without(context,['nativeBody','nativeProgression']),...readBookNativeInputs(state,nativeInputs)};
}

/** Native character proof is distinct from the body currently controlled by player. */
export function qualifiedOfficeBody(state,context={}) {
    const p=state?.simulation?.people?.player,n=context.nativeBody;
    if(state?.backlog?.body?.possession?.status==='active')
        return status('blocked','Return from the controlled clay body before using your native office body.');
    if(!p||p.life!=='alive'||p.inventory!=='native'||context.nativeAlive!==true||!n||n.schema!==1||
        n.sequence!==state.sequence||n.actorId!=='player'||n.bodyId!==C.recipientBodyId||n.nativeRace!=='human'||
        n.location!==context.facts?.location||n.mobile!==true||n.hands!==2||n.intakePort!==true)
        return status('unknown','Bind the current living native body and its actual location before this comparison.');
    const b=p.body;
    if(b&&(b.id!==n.bodyId||b.ownerId!=='player'||b.controllerId!=='player'||!['human','reedling'].includes(b.form)))
        return status('blocked','The player currently controls a different or unsupported body.');
    return {...status('supported','The actual native player body is present and controlled by its owner.'),
        bodyId:b?.id||n.bodyId,ownerId:b?.ownerId||n.actorId,controllerId:b?.controllerId||n.actorId};
}

function samePeople(before,after,context) {
    return staff().every(id=>{
        const p=before.simulation.people[id],q=after.simulation.people[id],a=before.actors[id];
        return p?.definitionId===id&&p.life==='alive'&&p.location==='Village'&&a?.worldId==='base.frontier'&&
            p.body?.id===`${id}.body`&&p.body.ownerId===id&&p.body.controllerId===id&&
            !simulationOccupiesActor(before,id)&&!activePractice(a)&&
            !before.pending.some(job=>job.context?.actorId===id)&&equal(p,q);
    })&&context.actorId==='player'&&context.worldId==='base.frontier'&&context.facts?.location==='Village'&&
        context.busy!==true&&!simulationOccupiesActor(before,'player')&&equal(before.simulation.people.player,after.simulation.people.player);
}
function relationshipsRetained(before,after) {
    const a=before.simulation.relationships||{},b=after.simulation.relationships||{};
    // Only Eda's own appointment remembrance may append. Every prior axis and
    // memory must remain with its same actual observer and target.
    if(!equal(without(a,[I.holder]),without(b,[I.holder])))return false;
    const ar=a[I.holder]||{},br=b[I.holder]||{};
    if(!equal(without(ar,['player']),without(br,['player'])))return false;
    const old=ar.player||{axes:{},memories:[]},next=br.player;
    return !!next&&equal(old.axes,next.axes)&&equal(without(old,['memories','axes']),without(next,['memories','axes']))&&
        Array.isArray(old.memories)&&Array.isArray(next.memories)&&next.memories.length===old.memories.length+1&&
        equal(next.memories.slice(0,-1),old.memories)&&next.memories.at(-1).at===before.clock&&
        next.memories.at(-1).cause===`backlog:${before.sequence+1}`&&
        next.memories.at(-1).text==='I willingly appointed the visitor and transferred the same office and its two-seal duty. I remain myself.';
}
function knowledgeRetained(before,after) {
    const a=before.simulation.knowledge||{},b=after.simulation.knowledge||{};
    if(!equal(without(a,['player']),without(b,['player'])))return false;
    const old=a.player||{},next=b.player||{},key='backlog.registry.appointment';
    return !old[key]&&equal(old,without(next,[key]))&&next[key]?.stage==='seen'&&next[key].at===before.clock&&
        next[key].cause===`backlog:${before.sequence+1}`&&typeof next[key].value==='string';
}
function domainsRetained(before,after) {
    const ids=Object.keys(before.actors||{});
    if(!equal(ids.sort(),Object.keys(after.actors||{}).sort()))return false;
    return ids.every(id=>equal(without(before.actors[id],['resources','facts']),without(after.actors[id],['resources','facts']))&&
        equal(without(before.actors[id].facts,id==='player'?['ink.relay.lastResponse']:[]),without(after.actors[id].facts,id==='player'?['ink.relay.lastResponse']:[]))&&
        (id!=='player'||equal(before.actors[id].facts['ink.relay.lastResponse'],after.actors[id].facts['ink.relay.lastResponse'])||after.actors[id].facts['ink.relay.lastResponse']==='office')&&
        equal(without(before.actors[id].resources,id==='player'||id===I.holder?[DUTY]:[]),
            without(after.actors[id].resources,id==='player'||id===I.holder?[DUTY]:[])));
}
function progressionBound(before,context,plan) {
    const proof=context.nativeProgression,g=context.gameplay?.player;
    if(!proof||proof.schema!==1||proof.sequence!==before.sequence||proof.actorId!=='player'||
        !Number.isFinite(proof.heroXp)||proof.heroXp<0||!object(proof.skills)||!object(g?.skills))return false;
    if(Object.entries(proof.skills).some(([id,s])=>!Number.isFinite(s.total_xp)||s.total_xp<0||g.skills[id]?.xp!==s.total_xp))return false;
    return equal(plan.gameplay,context.gameplay)&&equal(plan.gameplayBefore,context.gameplay)&&
        (plan.nativeProgression==null||equal(plan.nativeProgression,proof));
}

/** Derived transient snapshot. Never saved as a second carrier/eligibility store. */
export function qualifiedOfficeSnapshot(before,plan,command,context={}) {
    const after=plan?.state,r=before?.backlog?.replacement,next=after?.backlog?.replacement;
    if(!object(before?.simulation)||!object(after?.simulation)||!object(before?.actors)||!object(after?.actors)||
        !r||!next||!object(r.carriers?.rightful)||!object(r.carriers?.entrant)||!object(context.gameplay)||
        !object(context.equipment)||!object(context.external)||!object(context.vitals))return null;
    const body=qualifiedOfficeBody(before,context);
    if(body.status!=='supported'||!context.nativeProgression)return null;
    const a=before.simulation,b=after.simulation,eda=before.actors[I.holder],player=before.actors.player;
    const right=a.claims?.[I.office],duty=a.claims?.[I.duty],newRight=b.claims?.[I.office],newDuty=b.claims?.[I.duty];
    if(!eda||!player||!right||!duty||!newRight||!newDuty||!r.carriers)return null;
    const actors=domainsRetained(before,after),memories=relationshipsRetained(before,after)&&knowledgeRetained(before,after);
    const stock=equal(a.owners,b.owners)&&equal(a.custody,b.custody)&&equal(plan.gameplay,context.gameplay)&&equal(plan.external,context.external);
    const equipment=equal(a.equipment,b.equipment)&&equal(plan.equipment,context.equipment);
    const sourceMastery=['powers','faculties','energies'].every(k=>equal(a[k],b[k]))&&actors;
    const bodyRetained=equal(a.people,b.people)&&equal(r.carriers,next.carriers)&&equal(plan.vitals,context.vitals);
    const xp=progressionBound(before,context,plan);
    const noNativeMutation=(!plan.native||Object.keys(plan.native).every(k=>['hpToFull','staminaToFull'].includes(k))&&
        (plan.native.hpToFull==null||plan.native.hpToFull===context.vitals.player.max_health-context.vitals.player.health)&&
        plan.native.staminaToFull===context.vitals.player.max_stamina-context.vitals.player.stamina)&&
        ['replacementEnvelope','ownership','nativePatch','nativeLocation','calendar','market','effectDurations','characterXp','heroXp','itemLog'].every(k=>plan[k]==null)&&
        !(plan.acquisitions||[]).length&&!(plan.unlocks||[]).length;
    const otherClaims=equal(without(a.claims,[I.office,I.duty]),without(b.claims,[I.office,I.duty]));
    const rightMoved=right.owner===I.holder&&newRight.owner==='player'&&right.status==='held'&&newRight.status==='held'&&
        equal(without(right,['owner','cause']),without(newRight,['owner','cause']));
    const dutyMoved=duty.owner===I.holder&&newDuty.owner==='player'&&duty.status==='held'&&newDuty.status==='held'&&
        equal(without(duty,['owner','cause']),without(newDuty,['owner','cause']));
    const conserved=eda.resources?.[DUTY]===2&&(player.resources?.[DUTY]||0)===0&&
        after.actors[I.holder].resources[DUTY]===0&&after.actors.player.resources[DUTY]===2&&dutyMoved;
    const retainedChecks={'actual actor identities':actors&&bodyRetained,'bodies and controllers':bodyRetained,
        'personal memories':memories,'personal learned mastery':sourceMastery&&xp,'original sources and fuel':sourceMastery,
        'personal goods':stock&&equipment,'personal debt':actors,'relationships and completed quests':actors&&memories&&xp};
    const retained=Object.entries(retainedChecks).filter(([,ok])=>ok).map(([label])=>label);
    const untouchedSimulation=equal(without(a,['claims','knowledge','relationships','log']),without(b,['claims','knowledge','relationships','log']));
    const allRetained=Object.values(retainedChecks).every(Boolean)&&otherClaims&&noNativeMutation&&untouchedSimulation&&
        equal(before.worlds,after.worlds)&&before.rng===after.rng&&after.clock===before.clock&&after.sequence===before.sequence+1;
    return {schema:r.schema,revision:r.revision,contractId:r.contractId,operation:REPLACEMENT_CONTRACT.operation,
        commandId:command?.id||plan.backlogCommand,worldId:before.actors.player.worldId,location:context.facts?.location,
        donorId:r.carriers.rightful.actorId,recipientId:r.carriers.entrant.actorId,officeId:I.office,dutyId:I.duty,
        donorBodyId:a.people[I.holder]?.body?.id,donorControllerId:a.people[I.holder]?.body?.controllerId,
        recipientBodyId:body.bodyId,recipientControllerId:body.controllerId,
        actual:{sameLivingParticipantsPresentAndFree:samePeople(before,after,context),
            donorOwnsActualOffice:right.owner===I.holder&&right.status==='held'&&r.officeStatus==='rightful',
            donorOwnsUnperformedDuty:duty.owner===I.holder&&duty.status==='held'&&!r.dutyPerformed,
            donorWilling:eda.facts?.['backlog.registry.willing']===true,
            recipientAcceptsDuty:(command?.id||plan.backlogCommand)===C.commandId&&next.route==='replacement'&&next.officeStatus==='appointed'&&
                next.credential?.holderId==='player'&&next.credential.officeId===I.office&&next.credential.issuerId===I.holder&&next.credential.active===true,
            exactTwoSealDutyConserved:conserved,personalCarriersRetained:allRetained},
        effects:{fromActorId:right.owner,toActorId:newRight.owner,rightId:I.office,dutyId:I.duty,
            transferred:[...(rightMoved?['institutional office right']:[]),...(dutyMoved?['accepted office duty']:[])],
            retained,borrowed:equal(a.custody,b.custody)?[]:['unqualified changed custody'],
            grants:noNativeMutation&&xp&&stock?[]:['unqualified native/source/property change'],additionalCarrierChanges:!allRetained}};
}

export function assertQualifiedOfficePlan(before,plan,command,context={}) {
    const id=command?.id||plan?.backlogCommand;
    if(id!==C.commandId&&plan?.backlogCommand!==C.commandId)return plan;
    if(id!==C.commandId||plan.backlogCommand!==C.commandId)fail('The office plan does not match its actual accepted command.');
    const body=qualifiedOfficeBody(before,context);
    if(body.status!=='supported')fail(body.explanation);
    const evaluated=evaluateOriginalFrontierOfficeReplacement(qualifiedOfficeSnapshot(before,plan,command,context));
    if(evaluated.status!=='supported')fail('The appointment cannot be qualified from its actual bodies, consent, duty and retained owners. Review the current office terms.');
    return plan;
}

/** base.commit is the actual pure Backlog staged planner, already bound to advancePlan. */
export function createQualifiedBacklogAdapter(base) {
    if(!base||['commit','preview','actions','validate','view','carrierView'].some(k=>typeof base[k]!=='function'))fail('Bind the actual Backlog planner and views.');
    function commit(before,registry,command,context,expectedSequence=before.sequence,...rest) {
        const out=base.commit(before,registry,command,context,expectedSequence,...rest);
        return assertQualifiedOfficePlan(before,out,command,context);
    }
    function preview(before,registry,id,context,packet={}) {
        const initial=base.preview(before,registry,id,context,packet);
        if(id!==C.commandId||!initial.visible||!initial.eligible)return initial;
        try {commit(before,registry,{...packet,id,sequence:before.sequence},context,before.sequence);
            return {...initial,eligible:true,reasons:[]};}
        catch(error){return {...initial,eligible:false,reasons:[error.message]};}
    }
    return {...base,commit,preview};
}
