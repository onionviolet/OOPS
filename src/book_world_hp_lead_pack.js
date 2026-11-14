// Private HP lead cast: fetched if present (same convention as the other private supplements), merged into the lead
// life's native definition before it is registered. No canon text lives here; with the pack absent the lead life is the
// public stub. Locked "Not how it happened" rows and the act sequence come from the pack.
import {hpLeadHomeCommands} from './hp_lead_home.js';
import {definePlaceActs} from './place_acts.js';
import {placeActStages,placeActSequenceView} from './place_act_sequence.js';
import {validLadder} from './coin_ladder.js';
import {hpLeadSpellCommands} from './hp_lead_spells.js';
import {hpLeadExamCommands} from './world_packs/book_hp_lead_exam_data.js';
import {hpLeadSchoolCommands,hpLeadLessonCommands,hpLeadTieCommands,hpLeadMakingCommands} from './world_packs/book_hp_lead_life_data.js';
const P='book.hp.lead',KIND='hp-cast';
// Book 1 saves and the local continuations pinned this life's identity on 2026-11-09. Since then story-act prerequisites
// name only the previous act (LAYX228, same order of play) and the exam commands joined (2026-11-10): the compiled life
// hashes differently but an old save plays on unchanged. Each row acknowledges one such drift (structured_native_registration.js).
// When this life's compiled content changes again, the first `from` stops matching: check an old save still plays, then update it.
export const HP_LEAD_IDENTITY_ALIASES=Object.freeze([
 {from:'sha256:812a6dcc19c48899503a79d2c2ccbe1eea5d4e18e74d52022c1c4f0ffd276873',to:'sha256:f9cfc3e531af70cd0cab095801b536ac60d52f4bdb0369dddcdce623d4760d5d',reason:'LAYX228 linear act prerequisites; exam commands added'},
]);
const arrivalId=P+'.arrive_school', sortingId=P+'.sorting';
const completed=(id,reason)=>({fact:'completed.'+id,op:'eq',value:true,reason});
const withGate=(command,gate)=>({...command,
    requires:{all:[command.requires,gate].filter(Boolean)},
    ...(command.completionRequires?{completionRequires:{all:[command.completionRequires,gate]}}:{})});
let loaded=null;
export const getHpLeadCast=()=>loaded;
const tooLong=v=>typeof v==='string'?v.length>200:v&&typeof v==='object'?Object.values(v).some(tooLong):false;
export function validateHpLeadCast(pack){
 const bad=[];
 if(pack?.schema!=='hp-cast/1')bad.push('schema');
 const acts=pack?.householdActs?.acts;
 if(!Array.isArray(acts)||!acts.length||!acts.every(a=>a.id?.startsWith(P+'.')))bad.push('acts');
 if(!Array.isArray(pack?.locations)||!Array.isArray(pack?.people))bad.push('places');
 if(tooLong(pack))bad.push('length');
 if(pack?.currency!==undefined&&!(typeof pack.currency?.resource==='string'&&validLadder(pack.currency.ladder)))bad.push('currency');
 if(pack?.items!==undefined&&!(Array.isArray(pack.items)&&pack.items.every(i=>typeof i?.id==='string'&&i.id.startsWith(P+'.')&&typeof i.label==='string')))bad.push('items');
 // Knowledge held by someone else is written only for people who are in the act (no leak to an absent character).
 const rows=[...(Array.isArray(acts)?acts:[]),...(Array.isArray(pack?.schoolWeek?.acts)?pack.schoolWeek.acts:[])];
 if(rows.some(a=>(a.effects||[]).some(e=>e.type==='knowledge'&&e.actor&&e.actor!=='player'&&!(a.participants||[]).includes(e.actor))))bad.push('knowledge-holder');
 if(pack?.schoolWeek!==undefined){
  try {
   const week=pack.schoolWeek, stages=placeActStages(week), ids=new Set(stages.map(s=>s.commandId));
   const choice=stages.findIndex(s=>s.commandId===week.placementAfter);
   if(week.sequences?.length!==1||choice<0||choice===stages.length-1||ids.size!==week.acts.length||
      week.acts.some(a=>!a.id.startsWith(P+'.w6.')||!ids.has(a.id)))bad.push('school-week');
   definePlaceActs(week,{worldId:P+'.world',group:'book_hp_lead',situationId:P+'.situation'});
  } catch {bad.push('school-week');}
 }
 return bad;
}
// The UI reads the same receipts as the native commands. Arrival and Sorting
// keep their original command IDs and occupy their actual places in this route.
export function hpSchoolWeekArc(state,week){
 if(!week)return null;
 const arc=week.sequences[0], stages=[...arc.stages];
 const index=stages.findIndex(s=>s.commandId===week.placementAfter);
 stages.splice(index+1,0,{commandId:sortingId,label:'Hear the hat’s decision'});
 stages.unshift({commandId:arrivalId,label:'Take the train to Hogwarts'});
 return placeActSequenceView(state,{acts:[...week.acts,
  {id:arrivalId,knowledgeKey:P+'.arrived'},{id:sortingId,knowledgeKey:P+'.sorted',place:P+'.school_hall'}],
  sequences:[{...arc,stages}]});
}
export async function loadHpLeadCast(fetchFile=globalThis.fetch){
 try{
  const manifest=await fetchFile('private_packs/manifest.json');if(!manifest.ok)return loaded=null;
  const data=await manifest.json(),path=`${KIND}/cast.json`;
  if(data.schema!==1||!data.supplements?.includes(path))return loaded=null;
  const file=await fetchFile('private_packs/'+path);if(!file.ok)return loaded=null;
  const pack=await file.json();
  const bad=validateHpLeadCast(pack);
  if(bad.length){console.warn(`HP lead cast rejected: ${bad.join(', ')}`);return loaded=null;}
  return loaded=pack;
 }catch(e){console.warn(`HP lead cast failed to load: ${e?.message??e}`);return loaded=null;}
}
// Pure: returns a new native definition. The pack's acts replace the stub command and become native commands.
export function withHpLeadCast(raw,pack){
 if(!pack)return raw;
 const acts=definePlaceActs(pack.householdActs,{worldId:`${P}.world`,group:'book_hp_lead',situationId:`${P}.situation`});
 const native=structuredClone(raw);
 native.locations=[...native.locations,...pack.locations];
 native.items=[...(native.items||[]),...(pack.items||[]).map(i=>({id:i.id,label:i.label,description:i.description||i.label,value:i.value??1}))];
 native.simulation.people=[...native.simulation.people,...pack.people.map(p=>({id:p.id,revision:1,label:p.label,worldId:`${P}.world`,location:`${P}.street`,inventory:'simulation',provision:false,
  body:{id:p.id+'_body',ownerId:p.id,controllerId:p.id,form:'human',hands:2,mobile:true},vitals:{health:100,stamina:100}}))];
 native.presentation.people={...native.presentation.people,...Object.fromEntries(pack.people.map(p=>[p.id,{introductionKnowledgeKey:p.introductionKnowledgeKey}]))};
 // The train leaves from where the cast's story leaves the lead (IDEA_AUDIT_2026-11-06 F1): the last act that relocates the player
 // sets the departure place, so the route continues from the story endpoint instead of the stub's opening room. No such act or an
 // unknown place keeps the stub's departure.
 const placeIds=new Set(native.locations.map(l=>l.id)),school=structuredClone(hpLeadSchoolCommands);
 const endpoint=pack.householdActs.acts.flatMap(a=>(a.effects||[]).filter(e=>e.type==='relocate'&&e.actor==='player'&&placeIds.has(e.location))).at(-1)?.location;
 const arrive=school.find(c=>c.id===arrivalId);if(arrive&&endpoint)arrive.location=endpoint;
 const extras=structuredClone([...hpLeadHomeCommands,...hpLeadLessonCommands,...hpLeadTieCommands,...hpLeadMakingCommands,...hpLeadSpellCommands,...hpLeadExamCommands]);
 let weekCommands=[];
 if(pack.schoolWeek){
  const week=pack.schoolWeek, stages=placeActStages(week), split=stages.findIndex(s=>s.commandId===week.placementAfter);
  const afterSorting=new Set(stages.slice(split+1).map(s=>s.commandId));
  const finishHousehold=placeActStages(pack.householdActs).at(-1);
  if(finishHousehold)school[0]=withGate(school[0],completed(finishHousehold.commandId,'Finish the last task before leaving for school.'));
  school[1]=withGate({...school[1],label:'Hear the hat’s decision · 15 min',
   description:'You have made your request. Wait while the hat decides where to place you.'},
   completed(week.placementAfter,'Wait for your turn and tell the hat your preference.'));
  weekCommands=definePlaceActs(week,{worldId:P+'.world',group:'book_hp_lead',situationId:P+'.situation',
   requires:completed(arrivalId,'Take the train to Hogwarts first.')}).map(c=>afterSorting.has(c.id)
    ?withGate(c,completed(sortingId,'Wait for the hat to place you first.')):c);
  const weekDone=completed(stages.at(-1).commandId,'Finish your first week of school first.');
  for(let i=0;i<extras.length;i++){
   // The pre-school cupboard and its ordinary storage remain available.
   if(extras[i].location!==P+'.cupboard')extras[i]=withGate(extras[i],weekDone);
  }
  native.compatibility.registrationAdditions.locationIds.push(...pack.locations.filter(l=>l.id.startsWith(P+'.w6.')).map(l=>l.id));
 }
 native.simulation.commands=[...acts.map(c=>({...c,audience:['$actor']})),...school,
  ...weekCommands.map(c=>({...c,audience:['$actor']})),...extras];
 native.compatibility.identityAliases=HP_LEAD_IDENTITY_ALIASES;
 return native;
}
