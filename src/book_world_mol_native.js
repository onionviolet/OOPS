import {MOL_FOOTPRINTS as footprints,MOL_LOCATIONS,MOL_NATIVE_DOMAIN as nativeDomain,MOL_NATIVE_STOCK as nativeStock,molDefinitions as definitions} from './book_world_mol_content.js';
import {activeMolVisit,validateMolCampaignState as validateCampaignState} from './book_world_mol_host.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {createBookWorldNative} from './book_world_native_base.js';
// Mol binding of the shared book-world native module. Only world data and
// wording live here; save keys (motherOfLearning, inventories.book_world_mol, MOL_NATIVE_DOMAIN) are unchanged.
// The Zorian start has no visitor passage; the native envelope check wants a presence marker for the seat in Cyoria.
const activeVisit=state=>activeMolVisit(state)||(isZorianStart(state)&&state.actors?.player?.worldId==='book.mol.cyoria'?{seat:'zorian'}:null);
const native=createBookWorldNative({world:'Mol',footprints,nativeDomain,nativeStock,definitions,activeVisit,validateCampaignState,
 stateKey:'motherOfLearning',ns:'book_world_mol',activationKey:'molActivation',requestsKey:'molNativeRequests',stockField:'molStock',
 ownerCount:1,ownerCountMessage:"Mol needs one exact retained world owner.",
 tradeMessage:"Legacy native trade cannot bypass the local crown owner.",
 questDescription:"Committed campaign facts own this local agreement. Actual local retrieval, research and continuing life are independent retained consequences."});
// Additive places have no history in old saves unless one is the current location.
function withAddedPlaces(envelope) {
 if(!envelope.expansion?.motherOfLearning||!envelope.locations) return envelope;
 const missing=[MOL_LOCATIONS.divinationTavern,MOL_LOCATIONS.mansion,MOL_LOCATIONS.festivalHall].filter(id=>
  !Object.hasOwn(envelope.locations,id)&&envelope['current location']!==id);
 if(!missing.length) return envelope;
 return {...envelope,locations:{...envelope.locations,...Object.fromEntries(missing.map(id=>[id,{}]))}};
}

export const molCalendarAt=native.calendarAt,molQuestProjection=native.questProjection,validateMolNativeMetadata=native.validateNativeMetadata;
export const validateMolEnvelope=envelope=>native.validateEnvelope(withAddedPlaces(envelope));
export function createMolNativeBindings(args){
 const bindings=native.createBindings(args);
 return {...bindings,validateEnvelope:validateMolEnvelope,restore:envelope=>bindings.restore(withAddedPlaces(envelope))};
}
