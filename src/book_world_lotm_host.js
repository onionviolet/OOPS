import {runWaitUntil} from './wait_until.js';
import {castJourneyCommands,castJourneyOffers,castJourneyContext,castTopicOffers,castObjectOffers,castObjectCommands,castWaitOptions,nextCastBeatTime,currentCastBeatLedger} from './book_world_lotm_cast_host.js';
import {persistLotmCastPlan,castBeatsPending,castSyncDue,installCast,castElsewhere,castCalendar,castAvailable,castPlaces,castMoves,castPlaceLabel,castWalkId,castWalkCommands,installCastWalk,lotmBe,lotmCastLife,syncLotmCast,castTalkCommands,castTalkPreview,canonActionDecision,castWriteCode,castRevisionReport} from './book_world_lotm_cast_host.js';
// Native host for the early-Tingen Seer slice (LIP3/LIP4). One authority per fact (AR3):
// state.lotm and the simulation own the branch, the supervisor's native inventory owns the
// finite stock, native sleep is joined to book.lotm.sleep (D4). The caller supplies ports;
// this file imports no main.js and publishes only through the one expansion publisher.
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {simulationFacts,applySimulationEffects} from './simulation_effects.js';
import {lotmCommands,lotmContext,lotmFacts} from './book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from './book_world_lotm_content.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES,LOTM_SWITCH_NOTICE} from './book_world_lotm_ids.js';
import {lotmPathView} from './book_world_lotm_path.js';
import {flagOf} from './book_world_lotm_pathways.js';
import {pathwayRows,allRows} from './book_world_lotm_rows.js';
import {generatedRows,generatedDrinkIds} from './book_world_lotm_generated.js';
const examIds=new Set(allRows.filter(r=>r.exam).map(r=>`book.lotm.${r.exam.currentId||r.exam.id}`));
import {LOTM_PROFILES,profileKeyOf,lifeEntryEffects,leadLifeEntryEffects,validLeadLife} from './book_world_lotm_lives.js';
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
import {entryRecord,entryAnswers,LOTM_ENTRY_AXES} from './book_world_lotm_entry.js';
import {causeView} from './book_world_lotm_causes.js';
import {brokerView} from './book_world_lotm_broker.js';
import {gradeRiteAtTransition} from './book_world_lotm_ritual.js';
import {meritView} from './book_world_lotm_merit.js';
import {BENCH_PREFIX,INGREDIENT_BY_NAME,benchRowList,seedBenchStock,stockSeeded,characteristicBrewId} from './book_world_lotm_bench.js';
import {LOTM_TIERS,rowById} from './lotm_formula_rows.js';
import {CC_BREW} from './book_world_lotm_brew.js';
import {abilitySourceOf} from './book_world_lotm_abilities.js';
import {clearanceView} from './book_world_lotm_clearance.js';
import {districtOfPlace,districtById,respondersFor,lotmWalkMinutes,LOTM_PLACE_KEYS,onShift} from './book_world_lotm_districts.js';
const copy=x=>structuredClone(x),assert=(ok,text)=>{if(!ok)throw Error(text);};
const SLEEP='book.lotm.sleep',MOVES=Object.fromEntries(Object.entries(L).map(([k,place])=>[`lotm.move.${k}`,place]));
export const lotmMoveLabels=()=>({...Object.fromEntries(Object.entries(L).map(([k,place])=>[`lotm.move.${k}`,{workroom:'Walk to the supervised workroom',lodging:'Walk to your probationer lodging'}[k]||`Walk to ${place.replace(/^Tingen /,'the ')}`])),...Object.fromEntries(castPlaces.map(p=>[`lotm.move.${p.id}`,`Walk to ${p.name}`]))});
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
 // Facts depend on this state, gameplay and native stock, not the actor id.
 // Share that pure read within this call only; every recipient owns its facts.
 const reads=new Map();
 return Object.fromEntries(Object.entries(contexts).map(([id,c])=>{
  let stocks=reads.get(c.gameplay);if(!stocks)reads.set(c.gameplay,stocks=new Map());
  const stock=c.lotmNative?.stock;
  if(!stocks.has(stock))stocks.set(stock,lotmFacts(state,c));
  return [id,castJourneyContext(state,{...c,actorId:id,facts:{...c.facts,...stocks.get(stock)}})];
 }));
}
const acceptIds=new Set(['book.lotm.accept_allocation',...pathwayRows.map(r=>`book.lotm.${r.ids.accept}`)]);
const acceptFlag=Object.fromEntries([['book.lotm.accept_allocation','allocated'],...pathwayRows.map(r=>[`book.lotm.${r.ids.accept}`,flagOf(r,'allocated')])]);

const NOT_WRITTEN='Not yet written: this pathway has no ingestion in the game yet, so a brewed dose can be held or sold, not drunk.';
// One formula for the bench panel: slots with held counts and buy offers, ritual and route as data, gaps, price, timer and only this formula's actions (DWF128).
function benchDetail(s,c,id,{registry,asleep}){
 const row=rowById(id),f=c.facts;if(!row)return null;
 const prev=cid=>{const d=registry.simulation.commands.get(cid);if(!d)return null;const p=previewSimulationCommand(s,registry,cid,{...c,targetId:d.targetId||null});
  return {id:cid,label:d.label,visible:p.visible,eligible:p.eligible&&!asleep,reasons:p.eligible&&asleep?['You are asleep.']:p.reasons};};
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
  const coreId=characteristicBrewId(row),coreAction=coreId&&summary.formulaKnown&&!summary.brewing?prev(coreId):null;
  if(coreAction?.visible)actions.push({...coreAction,label:`${coreAction.label} · TC01 held: ${f['lotm.bf.core.tc01.held']||0}`});
  if(summary.brewing)actions.push(prev(`book.lotm.bf_collect_${id}`));
  if(summary.doses&&row.product.sellPence)actions.push(prev(`book.lotm.bf_sell_${id}`));
 }
 return {...summary,rite:gradeRiteAtTransition(id,f),minutes:row.minutes,price:row.price||null,formulaRoute:!row.price&&brewable&&!viaMain?row.route:null,route:row.route,ritual:row.ritual||null,gaps:row.gaps,evidence:row.evidence,
  slots,actions,product:brewable&&!viaMain?{name:row.product.name,sellPence:row.product.sellPence}:null,
  via:viaMain?`Brewed at Hale's bench with the Corpse Collector actions in the list above (${CC_BREW.minutes} minutes, formula ${CC_BREW.formulaPence} pence).`:null,
  drinkOptions:summary.doses&&generatedDrinkIds[id]?generatedDrinkIds[id].map(prev).filter(o=>o&&o.visible):null,
  drink:summary.doses&&!generatedDrinkIds[id]?{eligible:false,reason:row.ritual?.needed?`${NOT_WRITTEN} Drinking it without its rite (${row.ritual.scale}: ${row.ritual.text}) is a stated loss-of-control risk.`:NOT_WRITTEN}:null};
}
export function createLotmHost(ports){
 const registry=ports.registry;
 const persist=(plan,options={})=>persistLotmCastPlan(plan,ports.persist,{...options,publish:r=>ports.logMessage?.(r.text,r.kind,{safeText:true,panelId:'known-people'})});
 const state=()=>{installCast(registry);return ports.state();};
 const castState=s=>{if(!lotmCastLife(s))return s;const projected=copy(s);syncLotmCast(projected);return projected;};
 const sleepJob=s=>s.simulation?.jobs?.find(j=>j.commandId===SLEEP&&j.actorId==='player');
 function ctx(s,def){const c=ports.context(),vitals=c.vitals||{};
  const out=lotmContext(s,{...c,actorId:'player',vitalsByActor:c.vitalsByActor||vitals,busy:!!ports.busy(),targetId:def?.targetId||null});if(lotmBe(s))out.facts['lotm.profile.beside']=true;out.facts['topicTalk.hour']=castCalendar(s).calendar.hour;return castJourneyContext(s,out);}
 const base=(s,c)=>({state:copy(s),external:copy(c.external||{}),gameplay:copy(c.gameplay||{}),gameplayBefore:copy(c.gameplay||{}),vitals:copy(c.vitals||{}),equipment:copy(c.equipment||{}),acquisitions:[],unlocks:[]});
 function writable(){assert(ports.writable(),'Saving is paused, so the branch cannot change now.');assert(!lotmBe(state())||validLeadLife(getPrivateLotmCast()),'Cast unavailable: private pack absent. This life is read-only.');}
 function recordEmergent(plan,def){
  if(!lotmCastLife(plan.state))return;
  for(const e of [...(def.costs||[]),...(def.effects||[])]){
   castWriteCode(plan.state,`${e.type}:${e.actor||'player'}:${e.key||e.situationId||def.id}`,'emergent');
   const knowledge=e.type==='knowledge'&&plan.state.simulation.knowledge?.[e.actor||'player']?.[e.key];
   if(knowledge)knowledge.basis={kind:'observation',attributedTo:e.actor||'player',situationId:'book.lotm.tingen.canon_beside',...knowledge.basis,provenance:'emergent'};
  }
  applySimulationEffects(plan,[{type:'knowledge',actor:'player',key:`book.lotm.emergent.${plan.state.sequence}`,stage:'seen',value:def.label,
   basis:{kind:'observation',attributedTo:'player',situationId:'book.lotm.tingen.canon_beside',provenance:'emergent'}}],{actorId:'player'},registry,'book.lotm.emergent');
 }
 // Each unmet condition is its own player-facing reason, so a refusal names what to change.
 function startBlockers(){const s=state(),out=[];if(s.lotm)return ['This life is already in Tingen.'];
  if(!atVillage())out.push('Return to the Village first; Tingen is reached from there.');
  if(!ports.writable())out.push('Saving is paused, so a new life cannot begin now.');
  if(ports.busy())out.push('Finish or stop the work under way first.');
  return out;}
 function atVillage(){const s=state();return s.actors.player.worldId==='base.frontier'&&ports.location()==='Village';}
 function startable(){return !startBlockers().length;}
 function enroll(profileKey='probationer',{independent=false}={}){
  const profile=LOTM_PROFILES[profileKey];assert(profile&&(!['beside','be'].includes(profileKey)||castAvailable)&&(profileKey!=='be'||validLeadLife(getPrivateLotmCast())),'Choose one of the available Tingen starts.');
  assert(profileKey!=='be'||independent,'This life needs a fresh independent beginning.');
  assert(startable(),startBlockers().join(' '));
  const s=state(),c=ports.context();let cur=s,external=c.external,gameplay=c.gameplay,vitals=c.vitals,equipment=c.equipment,enrolled=null;
  if(!s.simulation){enrolled=enrollSimulation(s,registry,{...c,busy:false,facts:{...c.facts,location:'Village'}},s.sequence);cur=enrolled.state;external=enrolled.external;gameplay=enrolled.gameplay;vitals=enrolled.vitals||vitals;equipment=enrolled.equipment||equipment;}
  const plan=base(cur,{external,gameplay,vitals,equipment});
  if(enrolled){plan.acquisitions=[...enrolled.acquisitions];plan.unlocks=[...enrolled.unlocks];}
  plan.state.sequence++;plan.state.schema=11;enrollLotmBranch(plan.state,profileKey);
  // Money does not cross (WER9, F25): the life's own purse replaces the money held before crossing, which the entry record keeps for a later return.
  const leftBehind=Math.max(0,Math.floor(Number(plan.external?.money)||0));
  plan.external={...plan.external,money:profile.cash};if(profileKey!=='be')plan.state.lotm.entry=entryRecord(profileKey,leftBehind);
  if(profileKey==='be'){
   // The fresh native shell supplies a default kit. It is not this person's
   // property; the pack's observed room objects are not carried inventory.
   plan.gameplay.player.inventory={};plan.equipment={...plan.equipment,player:{}};
  }
  if(profileKey!=='be')for(const [owner,stock] of Object.entries(LOTM_NATIVE_STOCK))plan.gameplay[owner]={inventory:copy(stock),skills:{},reputation:{}};
  applySimulationEffects(plan,lifeEntryEffects(profileKey),{...c,actorId:'player'},registry,'book.lotm.enroll');
  if(profileKey==='be'){
   const opening=leadLifeEntryEffects(getPrivateLotmCast());
   applySimulationEffects(plan,opening,{...c,actorId:'player'},registry,'book.lotm.history');
   for(const e of opening)castWriteCode(plan.state,`knowledge:player:${e.key}`,'canon');
   castWriteCode(plan.state,'location:player','canon');castWriteCode(plan.state,'resource:player:money','canon');
  }
  ports.ensureCastLocation?.(profile.start);plan.nativeLocation=profile.start;plan.nativePatch={'current location':profile.start,...(profileKey==='be'?{'character/name':getPrivateLotmCast().people.find(p=>p.id===getPrivateLotmCast().leadLife.actorId).name}:{})};
  persist(plan,{reset:true});return plan;
 }
 // RET3: when a continuing connection can carry this life, crossing first pauses the Village life as it is (a tethered branch), then enrolls in place.
 // Without one (a non-adult host, a running challenge, no host port) it enrolls in place as before and the entry answers say there is no way back.
 function returnable(){return !!ports.branch&&!ports.branchReason?.();}
 async function cross(profileKey='probationer'){
  if(profileKey==='be'){
   const {whenCastLoaded}=await import('./book_world_lotm_cast_days.js');await whenCastLoaded();
   assert(validLeadLife(getPrivateLotmCast())&&ports.startBe,'A fresh book life is unavailable in this host.');
   return ports.startBe();
  }
  if(profileKey==='beside'){const {whenCastLoaded}=await import('./book_world_lotm_cast_days.js');await whenCastLoaded();installCast(registry);}
  const profile=LOTM_PROFILES[profileKey];assert(profile&&(profileKey!=='beside'||castAvailable),'Choose one of the available Tingen starts.');
  assert(startable(),startBlockers().join(' '));
  if(returnable())await ports.branch(`Tingen · ${profile.label.replace(/^Begin (as |under )?/,'')}`);
  return enroll(profileKey);
 }
 // DWF127: stock for the bench is written on first need, once per row revision, so a save enrolled before the bench still sees it.
 function seedBench(){const s=state();if(!s.lotm||stockSeeded(s))return;const plan=base(s,ports.context());if(seedBenchStock(plan))persist(plan);}
 function waitReason(){const s=state();return lotmBe(s)&&!validLeadLife(getPrivateLotmCast())?'Cast unavailable: private pack absent. This life is read-only.':!ports.writable()?'Saving is paused.':ports.sleeping()?'Wake first: you are asleep.':ports.busy()||s.simulation.jobs.length?'Finish or stop your current work first.':!ports.advanceWaitMinute?'Waiting is unavailable in this host.':'';}
 const waits=s=>{
  const intentions=lotmBe(s)?(getPrivateLotmCast()?.leadLife?.intentions||[]).filter(r=>s.simulation?.knowledge?.player?.[r.knowledge]).map(r=>({label:r.label,known:true,at:s.lotm.initializedAt+r.offset})):[];
  return castWaitOptions(s,{appointments:lotmBe(s)?intentions:ports.knownAppointments?.(s)||[],reason:waitReason()});
 };
 function act(id){
  if(id.startsWith('wait.until.')){
   writable();assert(!waitReason(),waitReason());
   return runWaitUntil(id,{read:()=>{const s=state();return {clock:s.clock,place:s.simulation.people.player.location,state:s};},options:r=>waits(r.state),advance:minutes=>ports.advanceWaitMinute(minutes),blocked:waitReason,nextBoundary:(r,target)=>nextCastBeatTime(r.state,target,currentCastBeatLedger())});
  }
  writable();if(id.startsWith(BENCH_PREFIX))seedBench();
  const s=castState(state()),def=registry.simulation.commands.get(id);
  assert(s.lotm&&def?.group==='book_lotm','Choose an action from the Tingen branch.');
  const canon=canonActionDecision(s,def,getPrivateLotmCast(),ports.context());assert(canon.allowed,canon.reason);
  assert(!ports.sleeping(),'Wake first: you are asleep.');
  assert(!ctx(s,def).facts['lotm.lostControl'],'You have lost control. Nothing you do here changes it.');
  if(lotmCastLife(s)){const quote=castTalkPreview(s,def,previewSimulationCommand(s,registry,id,ctx(s,def)));
   assert(quote.eligible,quote.reasons.join(' ')||'This command is hidden.');}
  const plan=commitSimulationCommand(s,registry,{id},ctx(s,def),s.sequence);
  recordEmergent(plan,def);
  syncLotmCast(plan.state);
  persist(plan);
  if(id===SLEEP)ports.beginSleep();
  return plan;
 }
 function cancel(jobId){
  writable();const s=state(),job=s.simulation?.jobs.find(j=>j.id===jobId&&j.actorId==='player'&&lotmCommands.some(d=>d.id===j.commandId));
  assert(job&&['forfeit','refund'].includes(job.cancellation),'This work cannot be stopped.');
  persist(cancelSimulationJob(s,registry,job.id,ctx(s),s.sequence));
  if(job.commandId===SLEEP&&ports.sleeping())ports.endSleep();
 }
 // A walk is a timed job (district links, real minutes). The body is placed at the destination when the walk starts, because the engine records a job's
 // place at start; the job occupies the player until the arrival record is written. Machinery and Storm lives use their own life-neutral walk set.
 const walkId=(s,from,to)=>{if(castPlaces.some(p=>p.id===from||p.id===to))return castWalkId(from,to);const home=LOTM_PROFILES[profileKeyOf(s)]?.home,suffix=home==='storm'||home==='machinery'?`_${home}`:'';return `book.lotm.walk_${LOTM_PLACE_KEYS[from]}_${LOTM_PLACE_KEYS[to]}${suffix}`;};
 function move(id){
  writable();const s=castState(state()),to=(lotmCastLife(s)?{...MOVES,...castMoves}:MOVES)[id];assert(s.lotm&&to,'No such walk.');
  assert(!s.simulation.jobs.length&&!ports.sleeping()&&!ports.busy(),'Finish or stop your current work first.');
  const from=s.simulation.people.player.location;assert(from!==to,'You are already there.');
  const def=installCastWalk(registry,from,to)||registry.simulation.commands.get(walkId(s,from,to));assert(def,'There is no walk from here to there.');
  const canon=canonActionDecision(s,def,getPrivateLotmCast(),ports.context());assert(canon.allowed,canon.reason);
  ports.ensureCastLocation?.(to);
  const plan=commitSimulationCommand(s,registry,{id:def.id},ctx(s,def),s.sequence);
  recordEmergent(plan,def);
  plan.state.simulation.people.player.location=to;castWriteCode(plan.state,'location:player','emergent');plan.nativeLocation=to;plan.nativePatch={'current location':to};
  syncLotmCast(plan.state);persist(plan);return plan;
 }
 // Native sleep ended by any cause before the job finished: the job is forfeited, nothing is restored (D4).
 function wake(){const s=state(),job=s.lotm&&sleepJob(s);if(job&&!ports.restoring()&&ports.writable())cancel(job.id);}
 // The job finished (or was cancelled) while native sleep was still on: end native sleep once.
 function tick(){const s=state();if(lotmCastLife(s)&&(castSyncDue(s)||castBeatsPending(s))&&ports.writable()&&(!lotmBe(s)||validLeadLife(getPrivateLotmCast()))){const plan=base(s,ports.context());if(syncLotmCast(plan.state)||castBeatsPending(plan.state))persist(plan);}if(s.lotm&&ports.sleeping()&&!sleepJob(s))ports.endSleep();}
 function view(selected=null){
  const s=castState(state()),d=s.lotm;
  if(!d)return {enrolled:false,atVillage:atVillage(),startable:startable(),startReasons:startBlockers(),axes:LOTM_ENTRY_AXES,returnable:returnable(),profiles:Object.values(LOTM_PROFILES).filter(p=>p.key==='be'?validLeadLife(getPrivateLotmCast()):p.key!=='beside'||castAvailable).map(({key,label,blurb})=>({key,label,blurb,answers:key==='be'?[['Beginning',blurb]]:entryAnswers(key,{returnable:returnable()}),...(key==='be'?{independent:true,available:!!ports.startBe}: {})}))};
  const c=ctx(s),f=c.facts,at=s.simulation.people.player.location,e=s.simulation.energies?.player?.[I.energy],know=s.simulation.knowledge?.player||{};
  if(lotmBe(s)){
   const loaded=getPrivateLotmCast(),ready=validLeadLife(loaded),pack=ready?loaded:null,life=pack?.leadLife,elapsed=s.clock-s.lotm.initializedAt;
   const allowed=new Set([at,...(life?.knownPlaces||[]),...Object.keys(know).filter(k=>k.startsWith('book.lotm.cast.place.known.')).map(k=>k.slice('book.lotm.cast.place.known.'.length))]);
   const places=castPlaces.filter(p=>allowed.has(p.id)).map(p=>{const dd=districtOfPlace(p.id);return {place:castPlaceLabel(p.id),district:dd.qlabel,team:dd.q2team,church:dd.church,here:p.id===at,minutes:p.id===at?0:lotmWalkMinutes(at,p.id)};});
   const moves=Object.entries(castMoves).filter(([,to])=>allowed.has(to)&&to!==at).map(([id,to])=>{const dd=districtOfPlace(to),m=lotmWalkMinutes(at,to),def=installCastWalk(registry,at,to)||registry.simulation.commands.get(walkId(s,at,to)),decision=canonActionDecision(s,def,getPrivateLotmCast(),ports.context());return {id,label:`Walk to ${castPlaceLabel(to)} · ${m} min · ${dd.qlabel}: nearby`,eligible:decision.allowed&&castAvailable&&!s.simulation.jobs.length&&!ports.sleeping(),reasons:castAvailable?(decision.allowed?[]:[decision.reason]):['Restore the book pack to resume.']};});
   const actions=castTalkCommands.filter(def=>!def.topicTalk).filter(def=>s.simulation.people[def.targetId]&&(know[`book.lotm.cast.known.${def.targetId}`]||know[`book.lotm.cast.met.${def.targetId}`])).flatMap(def=>{const q=castTalkPreview(s,def,previewSimulationCommand(s,registry,def.id,{...c,targetId:def.targetId})),decision=canonActionDecision(s,def,getPrivateLotmCast(),ports.context()),p=decision.allowed?q:{...q,eligible:false,reasons:[...q.reasons,decision.reason]};return p.visible?[{id:def.id,label:def.label,eligible:p.eligible&&castAvailable&&!ports.sleeping(),reasons:!castAvailable?['Restore the book pack to resume.']:p.reasons,duration:p.duration}]:[];});
   for(const choice of life?.untakenChoices||[]){const day=pack.bindings.days.find(r=>r.scene===choice.scene),begin=day&&((day.day-1)*1440+day.from),end=day&&((day.day-1)*1440+day.to);
    if(day&&elapsed>=begin&&elapsed<end)actions.push({id:`book.lotm.untaken.${choice.id}`,label:choice.label,eligible:false,reasons:['Not how it happened'],duration:0});}
   if(!ready)actions.push({id:'book.lotm.cast_unavailable',label:'Cast unavailable: private pack absent',eligible:false,reasons:['Restore the book pack to resume this read-only life.'],duration:0});
   const journeys=castJourneyOffers(s,def=>previewSimulationCommand(s,registry,def.id,ctx(s,def)),{facts:def=>simulationFacts(s,ctx(s,def),registry,[def.requires]),blocked:!ports.writable()?'Saving is paused.':ports.sleeping()?'Wake first: you are asleep.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),ports.context())});
   const topicTalks=castTopicOffers(s,def=>previewSimulationCommand(s,registry,def.id,ctx(s,def)),{blocked:!ports.writable()?'Saving is paused.':ports.sleeping()?'Wake first: you are asleep.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),ports.context())});
   const objectActs=castObjectOffers(s,def=>previewSimulationCommand(s,registry,def.id,ctx(s,def)),{blocked:!ports.writable()?'Saving is paused.':ports.sleeping()?'Wake first: you are asleep.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),ports.context())});
   const jobs=s.simulation.jobs.filter(j=>[...castWalkCommands,...castObjectCommands,...castTalkCommands,...castJourneyCommands].some(d=>d.id===j.commandId)).map(j=>({id:j.id,label:registry.simulation.commands.get(j.commandId)?.label||'Saved walk',due:j.due,left:Math.max(0,j.due-s.clock),cancellation:j.cancellation,cancellable:false}));
   const records=Object.entries(know).filter(([k])=>k.startsWith('book.lotm.history.')).map(([id,r])=>({id,text:r.value,at:r.at}));
   return {enrolled:true,resident:true,runMode:s.lotm.runMode,entryProfile:s.lotm.entryProfile,at:castPlaceLabel(at),localClock:castClockLine(s),sleeping:ports.sleeping(),meters:[],places,moves,actions,journeys,topicTalks,objectActs,waits:waits(s),elsewhere:castElsewhere(s),jobs,records};
  }
  const actions=[],actingGuidance=[];
  const path=lotmPathView(s,f),actingCrossing=path.crossings.find(x=>x.id==='acting');
  const actingRow=allRows.find(r=>f[`lotm.flag.${flagOf(r,'ingested')}`]&&!f[`lotm.flag.${flagOf(r,'promoted')}`]);
  const actingKey=actingRow&&(actingRow.acting||`book.lotm.${actingRow.key}.acting`);
  for(const def of [...lotmCommands,...(lotmCastLife(s)?castTalkCommands:[])]){if(abilitySourceOf[def.id]&&!s.actors.player.sources[abilitySourceOf[def.id]])continue;if(pathwayRows.some(r=>r.exam?.currentId&&def.id===`book.lotm.${r.exam.id}`)||def.id.startsWith('book.lotm.walk_')||def.id.startsWith(BENCH_PREFIX)||def.id.startsWith('book.lotm.merit_')||def.targetId&&!s.simulation.people[def.targetId]&&!examIds.has(def.id))continue;const p=castTalkPreview(s,def,previewSimulationCommand(s,registry,def.id,{...c,targetId:def.targetId||null}));
   // The rule text of a blocked offer is not player-readable; the switching law is (one pathway per life).
   const other=acceptIds.has(def.id)&&f['lotm.pathChosen']&&!f[`lotm.flag.${acceptFlag[def.id]}`];
   const action={id:def.id,label:def.label,eligible:p.eligible&&!ports.sleeping(),reasons:other?[LOTM_SWITCH_NOTICE]:p.eligible&&ports.sleeping()?['You are asleep.']:p.reasons,duration:p.duration,cancellation:def.cancellation||'none'};
   if(p.visible)actions.push(action);
   // Join the existing digestion consumer to public commands, never to undiscovered acts.
   // A notebook entry retains a previously performed act when its offer is no longer visible.
   const remembered=s.actors.player.completed[def.id]>0&&def.effects.some(e=>e.type==='knowledge'&&know[e.key]);
   if(actingCrossing&&!actingCrossing.met&&actingKey&&def.effects.some(e=>e.type==='resource'&&e.actor==='player'&&e.key===actingKey&&e.amount>0)&&(p.visible||remembered))
    actingGuidance.push({...action,visible:p.visible,place:def.location,moveId:Object.keys(MOVES).find(id=>MOVES[id]===def.location),here:def.location===at,pending:s.simulation.jobs.some(j=>j.actorId==='player'&&j.commandId===def.id),completed:!!def.once&&!!s.actors.player.completed[def.id],free:p.eligible&&p.costs.length===0});}
  const moves=Object.entries(lotmCastLife(s)&&!castAvailable&&!districtOfPlace(at)?{}:lotmCastLife(s)?{...MOVES,...castMoves}:MOVES).filter(([,to])=>to!==at).map(([id,to])=>{const dd=districtOfPlace(to),m=lotmWalkMinutes(at,to);return {id,label:`Walk to ${castPlaceLabel(to)} · ${m} min · ${dd.qlabel}: ${dd.q2team}`,eligible:!s.simulation.jobs.length&&!ports.sleeping(),reasons:s.simulation.jobs.length||ports.sleeping()?['Finish or stop your current work first.']:[]};});
  // Plain places list (SR rules): every place, its district, which team answers there and how far it is.
  const places=[...Object.values(L),...(lotmCastLife(s)?castPlaces.map(p=>p.id):[])].map(pl=>{const dd=districtOfPlace(pl);return {place:castPlaceLabel(pl),district:dd.qlabel,team:dd.q2team,church:dd.church,here:pl===at,minutes:pl===at?0:lotmWalkMinutes(at,pl)};});
  if(lotmCastLife(s)&&!castAvailable)actions.push({id:'book.lotm.cast_unavailable',label:'Cast unavailable: private pack absent',eligible:false,reasons:['Restore the private cast pack to resume meetings.'],duration:0});
  const jobs=s.simulation.jobs.filter(j=>[...lotmCommands,...castWalkCommands].some(d=>d.id===j.commandId)).map(j=>({id:j.id,label:registry.simulation.commands.get(j.commandId).label,due:j.due,left:Math.max(0,j.due-s.clock),cancellation:j.cancellation,cancellable:['forfeit','refund'].includes(j.cancellation)}));
  const holds=Object.fromEntries(['dose','clownDose',...pathwayRows.flatMap(r=>[r.holds.base,r.holds.next]),...generatedRows.flatMap(r=>[r.holds.base,r.holds.next]),'sealed3','frog','hairs','ink',...pathwayRows.filter(r=>r.market).flatMap(r=>[r.market.baseHold,r.market.nextHold]),...LOTM_SAMPLES].map(n=>[n,f[`lotm.holds.${n}`]||0]));
  const records=Object.entries(know).filter(([k])=>k.startsWith('book.lotm.')).map(([k,r])=>({id:k,text:r.value,stage:r.stage,at:r.at})).sort((a,b)=>(b.at??0)-(a.at??0));
  const homeKey=profileKeyOf(s),homeChurch=homeKey?districtById(LOTM_PROFILES[homeKey].home)?.church:null,dist=districtOfPlace(at),district=dist&&{id:dist.id,label:dist.label,team:dist.team,officer:dist.officerLabel,officerHere:f['lotm.officerHere'],responders:respondersFor(dist.id,homeChurch).line,home:!!f[`lotm.home.${dist.id}`],onShift:onShift(dist,s.clock),shift:!!dist.shift,claim:dist.claim,why:dist.why,endorsed:!!f[`lotm.home.${dist.id}`]||f[`lotm.flag.endorsed.${dist.id}`]===true,attention:f['lotm.officerAttention']};
  const doseLabels=pathwayRows.flatMap(r=>[[r.holds.base,`prepared ${r.potion} dose`],[r.holds.next,`prepared ${r.next} dose`]]).filter(([k])=>holds[k]).map(x=>x[1]);
  const clearance=at===L.workroom?clearanceView(f['lotm.roleName'],f['lotm.presentRoles']?f['lotm.presentRoles'].split(','):[]):[];
  const marketHeld=pathwayRows.filter(r=>r.market).flatMap(r=>[[r.market.baseHold,`unmarked dose`],[r.market.nextHold,`unmarked Sequence 8 dose`]]).filter(([k])=>holds[k]).map(x=>x[1]);
  // A save from before the bench has no stock yet; offers preview against the stock the first action will seed, so the buttons are not dead (DWF127).
  let sv=s,cv=c;if(!stockSeeded(s)){const t=base(s,c);seedBenchStock(t);sv=t.state;cv={...c,gameplay:t.gameplay};}
  const prevMerit=cid=>{const d=registry.simulation.commands.get(cid);if(!d)return null;const p=previewSimulationCommand(s,registry,cid,{...c,targetId:d.targetId||null});
   return {id:cid,label:d.label,eligible:p.eligible&&!ports.sleeping(),reasons:p.eligible&&ports.sleeping()?['You are asleep.']:p.reasons,visible:p.visible};};
  const merit=f['lotm.home.evernight']?meritView(s,f,prevMerit):null;
  const bench={rows:benchRowList(s,f),selected:selected&&benchDetail(sv,cv,selected,{registry,asleep:ports.sleeping()})};
  return {enrolled:true,...(lotmCastLife(s)?{resident:true,waits:waits(s),elsewhere:castElsewhere(s),localClock:castClockLine(s)}:{}),pausedLife:ports.pausedLife?.()||null,merit,bench,broker:brokerView(s,f),places,marketHeld,cause:causeView(f),profile:profileKeyOf(s),entryProfile:s.lotm?.entryProfile,role:f['lotm.roleName'],clearance,district,doseLabels,beyonder:!!(f['lotm.sourceSupported']||[...pathwayRows,...generatedRows].some(r=>f[`lotm.${r.key}Supported`])),switchNotice:LOTM_SWITCH_NOTICE,at:castPlaceLabel(at),supervisorHere:f['lotm.supervisorHere'],attention:f['lotm.supervisorAttention'],source:f['lotm.sourceSupported'],method:f['lotm.methodSupported'],sleeping:ports.sleeping(),energy:e?{reserve:e.reserve,capacity:e.policy.capacity,strain:e.strain,limit:e.policy.strainLimit}:null,meters:lotmMeters(e),path,actingGuidance,holds,actions,moves,jobs,records};
 }
 return {enroll,cross,act,cancel,move,wake,tick,view,startable,inspectConstraints:()=>castRevisionReport(state())};
}

export function castClockLine(s){const c=castCalendar(s).calendar;return `Day ${c.day_count}, ${c.hour<6?'night':c.hour<12?'morning':c.hour<18?'afternoon':'evening'}`;}
