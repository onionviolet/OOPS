// L11 host consumer: the lead's way to the cities on his path (GM22, GM31). region_kit and travel_legs own the
// read models (AR3); this file turns each city route leg into a cast journey row plus pack places, so the
// existing journey job (fare, minutes, hours, relocation, receipt) carries the lead, and reads the region for
// the place he stands in. Private city packs only; with none present the cast pack is returned unchanged.
import {deepFreeze} from './basics.js';
import {readRegion} from './region_kit.js';
import {openUnder} from './world_events.js';
export const CITY_PREFIX='lotm.city.';
// Proposal (WPR5): the cited route starts in Tingen without naming a place, so the lead boards at a station
// placed in a district. Retune when a source names it.
export const TINGEN_STATION={id:'lotm.place.tingen-station',name:'Tingen railway station',indexId:'lotm.place.tingen-station',openingHours:[],
 label:'I',locator:'authored proposal',travel:{district:'machinery',basis:'Authored proposal: the route names Tingen, not a place, so a station is placed in a district.'}};
const placeId=(city,id)=>`${CITY_PREFIX}${city.region.id}.${id}`;
let cities=[];
export const setCities=list=>{cities=list;};
export const getCities=()=>cities;
export function withCities(pack,list){
 const usable=list.filter(c=>c.route?.legs?.length);
 if(!usable.length)return pack;
 const places=[TINGEN_STATION],journeys=[];
 for(const city of usable){
  const names=new Map(city.region.places.map(p=>[p.id,p.label]));
  const at=id=>id==='tingen'?TINGEN_STATION.id:placeId(city,id);
  for(const leg of city.route.legs){
   const from=at(leg.from),to=at(leg.to);
   for(const [key,id] of [[leg.from,from],[leg.to,to]])if(!places.some(p=>p.id===id))places.push({id,name:names.get(key)||key,indexId:id,openingHours:[],label:'I',locator:'city pack'});
   const fare=leg.fare?.sum??null;
   journeys.push({id:`${CITY_PREFIX}${city.region.id}.${leg.id}`,from,to,means:leg.means,minutes:leg.minutes,label:`Travel to ${names.get(leg.to)||leg.to} by ${leg.means}`,
    description:`Take the ${leg.means} to ${names.get(leg.to)||leg.to}.`,report:`You arrive at ${names.get(leg.to)||leg.to}.`,...(Number.isSafeInteger(fare)&&fare>=0?{fare}:{}),...(leg.hours?{hours:[...leg.hours]}:{})});
  }
 }
 return {...pack,places:[...pack.places,...places],journeys:{...(pack.journeys||{}),journeys:[...(pack.journeys?.journeys||[]),...journeys]}};
}
// The region the lead stands in, read for his hour and purse; null away from every city pack place.
export function lotmRegionAt(placeIdNow,{hour,money,restrictions=[],list=cities}={}){
 for(const city of list)if(placeIdNow.startsWith(`${CITY_PREFIX}${city.region.id}.`))
  return readRegion(city.region,{reputation:0,hour,money,restrictions});
 return null;
}
// A city leg is closed for the day when an event restriction halts it (hour-less curfews stay notices).
export function journeyUnderRestrictions(offer,restrictions,hour){
 const m=offer.id.startsWith(CITY_PREFIX)&&/^lotm\.city\.[^.]+\.(.+)$/.exec(offer.id);
 if(!m||!restrictions.length)return offer;
 const gate=openUnder(restrictions,{leg:m[1],means:offer.means,hour});
 return gate.open?offer:{...offer,eligible:false,reasons:[...offer.reasons,"Halted by the day's restriction."]};
}
