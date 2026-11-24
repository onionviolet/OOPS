import {readFile, mkdir, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {buildBundle, serve, Session, sha} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/playtest/lib.mjs';
import {buildWorldFixture} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/headless/world_fixtures.mjs';
const out = '/tmp/oops-essence-proof';
await mkdir(out, {recursive:true});
const save = JSON.parse(await buildWorldFixture('ri-fang-yuan-wild-gu', {seed:7}));
for (const id of ['book.ri.lead.moonglow.moonglow_gu','book.ri.lead.river_toad.refined_black_boar_gu']) save.inventories.person.main_character[JSON.stringify({id})] = {count:1};
const bundle = await buildBundle(), server = await serve(bundle.dir);
const report = {bundle:sha(await readFile(bundle.dir+'/bundle.js')), origin:server.url, fixture:'ri-fang-yuan-wild-gu plus Moonglow and Black Boar Gu (composed)', steps:[]};
const s = await new Session({url:server.url,seed:7,wall:Date.UTC(2026,10,20)}).start();
try {
 await s.open(save);
 const p=s.page;
 const snapshot = async label => {
  await p.waitForTimeout(1200);
  const row=await p.evaluate(()=>{const x=window.simulationTestHooks.snapshot().expansion;const b=x.simulation.sessions.player?.nativeBattle;return {text:document.querySelector('[data-status-slot="reserve"]')?.textContent,pool:x.simulation.energies.player['book.ri.lead.primeval'].reserve,live:b?.fighters.player.means?.essence,result:b?.result};});
  report.steps.push({label,...row});return row;
 };
 const before=await snapshot('outside');assert.match(before.text,/44\/44/);
 const opener=p.locator('[data-tempo="open:ri.wolf.tide"]');
 if(!await opener.first().isVisible()) {const nb=p.locator('[data-panel-path="notebook"]:visible').first();if(await nb.count())await nb.click();await p.evaluate(()=>{const n=document.getElementById('tempo_fight_panel');if(n instanceof HTMLDetailsElement)n.open=true;});}
 await opener.first().dispatchEvent('click');
 await p.locator('#fight_situation[data-fight-mode="tempo"]').waitFor();
 
 const more=p.locator('#fight_situation summary').filter({hasText:/(?:More|Other) moves/}); if(await more.count()) await more.click();
 await p.locator('#fight_situation [data-fight-option="boar_fist"]').click();
 const spent=await snapshot('spent');assert.equal(spent.live,43);assert.equal(spent.pool,44);assert.match(spent.text,/43\/44/);
 await p.screenshot({path:out+'/spent-1920.png'});
 const exit=p.locator('#fight_situation [data-fight-option="withdraw"]');
 for(let i=0;i<12;i++) {if(!await exit.count())break;await exit.click();await p.waitForTimeout(100);const x=await p.evaluate(()=>window.simulationTestHooks.snapshot().expansion.simulation.sessions.player?.nativeBattle);if(!x || x.result)break;}
 const exited=await snapshot('exit');assert.ok(exited.live==null || exited.result);assert.match(exited.text,new RegExp(`${exited.pool}/44`));assert.equal(exited.pool,43);
 await p.screenshot({path:out+'/exit-1920.png'});
 report.pageerrors=s.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(report.pageerrors,[]);
 console.log(JSON.stringify(report,null,2));
 await writeFile(out+'/report.json',JSON.stringify(report,null,2));
} finally {await s.close();server.close();await bundle.dispose();}
