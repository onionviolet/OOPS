// A source-pack adapter shared by synthetic worlds and the current cast host.
// Source order IDs and locators survive; missing precision stays a reported gap.
import {hashStreamSeed} from './hash_rng.js';
import {createConstraintStore,constraintProvenance} from './constraint_store.js';
export const packRevision=pack=>String(pack?.revision??'unversioned');
export function constraintsFromPack(pack,{actor=id=>id,place=id=>id}={}){
 const days=new Map((pack.bindings?.days||[]).map(r=>[r.scene,r])),rows=[],gaps=[];
 const window=(day,from=0,to=1440,until=day)=>Number.isFinite(day)?{from:(day-1)*1440+from,to:(until-1)*1440+to}:null;
 const add=(r,what,w,id)=>{
  if(!w){gaps.push({id,what,missing:'window',locator:r.locator});return;}
  if(what==='anchor'&&!r.id&&rows.some(row=>row.id===id))return;
  rows.push({id,actor:actor(r.actor),what,window:w,where:place(r.place),needs:r.needs||null,
   produces:(r.produces||r.effects||[]).map(e=>({...e,key:e.key||e.fact})),locator:r.locator,
   provenance:constraintProvenance(r),tier:pack.people?.find(p=>p.id===r.actor)?.tier||'role',
   ...(r.reason?{reason:r.reason}:{}),...(r.recurrence?{recurrence:r.recurrence}:{}),...(r.from!=null?{from:r.from,to:r.to}:{})});
 };
 for(const r of pack.bindings?.beats||pack.beats||[]){const d=days.get(r.scene);add(r,'beat',d?window(d.day,d.from,d.to):window(r.dayIndex),r.id);}
 for(const r of pack.bindings?.schedule||pack.schedule||[])add(r,'schedule',window(r.day,r.from,r.to,r.until??r.day),r.id);
 for(const r of pack.anchors||[])add(r,'anchor',window(r.dayWindow?.[0],0,1440,r.dayWindow?.[1]),r.id||`anchor:${r.actor}:${r.place}:${r.dayWindow?.join(':')||'unknown'}:${hashStreamSeed(0,JSON.stringify([r.locator,r.label,r.dateLabel]))}`);
 for(const r of pack.contracts||[])add(r,'contract',r.window||window(r.day,r.from,r.to),r.id);
 if(!pack.contracts?.length)gaps.push({what:'contracts',missing:'structured fight contracts'});
 return {store:createConstraintStore(rows),gaps,revision:packRevision(pack)};
}
