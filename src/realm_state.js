import {FOLDED_GLASSHOUSE_DEFINITION as baseDefinition, FOLDED_GLASSHOUSE_IDS as ids, createFoldedGlasshouseContent} from './pocket_realm_content.js';
import {validateWorldRecords,planWorldClock,createWorldBindings,worldInstanceFacts} from './world_instances.js';
import {POCKET_DOOR_BINDING} from './pocket_realm_rules.js';
import {validateRealmConnection,validateRealmConnectionBinding} from './realm_connections.js';
import {createPocketRealmScenes,pocketRealmSceneFacts} from './pocket_realm_scenes.js';
import {validateRealmJson,sameRealmEndpoint} from './realm_boundary_rules.js';
import {createRealmClockLedger,validateRealmClockLedger,planRealmActivityClock,planRealmClockLeaseOpen,planRealmClockLeaseClose,realmClockActivation} from './realm_clock_leases.js';
import {pocketObservationSupport,nextPocketObservationBoundary,expirePocketObservation,validatePocketObservation} from './pocket_observation.js';
const content=createFoldedGlasshouseContent();
export const GLASSHOUSE_SCENES=createPocketRealmScenes();
export const GLASSHOUSE_DEFINITION={...baseDefinition,revision:2,initialFacts:{...baseDefinition.initialFacts,...GLASSHOUSE_SCENES.definitionPatch.initialFacts}};
const definition=GLASSHOUSE_DEFINITION;
const bindingManifest=createWorldBindings(definition,{instanceId:ids.instanceId,worldFactPrefix:content.bindings.worldFactPrefix,siteBindings:Object.fromEntries(Object.entries(content.bindings.sites).map(([registered,local])=>[local,registered])),claimBindings:Object.fromEntries(Object.entries(content.bindings.uniqueClaims).map(([registered,local])=>[local,registered]))});
const factKeys=bindingManifest.factKeys;
const assert=(ok,message)=>{if(!ok)throw Error(message);};
export const GLASSHOUSE_CONTENT=content;
export function activeRealmVisit(state){const r=state.realmPrototype;return r?.visits.find(v=>v.id===r.activeVisitId&&v.status==='active')||null;}
export function validateRealmState(state){
 const r=state.realmPrototype;if(r==null)return;
 validateRealmJson(r);assert(r.schema===2&&r.instances&&Array.isArray(r.visits)&&r.visits.length<=64&&Array.isArray(r.receipts)&&r.receipts.length<=32,'Unsupported pocket realm record.');
 assert(Object.keys(state.worlds[ids.worldId]?.facts||{}).length===0,'Pocket facts need their canonical instance owner.');
 assert(!state.simulation?.claims[`${content.bindings.worldFactPrefix}.template_export`],'The pocket gift uses its instance claim, not a second simulation claim.');
 assert(Object.keys(r.instances).length===1&&r.instances[ids.instanceId],'Unsupported pocket instance binding.');
 validateWorldRecords({definitions:[definition],instances:Object.values(r.instances),visits:r.visits},{actorIds:Object.keys(state.actors),externalInstances:[{id:'frontier.main',worldId:'base.frontier',parentInstanceId:null}]});
 const i=r.instances[ids.instanceId];assert(i.clock.observedAt<=state.clock,'Pocket clock exceeds played time.');
 validatePocketObservation(state);
 if(r.activityClock!=null){validateRealmClockLedger(r.activityClock,i,definition);assert(r.activityClock.sequence<=state.sequence,'Pocket activity clock sequence exceeds its host.');}
 assert(r.offeredElapsed===null||Number.isSafeInteger(r.offeredElapsed)&&r.offeredElapsed>=0&&r.offeredElapsed<=i.clock.elapsed,'Invalid local offer clock.');
 assert(r.connection,'Missing authored pocket doorway.');validateRealmConnectionBinding(r.connection,POCKET_DOOR_BINDING);
 assert((r.connection.openedAt===null||r.connection.openedAt<=state.clock)&&(!r.connection.closure||r.connection.closure.at<=state.clock),'Pocket route receipts exceed the joined played clock.');
 const active=activeRealmVisit(state);assert((r.activeVisitId===null&&!r.visits.some(v=>v.status==='active'))||(active&&active.actorId==='player'),'Invalid active pocket visit.');
 // A retained, inactive pocket owns no foreign player location. The current
 // world's registry and native binding validate that location independently.
 assert((state.actors.player.worldId===ids.worldId)===!!active,'Player world and pocket visit disagree.');
 if(active)assert(r.connection.open,'The conventional pocket visit needs its open return doorway.');
 if(active)assert(state.simulation?.people.player.location==='Folded Glasshouse','Player body is not at its visited pocket site.');
}
export function validateRealmEnvelope(save){
 const active=activeRealmVisit(save.expansion||{});
 assert((save['current location']==='Folded Glasshouse')===!!active,'The saved doorway and native location disagree. This pocket save requires the matching build.');
 const state=save.expansion,r=state?.realmPrototype;
 const views=Object.values(r?.observation?.state?.leases||{}).filter(lease=>lease.status==='active');
 const clocks=(r?.activityClock?.leases||[]).filter(lease=>lease.status==='active');
 assert(views.length<=1&&clocks.length===views.length,'The saved view and activity clock need the same active contact. This observation save requires the matching build.');
 const view=views[0],clock=clocks[0];
 if(view){
  assert(save['current location']==='Village'&&state.clock<view.expiresAt,'An active viewing slit requires the live saved native body at Village. Close the slit before travel.');
  const b=pocketObservationSupport(state).clockBinding;
  assert(b&&clock.id===view.id&&clock.expiresAt===view.expiresAt&&['policyId','causeId','issuerId','ownerId','sourceId','anchorId','contactId'].every(k=>clock[k]===b[k])&&sameRealmEndpoint(clock.endpoint,b.endpoint),'The saved view and activity authorization disagree. This observation save requires the matching build.');
 }
}
export function realmFacts(state,actorId='player'){
 const r=state.realmPrototype,i=r?.instances[ids.instanceId];if(!i)return {};
 const present=!!activeRealmVisit(state),local=state.actors[actorId]?.worldId===ids.worldId;
 if(!local)return {};
 return {...worldInstanceFacts(i,definition,bindingManifest),...pocketRealmSceneFacts(GLASSHOUSE_SCENES,state,actorId),
  'worldVisit.instanceId':ids.instanceId,'worldVisit.returning':present&&r.visits.some(v=>v.status==='ended'),
  'glasshouse.benchIdle':Object.keys(state.simulation?.sites[`${content.bindings.worldFactPrefix}.bench`]?.reservations||{}).length===0,
  'glasshouse.offerExpired':r.offeredElapsed!==null&&i.clock.elapsed-r.offeredElapsed>=8,
  [`person.${content.caretakerId}.willing`]:!!state.actors[content.caretakerId]?.facts['glasshouse.willing']};
}
// Pocket facts live in the instance, never in a duplicate world-domain mirror.
export function applyRealmWorldEffect(state,e){
 if(e.worldId!==ids.worldId)return false;
 const i=state.realmPrototype?.instances[ids.instanceId],key=factKeys[e.key];assert(i&&key,'Missing actual pocket fact owner.');
 assert(typeof e.value===typeof definition.initialFacts[key],'Unsupported pocket fact type.');
 i.facts[key]=e.value;i.revision++;
 if(key==='bench.open')i.sites['glasshouse.bench'].open=e.value;
 return true;
}
export function applyRealmSiteEffect(state,siteId){
 const key=content.bindings.sites[siteId],i=state.realmPrototype?.instances[ids.instanceId];if(i&&key){i.sites[key].open=true;i.revision++;}
}
const OBSERVATION_CLOCK_POLICY='glasshouse.live_observation';
function activitySupport(state,from,through){
 const r=state.realmPrototype,support=pocketObservationSupport(state,from),binding=support.clockBinding;
 if(!support.active||!binding||!r?.activityClock)return [];
 const lease=r.activityClock.leases.find(l=>l.id===binding.leaseId&&l.status==='active');
 if(!lease)return [];
 return [{leaseId:lease.id,leaseRevision:lease.revision,endpoint:binding.endpoint,
  policyId:binding.policyId,causeId:binding.causeId,issuerId:binding.issuerId,ownerId:binding.ownerId,
  sourceId:binding.sourceId,anchorId:binding.anchorId,contactId:binding.contactId,from,through,
  sourceActive:true,anchorActive:true,contactActive:true,clockAuthorized:true}];
}
function activityContext(state,supports=[],pendingBoundaryAt=null){
 return {sequence:state.sequence,policyIds:[OBSERVATION_CLOCK_POLICY],supports,pendingBoundaryAt};
}
function activityRequest(state){const r=state.realmPrototype,i=r.instances[ids.instanceId];return {
 expectedRevision:i.revision,expectedLeaseRevision:r.activityClock.revision,expectedSequence:state.sequence,playedAt:state.clock};}
// Caller supplies the next causal boundary before moving the joined clock. No
// scheduler import here: this hook also serves same-minute native publication.
export function syncRealmClock(state,pendingBoundaryAt=null){
 const r=state.realmPrototype;if(!r)return;
 const i=r.instances[ids.instanceId];if(i.clock.observedAt===state.clock)return;
 const p=r.activityClock?planRealmActivityClock(i,r.activityClock,{...activityRequest(state),visits:r.visits},definition,
  activityContext(state,activitySupport(state,i.clock.observedAt,state.clock),pendingBoundaryAt)):
  planWorldClock(i,{playedAt:state.clock,visits:r.visits,expectedRevision:i.revision},definition);
 assert(p.allowed,p.reasons.join(' '));r.instances[ids.instanceId]=p.nextInstance;if(p.nextLeases)r.activityClock=p.nextLeases;
}
// Called only on the already-paid staged observation activation. Reading old
// saves never creates this optional record or invents supported history.
export function openRealmObservationClock(state){
 const r=state.realmPrototype;assert(r,'Observation activity needs its real pocket instance.');syncRealmClock(state);
 const support=pocketObservationSupport(state),b=support.clockBinding;assert(support.active&&b,'Opening needs actual current supported observation.');
 const i=r.instances[ids.instanceId];if(!r.activityClock)r.activityClock=createRealmClockLedger(i,definition,state.sequence);
 const proof={leaseId:b.leaseId,leaseRevision:1,endpoint:b.endpoint,policyId:b.policyId,causeId:b.causeId,issuerId:b.issuerId,
  ownerId:b.ownerId,sourceId:b.sourceId,anchorId:b.anchorId,contactId:b.contactId,from:state.clock,through:state.clock,
  sourceActive:true,anchorActive:true,contactActive:true,clockAuthorized:true};
 const lease={id:b.leaseId,endpoint:b.endpoint,purpose:'observation',policyId:b.policyId,causeId:b.causeId,issuerId:b.issuerId,
  ownerId:b.ownerId,sourceId:b.sourceId,anchorId:b.anchorId,contactId:b.contactId,expiresAt:b.expiresAt};
 const p=planRealmClockLeaseOpen(i,r.activityClock,{...activityRequest(state),lease},definition,activityContext(state,[proof]));
 assert(p.allowed,p.reasons.join(' '));r.instances[ids.instanceId]=p.nextInstance;r.activityClock=p.nextLeases;return state;
}
// Reconcile while contact still exists, then stage closure before a shutter or
// source/anchor mutation. Exact-expiry reconciliation may already have closed it.
export function closeRealmObservationClock(state){
 const r=state.realmPrototype;if(!r?.activityClock)return state;syncRealmClock(state);
 const support=pocketObservationSupport(state),b=support.clockBinding;
 const candidates=r.activityClock.leases.filter(l=>l.status==='active'&&l.purpose==='observation'&&l.policyId===OBSERVATION_CLOCK_POLICY);
 assert(candidates.length<=1,'Ambiguous active native observation clock leases.');
 const lease=candidates[0];if(!lease)return state;
 if(b)assert(lease.id===b.leaseId&&lease.contactId===b.contactId,'Observation closure needs its current exact contact.');
 const i=r.instances[ids.instanceId],p=planRealmClockLeaseClose(i,r.activityClock,{...activityRequest(state),leaseId:lease.id,leaseRevision:lease.revision},definition,activityContext(state));
 assert(p.allowed,p.reasons.join(' '));r.instances[ids.instanceId]=p.nextInstance;r.activityClock=p.nextLeases;return state;
}
export function nextRealmActivityBoundary(state){
 const r=state.realmPrototype,observation=nextPocketObservationBoundary(state);
 const times=r?.activityClock?.leases.filter(l=>l.status==='active').map(l=>l.expiresAt)||[];
 if(observation!==null)times.push(observation);return times.length?Math.min(...times):Infinity;
}
// The observer returns a detached staged state. Preserve this scheduler's state
// identity, whose simulation plan also holds the same object.
export function expireRealmObservation(state){
 const expired=expirePocketObservation(state);if(expired!==state)Object.assign(state,expired);
 const r=state.realmPrototype;if(r?.activityClock&&!pocketObservationSupport(state).active)closeRealmObservationClock(state);
 return state;
}
export function realmSimulationContexts(state,contexts){
 if(!state.realmPrototype)return contexts;
 const r=state.realmPrototype,i=r.instances[ids.instanceId],caretaker=content.caretakerId,present=!!activeRealmVisit(state);
 // Opening the route creates its instance, not the resident. Contexts must
 // refer only to actors actually introduced by their own meeting route.
 if(!state.actors[caretaker]||!state.simulation?.people?.[caretaker])return contexts;
 const supported=!!r.activityClock&&i.clock.observedAt===state.clock&&realmClockActivation(i,r.activityClock,definition,activityContext(state,activitySupport(state,state.clock,state.clock))).supportedActivity;
 const active=(present||supported)&&state.actors[caretaker]?.worldId===ids.worldId&&i.actorIds.includes(caretaker);
 return {...contexts,[caretaker]:{...contexts[caretaker],busy:!active,facts:{...contexts[caretaker]?.facts,...realmFacts(state,caretaker),
  'glasshouse.instanceClockActive':active}}};
}
