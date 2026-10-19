// Pure staged-state recognition. Root calls this only before the existing
// durable publication boundary; failed publication discards these changes.
import {check, natural, object} from './basics.js';
import {REMAINDER_COMBAT_OBJECTIVES as I,REMAINDER_COMBAT_OBJECTIVE_KEYS as K,REMAINDER_SUPPLY_FORBIDDEN_COMMANDS,
    combatObjectivesModule,newCombatObjectivesModule,fittingCarried} from './audit_remainder_combat_objectives_content.js';
const keys=(x,allowed)=>check(object(x)&&Object.keys(x).every(k=>allowed.includes(k)),'Unsupported combat-objective saved fields.');
const sessionId=x=>typeof x==='string'&&/^simulation:[1-9][0-9]*$/.test(x),count=(state,id)=>state.actors?.player?.completed?.[id]||0;
export function initializeRemainderCombatObjectives(state){
    check(state.schema===11&&state.auditRemainder?.schema===1&&object(state.auditRemainder.modules),'Combat objectives require explicit expansion11/auditRemainder1 enrollment.');
    return state.auditRemainder.modules[I.module]||=(newCombatObjectivesModule());
}
export function acceptRemainderCombatObjective(out,kind){
    check(['supply','recovery'].includes(kind),'Unknown finite objective.');
    const r=initializeRemainderCombatObjectives(out.state)[kind];
    check(!r.current&&r.next<=3&&!r.history.some(e=>e.status==='completed'),'This finite objective has no new attempt available.');
    r.current={id:`remainder.combat_objectives.${kind}:${r.next++}`,kind,status:'active',startedAt:out.state.clock,startedSequence:out.state.sequence,
        ...(kind==='recovery'?{sessionId:null,recoveryReceipt:null,handoff:null,completion:null}:{commissionId:'field.supplies',forbidden:[...REMAINDER_SUPPLY_FORBIDDEN_COMMANDS],violation:null})};
    return r.current;
}
export function endRemainderCombatObjective(out,kind,status,result){
    const r=combatObjectivesModule(out.state)?.[kind],e=r?.current;if(!e)return null;
    e.status=e.status==='violated'?'violated':status;e.result=result;e.endedAt=out.state.clock;e.endedSequence=out.state.sequence;
    r.history.push(e);r.current=null;return e;
}
function validateAttemptRoot(r,state,kind){
    keys(r,['next','current','history']);
    check(natural(r.next)&&r.next>=1&&r.next<=4&&Array.isArray(r.history)&&r.history.length<=3,'Invalid finite objective capacity.');
    const rows=[...r.history,...(r.current?[r.current]:[])];check(rows.length===r.next-1&&new Set(rows.map(e=>e.id)).size===rows.length,'Objective attempt identities do not match their finite counter.');
    rows.forEach((e,index)=>{
        keys(e,['id','kind','status','startedAt','startedSequence','sessionId','recoveryReceipt','handoff','commissionId','forbidden','violation','endedAt','endedSequence','result','completion']);
        check(e.id===`remainder.combat_objectives.${kind}:${index+1}`&&e.kind===kind&&['active','completed','violated','withdrawn'].includes(e.status)&&
            natural(e.startedAt)&&e.startedAt<=state.clock&&natural(e.startedSequence)&&e.startedSequence>0&&e.startedSequence<=state.sequence&&e.startedSequence>=state.auditRemainder.enrolledSequence,'Invalid objective acceptance boundary.');
        if(e.endedAt!=null)check(natural(e.endedAt)&&e.endedAt>=e.startedAt&&e.endedAt<=state.clock&&natural(e.endedSequence)&&e.endedSequence>=e.startedSequence&&e.endedSequence<=state.sequence&&
            ['objective','won','lost','escaped','withdrawn','bypassed','abandoned','kits_delivered','rope_delivered'].includes(e.result),'Invalid actual objective settlement.');
        if(kind==='recovery'){
            check(e.commissionId===undefined&&e.forbidden===undefined&&e.violation===undefined&&e.status!=='violated'&&(e.sessionId===null||sessionId(e.sessionId)&&Number(e.sessionId.slice(11))>=e.startedSequence),'Invalid fitting objective session.');
            if(e.recoveryReceipt!==null){const x=e.recoveryReceipt;keys(x,['sessionId','sequence','action','at','owner','key','loanId','cause']);
                check(x.sessionId===e.sessionId&&x.owner===I.owner&&x.key===K.fitting&&x.loanId===I.loan&&x.cause===`feature-action:${x.sequence}`&&
                    natural(x.sequence)&&x.sequence>e.startedSequence&&x.sequence<=state.sequence&&natural(x.action)&&x.action>0&&natural(x.at)&&x.at>=e.startedAt&&x.at<=state.clock,'Invalid actual fitting-recovery receipt.');}
            if(e.completion!==null){const x=e.completion;keys(x,['sessionId','sequence','at','key','progress','required','fittingCause','actions']);check(e.status==='completed'&&e.result==='objective'&&x.sessionId===e.sessionId&&x.sequence===e.endedSequence&&x.at===e.endedAt&&x.key==='raise_gate'&&x.progress===3&&x.required===3&&x.fittingCause===e.recoveryReceipt?.cause&&natural(x.actions)&&x.actions>=e.recoveryReceipt.action,'Invalid exact gate-and-intact-fitting settlement.');}
            if(e.status==='completed')check(e.result==='objective'&&e.recoveryReceipt&&e.completion,'Fitting objective requires its actual recovery and raised-gate settlement.');
            if(e.handoff!==null){keys(e.handoff,['sequence','at','commandId']);check(e.status==='completed'&&e.handoff.commandId===I.prefix+'handoff_fitting'&&natural(e.handoff.sequence)&&e.handoff.sequence>e.endedSequence&&e.handoff.sequence<=state.sequence&&natural(e.handoff.at)&&e.handoff.at>=e.endedAt&&e.handoff.at<=state.clock,'Invalid exact fitting handoff.');}
        }else{
            check(e.sessionId===undefined&&e.recoveryReceipt===undefined&&e.handoff===undefined&&e.commissionId==='field.supplies'&&Array.isArray(e.forbidden)&&e.forbidden.join('|')===REMAINDER_SUPPLY_FORBIDDEN_COMMANDS.join('|'),'Unsupported ordinary-supply terms.');
            if(e.violation!==null){keys(e.violation,['commandId','actorId','cause','sequence','at']);const x=e.violation;
                check(e.status==='violated'&&e.forbidden.includes(x.commandId)&&x.actorId==='player'&&x.cause===`simulation:${x.sequence}`&&natural(x.sequence)&&x.sequence>e.startedSequence&&x.sequence<=state.sequence&&natural(x.at)&&x.at>=e.startedAt&&x.at<=state.clock,'Invalid committed powered-work violation.');}
            check((e.status==='violated')===(e.violation!==null),'Supply violation status lacks its actual accepted-command cause.');
            if(e.completion!=null){keys(e.completion,['commandId','sequence','at','key','count','commissionCount']);const x=e.completion;
                check(e.result==='kits_delivered'&&x.commandId==='field.deliver_kits'&&x.key===K.kit&&x.count===3&&x.commissionCount===1&&x.sequence===e.endedSequence&&x.at===e.endedAt,'Invalid actual three-kit commission receipt.');}
            if(e.status==='completed')check(e.result==='kits_delivered'&&!e.violation&&e.completion,'Ordinary supply requires actual three-kit delivery without forbidden committed work.');
        }
    });
    check(r.history.every(e=>e.endedAt!=null&&e.status!=='active')&&(!r.current||r.current.endedAt==null&&['active','violated'].includes(r.current.status))&&r.history.filter(e=>e.status==='completed').length<=1,'Invalid open/once objective result.');
}
export function validateRemainderCombatObjectives(state,registry){
    const m=combatObjectivesModule(state),f=state.actors?.player?.facts||{},offered=f['remainder.combat_objectives.recoveryOffered']===true,recipe=f['remainder.combat_objectives.recipeKnown']===true;
    const practice=f['remainder.combat_objectives.practiceWatchReady']===true;
    if(practice)check(state.schema===11&&state.auditRemainder?.schema===1&&f['feature.battle.routeCleared']===true&&count(state,I.prefix+'supplied_practice_watch')>0&&state.actors.featureBattleShield?.facts?.['remainder.combat_objectives.practiceConsent']===true&&state.actors.featureBattleHook?.facts?.['remainder.combat_objectives.practiceConsent']===true,'A ready practice watch requires actual supplied completion and both people’s consent.');
    if(m==null){check(!state.referenceGameplay?.feats?.earned?.some(e=>e.id==='ordinary_supply'),'An ordinary supply feat requires its explicit finite module receipt.');check(!recipe,'A brace-wrap recipe requires its actual objective/handoff record.');if(!offered)return;}
    check(state.schema===11&&state.auditRemainder?.schema===1&&state.referenceGameplay?.schema===1,'Combat-objective activation requires the explicit current reader.');
    check(offered===(count(state,I.prefix+'hear_recovery')===1)&&count(state,I.prefix+'hear_recovery')<=1,'Fitting owner stock requires its once-only local offer.');
    const ownerStock=state.simulation?.owners?.[I.owner]?.[K.fitting]||0,c=state.simulation?.custody?.[I.loan];
    check(natural(ownerStock)&&ownerStock<=1&&(!c||offered&&c.owner===I.owner&&c.holder==='player'&&c.key===K.fitting&&c.count===1&&ownerStock===0),'Invalid conserved fitting owner/custody join.');
    if(m==null){check(ownerStock===1&&!c,'An unaccepted fitting remains its owner’s single stock.');return;}
    keys(m,['schema','recovery','supply']);check(m.schema===1,'Unsupported combat-objective module.');
    validateAttemptRoot(m.recovery,state,'recovery');validateAttemptRoot(m.supply,state,'supply');
    check(count(state,I.prefix+'accept_recovery')===m.recovery.next-1&&count(state,I.prefix+'accept_supply')===m.supply.next-1,'Finite attempts require their actual explicit acceptance command completions.');
    if(m.supply.next>1)check(count(state,I.prefix+'hear_supply')===1&&state.simulation.knowledge.player?.['remainder_combat_objectives.supply_terms'],'Supply acceptance requires prior published terms.');
    const handed=m.recovery.history.filter(e=>e.handoff),completion=m.supply.history.find(e=>e.status==='completed');
    check(recipe===(handed.length===1)&&handed.length<=1&&recipe===(count(state,I.prefix+'handoff_fitting')===1),'Recipe knowledge requires the single actual fitting handoff.');
    const pendingHandoff=m.recovery.history.find(e=>e.status==='completed'&&!e.handoff);
    if(pendingHandoff)check(c&&ownerStock===0&&c.cause===pendingHandoff.recoveryReceipt.cause,'A completed unhanded objective must retain its exact recovered fitting custody.');
    if(offered)check(c?ownerStock===0:ownerStock===1,'The single offered fitting must remain conserved with its real owner or recovery holder.');
    if(recipe)check(!c&&ownerStock===1,'Learned recipe requires the fitting returned to its actual owner.');
    if(c){const current=m.recovery.current,done=m.recovery.history.find(e=>e.status==='completed'&&!e.handoff);
        const source=current?.recoveryReceipt||done?.recoveryReceipt;check(source&&source.cause===c.cause,'Fitting custody lacks its committed recovery cause.');}
    const active=m.recovery.current,session=state.simulation?.sessions?.player;
    if(active?.sessionId)check(session?.id===active.sessionId&&session.nativeBattle?.schema===5&&session.nativeBattle.combatObjectives?.recoveryAttemptId===active.id,'Active fitting objective lost its exact schema5 battle.');
    if(completion)check(f['field.supplyDone']===true&&f['field.supplyRoute']==='kits'&&count(state,'field.deliver_kits')===1,'Supply recognition lost its ordinary commission settlement.');
    const feat=state.referenceGameplay?.feats?.earned?.find(e=>e.id==='ordinary_supply');
    check(!!feat===!!completion,'Supply feat must match its one completed attempt.');
    if(feat)check(feat.sequence===completion.endedSequence&&feat.at===completion.endedAt&&feat.provenance.kind==='root-conduct-receipt'&&feat.provenance.ids.join('|')===`${completion.id}|completion:field.deliver_kits:1`,'Supply feat lacks its exact attempt and ordinary completion.');
    if(registry)for(const id of REMAINDER_SUPPLY_FORBIDDEN_COMMANDS)check(registry.simulation.commands.get(id)?.powerId,'Supply terms name an unavailable powered packing command.');
}
// Called by root at startCommand after successful admission/payment, once per
// player command, including program starts. There is no hook from preview/load.
export function recordRemainderSupplyCommandCommit(state,commandId,actorId,cause){
    const e=combatObjectivesModule(state)?.supply.current;
    if(!e||actorId!=='player'||!e.forbidden.includes(commandId)||e.violation)return false;
    const sequence=Number(String(cause).slice('simulation:'.length));
    check(cause===`simulation:${sequence}`&&natural(sequence)&&sequence>e.startedSequence&&sequence<=state.sequence,'Supply violation requires an actual post-acceptance command cause.');
    e.status='violated';e.violation={commandId,actorId,cause,sequence,at:state.clock};return true;
}
export function advanceRemainderCombatObjectives(before,out,registry,context={}){
    if(!out?.state||out.state.sequence<=before.sequence||!combatObjectivesModule(out.state))return;
    const state=out.state,m=combatObjectivesModule(state),f=state.actors.player.facts;
    // Handoff completion is known only after the executor moved the exact item.
    if(count(state,I.prefix+'handoff_fitting')>count(before,I.prefix+'handoff_fitting')){
        const e=m.recovery.history.find(e=>e.status==='completed'&&!e.handoff);
        if(e){
            check(fittingCarried(before,{...context,gameplay:out.gameplayBefore||context.gameplay})&&!state.simulation.custody[I.loan]&&state.simulation.owners[I.owner]?.[K.fitting]===1,'The recipe needs the actual intact fitting transfer to Eda.');
            e.handoff={sequence:state.sequence,at:state.clock,commandId:I.prefix+'handoff_fitting'};
        }else check(m.recovery.history.some(row=>row.status==='completed'&&row.handoff?.commandId===I.prefix+'handoff_fitting')&&
            !state.simulation.custody[I.loan]&&state.simulation.owners[I.owner]?.[K.fitting]===1,'The retained fitting handoff receipt is missing.');
    }
    const e=m.supply.current,kitDelta=count(state,'field.deliver_kits')-count(before,'field.deliver_kits'),ropeDelta=count(state,'field.deliver_rope')-count(before,'field.deliver_rope');
    if(e&&(kitDelta||ropeDelta)){
        if(kitDelta){
            const prior=out.gameplayBefore?.player?.inventory||context.gameplay?.player?.inventory,after=out.gameplay?.player?.inventory;
            check(kitDelta===1&&e.startedSequence<state.sequence&&f['field.supplyDone']===true&&f['field.supplyRoute']==='kits'&&count(state,'field.deliver_kits')===1&&
                Number.isSafeInteger(prior?.[K.kit])&&(prior[K.kit]||0)-(after?.[K.kit]||0)===3,'Recognition needs the newly committed three-kit supply delivery.');
            e.completion={commandId:'field.deliver_kits',sequence:state.sequence,at:state.clock,key:K.kit,count:3,commissionCount:1};
            const ended=endRemainderCombatObjective(out,'supply','completed','kits_delivered');
            if(ended.status==='completed'){
                const feats=state.referenceGameplay.feats.earned;check(!feats.some(r=>r.id==='ordinary_supply'),'Ordinary supply recognition was already awarded.');
                feats.push({id:'ordinary_supply',sequence:state.sequence,at:state.clock,provenance:{kind:'root-conduct-receipt',ids:[ended.id,'completion:field.deliver_kits:1']}});
            }
        }else endRemainderCombatObjective(out,'supply','withdrawn','rope_delivered');
    }
    // An unbound accepted objective can still end via the ordinary bypass.
    if(m.recovery.current&&!m.recovery.current.sessionId&&count(state,'feature_battle.bypass')>count(before,'feature_battle.bypass'))endRemainderCombatObjective(out,'recovery','withdrawn','bypassed');
    validateRemainderCombatObjectives(state,registry);
}

// Root uses this cross-domain join at load/import and staged publication.
export function validateRemainderCombatObjectivesNative(state,gameplay={}){
    const offered=state.actors?.player?.facts?.['remainder.combat_objectives.recoveryOffered']===true;
    const carried=gameplay.player?.inventory?.[K.fitting]||0,c=state.simulation?.custody?.[I.loan];
    check(natural(carried)&&carried===(c?1:0),'The actual fitting bag stock must match its conserved custody record exactly.');
    check(!c||offered&&c.owner===I.owner&&c.holder==='player'&&c.key===K.fitting&&c.count===1,'Native fitting stock lacks its actual consent/owner.');
}
