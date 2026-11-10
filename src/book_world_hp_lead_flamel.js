import {extensionFact} from './structured_pack_extensions.js';
import {HP_LEAD_MIRROR,compileHpSchoolContinuation} from './book_world_hp_lead_mirror.js';
import {hpSchoolExcursionClockRequest} from './book_world_hp_lead_flight.js';

export const HP_LEAD_FLAMEL='book.hp.lead.w9_flamel';
const F=HP_LEAD_FLAMEL, admittedKey=extensionFact(F);
const flamel={
 id:F,previous:HP_LEAD_MIRROR,finish:'warning',lead:'mirror-lesson',
 finishReason:'Finish Christmas at Hogwarts first.',leadReason:'Hear Dumbledore’s advice at the mirror first.',
 invalid:'Invalid term account for this school life.',
 enter:'Continue the new term from the Great Hall first.',order:'Finish the preceding part of the school day first.',
 label:'Continue to the new term',
 description:'Go back to practice and the library after the holidays.',
 reason:'Finish Christmas and return to the Great Hall first.'
};
let loaded=null;
export const getHpLeadFlamel=()=>loaded?.pack??null;
export const hpLeadFlamelFacts=context=>({
 [admittedKey]:!!context.structuredNative?.extensions?.some(e=>e.id===F&&e.revision===1)
});
export const isHpFlamelPassage=id=>loaded?.extension.commands.some(c=>c.id===id&&!!c.durationSinceKnowledge)??false;
export const hpFlamelPassageClockRequest=(state,record)=>hpSchoolExcursionClockRequest(state,record,loaded?.extension,isHpFlamelPassage);
export const compileHpLeadFlamel=(pack,base)=>compileHpSchoolContinuation(pack,base,flamel);

export async function registerHpLeadFlamel(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 if(!register.extension||!base.extensions?.some(e=>e.id===HP_LEAD_MIRROR))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/flamel.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadFlamel(pack,base),base);
  loaded={pack,extension};
  return extension;
 }catch(error){
  console.warn('HP new term continuation unavailable: '+error.message);
  return null;
 }
}
