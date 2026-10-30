import test from 'node:test';
import assert from 'node:assert/strict';
import {harmView,validateHarm,harmRules} from '../src/harm_state.js';
import {accrualFor,accrueBacklash,backlashAdder,lossOfControlTick,harmOdds,harmPart} from '../src/harm_engine.js';
import {settleLotmBacklash} from '../src/lotm_act_engine.js';
import {HARM_WORLDS} from '../src/harm_state.js';

const tingen=()=>({expansion:{actors:{player:{worldId:'book.lotm.tingen'}}}});
const frontier=()=>({expansion:{actors:{player:{worldId:'base.frontier'}}}});

test('cast and act accrual use the world sources row, with rank gap and an explicit row weight',()=>{
 const r=HARM_WORLDS['book.lotm.tingen'];
 assert.deepEqual(accrualFor(r,'cast'),{carrier:'power',weight:0.5});
 assert.deepEqual(accrualFor(r,'cast',{rankGap:2}),{carrier:'power',weight:1.5});
 assert.deepEqual(accrualFor(r,'act',{weight:2}),{carrier:'power',weight:2});
 assert.throws(()=>accrualFor(r,'curse'),/no backlash source/);
 assert.throws(()=>accrualFor(r,'cast',{rankGap:-1}),/rank gap/);
 const s=accrueBacklash(tingen(),'cast',{source:'test.cast',rankGap:4});
 assert.equal(s.save.harm.backlash.power,2.5);assert.equal(s.record.source,'test.cast');
 assert.equal(Object.hasOwn(s.save.harm,'source'),false);validateHarm(s.save.harm);
 assert.throws(()=>accrueBacklash(frontier(),'cast'),/no backlash source/);
});

test('backlashAdder plugs into settleLotmBacklash once per completion and leaves the input save alone',()=>{
 const save={...tingen(),harm:{schema:1,backlash:{power:1}}},before=structuredClone(save);
 const cmd={id:'lotm.rite.x.send',actorId:'player',lotmAct:{rowId:'lotm.rite.x',final:true,risk:{carrier:'power',source:'lotm.rite.x',weight:2,protections:[]}}};
 const state={worlds:{w:{facts:{}}},simulation:{knowledge:{player:{'lotm.act.lotm.rite.x.send':{cause:'c1'}}}}};
 const a=backlashAdder(save);
 assert.equal(settleLotmBacklash(state,[cmd],'w',{},a.add).length,1);
 assert.equal(settleLotmBacklash(state,[cmd],'w',{},a.add).length,0);
 const out=a.result();assert.equal(out.save.harm.backlash.power,3);assert.equal(out.records.length,1);
 assert.deepEqual(save,before);
 assert.equal(backlashAdder(save).result().save,save);
});

test('loss of control ends the life only after its grace unattended, and recovery clears the clock',()=>{
 let s={...tingen(),harm:{schema:1,backlash:{power:9}}};
 let t=lossOfControlTick(s,{minutes:20});assert.equal(t.die,null);assert.equal(t.save.harm.lostFor.power,20);
 const held=lossOfControlTick(t.save,{minutes:60,attended:true});assert.equal(held.paused,true);assert.equal(held.save.harm.lostFor.power,20);
 const rescued=lossOfControlTick(t.save,{minutes:60,facts:{'harm.rescuer.present':true}});assert.equal(rescued.die,null);assert.equal(rescued.paused,true);
 const over=lossOfControlTick(t.save,{minutes:40});assert.equal(over.die,'loss_of_control');assert.equal(over.dieAfter,10);
 const calm=lossOfControlTick({...t.save,harm:{...t.save.harm,backlash:{power:2}}},{minutes:5});
 assert.equal(calm.die,null);assert.equal(Object.hasOwn(calm.save.harm,'lostFor'),false);
 const below=lossOfControlTick({...tingen(),harm:{schema:1,backlash:{power:8}}},{minutes:600});assert.equal(below.die,null);
 assert.equal(lossOfControlTick(frontier(),{minutes:600}).die,null);
 validateHarm(t.save.harm);JSON.parse(JSON.stringify(t.save.harm));
 assert.throws(()=>validateHarm({schema:1,backlash:{},lostFor:{power:-1}}),/timer/);
 assert.throws(()=>validateHarm({schema:1,backlash:{},other:1}),/Invalid harm slice/);
});

test('combat view: odds shift only for chance axes, strength mods separate, injuries go through one door',()=>{
 let s=tingen();
 const r=harmPart(s,{partId:'hands',rung:'wounded',cause:'a cut'});s=r.save;
 const o=harmOdds(s,'fight');
 assert.equal(o.allowed,true);
 const acc=o['odds.shift'].find(m=>m.axis==='accuracy');
 assert.equal(acc.delta,0.5-1);assert.match(acc.cause,/Hands/);
 assert.ok(o['versus.you.mods'].some(m=>m.axis==='force'));assert.ok(!o['odds.shift'].some(m=>m.axis==='force'));
 const maimed=harmOdds(harmPart(s,{partId:'hands',rung:'maimed'}).save,'fight');
 assert.equal(maimed.allowed,false);assert.equal(maimed.blockedBy.part,'hands');
 assert.deepEqual(harmOdds(tingen(),'fight')['odds.shift'],[]);
 assert.throws(()=>harmPart(s,{partId:'tail',rung:'wounded'}),/Unknown harm part/);
 assert.throws(()=>harmPart(s,{partId:'hands',rung:'gone'}),/rung/);
 assert.equal(harmView(s).parts[0].id,'hands');
});

import {cycleBacklash,transferBacklash} from '../src/harm_engine.js';
import {LOOP_RESETS,loopRule,loopPlan,validateLoopRows} from '../src/harm_loops.js';

test('line, object, place and residue sources accrue; cycles count boundaries, not tick size',()=>{
 const t=tingen();
 assert.equal(accrueBacklash(t,'line',{prone:2}).save.harm.backlash.power,0.75);
 const once=cycleBacklash(t,'object',{fromMinute:100,toMinute:3000});
 assert.equal(once.cycles,2);assert.equal(once.save.harm.backlash.power,1);
 let s=t;for(let m=100;m<3000;m+=7)s=cycleBacklash(s,'object',{fromMinute:m,toMinute:Math.min(3000,m+7)}).save;
 assert.equal(s.harm.backlash.power,1);
 assert.equal(cycleBacklash(t,'place',{fromMinute:5,toMinute:30}).cycles,0);
 assert.throws(()=>cycleBacklash(t,'cast',{fromMinute:0,toMinute:9}),/does not recur/);
});

test('transfer moves strain between carriers, never below a floor, and leaves the input alone',()=>{
 const rules={carriers:{a:{label:'A',stages:[{id:'s',label:'S',at:0,blocks:[]}],floor:1,restPerHour:1,treatedPerHour:2,riseScale:1},
  b:{label:'B',stages:[{id:'s',label:'S',at:0,blocks:[]}],floor:0,restPerHour:1,treatedPerHour:2,riseScale:2}}};
 const save={...tingen(),harm:{schema:1,backlash:{a:4}}},before=structuredClone(save);
 const r=transferBacklash(save,{from:'a',to:'b',amount:2,rules});
 assert.equal(r.moved,2);assert.equal(r.save.harm.backlash.a,2);assert.equal(r.save.harm.backlash.b,4);
 const cap=transferBacklash(save,{from:'a',to:'b',amount:99,rules});assert.equal(cap.moved,3);assert.equal(cap.save.harm.backlash.a,1);
 assert.deepEqual(save,before);
 assert.throws(()=>transferBacklash(save,{from:'a',to:'a',amount:1,rules}),/two carriers/);
 assert.throws(()=>transferBacklash(save,{from:'x',to:'b',amount:1,rules}),/Unknown/);
 validateHarm(r.save.harm);
});

test('loop reset rows validate, default for unknown worlds, and plan the matching command',()=>{
 validateLoopRows();
 assert.equal(loopRule('book.unknown'),LOOP_RESETS.default);
 assert.equal(loopPlan('book.lotm.tingen',{trigger:'death',lifeEnded:true}).command,'restart:initial');
 assert.equal(loopPlan('book.lotm.tingen',{trigger:'death',lifeEnded:false}),null);
 assert.equal(loopPlan('book.lotm.tingen',{trigger:'player'}),null);
 assert.equal(loopPlan('loop.perfect-run',{trigger:'death',lifeEnded:true,hasCheckpoint:true}).command,'restart:checkpoint');
 const fb=loopPlan('loop.perfect-run',{trigger:'death',lifeEnded:true});assert.equal(fb.fellBack,true);assert.equal(fb.command,'restart:initial');
 assert.throws(()=>validateLoopRows({x:{...LOOP_RESETS.default,command:'warp'}}),/Invalid loop row/);
});
