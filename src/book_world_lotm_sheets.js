// L8 host consumer (read side only): the dated character sheet of a person the lead knows, as of the chapter his
// run has reached. character_sheets owns the read model (AR3); the UI wave renders it. Private pack, fetch-if-present.
import {deepFreeze} from './basics.js';
import {sheetAsOf} from './character_sheets.js';
const PATH='lotm-sheets/sheets.json';
export async function loadPrivateSheets(fetchFile=globalThis.fetch){
 try{
  const manifest=await fetchFile('private_packs/manifest.json');if(!manifest.ok)return null;
  const data=await manifest.json();if(data.schema!==1||!data.supplements?.includes(PATH))return null;
  const file=await fetchFile('private_packs/'+PATH);if(!file.ok)return null;
  const pack=await file.json();return pack.schema===1&&pack.sheets&&typeof pack.sheets==='object'?deepFreeze(pack):null;
 }catch{return null;}
}
let loaded=null;
export const setPrivateSheets=pack=>{loaded=pack;};
loadPrivateSheets().then(pack=>{loaded??=pack;});
// The lead's furthest reached chapter, from the cast pack's scene starts and day windows ('b1:CH'; this run is volume 1).
export function leadChapterRef(state,cast){
 const days=cast?.bindings?.days||[],starts=cast?.bindings?.addressStarts||[],at=state.lotm?.initializedAt;
 if(!starts.length||at==null)return null;
 const prefix=cast.slice.firstScene.replace(/[^.]+$/,''),chapterOf=new Map(starts.map(([c,,scene])=>[`${prefix}${scene}`,c]));
 let best=null;
 for(const d of days)if(state.clock>=at+(d.day-1)*1440+d.from){const c=chapterOf.get(d.scene);if(c!=null&&(best==null||c>best))best=c;}
 return best==null?null:`b1:${best}`;
}
// Sheets for the given cast person ids, only where the pack holds one. Gated entries stay hidden (counted, never shown).
export function lotmSheetsFor(state,cast,personIds,{pack=loaded,openGates=[]}={}){
 const ref=pack&&leadChapterRef(state,cast);if(!ref)return {};
 return Object.fromEntries(personIds.flatMap(id=>{const sheet=pack.sheets[id];const view=sheet&&sheetAsOf(sheet,ref,{openGates});return view?[[id,view]]:[];}));
}
