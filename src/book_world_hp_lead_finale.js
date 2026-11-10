import {extensionFact} from './structured_pack_extensions.js';
import {HP_LEAD_NORBERT} from './book_world_hp_lead_norbert.js';
import {compileHpSchoolContinuation} from './book_world_hp_lead_mirror.js';
import {hpSchoolExcursionClockRequest} from './book_world_hp_lead_flight.js';

export const HP_LEAD_FINALE='book.hp.lead.w11_finale';
export const HP_LEAD_FAREWELL='book.hp.lead.w11_farewell';
const id=HP_LEAD_FINALE;
const school={
 id,previous:HP_LEAD_NORBERT,finish:'caught',lead:'caught.seen',
 finishReason:'Finish the walk back from the tower first.',leadReason:'See who is waiting at the foot of the stairs first.',
 invalid:'Invalid end of term account for this school life.',
 enter:'Continue the school term from the Great Hall first.',order:'Finish the preceding part of the term first.',
 label:'Face the school’s response',
 description:'Go with Filch after the tower and face what follows.',
 reason:'Finish the trip to the tallest tower first.'
};
let loaded=null;
let farewell=null;
export const getHpLeadFinale=()=>loaded?.pack??null;
export const getHpLeadFarewell=()=>farewell;
export const hpLeadFinaleFacts=context=>Object.fromEntries([id,HP_LEAD_FAREWELL].map(key=>[
 extensionFact(key),!!context.structuredNative?.extensions?.some(e=>e.id===key&&e.revision===1)
]));
export const isHpFinalePassage=commandId=>loaded?.extension.commands.some(c=>c.id===commandId&&!!c.durationSinceKnowledge)??false;
export const hpFinalePassageClockRequest=(state,record)=>hpSchoolExcursionClockRequest(state,record,loaded?.extension,isHpFinalePassage);
export const compileHpLeadFinale=(pack,base)=>compileHpSchoolContinuation(pack,base,school);
export const compileHpLeadFarewell=(pack,base)=>compileHpSchoolContinuation(pack,base,{
 id:HP_LEAD_FAREWELL,previous:id,finish:'kings-cross',lead:'kings-cross.seen',
 place:'book.hp.lead.train',placeReason:'Reach King’s Cross first.',
 finishReason:'Take the train back to King’s Cross first.',leadReason:'Go through the station barrier first.',
 invalid:'Invalid King’s Cross account for this school life.',
 enter:'Pick up the farewell at King’s Cross first.',order:'Finish the preceding part of the farewell first.',
 label:'Stay for one last word',
 description:'Uncle Vernon is waiting. Hang back with Ron and Hermione before you go.',
 reason:'Arrive at King’s Cross and pass through the barrier first.'
});

export async function registerHpLeadFinale(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 farewell=null;
 if(!register.extension||!base.extensions?.some(e=>e.id===HP_LEAD_NORBERT))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/finale.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadFinale(pack,base),base);
  loaded={pack,extension};
  try{
   const last=await fetchFile('private_packs/hp-cast/farewell.json');
   if(last.ok){
    const closing=await last.json();
    await register.extension(compileHpLeadFarewell(closing,base),base);
    farewell=closing;
   }
  }catch(error){
   console.warn('HP King’s Cross farewell unavailable: '+error.message);
  }
  return extension;
 }catch(error){
  console.warn('HP end of term continuation unavailable: '+error.message);
  return null;
 }
}
