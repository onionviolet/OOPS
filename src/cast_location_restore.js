// Native definition hydration, not world state. Placeholder objects retain their
// identity and availability while a late optional source supplies display text.
export function createCastLocationRestore({locations,createLocation,onResolved=()=>{}}){
 const pending=new WeakSet();
 const retain=id=>{
  if(locations[id])return locations[id];
  const place=createLocation({id,name:'Cast place unavailable',description:'Restore the private cast pack to resume this place.'});
  pending.add(place);locations[id]=place;return place;
 };
 const ensure=row=>{
  if(!row)return null;
  let place=locations[row.id];
  if(!place){place=createLocation({id:row.id,name:row.name,description:'A place in Tingen.',is_temperature_static:true,static_temperature:20,light_level:'normal'});locations[row.id]=place;return place;}
  if(pending.delete(place)){
   place.name=row.name;place.description='A place in Tingen.';
   place.getDescription=()=>place.description;
   onResolved(place);
  }
  return place;
 };
 return {retain,ensure};
}
