// Cheat growth, skins, voice: fresh native origin at 1920x1080, then Save/reload/Export/literal Import.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {seedBeginningCheats,awakenCheats,defaultCheatState} from '../../src/cheat_cards.js';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/oops-cheat-growth');await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,30),opTimeout:12000});
let p;const checks=[];
try{
 await s.start();
 const f=JSON.parse(await readFile('tests/fixtures/perf/mid.json'));delete f.availabilities.recipe.undefined;delete f.availabilities.recipe['recipe/undefined'];
 f.cheats=awakenCheats(seedBeginningCheats(defaultCheatState(),{choice:'system-quests',at:f['current time']}),{dayCount:3,at:f['current time']}).state;
 f.levels.person.main_character.skill_xp.Crafting=50;
 const replay=async()=>{await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();};
 const openPanel=async()=>{await p.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('cheat-faculty');await p.getByRole('button',{name:'Explore your continuing insight'}).click();await p.locator('#cheat_faculty_view').waitFor({state:'visible'});};
 await s.open(f);p=s.page;await openPanel();
 const growth=p.locator('[data-cheat-growth]');
 assert.match(await growth.innerText(),/Mark · Faint/);assert.equal(await growth.getAttribute('data-cheat-kind'),'mark');
 assert.equal(await p.locator('[data-cheat-companion="system-quests"]').getAttribute('data-cheat-kind'),'hologram');
 assert.equal(await p.locator('[data-cheat-voice="reliable"]').count(),1);
 // Actual controls: retain two lived insights, develop one facet.
 for(const label of [/Recognize/i,/Learn through crafting/i]){await p.locator('#cheat_faculty_view p',{hasText:label}).getByRole('button',{name:'Retain insight'}).click();}
 await p.getByRole('button',{name:/Explore the next facet/}).first().click();
 const text=await growth.innerText();assert.match(text,/Steady/);assert.match(text,/True Appraisal/);assert.match(text,/Undiscovered facet/);assert.match(text,/\+\d not yet understood/);
 await p.screenshot({path:out+'/growth-1920x1080.png'});
 const before=await s.save();checks.push('opened, claimed 2, developed 1');
 await p.reload();await replay();await openPanel();assert.deepEqual((await s.save()).cheats,before.cheats);assert.match(await growth.innerText(),/Steady/);checks.push('reload keeps track');
 const literal=await p.evaluate(()=>save_to_file());const saved=await s.save();
 await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await replay();await openPanel();
 assert.deepEqual((await s.save()).cheats,saved.cheats);assert.match(await growth.innerText(),/Steady/);checks.push('literal Import keeps track');
 await p.screenshot({path:out+'/growth-after-import-1920x1080.png'});
 assert.deepEqual(s.errors,[]);console.log(JSON.stringify({ok:true,checks,out}));
}finally{await s.close();server.close();}
