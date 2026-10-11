import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {ALLOY_ID, BRACE_ID, SPRINGSTEEL, deriveBraceStats, alloyEquipmentFacts, alloyTechniqueEffects} from '../src/alloy_equipment.js';
import {prepareNativeUnlocks} from '../src/native_unlock_transaction.js';
import {resolveEffectAmount} from '../src/power_models.js';
import {createContentRegistry, createExpansionState, loadExpansionState, advanceSimulation} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand, cancelSimulationJob} from '../src/simulation.js';
import {simulationFacts} from '../src/simulation_effects.js';

// Real native models/content; replace only presentation and main's startup.
// Preserve the display string helper used by upstream component generation.
test('native Smelting 10 earns the locked alloy recipe; its material crafts the brace', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'd1-native-test-'));
    try {
        const outfile = join(dir, 'native.mjs');
        await build({stdin:{contents:'export {availabilities} from "./src/data/component_references.js"; export {fill_availability_methods} from "./src/component_management.js"; export {recipes} from "./src/crafting_recipes.js"; export {skills} from "./src/data/skills.js"; export {item_templates, getItemFromKey} from "./src/items.js";',resolveDir:resolve('.')},bundle:true,format:'esm',platform:'node',outfile,
            plugins:[{name:'presentation-only',setup(b){b.onLoad({filter:/\/src\/(main|display)\.js$/},async a=>{
                const text=await readFile(a.path,'utf8');
                const names=[...text.matchAll(/export\s*\{([^}]+)\}/g)].flatMap(m=>m[1].split(',').map(s=>s.trim().split(/\s+as\s+/).at(-1))).filter(s=>/^[a-zA-Z_$][\w$]*$/.test(s));
                return {contents:names.map(s=>`export const ${s} = ${s==='game_options'?'{}':s==='capitalize_first_letter'?'s=>s[0].toUpperCase()+s.slice(1)':'()=>{}'};`).join('\n')};
            });}}]});
        const {recipes, skills, item_templates, getItemFromKey, fill_availability_methods, availabilities} = await import(pathToFileURL(outfile));
        fill_availability_methods();
        const recipe = recipes.smelting.items[ALLOY_ID];
        assert.equal(recipe.getAvailabilityComponent().getStatus().is_unlocked,false);
        assert.deepEqual(recipe.recipe_level,[10,20]); assert.equal(recipe.recipe_skill,'Smelting');
        assert.deepEqual(recipe.materials.map(m=>m.material_id || m.material_type),['Iron ingot','Steel ingot','coal']);
        const skill=skills.Smelting;
        const xp={current_level:0,total_xp:0,current_xp:0,total_xp_to_next_lvl:40,xp_to_next_lvl:40};
        const threshold=Math.round(100*40*(1-1.5**10)/(1-1.5))/100;
        const early=skill.add_xp({skillXP:xp,xp_to_add:threshold-1,track_dependencies:false});
        assert.equal(xp.current_level,9);assert.deepEqual(early.unlocks.recipes,[]);
        const earned=skill.add_xp({skillXP:xp,xp_to_add:1,track_dependencies:false});
        assert.equal(xp.current_level,10);
        assert.deepEqual(earned.unlocks.recipes,[{category:'smelting',subcategory:'items',recipe_id:ALLOY_ID}]);
        assert.equal(availabilities.recipe[ALLOY_ID],recipe.getAvailabilityComponent());
        const publication=prepareNativeUnlocks([{kind:'recipe',id:ALLOY_ID}],{availabilities,flags:{}});
        const envelope={availabilities:{recipe:{[ALLOY_ID]:0}}};
        publication.write(envelope);assert.equal(envelope.availabilities.recipe[ALLOY_ID],1);
        publication.publish();assert.equal(recipe.getAvailabilityComponent().getStatus().is_unlocked,true);
        const craft=recipes.crafting.equipment.Amulet;craft.roll_quality=()=>100;
        const brace=craft.getResult(item_templates[ALLOY_ID]);
        assert.equal(brace.id,BRACE_ID);assert.equal(brace.equip_slot,'amulet');
        assert.deepEqual(brace.getStats(),deriveBraceStats(item_templates[ALLOY_ID]));
        assert.deepEqual(getItemFromKey(brace.getInventoryKey()).getStats(),brace.getStats());
        // The native recipe reads the input material at craft time, rather than
        // copying the grade-one output template's fixed stats. Authored grade
        // is fixed in gameplay; this mutation is confined to this test module.
        const originalProfile=item_templates[ALLOY_ID].alloy_profile;
        item_templates[ALLOY_ID].alloy_profile={...originalProfile,grade:2};
        assert.deepEqual(craft.getResult(item_templates[ALLOY_ID]).getStats(),{agility:{flat:4},strength:{flat:-2}});
        item_templates[ALLOY_ID].alloy_profile=originalProfile;
        assert.ok(item_templates['Iron ingot']); // Existing save IDs still resolve.
    } finally {await rm(dir,{recursive:true,force:true});}
});

test('brace stats derive from the material grade, including its strength tradeoff',()=>{
    assert.deepEqual(deriveBraceStats({alloy_profile:SPRINGSTEEL}),{agility:{flat:2},strength:{flat:-1}});
    assert.deepEqual(deriveBraceStats({alloy_profile:{...SPRINGSTEEL,grade:2}}),{agility:{flat:4},strength:{flat:-2}});
    assert.throws(()=>deriveBraceStats({}),/profile/);
});

const braceKey=JSON.stringify({id:BRACE_ID,quality:100}),kit=JSON.stringify({id:'Prepared survey kit'});
const costs=[{type:'energy',energyId:'field.drive',operation:'use',output:3,control:1}];
const effects=[{type:'item',key:kit,amount:1}];
const command={id:'field.pack_drive',revision:1,label:'Drive packing',actorId:'player',powerId:'field.load_step',duration:1,cancellation:'refund',costs,effects};
const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{
    powers:[{id:'field.load_step',revision:1,label:'Field step',model:'practice',capacity:3}],
    energies:[{id:'field.drive',revision:1,label:'Drive',capacity:6,output:3,control:1,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:3,strainPerUse:1}],
    commands:[command,{...command,id:'other.pack'},{id:'test.equip',revision:1,label:'Equip',effects:[{type:'equipment',slot:'amulet',key:braceKey}]},{id:'test.unequip',revision:1,label:'Unequip',effects:[{type:'equipment',slot:'amulet',key:null}]}],
    onEnroll:[{type:'power',powerId:'field.load_step',operation:'learn'},{type:'energy',energyId:'field.drive',operation:'learn'},{type:'energy',energyId:'field.drive',operation:'recover',amount:6,cooling:3}]
}});
const context=p=>({actorId:'player',worldId:'base.frontier',facts:{location:'Village'},gameplay:p.gameplay,equipment:p.equipment,external:p.external});
const fresh=()=>enrollSimulation(createExpansionState(12),registry,{actorId:'player',facts:{location:'Village'},gameplay:{player:{inventory:{[braceKey]:1},skills:{},reputation:{}}},equipment:{player:{}},external:{money:0}});
const act=(p,id)=>commitSimulationCommand(p.state,registry,{id},context(p));

test('equipped fact changes only the drive application; unequip restores its quote',()=>{
    let p=fresh();const before=structuredClone(p);
    assert.equal(simulationFacts(p.state,context(p),registry)['equipment.springsteel.equipped'],false);
    assert.equal(previewSimulationCommand(p.state,registry,command.id,context(p)).costs[0].output,3);
    assert.deepEqual(p,before);
    p=act(p,'test.equip');
    const facts=simulationFacts(p.state,context(p),registry);
    assert.equal(facts['equipment.springsteel.equipped'],true);assert.equal(facts['equipment.springsteel.grade'],1);
    const quote=previewSimulationCommand(p.state,registry,command.id,context(p));
    assert.equal(quote.eligible,true);assert.equal(quote.costs[0].output,2);assert.equal(quote.effects[0].amount,2);
    assert.equal(previewSimulationCommand(p.state,registry,'other.pack',context(p)).costs[0].output,3);
    assert.deepEqual(alloyTechniqueEffects({...command,powerId:'other.family'},effects,facts,v=>resolveEffectAmount(v,facts)),effects);
    p=act(p,'test.unequip');assert.equal(p.gameplay.player.inventory[braceKey],1);
    assert.equal(simulationFacts(p.state,context(p),registry)['equipment.springsteel.grade'],0);
    assert.equal(previewSimulationCommand(p.state,registry,command.id,context(p)).effects[0].amount,1);
    assert.equal(alloyEquipmentFacts(p.state,{...context(p),equipment:{player:{weapon:braceKey}}})['equipment.springsteel.equipped'],false);
});

test('paid drive fuel and output freeze across reload, completion and cancellation',()=>{
    let p=act(fresh(),'test.equip');p=act(p,command.id);
    assert.equal(p.state.simulation.energies.player['field.drive'].reserve,4);
    const saved=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);
    // Native unequip after admission does not recalculate reserved output/fuel.
    const done=advanceSimulation(saved,registry,1,p.external,p.gameplay,{player:{facts:{location:'Village'},equipment:{}}});
    assert.equal(done.gameplay.player.inventory[kit],2);
    assert.equal(done.state.simulation.energies.player['field.drive'].reserve,4);
    const cancelled=cancelSimulationJob(saved,registry,saved.simulation.jobs[0].id,{...context(p),equipment:{player:{}}});
    assert.equal(cancelled.state.simulation.energies.player['field.drive'].reserve,6);
    assert.equal(cancelled.state.simulation.energies.player['field.drive'].strain,0);
    assert.equal(cancelled.gameplay.player.inventory[kit],undefined);
});

// Runs actual main timer/publication and native models, with isolated memory
// storage and inert presentation. The child never generates or writes fixtures.
test('equipped native brace with an open road offer keeps ticking, travelling and reloading', async () => {
    const {stdout}=await promisify(execFile)(process.execPath,
        ['docs/gm/d1-alloy-equipment-2026-10-07/fixture/generate.mjs','--equipped-clock'],
        {cwd:resolve('.'),timeout:60000,maxBuffer:1024*1024});
    assert.match(stdout,/Equipped save\/reload and native timer: PASS/);
});
