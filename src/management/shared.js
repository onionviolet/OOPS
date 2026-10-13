// Original local courtyard proposals. Pure authoring helpers, no state mutation.
export const I = Object.freeze({world:'base.frontier',group:'management',begin:'mg.begin',mira:'mg.mira',orin:'mg.orin',sela:'mg.sela',bram:'mg.bram',bench:'mg.bench',room:'mg.room',plot:'mg.plot',venue:'mg.venue',situation:'mg.courtyard',dispatch:'mg.dispatch'});
const key = id => JSON.stringify({id});
export const K = Object.freeze({log:key('Rough wood log'),cloth:key('Linen cloth'),seed:key('Courtyard seed packet'),greens:key('Courtyard greens'),grain:key('Courtyard grain'),crate:key('Courtyard wood crate'),fine:key('Fine courtyard crate'),damaged:key('Damaged courtyard heirloom'),conserved:key('Conserved courtyard heirloom'),restored:key('Restored courtyard heirloom')});
export const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
export const gte=(fact,value,reason)=>({fact,op:'gte',value,...(reason?{reason}:{})});
export const all=(...rules)=>({all:rules});
export const any=(...rules)=>({any:rules});
export const not=rule=>({not:rule});
export const af=(name,value=true,actor='player')=>({type:'fact',actor,scope:'actor',key:`mg.${name}`,value});
export const item=(key,amount,actor='player')=>({type:'item',actor,key,amount});
export const money=amount=>({type:'resource',actor:'player',native:true,key:'money',amount});
export const coins=(amount,actor)=>({type:'resource',actor,key:'coins',amount});
export const stamina=amount=>({type:'vital',actor:'player',key:'stamina',amount});
export const transfer=(key,count,from,to)=>({type:'transfer',key,count,from,to});
export const know=(name,text,attributedTo='player',stage='seen')=>({type:'knowledge',actor:'player',key:`mg.${name}`,stage,value:text,basis:{kind:attributedTo==='player'?'observation':'instruction',attributedTo,situationId:I.situation}});
export const relationship=(target,amount=1)=>({type:'relationship',actor:'player',target,axis:'trust',amount});
export const owned=name=>{const entry=Object.entries(K).find(([n,k])=>n===name||k===name||JSON.parse(k).id===name);if(!entry)throw new Error(`Unknown management item ${name}`);return gte(`management.owned.${entry[0]}`,1,'Carry the actual owned, unequipped, unborrowed item.');};
export const contact=actor=>eq(`management.present.${actor}`,true,'The named local person needs a living body, consent and available attention here.');
export const purse=(actor,amount)=>gte(`management.coins.${actor}`,amount,'The quoted payer must have the actual coins; no automatic credit is created.');
export const live=eq('management.supported',true,'Return to Village with your living native body and available played-time services.');
export const opened=eq('actor.mg.opened');
export function command(d) {
 const support=all(live,opened,...(d.support?[d.support]:[]));
 const req=all(support,...(d.requires?[d.requires]:[]));
 return {revision:1,worldId:I.world,group:I.group,actorId:'player',location:'Village',costs:[],effects:[],...d,
   requires:d.id===I.begin?live:req,
   visibleWhen:d.id===I.begin?not(opened):all(opened,...(d.visibleWhen?[d.visibleWhen]:[])),
   ...(d.duration?{cancellation:'refund',reservationReturns:1,completionRequires:support,completionFailure:'refund'}:{})};
}
