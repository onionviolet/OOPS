// Enumerate the command entry points the UI uses, statically from source:
//   window.* functions main.js installs (called from markup and the console),
//   inline on* handlers in index.html and generated markup,
//   data-* action attributes panels listen for (delegated click handlers).
//   node scripts/headless/entry_points.mjs [--json]
// The headless runner reaches every family generically: game.call(name) for
// window functions, game.click(selector) for markup and data-* controls.
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {ROOT} from './runner.mjs';

export async function entryPoints() {
    const main = await readFile(join(ROOT, 'src/main.js'), 'utf8');
    const html = await readFile(join(ROOT, 'index.html'), 'utf8');
    const files = (await readdir(join(ROOT, 'src'), {recursive:true})).filter(f => f.endsWith('.js'));
    const sources = await Promise.all(files.map(async f => [f, await readFile(join(ROOT, 'src', f), 'utf8')]));
    const windowFns = [...new Set([...main.matchAll(/^window\.(\w+)\s*=/gm)].map(m => m[1]))].sort();
    const inline = new Set();
    for(const text of [html, ...sources.map(s => s[1])]) {
        for(const m of text.matchAll(/\bon(?:click|change|input|submit|keydown)\s*=\s*\\?["']\s*([\w.]+)\s*\(/g)) inline.add(m[1]);
        for(const m of text.matchAll(/setAttribute\(\s*["']on\w+["']\s*,\s*[`"']\s*([\w.]+)\s*\(/g)) inline.add(m[1]);
    }
    const dataActions = new Map();
    for(const [file, text] of sources) {
        for(const m of text.matchAll(/\bdata-([a-z0-9_-]*(?:action|command|choice|commit|response|answer|bridge|cancel|read|claim|equip|accept|select|start|toggle|dialogue|textline|trader|activity|recipe_id|crafting_category|character_item|trader_item|game_action|stance)[a-z0-9_-]*)\b/g)) {
            const list = dataActions.get(m[1]) ?? new Set(); list.add(file); dataActions.set(m[1], list);
        }
        for(const m of text.matchAll(/dataset\.(\w*(?:Action|Command|Choice|Commit|Response|Answer|Cancel|Claim|Accept|Select|Start|Toggle)\w*)\s*=/g)) {
            const attr = m[1].replace(/[A-Z]/g, c => '-' + c.toLowerCase());
            const list = dataActions.get(attr) ?? new Set(); list.add(file); dataActions.set(attr, list);
        }
    }
    return {
        windowFunctions:windowFns,
        inlineHandlers:[...inline].sort(),
        dataAttributes:Object.fromEntries([...dataActions].sort().map(([k, v]) => [k, [...v].sort()])),
    };
}

if(import.meta.url === `file://${process.argv[1]}`) {
    const e = await entryPoints();
    if(process.argv.includes('--json')) console.log(JSON.stringify(e, null, 2));
    else {
        console.log(`window functions (${e.windowFunctions.length}): ${e.windowFunctions.join(' ')}`);
        console.log(`inline handlers (${e.inlineHandlers.length}): ${e.inlineHandlers.join(' ')}`);
        console.log(`data-* action attributes (${Object.keys(e.dataAttributes).length}):`);
        for(const [k, v] of Object.entries(e.dataAttributes)) console.log(`  data-${k}: ${v.join(', ')}`);
    }
}
