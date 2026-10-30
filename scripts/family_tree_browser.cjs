// RPX21 family tree proof. Usage: node scripts/family_tree_browser.cjs <port> <outDir>
// Serve the repo root first (python3 -m http.server <port>) after npm run build and npm run build:figures.
// Headless Chrome at 1920x1080: fresh life -> chronicle -> Family panel; heir crossing -> Family; gallery.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {launchChrome,withTestHooks}=require('./ui_helpers.cjs');
const PORT=process.argv[2],OUT=process.argv[3];fs.mkdirSync(OUT,{recursive:true});
const ok=m=>console.log('PASS '+m);
(async()=>{
const b=await launchChrome(),errs=[];
const play=async page=>{await page.waitForFunction(()=>{const b=document.getElementById('loading_screen_play_button');return !!b&&b.checkVisibility();},null,{timeout:20000}).catch(()=>{});await page.evaluate(()=>document.getElementById('loading_screen_play_button')?.click());await page.waitForTimeout(600);};
const open=async fixture=>{const ctx=await b.newContext({viewport:{width:1920,height:1080}});
 if(fixture)await ctx.addInitScript(d=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(d))},fixture);
 const page=await ctx.newPage();page.on('pageerror',e=>errs.push(e.message));
 await page.goto(withTestHooks(`http://127.0.0.1:${PORT}/`));await page.waitForTimeout(400);
 await play(page);
 if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
 await page.waitForTimeout(400);return {page,ctx};};
const save=async page=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
const openMod=async(page,id)=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);await page.waitForTimeout(500);};
const family=async page=>{await openMod(page,'family');const p=page.locator('#family_tree_panel');await p.waitFor({state:'visible',timeout:5000});await p.scrollIntoViewIfNeeded();return p;};
// 1 fresh life: Family is not offered before a chronicle, then appears with the founded line
let {page,ctx}=await open();
assert.ok(!(await page.getByRole('combobox',{name:'Other known panels'}).locator('option[value="family"]').count()),'Family is not offered before a chronicle');
ok('fresh life: Family not offered yet');
await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.waitForTimeout(800);
await page.locator('.end_dialogue_button:visible, #center_mode_back').first().click().catch(()=>{});
await page.locator('[data-route-id="known-people"]').click();await page.waitForTimeout(500);
{const t=page.locator('[data-notebook-view="people"]');if(await t.isVisible())await t.click();
if(!(await page.locator('#chronicle_panel').isVisible())){await openMod(page,'notebook');await page.waitForTimeout(300);const t2=page.locator('[data-notebook-view="people"]');if(await t2.isVisible())await t2.click();}
await page.locator('#chronicle_panel').waitFor({state:'visible',timeout:5000});if(!(await page.locator('#chronicle_panel').evaluate(n=>n.open)))await page.locator('#chronicle_panel summary').click();}
await page.locator('[data-chronicle="begin-open"]').click();
const enrolled=await save(page);assert.ok(enrolled.expansion.chronicle);ok('enrolled through the elder and the People notebook');
let p=await family(page);
assert.ok(await p.locator('svg.fig-svg').count(),'figure drawn');
let txt=await p.locator('pre.fig-text').innerText();
assert.match(txt,/Your family/);assert.match(txt,/Nodes: You \(active\); Father;/);assert.doesNotMatch(txt,/filled/);assert.match(txt,/Father's father \(unknown\)/);assert.match(txt,/If this life ended now \(Single successor\)/);assert.match(await p.locator('[data-family-succession]').innerText(),/Who would inherit/);
fs.writeFileSync(path.join(OUT,'01-fresh-life-text.txt'),txt+'\n');
await p.screenshot({path:path.join(OUT,'01-fresh-life-panel-1920.png')});await page.screenshot({path:path.join(OUT,'01-fresh-life-screen-1920.png')});
ok('fresh life: Family shows parents known, grandparents unknown, the succession line and its text form');
const enrolledAfter=await save(page);await ctx.close();
// 2 heir crossing: the old life becomes a parent, the played line becomes a track
const dying=structuredClone(enrolledAfter);const c=dying.expansion.chronicle;c.life.mode='mortal';c.life.initialAge=80-1/(360*24*60);
({page,ctx}=await open(dying));
await page.locator('#chronicle_life_end').waitFor({state:'visible',timeout:8000});
await page.locator('[data-life="begin-heir"]').click();await page.waitForTimeout(2500);await play(page);await page.waitForTimeout(800);
const heir=await save(page);assert.ok(heir.inherited_traits.selfId&&heir.inherited_traits.selfId!=='self');
p=await family(page);txt=await p.locator('pre.fig-text').innerText();
assert.match(txt,/Lives in this line, 1 of 2 done/);assert.match(txt,/\(guessed\)/);assert.match(txt,/Father's father|Mother's father/);
fs.writeFileSync(path.join(OUT,'02-heir-text.txt'),txt+'\n');
await p.screenshot({path:path.join(OUT,'02-heir-panel-1920.png')});
ok('heir: the line of lives is a track, the untracked partner is guessed, the founders are grandparents');
await ctx.close();
// 3 gallery: both fixtures in Luminous and Neutral
{const ctx3=await b.newContext({viewport:{width:1920,height:1080}});const g=await ctx3.newPage();g.on('pageerror',e=>errs.push(e.message));
await g.goto(`http://127.0.0.1:${PORT}/figure-gallery.html`);await g.waitForTimeout(800);
for(const id of ['family-household','family-stranger','family-fan-stranger']){const s=g.locator(`[data-fixture="${id}"]`);await s.scrollIntoViewIfNeeded();await s.screenshot({path:path.join(OUT,`03-gallery-${id}-1920.png`)});}
ok('gallery fixtures captured');await ctx3.close();}
assert.deepEqual(errs,[]);ok('no page errors');
await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
