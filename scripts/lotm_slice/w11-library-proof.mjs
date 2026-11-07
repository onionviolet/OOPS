// W11-C/D desktop consumer sample, using the closure runner's generated, private synthetic origin.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {resolve,join} from 'node:path';
import {Session,serve} from '../playtest/lib.mjs';
const out=resolve('work/w11-closure'),server=await serve(resolve('.lane-builds/wave11-closure/dist'));
const session=await new Session({url:server.url,seed:7,wall:Date.UTC(2026,10,7),opTimeout:120000}).start();
const result={route:'fixture(Tingen reading room)',viewport:'1920x1080'};
try{
 const save=JSON.parse(await fs.readFile(join(out,'private-origin.json'),'utf8'));save['current location']='Tingen university area';save.expansion.simulation.people.player.location='Tingen university area';
 await session.open(save);await session.page.locator('#workspace_navigation select').selectOption('lotm');
 const button=session.page.locator('[data-lotm="library_study"]');assert.equal(await button.isDisabled(),false);
 for(let i=0;i<2;i++)await button.click();
 const kept=await session.page.evaluate(()=>simulationTestHooks.snapshot());
 result.minutes=kept.expansion.clock-save.expansion.clock;assert.equal(result.minutes,120);
 result.stage=kept.expansion.simulation.knowledge.player['study.lotm.tingen_papers.writeup']?.stage;assert.equal(result.stage,'understood');
 assert.match(await session.page.locator('[data-lotm-library]').innerText(),/You have read the city papers/);
 await session.page.screenshot({path:join(out,'03-library.png')});
 await session.open(kept);result.reload=await session.page.evaluate(()=>simulationTestHooks.snapshot().expansion.simulation.knowledge.player['study.lotm.tingen_papers.writeup']?.stage);assert.equal(result.reload,'understood');
 result.errors=session.errors;assert.deepEqual(result.errors,[]);result.ok=true;
}catch(e){result.ok=false;result.error=String(e.stack||e);}finally{await session.close();await server.close();}
await fs.writeFile(join(out,'library-result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exit(result.ok?0:1);
