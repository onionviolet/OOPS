import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/book_world_lotm_domain.js';
import {fresh,run,wait,hostOver,save,I,ctx,registry} from './lotm_helpers.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {COPY_FILE as C,copyFileAttention} from '../src/lotm_copy_routine.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
const pass=(p,n)=>{const end=p.state.clock+n;while(p.state.clock<end)p=wait(p,end-p.state.clock);return p;};
const sheets=p=>p.state.actors.player.resources[C.sheets]||0;
const balance=p=>hostOver(p).host.view().merit.balance;
let baseline;
function learned(){if(!baseline){let p=run(fresh(500,'probationer'),'report_in');p=run(p,'merit_case_file_copy');baseline=pass(p,30);}return structuredClone(baseline);}
function start(){const x=hostOver(learned());x.host.act(C.entrust);return x;}
function current(box){return hostOver(box.p).host.view().merit.copyFile;}
function doAct(box,id){const h=hostOver(box.p);h.host.act(id);box.p=h.box.p;}
test('normal probationer learns original copying before entrusting; cast local or civil is not granted a duty',()=>{
 let x=hostOver(run(fresh(500,'probationer'),'report_in'));assert.equal(x.host.view().merit.copyFile,null);assert.throws(()=>x.host.act(C.entrust));
 x=hostOver(learned());assert.equal(balance(x.box.p),1);assert.match(x.host.view().merit.copyFile.status,/three ten-minute sheets/);assert.equal(x.host.view().merit.copyFile.actions[0].eligible,true);
 x=hostOver(run(fresh(500,'civil'),'report_in'));assert.equal(x.host.view().merit,null);assert.throws(()=>x.host.act(C.entrust));
 const local=fresh(500,'probationer');local.state.lotm.entryProfile='lotm.early_tingen.canon_beside@1';
 assert.equal(previewSimulationCommand(local.state,registry,C.begin,ctx(local,I.supervisor)).eligible,false,'local cast entry is not converted to a probationer');
});
test('entrusted work uses idle native jobs, stops at its reference, then runs remaining sheets with a marked uncertainty',()=>{
 const {box}=start();assert.equal(box.p.state.simulation.jobs[0].due-box.p.state.clock,10);
 assert.match(current(box).status,/loses time spent on the unfinished sheet/);
 box.p=pass(box.p,10);assert.equal(sheets(box.p),1);assert.equal(balance(box.p),1);assert.equal(box.p.state.simulation.programs.player.status,'paused');
 assert.match(copyFileAttention(box.p.state).text,/reference needs your answer/);
 const privateElsewhere=structuredClone(box.p.state);privateElsewhere.actors.player.worldId='base.frontier';assert.equal(copyFileAttention(privateElsewhere),null);
 const anotherLife=structuredClone(box.p.state);anotherLife.lotm.entryProfile='book.lead.be@1';assert.equal(copyFileAttention(anotherLife),null);
 assert.match(current(box).status,/overwritten/);assert.deepEqual(current(box).actions.map(a=>a.id),[C.ask,C.flag]);
 assert.throws(()=>doAct(box,C.resume),'unanswered question cannot be bypassed');
 box.p=JSON.parse(JSON.stringify(box.p));assert.match(current(box).status,/overwritten/);
 doAct(box,C.flag);assert.equal(copyFileAttention(box.p.state),null,'resolved question retires header attention');assert.match(current(box).status,/marked unclear/);doAct(box,C.resume);box.p=pass(box.p,20);
 assert.equal(sheets(box.p),3);assert.equal(box.p.state.simulation.jobs.length,0);assert.equal(balance(box.p),1,'sheets do not mint merit');
 const mastery=hostOver(box.p).host.view().merit.practice.level;
 doAct(box,C.submit);assert.equal(balance(box.p),2);assert.ok(hostOver(box.p).host.view().merit.practice.level>mastery,'accepted file refines existing copying practice');assert.equal(current(box).actions.length,0);assert.equal(box.p.state.actors.player.facts['book.lotm.copy_file.resolution'],'flagged');
 assert.throws(()=>doAct(box,C.submit));assert.throws(()=>doAct(box,C.entrust));box.p=pass(box.p,30);assert.equal(balance(box.p),2,'no duplicate credit from retry or idle ticks');
});
test('clarification and stopped work preserve the actual completed sheets through reload and resume',()=>{
 const {box}=start();box.p=pass(box.p,10);doAct(box,C.ask);
 assert.match(current(box).status,/Finished sheets stay if you stop/);assert.doesNotMatch(current(box).status,/unfinished sheet/);
 box.p=pass(box.p,2);assert.equal(sheets(box.p),1);
 assert.equal(box.p.state.actors.player.facts['book.lotm.copy_file.resolution'],'clarified');doAct(box,C.resume);box.p=pass(box.p,14);
 assert.equal(sheets(box.p),2);const stopped=hostOver(box.p);stopped.host.cancel(stopped.box.p.state.simulation.jobs[0].id);box.p=JSON.parse(JSON.stringify(stopped.box.p));
 assert.equal(sheets(box.p),2);box.p=pass(box.p,15);assert.equal(sheets(box.p),2,'stopped program does not restart after load');
 assert.match(current(box).status,/2 of 3 sheets kept/);assert.match(current(box).status,/remaining 1 sheet \(10 min\)/);assert.doesNotMatch(current(box).status,/1 sheets/);doAct(box,C.resume);box.p=pass(box.p,10);doAct(box,C.submit);
 assert.equal(balance(box.p),2);assert.equal(sheets(box.p),3);assert.equal(validateLotmEnvelope(save(box.p)),true);
});
test('Hale absent blocks clarification and return, while flagging and finished sheets remain available',()=>{
 const {box}=start();box.p=pass(box.p,10);box.p.state.simulation.people[I.supervisor].location='Village';
 const q=current(box);assert.equal(q.actions.find(a=>a.id===C.ask).eligible,false);assert.equal(q.actions.find(a=>a.id===C.flag).eligible,true);
 assert.throws(()=>doAct(box,C.ask));doAct(box,C.flag);doAct(box,C.resume);box.p=pass(box.p,20);assert.throws(()=>doAct(box,C.submit));
 assert.equal(sheets(box.p),3);box.p.state.simulation.people[I.supervisor].location=box.p.state.simulation.people.player.location;doAct(box,C.submit);assert.equal(balance(box.p),2);
});
test('old saved whole-file job remains a whole-file job and is paid once on its original boundary',()=>{
 let p=run(run(fresh(500,'probationer'),'report_in'),'merit_case_file_copy');p=JSON.parse(JSON.stringify(pass(p,12)));
 assert.equal(sheets(p),0);assert.equal(p.state.simulation.jobs[0].commandId,'book.lotm.merit_case_file_copy');p=pass(p,18);
 assert.equal(balance(p),1);assert.equal(sheets(p),0);assert.equal(p.state.simulation.jobs.length,0);p=pass(p,30);assert.equal(balance(p),1);
 assert.ok(hostOver(p).host.view().merit.copyFile.actions[0].eligible);
});
