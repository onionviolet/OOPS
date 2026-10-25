import {savedBattleLoss} from './defeat_domain.js';
import {xorshift32} from './hash_rng.js';
import {check} from './basics.js';
import {validateNativeBattle,PARTY_HELPER,PARTY_METHOD} from './native_battle_contracts.js';
import {commitSimulationCommand,simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';
import {applySimulationEffects} from './simulation_effects.js';
import {validateExpansionState} from './expansion_engine.js';
import {rollCombatStrike,mitigateCombatDamageFromStats} from './combat_math.js';
import {ROAD_RIVAL,RIVAL_PURSUIT} from './frontier_campaign.js';
const kit=JSON.stringify({id:'Prepared survey kit'});
function supportReasons(state) {
    const s=state.simulation,p=s?.people[PARTY_HELPER],a=state.actors[PARTY_HELPER],source=a?.sources[PARTY_METHOD],faculty=s?.faculties[PARTY_HELPER]?.[PARTY_METHOD];
    const reasons=[];
    if(a&&!a.facts['party.willing'])reasons.push('Lio withdrew his consent.');
    if(!p||p.life!=='alive'||p.location!=='Village'||a.worldId!==state.actors.player.worldId)reasons.push('Lio must be present and able to participate.');
    if(!p?.body?.can_brace)reasons.push('Lio cannot brace with his current body.');
    if(!source||(source.expiresAt!=null&&source.expiresAt<=state.clock)||!faculty?.active||!faculty.awakened||faculty.suppressed)reasons.push('Lio needs his actual trained control.');
    if(!(s?.owners[PARTY_HELPER]?.[kit]>0)||Object.values(s?.custody||{}).some(c=>c.holder===PARTY_HELPER&&c.key===kit))reasons.push('Lio needs his own unencumbered harness kit.');
    if(p?.vitals.health<=1)reasons.push('Lio has yielded and needs recovery.');
    return reasons;
}
export function partyHelperReasons(state,context={}) {
    const reasons=supportReasons(state),p=state.simulation?.people[PARTY_HELPER];
    if(!state.actors[PARTY_HELPER]?.facts['party.willing'])reasons.push('Lio has not offered his consent.');
    if(context.facts?.location!=='Village')reasons.push('Meet Lio in the Village.');
    if(p&&(simulationOccupiesActor(state,PARTY_HELPER)||state.pending.some(j=>j.context.actorId===PARTY_HELPER)||activePractice(state.actors[PARTY_HELPER])))reasons.push('Lio is already committed to other work.');
    if(p?.vitals.stamina<2||state.actors[PARTY_HELPER]?.resources.brace_effort<1)reasons.push('Lio refuses another guard until he has rested and re-rigged.');
    return reasons;
}
export function initializePartyBattle(state,registry,command,context,expectedSequence=state.sequence) {
    check(expectedSequence===state.sequence,'This party invitation is stale.');
    check(!context.busy,'Finish your native activity first.');
    const reasons=partyHelperReasons(state,context);check(!reasons.length,reasons.join(' '));
    check(context.vitals.player.health>1,'Recover before the contest.');
    check(state.simulation?.people[ROAD_RIVAL]?.vitals.health>1,'Mara must recover before another contest.');
    const plan=commitSimulationCommand(state,registry,{id:'rival.confront',requestId:command.requestId},{...context,targetId:ROAD_RIVAL},expectedSequence);
    const session=plan.state.simulation.sessions.player;
    session.participants.push(PARTY_HELPER);
    session.nativeBattle={schema:2,definitionId:'party.braced_contest',seed:(plan.state.simulation.seed^plan.state.sequence)>>>0||1,actions:0,last:'Lio will interpose on the next attempted blow after bracing. Both stop at one HP.',
        fighters:Object.fromEntries(['player',PARTY_HELPER,ROAD_RIVAL].map(id=>[id,{side:id===ROAD_RIVAL?'defenders':'attackers',role:id===PARTY_HELPER?'guard':'strike',status:'active',moves:0}])),guard:null,guardsPrepared:0,guardsTaken:0,lastTarget:null};
    applySimulationEffects(plan,[{type:'resource',native:true,key:'money',amount:-1},{type:'resource',actor:PARTY_HELPER,key:'coins',amount:1}],{actorId:'player'},registry,session.id,{spending:false});
    validateExpansionState(plan.state,registry);return plan;
}
function planFor(state,context){return {state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),vitals:structuredClone(context.vitals),acquisitions:[],unlocks:[]};}
function helperLeaves(plan,status) {
    const session=plan.state.simulation.sessions.player,b=session.nativeBattle;
    b.fighters[PARTY_HELPER].status=status;b.guard=null;
    session.participants=session.participants.filter(id=>id!==PARTY_HELPER);
}
function finish(plan,registry,result) {
    const state=plan.state,s=state.simulation,session=s.sessions.player,b=session.nativeBattle,cause=`party-result:${++state.sequence}`;
    const effects=[{type:'fact',scope:'actor',key:'rival.lastResult',value:result},{type:'fact',scope:'actor',key:'party.lastResult',value:result},
        {type:'fact',scope:'actor',key:'party.guardsTaken',value:b.guardsTaken},{type:'fact',scope:'actor',key:'party.helperStatus',value:b.fighters[PARTY_HELPER].status},
        {type:'fact',scope:'actor',key:'party.lastReceipt',value:session.id},
        {type:'relationship',target:PARTY_HELPER,axis:'familiarity',amount:1,text:`Agreed contest ${result}; Lio took ${b.guardsTaken} guarded attempts. Wounds and spent effort remain.`},
        {type:'relationship',target:ROAD_RIVAL,axis:'respect',amount:1,text:`Agreed party contest ${result}; Lio took ${b.guardsTaken} guarded attempts before his ${b.fighters[PARTY_HELPER].status} finish.`}];
    if(result==='won'&&!state.actors.player.facts['rival.resolved'])effects.push({type:'fact',scope:'actor',key:'rival.resolved',value:true},{type:'source',sourceId:'frontier.rival_insight',operation:'grant',awakened:true,active:true});
    applySimulationEffects(plan,effects,{actorId:'player'},registry,cause);
    const p=s.pursuits[RIVAL_PURSUIT];p.status=result==='withdrawn'?'withdrawn':'tested';p.due=null;p.closedAt=state.clock;p.closedBy='player';
    state.actors.player.completed[session.commandId]=(state.actors.player.completed[session.commandId]||0)+1;
    s.log.push({at:state.clock,text:`Party road contest: ${result}. Lio took ${b.guardsTaken} guarded attempts.`,cause});s.log=s.log.slice(-100);delete s.sessions.player;
}
export function commitPartyBattleAction(state,registry,command,context) {
    const saved=state.simulation?.sessions.player;validateNativeBattle(saved?.nativeBattle,saved,state);
    check(saved.nativeBattle.schema===2&&command.sessionId===saved.id&&command.sequence===state.sequence&&command.action===saved.nativeBattle.actions,'This party action is stale or already settled.');
    const actorId=command.actorId,role=saved.nativeBattle.fighters[actorId];check(role?.status==='active','That fighter has already left the contest.');
    const plan=planFor(state,context),s=plan.state.simulation,session=s.sessions.player,b=session.nativeBattle;
    const hp=id=>id==='player'?plan.vitals.player:s.people[id].vitals;
    if(command.type==='release') {
        check(actorId===PARTY_HELPER,'Only Lio can be released separately.');helperLeaves(plan,'released');b.last='Lio steps out by agreement. The player may continue alone.';
    }else if(actorId===PARTY_HELPER) {
        check(command.type==='guard'&&command.targetId==='player','Lio guards the player; he does not attack or guard an enemy.');
        check(!b.guard,'The existing guard is still held.');
        const unsupported=supportReasons(plan.state);
        if(unsupported.length){helperLeaves(plan,hp(PARTY_HELPER).health<=1?'yielded':'unsupported');b.last=unsupported.join(' ')+' Lio steps out.';}
        else if(hp(PARTY_HELPER).stamina<2||plan.state.actors[PARTY_HELPER].resources.brace_effort<1){helperLeaves(plan,'exhausted');b.last='Lio has no guard effort left and steps out.';}
        else{hp(PARTY_HELPER).stamina-=2;plan.state.actors[PARTY_HELPER].resources.brace_effort--;b.guard=PARTY_HELPER;b.guardsPrepared++;b.last='Lio spends 2 stamina and 1 effort to brace for the next attempted blow against you.';}
    }else {
        check(command.type==='strike'&&command.targetId===(actorId==='player'?ROAD_RIVAL:'player'),'Unsupported party action or target.');
        let targetId=command.targetId;
        if(actorId===ROAD_RIVAL&&b.guard){
            if(supportReasons(plan.state).length)helperLeaves(plan,hp(PARTY_HELPER).health<=1?'yielded':'unsupported');
            else{targetId=PARTY_HELPER;b.guard=null;b.guardsTaken++;}
        }
        const attacker=command.fighters?.[actorId],target=command.fighters?.[targetId];
        check(attacker&&target&&Number.isFinite(attacker.attackPower)&&attacker.attackPower>=0,'Missing actual native fighter binding.');
        check(hp(actorId).health>1&&hp(targetId).health>1,'A fighter has already yielded.');
        const before=hp(actorId).stamina;hp(actorId).stamina=Math.max(0,before-Math.min(before,1/(attacker.stats.stamina_efficiency||1)));
        const random=()=>{b.seed=xorshift32(b.seed);return b.seed/0x100000000;};
        const strike=rollCombatStrike({attackPower:attacker.attackPower*(hp(actorId).stamina===0?(attacker.emptyStaminaMultiplier||.5):1),attacker:attacker.stats,target:target.stats,shield:target.shield,shieldSkill:target.shieldSkill,random});
        const damage=strike.kind==='hit'?mitigateCombatDamageFromStats(strike.values,target.stats,0,attacker.stats.armor_penetration??0):0;
        hp(targetId).health=Math.max(1,hp(targetId).health-damage);b.lastTarget=targetId;
        b.last=`${actorId==='player'?'You':'Mara'} ${strike.kind==='hit'?`hit ${targetId===PARTY_HELPER?'Lio':targetId==='player'?'you':'Mara'} for ${Math.round(damage*10)/10}`:strike.kind==='blocked'?'met a full block':'missed'}.`;
        if(targetId===PARTY_HELPER&&(hp(PARTY_HELPER).health===1||plan.state.actors[PARTY_HELPER].resources.brace_effort===0||hp(PARTY_HELPER).stamina<2))helperLeaves(plan,hp(PARTY_HELPER).health===1?'yielded':'exhausted');
        if(hp(targetId).health===1&&targetId!==PARTY_HELPER){finish(plan,registry,targetId===ROAD_RIVAL?'won':'lost');if(targetId==='player')plan.defeat=savedBattleLoss(['Mara']);}
    }
    b.actions++;b.fighters[actorId].moves++;plan.state.sequence++;
    plan.native={hpToFull:hp('player').max_health-hp('player').health,staminaToFull:hp('player').max_stamina-hp('player').stamina};
    validateExpansionState(plan.state,registry);return plan;
}
export function withdrawPartyBattle(state,registry,context,expectedSequence=state.sequence) {
    check(state.sequence===expectedSequence,'This party withdrawal is stale.');validateNativeBattle(state.simulation?.sessions.player?.nativeBattle,state.simulation?.sessions.player,state);
    const plan=planFor(state,context);finish(plan,registry,'withdrawn');validateExpansionState(plan.state,registry);return plan;
}
export function partyBattleView(state){const session=state.simulation?.sessions.player;return session?.nativeBattle?.schema===2?{sessionId:session.id,...session.nativeBattle}:null;}
