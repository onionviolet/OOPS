import test from 'node:test';
import assert from 'node:assert/strict';
import {lotmTaskSummary} from '../src/ui/lotm_task_summary.js';
const arc={id:'fixture.arc',title:'Current situation',next:{id:'fixture.buy',label:'Collect supplies',place:'fixture.market'},aftermath:'A known receipt.'};
test('current action terms and blockers come from the admitted quote, without changing it',()=>{
 const view={arc,objectActs:[{id:'fixture.buy',label:'Collect supplies · 4 min · 16 pence',eligible:false,reasons:['You need the quoted funds.']}],moves:[]},before=structuredClone(view);
 const m=lotmTaskSummary(view);assert.equal(m.terms,'4 min · 16 pence');assert.equal(m.targetId,'fixture.buy');assert.equal(m.reason,'You need the quoted funds.');assert.equal(m.aftermath,'A known receipt.');assert.deepEqual(view,before);
});
test('the running task shows its actual remaining work instead of treating its occupied recipients as missing',()=>{
 const view={arc,objectActs:[{id:arc.next.id,label:'Collect supplies · 4 min',eligible:false,reasons:['A participant is working.','A participant is working.']}],jobs:[{id:'job.1',commandId:arc.next.id,label:'Collect supplies',left:2,cancellable:true}]},before=structuredClone(view);
 const m=lotmTaskSummary(view);assert.equal(m.reason,'');assert.equal(m.next,'In progress: Collect supplies');assert.equal(m.terms,'2 min remaining');assert.equal(m.targetId,'cancel');assert.equal(m.link,'Show current work');assert.deepEqual(view,before);
 const other=lotmTaskSummary({...view,jobs:[{...view.jobs[0],commandId:'fixture.other'}]});assert.equal(other.reason,'A participant is working.');assert.equal(other.targetId,arc.next.id);
 assert.equal(lotmTaskSummary({...view,jobs:[{...view.jobs[0],cancellable:false}]}).targetId,null);
});
test('off-site task links the current native walk instead of inventing an action or travelling',()=>{
 const m=lotmTaskSummary({arc,objectActs:[],moves:[{id:'fixture.walk',to:'fixture.market',label:'Walk to Market · 2 min',eligible:true,reasons:[]}]});
 assert.equal(m.targetId,'fixture.walk');assert.equal(m.link,'Show the walk to this task');assert.equal(m.terms,'2 min');assert.match(m.route,/Walk to Market/);
 assert.equal(lotmTaskSummary({arc,objectActs:[],moves:[]}).targetId,null);
});
test('completed and absent arcs do not expose future commands or fabricate progression',()=>{
 assert.equal(lotmTaskSummary({}),null);const m=lotmTaskSummary({arc:{...arc,next:null,done:true,conclusion:'Current boundary.'}});assert.equal(m.targetId,null);assert.equal(m.next,'This arc is complete.');assert.equal(m.conclusion,'Current boundary.');assert.equal(m.terms,'');
});

import {localMoneyLabel} from '../src/ui/local_money_label.js';
test('Tingen balances keep their actual pence units without converting other worlds',()=>{
 for(const amount of[0,16,-9,480])assert.equal(localMoneyLabel(amount,'book.lotm.tingen'),`${amount} pence`);assert.equal(localMoneyLabel(1,'book.lotm.tingen'),'1 penny');assert.equal(localMoneyLabel(16,'base.frontier'),null);
});

test('a blocked timed task links its existing known wait target without inventing one',()=>{
 const view={arc:{...arc,next:{...arc.next,readyAt:420}},objectActs:[{id:arc.next.id,label:'Unpack · 2 min',eligible:false,reasons:['Wait for the chimes.']}],waits:[{id:'wait.until.420',at:420}]};assert.equal(lotmTaskSummary(view).waitId,'wait.until.420');assert.equal(lotmTaskSummary({...view,waits:[]}).waitId,null);
});
