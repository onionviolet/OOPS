// Test-only instrumentation: expose real loader/serializer without a production debug API.
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
const require = createRequire(import.meta.url);
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
export async function cheatGame({start = 'none', port = 0, viewport = {width:1920,height:1080}} = {}) {
    const root = new URL('../../', import.meta.url);
    const source = await readFile(new URL('src/main.js', root), 'utf8');
    const bundle = await build({entryPoints: [new URL('src/main.js', root).pathname],
        plugins: [{name: 'cheat-test-access', setup(build) {
            build.onLoad({filter: /[/\\]src[/\\]main\.js$/}, () => ({contents: source + `
                import {readNativeFighter as rfRead,commitNativeBattleStrike as rfStrike,withdrawNativeBattle as rfWithdraw} from './native_battle.js';
                globalThis.__cheatTest = {ready:()=>ownsSave&&!restoringNativeSave&&!importProbeToken,create_save, load, craft:(request)=>domainRegistry.command('crafting','execute')(domainRegistry.command('crafting','quote')(request)), craftView:()=>domainRegistry.project('crafting'),
                  rfContext:()=>campaignContext(),openPeople:()=>adventureNotebook.open('people'),
                  rfStrike:()=>{const p=expansionState.simulation.people.roadRival,e=new Enemy({name:'Opponent',stats:{...p.body,health:p.vitals.max_health,max_stamina:p.vitals.max_stamina}});e.init();Object.assign(e.getFullStats(),p.vitals);persistExpansion(rfStrike(expansionState,expeditionRegistry,{actorId:'player',targetId:'roadRival',attacker:rfRead(character),target:rfRead(e)},campaignContext()));frontierCampaignPanel?.render();},
                  rfWithdraw:()=>{persistExpansion(rfWithdraw(expansionState,expeditionRegistry,campaignContext()));frontierCampaignPanel?.render();},
                  rfAccept:()=>{const p=commitSimulationCommand(expansionState,expeditionRegistry,{id:'rival.confront',requestId:pursuitView(expansionState,RIVAL_PURSUIT).requestId},{...campaignContext(),targetId:'roadRival'});persistExpansion(initializeNativeBattle(p));frontierCampaignPanel?.render();},
                  campaign:actFrontierCampaign, save:save_progress, beginHeir, startEncounter:()=>{const z=Object.values(locations).find(z=>z.tags.combat_zone&&z.get_next_enemies&&z.enemies_list?.includes('Starving wolf'));z.getAvailabilityComponent().is_unlocked=true;change_location({location_id:z.id,skip_travel_time:true});}, awaken:awakenOptionalStart, freeze:suspendEngine, drawLoot:key=>gameKeyedRandom(STREAMS.loot,key), import:load_from_file, advance: update_timer, debug:()=>({location:current_location?.id,combat:!!current_combat,defenders:current_combat?.defenders?.map(e=>({name:e.name,alive:e.is_alive,rngKey:e.rngKey,loot:e.loot_list})),snapshot:current_combat?.snapshot(current_location.id),projection:domainRegistry.project('cheats')}), read: () => structuredClone(cheatState),
                  set: value => {setCheatState(value);}};`, loader: 'js', resolveDir: new URL('src/', root).pathname}));
        }}], bundle: true, write: false, format: 'esm', platform: 'browser', target: 'es2022'});
    const server = createServer(async (req, res) => {
        try {
            const pathname = new URL(req.url, 'http://localhost').pathname;
            const file = new URL('.' + pathname, root);
            if(!file.href.startsWith(root.href)) {res.writeHead(403).end(); return;}
            const data = pathname === '/dist/bundle.js' ? bundle.outputFiles[0].contents : await readFile(pathname === '/' ? new URL('index.html', root) : file);
            res.setHeader('Content-Type', pathname.endsWith('.js') ? 'text/javascript' : pathname.endsWith('.css') ? 'text/css' : pathname === '/' ? 'text/html' : 'application/octet-stream');
            res.end(data);
        } catch {res.writeHead(404).end();}
    });
    await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
    const browser = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    const context = await browser.newContext({viewport});
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`, {waitUntil: 'domcontentloaded'});
    await page.locator('#loading_screen_play_button:not(.none_display)').waitFor();
    // Optional-start coverage uses the retained command value; the public picker is deferred.
    if(await page.locator('#new_game_beginning [data-cheat-start]').count()) {
        await page.locator('#new_game_beginning [data-cheat-start]').selectOption(start, {force: true});
    }
    await page.locator('#loading_screen_play_button').click();
    await page.waitForTimeout(1200);
    if(await page.locator('#hero_creation_panel_confirmation').isVisible()) {
        await page.locator('[data-cheat-start]').selectOption(start);
        await page.locator('#hero_creation_panel_confirmation').click();
    }
    await page.waitForFunction(() => !!globalThis.__cheatTest);
    return {page, errors, close: async () => {await browser.close(); await new Promise(resolve => server.close(resolve));}};
}
