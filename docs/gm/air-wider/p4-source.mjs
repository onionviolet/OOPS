// Private data stays in ignored files. This driver prints only IDs/status/hashes.
import fs from 'node:fs';import {createHash} from 'node:crypto';
import {compileStructuredPack,mergeStructuredPack} from '../../../src/structured_pack_definitions.js';
import {createContentRegistry,createExpansionState} from '../../../src/expansion_engine.js';
import {planStructuredSelection,beginStructuredCampaign} from '../../../src/structured_pack_runtime.js';
import {validateStructuredEnvelope} from '../../../src/structured_pack_state.js';
import {writeGameplayToEnvelope} from '../../../src/gameplay_transactions.js';
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
const path=process.argv[2]||'private_packs/p06-air-wider-candidate/pack.json';const raw=JSON.parse(fs.readFileSync(path,'utf8'));
const results=[];
for(let index=0;index<raw.starts.length;index++){
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
 const state=createExpansionState(Math.max(1,Math.ceil(0x100000000*index/d.starts.length)));
 const context={registry,actorId:'player',worldId:'base.frontier',external:{money:102},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}},facts:{location:'Village'},nativeBody:{id:'native.player.body',form:d.admission.forms[0],lifeStage:d.admission.lifeStages[0],ownerId:'player',controllerId:'player'},nativeAlive:true,nativeReady:true,inventoryOwners:Object.fromEntries(d.simulation.containers.map(c=>[c.id,{}])),busy:false};
 const selected=planStructuredSelection(state,d,context),begun=beginStructuredCampaign(selected.plan.state,d,context,null,selected.selection);
 const save={expansion:begun.plan.state,content_packs:{schema:1,packs:{},structured:begun.record},'current location':begun.record.locationId,character:{money:102,bio:{race:d.admission.forms[0]}},inventories:{person:{main_character:{}},storage:Object.fromEntries(d.simulation.containers.map(c=>[c.id,{}]))},levels:{person:{main_character:{}}}};
 writeGameplayToEnvelope(save,begun.plan.gameplay,{player:{category:'person',id:'main_character'}});for(const [id,stock]of Object.entries(begun.plan.ownership||{}))save.inventories.storage[id]=Object.fromEntries(Object.entries(stock).map(([k,count])=>[k,{count}]));validateStructuredEnvelope(save);
 results.push({id:begun.record.startId,status:'initialized-and-envelope-valid',snapshotHash:begun.record.snapshotHash});
}
console.log(JSON.stringify({id:raw.id,contentHash:hash(raw),starts:results}));
