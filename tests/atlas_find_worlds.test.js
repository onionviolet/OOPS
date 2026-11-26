import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {fileURLToPath} from 'node:url';
import {projectFindSubjects,readFindSubjects,buildFindIndex,searchAtlas,findWorldChoices} from '../prototypes/world-atlas/atlas-find.mjs';
import {entityLibrary} from '../prototypes/world-atlas/entity-library.mjs';import {loadWorldRules} from '../prototypes/world-atlas/world-rules.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const actual=(async()=>{const rules=loadWorldRules(root),snapshot=JSON.parse(await readFile(new URL('../work/atlas-snapshot/snapshot.json',import.meta.url),'utf8'));const subjects=await readFindSubjects({readers:root+'/work/atlas-snapshot/readers',library:entityLibrary([],new Map()),books:snapshot.books});return {subjects:subjects.rows,rules,index:buildFindIndex({subjects:subjects.rows,rules})};})();
test('actual duplicate RI labels have separate demonstrated scopes and an explicit shared title filter',async()=>{
 const {subjects,rules,index}=await actual;
 assert.ok(subjects.some(r=>r.world==='ri'&&r.origin==='reader'));assert.ok(rules.records.some(r=>r.world==='reverend-insanity'&&r.id==='gu.rank.precursor'));
 const choices=index.worlds.filter(w=>['ri','reverend-insanity','title:ri'].includes(w.id));assert.equal(choices.length,3);assert.deepEqual(choices.map(w=>w.id),['title:ri','ri','reverend-insanity']);const at=index.worlds.findIndex(w=>w.id==='title:ri');assert.deepEqual(index.worlds.slice(at,at+3).map(w=>w.id),['title:ri','ri','reverend-insanity']);assert.equal(new Set(choices.map(w=>w.label)).size,3);
 assert.match(choices.find(w=>w.id==='ri').label,/reader and play records/);assert.match(choices.find(w=>w.id==='reverend-insanity').label,/recorded rules/);assert.deepEqual(choices.find(w=>w.id==='title:ri').members,['ri','reverend-insanity']);
 for(const query of ['Gu','rank','Fang Yuan']){
  const runs=['ri','reverend-insanity','title:ri'].map(world=>searchAtlas(index,{q:query,world,limit:20}));assert.equal(runs[2].total,runs[0].total+runs[1].total);
  assert.ok(runs[2].groups.flatMap(g=>g.rows).every(r=>['ri','reverend-insanity'].includes(r.world)));
 }
 const fang=searchAtlas(index,{q:'Fang Yuan',world:'title:ri'}).groups.find(g=>g.id==='subjects').rows[0];assert.equal(fang.href,'#world/ri/things/ri.person.fang-yuan');assert.equal(fang.origin,'reader');
 const rule=searchAtlas(index,{q:'rank',world:'reverend-insanity'}).groups.find(g=>g.id==='rules').rows[0];assert.match(rule.href,/^#library\/rules\/reverend-insanity\//);
 assert.ok(searchAtlas(index,{q:'Reverend Insanity',world:'title:ri'}).total>3,'known title discovers source subjects without guessing ri');
});
test('body-class dataset labels remain independent cross-world scopes, without asserting Gu means only RI',async()=>{
 const {index,subjects}=await actual;
 for(const id of ['gu','person','plant']){const count=subjects.filter(r=>r.world===id).length;assert.ok(count>0);assert.equal(index.rows.filter(r=>r.world===id).length,count);assert.match(index.worlds.find(w=>w.id===id).label,/^Living kinds.*cross-world/);}
 const gu=searchAtlas(index,{q:'insight moth',world:'gu'}).groups[0].rows[0];assert.equal(gu.href,'#creatures/kinds/kind%3Ainsight-moth');assert.equal(gu.world,'gu');
 const editions=findWorldChoices([{id:'dnd5e_2014',label:'D&D 2014'},{id:'dnd_srd',label:'D&D SRD 5.2.1'}]);assert.deepEqual(new Set(editions.map(w=>w.id)),new Set(['dnd5e_2014','dnd_srd']));assert.ok(editions.every(w=>!w.members));
});
test('the actual dropdown display preserves scoped labels instead of overwriting both with the canonical title',async()=>{
 const {index}=await actual,view=await readFile(new URL('../prototypes/world-atlas/atlas-find-view.mjs',import.meta.url),'utf8');const body=view.slice(view.indexOf('function displayWorld('),view.indexOf('\nfunction findRoute('));const display=Function('worldTitle',body+';return displayWorld;')(id=>id==='ri'?'Reverend Insanity':id);
 const labels=['ri','reverend-insanity','title:ri','gu','person','plant'].map(id=>display(index.worlds,id));assert.equal(new Set(labels).size,6);assert.match(labels[0],/reader and play records/);assert.match(labels[1],/recorded rules/);assert.match(labels[2],/all indexed records/);
});
