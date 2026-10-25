// Native host for the early-Tingen Seer slice (LIP3/LIP4). One authority per fact (AR3):
// state.lotm and the simulation own the branch, the supervisor's native inventory owns the
// finite stock, native sleep is joined to book.lotm.sleep (D4). The caller supplies ports;
// this file imports no main.js and publishes only through the one expansion publisher.
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {lotmCommands,lotmContext} from './book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from './book_world_lotm_content.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES,LOTM_SWITCH_NOTICE} from './book_world_lotm_ids.js';
import {lotmPathView} from './book_world_lotm_path.js';
import {flagOf} from './book_world_lotm_pathways.js';
import {pathwayRows,allRows} from './book_world_lotm_rows.js';
const examIds=new Set(allRows.filter(r=>r.exam).map(r=>`book.lotm.${r.exam.currentId||r.exam.id}`));
import {LOTM_PROFILES,profileKeyOf,lifeEntryEffects} from './book_world_lotm_lives.js';
import {causeView} from './book_world_lotm_causes.js';
import {brokerView} from './book_world_lotm_broker.js';
import {BENCH_PREFIX,INGREDIENT_BY_NAME,benchRowList,seedBenchStock,stockSeeded} from './book_world_lotm_bench.js';
import {LOTM_TIERS,rowById} from './lotm_formula_rows.js';
import {CC_BREW} from './book_world_lotm_brew.js';
import {clearanceView} from './book_world_lotm_clearance.js';
import {districtOfPlace,districtById,respondersFor,lotmWalkMinutes,LOTM_PLACE_KEYS,onShift} from './book_world_lotm_districts.js';
const copy=x=>structuredClone(x),assert=(ok,text)=>{if(!ok)throw Error(text);};
const SLEEP='book.lotm.sleep',MOVES=Object.fromEntries(Object.entries(L).map(([k,place])=>[`lotm.move.${k}`,place]));
export const LOTM_MOVE_LABELS=Object.fromEntries(Object.entries(L).map(([k,place])=>[`lotm.move.${k}`,{workroom:'Walk to the supervised workroom',lodging:'Walk to your probationer lodging'}[k]||`Walk to ${place.replace(/^Tingen /,'the ')}`]));
// Meters are views of the energy record, which already owns reserve, strain and the limit
// (energy_resources.js). Nothing new is saved. At the strain limit the engine refuses the next use.
export function lotmMeters(e){
 if(!e)return [];
 return [
  {id:'lotm.spirituality',label:'Spirituality',kind:'pool',value:e.reserve,max:e.policy.capacity,note:'Spent by practice and observation. Sleeping at your lodging restores it.'},
  {id:'lotm.strain',label:'Strain',kind:'accumulator',value:e.strain,max:e.policy.strainLimit,note:'Each use adds strain. At the limit you cannot use the method until you sleep and cool off.'}];
}
export function lotmSimulationContexts(state,contexts){
 if(!state.lotm)return contexts;
 return Object.fromEntries(Object.entries(contexts).map(([id,c])=>[id,lotmContext(state,{...c,actorId:id})]));
}
const acceptIds=new Set(['book.lotm.accept_allocation',...pathwayRows.map(r=>`book.lotm.${r.ids.accept}`)]);
const acceptFlag=Object.fromEntries([['book.lotm.accept_allocation','allocated'],...pathwayRows.map(r=>[`book.lotm.${r.ids.accept}`,flagOf(r,'allocated')])]);

const NOT_WRITTEN='Not yet written: this pathway has no ingestion in the game yet, so a brewed dose can be held or sold, not drunk.';
// One formula for the bench panel: slots with held counts and buy offers, ritual and route as data, gaps, price, timer and only this formula's actions (DWF128).
function benchDetail(s,c,id,{registry,asleep}){
 const row=rowById(id),f=c.facts;if(!row)return null;
 const prev=cid=>{const d=registry.simulation.commands.get(cid);if(!d)return null;const p=previewSimulationCommand(s,registry,cid,{...c,targetId:d.targetId||null});
  return {id:cid,label:d.label,eligible:p.eligible&&!asleep,reasons:p.eligible&&asleep?['You are asleep.']:p.reasons};};
 const brewable=row.status==='brewable',viaMain=row.id==='death_9';
 const slots=row.slots.map(sl=>{const ing=INGREDIENT_BY_NAME[sl.select.material],held=ing?f[`lotm.bf.holds.${ing.slug}`]||0:0;
  return {id:sl.id,role:sl.role,name:sl.select.material,amount:sl.amount||null,need:sl.qty,held,evidence:sl.evidence,tier:ing?.tier||null,pence:ing?.pence??null,stock:ing?f[`lotm.bf.stock.${ing.slug}`]||0:0,
   buy:ing&&ing.tier!=='none'&&held<sl.qty?prev(`book.lotm.bf_ing_${ing.slug}`):null,
   noRoute:ing&&ing.tier==='none'?`${LOTM_TIERS.none.reason} Canon route: ${row.route.text}`:null};});
 const summary=benchRowList(s,f).find(r=>r.id===id);
 const actions=[];
 if(brewable&&!viaMain){
  if(row.price&&!summary.formulaKnown)actions.push(prev(`book.lotm.bf_buy_${id}`));
  if(summary.formulaKnown&&!summary.brewing)actions.push(prev(`book.lotm.bf_start_${id}`));
  if(summary.brewing)actions.push(prev(`book.lotm.bf_collect_${id}`));
  if(summary.doses&&row.product.sellPence)actions.push(prev(`book.lotm.bf_sell_${id}`));
 }
 return {...summary,minutes:row.minutes,price:row.price||null,formulaRoute:!row.price&&brewable&&!viaMain?row.route:null,route:row.route,ritual:row.ritual||null,gaps:row.gaps,evidence:row.evidence,
  slots,actions,product:brewable&&!viaMain?{name:row.product.name,sellPence:row.product.sellPence}:null,
  via:viaMain?`Brewed at Hale's bench with the Corpse Collector actions in the list above (${CC_BREW.minutes} minutes, formula ${CC_BREW.formulaPence} pence).`:null,
  drink:summary.doses?{eligible:false,reason:row.ritual?.needed?`${NOT_WRITTEN} Drinking it without its rite (${row.ritual.scale}: ${row.ritual.text}) is a stated loss-of-control risk.`:NOT_WRITTEN}:null};
}
export function createLotmHost(ports){
 const state=()=>ports.state(),registry=ports.registry;
 const sleepJob=s=>s.simulation?.jobs?.find(j=>j.commandId===SLEEP&&j.actorId==='player');
 function ctx(s,def){const c=ports.context(),vitals=c.vitals||{};
  return lotmContext(s,{...c,actorId:'player',vitalsByActor:c.vitalsByActor||vitals,busy:!!ports.busy(),targetId:def?.targetId||null});}
 const base=(s,c)=>({state:copy(s),external:copy(c.external||{}),gameplay:copy(c.gameplay||{}),gameplayBefore:copy(c.gameplay||{}),vitals:copy(c.vitals||{}),equipment:copy(c.equipment||{}),acquisitions:[],unlocks:[]});
 function writable(){assert(ports.writable(),'Saving is paused, so the branch cannot change now.');}
 function startable(){const s=state();return ports.startEnabled()&&!s.lotm&&s.actors.player.worldId==='base.frontier'&&ports.location()==='Village'&&ports.writable()&&!ports.busy();}
 function enroll(profileKey='probationer'){
  const profile=LOTM_PROFILES[profileKey];assert(profile,'Choose one of the Tingen starts.');
  assert(startable(),'Begin the Tingen branch only from the Village on a disposable test save, with nothing else under way.');
  const s=state(),c=ports.context();let cur=s,external=c.external,gameplay=c.gameplay,vitals=c.vitals,equipment=c.equipment,enrolled=null;
  if(!s.simulation){enrolled=enrollSimulation(s,registry,{...c,busy:false,facts:{...c.facts,location:'Village'}},s.sequence);cur=enrolled.state;external=enrolled.external;gameplay=enrolled.gameplay;vitals=enrolled.vitals||vitals;equipment=enrolled.equipment||equipment;}
  const plan=base(cur,{external,gameplay,vitals,equipment});
  if(enrolled){plan.acquisitions=[...enrolled.acquisitions];plan.unlocks=[...enrolled.unlocks];}
  plan.state.sequence++;plan.state.schema=11;enrollLotmBranch(plan.state,profileKey);
  // A new identity carries no cash (F25): the profile's own purse replaces the frontier money, on this disposable branch only.
  if(profile.cash!=null)plan.external={...plan.external,money:profile.cash};
  for(const [owner,stock] of Object.entries(LOTM_NATIVE_STOCK))plan.gameplay[owner]={inventory:copy(stock),skills:{},reputation:{}};
  applySimulationEffects(plan,lifeEntryEffects(profileKey),{...c,actorId:'player'},registry,'book.lotm.enroll');
  plan.nativeLocation=profile.start;plan.nativePatch={'current location':profile.start};
  ports.persist(plan);return plan;
 }
 // DWF127: stock for the bench is written on first need, once per row revision, so a save enrolled before the bench still sees it.
 function seedBench(){const s=state();if(!s.lotm||stockSeeded(s))return;const plan=base(s,ports.context());if(seedBenchStock(plan))ports.persist(plan);}
 function act(id){
  writable();if(id.startsWith(BENCH_PREFIX))seedBench();
  const s=state(),def=registry.simulation.commands.get(id);
  assert(s.lotm&&def?.group==='book_lotm','Choose an action from the Tingen branch.');
  assert(!ports.sleeping(),'Wake first: you are asleep.');
  assert(!ctx(s,def).facts['lotm.lostControl'],'You have lost control. Nothing you do here changes it.');
  const plan=commitSimulationCommand(s,registry,{id},ctx(s,def),s.sequence);
  ports.persist(plan);
  if(id===SLEEP)ports.beginSleep();
  return plan;
 }
 function cancel(jobId){
  writable();const s=state(),job=s.simulation?.jobs.find(j=>j.id===jobId&&j.actorId==='player'&&lotmCommands.some(d=>d.id===j.commandId));
  assert(job&&['forfeit','refund'].includes(job.cancellation),'This work cannot be stopped.');
  ports.persist(cancelSimulationJob(s,registry,job.id,ctx(s),s.sequence));
  if(job.commandId===SLEEP&&ports.sleeping())ports.endSleep();
 }
 // A walk is a timed job (district links, real minutes). The body is placed at the destination when the walk starts, because the engine records a job's
 // place at start; the job occupies the player until the arrival record is written. Machinery and Storm lives use their own life-neutral walk set.
 const walkId=(s,from,to)=>{const home=LOTM_PROFILES[profileKeyOf(s)]?.home,suffix=home==='storm'||home==='machinery'?`_${home}`:'';return `book.lotm.walk_${LOTM_PLACE_KEYS[from]}_${LOTM_PLACE_KEYS[to]}${suffix}`;};
 function move(id){
  writable();const s=state(),to=MOVES[id];assert(s.lotm&&to,'No such walk.');
  assert(!s.simulation.jobs.length&&!ports.sleeping()&&!ports.busy(),'Finish or stop your current work first.');
  const from=s.simulation.people.player.location;assert(from!==to,'You are already there.');
  const def=registry.simulation.commands.get(walkId(s,from,to));assert(def,'There is no walk from here to there.');
  const plan=commitSimulationCommand(s,registry,{id:def.id},ctx(s,def),s.sequence);
  plan.state.simulation.people.player.location=to;plan.nativeLocation=to;plan.nativePatch={'current location':to};
  ports.persist(plan);return plan;
 }
 // Native sleep ended by any cause before the job finished: the job is forfeited, nothing is restored (D4).
 function wake(){const s=state(),job=s.lotm&&sleepJob(s);if(job&&!ports.restoring()&&ports.writable())cancel(job.id);}
 // The job finished (or was cancelled) while native sleep was still on: end native sleep once.
 function tick(){const s=state();if(s.lotm&&ports.sleeping()&&!sleepJob(s))ports.endSleep();}
 function view(selected=null){
  const s=state(),d=s.lotm;
  if(!d)return {enrolled:false,startable:startable(),startEnabled:ports.startEnabled(),profiles:Object.values(LOTM_PROFILES).map(({key,label,blurb})=>({key,label,blurb}))};
  const c=ctx(s),f=c.facts,at=s.simulation.people.player.location,e=s.simulation.energies?.player?.[I.energy],know=s.simulation.knowledge?.player||{};
  const actions=[];
  for(const def of lotmCommands){if(pathwayRows.some(r=>r.exam?.currentId&&def.id===`book.lotm.${r.exam.id}`)||def.id.startsWith('book.lotm.walk_')||def.id.startsWith(BENCH_PREFIX)||def.targetId&&!s.simulation.people[def.targetId]&&!examIds.has(def.id))continue;const p=previewSimulationCommand(s,registry,def.id,{...c,targetId:def.targetId||null});
   // The rule text of a blocked offer is not player-readable; the switching law is (one pathway per life).
   const other=acceptIds.has(def.id)&&f['lotm.pathChosen']&&!f[`lotm.flag.${acceptFlag[def.id]}`];
   if(p.visible)actions.push({id:def.id,label:def.label,eligible:p.eligible&&!ports.sleeping(),reasons:other?[LOTM_SWITCH_NOTICE]:p.eligible&&ports.sleeping()?['You are asleep.']:p.reasons,duration:def.duration||0,cancellation:def.cancellation||'none'});}
  const moves=Object.entries(MOVES).filter(([,to])=>to!==at).map(([id,to])=>{const dd=districtOfPlace(to),m=lotmWalkMinutes(at,to);return {id,label:`Walk to ${to} · ${m} min · ${dd.qlabel}: ${dd.q2team}`,eligible:!s.simulation.jobs.length&&!ports.sleeping(),reasons:s.simulation.jobs.length||ports.sleeping()?['Finish or stop your current work first.']:[]};});
  // Plain places list (SR rules): every place, its district, which team answers there and how far it is.
  const places=Object.values(L).map(pl=>{const dd=districtOfPlace(pl);return {place:pl,district:dd.qlabel,team:dd.q2team,church:dd.church,here:pl===at,minutes:pl===at?0:lotmWalkMinutes(at,pl)};});
  const jobs=s.simulation.jobs.filter(j=>lotmCommands.some(d=>d.id===j.commandId)).map(j=>({id:j.id,label:registry.simulation.commands.get(j.commandId).label,due:j.due,left:Math.max(0,j.due-s.clock),cancellation:j.cancellation,cancellable:['forfeit','refund'].includes(j.cancellation)}));
  const holds=Object.fromEntries(['dose','clownDose',...pathwayRows.flatMap(r=>[r.holds.base,r.holds.next]),'sealed3','frog','hairs','ink',...pathwayRows.filter(r=>r.market).flatMap(r=>[r.market.baseHold,r.market.nextHold]),...LOTM_SAMPLES].map(n=>[n,f[`lotm.holds.${n}`]||0]));
  const records=Object.entries(know).filter(([k])=>k.startsWith('book.lotm.')).map(([k,r])=>({id:k,text:r.value,stage:r.stage,at:r.at})).sort((a,b)=>(b.at??0)-(a.at??0));
  const homeKey=profileKeyOf(s),homeChurch=homeKey?districtById(LOTM_PROFILES[homeKey].home)?.church:null,dist=districtOfPlace(at),district=dist&&{id:dist.id,label:dist.label,team:dist.team,officer:dist.officerLabel,officerHere:f['lotm.officerHere'],responders:respondersFor(dist.id,homeChurch).line,home:!!f[`lotm.home.${dist.id}`],onShift:onShift(dist,s.clock),shift:!!dist.shift,claim:dist.claim,why:dist.why,endorsed:!!f[`lotm.home.${dist.id}`]||f[`lotm.flag.endorsed.${dist.id}`]===true,attention:f['lotm.officerAttention']};
  const doseLabels=pathwayRows.flatMap(r=>[[r.holds.base,`prepared ${r.potion} dose`],[r.holds.next,`prepared ${r.next} dose`]]).filter(([k])=>holds[k]).map(x=>x[1]);
  const clearance=at===L.workroom?clearanceView(f['lotm.roleName'],f['lotm.presentRoles']?f['lotm.presentRoles'].split(','):[]):[];
  const marketHeld=pathwayRows.filter(r=>r.market).flatMap(r=>[[r.market.baseHold,`unmarked dose`],[r.market.nextHold,`unmarked Sequence 8 dose`]]).filter(([k])=>holds[k]).map(x=>x[1]);
  // A save from before the bench has no stock yet; offers preview against the stock the first action will seed, so the buttons are not dead (DWF127).
  let sv=s,cv=c;if(!stockSeeded(s)){const t=base(s,c);seedBenchStock(t);sv=t.state;cv={...c,gameplay:t.gameplay};}
  const bench={rows:benchRowList(s,f),selected:selected&&benchDetail(sv,cv,selected,{registry,asleep:ports.sleeping()})};
  return {enrolled:true,bench,broker:brokerView(s,f),places,marketHeld,cause:causeView(f),profile:profileKeyOf(s),role:f['lotm.roleName'],clearance,district,doseLabels,beyonder:!!(f['lotm.sourceSupported']||pathwayRows.some(r=>f[`lotm.${r.key}Supported`])),switchNotice:LOTM_SWITCH_NOTICE,at,supervisorHere:f['lotm.supervisorHere'],attention:f['lotm.supervisorAttention'],source:f['lotm.sourceSupported'],method:f['lotm.methodSupported'],sleeping:ports.sleeping(),energy:e?{reserve:e.reserve,capacity:e.policy.capacity,strain:e.strain,limit:e.policy.strainLimit}:null,meters:lotmMeters(e),path:lotmPathView(s,f),holds,actions,moves,jobs,records};
 }
 return {enroll,act,cancel,move,wake,tick,view,startable};
}
