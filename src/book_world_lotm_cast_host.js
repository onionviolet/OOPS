import {defineBodyCare,quoteBodyCare} from './cast_body_adapter.js';
import {constraintsFromPack} from './constraint_pack.js';
import {conditionedDraw,reservationDecision,contradictedFills,constraintProvenance,PROVENANCE_CODES} from './constraint_store.js';
import {createStreams} from './seeded_streams.js';
import {createWakeQueue} from './wake_queue.js';
// L4a host seam: one location store, relative clock projection, no beat resolver.
import {onCastLoaded,lotmCastDays,lotmCastSchedule} from './book_world_lotm_cast_days.js';
import {createSimulationRegistry} from './simulation_contracts.js';
let LOTM_CAST={people:[],places:[],placeAliases:[]};
export let castAvailable=false;
import {whereabouts,awayReason,compileCastSchedule} from './cast_schedule.js';
import {calendarMinutes} from './world_rhythm.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {lotmWalkMinutes,districtOfPlace} from './book_world_lotm_districts.js';
import {LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {cmd,eq} from './book_world_lotm_kit.js';
import {waitUntilOptions} from './wait_until.js';
import {BE_PROFILE_ID} from './seat_profiles.js';
import {defineJourneys,quoteJourneys,pendingJourneyReports,settleJourneyReports} from './cast_journeys.js';
import {defineInferences,quoteInferences,pendingInferenceReports,settleInferenceReports} from './cast_inference_adapter.js';
import {defineCards,settleCardReports} from './cast_card_runtime.js';
import {defineCastAbilities,quoteCastAbilities} from './cast_ability_adapter.js';
import {defineDivinations,quoteDivinations,pendingDivinationReports,settleDivinationReports} from './cast_divination_adapter.js';
import {defineCastExchanges,quoteCastExchanges} from './cast_exchange_adapter.js';
import {defineCastMaking,quoteCastMaking,validateCastMakingConsumers} from './cast_making_adapter.js';
import {defineTopicTalks,quoteTopicTalks,pendingTopicTalkReports,settleTopicTalkReports} from './cast_topic_talk.js';
import {definePlaceActs,seedPlaceObjects,quotePlaceActs,settlePlaceActReports,pendingPlaceActReports} from './place_acts.js';

export const LOTM_BESIDE_PROFILE='lotm.early_tingen.canon_beside@1';
export const lotmBeside=state=>state?.lotm?.entryProfile===LOTM_BESIDE_PROFILE;
export const lotmBe=state=>state?.lotm?.entryProfile===BE_PROFILE_ID;
export const lotmCastLife=state=>lotmBeside(state)||lotmBe(state);
export function castWaitOptions(state,{appointments=[],reason=''}={}){
 if(!lotmCastLife(state)||!castAvailable)return [];
 return waitUntilOptions(state.clock,{epoch:state.lotm.initializedAt,appointments})
  .map(q=>({...q,eligible:!reason,reasons:reason?[reason]:[]}));
}
export const LOTM_CAST_SITUATION='book.lotm.tingen.canon_beside';
export const castSituation={id:LOTM_CAST_SITUATION,revision:1,label:'Cast unavailable: private pack absent',
 context:{worldId:I.world,instanceId:'book.lotm.tingen.main',continuityId:LOTM_CAST_SITUATION,
  eraId:'book.lotm.early_tingen',regionId:'book.lotm.tingen'},participants:['player'],
 initialPhase:'present',phases:['present'],privateTruth:{role:'ordinary_neighbour'}};
let aliases=new Map();
export const resolveCastPlace=id=>aliases.get(id)||id;
export let CAST_PLACE_LABELS={};
let peopleById=new Map(),placesById=new Map();
const actorId=id=>peopleById.get(id)?.sameActorAs||id;
export let castSchedule=[],castPeople=[],castTalkCommands=[],castPlaces=[],castMoves={},castWalkCommands=[];
export let castBodyCommands=[];
export function castBodyOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 return quoteBodyCare(state,castBodyCommands,preview,options);
}
export let castJourneyCommands=[];
// Bind the existing native relocation capability to this world's authored routes.
export function castJourneyContext(state,context){
 if(!lotmCastLife(state)||!castAvailable||!castJourneyCommands.length)return context;
 return {...context,structuredNative:{bound:true,worldId:I.world,bodyId:'native.player.body',locationIds:[...new Set(castJourneyCommands.map(d=>d.journey.to))]},
  facts:{...context.facts,'journey.hour':castCalendar(state).calendar.hour,'journey.money':context.external?.money||0}};
}
export function castJourneyOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 const place=state.simulation?.people?.player?.location,pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
 return quoteJourneys(state,castJourneyCommands.filter(d=>d.location===place||pending.has(d.id)),preview,{...options,label:castPlaceLabel});
}
export let castInferenceCommands=[];
export let castCardRows=[];
export function castInferenceOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 return quoteInferences(state,castInferenceCommands,preview,options);
}
export let castAbilityCommands=[];
export function castAbilityOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 return quoteCastAbilities(state,castAbilityCommands,preview,options);
}
export let castDivinationCommands=[];
export function castDivinationOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 return quoteDivinations(state,castDivinationCommands,preview,options);
}
export let castTopicCommands=[];
export function castTopicOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 // A known person's topics remain visible with their normal away reason.
 const known=state.simulation?.knowledge?.player||{},pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
 return quoteTopicTalks(state,castTopicCommands.filter(d=>pending.has(d.id)||known[`book.lotm.cast.known.${d.targetId}`]||known[`book.lotm.cast.met.${d.targetId}`]),preview,
  {...options,presence:(d,q)=>castTalkPreview(state,d,q),label:id=>id==='player'?'You':LOTM_CAST.people.find(p=>p.id===id)?.name||id});
}
export let castExchangeCommands=[];
export function castExchangeOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 return quoteCastExchanges(state,castExchangeCommands,preview,options);
}
export let castMakingCommands=[];
export function castMakingOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 return quoteCastMaking(state,castMakingCommands,preview,options);
}
export let castObjectCommands=[];
export function castObjectOffers(state,preview,options={}){
 if(!lotmBe(state)||!castAvailable)return [];
 return quotePlaceActs(state,castObjectCommands,LOTM_CAST.householdActs,preview,options);
}
let talkIds=new Set(),roleIds=new Set(),scheduleIndex=compileCastSchedule([]);
// Role records have no autonomous inner life. Explicit work or an observer
// promotes the read for this frame; no context or promotion flag is saved.
export function castNeedsFullContext(state,id){
 if(!lotmCastLife(state)||!roleIds.has(id))return true;
 const sim=state.simulation,p=sim?.people?.[id];
 if(!p)return false;
 if(p.inventory==='native'||p.location===sim.people.player?.location)return true;
 if(!castWakes||wakeEpoch!==state.lotm.initializedAt||state.clock<projectedClock||castWakes.hasDue(id,state.clock))return true;
 return !!sim.programs?.[id]||!!sim.workPlans?.cursors?.[id]||Object.values(sim.pursuits||{}).some(p=>p.actorId===id||p.targetId===id)
  ||Object.values(sim.controllers||{}).some(c=>c.actorId===id)
  ||(sim.jobs||[]).some(j=>(j.participants||[j.actorId]).includes(id))
  ||Object.entries(sim.sessions||{}).some(([actor,s])=>(s.participants||[actor]).includes(id))
  ||(state.pending||[]).some(j=>j.context?.actorId===id);
}

// Retain the previously shipped small-pack enrollment byte contract. Larger
// packs keep remote role definitions in the registry until a real consumer wakes them.
export const CAST_EAGER_PEOPLE_LIMIT=256;
export function castEnrollmentPeople(){return LOTM_CAST.people.length<=CAST_EAGER_PEOPLE_LIMIT?castPeople:castPeople.filter(p=>!roleIds.has(p.id));}
function enrollCastBody(state,def){
 const sim=state.simulation;if(sim.people[def.id]||lotmBe(state)&&def.id===LOTM_CAST.leadLife?.actorId)return false;
 state.actors[def.id]||={facts:{},resources:{},completed:{},sources:{},techniques:{},worldId:def.worldId};
 Object.assign(state.actors[def.id],{worldId:def.worldId});Object.assign(state.actors[def.id].resources,def.resources);
 if(def.inventory==='simulation')sim.owners[def.id]||={};
 sim.people[def.id]={life:'alive',inventory:def.inventory,location:def.location,bornAt:state.lotm.initializedAt,definitionId:def.id,definitionRevision:def.revision,vitals:{...def.vitals},
  body:{id:`native.person.${def.id}.body`,form:'human',hands:2,mobile:true,ownerId:def.id,controllerId:def.id}};
 return true;
}
function referencedCastPeople(state){
 const ids=new Set(),add=id=>{if(id)ids.add(lotmBe(state)&&actorId(id)===LOTM_CAST.leadLife?.actorId?'player':actorId(id));};
 for(const j of state.simulation.jobs||[]){add(j.actorId);add(j.targetId);for(const id of j.participants||[])add(id);}
 for(const [id,s] of Object.entries(state.simulation.sessions||{})){add(id);for(const p of s.participants||[])add(p);}
 for(const c of Object.values(state.simulation.controllers||{}))add(c.actorId);
 for(const id of Object.keys(state.simulation.programs||{}))add(id);
 for(const id of Object.keys(state.simulation.workPlans?.cursors||{}))add(id);
 for(const p of Object.values(state.simulation.pursuits||{})){add(p.actorId);add(p.targetId);}
 for(const j of state.pending||[]) {add(j.context?.actorId);add(j.context?.targetId);}
 return ids;
}
function deriveCast(pack){
 LOTM_CAST=pack;peopleById=new Map(pack.people.map(p=>[p.id,p]));placesById=new Map(pack.places.map(p=>[p.id,p]));castWakes=null;roleIds=new Set(pack.people.filter(p=>p.tier==='role').map(p=>p.id));
 castSituation.label=pack.host.situation.label;
 aliases=new Map(pack.placeAliases.flatMap(a=>[[a.id,a.place],[a.indexId,a.place]]));
 CAST_PLACE_LABELS=Object.fromEntries(pack.places.filter(p=>!p.anchorOnly).map(p=>[p.id,p.name]));
 castSchedule=lotmCastSchedule().map(r=>({...r,actor:actorId(r.actor),place:resolveCastPlace(r.place)}));
 scheduleIndex=compileCastSchedule(castSchedule);
 const firstPlaces=new Map();for(const r of castSchedule)if(!firstPlaces.has(r.actor))firstPlaces.set(r.actor,r.place);
 castPeople=pack.people.filter(p=>!p.sameActorAs&&p.status!=='historical-reference').map(p=>({
 id:p.id,revision:1,label:p.name,worldId:I.world,inventory:'simulation',provision:false,
 location:firstPlaces.get(p.id)||'Whereabouts unplaced',resources:{},
 description:`${p.name}, ${p.tier} cast record. Location follows the bounded source-order schedule.`,
 body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}}));
 castTalkCommands=pack.people.filter(p=>p.tier==='principal'&&!remoteCastPerson(p.id)).map(p=>cmd(
 `cast_talk_${p.indexId.split('.').at(-1)}`,`Talk to ${p.name} · brief greeting, no time cost`,null,
 {alone:true,once:false,targetId:p.id,coLocated:true,visibleWhen:eq('lotm.profile.beside'),
 requires:eq('lotm.profile.beside'),effects:[{type:'knowledge',actor:'player',key:`book.lotm.cast.met.${p.id}`,
 stage:'seen',value:`You spoke with ${p.name} when you were together.`,
 basis:{kind:'observation',attributedTo:'player',situationId:LOTM_CAST_SITUATION}}]}));
 castBodyCommands=defineBodyCare(pack.bodyCare,{worldId:I.world,group:'book_lotm',situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castInferenceCommands=defineInferences(pack.inferences,{worldId:I.world,group:'book_lotm',situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castCardRows=defineCards(pack.eventCards ?? null,{worldId:I.world,actorId:'player',group:'book_lotm',situationId:LOTM_CAST_SITUATION});
 castAbilityCommands=defineCastAbilities(pack.abilityConflicts,{worldId:I.world,group:'book_lotm',situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castDivinationCommands=defineDivinations(pack.divinations,{worldId:I.world,group:'book_lotm',situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castExchangeCommands=defineCastExchanges(pack.exchanges,{worldId:I.world,group:'book_lotm',situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castMakingCommands=defineCastMaking(pack.making,{worldId:I.world,group:'book_lotm',
  situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castTopicCommands=defineTopicTalks(pack.topicTalks,{worldId:I.world,group:'book_lotm',
  situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castJourneyCommands=defineJourneys(pack.journeys,{worldId:I.world,group:'book_lotm',situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 for(const d of castJourneyCommands)if(!placesById.has(d.journey.from)||!placesById.has(d.journey.to))throw Error('Journey needs pack places.');
 castTalkCommands.push(...castTopicCommands);
 talkIds=new Set(castTalkCommands.map(d=>d.id));
 castPlaces=pack.places.filter(p=>p.travel&&!p.anchorOnly);
 castMoves=Object.fromEntries(castPlaces.map(p=>[`lotm.move.${p.id}`,p.id]));
 castWalkCommands=[];walksById.clear();walkPlaces=new Map([...Object.values(L),...castPlaces.map(p=>p.id)].map(id=>[walkPart(id),id]));
 castObjectCommands=definePlaceActs(pack.householdActs,{worldId:I.world,group:'book_lotm',
  situationId:LOTM_CAST_SITUATION,requires:eq('lotm.profile.be')});
 castAvailable=true;
}
// Remote: listed in remoteWhereabouts, or every schedule place lies outside walkable Tingen (no travel row).
// A person with no schedule place at all is not remote, only unplaced ("not known").
export function isRemoteCastPerson(pack,id){
 if(pack.remoteWhereabouts?.some(r=>actorId(r.actor)===actorId(id)))return true;
 const places=(pack.schedule||[]).filter(r=>actorId(r.actor)===actorId(id)).map(r=>pack.places.find(pl=>pl.id===r.place));
 return places.length>0&&places.every(pl=>!pl?.travel);
}
const remoteCastPerson=id=>isRemoteCastPerson(LOTM_CAST,id);
// Knowledge belongs to the player. Pack availability itself reveals no people.
export function castElsewhere(state){
 const known=state.simulation?.knowledge?.player||{};
 return LOTM_CAST.people.filter(p=>p.tier==='principal'&&remoteCastPerson(p.id)&&
 Object.keys(known).some(k=>k===`book.lotm.cast.known.${p.id}`||k===`book.lotm.cast.met.${p.id}`)).map(p=>{
 const row=LOTM_CAST.remoteWhereabouts?.find(r=>actorId(r.actor)===actorId(p.id));
 const place=row?LOTM_CAST.places.find(pl=>pl.id===row.place):null;
 return {id:p.id,label:place?.city?`${p.name} lives in ${place.city}`:`${p.name} lives elsewhere`};
 });
}
// Install through the existing registry's validated definition seam, once per registry.
const installed=new WeakSet();
export function installCast(registry){
 if(!castAvailable||installed.has(registry))return;
 const defs=createSimulationRegistry({people:castPeople,commands:[...castBodyCommands,...castTalkCommands,...castWalkCommands,...castObjectCommands,...castJourneyCommands,...castDivinationCommands,...castMakingCommands,...castInferenceCommands,...castExchangeCommands,...castAbilityCommands],situations:[castSituation]});
 for(const family of ['people','commands','situations'])for(const [id,def] of defs[family])registry.simulation[family].set(id,def);
 validateCastMakingConsumers(castMakingCommands,id=>registry.simulation.commands.get(id));
 installed.add(registry);
}
export function castCalendar(state){
 const elapsed=Math.max(0,state.clock-state.lotm.initializedAt),day=Math.floor(elapsed/1440)+1;
 // This profile starts at the opening small hours, minute 0; it owns no second timer.
 const minute=elapsed%1440;
 return {calendar:{year:Math.floor((day-1)/360),month:Math.floor((day-1)%360/30)+1,
  day:(day-1)%30+1,day_count:day,hour:Math.floor(minute/60),minute:minute%60}};
}
// Projection cache only: physical locations remain in simulation.people. A
// rewind or a newly loaded pack rebuilds it; no wake or projection is saved.
let castWakes=null, wakeEpoch=null, projectedClock=-1;
const projectedPlaces=new Map(),projectedRoles=new Set();
function projectCastWakes(state){
 if(state.clock!==projectedClock)projectedRoles.clear();
 if(!castWakes||wakeEpoch!==state.lotm.initializedAt||state.clock<projectedClock){
  castWakes=createWakeQueue();projectedPlaces.clear();projectedRoles.clear();wakeEpoch=state.lotm.initializedAt;
  for(const person of castPeople)castWakes.register(person.id,state.clock);
 }
 const at=castCalendar(state);
 for(const {id} of castWakes.due(state.clock)){
  if(roleIds.has(id))projectedRoles.add(id);
  projectedPlaces.set(id,scheduleIndex.whereabouts(id,at).place);
  const next=scheduleIndex.nextBoundary(id,at);
  if(next!=null)castWakes.register(id,wakeEpoch+next);

 }
 projectedClock=state.clock;
 return at;
}
function missingCastBodies(state){return LOTM_CAST.people.length>CAST_EAGER_PEOPLE_LIMIT&&[...new Set([...referencedCastPeople(state),...[...projectedPlaces].filter(([,place])=>place!=null).map(([id])=>id)])].some(id=>peopleById.has(id)&&!(lotmBe(state)&&id===LOTM_CAST.leadLife?.actorId)&&!state.simulation.people[id]);}
export function castSyncDue(state){
 if(!lotmCastLife(state)||!castAvailable)return false;
 if(lotmBe(state)&&(pendingPlaceActReports(state,LOTM_CAST.householdActs,I.world)||pendingTopicTalkReports(state,castTopicCommands,I.world)||pendingJourneyReports(state,castJourneyCommands,I.world)||pendingDivinationReports(state,castDivinationCommands,I.world)||pendingInferenceReports(state,castInferenceCommands,I.world)))return true;
 if(lotmBe(state)&&LOTM_CAST.householdActs?.objects?.some(r=>!state.worlds[I.world].facts[`place.act.seed.${r.id}`]))return true;
 if(missingCastBodies(state)||!castWakes||wakeEpoch!==state.lotm.initializedAt||state.clock<projectedClock||castWakes.nextWake(state.clock)===state.clock)return true;
 const day=castCalendar(state).calendar.day_count,facts=state.worlds[I.world].facts;
 return castPeople.some(p=>!roleIds.has(p.id)&&!(lotmBe(state)&&p.id===LOTM_CAST.leadLife?.actorId)&&projectedPlaces.get(p.id)!=null&&state.simulation.people[p.id]&&state.simulation.people[p.id].location!==projectedPlaces.get(p.id))||
  lotmCastDays().some(row=>facts[`lotm.cast.window.${row.scene}`]!== (row.day===day));
}
// Mutates a caller-owned plan/copy only. Availability is projected, not saved in a
// second location field. An inactive row leaves the last physical location alone.
// Role repairs occur on their wakes; keep the same due set for a rejected plan
// retried at the same clock, without marking its unsaved projection as committed.
export function syncLotmCast(state){
 if(!(lotmBeside(state)||lotmBe(state))||!castAvailable)return false;
 const at=projectCastWakes(state);let changed=lotmBe(state)&&(seedPlaceObjects(state,LOTM_CAST.householdActs,I.world)||(pendingPlaceActReports(state,LOTM_CAST.householdActs,I.world)||pendingTopicTalkReports(state,castTopicCommands,I.world)||pendingJourneyReports(state,castJourneyCommands,I.world)||pendingDivinationReports(state,castDivinationCommands,I.world)||pendingInferenceReports(state,castInferenceCommands,I.world)));
 const referenced=referencedCastPeople(state);
 for(const person of castPeople){if(!state.simulation.people[person.id]&&(projectedPlaces.get(person.id)!=null||referenced.has(person.id)))changed=enrollCastBody(state,person)||changed;
  if(roleIds.has(person.id)&&!projectedRoles.has(person.id))continue;const body=state.simulation.people[person.id];if(!body)continue;
  // In a be life the pack-selected person is driven by the player, never by
  // the NPC schedule. The native player body remains the location authority.
  if(lotmBe(state)&&person.id===LOTM_CAST.leadLife?.actorId)continue;
  const place=projectedPlaces.get(person.id);
  if(place!=null&&body.location!==place){body.location=place;castWriteCode(state,`location:${person.id}`,constraintProvenance(scheduleIndex.whereabouts(person.id,at).row||{}));changed=true;}
 }
 const facts=state.worlds[I.world].facts;
 for(const row of lotmCastDays()){const key=`lotm.cast.window.${row.scene}`,value=row.day===at.calendar.day_count;
  if(facts[key]!==value){facts[key]=value;castWriteCode(state,`fact:${key}`,'canon-derived');changed=true;}}
 return changed;
}
// Same quote is used by the action list and immediately before commit (AR7).
export function castTalkPreview(state,def,preview){
 if(!lotmCastLife(state)||!talkIds.has(def?.id))return preview;
 const at=castCalendar(state),result=scheduleIndex.whereabouts(def.targetId,at);
 const playerPlace=state.simulation.people.player.location;
 if(result.place!=null&&result.place===playerPlace)return preview;
 // If already at another place, use its current band. Otherwise the schedule
 // supplies the next known return. A person with no dated row stays unplaced.
 const away=result.place!=null?{place:null,nextAt:calendarMinutes(at.calendar),nextPlace:result.place}:result;
 const reason=awayReason(away,CAST_PLACE_LABELS)||'Away; return time and place are not known.';
 return {...preview,eligible:false,reasons:[...preview.reasons.filter(r=>r!=='Meet the participant at their location.'),reason]};
}

// Cast addresses are distinct native IDs. District links supply the cost; the
// existing same-district default is 2 minutes (authored, adjustable).
export const castPlaceLabel=id=>CAST_PLACE_LABELS[id]||(!castAvailable&&dormantCastPlace(id)?'Cast place unavailable':id);
export const castWalkId=(from,to)=>`book.lotm.cast_walk_${from.replaceAll(/[^a-z0-9]/gi,'_')}_${to.replaceAll(/[^a-z0-9]/gi,'_')}`;
const walkPart=id=>id.replaceAll(/[^a-z0-9]/gi,'_');
let walkPlaces=new Map();const walksById=new Map();
// Walks are quoted by address, rather than registering every pair of addresses.
// The exact incumbent ID/effects are retained for in-flight saved jobs.
export function castWalkDefinition(from,to){
 if(from===to||!walkPlaces.has(walkPart(from))||!walkPlaces.has(walkPart(to))||!(castMoves[`lotm.move.${from}`]||castMoves[`lotm.move.${to}`]))return null;
 const id=castWalkId(from,to);if(walksById.has(id))return walksById.get(id);
 const minutes=lotmWalkMinutes(from,to),district=districtOfPlace(to);if(minutes==null||!district)return null;
 const def=cmd(id.replace('book.lotm.',''),`Walk to ${castPlaceLabel(to)} · ${minutes} min`,from,
 {alone:true,once:false,duration:minutes,cancellation:'none',requires:eq('lotm.profile.beside'),
 effects:[{type:'knowledge',actor:'player',key:'book.lotm.arrived',stage:'seen',
 value:`You reach ${castPlaceLabel(to)} in ${district.qlabel}. The walk took ${minutes} minutes.`,
 basis:{kind:'observation',attributedTo:'player',situationId:LOTM_CAST_SITUATION}}]});
 walksById.set(id,def);castWalkCommands.push(def);return def;
}
export function castWalkDefinitionById(id){
 if(walksById.has(id))return walksById.get(id);
 if(typeof id!=='string'||!id.startsWith('book.lotm.cast_walk_'))return null;
 const tail=id.slice('book.lotm.cast_walk_'.length);
 for(const [key,from] of walkPlaces)if(tail.startsWith(key+'_')){const to=walkPlaces.get(tail.slice(key.length+1));if(to)return castWalkDefinition(from,to);}
 return null;
}
const walkDestination=def=>{const tail=def.id.slice(('book.lotm.cast_walk_'+walkPart(def.location)+'_').length);return walkPlaces.get(tail);};
export function installCastWalk(registry,from,to){
 const def=castWalkDefinition(from,to);if(!def)return null;
 if(!registry.simulation.commands.has(def.id)){
  const checked=createSimulationRegistry({commands:[def]});registry.simulation.commands.set(def.id,checked.commands.get(def.id));
 }
 return registry.simulation.commands.get(def.id);
}

// Missing-pack saves keep their bodies and knowledge. Name-free dormant
// definitions let the normal validators retain those exact identities; no
// schedule, meeting or new start is granted by these placeholders.
export const dormantCastPlace=id=>typeof id==='string'&&/^lotm\.place\.cast-[a-f0-9]{20}$/.test(id);
export function restoreUnavailableCast(state,registry,place=()=>{}){
 if(!lotmCastLife(state))return;
 if(castAvailable){for(const job of state.simulation?.jobs||[]){const def=castWalkDefinitionById(job.commandId);if(def)installCastWalk(registry,def.location,walkDestination(def));}return;}
 for(const [id,body] of Object.entries(state.simulation?.people||{})){
  if(!/^lotm\.(?:person\.cast-[a-f0-9]{20}|role\.[a-z][a-z0-9-]*)$/.test(id)||registry.simulation.people.has(id))continue;
  registry.simulation.people.set(id,{id,revision:body.definitionRevision||1,label:'Cast unavailable',worldId:I.world,
   inventory:'simulation',provision:false,location:body.location,resources:{},body:{form:'human',hands:2,mobile:true},vitals:{...body.vitals}});
 }
 const at=state.simulation?.people?.player?.location;if(dormantCastPlace(at))place(at);
 // Walk jobs already hold their exact quoted effects. Retain the timer and
 // use that saved settlement, rather than reconstructing private source data.
 for(const job of state.simulation?.jobs||[]){
  if(!dormantCastWalk(job)||registry.simulation.commands.has(job.commandId))continue;
  registry.simulation.commands.set(job.commandId,cmd(job.commandId.slice('book.lotm.'.length),'Finish the saved walk',null,
   {alone:true,once:false,duration:Math.max(1,job.due-state.clock),cancellation:'none',effects:structuredClone(job.effects)}));
 }
}

export function dormantCastWalk(job){
 const effect=job.effects?.[0];
 return !castAvailable&&/^book\.lotm\.cast_walk_[a-z0-9_]+$/i.test(job.commandId||'')&&job.actorId==='player'&&job.revision===1&&job.cancellation==='none'
  &&Array.isArray(job.costs)&&job.costs.length===0&&job.effects?.length===1&&effect.type==='knowledge'&&effect.actor==='player'
  &&effect.key==='book.lotm.arrived'&&effect.stage==='seen'&&typeof effect.value==='string'
  &&effect.basis?.kind==='observation'&&effect.basis?.attributedTo==='player'&&effect.basis?.situationId===LOTM_CAST_SITUATION;
}

onCastLoaded(deriveCast);

// L4b: the host's clock is the only clock. Resolution returns a plan; previews
// never commit the domain ledger or publish a report (CLR10, RPT8).
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
import {defineBeats,resolveBeats,newBeatState} from './beat_records.js';
import {renderRefs} from './ref_resolver.js';
import {beatKnowledgeWrites,applyBeatKnowledge} from './beat_knowledge.js';
import {applySimulationEffects} from './simulation_effects.js';
const REPORT_PREFIX='lotm.cast.report.';
const terminalBeat=row=>row&&['carried','altered','blocked','lapsed'].includes(row.status);
// The same authored day/minute projection used by settlement, without exposing
// the underlying beat or maintaining a second clock.
export function nextCastBeatTime(state,through,ledger,pack=getPrivateLotmCast()){
 if(!lotmCastLife(state)||!pack?.bindings)return null;
 const days=new Map(pack.bindings.days.map(d=>[d.scene,d]));let next=null;
 for(const b of pack.bindings.beats){
  if(terminalBeat(ledger?.done?.[b.id]))continue;
  const day=days.get(b.scene);if(!day)continue;
  const at=state.lotm.initializedAt+(day.day-1)*1440+day.from;
  if(at>state.clock&&at<=through&&(next==null||at<next))next=at;
 }
 return next;
}
const castKnown=(state,id)=>['known','met'].some(kind=>state.simulation?.knowledge?.player?.[`book.lotm.cast.${kind}.${id}`]);
const renderCastReport=r=>renderRefs(r.template,{names:r.names}).replace(/^(\s*\p{Ll})/u,letter=>letter.toUpperCase());
// Pack constraints are cached projections. They share the actor alias and place
// resolver with schedules; neither a second canon store nor a saved source table.
const constraintCache=new WeakMap();
export function castConstraints(pack=getPrivateLotmCast()){
 if(!pack)return null;
 if(!constraintCache.has(pack))constraintCache.set(pack,constraintsFromPack(pack,{
  actor:id=>pack.people.find(p=>p.id===id)?.sameActorAs||id,
  place:id=>pack.placeAliases.find(p=>p.id===id||p.indexId===id)?.place||id}));
 return constraintCache.get(pack);
}
export function canonBeatForLife(beat,constrained,mode){
 if(!constrained||mode!=='canon')return beat;
 return {...beat,needs:null,mechanism:null,deps:[],altered:[]};
}
export function castWriteCode(state,key,code){
 if(!PROVENANCE_CODES.includes(code))throw Error('Unknown cast provenance.');
 (state.lotm.castProvenance??={})[key]=code;
}
export function canonActionDecision(state,def,pack=getPrivateLotmCast(),context={}){
 if(!lotmBe(state)||state.lotm.runMode!=='canon'||!pack)return {allowed:true};
 const data=castConstraints(pack),lead=pack.leadLife?.actorId,who=id=>!id||id==='player'?lead:id;
 const changes=new Map();
 for(const e of [...(def?.costs||[]),...(def?.effects||[])]){
  if(!['fact','resource','item','knowledge'].includes(e.type))continue;
  const c={actor:who(e.actor),type:e.type,scope:e.scope||'',key:e.key,native:!!e.native};
  const key=JSON.stringify(c),prior=changes.get(key);
  changes.set(key,Object.hasOwn(e,'value')?{...c,value:e.value}:{...c,amount:(prior?.amount||0)+(e.amount||0)});
 }
 const at=Math.max(0,state.clock-state.lotm.initializedAt);
 const read=c=>{
  const id=c.actor===lead?'player':c.actor;
  if(c.type==='resource')return c.native?context.external?.[c.key]:state.actors?.[id]?.resources?.[c.key];
  if(c.type==='item')return context.gameplay?.[id]?.inventory?.[c.key]??state.simulation?.people?.[id]?.inventory?.[c.key];
  if(c.type==='knowledge')return state.simulation?.knowledge?.[id]?.[c.key]?.value;
  return (c.scope==='actor'?state.actors?.[id]?.facts:state.worlds?.[I.world]?.facts)?.[c.key];
 };
 let settledLedger;
 const changed=[...changes.values()];
 // Include duration-only actions in time reservations without inventing an effect.
 if(!changed.length)changed.push({actor:lead,type:'time',key:'busy'});
 return reservationDecision(data.store,{changes:changed,at,through:at+(def?.duration||0),read,
  settled:id=>terminalBeat((settledLedger??=currentCastBeatLedger()).done[id])});
}
// Inspection-only compatibility report. The saved revision and fill values are
// retained unchanged; no source truth or strain table is written into the save.
export function castRevisionReport(state,pack=getPrivateLotmCast()){
 const data=castConstraints(pack);if(!data)return {unavailable:true};
 const fills=[];
 for(const [key,code] of Object.entries(state.lotm?.castProvenance||{})){
  if(code!=='fill'||!key.startsWith('fact:'))continue;
  const fact=key.slice(5),value=state.worlds?.[I.world]?.facts?.[fact];
  fills.push({actor:pack.leadLife?.actorId,key:fact,value,provenance:code});
 }
 return {savedRevision:state.lotm?.packRevision??'unversioned',revision:data.revision,
  strain:contradictedFills(data.store,fills),draws:planLotmCastBeats(state,newBeatState(),pack).strain||[],gaps:data.gaps};
}
// Canon effect facts are reconstructed from the pack and terminal receipts.
// Legacy saves with such facts keep their exact values as deltas on first read.
export function deriveCastLedger(ledger,pack){
 const facts={},days=new Map((pack?.bindings?.days||[]).map(d=>[d.scene,d]));
 const ordered=[...(pack?.bindings?.beats||[])].sort((a,b)=>{const x=days.get(a.scene),y=days.get(b.scene);return (x?.day??a.dayIndex)-(y?.day??b.dayIndex)||(x?.from??0)-(y?.from??0);});
 for(const b of ordered)if(ledger.done[b.id]?.status==='carried')
  for(const e of b.effects||[])facts[e.fact]=Object.hasOwn(e,'value')?e.value:(facts[e.fact]||0)+e.add;
 return {...ledger,facts:{...facts,...ledger.facts}};
}
export function compactCastLedger(ledger,pack){
 const baseline=deriveCastLedger({...ledger,facts:{}},pack).facts,facts={...ledger.facts};
 for(const [key,value] of Object.entries(baseline))if(JSON.stringify(facts[key])===JSON.stringify(value))delete facts[key];
 for(const key of Object.keys(facts))if(key.startsWith('lotm.cast.window.'))delete facts[key];
 return {...ledger,facts};
}
export function castBeatReports(ledger){
 return Object.entries(ledger?.facts||{}).filter(([key])=>key.startsWith(REPORT_PREFIX)).map(([,r])=>({...r,text:r.text||renderCastReport(r)}));
}
export function castSettledPeople(state,ledger,pack=getPrivateLotmCast()){
 if(!lotmCastLife(state)||!pack)return [];
 const reports=castBeatReports(ledger);
 return pack.people.filter(p=>castKnown(state,p.id)&&(!roleIds.has(p.id)||state.simulation?.people?.[p.id]?.location===state.simulation?.people?.player?.location)).map(p=>({id:p.id,name:p.name,
  location:'Known from your local meetings and received accounts',
  details:Object.values(state.simulation?.knowledge?.player||{}).filter(k=>reports.some(r=>r.actor===p.id&&r.beat===k.cause)).map(k=>k.value),
  memories:reports.filter(r=>r.actor===p.id).map(r=>({id:r.beat,at:r.at,text:r.text}))}));
}
export function planLotmCastBeats(state,ledger=newBeatState(),pack=getPrivateLotmCast()){
 if(!lotmCastLife(state)||!pack?.bindings)return {ledger,results:[],reports:[]};
 ledger=deriveCastLedger(ledger,pack);
 const elapsed=Math.max(0,state.clock-state.lotm.initializedAt),days=new Map(pack.bindings.days.map(r=>[r.scene,r]));
 const constraints=castConstraints(pack),strain=[];
 const actor=id=>{const resolved=pack.people.find(p=>p.id===id)?.sameActorAs||id;return lotmBe(state)&&resolved===pack.leadLife?.actorId?'player':resolved;};
 const place=id=>pack.placeAliases.find(p=>p.id===id||p.indexId===id)?.place||id;
 const due=pack.bindings.beats.filter(b=>{const d=days.get(b.scene);return d&&(d.day-1)*1440+d.from<=elapsed;});
 due.sort((a,b)=>{const x=days.get(a.scene),y=days.get(b.scene);return x.day-y.day||x.from-y.from;});
 const table=defineBeats(due.map((b,order)=>{
  const pinned=lotmBe(state)&&state.lotm.runMode==='canon'&&constraintProvenance(b)!=='fill';
  let effects=b.effects;
  if(pinned&&!terminalBeat(ledger.done[b.id])){
   const constraint=constraints.store.byId.get(b.id),expected=constraint.produces;
   // A supplied model table can have several outcomes. The current pack's
   // event model is deterministic; no unsupported failure odds are invented.
   const roll=conditionedDraw(state.streams||createStreams(state.rng??0),{world:I.world,actor:constraint.actor,
    date:days.get(b.scene).day,subject:b.id,revision:constraints.revision,
    outcomes:b.outcomes||[{effects:b.effects||[],weight:1}],consistent:o=>(o.effects||[]).length===expected.length&&expected.every(e=>(o.effects||[]).some(x=>x.fact===e.key&&JSON.stringify(x.value)===JSON.stringify(e.value)&&x.add===e.add))});
   effects=roll.outcome.effects;strain.push({...roll.strain,constraint:b.id});
  }
  return {...canonBeatForLife(b,pinned,state.lotm.runMode),effects,actor:actor(b.actor),order};
 }));
 let next=structuredClone(ledger);const results=[],reports=[],knowledgeWrites=[];
 // Reopen the resolver's current day when a later scene becomes due. Its done
 // map remains authoritative, so each terminal result and receipt is written once.
 for(const beat of table){
  if(terminalBeat(next.done[beat.id]))continue;
  const day=days.get(beat.scene),at=state.lotm.initializedAt+(day.day-1)*1440+day.from;
  const facts={...state.worlds[I.world].facts,...next.facts};
  for(const d of pack.bindings.days)facts[`lotm.cast.window.${d.scene}`]=d.day===day.day;
  // Older packs used the scene suffix; bind it to the same authoritative day.
  for(const b of pack.bindings.beats)if(b.needs?.fact?.startsWith('lotm.cast.window.'))facts[b.needs.fact]=days.get(b.scene)?.day===day.day;
  const available=table.filter(b=>b.dayIndex<=day.day&&(b.id===beat.id||terminalBeat(next.done[b.id])));
  const resolution=resolveBeats(available,{...next,facts,day:day.day-1},day.day,
   {lives:[{id:beat.actor}],mechanisms:[]});
  next={...resolution.state,day:Math.max(ledger.day,resolution.state.day)};
  for(const result of resolution.results){
   const provenance=constraintProvenance(beat);
   result.provenance=provenance;
   for(const diff of result.diffs)diff.provenance=provenance;
   results.push({...result,at,actor:beat.actor,place:place(beat.place)});
   const eventState={...state,clock:at};
   const schedule=(pack.bindings.schedule||[]).map(r=>({...r,actor:actor(r.actor),place:place(r.place)}));
   const present=[...new Set(schedule.map(r=>r.actor))].filter(id=>whereabouts(schedule,id,castCalendar(eventState)).place===place(beat.place));
   knowledgeWrites.push(...beatKnowledgeWrites(beat,result,{at,present,actor}));
   if(lotmBe(state)&&beat.actor==='player'&&result.status==='carried'){
    for(const k of beat.knows||[])if((k.audience==='actor'||(!k.audience&&!k.actor))&&k.key&&k.value)
     knowledgeWrites.push({at,cause:beat.id,effect:{type:'knowledge',actor:'player',key:k.key,stage:k.stage||'seen',value:k.value}});
    continue;
   }
   if(!['carried','altered'].includes(result.status)||at!==state.clock)continue;
   // Each perception route is authored in the private pack. A footprint alone
   // does not grant access to private thoughts, dreams or remote news (RPT2).
   const routes=pack.reports?.[beat.id]||{},knowledge=state.simulation?.knowledge?.player||{};
   const exposure=['present','affected','aftermath','heard'].find(level=>{
    const route=routes[level];return route?.text&&route.places?.includes(state.simulation.people.player.location)
     &&(!route.knowledge||Object.hasOwn(knowledge,route.knowledge))&&!state.simulation.jobs?.some(j=>j.actorId==='player');
   });
   if(!exposure)continue;
   knowledgeWrites.push(...beatKnowledgeWrites(beat,result,{at,playerExposure:exposure,actor}).filter(w=>w.effect.actor==='player'));
   const names=Object.fromEntries(pack.people.filter(p=>castKnown(state,p.id)).map(p=>[p.id,p.name]));
   for(const w of knowledgeWrites.filter(w=>w.cause===beat.id&&w.effect.actor==='player'))w.effect.value=renderRefs(w.effect.value,{names}).replace(/^(\s*\p{Ll})/u,c=>c.toUpperCase());
   const report={provenance,beat:beat.id,actor:beat.actor,day:day.day,at,place:place(beat.place),exposure,
    template:routes[exposure].text,names,kind:['present','affected'].includes(exposure)?'event':'background'};
   next.facts[REPORT_PREFIX+beat.id]=report;reports.push({...report,text:renderCastReport(report)});
  }
 }
 for(const w of knowledgeWrites){
  const b=pack.bindings.beats.find(b=>b.id===w.cause),provenance=constraintProvenance(b||{});
  w.provenance=provenance;w.effect.basis={kind:'observation',attributedTo:w.effect.actor,
   situationId:LOTM_CAST_SITUATION,provenance,...(b?.locator?{locator:b.locator}:{})};
 }
 return {ledger:next,results,reports,knowledgeWrites,strain};
}

import './beat_ledger.js';
import {domainRegistry} from './domain_registry.js';
import {serializeBeatLedger} from './beat_ledger.js';
export const currentCastBeatLedger=()=>domainRegistry.command('beatLedger','state')();
export const castBeatsPending=state=>planLotmCastBeats(state,currentCastBeatLedger()).results.length>0;
// The ledger rides the existing durable expansion envelope, then publishes to
// its domain holder. A rejected save leaves both the holder and Reports alone.
export function persistLotmCastPlan(plan,persist,{reset=false,publish=()=>{},writeKnowledge=(p,e,c)=>applySimulationEffects(p,e,{actorId:'player'},null,c)}={}){
 if(!lotmCastLife(plan.state))return persist(plan);
 const out=planLotmCastBeats(plan.state,reset?newBeatState():currentCastBeatLedger());
 if(out.knowledgeWrites?.length){
  applyBeatKnowledge(plan,out.knowledgeWrites,writeKnowledge);
 }
 for(const w of out.knowledgeWrites||[])castWriteCode(plan.state,`knowledge:${w.effect.actor}:${w.effect.key}`,w.provenance);
 for(const result of out.results)for(const diff of result.diffs)castWriteCode(plan.state,`fact:${diff.fact}`,diff.provenance);
 const cardWindow={scenes:(getPrivateLotmCast()?.bindings?.days||[]).filter(d=>plan.state.clock>=plan.state.lotm.initializedAt+(d.day-1)*1440+d.from).map(d=>d.scene)};
 const cardReports=lotmBe(plan.state)?settleCardReports(plan.state,castCardRows,{window:cardWindow,decide:card=>canonActionDecision(plan.state,{effects:card.effects},getPrivateLotmCast())}):[];
 for(const report of cardReports){
  if(report.effects.length)applySimulationEffects(plan,report.effects,{actorId:'player',worldId:I.world,facts:{location:report.place}},null,`lotm.cast.card.${report.cardId.replace(/[^a-z0-9_.:-]/gi,'_')}`);
  out.ledger.facts[REPORT_PREFIX+`card.${report.cardId}`]={text:report.text,at:report.at,kind:report.kind,actor:report.actor,place:report.place,threadId:report.threadId};
 }
 const saved=compactCastLedger(out.ledger,getPrivateLotmCast());
 plan.nativePatch={...plan.nativePatch,beatLedger:serializeBeatLedger(saved)};
 const objectReports=lotmBe(plan.state)?settlePlaceActReports(plan.state,LOTM_CAST.householdActs,I.world):[];
 const inferenceReports=lotmBe(plan.state)?settleInferenceReports(plan.state,castInferenceCommands,I.world):[];
 const divinationReports=lotmBe(plan.state)?settleDivinationReports(plan.state,castDivinationCommands,I.world):[];
 const topicReports=lotmBe(plan.state)?settleTopicTalkReports(plan.state,castTopicCommands,I.world):[];
 const journeyReports=lotmBe(plan.state)?settleJourneyReports(plan.state,castJourneyCommands,I.world):[];
 const result=persist(plan);
 domainRegistry.command('beatLedger','commit')(saved);
 for(const report of [...out.reports,...objectReports,...topicReports,...journeyReports,...divinationReports,...inferenceReports,...cardReports])publish(report);
 return result;
}
