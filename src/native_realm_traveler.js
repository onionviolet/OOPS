import {previewRealmTraveler} from './realm_traveler_profiles.js';
import {buildNativeRealmCargoSnapshot,previewRealmCargoPassage} from './realm_cargo.js';
const nativeCargoSnapshot=(state,context)=>buildNativeRealmCargoSnapshot({
 actorId:'player',bodyId:'native.player.body',sequence:state.sequence,revision:state.sequence+1,
 inventory:context.gameplay?.player?.inventory,equipment:context.equipment?.player,custody:state.simulation?.custody
});
// Retain a reference to the actual learned owner. Passage never grants execution
// in another world, copies mastery, or treats a fragment as a learned method.
export function nativeRetainedMethods(state){
 const p=state.simulation?.powers?.player?.['tidemark.counterweight'];
 return p?.owned===true&&Number.isSafeInteger(p.revision)&&p.revision>0?
  [{id:'tidemark.counterweight',revision:p.revision,ownerId:'player',sourceId:null,stage:'learned'}]:[];
}
// The host calls this for each directed passage; no consent is enrolled here.
export function buildNativePocketCargo(state,context,{from,to,connectionId}){
 try{
  const connection=state.realmPrototype?.connection;
  if(!connection||connection.id!==connectionId)throw Error('No actual doorway is bound for this cargo request.');
  const snapshot=nativeCargoSnapshot(state,context),plan=previewRealmCargoPassage(snapshot,connection,{
   expectedSequence:state.sequence,expectedRevision:connection.revision,expectedSnapshotRevision:snapshot.revision,expectedSnapshotBinding:snapshot.binding,
   purposeId:'native.pocket.physical_passage',from,to,duration:connection.duration
  },{sequence:state.sequence,clock:state.clock,permissions:[],consents:[]});
  if(snapshot.cargo.some(c=>c.ownerId!=='player')){plan.allowed=false;plan.reasons=['Return borrowed goods before using the conventional doorway.'];}
  return plan;
 }catch(error){return {allowed:false,reasons:[error.message||'Bind the complete actual cargo before passage.'],cargo:[],cargoComplete:false,guards:null};}
}
// Read a narrow, conventional one-body profile from the existing native player.
// These references are views of that owner, not new bodies or resource pools.
export function previewNativeRealmTraveler(state,context,routeContext,passage){
 if(!passage.allowed)return {allowed:false,reasons:passage.reasons};
 const bodyId=routeContext.body.id,owner=(domain,id)=>({domain,id,revision:1}),v=context.vitals?.player||{};
 const identityRef=owner('native_character','player'),conditionRef=owner('native_vitals','player'),poolRef=conditionRef;
 let snapshot;
 try{snapshot=nativeCargoSnapshot(state,context);}catch(error){return {allowed:false,reasons:[error.message||'Bind the complete actual cargo before passage.']};}
 if(bodyId!==snapshot.bodyId||routeContext.cargoComplete!==true||!Array.isArray(routeContext.cargo)||routeContext.cargo.length!==snapshot.cargo.length)
  return {allowed:false,reasons:['Bind the complete actual carried inventory before passage.']};
 if(snapshot.cargo.some(c=>c.ownerId!=='player'))return {allowed:false,reasons:['Return borrowed goods before using the conventional doorway.']};
 const seen=new Set();
 for(const c of routeContext.cargo){
  const actual=snapshot.cargo.find(a=>a.itemId===c.itemId);
  if(!actual||seen.has(c.itemId)||['sourceId','itemKey','ownerId','holderId','holderBodyId','count','equipped','slot','classId','transferable','custodyBinding'].some(k=>c[k]!==actual[k])||
   c.custodyRef!==null||!c.stockRef||['domain','id','revision'].some(k=>c.stockRef[k]!==actual.stockRef[k]))
   return {allowed:false,reasons:['This native cargo reference is stale. Refresh the doorway.']};
  seen.add(c.itemId);
 }
 const cargo=routeContext.cargo.map(c=>({id:c.itemId,revision:c.stockRef.revision,ownerId:c.ownerId,holderBodyId:c.holderBodyId,
  itemKey:c.itemKey,count:c.count,kind:'owned',stockRef:structuredClone(c.stockRef),loan:null}));
 const available=routeContext.life==='alive'&&(v.health??1)>0&&!context.busy;
 const profile={schema:1,id:'traveler.native_player',revision:state.sequence+1,actorId:'player',identityRef,mindRef:identityRef,currentBodyId:bodyId,
  embodiment:{mode:'single',sourceId:null,supportId:null},memories:[],methods:nativeRetainedMethods(state),sources:[],obligations:[],companions:[],cargo,
  bodies:[{id:bodyId,revision:1,ownerId:'player',identityId:'player',mindId:'player',form:routeContext.body.form,endpoint:routeContext.endpoint,life:available?'alive':'incapacitated',available,
   functions:available&&state.simulation?.people.player?.body?.mobile!==false?['travel.physical']:[],poolIds:['native.player.vitals'],conditionRef}],
  pools:[{id:'native.player.vitals',revision:1,ownerId:'player',ownerRef:poolRef,balances:[{resourceId:'health',amount:Math.max(0,v.health??0)},{resourceId:'stamina',amount:Math.max(0,v.stamina??0)}]}]};
 const request={mode:'physical',bodyId,expectedRevision:profile.revision,expectedSequence:state.sequence,duration:0,to:passage.arrival.endpoint,
  supportId:null,targetBodyId:null,presenceIds:[],presencePositions:[],cargoIds:cargo.map(c=>c.id),companionIds:[]};
 const ownerBindings=[identityRef,conditionRef].map(r=>({...r,ownerId:'player',available}));
 const stockBindings=cargo.map(c=>({stockRef:c.stockRef,ownerId:c.ownerId,holderBodyId:c.holderBodyId,itemKey:c.itemKey,count:c.count}));
 return previewRealmTraveler(profile,{sequence:state.sequence,clock:state.clock,supports:[],ownerBindings,stockBindings,
  access:{id:passage.connectionId,revision:passage.connectionRevision,actorId:'player',bodyId,sequence:state.sequence,duration:0,mode:'physical',from:routeContext.endpoint,to:passage.arrival.endpoint,
   allowed:true,reasons:[],expiresAt:null,cargoIds:request.cargoIds,companionIds:[],presenceIds:[],presencePositions:[]}},request);
}
