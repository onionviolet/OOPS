#!/usr/bin/env node
// Reachability from the game entry (PC14, PC51 packet P1.1).
//   node scripts/reachable.mjs                 print "reachable N of M src files" and any computed imports
//   node scripts/reachable.mjs --json          reachable, unreachable, computedImports, unresolved (repo-relative)
//   node scripts/reachable.mjs --is <path>     exit 0 if the file is reachable from src/main.js, 1 if not
// The walk follows static `import ... from`, `import '...'`, `export ... from` and
// `import('literal')` with relative specifiers. An import whose path is computed
// (a variable or a template with `${}`) cannot be followed; it is listed under
// `computedImports` so a pack loaded that way shows as a visible gap, never as
// silently unreachable. Bare specifiers and `node:` modules are not src files and are skipped.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_ENTRY = path.join(root, 'src/main.js');
const SRC_EXT = /\.m?js$/;

// Blank out comments and keep string contents, so `// import('x')` in a comment is not followed.
function stripComments(text) {
    let out = '', i = 0, q = null;
    while (i < text.length) {
        const c = text[i], n = text[i + 1];
        if (q) {
            out += c;
            if (c === '\\') { out += n ?? ''; i += 2; continue; }
            if (c === q || (q !== '`' && c === '\n')) q = null;
            i++; continue;
        }
        if (c === '/' && n === '/') { while (i < text.length && text[i] !== '\n') i++; continue; }
        if (c === '/' && n === '*') { i += 2; while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++; i += 2; continue; }
        if (c === '"' || c === "'" || c === '`') q = c;
        out += c; i++;
    }
    return out;
}

/** Specifiers one file names: {specs: literal strings, computed: snippets of imports we cannot follow}. */
export function importsOf(text) {
    const src = stripComments(text);
    const specs = new Set(), computed = [];
    for (const m of src.matchAll(/\b(?:import|export)\s*(?:[\w*${},\s]*?\bfrom\s*)?(['"])([^'"\n]+)\1/g)) specs.add(m[2]);
    for (const m of src.matchAll(/\bfrom\s*(['"])([^'"\n]+)\1/g)) specs.add(m[2]);
    for (const m of src.matchAll(/(?<![\w.$])import\s*\(\s*([^)]*)\)/g)) {
        const arg = m[1].trim();
        const lit = /^(['"])([^'"\n]+)\1$/.exec(arg) ?? /^`([^`$]*)`$/.exec(arg);
        if (lit) specs.add(lit[lit.length - 1]); else computed.push(`import(${arg.slice(0, 80)})`);
    }
    return {specs: [...specs], computed};
}

function resolveSpec(from, spec) {
    if (!spec.startsWith('.')) return null;
    const base = path.resolve(path.dirname(from), spec);
    for (const c of [base, `${base}.js`, `${base}.mjs`, path.join(base, 'index.js')]) {
        if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
    }
    return undefined;
}

/** Full walk: {reachable: Set of absolute paths, computedImports: [{file, snippet}], unresolved: [{file, spec}]}. */
export function walkFrom(entry = DEFAULT_ENTRY) {
    const reachable = new Set(), computedImports = [], unresolved = [];
    const stack = [path.resolve(entry)];
    while (stack.length) {
        const file = stack.pop();
        if (reachable.has(file)) continue;
        reachable.add(file);
        if (!/\.m?js$/.test(file)) continue;
        const {specs, computed} = importsOf(fs.readFileSync(file, 'utf8'));
        for (const snippet of computed) computedImports.push({file, snippet});
        for (const spec of specs) {
            const r = resolveSpec(file, spec);
            if (r) stack.push(r); else if (r === undefined) unresolved.push({file, spec});
        }
    }
    return {reachable, computedImports, unresolved};
}

export const reachableFrom = entry => walkFrom(entry).reachable;

export function srcFiles(dir = path.join(root, 'src')) {
    const out = [];
    for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) out.push(...srcFiles(p)); else if (SRC_EXT.test(e.name)) out.push(p);
    }
    return out.sort();
}

export const isReachable = (file, entry = DEFAULT_ENTRY) => reachableFrom(entry).has(path.resolve(root, file));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    const rel = p => path.relative(root, p);
    const {reachable, computedImports, unresolved} = walkFrom();
    const files = srcFiles();
    const isIdx = args.indexOf('--is');
    if (isIdx >= 0) {
        const target = path.resolve(root, args[isIdx + 1] ?? '');
        const ok = reachable.has(target);
        console.log(`${rel(target)}: ${ok ? 'reachable' : 'not reachable'} from src/main.js`);
        process.exit(ok ? 0 : 1);
    }
    const inSrc = files.filter(f => reachable.has(f));
    const comp = computedImports.map(c => ({file: rel(c.file), snippet: c.snippet}));
    const unres = unresolved.map(u => ({file: rel(u.file), spec: u.spec}));
    if (args.includes('--json')) {
        console.log(JSON.stringify({entry: 'src/main.js', reachableCount: inSrc.length, srcCount: files.length,
            reachable: inSrc.map(rel), unreachable: files.filter(f => !reachable.has(f)).map(rel), computedImports: comp, unresolved: unres}, null, 2));
    } else {
        console.log(`reachable ${inSrc.length} of ${files.length} src files`);
        console.log(`computedImports: ${comp.length}`);
        for (const c of comp) console.log(`  ${c.file}: ${c.snippet}`);
        if (unres.length) { console.log(`unresolved relative imports: ${unres.length}`); for (const u of unres) console.log(`  ${u.file}: ${u.spec}`); }
    }
}
