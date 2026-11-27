import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {buildFindIndex,searchAtlas,projectFindRoutes} from '../prototypes/world-atlas/atlas-find.mjs';
import {loadNativePlayEvidence,NATIVE_EVIDENCE_CARDS} from '../prototypes/world-atlas/atlas-native-evidence.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const publicReport=loadNativePlayEvidence(root);
const routes=(report,q,world='')=>searchAtlas(buildFindIndex({playEvidence:report}),{q,type:'routes',world}).groups[0].rows;
test('seven existing public route cards are searchable by action/name with exact direct routes and world filters',async()=>{
 const cards=NATIVE_EVIDENCE_CARDS.filter(c=>!['taylor-backpack-bus','alden-bedside-choice','ryan-wyvern-visit','fang-first-night'].includes(c.id));
 assert.equal(cards.length,7);const all=await publicReport,report={...all,entries:all.entries.filter(e=>cards.some(c=>c.id===e.id))};
 assert.equal(projectFindRoutes(report).length,7);
 for(const [q,id,world] of [['Klein Moretti','tingen-klein','lotm'],['Su Xiao','su-xiao-recruitment','paradise'],['Loaded Dice','loaded-dice','village'],['Edwin','tingen-local','lotm']]){
  const result=routes(report,q,world).find(r=>r.id===id);assert.ok(result,q);assert.equal(result.href,'#workbench/play-evidence/'+id);
  assert.match(result.status,/Verified receipts/);assert.equal(routes(report,q,'worm').length,0);
 }
 const dice=routes(report,'Loaded Dice').find(r=>r.id==='loaded-dice');assert.match(dice.status,/tested on another build/);
 assert.equal(searchAtlas(buildFindIndex({playEvidence:report}),{q:'Reincarnation Paradise',type:'routes'}).groups[0].rows[0].id,'su-xiao-recruitment');
});
test('title overlay adds direct backpack and Alden routes while preserving documented scope',async()=>{
 if(NATIVE_EVIDENCE_CARDS.length===7)return; // primary without the separately owned title-card overlay
 const report=await publicReport;assert.equal(report.entries.length,11);
 const taylor=routes(report,'backpack','worm').find(r=>r.id==='taylor-backpack-bus');assert.ok(taylor);assert.equal(taylor.href,'#workbench/play-evidence/taylor-backpack-bus');assert.equal(taylor.playStatus,'Partial');assert.match(taylor.status,/Evidence unavailable/);
 assert.equal(routes(report,'Taylor Hebert','worm')[0].id,'taylor-backpack-bus');
 const alden=routes(report,'Alden Thorn','sup')[0];assert.equal(alden.href,'#workbench/play-evidence/alden-bedside-choice');assert.equal(alden.playStatus,'Playable');assert.match(alden.status,/Documented play route.*authored record/);assert.doesNotMatch(alden.status,/Verified/);
 assert.equal(routes(report,'Super Supportive','sup')[0].id,'alden-bedside-choice');assert.equal(routes(report,'backpack','sup').length,0);
});
test('failed or changed evidence withholds outcome claims without inventing absence or discarding documented directions',()=>{
 const report={entries:[{id:'one',title:'Bag route',pov:'Taylor Hebert',where:'Open Beginning and choose the bag.',relatedHref:'#world/worm/things',status:'unavailable',outcome:'UNVERIFIED_OUTCOME',privateSave:'PRIVATE_VALUE',receipts:[{status:'changed'}]}]};
 const result=routes(report,'bag','worm')[0];assert.equal(result.href,'#workbench/play-evidence/one');assert.match(result.status,/Evidence unavailable.*played result withheld/);assert.doesNotMatch(JSON.stringify(buildFindIndex({playEvidence:report})),/UNVERIFIED_OUTCOME|PRIVATE_VALUE/);
 assert.equal(routes(undefined,'bag').length,0);assert.deepEqual(projectFindRoutes({entries:[{...report.entries[0],private:true}]}),[]);
});
test('ordinary Find remains lazy, route validation is once per index, and UI exposes its own filter',async()=>{
 const serve=await readFile(new URL('../prototypes/world-atlas/serve.mjs',import.meta.url),'utf8'),view=await readFile(new URL('../prototypes/world-atlas/atlas-find-view.mjs',import.meta.url),'utf8');
 assert.match(serve,/if\(atlasFindIndex\)return atlasFindIndex/);assert.match(serve,/if\(request.q.trim\(\)\)index=await findIndex\(\)/);assert.match(serve,/playEvidence=await loadNativePlayEvidence\(root\)/);
 assert.match(view,/\["routes", "Game route evidence"\]/);assert.match(view,/playableRoutesUnavailable/);
});

test('every route search hit resolves through the actual Atlas router to native evidence, with readable clipped directions',async()=>{
 const {runInNewContext}=await import('node:vm');
 const index=await readFile(new URL('../prototypes/world-atlas/index.html',import.meta.url),'utf8');
 const routeCode=index.slice(index.indexOf('const SECTIONS='),index.indexOf("const trail=document.querySelector"));
 const report=await publicReport;
 for(const row of projectFindRoutes(report)){
  const location={hash:row.href};const result=runInNewContext(routeCode+';route()',{location,VIEW_LABELS:{},worldById:new Map(),history:{}});
  assert.equal(result.section,'workbench',row.href);assert.equal(result.view,'play-evidence',row.href);
  assert.equal(location.hash.split('/')[2],row.id,'existing evidence view reads the exact card ID');
 }
 assert.match(index,/if\(r.view==='play-evidence'\)return nativePlayEvidenceView\(\{main\}\)/);
 const title=routes(report,'backpack','worm')[0];if(title){assert.match(title.summary,/…$/);assert.ok(title.summary.length<=221);assert.ok(title.summary.startsWith('From a fresh Village life'));}
});

test('merged Atlas routes keep exact deep links under one visible home per concept',async()=>{
 const {runInNewContext}=await import('node:vm');
 const html=await readFile(new URL('../prototypes/world-atlas/index.html',import.meta.url),'utf8');
 const routeCode=html.slice(html.indexOf('const SECTIONS='),html.indexOf('const trail=document.querySelector'));
 for(const [old,canonical,view,key,value] of [
  ['#cheats','#library/cheats','cheats','cheatTab',null],
  ['#cheats/list/CTC64','#library/cheats/CTC64','cheats','cheatId','CTC64'],
  ['#cheats/candidates','#library/cheats/candidates','cheats','cheatTab','candidates'],
  ['#ideas','#workbench/ideas/registry','ideas','ideaTab','registry'],
  ['#ideas/craft%23MKC89?from=old','#workbench/ideas/registry/craft%23MKC89?from=old','ideas','ideaFocus','craft#MKC89'],
  ['#workbench/implementation','#workbench/handoffs/replays','handoffs','handoffTab','replays'],
 ]){
  const location={hash:old},history={replaceState:(_state,_title,hash)=>{location.hash=hash;}};
  const result=runInNewContext(routeCode+';({result:route(),sections:SECTIONS})',{location,history,VIEW_LABELS:{},worldById:new Map()});
  assert.equal(location.hash,canonical);assert.equal(result.result.view,view);assert.equal(result.result[key],value);
  assert.ok(!result.sections.some(row=>['cheats','ideas'].includes(row.id)));
  assert.ok(!result.sections.find(row=>row.id==='workbench').views.includes('implementation'));
 }
});
