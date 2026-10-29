import test from 'node:test';
import assert from 'node:assert/strict';
import {createConstraintStore,reservationDecision} from '../src/constraint_store.js';
import {constraintsFromPack} from '../src/constraint_pack.js';
const row=(id,extra={})=>({id,actor:'fixture.actor',window:{from:10,to:20},what:'contract',...extra});
const coin={actor:'fixture.actor',type:'resource',key:'coin'};
test('compiled conjunctions retain every need for a key, source order and live reads',()=>{
 const records=[row('first',{reason:'Keep the first obligation.',needs:{all:[{...coin,op:'gte',value:3},{...coin,op:'lte',value:6}]}}),row('second',{reason:'Keep the second obligation.',needs:{...coin,op:'gte',value:4}})];
 const before=JSON.stringify(records),store=createConstraintStore(records);
 const decide=(value,settled=()=>false)=>reservationDecision(store,{at:0,changes:[{...coin,value}],settled});
 assert.equal(decide(7).reason,'Keep the first obligation.');assert.equal(decide(3).reason,'Keep the second obligation.');assert.equal(decide(4).allowed,true);
 assert.equal(decide(3,id=>id==='second').allowed,true);assert.equal(decide(3).allowed,false);
 assert.equal(JSON.stringify(records),before);assert.equal(store.byId.get('first'),store.rows[0]);
});
test('global fact aliases share an index while actor scoped facts stay separate',()=>{
 const store=createConstraintStore([row('global',{produces:[{type:'fact',key:'weather',value:'wet'}]}),row('private',{needs:{type:'fact',scope:'actor',key:'promise',value:true}})]);
 assert.equal(reservationDecision(store,{at:0,changes:[{actor:'fixture.other',type:'fact',key:'weather',value:'dry'}]}).allowed,false);
 assert.equal(reservationDecision(store,{at:0,changes:[{actor:'fixture.other',type:'fact',scope:'actor',key:'promise',value:false}]}).allowed,true);
 assert.equal(reservationDecision(store,{at:0,changes:[{actor:'fixture.actor',type:'fact',scope:'actor',key:'promise',value:false}]}).allowed,false);
});
test('pack indexes keep the first person tier and deduplicate only anonymous identical anchors',()=>{
 const anchor={actor:'fixture.actor',place:'fixture.room',dayWindow:[1,1],locator:'fixture page 1'},pack={people:[{id:'fixture.actor',tier:'recurring'},{id:'fixture.actor',tier:'lead'}],anchors:[anchor,structuredClone(anchor),{...anchor,locator:'fixture page 2'}]};
 const before=JSON.stringify(pack),{store}=constraintsFromPack(pack);
 assert.equal(store.rows.length,2);assert.ok(store.rows.every(r=>r.tier==='recurring'));assert.equal(JSON.stringify(pack),before);
});
