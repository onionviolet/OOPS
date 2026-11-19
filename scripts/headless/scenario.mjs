import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join, relative} from 'node:path';
import {createScenarioFacade, knownLampProjection} from '../../src/scenario_facade.js';

const assertCommand = command => {if (command?.type !== 'lamp.toggle') throw Error('Unsupported scenario command.');};
// The same narrow bridge is appended inside main's bundle by both harnesses. It
// uses the existing registry, not extracted private main variables or a new owner.
// Browser use requires a localhost test-hooks origin. Production main is unchanged.
export const LAMP_SCENARIO_BRIDGE = `
const scenarioLampOperations = Object.freeze({
    quote: () => domainRegistry.command('lamplight', 'quote')(),
    execute: quote => domainRegistry.command('lamplight', 'execute')(quote),
});
`;
export const BROWSER_SCENARIO_BRIDGE = LAMP_SCENARIO_BRIDGE + `
if (['localhost','127.0.0.1','[::1]'].includes(location.hostname) && new URLSearchParams(location.search).get('test_hooks') === '1')
    window.scenarioLampOperations = scenarioLampOperations;
`;

/** Content identity, including dirty/untracked runtime inputs. No wall mtimes.
 * Hash src/locales/stories and runtime-imported docs plus host/presentation,
 * harness and fixture files. The caller hashes the actual prepared fixture too.
 */
export async function scenarioSourceIdentity(root, {extras = [], privatePacks = false} = {}) {
    const hash = createHash('sha256'), files = new Set(), optional = new Set();
    async function walk(path) {
        for (const entry of (await readdir(join(root,path), {withFileTypes:true})).sort((a,b) => a.name.localeCompare(b.name))) {
            const p = join(path, entry.name);
            if (entry.isDirectory()) await walk(p); else files.add(p);
        }
    }
    for (const path of ['src','locales','stories','styles','scripts/headless']) await walk(path);
    for (const path of ['index.html','style.css','package.json','package-lock.json','build.js',...extras]) files.add(path);
    for (const path of [...files].filter(p => p.startsWith('src/') && p.endsWith('.js'))) {
        const source = await readFile(join(root,path),'utf8');
        if(privatePacks) {
            for(const [path] of source.matchAll(/(?<=['"])private_packs\/[a-z0-9_-]+\/[a-z0-9_.-]+\.json(?=['"])/gi)) optional.add(path);
        }
        for (const match of source.matchAll(/['"]((?:\.\.\/)+(docs\/[^'"]+))['"]/g)) {
            const target = relative(root, new URL(match[1], 'file://' + join(root,path)).pathname);
            files.add(target);
        }
    }
    if (privatePacks) {
        const manifestPath = 'private_packs/manifest.json';
        const manifest = await readFile(join(root, manifestPath), 'utf8').catch(error => {
            if (error.code === 'ENOENT') return null;
            throw error;
        });
        if (manifest !== null) {
            files.add(manifestPath);
            const {packs = [], supplements = []} = JSON.parse(manifest);
            for (const descriptor of packs) {
                if (!/^[a-z0-9_-]+\/pack\.json$/i.test(descriptor)) continue;
                await walk(join('private_packs', descriptor.split('/')[0])).catch(error => {
                    if(error.code !== 'ENOENT') throw error;
                });
            }
            for (const entry of supplements) {
                if (/^[a-z0-9_-]+\/[a-z0-9_.-]+\.json$/i.test(entry)) optional.add(join('private_packs',entry));
            }
        }
    }
    let inputFiles = 0;
    for (const path of [...new Set([...files,...optional])].sort()) {
        const bytes = await readFile(join(root,path)).catch(error => {
            if(optional.has(path) && error.code === 'ENOENT') return null;
            throw error;
        });
        if(bytes === null) continue;
        hash.update(path + '\0'); hash.update(bytes); hash.update('\0');
        inputFiles++;
    }
    return {sourceSha256:hash.digest('hex'), inputFiles};
}

export async function scenarioInputIdentity(root, fixture, save) {
    const source = await scenarioSourceIdentity(root, {extras: ['tests/fixtures/deep_engine/ordinary_lamp.mjs']});
    return {fixture:{...fixture, saveSha256:createHash('sha256').update(JSON.stringify(save)).digest('hex')},
        ...source,
        replay:{covered:['fixture bytes','seeded Math.random/crypto per boot','frozen wall time','explicit command order','paused native tick requests'],
            uncovered:['whole-game RNG draw ledger','ambient optional/private pack responses','browser versus Node timer ordering','cross-reload RNG continuation','concurrent games in one Node realm'],
            claim:'Selected fixture journey only; not whole-game deterministic or reentrant replay.'}};
}

export function createHeadlessScenario(game, identity) {
    return createScenarioFacade({identity,
        quote: command => {assertCommand(command); return game.module.scenarioLampOperations.quote();},
        execute: (command, q) => {assertCommand(command); return game.module.scenarioLampOperations.execute(q);},
        inspect: () => knownLampProjection(globalThis.simulationTestHooks.project('lamplight'), game.minutes()),
        advance: minutes => game.step(minutes),
        persistence:{save:() => game.save(), load:save => game.load(save).then(() => undefined),
            reload:() => game.reload().then(() => undefined), exportFile:() => game.exportFile(),
            importFile:bytes => game.importFile(bytes).then(() => undefined)},
    });
}

/** Playwright Session over a rebuilt disposable candidate; caller owns navigation.
 * quote/execute need BROWSER_SCENARIO_BRIDGE in that same main bundle. Other
 * operations use the existing native hooks/menu routes, not fixture reducers.
 */
export function createBrowserScenario(session, identity) {
    const page = () => session.page;
    async function play() {
        await page().waitForFunction(() => typeof simulationTestHooks === 'object');
        await page().evaluate(() => simulationTestHooks.pause());
        await page().locator('#loading_screen_play_button').click();
        await page().waitForTimeout(350);
    }
    return createScenarioFacade({identity,
        quote: command => {assertCommand(command); return page().evaluate(() => window.scenarioLampOperations.quote());},
        execute: (command,q) => {assertCommand(command); return page().evaluate(q => window.scenarioLampOperations.execute(q),q);},
        inspect: async () => {
            const {lamp, minute} = await page().evaluate(() => {
                const t = simulationTestHooks.snapshot()['current time'];
                return {lamp:simulationTestHooks.project('lamplight'),minute:t.day_count*1440+t.hour*60+t.minute};
            });
            return knownLampProjection(lamp,minute);
        },
        advance: async minutes => {await session.step(minutes);},
        persistence:{save:() => session.save(), load:async save => {await session.open(save);},
            reload:async () => {await page().reload(); await play();},
            exportFile:() => page().evaluate(() => window.save_to_file()),
            importFile:async bytes => {
                await Promise.all([page().waitForEvent('load'),page().evaluate(bytes => window.load_progress(bytes),bytes)]);
                await play();
            }},
    });
}

// Shared finite contract, driven unchanged by Node and the real browser adapter.
export async function ordinaryLampJourney(scenario) {
    const before = await scenario.inspect(), quote = await scenario.quote({type:'lamp.toggle'});
    const preview = await scenario.inspect();
    const lit = await scenario.execute(quote), elapsed = await scenario.advance(2);
    const stale = await scenario.execute(quote);
    const saved = await scenario.persistence.save();
    await scenario.persistence.reload();
    const reloaded = await scenario.inspect(), exported = await scenario.persistence.exportFile();
    await scenario.persistence.importFile(exported);
    return {identity:scenario.identity(),before,preview,quote,lit,elapsed,stale,reloaded,
        imported:await scenario.inspect(),saved,exported};
}
