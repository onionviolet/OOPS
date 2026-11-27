// Immutable v2 method over identified physical pieces. Original v1 methods stay
// installed to restore their exact pending work; their carrier materialization
// preserves the authored fifteen-part estimate and any already spent charge.
import {extensionFact} from '../structured_pack_extensions.js';
import {RI_PIECE_EXTENSION as E,RI_PIECE_DRAW as DRAW,registerRiStonePieces} from '../ri_stone_pieces.js';
const eq=(fact,value=true)=>({fact,op:'eq',value}),all=(...rules)=>({all:rules});
const world='book.ri.lead.world',home='book.ri.lead.home',energy='book.ri.lead.primeval';
const ready=all(eq('actor.life','alive'),eq('native.ready'),eq('native.alive'),eq('body.ownerId','player'),eq('body.controllerId','player'),eq('body.mobile'),eq('actor.location',home),eq('faculty.book.ri.lead.aperture.active'));
const support=all(ready,eq(extensionFact(E))),room={fact:`energy.${energy}.reserve`,op:'lte',value:43};
export const guLeadHalfStonePiece={schema:1,id:E,revision:1,base:{id:'book.ri.lead',revision:1,contentHash:'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},dependsOn:['book.ri.lead.vital'],label:'Draw from a carried small stone',description:'Keep track of each small stone separately. Choose the piece to draw from and keep its remaining essence.',requires:all(ready,eq('riStone.held')),reason:'Carry one of the small stones you kept.',commands:[{
 id:DRAW,revision:1,label:'Draw one part from the selected stone',description:'Draw one part into your sea in one minute, keeping the same piece and its remaining charge. Stopping returns it unchanged.',group:'structured_local',worldId:world,actorId:'player',location:home,audience:['$actor'],once:false,queueRepeatable:false,duration:1,
 visibleWhen:all(eq(extensionFact(E)),eq('riStone.held')),requires:{...all(support,eq('riStone.available'),room),reason:'Select a carried piece with essence left and leave room in your sea for one part.'},completionRequires:all(support,room),completionCoLocated:true,cancellation:'refund',completionFailure:'refund',reservationReturns:1,
 costs:[{type:'item',actor:'player',key:JSON.stringify({id:'book.ri.lead.vital.half_stone'}),amount:-1}],effects:[{type:'riStoneDraw',actor:'player',amount:1},{type:'energy',actor:'player',energyId:energy,operation:'recover',amount:1},{type:'knowledge',actor:'player',key:E+'.drawn',stage:'understood',value:'One part enters your sea. You keep the same small stone.'}]
}],status:[{id:E+'.draw_status',label:'Your last draw',knowledgeKey:E+'.drawn'}]};
export async function registerGuLeadHalfStonePiece(register,base){if(!register.bundledInstantExtension)return null;const e=await register.bundledInstantExtension(guLeadHalfStonePiece,base);registerRiStonePieces();return e;}
