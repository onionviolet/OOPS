// W3 lineage + companion wishes proof. Usage: node scripts/lineage_companions_browser.cjs <width> <port> <outDir>
// Serve the repo root first (python3 -m http.server <port>) after npm run build.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R='/Users/weiwei/code/yet-another-idle-rpg/';
const {launchChrome,withTestHooks}=require(R+'scripts/ui_helpers.cjs');
const W=+process.argv[2],PORT=process.argv[3],OUT=process.argv[4];fs.mkdirSync(OUT,{recursive:true});
const ok=m=>console.log('PASS '+m);
(async()=>{
const b=await launchChrome(),errs=[];
const play=async page=>{await page.waitForFunction(()=>{const b=document.getElementById('loading_screen_play_button');return !!b&&b.checkVisibility();},null,{timeout:20000}).catch(()=>{});await page.evaluate(()=>document.getElementById('loading_screen_play_button')?.click());await page.waitForFunction(()=>{const l=document.getElementById('loading_screen');return !l||!l.checkVisibility();},null,{timeout:20000}).catch(()=>{});};
const open=async fixture=>{const ctx=await b.newContext({viewport:{width:W,height:900},acceptDownloads:true});
 if(fixture)await ctx.addInitScript(d=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(d))},fixture);
 const page=await ctx.newPage();page.on('pageerror',e=>errs.push(e.message));
 await page.goto(withTestHooks(`http://127.0.0.1:${PORT}/`));await page.waitForTimeout(400);
 await play(page);
 if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
 await page.waitForTimeout(400);return {page,ctx};};
const save=async page=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
const openMod=async(page,id)=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);await page.waitForTimeout(500);};
const shot=(page,f)=>page.screenshot({path:path.join(OUT,`${f}-${W}.png`)});
const ticks=async(page,n)=>{for(let left=n;left>0;left-=500)await page.evaluate(k=>advanceTicks(k),Math.min(500,left));};
// 1 enrol through the real menus so generated people exist
let {page,ctx}=await open();
{const f=await save(page);assert.equal(f.inherited_traits,undefined);ok('fresh save has no inherited_traits slice (older saves unchanged)');}
await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.waitForTimeout(800);
await page.locator('.end_dialogue_button:visible, #center_mode_back').first().click().catch(()=>{});
await page.locator('[data-route-id="known-people"]').click();await page.waitForTimeout(500);
{const t=page.locator('[data-notebook-view="people"]');if(await t.isVisible())await t.click();
if(!(await page.locator('#chronicle_panel').isVisible())){await openMod(page,'notebook');await page.waitForTimeout(300);const t2=page.locator('[data-notebook-view="people"]');if(await t2.isVisible())await t2.click();}
await page.locator('#chronicle_panel').waitFor({state:'visible',timeout:5000});if(!(await page.locator('#chronicle_panel').evaluate(n=>n.open)))await page.locator('#chronicle_panel summary').click();}
await page.locator('[data-chronicle="begin-open"]').click();
const enrolled=await save(page);assert.ok(enrolled.expansion.chronicle);
ok('enrolled');
await ctx.close();
// 2 lineage panel on a save with coins
const fx=structuredClone(enrolled);fx.character.money=100;delete fx.inherited_traits;
({page,ctx}=await open(fx));
await openMod(page,'inherited_traits');
assert.ok(await page.locator('#inherited_traits_panel').isVisible(),'lineage panel visible');
let txt=await page.locator('#inherited_traits_panel').innerText();
assert.match(txt,/Long wind/);assert.match(txt,/\(hidden\)/);assert.match(txt,/You|\(you\)/);
await shot(page,'01-lineage');ok('panel visible at '+W+': phenotype with hidden alleles marked');
const before=await save(page);const hiddenBefore=(txt.match(/\(hidden\)/g)||[]).length;
await page.locator('[data-lineage-test="self"]').click();await page.waitForTimeout(300);
let s=await save(page);
assert.equal(s.inherited_traits.members.find(m=>m.id==='self').tested.length,1);assert.equal(s.character.money,before.character.money-6);
txt=await page.locator('#inherited_traits_panel').innerText();assert.ok((txt.match(/\(hidden\)/g)||[]).length<hiddenBefore);
await shot(page,'02-after-test');ok('test costs 6 coins, reveals one quality, persists in the slice');
// reload keeps it
await page.reload();await play(page);await page.waitForTimeout(500);
s=await save(page);assert.equal(s.inherited_traits.members.find(m=>m.id==='self').tested.length,1);ok('reload keeps the tested quality');
// export/import
const encoded=await page.evaluate(()=>window.save_to_file());await ctx.close();
({page,ctx}=await open());
await page.locator('#saved_file_input').setInputFiles({name:'x.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)});await page.waitForTimeout(4000);await play(page);await page.waitForTimeout(500);
s=await save(page);assert.equal(s.inherited_traits.members.find(m=>m.id==='self').tested.length,1);ok('literal import restores the slice');
await ctx.close();
// 3 heir crossing: fixture one tick from end of life
const dying=structuredClone(s);const c=dying.expansion.chronicle;c.life.mode='mortal';c.life.initialAge=80-1/(360*24*60);
({page,ctx}=await open(dying));
await page.locator('#chronicle_life_end').waitFor({state:'visible',timeout:8000});
const endTxt=await page.locator('#chronicle_life_end').innerText();
assert.match(endTxt,/Inherited from the line:/);
await shot(page,'03-death-inherited');
await page.locator('[data-life="begin-heir"]').click();await page.waitForTimeout(2500);await play(page);await page.waitForTimeout(800);
const heir=await save(page);assert.ok(heir.inherited_traits.selfId&&heir.inherited_traits.selfId!=='self');assert.ok(heir.inherited_traits.members.length>=5);
ok('life end names inherited qualities; heir save carries a re-rooted line: '+heir.inherited_traits.selfId);
await ctx.close();
// 4 companions: a met resident from the generated people
const comp=structuredClone(enrolled);comp.character.money=100;delete comp.inherited_traits;
({page,ctx}=await open(comp));
await openMod(page,'village-travelers');if(!(await page.locator('#generated_people_panel').evaluate(n=>n.open)))await page.locator('#generated_people_panel summary').click();
await page.getByRole('button',{name:'Welcome road travelers'}).click();await page.waitForTimeout(400);
for(let i=0;i<2;i++){const row=page.locator('#generated_people_panel details[data-generated-person]:has-text("visiting")').nth(i);await row.locator('summary').click();await row.getByRole('button',{name:'Meet traveler'}).click();await page.waitForTimeout(400);}
{const g=await save(page);assert.ok(g.generated_people.people.filter(p=>p.met).length>=2,'two travelers met: '+g.generated_people.people.map(p=>[p.met,p.status]));}
await ticks(page,5);await openMod(page,'companions');
await page.locator('#companion_roster_panel').waitFor({state:'visible'});
txt=await page.locator('#companion_roster_panel').innerText();
const wishes=[...txt.matchAll(/(wishes you would[^.]*|hopes the bond[^.]*)\./g)].map(m=>m[1]);
assert.ok(wishes.length>=2,'wishes shown: '+txt.slice(0,400));assert.notEqual(wishes[0],wishes[1]);
await shot(page,'04-wishes');ok('wishes shown, none identical: '+wishes.join(' | '));
s=await save(page);assert.equal(s.companions.schema,2);
// answer one wish through the real buttons
const li=page.locator('#companion_roster_panel li[data-key]').first();
const wtext=wishes[0];
for(let i=0;i<8&&!(await page.locator('#companion_roster_panel').innerText()).includes('granted');i++){
 const r=wtext.match(/share a meal|walk together|sit in quiet company|trade stories|work side by side/);
 const idx=r?['share a meal','walk together','sit in quiet company','trade stories','work side by side'].indexOf(r[0]):0;
 const rite=['share_meal','walk_together','quiet_company','trade_stories','work_alongside'][idx];
 await li.locator(`[data-bond-rite="${rite}"]`).click();await page.waitForTimeout(150);}
txt=await page.locator('#companion_roster_panel').innerText();assert.match(txt,/granted/);
await shot(page,'05-granted');ok('a wish is answerable by clicking and is granted');
// neglect: 16 days with no rites
await ticks(page,16*1440);await page.waitForTimeout(300);
txt=await page.locator('#companion_roster_panel').innerText();assert.match(txt,/Gone to the wild road/);assert.match(txt,/went back to the road/);
await shot(page,'06-gone');
const gone=await page.locator('[data-companion-return]:visible').first();
assert.ok(await gone.isDisabled(),'way back opens after a pause');
ok('neglected wish sends a free person away, with its reason');
await ticks(page,4*1440);await page.waitForTimeout(300);
const goneBefore=Object.values((await save(page)).companions.bonds).filter(x=>x.gone).length;const back=page.locator('[data-companion-return]:visible').first();assert.ok(await back.isEnabled());await back.click();await page.waitForTimeout(200);
txt=await page.locator('#companion_roster_panel').innerText();assert.match(txt,/came back/);
s=await save(page);assert.equal(Object.values(s.companions.bonds).filter(x=>x.gone).length,goneBefore-1);
await shot(page,'07-back');ok('going looking brings them back with a fresh wish');
// reload + schema 1 old save loads
await page.reload();await play(page);await page.waitForTimeout(500);
s=await save(page);assert.equal(s.companions.schema,2);ok('reload keeps companions slice');
await ctx.close();
const old=structuredClone(comp);old.companions={schema:1,bonds:{}};
({page,ctx}=await open(old));await ticks(page,3);s=await save(page);assert.ok(!s.companions||s.companions.schema===2);ok('schema 1 save loads (empty slice is not rewritten)');
await ctx.close();
assert.deepEqual(errs,[]);ok('no page errors');
await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
