// Ch18 P033–035 establishes a carried, partly depleted half-sized stone, not
// its numerical charge. Fifteen remaining parts is an authored estimate for
// this carrier, consistent with the existing ordinary-day thirty-part default.
// One part per minute follows the earlier measured-draw pacing, not a new
// assertion that every whole or half-sized stone has the same capacity.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD,riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';
export const GU_HALF_STONE=id('half_stone_use');
export const GU_HALF_STONE_PARTS=15;
export const guHalfStoneKey=remaining=>JSON.stringify({id:remaining===GU_HALF_STONE_PARTS?id('vital.half_stone'):`${GU_HALF_STONE}.remaining_${remaining}`});
export const guHalfStoneAction=remaining=>`${GU_HALF_STONE}.draw_${remaining}`;
const local=n=>`${GU_HALF_STONE}.${n}`,energy=id('primeval');
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules});
const ready=all(eq('actor.life','alive'),eq('native.ready'),eq('native.alive'),eq('body.ownerId','player'),eq('body.controllerId','player'),eq('body.mobile'),eq('actor.location',id('home')),eq(`faculty.${id('aperture')}.active`));
const holds=remaining=>({fact:`item.${guHalfStoneKey(remaining)}`,op:'gte',value:1,reason:'Keep the partly drawn stone with you.'});
const support=all(ready,eq(extensionFact(GU_HALF_STONE)));
const space={fact:`energy.${energy}.reserve`,op:'lte',value:43,reason:'Your sea is full. Keep the stone until you need its essence.'};
const items=Array.from({length:GU_HALF_STONE_PARTS},(_,remaining)=>({id:local(`remaining_${remaining}`),label:remaining?`Half stone · ${remaining} ${remaining===1?'part':'parts'} left`:'Half stone · spent',description:remaining?`The piece you kept after drawing from Fang Zheng’s half stone. Your estimate leaves ${remaining} ${remaining===1?'part':'parts'} of usable essence.`:'You have drawn the last usable essence from this small piece. It stays in your purse.',value:0}));
const commands=Array.from({length:GU_HALF_STONE_PARTS},(_,i)=>{const remaining=i+1;return {
 id:guHalfStoneAction(remaining),revision:1,label:remaining===GU_HALF_STONE_PARTS?'Draw one part from Fang Zheng’s half stone':`Draw one more part from your half stone · ${remaining} left`,
 description:'Hold the small stone and draw one part into your sea in one minute. Keep the rest for later. Stopping during the minute returns the same piece unchanged.',group:'structured_local',worldId:id('world'),actorId:'player',location:id('home'),audience:['$actor'],once:false,queueRepeatable:false,duration:1,
 visibleWhen:all(eq(extensionFact(GU_HALF_STONE)),holds(remaining)),requires:{...all(support,holds(remaining),space),reason:'Keep this piece with you and leave room in your sea for one part.'},completionRequires:all(support,space),completionCoLocated:true,cancellation:'refund',completionFailure:'refund',reservationReturns:1,
 costs:[{type:'item',actor:'player',key:guHalfStoneKey(remaining),amount:-1}],effects:[{type:'energy',actor:'player',energyId:energy,operation:'recover',amount:1},{type:'item',actor:'player',key:guHalfStoneKey(remaining-1),amount:1},{type:'knowledge',actor:'player',key:local('drawn'),stage:'understood',value:remaining>1?`One part enters your sea. You keep the small stone with an estimated ${remaining-1} ${remaining===2?'part':'parts'} left.`:'The last part enters your sea. You keep the spent piece.'}]
};});
export const guLeadHalfStone={schema:1,id:GU_HALF_STONE,revision:1,base:{id:GU_LEAD,revision:1,contentHash:'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},dependsOn:[GU_LEAD_VITAL],label:'Use the half stone you kept',description:'You reckon this partly drawn piece has about fifteen parts left. Draw one part at a time, keeping what remains. A full sea can wait.',requires:all(ready,holds(GU_HALF_STONE_PARTS)),reason:'Carry the half stone Fang Zheng handed over, with room to move your primeval essence.',items,commands,status:[{id:local('draw_status'),label:'Your half stone',knowledgeKey:local('drawn')}]};
export async function registerGuLeadHalfStone(register,base){
 if(!register.bundledInstantExtension||!base.extensions?.some(e=>e.id===GU_LEAD_VITAL))return null;
 return register.bundledInstantExtension(guLeadHalfStone,base);
}


