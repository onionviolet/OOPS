// L14 host consumer: the day's news and witnessed beats reach Reports (GM18, GM35). world_events owns the
// record and the reader (AR3); this file loads the optional private pack, binds reached beats to days and
// returns the lines the cast persist path writes once per day rollover (RPT6, replay-safe).
import {deepFreeze} from './basics.js';
import {loadEventPack,frameBindings} from './world_events_pack.js';
import {restrictionsOn,windowOn} from './world_events.js';
import {LOTM_STREET_EVENTS,LOTM_STREET_LINES} from './lotm_street_events.js';
import {worldLight,TINGEN_LIGHT} from './world_light.js';
import {eventKnowledgeWrites} from './world_events_knowledge.js';
const PATH='lotm-events/events.json',LEAD='player',SETTLED='lotm.events.settledDay';
// Dials (default, reason): the lead lives in a city with papers, boards and talk; letters, telegrams and
// police files need a stated carrier. Retune when a role changes what he can read (e.g. a Nighthawk with files).
export const LOTM_LEAD_CHANNELS=Object.freeze(new Set(['newspaper','notice_board','word']));
export async function loadPrivateEvents(fetchFile=globalThis.fetch){
 try{
  const manifest=await fetchFile('private_packs/manifest.json');if(!manifest.ok)return null;
  const data=await manifest.json();if(data.schema!==1||!data.supplements?.includes(PATH))return null;
  const file=await fetchFile('private_packs/'+PATH);if(!file.ok)return null;
  const pack=await file.json();loadEventPack(pack);
  if(!pack.lines||typeof pack.lines!=='object')return null;
  return deepFreeze(pack);
 }catch{return null;}
}
let loaded=null;
export const getPrivateEvents=()=>loaded;
export const setPrivateEvents=pack=>{loaded=pack;};
loadPrivateEvents().then(pack=>{loaded??=pack;});
const kindOf=level=>level==='present'?'events':'background';
// `days` is bindings.days (scene -> day, from), `ledger` the beat ledger being saved, `day` the lead's current day.
// Returns {writes, reports, settledDay}; nothing changes when no pack is loaded or no new day has begun.
export function settleLotmEvents({pack=loaded,ledger,days,day,reached}){
 const prior=ledger.facts[SETTLED];
 if(!pack||!Number.isInteger(day)||day<1)return {writes:[],reports:[],settledDay:prior};
 if(prior===undefined)return {writes:[],reports:[],settledDay:day};   // first run: no backfill of days before the lead arrived
 if(day<=prior)return {writes:[],reports:[],settledDay:prior};
 const byScene=new Map(days.map(d=>[d.scene,d.day])),beats=days.filter(d=>reached.has(d.scene)).map(d=>d.scene);
 const book=loadEventPack(pack,{bindings:frameBindings(pack,beats,beat=>byScene.get(beat)),leadId:LEAD});
 const ctx={presence:()=>null,channels:()=>LOTM_LEAD_CHANNELS};
 const writes=eventKnowledgeWrites(book,LEAD,prior,day,ctx,{textFor:e=>e.lineKey?pack.lines[e.lineKey]:undefined});
 const reports=writes.map(w=>({id:w.cause,text:w.effect.value,at:w.at,kind:kindOf(w.effect.basis.kind==='observation'?'present':'heard'),actor:LEAD}));
 return {writes,reports,settledDay:day};
}
export const LOTM_EVENTS_SETTLED=SETTLED;
// The day's restrictions (closures, curfews, travel halts) for the lead's current day, or [] without a pack (L11 reads them).
export function lotmRestrictions({state,days,pack=loaded}){
 if(!pack||!state.lotm)return [];
 return restrictionsOn(lotmEventBook({state,days,pack}),lotmDay(state));
}
// TMR1 (RCL8): the one Tingen day formula (day 1 = arrival, 24-hour days from it). Moving it onto `dayIndex` waits for a
// Tingen calendar profile (TMR2), which would roll days at midnight instead of 24 hours after arrival.
export const lotmDay=state=>Math.floor((state.clock-state.lotm.initializedAt)/1440)+1;
// The one book the day's restrictions and the upcoming strip both read, so the strip cannot disagree with travel blocking.
// The committed street records (lotm_street_events.js) join the private pack's events, or stand alone without it.
export function lotmEventBook({state,days,pack=loaded}){
 const merged={schema:1,world:pack?.world??'book.lotm.tingen',events:[...(pack?.events??[]),...LOTM_STREET_EVENTS]};
 const byScene=new Map(days.map(d=>[d.scene,d.day])),reached=days.filter(d=>state.clock>=state.lotm.initializedAt+(d.day-1)*1440+d.from).map(d=>d.scene);
 return loadEventPack(merged,{bindings:frameBindings(merged,reached,beat=>byScene.get(beat)),leadId:LEAD});
}
// What is going on at a Tingen place now (PS143): the lines of the book's events placed there whose window covers today and whose
// hours hold at this hour of the Tingen day. '' outside a Tingen life.
export function lotmStreetLine(state,placeId,{days=[],pack=loaded}={}){
 if(!state?.lotm||!Number.isSafeInteger(state.clock)||!Number.isSafeInteger(state.lotm.initializedAt))return '';
 const day=lotmDay(state),hour=Math.floor(((state.clock-state.lotm.initializedAt)%1440+1440)%1440/60);
 return lotmEventBook({state,days,pack}).events.filter(e=>e.place===placeId&&e.lineKey&&windowOn(e,day)&&(!e.hours||(e.hours.from<=hour&&hour<e.hours.until)))
  .map(e=>LOTM_STREET_LINES[e.lineKey]??pack?.lines?.[e.lineKey]).filter(Boolean).join(' ');
}

// Tingen light at the lead's current minute: night and fog are a world-clock state, not event text (FD9).
export const lotmLight=state=>worldLight((((state.clock-state.lotm.initializedAt)%1440)+1440)%1440/1440,TINGEN_LIGHT);
