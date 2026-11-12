#!/usr/bin/env node
// Read-only compression inventory of the Gu Keeper scene modules (foundation chat G, 2026-11-12).
// For each scene module and keeper pack it lists imports of shared Gu leaves, operations, facts keys,
// timing literals and stock arithmetic, so the inventory doc can group scenes by the leaf that could
// run them as data. Prints JSON; `--markdown` prints the inventory table instead.
import {readFileSync, readdirSync} from 'node:fs';
import {join, basename} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'src');
const packs = join(src, 'world_packs');
const leaves = ['gu_activation', 'gu_refinement', 'gu_world_claims', 'gu_move_search', 'gu_projection',
    'gu_procedures', 'gu_workshop', 'gu_catalogue', 'gu_propagation', 'gu_colony', 'gu_effect_chains',
    'gu_traits', 'gu_ability_profiles', 'gu_move_roles', 'gu_goal_search', 'gu_signal', 'gu_coordination'];

const read = path => readFileSync(path, 'utf8');
const unique = rows => [...new Set(rows)];
const imports = text => unique([...text.matchAll(/from '\.{1,2}\/(?:\.\.\/)?([\w/]+)\.js'/g)].map(m => m[1]));
const strings = text => [...text.matchAll(/'([a-z][a-z0-9_]*)'/g)].map(m => m[1]);

function operations(text) {
    const listed = [...text.matchAll(/export const \w*[Oo]perations\s*=\s*\[([^\]]*)\]/g)].flatMap(m => strings(m[1]));
    const commanded = [...text.matchAll(/\b(?:act|command|guard|work|op)\(\s*'([a-z][a-z0-9_]*)'/g)].map(m => m[1]);
    const dispatched = [...text.matchAll(/(?:operation|op)\s*===\s*'([a-z][a-z0-9_]*)'|case '([a-z][a-z0-9_]*)'/g)].map(m => m[1] ?? m[2]);
    return unique([...listed, ...commanded, ...dispatched]);
}
function factsKeys(text) {
    const templated = [...text.matchAll(/`\$\{(\w+)\}\.([a-z][\w.]*)`/g)].map(m => `\${${m[1]}}.${m[2]}`);
    const kKeys = [...text.matchAll(/kKey\('([\w.]+)'\)/g)].map(m => `kKey:${m[1]}`);
    const ids = [...text.matchAll(/'(book\.ri\.keeper[\w.]*)'/g)].map(m => m[1]);
    return unique([...ids, ...templated, ...kKeys]);
}
function timing(text) {
    const rows = [];
    for (const line of text.split('\n')) {
        if (!/clock|[Mm]inutes|[Dd]ays?\b|KEEPER_DAY|1440|elapsed|startedAt|At\b/.test(line)) continue;
        for (const m of line.matchAll(/(?<![\w.$])(\d+(?:\.\d+)?)(?![\w.])/g)) {
            if (!['0', '1'].includes(m[1])) rows.push(m[1]);
        }
        for (const m of line.matchAll(/export const (\w*(?:Minutes|Days|Window|Hours))\s*=\s*([\d*\s]+)/g)) rows.push(`${m[1]}=${m[2].trim()}`);
    }
    return unique(rows);
}
function stockArithmetic(text) {
    return unique(text.split('\n').filter(line => /done\([^)]*\)\s*[*+-]|completed\[[^\]]+\][^;]*[*]|stock\w*\s*=.*[*+-]/.test(line))
        .map(line => line.trim().replace(/\s+/g, ' ').slice(0, 160)));
}
function scan(path, kind) {
    const text = read(path);
    const local = imports(text);
    return {file: path.slice(root.length), kind, lines: text.split('\n').length,
        leaves: local.filter(name => leaves.includes(basename(name))).map(name => basename(name)),
        imports: local.map(name => basename(name)),
        writesFacts: /\.facts\[[^\]]+\]\s*=/.test(text), parsesJson: /JSON\.parse/.test(text),
        validator: /export function validate\w*/.test(text),
        operations: operations(text), factsKeys: factsKeys(text), timing: timing(text), stock: stockArithmetic(text)};
}

const keeperSrc = readdirSync(src).filter(name => /^gu_keeper_\w+\.js$/.test(name)).sort();
const keeperPacks = readdirSync(packs).filter(name => /^book_gu_keeper_\w+\.js$/.test(name)).sort();
// Non-keeper Gu modules that hold a scene's own saved row are scene modules too.
const sceneSrc = readdirSync(src).filter(name => /^gu_\w+\.js$/.test(name) && !keeperSrc.includes(name))
    .filter(name => /\.facts\[[^\]]+\]\s*=|JSON\.parse\(raw\)|state\.worlds\[/.test(read(join(src, name)))).sort();

const rows = [
    ...keeperSrc.map(name => scan(join(src, name), 'keeper-src')),
    ...sceneSrc.map(name => scan(join(src, name), 'scene-src')),
    ...keeperPacks.map(name => scan(join(packs, name), 'keeper-pack')),
];
const counts = {keeperSrc: keeperSrc.length, keeperPacks: keeperPacks.length, sceneSrc: sceneSrc.length,
    total: rows.length, sharedProcedureImporters: rows.filter(row => row.leaves.some(l => ['gu_procedures', 'gu_workshop'].includes(l))).length,
    factsWriters: rows.filter(row => row.writesFacts).length, validators: rows.filter(row => row.validator).length};

if (process.argv.includes('--markdown')) {
    const cell = list => list.length ? list.join(', ').replaceAll('|', '/') : '-';
    console.log('| File | Kind | Lines | Shared leaves | Operations | Facts keys | Timing literals | Stock arithmetic |');
    console.log('| --- | --- | ---: | --- | --- | --- | --- | --- |');
    for (const row of rows) console.log(`| ${basename(row.file)} | ${row.kind} | ${row.lines} | ${cell(row.leaves)} | ${cell(row.operations)} | ${cell(row.factsKeys)} | ${cell(row.timing)} | ${row.stock.length} |`);
    console.log(`\nCounts: ${JSON.stringify(counts)}`);
} else console.log(JSON.stringify({counts, rows}, null, 1));
