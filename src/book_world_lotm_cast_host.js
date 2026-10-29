// L4a host seam: one location store, relative clock projection, no beat resolver.
import {onCastLoaded,lotmCastDays,lotmCastSchedule} from './book_world_lotm_cast_days.js';
import {createSimulationRegistry} from './simulation_contracts.js';
let LOTM_CAST={people:[],places:[],placeAliases:[]};
export let castAvailable=false;
import {whereabouts,awayReason} from './cast_schedule.js';
import {calendarMinutes} from './world_rhythm.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {lotmWalkMinutes,districtOfPlace} from './book_world_lotm_districts.js';
import {LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {cmd,eq} from './book_world_lotm_kit.js';
import {waitUntilOptions} from './wait_until.js';
import {BE_PROFILE_ID} from './seat_profiles.js';

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
const actorId=id=>LOTM_CAST.people.find(p=>p.id===id)?.sameActorAs||id;
export let castSchedule=[],castPeople=[],castTalkCommands=[],castPlaces=[],castMoves={},castWalkCommands=[];
let talkIds=new Set();
function deriveCast(pack){
 LOTM_CAST=pack;
 castSituation.label=pack.host.situation.label;
 aliases=new Map(pack.placeAliases.flatMap(a=>[[a.id,a.place],[a.indexId,a.place]]));
 CAST_PLACE_LABELS=Object.fromEntries(pack.places.filter(p=>!p.anchorOnly).map(p=>[p.id,p.name]));
 castSchedule=lotmCastSchedule().map(r=>({...r,actor:actorId(r.actor),place:resolveCastPlace(r.place)}));
 castPeople=pack.people.filter(p=>!p.sameActorAs&&p.status!=='historical-reference').map(p=>({
 id:p.id,revision:1,label:p.name,worldId:I.world,inventory:'simulation',provision:false,
 location:castSchedule.find(r=>r.actor===p.id)?.place||'Whereabouts unplaced',resources:{},
 description:`${p.name}, ${p.tier} cast record. Location follows the bounded source-order schedule.`,
 body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}}));
 castTalkCommands=pack.people.filter(p=>p.tier==='principal'&&!remoteCastPerson(p.id)).map(p=>cmd(
 `cast_talk_${p.indexId.split('.').at(-1)}`,`Talk to ${p.name} · brief greeting, no time cost`,null,
 {alone:true,once:false,targetId:p.id,coLocated:true,visibleWhen:eq('lotm.profile.beside'),
 requires:eq('lotm.profile.beside'),effects:[{type:'knowledge',actor:'player',key:`book.lotm.cast.met.${p.id}`,
 stage:'seen',value:`You spoke with ${p.name} when you were together.`,
 basis:{kind:'observation',attributedTo:'player',situationId:LOTM_CAST_SITUATION}}]}));
 talkIds=new Set(castTalkCommands.map(d=>d.id));
 castPlaces=pack.places.filter(p=>p.travel&&!p.anchorOnly);
 castMoves=Object.fromEntries(castPlaces.map(p=>[`lotm.move.${p.id}`,p.id]));
 castWalkCommands=makeCastWalkCommands();
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
 const defs=createSimulationRegistry({people:castPeople,commands:[...castTalkCommands,...castWalkCommands],situations:[castSituation]});
 for(const family of ['people','commands','situations'])for(const [id,def] of defs[family])registry.simulation[family].set(id,def);
 installed.add(registry);
}
export function castCalendar(state){
 const elapsed=Math.max(0,state.clock-state.lotm.initializedAt),day=Math.floor(elapsed/1440)+1;
 // This profile starts at the opening small hours, minute 0; it owns no second timer.
 const minute=elapsed%1440;
 return {calendar:{year:Math.floor((day-1)/360),month:Math.floor((day-1)%360/30)+1,
  day:(day-1)%30+1,day_count:day,hour:Math.floor(minute/60),minute:minute%60}};
}
// Mutates a caller-owned plan/copy only. Availability is projected, not saved in a
// second location field. An inactive row leaves the last physical location alone.
export function syncLotmCast(state){
 if(!(lotmBeside(state)||lotmBe(state))||!castAvailable)return false;
 const at=castCalendar(state);let changed=false;
 for(const person of castPeople){const body=state.simulation.people[person.id];if(!body)continue;
  // In a be life the pack-selected person is driven by the player, never by
  // the NPC schedule. The native player body remains the location authority.
  if(lotmBe(state)&&person.id===LOTM_CAST.leadLife?.actorId)continue;
  const result=whereabouts(castSchedule,person.id,at);
  if(result.place!=null&&body.location!==result.place){body.location=result.place;changed=true;}
 }
 const facts=state.worlds[I.world].facts;
 for(const row of lotmCastDays()){const key=`lotm.cast.window.${row.scene}`,value=row.day===at.calendar.day_count;
  if(facts[key]!==value){facts[key]=value;changed=true;}}
 return changed;
}
// Same quote is used by the action list and immediately before commit (AR7).
export function castTalkPreview(state,def,preview){
 if(!lotmCastLife(state)||!talkIds.has(def?.id))return preview;
 const at=castCalendar(state),result=whereabouts(castSchedule,def.targetId,at);
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
const makeCastWalkCommands=()=>[...Object.values(L),...castPlaces.map(p=>p.id)].flatMap(from=>
 [...Object.values(L),...castPlaces.map(p=>p.id)].filter(to=>from!==to&&(castMoves[`lotm.move.${from}`]||castMoves[`lotm.move.${to}`])).map(to=>{
 const minutes=lotmWalkMinutes(from,to),district=districtOfPlace(to);
 return cmd(castWalkId(from,to).replace('book.lotm.',''),`Walk to ${castPlaceLabel(to)} · ${minutes} min`,from,
 {alone:true,once:false,duration:minutes,cancellation:'none',requires:eq('lotm.profile.beside'),
 effects:[{type:'knowledge',actor:'player',key:'book.lotm.arrived',stage:'seen',
 value:`You reach ${castPlaceLabel(to)} in ${district.qlabel}. The walk took ${minutes} minutes.`,
 basis:{kind:'observation',attributedTo:'player',situationId:LOTM_CAST_SITUATION}}]});
 }));

// Missing-pack saves keep their bodies and knowledge. Name-free dormant
// definitions let the normal validators retain those exact identities; no
// schedule, meeting or new start is granted by these placeholders.
export const dormantCastPlace=id=>typeof id==='string'&&/^lotm\.place\.cast-[a-f0-9]{20}$/.test(id);
export function restoreUnavailableCast(state,registry,place=()=>{}){
 if(castAvailable||!lotmCastLife(state))return;
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
// D1 may replace this projection with conditioned constraints. The source beat
// remains authoritative; this lane does not introduce a constraint store.
export function canonBeatForLife(beat,isLead,mode){
 if(!isLead||mode!=='canon')return beat;
 return {...beat,needs:null,mechanism:null,deps:[],altered:[]};
}
// D1 replaces this narrow explicit-fact check with reservations over the
// effects of a command and the full set of canon constraints.
export function canonActionDecision(state,def,pack=getPrivateLotmCast()){
 if(!lotmBe(state)||state.lotm.runMode!=='canon')return {allowed:true};
 const fixed=new Map((pack?.bindings?.beats||[]).flatMap(b=>(b.effects||[]).filter(e=>Object.hasOwn(e,'value')).map(e=>[e.fact,e.value])));
 for(const effect of [...(def?.costs||[]),...(def?.effects||[])])
  if(effect.type==='fact'&&fixed.has(effect.key)&&(!Object.hasOwn(effect,'value')||effect.value!==fixed.get(effect.key)))return {allowed:false,reason:'Not how it happened'};
 return {allowed:true};
}
export function castBeatReports(ledger){
 return Object.entries(ledger?.facts||{}).filter(([key])=>key.startsWith(REPORT_PREFIX)).map(([,r])=>({...r,text:renderCastReport(r)}));
}
export function castSettledPeople(state,ledger,pack=getPrivateLotmCast()){
 if(!lotmCastLife(state)||!pack)return [];
 const reports=castBeatReports(ledger);
 return pack.people.filter(p=>castKnown(state,p.id)).map(p=>({id:p.id,name:p.name,
  location:'Known from your local meetings and received accounts',
  details:Object.values(state.simulation?.knowledge?.player||{}).filter(k=>reports.some(r=>r.actor===p.id&&r.beat===k.cause)).map(k=>k.value),
  memories:reports.filter(r=>r.actor===p.id).map(r=>({id:r.beat,at:r.at,text:r.text}))}));
}
export function planLotmCastBeats(state,ledger=newBeatState(),pack=getPrivateLotmCast()){
 if(!lotmCastLife(state)||!pack?.bindings)return {ledger,results:[],reports:[]};
 const elapsed=Math.max(0,state.clock-state.lotm.initializedAt),days=new Map(pack.bindings.days.map(r=>[r.scene,r]));
 const actor=id=>{const resolved=pack.people.find(p=>p.id===id)?.sameActorAs||id;return lotmBe(state)&&resolved===pack.leadLife?.actorId?'player':resolved;};
 const place=id=>pack.placeAliases.find(p=>p.id===id||p.indexId===id)?.place||id;
 const due=pack.bindings.beats.filter(b=>{const d=days.get(b.scene);return d&&(d.day-1)*1440+d.from<=elapsed;});
 due.sort((a,b)=>{const x=days.get(a.scene),y=days.get(b.scene);return x.day-y.day||x.from-y.from;});
 const table=defineBeats(due.map((b,order)=>({...canonBeatForLife(b,lotmBe(state)&&actor(b.actor)==='player',state.lotm.runMode),actor:actor(b.actor),order})));
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
   const report={beat:beat.id,actor:beat.actor,day:day.day,at,place:place(beat.place),exposure,
    template:routes[exposure].text,names,kind:['present','affected'].includes(exposure)?'event':'background'};
   next.facts[REPORT_PREFIX+beat.id]=report;reports.push({...report,text:renderCastReport(report)});
  }
 }
 return {ledger:next,results,reports,knowledgeWrites};
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
 plan.nativePatch={...plan.nativePatch,beatLedger:serializeBeatLedger(out.ledger)};
 const result=persist(plan);
 domainRegistry.command('beatLedger','commit')(out.ledger);
 for(const report of out.reports)publish(report);
 return result;
}
