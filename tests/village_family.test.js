import test from 'node:test';
import assert from 'node:assert/strict';
import {createVillageLives,familyPolicy,stageVillageFamilySave,validateVillageLives,villageFamilyView,bondStatuses,advanceVillageLives} from '../src/npc_lives.js';
import {settleVillageFamily as settleFamily,familyDay} from '../src/village_family.js';
import {phenotype} from '../src/lineage_traits.js';
const date=(year,month=1,day=1)=>({year,month,day});
const settleVillageFamily=(s,t,b)=>settleFamily(advanceVillageLives(s,t.year),t,b);
function conception(){for(let seed=1;seed<100;seed++){let s=familyPolicy(createVillageLives(999,seed),date(999),true);for(let year=1000;year<1006;year++){s=settleVillageFamily(s,date(year),bondStatuses(s,{},year));if(s.family.pregnancies.length)return s;}}throw Error('No ordinary test pregnancy found.');}
test('family growth is optional, save-staged, deterministic and neither a read nor a repeat save creates extra people',()=>{
 const initial=createVillageLives(999,2),save={npc_lives:initial,'current time':date(1005),life_events:{bonds:{}}};assert.equal(stageVillageFamilySave(save),initial);const on=familyPolicy(initial,date(1005),true);assert.equal(on.people.length,initial.people.length);assert.equal(on.family.pregnancies.length,0);
 const s=conception(),copy=structuredClone(s),at=s.family.lastDay,year=Math.floor(at/360),view=villageFamilyView(s,date(year));assert.equal(JSON.stringify(s),JSON.stringify(copy));assert.ok(view.pending.length);assert.equal(JSON.stringify(view).includes('genes'),false);assert.equal(JSON.stringify(view).includes('seed'),false);
 const again=settleVillageFamily(s,date(year),bondStatuses(s,{},year));assert.deepEqual(again,s);validateVillageLives(again);
});
test('pending birth keeps actual parents and creates inherited people once, with real old-age effect and no unseen genotype projection',()=>{
 let s=conception();const pregnancy=structuredClone(s.family.pregnancies[0]),year=Math.floor(pregnancy.due/360),before=s.people.length;s=settleVillageFamily(s,date(year,10,1),bondStatuses(s,{},year));const children=s.people.filter(p=>p.birthDay===pregnancy.due&&p.parents.join(',')===pregnancy.parents.join(','));assert.equal(children.length,pregnancy.count);assert.equal(s.people.length,before+pregnancy.count);assert.equal(s.family.pregnancies.length,0);
 for(const p of children){assert.equal(p.heritage.sire,p.parents[1]);assert.equal(p.heritage.dam,p.parents[0]);const span=p.deathYear-p.birthYear;assert.ok(span>=65+2*phenotype(p.heritage.genes).wind&&span<=84+2*phenotype(p.heritage.genes).wind);assert.ok(s.news.includes('birth:'+p.id));}
 const saved=JSON.parse(JSON.stringify(s));validateVillageLives(saved);assert.deepEqual(settleVillageFamily(saved,date(year,10,1),bondStatuses(saved,{},year)),saved);assert.doesNotMatch(JSON.stringify(villageFamilyView(saved,date(year,10,1))),/genes|alleles|deathYear|sire|dam/);
});
test('dead or estranged adults start no pregnancy; pausing does not erase actual pending gestation',()=>{
 let s=conception();const due=s.family.pregnancies[0].due,year=Math.floor(due/360);s=familyPolicy(s,date(year),false);const completed=settleVillageFamily(s,date(year,10,1),[]);assert.equal(completed.family.pregnancies.length,0);assert.ok(completed.people.some(p=>p.birthDay===due));
 const no=familyPolicy(createVillageLives(999,2),date(999),true);const changed=settleVillageFamily(no,date(1005),bondStatuses(no,{'maia|oren':{status:'estranged',since:999}},1005));assert.equal(changed.family.pregnancies.length,0);assert.equal(changed.people.length,no.people.length);
});

test('rare twins reserve and deliver two distinct pedigreed people; the same due save cannot duplicate either',()=>{
 let pending;for(let seed=1;seed<2000&&!pending;seed++){let s=familyPolicy(createVillageLives(999,seed),date(999),true);for(let y=1000;y<=1004;y++){s=settleVillageFamily(s,date(y),bondStatuses(s,{},y));if(s.family.pregnancies.some(p=>p.count===2)){pending=s;break;}}}assert.ok(pending);const pregnancy=pending.family.pregnancies.find(p=>p.count===2),year=Math.floor(pregnancy.due/360),done=settleVillageFamily(pending,date(year,10,1),bondStatuses(pending,{},year));const twins=done.people.filter(p=>p.birthDay===pregnancy.due&&p.parents.join(',')===pregnancy.parents.join(','));assert.equal(twins.length,2);assert.notEqual(twins[0].id,twins[1].id);assert.notEqual(twins[0].name,twins[1].name);validateVillageLives(done);assert.deepEqual(settleVillageFamily(done,date(year,10,1),bondStatuses(done,{},year)),done);
});
test('maternal death interrupts gestation once and keeps a distinct aftermath instead of manufacturing a child or another death',()=>{
 let s=conception();const pregnancy=s.family.pregnancies[0],year=Math.floor(pregnancy.at/360),mother=s.people.find(p=>p.id===pregnancy.parents[0]);mother.deathYear=year;const death=s.events.find(e=>e.id==='death:'+mother.id);death.year=year;s.events.sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));const n=s.people.length;s=settleVillageFamily(s,date(year,2,1),[]);assert.equal(s.family.pregnancies.length,0);assert.equal(s.people.length,n);assert.equal(s.family.losses.length,1);assert.equal(s.events.filter(e=>e.kind==='death').length,n);validateVillageLives(s);const again=settleVillageFamily(s,date(year,2,2),[]);assert.equal(again.family.losses.length,1);assert.equal(again.people.length,n);
});

test('one long calendar interval and yearly saves produce the same inherited people, including births before parents later die',()=>{
 const initial=familyPolicy(createVillageLives(999,23),date(999),true),coarse=stageVillageFamilySave({npc_lives:initial,'current time':date(1059,12,30),life_events:{bonds:{}}});let fine=structuredClone(initial);
 for(let year=1000;year<=1059;year++)fine=stageVillageFamilySave({npc_lives:fine,'current time':date(year,12,30),life_events:{bonds:{}}});
 assert.deepEqual(coarse.people,fine.people);assert.deepEqual(coarse.family,fine.family);assert.ok(coarse.people.some(p=>p.birthDay!==undefined));validateVillageLives(coarse);
});
