import {check, natural, object} from './basics.js';
import {remainderCombatFitHandsUsable} from './audit_remainder_combat_fit_facts.js';
// Deterministic hooks for root's existing schema5 native battle transaction.
// These stage changes/effects; the shared host still owns cadence and publish.
import {REMAINDER_COMBAT_OBJECTIVES as I,REMAINDER_COMBAT_OBJECTIVE_KEYS as K,combatObjectivesModule,
    ownedCombatObjectiveItem,fittingCarried,fittingReturnEffect,remainderMaintainedBraceSupported} from './audit_remainder_combat_objectives_content.js';
import {endRemainderCombatObjective} from './audit_remainder_combat_objectives_state.js';
import {SKILL_IDS} from './skill_expansion_content.js';
const exact=(x,fields)=>object(x)&&Object.keys(x).sort().join('|')===[...fields].sort().join('|');
const targets=c=>c.targetIds||(c.targetId?[c.targetId]:[]),battle=state=>state.simulation?.sessions?.player?.nativeBattle;
const stagedContext=(plan,context)=>({...context,gameplay:plan.gameplay,vitals:plan.vitals,equipment:plan.equipment});
const item=(key,amount,returned=false)=>({type:'item',actor:'player',key,amount,...(returned?{reservationReturn:true}:{})});
const live=(b,id)=>b.fighters?.[id]?.status==='active';
const admissionPreparation={guard:K.guard,brace_wrap:K.wrap,traversal:K.traversal};
export function remainderCombatObjectivesAdmissionReasons(state,context={},command={}){
    if(state.auditRemainder?.schema!==1)return command.physicalPreparation?['Physical preparations require explicit remainder enrollment.']:[];
    const choice=command.physicalPreparation,reasons=[];
    if(state.actors.player.facts['feature.battle.routeCleared']===true&&state.actors.player.facts['remainder.combat_objectives.practiceWatchReady']!==true)reasons.push('Secure one agreed supplied practice watch before a post-passage encounter.');
    if(choice!=null){if(!Object.hasOwn(admissionPreparation,choice))reasons.push('Choose a declared guard, learned wrap or traversal preparation.');
        else if(!ownedCombatObjectiveItem(state,context,admissionPreparation[choice]))reasons.push('Carry one actual owned, unequipped and unborrowed crafted preparation.');
        if(choice==='traversal'&&!ownedCombatObjectiveItem(state,context,K.rope))reasons.push('Reserve one actual owned, unequipped and unborrowed Survey rope.');
        if(command.maneuver||command.opportunity||command.useGripPreparation)reasons.push('Admission chooses a single physical preparation, without a maneuver or defended opening.');}
    const e=combatObjectivesModule(state)?.recovery.current;
    if(e&&(e.sessionId||e.status!=='active'||state.sequence<e.startedSequence||(state.simulation?.owners?.[I.owner]?.[K.fitting]||0)!==1||state.simulation?.custody?.[I.loan]))reasons.push('This fitting objective needs its accepted new attempt and Eda’s same available marked stock.');
    return reasons;
}
export function initializeRemainderCombatObjectivesBattle(plan,command,context={}){
    const state=plan.state,session=state.simulation.sessions.player,b=session.nativeBattle;
    check(state.schema===11&&state.auditRemainder?.schema===1&&b.schema===5,'Only an explicitly admitted schema5 encounter accepts new objective fields.');
    const reasons=remainderCombatObjectivesAdmissionReasons(state,stagedContext(plan,context),command);check(!reasons.length,reasons.join(' '));
    const choice=command.physicalPreparation,itemKey=admissionPreparation[choice],effects=[];
    const physical=choice?{kind:choice==='traversal'?'traversal':'guard',itemKey,remaining:1,admittedSequence:state.sequence,admittedAction:0,
        reservationId:`${session.id}:physical`,ropeKey:choice==='traversal'?K.rope:null,consumedAction:null}:null;
    if(physical){effects.push(item(itemKey,-1));if(physical.ropeKey)effects.push(item(physical.ropeKey,-1));}
    const e=combatObjectivesModule(state)?.recovery.current;
    if(e)e.sessionId=session.id;
    state.actors.player.facts['remainder.combat_objectives.practiceWatchReady']=false;
    b.combatObjectives={schema:1,profile:I.profile,physical,recoveryAttemptId:e?.id||null,recoveryReceipt:null,maintainedReceipts:[]};
    return effects;
}
export function validateRemainderCombatObjectivesBattle(b,session,state){
    if(b?.schema!==5){check(b?.combatObjectives===undefined,'Frozen schema3/4 encounters cannot acquire new objective fields.');return;}
    const x=b.combatObjectives;
    check(state?.schema===11&&state.auditRemainder?.schema===1&&exact(x,['schema','profile','physical','recoveryAttemptId','recoveryReceipt','maintainedReceipts'])&&x.schema===1&&x.profile===I.profile,'Invalid schema5 objective binding.');
    const p=x.physical;
    if(p!==null){check(exact(p,['kind','itemKey','remaining','admittedSequence','admittedAction','reservationId','ropeKey','consumedAction'])&&
        ['guard','traversal'].includes(p.kind)&&p.itemKey===(p.kind==='traversal'?K.traversal:p.itemKey===K.wrap?K.wrap:K.guard)&&
        [0,1].includes(p.remaining)&&p.admittedSequence===Number(session.id.slice(11))&&p.admittedAction===0&&p.reservationId===`${session.id}:physical`&&
        p.ropeKey===(p.kind==='traversal'?K.rope:null)&&(p.remaining===1?p.consumedAction===null:natural(p.consumedAction)&&p.consumedAction>0&&p.consumedAction<=b.actions),'Invalid finite physical stock reservation/charge.');}
    const e=combatObjectivesModule(state)?.recovery.current;
    check(x.recoveryAttemptId===null||e?.id===x.recoveryAttemptId&&e.sessionId===session.id&&e.status==='active','Recovery battle lacks its exact accepted objective.');
    if(x.recoveryReceipt!==null)check(e&&JSON.stringify(x.recoveryReceipt)===JSON.stringify(e.recoveryReceipt)&&x.recoveryReceipt.action<=b.actions,'Recovery battle lost its committed custody receipt.');
    else check(!e||e.sessionId!==session.id||e.recoveryReceipt===null,'Recovery custody lacks its active battle receipt.');
    const maintained=b.guards.filter(g=>g.mode==='maintained');check(maintained.length<=1,'Only one brace can be maintained.');
    for(const g of maintained)check(exact(g,['by','target','mode','remaining','activationAction','sourceAcquiredAt','expiresAt'])&&g.by==='player'&&['player','partyPartner'].includes(g.target)&&
        live(b,g.by)&&live(b,g.target)&&[1,2].includes(g.remaining)&&natural(g.activationAction)&&g.activationAction>0&&g.activationAction<=b.actions&&natural(g.sourceAcquiredAt)&&g.sourceAcquiredAt<=state.clock&&natural(g.expiresAt)&&g.expiresAt>g.sourceAcquiredAt,'Invalid maintained brace capacity/source/expiry.');
    for(const g of b.guards.filter(g=>g.mode==='prepared_guard'))check(exact(g,['by','target','mode','preparationKey'])&&g.by==='player'&&g.target==='player'&&[K.guard,K.wrap].includes(g.preparationKey)&&p?.kind==='guard'&&p.itemKey===g.preparationKey&&p.remaining===0,'Prepared guard lacks its actually spent physical charge.');
    check(Array.isArray(x.maintainedReceipts)&&x.maintainedReceipts.length<=16,'Invalid maintained brace history budget.');
    for(const r of x.maintainedReceipts)check(exact(r,['action','target','event','remaining','paid'])&&natural(r.action)&&r.action>0&&r.action<=b.actions&&['player','partyPartner'].includes(r.target)&&
        ['activate','upkeep','insufficient_upkeep','unsupported','release','strike','helper_loss','settlement'].includes(r.event)&&natural(r.remaining)&&r.remaining<=2&&r.paid===(r.event==='activate'?2:r.event==='upkeep'?1:0),'Invalid committed maintained guard cost/capacity receipt.');
}
export function quoteRemainderCombatObjectivesBattleAction(state,c,context={}){
    const b=battle(state);if(b?.schema!==5)return null;
    const special=['maintain_brace','release_brace','recover_fitting'].includes(c.type),physical=c.physicalPreparation!=null;
    if(!special&&!physical)return null;
    const reasons=[],ts=targets(c),session=state.simulation.sessions.player,x=b.combatObjectives;
    if(c.actorId!=='player')reasons.push('These optional preparations and objective actions belong to the current player.');
    if(c.maneuver||c.opportunity||c.useGripPreparation)reasons.push('Choose one distinct action without stacking a maneuver, defended opening or grip discount.');
    let cost=0;
    if(c.type==='maintain_brace'){
        cost=2;if(physical||!remainderMaintainedBraceSupported(state,context)||ts.length!==1||!['player','partyPartner'].includes(ts[0])||!live(b,ts[0])||b.guards.some(g=>g.target===ts[0]||g.mode==='maintained'))reasons.push('Maintain one free allied target with actual mastery six, Shared frame training, active acquired source and supported body.');
        if(ts[0]==='partyPartner'){
            const probe={target:ts[0],sourceAcquiredAt:state.actors.player.sources?.[SKILL_IDS.brace]?.acquiredAt,expiresAt:state.clock+4};
            if(!remainderMaintainedBraceSupported(state,context,probe))reasons.push('Lio needs his own current consent, source, body and actual equipped owned harness.');}
    }else if(c.type==='release_brace'){
        if(physical||ts.length||!b.guards.some(g=>g.mode==='maintained'&&g.by==='player'))reasons.push('Release your actual held maintained brace.');
    }else if(c.type==='recover_fitting'){
        cost=1;const e=combatObjectivesModule(state)?.recovery.current;
        if(physical||ts.length||!e||e.id!==x.recoveryAttemptId||e.status!=='active'||e.sessionId!==session.id||e.recoveryReceipt||x.recoveryReceipt||
            (state.simulation.owners[I.owner]?.[K.fitting]||0)!==1||state.simulation.custody[I.loan]||context.facts?.['body.handsTender']!==false||!remainderCombatFitHandsUsable(state)||!(context.vitals?.player?.health>1))reasons.push('Recover Eda’s actual loose fitting once during the already accepted exact gate objective, using recovered hands.');
    }else{
        cost=2;const p=x.physical;
        if(!['guard','traversal'].includes(c.physicalPreparation)||!p||p.kind!==c.physicalPreparation||p.remaining!==1)reasons.push('Use only your admitted unspent physical preparation.');
        if(c.physicalPreparation==='guard'&&(c.type!=='guard'||ts.length!==1||ts[0]!=='player'||b.guards.some(g=>g.target==='player')))reasons.push('The physical guard preparation covers your one currently unguarded body.');
        if(c.physicalPreparation==='traversal'&&(c.type!=='escape'||ts.length))reasons.push('The traversal preparation belongs to one deliberate escape action.');
    }
    if(!(context.vitals?.player?.stamina>=cost)||!(context.vitals?.player?.health>1))reasons.push('Recover enough actual stamina and health before this paid action.');
    return {special,eligible:!reasons.length,reasons,cost,targets:ts,stock:null};
}
function receipt(b,target,event,remaining,paid){b.combatObjectives.maintainedReceipts.push({action:b.actions+1,target,event,remaining,paid});b.combatObjectives.maintainedReceipts=b.combatObjectives.maintainedReceipts.slice(-16);}
function clearMaintained(b,event,filter=()=>true){for(const g of b.guards.filter(g=>g.mode==='maintained'&&filter(g)))receipt(b,g.target,event,g.remaining,0);b.guards=b.guards.filter(g=>g.mode!=='maintained'||!filter(g));}
export function beforeRemainderCombatObjectivesBattleAction(plan,c,context={}){
    const b=battle(plan.state);if(b?.schema!==5)return;
    const current=stagedContext(plan,context);
    clearMaintained(b,'unsupported',g=>!live(b,g.by)||!live(b,g.target)||!remainderMaintainedBraceSupported(plan.state,current,g));
    if(c.actorId==='player'&&c.type==='strike')clearMaintained(b,'strike');
    if(c.type==='release'&&c.actorId==='partyPartner')clearMaintained(b,'helper_loss',g=>g.target==='partyPartner');
}
// Root has already paid quote.cost. Return handled=false for its old branches.
export function applyRemainderCombatObjectivesBattleAction(plan,c,context={}){
    const state=plan.state,session=state.simulation.sessions.player,b=session.nativeBattle;if(b.schema!==5)return {handled:false,effects:[]};
    if(c.type==='maintain_brace'){
        const target=targets(c)[0],source=state.actors.player.sources[SKILL_IDS.brace];
        const expiresAt=Math.min(state.clock+4,source.expiresAt??state.clock+4);
        b.guards.push({by:'player',target,mode:'maintained',remaining:2,activationAction:b.actions+1,sourceAcquiredAt:source.acquiredAt,expiresAt});receipt(b,target,'activate',2,2);
        return {handled:true,effects:[],text:`You maintain one real brace for ${target==='player'?'yourself':'Lio'}: 2 stamina paid, at most two incoming attempts; each needs 1 upkeep before mitigation, including a miss.`};
    }
    if(c.type==='release_brace'){clearMaintained(b,'release');return {handled:true,effects:[],text:'You release the maintained brace. Activation and upkeep remain spent.'};}
    if(c.type==='recover_fitting'){
        const r={sessionId:session.id,sequence:state.sequence+1,action:b.actions+1,at:state.clock,owner:I.owner,key:K.fitting,loanId:I.loan,cause:`feature-action:${state.sequence+1}`};
        b.combatObjectives.recoveryReceipt=r;combatObjectivesModule(state).recovery.current.recoveryReceipt=structuredClone(r);
        return {handled:true,effects:[{type:'custody',from:I.owner,to:'player',key:K.fitting,count:1,loanId:I.loan}],text:'You spent one stamina to carry Eda’s exact marked fitting under her ownership. Raise the gate with it intact; winning the fight alone does not qualify.'};
    }
    if(c.physicalPreparation){const p=b.combatObjectives.physical;p.remaining=0;p.consumedAction=b.actions+1;
        if(p.kind==='guard'){b.guards.push({by:'player',target:'player',mode:'prepared_guard',preparationKey:p.itemKey});return {handled:true,effects:[],text:`You spent the actual ${p.itemKey===K.wrap?'learned brace wrap':'kit brace pad'} and two stamina for one stronger physical self guard.`};}
        return {handled:true,effects:[],escapeGain:2,text:'You spent the traversal lashing and two stamina to gain two actual retreat steps. The same reserved Survey rope remains due back at settlement.'};}
    return {handled:false,effects:[]};
}
// Run before rollCombatStrike for EACH requested hostile attempt. A miss still
// consumes one upkeep/capacity; failure drops the guard before any mitigation.
export function prepareRemainderCombatObjectivesIncomingGuard(plan,c,requested,context={}){
    const b=battle(plan.state);if(b?.schema!==5)return null;
    const g=b.guards.find(g=>g.target===requested);if(!g||!['maintained','prepared_guard'].includes(g.mode))return null;
    if(g.mode==='prepared_guard'){b.guards=b.guards.filter(x=>x!==g);return {guard:g,defenseBonus:g.preparationKey===K.wrap?5:4,temporaryShield:g.preparationKey===K.wrap?5:4};}
    if(!remainderMaintainedBraceSupported(plan.state,stagedContext(plan,context),g)||!live(b,g.by)||!live(b,g.target)){
        clearMaintained(b,'unsupported');return {guard:null,defenseBonus:0,temporaryShield:0};}
    if(plan.vitals.player.stamina<1){clearMaintained(b,'insufficient_upkeep');return {guard:null,defenseBonus:0,temporaryShield:0};}
    plan.vitals.player.stamina-=1;g.remaining--;receipt(b,g.target,'upkeep',g.remaining,1);
    const held={...g};if(g.remaining===0)b.guards=b.guards.filter(x=>x!==g);
    return {guard:held,defenseBonus:3,temporaryShield:0};
}
export function settleRemainderCombatObjectivesBattle(plan,session,result,context={}){
    const b=session.nativeBattle;if(b.schema!==5)return [];
    const x=b.combatObjectives,e=combatObjectivesModule(plan.state)?.recovery.current,effects=[];
    // Settlement happens after b.actions increment. Do not invent another action.
    for(const g of b.guards.filter(g=>g.mode==='maintained'))x.maintainedReceipts.push({action:b.actions,target:g.target,event:'settlement',remaining:g.remaining,paid:0});
    x.maintainedReceipts=x.maintainedReceipts.slice(-16);b.guards=b.guards.filter(g=>g.mode!=='maintained');
    const p=x.physical;if(p){if(p.remaining===1)effects.push(item(p.itemKey,1,true));if(p.ropeKey)effects.push(item(p.ropeKey,1,true));}
    if(e&&e.id===x.recoveryAttemptId&&e.sessionId===session.id){
        const carried=fittingCarried(plan.state,stagedContext(plan,context)),completed=result==='objective'&&b.objective.key==='raise_gate'&&b.objective.progress===3&&!!e.recoveryReceipt&&carried;
        if(completed)e.completion={sessionId:session.id,sequence:plan.state.sequence,at:plan.state.clock,key:b.objective.key,progress:b.objective.progress,required:b.objective.required,fittingCause:e.recoveryReceipt.cause,actions:b.actions};
        endRemainderCombatObjective(plan,'recovery',completed?'completed':'withdrawn',result);
        if(!completed&&carried)effects.push(fittingReturnEffect());
    }
    plan.remainderCombatObjectivesSettlement={sessionId:session.id,result,physical:p?{...p}:null,recoveryAttemptId:x.recoveryAttemptId};
    return effects;
}
export function remainderCombatObjectivesNativeAction(state,context,id){
    const b=battle(state);if(b?.schema!==5||id!=='player')return null;
    if(b.guards.some(g=>g.mode==='maintained'&&g.by==='player'))return {handled:true,action:null};
    const e=combatObjectivesModule(state)?.recovery.current;
    if(e&&e.sessionId===state.simulation.sessions.player.id){
        if(b.guards.some(g=>g.target==='player')||context.vitals?.player?.stamina<2)return {handled:true,action:null};
        return {handled:true,action:{type:'guard',actorId:'player',targetId:'player'}};}
    return null;
}
export function remainderCombatObjectivesBattleActions(state){
    const b=battle(state);if(b?.schema!==5)return [];
    const rows=[];
    for(const id of ['player','partyPartner'].filter(id=>live(b,id)))rows.push({label:`Maintain one brace for ${id==='player'?'yourself':'Lio'} · 2 stamina + 1 per incoming attempt`,command:{type:'maintain_brace',targetId:id}});
    if(b.guards.some(g=>g.mode==='maintained'))rows.push({label:'Release your maintained brace',command:{type:'release_brace'}});
    const p=b.combatObjectives.physical;
    if(p?.remaining===1)rows.push({label:p.kind==='guard'?'Use the admitted physical self guard · 2 stamina':'Use traversal lashing for two retreat steps · 2 stamina',
        command:{type:p.kind==='guard'?'guard':'escape',physicalPreparation:p.kind,...(p.kind==='guard'?{targetId:'player'}:{})}});
    if(b.combatObjectives.recoveryAttemptId&&!b.combatObjectives.recoveryReceipt)rows.push({label:'Recover Eda’s actual marked fitting · 1 stamina',command:{type:'recover_fitting'}});
    return rows;
}
