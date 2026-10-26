import {createHash} from 'node:crypto';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const genKitExports = new Set(['pickWeighted', 'pickStratified', 'shuffleBag', 'next', 'sampleAndScore', 'withRetries', 'peek', 'commit']);

async function files(dir, extension) {
    const out = [];
    for (const entry of await readdir(dir, {withFileTypes: true})) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...await files(file, extension));
        else if (entry.isFile() && file.endsWith(extension)) out.push(file);
    }
    return out;
}
function bodyAfter(source, start) {
    const open = source.indexOf('{', start);
    if (open < 0) return '';
    let depth = 0, quote = '';
    for (let i = open; i < source.length; i++) {
        const c = source[i];
        if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
        if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
        if (c === '{') depth++;
        if (c === '}' && --depth === 0) return source.slice(open + 1, i);
    }
    return '';
}
function findGenerators(source, file) {
    const result = [];
    const re = /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
    for (const match of source.matchAll(re)) {
        const [signature, name, params] = match;
        // gen_kit's real shape is a family of exported addressed/stateful
        // primitives returning {value, receipt}; include that family by name.
        // Elsewhere require an exported generate* function with address-like
        // input and the same receipt shape, avoiding unrelated selectors.
        const fromKit = path.basename(file) === 'gen_kit.js' && genKitExports.has(name);
        if (!fromKit && (!/^generate[A-Z_]/.test(name) || !/(?:address|root|seed|key)/i.test(params))) continue;
        if (fromKit) { result.push(name); continue; }
        const body = bodyAfter(source, match.index + signature.length);
        if (/return\s*\{[^}]*\bvalue\s*:[^}]*\breceipt\s*:/s.test(body) ||
            /return\s*\{[^}]*\breceipt\s*:[^}]*\bvalue\s*:/s.test(body)) result.push(name);
    }
    return result;
}
const textCache = new Map();
const cachedText = file => {
    if (!textCache.has(file)) textCache.set(file, readFile(file, 'utf8'));
    return textCache.get(file);
};
async function hasMatch(paths, pattern) {
    for (const file of paths) if (pattern.test(await cachedText(file))) return true;
    return false;
}
async function hasNamedTest(paths, name, signal) {
    const namePattern = new RegExp(`\\b${name}\\b`);
    for (const file of paths) {
        const source = await cachedText(file);
        const blocks = source.split(/\btest\s*\(/i).slice(1);
        if (blocks.some(block => {
            const body = block.split(/\n\s*test\s*\(/i, 1)[0];
            return namePattern.test(body) && signal.test(body);
        })) return true;
    }
    return false;
}
async function main() {
const sourceFiles = (await files(path.join(root, 'src'), '.js')).sort();
const testFiles = (await files(path.join(root, 'tests'), '.js')).sort();
const allSource = new Map(await Promise.all(sourceFiles.map(async file => [file, await cachedText(file)])));
const generators = [];
for (const [file, source] of allSource) for (const name of findGenerators(source, file)) generators.push({file, name, source});
const rows = [];
for (const generator of generators) {
    const consumers = sourceFiles.filter(file => file !== generator.file);
    const [reader, seed, golden, reload] = await Promise.all([
        hasMatch(consumers, new RegExp(`\\b${generator.name}\\b`)),
        hasNamedTest(testFiles, generator.name, /seed/i),
        hasNamedTest(testFiles, generator.name, /golden/i),
        hasNamedTest(testFiles, generator.name, /reload|re-load/i),
    ]);
    const budget = /(?:maxEntities|maxDrawsPerDay|drawsPerDay|costClass|costClass\s*:|generatorBudget)/i.test(generator.source);
    const hash = createHash('sha256').update(generator.source).digest('hex').slice(0, 12);
    rows.push({name: generator.name, file: path.relative(root, generator.file), reader, seed, golden, reload, budget, hash});
}
console.log('Static declaration/signals census, not semantic conformance. Detector coverage: named exported functions and gen_kit primitives; other forms are unassessed.');
console.log('| Generator | Reader | Seed sweep | Golden (3 seeds) | Save/reload | Budget | Source hash |');
console.log('|---|---:|---:|---:|---:|---:|---|');
for (const row of rows) console.log(`| \`${row.name}\` (${row.file}) | ${row.reader ? 'yes' : 'no'} | ${row.seed ? 'yes' : 'no'} | ${row.golden ? 'yes' : 'no'} | ${row.reload ? 'yes' : 'no'} | ${row.budget ? 'yes' : 'no'} | \`${row.hash}\` |`);
if (strict && rows.some(row => !row.reader || !row.seed || !row.golden || !row.reload || !row.budget)) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
export {findGenerators};
