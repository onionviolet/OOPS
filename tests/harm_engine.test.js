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
