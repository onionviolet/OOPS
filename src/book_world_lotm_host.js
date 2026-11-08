import {testHooksEnabled} from './simulation_clock.js';
import {placeActRecords,placeStockViews} from './place_acts.js';
import {remotePresenceView} from './place_remote_presence.js';
import {placeActSequenceView} from './place_act_sequence.js';
import {topicTalkRecords} from './cast_topic_talk.js';
import {channelNote} from './channels.js';
import {commitCastAbility} from './cast_ability_adapter.js';
import {runWaitUntil} from './wait_until.js';
import {castRecordCommands,castRecordOffers,castAbilityCommands,castAbilityOffers,castActCommands,castActOffers,castBodyCommands,castBodyOffers,castExchangeCommands,castExchangeOffers,castInferenceCommands,castInferenceOffers,castMakingCommands,castMakingOffers,castDivinationCommands,castDivinationOffers,castJourneyCommands,castJourneyOffers,castJourneyContext,castTopicOffers,castObjectOffers,castObjectCommands,castWaitOptions,nextCastBeatTime,currentCastBeatLedger} from './book_world_lotm_cast_host.js';
import {castKnown,persistLotmCastPlan,castBeatsPending,castSyncDue,installCast,castElsewhere,castCalendar,castLocalClock,castAvailable,castPlaces,castMoves,castPlaceLabel,castWalkId,castWalkCommands,installCastWalk,lotmBe,lotmCastLife,syncLotmCast,castTalkCommands,castTalkPreview,canonActionDecision,castWriteCode,castRevisionReport} from './book_world_lotm_cast_host.js';
// Native host for the early-Tingen Seer slice (LIP3/LIP4). One authority per fact (AR3):
// state.lotm and the simulation own the branch, the supervisor's native inventory owns the
// finite stock, native sleep is joined to book.lotm.sleep (D4). The caller supplies ports;
// this file imports no main.js and publishes only through the one expansion publisher.
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {simulationFacts,applySimulationEffects,inventory} from './simulation_effects.js';
import {withFactsFrame} from './facts_frame.js';
import {purseEffect} from './own_holdings.js';
import {domainRegistry} from './domain_registry.js';
import {registerPositionsPort,registerPositionsLifePort} from './positions_domain.js';
import {installRoleDefinitions} from './recurring_people.js';
import {lotmResignPlan,CIVIL_RESIGN_COST} from './book_world_lotm_positions.js';
import {GUARD_POSITION_ID,GUARD_RESIGN_COST,GUARD_OFFER,guardSignQuote,guardBegin,guardStand,guardCollect,guardResignPlan,guardView,guardSnapshot,guardRestore,guardPayWords} from './book_world_lotm_guard.js';
import {LOTM_GUARD_DUTY_ID} from './book_world_lotm_duties.js';
import {noteExpenseFiled,tieExpenseFiled} from './book_world_lotm_colleagues.js';
import {reputationView} from './reputation_view.js';
import {tieOfferEffects,tieOfferView,tieShownView} from './person_ties.js';
import {lotmHomeView} from './lotm_home_household.js';
import {lotmBeSpellCommands} from './lotm_be_spells.js';
import {know} from './book_world_lotm_kit.js';
import {groupsOf,groupLines} from './organizations.js';
import './book_world_lotm_organizations.js'; // registers the LOTM groups source
import {lotmCommands,lotmContext,lotmFacts,allocatedDoseView} from './book_world_lotm_actions.js';
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
import {benchWithRite} from './read_models/rite_state_bridge.js';
import {meritView} from './book_world_lotm_merit.js';
import {BENCH_PREFIX,INGREDIENT_BY_NAME,benchRowList,seedBenchStock,stockSeeded,characteristicBrewId} from './book_world_lotm_bench.js';
import {LOTM_TIERS,rowById} from './lotm_formula_rows.js';
import {CC_BREW} from './book_world_lotm_brew.js';
import {abilitySourceOf} from './book_world_lotm_abilities.js';
import {clearanceView} from './book_world_lotm_clearance.js';
import {lotmRegionAt} from './book_world_lotm_cities.js';
import {lotmRestrictions,lotmLight} from './book_world_lotm_events.js';
import {lotmUpcoming} from './book_world_lotm_upcoming.js';
import {lotmSheetsFor} from './book_world_lotm_sheets.js';
import {harmContext,accrueHarm,restHarm,lostControlOutcome} from './book_world_lotm_harm.js';
import {districtOfPlace,districtById,respondersFor,lotmWalkMinutes,LOTM_PLACE_KEYS,onShift} from './book_world_lotm_districts.js';
const copy=x=>structuredClone(x),assert=(ok,text)=>{if(!ok)throw Error(text);};
// A walk's arrival record cites the workroom situation, which begins when you report in (or your life's own first report).
const WALK_AFTER_REPORT='Report in at the workroom before you walk the district.';
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
 // COV15: the rite figure's input goes through the bridge. The seat has read a condition when the formula notes it holds name the rite (row.ritual.needed): those
 // notes state the same conditions. A per-condition learned fact does not exist yet, so a rite the notes do not name draws no figure and no odds.
 const graded=gradeRiteAtTransition(id,f),riteKnown=new Set(row.ritual?.needed&&graded?graded.conditions.map(c=>c.id):[]);
 return {...summary,...benchWithRite({},graded,{label:graded?.label,known:riteKnown}),minutes:row.minutes,price:row.price||null,formulaRoute:!row.price&&brewable&&!viaMain?row.route:null,route:row.route,ritual:row.ritual||null,gaps:row.gaps,evidence:row.evidence,
  slots,actions,product:brewable&&!viaMain?{name:row.product.name,sellPence:row.product.sellPence}:null,
  via:viaMain?`Brewed at Hale's bench with the Corpse Collector actions in the list above (${CC_BREW.minutes} minutes, formula ${CC_BREW.formulaPence} pence).`:null,
  drinkOptions:summary.doses&&generatedDrinkIds[id]?generatedDrinkIds[id].map(prev).filter(o=>o&&o.visible):null,
  drink:summary.doses&&!generatedDrinkIds[id]?{eligible:false,reason:row.ritual?.needed?`${NOT_WRITTEN} Drinking it without its rite (${row.ritual.scale}: ${row.ritual.text}) risks losing control.`:NOT_WRITTEN}:null};
}
export function createLotmHost(ports){
 const registry=ports.registry;let dying=false;
 installRoleDefinitions(registry); // AT17 prototype (AD32): promotable roles (the Tingen constables) validate in this registry before any save loads
 // FD15: the civil contract's term ends on the clock; the positions domain settles it for any live LOTM state.
 registerPositionsPort('lotm',()=>{const s=ports.state();return s?.lotm?s:null;});
 registerPositionsLifePort('life',()=>ports.state()); // any life's old-age end, not only a LOTM seat's
 const persist=(plan,options={})=>persistLotmCastPlan(plan,ports.persist,{...options,publish:r=>ports.logMessage?.(r.text,r.kind,{safeText:true,panelId:'known-people'})});
 const state=()=>{installCast(registry);return ports.state();};
 const castState=s=>{if(!lotmCastLife(s))return s;const projected=copy(s);syncLotmCast(projected);return projected;};
 const sleepingCommand=id=>id===SLEEP||registry.simulation.commands.get(id)?.group==='book_lotm'&&registry.simulation.commands.get(id)?.bodyCare?.kind==='sleep';
 const sleepJob=s=>s.simulation?.jobs?.find(j=>sleepingCommand(j.commandId)&&j.actorId==='player');
 function ctx(s,def,nativeContext){const c=nativeContext||ports.context(),vitals=c.vitals||{};
  const out=lotmContext(s,{...c,actorId:'player',vitalsByActor:c.vitalsByActor||vitals,busy:!!ports.busy(),targetId:def?.targetId||null});if(lotmBe(s))out.facts['lotm.profile.beside']=true;out.facts['bodyCare.sleeping']=!!ports.sleeping();out.facts['topicTalk.hour']=castCalendar(s).calendar.hour;return castJourneyContext(s,def?{...out,...harmContext(s,def)}:out);}
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
  if(!ports.writable())out.push(ports.writeBlockReason?.()||'Saving is paused, so you can\'t start a new life right now.');
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
 function waitReason(){const s=state();return lotmBe(s)&&!validLeadLife(getPrivateLotmCast())?'Cast unavailable: private pack absent. This life is read-only.':!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':ports.busy()||s.simulation.jobs.length?'Finish or stop your current work first.':!ports.advanceWaitMinute?'Waiting is unavailable in this host.':'';}
 const waits=s=>{
  const intentions=lotmBe(s)?(getPrivateLotmCast()?.leadLife?.intentions||[]).filter(r=>s.simulation?.knowledge?.player?.[r.knowledge]).map(r=>({label:r.label,known:true,at:s.lotm.initializedAt+r.offset})):[];
  const next=placeActSequenceView(s,getPrivateLotmCast()?.householdActs)?.next;if(next?.readyAt>s.clock)intentions.push({label:next.label,known:true,at:next.readyAt});
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
  if(def.bodyCare?.kind==='wake'){
   assert(ports.sleeping(),'You are already awake.');
   const context=ctx(s,def),job=sleepJob(s),stopped=job?cancelSimulationJob(s,registry,job.id,context,s.sequence):{state:s};
   const plan=commitSimulationCommand(stopped.state,registry,{id},{...context,busy:false},stopped.state.sequence);
   recordEmergent(plan,def);persist(plan);ports.endSleep();return plan;
  }
  assert(!ports.sleeping(),'You\'re asleep. Wake up first.');
  assert(!ctx(s,def).facts['lotm.lostControl'],'You have lost control. Nothing you do here changes it.');
  if(lotmCastLife(s)){const quote=castTalkPreview(s,def,previewSimulationCommand(s,registry,id,ctx(s,def)));
   assert(quote.eligible,quote.reasons.join(' ')||'This command is hidden.');}
  const commit=commandId=>commitSimulationCommand(s,registry,{id:commandId},ctx(s,def),s.sequence);
  const plan=def.castAbility?commitCastAbility(castAbilityCommands,id,{state:s,context:ctx(s,def),commit}):commit(id);
  recordEmergent(plan,def);
  syncLotmCast(plan.state);
  persist(plan);
  accrueHarm(plan.state,def);
  if(id===SLEEP||def.bodyCare?.kind==='sleep')ports.beginSleep();
  return plan;
 }
 function cancel(jobId){
  writable();const s=state(),job=s.simulation?.jobs.find(j=>j.id===jobId&&j.actorId==='player'&&[...lotmCommands,...lotmBeSpellCommands,...castBodyCommands,...castActCommands,...castRecordCommands,...castMakingCommands,...castExchangeCommands,...castAbilityCommands,...castObjectCommands,...castTalkCommands.filter(d=>d.topicTalk)].some(d=>d.id===j.commandId));
  assert(job&&['forfeit','refund'].includes(job.cancellation),'This work cannot be stopped.');
  persist(cancelSimulationJob(s,registry,job.id,ctx(s),s.sequence));
  if(sleepingCommand(job.commandId)&&ports.sleeping())ports.endSleep();
 }
 // A walk is a timed job (district links, real minutes). The body is placed at the destination when the walk starts, because the engine records a job's
 // place at start; the job occupies the player until the arrival record is written. Machinery and Storm lives use their own life-neutral walk set.
 const walkId=(s,from,to)=>{if(castPlaces.some(p=>p.id===from||p.id===to))return castWalkId(from,to);const home=LOTM_PROFILES[profileKeyOf(s)]?.home,suffix=home==='storm'||home==='machinery'?`_${home}`:'';return `book.lotm.walk_${LOTM_PLACE_KEYS[from]}_${LOTM_PLACE_KEYS[to]}${suffix}`;};
 function move(id){
  writable();assert(!remotePresenceView(state(),getPrivateLotmCast()?.householdActs).length,'End the remote gathering before walking away.');const s=castState(state()),to=(lotmCastLife(s)?{...MOVES,...castMoves}:MOVES)[id];assert(s.lotm&&to,'No such walk.');
  assert(!s.simulation.jobs.length&&!ports.sleeping()&&!ports.busy(),'Finish or stop your current work first.');
  assert(lotmCastLife(s)||s.simulation.situations?.[I.situation],WALK_AFTER_REPORT);
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
 function tick(minutes=0){const s=state();if(s.lotm){if(ports.sleeping())restHarm(s,minutes);else if(!dying&&ports.die&&ports.writable()&&lostControlOutcome(s)?.default==='final'){dying=true;try{domainRegistry.command('positions','died')({state:s,at:s.clock});}catch{/* positions settle on the next tick */}Promise.resolve(ports.die('loss_of_control')).finally(()=>{dying=false;});}}if(lotmCastLife(s)&&(castSyncDue(s)||castBeatsPending(s))&&ports.writable()&&(!lotmBe(s)||validLeadLife(getPrivateLotmCast()))){const plan=base(s,ports.context());if(syncLotmCast(plan.state)||castBeatsPending(plan.state))persist(plan);}if(s.lotm&&ports.sleeping()&&!sleepJob(s))ports.endSleep();}
 // Standing orders (OB1/OB4): rent and dues leave the native purse through the purse seam on the clock, in one save with the duties slice. Throws when saving is paused.
 const purseBalance=()=>{const m=ports.context().external?.money;assert(Number.isFinite(m),'The purse is not readable now.');return m;};
 // Read the current life's actual inventory. Unknown or protected goods have no seizure value.
 function heldGoods(){
  const s=state(),c=ports.context(),plan=base(s,c),worn=Object.values(s.simulation.equipment?.player||{}).concat(Object.values(c.equipment?.player||{}));
  return Object.entries(inventory(plan,'player')).flatMap(([key,qty])=>{
   try{ports.assertDisposition?.(key);const item=ports.item?.(key);
    if(!item||item.tags?.quest||item.tags?.quest_item||Object.values(s.simulation.custody||{}).some(x=>x.holder==='player'&&x.key===key))return [];
    const value=item.getValue({quality:item.quality});return Number.isFinite(value)&&value>0?[{key,name:item.getName(),qty,value,equipped:worn.includes(key)}]:[];
   }catch{return [];}
  });
 }
 function seizeGoods(picks,settlement){
  writable();assert(!ports.restoring()&&state().actors.player.worldId===I.world,'The creditor must find you in Tingen.');
  const goods=new Map(heldGoods().filter(g=>!g.equipped).map(g=>[g.key,g]));
  const used=new Set();for(const p of picks){const g=goods.get(p.key);assert(!used.has(p.key)&&g&&Number.isInteger(p.qty)&&p.qty>0&&p.qty<=g.qty,'Those goods are no longer available.');used.add(p.key);}
  const plan=base(state(),ports.context());applySimulationEffects(plan,picks.map(p=>({type:'item',actor:'player',key:p.key,amount:-p.qty})),{actorId:'player'},registry,'book.lotm.seizure');persist(plan);
  try{if(settlement?.line)ports.logMessage?.(settlement.line,'notification');}catch{/* The debit and its saved receipt already landed. */}
 }
 // Plan first so the sentence owner can stage its remaining minutes in the same durable write.
 function sentencePlan(minutes){
  writable();assert(!ports.restoring()&&!ports.busy()&&!state().simulation.sessions?.player&&state().actors.player.worldId===I.world,'Finish your current encounter first.');
  assert(ports.planTime,'The clock is unavailable.');const before=state().clock,plan=ports.planTime(minutes),consumed=plan.state.clock-before;
  assert(Number.isInteger(consumed)&&consumed>=0&&consumed<=minutes,'The clock returned an invalid duration.');
  return {minutes:consumed,at:plan.state.clock,commit:()=>persist(plan),afterCommit:()=>{domainRegistry.tick(consumed);ports.logMessage?.(`You spent ${consumed} minutes in the cells.`,'notification');}};
 }
 function payDues(amount,paid){
  writable();const s=state(),plan=base(s,ports.context());
  applySimulationEffects(plan,[purseEffect(-amount)],{actorId:'player'},registry,'book.lotm.dues');persist(plan);
  ports.logMessage?.(`Standing order: paid ${paid.length} ${paid.length===1?'week':'weeks'} of rent, ${amount} pence from your purse.`,'notification');
 }
 // OB2: a fine the player chose to settle (heat.js owns the record); one debit and its own line, never while away.
 function payFine(amount){
  writable();const s=state(),plan=base(s,ports.context());
  applySimulationEffects(plan,[purseEffect(-amount)],{actorId:'player'},registry,'book.lotm.fine');persist(plan);
  ports.logMessage?.(`You paid the landlady's fine, ${amount} pence from your purse.`,'notification');
 }
 // FD15: the civil post's one exit. Writes the positions@1 record and a notebook line in one save; if saving fails the record is put back.
 function resign(id){
  writable();const s=state(),guard=id===GUARD_POSITION_ID,{row,exit}=guard?guardResignPlan(s):lotmResignPlan(s),prior=domainRegistry.project('positions'),plan=base(s,ports.context());
  applySimulationEffects(plan,[know('resigned',guard?`You walked out on the warehouse night watch. ${GUARD_RESIGN_COST}`:`You resigned from the civil staff post at the Nighthawk office. ${CIVIL_RESIGN_COST}`,'player','player','observation','understood')],{actorId:'player'},registry,'book.lotm.resign');
  domainRegistry.command('positions','exit')({row,...exit});
  try{persist(plan);}catch(e){domainRegistry.command('positions','revert')(prior);throw e;}
 }
 // W9-A: the hired-guard contract (an authored ordinary-man job). Each step writes its knowledge note and the guard slice in one save; a failed save puts the slice back.
 function signGuard(){
  writable();const s=state(),q=guardSignQuote(s);assert(q.eligible,q.reason||'No hire is open to you.');
  const plan=base(s,ports.context()),prior=guardSnapshot();
  applySimulationEffects(plan,[know('guard_contract',`You signed on as a night watchman at a Tingen riverside warehouse. ${GUARD_OFFER}`,'player','player','instruction','understood')],{actorId:'player'},registry,'book.lotm.guard_sign');
  guardBegin(plan.state.simulation.knowledge.player['book.lotm.guard_contract'].at);
  try{persist(plan);}catch(e){guardRestore(prior);throw e;}
 }
 // The shift: the duty is attended (it throws when closed) and the week's trouble is drawn once from the world seed. Returns the line the player reads.
 function standWatch(){
  writable();const s=state(),plan=base(s,ports.context()),prior=guardSnapshot();
  assert(guardView(s)?.live,'You hold no watch to stand.');
  const {trouble}=guardStand(s);
  try{domainRegistry.command('duties','attend')({dutyId:LOTM_GUARD_DUTY_ID});
   applySimulationEffects(plan,[know('guard_watch',trouble?'You stood the night watch. Someone came for the crates; the thieves are at the door.':'You stood the night watch. It was a quiet night.','player','player','observation','understood')],{actorId:'player'},registry,'book.lotm.guard_watch');
   persist(plan);}catch(e){guardRestore(prior);throw e;}
  return trouble?'You stood the watch. Thieves are at the warehouse door.':'You stood the watch. A quiet night; the week is yours to collect when it closes.';
 }
 // FD8 + AT17 prototype: file the week's expense application (the duty throws when this week is already filed). The first filing leaves Dunn's note,
 // in one save; later weeks change only the duties slice, as before.
 function fileExpense(){
  writable();const s=state(),plan=base(s,ports.context()),noted=noteExpenseFiled(plan,registry);
  const tied=tieExpenseFiled(plan,registry);
  domainRegistry.command('duties','attend')({dutyId:'lotm.expense_claim'});
  if(noted||tied)persist(plan);
 }
 // LT8: a tie-gated conversation (person_ties offers). One save; the note is attributed to the person, so People and the Notebook show it.
 function tieAsk(id){
  writable();const s=state(),plan=base(s,ports.context()),row=tieOfferView(s).find(o=>o.id===id);
  assert(row&&castKnown(s,row.personId),'You have not met them yet.');
  applySimulationEffects(plan,tieOfferEffects(s,id),{actorId:'player'},registry,id);persist(plan);
 }
 function collectGuardPay(){
  writable();const s=state(),prior=guardSnapshot(),plan=base(s,ports.context());
  const owed=guardCollect(s);
  try{applySimulationEffects(plan,[purseEffect(owed.pence)],{actorId:'player'},registry,'book.lotm.guard_pay');persist(plan);}catch(e){guardRestore(prior);throw e;}
  ports.logMessage?.(`The foreman paid ${guardPayWords(owed.pence)}${owed.weeks?` for ${owed.weeks} ${owed.weeks===1?'week':'weeks'} of watch`:''}${owed.bonus?`${owed.weeks?', with':' as'} a bonus of ${guardPayWords(owed.bonus)}`:''}.`,'notification');
 }
 function view(selected=null){return withFactsFrame(state(),()=>readView(selected));}
 function readView(selected=null){
  const s=castState(state()),d=s.lotm;
  if(!d)return {enrolled:false,atVillage:atVillage(),startable:startable(),startReasons:startBlockers(),axes:LOTM_ENTRY_AXES,returnable:returnable(),profiles:Object.values(LOTM_PROFILES).filter(p=>p.key==='be'?(ports.developerStarts?.()??testHooksEnabled)&&validLeadLife(getPrivateLotmCast()):p.key!=='beside'||castAvailable).map(({key,label,blurb})=>({key,label:key==='be'?`Developer playthrough: ${label}`:label,blurb,answers:key==='be'?[['Beginning',blurb]]:entryAnswers(key,{returnable:returnable()}),...(key==='be'?{independent:true,available:!!ports.startBe}: {})}))};
  const nativeContext=ports.context(),c=ctx(s,null,nativeContext),f=c.facts,at=s.simulation.people.player.location,e=s.simulation.energies?.player?.[I.energy],know=s.simulation.knowledge?.player||{};
  if(lotmBe(s)){
   const loaded=getPrivateLotmCast(),ready=validLeadLife(loaded),pack=ready?loaded:null,life=pack?.leadLife,elapsed=s.clock-s.lotm.initializedAt;
   const allowed=new Set([at,...(life?.knownPlaces||[]),...Object.keys(know).filter(k=>k.startsWith('book.lotm.cast.place.known.')).map(k=>k.slice('book.lotm.cast.place.known.'.length))]);
   const places=castPlaces.filter(p=>allowed.has(p.id)&&districtOfPlace(p.id)).map(p=>{const dd=districtOfPlace(p.id);return {place:castPlaceLabel(p.id),district:dd.qlabel,team:dd.q2team,church:dd.church,here:p.id===at,minutes:p.id===at?0:lotmWalkMinutes(at,p.id)};});
   const moves=Object.entries(castMoves).filter(([,to])=>allowed.has(to)&&to!==at&&lotmWalkMinutes(at,to)!=null).map(([id,to])=>{const dd=districtOfPlace(to),m=lotmWalkMinutes(at,to),def=installCastWalk(registry,at,to)||registry.simulation.commands.get(walkId(s,at,to)),decision=canonActionDecision(s,def,getPrivateLotmCast(),nativeContext);return {id,to,minutes:m,label:`Walk to ${castPlaceLabel(to)} · ${m} min · ${dd.qlabel}: nearby`,eligible:decision.allowed&&castAvailable&&!s.simulation.jobs.length&&!ports.sleeping()&&!remotePresenceView(s,getPrivateLotmCast()?.householdActs).length,reasons:remotePresenceView(s,getPrivateLotmCast()?.householdActs).length?['End the remote gathering before walking away.']:castAvailable?(decision.allowed?[]:[decision.reason]):['Restore the book pack to resume.']};});
   const pendingIds=new Set(s.simulation.jobs.map(j=>j.commandId));
   const actions=castTalkCommands.filter(def=>!def.topicTalk).filter(def=>s.simulation.people[def.targetId]&&(s.simulation.people[def.targetId].location===at||pendingIds.has(def.id))&&(know[`book.lotm.cast.known.${def.targetId}`]||know[`book.lotm.cast.met.${def.targetId}`])).flatMap(def=>{const q=castTalkPreview(s,def,previewSimulationCommand(s,registry,def.id,{...c,targetId:def.targetId})),decision=canonActionDecision(s,def,getPrivateLotmCast(),nativeContext),p=decision.allowed?q:{...q,eligible:false,reasons:[...q.reasons,decision.reason]};return p.visible?[{id:def.id,label:def.label,eligible:p.eligible&&castAvailable&&!ports.sleeping(),reasons:!castAvailable?['Restore the book pack to resume.']:p.reasons,duration:p.duration}]:[];});
   for(const choice of life?.untakenChoices||[]){const day=pack.bindings.days.find(r=>r.scene===choice.scene),begin=day&&((day.day-1)*1440+day.from),end=day&&((day.day-1)*1440+day.to);
    if(day&&elapsed>=begin&&elapsed<end)actions.push({id:`book.lotm.untaken.${choice.id}`,label:choice.label,eligible:false,reasons:['Not how it happened'],duration:0});}
   if(!ready)actions.push({id:'book.lotm.cast_unavailable',label:'Cast unavailable: private pack absent',eligible:false,reasons:['Restore the book pack to resume this read-only life.'],duration:0});
   // Journey definitions have the same actor and no target. Quote them against
   // one read-only context/frame rather than rebuilding the entire native world
   // for every route; each command still runs the normal quote and canon checks.
   const journeyContext=c,journeys=withFactsFrame(s,()=>castJourneyOffers(s,def=>previewSimulationCommand(s,registry,def.id,journeyContext),{facts:def=>simulationFacts(s,journeyContext,registry,[def.requires]),blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   const topicTalks=castTopicOffers(s,def=>previewSimulationCommand(s,registry,def.id,ctx(s,def,nativeContext)),{blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),nativeContext)});
   const divinations=withFactsFrame(s,()=>castDivinationOffers(s,def=>previewSimulationCommand(s,registry,def.id,journeyContext),{facts:def=>simulationFacts(s,journeyContext,registry,[def.requires]),blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   const rites=withFactsFrame(s,()=>castActOffers(s,def=>previewSimulationCommand(s,registry,def.id,journeyContext),{blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   // W2b: Seer powers lowered by the shared spell lowering (the same code as Harry's charm), offered once the source allows them.
   const powers=withFactsFrame(s,()=>lotmBeSpellCommands.filter(d=>registry.simulation.commands.has(d.id)).map(d=>{const q=previewSimulationCommand(s,registry,d.id,ctx(s,d,nativeContext));return {id:d.id,label:d.label,description:d.description,visible:q.visible,eligible:!!q.eligible&&ports.writable()&&!ports.sleeping(),reasons:q.reasons||[]};}).filter(p=>p.visible));
   const abilityConflicts=withFactsFrame(s,()=>castAbilityOffers(s,def=>previewSimulationCommand(s,registry,def.id,ctx(s,def,nativeContext)),{blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),nativeContext)}));
   const inferences=withFactsFrame(s,()=>castInferenceOffers(s,def=>previewSimulationCommand(s,registry,def.id,journeyContext),{blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   const exchanges=withFactsFrame(s,()=>castExchangeOffers(s,def=>previewSimulationCommand(s,registry,def.id,ctx(s,def,nativeContext)),{blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   const bodyCare=withFactsFrame(s,()=>castBodyOffers(s,def=>{
    const job=def.bodyCare.kind==='wake'&&sleepJob(s),c=ctx(s,def,nativeContext);
    const ready=job?cancelSimulationJob(s,registry,job.id,c,s.sequence).state:s;
    return previewSimulationCommand(ready,registry,def.id,def.bodyCare.kind==='wake'?{...c,busy:false}:c);
   },{blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),nativeContext)}));
   const making=withFactsFrame(s,()=>castMakingOffers(s,def=>previewSimulationCommand(s,registry,def.id,journeyContext),{blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   const sealedRecords=withFactsFrame(s,()=>castRecordOffers(s,def=>def.targetId&&!s.simulation.people[def.targetId]?{visible:false,eligible:false,reasons:[]}:previewSimulationCommand(s,registry,def.id,{...journeyContext,targetId:def.targetId||null}),{facts:def=>simulationFacts(s,{...journeyContext,targetId:def.targetId||null},registry,[def.requires]),blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   const objectActs=withFactsFrame(s,()=>castObjectOffers(s,def=>previewSimulationCommand(s,registry,def.id,{...journeyContext,targetId:def.targetId||null}),{facts:def=>simulationFacts(s,{...journeyContext,targetId:def.targetId||null},registry,[def.requires]),blocked:!ports.writable()?(ports.writeBlockReason?.()||'Saving is paused.'):ports.sleeping()?'You\'re asleep. Wake up first.':'',decide:def=>canonActionDecision(s,def,getPrivateLotmCast(),journeyContext)}));
   const jobs=s.simulation.jobs.filter(j=>[...lotmBeSpellCommands,...castBodyCommands,...castWalkCommands,...castObjectCommands,...castTalkCommands,...castJourneyCommands,...castDivinationCommands,...castActCommands,...castRecordCommands,...castMakingCommands,...castInferenceCommands,...castExchangeCommands,...castAbilityCommands].some(d=>d.id===j.commandId)).map(j=>({id:j.id,commandId:j.commandId,label:registry.simulation.commands.get(j.commandId)?.label||'Saved walk',due:j.due,left:Math.max(0,j.due-s.clock),cancellation:j.cancellation,refundsInputs:!!j.costs?.length,cancellable:[...lotmBeSpellCommands,...castBodyCommands,...castRecordCommands,...castMakingCommands,...castExchangeCommands,...castAbilityCommands,...castObjectCommands,...castTalkCommands.filter(d=>d.topicTalk)].some(d=>d.id===j.commandId)&&['refund','forfeit'].includes(j.cancellation)}));
   const records=[...Object.entries(know).filter(([k])=>k.startsWith('book.lotm.history.')).map(([id,r])=>({id,text:r.value,at:r.at})),...placeActRecords(s,pack?.householdActs),...topicTalkRecords(s,castTalkCommands)];
   const region=lotmRegionAt(s.simulation.people.player.location,{hour:castCalendar(s).calendar.hour,money:nativeContext.external?.money??0,restrictions:lotmRestrictions({state:s,days:getPrivateLotmCast()?.bindings?.days||[]})});
   const sheets=lotmSheetsFor(s,getPrivateLotmCast(),Object.keys(know).map(k=>/^book\.lotm\.cast\.(?:known|met)\.(.+)$/.exec(k)?.[1]).filter(Boolean));
   return {enrolled:true,resident:true,powers,reputation:reputationView(s,{known:id=>castKnown(s,id)}),home:pack?lotmHomeView(s,{pack,duties:domainRegistry.project('duties'),homes:domainRegistry.project('homes'),quote:domainRegistry.command('homes','quote')??null}):null,tieOffers:tieOfferView(s).filter(o=>castKnown(s,o.personId)),ties:tieShownView(s).filter(t=>castKnown(s,t.personId)),altarRites:rites,arc:placeActSequenceView(s,pack?.householdActs),remoteMeetings:remotePresenceView(s,pack?.householdActs),stockViews:placeStockViews(s,pack?.householdActs),runMode:s.lotm.runMode,entryProfile:s.lotm.entryProfile,at:castPlaceLabel(at),localClock:castClockLine(s),sky:skyLine(s),sleeping:ports.sleeping(),meters:[],places,moves,actions,journeys,topicTalks,objectActs,bodyCare,making,sealedRecords,exchanges,divinations,inferences,abilityConflicts,sheets,region,waits:waits(s),elsewhere:castElsewhere(s),jobs,records};
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
  const moves=Object.entries(lotmCastLife(s)&&!castAvailable&&!districtOfPlace(at)?{}:lotmCastLife(s)?{...MOVES,...castMoves}:MOVES).filter(([,to])=>to!==at&&districtOfPlace(to)).map(([id,to])=>{const dd=districtOfPlace(to),m=lotmWalkMinutes(at,to),busy=s.simulation.jobs.length||ports.sleeping(),unreported=!lotmCastLife(s)&&!s.simulation.situations?.[I.situation];return {id,to,minutes:m,label:`Walk to ${castPlaceLabel(to)} · ${m} min · ${dd.qlabel}: ${dd.q2team}`,eligible:!busy&&!unreported,reasons:busy?['Finish or stop your current work first.']:unreported?[WALK_AFTER_REPORT]:[]};});
  // Plain places list (SR rules): every place, its district, which team answers there and how far it is.
  const places=[...Object.values(L),...(lotmCastLife(s)?castPlaces.map(p=>p.id):[])].filter(pl=>districtOfPlace(pl)).map(pl=>{const dd=districtOfPlace(pl);return {place:castPlaceLabel(pl),district:dd.qlabel,team:dd.q2team,church:dd.church,here:pl===at,minutes:pl===at?0:lotmWalkMinutes(at,pl)};});
  if(lotmCastLife(s)&&!castAvailable)actions.push({id:'book.lotm.cast_unavailable',label:'Cast unavailable: private pack absent',eligible:false,reasons:['Restore the private cast pack to resume meetings.'],duration:0});
  const jobs=s.simulation.jobs.filter(j=>[...lotmCommands,...castWalkCommands].some(d=>d.id===j.commandId)).map(j=>({id:j.id,label:registry.simulation.commands.get(j.commandId).label,due:j.due,left:Math.max(0,j.due-s.clock),cancellation:j.cancellation,refundsInputs:!!j.costs?.length,cancellable:['forfeit','refund'].includes(j.cancellation)}));
  const holds=Object.fromEntries(['dose','clownDose',...pathwayRows.flatMap(r=>[r.holds.base,r.holds.next]),...generatedRows.flatMap(r=>[r.holds.base,r.holds.next]),'sealed3','frog','hairs','ink',...pathwayRows.filter(r=>r.market).flatMap(r=>[r.market.baseHold,r.market.nextHold]),...LOTM_SAMPLES].map(n=>[n,f[`lotm.holds.${n}`]||0]));
  // W11-D: the player's own tagged skills with their kind-of-power line (holder only; untagged or unspent skills are left out).
  const skills=Object.entries(c.gameplay?.player?.skills||{}).filter(([,k])=>k?.xp>0).map(([id])=>({id,power:channelNote({skill_id:id},{holder:true})})).filter(x=>x.power);
  const records=Object.entries(know).filter(([k])=>k.startsWith('book.lotm.')).map(([k,r])=>({id:k,text:r.value,stage:r.stage,at:r.at})).sort((a,b)=>(b.at??0)-(a.at??0));
  const homeKey=profileKeyOf(s),homeChurch=homeKey?districtById(LOTM_PROFILES[homeKey].home)?.church:null,dist=districtOfPlace(at),district=dist&&{id:dist.id,label:dist.label,team:dist.team,officer:dist.officerLabel,officerHere:f['lotm.officerHere'],responders:respondersFor(dist.id,homeChurch).line,home:!!f[`lotm.home.${dist.id}`],onShift:onShift(dist,s.clock),shift:!!dist.shift,claim:dist.claim,why:dist.why,endorsed:!!f[`lotm.home.${dist.id}`]||f[`lotm.flag.endorsed.${dist.id}`]===true,attention:f['lotm.officerAttention']};
  const doseLabels=pathwayRows.flatMap(r=>[[r.holds.base,`prepared ${r.potion} dose`],[r.holds.next,`prepared ${r.next} dose`]]).filter(([k])=>holds[k]).map(x=>x[1]);
  const clearance=at===L.workroom?clearanceView(f['lotm.roleName'],f['lotm.presentRoles']?f['lotm.presentRoles'].split(','):[]):[];
  const marketHeld=pathwayRows.filter(r=>r.market).flatMap(r=>[[r.market.baseHold,`unmarked dose`],[r.market.nextHold,`unmarked Sequence 8 dose`]]).filter(([k])=>holds[k]).map(x=>x[1]);
  // A save from before the bench has no stock yet; offers preview against the stock the first action will seed, so the buttons are not dead (DWF127).
  let sv=s,cv=c;if(!stockSeeded(s)){const t=base(s,c);seedBenchStock(t);sv=t.state;cv={...c,gameplay:t.gameplay};}
  const prevMerit=cid=>{const d=registry.simulation.commands.get(cid);if(!d)return null;const p=previewSimulationCommand(s,registry,cid,{...c,targetId:d.targetId||null});
   return {id:cid,label:d.label,eligible:p.eligible&&!ports.sleeping(),reasons:p.eligible&&ports.sleeping()?['You are asleep.']:p.reasons,visible:p.visible};};
  const merit=f['lotm.home.evernight']&&f['lotm.beyonderTrack']?meritView(s,f,prevMerit):null;
  const bench={rows:benchRowList(s,f),selected:selected&&benchDetail(sv,cv,selected,{registry,asleep:ports.sleeping()})};
  return {enrolled:true,...(lotmCastLife(s)?{resident:true,waits:waits(s),elsewhere:castElsewhere(s),localClock:castClockLine(s),sky:skyLine(s)}:{}),skills,pausedLife:ports.pausedLife?.()||null,termDay:Math.floor(s.clock/1440),guard:guardView(s),groups:groupLines(groupsOf(s)),merit,bench,broker:brokerView(s,f),places,marketHeld,cause:causeView(f),profile:profileKeyOf(s),entryProfile:s.lotm?.entryProfile,role:f['lotm.roleName'],clearance,district,doseLabels,beyonder:!!(f['lotm.sourceSupported']||[...pathwayRows,...generatedRows].some(r=>f[`lotm.${r.key}Supported`])),switchNotice:LOTM_SWITCH_NOTICE,at:castPlaceLabel(at),supervisorHere:f['lotm.supervisorHere'],attention:f['lotm.supervisorAttention'],source:f['lotm.sourceSupported'],method:f['lotm.methodSupported'],sleeping:ports.sleeping(),energy:e?{reserve:e.reserve,capacity:e.policy.capacity,strain:e.strain,limit:e.policy.strainLimit}:null,meters:lotmMeters(e),path,actingGuidance,holds,issuedDose:allocatedDoseView(s,holds.dose),actions,moves,jobs,records};
 }
 function restoreSleep(){const s=state(),job=s.lotm&&sleepJob(s);if(!ports.restoring()||!job||!sleepingCommand(job.commandId))return false;ports.beginSleep();return true;}
 return {enroll,cross,resign,signGuard,standWatch,fileExpense,tieAsk,collectGuardPay,act,cancel,move,wake,tick,view,purseBalance,payDues,payFine,heldGoods,seizeGoods,sentencePlan,startable,restoreSleep,upcoming:()=>lotmUpcoming({state:ports.state(),days:getPrivateLotmCast()?.bindings?.days||[]}),inspectConstraints:()=>castRevisionReport(state())};
}

export function castClockLine(s){return castLocalClock(s)?.clock||'';}
// What the lead's own eyes make of the light now (FD9, UR70-UR75: perception only, no numbers). Empty before the life starts.
export function skyLine(s){return s?.lotm?.initializedAt!=null&&lotmLight(s).fog?'River fog and coal smoke hang over the street; you see less far than by day.':'';}
