import {createRealmConnection,realmConnectionBinding} from './realm_connections.js';
import {createFoldedGlasshouseContent,FOLDED_GLASSHOUSE_IDS as ids} from './pocket_realm_content.js';
const content=createFoldedGlasshouseContent();
export function createPocketDoorConnection(){return createRealmConnection({id:ids.connectionId,revision:1,from:content.connectionProposal.from,to:content.endpoint,
 kind:'physical',controllerId:'player',bidirectional:true,duration:0,lifetime:null,
 requirements:{id:'glasshouse.doorway',revision:1,operations:['passage'],bodyForms:['human'],costs:[]},
 openingCosts:[{ownerId:'player',resourceId:'money',amount:1}],cargoPolicy:{allowed:true,maxUnits:Number.MAX_SAFE_INTEGER,allowEquipped:true,classes:['carried']},flows:['light','sound','air','body','cargo']});}
// Construct from authored source, never from the incoming saved connection.
export const POCKET_DOOR_BINDING=realmConnectionBinding(createPocketDoorConnection());
