import test from 'node:test';
import assert from 'node:assert/strict';
import {defineLotmRecords,quoteLotmRecords,unmetReasons,recordKeys,levelFrom} from '../src/lotm_records.js';
test('record projections read facts for the visible command, without touching unrelated targets',()=>{
 const commands=[{id:'fixture.hidden',targetId:'fixture.absent',records:{kind:'fetch'}},{id:'fixture.shown',targetId:'fixture.present',duration:1,label:'Read',requires:{fact:'fixture.ready',op:'eq',value:true,reason:'Wait for the custodian.'},records:{kind:'fetch'}}];
 const reads=[];
 const rows=quoteLotmRecords(commands,d=>({visible:d.id==='fixture.shown',eligible:false,reasons:['The required knowledge, means or circumstances are missing.']}),{facts:d=>{reads.push(d.targetId);return {'fixture.ready':false};}});
 assert.deepEqual(reads,['fixture.present']);assert.equal(rows.length,1);assert.deepEqual(rows[0].reasons,['Wait for the custodian.']);
});
import {LOTM_RECORD_ROWS,LOTM_RECORD_BINDINGS} from '../src/lotm_records_rows.js';
import {LOTM_RECORDS_CLEARANCE} from '../src/book_world_lotm_clearance.js';
import {clearanceFor} from '../src/clearance.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand,simulationFacts} from '../src/simulation.js';
// R6: the lead reads sealed records with earned means. Fixture: the armory is the supervised workroom and Hale stands in for Old Neil;
// the grant and evidence facts keep the pack's real names so the production binding is the one exercised.
await import('../src/book_world_lotm_domain.js');
const room='fixture.armory',STACK='lotm.records.chanis-stack',NOTE='book.lotm.kj3ad.dunn.note.shown.neil';
const binding={armory:{...LOTM_RECORD_BINDINGS.armory,place:room,custodian:I.supervisor}};
const {commands,unbound}=defineLotmRecords(LOTM_RECORD_ROWS,binding,{worldId:I.world,group:'book_lotm',situationId:I.situation});
const defs=createSimulationRegistry({commands});for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
const def=id=>registry.simulation.commands.get(id);
function setup(facts={}){const p=fresh(5);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'t.begin');
 p.state.simulation.people.player.location=room;p.state.simulation.people[I.supervisor].location=room;Object.assign(p.state.actors.player.facts,facts);return p;}
const preview=(p,id)=>previewSimulationCommand(p.state,registry,id,ctx(p,def(id).targetId));
const act=(p,id)=>{const out=commitSimulationCommand(p.state,registry,{id},ctx(p,def(id).targetId),p.state.sequence);return wait({...p,...out},def(id).duration);};
const why=(p,id)=>{const d=def(id);return unmetReasons(d.requires,simulationFacts(p.state,ctx(p,d.targetId),registry)).join(' | ');};
const F=p=>p.state.actors.player.facts;
const clock=p=>p.state.clock;
const N=`${STACK}.`;

test('rows with a complete binding compile; one without is reported, not guessed',()=>{
 assert.deepEqual(unbound,[]);
 assert.ok(commands.some(c=>c.id===`${N}fetch`)&&commands.some(c=>c.id===`${N}return`));
 const bad=defineLotmRecords(LOTM_RECORD_ROWS,{armory:{place:room}},{worldId:I.world,group:'g',situationId:I.situation});
 assert.equal(bad.commands.length,0);assert.match(bad.unbound[0].reasons[0],/custodian/);
});
test('without the earned note nothing runs: no fetch, no page, no time spent',()=>{
 const p=setup();
 assert.equal(preview(p,`${N}fetch`).eligible,false);
 assert.match(why(p,`${N}fetch`),/signed note/);
 assert.throws(()=>act(p,`${N}fetch`));assert.equal(clock(p),setup().state.clock);
});
test('with the note: fetch costs its ten minutes, then Sequence 7 pages read and are kept',()=>{
 let p=setup({[NOTE]:true});
 assert.equal(preview(p,`${N}seer-line`).eligible,false,'the stack is not on the table yet');
 assert.match(why(p,`${N}seer-line`),/stack up/);
 const t0=clock(p);p=act(p,`${N}fetch`);
 assert.equal(clock(p)-t0,10);assert.equal(F(p)[recordKeys.stack(STACK)],true);
 assert.equal(preview(p,`${N}seer-line`).eligible,true);
 p=act(p,`${N}seer-line`);assert.equal(F(p)[recordKeys.read('seer-line')],true);
 assert.match(p.state.simulation.knowledge.player['lotm.records.seer-line'].value,/Zaratul/);
 assert.equal(preview(p,`${N}seer-line`).eligible,false,'a page is read once; the knowledge stays');
});
test('clearance stops at Sequence 7: the later pages and the Cathedral folder are refused with the table\'s reason, nothing is charged',()=>{
 let p=act(setup({[NOTE]:true}),`${N}fetch`);
 for(const [id,grade] of [['beyond-seven',6],['cathedral-file',5]]){
  assert.equal(preview(p,`${N}${id}`).eligible,false);
  assert.ok(why(p,`${N}${id}`).includes(LOTM_RECORDS_CLEARANCE.grades[grade].line),id);
  const t=clock(p);assert.throws(()=>act(p,`${N}${id}`));assert.equal(clock(p),t);assert.equal(F(p)[recordKeys.read(id)],undefined);
 }
 assert.equal(clearanceFor(LOTM_RECORDS_CLEARANCE,6,{role:'captain'}).ok,true,'a captain grant would open them');
 assert.equal(clearanceFor(LOTM_RECORDS_CLEARANCE,6,{role:'cleared_7',known:false}).line,LOTM_RECORDS_CLEARANCE.grades[6].vague);
 assert.equal(levelFrom({[NOTE]:true},LOTM_RECORD_BINDINGS.armory),'cleared_7');assert.equal(levelFrom({},LOTM_RECORD_BINDINGS.armory),'uncleared');
 const q=quoteLotmRecords(commands,d=>preview(p,d.id),{actorFacts:F(p),facts:simulationFacts(p.state,ctx(p),registry)});
 assert.equal(q.find(r=>r.pageId==='beyond-seven').status,'withheld');assert.equal(q.find(r=>r.pageId==='seer-line').status,'ready');
 assert.equal(quoteLotmRecords(commands,d=>preview(p,d.id),{actorFacts:F(p),facts:simulationFacts(p.state,ctx(p),registry),known:false}).find(r=>r.pageId==='beyond-seven').reasons[0],LOTM_RECORDS_CLEARANCE.grades[6].vague);
});
test('support loss: custodian gone, wrong room, or the stack handed back each stop the reading; read pages stay read',()=>{
 let p=act(act(setup({[NOTE]:true}),`${N}fetch`),`${N}seer-line`);
 const away=structuredClone(p);away.state.simulation.people[I.supervisor].location='fixture.elsewhere';
 assert.throws(()=>act(away,`${N}instigator`));
 const out=structuredClone(p);out.state.simulation.people.player.location='fixture.street';assert.throws(()=>act(out,`${N}instigator`));
 p=act(p,`${N}return`);assert.equal(F(p)[recordKeys.stack(STACK)],false);
 assert.equal(preview(p,`${N}instigator`).eligible,false);assert.equal(F(p)[recordKeys.read('seer-line')],true,'what was read is kept');
 p=act(p,`${N}fetch`);assert.equal(preview(p,`${N}instigator`).eligible,true,'fetching again costs ten more minutes and works');
 const revoked=structuredClone(p);delete revoked.state.actors.player.facts[NOTE];
 assert.equal(preview(revoked,`${N}instigator`).eligible,false,'a lost note shuts it again');
});
test('consequence: the Instigator entry plus the lead\'s own lead on the Alfalfa killer yields a retained, usable conclusion',()=>{
 let p=act(act(setup({[NOTE]:true}),`${N}fetch`),`${N}instigator`);
 const link=`${N}link.tris-instigator`;
 assert.equal(preview(p,link).eligible,false,'it needs the lead from outside the papers');
 assert.match(why(p,link),/outside the papers/);
 p.state.actors.player.facts[LOTM_RECORD_BINDINGS.armory.evidence['tris-instigator']]=true;
 const early=setup({[NOTE]:true,[LOTM_RECORD_BINDINGS.armory.evidence['tris-instigator']]:true});
 assert.equal(preview(early,link).eligible,false,'and the page it rests on');
 p=act(p,link);assert.equal(F(p)[recordKeys.link('tris-instigator')],true);
 assert.match(p.state.simulation.knowledge.player['lotm.records.link.tris-instigator'].value,/Instigator potion/);
 const q=quoteLotmRecords(commands,d=>preview(p,d.id),{actorFacts:F(p)});
 assert.equal(q.find(r=>r.kind==='link').status,'read');
});
test('retained: a JSON round trip mid-reading keeps the stack, the reads and the conclusion; nothing is read twice',()=>{
 let p=act(act(setup({[NOTE]:true}),`${N}fetch`),`${N}seer-line`);
 p={...p,state:JSON.parse(JSON.stringify(p.state))};
 assert.equal(F(p)[recordKeys.stack(STACK)],true);assert.equal(preview(p,`${N}seer-line`).eligible,false);
 assert.equal(preview(p,`${N}other-paths`).eligible,true);
 const t=clock(p);p=act(p,`${N}other-paths`);assert.equal(clock(p)-t,LOTM_RECORD_BINDINGS.armory.minutes['other-paths']);
 assert.ok(p.state.simulation.knowledge.player['lotm.records.seer-line']&&p.state.simulation.knowledge.player['lotm.records.other-paths']);
});
