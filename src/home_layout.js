// Spatial layer for homes (G22; AD1, AD33 exception 2026-10-23, AD38). Pure and serializable. A layout puts
// a home's existing fixtures (by slot) on a small grid; warmth, qi and turbid air diffuse from them, and a
// bed's cell reads the field. Fixtures stay owned by the home record (one authority); a layout only says
// where each one stands. A home without a layout has no spatial term at all. Every number is a dial per
// world with an in-world reason; a world with no entry has no field, so nothing changes there.
export const LAYOUT_FAMILY='home_layout@1';
export const GRIDS={manor:{w:4,h:3}};
export const PLACEABLE={bed:'Bed',hearth:'Hearth',bookcase:'Bookcase',qi:'Condensate cradle'};
// Default stand: far corners, so adopting a layout changes nothing until the player moves something.
export const DEFAULT_AT={manor:{bed:[0,0],hearth:[3,2],bookcase:[1,2],qi:[2,2]}};
// Qi veins are fixed features of a place, data per home in worlds that have qi.
export const VEINS={};
const WORLD_FIELD={
 warmth:{src:{value:1,why:'A lit hearth is the warmest cell in the room.'},reach:{value:0.8,why:'Heat carries along floors and through open doors.'},weight:{value:0.5,why:'A warm bed holds sleep better.'}},
 turbid:{src:{value:1,why:'Hearth smoke is the dirtiest air in the room.'},reach:{value:0.4,why:'Smoke thins within a step or two of the fire.'},weight:{value:3,why:'Sleeping in smoke leaves a body no better than a cold one.'}},
 qi:{src:{value:1,why:'A vein is a fixed seep of qi in the floor.'},reach:{value:0.6,why:'Qi pools in open space more than smoke does.'},weight:{value:0,why:'This world has no qi to sleep in; the dial is zero here.'}},
 maxDelta:{value:0.3,why:'A room can help or hurt sleep only so far; the bed and roof still matter most.'},
 moveFee:{value:2,why:'Hauling a hearth stone or a bed frame across a room takes a hand for coin or a favour.'},
 steps:{value:10,why:'Enough relaxation steps for the field to settle on a grid this small.'},
};
// Worlds absent from this table have no spatial layer.
export const LAYOUT_DIALS={'base.frontier':WORLD_FIELD};
export const dialsFor=world=>LAYOUT_DIALS[world]||null;
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const key=(x,y)=>`${x},${y}`;
export function freshLayout(home){
 const g=GRIDS[home],at=DEFAULT_AT[home];if(!g)return null;
 return {w:g.w,h:g.h,at:structuredClone(at),moves:0};
}
export const emptyLayouts=()=>({family:LAYOUT_FAMILY,homes:{}});
// Slots that count: placed AND still installed in the home. A removed fixture's stale cell is ignored.
export const activeSlots=(layout,fixtures)=>Object.keys(layout.at).filter(s=>PLACEABLE[s]&&fixtures?.[s]);
function sources(layout,fixtures,home,dials,qiPowered=false){
 const out={warmth:new Map(),turbid:new Map(),qi:new Map()};
 const hearth=activeSlots(layout,fixtures).includes('hearth')&&layout.at.hearth;
 if(hearth){out.warmth.set(key(...hearth),dials.warmth.src.value);out.turbid.set(key(...hearth),dials.turbid.src.value);}
 const power=qiPowered===true?1:typeof qiPowered==='number'&&Number.isFinite(qiPowered)?Math.max(0,qiPowered):0;
 if(power&&fixtures?.qi&&layout.at.qi)out.qi.set(key(...layout.at.qi),dials.qi.src.value*power);
 for(const v of VEINS[home]||[])out.qi.set(key(...v),dials.qi.src.value);
 return out;
}
// Steady-state relaxation: a cell is its own source plus `reach` times the mean of its in-grid neighbours.
function diffuse(w,h,src,reach,steps){
 let f=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>src.get(key(x,y))||0));
 for(let i=0;i<steps;i++){
  const n=f.map(r=>r.slice());
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const nb=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b])=>a>=0&&b>=0&&a<w&&b<h);
   n[y][x]=(src.get(key(x,y))||0)+reach*nb.reduce((s,[a,b])=>s+f[b][a],0)/nb.length;
  }
  f=n;
 }
 return f;
}
export function fieldOf(layout,fixtures,home,world,qiPowered=false){
 const d=dialsFor(world);if(!d||!layout)return null;
 const s=sources(layout,fixtures,home,d,qiPowered);
 return {warmth:diffuse(layout.w,layout.h,s.warmth,d.warmth.reach.value,d.steps.value),
  turbid:diffuse(layout.w,layout.h,s.turbid,d.turbid.reach.value,d.steps.value),
  qi:diffuse(layout.w,layout.h,s.qi,d.qi.reach.value,d.steps.value)};
}
// Sleep-quality term for the bed's cell, in [-maxDelta, +maxDelta]. 0 with no layout, no dial, no placed bed.
export function bedDelta(layout,fixtures,home,world){
 const d=dialsFor(world);if(!d||!layout||!activeSlots(layout,fixtures).includes('bed'))return 0;
 const f=fieldOf(layout,fixtures,home,world),[x,y]=layout.at.bed;
 const raw=d.warmth.weight.value*f.warmth[y][x]-d.turbid.weight.value*f.turbid[y][x]+d.qi.weight.value*f.qi[y][x];
 return Math.round(clamp(raw,-d.maxDelta.value,d.maxDelta.value)*1000)/1000;
}
export function cellReadout(layout,fixtures,home,world,qiPowered=false){
 const f=fieldOf(layout,fixtures,home,world,qiPowered);if(!f)return null;
 const r=v=>Math.round(v*100)/100;
 return f.warmth.map((row,y)=>row.map((_,x)=>({x,y,warmth:r(f.warmth[y][x]),turbid:r(f.turbid[y][x]),qi:r(f.qi[y][x])})));
}
// Plans moving one fixture to a cell. A cell holds one fixture; the fee is a dial, 0 when nothing moves.
export function planMove(layout,fixtures,home,world,{slot,x,y}){
 const d=dialsFor(world);
 if(!d)return {eligible:false,reason:'This world has no spatial layer for homes.'};
 if(!layout)return {eligible:false,reason:'Lay out this home first.'};
 if(!PLACEABLE[slot]||!fixtures?.[slot])return {eligible:false,reason:'That fixture is not installed here.'};
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=layout.w||y>=layout.h)return {eligible:false,reason:'That cell is outside the room.'};
 const cur=layout.at[slot];
 if(cur&&cur[0]===x&&cur[1]===y)return {eligible:false,reason:'It already stands there.'};
 const holder=activeSlots(layout,fixtures).find(s=>s!==slot&&layout.at[s][0]===x&&layout.at[s][1]===y);
 if(holder)return {eligible:false,reason:`${PLACEABLE[holder]} already stands there.`};
 const next=structuredClone(layout);next.at[slot]=[x,y];next.moves++;
 const before=bedDelta(layout,fixtures,home,world),after=bedDelta(next,fixtures,home,world);
 return {eligible:true,slot,x,y,fee:d.moveFee.value,before,after,next,
  summary:`${PLACEABLE[slot]} to ${x+1},${y+1}: sleep ${before>=0?'+':''}${before.toFixed(2)} → ${after>=0?'+':''}${after.toFixed(2)}, ${d.moveFee.value} coins`};
}
export function validateLayouts(s){
 if(s==null)return;
 const bad=m=>{throw Error('Home layout: '+m);};
 if(s.family!==LAYOUT_FAMILY||!s.homes||typeof s.homes!=='object'||Array.isArray(s.homes))bad('wrong family or shape.');
 for(const [id,l] of Object.entries(s.homes)){
  const g=GRIDS[id];if(!g)bad('unknown home.');
  if(l.w!==g.w||l.h!==g.h||!Number.isSafeInteger(l.moves)||l.moves<0||!l.at||typeof l.at!=='object')bad('bad grid.');
  const seen=new Set();
  for(const [slot,c] of Object.entries(l.at)){
   if(!PLACEABLE[slot])bad('unknown slot.');
   if(!Array.isArray(c)||c.length!==2||!c.every(Number.isInteger)||c[0]<0||c[1]<0||c[0]>=g.w||c[1]>=g.h)bad('cell outside the room.');
   const k=key(...c);if(seen.has(k))bad('two fixtures share a cell.');seen.add(k);
  }
 }
}
export function migrateLayouts(slice){
 if(!slice||slice.family!==LAYOUT_FAMILY||!slice.homes)return null;
 return {family:LAYOUT_FAMILY,homes:{...slice.homes}};
}
