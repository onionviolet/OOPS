// Another descriptor over the existing native combat adapter. Actor vitals,
// paid simulation commands, native strike math and durable action nonces stay owners.
import {check} from './basics.js';
import {commitSimulationCommand,simulationOccupiesActor} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {rollCombatStrike,mitigateCombatDamageFromStats} from './combat_math.js';
import {xorshift32} from './hash_rng.js';
import {COHORT_SCHEMA,COHORT_ID,COHORT_ROOM,COHORT_MEMBERS,COHORT_COACHES,cohortBodyBinding,nativeFighterOwnership} from './cohort_battle_facts.js';
import {validateCohortBattle} from './cohort_battle_validation.js';
const resource=(actor,key,amount)=>({type:'resource',actor,key,amount});
const actual=(s,id)=>s.simulation?.people[id];
const active=(b,side)=>Object.keys(b.fighters).filter(id=>b.fighters[id].status==='active'&&(!side||b.fighters[id].side===side));
export function quoteCohortAdmission(state,members,c){
 const reasons=[],s=state.simulation;
 if(c.frontlineId&&c.frontlineId!=='player'&&!(Array.isArray(members)&&members.includes(c.frontlineId)))reasons.push('The front participant must willingly join this actual selected group.');
 if(state.actors.player.worldId!=='base.frontier'||c.location!==COHORT_ROOM||!c.manorAccess||!c.ready)reasons.push('Meet the actual instructors with your free supported body and manor access.');
 if(!state.actors.player.facts['cohort.met'])reasons.push('First meet and equip the actual instructors.');
 if(!Array.isArray(members)||members.length<1||members.length>COHORT_MEMBERS.length||new Set(members).size!==members.length||members.some(id=>!COHORT_MEMBERS.includes(id)))reasons.push(`Choose one to ${COHORT_MEMBERS.length} actual trained household members.`);
 if(c.paidHelpReason)reasons.push(c.paidHelpReason);
 if(!(c.external?.money>=2&&c.vitals?.player?.health>1))reasons.push('Bring two actual coins and a body above one health.');
 for(const id of [...(Array.isArray(members)?members:[]),...COHORT_COACHES]){
  const p=actual(state,id),a=state.actors[id],name=c.labels?.[id]||'An actual participant';
  if(!p||p.life!=='alive'||p.location!==COHORT_ROOM||a?.worldId!=='base.frontier'||p.body?.form&&p.body.form!=='human'||(p.body?.hands||0)<2||p.body?.mobile===false)reasons.push(`${name} needs their living supported body in the actual room.`);
  if(simulationOccupiesActor(state,id))reasons.push(`${name} is already occupied.`);
  if(!(p?.vitals?.health>1&&p?.vitals?.stamina>=2))reasons.push(`${name} needs actual health and stamina recovery.`);
  if(COHORT_MEMBERS.includes(id)&&(!a?.facts['home.employed']||a.facts['home.leave']||!a.facts['cohort.willing']||a.resources['cohort.training']!==1||!(a.resources['home.energy']>=10)))reasons.push(`${name} needs their earned paid instruction, willingness and ten work effort.`);
 }
 return {eligible:!reasons.length,reasons,members:Array.isArray(members)?[...members]:[]};
}
export function initializeCohortBattle(state,registry,members,c){
 const q=quoteCohortAdmission(state,members,c);check(q.eligible,q.reasons.join(' '));
 const plan=commitSimulationCommand(state,registry,{id:'cohort.start'},{...c,actorId:'player',worldId:'base.frontier',targetId:COHORT_COACHES[0],facts:{...c.facts,location:COHORT_ROOM,'cohort.admissionReady':true,'cohort.freeBody':true}},state.sequence);
 const session=plan.state.simulation.sessions.player;check(session?.definitionId===COHORT_ID,'The actual cohort encounter was not opened.');
 const ids=['player',...members,...COHORT_COACHES];session.participants=[...ids];
 applySimulationEffects(plan,COHORT_COACHES.map(id=>resource(id,'coins',1)),{actorId:'player'},registry,session.id,{spending:false});
 applySimulationEffects(plan,members.map(id=>resource(id,'home.energy',-10)),{actorId:'player'},registry,session.id,{spending:true});
 session.nativeBattle={schema:COHORT_SCHEMA,definitionId:COHORT_ID,revision:1,seed:(plan.state.simulation.seed^plan.state.sequence)>>>0||1,actions:0,last:'The paid instructors and your admitted members begin. Native cadence and current bodies decide each exchange. Everyone yields at one health.',
  admission:{at:plan.state.clock,sequence:plan.state.sequence,fees:2,members:[...members],...(c.frontlineId&&c.frontlineId!=='player'?{frontline:c.frontlineId}:{}),training:Object.fromEntries(members.map(id=>[id,state.actors[id].resources['cohort.training']])),bindings:Object.fromEntries(ids.map(id=>[id,cohortBodyBinding(actual(state,id))]))},
  fighters:Object.fromEntries(ids.map(id=>[id,{side:COHORT_COACHES.includes(id)?'defenders':'attackers',status:'active',moves:0}])),receipts:[]};
 validateCohortBattle(session.nativeBattle,session,plan.state);return plan;
}
function supported(state,b,id){
 const p=actual(state,id),a=state.actors[id];return p?.life==='alive'&&p.location===COHORT_ROOM&&a?.worldId==='base.frontier'&&cohortBodyBinding(p)===b.admission.bindings[id]&&(!COHORT_MEMBERS.includes(id)||a.facts['home.employed']&&!a.facts['home.leave']&&a.facts['cohort.willing']&&a.resources['cohort.training']===b.admission.training[id]);
}
export function cohortNativeAction(state,id){
 const b=state.simulation?.sessions.player?.nativeBattle;if(b?.schema!==COHORT_SCHEMA||b.fighters[id]?.status!=='active')return null;
 if(!supported(state,b,id))return {type:'release',actorId:id};
 const opponents=active(b,b.fighters[id].side==='attackers'?'defenders':'attackers'),lead=b.fighters[id].side==='defenders'?b.admission.frontline:null;
 const opponent=lead&&opponents.includes(lead)?lead:opponents[0];return opponent?{type:'strike',actorId:id,targetId:opponent}:null;
}
const sameVitals=(a,b)=>a&&b&&['health','stamina','max_health','max_stamina'].every(k=>a[k]===b[k]);
export function quoteCohortAction(state,c,context,bindings={}){
 const session=state.simulation?.sessions.player,b=session?.nativeBattle,reasons=[];
 try{validateCohortBattle(b,session,state);}catch(e){return {eligible:false,reasons:[e.message]};}
 if(c.sessionId!==session.id||c.sequence!==state.sequence||c.action!==b.actions||c.seed!==b.seed)reasons.push('This cohort action is stale or already settled.');
 if(b.fighters[c.actorId]?.status!=='active')reasons.push('This person has already left the exercise.');
 if(!['strike','release','withdraw'].includes(c.type))reasons.push('Choose a native strike, release or withdrawal.');
 if(c.type==='withdraw'&&c.actorId!=='player')reasons.push('Only the player withdraws the whole exercise.');
 if(c.type==='release'&&c.actorId==='player'&&supported(state,b,'player'))reasons.push('Use withdrawal to leave your own supported exercise.');
 if(c.type==='strike'){
  const target=b.fighters[c.targetId];if(!target||target.status!=='active'||target.side===b.fighters[c.actorId]?.side)reasons.push('Choose an actual active opponent.');
  for(const id of [c.actorId,c.targetId]){
   if(!supported(state,b,id))reasons.push('Restore or release the unsupported actual participant.');
   const f=bindings[id],v=id==='player'?context.vitals?.player:actual(state,id)?.vitals;
   if(!f||f.ownerId!==id||f.sessionId!==session.id||f.sequence!==state.sequence||f.action!==b.actions||f.seed!==b.seed||f.ownership!==nativeFighterOwnership(state,id)||!sameVitals(f.snapshot?.stats,v))reasons.push('Read the current native fighter and its exact custody/vitals before striking.');
   const n=f?.snapshot;if(n?.stats&&(!['attack_points','agility','intuition','defense','crit_rate','crit_multiplier','attack_speed'].every(k=>Number.isFinite(n.stats[k])&&n.stats[k]>=0)||!(n.stats.attack_speed>0)||!Number.isInteger(n.stats.attack_count||1)||(n.stats.attack_count||1)<1||(n.stats.attack_count||1)>32))reasons.push('Unsupported native strike statistics.');if(!n||!Number.isFinite(n.attackPower)||n.attackPower<0||!Number.isFinite(n.emptyStaminaMultiplier)||n.emptyStaminaMultiplier<=0||!Number.isFinite(n.shield)||n.shield<0||!Number.isFinite(n.shieldSkill)||n.shieldSkill<0||n.shieldSkill>100)reasons.push('Unsupported native combat binding.');
  }
 }
 return {eligible:!reasons.length,reasons};
}
function finish(plan,registry,b,result){
 const s=plan.state,session=s.simulation.sessions.player;const effects=[];
 for(const id of ['player',...b.admission.members]){
  const f=b.fighters[id],released=['released','unsupported'].includes(f.status)?1:0;if(id==='player'||f.moves>released){
   s.actors[id].completed[session.commandId]=(s.actors[id].completed[session.commandId]||0)+1;if(result==='won')effects.push(resource(id,'cohort.wins',1));
   s.actors[id].facts['cohort.lastFinish']=s.clock;s.actors[id].facts['cohort.lastOutcome']=result;
  }
 }
 s.actors.player.facts['cohort.lastReceipt']=session.id;
 applySimulationEffects(plan,effects,{actorId:'player'},registry,session.id,{spending:false});
 s.simulation.log.push({at:s.clock,text:`The field-forms exercise ended ${result}. Actual wages, effort and wounds remain.`,cause:session.id});s.simulation.log=s.simulation.log.slice(-100);delete s.simulation.sessions.player;
}
export function commitCohortAction(state,registry,c,context,bindings={}){
 const q=quoteCohortAction(state,c,context,bindings);check(q.eligible,q.reasons.join(' '));
 const plan={state:structuredClone(state),external:structuredClone(context.external||{}),gameplay:structuredClone(context.gameplay||{}),vitals:structuredClone(context.vitals||{}),acquisitions:[],unlocks:[]},session=plan.state.simulation.sessions.player,b=session.nativeBattle;
 const hp=id=>id==='player'?plan.vitals.player:plan.state.simulation.people[id].vitals;
 const label=id=>id==='player'?'You':registry.simulation.people.get(id)?.label||'Household member';let text,result=null;
 if(c.type==='withdraw'){text='You withdraw the group with actual fees, spent effort and injuries retained.';result='withdrew';}
 else if(c.type==='release'){const f=b.fighters[c.actorId];f.status=supported(plan.state,b,c.actorId)?'released':'unsupported';text=`${label(c.actorId)} leaves the actual exercise.`;session.participants=session.participants.filter(id=>id!==c.actorId);if(c.actorId==='player'||!active(b,'defenders').length)result='interrupted';}
 else{
  const a=bindings[c.actorId].snapshot,t=bindings[c.targetId].snapshot,v=hp(c.actorId),target=hp(c.targetId);check(v.health>1&&target.health>1,'A native participant has already yielded.');
  const hadStamina=v.stamina>0;v.stamina=Math.max(0,v.stamina-1/(a.stats.stamina_efficiency||1));const random=()=>{b.seed=xorshift32(b.seed);return b.seed/0x100000000;};
  const strike=rollCombatStrike({attackPower:a.attackPower*(hadStamina&&v.stamina===0?a.emptyStaminaMultiplier:1),attacker:a.stats,target:t.stats,shield:t.shield,shieldSkill:t.shieldSkill,random});
  const damage=strike.kind==='hit'?mitigateCombatDamageFromStats(strike.values,t.stats,0,a.stats.armor_penetration??0):0,delivered=Math.min(target.health-1,damage);target.health-=delivered;
  text=`${label(c.actorId)} ${strike.kind==='hit'?`delivers ${delivered.toFixed(1)} damage to ${label(c.targetId)}`:strike.kind==='blocked'?'meets a full shield block':'misses the actual opponent'}.`;
  if(target.health===1){b.fighters[c.targetId].status='yielded';session.participants=session.participants.filter(id=>id!==c.targetId);if(c.targetId==='player')result='lost';else if(!active(b,'defenders').length)result='won';}
 }
 b.actions++;b.fighters[c.actorId].moves++;b.last=text;b.receipts=[...b.receipts,{action:b.actions,kind:c.type,actor:c.actorId,...(c.type==='strike'?{target:c.targetId}:{}),text}].slice(-24);plan.state.sequence++;
 if(result)finish(plan,registry,b,result);else validateCohortBattle(b,session,plan.state);
 plan.native={hpToFull:hp('player').max_health-hp('player').health,staminaToFull:hp('player').max_stamina-hp('player').stamina};return plan;
}
export function cohortBattleView(state,registry,context,bindings){
 const session=state.simulation?.sessions.player,b=session?.nativeBattle;if(b?.schema!==COHORT_SCHEMA)return null;
 const token={sessionId:session.id,sequence:state.sequence,action:b.actions,seed:b.seed},actions=[];
 const add=(label,c,group)=>{const command={...token,actorId:'player',...c},q=quoteCohortAction(state,command,context,bindings);actions.push({label,command,eligible:q.eligible,reasons:q.reasons,...(group?{group}:{})});};
 for(const id of active(b,'defenders'))add('Strike '+(registry.simulation.people.get(id)?.label||'instructor'),{type:'strike',targetId:id});
 for(const id of b.admission.members.filter(id=>b.fighters[id].status==='active'))add('Release '+(registry.simulation.people.get(id)?.label||'member'),{type:'release',actorId:id});
 for(const coach of active(b,'defenders'))for(const targetId of active(b,'attackers'))add('Ask '+(registry.simulation.people.get(coach)?.label||'instructor')+' to test '+(targetId==='player'?'your':registry.simulation.people.get(targetId)?.label||'participant')+' guard',{type:'strike',actorId:coach,targetId},'guard-test');
 add('Withdraw the actual cohort',{type:'withdraw'});
 return {kind:'cohort',id:session.id,token,last:b.last,objective:{progress:0,required:1},escape:{progress:0,required:1},guardsTaken:0,fighters:Object.entries(b.fighters).map(([id,f])=>({id,label:id==='player'?'You':registry.simulation.people.get(id)?.label||'Household member',...f,vitals:structuredClone(id==='player'?context.vitals?.player:actual(state,id)?.vitals)})),actions,receipts:structuredClone(b.receipts),admission:structuredClone(b.admission)};
}
