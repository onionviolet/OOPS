#!/usr/bin/env node
// Named save states for the floor checks every lane repeats, plus a boot-twice determinism check.
//   node scripts/headless/scenarios.mjs list
//   node scripts/headless/scenarios.mjs build <name> --out file.json        (never overwrites the library)
//   node scripts/headless/scenarios.mjs determinism <name> [--days 1] [--seed 1]
// A scenario is a committed fixture file or a recipe (a fresh hero advanced N days). Recipes are built on
// demand through the real stepper and cached under the OS temp folder, keyed by name and source stamp, so
// a code change rebuilds them. Callers get save text to boot a COPY from; the cache file is never handed
// out for writing. The game MCP exposes the same names as game_new({scenario}).
import {readFile, writeFile, mkdir, readdir, stat} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {boot, canonicalSave, diffSaves, ROOT} from './runner.mjs';
import {advanceGame} from './advance.mjs';

export const SCENARIOS = Object.freeze({
    'fresh': {summary: 'New hero, day 1, Village.', recipe: {days: 0}},
    'fresh-day3': {summary: 'New hero after three days of stepping.', recipe: {days: 3}},
    'fresh-week': {summary: 'New hero after a week of stepping.', recipe: {days: 7}},
    'village-craftsman': {summary: 'Three days in, old craftsman reachable (story access patched like village_route.progress); walks the village.interrupt_work request.', recipe: {days: 3, patch: 'craftsman'}},
    'village-workshop-unenrolled': {summary: 'DEV SEEDED craftsman access; native greeting completed, no local simulation enrolled. Open Notebook > People > Craftsman & workshop.', recipe: {days: 0, patch: 'craftsman', prepare: 'workshop'}},
    'village-rival': {summary: 'DEV SEEDED craftsman access; native crossing inspection, field membership and Mara meeting. Open Notebook > People > Road contest.', recipe: {days: 0, patch: 'craftsman', prepare: 'rival'}},
    'perf-fresh': {summary: 'Committed perf fixture: fresh life.', file: 'tests/fixtures/perf/fresh.json'},
    'perf-mid': {summary: 'Committed perf fixture: mid-game life.', file: 'tests/fixtures/perf/mid.json'},
    'perf-crowded': {summary: 'Committed perf fixture: crowded life (many people and jobs).', file: 'tests/fixtures/perf/crowded.json'},
});
// A recipe may patch the stepped save for story access a floor check needs without hours of combat; each patch is data a
// route script already uses (default: none; dial: add a named patch per check; reason: keep the hero otherwise untouched).
const PATCHES = {
    craftsman: save => {const out = structuredClone(save); out.availabilities.dialogue.oldCraftsman = 1; return out;},
};
// Only story access bypasses the elder's combat chain. Introductions, enrollment,
// membership, pursuit and their costs are produced by the ordinary UI commands.
async function prepareVillage(game, kind) {
    await game.clickText('village elderVillage neighbor');
    await game.click('[data-focus-action="talk:villageElder"]');
    await game.click('[data-textline="hello"]');
    await game.click('#center_mode_back');
    await game.clickText('old craftsmanVillage neighbor');
    await game.click('[data-focus-action="talk:oldCraftsman"]');
    await game.click('[data-textline="hello"]');
    await game.click('#center_mode_back');
    await game.step(1); // Refresh witnessed people and discover the Notebook.
    if(kind === 'workshop') return;
    if(kind !== 'rival') throw new Error(`Unknown Village preparation ${kind}.`);
    await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'notebook');
    await game.click('#notebook_tab_here');
    await game.click('#expedition_panel > summary');
    await game.click('[data-expedition-action="frontier.inspect"]');
    await game.step(3);
    await game.click('#field_panel > summary');
    await game.click('[data-field-command="field.begin"]');
    await game.click('[data-field-command="field.join_survey"]');
    await game.step(2);
    await game.click('#notebook_tab_people');
    await game.click('#frontier_campaign_panel > summary');
    await game.click('[data-campaign="rival.begin"]');
    await game.step(3);
}
export const CACHE_DIR = join(tmpdir(), 'yairpg-scenarios');

async function sourceStamp() {
    let newest = 0, count = 0;
    for(const dir of ['src', 'scripts/headless']) for(const f of await readdir(join(ROOT, dir))) {
        if(!f.endsWith('.js') && !f.endsWith('.mjs')) continue;
        newest = Math.max(newest, (await stat(join(ROOT, dir, f))).mtimeMs); count++;
    }
    return createHash('sha256').update(`${Math.floor(newest)}:${count}`).digest('hex').slice(0, 10);
}

/** Save text for a scenario (null = brand new hero). Recipes are built once per source stamp. */
export async function scenarioSave(name, {seed = 1} = {}) {
    const def = SCENARIOS[name];
    if(!def) throw new Error(`Unknown scenario ${name}. Known: ${Object.keys(SCENARIOS).join(', ')}.`);
    if(def.file) return readFile(join(ROOT, def.file), 'utf8');
    if(!def.recipe.days && !def.recipe.patch && !def.recipe.prepare) return null;
    const cached = join(CACHE_DIR, `${name}-s${seed}-${await sourceStamp()}.json`);
    try {return await readFile(cached, 'utf8');} catch {/* build below */}
    const game = await boot(null, {seed});
    let text;
    try {
        await advanceGame(game, {days: def.recipe.days});
        const snap = game.snapshot(), patch = def.recipe.patch ? PATCHES[def.recipe.patch] : null;
        if(def.recipe.patch && !patch) throw new Error(`Unknown scenario patch ${def.recipe.patch}.`);
        const save = patch ? patch(typeof snap === 'string' ? JSON.parse(snap) : snap) : snap;
        if(def.recipe.prepare) {
            await game.load(save);
            await prepareVillage(game, def.recipe.prepare);
            text = JSON.stringify(game.snapshot());
        } else text = JSON.stringify(save);
    }
    finally {game.close();}
    await mkdir(CACHE_DIR, {recursive: true});
    await writeFile(cached, text);
    return text;
}

/** Boot the same scenario twice with the same seed, advance both, compare canonical saves. */
export async function determinismCheck(name, {days = 1, seed = 1} = {}) {
    const results = [];
    for(let i = 0; i < 2; i++) {
        const game = await boot(await scenarioSave(name, {seed}), {seed});
        try {await advanceGame(game, {days}); results.push(canonicalSave(game.snapshot()));}
        finally {game.close();}
    }
    const diffs = diffSaves(results[0], results[1]);
    return {scenario: name, days, seed, identical: results[0] === results[1], hash: createHash('sha256').update(results[0]).digest('hex').slice(0, 16), diffs};
}

if(import.meta.url === `file://${process.argv[1]}`) {
    const [cmd, name, ...rest] = process.argv.slice(2);
    const opt = Object.fromEntries(rest.reduce((a, v, i) => v.startsWith('--') ? [...a, [v.slice(2), rest[i + 1]]] : a, []));
    let line;
    if(cmd === 'list') line = Object.entries(SCENARIOS).map(([n, d]) => `${n}\t${d.summary}`).join('\n');
    else if(cmd === 'build') {
        if(!opt.out) throw new Error('--out <file> is required.');
        const text = await scenarioSave(name, {seed: Number(opt.seed ?? 1)});
        if(text == null) throw new Error(`${name} is a brand-new hero; boot it with boot(null).`);
        await writeFile(resolve(opt.out), text);
        line = JSON.stringify({scenario: name, out: opt.out, bytes: text.length});
    } else if(cmd === 'determinism') {
        const r = await determinismCheck(name, {days: Number(opt.days ?? 1), seed: Number(opt.seed ?? 1)});
        line = JSON.stringify(r);
        process.exitCode = r.identical ? 0 : 1;
    } else throw new Error('Use list, build or determinism.');
    console.log(line);
}
