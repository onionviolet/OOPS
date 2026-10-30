// L14 host consumer: the day's news and witnessed beats reach Reports (GM18, GM35). world_events owns the
// record and the reader (AR3); this file loads the optional private pack, binds reached beats to days and
// returns the lines the cast persist path writes once per day rollover (RPT6, replay-safe).
import {deepFreeze} from './basics.js';
import {loadEventPack,frameBindings} from './world_events_pack.js';
import {restrictionsOn} from './world_events.js';
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
 const day=Math.floor((state.clock-state.lotm.initializedAt)/1440)+1,byScene=new Map(days.map(d=>[d.scene,d.day]));
 const reached=days.filter(d=>state.clock>=state.lotm.initializedAt+(d.day-1)*1440+d.from).map(d=>d.scene);
 return restrictionsOn(loadEventPack(pack,{bindings:frameBindings(pack,reached,beat=>byScene.get(beat)),leadId:LEAD}),day);
}
