import test from 'node:test';
import assert from 'node:assert/strict';
import {createDryingLot,advanceDryingExposure} from '../src/drying_exposure.js';
const fresh=(moisture=6000)=>createDryingLot({cohort:'fixture.a',worldId:'book.paradise.hub',instanceId:'hub.a',at:0,sourceKey:JSON.stringify({id:'Wet repair stave'}),moisture});
const apparatus={closure:'open',coverPermille:1000,airflowPermille:1000,heatPermille:0};
const advance=(lot,to,air=apparatus,weather={rainPermille:null,humidityPermille:500})=>advanceDryingExposure(lot,{worldId:lot.worldId,instanceId:lot.instanceId,from:lot.at,to,...weather},air);
test('covered ventilation dries; sealed humidity stalls without pretending the atmosphere is known',()=>{
 const l=fresh(),before=JSON.stringify(l);assert.equal(advance(l,12).moisture,0);assert.equal(JSON.stringify(l),before);
 assert.equal(advance(l,12,{...apparatus,closure:'sealed'}).moisture,6000);
 assert.equal(advance(l,12,apparatus,{rainPermille:null,humidityPermille:null}).moisture,6000);
 assert.equal(advance(l,12,apparatus,{rainPermille:0,humidityPermille:1000}).moisture,6000);
});
test('constant received intervals agree across uneven, minute and reload partitions, including fractional boundaries',()=>{
 for(const humidityPermille of [499,999,1000])for(const moisture of [0,1,3500,6000]){
  const env={rainPermille:0,humidityPermille},a=advance(fresh(moisture),17,apparatus,env);let b=fresh(moisture),c=fresh(moisture);
  for(let n=1;n<=17;n++)b=advance(JSON.parse(JSON.stringify(b)),n,apparatus,env);
  for(const n of [3,11,17])c=advance(c,n,apparatus,env);
  assert.deepEqual(b,a);assert.deepEqual(c,a);
 }
 const slow={...apparatus,airflowPermille:1};assert.equal(advance(advance(fresh(),1,slow,{rainPermille:0,humidityPermille:999}),1000,slow,{rainPermille:0,humidityPermille:999}).moisture,5999);
});
test('partial shelter, prior wetness, heat and recovery have separate physical paths',()=>{
 const weather={rainPermille:500,humidityPermille:500},l=fresh(3000);
 const full=advance(l,2,apparatus,weather),half=advance(l,2,{...apparatus,coverPermille:500},weather),open=advance(l,2,{...apparatus,coverPermille:0},weather);
 assert.equal(full.moisture,2000);assert.equal(half.moisture,3000);assert.equal(open.moisture,4000);
 assert.equal(advance(l,2,{...apparatus,heatPermille:500},weather).moisture,1000);
 const sealed=advance(l,2,{...apparatus,closure:'sealed'},weather);assert.equal(sealed.moisture,3000);assert.equal(advance(sealed,8).moisture,0);
 assert.throws(()=>advanceDryingExposure(l,{worldId:l.worldId,instanceId:l.instanceId,from:1,to:2,rainPermille:0,humidityPermille:500},apparatus),/owning local/);
 assert.deepEqual(advance(full,full.at),full);
});
