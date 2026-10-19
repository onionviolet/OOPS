import {fnv1a, xorshift32} from './hash_rng.js';
import {check, copy, natural, object} from './basics.js';
import {validateCausalStoryJob} from './world_completion_causal_job_validation.js';
export {validateCausalStoryJob};
// Original causal cases use the existing native owners and one durable caller.
// This module stages plans. It never writes storage, publishes native owners,
// advances an offline clock, or infers protection from a predicted power level.
import {CAUSAL_STORY_ENGINE_SCHEMA, CAUSAL_STORY_DEFINITION_REVISION,
    CAUSAL_STORY_WORLD as WORLD, CAUSAL_STORY_LOCATION as LOCATION,
    CAUSAL_STORY_PEOPLE as P, CAUSAL_STORY_PROOFS as PROOFS,
    CAUSAL_STORY_PROFILES as PROFILES, CAUSAL_STORY_SOURCES as SOURCES,
    CAUSAL_STORY_ITEMS as ITEMS, CAUSAL_STORY_LIMITS as LIMITS,
    causalStoryPersonIds, causalStoryId} from './causal_story_ids.js';
import {causalStoryDefinitions, causalStoryFacts, causalStorySeedEffects,
    CAUSAL_STORY_NATIVE_PEOPLE, CAUSAL_STORY_MEETING_ID} from './causal_story_content.js';
import {createCausalStoryState, beginCausalStoryProof, validateCausalStories,
    appendCausalStoryReceipt, resolveCausalProtection, resolveCausalStrike,
    evaluateCausalClosure, stageCausalClosure, causalStoryOccupiesActor} from './causal_story_core.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand,
    cancelSimulationJob, simulationOccupiesActor, waitingSimulationChoice} from './simulation.js';
import {applySimulationEffects, refundCosts, simulationFacts} from './simulation_effects.js';
import {meets, validateSimulationState} from './simulation_contracts.js';
import {activePractice} from './techniques.js';
import {projectVillageScene} from './causal_story_scenes.js';

const person=(state,id)=>state.simulation?.people?.[id];
const flag=(state,id,p,key)=>state.actors?.[id]?.facts?.[causalStoryId(p,key)]===true;
const known=(state,id,p,key)=>state.simulation?.knowledge?.[id]?.[causalStoryId(p,key)];
const proofOf=id=>PROOFS.find(p=>typeof id==='string' && id.startsWith(`causal.story.${p}.`));
const isCausalJob=(job,registry)=>['causal_story','causal_story_npc'].includes(registry.simulation.commands.get(job.commandId)?.group);
const base=(state,context)=>({state:copy(state),external:copy(context.external||{}),gameplay:copy(context.gameplay||{}),
    gameplayBefore:copy(context.gameplay||{}),vitals:copy(context.vitals||{}),equipment:copy(context.equipment||{}),acquisitions:[],unlocks:[]});
const cause=plan=>`causal.story:${++plan.state.sequence}`;
const effectFlag=(p,key,actor,value=true)=>({type:'fact',scope:'actor',actor,key:causalStoryId(p,key),value});
const knowledge=(p,key,actor,value,attributedTo,stage='seen',kind='observation')=>({type:'knowledge',actor,key:causalStoryId(p,key),stage,value,
    basis:{kind,attributedTo,situationId:causalStoryId(p,'situation')}});
const apply=(plan,effects,registry,context,id,spending=false)=>applySimulationEffects(plan,effects,
    {...context,external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals,equipment:plan.equipment},registry,id,{spending});
function receipt(plan,p,kind,id,actorId,targetId,result,evidence) {
    appendCausalStoryReceipt(plan,{cause:id,sequence:plan.state.sequence,at:plan.state.clock,proofId:p,kind,actorId,targetId,result,
        ...(evidence?.length?{evidence}: {})});
    plan.state.causalStories.proofs[p].lastResult={kind,cause:id};
}
function log(plan,text,id,audience=['player']) {
    const rows=plan.state.simulation.log;
    rows.push({at:plan.state.clock,text,cause:id,audience:[...audience]});
    plan.state.simulation.log=rows.slice(-LIMITS.publicLog);
}
function room(state,p,recovery=false) {
    const rows=state.causalStories?.receipts||[];
    return rows.length<(recovery?LIMITS.receipts:LIMITS.receipts-LIMITS.reservedClosure*PROOFS.length) &&
        rows.filter(r=>r.proofId===p).length<(recovery?LIMITS.perProof:LIMITS.perProof-LIMITS.reservedClosure);
}

/** Fresh facts are recomputed from staged owners, never from remembered UI text. */
export function causalStoryContext(state, context={}) {
    const actorId=context.actorId||'player', actor=person(state,actorId);
    const location=actorId==='player' ? context.facts?.location||context.causalStoryNative?.currentLocation||actor?.location : actor?.location;
    const vitalOwners=object(context.vitals?.[actorId])?context.vitals:context.vitalsByActor||
        (Number.isFinite(context.vitals?.health)?{[actorId]:context.vitals}:{});
    const current={...context,actorId,facts:{...context.facts,location},vitals:context.vitals||vitalOwners,vitalsByActor:vitalOwners};
    current.facts={...current.facts,...causalStoryFacts(state,current)};
    return current;
}
/** Feed all five actor contexts to the existing controller/completion runner. */
export function causalStorySimulationContexts(state,contexts={}) {
    const out={...contexts}, player=contexts.player||{};
    if(!state.causalStories) return out;
    const vitalOwners=player.vitalsByActor||Object.fromEntries(Object.entries(contexts).filter(([,c])=>Number.isFinite(c.vitals?.health)).map(([id,c])=>[id,c.vitals]));
    for(const id of ['player',...causalStoryPersonIds]) out[id]=causalStoryContext(state,{...player,...contexts[id],actorId:id,vitalsByActor:vitalOwners,
        busy:id==='player'?!!player.busy:false,
        facts:{...player.facts,...contexts[id]?.facts,location:id==='player'?
            player.facts?.location||person(state,id)?.location:person(state,id)?.location}});
    return out;
}
function planContexts(plan,contexts) {
    return causalStorySimulationContexts(plan.state,Object.fromEntries(Object.entries(contexts||{}).map(([id,c])=>[id,{...c,
        external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals,vitalsByActor:plan.vitals,equipment:plan.equipment}])));
}
function token(state,context,id,jobId=null) {
    // Hash private admission support into an opaque quote; do not display it.
    const value=JSON.stringify([id,jobId,state.sequence,state.clock,state.causalStories,context.causalStoryNative,
        context.external,context.gameplay,context.vitals,context.equipment,state.simulation?.jobs,state.simulation?.claims,
        state.simulation?.knowledge,state.actors,state.pending,context.busy]);
    const n=fnv1a(2166136261,value);
    return `c${n.toString(16).padStart(8,'0')}`;
}
function localReasons(state,context,enrollment=false) {
    const reasons=[], n=context.causalStoryNative, b=n?.body;
    if(n?.bound!==true || !object(n.fighters?.player?.stats)) reasons.push('The current native body and owners are unavailable.');
    if(context.nativeAlive!==true || b?.id!=='native.player.body' || b?.ownerId!=='player' || b?.controllerId!=='player' || b?.form!=='human' || !Number.isSafeInteger(b.hands) || b.hands<2 || b.mobile!==true)
        reasons.push('This work needs your current living mobile human body and both hands.');
    if(state.actors?.player?.worldId!==WORLD || (context.facts?.location||n?.currentLocation)!==LOCATION)
        reasons.push('Meet these residents in the Village.');
    if(n?.localAvailable!==true) reasons.push('The current Village is unavailable.');
    if(context.busy || state.pending?.some(j=>j.context?.actorId==='player') || activePractice(state.actors?.player) ||
        state.simulation && simulationOccupiesActor(state,'player') || state.chronicle?.session || state.chronicle?.life?.endedAt!=null ||
        state.simulation && waitingSimulationChoice(state)) reasons.push('Finish your current activity or encounter first.');
    if(!enrollment && (!state.causalStories || n?.revision!==state.causalStories.nativeRevision || n?.revision<=0))
        reasons.push('The current enrolled native owner is unavailable.');
    return reasons;
}
const costText=costs=>costs.map(e=>e.type==='item' ? `${-e.amount} ${JSON.parse(e.key).id}` :
    e.type==='vital'?`${-e.amount} ${e.key}${e.actor!=='player'?` from ${e.actor===P.keeper?'Nell':PROFILES[proofOf(e.actor)]?.name||'the participant'}`:''}`:
    e.type==='resource'?`${-e.amount} ${e.native?'coins':e.key.split('.').at(-1)}${e.actor!=='player'?' from the consenting participant':''}`:'Reserved current means');
function admittedRow(state,context,id,label,reasons,costs=[],duration=0,extra={}) {
    return {id,label,visible:true,eligible:reasons.length===0,reasons,costs,duration,...extra,
        command:{type:'causal_story',id,sequence:state.sequence,token:token(state,context,id,extra.jobId),...(extra.jobId?{jobId:extra.jobId}:{})}};
}

/** Public quotes. Generic simulation dispatch must route CSE through this host. */
export function previewCausalStoryCommand(state,registry,id,rawContext={},request={}) {
    const context=causalStoryContext(state,{...rawContext,actorId:'player'}), enrollment=id==='causal.story.enroll';
    const reasons=localReasons(state,context,enrollment), p=proofOf(id), proof=state.causalStories?.proofs?.[p], lead=p?P[p]:null;
    if(enrollment) {
        if(state.causalStories || context.causalStoryNative?.revision!==0) reasons.push('These residents are already enrolled.');
        return admittedRow(state,context,id,'Meet the three Village couriers',reasons,[],0);
    }
    if(!state.causalStories) return admittedRow(state,context,id,'Meet these residents first',reasons,[],0,{visible:false});
    if(id==='causal.story.cancel') {
        const job=state.simulation.jobs.find(j=>j.id===request.jobId && j.actorId==='player' && isCausalJob(j,registry));
        if(!job || job.cancellation==='none') reasons.push('Choose your actual cancellable work.');
        // A held player job makes ordinary action admission busy, but permits
        // its exact cancellation. Location/body/capture ownership still apply.
        const cancelReasons=reasons.filter(r=>r!=='Finish your current activity or encounter first.');
        return admittedRow(state,context,id,'Cancel this accepted work',cancelReasons,[],0,{jobId:request.jobId,
            cancellation:job?.cancellation||'none'});
    }
    check(p,'Unknown original causal command.');
    if(id===causalStoryId(p,'begin')) {
        if(proof) reasons.push('This particular delivery has already begun.');
        if(person(state,lead)?.life!=='alive' || !context.facts[`causal.person.${lead}.free`] || !context.facts[`causal.person.${P.keeper}.free`])
            reasons.push('Meet the free living courier and Nell first.');
        return admittedRow(state,context,id,`Hear ${PROFILES[p].name}'s actual delivery terms`,reasons,[],0);
    }
    if(!proof) reasons.push('Hear this courier’s actual terms first.');
    if(proof && !room(state,p,['release','report'].some(a=>id===causalStoryId(p,a)))) reasons.push('This case’s retained account is full; its recorded outcome remains available.');
    const d=registry.simulation.commands.get(id===causalStoryId(p,'sever')?causalStoryId(p,'sever_job'):id);
    if(d?.group==='causal_story' && d.actorId==='player' && id!==causalStoryId(p,'sever_job')) {
        // A disabled counter quote can still disclose an undiscovered source.
        // Admission support and what the player has learned are separate gates.
        const counterKnown=id!==causalStoryId(p,'sever') ||
            !!known(state,'player',p,'method') && !!known(state,'player',p,'authorization');
        if(reasons.length) return admittedRow(state,context,id,d.label,reasons,costText(d.costs||[]),d.duration||0,
            {visible:counterKnown && (!d.visibleWhen||meets(d.visibleWhen,simulationFacts(state,context,registry)))});
        const c=causalStoryContext(state,{...context,targetId:d.targetId||null,
            facts:{...context.facts,'causal.hostSeverJob':id===causalStoryId(p,'sever')}});
        const q=previewSimulationCommand(state,registry,d.id,c);
        return admittedRow(state,c,id,d.label,q.reasons,costText(q.costs.length?q.costs:d.costs||[]),q.duration,{visible:q.visible&&counterKnown});
    }
    const manual=['strike','subdue','capture','release','release_source','withdraw','report'];
    check(manual.some(a=>id===causalStoryId(p,a)),'Unknown original causal command.');
    const action=manual.find(a=>id===causalStoryId(p,a)), target=person(state,lead);
    if(proof && action!=='withdraw' && (!target || target.location!==LOCATION || state.actors[lead].worldId!==WORLD)) reasons.push('Meet the actual named courier here.');
    if(['strike','subdue'].includes(action)) {
        if(!['alive','incapacitated'].includes(target?.life) || target?.life==='incapacitated' && proof?.restraint?.captorId!=='player') reasons.push('The actual target is unavailable.');
        if((context.vitals?.player?.stamina??-1)<2) reasons.push('You need 2 current stamina.');
        if(!context.causalStoryNative?.fighters?.[lead]) reasons.push('The actual target’s native combat owner is unavailable.');
    }
    if(action==='capture') {
        if(target?.life!=='incapacitated' || proof?.restraint) reasons.push('First subdue this actual unheld courier.');
        if((context.gameplay?.player?.inventory?.[ITEMS.rope]||0)<1 || Object.values(state.simulation.custody).some(c=>c.holder==='player'&&c.key===ITEMS.rope) ||
            Object.values(context.equipment?.player||{}).includes(ITEMS.rope)) reasons.push('You need your own unequipped Survey rope.');
    }
    if(action==='release' && (target?.life!=='incapacitated' || proof?.restraint && proof.restraint.captorId!=='player' ||
        !proof?.restraint && !state.causalStories.receipts.some(r=>r.proofId===p && r.kind==='strike' && r.actorId==='player' && r.result?.intent==='nonlethal')))
        reasons.push('This is not the current living body you restrained or subdued.');
    if(action==='release_source' && (p==='mortal' || proof?.protection!=='intact' || !context.facts[`causal.proof.${p}.leadAuthorized`] ||
        !context.facts[`causal.proof.${p}.consentAvailable`] || !context.facts[`causal.proof.${p}.canSever`] ||
        !known(state,'player',p,'release_consent'))) reasons.push('The current learned procedure, Nell’s authorization and the courier’s actual consent are required.');
    if(action==='withdraw' && (proof?.phase!=='open' || known(state,'player',p,'withdrawal'))) reasons.push('You have already withdrawn or this delivery has ended.');
    if(action==='report') {
        if(!proof?.closure || known(state,'player',p,'closure')) reasons.push('There is no new retained delivery account to hear.');
        if(!context.facts[`causal.person.${P.keeper}.free`] || !known(state,P.keeper,p,'terms') ||
            !known(state,P.keeper,p,'delivery') && !(state.clock>=proof?.deadline && target?.location===LOCATION))
            reasons.push('Meet Nell with her actual received delivery or current on-scene deadline account.');
    }
    const labels={strike:`Strike ${PROFILES[p].name} with lethal intent · 2 stamina`,subdue:`Subdue ${PROFILES[p].name} · 2 stamina`,
        capture:`Restrain ${PROFILES[p].name} with your Survey rope`,release:`Release ${PROFILES[p].name} and recover your rope`,
        release_source:`Complete ${PROFILES[p].name}'s consented source release`,withdraw:'Withdraw your optional help',report:'Hear Nell’s retained delivery account'};
    return admittedRow(state,context,id,labels[action],reasons,action==='strike'||action==='subdue'?['2 stamina']:action==='capture'?['1 owned Survey rope held in custody']:[],0,
        {visible:action!=='release_source'||!!known(state,'player',p,'release_consent')});
}

function attach(plan,registry,context,id) {
    const state=plan.state,s=state.simulation;
    s.schema=Math.max(s.schema,4);
    const b=context.causalStoryNative.body,current=s.people.player.body;
    check(!current || ['id','ownerId','controllerId','form','hands','mobile'].every(key=>
        !Object.hasOwn(current,key)||current[key]===b[key]),
        'The current native body already has a different owner or explicit incompatible capabilities.');
    // Existing earned physical marks remain on this same actual native body.
    s.people.player.body={...copy(current||{}),...copy(b)};s.people.player.location=LOCATION;
    for(const d of causalStoryDefinitions.people) {
        check(registry.simulation.people.has(d.id) && !state.actors[d.id] && !s.people[d.id],'Causal actor registration is missing or owned elsewhere.');
        state.actors[d.id]={facts:{},resources:copy(d.resources),completed:{},sources:{},techniques:{},worldId:d.worldId};
        s.people[d.id]={life:'alive',inventory:'native',location:d.location,bornAt:state.clock,definitionId:d.id,
            definitionRevision:d.revision,body:copy(d.body),vitals:copy(d.vitals)};
        const seed=CAUSAL_STORY_NATIVE_PEOPLE[d.id];
        plan.gameplay[d.id]={inventory:copy(seed.inventory),skills:copy(seed.skills),reputation:copy(seed.reputation)};
        plan.vitals[d.id]=copy(d.vitals);plan.equipment[d.id]=copy(seed.equipment);(s.equipment||={})[d.id]=copy(seed.equipment);
    }
    for(const d of causalStoryDefinitions.sites) s.sites[d.id]||={capacity:d.capacity,reservations:{}};
    for(const d of causalStoryDefinitions.controllers) s.controllers[d.id]={actorId:d.actorId,due:state.clock+d.interval,interval:d.interval};
    // Schema4 needs an actual caused situation even before a courier's terms
    // are heard. This meeting records enrollment without starting any deadline.
    apply(plan,[{type:'situation',actor:'player',situationId:CAUSAL_STORY_MEETING_ID,operation:'begin'}],registry,context,id);
    apply(plan,causalStorySeedEffects,registry,context,id);
    plan.causalStoryActivation=true;
}
function begin(plan,p,registry,context,id) {
    beginCausalStoryProof(plan,p,id);
    const name=PROFILES[p].name, text=`${name} owns a separate kit, rope, purse and body and intends to deliver the kit to Nell. This delivery has 36 played minutes from this meeting. Their funded work may continue while you do other supported played activity. No browser-closed time advances this case. Optional help creates no delivery debt. Their survival and this delivery are separate outcomes.`;
    apply(plan,[{type:'situation',actor:'player',situationId:causalStoryId(p,'situation'),operation:'begin'},
        effectFlag(p,'noticed',P[p]),effectFlag(p,'accepted',P[p]),
        ...['player',P[p],P.keeper].map(actor=>knowledge(p,'terms',actor,text,P[p],'understood','instruction'))],registry,context,id);
    log(plan,text,id);
}
function draw(plan) {
    const n=xorshift32(plan.state.simulation.seed);plan.state.simulation.seed=n;
    return n/0x100000000;
}
function returnRestraint(plan,p,registry,context,id) {
    const proof=plan.state.causalStories.proofs[p], r=proof.restraint;
    if(!r) return;
    apply(plan,[{type:'custody',actor:r.captorId,from:proof.leadId,to:r.captorId,key:r.key,count:1,loanId:r.loanId,returning:true,reservationReturn:true}],registry,context,id);
    proof.restraint=null;
}
function strike(plan,p,action,registry,context,id) {
    const state=plan.state, lead=P[p], proof=state.causalStories.proofs[p], n=context.causalStoryNative;
    sLocation(plan,context);
    const observers=['player',...(person(state,lead)?.life==='alive'?[lead]:[]),...[P.witness,P.keeper].filter(a=>person(state,a)?.life==='alive' &&
        person(state,a).location===LOCATION && state.actors[a].worldId===WORLD &&
        state.actors[a].resources['causal.story.attention']>0 && context.facts[`causal.person.${a}.bodySupported`]===true)];
    apply(plan,[{type:'vital',actor:'player',key:'stamina',amount:-2}],registry,context,id,true);
    const attacker={...copy(n.fighters.player),stats:{...n.fighters.player.stats,...plan.vitals.player}},
        target={...copy(n.fighters[lead]),stats:{...n.fighters[lead].stats,...plan.vitals[lead]}};
    const result=resolveCausalStrike({attacker,target,random:()=>draw(plan)}), hp=plan.vitals[lead].health,
        terminal=result.damage>=hp && result.damage>0;
    const protection=resolveCausalProtection(state,p,{actorId:'player',targetId:lead,kind:action==='strike'?'lethal':'wound',terminal,damage:result.damage},
        {actorId:'player',observedBy:observers});
    const lethal=action==='strike' && terminal && !protection.prevented;
    const loss=lethal?hp:Math.min(result.damage,Math.max(0,hp-1));
    const effects=[{type:'vital',actor:lead,key:'health',amount:-loss},effectFlag(p,'attacked',lead)];
    if(person(state,lead).life==='alive')effects.push(
        {type:'relationship',actor:lead,target:'player',axis:'trust',amount:-2,text:'The player made this actual physical attempt against my body.'},
        knowledge(p,'intervention',lead,'I experienced this player’s current physical attempt against my actual body. My wound, remaining supplies and unfinished work are distinct. No other person learns my attacker without their own observation.',lead));
    if(lethal)effects.push({type:'life',actor:lead,status:'dead',lethal:true,reason:'Actual named lethal strike after current protection resolution.'});
    else if(action==='subdue' && terminal)effects.push({type:'life',actor:lead,status:'incapacitated',reason:'Actual paid nonlethal strike subdued this body.'});
    const text=result.damage===0?`Your attempt against ${PROFILES[p].name} ${result.kind==='block'?'was blocked':'did not land'}.`:
        lethal?`Your strike killed ${PROFILES[p].name}'s actual current body.`:
        protection.prevented?`Your terminal strike met an observed survival intervention. ${PROFILES[p].name} remains alive and wounded; their work and freedom are separate.`:
        action==='subdue'&&terminal?`You subdued ${PROFILES[p].name}'s current body.`:`Your strike wounded ${PROFILES[p].name}.`;
    effects.push(knowledge(p,'intervention','player',text,'player'));
    for(const observer of observers.filter(a=>a!==lead && a!=='player')) effects.push(
        {type:'resource',actor:observer,key:'causal.story.attention',amount:-1},effectFlag(p,'warned',observer),effectFlag(p,'suspectsPlayer',observer),
        {type:'relationship',actor:observer,target:'player',axis:'trust',amount:-1,text:'I personally observed the player’s current physical attempt against the courier.'},
        knowledge(p,'intervention',observer,`I observed the player’s current physical attempt against ${PROFILES[p].name}. ${text} My observation identifies this actual attempt only and grants no unseen motives or future abilities.`,observer));
    apply(plan,effects,registry,context,id);
    if(lethal)returnRestraint(plan,p,registry,context,id);
    let counter=null;
    if(person(state,lead).life==='alive' && plan.vitals[lead].health>1 && plan.vitals[lead].stamina>=1 && flag(state,lead,p,'guardReady') &&
        state.actors[lead].sources[SOURCES.guard] && state.simulation.faculties[lead]?.[SOURCES.guard]?.active===true &&
        state.simulation.faculties[lead]?.[SOURCES.guard]?.suppressed!==true) {
        apply(plan,[{type:'vital',actor:lead,key:'stamina',amount:-1}],registry,context,id,true);
        counter=resolveCausalStrike({attacker:{...target,stats:{...target.stats,...plan.vitals[lead]}},
            target:{...attacker,stats:{...attacker.stats,...plan.vitals.player}},random:()=>draw(plan)});
        apply(plan,[{type:'vital',actor:'player',key:'health',amount:-Math.min(counter.damage,Math.max(0,plan.vitals.player.health-1))}],registry,context,id);
    }
    proof.revision++;
    receipt(plan,p,'strike',id,'player',lead,{intent:action==='strike'?'lethal':'nonlethal',roll:result,damage:loss,prevented:protection.prevented,
        life:person(state,lead).life,health:plan.vitals[lead].health,counter,playerRecovery:'ordinary_nonlethal'},protection.evidence);
    log(plan,text+(counter?' The courier spent their own stamina on a guarded response.':''),id);
}
function sLocation(plan,context) {plan.state.simulation.people.player.location=context.facts.location;}
function releaseSource(plan,p,registry,context,id,kind) {
    const proof=plan.state.causalStories.proofs[p], sourceId=SOURCES[p];
    check(p!=='mortal' && proof.protection==='intact' && stateSource(plan.state,P[p],sourceId),'This current protection has already been removed.');
    apply(plan,[{type:'source',actor:P[p],sourceId,operation:'remove'}],registry,context,id);
    proof.protection='severed';if(proof.anchor)proof.anchor.status='isolated';proof.revision++;
    const text=p==='anchor'?'The admitted procedure isolated this actual original identity connection. Committed earlier history remains; no future power or identity was copied.':
        'The admitted procedure removed this actual original survival covenant. The courier remains alive in their current body; a later physical attempt needs its own outcome.';
    apply(plan,[knowledge(p,'severance','player',text,P.keeper,'understood','instruction'),knowledge(p,'severance',P[p],text,P.keeper,'understood','instruction')],registry,context,id);
    receipt(plan,p,kind,id,'player',P[p],{sourceId,protection:proof.protection,anchor:proof.anchor?.status||'none',life:person(plan.state,P[p]).life},
        [{actorId:P[p],sourceId,observedBy:['player',P[p],P.keeper]}]);
    log(plan,text,id);
}
const stateSource=(state,id,sourceId)=>!!state.actors[id]?.sources[sourceId] && state.simulation.faculties[id]?.[sourceId]?.active===true &&
    state.simulation.faculties[id]?.[sourceId]?.awakened===true && state.simulation.faculties[id]?.[sourceId]?.suppressed===false;

export function commitCausalStoryCommand(state,registry,command,rawContext,expectedSequence=state.sequence) {
    check(command?.type==='causal_story' && expectedSequence===state.sequence && command.sequence===state.sequence,'This original story choice changed. Review it again.');
    let context=causalStoryContext(state,{...rawContext,actorId:'player'}),q=previewCausalStoryCommand(state,registry,command.id,context,command);
    check(q.visible && q.eligible,q.reasons.join(' ')||'This choice is unavailable.');
    check(command.token===q.command.token,'The current body, means or story support changed. Review the choice again.');
    const p=proofOf(command.id),d=registry.simulation.commands.get(command.id===causalStoryId(p,'sever')?causalStoryId(p,'sever_job'):command.id);
    let plan;
    if(command.id==='causal.story.cancel') {
        plan=cancelSimulationJob(state,registry,command.jobId,context,expectedSequence);
        const prior=state.simulation.jobs.find(j=>j.id===command.jobId),proof=proofOf(prior.commandId);
        if(room(plan.state,proof))receipt(plan,proof,'cancellation',`cancel:${plan.state.sequence}`,'player',prior.targetId,
            {jobId:prior.id,terms:prior.cancellation,result:'cancelled'});
    } else if(d?.group==='causal_story' && d.actorId==='player' && command.id!==causalStoryId(p,'sever_job')) {
        context=causalStoryContext(state,{...context,targetId:d.targetId||null,causalStoryHost:true,facts:{...context.facts,'causal.hostSeverJob':command.id===causalStoryId(p,'sever')}});
        plan=commitSimulationCommand(state,registry,{id:d.id},context,state.sequence);
        const job=plan.state.simulation.jobs.find(j=>j.id===plan.commitment?.id);
        if(job)job.reservationReturns=1;
        if(command.id===causalStoryId(p,'sever')) {
            check(job,'The actual supported timed counter job was not reserved.');
            job.causalStory={schema:1,proofId:p,operation:'sever',policyRevision:1};plan.commitment=copy(job);
        }
        receipt(plan,p,job?'accepted_work':'instruction',`simulation:${plan.state.sequence}`,'player',d.targetId||null,
            {commandId:d.id,jobId:job?.id||null,duration:d.duration||0,cancellation:d.cancellation||'none'});
    } else {
        plan=base(state,context);
        if(command.id==='causal.story.enroll') {
            if(!plan.state.simulation)plan=enrollSimulation(state,registry,context,state.sequence);
            const id=cause(plan);plan.state.schema=CAUSAL_STORY_ENGINE_SCHEMA;
            plan.state.causalStories=createCausalStoryState(plan.state);attach(plan,registry,context,id);
            log(plan,'Met five independently supplied Village residents. No delivery deadline has begun.',id);
        } else {
            const id=cause(plan);sLocation(plan,context);
            if(command.id===causalStoryId(p,'begin'))begin(plan,p,registry,context,id);
            else if(command.id===causalStoryId(p,'strike')||command.id===causalStoryId(p,'subdue'))strike(plan,p,command.id.endsWith('.strike')?'strike':'subdue',registry,context,id);
            else if(command.id===causalStoryId(p,'capture')) {
                const loanId=causalStoryId(p,`restraint:${plan.state.sequence}`),proof=plan.state.causalStories.proofs[p];
                apply(plan,[{type:'custody',actor:'player',from:'player',to:P[p],key:ITEMS.rope,count:1,loanId}],registry,context,id);
                proof.restraint={captorId:'player',loanId,key:ITEMS.rope,at:plan.state.clock,cause:id};proof.revision++;
                receipt(plan,p,'capture',id,'player',P[p],{loanId,life:'incapacitated',property:'player_owned_rope'});
                apply(plan,[knowledge(p,'capture','player',`I restrained ${PROFILES[p].name}'s actually subdued living body with my own real Survey rope. I retain the rope’s ownership; release or this body’s terminal loss returns it once. Their bag and sources are still theirs.`,'player')],registry,context,id);
            } else if(command.id===causalStoryId(p,'release')) {
                returnRestraint(plan,p,registry,context,id);
                apply(plan,[{type:'life',actor:P[p],status:'alive',reason:'The actual captor released this living subdued body.'},
                    knowledge(p,'release','player',`I released ${PROFILES[p].name}'s living current body and recovered my exact custody rope once. Their injury, learned responses and earlier goal outcome remain.`,'player')],registry,context,id);
                plan.state.causalStories.proofs[p].revision++;receipt(plan,p,'release',id,'player',P[p],{life:'alive'});
            } else if(command.id===causalStoryId(p,'release_source'))releaseSource(plan,p,registry,context,id,'source_release');
            else if(command.id===causalStoryId(p,'withdraw')) {
                apply(plan,[knowledge(p,'withdrawal','player','I withdrew optional future help. No debt, payout, delivery failure or cancellation of another person’s funded work follows. Existing accepted player jobs keep their disclosed cancellation terms.','player')],registry,context,id);
                receipt(plan,p,'withdrawal',id,'player',P[p],{player:'withdrawn',npcWork:'continues_if_supported'});
            } else if(command.id===causalStoryId(p,'report')) {
                const proof=plan.state.causalStories.proofs[p], goal=proof.closure.result.goal, target=person(plan.state,P[p]);
                const text=`Nell's retained delivery account: ${goal==='delivered'?'she actually received a kit through the courier or Roe’s funded copied route':'the played delivery deadline passed without a supported received kit'}. She currently sees ${PROFILES[p].name}'s body ${target.life}${proof.restraint?' and restrained':''}. This reports her actual local evidence and the retained delivery outcome; it reveals no hidden future ability or motive. The body may still change after this account.`;
                apply(plan,[knowledge(p,'closure','player',text,P.keeper,'understood','instruction')],registry,context,id);
                // Observer knowledge is a distinct once event; it grants no loot.
                receipt(plan,p,'report',id,'player',P.keeper,{goal,knowledgeKey:causalStoryId(p,'closure')},
                    [{actorId:'player',knowledgeKey:causalStoryId(p,'closure'),attributedTo:P.keeper}]);log(plan,text,id);
            }
        }
    }
    reconcileCausalStoryPlan(state,plan,registry,{player:context});
    validateSimulationState(plan.state.simulation,plan.state,registry.simulation);validateCausalStories(plan.state,registry);
    return plan;
}

/** Exact opt-in descriptor validation belongs in the shared job/save reader. */

function support(plan,job,registry,contexts) {
    const state=plan.state,s=state.simulation,c=causalStoryContext(state,{...contexts[job.actorId],...job.context,
        external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals,equipment:plan.equipment});
    const rule=job.completionSupport;
    const participants=(job.participants||[job.actorId]).every(id=>person(state,id)?.life==='alive' &&
        state.actors[id]?.worldId===state.actors[job.actorId]?.worldId && (!rule?.coLocated ||
            (id==='player'?contexts.player?.facts?.location||person(state,id).location:person(state,id).location)===rule.location));
    return {context:c,allowed:participants && (!rule||meets(rule.requires,simulationFacts(state,c,registry)))};
}
function stopJob(plan,job,registry,context,id,reason) {
    const s=plan.state.simulation,p=proofOf(job.commandId);
    check(s.jobs.some(j=>j.id===job.id) || job.siteId && s.sites[job.siteId]?.reservations[job.id]===job.actorId,
        'This work no longer owns a live commitment or reservation.');
    if(job.completionSupport?.failure==='refund')apply(plan,refundCosts(job.costs,true),registry,{...context,...job.context},id);
    if(job.claim)delete s.claims[job.claim];if(job.siteId)delete s.sites[job.siteId].reservations[job.id];
    s.jobs=s.jobs.filter(j=>j.id!==job.id);
    const program=s.programs[job.actorId];if(program?.commandId===job.commandId) {program.status='paused';program.reason=reason;if(job.completionSupport?.failure==='refund')program.remaining++;}
    if(room(plan.state,p))receipt(plan,p,'support_lost',id,job.actorId,job.targetId,{jobId:job.id,result:'no_result',terms:job.completionSupport?.failure||'forfeit'});
    log(plan,`${job.label} stopped: ${reason} ${job.completionSupport?.failure==='refund'?'Reserved inputs returned once.':'Disclosed spent inputs remain spent.'}`,id,job.audience||[job.actorId]);
}

/** Return true only for a handled opted-in completion, false for old jobs. */
export function completeCausalStoryJob(plan,job,registry,contexts={}) {
    if(!job.causalStory)return false;
    validateCausalStoryJob(job,plan.state,registry.simulation);
    check(job.due<=plan.state.clock,'This actual counter has not reached its paid completion boundary.');
    check(plan.state.simulation.sites[job.siteId]?.reservations[job.id]===job.actorId,
        'This actual counter no longer owns its accepted reservation.');
    const current=planContexts(plan,contexts),{context,allowed}=support(plan,job,registry,current),p=job.causalStory.proofId;
    sLocation(plan,current.player||context);
    const id=cause(plan),policy=allowed?resolveCausalProtection(plan.state,p,{actorId:'player',targetId:P[p],kind:'source_severance'},
        {actorId:'player',sourceId:SOURCES.method,knowledgeKey:causalStoryId(p,'method'),siteId:job.siteId,observedBy:['player',P[p],P.keeper]}):null;
    if(!allowed || !policy?.allowed || !room(plan.state,p)) {stopJob(plan,job,registry,context,id,'Current body, contact, learned method, consent or account capacity was lost.');return true;}
    releaseSource(plan,p,registry,context,id,'severance');
    apply(plan,[{type:'item',actor:'player',key:ITEMS.kit,amount:1,reservationReturn:true}],registry,context,id);
    if(job.claim)apply(plan,[{type:'claim',actor:'player',key:job.claim,operation:'settle'}],registry,context,id);
    if(job.siteId)delete plan.state.simulation.sites[job.siteId].reservations[job.id];
    plan.state.actors.player.completed[job.commandId]=(plan.state.actors.player.completed[job.commandId]||0)+1;
    plan.state.simulation.jobs=plan.state.simulation.jobs.filter(j=>j.id!==job.id);
    return true;
}

/** Recheck only new CSE accepted work after actual support mutations. */
export function invalidateCausalStorySupport(plan,registry,contexts={}) {
    if(!plan.state.causalStories)return plan;
    const current=planContexts(plan,contexts);
    for(const job of [...plan.state.simulation.jobs]) {
        if(!isCausalJob(job,registry)||!job.completionSupport)continue;
        const {context,allowed}=support(plan,job,registry,current);
        if(!allowed)stopJob(plan,job,registry,context,cause(plan),'Its current body, source, contact or accepted support is unavailable.');
    }
    return plan;
}
/** Reconcile committed actor facts, never a simulated alternate ending. */
export function reconcileCausalStoryPlan(before,plan,registry,contexts={}) {
    if(!plan.state.causalStories)return plan;
    const state=plan.state;
    for(const p of PROOFS) {
        const proof=state.causalStories.proofs[p];if(!proof)continue;
        for(const d of causalStoryDefinitions.commands.filter(d=>proofOf(d.id)===p)) {
            const count=state.actors[d.actorId]?.completed?.[d.id]||0, old=before.actors?.[d.actorId]?.completed?.[d.id]||0;
            if(count>old && d.duration && !d.id.endsWith('.sever_job') && room(state,p)) {
                const oldJob=before.simulation?.jobs.find(j=>j.commandId===d.id&&j.actorId===d.actorId);
                if(oldJob && state.causalStories.receipts.some(r=>r.kind==='work_completed' && r.result?.jobId===oldJob.id))continue;
                receipt(plan,p,'work_completed',cause(plan),d.actorId,d.targetId||null,{commandId:d.id,jobId:oldJob?.id||null,count,
                    result:'actual_committed_effects'});
            }
        }
        if(flag(state,P[p],p,'delivered')||flag(state,P.witness,p,'copyDelivered'))proof.delivery='delivered';
    }
    invalidateCausalStorySupport(plan,registry,contexts);
    for(const p of PROOFS) {
        const proof=state.causalStories.proofs[p];if(!proof || proof.phase==='closed')continue;
        if(evaluateCausalClosure(state,p))stageCausalClosure(plan,p,cause(plan));
    }
    return plan;
}
/** Called after actual generic CSE effects and completed count, before closure. */
export function recordCausalStoryJobCompletion(plan,job,registry) {
    if(!plan.state.causalStories || !isCausalJob(job,registry) || job.causalStory || !natural(job.due) || job.due>plan.state.clock)return plan;
    const p=proofOf(job.commandId);
    if(!plan.state.causalStories.proofs[p] || !room(plan.state,p) ||
        plan.state.causalStories.receipts.some(r=>r.kind==='work_completed' && r.result?.jobId===job.id))return plan;
    const count=plan.state.actors[job.actorId]?.completed?.[job.commandId]||0;
    check(count>0,'Record a CSE completion only after its actual committed effects and completed count.');
    receipt(plan,p,'work_completed',cause(plan),job.actorId,job.targetId||null,
        {commandId:job.commandId,jobId:job.id,count,result:'actual_committed_effects'});
    return plan;
}
export function nextCausalStoryBoundary(state) {
    return Math.min(Infinity,...PROOFS.map(p=>state.causalStories?.proofs?.[p]).filter(p=>p?.phase==='open'&&p.deadline>state.clock).map(p=>p.deadline));
}
export function advanceCausalStoryBoundary(plan,registry,contexts={},before=plan.state) {
    return reconcileCausalStoryPlan(before,plan,registry,contexts);
}
export function causalStoryTravelReasons(state,actorId='player') {
    return causalStoryOccupiesActor(state,actorId)?['This actual body remains restrained. Release it before travel.']:[];
}

/** Observer-limited UI model. No private receipts, actor purses or fighter stats. */
export function causalStoryPresentation(state,registry,context={}) {
    const n=context.causalStoryNative,local=state.actors?.player?.worldId===WORLD && (context.facts?.location||n?.currentLocation)===LOCATION;
    if(!local)return {visible:false,enrolled:!!state.causalStories,sections:[]};
    try {
        if(!state.causalStories)return {visible:true,enrolled:false,sections:[{id:'causal.story.meeting',label:'Village couriers',
            description:'Meet independently supplied residents and hear their work. Only played game time advances their cases.',
            actions:[previewCausalStoryCommand(state,registry,'causal.story.enroll',context)],records:[],work:[]}]};
        // Visibility uses only this family's facts and the player's received
        // knowledge. Avoid evaluating and hashing executable quotes for hidden
        // lessons/counters on every clock render. Shown offers still go through
        // the full current host admission below.
        const visibleFacts={...causalStoryContext(state,context).facts};
        for(const [key,row] of Object.entries(state.simulation.knowledge.player||{})) {
            visibleFacts[`knowledge.${key}.seen`]=true;
            visibleFacts[`knowledge.${key}.understood`]=row.stage==='understood';
        }
        const sections=PROOFS.map(p=>{
            const proof=state.causalStories.proofs[p],actions=[],records=[];
            if(!proof)actions.push(previewCausalStoryCommand(state,registry,causalStoryId(p,'begin'),context));
            else {
                for(const d of causalStoryDefinitions.commands.filter(d=>proofOf(d.id)===p&&d.actorId==='player')) {
                    if(d.id.endsWith('.sever_job') ? !known(state,'player',p,'method')||!known(state,'player',p,'authorization')
                        : !meets(d.visibleWhen,visibleFacts))continue;
                    const q=previewCausalStoryCommand(state,registry,d.id.endsWith('.sever_job')?causalStoryId(p,'sever'):d.id,context);
                    if(q.visible)actions.push(q);
                }
                for(const action of ['strike','subdue','capture','release','release_source','withdraw','report']) {
                    if(action==='release'&&person(state,P[p])?.life!=='incapacitated' || action==='release_source'&&p==='mortal' || action==='report'&&!proof.closure)continue;
                    const q=previewCausalStoryCommand(state,registry,causalStoryId(p,action),context);
                    if(q.visible)actions.push(q);
                }
            }
            for(const [key,row] of Object.entries(state.simulation.knowledge.player||{}).filter(([key])=>proofOf(key)===p))
                records.push({id:key,text:row.value,at:row.at});
            const work=state.simulation.jobs.filter(j=>j.actorId==='player'&&proofOf(j.commandId)===p&&isCausalJob(j,registry)).map(j=>{
                const q=previewCausalStoryCommand(state,registry,'causal.story.cancel',context,{jobId:j.id});
                return {id:j.id,label:j.label,remaining:Math.max(0,j.due-state.clock),cancellation:j.cancellation,
                    eligible:q.eligible,command:q.command};
            });
            const scene=projectVillageScene({id:p,began:!!proof,actions,records,work,
                deadlineRemaining:proof&&known(state,'player',p,'terms')?Math.max(0,proof.deadline-state.clock):null});
            return {id:p,label:PROFILES[p].name,scene,actions,records,work};
        });
        return {visible:true,enrolled:true,sections};
    } catch(error) {return {visible:true,enrolled:!!state.causalStories,sections:[],error:'The current story owners are unavailable. Refresh after the current action.'};}
}
