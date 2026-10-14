// R15 G5 (FA17 heir) seeded TEST FIXTURE saves. Generated test heroes only:
// never reads browser storage or a personal save. Same native harness pattern
// as docs/gm/d1-alloy-equipment-2026-10-07/fixture/generate.mjs: the real
// src/main.js serializer, loader, chronicle commands, joined clock, storage
// transfer and equipment code run in Node with presentation stubbed.
//
//   node docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g5/fixture/generate.mjs
//
// Writes, next to this file:
//   TEST-FIXTURE-R15-G10-rich-ended.txt   ended mortal life that wrote, taught, built, owes
//   TEST-FIXTURE-R15-G10-empty-ended.txt  ended mortal life that left almost nothing
//   TEST-FIXTURE-R15-G10-old-rule-heir.txt heir envelope made by the pre-R15 one-lesson code (commit 4becff87)
// plus decoded .json companions and SEED_LOG.json.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const owner = dirname(fileURLToPath(import.meta.url));
const root = resolve(owner, '../../../../../../../..');
const temp = await mkdtemp(join(tmpdir(), 'r15-g5-fixture-'));

const exportsOf = text => [...text.matchAll(/export\s*\{([^}]+)\}/g)]
    .flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+as\s+/).at(-1)))
    .concat([...text.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m=>m[1]))
    .filter(s=>/^[a-zA-Z_$][\w$]*$/.test(s));
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

// Harness-only additions appended to a temporary bundle copy of main.js, never src/.
const fixtureApi = `
import assert from "node:assert/strict";
export {create_save, load, character, locations, expansionState, game_version, encodeSaveFile, importSaveFile, player_storage};
function fixtureDecoration(){return document.createElement("div");}
function withMemoryStorage(run){
    importProbeToken=null; ownsSave=true;
    const storage=new Map(), original=globalThis.localStorage;
    globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k),get length(){return storage.size;},key:i=>[...storage.keys()][i]??null};
    try {return run();} finally {globalThis.localStorage=original;}
}
const YEAR=360*24*60;
// Advance played time through the real joined clock (update_timer), in bounded steps.
function fixtureAdvance(minutes){
    let left=minutes;
    while(left>0){const step=Math.min(left,left>100000?50000:left);const used=update_timer(step);assert.ok(used>0,'clock stopped: '+expansionError);left-=used;
        if(expansionState.chronicle?.life.endedAt!=null)break;}
}
function startLife(name){
    Object.assign(character.getBioComponent(),{race:'human',age:'adult',gender:'ambiguous',height:'average'});
    global_flags.is_hero_created=true;
    character.addToInventory([{item_id:'Cheap leather pants',quality:40},{item_id:'Stale bread',count:5}]);
    add_xp_to_character(0); character.money=102;
    character.updateStatsAndDisplay(); change_stance({stance_id:'normal'});
    change_location({location_id:'Village',skip_travel_time:true});
    questManager.startQuest({quest_id:'Lost memory'});
    character.name=name;
    // Speak to the elder through the real dialogue reward path.
    current_dialogue='villageElder'; start_textline('hello'); current_dialogue=null;
    assert.ok(metVillageElder(),'elder not met');
    actChronicle({type:'enroll',mode:'mortal'});
}
const log=[];
const step=(text,extra={})=>log.push({clock:expansionState.clock,age:+(18+(expansionState.clock-(expansionState.chronicle?.enrolledAt??0))/YEAR).toFixed(3),text,...extra});
export function fixtureRichLife(name){
    return withMemoryStorage(()=>{
        startLife(name); step('enrolled mortal chronicle');
        fixtureAdvance(10); actChronicle({type:'attend'}); step('attended cartographer: routeSignals learned');
        actChronicle({type:'reflect',lesson:'routeSignals'}); step('wrote down routeSignals');
        actChronicle({type:'pledge'}); startExpedition('chronicle.archive_duty',expansionState.sequence); fixtureAdvance(5);
        assert.equal(expansionState.chronicle.relationships.villageElder.ties.dutyKept,true); step('kept archive promise (1 coin)');
        fixtureAdvance(60-expansionState.clock+expansionState.chronicle.enrolledAt);
        actChronicle({type:'inherit'}); step('claimed archive succession: Old combat manual');
        // Seeded (D1 pattern): coins and goods a working life could earn.
        character.money=400;
        character.addToInventory([{item_id:'Iron ore',count:12},{item_id:'Rough wood log',count:6}]);
        locations.Shack.getAvailabilityComponent().setStatus({is_unlocked:true});
        change_location({location_id:'Shack',skip_travel_time:true});
        open_storage();
        const key=id=>Object.keys(character.getItems()).find(k=>JSON.parse(k).id===id);
        const deposit=(id,count)=>assert.ok(move_item_to_storage({item_key:key(id),count,expectedCount:count,sequence:expansionState.sequence}),'chest refused '+id);
        deposit('Iron ore',12); deposit('Rough wood log',6);
        close_storage();
        assert.equal(Object.keys(player_storage.getItems()).length,2); step('stored 12 Iron ore and 6 Rough wood log in the Shack chest');
        character_equip_item(key('Cheap leather pants')); assert.ok(character.getEquipment().legs,'pants not worn'); step('wears Cheap leather pants');
        change_location({location_id:'Village',skip_travel_time:true});
        actChronicle({type:'start',intent:'assault'}); actChronicle({type:'withdraw'});
        assert.equal(expansionState.chronicle.relationships.villageElder.ties.grievance,true); step('attacked the elder and withdrew: grievance unsettled');
        fixtureAdvance(Math.ceil(47.5*YEAR));
        villageCareer=resolveVillageKit(finishVillageShift(beginVillageShift(villageCareer,false),false),'keep'); step('real career reducers: accepted patrol, interrupted shift, kept loaned kit; 50-coin debt; no apprentice taught');
        fixtureAdvance(40*YEAR);
        assert.notEqual(expansionState.chronicle.life.endedAt,null); step('life ended at 80');
        return {save:create_save(),log:log.splice(0),equippedKeys:Object.values(character.getEquipment()).filter(Boolean).map(i=>i.getInventoryKey())};
    });
}
export function fixtureEmptyLife(name){
    return withMemoryStorage(()=>{
        startLife(name); step('enrolled mortal chronicle');
        // Seeded: the life spent its coins and ate its bread; nothing written or taught.
        character.money=0;
        const bread=Object.keys(character.getItems()).find(k=>JSON.parse(k).id==='Stale bread');
        if(bread)character.removeFromInventory([{item_key:bread,item_count:5}]);
        step('spent all coins, ate the bread');
        fixtureAdvance(63*YEAR);
        assert.notEqual(expansionState.chronicle.life.endedAt,null); step('life ended at 80');
        return {save:create_save(),log:log.splice(0),equippedKeys:[]};
    });
}
// Same steps as main.js's new-game branch; the hero is not yet created.
export function fixtureFresh(){return withMemoryStorage(()=>{
    character.addToInventory([{item_id:'Cheap leather pants',quality:40},{item_id:'Stale bread',count:5}]);
    add_xp_to_character(0); character.money=102; character.updateStatsAndDisplay(); change_stance({stance_id:'normal'});
    change_location({location_id:'Village',skip_travel_time:true}); questManager.startQuest({quest_id:'Lost memory'});
    return create_save();});}
`;

try {
    const outfile=join(temp,'native.mjs');
    await build({stdin:{contents:'import "./src/data/locations.js"; import "./src/data/skills.js"; export * from "fixture-main"; export {fixtureAttach} from "./src/main.js";',resolveDir:root},bundle:true,format:'esm',platform:'node',outfile,logLevel:'error',
        plugins:[{name:'fixture-presentation-only',setup(b){
            b.onResolve({filter:/^fixture-main$/},()=>({path:join(root,'src/main.js'),namespace:'fixture-main'}));
            b.onLoad({filter:/\/src\/main\.js$/,namespace:'file'},async a=>{
                const names=exportsOf(await readFile(a.path,'utf8'));
                return {contents:`${names.map(n=>`export let ${n};`).join('\n')}
let api;
function sync(){${names.map(n=>`if(typeof api.${n}!=='function') ${n}=api.${n};`).join('\n')}}
export function fixtureAttach(value){api=value;sync();${names.map(n=>`if(typeof api.${n}==='function') ${n}=(...args)=>{sync();try{return api.${n}(...args);}finally{sync();}};`).join('\n')}}`};
            });
            b.onLoad({filter:/\/src\/main\.js$/,namespace:'fixture-main'},async a=>{
                const source=(await readFile(a.path,'utf8')).replace('const importProbeToken =', 'let importProbeToken =');
                const marker='set_loading_screen_progress("Waking up from a nyap...");';
                assert.ok(source.includes(marker),'main startup boundary changed');
                const finalExports=source.slice(source.lastIndexOf('export {'));
                return {contents:source.slice(0,source.indexOf(marker))+finalExports+fixtureApi,resolveDir:dirname(a.path)};
            });
            b.onLoad({filter:/\/src\/(display|.*_ui)\.js$/},async a=>{
                const source=await readFile(a.path,'utf8');
                return {contents:[...new Set(exportsOf(source))].map(s=>`export const ${s} = ${s==='capitalize_first_letter'?'s=>s[0].toUpperCase()+s.slice(1)':s==='skill_list'?'globalThis.document.getElementById("skill_list")':'()=>{}'};`).join('\n')};
            });
        }}]});
    const fresh=async tag=>{const m=await import(pathToFileURL(outfile).href+'?'+tag);m.fixtureAttach(m);return m;};
    const verifyImport=async (encoded,tag)=>{
        const probe=await fresh('import-'+tag);const warnings=[];const warn=console.warn,error=console.error;
        console.warn=(...a)=>warnings.push(a.join(' '));console.error=(...a)=>warnings.push(a.join(' '));
        try {await probe.importSaveFile(encoded,{currentVersion:probe.game_version,preflight:incoming=>assert.equal(probe.load(incoming).warnings,false),storage:{setItem(){}},key:'TEST FIXTURE ONLY'});}
        finally {console.warn=warn;console.error=error;}
        assert.deepEqual(warnings,[],tag+' load warnings');return probe;
    };
    // --old-only reuses the already generated ended lives and their seed log.
    const oldOnly=process.argv.includes('--old-only');
    const out=oldOnly?JSON.parse(await readFile(join(owner,'SEED_LOG.json'),'utf8')):{};
    for(const [kind,fn,name] of oldOnly?[]:[['rich','fixtureRichLife','TEST FIXTURE R15 G10 kin debt life']]) {
        const m=await fresh(kind);
        const r=m[fn](name);
        const save=JSON.parse(r.save),encoded=m.encodeSaveFile(r.save);
        const stem=`TEST-FIXTURE-R15-G10-${kind}-ended`;
        await writeFile(join(owner,stem+'.txt'),encoded+'\n');
        await writeFile(join(owner,stem+'.json'),JSON.stringify(save,null,1)+'\n');
        const probe=await verifyImport(encoded,kind);
        assert.notEqual(probe.expansionState.chronicle.life.endedAt,null);
        out[kind]={file:stem+'.txt',name:save.character.name,money:save.character.money,equippedKeys:r.equippedKeys,
            inventory:save.inventories.person.main_character,chest:save.inventories.storage.player,shack:save.availabilities.location.Shack,
            reputation:save.character.reputation,experience:save.expansion.chronicle.life.experience,elderTies:save.expansion.chronicle.relationships.villageElder.ties,
            clock:save.expansion.clock,calendar:save['current time'],log:r.log,nodeImport:'PASS (real importSaveFile + load, no warnings)'};
    }
    await writeFile(join(owner,'SEED_LOG.json'),JSON.stringify(out,null,1)+'\n');
    console.log('kin-debt fixture verified through native import/load');
} finally {await rm(temp,{recursive:true,force:true});}
