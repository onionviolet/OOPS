import {WORLD_COMPLETION_LIFE_IDS as I,worldCompletionLifeDefinitions as D,worldCompletionLifeFrozenDefinition} from './world_completion_life_content.js';
import {statusCareSupportedBody} from './status_care_facts.js';
import {worldCompletionStripStamp} from './world_completion_strip.js';
const check=(ok,text)=>{if(!ok)throw new Error(text);};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function exactWorldCompletionLifeJob(state,job){
    const original=D.commands.find(d=>d.id===job?.commandId),m=job?.worldCompletionLife;
    if(!original?.duration||!m||Object.keys(m).length!==7||m.schema!==1||!natural(m.acceptedAt)||!natural(m.pausedMinutes)||
        typeof m.bodyId!=='string'||!m.bodyId||job.id!==`simulation:${job.sequence}`||!natural(job.sequence)||job.sequence<1||job.sequence>state.sequence||
        job.targetId!==(original.targetId||null)||!job.context||Object.keys(job.context).sort().join(',')!=='actorId,partyIds,targetId'||
        job.context.actorId!=='player'||job.context.targetId!==(original.targetId||null)||!Array.isArray(job.context.partyIds)||
        job.context.partyIds.some(id=>typeof id!=='string'||!state.simulation?.people?.[id]))return false;
    const measured=original.id===I.measuredLine,stamp=measured?worldCompletionStripStamp(m.stripKey):null;
    if(measured?!stamp||stamp.sampleCause!==m.sampleCause||stamp.measuredCause!==m.measuredCause||Number(stamp.productionCause.split(':')[1])>=job.sequence:
        m.sampleCause!==null||m.measuredCause!==null||m.stripKey!==null)return false;
    const d=worldCompletionLifeFrozenDefinition(original,m.stripKey);
    return job.actorId==='player'&&job.revision===1&&job.reservationReturns===1&&same(job.costs,d.costs)&&same(job.effects,d.effects)&&
        job.due===m.acceptedAt+d.duration+m.pausedMinutes&&m.acceptedAt<=state.clock&&job.cancellation==='refund'&&
        job.siteId===(d.siteId||null)&&job.claim===(d.claim||null)&&same(job.participants,d.targetId?['player',d.targetId]:['player'])&&
        same(job.completionSupport,{schema:1,requires:d.completionRequires,coLocated:!!d.completionCoLocated,location:d.location,failure:'refund'})&&
        (!d.siteId||state.simulation?.sites?.[d.siteId]?.reservations?.[job.id]==='player');
}
export function worldCompletionEnrolled(state){return state.actors?.player?.facts?.[I.prefix+'enrolled']===true&&
    state.actors.player.completed?.[I.begin]===1&&state.simulation?.schema>=5;}
export function worldCompletionLifeFacts(state,context={}){
    const f=state.actors?.player?.facts||{},known=state.simulation?.knowledge?.player||{},s=state.simulation;
    const active=worldCompletionEnrolled(state),frame=context.nativeCareFrame;
    const local=state.actors?.player?.worldId===I.world&&['Village','Shack'].includes(context.facts?.location)&&
        natural(frame?.clock)&&frame.clock<=state.clock&&natural(frame?.calendarMinute);
    const ownJobs=(s?.jobs||[]).filter(j=>j.commandId.startsWith('world.completion.')||j.commandId.startsWith('lore.'));
    const endingKnown=Object.entries(f).some(([k,v])=>k.startsWith('original_frontier.ending.')&&v===true&&known[k]);
    const maturePractice=['career.dispatchMature','career.craftMature','career.inquiryMature','career.stewardMature','explore.return','control.workday','mastery.feat']
        .some(key=>f['original_frontier.'+key]===true)||
        ((state.actors.player.completed?.['world.completion.learning.make_player']>0||state.actors?.['remainder_home.neri']?.completed?.['world.completion.learning.make_neri']>0)&&
            (state.actors.player.completed?.[I.measuredLine]>0||state.actors.player.completed?.['world.completion.materials.cover_measured']>0));
    const mature=endingKnown&&maturePractice;
    const candidate=context.worldCompletionLifeReservation,job=exactWorldCompletionLifeJob(state,candidate)?candidate:null;
    const acceptedSample=!!job&&job.commandId===I.measuredLine&&job.worldCompletionLife.bodyId===context.nativeBody?.id&&
        job.worldCompletionLife.sampleCause===context.facts?.['worldCompletion.sampleCause']&&job.worldCompletionLife.measuredCause===context.facts?.['worldCompletion.measuredCause'];
    return {'worldCompletionLife.acceptedSample':acceptedSample,'worldCompletion.enrolled':active,'worldCompletion.referenceEnrolled':state.referenceGameplay?.schema===1,
        'worldCompletion.local':local,'worldCompletion.supportedBody':statusCareSupportedBody(state,context)&&context.vitals?.player?.health>1,
        'worldCompletion.frontierMature':mature,
        'worldCompletion.obligationsFree':!ownJobs.some(j=>!['world.completion.life.public_account','world.completion.life.private_account'].includes(j.commandId))&&
            !Object.keys(s?.custody||{}).includes('lore.instrument.amber'),
        'worldCompletion.loadedSurveyKnown':f['remainder_home.specialization']==='loaded'&&
            state.actors.player.completed?.['remainder_home.survey_loaded']>0&&known['remainder_home.survey_loaded']?.stage==='seen',
        'worldCompletion.closed':f[I.prefix+'life.closed']===true};
}
export function worldCompletionKnownAccount(state){
    const prefixes=['lore.work.','lore.warning.','world.completion.lens.','world.completion.learning.','world.completion.materials.',
        'remainder.consequences.plot.','remainder_home.','original_frontier.ending.'];
    return Object.entries(state.simulation?.knowledge?.player||{}).filter(([id,r])=>prefixes.some(p=>id.startsWith(p))&&!id.startsWith('world.completion.learning.product.')&&!id.endsWith('_source')&&
        typeof r.value==='string'&&natural(r.at)&&r.at<=state.clock&&typeof r.cause==='string')
        .map(([id,r])=>({id,at:r.at,cause:r.cause,text:r.value,basis:r.basis?structuredClone(r.basis):null}));
}
export function validateWorldCompletionLifeState(state,registry){
    const a=state.actors?.player;if(!a)return;
    const facts=Object.keys(a.facts).filter(k=>k===I.prefix+'enrolled'||k.startsWith(I.prefix+'life.'));
    const done=Object.keys(a.completed).filter(k=>k===I.begin||k.startsWith(I.prefix+'life.'));
    const known=Object.entries(state.simulation?.knowledge?.player||{}).filter(([k])=>k.startsWith(I.prefix+'life.'));
    const jobs=(state.simulation?.jobs||[]).filter(j=>j.commandId===I.begin||j.commandId.startsWith(I.prefix+'life.'));
    if(!facts.length&&!done.length&&!known.length&&!jobs.length)return;
    check(worldCompletionEnrolled(state)&&state.schema===11&&state.auditRemainder?.schema===1&&state.referenceGameplay?.schema===1,
        'The connected home-world chapter needs its explicit compatible enrollment.');
    const definitions=new Map(D.commands.map(d=>[d.id,d]));
    check(facts.every(k=>[I.prefix+'enrolled',I.prefix+'life.closed',I.prefix+'life.mode',I.prefix+'life.loadedDrain',I.prefix+'life.loadedDrainApplied',I.prefix+'life.measuredLine',I.prefix+'life.measuredLineApplied'].includes(k)),'Unknown home-world closure fact.');
    check(a.facts[I.prefix+'enrolled']===true,'Invalid completion enrollment.');
    check(done.every(k=>definitions.has(k)&&natural(a.completed[k])&&a.completed[k]>0),'Unknown world completion work.');
    const publicCount=a.completed[I.public]||0,privateCount=a.completed[I.private]||0;
    check(publicCount+privateCount<=1,'This chapter has one retained closure.');
    if(a.facts[I.prefix+'life.closed'])check(publicCount+privateCount===1&&
        a.facts[I.prefix+'life.mode']===(publicCount?'public':'private')&&state.simulation.situations?.[I.situation]?.phase===a.facts[I.prefix+'life.mode'],'Closure needs its actual chosen account.');
    else check(!publicCount&&!privateCount&&state.simulation.situations?.[I.situation]?.phase==='working','A working chapter cannot claim closure.');
    check(!a.facts[I.prefix+'life.loadedDrain']||(a.completed[I.loadedDrain]||0)===1,'Drain application requires actual supported work.');
    check(!a.facts[I.prefix+'life.measuredLine']||(a.completed[I.measuredLine]||0)===1,'Measured lining requires actual supported material work.');
    const admitted=new Set(D.commands.flatMap(d=>d.effects.filter(e=>e.type==='knowledge').map(e=>e.key)));
    check(known.every(([k,r])=>admitted.has(k)&&r.stage==='seen'&&natural(r.at)&&r.at<=state.clock&&typeof r.value==='string'&&typeof r.cause==='string'),'Unsupported closure account.');
    for(const j of jobs){const d=definitions.get(j.commandId);
        check(exactWorldCompletionLifeJob(state,j),
            'This chapter job differs from the exact accepted work.');
        if(registry)check(registry.simulation.commands.get(d.id)?.group===I.group,'Missing world completion consumer.');
    }
    check(!state.simulation?.programs?.player?.commandId?.startsWith(I.prefix),'No automatic completion program is admitted.');
}
