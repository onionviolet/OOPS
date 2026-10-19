import {savedBattleLoss} from './defeat_domain.js';
import {FEATURE_SHIELD,FEATURE_HOOK,FEATURE_BATTLE_FOES,featureBattleFacts} from './feature_battle_facts.js';
import {xorshift32} from './hash_rng.js';
import {all, check, eq, natural} from './basics.js';
import {validateFeatureBattle} from './world_completion_battle_validation.js';
export {validateFeatureBattle};
import {admitFieldCareWatch,recordFieldCareStrike,finishFieldCareWatch} from './field_care_battle.js';
import {admitRemainderCombatFit,previewRemainderCombatFitAdmission,quoteRemainderCombatFitAction,settleRemainderCombatFitAction,remainderCombatFitHookAftermath,remainderCombatFitHookReceipt,retainRemainderCombatFitHookReceipts,finishRemainderCombatFit,remainderCombatFitBattleChoices,validateRemainderCombatFitBattle} from './audit_remainder_combat_fit_hooks.js';
import {remainderCombatFitLioSupported} from './audit_remainder_combat_fit_facts.js';
import {remainderCombatObjectivesAdmissionReasons,initializeRemainderCombatObjectivesBattle,validateRemainderCombatObjectivesBattle,quoteRemainderCombatObjectivesBattleAction,beforeRemainderCombatObjectivesBattleAction,applyRemainderCombatObjectivesBattleAction,prepareRemainderCombatObjectivesIncomingGuard,settleRemainderCombatObjectivesBattle,remainderCombatObjectivesNativeAction,remainderCombatObjectivesBattleActions} from './audit_remainder_combat_objectives_battle.js';
// Original sluice encounter. Native Combat owns cadence; native combat_math
// owns hit/block/crit/damage. This planner only stages conserved paid actions.
import {commitSimulationCommand,previewSimulationCommand,simulationOccupiesActor} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {validateExpansionState} from './expansion_engine.js';
import {rollCombatStrike,mitigateCombatDamage} from './combat_math.js';
import {activePractice} from './techniques.js';
import {SKILL_IDS} from './skill_expansion_content.js';
import {featurePowerFacts,FEATURE_HARNESS,FEATURE_HOOK_POLE,FEATURE_KIT,FEATURE_LOG,FEATURE_POWER_WORLD} from './feature_expansion_powers.js';
export const FEATURE_BATTLE_SCHEMA=3;
// Frozen schema3 sessions retain their original cadence, costs and choices.
export const FEATURE_REFERENCE_BATTLE_SCHEMA=4;
export const FEATURE_REMAINDER_BATTLE_SCHEMA=5;
export const FEATURE_HOOK_COOLING_CONDITION='reference_gameplay.hook_cooled';
export const isFeatureBattleSchema=schema=>schema===FEATURE_BATTLE_SCHEMA||schema===FEATURE_REFERENCE_BATTLE_SCHEMA||schema===FEATURE_REMAINDER_BATTLE_SCHEMA;
export const FEATURE_BATTLE_ID='feature_battle.sluice';
export {FEATURE_SHIELD,FEATURE_HOOK,featureBattleFacts};
export const FEATURE_HELPER='partyPartner';
const foes=FEATURE_BATTLE_FOES;
const af=(key,value=true)=>({type:'fact',scope:'actor',key,value});
const stamina=(amount,actor)=>({type:'vital',key:'stamina',amount,...(actor?{actor}:{})});
const command=d=>({revision:1,worldId:FEATURE_POWER_WORLD,actorId:'player',location:'Village',group:'feature_battle',costs:[],effects:[],...d});
const seen=eq('actor.feature.battle.seen'),open=eq('actor.feature.battle.routeCleared',false);
const admittedOpen={any:[open,all(eq('auditRemainder.enrolled'),eq('remainder.combatObjectives.practiceWatchReady'))]};
const actorDefinition=(id,label,body)=>({id,revision:1,label,worldId:FEATURE_POWER_WORLD,location:'Village',inventory:'simulation',provision:false,resources:{watch_rations:2},
    vitals:{health:body.health,max_health:body.health,stamina:12,max_stamina:12},body:{...body,max_stamina:12,crit_rate:0,crit_multiplier:1.2,attack_count:1,stamina_efficiency:1}});
export const featureBattleDefinitions={
    people:[actorDefinition(FEATURE_SHIELD,'Nera, shield tollkeeper',{health:34,attack:5,agility:6,dexterity:8,intuition:6,attack_speed:.9,defense:3,can_brace:true}),
        actorDefinition(FEATURE_HOOK,'Oren, hook tollkeeper',{health:24,attack:4,agility:9,dexterity:9,intuition:7,attack_speed:1.1,defense:1,can_brace:true})],
    encounters:[{id:FEATURE_BATTLE_ID,revision:1,label:'The sluice tollkeepers',lethal:false,settlement:[],turns:[{
        cue:'Nera holds the gate while Oren hooks exposed frames. They demand a toll and stop when a fighter yields. Raise the gate, drive both away, escape, or withdraw with spent supplies and injuries retained.',
        responses:[{id:'withdraw',label:'Withdraw from the sluice without further injury',effects:[af('feature.battle.lastResult','withdrawn')]}]}]}],
    commands:[
        command({id:'feature_battle.inspect',label:'Inspect the sluice claim · 1 stamina + 2 min',once:true,duration:2,cancellation:'forfeit',
            visibleWhen:eq('campaign.anchor'),requires:all(eq('actor.life','alive'),eq('actor.feature.battle.seen',false)),costs:[stamina(-1)],effects:[
                ...foes.map(id=>({type:'spawn',personId:id,definitionId:id})),
                {type:'item',actor:FEATURE_SHIELD,key:FEATURE_HARNESS,amount:1},{type:'equipment',actor:FEATURE_SHIELD,slot:'field_frame',key:FEATURE_HARNESS},
                {type:'item',actor:FEATURE_HOOK,key:FEATURE_HOOK_POLE,amount:1},{type:'equipment',actor:FEATURE_HOOK,slot:'hook_pole',key:FEATURE_HOOK_POLE},af('feature.battle.seen'),
                {type:'knowledge',key:'feature.battle.sluice',stage:'seen',value:'Nera holds a braced shield at the sluice; Oren carries a hooked pole and follows exposed frames. Their toll claim blocks the direct gate. A slower drainage walk remains open. They yield at one HP; no player level changes their bodies.'}],
            description:'Explicitly meet two persistent local opponents. This preserves their own fixed bodies, fatigue and watch supplies. Watching does not start native combat or award a method.'}),
        command({id:'feature_battle.start',label:'Challenge the sluice claim · 1 stamina',targetId:FEATURE_SHIELD,participants:[FEATURE_SHIELD,FEATURE_HOOK],encounterId:FEATURE_BATTLE_ID,
            visibleWhen:all(seen,admittedOpen),requires:all(eq('actor.life','alive'),eq('feature.battle.foesReady',true,'The tollkeepers must recover before another encounter.'),eq('feature.battle.playerReady',true,'Recover above one HP first.')),
            costs:[stamina(-1)],description:'Start the fixed native team encounter. Each fighter keeps their own stats and spent fatigue. Raise the gate to three progress, make both opponents yield, or take the escape line. Lio joins only by a separate explicit paid invitation.'}),
        command({id:'feature_battle.bypass',label:'Take the long drainage walk · 3 stamina + 8 min',duration:8,cancellation:'forfeit',visibleWhen:all(seen,open),
            requires:eq('actor.life','alive'),costs:[stamina(-3)],effects:[af('feature.battle.routeCleared'),af('feature.battle.lastResult','bypassed'),
                {type:'knowledge',key:'feature.battle.result',stage:'understood',value:'You used the slower drainage walk around the claimed gate. The tollkeepers remain alive with their actual condition and stock. No battle victory, combat reward or learned method was invented.'}],
            description:'An ordinary route without a mature method or fight. Eight played minutes and three stamina secure passage; cancellation keeps spent fatigue and grants no progress.'}),
        command({id:'feature_battle.next_watch',label:'Wait for the tollkeepers’ next supplied watch · 6 min',duration:6,cancellation:'forfeit',participants:foes,
            visibleWhen:all(seen,open),requires:all(eq('feature.battle.foesNeedRest'),eq('feature.battle.rationsReady',true,'Their two supplied rests are exhausted; the ordinary drainage walk remains available.')),
            effects:foes.flatMap(id=>[{type:'resource',actor:id,key:'watch_rations',amount:-1},{type:'vital',actor:id,key:'health',amount:id===FEATURE_SHIELD?34:24},{type:'vital',actor:id,key:'stamina',amount:12}]),
            description:'Both persistent opponents reserve six played minutes and spend one of their own two watch rations to recover. Withdrawn or lost fights retain all prior wounds until this real rest completes. This awards no player XP, coins or loot.'})
    ]
};

function helperReasons(state,context,occupied=false) {
    const facts=featurePowerFacts(state,context),p=state.simulation?.people[FEATURE_HELPER],reasons=[];
    const current=state.simulation?.sessions.player?.nativeBattle,useFit=state.auditRemainder?.schema===1&&(!current||current.schema===5);
    if(!(useFit?remainderCombatFitLioSupported(state):facts['skills.lioSupported']))reasons.push('Lio needs his actual consent, body, acquired control and owned harness kit.');
    if(!occupied&&(simulationOccupiesActor(state,FEATURE_HELPER)||state.pending.some(j=>j.context.actorId===FEATURE_HELPER)||activePractice(state.actors[FEATURE_HELPER]||{techniques:{}})))reasons.push('Lio is already committed.');
    if(p?.vitals.stamina<1||(state.actors[FEATURE_HELPER]?.resources.brace_effort||0)<1)reasons.push('Lio needs supplied rest and a guard effort.');
    return reasons;
}
export function previewFeatureBattleAdmission(state,registry,context,command={}) {
    const {withHelper=false}=command;
    const preview=previewSimulationCommand(state,registry,'feature_battle.start',{...context,facts:{...context.facts,...featureBattleFacts(state,context)},targetId:FEATURE_SHIELD});
    const reasons=[...preview.reasons];
    if(state.auditRemainder?.schema===1){reasons.push(...remainderCombatObjectivesAdmissionReasons(state,context,command));reasons.push(...previewRemainderCombatFitAdmission(state,context,{reserveGripPreparation:command.reserveGripPreparation===true}).reasons);}
    if(withHelper){reasons.push(...helperReasons(state,context));if(!(context.external?.money>=1))reasons.push('Lio’s agreed support costs one actual coin.');}
    return {...preview,eligible:preview.eligible&&!reasons.length,reasons};
}
function planFor(state,context) {return {state:structuredClone(state),external:structuredClone(context.external||{}),gameplay:structuredClone(context.gameplay||{}),gameplayBefore:structuredClone(context.gameplay||{}),vitals:structuredClone(context.vitals||{}),equipment:structuredClone(context.equipment||{}),acquisitions:[],unlocks:[]};}
export function initializeFeatureBattle(state,registry,command,context,expectedSequence=state.sequence) {
    check(state.sequence===expectedSequence,'This sluice invitation is stale.');
    check(command.id==='feature_battle.start','Unknown sluice admission.');
    const admission=previewFeatureBattleAdmission(state,registry,context,command);check(admission.eligible,admission.reasons.join(' '));
    if(command.withHelper){const reasons=helperReasons(state,context);check(!reasons.length,reasons.join(' '));check(context.external?.money>=1,'Lio’s agreed support costs one actual coin.');}
    const plan=commitSimulationCommand(state,registry,command,{...context,facts:{...context.facts,...featureBattleFacts(state,context)},targetId:FEATURE_SHIELD},expectedSequence);
    const s=plan.state.simulation,session=s.sessions.player;check(session?.definitionId===FEATURE_BATTLE_ID,'Missing native sluice session.');
    const ids=['player',...foes,...(command.withHelper?[FEATURE_HELPER]:[])];
    if(command.withHelper){session.participants.push(FEATURE_HELPER);applySimulationEffects(plan,[{type:'resource',native:true,key:'money',amount:-1},{type:'resource',actor:FEATURE_HELPER,key:'coins',amount:1}],{...context,actorId:'player'},registry,session.id);}
    const mapped=state.actors.player.facts['feature.battle.exitPrepared']===true;
    session.nativeBattle={schema:state.auditRemainder?.schema===1?FEATURE_REMAINDER_BATTLE_SCHEMA:state.referenceGameplay?FEATURE_REFERENCE_BATTLE_SCHEMA:FEATURE_BATTLE_SCHEMA,definitionId:FEATURE_BATTLE_ID,revision:1,seed:(s.seed^plan.state.sequence)>>>0||1,actions:0,
        fighters:Object.fromEntries(ids.map(id=>[id,{side:foes.includes(id)?'defenders':'attackers',role:id===FEATURE_HELPER?'guard':id===FEATURE_SHIELD?'shield':id===FEATURE_HOOK?'hook':'strike',status:'active',moves:0}])),
        guards:[],focused:[],exposed:{},wedge:false,signal:false,objective:{key:'raise_gate',progress:0,required:3},escape:{progress:0,required:mapped?2:3},guardsTaken:0,
        lastTarget:null,last:'The sluice gate is held. Injuries stop at one HP; the drainage walk remains available after withdrawal.',receipts:[],
        ...(state.referenceGameplay?{opportunity:null,opportunityReceipts:[]}: {})};
    if(session.nativeBattle.schema===5){
        const staged={...context,gameplay:plan.gameplay,vitals:plan.vitals,equipment:plan.equipment};
        const fit=admitRemainderCombatFit(plan.state,session,staged,{reserveGripPreparation:command.reserveGripPreparation===true});
        session.nativeBattle.combatFit=fit.combatFit;if(fit.module!=null)plan.state.auditRemainder.modules.combat_fit=fit.module;
        const effects=initializeRemainderCombatObjectivesBattle(plan,command,staged);
        if(effects.length)applySimulationEffects(plan,effects,{actorId:'player'},registry,session.id,{spending:true});
    }
    admitFieldCareWatch(plan.state,session,context);
    plan.state.actors.player.facts['feature.battle.exitPrepared']=false;
    validateFeatureBattle(session.nativeBattle,session,plan.state);validateExpansionState(plan.state,registry);return plan;
}
// A paid cooling cast belongs to the existing condition clock. Its source and
// tool were consumed by the workshop owner; observing it requires no new fuel.
export function featureHookCoolingActive(state) {
    const c=state.simulation?.conditions[FEATURE_HOOK]?.[FEATURE_HOOK_COOLING_CONDITION];
    return !!c&&c.intensity>0&&Number.isFinite(c.expiresAt)&&c.expiresAt>state.clock&&featureOwnedGear(state,FEATURE_HOOK,'hook_pole',FEATURE_HOOK_POLE);
}
function npcActionReasons(state,b,c) {
    const p=state.simulation?.people[c.actorId],body=p?.body,v=p?.vitals,targets=targetsOf(c),reasons=[];
    if(!foes.includes(c.actorId)||!p||p.life!=='alive'||p.location!=='Village'||!body||!validVitals(v)||v.health<=1||b.fighters[c.actorId]?.status!=='active')return ['The actual tollkeeper is unavailable.'];
    if(c.type==='guard') {
        if(!body.can_brace||v.stamina<2||targets.length!==1||targets[0]!==c.actorId||b.guards.some(g=>g.target===c.actorId))reasons.push('The tollkeeper cannot hold another bodily brace.');
        if(c.technique==='frame'&&(!featureOwnedGear(state,c.actorId,'field_frame',FEATURE_HARNESS)||b.wedge||b.exposed[c.actorId]))reasons.push('The equipped frame is not supported.');
        else if(!['frame','brace'].includes(c.technique))reasons.push('Unsupported tollkeeper guard.');
    }else if(c.type==='strike') {
        if(!Number.isFinite(body.attack)||body.attack<=0||targets.length!==1||b.fighters[targets[0]]?.status!=='active'||b.fighters[targets[0]]?.side===b.fighters[c.actorId].side)reasons.push('The tollkeeper needs an actual opposing body.');
        if(!['rush','hook','jab'].includes(c.technique)||v.stamina<(c.technique==='jab'?1:2))reasons.push('The tollkeeper lacks the chosen strike effort.');
        if(c.technique==='rush'&&(c.actorId!==FEATURE_SHIELD||!featureOwnedGear(state,c.actorId,'field_frame',FEATURE_HARNESS)||b.wedge||b.exposed[c.actorId]))reasons.push('The fixed shield rush lacks its equipped supported frame.');
        if(c.technique==='hook'&&(c.actorId!==FEATURE_HOOK||!featureOwnedGear(state,c.actorId,'hook_pole',FEATURE_HOOK_POLE)||featureHookCoolingActive(state)))reasons.push('The actual hook pole cannot pull now.');
    }else reasons.push('Unsupported tollkeeper method.');
    return reasons;
}
function opportunityReasons(b,c) {
    if(!c.opportunity)return [];
    const o=b.opportunity;
    if(b.schema<FEATURE_REFERENCE_BATTLE_SCHEMA||!o||c.actorId!=='player'||o.playerMove!==b.fighters.player.moves)return ['No current defense-earned next-choice opening.'];
    if(c.opportunity==='retreat'&&c.type==='escape')return [];
    if(c.opportunity==='counter'&&c.type==='strike'&&targetsOf(c).length===1&&targetsOf(c)[0]===o.attackerId&&b.fighters[o.attackerId]?.status==='active')return [];
    return ['Use this opening once for retreat or a counter against its actual attacker.'];
}
function closeOpportunity(b,outcome,action) {
    if(!b.opportunity)return null;
    const r={earnedAction:b.opportunity.earnedAction,attackerId:b.opportunity.attackerId,action,outcome};
    b.opportunityReceipts.push(r);b.opportunityReceipts=b.opportunityReceipts.slice(-16);b.opportunity=null;return r;
}
export function featureFighterOwnership(state,id) {
    if(id==='player')return 'native:player';
    return JSON.stringify({body:state.simulation?.people[id]?.body,equipment:state.simulation?.equipment[id]||{},owned:state.simulation?.owners[id]||{},progress:state.simulation?.progression[id]||{},sources:state.actors[id]?.sources||{}});
}
export function featureOwnedGear(state,id,slot,key) {
    return state.simulation?.equipment[id]?.[slot]===key&&(state.simulation.owners[id]?.[key]||0)>0&&!Object.values(state.simulation.custody).some(c=>c.holder===id&&c.key===key);
}
function bindingReasons(state,b,session,bindings,ids,context) {
    const reasons=[];
    for(const id of ids) {
        const f=bindings?.[id],v=id==='player'?context.vitals?.player:state.simulation.people[id]?.vitals;
        if(!f||f.ownerId!==id||f.sequence!==state.sequence||f.sessionId!==session.id||f.action!==b.actions||f.seed!==b.seed||f.ownership!==featureFighterOwnership(state,id)) {reasons.push(`Missing current native fighter binding: ${id}.`);continue;}
        const snapshot=f.snapshot,stats=snapshot?.stats;
        if(!stats||!Number.isFinite(snapshot.attackPower)||snapshot.attackPower<0||!Number.isFinite(snapshot.emptyStaminaMultiplier)||snapshot.emptyStaminaMultiplier<=0||!['attack_points','agility','intuition','defense','crit_rate','crit_multiplier','attack_speed'].every(k=>Number.isFinite(stats[k])&&stats[k]>=0)||stats.attack_speed<=0||!Number.isInteger(stats.attack_count||1)||(stats.attack_count||1)<1||(stats.attack_count||1)>32||!Number.isFinite(snapshot.shield)||snapshot.shield<0||!Number.isFinite(snapshot.shieldSkill)||snapshot.shieldSkill<0||snapshot.shieldSkill>100)reasons.push(`Unsupported actual native statistics: ${id}.`);
        if(!validVitals(v)||stats?.health!==v.health||stats?.stamina!==v.stamina||stats?.max_health!==v.max_health||stats?.max_stamina!==v.max_stamina)reasons.push(`Native vital binding changed: ${id}.`);
    }
    return reasons;
}
const validVitals=v=>v&&['health','stamina','max_health','max_stamina'].every(k=>Number.isFinite(v[k])&&v[k]>=0)&&v.max_health>1&&v.health<=v.max_health&&v.stamina<=v.max_stamina;
const liveIds=(b,side)=>Object.keys(b.fighters).filter(id=>b.fighters[id].status==='active'&&(!side||b.fighters[id].side===side));
const targetsOf=c=>c.targetIds|| (c.targetId?[c.targetId]:[]);
function method(state,id,key,choice,context,minimum=4) {
    const f=featurePowerFacts(state,context);
    return f[`power.${id}.owned`]&&f[`faculty.${id}.active`]&&f[`power.${id}.mastery`]>=minimum&&(!choice||f[`feature.powers.${key}.choice`]===choice);
}
function baseCostOf(state,b,c,context) {
    const id=c.actorId,type=c.type,mastery=id==='player'?state.simulation.powers.player||{}:{};
    if(type==='release'||type==='withdraw')return 0;
    if(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA) {
        if(c.opportunity==='counter')return 2;
        if(c.opportunity==='retreat')return 1;
        if(foes.includes(id)&&type==='strike')return c.technique==='jab'?1:2;
    }
    if(type==='strike')return targetsOf(c).length;
    if(type==='guard')return id===FEATURE_HELPER?((featurePowerFacts(state,context)['feature.party.drills']>=2||b.signal)?1:2):2;
    if(type==='track'||type==='read')return mastery[type==='track'?SKILL_IDS.trail:SKILL_IDS.inquiry]?.mastery>=8?1:2;
    if(type==='interpose')return targetsOf(c).length*(mastery[SKILL_IDS.brace]?.mastery>=8?1:2);
    if(type==='redirect')return mastery[SKILL_IDS.brace]?.mastery>=8?1:2;
    return type==='escape'||type==='signal'?1:2;
}
function costOf(state,b,c,context) {
    const base=baseCostOf(state,b,c,context);
    if(b.schema!==5)return base;
    const optional=quoteRemainderCombatObjectivesBattleAction(state,c,context);
    return optional?optional.cost:quoteRemainderCombatFitAction(state,b,c,context,base).cost;
}
export function previewFeatureBattleAction(state,registry,c,context,bindings={}) {
    const session=state.simulation?.sessions.player,b=session?.nativeBattle,reasons=[];
    try{validateFeatureBattle(b,session,state);}catch(error){return {eligible:false,reasons:[error.message],cost:0};}
    if(c.sessionId!==session.id||c.sequence!==state.sequence||c.action!==b.actions||c.seed!==b.seed)reasons.push('This action belongs to an earlier session, sequence, RNG position or action.');
    const optional=b.schema===5?quoteRemainderCombatObjectivesBattleAction(state,c,context):null;
    const role=b.fighters[c.actorId];
    if(!role||role.status!=='active')reasons.push('That fighter has already left this encounter.');
    if(!optional?.special&&!['strike','guard','interpose','redirect','track','wedge','lash','read','signal','objective','escape','release','withdraw'].includes(c.type))reasons.push('Unsupported native action.');
    if(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA) {
        reasons.push(...opportunityReasons(b,c));
        if(foes.includes(c.actorId))reasons.push(...npcActionReasons(state,b,c));
        else if(c.technique!=null)reasons.push('The tollkeeper’s fixed technique cannot be borrowed.');
    }
    const targets=targetsOf(c),allied=liveIds(b,'attackers'),hostile=liveIds(b,'defenders');
    if(new Set(targets).size!==targets.length)reasons.push('A target cannot be paid or affected twice.');
    if(c.type==='strike') {
        if(!targets.length||targets.length>2||targets.some(id=>b.fighters[id]?.status!=='active'||b.fighters[id].side===role?.side))reasons.push('Select one or two active opponents.');
        if(targets.length>1&&!(c.actorId==='player'&&method(state,SKILL_IDS.trail,'trail','opening',context,6)&&targets.every(id=>b.focused.includes(id))))reasons.push('Splitting a strike needs mastery six, opening training and both currently tracked targets.');
        reasons.push(...bindingReasons(state,b,session,bindings,[c.actorId,...targets,...b.guards.filter(g=>targets.includes(g.target)).map(g=>g.by)],context));
    }else if(['guard','interpose','redirect','lash'].includes(c.type)) {
        if(!targets.length||targets.some(id=>b.fighters[id]?.status!=='active'||b.fighters[id]?.side!==role?.side)||targets.some(id=>b.guards.some(g=>g.target===id)))reasons.push('Choose an active ally without an existing held guard.');
        if(c.type==='guard'&&targets.length!==1)reasons.push('An ordinary guard covers one fighter.');
        if(c.type==='guard'&&c.actorId!==FEATURE_HELPER&&targets[0]!==c.actorId)reasons.push('An ordinary guard is a self guard.');
        if(c.actorId===FEATURE_HELPER&&c.type!=='guard')reasons.push('Lio uses his acquired braced guard, not the player’s methods.');
        if(c.type==='interpose'&&(!method(state,SKILL_IDS.brace,'brace','interpose',context)||targets.length>(method(state,SKILL_IDS.brace,'brace','interpose',context,6)?2:1)))reasons.push('Shared-frame targets exceed the currently learned function.');
        if(c.type==='redirect'&&(!method(state,SKILL_IDS.brace,'brace','redirect',context)||targets.length!==1||targets[0]!=='player'))reasons.push('Release-pressure training guards the player alone.');
        if(c.type==='lash'&&(!method(state,SKILL_IDS.timber,'timber','frame',context)||targets.length!==1))reasons.push('A kit lash needs the learned load-bearing frame and one ally.');
    }else if(c.type==='track') {
        if(c.actorId!=='player'||!method(state,SKILL_IDS.trail,'trail','opening',context)||!targets.length||targets.length>(method(state,SKILL_IDS.trail,'trail','opening',context,6)?2:1)||targets.some(id=>!hostile.includes(id)))reasons.push('Track only the current learned capacity of visible active opponents.');
    }else if(c.type==='read') {
        if(c.actorId!=='player'||!method(state,SKILL_IDS.inquiry,'inquiry','read',context)||targets.length!==1||!hostile.includes(targets[0]))reasons.push('Read one present opponent using the acquired shared-inquiry source.');
    }else if(c.type==='wedge') {
        if(c.actorId!=='player'||!method(state,SKILL_IDS.timber,'timber','wedge',context)||b.wedge)reasons.push('Split the support once using learned timber judgment and a real log.');
    }else if(c.type==='signal') {
        if(c.actorId!=='player'||!method(state,SKILL_IDS.inquiry,'inquiry','signal',context)||!allied.includes(FEATURE_HELPER)||b.signal||helperReasons(state,context,true).length)reasons.push('A signal needs your learned coordination and willing supported Lio, without an already waiting signal.');
    }else if(c.type==='objective') {
        if(c.actorId!=='player'||hostile.includes(FEATURE_SHIELD)&&!b.wedge)reasons.push('The braced shield blocks the gate. Make its holder yield or split the actual support first.');
    }else if(c.type==='escape'||c.type==='withdraw') {
        if(c.actorId!=='player')reasons.push('Only the player chooses the party’s retreat.');
    }else if(c.type==='release'&&c.actorId!==FEATURE_HELPER)reasons.push('Only the consenting helper can be released separately.');
    if(c.actorId!== 'player'&&!['strike','guard','release'].includes(c.type))reasons.push('This person has no acquired support for the requested method.');
    if(c.actorId===FEATURE_HELPER&&!['guard','release'].includes(c.type))reasons.push('Lio agreed to guard support, not an attacking role.');
    if(c.actorId===FEATURE_HELPER&&c.type!=='release')reasons.push(...helperReasons(state,context,true));
    if(c.actorId==='player'&&['interpose','redirect','wedge','lash'].includes(c.type)&&(context.facts?.['body.handsTender']!==false||!Number.isFinite(context.facts?.strength)||context.facts.strength<8))reasons.push('This frame/material function needs recovered hands and current Strength eight.');
    const v=c.actorId==='player'?context.vitals?.player:state.simulation.people[c.actorId]?.vitals;
    if(!validVitals(context.vitals?.player)||!validVitals(v))reasons.push('Current native fighter vitals are unavailable or invalid.');
    let cost=baseCostOf(state,b,c,context);
    if(c.type==='strike'&&bindings[c.actorId]?.snapshot&&!(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA&&(foes.includes(c.actorId)||c.opportunity))){const efficiency=bindings[c.actorId].snapshot.stats.stamina_efficiency||1; if(!Number.isFinite(efficiency)||efficiency<=0)reasons.push('Unsupported native stamina efficiency.');else cost=Math.min(v?.stamina||0,targets.length/efficiency);}
    const fitQuote=b.schema===5?quoteRemainderCombatFitAction(state,b,c,context,cost):null;
    if(fitQuote){reasons.push(...fitQuote.reasons);cost=fitQuote.cost;}
    if(optional){reasons.push(...optional.reasons);cost=optional.cost;}
    if(!['release','withdraw'].includes(c.type)&&(!Number.isFinite(cost)||!v||v.health<=1||v.stamina<cost))reasons.push('The actual fighter lacks recovery or the required stamina.');
    if(c.actorId===FEATURE_HELPER&&c.type==='guard'&&(state.actors[FEATURE_HELPER].resources.brace_effort||0)<1)reasons.push('Lio has no actual guard effort left.');
    const stock=c.type==='wedge'?FEATURE_LOG:c.type==='lash'?FEATURE_KIT:null;
    if(stock&&(!(context.gameplay?.player?.inventory[stock]>0)||Object.values(state.simulation.custody).some(r=>r.holder==='player'&&r.key===stock)))reasons.push('Use a real unencumbered player-owned material.');
    // Escape/release/withdraw are the recovery path when a native binding/source fails.
    return {eligible:reasons.length===0,reasons,cost,targets,stock,fitQuote,optional,escapeGain:fitQuote?.escapeGain};
}
function removeFighter(plan,id,status) {
    const session=plan.state.simulation.sessions.player,b=session.nativeBattle;b.fighters[id].status=status;
    session.participants=session.participants.filter(p=>p!==id);b.guards=b.guards.filter(g=>g.by!==id&&g.target!==id);b.focused=b.focused.filter(p=>p!==id);delete b.exposed[id];if(id===FEATURE_HELPER)b.signal=false;
}
function finish(plan,registry,result,context={}) {
    const state=plan.state,s=state.simulation,session=s.sessions.player,b=session.nativeBattle,success=['won','objective'].includes(result),cause=`feature-battle:${state.sequence}`;
    if(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA)closeOpportunity(b,'expired_finish',b.actions);
    if(b.schema===5){const module=finishRemainderCombatFit(state,session,state.sequence);if(module!=null)state.auditRemainder.modules.combat_fit=module;const returned=settleRemainderCombatObjectivesBattle(plan,session,result,context);if(returned.length)applySimulationEffects(plan,returned,{actorId:'player'},registry,cause);}
    const effects=[af('feature.battle.lastResult',result),af('feature.battle.lastReceipt',session.id),af('feature.battle.lastActions',b.actions),af('feature.battle.lastGuards',b.guardsTaken),
        {type:'knowledge',key:'feature.battle.result',stage:'understood',value:`Sluice result: ${result}; ${b.actions} committed native actions, gate ${b.objective.progress}/3, escape ${b.escape.progress}/${b.escape.required}, ${b.guardsTaken} guarded attempts. Spent materials, fatigue and wounds remain. Encounter receipt: ${session.id}.`}];
    if(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA&&b.opportunityReceipts.length) {
        const last=b.opportunityReceipts.at(-1);effects.push(af('feature.battle.lastOpeningOutcome',last.outcome),af('feature.battle.lastOpeningAction',last.action),af('feature.battle.lastOpeningEarnedAction',last.earnedAction));
    }
    if(success&&!state.actors.player.facts['feature.battle.routeCleared'])effects.push(af('feature.battle.routeCleared'),{type:'xp',skill:'Combat',amount:12});
    if(b.fighters[FEATURE_HELPER])effects.push(af('feature.battle.lastHelperStatus',b.fighters[FEATURE_HELPER].status),{type:'relationship',target:FEATURE_HELPER,axis:'familiarity',amount:1,text:`Agreed sluice support ended ${result}; ${b.guardsTaken} guarded attempts. Actual wounds and remaining means persist.`});
    if(b.guardsTaken>0&&b.fighters[FEATURE_HELPER])effects.push({type:'progress',actor:FEATURE_HELPER,track:'feature_party',field:'guarded_encounters',amount:1});
    applySimulationEffects(plan,effects,{actorId:'player'},registry,cause);
    state.actors.player.completed[session.commandId]=(state.actors.player.completed[session.commandId]||0)+1;
    finishFieldCareWatch(state,session.id);
    s.log.push({at:state.clock,cause,text:`Sluice claim: ${result}.`});s.log=s.log.slice(-100);delete s.sessions.player;
}
export function commitFeatureBattleAction(state,registry,c,context,bindings={}) {
    const quote=previewFeatureBattleAction(state,registry,c,context,bindings);check(quote.eligible,quote.reasons.join(' '));
    const plan=planFor(state,context),s=plan.state.simulation,session=s.sessions.player,b=session.nativeBattle;
    const hp=id=>id==='player'?plan.vitals.player:s.people[id].vitals;
    const name=id=>id==='player'?'You':id===FEATURE_HELPER?'Lio':id===FEATURE_SHIELD?'Nera':'Oren';
    const random=()=>{b.seed=xorshift32(b.seed);return b.seed/0x100000000;};
    const role=b.fighters[c.actorId],hadStamina=hp(c.actorId).stamina>0;hp(c.actorId).stamina-=quote.cost;
    let result=null,targets=quote.targets,outcomes=[],fieldOutcomes=[],opportunityReceipt=null;
    const fitReceipts=[];
    beforeRemainderCombatObjectivesBattleAction(plan,c,context);
    const optionalResult=applyRemainderCombatObjectivesBattleAction(plan,c,context);
    if(optionalResult.effects?.length)applySimulationEffects(plan,optionalResult.effects,{actorId:'player'},registry,`feature-action:${state.sequence+1}`);
    const reference=b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA;
    if(reference&&c.actorId==='player'&&b.opportunity)opportunityReceipt=closeOpportunity(b,c.opportunity==='retreat'?'used_retreat':c.opportunity==='counter'?'used_counter':'expired_choice',b.actions+1);
    if(optionalResult.handled){b.last=optionalResult.text;if(optionalResult.escapeGain)b.escape.progress=Math.min(b.escape.required,b.escape.progress+optionalResult.escapeGain);}
    else if(c.type==='withdraw'){b.last='You withdraw before another blow. Spent supplies and injuries remain.';result='withdrawn';}
    else if(c.type==='release'){removeFighter(plan,c.actorId,'released');b.last='Lio steps out by agreement; his own condition and equipment remain.';}
    else if(['guard','interpose','redirect','lash'].includes(c.type)) {
        if(c.actorId===FEATURE_HELPER){plan.state.actors[FEATURE_HELPER].resources.brace_effort--;b.signal=false;}
        if(c.type==='lash')applySimulationEffects(plan,[{type:'item',key:FEATURE_KIT,amount:-1}],{actorId:'player'},registry,`feature-action:${state.sequence+1}`,{spending:true});
        for(const target of targets)b.guards.push({by:c.actorId,target,mode:c.type==='guard'?'ordinary':c.type});
        b.last=`${name(c.actorId)} prepared ${c.type} for ${targets.map(name).join(' and ')}; spent ${quote.cost} stamina${c.actorId===FEATURE_HELPER?' and one guard effort':''}${c.type==='lash'?' and one kit':''}.`;
    }else if(c.type==='track'){b.focused=[...targets];b.last=`You tracked ${targets.map(name).join(' and ')}. The next corresponding native strike uses the actual opening.`;}
    else if(c.type==='read') {
        const id=targets[0];b.guards=b.guards.filter(g=>g.by!==id);b.exposed[id]=method(state,SKILL_IDS.inquiry,'inquiry','read',context,6)?2:1;
        b.last=`You compared ${name(id)}’s visible response and interrupted the held frame. ${b.exposed[id]} native strike opening${b.exposed[id]===1?'':'s'} remain.`;
    }else if(c.type==='wedge') {
        applySimulationEffects(plan,[{type:'item',key:FEATURE_LOG,amount:-1}],{actorId:'player'},registry,`feature-action:${state.sequence+1}`,{spending:true});b.wedge=true;
        b.guards=b.guards.filter(g=>g.by!==FEATURE_SHIELD);b.objective.progress=Math.min(3,b.objective.progress+(method(state,SKILL_IDS.timber,'timber','wedge',context,6)?2:1));
        b.last='Your real log split the shield support. Anchoring ended, and the gate gained actual progress.';
    }else if(c.type==='signal'){b.signal=true;b.last='Lio acknowledges the learned release signal. His next guard spends one stamina and one of his own guard efforts.';}
    else if(c.type==='objective'){b.objective.progress++;b.last=`You raised the gate: ${b.objective.progress}/3. The tollkeepers can still strike until passage is secured.`;}
    else if(c.type==='escape') {
        const gain=quote.escapeGain??(c.opportunity==='retreat'&&reference?2:method(state,SKILL_IDS.trail,'trail','exit',context,6)?2:1);b.escape.progress=Math.min(b.escape.required,b.escape.progress+gain);
        b.last=`You advanced the retreat line: ${b.escape.progress}/${b.escape.required}${c.opportunity==='retreat'&&reference?' using the defense-earned opening (1 stamina)':''}. A landed shield rush can close one step.`;
    }else if(c.type==='strike') {
        const attacker=bindings[c.actorId].snapshot,lines=[];
        for(const requested of targets) {
            let targetId=requested,g=b.guards.find(g=>g.target===requested);
            if(g?.by===FEATURE_HELPER&&!(b.schema===5?remainderCombatFitLioSupported(plan.state):featurePowerFacts(plan.state,context)['skills.lioSupported'])){removeFighter(plan,FEATURE_HELPER,'unsupported');g=null;}
            const prepared=b.schema===5?prepareRemainderCombatObjectivesIncomingGuard(plan,c,requested,context):null;
            if(prepared)g=prepared.guard;
            if(g&&b.fighters[g.by]?.status==='active'&&hp(g.by).health>1){targetId=g.by;if(!prepared)b.guards=b.guards.filter(x=>x!==g);b.guardsTaken++;}
            const victim=bindings[targetId].snapshot,focused=b.focused.includes(requested),exposed=(b.exposed[requested]||0)>0;
            const stats={...victim.stats},temporaryShield=prepared?.temporaryShield??(g?.mode==='lash'?4:0);
            if(b.schema===5)stats.stamina=hp(targetId).stamina;
            if(g)stats.defense+=prepared?.defenseBonus??(g.mode==='interpose'?3:g.mode==='redirect'?1:2);
            if(temporaryShield)stats.block_chance=Math.max(stats.block_chance||0,.65);
            const hookAftermath=b.schema===5?remainderCombatFitHookAftermath(plan.state,b,targetId):null;
            const strike=rollCombatStrike({attackPower:attacker.attackPower*(hadStamina&&hp(c.actorId).stamina===0?(attacker.emptyStaminaMultiplier||.5):1),attacker:attacker.stats,target:stats,shield:Math.max(victim.shield,temporaryShield),shieldSkill:victim.shieldSkill,
                hitModifier:(focused?1.25:1)*(exposed?1.2:1)*(reference&&c.opportunity==='counter'?1.2:1),damageModifier:targets.length>1?.65:reference&&c.opportunity==='counter'?1.2:1,random});
            const previousHealth=hp(targetId).health;
            const damage=strike.kind==='hit'?mitigateCombatDamage(strike.values,stats.defense):0;hp(targetId).health=Math.max(1,hp(targetId).health-damage);b.lastTarget=targetId;
            fieldOutcomes.push({targetId,kind:strike.kind,damage:previousHealth-hp(targetId).health,guarded:!!g});
            if(focused)b.focused=b.focused.filter(id=>id!==requested);if(exposed)b.exposed[requested]--;
            const anchored=foes.includes(c.actorId)&&liveIds(b).includes(FEATURE_SHIELD)&&featureOwnedGear(plan.state,FEATURE_SHIELD,'field_frame',FEATURE_HARNESS)&&!b.wedge;
            if(g&&strike.kind!=='evaded'&&(g.mode==='redirect'||g.by===FEATURE_HELPER&&featurePowerFacts(state,context)['feature.party.drills']>=4)&&!anchored)hp(c.actorId).stamina=Math.max(0,hp(c.actorId).stamina-2);
            if(c.actorId===FEATURE_SHIELD&&(!reference||c.technique==='rush')&&strike.kind==='hit'&&requested==='player')b.escape.progress=Math.max(0,b.escape.progress-1);
            if(c.actorId===FEATURE_HOOK&&(!reference||c.technique==='hook')&&featureOwnedGear(plan.state,FEATURE_HOOK,'hook_pole',FEATURE_HOOK_POLE)&&strike.kind==='hit'){hp(targetId).stamina=Math.max(0,hp(targetId).stamina-(hookAftermath?.extraStaminaLoss??1));b.guards=b.guards.filter(x=>x.by!==targetId);if(hookAftermath){const r=remainderCombatFitHookReceipt(targetId,hookAftermath,{action:b.actions+1,sequence:state.sequence+1});if(r)fitReceipts.push(r);}}
            const defended=!!g&&foes.includes(c.actorId)&&requested==='player'&&hp(targetId).health>1&&(strike.kind==='blocked'||strike.kind==='hit'&&damage<mitigateCombatDamage(strike.values,victim.stats.defense));
            outcomes.push({targetId,kind:strike.kind,damage,defended});
            if(reference&&defended&&!b.opportunity) {
                b.opportunity={earnedAction:b.actions+1,attackerId:c.actorId,defenderId:targetId,playerMove:b.fighters.player.moves};
                lines.push('The held defense earned one next-choice opening: retreat for 1 stamina or counter for 2; any other player choice lets it expire.');
            }
            lines.push(`${reference&&c.technique==='hook'?name(c.actorId)+' committed a pole pull. ':reference&&c.technique==='rush'?name(c.actorId)+' rushed with the frame. ':reference&&c.technique==='jab'?name(c.actorId)+' used a short bodily jab. ':''}${name(c.actorId)} ${strike.kind==='hit'?`hit ${name(targetId)} for ${Math.round(damage*10)/10}${strike.critted?' (critical)':''}`:strike.kind==='blocked'?`met ${name(targetId)}’s full block`:`missed ${name(targetId)}`}${g&&anchored?' [anchored: fatigue counter resisted]':''}.`);
            if(hp(targetId).health===1){if(targetId==='player')result='lost';else removeFighter(plan,targetId,'yielded');}
            if(result)break;
        }
        b.last=lines.join(' ').slice(0,500);
    }
    b.actions++;role.moves++;plan.state.sequence++;
    recordFieldCareStrike(plan,registry,session,c,fieldOutcomes,context,featureOwnedGear(plan.state,FEATURE_HOOK,'hook_pole',FEATURE_HOOK_POLE));
    if(b.schema===5){const fit=settleRemainderCombatFitAction(plan.state,session,c,quote.fitQuote,{action:b.actions,sequence:plan.state.sequence});b.combatFit=retainRemainderCombatFitHookReceipts(fit.combatFit,fitReceipts);if(fit.module!=null)plan.state.auditRemainder.modules.combat_fit=fit.module;fitReceipts.unshift(...fit.receipt);}
    if(reference&&b.opportunity&&b.fighters[b.opportunity.attackerId]?.status!=='active')opportunityReceipt=closeOpportunity(b,'expired_target',b.actions);
    const receipt={action:b.actions,type:c.type,actorId:c.actorId,targets:[...targets],text:b.last,...(b.schema===5?{combatFit:fitReceipts,technique:c.technique??null}:{}),...(reference?{nonce:{sessionId:session.id,sequence:state.sequence,action:c.action,seed:c.seed},outcomes}: {})};
    b.receipts.push(receipt);b.receipts=b.receipts.slice(-16);
    // Parent consumes this actual staged result even when finish removes session.
    plan.referenceBattleAction={sessionId:session.id,action:b.actions,actorId:c.actorId,type:c.type};
    plan.featureBattleReceipt={...structuredClone(receipt),sessionId:session.id,sequence:plan.state.sequence,schema:b.schema,opportunity:opportunityReceipt};
    if(!result&&b.objective.progress>=3)result='objective';
    if(!result&&b.escape.progress>=b.escape.required)result='escaped';
    if(!result&&!liveIds(b,'defenders').length)result='won';
    if(result){if(result==='lost')plan.defeat=savedBattleLoss(foes.filter(id=>b.fighters[id]?.status==='active').map(name));finish(plan,registry,result,context);plan.featureBattleReceipt.result=result;if(reference)plan.featureBattleReceipt.opportunity=b.opportunityReceipts.at(-1)||null;}
    else if(reference)validateFeatureBattle(b,session,plan.state);
    plan.native={hpToFull:hp('player').max_health-hp('player').health,staminaToFull:hp('player').max_stamina-hp('player').stamina};
    validateExpansionState(plan.state,registry);return plan;
}
export function withdrawFeatureBattle(state,registry,context,token) {
    return commitFeatureBattleAction(state,registry,{...token,type:'withdraw',actorId:'player'},context);
}
export function featureBattleToken(state) {
    const s=state.simulation?.sessions.player,b=s?.nativeBattle;return isFeatureBattleSchema(b?.schema)?{sessionId:s.id,sequence:state.sequence,action:b.actions,seed:b.seed}:null;
}
export function featureNativeAction(state,context,id) {
    const b=state.simulation?.sessions.player?.nativeBattle;if(!isFeatureBattleSchema(b?.schema)||b.fighters[id]?.status!=='active')return null;
    if(b.schema===5){const optional=remainderCombatObjectivesNativeAction(state,context,id);if(optional?.handled)return optional.action;}
    if(id==='player'&&b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA) {
        // A newly earned choice belongs to the player. Native enemy cadence
        // continues while its one retained window awaits that next real choice.
        if(b.opportunity)return null;
        const conduct=state.referenceGameplay?.conduct.current;
        if(conduct?.status==='active'&&conduct.sessionId===state.simulation.sessions.player.id) {
            // Explicit conduct enrollment selects defensive automatic behavior;
            // material preparation and gate work remain actual chosen actions.
            if(b.guards.some(g=>g.target==='player')||context.vitals?.player?.stamina<2)return null;
            return {type:'guard',actorId:'player',targetId:'player'};
        }
    }
    if(id===FEATURE_HELPER){
        if(b.guards.some(g=>g.by===id)&&(b.schema===5?remainderCombatFitLioSupported(state):featurePowerFacts(state,context)['skills.lioSupported']))return null;
        if(helperReasons(state,context,true).length||state.simulation.people[id].vitals.stamina<costOf(state,b,{type:'guard',actorId:id,targetId:'player'},context))return {type:'release',actorId:id};
        if(b.guards.some(g=>g.target==='player'))return null;
        return {type:'guard',actorId:id,targetId:'player'};
    }
    if(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA&&foes.includes(id)) {
        const opponents=liveIds(b,'attackers'),candidates=[];
        if(id===FEATURE_SHIELD) {
            // Actual retreat pressure and actual allies needing cover choose the
            // frame. This authored fixed kit never scales with player level.
            if(b.escape.progress>0)candidates.push({type:'strike',actorId:id,targetId:'player',technique:'rush'});
            if(b.fighters[id].moves%3===0||b.exposed[FEATURE_HOOK])candidates.push({type:'guard',actorId:id,targetId:id,technique:'frame'});
            candidates.push({type:'strike',actorId:id,targetId:'player',technique:'rush'});
        }else {
            const exposedGuard=b.guards.find(g=>g.by===FEATURE_HELPER&&opponents.includes(g.by));
            const target=exposedGuard?.by||'player';
            candidates.push({type:'strike',actorId:id,targetId:target,technique:'hook'});
            if(featureHookCoolingActive(state)||!featureOwnedGear(state,id,'hook_pole',FEATURE_HOOK_POLE))candidates.push({type:'guard',actorId:id,targetId:id,technique:'brace'});
        }
        // A direct bodily jab still needs a living opponent and one real effort.
        for(const targetId of opponents)candidates.push({type:'strike',actorId:id,targetId,technique:'jab'});
        candidates.push({type:'guard',actorId:id,targetId:id,technique:'brace'});
        return candidates.find(c=>!npcActionReasons(state,b,c).length)||null;
    }
    if(id===FEATURE_SHIELD&&state.simulation.people[id].vitals.stamina>=2&&b.fighters[id].moves%3===0&&!b.wedge&&!b.exposed[id]&&!b.guards.some(g=>g.target===id))return {type:'guard',actorId:id,targetId:id};
    const opponents=liveIds(b,b.fighters[id].side==='defenders'?'attackers':'defenders');
    const target=id==='player'?(opponents.includes(FEATURE_SHIELD)?FEATURE_SHIELD:opponents[0]):id===FEATURE_HOOK?(b.guards.find(g=>g.by===FEATURE_HELPER)?.by||'player'):'player';
    if(!opponents.includes(target))return null;return {type:'strike',actorId:id,targetId:target};
}
export function featureBattleView(state,registry,context,bindings={}) {
    const session=state.simulation?.sessions.player,b=session?.nativeBattle;if(!isFeatureBattleSchema(b?.schema))return null;
    validateFeatureBattle(b,session,state);const token=featureBattleToken(state),actions=[];
    const add=(label,c)=>{const value={...token,actorId:'player',...c},p=previewFeatureBattleAction(state,registry,value,context,bindings);actions.push({id:`${c.type}:${targetsOf(c).join(':')}${c.opportunity?':'+c.opportunity:''}${c.maneuver?':'+c.maneuver:''}${c.useGripPreparation?':grip':''}${c.physicalPreparation?':'+c.physicalPreparation:''}`,label,command:value,eligible:p.eligible,reasons:p.reasons,cost:p.cost});};
    for(const id of liveIds(b,'defenders')){const label=id===FEATURE_SHIELD?'Nera':'Oren';add(`Strike ${label}`,{type:'strike',targetId:id});add(`Track ${label}’s opening`,{type:'track',targetId:id});add(`Read ${label}’s response`,{type:'read',targetId:id});}
    if(liveIds(b,'defenders').length===2){add('Track both native opponents',{type:'track',targetIds:foes});add('Split the native strike across both tracked opponents',{type:'strike',targetIds:foes});}
    add('Hold an ordinary self guard',{type:'guard',targetId:'player'});add('Prepare the release-pressure counter',{type:'redirect',targetId:'player'});
    for(const id of liveIds(b,'attackers'))add(`Interpose for ${id==='player'?'yourself':'Lio'}`,{type:'interpose',targetId:id});
    if(liveIds(b,'attackers').length===2)add('Hold a shared frame for both allies',{type:'interpose',targetIds:['player',FEATURE_HELPER]});
    add('Lash one kit into your next guard',{type:'lash',targetId:'player'});add('Split the anchored support with one log',{type:'wedge'});add('Give Lio the release signal',{type:'signal'});
    if(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA&&b.opportunity) {
        add('Use defended opening: retreat two steps · 1 stamina',{type:'escape',opportunity:'retreat'});
        add('Use defended opening: counter its attacker (+20% aim/damage) · 2 stamina',{type:'strike',targetId:b.opportunity.attackerId,opportunity:'counter'});
    }
    if(b.schema===5)for(const row of [...remainderCombatFitBattleChoices(b),...remainderCombatObjectivesBattleActions(state)])add(row.label,row.command);
    add('Raise the gate one step',{type:'objective'});add('Advance the retreat line',{type:'escape'});add('Withdraw with spent inputs retained',{type:'withdraw'});
    if(b.fighters[FEATURE_HELPER]?.status==='active')add('Release Lio by agreement',{type:'release',actorId:FEATURE_HELPER});
    return {id:session.id,token,last:b.last,objective:{...b.objective},escape:{...b.escape},guardsTaken:b.guardsTaken,
        ...(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA?{opportunity:b.opportunity?{earnedAction:b.opportunity.earnedAction,text:'One defense-earned next-choice opening. Choose retreat (1 stamina) or counter (+20% aim/damage, 2 stamina); another player action expires it.'}:null}: {}),
        fighters:Object.entries(b.fighters).map(([id,f])=>({id,label:id==='player'?'You':id===FEATURE_HELPER?'Lio':id===FEATURE_SHIELD?'Nera':'Oren',side:f.side,status:f.status,
            ...(id==='player'?{vitals:structuredClone(context.vitals?.player||{})}:id===FEATURE_HELPER?{vitals:structuredClone(state.simulation.people[id].vitals)}:{})})),actions};
}
