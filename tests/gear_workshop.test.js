import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {quoteGearWork, workContributions, freshWork, validateWork} from '../src/gear_work.js';
let native;
const getNative = async () => native ||= await loadNative(`
export {item_templates,getItemFromKey} from './src/items.js';
export {equipmentDurability as durability} from './src/absorb_e2/durability.js';
export {configureGearWorkshop,quoteWorkshop,executeWorkshop,validateWorkshopEnvelope} from './src/gear_workshop_domain.js';
export {setToolsState,toolsState} from './src/tools_domain.js';
export {applyEquipmentStats} from './src/equipment_stats.js';
export {Enemy} from './src/enemies.js';
export {character} from './src/data/character.js';
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
