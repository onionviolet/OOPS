import test from 'node:test';
import assert from 'node:assert/strict';
import {cultivationGuidance as guide} from '../src/cultivation_guidance.js';
const frame=()=>({inside:true,disabled:false,view:{supported:true,reserve:.5,ratePerMinute:.125,pending:null,technique:{id:'breath',label:'Circulation',minutes:0,nextAt:16,drills:{breath:0,settling:0},vessel:null}}});
test('known guidance follows actual reserve, commit barriers and vessel costs without inventing hidden discoveries',()=>{
 const f=frame();assert.equal(guide({...f,inside:false}),null);assert.match(guide(f).text,/4 minutes/);f.view.reserve=1;assert.equal(guide(f).target,'method:vessel:open');f.view.pending={remainingMinutes:3};assert.equal(guide(f).target,null);assert.match(guide(f).text,/3 more/);f.view.pending=null;
 f.view.technique.vessel={state:{nodes:{flow:1,still:1},impurity:0,comprehension:12},nextComprehension:30,nextLawCost:2000};assert.equal(guide(f).target,'method:vessel:fuse:all');f.view.technique.vessel.state.impurity=1;f.view.purgeCost=250;assert.equal(guide(f).target,'method:vessel:purge');assert.match(guide(f).text,/0.25/);
 f.view.pathWork={prepared:{path:'settling'}};assert.equal(guide(f).target,'method:path:set');f.disabled=true;assert.equal(guide(f).target,null);
});
test('earned deepening and investigation advice uses the corresponding live cost, then follows real drill practice',()=>{
 const f=frame();f.view.technique.vessel={state:{nodes:{flow:0,still:0},impurity:0,comprehension:30},nextComprehension:30,nextLawCost:2000};f.view.reserve=2;assert.equal(guide(f).target,'method:vessel:deepen');f.view.reserve=1;f.view.inquiry=[{id:'known-evidence',known:false,eligible:false,cost:0}];assert.equal(guide(f).target,null);f.view.inquiry[0].eligible=true;assert.equal(guide(f).target,'method:inquiry:known-evidence');f.view.inquiry[0].known=true;f.view.technique.nextAt=null;assert.equal(guide(f).target,'method:breath');f.view.technique.drills={breath:48,settling:48};assert.match(guide(f).text,/0 more comprehension minutes/);
});
