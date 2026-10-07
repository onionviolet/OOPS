import {FIELD_CARE_IDS as I} from './field_care_content.js';
import {fieldCareEnrolled,fieldCareSupported,fieldCareRecord} from './field_care_facts.js';
import {applySimulationEffects} from './simulation_effects.js';
export function admitFieldCareWatch(state,session,context={}){
    const facts=state.actors.player.facts;
    if(!fieldCareEnrolled(state)||facts[I.prefix+'armed']!==true)return;
    // Only newly admitted schema4/5 sessions can adopt this separately chosen
    // consequence. Their frozen battle payload and old choices are unchanged.
    if(session.nativeBattle.schema<4||!fieldCareSupported(state,context))throw new Error('This optional wound consequence needs the current supported native body and a newly admitted encounter.');
    facts[I.prefix+'armed']=false;
    facts[I.prefix+'watch']=JSON.stringify({sessionId:session.id,at:state.clock,sequence:state.sequence});
}
export function recordFieldCareStrike(plan,registry,session,c,outcomes,context={},ownsPole=false){
    const a=plan.state.actors.player,watch=fieldCareRecord(a.facts[I.prefix+'watch']);
    if(!watch||watch.sessionId!==session.id||!fieldCareSupported(plan.state,context))return;
    const outcome=ownsPole&&c.type==='strike'&&c.actorId==='featureBattleHook'&&c.technique==='hook'&&outcomes.find(o=>o.targetId==='player'&&o.kind==='hit'&&o.damage>0&&!o.guarded);
    if(!outcome)return;
    // Native strike has already applied HP damage; no second damage owner or
    // damage-over-time can bypass the encounter's existing one-HP yield floor.
    const cause=`feature-action:${plan.state.sequence}`,action=session.nativeBattle.actions;
    const record={sessionId:session.id,action,at:plan.state.clock,attackerId:c.actorId,damage:outcome.damage,sequence:plan.state.sequence,cause};
    a.facts[I.prefix+'wound']=JSON.stringify(record);delete a.facts[I.prefix+'watch'];
    applySimulationEffects(plan,[{type:'condition',id:I.cut,operation:'apply',duration:12},
        {type:'knowledge',key:I.prefix+'wound_account',stage:'understood',value:'Oren’s actually landed, unguarded pole strike left a mild open cut. Its fine-movement and recovery penalty lasts twelve played minutes or until a real cloth/herb dressing; withdrawing retains it and the strike’s spent health.'}],{actorId:'player'},registry,cause);
}
export function finishFieldCareWatch(state,sessionId){
    const facts=state.actors.player.facts;if(fieldCareRecord(facts[I.prefix+'watch'])?.sessionId===sessionId)delete facts[I.prefix+'watch'];
}
