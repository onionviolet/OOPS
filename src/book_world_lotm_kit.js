// Shared rule and command builders for the Tingen branch (B2 extraction, 2026-10-23). The Seer, the pathway
// factory, the district layer and the later life slices all build commands and rules from these, so none of
// them re-declares the helpers. Pure data constructors: no state, no clock, no save.
import {LOTM_IDS as I,LOTM_ENERGY} from './book_world_lotm_ids.js';
export const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const eq=(fact,value=true)=>({fact,op:'eq',value}),gte=(fact,value)=>({fact,op:'gte',value});
export const all=(...rules)=>({all:rules}),not=rule=>({not:rule}),any=(...rules)=>({any:rules});
export const af=(key,value=true,actor='player')=>({type:'fact',scope:'actor',actor,key:`book.lotm.${key}`,value});
// Unknown facts never satisfy a rule, even under not(), so every flag is emitted explicitly by lotmFacts.
export const has=(key,value=true)=>eq(`lotm.flag.${key}`,value),no=key=>has(key,false);
export const item=(actor,key,amount,returned=false)=>({type:'item',actor,key,amount,...(returned?{reservationReturn:true}:{})});
export const transfer=(from,to,key,count=1)=>({type:'transfer',from,to,key,count});
export const attention=(amount=-1,actor=I.supervisor)=>({type:'resource',actor,key:'book.lotm.attention',amount});
export const money=amount=>({type:'resource',actor:'player',key:'money',native:true,amount});
export const use=()=>({type:'energy',energyId:I.energy,operation:'use',output:LOTM_ENERGY.output,control:LOTM_ENERGY.control});
export const know=(key,value,attributedTo='player',actor='player',kind='observation',stage='seen')=>({type:'knowledge',actor,key:`book.lotm.${key}`,stage,value,basis:{kind,attributedTo,situationId:I.situation}});
export const present=all(eq('lotm.enrolled'),eq('lotm.supervisorHere')),ready=all(present,has('reportedIn'));
// `entry` commands need only Hale; `alone` commands need only enrollment; `officer` commands need the current district's officer.
export function cmd(id,label,location,d={}){
 const {alone,entry,officer,...rest}=d,requires=all(alone?eq('lotm.enrolled'):officer?all(eq('lotm.enrolled'),eq('lotm.officerHere'),has('reportedIn')):entry?present:ready,...(d.requires?[d.requires]:[]));
 return {id:`book.lotm.${id}`,revision:1,label,group:'book_lotm',actorId:'player',worldId:I.world,...(location?{location}:{}),once:true,costs:[],effects:[],visibleWhen:d.visibleWhen||requires,...rest,requires,
  ...(d.costs?.length||d.duration)&&d.once!==false?{claim:`book.lotm.receipt.${id}`}:{},...d.targetId?{coLocated:true,participants:['$target']}:{}};
}
