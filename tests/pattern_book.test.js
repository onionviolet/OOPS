import {generateMaterial} from '../src/craft_materials.js';
import {freezeMaterials} from '../src/craft_state.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultCheatState,grantCheat,seedBeginningCheats,awakenCheats,carryCheats,validateCheatState} from '../src/cheat_cards.js';
import {moduleCard} from '../src/cheat_definitions.js';
import {planCheatAction} from '../src/cheat_mechanisms.js';
import {quoteCrafting,stageCrafting,projectCrafting,materialKey,catalogue} from '../src/crafting_frontier_runtime.js';
import {referenceKey,SALT_STEEP} from '../src/craft_reference_content.js';
const context={world:'base.frontier',location:'Village',clock:0,blocked:'',root:7,skill:0};
function fixture(){
 const q=quoteCrafting(null,{}, {type:'acquire',ref:'village.method-book'},context),owner=stageCrafting(null,{},q,context).state;
 let cheats=awakenCheats(seedBeginningCheats(defaultCheatState(),{at:0}),{dayCount:3,at:0}).state;
 cheats=grantCheat(cheats,moduleCard('pattern-book'),{at:0,route:'test'});cheats.held['quiet-faculty'].card.stages.push({id:'pattern-book',at:0,via:'test',carried:true});
 return {cheats,crafting:owner,inventories:{person:{main_character:{[referenceKey('village.method-book')]:{count:1}}}},'current time':{year:999,month:4,day:1,hour:8,minute:0},expansion:{actors:{player:{worldId:'base.frontier'}}}};
}
test('Pattern Book copies accessible design only; a returned book stops new sketches and failures spend nothing',()=>{
 const s=fixture(),next=planCheatAction(s,{type:'sketch',id:SALT_STEEP.id});
 assert.equal(next.cheats.held['pattern-book'].card.state.charges,2);assert.equal(next.cheats.held['pattern-book'].card.state.patterns[0].recipe.id,SALT_STEEP.id);
 assert.deepEqual(next.crafting,s.crafting);assert.deepEqual(next.inventories,s.inventories);
 assert.equal(next.crafting.knowledge.player,undefined,'no material truth learned');
 const lost=structuredClone(s);lost.inventories.person.main_character={};assert.throws(()=>planCheatAction(lost,{type:'sketch',id:SALT_STEEP.id}),/Read or learn/);
 assert.equal(lost.cheats.held['pattern-book'].card.state.charges,3);assert.throws(()=>planCheatAction(next,{type:'sketch',id:SALT_STEEP.id}),/already retained/);
});
test('Pattern Book survives heir carry; rebuilding enables the existing recipe consumer without goods or skill',()=>{
 const s=planCheatAction(fixture(),{type:'sketch',id:SALT_STEEP.id}),heir=structuredClone(s);heir.cheats=carryCheats(s.cheats,defaultCheatState(),{heir:true});heir.crafting=null;heir.inventories.person.main_character={};
 assert.equal(heir.cheats.held['pattern-book'].card.state.charges,0);validateCheatState(heir.cheats);
 heir.cheats.held['quiet-faculty'].card.state.points=1;heir.cheats.held['quiet-faculty'].card.state.earned=1;
 const restored=planCheatAction(planCheatAction(JSON.parse(JSON.stringify(heir)),{type:'recharge',id:'pattern-book'}),{type:'rebuild-pattern',id:SALT_STEEP.id});
 assert.equal(projectCrafting(restored.crafting,{}).methods[0].id,SALT_STEEP.id);assert.deepEqual(restored.inventories,heir.inventories);assert.deepEqual(restored.crafting.knowledge,{});
 const request={type:'craft',recipe:SALT_STEEP.id,inputs:[]};assert.match(quoteCrafting(restored.crafting,{},request,context).reason,/Select at least/);
 const mats=['riversalt','reedherb'].map(id=>generateMaterial(catalogue,id,{root:4,scope:'test',index:0}).value);restored.crafting=freezeMaterials(restored.crafting,catalogue,mats);const keys=mats.map(m=>materialKey(m,50)),inventory=Object.fromEntries(keys.map(k=>[k,2]));request.inputs=keys.map(key=>({key,qty:1}));
 const quote=quoteCrafting(restored.crafting,inventory,request,context);assert.equal(quote.eligible,true);const batch=stageCrafting(restored.crafting,inventory,quote,context);assert.equal(batch.items.filter(i=>i.amount<0).length,2);
 const foreign=structuredClone(heir);foreign.expansion.actors.player.worldId='book.paradise.hub';assert.throws(()=>planCheatAction(foreign,{type:'rebuild-pattern',id:SALT_STEEP.id}),/Frontier law/);
 const corrupted=structuredClone(s);corrupted.cheats.held['pattern-book'].card.state.patterns[0].recipe.slots=[];assert.throws(()=>validateCheatState(corrupted.cheats),/retained pattern/);
});
