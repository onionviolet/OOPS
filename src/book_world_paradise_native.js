import {PARADISE_FOOTPRINTS as footprints,PARADISE_NATIVE_DOMAIN as nativeDomain,PARADISE_NATIVE_STOCK as nativeStock,paradiseDefinitions as definitions} from './book_world_paradise_content.js';
import {activeParadiseVisit as activeVisit,validateParadiseCampaignState as validateCampaignState} from './book_world_paradise_host.js';
import {createBookWorldNative} from './book_world_native_base.js';
// Paradise binding of the shared book-world native module. Only world data and
// wording live here; save keys (bookWorldCampaign, inventories.book_world_campaign, PARADISE_NATIVE_DOMAIN) are unchanged.
const native=createBookWorldNative({world:'Paradise',footprints,nativeDomain,nativeStock,definitions,activeVisit,validateCampaignState,
 stateKey:'bookWorldCampaign',ns:'book_world_campaign',activationKey:'paradiseActivation',requestsKey:'paradiseNativeRequests',stockField:'paradiseStock',
 ownerCount:2,ownerCountMessage:"Paradise needs two distinct retained world owners.",
 tradeMessage:"Legacy native coin trade cannot bypass the campaign credit owner.",
 questDescription:"Committed campaign facts own this local agreement. Mission extraction and payout belong to their distinct contract receipts."});
export const paradiseCalendarAt=native.calendarAt,paradiseQuestProjection=native.questProjection,validateParadiseNativeMetadata=native.validateNativeMetadata,validateParadiseEnvelope=native.validateEnvelope,createParadiseNativeBindings=native.createBindings;
