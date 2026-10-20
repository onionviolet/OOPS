// Native save envelope check for the Tingen probationer branch (LTS1, LTS3, AR3).
// The optional state.lotm owner stays in book_world_lotm_state.js; this reads only what the
// native save adds: where the body is and where the finite stock sits. Registered through the
// domain registry so save_files needs no new line (AR1, AR2).
import {registerDomain} from './domain_registry.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES} from './book_world_lotm_ids.js';
const assert=(ok,text)=>{if(!ok)throw Error(text);};
export const LOTM_PLACES=Object.freeze(Object.values(L));
const count=(save,owner,key)=>save.inventories?.person?.[owner]?.[key]?.count||0;
// An item an active job has reserved (a sample under observation) is held by that job, not lost.
const reserved=(state,key)=>(state.simulation?.jobs||[]).flatMap(j=>j.costs||[]).filter(c=>c.type==='item'&&c.actor==='player'&&c.key===key).reduce((n,c)=>n-c.amount,0);
export function validateLotmEnvelope(save){
 const state=save?.expansion||{},d=state.lotm,at=save?.['current location'],here=LOTM_PLACES.includes(at);
 if(!d){
  assert(!here,'This save needs its optional Tingen branch owner.');
  const held=save?.inventories?.person?.[I.supervisor]||{};
  assert(Object.keys(held).length===0,'Absent Tingen cannot retain supervisor stock.');
  return true;
 }
 assert(here&&at===state.simulation?.people?.player?.location,'The saved place and the Tingen branch body disagree.');
 const f=state.actors?.player?.facts||{},ingested=f['book.lotm.ingested']===true;
 const dose=count(save,'main_character',K.dose)+count(save,I.supervisor,K.dose)+reserved(state,K.dose);
 assert(dose===(ingested?0:1),'The prepared dose must be held exactly once until it is taken.');
 for(const name of LOTM_SAMPLES)assert(count(save,'main_character',K[name])+count(save,I.supervisor,K[name])+reserved(state,K[name])===1,'Each sample must have exactly one holder.');
 return true;
}
registerDomain({id:'lotm_envelope',validate:(_slice,envelope)=>validateLotmEnvelope(envelope)});
