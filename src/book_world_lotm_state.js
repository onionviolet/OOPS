// Optional `state.lotm` owner for the early-Tingen probationer branch. Absent means
// inert: no Tingen presence, job, means or knowledge may exist without it. The
// only activation path is enrollLotmBranch (book_world_lotm_content.js).
import {LOTM_IDS as I,LOTM_SOURCE_HASH,LOTM_SOURCE_SNAPSHOT} from './book_world_lotm_ids.js';
import {lotmCommands} from './book_world_lotm_actions.js';
import {jsonData} from './simulation_contracts.js';
const assert=(ok,text)=>{if(!ok)throw Error(text);},natural=x=>Number.isSafeInteger(x)&&x>=0;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const prefix=k=>typeof k==='string'&&k.startsWith('book.lotm.');
export const LOTM_ENTRY_PROFILE='lotm.early_tingen.local_probationer@1';
export const lotmEnvelopeFields=['schema','definitionRevision','sourceSnapshot','sourceHash','initializedAt','entryProfile'];
export function createLotmState(clock){return {schema:1,definitionRevision:1,sourceSnapshot:LOTM_SOURCE_SNAPSHOT,sourceHash:LOTM_SOURCE_HASH,initializedAt:clock,entryProfile:LOTM_ENTRY_PROFILE};}
export function validateLotmState(state){
 const d=state.lotm,s=state.simulation,a=state.actors||{};
 if(d==null){
  assert(!state.worlds?.[I.world]&&!a[I.supervisor]&&!s?.people?.[I.supervisor]&&a.player?.worldId!==I.world,'Tingen presence needs its explicit optional owner.');
  assert(!(s?.jobs||[]).some(j=>prefix(j.commandId)),'Tingen work cannot outlive its owner.');
  for(const actor of Object.values(a))assert(!Object.keys(actor.resources||{}).some(prefix)&&!Object.keys(actor.sources||{}).some(prefix)&&!Object.keys(actor.facts||{}).some(prefix)&&!Object.keys(actor.completed||{}).some(prefix),'Tingen means require the matching optional owner.');
  assert(!s?.powers?.player?.[I.method]&&!s?.energies?.player?.[I.energy]&&!Object.keys(s?.knowledge?.player||{}).some(prefix)&&!Object.keys(s?.knowledge?.[I.supervisor]||{}).some(prefix),'Tingen knowledge and powers require the matching optional owner.');
  return true;
 }
 jsonData(d);
 assert(d&&typeof d==='object'&&!Array.isArray(d)&&Object.keys(d).length===lotmEnvelopeFields.length&&lotmEnvelopeFields.every(k=>Object.hasOwn(d,k)),'Unsupported Tingen branch fields.');
 assert(d.schema===1&&d.definitionRevision===1&&d.sourceSnapshot===LOTM_SOURCE_SNAPSHOT&&d.sourceHash===LOTM_SOURCE_HASH&&d.entryProfile===LOTM_ENTRY_PROFILE,'Unsupported Tingen source or entry profile. Preserve this save for its matching reader.');
 assert(natural(d.initializedAt)&&d.initializedAt<=state.clock,'Invalid Tingen activation time.');
 assert(s&&a.player?.worldId===I.world&&state.worlds?.[I.world]&&s.people?.player?.life!=null&&s.people.player.body?.id==='native.player.body'&&s.people.player.body.form==='human','The Tingen branch needs its one actual native player body.');
 for(const owner of [state.realmPrototype,state.featureDestination,state.nestedCampaign,state.bookWorldCampaign,state.motherOfLearning,state.proto23Village,state.mistglassRealm])assert(owner?.activeVisitId==null,'One controlled native body cannot be in the Tingen branch and another retained world.');
 const sup=s.people[I.supervisor];
 assert(sup&&a[I.supervisor]?.worldId===I.world&&sup.body?.id===`native.person.${I.supervisor}.body`&&sup.body.ownerId===I.supervisor&&sup.body.controllerId===I.supervisor,'The Tingen supervisor needs their own independent body.');
 for(const j of (s.jobs||[]).filter(j=>prefix(j.commandId))){
  const def=lotmCommands.find(c=>c.id===j.commandId);
  assert(def&&def.duration>0&&j.actorId===def.actorId&&j.revision===def.revision&&(j.cancellation||'none')===(def.cancellation||'none')&&same(j.costs,def.costs)&&same(j.effects,def.effects),'Tingen work differs from its exact admitted definition.');
 }
 const f=a.player.facts||{},has=k=>f[`book.lotm.${k}`]===true,src=a.player.sources?.[I.source],power=s.powers?.player?.[I.method];
 assert(!src||has('ingested')&&has('stabilized'),'A Seer source needs its recorded ingestion.');
 assert(!has('ingested')||!!src,'Recorded ingestion needs its source.');
 assert(!power?.owned||has('methodLearned')&&!!src,'A learned method needs the source and a completed lesson.');
 assert(!has('methodLearned')||power?.owned===true,'A completed lesson needs its method.');
 const e=s.energies?.player?.[I.energy];
 assert(!!e===!!src,'The spirituality pool exists exactly when the source does.');
 return true;
}
