// Original public proposal fixture. No private world text or player saves.
const eq=(fact,value=true)=>({fact,op:'eq',value});
export const abilityPack=()=>({
 schema:2,id:'airproof',revision:1,compatibility:{legacy:'preserve-dormant',origin:'mandatory'},capabilities:['native-stock','jobs'],
 world:{id:'airproof.world',label:'Strap workshop'},locations:[{id:'airproof.room',label:'Strap workshop',description:'An original public adapter trial.'}],
 items:[{id:'airproof.worn',label:'Worn strap',description:'A repair input.'},{id:'airproof.fixed',label:'Repaired strap',description:'A working repair output.'}],
 sources:['hand','jig','carrier'].map(id=>({id:'airproof.'+id,revision:1,kind:'technique',label:id,grants:[]})),
 abilities:['hand','jig'].map((id,i)=>({id:'airproof.ability.'+id,commandId:'airproof.repair.'+id,sourceId:'airproof.'+id,powerId:'airproof.pattern',function:'craft',acquisition:'learned',executionKind:i?'device-construct':'ordinary-technique',control:eq('actor.control'),counters:[eq('actor.blocked')],carriers:i?[{sourceId:'airproof.carrier',requires:eq('actor.carrierFit')}]:[]})),
 simulation:{powers:[{id:'airproof.pattern',revision:1,label:'Strap repair',model:'practice',capacity:1}],commands:[
 ...['hand','jig'].map(id=>({id:'airproof.repair.'+id,revision:1,label:'Repair with '+id,description:'Pay two coins to turn a worn strap into a working strap and practice Crafting.',worldId:'airproof.world',location:'airproof.room',group:'structured_local',actorId:'player',audience:['$actor'],powerId:'airproof.pattern',duration:0,costs:[{type:'resource',native:true,key:'money',amount:-2},{type:'item',key:'{"id":"airproof.worn"}',amount:-1}],effects:[{type:'item',key:'{"id":"airproof.fixed"}',amount:1},{type:'xp',skill:'Crafting',amount:1}]})),
 {id:'airproof.suppress',revision:1,label:'Put the hand method away',worldId:'airproof.world',group:'structured_local',actorId:'player',audience:['$actor'],costs:[],effects:[{type:'faculty',sourceId:'airproof.hand',operation:'suppress'}]}
 ]},presentation:{people:{},status:[]},
 bootstrap:{id:'airproof.start',locationId:'airproof.room',description:'Public proposal: hand and jig have different held support.',effects:[{type:'source',sourceId:'airproof.hand',operation:'grant',awakened:true,active:true},{type:'power',powerId:'airproof.pattern',operation:'learn'},{type:'fact',scope:'actor',key:'control',value:true},{type:'fact',scope:'actor',key:'blocked',value:false},{type:'item',key:'{"id":"airproof.worn"}',amount:3}]}
});
