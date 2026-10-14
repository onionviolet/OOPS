import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join, relative} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const baseline = JSON.parse(readFileSync(new URL('./core_ratchets.baseline.json', import.meta.url), 'utf8'));

// Deliberately lexical source inventories, not a call graph. Count direct spellings
// (including default Math.random references), static import edges and complete
// xorshift32 13/17/5 sequences. Aliases/computed calls are outside this gate.
function sites(source, pattern) {
    return [...source.matchAll(pattern)].map(m => ({match: m,
        line: source.slice(0, m.index).split('\n').length}));
}
function countSource(file, source) {
    const random = sites(source, /\bMath\s*\.\s*random\s*\(/g);
    const references = sites(source, /\bMath\s*\.\s*random\b/g);
    const shifts = sites(source, /\b([\w.]+)\s*\^=\s*\1\s*<<\s*13\s*;\s*\1\s*\^=\s*\1\s*>>>\s*17\s*;\s*\1\s*\^=\s*\1\s*<<\s*5\s*;/g);
    const panels = sites(source, /\bdefinePanel\s*\(/g)
        .filter(s => !/\bfunction\s*$/.test(source.slice(0, s.match.index)));
    // World-named modules: book_world_*, proto23_world_*, world_completion_*,
    // original_frontier_*, frontier_campaign*, realm_* and pocket_realm_*.
    // This naming gate does not pretend to classify every content/host module.
    const worlds = /^simulation[^/]*\.js$/.test(file)
        ? sites(source, /\bimport\s+(?:[^;]*?\bfrom\s*)?['"]([^'"]+)['"]/g)
            .filter(s => /(?:^|_)(?:world|frontier|realm)(?:_|\.|$)/.test(s.match[1].split('/').at(-1)))
        : [];
    return {mathRandomCalls: random, mathRandomReferences: references,
        worldModuleImports: worlds, xorshiftCopies: shifts,
        definePanelCalls: panels, definePanelCallers: panels.length ? [panels[0]] : []};
}
function sourceFiles(dir) {
    return readdirSync(dir, {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name))
        .flatMap(e => e.name.startsWith('SECRETS') ? [] : e.isDirectory()
            ? sourceFiles(join(dir, e.name)) : e.isFile() && e.name.endsWith('.js') ? [join(dir, e.name)] : []);
}
const inventory = Object.fromEntries(Object.keys(baseline.maximum).concat(Object.keys(baseline.minimum)).map(k => [k, []]));
for (const path of sourceFiles(join(root, 'src'))) {
    const file = relative(join(root, 'src'), path);
    for (const [metric, matches] of Object.entries(countSource(file, readFileSync(path, 'utf8')))) {
        inventory[metric].push(...matches.map(s => `src/${file}:${s.line}`));
    }
}

test('core debt ceilings and panel-kit floors stay within the reviewed baseline', t => {
    assert.equal(baseline.schema, 1);
    t.diagnostic(JSON.stringify(Object.fromEntries(Object.entries(inventory).map(([k, v]) => [k, v.length]))));
    for (const [metric, ceiling] of Object.entries(baseline.maximum)) {
        assert.ok(inventory[metric].length <= ceiling,
            `${metric}: ${inventory[metric].length} exceeds ${ceiling}; ${inventory[metric].join(', ')}`);
    }
    for (const [metric, floor] of Object.entries(baseline.minimum)) {
        assert.ok(inventory[metric].length >= floor, `${metric}: ${inventory[metric].length} below ${floor}`);
    }
    // Lower ceilings/raise floors after accepted cleanup. Never regenerate this
    // file in tests: loosening a baseline requires explicit review.
});

test('inventory distinguishes call sites, caller files and world import edges', () => {
    const sample = countSource('simulation_future.js', `
import {one, two} from './book_world_fixture.js';
import {pure} from './power_models.js';
import './realm_fixture.js';
export function definePanel(options) {}
definePanel({}); definePanel({});
Math.random(); Math . random (); const fallback = Math.random;
let n = 1; n ^= n << 13; n ^= n >>> 17; n ^= n << 5;
`);
    assert.deepEqual(Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, v.length])), {
        mathRandomCalls: 2, mathRandomReferences: 3, worldModuleImports: 2,
        xorshiftCopies: 1, definePanelCalls: 2, definePanelCallers: 1,
    });
    assert.equal(countSource('other.js', "import './realm_fixture.js';").worldModuleImports.length, 0);
});
