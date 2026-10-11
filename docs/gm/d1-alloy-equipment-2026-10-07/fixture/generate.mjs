// Generated test heroes only. Never reads browser storage or a save on disk.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const owner = dirname(fileURLToPath(import.meta.url));
const root = resolve(owner, '../../../..');
const temp = await mkdtemp(join(tmpdir(), 'd1-test-fixture-'));

// Like tests/alloy_equipment.test.js, replace presentation except the actual
// fill_character_bio body called by run. Cosmetic tooltip builders stay inert. Keep main's
// native serializer, loader, rewards, definitions and model code. Remove its
// browser startup tail in the temporary bundle, never in src/.
const exportsOf = text => [...text.matchAll(/export\s*\{([^}]+)\}/g)]
    .flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+as\s+/).at(-1)))
    .concat([...text.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m=>m[1]))
    .filter(s=>/^[a-zA-Z_$][\w$]*$/.test(s));

// A tiny inert DOM surface for presentation calls. No browser, network, timers,
// user data or native app is involved.
const node = () => ({style:{setProperty(){},getPropertyValue(){return '';},removeProperty(){}},
    classList:{add(){},remove(){},contains(){return false;},toggle(){}},dataset:{},
    children:[],childNodes:[],childElementCount:0,checked:false,value:'',innerText:'',innerHTML:'',
    get nextElementSibling(){return node();},get parentNode(){return node();},get firstChild(){return null;},
    append(){},appendChild(){},remove(){},replaceChildren(){},setAttribute(){},removeAttribute(){},
    addEventListener(){},removeEventListener(){},querySelector(){return node();},querySelectorAll(){return [];},
    getBoundingClientRect(){return {width:0,height:0};}});
const nodes = new Map();
globalThis.document = {getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},
    querySelector(){return null;},querySelectorAll(){return [];},createElement:node,
    documentElement:node(),body:node(),head:node(),addEventListener(){}};
globalThis.window = {location:{href:'http://fixture.invalid/?import_probe=node-test',origin:'http://fixture.invalid'},
    addEventListener(){},removeEventListener(){},getComputedStyle(){return {getPropertyValue(){return '';}}}};
globalThis.getComputedStyle = window.getComputedStyle;
globalThis.localStorage = {getItem(){throw new Error('Fixture must never read browser storage');},setItem(){throw new Error('Fixture must never write browser storage');}};

try {
    const outfile=join(temp,'native.mjs');
    await build({stdin:{contents:'import "./src/data/locations.js"; import "./src/data/skills.js"; export * from "fixture-main"; export {fixtureAttach} from "./src/main.js";',resolveDir:root},bundle:true,format:'esm',platform:'node',outfile,
        plugins:[{name:'fixture-presentation-only',setup(b){
            b.onResolve({filter:/^fixture-main$/},()=>({path:join(root,'src/main.js'),namespace:'fixture-main'}));
            b.onLoad({filter:/\/src\/main\.js$/,namespace:'file'},async a=>{
                const source=await readFile(a.path,'utf8');
                const names=exportsOf(source);
                // Break main's native-model initialization cycle. Runtime calls
                // still forward to the real main functions, with live bindings.
                return {contents:`${names.map(n=>`export let ${n};`).join('\n')}
let api;
function sync(){${names.map(n=>`if(typeof api.${n}!=='function') ${n}=api.${n};`).join('\n')}}
export function fixtureAttach(value){api=value;sync();${names.map(n=>`if(typeof api.${n}==='function') ${n}=(...args)=>{sync();try{return api.${n}(...args);}finally{sync();}};`).join('\n')}}`};
            });
            b.onLoad({filter:/\/src\/main\.js$/,namespace:'fixture-main'},async a=>{
                const display=await readFile(join(root,'src/display.js'),'utf8');
                assert.ok(display.includes('function fill_character_bio()') && display.includes('function create_race_tooltip('),'biography extraction boundary changed');
                const realBio=display.slice(display.indexOf('function fill_character_bio()'),display.indexOf('function create_race_tooltip('))
                    .replace('function fill_character_bio()', 'function fixtureRealBio()')
                    .replaceAll('create_race_tooltip(', 'fixtureDecoration(').replaceAll('create_height_tooltip(', 'fixtureDecoration(').replaceAll('create_gender_tooltip(', 'fixtureDecoration(');
                const source=(await readFile(a.path,'utf8')).replace('const importProbeToken =', 'let importProbeToken =')
                    .replace('fill_character_bio();','fixtureRealBio();');
                assert.ok(source.includes('fixtureRealBio();'),'run biography call site changed');
                const marker='set_loading_screen_progress("Waking up from a nyap...");';
                assert.ok(source.includes(marker),'main startup boundary changed');
                const finalExports=source.slice(source.lastIndexOf('export {'));
                return {contents:source.slice(0,source.indexOf(marker))+finalExports+realBio+`
import assert from "node:assert/strict";
import {height_stats} from "./models/person.js";
function fixtureDecoration(){return document.createElement("div");}
import {previewSimulationResponse} from "./simulation.js";
export {create_save, load, use_recipe, campaignContext, expeditionRegistry, character, skills, recipes, locations, availabilities, expansionState, game_version, encodeSaveFile, importSaveFile};
export function fixtureCreatedBio() {
    // Same default choices as index.html and CharacterCreator.confirm_hero_creation.
    Object.assign(character.getBioComponent(),{race:'human',age:'adult',gender:'ambiguous',height:'average'});
    global_flags.is_hero_created=true;
}
export function fixtureDiagnoseRun() {
    importProbeToken=null; ownsSave=true;
    const original=globalThis.setTimeout;let scheduled=0,error=null;
    globalThis.setTimeout=()=>{scheduled++;return 0;};
    try {run();} catch(e) {error=e.message;} finally {globalThis.setTimeout=original;}
    return {bio:character.getBio(),error,scheduled};
}
export function fixtureVanillaSetup() {
    fixtureCreatedBio();
    character.addToInventory([{item_id:'Cheap leather pants',quality:40},{item_id:'Stale bread',count:5}]);
    add_xp_to_character(0); character.money=102;
    character.updateStatsAndDisplay(); change_stance({stance_id:'normal'});
    change_location({location_id:'Village',skip_travel_time:true});
    questManager.startQuest({quest_id:'Lost memory'});
}
export function fixtureDiagnoseClock() {
    importProbeToken=null; ownsSave=true;
    const storage=new Map(), originalStorage=globalThis.localStorage;
    globalThis.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
    try {
        const choice=waitingSimulationChoice(expansionState);
        const response=expansionState.chronicle && automaticResponse(expansionState.chronicle);
        const pendingJourney=expansionState.actors.player.facts['original_frontier.travel.remaining']>0;
        const minutes=is_sleeping?config.time_speedup_when_sleeping:1;
        const calendarBefore=calendarSnapshot();
        const gates={minutesZero:minutes===0,backlogNativeClockPaused:backlogNativeClockPaused(expansionState), importProbeToken:!!importProbeToken,
            notOwnsSave:!ownsSave, expansionError, foundationSaveBlocked, is_loading_error,
            lifeEnded:expansionState.chronicle?.life.endedAt != null,
            playerSession:!!expansionState.simulation?.sessions.player, waitingSimulationChoice:!!choice,
            manualChroniclePolicy:expansionState.chronicle?.session?.policy === 'manual'};
        const joined=usesJoinedClock(), before=expansionState.clock;
        const branch=!joined?'native':response?'automaticResponse':pendingJourney?'advanceFrontierJourney':'advanceChroniclePlan';
        let plan;
        try {
            const base={state:expansionState,external:{money:character.money},gameplay:gameplaySnapshot()};
            const next=response?makeChroniclePlan({type:'respond',action:response}):pendingJourney?advanceFrontierJourney(base,1):advanceChroniclePlan(base,1);
            plan={consumed:next.state.clock-before,stoppedAtChoice:next.stoppedAtChoice,remaining:next.remaining};
        } catch(error) {plan={error:error.message};}
        const tick=update_timer();
        return {location:current_location?.id,joined,gates,choice:choice??null,pendingJourney,
            journeyRemaining:expansionState.actors.player.facts['original_frontier.travel.remaining']??null,
            branch,plan,tick,before,after:expansionState.clock,calendarBefore,calendarAfter:calendarSnapshot(),afterError:expansionError,afterSaveBlocked:foundationSaveBlocked};
    } finally {globalThis.localStorage=originalStorage;}
}
// Harness-only timer ownership. Writes are isolated in memory, never browser storage.
export function fixtureVerifyClock() {
    importProbeToken=null; ownsSave=true;
    const storage=new Map(), originalStorage=globalThis.localStorage;
    globalThis.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
    try {
        const before=expansionState.clock;
        const ticks=[];
        for(let i=0;i<10;i++) ticks.push(update_timer());
        const road=Object.values(expansionState.simulation.events).find(e=>e.definitionId==='field.road.window'&&e.status==='open');
        const waiting=!!waitingSimulationChoice(expansionState);
        const quote=road && previewSimulationResponse(expansionState,expeditionRegistry,{kind:'event',eventId:road.id,responseId:'defer'},campaignContext());
        const stock=()=>character.getItems()[JSON.stringify({id:'Prepared survey kit'})]?.count??0;
        const kits=stock();
        actSimulation({type:'command',id:'field.pack_drive'});
        const paidDrive=expansionState.simulation.energies.player['field.drive'].reserve;
        const equipmentChangeReasons=nativeActionReasons(expansionState);
        const jobTick=update_timer();
        change_current_location('Village');
        const villageQuote=road && previewSimulationResponse(expansionState,expeditionRegistry,{kind:'event',eventId:road.id,responseId:'defer'},campaignContext());
        return {before,after:expansionState.clock,ticks,waiting,roadMode:road?.mode,roadDeferInShack:quote?.reasons,
            jobTick,kitsAdded:stock()-kits,paidDrive,equipmentChangeReasons,roadDeferInVillage:villageQuote?.eligible,jobsRemaining:expansionState.simulation.jobs.filter(j=>j.actorId==='player').length,
            expansionError,foundationSaveBlocked,is_loading_error};
    } finally {globalThis.localStorage=originalStorage;}
}
export function fixtureVerifyEquippedClock() {
    importProbeToken=null; ownsSave=true;
    const storage=new Map(), originalStorage=globalThis.localStorage;
    globalThis.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
    try {
        const key=JSON.stringify({id:'Springsteel brace',quality:92});
        character.addToInventory([{item_id:'Springsteel brace',quality:92}]);
        // Inventory rendering normally primes the native item's lazy key.
        character.getItems()[key].item.getInventoryKey();
        for(let i=0;i<10;i++)assert.equal(update_timer(),1);
        const before=expansionState.clock,calendarBefore=calendarSnapshot();
        const baselineTick=update_timer();
        const road=Object.values(expansionState.simulation.events).find(e=>e.definitionId==='field.road.window'&&e.status==='open');
        assert.ok(road);assert.equal(road.mode,'offer');
        character_equip_item(key);
        const equipment=readNativeEquipment({player:character});
        const ticks=[update_timer(),update_timer(),update_timer()];
        assert.equal(expansionError,'',JSON.stringify({ticks,expansionError,foundationSaveBlocked}));
        assert.equal(foundationSaveBlocked,false);assert.deepEqual(ticks,[1,1,1]);
        const equippedSave=JSON.parse(create_save());
        change_location({location_id:'Shack'});
        const travelLocation=current_location.id;
        character_unequip_item('amulet');
        const unequippedTick=update_timer();
        return {equipment,baselineTick,before,after:expansionState.clock,calendarBefore,calendarAfter:calendarSnapshot(),ticks,travelLocation,unequippedTick,equippedSave,expansionError,foundationSaveBlocked};
    } finally {globalThis.localStorage=originalStorage;}
}
export function fixtureSetup(name, smeltingXP, craftingXP, field) {
    fixtureCreatedBio();
    character.name=name; character.money=1000;
    global_flags.is_hero_created=true; global_flags.is_crafting_unlocked=true;
    add_xp_to_character(0, false, false);
    add_xp_to_skill({skill:skills.Smelting,xp_to_add:smeltingXP,use_bonus:false,cap_gained_xp:false,should_info:false,is_from_loading:true});
    add_xp_to_skill({skill:skills.Crafting,xp_to_add:craftingXP,use_bonus:false,cap_gained_xp:false,should_info:false,is_from_loading:true});
    character.addToInventory([{item_id:'Iron ingot',count:20},{item_id:'Steel ingot',count:20},{item_id:'Coal',count:30},{item_id:'Iron ore',count:50},{item_id:'Rough wood log',count:30}]);
    for(const id of ['Village','Shack'])locations[id].getAvailabilityComponent().setStatus({is_unlocked:true});
    expansionState=field;
    current_location=locations.Village;
}
`,resolveDir:dirname(a.path)};
            });
            b.onLoad({filter:/\/src\/(display|.*_ui)\.js$/},async a=>{
                const source=await readFile(a.path,'utf8');
                return {contents:[...new Set(exportsOf(source))].map(s=>`export const ${s} = ${s==='capitalize_first_letter'?'s=>s[0].toUpperCase()+s.slice(1)':s==='skill_list'?'globalThis.document.getElementById("skill_list")':'()=>{}'};`).join('\n')};
            });
        }}]});
    const warmup=await import(pathToFileURL(outfile).href+'?warmup');
    warmup.fixtureAttach(warmup);
    console.log('Native Node harness initialized.');
    if(process.argv.includes('--equipped-clock')) {
        const probe=await import(pathToFileURL(outfile).href+'?equipped-clock');
        probe.fixtureAttach(probe);
        const encoded=await readFile(join(owner,'TEST-FIXTURE-D1-smelting-9.txt'),'utf8');
        await probe.importSaveFile(encoded,{currentVersion:probe.game_version,preflight:incoming=>assert.equal(probe.load(incoming).warnings,false),storage:{setItem(){}},key:'TEST ONLY'});
        const row=probe.fixtureVerifyEquippedClock();
        const saved=row.equippedSave;delete row.equippedSave;
        console.log(JSON.stringify(row,null,2));
        assert.equal(row.baselineTick,1);
        assert.equal(row.expansionError,'');assert.equal(row.foundationSaveBlocked,false);
        assert.deepEqual(row.ticks,[1,1,1]);
        assert.equal(row.travelLocation,'Shack');assert.equal(row.unequippedTick,1);
        assert.equal(row.after,row.before+15);
        assert.equal(row.calendarAfter.minute,row.calendarBefore.minute+15);
        const reload=await import(pathToFileURL(outfile).href+'?equipped-reload');reload.fixtureAttach(reload);
        assert.equal(reload.load(saved).warnings,false);
        assert.equal(reload.character.getEquipment().amulet.getInventoryKey(),row.equipment.player.amulet);
        const reloadedTick=reload.fixtureDiagnoseClock();
        assert.equal(reloadedTick.tick,1);assert.equal(reloadedTick.afterError,'');assert.equal(reloadedTick.afterSaveBlocked,false);
        console.log('Equipped save/reload and native timer: PASS');
    } else if(process.argv.includes('--diagnose')) {
        const results=[];
        warmup.fixtureVanillaSetup();
        const fresh=JSON.parse(warmup.create_save());
        for(const [name,encoded] of [['vanilla',warmup.encodeSaveFile(JSON.stringify(fresh))],
            ...await Promise.all([9,10].map(async level=>['smelting-'+level,await readFile(join(owner,'TEST-FIXTURE-D1-smelting-'+level+'.txt'),'utf8')]))]) {
            const probe=await import(pathToFileURL(outfile).href+'?diagnose='+name);
            probe.fixtureAttach(probe);
            await probe.importSaveFile(encoded,{currentVersion:probe.game_version,preflight:incoming=>assert.equal(probe.load(incoming).warnings,false),storage:{setItem(){}},key:'TEST ONLY'});
            const row={name,startup:probe.fixtureDiagnoseRun(),...probe.fixtureDiagnoseClock()};
            if(process.argv.includes('--expect-ready')) {
                assert.equal(row.startup.error,null);assert.equal(row.startup.scheduled,1);
                assert.ok(Object.values(row.gates).every(value=>!value),JSON.stringify(row.gates));
                assert.equal(row.pendingJourney,false);assert.equal(row.tick,1);assert.equal(row.plan.consumed,1);
                assert.equal(row.afterError,'');assert.equal(row.afterSaveBlocked,false);
                assert.equal(row.calendarAfter.minute,row.calendarBefore.minute+1);
            }
            const reload=await import(pathToFileURL(outfile).href+'?reload='+name);
            reload.fixtureAttach(reload);
            assert.equal(reload.load(JSON.parse(probe.create_save())).warnings,false);
            row.reload={startup:reload.fixtureDiagnoseRun(),...reload.fixtureDiagnoseClock()};
            if(process.argv.includes('--expect-ready')) {assert.equal(row.reload.startup.error,null);assert.equal(row.reload.startup.scheduled,1);assert.equal(row.reload.tick,1);assert.ok(Object.values(row.reload.gates).every(value=>!value));}
            results.push(row);
        }
        console.log(JSON.stringify(results,null,2));
        if(process.env.D1_DIAGNOSTIC_OUTPUT)await writeFile(process.env.D1_DIAGNOSTIC_OUTPUT,JSON.stringify(results,null,2)+'\n');
    } else {

    // Catch serializer/loader harness regressions before the slower field setup.
    warmup.fixtureSetup('TEST FIXTURE SMOKE',0,0,warmup.expansionState);
    const smoke=await import(pathToFileURL(outfile).href+'?smoke');
    smoke.fixtureAttach(smoke);
    assert.equal(smoke.load(JSON.parse(warmup.create_save())).warnings,false);
    const {createFieldFixture,joinField,fieldCommand,fieldAdvance,completeFieldProject}=await import(pathToFileURL(join(root,'scripts/field_fixtures.mjs')));
    const {previewSimulationCommand}=await import(pathToFileURL(join(root,'src/simulation.js')));
    let field=joinField(createFieldFixture(),'craft');
    field=fieldAdvance(fieldCommand(field,'field.teach_step','Village',{targetId:'oldCraftsman'}),2);
    field=fieldAdvance(fieldCommand(field,'field.practice_step'),2);
    for(const name of ['focus','drive']) {
        field=fieldAdvance(fieldCommand(field,`field.learn_${name}`),name==='focus'?2:3);
        field=fieldAdvance(fieldCommand(field,`field.recover_${name}`,'Shack'),name==='focus'?2:4);
    }
    field=completeFieldProject(field);
    console.log('Native field setup commands completed.');
    const report=[];
    for(const level of [9,10]) {
        // Unique module URL makes every hero and import preflight a fresh model.
        const native=await import(pathToFileURL(outfile).href+`?generate=${level}`);
        native.fixtureAttach(native);
        const skill=native.skills.Smelting;
        const threshold=Math.round(100*skill.base_xp_cost*(1-skill.xp_scaling**10)/(1-skill.xp_scaling))/100;
        const craft=native.skills.Crafting;
        const craftingXP=Math.round(100*craft.base_xp_cost*(1-craft.xp_scaling**10)/(1-craft.xp_scaling))/100;
        native.fixtureSetup(`TEST FIXTURE D1 Smelting ${level}`,threshold-(level===9?1:0),craftingXP,structuredClone(field.state));
        const save=JSON.parse(native.create_save());
        // Leave the earned recipe flag locked to exercise native reward rebuild.
        save.availabilities.recipe['Springsteel ingot']=0;
        const serialized=JSON.stringify(save);
        const encoded=native.encodeSaveFile(serialized);
        const stem=`TEST-FIXTURE-D1-smelting-${level}`;
        await writeFile(join(owner,stem+'.json'),JSON.stringify(save,null,2)+'\n');
        await writeFile(join(owner,stem+'.txt'),encoded+'\n');
        const probe=await import(pathToFileURL(outfile).href+`?import=${level}`);
        probe.fixtureAttach(probe);
        const storage=new Map();
        const warnings=[];
        const warn=console.warn,error=console.error;
        let result;
        console.warn=(...args)=>warnings.push(args.join(' '));
        console.error=(...args)=>warnings.push(args.join(' '));
        try {
            await probe.importSaveFile(await readFile(join(owner,stem+'.txt'),'utf8'),{
                currentVersion:probe.game_version,
                preflight:incoming=>{result=probe.load(incoming);assert.equal(result.warnings,false);assert.deepEqual(warnings,[]);},
                storage:{setItem:(key,value)=>storage.set(key,value)},key:'TEST FIXTURE ONLY'});
        } finally {console.warn=warn;console.error=error;}
        assert.equal(storage.size,1);
        assert.equal(probe.character.getLevelableComponent().skill_progress.Smelting.current_level,level);
        assert.equal(probe.character.getLevelableComponent().skill_progress.Crafting.current_level,10);
        assert.equal(probe.recipes.smelting.items['Springsteel ingot'].getAvailabilityComponent().getStatus().is_unlocked,level===10);
        const items=Object.fromEntries(Object.entries(probe.character.getItems()).map(([k,v])=>[JSON.parse(k).id,v.count]));
        for(const [id,count] of Object.entries({'Iron ingot':20,'Steel ingot':20,Coal:30,'Iron ore':50,'Rough wood log':30}))assert.equal(items[id],count);
        assert.equal(probe.character.money,1000);
        assert.equal(probe.expansionState.actors.player.facts['field.facility'],true);
        assert.equal(probe.expansionState.simulation.powers.player['field.load_step'].mastery,2);
        assert.equal(probe.expansionState.simulation.energies.player['field.drive'].reserve,6);
        assert.equal(probe.expansionState.simulation.energies.player['field.focus'].reserve,4);
        assert.equal(probe.expansionState.simulation.energies.player['field.drive'].strain,0);
        assert.equal(probe.global_flags.is_crafting_unlocked,true);
        assert.equal(probe.global_flags.is_hero_created,true);
        assert.equal(Boolean(probe.locations.Shack.canBeStarted(probe.get_context())),true);
        const row={file:stem+'.txt',import:'PASS',nativeLoadWarnings:warnings,smelting:level,smeltingXP:probe.character.getLevelableComponent().skill_progress.Smelting.total_xp,
            crafting:10,items,money:probe.character.money,springsteelUnlocked:level===10,workshop:true,mastery:2,driveReserve:6,focusReserve:4};
        row.startup=probe.fixtureDiagnoseRun();
        assert.equal(row.startup.error,null);assert.equal(row.startup.scheduled,1);
        row.villageClock=probe.fixtureDiagnoseClock();
        assert.ok(Object.values(row.villageClock.gates).every(value=>!value));
        assert.equal(row.villageClock.pendingJourney,false);assert.equal(row.villageClock.tick,1);
        assert.equal(row.villageClock.calendarAfter.minute,row.villageClock.calendarBefore.minute+1);
        if(level===9) {
            // Browser inventory rendering primes these lazy cached keys.
            for(const [key,entry] of Object.entries(probe.character.getItems()))assert.equal(entry.item.getInventoryKey(),key);
            const random=Math.random;
            // Worst-case failed smelt still awards enough native XP. This
            // mutation is confined to the disposable post-import test hero.
            Math.random=()=>0.999999;
            try {probe.use_recipe({parentNode:{dataset:{recipe_id:'Iron ingot'},parentNode:{dataset:{crafting_category:'smelting',crafting_subcategory:'items'}}}},1);}
            finally {Math.random=random;}
            assert.equal(probe.skills.Smelting.getCurrentLvl(),10);
            assert.equal(probe.recipes.smelting.items['Springsteel ingot'].getAvailabilityComponent().getStatus().is_unlocked,true);
            row.oneNativeIronSmelt='PASS (even failed roll earns milestone)';
        }
        probe.change_current_location('Shack');probe.fixtureAttach(probe);
        const quote=previewSimulationCommand(probe.expansionState,probe.expeditionRegistry,'field.pack_drive',probe.campaignContext());
        assert.equal(quote.eligible,true,JSON.stringify(quote.reasons));
        assert.equal(quote.costs.find(c=>c.energyId==='field.drive').output,3);
        assert.equal(quote.effects.find(e=>e.type==='item').amount,1);
        row.nativeWorkshopQuote='PASS: 1 kit / 3 drive; eligible in Shack';
        row.nativeClock=probe.fixtureVerifyClock();
        assert.deepEqual(row.nativeClock.ticks,Array(10).fill(1));
        assert.equal(row.nativeClock.waiting,false);
        assert.equal(row.nativeClock.roadMode,'offer');
        assert.deepEqual(row.nativeClock.roadDeferInShack,['Response prerequisites are missing.']);
        assert.equal(row.nativeClock.roadDeferInVillage,true);
        assert.deepEqual(row.nativeClock.equipmentChangeReasons,['Finish your current encounter, work or decision first.']);
        assert.equal(row.nativeClock.jobTick,1);
        assert.equal(row.nativeClock.kitsAdded,1);
        assert.equal(row.nativeClock.paidDrive,3);
        assert.equal(row.nativeClock.jobsRemaining,0);
        assert.equal(row.nativeClock.expansionError,'');
        report.push(row);
    }
    await writeFile(join(owner,'VERIFICATION.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
    }
} finally {await rm(temp,{recursive:true,force:true});}
