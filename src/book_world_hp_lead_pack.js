// Private HP lead cast: fetched if present (same convention as the other private supplements), merged into the lead
// life's native definition before it is registered. No canon text lives here; with the pack absent the lead life is the
// public stub. Locked "Not how it happened" rows and the act sequence come from the pack.
import {hpLeadHomeCommands} from './hp_lead_home.js';
import {definePlaceActs} from './place_acts.js';
import {validLadder} from './coin_ladder.js';
import {hpLeadSpellCommands} from './hp_lead_spells.js';
import {hpLeadSchoolCommands,hpLeadLessonCommands,hpLeadTieCommands,hpLeadMakingCommands} from './world_packs/book_hp_lead_life_data.js';
const P='book.hp.lead',KIND='hp-cast';
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
 if(Array.isArray(acts)&&acts.some(a=>(a.effects||[]).some(e=>e.type==='knowledge'&&e.actor&&e.actor!=='player'&&!(a.participants||[]).includes(e.actor))))bad.push('knowledge-holder');
 return bad;
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
 const arrive=school.find(c=>c.id===`${P}.arrive_school`);if(arrive&&endpoint)arrive.location=endpoint;
 native.simulation.commands=[...acts.map(c=>({...c,audience:['$actor']})),...school,...structuredClone(hpLeadHomeCommands),...structuredClone(hpLeadLessonCommands),...structuredClone(hpLeadTieCommands),...structuredClone(hpLeadMakingCommands),...structuredClone(hpLeadSpellCommands)]; // the school route and lessons survive the private cast
 return native;
}
