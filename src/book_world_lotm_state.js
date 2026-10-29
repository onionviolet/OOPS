// Optional `state.lotm` owner for the early-Tingen probationer branch. Absent means
// inert: no Tingen presence, job, means or knowledge may exist without it. The
// only activation path is enrollLotmBranch (book_world_lotm_content.js).
import {castAbilityCommands,castBodyCommands,castExchangeCommands,castInferenceCommands,castMakingCommands,castDivinationCommands,castWalkCommands,castWalkDefinitionById,castObjectCommands,castTopicCommands,castJourneyCommands,dormantCastWalk,lotmCastLife} from './book_world_lotm_cast_host.js';
import {LOTM_IDS as I,LOTM_SOURCE_HASH,LOTM_SOURCE_SNAPSHOT,LOTM_DIGEST_ACTS,LOTM_SWITCH_NOTICE} from './book_world_lotm_ids.js';
import {PROFILE_IDS,LOTM_PROFILES} from './book_world_lotm_lives.js';
import {pathwayAssertions,flagOf} from './book_world_lotm_pathways.js';
import {causeAssertions,causeHeld} from './book_world_lotm_causes.js';
import {brewAssertions} from './book_world_lotm_brew.js';
import {brokerAssertions} from './book_world_lotm_broker.js';
import {benchAssertions} from './book_world_lotm_bench.js';
import {roleOutcomeAssertions} from './book_world_lotm_districts.js';
import {meritAssertions} from './book_world_lotm_merit.js';
import {pathwayRows} from './book_world_lotm_rows.js';
import {generatedRows} from './book_world_lotm_generated.js';
import {lotmCommands} from './book_world_lotm_actions.js';
import {jsonData} from './simulation_contracts.js';
import {packRevision} from './constraint_pack.js';
import {PROVENANCE_CODES} from './constraint_store.js';
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
import {BE_PROFILE_ID} from './seat_profiles.js';
import {validEntryRecord} from './book_world_lotm_entry.js';
const assert=(ok,text)=>{if(!ok)throw Error(text);},natural=x=>Number.isSafeInteger(x)&&x>=0;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const prefix=k=>typeof k==='string'&&k.startsWith('book.lotm.');
export const LOTM_ENTRY_PROFILE='lotm.early_tingen.local_probationer@1';
export const lotmEnvelopeFields=['schema','definitionRevision','sourceSnapshot','sourceHash','initializedAt','entryProfile'];
export function createLotmState(clock,entryProfile=LOTM_ENTRY_PROFILE){return {schema:1,definitionRevision:1,sourceSnapshot:LOTM_SOURCE_SNAPSHOT,sourceHash:LOTM_SOURCE_HASH,initializedAt:clock,entryProfile,...(entryProfile===BE_PROFILE_ID?{runMode:'canon',packRevision:packRevision(getPrivateLotmCast())}:{})};}
export function validateLotmState(state){
 const d=state.lotm,s=state.simulation,a=state.actors||{};
 if(d==null){
  assert(!state.worlds?.[I.world]&&!a[I.supervisor]&&!s?.people?.[I.supervisor]&&a.player?.worldId!==I.world,'Tingen presence needs its explicit optional owner.');
  assert(!(s?.jobs||[]).some(j=>prefix(j.commandId)||[...castBodyCommands,...castJourneyCommands,...castDivinationCommands,...castMakingCommands,...castInferenceCommands,...castExchangeCommands,...castAbilityCommands].some(c=>c.id===j.commandId)),'Tingen work cannot outlive its owner.');
  for(const actor of Object.values(a))assert(!Object.keys(actor.resources||{}).some(prefix)&&!Object.keys(actor.sources||{}).some(prefix)&&!Object.keys(actor.facts||{}).some(prefix)&&!Object.keys(actor.completed||{}).some(prefix),'Tingen means require the matching optional owner.');
  assert(!s?.powers?.player?.[I.method]&&!s?.energies?.player?.[I.energy]&&!Object.keys(s?.knowledge?.player||{}).some(prefix)&&!Object.keys(s?.knowledge?.[I.supervisor]||{}).some(prefix),'Tingen knowledge and powers require the matching optional owner.');
  return true;
 }
 jsonData(d);
 // `entry` (how this life got in, WER2-WER9) is optional: saves enrolled before it hold none and stay valid.
 assert(d&&typeof d==='object'&&!Array.isArray(d)&&lotmEnvelopeFields.every(k=>Object.hasOwn(d,k))&&Object.keys(d).every(k=>lotmEnvelopeFields.includes(k)||k==='entry'||k==='runMode'||k==='packRevision'||k==='castProvenance'),'Unsupported Tingen branch fields.');
 // Additive compatibility: missing revision/codes denotes an older save. Keep
 // its deltas and source revision; inspection reports conflicts without rewriting.
 assert(!Object.hasOwn(d,'packRevision')||d.entryProfile===BE_PROFILE_ID&&typeof d.packRevision==='string'&&d.packRevision.length>0&&d.packRevision.length<=160,'Invalid cast pack revision.');
 assert(!Object.hasOwn(d,'castProvenance')||d.castProvenance&&typeof d.castProvenance==='object'&&!Array.isArray(d.castProvenance)&&Object.entries(d.castProvenance).every(([key,code])=>key.length>0&&PROVENANCE_CODES.includes(code)),'Invalid cast provenance.');
 assert(!Object.hasOwn(d,'entry')||validEntryRecord(d.entry),'Unsupported Tingen entry record.');
 assert(d.schema===1&&d.definitionRevision===1&&d.sourceSnapshot===LOTM_SOURCE_SNAPSHOT&&d.sourceHash===LOTM_SOURCE_HASH&&PROFILE_IDS.includes(d.entryProfile),'Unsupported Tingen source or entry profile. Preserve this save for its matching reader.');
 assert(d.entryProfile===BE_PROFILE_ID?d.runMode==='canon':!Object.hasOwn(d,'runMode'),'Unsupported life run mode. Preserve this save for its matching reader.');
 assert(d.entryProfile!==BE_PROFILE_ID||!Object.hasOwn(d,'entry'),'A lead life has no crossing entry. Preserve this save for its matching reader.');
 assert(natural(d.initializedAt)&&d.initializedAt<=state.clock,'Invalid Tingen activation time.');
 assert(s&&a.player?.worldId===I.world&&state.worlds?.[I.world]&&s.people?.player?.life!=null&&s.people.player.body?.id==='native.player.body'&&s.people.player.body.form==='human','The Tingen branch needs its one actual native player body.');
 for(const owner of [state.realmPrototype,state.featureDestination,state.nestedCampaign,state.bookWorldCampaign,state.motherOfLearning,state.proto23Village,state.mistglassRealm])assert(owner?.activeVisitId==null,'One controlled native body cannot be in the Tingen branch and another retained world.');
 const sup=s.people[I.supervisor];
 if(d.entryProfile!==BE_PROFILE_ID)assert(sup&&a[I.supervisor]?.worldId===I.world&&sup.body?.id===`native.person.${I.supervisor}.body`&&sup.body.ownerId===I.supervisor&&sup.body.controllerId===I.supervisor,'The Tingen supervisor needs their own independent body.');
 for(const j of (s.jobs||[]).filter(j=>prefix(j.commandId)||[...castBodyCommands,...castJourneyCommands,...castDivinationCommands,...castMakingCommands,...castInferenceCommands,...castExchangeCommands,...castAbilityCommands].some(c=>c.id===j.commandId))){
  if(lotmCastLife(state)&&dormantCastWalk(j))continue;
  const def=castWalkDefinitionById(j.commandId)||[...castBodyCommands,...lotmCommands,...castWalkCommands,...castObjectCommands,...castTopicCommands,...castJourneyCommands,...castDivinationCommands,...castMakingCommands,...castInferenceCommands,...castExchangeCommands,...castAbilityCommands].find(c=>c.id===j.commandId);
  assert(def&&def.duration>0&&j.actorId===def.actorId&&j.revision===def.revision&&(j.cancellation||'none')===(def.cancellation||'none')&&same(j.costs,def.costs)&&same(j.effects,def.effects),'Tingen work differs from its exact admitted definition.');
  if(def.bodyCare&&def.duration>0)assert(same(j.completionSupport,{schema:1,requires:def.completionRequires,coLocated:true,location:j.context?.facts?.location||s.people[j.actorId].location,failure:'refund'}),'Body support differs from its exact admitted definition.');
  if(def.castAbility)assert(same(j.completionSupport,{schema:1,requires:def.completionRequires,coLocated:def.completionCoLocated,location:j.context?.facts?.location||s.people[j.actorId].location,failure:'refund'}),'Encounter support differs from its exact admitted definition.');
  if(def.inference)assert(same(j.completionSupport,{schema:1,requires:def.completionRequires,coLocated:def.completionCoLocated,location:j.context?.facts?.location||s.people[j.actorId].location,failure:'refund'}),'Thought support differs from its exact admitted definition.');
  if(def.divination)assert(same(j.completionSupport,{schema:1,requires:def.completionRequires,coLocated:def.completionCoLocated,location:j.context?.facts?.location||s.people[j.actorId].location,failure:'refund'}),'Rite support differs from its exact admitted definition.');
  if(def.exchange)assert(same(j.completionSupport,{schema:1,requires:def.completionRequires,coLocated:true,location:def.location,failure:'refund'}),'Exchange support differs from its exact admitted definition.');
  if(def.making)assert(same(j.completionSupport,{schema:1,requires:def.completionRequires,coLocated:true,location:def.location,failure:'refund'}),'Making support differs from its exact admitted definition.');
  if(def.journey)assert(same(j.completionSupport,{schema:1,requires:def.completionRequires,coLocated:true,location:def.location,failure:'refund'}),'Journey support differs from its exact admitted definition.');
 }
 const f=a.player.facts||{},has=k=>f[`book.lotm.${k}`]===true,src=a.player.sources?.[I.source],power=s.powers?.player?.[I.method];
 assert(!src||has('ingested')&&has('stabilized'),'A Seer source needs its recorded ingestion.');
 assert(!has('ingested')||!!src,'Recorded ingestion needs its source.');
 assert(!power?.owned||has('methodLearned')&&!!src,'A learned method needs the source and a completed lesson.');
 assert(!has('methodLearned')||power?.owned===true,'A completed lesson needs its method.');
 // Digestion and promotion (LTS11-LTS14) live in player facts and one resource, so state.lotm keeps schema 1.
 const acting=a.player.resources?.['book.lotm.acting'],clown=a.player.sources?.[I.clown];
 assert(acting===undefined||natural(acting)&&acting<=LOTM_DIGEST_ACTS&&has('methodLearned'),'Acting in role needs the learned method and stays within the digestion count.');
 assert(!has('refusedHigh')||has('methodLearned'),'A refused reading needs the learned method.');
 assert(!has('assessed')||acting===LOTM_DIGEST_ACTS,'An assessment needs a digested potion.');
 assert(!has('exam.required')||has('assessed'),'A new examination needs its pre-screen.');
 assert(!has('examined')||has('assessed'),'An examination needs its pre-screen.');
 assert(!has('promoted')||has('assessed')&&(!has('exam.required')||has('examined'))&&!!src,'A promotion needs the assessment and the Seer source.');
 assert(!!clown===has('promoted'),'The Clown source exists exactly when the promotion is recorded.');
 // Other pathways (Q1 onward) are rows: each has its own flags and acting resource, additive and optional. One pathway per life.
 const chosen=row=>has(flagOf(row,'allocated'))||has(flagOf(row,'ingested'))||!!a.player.sources?.[row.base];
 const seerChosen=has('allocated')||has('ingested')||!!src;
 // Switching is a stated cause, so a second pathway is allowed only with its cause recorded (B3); without it the save is refused.
 assert(pathwayRows.filter(chosen).length+generatedRows.filter(chosen).length+(seerChosen?1:0)<=1||causeHeld(has,'switching'),LOTM_SWITCH_NOTICE+' This save holds both pathways.');
 for(const row of [...pathwayRows,...generatedRows])pathwayAssertions(row,{a,has,assert,natural});
 // A recorded switching cause (a drink taken on top of a brew in progress) is the one stated way another pathway can stand beside a brew.
 brewAssertions({has,assert,others:causeHeld(has,'switching')?0:pathwayRows.filter(r=>r.key!=='cc'&&chosen(r)).length+generatedRows.filter(chosen).length+(seerChosen?1:0)});
 // A life holds only its own church's pathways unless a stated cause (switching) is recorded.
 const prof=Object.values(LOTM_PROFILES).find(x=>x.id===d.entryProfile);
 assert(causeHeld(has,'switching')||(!seerChosen&&!pathwayRows.some(r=>r.church==='evernight'&&chosen(r))||prof.home==='evernight')&&(!pathwayRows.some(r=>r.church==='machinery'&&chosen(r))||prof.home==='machinery'),'A pathway belongs to its own church\'s life.');
 // Lives (Q3): a civil clerk is on a post, not the Beyonder track, and the contract flag belongs to that profile only.
 const civil=d.entryProfile===LOTM_PROFILES.civil.id;
 assert(!civil||!(seerChosen||pathwayRows.some(chosen)||generatedRows.some(chosen)||has('declined')),'A civil clerk holds no Beyonder track, allocation or source.');
 assert(!has('contract.signed')||civil,'A civil staff contract belongs to the civil clerk profile.');
 const paid=a.player.resources?.['book.lotm.weeks_paid'];
 assert(paid===undefined||natural(paid)&&(civil&&has('contract.signed')||paid===0),'Weeks of pay need the signed contract.');
 brokerAssertions({a,has,assert});
 benchAssertions(state,{a,has,assert,natural});
 meritAssertions(state,{a,assert,natural});
 roleOutcomeAssertions(state,{assert,natural});
 causeAssertions({a,has,assert,natural});
 const e=s.energies?.player?.[I.energy];
 assert(!!e===!!src,'The spirituality pool exists exactly when the source does.');
 return true;
}
