import {reachBand,REACH_BANDS} from './village_obtainability.js';
export const ASK_TABLE_REVISION=2;
const ask=(id,item,quantity,tags,fiction,clue,extra={})=>Object.freeze({id,item,quantity,tags,fiction,clue,grade:null,...extra});
// Original frontier fiction. Item/grade are data fields, not a three-item switch.
export const VILLAGE_ASKS=Object.freeze({
 road_mender:Object.freeze([
  ask('mender.meal','Stale bread',[1,3],['food','road'],'I need bread for the walk between repairs.','A spare portion would keep me on the road.'),
  ask('mender.needle_heat','Coal',[1,3],['repair','fuel'],'A little coal will heat my needles straight at the next hearth.','I need fuel that holds heat.'),
  ask('mender.oil_vial','Glass phial',[1,2],['repair','container'],'I need small phials to keep needle oil out of my sewing bag.','An empty little container will do.'),
  ask('mender.patch','Rat pelt',[1,1],['repair','hide'],'A rat pelt would patch the worn lining of my tool roll.','Perhaps someone who works hides can advise me.'),
 ]),
 river_walker:Object.freeze([
  ask('river.meal','Stale bread',[1,3],['food','river'],'Bread travels better than a meal that spills in the boat.','A spare portion would help.'),
  ask('river.line','Survey rope',[1,1],['river','cord'],'I need a light line to keep my pack tied beside the boat.','I am looking for a light length of cord.'),
  ask('river.bottle','Glass bottle',[1,1],['river','container'],'I need a bottle for drinking water along the river.','An empty watertight container would help.'),
  ask('river.firewood','Rough wood log',[1,2],['river','fuel'],'A log or two would spare me searching for fuel at the next stop.','I can wait while you arrange some wood.'),
 ]),
 hill_carrier:Object.freeze([
  ask('courier.meal','Stale bread',[1,3],['food','hill'],'I need bread for the climb with these letters.','A spare portion would help.'),
  ask('courier.tie','Survey rope',[1,1],['parcel','cord'],'A light line will hold my parcel stack when the hill wind rises.','I am looking for a light length of cord.'),
  ask('courier.splints','Processed rough wood',[1,3],['parcel','craft'],'Small prepared pieces of wood will brace a fragile parcel.','Perhaps someone who works wood can advise me.'),
  ask('courier.firewood','Rough wood log',[1,2],['hill','fuel'],'The hill shelter needs a little firewood before I stop there.','I can wait while you arrange some wood.'),
 ]),
});
export function feeFromBasis(base,band) {
 if(!Number.isSafeInteger(base)||base<1||!REACH_BANDS.includes(band))throw Error('Invalid traveler fee basis.');
 const premium={ready:0.25,stretch:0.5,unknown:0.75}[band],discovery={ready:2,stretch:5,unknown:10}[band];
 return base+Math.ceil(base*premium)+discovery;
}
export function askFee(row,quantity,band) {
 if(!row?.routes.length||!Number.isSafeInteger(quantity)||quantity<1||quantity>3)throw Error('Traveler ask has no supply route.');
 const purchase=row.routes.filter(r=>r.kind==='trader'&&r.chance===1&&r.count>=quantity).map(r=>r.price*quantity);
 const work=row.routes.filter(r=>['gather','drop','recipe'].includes(r.kind)).map(r=>Math.ceil(r.minutes*quantity*0.5));
 // Owned bread is not free: pay its replacement cost. Route estimates are frozen
 // in the goal, so later stock/balance changes never reprice a saved obligation.
 const base=Math.max(1,Math.ceil(Math.min(...purchase,...work)));
 if(!Number.isFinite(base))throw Error('Traveler ask needs a priced route.');
 return {reward:feeFromBasis(base,band),feeBasis:{base,band}};
}
export function askPool(templateId,index,context={}) {
 return (VILLAGE_ASKS[templateId]||[]).filter(a=>index[a.item]?.routes.length&&a.grade===null&&(!a.season||a.season.includes(context.season))&&(!a.weather||a.weather===context.weather))
 .map(a=>{const quantities=Array.from({length:a.quantity[1]-a.quantity[0]+1},(_,i)=>a.quantity[0]+i).map(quantity=>({quantity,band:reachBand(index[a.item],{...context,quantity})}));return {...a,quantities};});
}
export function drawVillageAsk(templateId,index,context,draw) {
 const pool=askPool(templateId,index,context);
 if(!pool.length)throw Error('No routed traveler asks for this template.');
 // 70/20/10 preference while each present band stays possible. Within a band,
 // choose uniformly among authored entries, then among quantities in that band.
 const bands=REACH_BANDS.filter(b=>pool.some(a=>a.quantities.some(q=>q.band===b))),weights={ready:7,stretch:2,unknown:1};
 let ticket=draw(bands.reduce((n,b)=>n+weights[b],0)),band=bands.at(-1);
 for(const b of bands){if(ticket<weights[b]){band=b;break;}ticket-=weights[b];}
 const entries=pool.filter(a=>a.quantities.some(q=>q.band===band)),entry=entries[draw(entries.length)],quantities=entry.quantities.filter(q=>q.band===band),quantity=quantities[draw(quantities.length)].quantity;
 return {askId:entry.id,item:entry.item,quantity,grade:entry.grade,band,fiction:entry.fiction,clue:entry.clue,...askFee(index[entry.item],quantity,band)};
}
export function validateVillageGoal(goal,templateId) {
 const a=VILLAGE_ASKS[templateId]?.find(a=>a.id===goal.askId);
 return !!a&&goal.item===a.item&&Number.isSafeInteger(goal.quantity)&&goal.quantity>=a.quantity[0]&&goal.quantity<=a.quantity[1]&&goal.grade===a.grade&&REACH_BANDS.includes(goal.band)&&goal.fiction===a.fiction&&goal.clue===a.clue&&goal.feeBasis?.band===goal.band&&Number.isSafeInteger(goal.feeBasis?.base)&&goal.feeBasis.base>0&&goal.reward===feeFromBasis(goal.feeBasis.base,goal.band)&&Number.isSafeInteger(goal.needRevision)&&goal.needRevision>0;
}
