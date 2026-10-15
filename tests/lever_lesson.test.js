import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry} from '../src/expedition_content.js';
import {advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {previewSimulationCommand,commitSimulationCommand,setSimulationProgram,cancelSimulationJob} from '../src/simulation.js';
import {createFieldFixture,fieldContext} from '../scripts/field_fixtures.mjs';
import {LEVER_WOOD as wood,LEVER_KIT as kit} from '../src/lever_lesson.js';
const ctx=p=>fieldContext(p);
const act=(p,id)=>commitSimulationCommand(p.state,expeditionRegistry,{id:`field.lp1.${id}`,targetId:['demonstrate','explain','practice'].includes(id)?'oldCraftsman':null},{...ctx(p),targetId:['demonstrate','explain','practice'].includes(id)?'oldCraftsman':null});
const tick=(p,n,extra={})=>advanceSimulation(p.state,expeditionRegistry,n,p.external,p.gameplay,{player:{facts:ctx(p).facts,vitals:ctx(p).vitals.player,...extra}});
const reload=p=>({...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry)});
const ready=()=>act(act(createFieldFixture(),'demonstrate'),'explain');
const learned=()=>tick(act(ready(),'practice'),3);

test('LP1 same known task before and after: actual time, costs and teacher provenance',()=>{
 let p=createFieldFixture();
 assert.match(previewSimulationCommand(p.state,expeditionRegistry,'field.lp1.lever_work',ctx(p)).reasons.join(' '),/practice/);
 let hand=act(p,'hand');hand=tick(hand,6); assert.equal(hand.gameplay.player.inventory[wood],19);assert.equal(hand.gameplay.player.inventory[kit],1);
 p=act(act(p,'demonstrate'),'explain');assert.equal(p.state.simulation.knowledge.player['field.lp1.method'],undefined);
 p=act(p,'practice');assert.equal(p.external.money,99);assert.equal(p.native.staminaToFull,1);
 p=tick(p,3);const k=p.state.simulation.knowledge.player['field.lp1.method'];assert.equal(k.stage,'understood');assert.equal(k.at,3);assert.equal(k.basis.kind,'instruction');assert.equal(k.basis.attributedTo,'oldCraftsman');assert.equal(p.state.simulation.situations[k.basis.situationId].context.regionId,'frontier.village');
 p=act(p,'lever_work');assert.equal(p.gameplay.player.inventory[wood],18);p=tick(p,2);assert.equal(p.state.clock,5);assert.equal(p.gameplay.player.inventory[wood],19);assert.equal(p.gameplay.player.inventory[kit],1);
 assert.throws(()=>act(p,'practice'),/once|completed/);
});
test('LP1 known actionable reasons for body, tool, willingness, contact and teaching hours',()=>{
 const p=learned();
 const check=c=>previewSimulationCommand(p.state,expeditionRegistry,'field.lp1.lever_work',c);
 assert.match(check({...ctx(p),nativeBody:{hands:0,mobile:false}}).reasons.join(' '),/two usable hands/);
 const bare=structuredClone(p);bare.gameplay.player.inventory[wood]=1;assert.match(previewSimulationCommand(bare.state,expeditionRegistry,'field.lp1.lever_work',ctx(bare)).reasons.join(' '),/second Rough wood log/);
 const r=ready();for(const [fact,value,reason] of [['village.craftsmanIrritated',true,/settle/],['village.teacherHours',false,/08:00/]])assert.match(previewSimulationCommand(r.state,expeditionRegistry,'field.lp1.practice',{...ctx(r),targetId:'oldCraftsman',facts:{...ctx(r).facts,[fact]:value}}).reasons.join(' '),reason);
 r.state.simulation.people.oldCraftsman.location='Shack';assert.equal(previewSimulationCommand(r.state,expeditionRegistry,'field.lp1.practice',{...ctx(r),targetId:'oldCraftsman'}).eligible,false);
});
test('LP1 pending and learned JSON reload preserve practice exactly and never reissue gains',()=>{
 let p=act(ready(),'practice');p=tick(reload(p),1);const saved=reload(p);assert.deepEqual(saved.state,p.state);
 p=tick(saved,2);assert.equal(p.state.actors.player.completed['field.lp1.practice'],1);assert.equal(p.external.money,99);
 const final=reload(p);p=tick(final,10);assert.equal(p.state.actors.player.completed['field.lp1.practice'],1);assert.deepEqual(p.state.simulation.knowledge.player['field.lp1.method'],final.state.simulation.knowledge.player['field.lp1.method']);assert.equal(p.external.money,99);
});
test('LP1 lost body or teacher during practice refunds and cannot teach; reserved lever returns on failure',()=>{
 let p=act(ready(),'practice');p.state.simulation.people.oldCraftsman.location='Shack';p=tick(reload(p),3);assert.equal(p.external.money,100);assert.equal(p.state.simulation.knowledge.player['field.lp1.method'],undefined);
 p=act(learned(),'lever_work');p=tick(reload(p),2,{nativeBody:{hands:0,mobile:false}});assert.equal(p.gameplay.player.inventory[wood],20);assert.equal(p.gameplay.player.inventory[kit],undefined);
 p=act(learned(),'lever_work');p=cancelSimulationJob(p.state,expeditionRegistry,p.state.simulation.jobs[0].id,ctx(p));assert.equal(p.gameplay.player.inventory[wood],20);
});
test('LP1 idle repeats reserve fresh inputs and stop safely; old saves gain no lesson state',()=>{
 let p=learned();p.gameplay.player.inventory[wood]=3;p=setSimulationProgram(p.state,expeditionRegistry,'field.lp1.lever_work',3,ctx(p));p=tick(reload(p),8);assert.equal(p.gameplay.player.inventory[kit],2);assert.equal(p.gameplay.player.inventory[wood],1);assert.equal(p.state.simulation.programs.player.status,'paused');
 const old=createFieldFixture();const loaded=reload(old);assert.deepEqual(loaded.state,old.state);assert.equal(loaded.state.simulation.knowledge.player?.['field.lp1.method'],undefined);assert.equal(loaded.state.simulation.situations?.['field.lp1.lesson'],undefined);
});
