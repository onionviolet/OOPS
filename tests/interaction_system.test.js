import {villageFocus} from '../src/village_workspace.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {knownRecipeVariants, relatedKnownRecipes, knownUsesOf, materialPolicyText, bindSubjectGesture, installKnownRecipeLinks} from '../src/recipe_connections.js';
import {equipmentComparison, equipmentComparisonHTML} from '../src/equipment_comparison.js';
import {recordLearning,projectRecentLearning} from '../src/recent_learning.js';
import {combatSubject,retainCombatInspection} from '../src/combat_subject.js';
import {beginNativeCraftTransaction} from '../src/native_craft_transaction.js';
import {createDom} from '../scripts/headless/dom.mjs';
import {mountMaterialChoice} from '../src/material_choice_view.js';
import {loadNative,STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';

test('IS1/IS2: cross-category known producer graph uses declared variants and never rolls component results',()=>{
 const recipe=(data)=>({isUnlocked:()=>true,...data});
 const templates={ore:{getName:()=> 'Known ore'},bar:{material_type:'metal'},secret:{getName:()=>{throw Error('Hidden label read');}},blade:{component_type:'blade'}};
 const recipes={smelting:{items:{bar:recipe({name:'Smelt',result:{result_id:'bar'},materials:[{material_id:'ore',count:2}]})}},forging:{components:{blade:recipe({name:'Forge',recipe_type:'component',materials:[{material_id:'bar',result_id:'blade',count:1},{material_id:'secret',result_id:'secret-blade',count:1}],getResult:()=>{throw Error('Inspection rolled RNG');}})}},crafting:{equipment:{sword:recipe({name:'Assemble',components:['blade','handle']})}}};
 const rows=knownRecipeVariants(recipes,id=>id!=='secret',templates);
 assert.equal(rows.length,3);assert.ok(!JSON.stringify(rows).includes('secret-blade'));
 const links=relatedKnownRecipes({category:'forging',subcategory:'components',recipe_id:'blade'},rows,templates);
 assert.deepEqual(links.map(r=>[r.category,r.via]),[['smelting','Produces an input'],['crafting','Uses this result']]);
 assert.equal(knownUsesOf({id:'blade',component_type:'blade'},rows)[0].recipe_id,'sword');
 assert.match(materialPolicyText(true),/Mixed leftovers/);assert.match(materialPolicyText(true),/attempts/);
});

test('IS3: native stat readers keep a named fixed baseline and quality range without rolling or inventing power',()=>{
 const baseline={equip_slot:'torso',name:'Worn',quality:100,getName:()=> 'Worn',getDefense:()=>10,getStats:()=>({damage_taken:{multiplier:.9},crit_resistance:{flat:.03}})};
 const item={equip_slot:'torso',quality:100,getName:()=> 'Preview',getDefense:q=>q/10,getStats:q=>({damage_taken:{multiplier:1-q/1000},crit_resistance:{flat:.04}})};
 const comparison=equipmentComparison(item,baseline,{qualityRange:[100,120]});
 assert.deepEqual(comparison.rows.find(r=>r.id==='defense').deltas,[0,2]);
 assert.deepEqual(comparison.rows.find(r=>r.id==='damage_taken').deltas,[0,-.02]);
 assert.equal(comparison.rows.find(r=>r.id==='damage_taken').favorable,true);
 assert.match(equipmentComparisonHTML(item,baseline,{qualityRange:[100,120]}),/Worn, 100% quality/);
 assert.match(equipmentComparisonHTML(item,baseline,{qualityRange:[100,120]}),/lower reduces damage/);
 assert.match(equipmentComparison({equip_slot:'head'},baseline).unsupported,/different/);
 assert.equal(baseline.quality,100);
});

test('IS4: hidden and intermittent learning stays observer-safe; loading and rollback do not fabricate gains',()=>{
 const owner={};recordLearning(owner,'known',2);recordLearning(owner,'hidden',5);recordLearning(owner,'known',3);recordLearning(owner,'restore',400,{loading:true});
 assert.deepEqual(projectRecentLearning(owner,{visible:id=>id==='known',name:()=> 'Known practice'}),[{skillId:'known',name:'Known practice',amount:5,last:3}]);
 const transaction=beginNativeCraftTransaction({owners:[owner]});recordLearning(owner,'known',7);transaction.rollback();
 assert.equal(owner.recent_learning[0].amount,5);assert.equal(owner.recent_learning.length,2);
});

test('IS5/PK12: fighter occurrence remains distinct through replacement, reorder and ended inspection',()=>{
 const combat={},a={},b={};const id=combatSubject(combat,a);
 assert.equal(combatSubject(combat,a),id);assert.notEqual(combatSubject(combat,b),id);assert.notEqual(combatSubject({},a),id);
 const previous={id,name:'A',facts:[{label:'Hit you',value:'20%'}]};
 const next=[{id:combatSubject(combat,b),name:'B'}];
 const retained=retainCombatInspection(next,id,previous);assert.equal(retained.id,id);assert.equal(retained.ended,true);assert.equal(retained.cycle,null);
 assert.equal(retainCombatInspection(next,null,null),next[0]);
 assert.equal(retainCombatInspection(next,id,null),null);
});

test('PK12: gesture begun on A cannot activate rebound B; material inspection never commits',()=>{
 const dom=createDom();dom.loadHTML('<html><body><div id="root"><span id="label">Material</span></div></body></html>');
 const row=dom.document.getElementById('root'),label=dom.document.getElementById('label');let current='a',commands=0,selected=0;
 bindSubjectGesture(label,()=>current,()=>commands++);
 label.dispatchEvent(new dom.classes.Event('pointerdown'));current='b';label.click();assert.equal(commands,0);
 mountMaterialChoice(row,{key:'exact-100',count:1,need:1,name:'Known material',select:()=>selected++,commit:()=>commands++});
 label.click();assert.equal(commands,1,'only the earlier independent bound handler fires');assert.equal(selected,1);
 row.querySelector('[data-material-craft="1"]').click();assert.equal(commands,2);assert.equal(selected,2);
});

test('IS1/IS3 native data: every known supported category indexes without RNG and assembled armor compares real dimensions',async()=>{
 const native=await loadNative('export {recipes} from "./src/crafting_recipes.js"; export {Armor,item_templates} from "./src/items.js"; export {fill_availability_methods} from "./src/component_management.js";', {stubs:STANCE_LOCATION_STUBS});
 native.fill_availability_methods();
 for(const pages of Object.values(native.recipes))for(const entries of Object.values(pages))for(const recipe of Object.values(entries))recipe.setUnlocked();
 const before=Math.random;Math.random=()=>{throw Error('Inspection drew random');};
 try{
  const rows=knownRecipeVariants(native.recipes,()=>true,native.item_templates);
  for(const category of ['crafting','cooking','smelting','forging','alchemy','butchering','woodworking'])assert.ok(rows.some(r=>r.category===category),category);
  const parts=Object.values(native.item_templates),inside=parts.find(i=>i.component_type==='chestplate interior' && i.component_stats?.crit_resistance?.flat>0),outside=parts.find(i=>i.component_type==='chestplate exterior' && i.component_stats?.damage_taken?.multiplier<1);
  const baseline=new native.Armor({components:{internal:inside.id,external:outside.id},quality:100});
  const candidate=new native.Armor({components:{internal:inside.id,external:outside.id},quality:120});
  const comparison=equipmentComparison(candidate,baseline);
  for(const stat of ['damage_taken','min_damage_share','crit_resistance'])assert.ok(comparison.rows.some(r=>r.id===stat),stat);
 }finally{Math.random=before;}
});

// Both native award routes feed the same session view, while staging and load
// reconstruction remain observational. Parent awards use their accepted deltas.
test('IS4 native award and prepared-publication seams record only committed XP and exclude loading',async()=>{
 const n=await loadNative('export {character} from "./src/data/character.js"; export {skills} from "./src/data/skills.js"; export {fill_availability_methods} from "./src/component_management.js"; export {readGameplayActor,prepareGameplayPublication} from "./src/gameplay_publication.js";', {stubs:STANCE_LOCATION_STUBS});
 n.fill_availability_methods();const levelable=n.character.getLevelableComponent();
 n.character.addXPToSkill({skill:n.skills.Swords,xp_to_add:2,use_bonus:false,cap_gained_xp:false,add_to_parent:true,is_from_loading:true});
 assert.equal(levelable.recent_learning,undefined);
 n.character.addXPToSkill({skill:n.skills.Swords,xp_to_add:3,use_bonus:false,cap_gained_xp:false,add_to_parent:true});
 assert.deepEqual(levelable.recent_learning.map(r=>[r.skillId,r.amount]),[['Swords',3],['Weapon mastery',3]]);
 const snapshot={inventory:{},skills:{Combat:{xp:(levelable.skill_progress.Combat?.total_xp||0)+4,parent:null,enabled:true,present:true}},reputation:{}};
 const publication=n.prepareGameplayPublication({player:snapshot},{actors:{player:n.character},skills:n.skills,getItemFromKey:()=>{throw Error('No items expected');},unlockAdapter:()=>[]});
 assert.equal(levelable.recent_learning.some(r=>r.skillId==='Combat'),false);
 publication.publish();assert.equal(levelable.recent_learning.find(r=>r.skillId==='Combat').amount,4);
});

test('IS4/AA13: hidden awards cannot evict visible learning or reset cumulative session totals',()=>{
 const owner={};recordLearning(owner,'visible',2);
 for(let i=0;i<20;i++)recordLearning(owner,`hidden-${i}`,3);
 assert.deepEqual(projectRecentLearning(owner,{visible:id=>id==='visible',name:id=>id}),[{skillId:'visible',name:'visible',amount:2,last:2}]);
 recordLearning(owner,'visible',4);
 assert.equal(projectRecentLearning(owner,{visible:id=>id==='visible',name:id=>id})[0].amount,6);
 assert.equal(owner.recent_learning.length,21,'the finite skill registry, not hidden membership, bounds records');
});

test('IS2/AR7: following a known use cannot trigger legacy holder click-to-transfer commands',()=>{
 const dom=createDom();dom.loadHTML('<html><body><div id="holder"><div class="inventory_item_control"><span class="item_tooltip"><button id="use" data-known-recipe="%7B%22category%22%3A%22forging%22%2C%22subcategory%22%3A%22components%22%2C%22recipe_id%22%3A%22Short%20blade%22%7D">Known use</button></span></div></div></body></html>');
 let transfers=0,followed=[];dom.document.getElementById('holder').addEventListener('click',()=>transfers++);
 installKnownRecipeLinks(dom.document,selection=>followed.push(selection));dom.document.getElementById('use').click();
 assert.equal(transfers,0);assert.deepEqual(followed,[{category:'forging',subcategory:'components',recipe_id:'Short blade'}]);
});

test('IS5: explicitly returning from an ended inspection restores the ordinary nearby context',()=>{
 const frame={people:[{id:'known-person',name:'Known person',met:true}],things:[],history:{}};
 const previous={id:'old-fighter',name:'Old opponent'},ended=retainCombatInspection([],previous.id,previous);
 assert.equal(villageFocus({...frame,enemy:ended},'known-person').kind,'enemy');
 // The ended-reference Back control clears only presentation selection/history.
 const returned=retainCombatInspection([],null,null);
 assert.equal(villageFocus({...frame,enemy:returned},'known-person').kind,'person');
 const current=[{id:'new-fighter',name:'Current opponent'}];
 assert.equal(retainCombatInspection(current,null,null),current[0],'explicit return may inspect the actual current roster');
});

test('IS3/AA13: comparison does not infer known manufacturing history from private affix-origin metadata',()=>{
 const base={equip_slot:'torso',quality:100,getName:()=> 'Known armor',getStats:()=>({defense:{flat:1}})};
 const first={...base,affixes:[{id:'armor.reinforced',v:1,s:'mechanism'}]},second={...base,affixes:[{id:'armor.reinforced',v:1,s:'roll'}]};
 assert.equal(equipmentComparisonHTML(first,base),equipmentComparisonHTML(second,base));
 assert.match(equipmentComparisonHTML(first,base),/stored item modifier/);
});
