// Native save envelope check for the Tingen probationer branch (LTS1, LTS3, AR3).
// The optional state.lotm owner stays in book_world_lotm_state.js; this reads only what the
// native save adds: where the body is and where the finite stock sits. Registered through the
// domain registry so save_files needs no new line (AR1, AR2).
import {castPlaces,castAvailable,lotmBeside,dormantCastPlace} from './book_world_lotm_cast_host.js';
import {registerDomain} from './domain_registry.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES} from './book_world_lotm_ids.js';
import {pathwayDoses} from './book_world_lotm_pathways.js';
import {LOTM_LOTS} from './book_world_lotm_broker.js';
import {pathwayRows} from './book_world_lotm_rows.js';
import {benchEnvelope} from './book_world_lotm_bench.js';
const assert=(ok,text)=>{if(!ok)throw Error(text);};
export const lotmPlaces=()=>[...Object.values(L),...castPlaces.map(p=>p.id)];
const count=(save,owner,key)=>save.inventories?.person?.[owner]?.[key]?.count||0;
// An item an active job has reserved (a sample under observation) is held by that job, not lost.
const reserved=(state,key)=>(state.simulation?.jobs||[]).flatMap(j=>j.costs||[]).filter(c=>c.type==='item'&&c.actor==='player'&&c.key===key).reduce((n,c)=>n-c.amount,0);
export function validateLotmEnvelope(save){
 const state=save?.expansion||{},d=state.lotm,at=save?.['current location'],here=lotmPlaces().includes(at)||!castAvailable&&lotmBeside(state)&&dormantCastPlace(at);
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
 const clown=count(save,'main_character',K.clownDose)+count(save,I.supervisor,K.clownDose)+reserved(state,K.clownDose);
 assert(clown===(f['book.lotm.assessed']===true&&(f['book.lotm.exam.required']!==true||f['book.lotm.examined']===true)&&f['book.lotm.promoted']!==true?1:0),'The released Clown dose must be held exactly once until it is drunk.');
 // Other pathways' doses are issued from stores on acceptance and release, so only the allocated and assessed windows hold one.
 for(const row of pathwayRows)pathwayDoses(row,{count:(owner,key)=>count(save,owner,key),reserved,state,f,assert});
 // Sealed grade-3 item (Q4): exactly one holder when the save has one, and held by the player only while the handling flag is set. Saves from before it hold none.
 const sealed=count(save,'main_character',K.sealed3)+count(save,I.supervisor,K.sealed3)+reserved(state,K.sealed3);
 assert(sealed<=1&&(count(save,'main_character',K.sealed3)===1)===(f['book.lotm.sealed.held']===true),'The sealed item must have one holder, and the player holds it exactly while it is signed out.');
 // Broker lots: each item has at most one holder (saves from before the broker hold none).
 for(const key of [K.frog,K.hairs,K.ink,...pathwayRows.filter(r=>r.market).flatMap(r=>[K[r.market.baseHold],K[r.market.nextHold]])])assert(count(save,'main_character',key)+count(save,I.broker,key)+reserved(state,key)<=1,'A broker lot item must have one holder.');
 // Open escrow promises a physical lot held by the broker, not a future grant.
 for(const lot of LOTM_LOTS)if(f[`book.lotm.lot.${lot.id}.paid`]===true&&f[`book.lotm.lot.${lot.id}.settled`]!==true&&f[`book.lotm.lot.${lot.id}.rejected`]!==true)
  assert(count(save,I.broker,lot.item)===1,'An open broker trade needs its item in broker custody.');
 // The single brewable frog: a brew in progress has consumed it, so held plus consumed never exceeds the one frog.
 assert(count(save,'main_character',K.frog)+count(save,I.broker,K.frog)+reserved(state,K.frog)+(f['book.lotm.cc.brew.started']===true?1:0)<=1,'A consumed frog cannot also be held.');
 benchEnvelope(save,{count,assert,reserved});
 for(const name of LOTM_SAMPLES)assert(count(save,'main_character',K[name])+count(save,I.supervisor,K[name])+reserved(state,K[name])===1,'Each sample must have exactly one holder.');
 return true;
}
// Place-id alias (reconciliation 2026-10-24): the university place was 'Tingen university quarter' in this lane's earlier candidate and is
// 'Tingen university area' in the primary lane's saves and now here. A LOTM save written under the old id is renamed at the import seam, before any
// validation reads it: only exact old-id strings and the exact keys that name a place are rewritten (the current location, the native location and
// availability maps, the lives' initial snapshots, the local-life last location, and each person's place). Prose, items, jobs and every other key are untouched;
// a save that holds both ids at one key is refused rather than merged. Non-LOTM saves are never touched.
export const LOTM_PLACE_ALIASES=Object.freeze({'Tingen university quarter':L.university});
export function migrateLotmPlaces(save){
 if(!save||typeof save!=='object'||!save.expansion?.lotm)return false;
 let changed=false;
 const swap=v=>Object.hasOwn(LOTM_PLACE_ALIASES,v)?LOTM_PLACE_ALIASES[v]:v;
 const rekey=(map,where)=>{if(!map||typeof map!=='object')return;for(const old of Object.keys(LOTM_PLACE_ALIASES)){if(!Object.hasOwn(map,old))continue;
  const to=LOTM_PLACE_ALIASES[old];assert(!Object.hasOwn(map,to),`${where} holds both ${old} and ${to}.`);
  const entries=Object.entries(map).map(([k,v])=>[k===old?to:k,v]);for(const k of Object.keys(map))delete map[k];for(const [k,v] of entries)map[k]=v;changed=true;}};
 const field=(o,k)=>{if(o&&typeof o==='object'&&typeof o[k]==='string'&&swap(o[k])!==o[k]){o[k]=swap(o[k]);changed=true;}};
 field(save,'current location');rekey(save.locations,'locations');rekey(save.availabilities?.location,'availabilities.location');field(save.absorb_local_life,'lastLocation');
 for(const life of Object.values(save.continuation?.lives||{})){rekey(life?.initial?.locations,'continuation locations');rekey(life?.initial?.availabilities?.location,'continuation availabilities');}
 for(const person of Object.values(save.expansion.simulation?.people||{}))field(person,'location');
 return changed;
}
registerDomain({id:'lotm_envelope',validate:(_slice,envelope)=>{migrateLotmPlaces(envelope);validateLotmEnvelope(envelope);}});
