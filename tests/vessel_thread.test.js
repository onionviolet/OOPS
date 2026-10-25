import test from 'node:test';
import assert from 'node:assert/strict';
import {threadRecord,fittedThread,validateThread} from '../src/vessel_thread.js';
import {emptyNaming,executeNaming,quoteNaming,validateNaming} from '../src/naming_act.js';
import {planPathWork,quotePathWork,pathWorkView,validatePathWork} from '../src/mistglass_path_work.js';
import {prepareCultivationMethod} from '../src/absorb_p23/world_adaptation/index.js';
import {mistglassProfile as P} from '../src/absorb_p23/world_adaptation/profile.js';
const body={id:'body.one',form:'human'},gear={getInventoryKey:()=>'{"id":"pants","e2_instance":"e2.1"}'};
test('the named carrier retains its own body binding through validation and renaming; removal or another body suppresses it',()=>{
 const n=emptyNaming(),request={instance:'e2.1',name:'Copper loop',uses:0,seed:3,counters:{}};executeNaming(n,quoteNaming(n,request),()=>quoteNaming(n,request));n.named['e2.1']=threadRecord(n.named['e2.1'],body,15);validateThread(n.named['e2.1'].vesselThread);const saved=validateNaming(JSON.parse(JSON.stringify(n)));
 assert.equal(fittedThread({legs:gear},saved,body),'e2.1');assert.equal(fittedThread({},saved,body),null);assert.equal(fittedThread({legs:gear},saved,{...body,id:'body.two'}),null);
 const rename={...request,name:'Remembered loop'};executeNaming(saved,quoteNaming(saved,rename),()=>quoteNaming(saved,rename));assert.deepEqual(saved.named['e2.1'].vesselThread,n.named['e2.1'].vesselThread);
});
test('one physically held paid charge can survive method changes without changing its output; removing its carrier blocks execution',()=>{
 const s={schema:1,profileId:P.id,bodyId:body.id,instanceId:'mist.room',revision:0,clock:0,exposure:0,started:0,succeeded:0,failed:0,pending:null,last:null,techniques:{schema:1,selected:'breath',minutes:{breath:16,settling:16}}},c={clock:0,worldId:P.worldId,instanceId:'mist.room',bodyId:body.id,bodyForm:'human',ownerId:'player',controllerId:'player',alive:true,conditionIds:[P.exposureConditionId],methodKnown:true,inventory:{},ruleRelic:'e2.1'};
 const inventory={'{"id":"Rat pelt"}':1};let p=planPathWork(s,c,1000,inventory,'prepare');assert.equal(p.effects[0].amount,1000);assert.equal(p.state.pathWork.prepared.supportInstance,'e2.1');assert.equal(pathWorkView(p.state,c).canSwitch,true);
 const changed=prepareCultivationMethod(p.state,c,'settling');assert.equal(changed.state.techniques.selected,'settling');assert.equal(changed.state.pathWork.prepared.path,'breath');assert.equal(changed.effects.length,0);
 assert.throws(()=>prepareCultivationMethod(p.state,{...c,ruleRelic:null},'settling'),/Finish or abandon/);assert.equal(quotePathWork(changed.state,{...c,ruleRelic:null},0,inventory,'cut').eligible,false);assert.equal(quotePathWork(changed.state,c,0,inventory,'set').eligible,false);
 const finished=planPathWork(changed.state,c,0,inventory,'cut');assert.equal(finished.state.pathWork.prepared,null);assert.equal(finished.state.pathWork.last.productId,'Processed rat pelt');assert.equal(finished.effects.some(e=>e.kind==='resource-debit'),false);assert.equal(finished.quote.spend[0].count,1);validatePathWork(finished.state.pathWork,0,body.id,'mist.room');
});

test('a physically moved carrier does not activate its first-life body binding on a later embodiment',()=>{
 const n={named:{'e2.1':threadRecord({name:'Carrier'},body,0)}};assert.equal(fittedThread({legs:gear},n,body),'e2.1');assert.equal(fittedThread({legs:gear},n,{...body,continuationBodyId:'journey:body-life-2'}),null);
});

test('the relic projection stays usable in an ordinary fresh household with no optional qi-energy owner',async()=>{
 const {configureVesselThread}=await import('../src/vessel_thread_domain.js'),{domainRegistry}=await import('../src/domain_registry.js');
 const root={clock:0,actors:{player:{worldId:'base.frontier'}},simulation:{people:{}}};configureVesselThread({root:()=>root,body:()=>({...body,ownerId:'player',controllerId:'player'}),actor:()=>({getEquipment:()=>({}),getItems:()=>({}),is_alive:true}),location:()=> 'Village',writable:()=>true,idle:()=>true,blocked:()=>'',continuation:()=>null});
 const before=JSON.stringify(root),v=domainRegistry.project('vessel_thread');assert.equal(v.visible,false);assert.deepEqual(v.rows,[]);assert.equal(v.support,null);assert.equal(JSON.stringify(root),before);
});
