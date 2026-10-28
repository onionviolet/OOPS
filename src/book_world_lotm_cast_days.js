// Supplementary private data shares the manifest's fetch-if-present convention.
// No world registration, source rows or Node filesystem path enters the bundle.
import {deepFreeze} from './basics.js';
import {validateLotmCast} from './book_world_lotm_cast.js';
export async function loadPrivateCast(kind,validate,fetchFile=globalThis.fetch){
 try{
  const manifest=await fetchFile('private_packs/manifest.json');if(!manifest.ok)return null;
  const data=await manifest.json(),path=`${kind}-cast/cast.json`;
  if(data.schema!==1||!data.supplements?.includes(path))return null;
  const file=await fetchFile('private_packs/'+path);if(!file.ok)return null;
  const pack=await file.json();if(validate(pack).length)return null;
  if(kind==='lotm'&&(!pack.bindings?.days?.length||!pack.host?.profile||!pack.host?.situation))return null;
  return deepFreeze(pack);
 }catch{return null;}
}
let loadedCast=null;
export const getPrivateLotmCast=()=>loadedCast;
const listeners=[];
export function onCastLoaded(fn){listeners.push(fn);if(loadedCast)fn(loadedCast);}
// Start I/O without making this module (and the application's boot) asynchronous.
const loading=loadPrivateCast('lotm',validateLotmCast).then(pack=>{
 loadedCast=pack;if(pack)for(const fn of listeners)fn(pack);return pack;
});
export const whenCastLoaded=()=>loading;
export const lotmCastDays=()=>loadedCast?.bindings?.days||[];
export const lotmCastDayCount=()=>Math.max(0,...lotmCastDays().map(r=>r.day));
export const lotmCastDayByScene=()=>Object.fromEntries(lotmCastDays().map(r=>[r.scene,r]));
export const lotmCastClockBindings=()=>loadedCast?.bindings?.clocks||[];
export const lotmCastSchedule=()=>loadedCast?.bindings?.schedule||[];
export const lotmCastBoundBeats=()=>loadedCast?.bindings?.beats||[];
export function lotmCastSceneAt(locator){
 const privateLotmCast=getPrivateLotmCast();
 const match=/第(\d+)章 p(\d+)/.exec(locator||'');if(!match)return null;
 const ch=Number(match[1]),p=Number(match[2]);
 const row=privateLotmCast?.bindings?.addressStarts?.findLast(([c,n])=>c<ch||c===ch&&n<=p);
 return ch<=privateLotmCast?.slice.toChapter&&row?lotmCastDayByScene()[`${privateLotmCast.slice.firstScene.replace(/[^.]+$/,'')}${row[2]}`]:null;
}
