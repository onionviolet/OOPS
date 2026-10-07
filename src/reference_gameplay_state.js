import {validateNethackFieldcraft} from './nethack_fieldcraft_facts.js';
import {validateFactorioRetortState} from './factorio_retort_host.js';
// Optional character record. The existing durable publisher owns every result.
import {assert, record, natural, stableId, copy} from './simulation_contracts.js';
import {createReferenceFeats,validateReferenceFeats,advanceReferenceFeats,referenceFeatsPresentation} from './reference_gameplay_feats.js';
import {featurePowerFacts,FEATURE_HARNESS} from './feature_expansion_powers.js';
import {validateReferenceGameplayWorkshop} from './reference_gameplay_host.js';

export const REFERENCE_ENGINE_SCHEMA = 9;
const method = 'reference_gameplay.cooling', conditionId = 'reference_gameplay.hook_cooled';
const root = state => state.referenceGameplay;
const facts = state => state.actors.player.facts;
const attemptRoot = () => ({next:1,current:null,history:[]});
const keys = (o,allowed) => assert(record(o) && Object.keys(o).every(k=>allowed.includes(k)), 'Unsupported reference gameplay fields.');
const stage = (state,context) => ({state:copy(state),external:copy(context.external||{}),gameplay:copy(context.gameplay||{}),gameplayBefore:copy(context.gameplay||{}),
    vitals:copy(context.vitals||{}),equipment:copy(context.equipment||{}),acquisitions:[],unlocks:[]});

function validateAttempts(value,state,kind) {
    keys(value,['next','current','history']);
    assert(natural(value.next) && value.next >= 1 && value.next <= 4 && Array.isArray(value.history) && value.history.length <= 3,'Invalid finite challenge attempts.');
    const entries=[...value.history,...(value.current?[value.current]:[])];
    assert(new Set(entries.map(e=>e.id)).size === entries.length && entries.length === value.next-1,'Invalid challenge receipt identities.');
    for(const e of entries) {
        keys(e,['id','kind','status','startedAt','startedSequence','sessionId','admission','endedAt','endedSequence','result','violation']);
        assert(stableId(e.id)&&e.kind===kind&&['active','completed','violated','withdrawn'].includes(e.status)&&natural(e.startedAt)&&e.startedAt<=state.clock&&
            natural(e.startedSequence)&&e.startedSequence<=state.sequence&&(e.sessionId==null||/^simulation:[1-9][0-9]*$/.test(e.sessionId)),'Invalid challenge boundary.');
        if(e.endedAt!=null)assert(natural(e.endedAt)&&e.endedAt>=e.startedAt&&e.endedAt<=state.clock&&natural(e.endedSequence)&&e.endedSequence>=e.startedSequence&&e.endedSequence<=state.sequence,'Invalid challenge settlement.');
        if(e.result!=null)assert(['won','objective','bypassed','escaped','lost','withdrawn','abandoned'].includes(e.result),'Invalid actual challenge result.');
        if(e.violation) {keys(e.violation,['sequence','at','sessionId','action','actorId','type']);assert(e.status==='violated'&&natural(e.violation.sequence)&&e.violation.sequence<=state.sequence&&natural(e.violation.at)&&e.violation.at<=state.clock&&natural(e.violation.action)&&['player','partyPartner'].includes(e.violation.actorId)&&e.violation.type==='strike'&&e.violation.sessionId===e.sessionId,'Invalid conduct violation.');}
        if(e.admission) {
            const a=e.admission;
            keys(a,['sessionId','at','sequence','coolingSourceId','sourceAcquiredAt','mastery','conditionId','conditionExpiresAt','conditionCause','helperId','helperEquipmentKey','helperSupported']);
            assert(kind==='prepared'&&a.sessionId===e.sessionId&&a.coolingSourceId===method&&natural(a.sourceAcquiredAt)&&a.sourceAcquiredAt<=a.at&&natural(a.at)&&a.at<=state.clock&&natural(a.sequence)&&a.sequence<=state.sequence&&
                a.mastery>=3&&Number.isFinite(a.mastery)&&a.conditionId===conditionId&&natural(a.conditionExpiresAt)&&a.conditionExpiresAt>a.at&&stableId(a.conditionCause)&&
                a.helperId==='partyPartner'&&a.helperEquipmentKey===FEATURE_HARNESS&&a.helperSupported===true,'Invalid actual preparation admission.');
        }
        if(kind==='prepared'&&e.status==='completed')assert(e.admission&&['won','objective'].includes(e.result),'Preparation requires a qualified successful encounter.');
        if(kind==='conduct'&&e.status==='completed')assert(!e.violation&&['won','objective','bypassed'].includes(e.result),'Conduct requires actual passage without a strike.');
    }
    assert(value.history.every(e=>e.endedAt!=null&&e.status!=='active')&&(!value.current||value.current.endedAt==null&&['active','violated'].includes(value.current.status)),'Invalid open challenge state.');
}

export function validateReferenceGameplay(state,registry) {
    const r=root(state);
    validateNethackFieldcraft(state,registry);
    validateFactorioRetortState(state,registry);
    if(r==null) {
        const s=state.simulation;
        assert(!Object.keys(facts(state)).some(k=>k.startsWith('reference.')||k.startsWith('reference_gameplay.'))&&
            !Object.values(state.actors).some(a=>a.sources?.[method])&&!Object.values(s?.powers||{}).some(p=>p[method])&&
            !s?.conditions.featureBattleHook?.[conditionId]&&!s?.jobs.some(j=>j.commandId.startsWith('reference_gameplay.')),
            'Reference gameplay activation requires its optional expansion9 receipt. Preserve the original save.');
        return;
    }
    keys(r,['schema','enrolledAt','enrolledSequence','feats','conduct','prepared','ordinary','workshop','fieldcraft','retort']);
    assert([REFERENCE_ENGINE_SCHEMA,10,11].includes(state.schema)&&r.schema===1&&state.simulation&&natural(r.enrolledAt)&&r.enrolledAt<=state.clock&&natural(r.enrolledSequence)&&r.enrolledSequence<=state.sequence,'Reference gameplay requires expansion9.');
    validateReferenceFeats(r.feats,state,registry);
    validateAttempts(r.conduct,state,'conduct'); validateAttempts(r.prepared,state,'prepared');
    validateReferenceGameplayWorkshop(r.workshop,state,registry);
    for(const kind of ['conduct','prepared'])assert((facts(state)[`reference.${kind}.completed`]===true)===r[kind].history.some(e=>e.status==='completed'),'Challenge recognition requires its actual completed receipt.');
    if(r.ordinary) {keys(r.ordinary,['at','sequence','result','sessionId']);assert(natural(r.ordinary.at)&&r.ordinary.at<=state.clock&&natural(r.ordinary.sequence)&&r.ordinary.sequence<=state.sequence&&['won','objective','bypassed','escaped','lost','withdrawn'].includes(r.ordinary.result)&&(r.ordinary.sessionId==null||stableId(r.ordinary.sessionId)),'Invalid ordinary passage receipt.');}
}

export function enrollReferenceGameplay(state,context,sequence=state.sequence) {
    assert(state.sequence===sequence&&!root(state)&&state.simulation&&context.actorId==='player'&&!context.busy&&!state.simulation.sessions.player,'This catalogue enrollment is stale or unavailable.');
    const out=stage(state,context);out.state.sequence++;out.state.schema=(state.auditRemainder||state.causalStories||state.motherOfLearning||state.proto23Village)?11:state.bookWorldCampaign?10:REFERENCE_ENGINE_SCHEMA;
    out.state.referenceGameplay={schema:1,enrolledAt:state.clock,enrolledSequence:out.state.sequence,feats:createReferenceFeats(),conduct:attemptRoot(),prepared:attemptRoot(),ordinary:null};
    return out;
}

function preparation(state,context,sessionId,sequence) {
    const s=state.simulation,p=s?.powers.player?.[method],source=state.actors.player.sources[method],faculty=s?.faculties.player?.[method],c=s?.conditions.featureBattleHook?.[conditionId];
    if(!p?.owned||p.mastery<3||!source||source.expiresAt!=null&&source.expiresAt<=state.clock||!faculty?.active||!faculty.awakened||faculty.suppressed||
        !c||c.intensity<=0||c.expiresAt<=state.clock||!featurePowerFacts(state,context)['skills.lioSupported']||s?.equipment.partyPartner?.field_frame!==FEATURE_HARNESS||
        !(s?.owners.partyPartner?.[FEATURE_HARNESS]>0)||(state.actors.partyPartner?.resources.brace_effort||0)<1||s.people.partyPartner?.vitals.stamina<1)return null;
    return {sessionId,at:state.clock,sequence,coolingSourceId:method,sourceAcquiredAt:source.acquiredAt,mastery:p.mastery,conditionId,conditionExpiresAt:c.expiresAt,conditionCause:c.cause,
        helperId:'partyPartner',helperEquipmentKey:FEATURE_HARNESS,helperSupported:true};
}

export function commitReferenceControl(state,registry,command,context,sequence=state.sequence) {
    assert(state.sequence===sequence&&context.actorId==='player','This reference action is stale.');
    if(command.action==='enroll')return enrollReferenceGameplay(state,context,sequence);
    assert(root(state),'Open your feat record first.');
    const out=stage(state,context);out.state.sequence++;
    if(command.action==='reconcile')advanceReferenceFeats(state,out,registry,context,{reconcile:true});
    else {
        const kind=command.kind;assert(['conduct','prepared'].includes(kind),'Choose a declared challenge.');
        const r=out.state.referenceGameplay[kind];
        if(command.action==='accept') {
            assert(!context.busy&&!state.simulation.sessions.player&&!state.simulation.jobs.some(j=>j.actorId==='player')&&!state.pending.some(j=>j.context.actorId==='player')&&context.facts?.location==='Village'&&
                facts(state)['feature.battle.seen']===true&&!facts(state)['feature.battle.routeCleared']&&!r.current&&r.next<=3&&!r.history.some(e=>e.status==='completed'),'This finite challenge is unavailable.');
            if(kind==='prepared')assert(out.state.referenceGameplay.workshop&&state.simulation.knowledge.player?.['reference_gameplay.offer']&&facts(state)['party.met']===true,'Hear Eda’s cooling offer and meet willing Lio before accepting this preparation goal.');
            r.current={id:`reference.${kind}:${r.next++}`,kind,status:'active',startedAt:state.clock,startedSequence:out.state.sequence,sessionId:null,admission:null};
        } else {
            assert(command.action==='withdraw'&&r.current&&command.attemptId===r.current.id,'This challenge attempt changed.');
            endAttempt(out,r,'withdrawn','abandoned');
        }
    }
    validateReferenceGameplay(out.state,registry);return out;
}

function endAttempt(out,r,status,result) {
    const e=r.current;if(!e)return;
    e.status=e.status==='violated'?'violated':status;e.result=result;e.endedAt=out.state.clock;e.endedSequence=out.state.sequence;
    r.history.push(e);r.current=null;
    if(e.status==='completed')facts(out.state)[`reference.${e.kind}.completed`]=true;
}

// Called only on an actual staged publisher plan, never from load or render.
export function advanceReferenceGameplay(before,out,registry,context) {
    const r=root(out.state);if(!r||!root(before)||out.state.sequence<=before.sequence)return;
    const session=out.state.simulation?.sessions.player,oldSession=before.simulation?.sessions.player;
    if(session?.definitionId==='feature_battle.sluice'&&session.id!==oldSession?.id) {
        if(r.conduct.current&&!r.conduct.current.sessionId)r.conduct.current.sessionId=session.id;
        if(r.prepared.current&&!r.prepared.current.sessionId) {
            const evidence=preparation(before,context,session.id,out.state.sequence);
            if(session.nativeBattle.fighters.partyPartner&&evidence){r.prepared.current.sessionId=session.id;r.prepared.current.admission=evidence;}
            else endAttempt(out,r.prepared,'withdrawn','abandoned');
        }
    }
    const action=out.referenceBattleAction,e=r.conduct.current;
    if(e&&action&&action.sessionId===e.sessionId&&['player','partyPartner'].includes(action.actorId)&&action.type==='strike') {
        e.status='violated';e.violation||={...action,sequence:out.state.sequence,at:out.state.clock};
    }
    const ended=oldSession?.definitionId==='feature_battle.sluice'&&!session;
    const bypass=(out.state.actors.player.completed['feature_battle.bypass']||0)>(before.actors.player.completed['feature_battle.bypass']||0);
    if(ended||bypass) {
        const result=bypass?'bypassed':facts(out.state)['feature.battle.lastResult'];
        assert(['won','objective','bypassed','escaped','lost','withdrawn'].includes(result),'Missing actual passage settlement.');
        r.ordinary={at:out.state.clock,sequence:out.state.sequence,result,sessionId:ended?oldSession.id:null};
        if(r.conduct.current&&(bypass||r.conduct.current.sessionId===oldSession?.id))endAttempt(out,r.conduct,['won','objective','bypassed'].includes(result)?'completed':'withdrawn',result);
        if(r.prepared.current)endAttempt(out,r.prepared,ended&&r.prepared.current.sessionId===oldSession?.id&&r.prepared.current.admission&&['won','objective'].includes(result)?'completed':'withdrawn',result);
    }
    advanceReferenceFeats(before,out,registry,context);
    validateReferenceGameplay(out.state,registry);
}

export function referenceControlPresentation(state,registry,context) {
    const r=root(state),actions=[];
    if(!r) {
        if(!state.simulation||!context.facts?.['village.elderMet']||context.facts?.location!=='Village')return {visible:false,sections:[]};
        return {visible:true,sections:[{id:'reference.feats',label:'Earned feats',description:'Keep a character record of committed accomplishments. Opening it grants no feat. Earlier basic work can be reconciled by a separate choice.',
            actions:[{id:'reference.enroll',label:'Open your feat record',command:{type:'reference_control',action:'enroll'},eligible:!context.busy&&!state.simulation.sessions.player,reasons:[]}],records:[]}]};
    }
    const available=!context.busy&&context.facts?.location==='Village'&&facts(state)['feature.battle.seen']===true&&!facts(state)['feature.battle.routeCleared']&&!state.simulation.sessions.player;
    for(const kind of ['conduct','prepared']) {
        const a=r[kind];
        if(!facts(state)['feature.battle.seen'])continue;
        if(kind==='prepared'&&!a.current&&!a.history.length&&!(r.workshop&&state.simulation.knowledge.player?.['reference_gameplay.offer']&&facts(state)['party.met']===true))continue;
        if(a.current)actions.push({id:`reference.${kind}.withdraw`,label:`Withdraw ${kind==='conduct'?'no-strike':'prepared-team'} attempt`,command:{type:'reference_control',action:'withdraw',kind,attemptId:a.current.id},eligible:!context.busy||!!state.simulation.sessions.player,reasons:[]});
        else if(a.next<=3&&!a.history.some(e=>e.status==='completed'))actions.push({id:`reference.${kind}.accept`,label:kind==='conduct'?'Accept a no-strike passage attempt':'Accept a prepared-team passage attempt',command:{type:'reference_control',action:'accept',kind},eligible:available,reasons:available?[]:['Inspect the still-held sluice and finish current work in Village first.'],description:kind==='conduct'?
            'Up to three attempts, enrolled before the route. From acceptance through passage, any player or recruited-team strike violates this attempt, including a miss. Automatic actions hold guards; you choose material preparation and gate work. Guarding, tool use, raising the gate and the drainage walk are allowed. Escape, loss or withdrawal ends without completion. Ordinary passage remains available. Recognition only; no repeat payment.':
            'Up to three attempts. Train cooling to its hook function, apply a real charged sleeve to Oren, and admit willing Lio with his owned equipped braced harness and guard effort before that field expires. Win or raise the gate with that actual prepared admission. Bypass and unprepared admission do not complete it. Recognition only; no repeat payment.'});
    }
    const rows=[];
    for(const kind of ['conduct','prepared'])for(const e of [...r[kind].history,...(r[kind].current?[r[kind].current]:[])])rows.push({id:e.id,text:`${kind==='conduct'?'No-strike':'Prepared team'} attempt: ${e.status}${e.result?` · actual result ${e.result}`:''}${e.violation?' · a committed team strike broke the conduct':''}.`});
    if(r.ordinary)rows.push({id:'reference.ordinary',text:`Most recent ordinary sluice outcome: ${r.ordinary.result}. Its actual passage and injuries keep their ordinary consequences.`});
    const view=referenceFeatsPresentation(state,registry,context);
    const sections=(view.sections||[{id:'reference.feats',label:'Earned feats',records:view.records||[],actions:[]}]).map(s=>({...s,actions:s.actions||[],records:[...(s.records||[]),...(s.rows||[]).map(r=>({id:r.id,text:`${r.label}: ${r.status}. ${r.description||''}`}))]}));
    actions.unshift({id:'reference.reconcile',label:'Reconcile earlier basic accomplishments',command:{type:'reference_control',action:'reconcile'},eligible:!context.busy,reasons:[],description:'Only retained basic completed work can be recognized. Earlier rare combinations and past conduct are never inferred.'});
    sections[0].actions.unshift(actions.shift());
    return {visible:true,sections:[...sections,...(facts(state)['feature.battle.seen']?[{id:'reference.challenges',label:'Optional passage challenges',description:'Attempt terms apply only after explicit enrollment. Feats stay with this character through field renewal.',actions,records:rows}]:[])]};
}
