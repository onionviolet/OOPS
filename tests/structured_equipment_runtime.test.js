import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateStructuredEquipmentDefinition,nativeStructuredEquipmentTemplate,projectStructuredEquipment} from '../src/structured_equipment_runtime.js';

const key=JSON.stringify({id:'original.coat'});
const item={id:'original.coat',label:'Layered coat',description:'Original test fixture',equipment:{slot:'torso',baseDefense:12,weight:8,layer:2,coverage:{chest:1,back:1,groin:0.5,elbow:0,armpit:0},forms:['human'],titleClaimId:'original.title',fitFlag:'fit',maintainedFlag:'upkeep',dryFlag:'dry',paddingFlag:'padding',conditionFlag:'condition',unfitMultiplier:0.5,unmaintainedMultiplier:0.75,movementPenalty:0.1,heatBurden:0.2,coldProtection:0.3,rainProtection:0.2,riding:true}};
function fixture(){return {definitions:[item],equipment:{torso:key},actorId:'player',body:{form:'human',ownerId:'player',controllerId:'player',mobile:true,legs:2},facts:{fit:true,upkeep:true,dry:true,padding:true,condition:1},state:{simulation:{claims:{'original.title':{owner:'supplier',status:'held'}},custody:{loan:{owner:'supplier',holder:'player',key,count:1}}}}};}

test('actual worn titled unit supplies native defense, exact regional gaps, weight and riding',()=>{
 const f=fixture(),before=structuredClone(f),p=projectStructuredEquipment(f);
 assert.equal(p.effects['structured.equipment'].effects.stats.defense.flat,12);assert.equal(p.coverage.chest,1);assert.equal(p.coverage.groin,0.5);assert.equal(p.facts['equipment.defense.elbow'],0);assert.equal(p.facts['equipment.coverage.armpit'],0);assert.equal(p.weight,8);assert.equal(p.riding,true);assert.deepEqual(f,before);
 assert.equal(nativeStructuredEquipmentTemplate(item).base_defense,0);
 assert.equal(nativeStructuredEquipmentTemplate(item).id,item.id);
});
test('carried only, wrong slot, wrong body and lost exact custody cannot supply defense',()=>{
 const f=fixture();f.equipment={};assert.deepEqual(projectStructuredEquipment(f).effects,{});
 f.equipment={arms:key};assert.deepEqual(projectStructuredEquipment(f).effects,{});
 f.equipment={torso:key};f.body.form='other';assert.deepEqual(projectStructuredEquipment(f).effects,{});
 f.body.form='human';f.state.simulation.custody.loan.key=JSON.stringify({id:'other.coat'});assert.deepEqual(projectStructuredEquipment(f).effects,{});
 f.state.simulation.claims['original.title'].owner='player';assert.equal(projectStructuredEquipment(f).defenseByKey[key],12);
 f.state.simulation.claims['original.title'].status='returned';assert.equal(projectStructuredEquipment(f).defenseByKey[key],0);
});
test('fit, upkeep, condition and padding reach physical defense and native stamina independently',()=>{
 const f=fixture();f.facts.fit=false;f.facts.upkeep=false;f.facts.condition=0.5;f.facts.padding=false;
 const p=projectStructuredEquipment(f);assert.equal(p.defenseByKey[key],2.25);assert.equal(p.coverage.chest,0.1875);assert.equal(p.riding,false);assert.equal(p.effects['structured.equipment'].effects.stats.stamina_efficiency.multiplier,1/1.2);
 f.facts.condition=0;assert.equal(projectStructuredEquipment(f).defenseByKey[key],0);
});
test('cold, rain and heat use actual environment and dry/maintained layers',()=>{
 const f=fixture(),normal=projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.stamina_efficiency.multiplier;
 f.weather={hot:true};assert.ok(projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.stamina_efficiency.multiplier<normal);
 f.weather={cold:true,coldPenalty:0.4};const dry=projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.stamina_efficiency.multiplier;f.facts.dry=false;assert.ok(projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.stamina_efficiency.multiplier<dry);
 f.weather={raining:true,rainPenalty:0.4};f.facts.upkeep=true;const maintained=projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.stamina_efficiency.multiplier;f.facts.upkeep=false;assert.ok(projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.stamina_efficiency.multiplier<maintained);
});
test('overlapping layers combine coverage without closing explicitly bare regions',()=>{
 const f=fixture(),second=structuredClone(item);second.id='original.sleeve';second.equipment.slot='arms';second.equipment.layer=1;second.equipment.titleClaimId=undefined;second.equipment.coverage={chest:0.5,forearm:1,elbow:0};
 f.definitions.push(second);f.equipment.arms=JSON.stringify({id:second.id});const p=projectStructuredEquipment(f);
 assert.equal(p.coverage.chest,1);assert.equal(p.coverage.forearm,1);assert.equal(p.regionDefense.chest,18);assert.equal(p.coverage.elbow,0);assert.equal(p.layers[0].slot,'arms');assert.equal(p.weight,16);
});
test('legacy metadata absence leaves existing equipment and save input unchanged',()=>{
 const f=fixture();f.definitions=[{id:item.id}];const before=structuredClone(f);assert.deepEqual(projectStructuredEquipment(f).effects,{});assert.deepEqual(f,before);assert.equal(nativeStructuredEquipmentTemplate(f.definitions[0]),null);
});
test('descriptor is accepted by the actual Hero effect consumer without consumable amplification',()=>{
 // Importing Hero boots the UI singleton graph. Execute its exact pure method
 // body with only its declared tag dependency instead of booting a fake DOM.
 const source=readFileSync(new URL('../src/models/hero.js',import.meta.url),'utf8');
 const method=source.match(/    getEffectWithBonuses\(active_effect\) \{([\s\S]*?)\n    \}\n/);
 assert.ok(method);
 const consume=new Function('active_effect','skill_consumable_tags',method[1]);
 const effect=projectStructuredEquipment(fixture()).effects['structured.equipment'];
 const result=consume.call({getTotalSkillCoefficient(){throw Error('Physical armor must not be amplified by consumable skills.');}},effect,{Medicine:'medicine'});
 assert.deepEqual(result,effect.effects);assert.equal(effect.duration,null);
});
test('malformed policy cannot create unknown coverage, slots or negative physical effects',()=>{
 validateStructuredEquipmentDefinition(item);
 for(const change of [{slot:'artifact'},{weight:-1},{coverage:{everywhere:1}},{coverage:{chest:2}},{conditionFlag:3},{forms:[]},{heatBurden:-1},{riding:'yes'},{unknown:1}])assert.throws(()=>validateStructuredEquipmentDefinition({...item,equipment:{...item.equipment,...change}}),/Invalid structured/);
});

test('native durability identity preserves the same loan and actual worn condition reduces its physical effect',()=>{
 const f=fixture(),identified=JSON.stringify({id:'original.coat',e2_instance:'e2.1'});f.equipment.torso=identified;
 assert.equal(projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.defense.flat,12);
 f.wearByKey={[identified]:.575};assert.equal(projectStructuredEquipment(f).effects['structured.equipment'].effects.stats.defense.flat,6.8999999999999995);
 delete f.state.simulation.custody.loan;assert.equal(projectStructuredEquipment(f).effects['structured.equipment'],undefined);
});
test('world-owned enhancement affects the exact worn defense without changing coverage or bypassing body/custody',()=>{
 const f=fixture();f.definitions=[{...item,equipment:{...item.equipment,powerFlag:'ward.active',powerMultiplier:1.25}}];
 const plain=projectStructuredEquipment(f);assert.equal(plain.defenseByKey[key],12);
 f.facts['ward.active']=true;const enhanced=projectStructuredEquipment(f);assert.equal(enhanced.defenseByKey[key],15);assert.deepEqual(enhanced.coverage,plain.coverage);assert.equal(enhanced.weight,plain.weight);
 f.facts['ward.active']=false;assert.equal(projectStructuredEquipment(f).defenseByKey[key],12);
 f.facts['ward.active']=true;delete f.state.simulation.custody.loan;assert.equal(projectStructuredEquipment(f).defenseByKey[key],0);
 for(const metadata of [{powerFlag:'ward.active'},{powerMultiplier:1.25},{powerFlag:3,powerMultiplier:1.25},{powerFlag:'ward.active',powerMultiplier:-1}])assert.throws(()=>validateStructuredEquipmentDefinition({...item,equipment:{...item.equipment,...metadata}}),/Invalid structured equipment power/);
});
