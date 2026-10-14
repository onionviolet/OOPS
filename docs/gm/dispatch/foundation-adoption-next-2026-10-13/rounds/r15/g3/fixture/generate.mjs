// R15 G3 test fixtures. Adapted from docs/gm/d1-alloy-equipment-2026-10-07/fixture/generate.mjs.
// Input: the genuine R8 earned export (rounds/r8/final-earned-native.txt), never a personal save.
// It runs main.js's actual importSaveFile + load, renames the hero, adds ordinary purchasable
// stock through the native character.addToInventory, then actual create_save + encodeSaveFile,
// and re-imports the result through importSaveFile + load in a fresh model.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const owner = dirname(fileURLToPath(import.meta.url));
const root = resolve(owner, '../../../../../../../..');
const r8 = join(root, 'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r8/final-earned-native.txt');
const temp = await mkdtemp(join(tmpdir(), 'r15-g3-fixture-'));

const exportsOf = text => [...text.matchAll(/export\s*\{([^}]+)\}/g)]
    .flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+as\s+/).at(-1)))
    .concat([...text.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m => m[1]))
    .filter(s => /^[a-zA-Z_$][\w$]*$/.test(s));
const node = () => ({style: {setProperty() {}, getPropertyValue() {return '';}, removeProperty() {}},
    classList: {add() {}, remove() {}, contains() {return false;}, toggle() {}}, dataset: {},
    children: [], childNodes: [], childElementCount: 0, checked: false, value: '', innerText: '', innerHTML: '',
    get nextElementSibling() {return node();}, get parentNode() {return node();}, get firstChild() {return null;},
    append() {}, appendChild() {}, remove() {}, replaceChildren() {}, setAttribute() {}, removeAttribute() {},
    addEventListener() {}, removeEventListener() {}, querySelector() {return node();}, querySelectorAll() {return [];},
    getBoundingClientRect() {return {width: 0, height: 0};}});
const nodes = new Map();
globalThis.document = {getElementById(id) {if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id);},
    querySelector() {return null;}, querySelectorAll() {return [];}, createElement: node,
    documentElement: node(), body: node(), head: node(), addEventListener() {}};
globalThis.window = {location: {href: 'http://fixture.invalid/?import_probe=node-test', origin: 'http://fixture.invalid'},
    addEventListener() {}, removeEventListener() {}, getComputedStyle() {return {getPropertyValue() {return '';}};}};
globalThis.getComputedStyle = window.getComputedStyle;
globalThis.localStorage = {getItem() {throw new Error('Fixture must never read browser storage');}, setItem() {throw new Error('Fixture must never write browser storage');}};

// Ordinary purchasable/craftable stock only (Proto23 desk sells paper, ink, sharp knife and sap;
// Eda sells sound staves; drying cut wet staves also produces them).
const FIXTURES = {
    'TEST-FIXTURE-R15-G3-FA10': {name: 'TEST FIXTURE R15 G3 FA10', items: [
        {item_id: 'Sound repair stave', count: 4}, {item_id: 'Field fitting knife', count: 1},
        {item_id: 'Tree sap', count: 1}, {item_id: 'Cyorian research paper', count: 1}, {item_id: 'Cyorian formula ink', count: 1}]},
    'TEST-FIXTURE-R15-G3-FA13': {name: 'TEST FIXTURE R15 G3 FA13', items: []},
    'TEST-FIXTURE-R15-G3-OLD': {name: 'TEST FIXTURE R15 G3 OLD', source:'rounds/r3/final-earned-native.txt', items: []},
    'TEST-FIXTURE-R15-G3-NEGATIVE': {name: 'TEST FIXTURE R15 G3 NEGATIVE', source:'rounds/r7/final-earned-native.txt', items: []},
};

try {
    const outfile = join(temp, 'native.mjs');
    await build({stdin: {contents: 'import "./src/data/locations.js"; import "./src/data/skills.js"; export * from "fixture-main"; export {fixtureAttach} from "./src/main.js";', resolveDir: root},
        bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'error',
        plugins: [{name: 'fixture-presentation-only', setup(b) {
            b.onResolve({filter: /^fixture-main$/}, () => ({path: join(root, 'src/main.js'), namespace: 'fixture-main'}));
            b.onLoad({filter: /\/src\/main\.js$/, namespace: 'file'}, async a => {
                const names = exportsOf(await readFile(a.path, 'utf8'));
                return {contents: `${names.map(n => `export let ${n};`).join('\n')}
let api;
function sync(){${names.map(n => `if(typeof api.${n}!=='function') ${n}=api.${n};`).join('\n')}}
export function fixtureAttach(value){api=value;sync();${names.map(n => `if(typeof api.${n}==='function') ${n}=(...args)=>{sync();try{return api.${n}(...args);}finally{sync();}};`).join('\n')}}`};
            });
            b.onLoad({filter: /\/src\/main\.js$/, namespace: 'fixture-main'}, async a => {
                const source = await readFile(a.path, 'utf8');
                const marker = 'set_loading_screen_progress("Waking up from a nyap...");';
                assert.ok(source.includes(marker), 'main startup boundary changed');
                const finalExports = source.slice(source.lastIndexOf('export {'));
                return {contents: source.slice(0, source.indexOf(marker)) + finalExports + `
export {create_save, load, character, expansionState, game_version, encodeSaveFile, importSaveFile};
export function fixtureSeed(name, items) { character.name = name; character.addToInventory(items); }
`, resolveDir: dirname(a.path)};
            });
            b.onLoad({filter: /\/src\/(display|.*_ui)\.js$/}, async a => {
                const source = await readFile(a.path, 'utf8');
                return {contents: [...new Set(exportsOf(source))].map(s => `export const ${s} = ${s === 'capitalize_first_letter' ? 's=>s[0].toUpperCase()+s.slice(1)' : s === 'skill_list' ? 'globalThis.document.getElementById("skill_list")' : '()=>{}'};`).join('\n')};
            });
        }}]});
    const warmup = await import(pathToFileURL(outfile).href + '?warmup');
    warmup.fixtureAttach(warmup);
    const importInto = async (tag, encoded) => {
        const m = await import(pathToFileURL(outfile).href + '?' + tag);
        m.fixtureAttach(m);
        const warnings = [], warn = console.warn, error = console.error, stored = new Map();
        console.warn = (...a) => warnings.push(a.join(' ')); console.error = (...a) => warnings.push(a.join(' '));
        try {
            await m.importSaveFile(encoded, {currentVersion: m.game_version, storage: {setItem: (k, v) => stored.set(k, v)}, key: 'TEST FIXTURE ONLY',
                preflight: incoming => {const r = m.load(incoming); assert.equal(r.warnings, false, 'native load warnings');}});
        } finally {console.warn = warn; console.error = error;}
        assert.equal(stored.size, 1);
        return {m, warnings};
    };
    const counts = m => Object.fromEntries(Object.entries(m.character.getItems()).map(([k, v]) => [JSON.parse(k).id, v.count]));
    const report = [];
    const source = await readFile(r8, 'utf8');
    for (const [stem, spec] of Object.entries(FIXTURES)) {
        const input = spec.source ? await readFile(join(root,'docs/gm/dispatch/foundation-adoption-next-2026-10-13',spec.source),'utf8') : source;
        const {m: base, warnings} = await importInto('base-' + stem, input);
        const before = counts(base);
        base.fixtureSeed(spec.name, spec.items);
        const save = JSON.parse(base.create_save());
        const encoded = base.encodeSaveFile(JSON.stringify(save));
        await writeFile(join(owner, stem + '.txt'), encoded + '\n');
        const {m: probe, warnings: probeWarnings} = await importInto('verify-' + stem, encoded);
        const after = counts(probe);
        assert.equal(probe.character.name, spec.name);
        for (const {item_id, count} of spec.items) assert.equal((after[item_id] || 0) - (before[item_id] || 0), count, item_id);
        assert.deepEqual(probe.expansionState, base.expansionState, 'expansion state unchanged by seeding and round trip');
        report.push({file: stem + '.txt', input: spec.source || 'rounds/r8/final-earned-native.txt', name: spec.name, added: spec.items,
            importPreflight: 'PASS', loadWarnings: [...warnings, ...probeWarnings], clock: probe.expansionState.clock, money: probe.character.money,
            expansionUnchanged: true, stock: Object.fromEntries(spec.items.map(i => [i.item_id, after[i.item_id]]))});
    }
    await writeFile(join(owner, 'VERIFICATION.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
} finally {await rm(temp, {recursive: true, force: true});}
