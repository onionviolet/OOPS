import test from 'node:test';
import assert from 'node:assert/strict';
import {withHpLeadCast,validateHpLeadCast} from '../src/book_world_hp_lead_pack.js';
import {packNative} from '../src/world_pack_registry.js';
import {hpLeadProjection} from '../src/book_world_hp_lead_domain.js';
import {placeActSequences,sequencePrerequisites} from '../src/place_act_sequence.js';
import {buildEventBook,learnedDay} from '../src/world_events.js';
const P='book.hp.lead';
// Name-free synthetic pack: window 2 appends a second sequence to the same act list as window 1.
const act=(n,place)=>({id:`${P}.${n}`,place,minutes:5,label:n,description:'d',report:'r '+n,knowledgeKey:`${P}.${n}.seen`,operation:'use',effects:[]});
const pack=()=>({schema:'hp-cast/1',locations:[{id:P+'.yard',label:'Yard',description:'x',underRoof:false}],people:[],
 householdActs:{acts:[act('w1.a',P+'.cupboard'),act('w1.b',P+'.cupboard'),act('w2.c',P+'.cupboard'),act('w2.d',P+'.cupboard')],
  sequences:[{id:P+'.first',title:'First',stages:[{commandId:P+'.w1.a',label:'A'},{commandId:P+'.w1.b',label:'B'}],conclusion:'one'},
   {id:P+'.second',title:'Second',stages:[{commandId:P+'.w2.c',label:'C'},{commandId:P+'.w2.d',label:'D'}],conclusion:'two'}],visits:[]},
 lockedOptions:{[P+'.w2.c']:[{id:'x',label:'Not taken'}]}});
const state=known=>({simulation:{people:{player:{}},knowledge:{player:Object.fromEntries(known.map(k=>[`${P}.${k}.seen`,{value:'r '+k}]))},jobs:[]},actors:{player:{worldId:P+'.world',completed:{}}}});
test('the second sequence follows the first: arc moves on when the first is done, and keeps the locked row of the current act',()=>{
 const d=pack(),views=ks=>hpLeadProjection(state(ks),d.householdActs,d.lockedOptions);
 assert.equal(views([]).arc.id,P+'.first');assert.equal(views(['w1.a']).arc.next.id,P+'.w1.b');
 const second=views(['w1.a','w1.b']);
 assert.equal(second.arc.id,P+'.second');assert.equal(second.arc.next.id,P+'.w2.c');assert.equal(second.arc.done,false);
 assert.deepEqual(second.locked.map(l=>l.label),['Not taken']);
 const done=views(['w1.a','w1.b','w2.c','w2.d']);assert.equal(done.arc.done,true);assert.equal(done.arc.id,P+'.second');
});
// Each act requires the act before it, across windows; earlier acts follow by induction (linear, not one entry per earlier act).
test('a second-window act chains to the act before it, and the chain crosses from the first window (cross-sequence prerequisites)',()=>{
 const d=pack().householdActs,facts=id=>sequencePrerequisites(d,P+id).map(r=>r.any[0].fact);
 assert.deepEqual(placeActSequences(d).map(a=>a.stages.length),[2,2]);
 assert.deepEqual(facts('.w2.d'),[`completed.${P}.w2.c`]);
 assert.deepEqual(facts('.w2.c'),[`completed.${P}.w1.b`]);
 assert.deepEqual(facts('.w1.b'),[`completed.${P}.w1.a`]);
 assert.deepEqual(facts('.w1.a'),[]);
});
test('the pack with two sequences validates and merges into the native definition',()=>{
 assert.deepEqual(validateHpLeadCast(pack()),[]);
 const raw=withHpLeadCast(packNative(P),pack());
 assert.deepEqual(raw.simulation.commands.map(c=>c.id),[P+'.w1.a',P+'.w1.b',P+'.w2.c',P+'.w2.d',P+'.arrive_school',P+'.sorting',P+'.go_dormitory',P+'.leave_dormitory',P+'.lesson_charms',P+'.charms_practice',P+'.lesson_potions',P+'.tie.ron_family',P+'.tie.ron_practice',P+'.make.cure_boils.procedure.1',P+'.make.cure_boils.procedure.2',P+'.make.cure_boils',P+'.make.cure_boils.use',P+'.make.cure_boils_quills_early.procedure.1',P+'.make.cure_boils_quills_early',P+'.make.cure_boils_quills_early.use',P+'.sp.use.levitation_charm',P+'.sp.use.pass_feather']);
});
// G10 (receiving side only): the existing event owner already keeps a private delivery away from anyone who is not
// the holder. A letter addressed to the lead but held by the guardian is "present" for the guardian and unknown to the lead.
test('world_events: a private delivery reaches its holder and not the addressee (no carrier, no spread)',()=>{
 const book=buildEventBook([{id:'letter',key:'letter',kind:'public_event',placement:'dated',scope:'private',evidence:'S',when:{day:1},present:['holder']}]);
 const ctx={presence:()=>null,channels:()=>new Set(['newspaper','word'])};
 assert.equal(learnedDay(book,'holder','letter',ctx).level,'present');
 assert.equal(learnedDay(book,'lead','letter',ctx),null);
});
