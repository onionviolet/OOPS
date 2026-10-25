// G1 reference journey in a rebuilt page at 1920x1080 from a fresh origin. Native harvest, craft, examine, read, learn, Save, reload, Export and literal Import.
// Reference loss is the native 'Put back on shelf' control; no saved-game editing.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=process.env.PROOF_URL||'http://127.0.0.1:19481/?test_hooks=1',evidence=process.env.EVIDENCE||'/tmp/g1-evidence';
const BOOK='village.method-book',SLATE='village.method-disk',PRIMER='village.primer',RECIPE='village.salt-steep';
(async()=>{fs.mkdirSync(evidence,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[],log=[];
 try{
 const context=await browser.newContext({viewport:{width:1920,height:1080}});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});const missing=[];page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource'))errors.push(m.text());});
 const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
 const note=async()=>(await page.locator('#crafting_engine_home [role=status]').innerText());
 async function ready(){await page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});}
 async function boot(){await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready();}
 async function open(){await page.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');await page.locator('#crafting_engine_home').waitFor({state:'visible'});}
 const inv=s=>s.inventories.person.main_character;
 const refKey=(s,id)=>Object.keys(inv(s)).find(k=>{try{const j=JSON.parse(k);return j.id==='Craft reference'&&j.ref===id;}catch{return false;}});
 const check=(l,v)=>{assert.ok(v,l);log.push(l);console.log('PASS '+l);};
 await page.goto(url);await boot();await open();
 for(const id of [BOOK,SLATE,PRIMER])await page.locator(`[data-shelf-take="${id}"]`).click();
 let s=await snapshot();check('three references carried',[BOOK,SLATE,PRIMER].every(id=>refKey(s,id)));
 check('recipe frozen and references registered',!!s.crafting.recipes[RECIPE]&&Object.keys(s.crafting.references.defs).length===3);
 check('method offered from the carried book',(await page.locator('#crafting_method option').allInnerTexts()).some(t=>t.includes('from book')));
 // Gather until a salt and a herb lot exist.
 const lots=async()=>{const t=await snapshot();return Object.keys(inv(t)).filter(k=>{try{return JSON.parse(k).id==='Gathered herb';}catch{return false;}}).map(k=>({k,fam:t.crafting.materials[JSON.parse(k).materialRef]?.family}));};
 let have=[];for(let i=0;i<14;i++){have=await lots();if(have.some(l=>l.fam==='riversalt')&&have.some(l=>l.fam==='reedherb'))break;const g=page.locator('#crafting_gather');if(await g.isDisabled())await page.evaluate(()=>window.advanceTicks(5,{render:true}));else await g.click();}
 check('salt and herb lots gathered',have.some(l=>l.fam==='riversalt')&&have.some(l=>l.fam==='reedherb'));
 await page.evaluate(()=>window.advanceTicks(1,{render:true}));await open();
 await page.locator('#crafting_method').selectOption(RECIPE);
 for(const l of [have.find(l=>l.fam==='riversalt'),have.find(l=>l.fam==='reedherb')])await page.locator(`[data-craft-material='${l.k.replaceAll("'","\\'")}']`).check();
 await page.screenshot({path:evidence+'/method-selected-1920.png'});
 await page.locator('#crafting_engine_home [data-craft-commit]').click({timeout:8000});
 s=await snapshot();check('craft by method made a preparation',Object.keys(inv(s)).some(k=>JSON.parse(k).productFamily==='craft.batch@1'));
 // Lose the book: access goes, nothing was learned.
 check('method hint names the slots',(await page.locator('#crafting_engine_home').innerText()).includes('needs:'));
 await page.locator('#crafting_engine_home [data-ref-return]').first().click();await page.waitForTimeout(100);
 s=await snapshot();check('book put back, recipe still frozen, nothing learned',!refKey(s,BOOK)&&!!s.crafting.recipes[RECIPE]&&!(s.crafting.references.learned?.player??[]).length);
 check('method no longer offered without the book',!(await page.locator('#crafting_method option').allInnerTexts()).some(t=>t.includes('Follow')));
 // Examine, with a visible outcome each time. The craft used the first lots, so gather samples again.
 for(let i=0;i<4;i++){const g=page.locator('#crafting_gather');if(await g.isDisabled())break;await g.click();}
 const outcomes=[];for(let i=0;i<8;i++){const b=page.locator('[data-craft-examine]:not([disabled])').first();if(!await b.count())break;await b.click();outcomes.push((await note()).startsWith('You misread')?'failure':'identified');}
 console.log('EXAMINE',outcomes.join(','));check('examine ran and reported an outcome',outcomes.length>0);
 await page.screenshot({path:evidence+'/examine-1920.png'});
 // Training book: once.
 const xp=t=>t.levels?.person?.main_character?.skill_xp?.Literacy??t.skills?.Literacy?.total_xp??0,xp0=xp(await snapshot());
 await page.locator(`[data-ref-read]`).click();s=await snapshot();const xp1=xp(s);check('primer grants Literacy once',xp1>xp0);
 check('second read is blocked',await page.locator(`[data-ref-read]`).isDisabled());
 // Learn and consume.
 await page.locator(`[data-ref-learn]`).click();s=await snapshot();
 check('slate consumed and recipe learned',!refKey(s,SLATE)&&s.crafting.references.learned.player.includes(RECIPE));
 check('method offered as learned without any book',(await page.locator('#crafting_method option').allInnerTexts()).some(t=>t.includes('learned')));
 await page.screenshot({path:evidence+'/learned-1920.png'});
 // Persistence.
 await page.locator('#save_button').click();const saved=await snapshot();await page.reload();await boot();const restored=await snapshot();
 assert.deepEqual(restored.crafting,saved.crafting);assert.deepEqual(inv(restored),inv(saved));check('save, reload keep owner and inventory',true);
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'g1.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
 const imported=await snapshot();assert.deepEqual(imported.crafting,saved.crafting);assert.deepEqual(inv(imported),inv(saved));check('Export and literal Import keep owner and inventory',true);
 assert.deepEqual(missing.filter(u=>!u.includes('/resources/fonts/private/')),[]);assert.deepEqual(errors,[]);
 fs.writeFileSync(evidence+'/REFERENCE_BROWSER.json',JSON.stringify({viewport:'1920x1080',examine:outcomes,checks:log},null,1));console.log('PASS reference journey');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
