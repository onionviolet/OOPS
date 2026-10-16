// Test-only browser harness. Native models, crafting transactions, town commands,
// serializer and loader are unchanged. No save fields or debug setters are used.
import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.RT_PLAYWRIGHT_MODULE || '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = new URL('../../', import.meta.url);
export const fixtureDirectory = new URL('../fixtures/rt_slice1/', import.meta.url);
export const fixtureNames = ['old-before-slice', 'crafted-low', 'crafted-high', 'town-returned'];

export async function rtSlice1Game() {
    const source = await readFile(new URL('src/main.js', root), 'utf8');
    assert.ok(source.includes('function update() {'));
    assert.ok(source.includes('createExpansionState(crypto.getRandomValues(new Uint32Array(1))[0])'));
    const bundle = await build({entryPoints: [fileURLToPath(new URL('src/main.js', root))], bundle: true,
        write: false, format: 'esm', platform: 'browser', target: 'es2022', plugins: [{name: 'rt-slice1-test-access', setup(b) {
            b.onLoad({filter: /[/\\]src[/\\]main\.js$/}, () => ({loader: 'js', resolveDir: fileURLToPath(new URL('src/', root)),
                // Deterministic seed at construction, manual native clock instead of wall-time ticks.
                contents: source.replace('function update() {', 'function update() { return;')
                    .replace('createExpansionState(crypto.getRandomValues(new Uint32Array(1))[0])', 'createExpansionState(17)') + `
                globalThis.__rtSlice1 = {
                    save: create_save, load, encode: encodeSaveFile,
                    reward: process_rewards, advance: update_timer,
                    learnCrafting: () => process_rewards({rewards: dialogues['old craftsman'].textlines.learn.rewards, source_type:'textline',source_name:'oldCraftsman'}),
                    grantMaterials: () => character.addToInventory([{item_id:'Rough wood log',count:100},{item_id:'Iron ingot',count:200}]),
                    train: () => {for(const id of ['Woodworking','Forging']) add_xp_to_skill({skill:skills[id],xp_to_add:10000,use_bonus:false,cap_gained_xp:false});},
                    level: id => character.getTotalSkillLevel(id),
                    town: id => startExpedition(id, expansionState.sequence),
                    travel: id => change_location({location_id:id,skip_travel_time:true}),
                    craft: (category,id) => {open_crafting_window();switch_crafting_recipes_page(category);switch_crafting_recipes_subpage(category,'items');
                        const row=document.querySelector('[data-crafting_category="'+category+'"][data-crafting_subcategory="items"] [data-recipe_id="'+id+'"]');
                        if(!row) throw Error('Missing native recipe row: '+id); use_recipe(row.querySelector('.recipe_item_name'),1);},
                    closeCraft: close_crafting_window,
                    fieldReward: () => process_rewards({rewards:locations['Infested field'].repeatable_reward,source_type:'location',source_name:'Infested field',is_first_clear:true}),
                };` }));
        }}]});
    const server = createServer(async (req, res) => {
        try {
            const path = new URL(req.url, 'http://localhost').pathname;
            const file = new URL('.' + path, root);
            if(!file.href.startsWith(root.href)) {res.writeHead(403).end();return;}
            const data = path === '/dist/bundle.js' ? bundle.outputFiles[0].contents : await readFile(path === '/' ? new URL('index.html', root) : file);
            res.setHeader('Content-Type', path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : path === '/' ? 'text/html' : 'application/octet-stream'); res.end(data);
        } catch {res.writeHead(404).end();}
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {browser = await chromium.launch({headless:true,executablePath:process.env.RT_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});}
    catch(error) {await new Promise(resolve=>server.close(resolve));throw error;}
    const errors = [];
    async function open(save) {
        const context = await browser.newContext({viewport:{width:1366,height:768}});
        if(save) await context.addInitScript(s => localStorage.setItem('save data',s), save);
        const page = await context.newPage();page.on('pageerror',e=>errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'domcontentloaded'});
        await page.locator('#loading_screen_play_button:not(.none_display)').click();
        await page.waitForFunction(()=>!!globalThis.__rtSlice1);
        const confirm = page.locator('#hero_creation_panel_confirmation');
        await page.waitForFunction(()=>(document.getElementById('hero_creation_panel_confirmation') && !document.getElementById('hero_creation_panel_confirmation').classList.contains('none_display')) || document.getElementById('location_actions_div').children.length>0);
        if(await confirm.isVisible()) await confirm.click();
        await page.waitForFunction(()=>!!document.querySelector('#location_actions_div .location_choice_dropdown'));
        return {page,close:()=>context.close()};
    }
    return {open,errors,close:async()=>{await browser.close();await new Promise(resolve=>server.close(resolve));}};
}

export async function generateRtSlice1Fixtures() {
    const game = await rtSlice1Game();
    const manifest = {seed:17, provenance:'seeded-native; native rewards/material and XP APIs, no debug writes or save edits', crafts:[]};
    try {
        const {page} = await game.open();
        await page.locator('#character_name_field').fill('TEST FIXTURE RT SLICE1 BASE');
        await page.locator('#character_name_field').dispatchEvent('change');
        async function snapshot(name) {
            await page.locator('#character_name_field').fill('TEST FIXTURE RT SLICE1 '+name.toUpperCase());
            await page.locator('#character_name_field').dispatchEvent('change');
            const save = await page.evaluate(()=>__rtSlice1.save());assert.ok(save);
            await writeFile(new URL(name+'.save.json',fixtureDirectory),save+'\n');
            await writeFile(new URL(name+'.save.txt',fixtureDirectory),await page.evaluate(s=>__rtSlice1.encode(s),save));
        }
        await snapshot('old-before-slice');
        await page.evaluate(()=>{start_dialogue('villageElder');start_textline('hello');end_dialogue();__rtSlice1.fieldReward();__rtSlice1.learnCrafting();__rtSlice1.grantMaterials();});
        async function craftPair(band) {
            for(const [category,skill,recipe] of [['woodworking','Woodworking','Processed rough wood'],['forging','Forging','Iron chainmail']]) {
                const before = JSON.parse(await page.evaluate(()=>__rtSlice1.save()));
                const level = await page.evaluate(id=>__rtSlice1.level(id),skill);
                let attempts = 0, after;
                do {
                    await page.evaluate(([c,r])=>__rtSlice1.craft(c,r),[category,recipe]);attempts++;
                    after=JSON.parse(await page.evaluate(()=>__rtSlice1.save()));
                } while(after.total_crafting_successes===before.total_crafting_successes && attempts<20);
                assert.ok(after.total_crafting_successes>before.total_crafting_successes,'Native craft must succeed');
                manifest.crafts.push({band,skill,recipe,level,attempts});
            }
            await page.evaluate(()=>__rtSlice1.closeCraft());
        }
        await craftPair('low');await snapshot('crafted-low');
        await page.evaluate(()=>__rtSlice1.train());
        await craftPair('high');await snapshot('crafted-high');
        await page.evaluate(()=>{__rtSlice1.travel('Town outskirts');__rtSlice1.town('town.begin');__rtSlice1.travel('Town square');__rtSlice1.town('town.brief');__rtSlice1.travel('Village');__rtSlice1.town('town.timber');__rtSlice1.advance(3);__rtSlice1.travel('Town square');__rtSlice1.town('town.settle');__rtSlice1.travel('Village');__rtSlice1.town('town.return');});
        const final = JSON.parse(await page.evaluate(()=>__rtSlice1.save()));
        assert.equal(final.expansion.actors.player.facts['town.returned'],true);
        await snapshot('town-returned');
        assert.deepEqual(game.errors,[]);
        await writeFile(new URL('manifest.json',fixtureDirectory),JSON.stringify(manifest,null,2)+'\n');
        return manifest;
    } finally {await game.close();}
}
if(process.argv[1]===fileURLToPath(import.meta.url)) console.log(JSON.stringify(await generateRtSlice1Fixtures(),null,2));
