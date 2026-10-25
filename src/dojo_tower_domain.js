import {TOWER_INSIGHTS,towerInsightEffect} from './dojo_insight.js';
import {configureTowerRoutine,quoteTowerRoutine,stopTowerRoutine,stageTowerRoutineEntry,towerRoutineBody} from './dojo_tower_routine.js';
import {registerDomain} from './domain_registry.js';
import {addPurse} from './economy_domain.js';
import {freshTower,validateTower,quoteTower,beginTower,settleTower,towerDrawEligible,TOWER_FLOORS,planTowerInsight} from './dojo_tower.js';
import {WORLD_ID,AREA_ID,readProfileState} from './absorb_p23/encounter_profiles/profile.js';
let ports,applied='',appliedActor=null;
export const configureDojoTower=operations=>{ports=operations;applied='';appliedActor=null;};
const value=()=>ports?.root?.().dojoTower;
function applyInsight(){
 const actor=ports?.actor?.();if(!actor?.getLevelableComponent)return;
 const sets=towerInsightEffect(value(),{world:ports.world(),location:ports.location(),body:ports.body()}),signature=JSON.stringify(sets);
 if(actor===appliedActor&&signature===applied)return;
 const full=actor.getFullStats(),health=full.health,stamina=full.stamina;
 actor.getLevelableComponent().stats.multiplier.dojo_insight=sets;actor.updateStatsAndDisplay();
 const next=actor.getFullStats();next.health=Math.max(0,Math.min(next.max_health,health));next.stamina=Math.max(0,Math.min(next.max_stamina,stamina));applied=signature;appliedActor=actor;
}
function stageEntry(plan,{tower=false,repeat=false,stake=1,attempt,automated=false}){
 if(!tower)return null;const t=plan.state.dojoTower||freshTower(),floor=automated?t.routine.floor:repeat?Math.max(1,t.best):Math.min(TOWER_FLOORS,t.best+1),q=beginTower(t,{floor,stake,money:plan.external.money,attempt});if(automated)stageTowerRoutineEntry(q.state,floor,stake);else if(q.state.routine?.enabled)q.state=stopTowerRoutine(q.state,plan.state.clock,'Manual entry pauses automatic admission.');plan.state.dojoTower=q.state;plan.external.money+=q.coins;return q.profile;
}
function stageFinish(plan,{attempt,outcome}){const r=settleTower(plan.state.dojoTower,{attempt,outcome,at:plan.state.clock});if(r.state)plan.state.dojoTower=r.state;plan.external.money+=r.coins;return r;}
function finishLive({attempt,outcome}){const root=ports.root(),r=settleTower(root.dojoTower,{attempt,outcome,at:root.clock});if(r.state)root.dojoTower=r.state;if(r.coins)addPurse(ports.actor(),r.coins,'dojo-tower.settlement');return r;}
const routineContext=()=>{const body=ports.body(),stats=ports.actor().getFullStats();return {world:ports.world(),location:ports.location(),body:towerRoutineBody(body,ports.continuation()?.active),ready:ports.idle()&&ports.tradeWritable()&&!ports.worldWorkBlocked(),money:ports.actor().money,health:stats.health,maxHealth:stats.max_health,stamina:stats.stamina,maxStamina:stats.max_stamina};};
function saveTower(t){const plan=ports.plan(0);plan.state.dojoTower=t;validateTower(t);ports.commit(plan);}
function tick(minutes){
 if(!(minutes>0)||!ports||!value()?.routine?.enabled||!ports.tradeWritable())return;
 const t=value(),c=routineContext(),policy=quoteTowerRoutine(t,c);if(policy.waiting)return;
 const stop=reason=>saveTower(stopTowerRoutine(value(),ports.root().clock,reason));
 if(!policy.eligible){stop(policy.reason);return;}
 const q=quoteTower(t,{floor:policy.floor,stake:policy.stake,money:c.money,attempt:readProfileState(ports.trainingProfile()).nextAttempt});if(!q.eligible){stop(q.reasons.join(' ').slice(0,240));return;}
 // Training rechecks actual body, gear custody, travel and native admission.
 try{ports.trainingAction('enter',{tower:true,stake:policy.stake,repeat:true,automated:true});}catch(e){if(ports.tradeWritable())stop(String(e.message).slice(0,240));}
}
function act(id){
 const parts=id.split(':'),t=value()||freshTower();
 if(parts[1]==='insight'){
  const c=routineContext(),q=planTowerInsight(t,{action:parts[2],id:parts[3],money:c.money,world:c.world,location:c.location,ready:c.ready,clock:ports.root().clock}),plan=ports.plan(q.minutes);
  if(plan.state.clock-ports.root().clock!==q.minutes)throw Error('Finish the pending local decision before the full lesson.');
  plan.state.dojoTower=q.state;plan.external.money-=q.cost;ports.commit(plan);applyInsight();return;
 }
 if(parts[1]==='routine'){
  if(parts[2]==='stop')return saveTower(stopTowerRoutine(t,ports.root().clock,'Stopped by your explicit choice.'));
  const c=routineContext();if(c.location!=='Proto23 Dojo lobby'||!c.ready)throw Error('Configure the repeat agreement while free in the writable dojo lobby.');
  return saveTower(configureTowerRoutine(t,{enabled:true,stake:Number(parts[2]),count:3,reserve:5,body:c.body}));
 }
 if(parts[1]==='fund'){if(ports.root().actors.player.worldId!==WORLD_ID||ports.location()!=='Proto23 Dojo lobby'||!ports.idle()||ports.actor().money<5)throw Error('Offer five actual coins while free at the dojo.');const plan=ports.plan(0);plan.state.dojoTower ||= freshTower();plan.state.dojoTower.fund+=5;plan.external.money-=5;validateTower(plan.state.dojoTower);return ports.commit(plan);}
 if(parts[1]==='enter')return ports.trainingAction('enter',{tower:true,stake:Number(parts[2]),repeat:parts[3]==='repeat'});
 if(parts[1]==='draw'){if(!towerDrawEligible(ports.combat(),ports.trainingProfile()))throw Error('A draw needs an exchanged blow and remaining health shares within ten percentage points.');return ports.trainingAction('leave',{towerDraw:true});}
 throw Error('Unknown tower action.');
}
function presentation(at){
 if(!ports)return {lines:[],actions:[]};
 const t=value()||freshTower(),p=readProfileState(ports.trainingProfile()),lines=[`Dojo tower: best floor ${t.best}/${TOWER_FLOORS}; sponsor free fund ${t.fund} coins. A stake is real money. Victory returns its disclosed payout; loss or withdrawal forfeits the stake. The sponsor reserves the payout before the fight. Repeated wins strengthen that floor's construct and reduce its extra coin reward. Native health/stamina costs remain. A draw returns the stake without advancement when both remaining health shares are within ten percentage points after an exchange.`],actions=[];
 if(t.best>0){
  const active=TOWER_INSIGHTS[t.insight?.active],percent=(2*t.best).toFixed(0);lines.push(`Earned reed-circle insight: ${active?active.label:'none selected'}. A learned lesson gives +${percent}% to its named stat while facing this known construct with a supported owned body. Other places receive no term. Learning costs five actual coins and five played minutes; the fee supports the finite circuit fund.`);
  if(at==='Proto23 Dojo lobby'&&!t.pending){
   for(const [id,d]of Object.entries(TOWER_INSIGHTS)){const known=t.insight?.learned.includes(id),selected=t.insight?.active===id;actions.push({id:`tower:insight:${known?'choose':'learn'}:${id}`,label:`${known?(selected?'Selected: ':'Use '):'Learn '}${d.label}${known?'':' · 5 coins, 5 min'} · ${d.stat.replaceAll('_',' ')}`,disabled:selected||t.best<d.floor||!known&&ports.actor().money<5,reason:t.best<d.floor?`Win actual tower floor ${d.floor}.`:d.reason});}
   if(t.insight?.active)actions.push({id:'tower:insight:off',label:'Set aside the selected reed-circle lesson',disabled:false});
  }
 }
 if(t.routine)lines.push(`Repeat routine ${t.routine.enabled?'on':'off'}: frozen floor ${t.routine.floor}, stake ${t.routine.stake}, ${t.routine.remaining} admissions left, ${t.routine.reserve}-coin reserve. ${t.routine.last?.reason||''}`);
 if(t.pending)lines.push(`Tower floor ${t.pending.floor}: stake ${t.pending.stake}, reserved victory payout ${t.pending.payout}, ${t.pending.repeat} prior wins at this floor.`);
 else if(at==='Proto23 Dojo lobby')for(const repeat of [false,...(t.best>0?[true]:[])])for(const stake of [0,1,5]){
  const q=quoteTower(t,{floor:repeat?Math.max(1,t.best):Math.min(TOWER_FLOORS,t.best+1),stake,money:ports.actor().money,attempt:p.nextAttempt});
  actions.push({id:`tower:enter:${stake}:${repeat?'repeat':'next'}`,label:`${repeat?'Repeat':'Next'} tower floor ${q.floor} · stake ${stake}, win payout ${q.payout}, strength ×${q.scale.toFixed(2)}`,disabled:!q.eligible,reason:q.reasons.join(' ')});
 }
 if(at==='Proto23 Dojo lobby'&&!t.pending&&t.best>0){
  lines.push('Opted repeat admission uses up to three real fights at this earned floor, preserves five carried coins and requires 75% health and 50% stamina before each entry. Native combat proceeds normally. Loss, draw, withdrawal, other work or leaving the dojo stops it. Review stronger repeats and sponsor funds before resuming.');
  for(const stake of [0,1,5])actions.push({id:'tower:routine:'+stake,label:`Repeat earned floor up to three times · stake ${stake}, keep 5 coins`,disabled:!!t.routine?.enabled});
 }
 if(t.routine?.enabled)actions.push({id:'tower:routine:stop',label:'Stop automatic tower admission',disabled:false});
 if(at===AREA_ID&&t.pending)actions.push({id:'tower:draw',label:'Offer an even draw · return stake, no advancement',disabled:!towerDrawEligible(ports.combat(),p)});
 if(at==='Proto23 Dojo lobby'&&!t.pending)actions.push({id:'tower:fund',label:'Sponsor the actual circuit · 5 personal coins',disabled:ports.actor().money<5});
 return {lines,actions};
}
registerDomain({id:'dojoTower',initialState:()=>null,load:()=>{applied='';appliedActor=null;},refresh:applyInsight,
 validate:(_,save)=>{const t=save.expansion?.dojoTower;validateTower(t);const p=save.p23EncounterProfile?.pending;if(t?.pending){if(p?.attempt!==t.pending.attempt||p.tower?.floor!==t.pending.floor||p.tower?.repeat!==Math.min(50,t.pending.repeat))throw Error('Tower escrow needs its exact native opponent attempt.');}else if(p?.tower)throw Error('Tower opponent needs its funded attempt.');const r=save.p23EncounterReceipt;if(r?.tower){const h=t?.history.find(h=>h.attempt===r.attempt&&h.outcome==='won');if(!h||h.floor!==r.tower.floor||Math.min(50,h.repeat)!==r.tower.repeat)throw Error('Tower training receipt needs its actual conserved wager settlement.');}},
 tick,commands:{stageEntry,stageFinish,finishLive,act,presentation},projection:()=>({visible:!!value(),state:value()})});
