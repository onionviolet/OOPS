// Rebuilt native title journey on disposable fixtures and a fresh private origin.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave,diffSaves} from '../headless/runner.mjs';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/title-benefits-evidence');await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:10000});
const checks=[];let p;
const snapshot=()=>p.evaluate(()=>simulationTestHooks.snapshot());
async function play(){await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(250);}
async function titles(){await p.locator('#workspace_navigation select').first().selectOption('preparation');await p.locator('#character_show_bio').click();await p.locator('#titles_panel').evaluate(el=>el.open=true);}
async function roundtrip(){const before=await s.save();await p.reload();await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(before)),[]);const literal=await p.evaluate(()=>save_to_file()),exported=await s.save();await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(exported)),[]);await titles();assert.doesNotMatch(await p.locator('#message_log_div').innerText(),/Title earned:|Titles recognized from your past:/);assert.equal(await p.locator('#titles_panel .native-discovery-cancel').isVisible(),false);}
try{
 await s.start();const fixture=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
 delete fixture.availabilities.recipe.undefined;fixture['current location']='Shack';fixture.availabilities.location.Shack=1;fixture.locations.Shack={...fixture.locations.Shack,housing_unlocked:true};
 // Only counter proximity and access are seeded. Native played minutes earn the title.
 fixture.absorb_local_life.homeMinutes=59;fixture.enemy_killcount={};
 fixture.levels.person.main_character.skill_xp.Sleeping=20;fixture.levels.person.main_character.skill_xp.Cooking=200;
 fixture.character.titles={};
 await s.open(fixture);p=s.page;await titles();
 assert.match(await p.locator('[data-title-id="hunter"]').innerText(),/Benefit when earned: \+2% Combat xp/);
 assert.match(await p.locator('[data-title-id="slayer"]').innerText(),/Benefit when earned/);
 await s.step(2);await p.waitForTimeout(2200);
 assert.ok((await snapshot()).character.titles.quiet_hour);checks.push('Native Shack stay crosses 59 to 60, earning quiet_hour without auto-selection');
 let select=p.getByRole('combobox',{name:'Worn title'});assert.equal(await select.isDisabled(),true);
 await p.locator('#titles_panel input[type=checkbox]').check();await select.selectOption('quiet_hour');
 assert.match(await p.locator('[data-worn-status]').innerText(),/Requires 3 known titles/);
 const base=await s.save();base.absorb_local_life.itemsBought=25;base.enemy_killcount={'Wolf rat':100};await s.open(base);p=s.page;await titles();
 assert.match(await p.locator('[data-worn-status]').innerText(),/Worn benefit active: \+2% Sleeping xp/);
 const active=await s.save(),trained=active.levels.person.main_character.skill_xp.Cooking;
 await p.locator('#center_mode_back').click();await p.locator('#start_sleeping_div').click();const a=await snapshot();await s.step(2);const b=await snapshot();const boosted=b.levels.person.main_character.skill_xp.Sleeping-a.levels.person.main_character.skill_xp.Sleeping;
 const sleeping=await s.save();await titles();await p.locator('#titles_panel input[type=checkbox]').uncheck();assert.match(await p.locator('[data-worn-status]').innerText(),/Wearing is off/);
 assert.equal((await snapshot()).levels.person.main_character.skill_xp.Cooking,trained);
 // Compare actual ordinary Sleeping XP with exactly the same starting save.
 const control=structuredClone(sleeping);control.character.long_life_worn.enabled=false;await s.open(control);p=s.page;const c=await snapshot();await s.step(2);const d=await snapshot();const plain=d.levels.person.main_character.skill_xp.Sleeping-c.levels.person.main_character.skill_xp.Sleeping;
 assert.ok(Math.abs(boosted-2*Math.round(plain/2*1.02*100)/100)<1e-7,JSON.stringify({boosted,plain}));checks.push('Ordinary sleeping applies +2% through native per-tick XP rounding; switching off retains trained Cooking XP');
 await s.open(active);p=s.page;await titles();select=p.getByRole('combobox',{name:'Worn title'});await select.selectOption('hunter');
 assert.match(await p.locator('[data-worn-status]').innerText(),/no additional worn benefit/);await roundtrip();
 assert.equal(await p.getByRole('combobox',{name:'Worn title'}).inputValue(),'hunter');assert.match(await p.locator('[data-title-id="hunter"]').innerText(),/Held benefit active/);
 checks.push('Valid nonpayoff worn identity survives Save/reload/Export/literal Import with held bonus intact');
 await p.getByRole('combobox',{name:'Worn title'}).selectOption('');assert.match(await p.locator('[data-worn-status]').innerText(),/Choose a held title/);
 await p.getByRole('combobox',{name:'Worn title'}).selectOption('quiet_hour');await roundtrip();
 const inspectBefore=await s.save();await p.locator('[data-title-id="quiet_hour"]').hover();await p.getByRole('combobox',{name:'Worn title'}).focus();await p.waitForTimeout(2200);assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(inspectBefore)),[]);
 checks.push('Active selection persists without repeated grant; paused hover/focus/rerender do not change save');
 for(const size of [14,21]){const view=await s.save();view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);p=s.page;await titles();await p.locator('#titles_panel').scrollIntoViewIfNeeded();const actual=await p.locator('#titles_panel').evaluate(el=>getComputedStyle(el).fontSize);assert.equal(actual,`${size}px`);await p.getByRole('combobox',{name:'Worn title'}).scrollIntoViewIfNeeded();assert.equal(await p.locator('[data-worn-status]').isVisible(),true);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:join(out,`titles-${size}.png`)});}
 checks.push('1920×1080: computed 14px and 21px title text, no document overflow');
 assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'),[]);await writeFile(join(out,'receipt.json'),JSON.stringify({checks,errors:s.errors,boosted,plain,setup:'Disposable mid fixture; seeded native counter proximity, enemy history, stock history, access and skill XP. No personal saves.'},null,2));console.log(JSON.stringify({checks,out}));
}catch(error){await writeFile(join(out,'failure.txt'),error.stack);await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw error;}finally{await s.close();await server.close();}
