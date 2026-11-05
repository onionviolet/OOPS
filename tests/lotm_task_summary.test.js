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
 const m=lotmTaskSummary(view);assert.equal(m.reason,'');assert.equal(m.next,'In progress: Collect supplies');assert.equal(m.terms,'2 min');assert.equal(m.targetId,null);assert.equal(m.workId,'job.1');assert.equal(m.link,'Show current work');assert.deepEqual(view,before);
 const other=lotmTaskSummary({...view,jobs:[{...view.jobs[0],commandId:'fixture.other'}]});assert.equal(other.reason,'A participant is working.');assert.equal(other.targetId,arc.next.id);
 const fixed=lotmTaskSummary({...view,jobs:[{...view.jobs[0],cancellable:false}]});assert.equal(fixed.targetId,null);assert.equal(fixed.workId,'job.1');
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

test('shopping texture stays on its current admitted ready action, without changing characters or inventing a later quote',()=>{
 const ready={arc:{...arc,id:'first_excursion_gathering',next:{...arc.next,id:'book.lotm.excursion.market'}},objectActs:[{id:'book.lotm.excursion.market',label:'Collect supplies · 5 min · 16 pence',flavour:'Even a short shopping list has a bottom line.',eligible:true}],jobs:[]};
 const before=structuredClone(ready),shown=lotmTaskSummary(ready);
 assert(shown.flavour);assert.equal(shown.terms,'5 min · 16 pence');assert.deepEqual(ready,before);
 const blocked=lotmTaskSummary({...ready,objectActs:[{...ready.objectActs[0],eligible:false,reasons:['Need funds.']}]});
 assert.equal(blocked.flavour,'');assert.equal(blocked.reason,'Need funds.');assert.equal(blocked.state,'Not ready yet');
 assert.equal(lotmTaskSummary({...ready,objectActs:[{...ready.objectActs[0],eligible:false,reasons:[]}]}).state,'Not ready yet');
 const running=lotmTaskSummary({...ready,jobs:[{commandId:ready.arc.next.id,label:'Collect supplies',left:2,cancellable:true}]});
 assert.equal(running.flavour,'');assert.equal(running.termsLabel,'Time left');
 const elsewhere=lotmTaskSummary({...ready,objectActs:[],moves:[{id:'fixture.walk',to:arc.next.place,label:'Walk to Market · 2 min',eligible:true}]});
 assert.equal(elsewhere.flavour,'');assert.equal(elsewhere.terms,'2 min');assert.equal(elsewhere.termsLabel,'Walk first');assert.doesNotMatch(elsewhere.route,/16 pence|2 min/);
 assert.equal(lotmTaskSummary({...ready,arc:{...ready.arc,id:'fixture.other'}}).flavour,shown.flavour,'authored texture is not gated on a hard-coded arc id');
 assert.equal(lotmTaskSummary({...ready,objectActs:[{...ready.objectActs[0],flavour:undefined}]}).flavour,'','no authored texture means no invented line');
});

test('prepared-room explanation stays current and work inspection remains separate from cancellation',()=>{
 const action={id:'book.lotm.excursion.calm',label:'Calm yourself · 3 min · no stock spent',description:'The outcome is unknown.',flavour:'An unusually precise bit of housekeeping.',eligible:true};
 const view={arc:{...arc,id:'first_excursion_gathering',next:{...arc.next,id:action.id}},objectActs:[action],jobs:[]},before=structuredClone(view);
 const ready=lotmTaskSummary(view);assert.equal(ready.context,action.description);assert.match(ready.flavour,/housekeeping/);assert.equal(ready.workId,null);assert.deepEqual(view,before);
 const busy=lotmTaskSummary({...view,jobs:[{id:'job.preparation',commandId:action.id,label:'Prepare',left:2,cancellable:false}]});
 assert.equal(busy.workId,'job.preparation');assert.equal(busy.targetId,null);assert.equal(busy.context,'');assert.equal(busy.flavour,'');
 assert.equal(lotmTaskSummary({...view,objectActs:[]}).context,'');
 assert.equal(lotmTaskSummary({...view,objectActs:[{...action,eligible:false}]}).flavour,'');
 const next=lotmTaskSummary({...view,arc:{...view.arc,next:{...view.arc.next,id:'fixture.later'}}});assert.equal(next.context,'');assert.equal(next.flavour,'');
});
