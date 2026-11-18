// Return to the mark (XG6, rewind kit): headless Chrome, 1920x1080, fresh origin. Mark, then two people form memories of the player,
// then Return: the player's memory stays, the other person's goes with the world and leaves a familiar feeling, the inspector line
// says so; then save, reload, literal Export/Import. Usage: node scripts/playtest/rewind-browser.mjs [outDir]   (needs `npm run build`)
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=path.resolve('.'),out=path.resolve(process.argv[2]||'/tmp/yairpg-rewind-proof');await fs.mkdir(out,{recursive:true});
const server=await serve(root);
const s=await new Session({url:server.url+'?test_hooks=1',opTimeout:20000,seed:7,wall:Date.UTC(2026,10,18),hooks:{beforeOpen:async c=>c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}}).start();
const log=[],line=(k,v)=>{log.push(`${k}: ${v}`);console.log(`${k}: ${v}`);};
const receipt={bundleSha256:createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex'),viewport:'1920x1080',route:'fresh origin, native button clicks, memory written through the registry command'};
const ep=(about,fact)=>({kind:'helped',about,fact,source:'saw',certainty:90,feeling:40,day:0,count:1});
const holders=sv=>Object.keys(sv.memory?.holders||{}).sort();
try{
 await s.open();const p=s.page;
 await p.locator('#workspace_navigation select').selectOption('rewind');
 await p.locator('#rewind_panel').waitFor({state:'visible'});
 line('panel before a mark',(await p.locator('#rewind_panel [role=status]').innerText()));
 await p.locator('#rewind_panel button',{hasText:'Set the mark here'}).click();
 await p.evaluate(({a,b})=>{const r=window.__rewind.registry.command('memory','remember');r('player',a,{});r('rowan',b,{});},{a:ep('person.rowan','fact.shared_a_meal'),b:ep('person.player','fact.shared_a_meal')});
 let sv=await s.save();assert.deepEqual(holders(sv),['player','rowan']);line('before the return','memory held by '+holders(sv).join(', '));
 await p.evaluate(()=>window.__rewind.registry.refresh());
 await p.locator('#rewind_panel button',{hasText:'Return to the mark'}).click();await p.waitForTimeout(200);
 const lines=await p.locator('#rewind_panel ul[aria-label="What the rewind did"] li').allInnerTexts();line('inspector',lines.join(' | '));line('status',await p.locator('#rewind_panel [role=status]').innerText());
 assert.ok(lines.some(l=>/Came back to how it was/.test(l)),'came back line');assert.ok(lines.some(l=>/rowan: feels it was familiar/.test(l)),'rowan line');
 sv=await s.save();assert.deepEqual(holders(sv),['player']);line('after the return','memory held by '+holders(sv).join(', ')+' (rowan forgot, the player kept theirs)');
 const echo=await p.locator('#rewind_panel ul[aria-label="Who half-remembers"] li').allInnerTexts();line('echoes',echo.join(' | '));assert.match(echo.join(),/rowan felt it was familiar/);
 const q=await p.locator('#rewind_panel [role=status]').innerText();line('status after',q);assert.match(q,/Ready again/);
 assert.equal(await p.locator('#rewind_panel button',{hasText:'Return to the mark'}).isDisabled(),true);
 await p.screenshot({path:path.join(out,'01-after-return.png')});
 const saved=await s.save();assert.ok(saved.rewind,'rewind slice saved');
 await p.reload();await p.waitForFunction(()=>window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
 await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click({force:true});await p.waitForTimeout(400);
 let r=await s.save();assert.deepEqual([r.memory,r.rewind.echoes],[saved.memory,saved.rewind.echoes]);line('reload','memory and echoes identical');
 const encoded=await p.evaluate(()=>window.save_to_file());const file=path.join(out,'export.txt');await fs.writeFile(file,encoded);
 await s.open();
 await Promise.all([s.page.waitForNavigation({waitUntil:'domcontentloaded'}),s.page.locator('#saved_file_input').setInputFiles(file)]);
 await s.page.waitForFunction(()=>window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
 await s.page.evaluate(()=>simulationTestHooks.pause());await s.page.locator('#loading_screen_play_button').click({force:true});await s.page.waitForTimeout(400);
 r=await s.save();assert.deepEqual([r.memory,r.rewind.echoes],[saved.memory,saved.rewind.echoes]);line('import','fresh origin, literal Export/Import, identical');
 receipt.pageErrors=s.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(receipt.pageErrors,[]);receipt.consoleErrors=s.errors.filter(e=>e.kind==='console').map(e=>e.text.slice(0,160));
}catch(e){receipt.error=e.stack;console.error(e.stack);process.exitCode=1;await s.page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
finally{receipt.log=log;await fs.writeFile(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2));await s.close();server.close();}
