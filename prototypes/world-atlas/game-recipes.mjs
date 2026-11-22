// The game's recipe book, read statically (crafting_recipes.js imports main.js, so it is never imported here):
// OOPS from the working tree and upstream YAIR from git, in the reader rules' shape so one Making view draws both.
//   node prototypes/world-atlas/game-recipes.mjs [--ref upstream/master]
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {blockEnd} from './source-yair.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const key = s => 'game.' + String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const str = (block, k) => new RegExp(`\\b${k}\\s*:\\s*["']([^"'\\n]+)["']`).exec(block)?.[1] ?? null;
const num = (block, k) => Number(new RegExp(`\\b${k}\\s*:\\s*([\\d.]+)`).exec(block)?.[1] ?? 1);
function objects(block, field) {
    const m = new RegExp(`\\b${field}\\s*:\\s*\\[`).exec(block);
    if (!m) return [];
    const start = m.index + m[0].length - 1, body = block.slice(start, blockEnd(block, start));
    const out = [];
    for (let i = body.indexOf('{'); i >= 0; i = body.indexOf('{', i + 1)) {const end = blockEnd(body, i); out.push(body.slice(i, end)); i = end - 1;}
    return out;
}
function strings(block, field) {
    const m = new RegExp(`\\b${field}\\s*:\\s*\\[`).exec(block);
    if (!m) return [];
    const start = m.index + m[0].length - 1;
    return [...block.slice(start, blockEnd(block, start)).matchAll(/["']([^"'\n]+)["']/g)].map(x => x[1]);
}
const ref = (label, qty = null) => ({id: key(label), label, qty, matched: true});

export function extractRecipes(text) {
    const recipes = [], notes = [];
    const head = /(\w+)_recipes\.(items|components|equipment)\["([^"]+)"\]\s*=\s*new\s+(ItemRecipe|ComponentRecipe|EquipmentRecipe)\s*\(/g;
    for (let m; (m = head.exec(text));) {
        const [, skillBook, cat, name, cls] = m;
        const open = m.index + m[0].length - 1, block = text.slice(open, blockEnd(text, open));
        const skill = str(block, 'recipe_skill') || skillBook[0].toUpperCase() + skillBook.slice(1);
        const base = {kind: skillBook, category: cat, worldKind: skill, line: text.slice(0, m.index).split('\n').length, costs: [], steps: 0, who: 0, seen: 1};
        if (cls === 'EquipmentRecipe') {
            const parts = strings(block, 'components');
            recipes.push({...base, id: `${skillBook}.${cat}.${name}`, name, inputs: parts.map(p => ref(p[0].toUpperCase() + p.slice(1))), products: [ref(name)], itemType: str(block, 'item_type')});
            continue;
        }
        const mats = objects(block, 'materials');
        if (cls === 'ComponentRecipe') {
            // One recipe per material variant: the component kind ("Short blade") takes the made part's place in equipment.
            for (const mat of mats) {
                const input = str(mat, 'material_id'), out = str(mat, 'result_id');
                if (!input || !out) {notes.push(`${name}: a material row without material_id or result_id (line ${base.line})`); continue;}
                recipes.push({...base, id: `${skillBook}.${cat}.${name}.${out}`, name: out, inputs: [ref(input, num(mat, 'count'))], products: [ref(out), ref(name)]});
            }
            continue;
        }
        const result = /\bresult\s*:\s*\{([^}]*)\}/.exec(block)?.[1] || '';
        const out = str(result, 'result_id');
        if (!out) {notes.push(`${name}: no result_id (line ${base.line})`); continue;}
        recipes.push({...base, id: `${skillBook}.${cat}.${name}`, name, inputs: mats.map(x => str(x, 'material_id')).filter(Boolean).map((id, i) => ref(id, num(mats[i], 'count'))),
            products: [ref(out, num(result, 'count'))], recipeType: str(block, 'recipe_type')});
    }
    // Two materials can make the same part (Wool cloth or Fine wool cloth → Wool scarf): the later one's id names
    // its material, the same way in OOPS and upstream, so both stay in the tree and still match across the two.
    const seen = new Set();
    for (const r of recipes) {if (seen.has(r.id)) r.id += ' from ' + r.inputs[0]?.label; seen.add(r.id);}
    return {recipes, notes};
}

export function gameRecipes(ref = 'upstream/master') {
    const oops = extractRecipes(readFileSync(root + 'src/crafting_recipes.js', 'utf8'));
    let up = {recipes: [], notes: ['upstream ref not available']};
    try {up = extractRecipes(execFileSync('git', ['show', `${ref}:src/crafting_recipes.js`], {cwd: root, encoding: 'utf8', maxBuffer: 64e6}));} catch {/* no upstream remote in this checkout */}
    const upIds = new Set(up.recipes.map(r => r.id)), ourIds = new Set(oops.recipes.map(r => r.id));
    for (const r of oops.recipes) r.state = upIds.has(r.id) ? 'absorbed' : 'added';
    const upstreamOnly = up.recipes.filter(r => !ourIds.has(r.id)).map(r => ({...r, state: 'source'}));
    return {source: 'src/crafting_recipes.js', ref, recipes: [...oops.recipes, ...upstreamOnly], upstream: up.recipes.length, oops: oops.recipes.length, notes: [...oops.notes, ...up.notes.map(n => 'upstream: ' + n)]};
}

if (import.meta.main) {
    const i = process.argv.indexOf('--ref');
    process.stdout.write(JSON.stringify(gameRecipes(i > 0 ? process.argv[i + 1] : undefined)));
}
