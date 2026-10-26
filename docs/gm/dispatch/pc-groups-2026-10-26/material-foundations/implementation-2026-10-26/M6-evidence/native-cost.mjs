import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
const source=resolve(process.argv[2]),output=resolve(process.argv[3]),out=resolve(process.argv[4]);
const {Session}=await import(pathToFileURL(join(source,'scripts/playtest/lib.mjs')));
const {serve}=await import(pathToFileURL(join(source,'scripts/perf/lib.mjs')));
await mkdir(out,{recursive:true});const server=await serve(output),missing=[],checks=[];
const s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,26),opTimeout:15000,
 hooks:{beforeOpen:async c=>c.on('response',r=>{if(r.status()>=400)missing.push({status:r.status(),path:new URL(r.url()).pathname});})}});
let p;const key=id=>JSON.stringify({id}),count=(save,id)=>save.inventories.person.main_character[key(id)]?.count??0;
const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
const project=save=>({goat:count(save,'Goat meat'),boar:count(save,'Boar meat'),fat:count(save,'Animal fat'),method:save.availabilities.recipe['Animal fat']});
const save=async()=>{await p.locator('#save_button').click();return JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));};
async function play(){await p.locator('#loading_screen_play_button').waitFor({state:'visible'});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(200);}
async function craft(){const back=p.locator('#center_mode_back');if(await back.isVisible())await back.click();const actions=p.locator('button[data-place-tab="actions"]');if(await actions.isVisible())await actions.click();await p.locator('.choice_craft').click();await p.locator('#crafting_mainpage_buttons [data-crafting_category="cooking"]').click();await p.locator('[data-crafting_category="cooking"][data-crafting_subcategory="items"] [data-recipe_id="Render animal fat from Goat meat"] .recipe_item_name').click();}
async function roundtrip(){const before=project(await save());await p.reload();await play();assert.deepEqual(project(await save()),before);const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#save_to_file_button').click()]);const file=join(out,'native-rendering-export.txt');await download.saveAs(file);await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(file)]);await play();assert.deepEqual(project(await save()),before);checks.push('Native Save/reload/Export/literal file Import retains exact selected/unspent stock, output and method');}
try {
 await s.start();const seed=JSON.parse(await readFile(join(source,'tests/fixtures/perf/mid.json'),'utf8'));
 seed['current location']='Village';seed.global_flags.is_crafting_unlocked=true;seed.availabilities.recipe['Animal fat']=1;seed.availabilities.skill.Cooking=1;seed.levels.person.main_character.skill_xp.Cooking=1000000;
 delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
 seed.inventories.person.main_character[key('Goat meat')]={count:3};seed.inventories.person.main_character[key('Boar meat')]={count:30};delete seed.inventories.person.main_character[key('Animal fat')];
 seed.item_log['Goat meat']={...(seed.item_log['Goat meat']??{}),number:3};
 await s.open(seed);p=s.page;await craft();
 const before=project(await snap());assert.equal(await p.locator('#crafting_detail [data-craft-commit]').isDisabled(),true);
 const refusal=await p.locator('#crafting_detail').innerText();assert.match(refusal,/Goat meat/);assert.deepEqual(project(await snap()),before);
 checks.push('Named native cooking fixture:3 Goat pieces refuses the four-piece recipe without spending;30 Boar pieces do not substitute');
 const enough=structuredClone(seed);enough.inventories.person.main_character[key('Goat meat')].count=4;
 await s.open(enough);p=s.page;await craft();assert.equal(await p.locator('#crafting_detail [data-craft-commit]').isEnabled(),true);
 const prior=project(await snap());await p.locator('#crafting_detail [data-craft-commit]').click();const after=project(await snap());
 assert.equal(prior.goat-after.goat,4);assert.equal(after.boar,prior.boar);assert.equal(after.fat-prior.fat,1);
 checks.push('Actual recipe consumes exactly4 chosen Goat pieces and produces1 Animal fat; unchosen stock stays unchanged');
 await roundtrip();const keep=await save();keep.inventories.person.main_character[key('Goat meat')]={count:4};
 const matrix=[];
 for(const size of [14,21])for(const [width,height]of [[1920,1080],[1536,864]]) {
  const fixture=structuredClone(keep);fixture.customization.profiles.Default.settings.typography={font:'gothic',size};
  await s.open(fixture);p=s.page;await p.setViewportSize({width,height});await craft();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const font=await p.locator('#crafting_detail').evaluate(el=>({size:getComputedStyle(el).fontSize,family:getComputedStyle(el).fontFamily}));
  assert.equal(font.size,`${size}px`);await p.screenshot({path:join(out,`rendering-${width}-${size}.png`)});matrix.push({width,height,size,font});
 }
 // Actual HP panel signature: real begin/acquire/select, no truth injection.
 await s.open(null);p=s.page;await s.step(1);
 const hpOpen=async()=>{await p.locator('#workspace_navigation select').first().selectOption('hp-polyjuice');await p.locator('#hp_brewing').waitFor({state:'visible'});};
 await hpOpen();await p.locator('[data-hp-action="begin"]').click();
 await p.locator('[data-hp-select="ingredient"]').selectOption('book.hp.ing.bicorn_horn');
 await p.locator('[data-hp-select="route"]').selectOption('book.hp.route.trusted_supplier');
 await p.locator('[data-hp-action="acquire"]').click();const h=(await snap()).hp_brewing,lot=Object.keys(h.lots)[0];
 await p.locator('[data-hp-select="slot-bicorn"]').selectOption(lot);
 await p.evaluate(()=>{window.__m6HpNode=document.querySelector('[data-hp-assessment]');});
 await s.step(20);assert.equal(await p.evaluate(()=>window.__m6HpNode===document.querySelector('[data-hp-assessment]')),true,'unchanged observer projection skips content rebuild');
 const stateBefore=(await snap()).hp_brewing;
 await p.locator('[data-hp-assessment] > summary').click();await p.locator('[data-hp-evidence="bicorn"] > summary').click();
 assert.deepEqual((await snap()).hp_brewing,stateBefore,'evidence disclosure grants no facts, stock, coins, time or draws');
 await p.locator('[data-hp-select="slot-bicorn"]').selectOption('');
 assert.equal(await p.evaluate(()=>window.__m6HpNode===document.querySelector('[data-hp-assessment]')),false,'selection change invalidates the actual panel signature');
 checks.push('Actual HP begin/acquire/select:20 unchanged-visible-state ticks retain panel content; disclosure preserves HP state; changed selection invalidates content');
 await p.screenshot({path:join(out,'hp-query-invalidation-1920.png')});
 const bundle=await p.evaluate(()=>fetch('dist/bundle.js',{cache:'no-store'}).then(r=>r.text()));
 const bundleSha256=createHash('sha256').update(bundle).digest('hex');
 assert.equal(bundleSha256,createHash('sha256').update(await readFile(join(output,'dist/bundle.js'))).digest('hex'));
 assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'),[]);assert.deepEqual(missing,[]);
 await writeFile(join(out,'result.json'),JSON.stringify({status:'PASS',route:'named midgame cooking prerequisites; actual native actions; fresh earned HP begin/acquire; no normal profile',checks,matrix,bundleSha256,missing,pageErrors:s.errors.filter(e=>e.kind==='pageerror')},null,2));
 console.log(JSON.stringify({status:'PASS',checks,bundleSha256}));
}catch(error){await writeFile(join(out,'failure.txt'),error.stack);await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'errors.json'),JSON.stringify({errors:s.errors,missing},null,2));throw error;}
finally{await s.close();await server.close();}
