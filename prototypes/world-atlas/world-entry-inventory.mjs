// Public entry directions, independent of reader output or inferred place access.
// Typed entries are registered by src/book_world_beginning_registration.js;
// Ryan is registered by src/capability_runs/index.js, not the Beginning picker.
import {playStatus,routeEvidence} from './play-status.mjs';
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
 return 'Registered world';
}
export function worldEntryStatus(w, report){
 if(w.source||w.readOnly)return playStatus();
 const receipt=routeEvidence(report,w.nativeEntry?.evidenceHref);
 return playStatus({receipt,gap:w.registeredOnly?'An exercised entry into this registered group has not been cited.':
  'A matching life, entry action and build receipt is needed for '+w.label+'.'});
}
export const hasNativeEntry=w=>Boolean(w.nativeEntry);
const countLabel=(count,singular,plural=singular+'s')=>count+' '+(count===1?singular:plural);
export const overviewSummary=(worlds,readingOnly)=>countLabel(worlds.filter(hasNativeEntry).length,'world')+' with native routes listed in this Atlas · '+countLabel(worlds.filter(w=>w.source).length,'source-game reference')+' · '+countLabel(readingOnly.length,'reading world')+' without a listed native entry';
export const overviewRows=[['village','lotm','mol'],['hp','ri','ss','paradise'],['worm','sup','pr'],['proto23','testpacks','frontier','library'],['yair','proto23-src','arkivia']];

export const worldNodeLabel=(world,count)=>world.label+' · '+(count||!world.nativeEntry?count:world.nativeEntry.kind==='typed-beginning'?'Beginning':'Capability run');

export const SOURCE_GAMES = {
 yair:{label:'Yet Another Idle RPG (upstream)',note:'Upstream geography from git, compared with what OOPS registers today'},
 proto23:{label:'Proto23 (original)',note:'The original single-file game, read statically. OOPS keeps its own Proto23 reference places separately.'},
 arkivia:{label:'Arkivia',note:'Proto23-inspired browser RPG and a source of design ideas.'},
};

export function worldRoster(data, title=id=>id){
 const worlds=withNativeWorldEntries([
  {id:'village',label:'The Village',note:'Native region, where a fresh game starts',game:'oops',views:['places','making']},
  {id:'lotm',label:'Lord of the Mysteries',cast:'lotm',group:'Lord of the Mysteries',views:['places','scenes','things','making','locations','districts','reading']},
  {id:'mol',label:'Mother of Learning',cast:'mol',group:'Mother of Learning',views:['places','scenes','things','making','locations','encounter','reading']},
  {id:'hp',label:'Harry Potter',group:'Harry Potter',views:['locations','things','making','reading']},
  {id:'ri',label:'Reverend Insanity',group:'Reverend Insanity',views:['locations','things','making','reading']},
  {id:'ss',label:'Shadow Slave',group:'Shadow Slave',views:['locations','things','making','reading']},
  {id:'paradise',label:'Reincarnation Paradise',group:'Reincarnation Paradise',views:['locations']},
  {id:'proto23',registeredOnly:true,label:'Proto23 reference',group:'Proto23 reference',views:['locations']},
  {id:'testpacks',registeredOnly:true,label:'Private test packs',group:'Private test packs',views:['locations']},
  {id:'yair',label:SOURCE_GAMES.yair.label,source:'yair',game:'yair',note:SOURCE_GAMES.yair.note,views:['source','making']},
  {id:'proto23-src',label:SOURCE_GAMES.proto23.label,source:'proto23',note:SOURCE_GAMES.proto23.note,views:['source']},
  {id:'arkivia',label:SOURCE_GAMES.arkivia.label,source:'arkivia',note:SOURCE_GAMES.arkivia.note,views:['source']},
  {id:'frontier',registeredOnly:true,label:'Frontier outposts',note:'Registered, but no route from the Village at a fresh start',group:'Frontier, not reached from the Village',views:['locations']},
 ]);
 for(const f of data.findings?.worlds||[]){
  if(!f.read)continue;
  let world=worlds.find(w=>w.id===f.world);
  if(!world){world={id:f.world,label:title(f.world),readOnly:true,note:'Read by the batch readers; no native entry listed',views:['things','making','reading']};worlds.push(world);}
  if(f.counts.places?.distinct&&!world.views.includes('places'))world.views.splice(world.views.indexOf('things')+1,0,'places');
  if(f.counts.people?.distinct&&!world.views.includes('people'))world.views.splice(world.views.indexOf('things')+1,0,'people');
  if(f.powers||f.counts.abilities?.distinct)world.views.splice(world.views.indexOf('making')+1,0,'powers');
  if(f.groups||f.counts.groups?.distinct)world.views.splice(world.views.indexOf('people')>=0?world.views.indexOf('people')+1:world.views.indexOf('things')+1,0,'groups');
  const reading=world.views.indexOf('reading');
  if(f.sceneIndex)world.views.splice(reading<0?world.views.length:reading,0,'reader-scenes');
 }
 for(const world of worlds){
  if(data.books?.[world.cast]?.people?.length&&!world.views.includes('people'))world.views.splice(world.views.indexOf('things')+1,0,'people');
  if(data.placeActivities?.[world.id]?.length&&!world.views.includes('places'))world.views.unshift('places');
  if(!world.source&&!world.views.includes('rules'))world.views.push('rules');
 }
 return worlds;
}
