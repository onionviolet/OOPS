// Physical topology shared by the native site and actual travel-job admission.
import {check} from './basics.js';
import {mix32} from './seeded_streams.js';
export const DRAINAGE_WORLD='base.frontier',DRAINAGE_PREFIX='frontier.drainage.';
export const drainageLocation=i=>DRAINAGE_PREFIX+i;
export const drainageRoom=id=>typeof id==='string'&&id.startsWith(DRAINAGE_PREFIX)&&/^[0-5]$/.test(id.slice(DRAINAGE_PREFIX.length))?Number(id.slice(DRAINAGE_PREFIX.length)):null;
export const drainageEdges=branch=>[[0,1],[1,2],[2,3],[branch,4],[1,5]];
export function drainageLayout(seed){
 check(Number.isInteger(seed)&&seed>=0&&seed<=0xffffffff,'Invalid drainage seed.');
 const rotation=seed%4,flip=!!(seed&4),branch=mix32(seed^0x1592)%2?1:2,base=[[0,0],[1,0],[1,1],[1,2],[branch===1?2:0,branch===1?0:1],[2,0]],edges=drainageEdges(branch);
 // The storage branch and optional side niche have different actual footprints.
 if(branch===1)base[4]=[1,-1];
 const rooms=base.map(([x,y],i)=>{if(flip)x=-x;for(let n=0;n<rotation;n++)[x,y]=[-y,x];return {id:i,x,y,kind:['entry','mechanism','passage','pressure',mix32(seed^0xa164)%3?'dry':'rubble','deposit'][i]};});
 return {rooms,edges};
}
export function drainageGate(s){return s.worlds[DRAINAGE_WORLD].facts['drainage.brace']===true||s.worlds[DRAINAGE_WORLD].facts['drainage.rope']===true||s.worlds[DRAINAGE_WORLD].facts['drainage.crate']===3||Object.entries(s.simulation?.people||{}).some(([id,p])=>id!=='player'&&p.life==='alive'&&p.location===drainageLocation(3)&&s.actors[id]?.worldId===DRAINAGE_WORLD&&(p.body?.massKg??(p.body?.form==='human'?70:0))>=20);}
