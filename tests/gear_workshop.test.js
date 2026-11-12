import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {readMaterialLineage, planProcessedMaterial} from '../src/material_lineage.js';
import {recoveredGearComponent, retainGearComponentLineage} from '../src/gear_component_lineage.js';
import {validateMaterialLineageEnvelope} from '../src/material_lineage_domain.js';
import {quoteGearWork, workContributions, freshWork, validateWork} from '../src/gear_work.js';
let native;
const getNative = async () => native ||= await loadNative(`
export {item_templates,getItemFromKey} from './src/items.js';
export {equipmentDurability as durability} from './src/absorb_e2/durability.js';
export {configureGearWorkshop,quoteWorkshop,executeWorkshop,validateWorkshopEnvelope,projectWorkshop,quoteHide,executeHide} from './src/gear_workshop_domain.js';
export {setToolsState,toolsState} from './src/tools_domain.js';
export {applyEquipmentStats} from './src/equipment_stats.js';
export {Enemy} from './src/enemies.js';
export {character} from './src/data/character.js';
export {fieldDefinitions} from './src/field_workshop.js';
`,{stubs: STANCE_LOCATION_STUBS,logLevel:'error'});
const basicKey = JSON.stringify({components:{head:'Cheap iron short blade',handle:'Simple wooden short handle'},quality:100});
const partKey = id => JSON.stringify({id,quality:100});
const key = id => JSON.stringify({id});
async function fixture() {
 const n=await getNative(); n.durability.load({enabled:true}); n.setToolsState(null);
 const items={}, actor={id:'smith.player',getItems:()=>items,getEquipment:()=>({}),
  addToInventory(rows){for(const r of rows) {if(items[r.item_key])items[r.item_key].count+=r.count;else items[r.item_key]={item:n.getItemFromKey(r.item_key),count:r.count};}},
  removeFromInventory(rows){for(const r of rows){assert.ok(items[r.item_key]?.count>=r.item_count);items[r.item_key].count-=r.item_count;if(!items[r.item_key].count)delete items[r.item_key];}}};
 let clock=100,station=1,skill=10,world='base.frontier',fail=false,saves=0; const blocked=new Set();
 const ports={actor:()=>actor,templates:n.item_templates,itemFactory:n.getItemFromKey,world:()=>world,location:()=> 'Village',skillLevel:()=>skill,stationTier:()=>station,clock:()=>clock,
  writable:()=>true,idle:()=>true,blocked:()=>'',itemOwners:()=>[items],assertSpend:k=>{if(blocked.has(k))throw Error('committed stock');},persist:done=>{if(fail)throw Error('save failed');saves++;done();},refresh:()=>{},logMessage:()=>{}};
 n.configureGearWorkshop(ports);
 actor.addToInventory([{item_key:basicKey,count:1},{item_key:partKey('Simple wooden short handle'),count:3},{item_key:partKey('Cheap iron short blade'),count:8},{item_key:key('Charcoal'),count:8},{item_key:key('Lamp oil'),count:2},{item_key:key('Iron ingot'),count:5},{item_key:partKey('Cloudy quartz setting'),count:1}]);
 const run=(action,k=basicKey,extra={})=>{const q=n.quoteWorkshop({action,key:k,...extra});assert.equal(q.eligible,true,q.reason);return n.executeWorkshop(q).resultKey;};
 return {n,items,actor,ports,run,setClock:v=>clock=v,setStation:v=>station=v,setSkill:v=>skill=v,setWorld:v=>world=v,setFail:v=>fail=v,blocked,saves:()=>saves};
}

test('workshop native journey: process, source effects, field repair, swap, preserved identity and material custody',async()=>{
 const f=await fixture(),{n,items,run}=f;
 let k=run('attach',basicKey,{role:'grip',material:partKey('Simple wooden short handle')});
 const id=JSON.parse(k).e2_instance;
 assert.ok(id);assert.equal(items[partKey('Simple wooden short handle')].count,2);
 const base=n.getItemFromKey(basicKey),worked=items[k].item;
 assert.ok(worked.getStats().attack_points.multiplier>(base.getStats().attack_points?.multiplier ?? 1));
 assert.ok(worked.getStats().stamina_efficiency.multiplier<1);
 const snapshot=JSON.stringify([items,n.durability.serialize()]);n.quoteWorkshop({action:'detach',key:k,role:'grip'});
 assert.equal(JSON.stringify([items,n.durability.serialize()]),snapshot,'quote must not allocate IDs, draws or stock');
 k=run('heat',k);k=run('shape',k);k=run('quench',k,{material:key('Lamp oil')});
 const brittle=items[k].item.getWearProfile();assert.equal(items[key('Lamp oil')].count,1);
 k=run('temper',k);assert.ok(items[k].item.getWearProfile().toughness>brittle.toughness);
 n.durability.setCondition(k,50);n.setToolsState({schema:1,instances:{[k]:{max:90,repairs:1,failures:1}},job:null});
 f.setStation(0);k=run('fieldRepair',k,{material:partKey('Cheap iron short blade')});
 assert.equal(n.durability.condition(k),90);assert.equal(n.toolsState().instances[k].max,90);
 f.setStation(1);k=run('swap',k,{slot:'head',material:partKey('Cheap iron short blade')});
 assert.equal(JSON.parse(k).e2_instance,id);assert.equal(n.durability.condition(k),90);
 const eq=n.getItemFromKey(k);assert.deepEqual(eq.gearwork,items[k].item.gearwork);assert.equal(eq.getInventoryKey(),k);
 n.validateWorkshopEnvelope({inventories:{person:{player:{[k]:{count:1}}}}});
 k=run('detach',k,{role:'grip'});assert.equal(items[partKey('Simple wooden short handle')].count,3);
 const salvaged=JSON.parse(k);run('salvage',k);assert.equal(items[k],undefined);assert.equal(n.durability.serialize().condition[k],undefined);
 assert.ok(Object.keys(items).some(k=>JSON.parse(k).quality===45));
 assert.ok(salvaged.gearwork.history.length>=7);
});

test('workshop atomic rejection: stale input, custody, failed save and rollback of ID/condition/tool facts',async()=>{
 const f=await fixture(),{n,items,run}=f;
 const request={action:'attach',key:basicKey,role:'grip',material:partKey('Simple wooden short handle')};
 const q=n.quoteWorkshop(request),stock=items[request.material];delete items[request.material];assert.throws(()=>n.executeWorkshop(q));items[request.material]=stock;
 f.blocked.add(request.material);assert.throws(()=>n.executeWorkshop(q),/committed stock/);f.blocked.clear();
 const before=structuredClone([items,n.durability.serialize(),n.toolsState()].map((v,i)=>i===0?JSON.parse(JSON.stringify(v)):v));f.setFail(true);
 assert.throws(()=>n.executeWorkshop(q),/save failed/);assert.deepEqual([JSON.parse(JSON.stringify(items)),n.durability.serialize(),n.toolsState()],before);
 f.setFail(false);let k=run('finish');n.durability.setCondition(k,41);n.setToolsState({schema:1,instances:{[k]:{max:80,repairs:2,failures:2}},job:null});
 const before2=[JSON.parse(JSON.stringify(items)),n.durability.serialize(),structuredClone(n.toolsState())];f.setFail(true);
 assert.throws(()=>run('refit',k),/save failed/);assert.deepEqual([JSON.parse(JSON.stringify(items)),n.durability.serialize(),n.toolsState()],before2);
});

test('process law: real heat, cooling, material families, independent world rules and no repeated free improvement',async()=>{
 const f=await fixture(),{n,items,run}=f;
 delete items[key('Charcoal')];f.actor.addToInventory([{item_key:key('Rough wood log'),count:100}]);
 assert.match(n.quoteWorkshop({action:'heat',key:basicKey}).reason,/grade 1/);
 f.actor.addToInventory([{item_key:key('Charcoal'),count:2}]);let k=run('heat');f.setClock(106);
 assert.match(n.quoteWorkshop({action:'shape',key:k}).reason,/cooled/);
 k=run('finish',k);assert.equal(n.quoteWorkshop({action:'finish',key:k}).eligible,false);
 f.setSkill(20);k=run('finish',k);assert.equal(n.quoteWorkshop({action:'finish',key:k}).eligible,false);
 f.setWorld('unmodeled.world');assert.match(n.quoteWorkshop({action:'heat',key:k}).reason,/no authored/);
 assert.equal(Object.values(n.item_templates).find(t=>t.material_label==='steel chainmail').material_family,'metal');
 assert.equal(n.item_templates['Weak bone short handle'].material_family,'bone');
});

test('a cooled shaped piece keeps its paid shaping when reheated', async () => {
 const f = await fixture(), {n, items, run} = f;
 assert.match(n.quoteWorkshop({action: 'shape', key: basicKey}).reason, /heat the metal/i);
 const shapedKey = run('shape', run('heat'));
 const shaped = JSON.parse(shapedKey);
 f.setClock(106);
 assert.match(n.quoteWorkshop({action: 'quench', key: shapedKey, material: key('Lamp oil')}).reason, /cooled/);

 const fuelBefore = items[key('Charcoal')].count;
 const reheatedKey = run('heat', shapedKey);
 const reheated = n.getItemFromKey(reheatedKey);
 assert.equal(items[key('Charcoal')].count, fuelBefore - 1);
 assert.equal(JSON.parse(reheatedKey).e2_instance, shaped.e2_instance);
 assert.deepEqual(reheated.gearwork.treatment, {...shaped.gearwork.treatment, at: 106});
 assert.match(n.quoteWorkshop({action: 'shape', key: reheatedKey}).reason, /already been shaped/);
 const quenchedKey = run('quench', reheatedKey, {material: key('Lamp oil')});
 assert.equal(n.getItemFromKey(quenchedKey).gearwork.treatment.stage, 'quenched');
});

test('same worked-item modifiers feed both equipment consumers; wear uses persist and honing cannot reroll',async()=>{
 const {n,run,items}=await fixture();let k=run('attach',basicKey,{role:'coating',material:partKey('Cheap iron short blade')});
 const item=items[k].item;for(let i=0;i<5;i++) n.durability.wearItem(item,1);
 assert.equal(n.durability.uses(k),5);const stored=n.durability.serialize();n.durability.load(stored);assert.equal(n.durability.uses(k),5);
 const priorCondition=n.durability.condition(k);k=run('hone',k);assert.equal(JSON.parse(k).quality,102);assert.equal(n.durability.condition(k),priorCondition);
 assert.equal(n.quoteWorkshop({action:'hone',key:k}).eligible,false);
 const levelable=()=>({stats:{flat:{equipment:{},affixes:{}},multiplier:{equipment:{},affixes:{}}},bonus_skill_levels:{flat:{equipment:{}}}});
 const a=levelable(),b=levelable();n.applyEquipmentStats(a,{weapon:items[k].item});n.applyEquipmentStats(b,{weapon:n.getItemFromKey(k)});assert.deepEqual(a,b);
 n.applyEquipmentStats(b,{});assert.equal(b.stats.multiplier.equipment.damage_taken,undefined);
 assert.ok(items[k].item.getWorkContributions().some(r=>r.label.startsWith('coating')));
 const enemy = new n.Enemy({name:'Worked gear target',stats:{health:30,attack:40,agility:1,dexterity:10,intuition:1,attack_points:10,crit_rate:0,crit_multiplier:2},equipment_keys:{weapon:k}});enemy.init();
 const hero=n.character;hero.equipItem(n.getItemFromKey(k));
 assert.equal(hero.getFullStats().damage_taken,enemy.getFullStats().damage_taken);hero.unequipItem('weapon');
 n.durability.setEnabled(false);const usesBefore=n.durability.uses(k),conditionBefore=n.durability.condition(k);n.durability.wearItem(items[k].item,5);
 assert.equal(n.durability.uses(k),usesBefore+5);assert.equal(n.durability.condition(k),conditionBefore,'durability-off use earns handling without wear');
});

test('work records reject unsupported revisions and nonfinite physical modifiers',()=>{
 assert.throws(()=>validateWork({...freshWork(),revision:2}));const w=freshWork();w.treatment.hardness=Infinity;assert.throws(()=>workContributions(w));
});

// Native socket, committed reforge and commissioned work all use the same plan.
test('rigid gem settings and commissioned native maker preserve identity, costs, sources and reforge draw boundary',async()=>{
 const f=await fixture(),{n,items,run}=f;let draws=0;
 const npcItems={},npc={is_alive:true,getTotalSkillLevel:()=>15,addToInventory(rows){for(const r of rows)npcItems[r.item_key]=(npcItems[r.item_key]||0)+r.count;}};
 f.ports.craftsman=()=>npc;f.ports.craftsmanHere=()=>true;const owners=f.ports.itemOwners;f.ports.itemOwners=()=>[...owners(),npcItems];
 f.ports.random=()=>{draws++;return .5;};n.configureGearWorkshop(f.ports);
 assert.match(n.quoteWorkshop({action:'attach',key:basicKey,role:'setting',material:partKey('Cloudy quartz setting')}).reason,/rigid setting first/);
 let k=run('socket',basicKey,{material:key('Iron ingot')});const identity=JSON.parse(k).e2_instance;
 k=run('attach',k,{role:'setting',material:partKey('Cloudy quartz setting')});
 assert.ok(items[k].item.getStats().min_damage_share.multiplier<1);assert.equal(JSON.parse(k).e2_instance,identity);
 const before=items[key('Charcoal')].count,q=n.quoteWorkshop({action:'reforge',key:k,material:partKey('Cheap iron short blade'),maker:'oldCraftsman'});
 assert.equal(q.eligible,true,q.reason);assert.equal(draws,0);k=n.executeWorkshop(q).resultKey;
 assert.equal(JSON.parse(k).e2_instance,identity);assert.equal(npcItems[key('Charcoal')],1);assert.equal(items[key('Charcoal')].count,before-2);
 assert.equal(JSON.parse(k).gearwork.history.at(-1).maker,'oldCraftsman');assert.ok(items[k].item.quality>100);
 k=run('detach',k,{role:'setting'});assert.equal(items[partKey('Cloudy quartz setting')].count,1);
 const copied=n.getItemFromKey(k);assert.equal(copied.getInventoryKey(),k);assert.equal(copied.gearwork.socket.type,'rigid-setting');
});

test('armor reforge resolves stored affixes only at commit and rolls back its native receipt owner after a failed save',async()=>{
 const f=await fixture(),{n,actor,items}=f,receipts=[];const owners=f.ports.itemOwners;
 f.ports.itemOwners=()=>[...owners(),receipts];f.ports.random=k=>{receipts.push(k);return .5;};n.configureGearWorkshop(f.ports);
 const armorData=JSON.parse(n.item_templates['Steel chainmail armor'].getInventoryKey());armorData.quality=150;const armor=JSON.stringify(armorData);actor.addToInventory([{item_key:armor,count:1}]);
 const q=n.quoteWorkshop({action:'reforge',key:armor,material:partKey('Cheap iron short blade')});assert.equal(q.eligible,true,q.reason);assert.equal(receipts.length,0);
 f.setFail(true);assert.throws(()=>n.executeWorkshop(q),/save failed/);assert.equal(receipts.length,0);assert.ok(items[armor]);
 f.setFail(false);const result=n.executeWorkshop(q);assert.ok(receipts.length>0);const copy=n.getItemFromKey(result.resultKey);assert.deepEqual(copy.affixes,JSON.parse(result.resultKey).affixes);assert.match(copy.getName(),/\[/);
});

test('cold-brittle metal armor: a warm lining resolves the need and lasting wear differs in the saved condition',async()=>{
 const f=await fixture(),{n,actor,items,ports,run}=f;let temperature=20;ports.temperature=()=>temperature;n.configureGearWorkshop(ports);
 const lining='Wool shirt';
 const armorData=JSON.parse(n.item_templates['Steel chainmail armor'].getInventoryKey());armorData.quality=150;let armor=JSON.stringify(armorData);
 actor.addToInventory([{item_key:armor,count:1},{item_key:partKey(lining),count:2}]);armor=run('finish',armor);
 const wearAfter=(k,hits)=>{const item=items[k].item;n.durability.setCondition(k,100);for(let i=0;i<hits;i++)n.durability.wearItem(item,1);return 100-n.durability.condition(k);};
 const bare=wearAfter(armor,10);temperature=0;const cold=wearAfter(armor,10);
 assert.ok(Math.abs(cold/bare-2)<.01,'unlined metal armor wears 2x in cold air');
 const q=n.quoteWorkshop({action:'attach',key:armor,role:'lining',material:partKey(lining)});assert.equal(q.eligible,true,q.reason);
 const k=n.executeWorkshop(q).resultKey;
 assert.equal(n.durability.serialize().condition[armor],undefined,'condition follows the rekeyed instance');
 const lined=wearAfter(k,10);assert.ok(lined<cold&&lined>=bare,'lining resolves most of the cold wear');
 temperature=20;assert.ok(Math.abs(wearAfter(k,10)-bare)<.01,'warm air has no cold need');
 const stored=n.durability.serialize();n.durability.load(JSON.parse(JSON.stringify(stored)));assert.equal(n.durability.condition(k),stored.condition[k]);
 const row=n.projectWorkshop().rows.find(r=>r.key===k);assert.equal(row.need.insulation>.9,true);assert.equal(n.projectWorkshop().rows.find(r=>r.key===armor),undefined);
});

test('native hide preparation accepts idle elapsed time, stamps current chronology and rejects lost stock without spending',async()=>{
 const f=await fixture(),{n,actor,items}=f;
 actor.addToInventory([{item_key:key('Rat pelt'),count:6},{item_key:key('Rough wood log'),count:2}]);
 const reviewed=n.quoteHide('smoked');assert.equal(reviewed.eligible,true,reviewed.reason);
 f.setClock(60);const committed=n.executeHide(reviewed);
 assert.equal(JSON.parse(committed.receive[0].key).lineage.history[0].at,60);
 assert.equal(items[key('Rat pelt')].count,3);
 const stale=n.quoteHide('smoked');delete items[key('Rat pelt')];
 const before=JSON.stringify(items);
 assert.throws(()=>n.executeHide(stale),/untreated rat pelts/);
 assert.equal(JSON.stringify(items),before,'rejected quote spends nothing');
});

test('learned focus steadies real quench and temper results, spends its own reserve and rolls back with a failed save',async()=>{
 const f=await fixture(),{n,items,ports,run}=f;
 const policy=n.fieldDefinitions.energies.find(e=>e.id==='field.focus');
 const root={simulation:{energies:{player:{'field.focus':{policy:structuredClone(policy),reserve:4,strain:0}}}}};
 ports.root=()=>root;ports.registry={simulation:{energies:new Map([[policy.id,policy]])}};
 n.configureGearWorkshop(ports);
 let k=run('heat');
 const request={action:'quench',key:k,material:key('Lamp oil'),focus:true};
 const q=n.quoteWorkshop(request),ordinary=n.quoteWorkshop({...request,focus:false});
 assert.equal(q.eligible,true,q.reason);
 assert.ok(JSON.parse(q.receive[0].key).gearwork.treatment.toughness>JSON.parse(ordinary.receive[0].key).gearwork.treatment.toughness);
 const before=JSON.stringify([items,root,n.durability.serialize()]);
 n.quoteWorkshop(request);assert.equal(JSON.stringify([items,root,n.durability.serialize()]),before,'preview spends neither energy nor stock');
 f.setFail(true);assert.throws(()=>n.executeWorkshop(q),/save failed/);
 assert.equal(JSON.stringify([items,root,n.durability.serialize()]),before,'native transaction also restores energy');
 f.setFail(false);k=n.executeWorkshop(q).resultKey;
 assert.equal(root.simulation.energies.player['field.focus'].reserve,2);
 assert.equal(root.simulation.energies.player['field.focus'].strain,1);
 assert.equal(items[key('Lamp oil')].count,1);
 assert.ok(items[k].item.getWorkContributions().some(r=>r.label==='Heat-treated edge'));
 k=run('temper',k,{focus:true});
 assert.equal(root.simulation.energies.player['field.focus'].reserve,0);
 assert.equal(root.simulation.energies.player['field.focus'].strain,2);
 assert.ok(items[k].item.getWearProfile().toughness>n.getItemFromKey(basicKey).getWearProfile().toughness);
 assert.match(n.quoteWorkshop({action:'temper',key:k,focus:true}).reason,/Recover measured focus/);
});

test('focus cannot replace heat or oil, transfer to another maker, or spend from a stale reserve',async()=>{
 const f=await fixture(),{n,ports,run,items}=f;
 const policy=n.fieldDefinitions.energies.find(e=>e.id==='field.focus');
 const root={simulation:{energies:{player:{}}}};
 ports.root=()=>root;ports.registry={simulation:{energies:new Map([[policy.id,policy]])}};n.configureGearWorkshop(ports);
 let k=run('heat');const request={action:'quench',key:k,material:key('Lamp oil'),focus:true};
 assert.match(n.quoteWorkshop(request).reason,/Learn measured focus/);
 root.simulation.energies.player[policy.id]={policy:structuredClone(policy),reserve:4,strain:0};
 assert.match(n.quoteWorkshop({action:'heat',key:k,focus:true}).reason,/does not supply forge heat/);
 const q=n.quoteWorkshop(request);root.simulation.energies.player[policy.id].reserve=0;
 const before=JSON.stringify(items);assert.throws(()=>n.executeWorkshop(q),/Recover measured focus/);assert.equal(JSON.stringify(items),before);
 root.simulation.energies.player[policy.id].reserve=4;root.simulation.energies.player[policy.id].strain=policy.strainLimit;
 assert.match(n.quoteWorkshop(request).reason,/Rest measured focus/);
 root.simulation.energies.player[policy.id].strain=0;
 f.setSkill(20);assert.match(n.quoteWorkshop(request).reason,/Work by hand without spending focus/);f.setSkill(10);
 delete items[key('Lamp oil')];assert.equal(n.quoteWorkshop(request).eligible,false,'focus cannot stand in for consumed quench medium');
 f.setClock(106);assert.match(n.quoteWorkshop(request).reason,/cooled/);
});

test('selected inscription reroll preserves neighboring affixes and copy identity, debits stock and rolls back on quota failure',async()=>{
 const f=await fixture(),{n,actor,items}=f,draws=[];const owners=f.ports.itemOwners;
 f.ports.itemOwners=()=>[...owners(),draws];f.ports.random=k=>{draws.push(k);return .7;};n.configureGearWorkshop(f.ports);
 const data=JSON.parse(n.item_templates['Steel chainmail armor'].getInventoryKey());data.quality=150;data.affixes=[{id:'armor.nimble',v:.02,s:'roll'},{id:'armor.vital',v:.03,s:'roll'}];const armor=JSON.stringify(data);actor.addToInventory([{item_key:armor,count:1}]);
 const q=n.quoteWorkshop({action:'reroll',key:armor,affix:'armor.nimble'});assert.equal(q.eligible,true,q.reason);assert.equal(draws.length,0);
 const stock=items[key('Iron ingot')].count;f.setFail(true);assert.throws(()=>n.executeWorkshop(q),/save failed/);assert.equal(draws.length,0);assert.equal(items[key('Iron ingot')].count,stock);assert.ok(items[armor]);
 f.setFail(false);const result=n.executeWorkshop(q),again=JSON.parse(result.resultKey);
 assert.deepEqual(again.affixes.find(a=>a.id==='armor.vital'),data.affixes[1]);assert.equal(again.affixes.length,2);assert.equal(items[key('Iron ingot')].count,stock-1);assert.ok(again.e2_instance);assert.ok(draws.length>0);
 n.validateWorkshopEnvelope({inventories:{player:{[result.resultKey]:{count:1}}}});
});

test('a traced axe keeps its fitted parts through swap and degrades the exact removed cohorts', async () => {
 const f = await fixture(), {n, actor, items, run} = f;
 const traced = (id, family, quality, parent) => planProcessedMaterial({
  stock:{[parent]:1},inputs:[{item_key:parent,count:1}],output:{id,family,count:1,quality},
  process:{id:'test.fixture-craft',revision:1,at:10,world_id:'base.frontier'}
 }).item_key;
 const head = traced('Iron axe head','axe-head',90,key('Iron ingot'));
 const handle = traced('Simple wooden medium handle','wooden-handle',60,key('Processed rough wood'));
 const ash = traced('Ash wood medium handle','wooden-handle',100,key('Processed ash wood'));
 const base = JSON.stringify(retainGearComponentLineage(
  {components:{head:'Iron axe head',handle:'Simple wooden medium handle'},quality:100},
  [n.getItemFromKey(head),n.getItemFromKey(handle)]));
 actor.addToInventory([{item_key:base,count:1},{item_key:ash,count:1}]);
 assert.equal(n.getItemFromKey(base).getInventoryKey(),base);
 const oldTier = items[base].item.getItemTier();
 const forged = run('swap',base,{slot:'handle',material:ash});
 assert.deepEqual(JSON.parse(forged).componentLineage,{head,handle:ash});
 assert.equal(items[ash],undefined);
 const [removed] = Object.keys(items).filter(k=>JSON.parse(k).id==='Simple wooden medium handle');
 assert.equal(JSON.parse(removed).quality,30);
 assert.equal(readMaterialLineage(removed).history[0].inputs[0].item_key,handle);
 assert.ok(items[forged].item.getItemTier() > oldTier);
 validateMaterialLineageEnvelope({inventories:{person:{player:{[forged]:{count:1}}}}});
 const malformed = JSON.parse(forged);
 malformed.componentLineage.handle = handle;
 assert.throws(()=>n.getItemFromKey(JSON.stringify(malformed)),/disagrees with its fitted component/);

 run('salvage',forged);
 assert.equal(items[forged],undefined);
 const salvage = Object.keys(items).filter(k=>['Iron axe head','Ash wood medium handle'].includes(JSON.parse(k).id));
 assert.deepEqual(salvage.map(k=>readMaterialLineage(k).history[0].inputs[0].item_key),[head,ash]);
});

test('repeated recovery keeps a dated flat history that the native save accepts', async () => {
 const n = await getNative();
 const id = 'Iron axe head', source = key('Iron ingot');
 const forged = planProcessedMaterial({
  stock:{[source]:1}, inputs:[{item_key:source,count:1}], output:{id,family:'axe-head',count:1,quality:100},
  process:{id:'test.fixture-craft',revision:1,at:10,world_id:'base.frontier'}
 }).item_key;
 let previous = forged;
 for(let i=0;i<24;i++) {
  previous = recoveredGearComponent({id,quality:Math.max(1,100>>Math.min(i+1,7)),previous,
   at:20+i,world:'base.frontier',operation:i%2?'swap':'salvage',condition:100});
 }
 const saved = JSON.parse(JSON.stringify({inventories:{person:{player:{[previous]:{count:1}}}}}));
 validateMaterialLineageEnvelope(saved);
 assert.equal(n.getItemFromKey(previous).getInventoryKey(),previous);
 const {history} = readMaterialLineage(previous);
 assert.equal(history.length,24);
 assert.equal(history[0].inputs[0].item_key,forged);
 assert.equal(history[1].inputs[0].facts.quality,50);
 assert.deepEqual(history.map(event=>event.at),Array.from({length:24},(_,i)=>20+i));
 assert.ok(previous.length<10000);
 assert.throws(()=>recoveredGearComponent({id,quality:1,previous,at:19,world:'base.frontier',operation:'swap',condition:100}),/predate/);
});
