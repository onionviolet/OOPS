// Original Frontier succession: the existing ended-life heir route conveys
// personal title and belongings. Household employment, hospitality and rank do
// not become transferable property. World-specific settlements can differ.
import {emptyHomes,validateHomes} from './home_model.js';
import {HOME_PLACES as P} from './home_content.js';
export function deriveHomeEstate(previous){
 const raw=previous.homes;if(!raw)return null;validateHomes(raw,{clock:previous.expansion.clock,sequence:previous.expansion.sequence});
 const homes=emptyHomes(),goods={};const add=(key,n)=>{if(n>0)goods[key]=(goods[key]||0)+n;};
 for(const old of Object.values(raw.properties)){
  if(old.owner==='player'&&old.tenure==='owned'){
   const h=structuredClone(old);delete h.household;h.acquiredAt=0;if(h.construction)h.construction.at=0;
   if(h.condition){h.condition.lastClock=0;}
   homes.properties[h.id]=h;
  }else{
   for(const [key,n]of Object.entries(old.stock))add(key,n);
   for(const row of Object.values(old.fixtures))if(row.owner==='player')add(row.key,1);
  }
 }
 for(const project of Object.values(raw.projects||{})){
  const progress=previous.expansion.actors.player.resources?.[`home.work.${project.home}.${project.kind}`]||0;
  for(const [key,n]of Object.entries(project.materials))add(key,Math.floor(n*(1-Math.min(1,progress/project.required))));
 }
 if(raw.portable){homes.portable=structuredClone(raw.portable);homes.portable.acquiredAt=0;if(homes.portable.construction)homes.portable.construction.at=0;if(homes.portable.condition)homes.portable.condition.lastClock=0;}
 homes.primary=homes.properties[raw.primary]?raw.primary:Object.keys(homes.properties)[0]||null;
 homes.ledger=[{at:0,text:'The estate conveys personal residences and fittings. Other households retain their title, staff and communal supplies. Existing occupants require their own agreements.'}];
 validateHomes(homes,{clock:0,sequence:0});
 let money=0;for(const job of previous.expansion.simulation?.jobs||[])if(job.commandId.startsWith('home.work.'))for(const cost of job.costs||[]){if(cost.actor==='player'&&cost.type==='resource'&&cost.native&&cost.key==='money'&&cost.amount<0)money-=cost.amount;}
 return {homes,goods:Object.entries(goods),money};
}
export function validateHomeEstate(estate){
 if(!estate||!Array.isArray(estate.goods)||estate.goods.some(r=>!Array.isArray(r)||typeof r[0]!=='string'||!Number.isSafeInteger(r[1])||r[1]<=0)||!Number.isSafeInteger(estate.money)||estate.money<0)throw Error('Invalid home estate.');
 validateHomes(estate.homes,{clock:0,sequence:0});
 if(Object.values(estate.homes.properties).some(h=>h.owner!=='player'||h.tenure!=='owned'))throw Error('Invalid inherited residence title.');
 return estate;
}
export function applyHomeEstate(next,estate){
 if(!estate)return;
 validateHomeEstate(estate);next.homes=structuredClone(estate.homes);
 const inv=((next.inventories||={}).person||={}).main_character||={};
 for(const [key,n]of estate.goods)inv[key]={count:(inv[key]?.count||0)+n};
 for(const h of Object.values(next.homes.properties)){
  const location=P[h.id].location,loc=(next.availabilities||={}).location||={};loc[location]=(loc[location]||0)|1;
 }
}
