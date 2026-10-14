// R15 G2 TEST FIXTURE generator. Seeds disposable test heroes only.
// Pattern: docs/gm/d1-alloy-equipment-2026-10-07/fixture/generate.mjs.
// Each fixture starts from an earlier round's genuine disposable export, runs the
// real importSaveFile + load, applies changes through the real character model
// (addToInventory / removeFromInventory / money / name), then real create_save
// and encodeSaveFile. A fresh module instance re-imports every output file and
// checks it loads without warnings. Never reads browser storage or personal saves.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const owner = dirname(fileURLToPath(import.meta.url));
const rounds = resolve(owner, '../../..');
const root = resolve(rounds, '../../../../..');
const temp = await mkdtemp(join(tmpdir(), 'r15-g2-fixture-'));

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

const R = 'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/';
const key = id => JSON.stringify({id});
// Each base file is a disposable export from an earlier round (not a personal save).
const FIXTURES = [
    {stem:'TEST-FIXTURE-R15-G2-retort', name:'TEST FIXTURE R15 G2 retort', base:R+'r7/final-earned-native.txt',
        why:'FA11/FA12: genuine R7 state has 0 sap; seed 6 Tree sap (purchasable via proto23.buy_sap).',
        add:{'Tree sap':6}},
    {stem:'TEST-FIXTURE-R15-G2-reserve', name:'TEST FIXTURE R15 G2 reserve', base:R+'r7/final-earned-native.txt',
        why:'FA09 reserve: kit stock 0 (kits delivered/used), resin 3, sound staves 6 so three accepted batches are fundable.',
        add:{'Set repair resin':2,'Sound repair stave':6}, remove:{'Prepared survey kit':7}},
    {stem:'TEST-FIXTURE-R15-G2-held', name:'TEST FIXTURE R15 G2 held', base:R+'r7/final-earned-native.txt',
        why:'FA09 held reserve/closed browser: genuine 7 kits stay above hold; add resin 2 + staves 6 so a release is fundable.',
        add:{'Set repair resin':2,'Sound repair stave':6}},
    {stem:'TEST-FIXTURE-R15-G2-program', name:'TEST FIXTURE R15 G2 program', base:R+'r7/final-earned-native.txt',
        why:'FA09 program: purse 5 coins funds exactly two 2-coin measured packs, so a 3-job program must pause on funding.',
        money:5},
    {stem:'TEST-FIXTURE-R15-G2-program3', name:'TEST FIXTURE R15 G2 program3', base:R+'r7/final-earned-native.txt',
        why:'FA09 program depletion: purse 3 coins funds one 2-coin pack, so a 3-job routine must pause on funding after its first job.',
        money:3},
    {stem:'TEST-FIXTURE-R15-G2-program1log', name:'TEST FIXTURE R15 G2 program1log', base:R+'r7/final-earned-native.txt',
        why:'FA09 material depletion: six coins fund three packs, but one carried log allows only the first.',
        money:6,remove:{'Rough wood log':77}},
    {stem:'TEST-FIXTURE-R15-G2-mixed', name:'TEST FIXTURE R15 G2 mixed', base:R+'r4/mixed-plan-ready-native.txt',
        why:'FA09 mixed plan opposites: genuine R4 state with household terms heard and itinerary not yet started. Name only.'},
    {stem:'TEST-FIXTURE-R15-G2-mixed-nowood', name:'TEST FIXTURE R15 G2 mixed nowood', base:R+'r4/mixed-plan-ready-native.txt',
        why:'FA09 mixed depletion: same R4 state with logs sold down to 1 so the supply step lacks wood.',
        remove:{'Rough wood log':88}},
];

try {
    const outfile=join(temp,'native.mjs');
    await build({stdin:{contents:'import "./src/data/locations.js"; import "./src/data/skills.js"; export * from "fixture-main"; export {fixtureAttach} from "./src/main.js"; export {traders} from "./src/data/traders.js";',resolveDir:root},bundle:true,format:'esm',platform:'node',outfile,logLevel:'error',
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
                const source=await readFile(a.path,'utf8');
                const marker='set_loading_screen_progress("Waking up from a nyap...");';
                assert.ok(source.includes(marker),'main startup boundary changed');
                const finalExports=source.slice(source.lastIndexOf('export {'));
                return {contents:source.slice(0,source.indexOf(marker))+finalExports+`
export {create_save, load, character, expansionState, game_version, encodeSaveFile, importSaveFile};
`,resolveDir:dirname(a.path)};
            });
            b.onLoad({filter:/\/src\/(display|.*_ui)\.js$/},async a=>{
                const source=await readFile(a.path,'utf8');
                return {contents:[...new Set(exportsOf(source))].map(s=>`export const ${s} = ${s==='capitalize_first_letter'?'s=>s[0].toUpperCase()+s.slice(1)':s==='skill_list'?'globalThis.document.getElementById("skill_list")':'()=>{}'};`).join('\n')};
            });
        }}]});
    let n=0;
    const fresh=async()=>{const m=await import(pathToFileURL(outfile).href+'?i='+(n++));m.fixtureAttach(m);return m;};
    const importInto=async(m,encoded)=>{const warnings=[];const w=console.warn,e=console.error;console.warn=(...a)=>warnings.push(a.join(' '));console.error=(...a)=>warnings.push(a.join(' '));
        try{await m.importSaveFile(encoded,{currentVersion:m.game_version,preflight:incoming=>{assert.equal(m.load(incoming).warnings,false);},storage:{setItem(){}},key:'TEST FIXTURE ONLY'});}finally{console.warn=w;console.error=e;}
        return warnings;};
    const counts=m=>Object.fromEntries(Object.entries(m.character.getItems()).map(([k,v])=>[k,v.count]));
    const report=[];
    for(const f of FIXTURES){
        const m=await fresh();
        const loadWarnings=await importInto(m,await readFile(join(root,f.base),'utf8'));
        const before=counts(m), moneyBefore=m.character.money;
        m.character.name=f.name;
        if(f.money!=null)m.character.money=f.money;
        if(f.remove)m.character.removeFromInventory(Object.entries(f.remove).map(([id,c])=>({item_key:key(id),item_count:c})));
        if(f.add)m.character.addToInventory(Object.entries(f.add).map(([id,c])=>({item_id:id,count:c})),true);
        const save=JSON.parse(m.create_save());
        const encoded=m.encodeSaveFile(JSON.stringify(save));
        await writeFile(join(owner,f.stem+'.txt'),encoded+'\n');
        // Verify with a fresh model: literal file re-import, then check deltas.
        const probe=await fresh();
        const reloadWarnings=await importInto(probe,await readFile(join(owner,f.stem+'.txt'),'utf8'));
        const after=counts(probe);
        assert.equal(probe.character.name,f.name);
        for(const [id,c] of Object.entries(f.add||{}))assert.equal(after[key(id)]||0,(before[key(id)]||0)+c,id);
        for(const [id,c] of Object.entries(f.remove||{}))assert.equal(after[key(id)]||0,(before[key(id)]||0)-c,id);
        assert.equal(probe.character.money,f.money??moneyBefore);
        assert.equal(probe.expansionState.clock,m.expansionState.clock);
        report.push({file:f.stem+'.txt',base:f.base,why:f.why,name:f.name,clock:probe.expansionState.clock,money:[moneyBefore,probe.character.money],
            added:f.add||{},removed:f.remove||{},loadWarnings,reloadWarnings,reimport:'PASS'});
        console.log('generated',f.stem);
    }
    await writeFile(join(owner,'VERIFICATION.json'),JSON.stringify(report,null,2)+'\n');
    // SOURCE merchant refresh: move the actual owned receiver through the real
    // inventory models, as a sale would. No duplicate tray or invented receipt.
    const merchant=await fresh();
    await importInto(merchant,await readFile(join(owner,'TEST-FIXTURE-R15-G2-retort.txt'),'utf8'));
    merchant.character.name='TEST FIXTURE R15 G2 retort merchant';
    const tray=key('Empty retort resin tray'), trader=merchant.traders['village trader'];
    merchant.character.removeFromInventory([{item_key:tray,item_count:1}]);
    trader.addToInventory([{item_key:tray,count:1}]);
    const beforeRefresh=trader.getTradeInventory()[tray].count;
    trader.last_refresh=-1;assert.equal(trader.refresh(merchant.get_context()),true);
    assert.equal(trader.getTradeInventory()[tray].count,beforeRefresh);
    const merchantSave=merchant.encodeSaveFile(merchant.create_save());
    await writeFile(join(owner,'TEST-FIXTURE-R15-G2-retort-merchant.txt'),merchantSave+'\n');
    const restored=await fresh();const warnings=await importInto(restored,merchantSave);
    assert.equal(counts(restored)[tray]||0,0);assert.equal(restored.traders['village trader'].getTradeInventory()[tray].count,1);
    await writeFile(join(owner,'MERCHANT-SOURCE.json'),JSON.stringify({label:'source',operation:'Real TraderComponent.refresh after real model transfer of one tray; native serializer/importer/loader re-import',playerTray:0,merchantTray:1,refreshPreserved:beforeRefresh,reimport:'PASS',warnings},null,2)+'\n');
} finally {await rm(temp,{recursive:true,force:true});}
