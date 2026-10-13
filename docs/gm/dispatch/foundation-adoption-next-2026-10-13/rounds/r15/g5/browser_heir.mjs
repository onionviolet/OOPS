// R15 G5 seeded-native browser proof for FA17 (heir from what the life left).
// Serve the rebuilt worktree on 127.0.0.1:19150 first:
//   python3 -m http.server 19150 --bind 127.0.0.1   (from the worktree root)
// Usage: node browser_heir.mjs <rich|empty|old>
// Each run uses a fresh Chrome profile under /private/tmp/r15-g5-profile-<kind>-<time>.
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import crypto from 'node:crypto';
const kind=process.argv[2]||'rich';
const here=new URL('.',import.meta.url).pathname,ev=here+'evidence/',fx=here+'fixture/';fs.mkdirSync(ev,{recursive:true});
const root=new URL('../../../../../../../',import.meta.url).pathname;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').slice(0,16);
const profile=`/private/tmp/r15-g5-profile-${kind}-${Date.now()}`;
const context=await chromium.launchPersistentContext(profile,{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,viewport:{width:1600,height:1100},acceptDownloads:true});
const page=context.pages()[0]||await context.newPage();page.setDefaultTimeout(30000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const result={kind,profile,errors,steps:[]};
const step=(name,data={})=>{result.steps.push({name,...data});console.log(name,JSON.stringify(data).slice(0,300));};
const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
const ready=async()=>{await page.locator('#loading_screen_play_button').waitFor({state:'visible'});};
const play=async()=>{await ready();await page.locator('#loading_screen_play_button').click();};
const summary=s=>({name:s.character.name,money:s.character.money,heroCreated:s.global_flags.is_hero_created,
    inventory:Object.fromEntries(Object.entries(s.inventories.person.main_character).map(([k,v])=>[JSON.parse(k).id+(JSON.parse(k).quality?`@${JSON.parse(k).quality}`:''),v.count])),
    chest:Object.fromEntries(Object.entries(s.inventories.storage?.player||{}).map(([k,v])=>[JSON.parse(k).id,v.count])),
    shack:s.availabilities.location.Shack,reputation:s.character.reputation,xp:s.levels?.person?.main_character?.total_xp,
    knowledge:s.expansion.chronicle?.knowledge,inheritance:s.expansion.chronicle?.life.experience?.inheritance??null,
    inheritedFrom:s.expansion.chronicle?.life.experience?.inheritedFrom?.name??null,generation:s.expansion.chronicle?.life.experience?.generation??null,
    elderTies:s.expansion.chronicle?.relationships.villageElder?.ties,inheritanceEvent:s.expansion.chronicle?.events.inheritance?.status,
    ended:s.expansion.chronicle?.life.endedAt??null,clock:s.expansion.clock,calendar:s['current time']});
// The chronicle lives in Notebook > People.
const openChronicle=async()=>{
    if(!(await page.locator('#chronicle_panel').isVisible())) await page.locator('button:visible').filter({hasText:/^People$/}).first().click();
    await page.locator('#chronicle_panel').waitFor({state:'visible'});
    if(!(await page.locator('#chronicle_panel').getAttribute('open')===''))await page.locator('#chronicle_panel > summary').click();
};
const stable=s=>{const c=structuredClone(s);delete c.saved_at;delete c.total_playtime;delete c.last_rewarded_export;return c;};
const importFile=async file=>{await page.locator('#saved_file_input').setInputFiles(file);await page.waitForURL(/.*/);await page.waitForEvent('load',{timeout:90000});await ready();};
try {
    await page.goto('http://127.0.0.1:19150/',{waitUntil:'networkidle'});await ready();
    const bundle=await page.evaluate(()=>[...document.scripts].map(s=>s.src).find(u=>u.includes('dist/bundle.js')));
    step('fresh origin loaded',{bundle,localBundleHash:hash(fs.readFileSync(root+'dist/bundle.js')),servedBundleHash:hash(Buffer.from(await (await fetch(bundle)).arrayBuffer()))});
    await play();await page.locator('#hero_creation_panel_confirmation').click().catch(()=>{});
    const file=process.env.G5_FILE||fx+(kind==='old'?'TEST-FIXTURE-R15-G5-old-rule-heir.txt':`TEST-FIXTURE-R15-G5-${kind}-ended.txt`);
    await importFile(file);
    const imported=await saved();step('literal-file import of fixture',{file:file.split('/').pop(),...summary(imported)});
    // An ended life shows its dialog above the loading screen; PLAY is only for the living.
    if(kind==='old') await play();
    if(kind==='old') {
        await openChronicle();
        const text=await page.locator('#chronicle_panel').innerText();
        step('old-rule heir loaded on new build',{inheritanceLine:await page.locator('#chronicle_inheritance').innerText(),studyButtons:await page.locator('[data-chronicle^="study."]:visible').count(),panelExcerpt:text.slice(0,600)});
        await page.locator('#save_button').click();await page.waitForTimeout(500);
        const after=await saved();step('old-rule heir saved on new build',summary(after));
        if(JSON.stringify(after.expansion.chronicle.knowledge)!==JSON.stringify(imported.expansion.chronicle.knowledge))throw new Error('old heir knowledge changed');
    } else {
        const dialog=page.locator('#chronicle_life_end');await dialog.waitFor({state:'visible'});
        const preview=await page.locator('#chronicle_heir_leftovers li').allInnerTexts();
        step('ended-life dialog shows what will pass',{button:await page.locator('[data-life="begin-heir"]').innerText(),help:await dialog.locator('p').nth(1).innerText(),preview});
        await page.screenshot({path:ev+`${kind}-ended-dialog.png`});
        await Promise.all([page.waitForEvent('load',{timeout:120000}),page.locator('[data-life="begin-heir"]').click()]);
        // The request page builds the heir, passes the import probe and reloads once more.
        await page.waitForFunction(()=>!localStorage.getItem('heir request'),null,{timeout:120000});
        await page.waitForLoadState('load');await ready();
        const heir=await saved();step('heir envelope written after real import check',summary(heir));
        await play();
        await page.locator('#hero_creation_name_field').fill(`TEST FIXTURE R15 G5 ${kind} heir`);
        await page.locator('#hero_creation_panel_confirmation').click();
        await page.locator('#chronicle_panel').waitFor({state:'attached'});
        await openChronicle();
        const inheritanceLine=await page.locator('#chronicle_inheritance').innerText();
        const journal=await page.locator('#chronicle_panel ol li').allInnerTexts();
        const study=await page.locator('[data-chronicle^="study."]:visible').allInnerTexts();
        step('heir playing: what they actually received',{inheritanceLine,journal,study,
            money:await page.locator('#money_div, #character_money').first().innerText().catch(()=>null)});
        await page.screenshot({path:ev+`${kind}-heir-chronicle.png`});
        if(study.length){
            await page.locator('[data-chronicle^="study."]:visible').first().click();await page.waitForTimeout(800);
            step('studied the old papers',{knowledge:(await saved()).expansion.chronicle.knowledge,status:await page.locator('#chronicle_panel [role=status]').first().innerText()});
        }
        if(kind==='rich'){
            const ties=(await saved()).expansion.chronicle.relationships.villageElder.ties;
            step('inherited obligations visible',{ties,settleShown:await page.locator('[data-chronicle="settle"]').isVisible(),dutyShown:await page.locator('[data-chronicle="duty"]').isVisible()});
        }
        // Save, reload, export, literal-file import with state comparison.
        await page.locator('#save_button').click();await page.waitForTimeout(500);
        const savedState=await saved();
        await page.reload({waitUntil:'load'});await ready();
        const reloaded=await saved();
        step('save then reload',{equal:JSON.stringify(stable(savedState))===JSON.stringify(stable(reloaded)),...summary(reloaded)});
        await play();
        const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);
        const exportPath=ev+`${kind}-heir-export.txt`;await download.saveAs(exportPath);
        const exported=await saved();
        // Clear the slot, then literal-file import of the exported file.
        await page.evaluate(()=>{localStorage.removeItem('save data');});
        await page.reload({waitUntil:'load'});await ready();
        await play();await page.locator('#hero_creation_panel_confirmation').click().catch(()=>{});
        await importFile(exportPath);
        const reimported=await saved();
        const a=stable(exported),b=stable(reimported);
        step('export then literal-file import into a cleared slot',{equalIgnoringTimestamps:JSON.stringify(a)===JSON.stringify(b),
            chronicleEqual:JSON.stringify(a.expansion.chronicle)===JSON.stringify(b.expansion.chronicle),
            inventoryEqual:JSON.stringify(a.inventories)===JSON.stringify(b.inventories),moneyEqual:a.character.money===b.character.money,...summary(reimported)});
        fs.writeFileSync(ev+`${kind}-heir-reimported.json`,JSON.stringify(summary(reimported),null,1));
        const sz=fs.statSync(exportPath).size;if(sz>500000)fs.unlinkSync(exportPath);
    }
} catch(e) {result.failure=e.stack;try{await page.screenshot({path:ev+`${kind}-failure.png`});}catch{}}
finally {fs.writeFileSync(ev+`${kind}-result.json`,JSON.stringify(result,null,1));await context.close();console.log(result.failure?'FAIL '+result.failure:'DONE');}
