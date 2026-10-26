import test from 'node:test';
import assert from 'node:assert/strict';
import {cultivationGuidance as guide} from '../src/cultivation_guidance.js';
import {cultivationPracticeState,cultivationReturnReceipt} from '../src/cultivation_guidance.js';
import {mistglassProfile as P,prepareEnrollment,prepareCultivationMethod,prepareAdvance,prepareTrial,adaptationView} from '../src/absorb_p23/world_adaptation/index.js';
import {armAway,validateAway} from '../src/absorb_p23/world_adaptation/away.js';
const frame=()=>({inside:true,disabled:false,view:{supported:true,reserve:.5,ratePerMinute:.125,pending:null,technique:{id:'breath',label:'Circulation',minutes:0,nextAt:16,drills:{breath:0,settling:0},vessel:null}}});
test('known guidance follows actual reserve, commit barriers and vessel costs without inventing hidden discoveries',()=>{
 const f=frame();assert.equal(guide({...f,inside:false}),null);assert.match(guide(f).text,/4 minutes/);f.view.reserve=1;assert.equal(guide(f).target,'method:vessel:open');f.view.pending={remainingMinutes:3};assert.equal(guide(f).target,null);assert.match(guide(f).text,/3 more/);f.view.pending=null;
 f.view.technique.vessel={state:{nodes:{flow:1,still:1},impurity:0,comprehension:12},nextComprehension:30,nextLawCost:2000};assert.equal(guide(f).target,'method:vessel:fuse:all');f.view.technique.vessel.state.impurity=1;f.view.purgeCost=250;assert.equal(guide(f).target,'method:vessel:purge');assert.match(guide(f).text,/0.25/);
 f.view.pathWork={prepared:{path:'settling'}};assert.equal(guide(f).target,'method:path:set');f.disabled=true;assert.equal(guide(f).target,null);
});
test('practice feedback agrees with actual capped, blocked and purification clocks, independent of action-slot availability',()=>{
 const c=clock=>({clock,optIn:true,methodKnown:true,worldId:P.worldId,instanceId:'m8.instance',bodyId:'native.player.body',bodyForm:'human',ownerId:'player',controllerId:'player',alive:true,conditionIds:[P.exposureConditionId]});
 let s=prepareCultivationMethod(prepareEnrollment(undefined,c(0)).state,c(0),'breath').state;
 const f=(state,context,reserve,extra={})=>({inside:true,disabled:false,view:adaptationView(state,context,reserve),...extra});
 assert.equal(cultivationPracticeState(f(s,c(0),10000)).rate,0);assert.match(cultivationPracticeState(f(s,c(0),10000)).drill,/even with a full reserve/);
 const capped=prepareAdvance(s,c(1),10000);assert.equal(capped.effects.length,0);assert.equal(capped.state.techniques.minutes.breath,1,'full reserve still practices');
 const blocked={...c(1),conditionIds:[P.exposureConditionId,P.blockedConditionId]},raw=f(s,blocked,0,{rawRemaining:6});assert.equal(cultivationPracticeState(raw).rate,0);assert.match(cultivationPracticeState(raw).awayReason,/6 more played/);assert.deepEqual(prepareAdvance(s,blocked,0).effects,[]);
 assert.equal(cultivationPracticeState(f(s,c(0),0,{inside:false})).rate,0);
 const occupied=cultivationPracticeState(f(s,c(0),0,{disabled:true}));assert.equal(occupied.rate,.1);assert.match(occupied.awayReason,/current native activity/);assert.match(guide(f(s,c(0),0,{disabled:true})).text,/before changing methods/);
 s=prepareAdvance(s,c(16),0).state;s=prepareTrial(s,c(16),{reserve:2000,doseKey:'paid-dose',doseAvailable:true,roll:0}).state;
 const pending=cultivationPracticeState(f(s,c(16),0));assert.ok(pending.rate>0);assert.match(pending.drill,/paused during purification/);
 const tick=prepareAdvance(s,c(17),0);assert.ok(tick.effects.some(e=>e.kind==='resource-credit'&&e.amount>0));assert.deepEqual(tick.state.techniques.minutes,s.techniques.minutes,'purification advances intake without awarding drill minutes');
});
test('return feedback keeps the saved signed reserve delta and retained bank instead of promising nominal earnings',()=>{
 const a={...armAway(undefined,0,0),bank:7,last:{kind:'spend',minutes:3,dropped:0,condensate:-125}};validateAway(a);
 const restored=JSON.parse(JSON.stringify(a));assert.match(cultivationReturnReceipt(restored),/-0.125 net condensate/);assert.match(cultivationReturnReceipt(restored),/7 banked minutes remain/);
 restored.last={kind:'bank',minutes:7,dropped:2,condensate:0};assert.match(cultivationReturnReceipt(restored),/2 overflow minutes dropped; no condensate awarded until spending/);
 assert.equal(cultivationReturnReceipt(undefined),null);
});
test('earned deepening and investigation advice uses the corresponding live cost, then follows real drill practice',()=>{
 const f=frame();f.view.technique.vessel={state:{nodes:{flow:0,still:0},impurity:0,comprehension:30},nextComprehension:30,nextLawCost:2000};f.view.reserve=2;assert.equal(guide(f).target,'method:vessel:deepen');f.view.reserve=1;f.view.inquiry=[{id:'known-evidence',known:false,eligible:false,cost:0}];assert.equal(guide(f).target,null);f.view.inquiry[0].eligible=true;assert.equal(guide(f).target,'method:inquiry:known-evidence');f.view.inquiry[0].known=true;f.view.technique.nextAt=null;assert.equal(guide(f).target,'method:breath');f.view.technique.drills={breath:48,settling:48};assert.match(guide(f).text,/0 more comprehension minutes/);
});
