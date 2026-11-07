// Headless desktop fixture proof. A fresh origin with synthetic goods, arrears and a finished arrest encounter.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {Session,serve} from '../playtest/lib.mjs';
import {freshDuties} from '../../src/recurring_duties.js';
import {LOTM_RENT} from '../../src/book_world_lotm_duties.js';
const root=resolve(process.env.W11_BUNDLE||'.lane-builds/wave11-closure/dist'),out=resolve('work/w11-closure');await fs.mkdir(out,{recursive:true});
const server=await serve(root),session=await new Session({url:server.url,seed:7,wall:Date.UTC(2026,10,7),opTimeout:120000,hooks:{beforeOpen:async c=>c.on('response',r=>{if(r.status()===404)console.log('asset missing: '+new URL(r.url()).pathname);})}}).start();
const result={viewport:'1920x1080',route:'synthetic fixture in rebuilt native browser'};
const key=JSON.stringify({id:'Tingen ordinary comparator sample'}),rent=LOTM_RENT[0].id;
const snapshot=()=>session.page.evaluate(()=>simulationTestHooks.snapshot());
const projection=id=>session.page.evaluate(id=>simulationTestHooks.project(id),id);
try{
 console.log('stage: fresh');await session.open();await session.page.evaluate(()=>simulationTestHooks.command('lotm','enrollBeFresh'));
 const origin=await snapshot();await fs.writeFile(join(out,'private-origin.json'),JSON.stringify(origin));
 const fixture=structuredClone(origin);fixture.inventories.person.main_character[key]={count:400};
 fixture.duties=freshDuties();fixture.duties.missed[rent]=6;fixture.duties.policy[rent]='skip';
 console.log('stage: seizure fixture');await session.open(fixture);
 // A single played tick settles the already-owed seizure through the real host publisher.
 await session.step(1);
 const seized=await snapshot();result.seizure={remaining:seized.inventories.person.main_character[key]?.count??0,missed:seized.duties.missed[rent],kind:seized.duties.last?.[rent]?.kind};
 assert.equal(result.seizure.remaining,40);assert.equal(result.seizure.missed,0);assert.equal(result.seizure.kind,'seizure');
 await session.page.locator('#workspace_navigation select').selectOption('lotm');
 await session.page.locator('#lotm_panel').waitFor({state:'visible'});await session.page.screenshot({path:join(out,'01-seizure.png')});
 // Reload and literal export/import retain the debit and its receipt.
 console.log('stage: seizure reload');await session.open(seized);const afterReload=await snapshot();assert.equal(afterReload.inventories.person.main_character[key]?.count,40);
 const exported=await session.page.evaluate(()=>save_to_file());assert.equal(typeof exported,'string');
 console.log('stage: seizure import');await session.page.evaluate(encoded=>load_progress(encoded),exported);await session.page.waitForLoadState('domcontentloaded');
 await session.page.waitForFunction(()=>!!window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
 await session.page.evaluate(()=>simulationTestHooks.pause());await session.page.locator('#loading_screen_play_button').click({force:true});
 const imported=await snapshot();assert.equal(imported.inventories.person.main_character[key]?.count,40);assert.equal(imported.duties.last[rent].kind,'seizure');result.seizure.persistence='reload and literal export/import';
 // An authored fixture of a just-committed yield lets the normal opener reader resolve the arrest.
 const arrest=structuredClone(origin);arrest.expansion.simulation.log.push({at:arrest.expansion.clock,cause:'w11.fixture.arrest',text:'Constables at the door: yielded.'});
 console.log('stage: arrest fixture');await session.open(arrest);await projection('tempo_fight');
 await session.page.waitForFunction(()=>simulationTestHooks.project('constables').arrests===1&&simulationTestHooks.project('constables').sentence===null,null,{timeout:60000});
 const served=await snapshot();result.jail={minutes:served.expansion.clock-arrest.expansion.clock,arrests:served.constables.arrests,remaining:served.constables.sentence};
 assert.equal(result.jail.minutes,720);assert.equal(result.jail.arrests,1);
 await session.page.locator('#workspace_navigation select').selectOption('lotm');await session.page.locator('#lotm_panel').waitFor({state:'visible'});await session.page.screenshot({path:join(out,'02-after-jail.png')});
 console.log('stage: jail reload');await session.open(served);await projection('tempo_fight');const kept=await snapshot();assert.equal(kept.expansion.clock,served.expansion.clock);assert.equal(kept.constables.arrests,1);result.jail.reload='no repeated night';
 console.log('stage: jail import');const literal=await session.page.evaluate(()=>save_to_file());await session.page.evaluate(e=>load_progress(e),literal);await session.page.waitForLoadState('domcontentloaded');
 await session.page.waitForFunction(()=>!!window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});await session.page.evaluate(()=>simulationTestHooks.pause());await session.page.locator('#loading_screen_play_button').click({force:true});await projection('tempo_fight');
 const keptImport=await snapshot();assert.equal(keptImport.expansion.clock,served.expansion.clock);assert.equal(keptImport.constables.sentence,null);result.jail.import='no repeated night';
 result.errors=session.errors;assert.deepEqual(result.errors,[]);result.ok=true;
}catch(e){result.ok=false;result.errors=session.errors;result.error=String(e.stack||e);}
finally{await session.close();await server.close();}
await fs.writeFile(join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exit(result.ok?0:1);
