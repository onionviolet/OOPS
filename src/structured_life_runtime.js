// Adapted from MIT Air snapshot:
// /Users/weiwei/MacTransferArchive/yair-private-work-20261013-extract/.codex/worktrees/wider-gameplay/yet-another-idle-rpg/src/structured_life_runtime.js
// Copyright (c) 2021 Miktaew; see LICENSE. Scoped reversible proposal.
import {check} from './basics.js';
import {validateStructuredRecord} from './structured_pack_state.js';
export function structuredLifeEnded(state,record){return !!record&&state?.actors?.player?.worldId===record.worldId&&state.simulation?.people?.player?.life==='dead';}
function binding(state,r){
 validateStructuredRecord(r);const p=state?.simulation?.people?.player;
 check(r&&structuredLifeEnded(state,r)&&p.inventory==='native'&&state.worlds?.[r.worldId]?.facts?.[`${r.packId}.instance`]===r.instanceId&&state.simulation.claims?.[`${r.packId}.origin`]?.cause===r.instanceId,'Ended life needs its current instance.');
 if(r.schema===2)check(p.body?.id===r.bodyId&&p.body.ownerId==='player'&&p.body.controllerId==='player'&&(r.lifeId==null||p.lifeId===r.lifeId&&p.body.instanceId===r.bodyInstanceId),'Ended life needs its actual body.');
 check(p.lifeCause&&typeof p.lifeCause.reason==='string'&&typeof p.lifeCause.cause==='string'&&Number.isSafeInteger(p.lifeCause.at)&&p.lifeCause.at>=0&&p.lifeCause.at<=state.clock,'Ended life requires a saved cause.');return p;
}
export function reconcileStructuredLifePlan(plan,record,{deaths=0}={}){
 if(!structuredLifeEnded(plan.state,record))return;
 const p=binding(plan.state,record),v=plan.vitals?.player;
 check(plan.state.clock===p.lifeCause.at,'Ended-life clock must stop at its saved cause.');
 check(v&&Number.isFinite(v.max_health)&&v.max_health>0&&Number.isFinite(v.max_stamina)&&v.max_stamina>=0&&Number.isFinite(v.stamina),'Ended life needs actual native vitals.');
 if(!p.structuredDeath){
  check(Number.isSafeInteger(deaths)&&deaths>=0,'Invalid native death statistic.');
  p.structuredDeath={schema:1,instanceId:record.instanceId,at:p.lifeCause.at,maxHealth:v.max_health};
  plan.nativePatch={...plan.nativePatch,total_deaths:deaths+1};
  plan.defeat={outcome:'killed',cause:{kind:'harm',place:typeof record.locationId==='string'?record.locationId:null,by:[]}};
 }
 check(p.structuredDeath.schema===1&&p.structuredDeath.instanceId===record.instanceId&&p.structuredDeath.at===p.lifeCause.at&&p.structuredDeath.maxHealth===v.max_health,'Unsupported ended-life proof.');
 v.health=0;plan.native={...plan.native,hpToFull:v.max_health,staminaToFull:Math.max(0,v.max_stamina-v.stamina)};
 if(plan.state.simulation.programs?.player)plan.state.simulation.programs.player.status='paused';
}
export function validateStructuredDeathEnvelope(save){
 const r=save.content_packs?.structured,p=save.expansion?.simulation?.people?.player;
 if(p?.structuredDeath==null)return; // Old live/absent states unchanged; old deaths are export-only.
 check(structuredLifeEnded(save.expansion,r),'Ended-life proof cannot revive its body.');binding(save.expansion,r);
 const proof=p.structuredDeath;
 check(proof.schema===1&&Object.keys(proof).every(k=>['schema','instanceId','at','maxHealth'].includes(k))&&proof.instanceId===r.instanceId&&proof.at===p.lifeCause.at&&save.expansion.clock===proof.at&&Number.isFinite(proof.maxHealth)&&proof.maxHealth>0&&save.character.hp_to_full===proof.maxHealth,'Unsupported ended-life snapshot.');
}
export function structuredLifeView(state,record){return structuredLifeEnded(state,record)?{ended:true,label:'This life has ended',description:'Time and actions have stopped. Export this life, or archive it and choose an independent new character. Other continuation choices keep their own rules.'}:null;}
const canonical=bytes=>{const s=JSON.parse(bytes);delete s.saved_at;return JSON.stringify(s);};
export function archiveStructuredLife({storage,key,serialized,validateEnvelope,writeArchive}){
 check(typeof serialized==='string'&&key,'An ended-life save is required.');const save=JSON.parse(serialized);validateStructuredDeathEnvelope(save);
 check(save.expansion?.simulation?.people?.player?.structuredDeath,'Older ended lives can be exported; automatic archive transition requires a supported death proof.');validateEnvelope?.(save);
 check(storage.getItem(key)===serialized,'The active save changed; preserve its current bytes before archiving.');
 const archiveKey=`${key}:ended-life:${save.content_packs.structured.instanceId}`,old=storage.getItem(archiveKey);
 check(old===null||canonical(old)===canonical(serialized),'This instance has a conflicting archive.');
 if(old===null)(writeArchive||((k,v)=>storage.setItem(k,v)))(archiveKey,serialized);
 check(storage.getItem(archiveKey)!==null&&canonical(storage.getItem(archiveKey))===canonical(serialized),'Archive publication failed.');
 return {archiveKey,serialized:storage.getItem(archiveKey),instanceId:save.content_packs.structured.instanceId};
}
// Destination preflight happens while the entire ended life remains active.
// Archive is immutable; the active slot has one atomic supported publication.
export async function publishIndependentStructuredLife({storage,key,serialized,nextSerialized,validateEnvelope,preflight,publish}){
 const archived=archiveStructuredLife({storage,key,serialized,validateEnvelope});const next=JSON.parse(nextSerialized);
 validateEnvelope?.(next);check(!next.content_packs?.structured&&!next.content_packs?.pendingStructured&&next.expansion?.actors?.player?.worldId==='base.frontier'&&next.expansion.simulation?.people?.player?.life!=='dead','Independent destination must be a fresh supported character.');
 await preflight?.(nextSerialized);
 check(storage.getItem(key)===serialized,'The active save changed during destination validation.');
 try{(publish||((bytes)=>storage.setItem(key,bytes)))(nextSerialized);check(storage.getItem(key)!==serialized,'Destination was not published.');}
 catch(error){
  if(storage.getItem(key)!==serialized){try{storage.setItem(key,serialized);}catch(rollback){throw new AggregateError([error,rollback],'Destination publication and rollback failed; the immutable ended-life archive remains available.');}}
  throw error;
 }
 return archived;
}
export function listStructuredLifeArchives({storage,key}){
 const prefix=`${key}:ended-life:`,rows=[];for(let i=0;i<storage.length;i++){const archiveKey=storage.key(i);if(!archiveKey?.startsWith(prefix))continue;
  try{const serialized=storage.getItem(archiveKey),save=JSON.parse(serialized);validateStructuredDeathEnvelope(save);if(!save.expansion?.simulation?.people?.player?.structuredDeath||archiveKey!==prefix+save.content_packs.structured.instanceId)continue;rows.push({archiveKey,serialized,label:'Archived independent life'});}catch{/* Malformed and legacy archives remain untouched. */}}
 return rows.sort((a,b)=>a.archiveKey.localeCompare(b.archiveKey));
}
