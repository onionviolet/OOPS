// R15 G1 FA07 seeded test hero. Native Node harness copied from
// docs/gm/d1-alloy-equipment-2026-10-07/fixture/generate.mjs (lines 1-195,
// unchanged apart from paths). It reads only the generated test hero export in
// this directory, never browser storage or a personal save.
//
// Input:  fa07-base-new-game-export.txt  (real browser new game, elder met,
//         exported by the game's own Export button)
// Output: TEST-FIXTURE-R15-G1-FA07-balm.txt (+ .json), the same hero after
//         the real native importer/loader, character.addToInventory of two
//         Healing balm (as Swamp trade or alchemy would add them) and one
//         Rough wood log, then the real create_save and encodeSaveFile.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const owner = dirname(fileURLToPath(import.meta.url));
const root = resolve(owner, '../../../../../../../..');
const temp = await mkdtemp(join(tmpdir(), 'r15-g1-test-fixture-'));

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
    const quietImport=async(probe,encoded)=>{
        const warnings=[],warn=console.warn,error=console.error,storage=new Map();
        console.warn=(...a)=>warnings.push(a.join(' '));console.error=(...a)=>warnings.push(a.join(' '));
        try {
            await probe.importSaveFile(encoded,{currentVersion:probe.game_version,
                preflight:incoming=>{assert.equal(probe.load(incoming).warnings,false);},
                storage:{setItem:(k,v)=>storage.set(k,v)},key:'TEST FIXTURE ONLY'});
        } finally {console.warn=warn;console.error=error;}
        assert.equal(storage.size,1);
        return warnings;
    };
    const items=probe=>Object.fromEntries(Object.entries(probe.character.getItems()).map(([k,v])=>[JSON.parse(k).id,v.count]));
    const base=(await readFile(join(owner,'fa07-base-new-game-export.txt'),'utf8')).trim();
    const seed=await import(pathToFileURL(outfile).href+'?seed');
    seed.fixtureAttach(seed);
    const baseWarnings=await quietImport(seed,base);
    assert.equal(seed.character.name,'TEST FIXTURE R15 G1 FA07 balm');
    const before=items(seed);
    assert.equal(before['Healing balm'],undefined);
    seed.character.addToInventory([{item_id:'Healing balm',count:2},{item_id:'Rough wood log',count:1}]);
    for(const [key,entry] of Object.entries(seed.character.getItems()))assert.equal(entry.item.getInventoryKey(),key);
    const save=JSON.parse(seed.create_save());
    const encoded=seed.encodeSaveFile(JSON.stringify(save));
    const stem='TEST-FIXTURE-R15-G1-FA07-balm';
    await writeFile(join(owner,stem+'.txt'),encoded+'\n');
    const verify=await import(pathToFileURL(outfile).href+'?verify');
    verify.fixtureAttach(verify);
    const verifyWarnings=await quietImport(verify,(await readFile(join(owner,stem+'.txt'),'utf8')).trim());
    const after=items(verify);
    assert.equal(after['Healing balm'],2);assert.equal(after['Rough wood log'],1);
    assert.equal(verify.character.money,102);
    const report={file:stem+'.txt',hero:verify.character.name,baseItems:before,fixtureItems:after,money:verify.character.money,
        worldId:verify.expansionState?.actors?.player?.worldId,baseWarnings,verifyWarnings,import:'PASS (real importSaveFile + load, warnings false)'};
    await writeFile(join(owner,'VERIFICATION.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
} finally {await rm(temp,{recursive:true,force:true});}
