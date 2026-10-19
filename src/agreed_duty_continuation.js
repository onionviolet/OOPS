// Proposed, finite post-duty continuation. The root integration owns the
// valid-receipt facts, truthful cancellation/support-loss accounts and wiring.
import {all, deepFreezeUnlessFrozen as deepFreeze, eq, sameJson as same} from './basics.js';
import {SOCIETY_IDS as S, SOCIETY_ITEMS} from './feature_expansion_society.js';
import {assert,natural,record} from './simulation_contracts.js';

const P = S.prefix, W = S.world, H = S.household, O = S.craftsperson;
const LOG = SOCIETY_ITEMS.wood, KIT = SOCIETY_ITEMS.kit;

const wf = (key, value) => ({type: 'world', worldId: W, key: `${P}.${key}`, value});
const knowledge = (key, value) => ({type: 'knowledge', actor: 'player', key: `${P}.duty.continuation.${key}`,
    stage: 'seen', value, basis: {kind: 'observation', attributedTo: 'player', situationId: `${P}.home_agreement`}});
const item = (actor, key, amount, reservationReturn = false) => ({type: 'item', actor, key, amount,
    ...(reservationReturn ? {reservationReturn: true} : {})});
const coin = (actor, amount) => ({type: 'resource', actor, key: 'coins', amount});
const money = amount => ({type: 'resource', actor: 'player', key: 'money', native: true, amount});
const stamina = (actor, amount) => ({type: 'vital', actor, key: 'stamina', amount});
const resource = (actor, key, amount) => ({type: 'resource', actor, key, amount});

const local = eq('society.clockSupported', true, 'The household cannot meet while you are away from the supported local clock.');
const kept = eq('society.dutyContinuationKept');
const interrupted = eq('society.dutyContinuationInterrupted');
const open = eq('society.dutyContinuationOpen');
const benchHeldByOrr = eq(`claim.${S.benchRight}.owner`, O);
const playerHealthy = {fact: 'vital.health', op: 'gte', value: 2};
const continuationCapability = eq('society.dutyContinuationCapability');
const playerBody = eq('society.dutyContinuationBody');
const completionSupport = all(local, eq('society.orrSupported'), continuationCapability,
    playerBody, eq('society.handsUsable'), playerHealthy, benchHeldByOrr);

export const AGREED_DUTY_CONTINUATION_IDS = Object.freeze({
    sponsored: `${P}.duty.continuation_sponsored`,
    paid: `${P}.duty.continuation_paid`,
    decline: `${P}.duty.continuation_decline`,
    closedFact: `${P}.duty.continuationClosed`,
});

const sponsored = {
    id: AGREED_DUTY_CONTINUATION_IDS.sponsored, revision: 1, group: 'feature_society', worldId: W,
    actorId: 'player', location: 'Village', label: 'Accept Hessa’s sponsored survey-kit workshop · 3 minutes',
    description: 'After the kept duty, Hessa offers one coin for Orr to guide your workshop. Supply your own log. Orr uses his counted kit and ordinary sound join at his permitted bench. Reserve one stamina each, one of Orr’s attention, your log, Hessa’s coin and Orr’s kit for three played minutes. Completion pays Orr, returns his kit and gives you one prepared survey kit. Cancellation or lost support returns the reserved inputs. Hessa’s household log stays available for Vale’s shelf. This grants no learned method. Clicking accepts these terms.',
    targetId: H, coLocated: true, participantsCoLocated: true, participants: [H, O], siteId: S.bench, duration: 3,
    visibleWhen: all(kept, open), requires: all(kept, open, local, eq('society.orrSupported'), continuationCapability,
        playerBody, eq('society.handsUsable'), playerHealthy, benchHeldByOrr),
    costs: [item('player', LOG, -1), coin(H, -1), item(O, KIT, -1), resource(O, 'attention', -1), stamina(O, -1), stamina('player', -1)],
    cancellation: 'refund', completionRequires: completionSupport, completionCoLocated: true, completionFailure: 'refund',
    effects: [item(O, KIT, 1, true), coin(O, 1), item('player', KIT, 1),
        wf('duty.continuationClosed', true),
        knowledge('result', 'Completed the sponsored guided survey-kit workshop. The player supplied the log; Hessa supplied the coin. Orr returned his counted kit and earned the coin. One finished survey kit entered your inventory. Hessa’s household log remains. No method or mastery was granted.')],
};

const paid = {
    id: AGREED_DUTY_CONTINUATION_IDS.paid, revision: 1, group: 'feature_society', worldId: W,
    actorId: 'player', location: 'Village', label: 'Accept Orr’s paid survey-kit workshop · 1 log · 1 coin · 3 minutes',
    description: 'After the verified cancelled, stopped or refused duty, Orr offers this separate personal workshop. It uses your actual log and one native coin, Orr’s actual prepared kit and ordinary sound join, your one stamina, Orr’s one stamina and one attention. On completion, Orr receives your coin, his kit returns to him, and one actual prepared survey kit goes to your native inventory. No lesson, source, power or mastery is granted. Clicking accepts these exact terms.',
    targetId: O, coLocated: true, participantsCoLocated: true, participants: [O], siteId: S.bench, duration: 3,
    visibleWhen: all(interrupted, open), requires: all(interrupted, open, local, eq('society.orrSupported'), continuationCapability,
        playerBody, eq('society.handsUsable'), playerHealthy, benchHeldByOrr),
    costs: [item('player', LOG, -1), money(-1), item(O, KIT, -1), resource(O, 'attention', -1), stamina(O, -1), stamina('player', -1)],
    cancellation: 'refund', completionRequires: completionSupport, completionCoLocated: true, completionFailure: 'refund',
    effects: [item(O, KIT, 1, true), coin(O, 1), item('player', KIT, 1),
        wf('duty.continuationClosed', true),
        knowledge('result', 'Completed Orr’s paid personal survey-kit workshop. The player supplied an actual log and native coin; Orr returned his counted kit and earned the coin. One finished survey kit entered the player’s native inventory. No method or mastery was granted.')],
};

const decline = {
    id: AGREED_DUTY_CONTINUATION_IDS.decline, revision: 1, group: 'feature_society', worldId: W,
    actorId: 'player', location: 'Village', label: 'Decline the later workshop offer · no cost',
    description: 'Close only the optional later survey-kit continuation. This is immediate and spends no time or resources; it adds no punishment and does not change the earlier duty or its account.',
    visibleWhen: all({any: [kept, interrupted]}, open),
    requires: all({any: [kept, interrupted]}, open, local), costs: [],
    effects: [wf('duty.continuationClosed', true),
        knowledge('declined', 'Declined the optional later survey-kit continuation. No time, resources or earlier lawful result changed.')],
};


export const agreedDutyContinuationDefinitions = deepFreeze({commands: [sponsored, paid, decline]});

export function stampAgreedDutyContinuationJob(state,job){
    if(![sponsored.id,paid.id].includes(job.commandId))return;
    job.dutyContinuationTerms={schema:1,acceptedAt:state.clock,
        priorCause:state.simulation.knowledge.player[`${P}.duty.result`].cause};
}

const sequence=id=>{const match=/^(?:simulation|cancel|unsupported):([1-9][0-9]*)$/.exec(id||'');return match?Number(match[1]):NaN;};
export function continuationAccountValue(job,status,priorCause){
    return JSON.stringify({schema:1,status,commandId:job.commandId,jobId:job.id,priorCause,acceptedAt:job.dutyContinuationTerms.acceptedAt,
        note:status === 'completed' ? 'The later agreed workshop completed with its actual supplied means and native kit.'
            : `The later agreed workshop was ${status}; its reserved inputs returned, with no kit or wage awarded.`});
}

// This finite consumer binds its own restored promises. It does not widen the
// generic save validator or reinterpret any original duty revision/receipt.
export function validateAgreedDutyContinuationState(state,priorValid){
    const s=state.simulation;if(!s)return true;
    const closed=state.worlds?.[W]?.facts?.[AGREED_DUTY_CONTINUATION_IDS.closedFact];
    assert(closed==null||typeof closed==='boolean','Unsupported later-workshop closure.');
    const work=[sponsored,paid],ids=work.map(d=>d.id),prior=s.knowledge?.player?.[`${P}.duty.result`];
    const jobs=s.jobs.filter(j=>ids.includes(j.commandId));
    const completed=work.filter(d=>state.actors.player.completed[d.id]);
    const declined=state.actors.player.completed[decline.id]||0;
    const accounts=Object.entries(s.knowledge?.player||{}).filter(([k])=>k.startsWith(`${P}.duty.continuation.account.`));
    const output=s.knowledge?.player?.[`${P}.duty.continuation.result`],refusal=s.knowledge?.player?.[`${P}.duty.continuation.declined`];
    const touched=jobs.length||completed.length||declined||accounts.length||output||refusal||closed===true;
    if(!touched)return true;
    assert(priorValid,'Later workshop lacks its legitimate previous duty outcome.');
    const previous=JSON.parse(prior.value),expected=previous.status==='kept'?sponsored:paid;
    assert(jobs.length<=1&&completed.length<=1&&!(completed.length&&declined),'Conflicting later workshop commitments.');
    assert(completed.every(d=>d.id===expected.id&&state.actors.player.completed[d.id]===1)&&declined<=1,'Unsupported later workshop completion.');
    for(const job of jobs){
        const d=expected,n=sequence(job.id),terms=job.dutyContinuationTerms,support={schema:1,requires:d.completionRequires,coLocated:true,location:'Village',failure:'refund'};
        assert(job.commandId===d.id&&job.revision===1&&job.actorId==='player'&&job.targetId===d.targetId&&
            natural(n)&&n>0&&n<=state.sequence&&job.sequence===n&&record(terms)&&terms.schema===1&&
            same(Object.keys(terms).sort(),['acceptedAt','priorCause','schema'])&&terms.priorCause===prior.cause&&
            natural(terms.acceptedAt)&&terms.acceptedAt>=prior.at&&terms.acceptedAt<=state.clock&&job.due===terms.acceptedAt+d.duration&&
            sequence(prior.cause)<n&&job.cancellation==='refund'&&job.siteId===S.bench&&job.claim==null&&
            job.reservationReturns===1&&job.roll===null&&job.outcomeId===null&&same(job.costs,d.costs)&&same(job.effects,d.effects)&&
            same(job.completionSupport,support)&&same(job.participants,['player',...d.participants])&&record(job.context)&&
            same(Object.keys(job.context).sort(),['actorId','partyIds','targetId'])&&job.context.actorId==='player'&&job.context.targetId===d.targetId&&
            Array.isArray(job.context.partyIds)&&new Set(job.context.partyIds).size===job.context.partyIds.length&&
            s.sites[S.bench]?.reservations[job.id]==='player'&&!closed&&!completed.length&&!declined,
        'The later workshop lost its exact frozen terms or reservation.');
    }
    let successes=0;
    for(const [key,r] of accounts){
        let data;try{data=JSON.parse(r.value);}catch{assert(false,'Malformed later workshop account.');}
        const n=sequence(data.jobId),cause=sequence(r.cause);
        assert(record(data)&&data.schema===1&&['completed','cancelled','stopped'].includes(data.status)&&data.commandId===expected.id&&
            data.priorCause===prior.cause&&key===`${P}.duty.continuation.account.${n}`&&natural(n)&&n>sequence(prior.cause)&&
            natural(cause)&&cause>=n&&cause<=state.sequence&&natural(r.at)&&r.at>=prior.at&&r.at<=state.clock&&
            r.stage==='seen'&&same(Object.keys(r).sort(),['at','basis','cause','stage','value'])&&
            same(r.basis,{kind:'observation',attributedTo:'player',situationId:`${P}.home_agreement`})&&
            natural(data.acceptedAt)&&data.acceptedAt>=prior.at&&data.acceptedAt<=r.at&&
            r.value===continuationAccountValue({commandId:data.commandId,id:data.jobId,dutyContinuationTerms:{acceptedAt:data.acceptedAt}},data.status,prior.cause)&&
            !jobs.some(j=>j.id===data.jobId),'Unsupported later workshop account or cause.');
        if(data.status==='completed'){
            successes++;
            assert(r.cause===data.jobId&&completed.length===1&&output?.cause===data.jobId&&r.at===data.acceptedAt+expected.duration,'Unmatched later workshop settlement.');
        }else assert(r.cause.startsWith(data.status==='cancelled'?'cancel:':'unsupported:')&&cause>n,'Unsupported later workshop interruption cause.');
    }
    assert(successes===completed.length&&closed===(!!completed.length||!!declined)||
        !closed&&!completed.length&&!declined&&successes===0,'Later workshop closure contradicts its settlement.');
    const checkReceipt=(r,d,key)=>{
        const effect=d.effects.find(e=>e.type==='knowledge'&&e.key===key),n=sequence(r?.cause);
        assert(r?.stage==='seen'&&r.value===effect?.value&&natural(n)&&n>sequence(prior.cause)&&n<=state.sequence&&
            r.cause.startsWith('simulation:')&&natural(r.at)&&r.at>=prior.at&&r.at<=state.clock&&same(r.basis,effect.basis),
        'Later workshop result or refusal lost its actual committed cause.');
    };
    if(output){assert(completed.length===1,'Workshop output without settlement.');checkReceipt(output,expected,`${P}.duty.continuation.result`);}
    if(refusal){assert(declined===1&&!output,'Workshop refusal conflicts with output.');checkReceipt(refusal,decline,`${P}.duty.continuation.declined`);}
    assert(!declined||!!refusal,'Workshop refusal lacks its account.');
    return true;
}
