import test from 'node:test';
import assert from 'node:assert/strict';
import {knownItemConsumers} from '../src/known_item_consumers.js';
import {structuredItemInputs,structuredActionRuns} from '../src/structured_pack_runtime.js';
import {riDayControls,riTallyChoices} from '../src/ri_daily_powers.js';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadHealerWork,RI_HEALER_WORK} from '../src/world_packs/book_gu_lead_healer_work.js';
import {RI_DAY_ITEMS,RI_LEAD_DAY} from '../src/ri_lead_day_facts.js';
const key=JSON.stringify({id:RI_DAY_ITEMS.tally}),board=`${RI_LEAD_DAY}.hand_in_tally`,healer=`${RI_HEALER_WORK}.tally`;
const actual=[guLeadDay.commands.find(a=>a.id===board),guLeadHealerWork.commands.find(a=>a.id===healer)];
const quoted=(held=1)=>actual.map(a=>({id:a.id,label:a.label,description:a.description,duration:a.duration,eligible:held>0,reasons:held?[]:['Bring a tally.'],costs:['1 × Watch tally'],itemInputs:structuredItemInputs(a.costs,{[`item.${key}`]:held})}));

test('input projection shares actual player cost quantities with the existing repeat budget and excludes NPC stock',()=>{
 const secret=JSON.stringify({id:'Private stock'}),costs=[...actual[0].costs,{type:'item',actor:'healer',key:secret,amount:-3},{type:'item',actor:'player',key:secret,amount:2}];
 const inputs=structuredItemInputs(costs,{[`item.${key}`]:2,[`item.${secret}`]:99});
 assert.deepEqual(inputs,[{key,amount:1,held:2}]);assert.equal(structuredActionRuns(costs,{[`item.${key}`]:2}),2);
 assert.deepEqual(structuredItemInputs(actual[0].costs,{}),[{key,amount:1,held:0}]);
});

test('known consumers retain exact current quotes and never infer an unadmitted alternative from the catalogue',()=>{
 const view={actions:quoted()},before=structuredClone(view);
 const both=knownItemConsumers(view,key);assert.equal(both.held,1);assert.deepEqual(both.choices.map(r=>r.id),[board,healer]);
 assert.equal(both.choices[0].duration,actual[0].duration);assert.equal(both.choices[1].description,actual[1].description);
 assert.deepEqual(view,before);
 const unknown=knownItemConsumers({actions:view.actions.slice(0,1)},key);
 assert.deepEqual(unknown.choices.map(r=>r.id),[board]);assert.doesNotMatch(JSON.stringify(unknown),/Vitality Leaf|healer_work/);
 assert.deepEqual(knownItemConsumers(view,JSON.stringify({id:'Another tally'})),{held:0,choices:[]});
 assert.deepEqual(knownItemConsumers({actions:quoted(0)},key),{held:0,choices:[]});
});

test('the held tally comparison keeps both choices beside wound rest without duplicating its controls, then preserves running Stop',()=>{
 const actions=[...quoted(),{id:`${RI_LEAD_DAY}.rest_wound`,label:'Rest',eligible:true,reasons:[],duration:360}];
 const view={canWrite:true,actions};
 assert.equal(riTallyChoices(view).choices.length,2);
 const controls=riDayControls(view);assert.equal(controls['follow-up'].request.id,`${RI_LEAD_DAY}.rest_wound`);assert.equal(controls['healer-tally'],null);
 const busy={canWrite:true,actions:quoted(0),jobs:[{id:'job:1',commandId:board,remaining:3,cancellable:true}]};
 const stop=riDayControls(busy)['follow-up'];assert.equal(stop.label,'Stop handing in the tally');assert.deepEqual(stop.request,{type:'cancel',jobId:'job:1'});
});
