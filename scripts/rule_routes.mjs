#!/usr/bin/env node
// Routes source paths to the rulebooks that govern them, read from the `paths:`
// frontmatter of .claude/rules/*.md (the same files Claude auto-loads by path).
// Codex and scripts use this to find the rules Claude would have loaded.
//
//   node scripts/rule_routes.mjs --for src/heat.js [more paths]
//       Lists the rule files and code families for each path.
//   node scripts/rule_routes.mjs --check [--message <file>] [--strict]
//       For changed paths (working tree, index and untracked versus HEAD), lists the
//       code families that apply. With --message, warns when a touched area's codes
//       are not cited in that text. Warnings only unless --strict (AD36: lean checks).
//   node scripts/rule_routes.mjs --stale
//       Warns about globs that match no file.
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rulesDir = resolve(root, '.claude/rules');

export function globToRegExp(glob) {
    let re = '';
    for (let i = 0; i < glob.length; i++) {
        const c = glob[i];
        if (c === '*' && glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
        else if (c === '*') re += '[^/]*';
        else if (c === '?') re += '[^/]';
        else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
    return new RegExp(`^${re}$`);
}

export function parseRuleFile(text) {
    const fm = /^---\n([\s\S]*?)\n---/.exec(text);
    const globs = fm ? [...fm[1].matchAll(/^\s*-\s*"?([^"\n]+?)"?\s*$/gm)].map(m => m[1]) : [];
    const body = fm ? text.slice(fm[0].length) : text;
    const families = [...new Set([...body.matchAll(/\b([A-Z]{2,4})\d+(?:\s*[–-]\s*(?:[A-Z]{2,4})?\d+)?\b/g)].map(m => m[1]))]
        .filter(f => !['AD'].includes(f));
    const ranges = [...new Set([...body.matchAll(/\b([A-Z]{2,4}\d+(?:\s*[–-]\s*(?:[A-Z]{2,4})?\d+)?)\b/g)].map(m => m[1]))];
    return {globs, families, ranges};
}

export function loadRoutes(dir = rulesDir) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
        const r = parseRuleFile(readFileSync(resolve(dir, f), 'utf8'));
        return {file: `.claude/rules/${f}`, ...r, res: r.globs.map(globToRegExp)};
    });
}

export function routesFor(path, routes) {
    return routes.filter(r => r.res.some(re => re.test(path)));
}

function changedPaths() {
    const git = args => execFileSync('git', args, {cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}).split('\n').filter(Boolean);
    return [...new Set([...git(['diff', '--name-only', 'HEAD']), ...git(['diff', '--name-only', '--cached']),
        ...git(['ls-files', '--others', '--exclude-standard', 'src'])])];
}

function listFiles() {
    return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}).split('\n').filter(Boolean);
}

function main(argv) {
    const routes = loadRoutes();
    const strict = argv.includes('--strict');
    if (argv[0] === '--for') {
        for (const p of argv.slice(1)) {
            const path = relative(root, resolve(process.cwd(), p));
            const hits = routesFor(path, routes);
            console.log(hits.length ? `${path}\n${hits.map(h => `  ${h.file}: ${h.ranges.join(', ')}`).join('\n')}` : `${path}\n  (no path rule; see docs/RULES_INDEX.md router)`);
        }
        return 0;
    }
    if (argv[0] === '--stale') {
        const files = listFiles();
        let n = 0;
        for (const r of routes) for (const [i, re] of r.res.entries())
            if (!files.some(f => re.test(f))) { n++; console.log(`WARN  ${r.file}: glob "${r.globs[i]}" matches no file`); }
        console.log(n ? `${n} stale glob(s)` : 'PASS rule routes: every glob matches a file');
        return n && strict ? 1 : 0;
    }
    if (argv[0] === '--check') {
        const mi = argv.indexOf('--message');
        const message = mi >= 0 ? readFileSync(argv[mi + 1], 'utf8') : null;
        const touched = changedPaths().filter(p => p.startsWith('src/'));
        const byRule = new Map();
        for (const p of touched) for (const r of routesFor(p, routes)) {
            if (!byRule.has(r.file)) byRule.set(r.file, {r, paths: []});
            byRule.get(r.file).paths.push(p);
        }
        let warned = 0;
        for (const {r, paths} of byRule.values()) {
            // A rule that covers all of src (runtime-code) is general; it informs but never warns.
            const general = r.globs.some(g => g === 'src/**/*.js');
            const cited = general || (message && r.families.some(f => new RegExp(`\\b${f}\\d`).test(message)));
            const line = `${r.file} (${r.ranges.join(', ')}) for ${paths.length} changed file(s): ${paths.slice(0, 3).join(', ')}${paths.length > 3 ? ', ...' : ''}`;
            if (message && !cited) { warned++; console.log(`WARN  no code cited from ${line}`); }
            else console.log(`INFO  ${line}`);
        }
        console.log(byRule.size ? `${byRule.size} rule area(s) touched${warned ? `, ${warned} without a cited code` : ''}` : 'PASS rule routes: no routed source changed');
        return warned && strict ? 1 : 0;
    }
    console.log('usage: rule_routes.mjs --for <path...> | --check [--message <file>] [--strict] | --stale');
    return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
