// Public entry directions, independent of reader output or inferred place access.
// Typed entries are registered by src/book_world_beginning_registration.js;
// Ryan is registered by src/capability_runs/index.js, not the Beginning picker.
export const NATIVE_WORLD_ENTRIES=Object.freeze([
 {id:'ri',label:'Reverend Insanity',evidenceHref:'#workbench/play-evidence/fang-first-night',evidenceLabel:'Fang Yuan’s playable choices and evidence',kind:'typed-beginning',packId:'book.ri.lead',choice:'Reverend Insanity · the returned clan youth',route:'From a fresh Village life, open Beginning, choose Reverend Insanity · the returned clan youth, then Confirm arrival. Play the academy and first-infusion opening before the optional bed and partial-reserve choices.',scope:'The returned youth’s bounded early route and optional first night at his guardians’ house. Reader places are not all travel destinations.'},
 {id:'worm',label:'Worm',evidenceHref:'#workbench/play-evidence/taylor-backpack-bus',evidenceLabel:'Taylor’s playable choices and evidence',kind:'typed-beginning',packId:'book.worm.lead',choice:'Worm · Taylor Hebert',route:'From a fresh Village life, open Beginning, choose Worm · Taylor Hebert, then Confirm arrival.',scope:'Taylor’s washroom opening and its native actions. Reader places are not all travel destinations.'},
 {id:'sup',label:'Super Supportive',evidenceHref:'#workbench/play-evidence/alden-bedside-choice',evidenceLabel:'Alden’s playable choices and evidence',kind:'typed-beginning',packId:'book.sup.lead',choice:'Super Supportive · Alden Thorn',route:'From a fresh Village life, open Beginning, choose Super Supportive · Alden Thorn, then Confirm arrival.',scope:'Alden’s hospital visitor opening, not a full world itinerary. Reader places are not all travel destinations.'},
 {id:'pr',label:'The Perfect Run',evidenceHref:'#workbench/play-evidence/ryan-wyvern-visit',evidenceLabel:'Ryan’s playable choices and evidence',kind:'capability-run',runId:'ryan',choice:'Ryan Romano · New Rome',route:'From a fresh Village life, open Capability runs, choose Ryan Romano · New Rome, then Begin this run.',scope:'An independent saved capability run. This does not move the Village character into a typed Beginning or expose all reader places.'},
]);
export function withNativeWorldEntries(worlds){
 const result=worlds.map(w=>({...w,views:[...w.views]}));
 for(const entry of NATIVE_WORLD_ENTRIES){let world=result.find(w=>w.id===entry.id);if(!world){world={id:entry.id,label:entry.label,views:['things','making','reading']};result.push(world)}Object.assign(world,{nativeEntry:entry,readOnly:false});}
 return result;
}
export function worldEntryRole(w){
 if(w.source)return 'Source game · reference';
 if(w.nativeEntry)return w.nativeEntry.kind==='typed-beginning'?'Native Beginning · bounded opening':'Independent capability run';
 if(w.registeredOnly)return 'Registered content · entry not listed';
 if(w.readOnly)return 'Reader findings · no native entry listed';
 return 'Native world';
}
export const hasNativeEntry=w=>!w.source&&!w.registeredOnly&&!w.readOnly;
const countLabel=(count,singular,plural=singular+'s')=>count+' '+(count===1?singular:plural);
export const overviewSummary=(worlds,readingOnly)=>countLabel(worlds.filter(hasNativeEntry).length,'world')+' with native routes listed in this Atlas · '+countLabel(worlds.filter(w=>w.source).length,'source-game reference')+' · '+countLabel(readingOnly.length,'reading world')+' without a listed native entry';
export const overviewRows=[['village','lotm','mol'],['hp','ri','ss','paradise'],['worm','sup','pr'],['proto23','testpacks','frontier','library'],['yair','proto23-src','arkivia']];

export const worldNodeLabel=(world,count)=>world.label+' · '+(count||!world.nativeEntry?count:world.nativeEntry.kind==='typed-beginning'?'Beginning':'Capability run');
