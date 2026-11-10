import {extensionFact} from './structured_pack_extensions.js';
import {HP_LEAD_FLAMEL} from './book_world_hp_lead_flamel.js';
import {compileHpSchoolContinuation} from './book_world_hp_lead_mirror.js';
import {hpSchoolExcursionClockRequest} from './book_world_hp_lead_flight.js';

export const HP_LEAD_NORBERT='book.hp.lead.w10_norbert';
const id=HP_LEAD_NORBERT;
const school={
 id,previous:HP_LEAD_FLAMEL,finish:'compare',lead:'guard-hypothesis',
 finishReason:'Put the Flamel clues together first.',leadReason:'Read what the clues tell you about Fluffy first.',
 invalid:'Invalid match and dragon account for this school life.',
 enter:'Continue the school term from the Great Hall first.',order:'Finish the preceding part of the term first.',
 label:'Continue to the Hufflepuff match',
 description:'Play the next match under Snape and see where he goes afterward.',
 reason:'Finish following Flamel’s name and return to the Great Hall first.'
};
let loaded=null;
export const getHpLeadNorbert=()=>loaded?.pack??null;
export const hpLeadNorbertFacts=context=>({
 [extensionFact(id)]:!!context.structuredNative?.extensions?.some(e=>e.id===id&&e.revision===1)
});
export const isHpNorbertPassage=commandId=>loaded?.extension.commands.some(c=>c.id===commandId&&!!c.durationSinceKnowledge)??false;
export const hpNorbertPassageClockRequest=(state,record)=>hpSchoolExcursionClockRequest(state,record,loaded?.extension,isHpNorbertPassage);
export const compileHpLeadNorbert=(pack,base)=>compileHpSchoolContinuation(pack,base,school);

export async function registerHpLeadNorbert(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 if(!register.extension||!base.extensions?.some(e=>e.id===HP_LEAD_FLAMEL))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/norbert.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadNorbert(pack,base),base);
  loaded={pack,extension};
  return extension;
 }catch(error){
  console.warn('HP match and dragon continuation unavailable: '+error.message);
  return null;
 }
}
