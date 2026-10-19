// Shared esbuild loader for tests that import native game modules without the browser shell.
// `src/main.js` and `src/display.js` are imported by several data modules (baselined cycles in
// scripts/architecture_baseline.json). This bundles the requested entry module with those two
// files replaced by stubs, so each exported name becomes an inert value.
// Stub table (default): game_options -> {}, capitalize_first_letter -> a real function,
// everything else -> () => {}. Pass `stubs` ({name: 'js expression'}) to override or add names,
// and `presentation` to widen the regex of stubbed files (seeded_streams also stubs ui/combat_display.js).
import {build} from 'esbuild';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const DEFAULT_STUBS = Object.freeze({
    game_options: '{}',
    capitalize_first_letter: 's=>s[0].toUpperCase()+s.slice(1)',
});
/** Extra stubs for tests that run Hero/Person/combat code reading the current stance and location. */
export const STANCE_LOCATION_STUBS = Object.freeze({
    current_stance: '({getStats:()=>({})})',
    current_location: 'null',
});

/**
 * @param {string} entries ES module source re-exporting what the test needs, e.g. 'export {item_templates} from "./src/items.js";'
 * @param {{stubs?: Record<string,string>, presentation?: RegExp, logLevel?: string, prefix?: string}} [options]
 * @returns {Promise<object>} the bundled module namespace
 */
export async function loadNative(entries, {stubs = {}, presentation = /\/src\/(main|display)\.js$/, logLevel, prefix = 'native-'} = {}) {
    const table = {...DEFAULT_STUBS, ...stubs};
    const dir = await mkdtemp(join(tmpdir(), prefix)), outfile = join(dir, 'native.mjs');
    try {
        await build({
            stdin: {contents: entries, resolveDir: ROOT},
            bundle: true, format: 'esm', platform: 'node', outfile, ...(logLevel ? {logLevel} : {}),
            plugins: [{name: 'presentation-only', setup(b) {
                b.onLoad({filter: presentation}, async a => {
                    const source = await readFile(a.path, 'utf8');
                    const names = [...source.matchAll(/export\s*\{([^}]+)\}/g)]
                        .flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+as\s+/).at(-1)))
                        .filter(s => /^[a-zA-Z_$][\w$]*$/.test(s));
                    return {contents: names.map(s => `export const ${s} = ${Object.hasOwn(table, s) ? table[s] : '()=>{}'};`).join('\n')};
                });
            }}],
        });
        return await import(pathToFileURL(outfile));
    } finally {
        await rm(dir, {recursive: true, force: true});
    }
}
