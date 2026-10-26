// Named controlled-comparison fixture: same acquired setup as fine journey,
// with only the projected-visible bicorn preparation changed to coarse.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session, serve} from './lib.mjs';
const out=resolve(process.argv[2]); await mkdir(out,{recursive:true});
const fixture=JSON.parse(await readFile(resolve(out,'../fine/prepared.save.json'),'utf8'));
const hp=fixture.hp_brewing;
const horn=Object.values(hp.lots).find(l=>l.ingredient==='book.hp.ing.bicorn_horn');
horn.variant='book.hp.prep.powder_coarse';
await writeFile(join(out,'coarse-prepared.fixture.json'),JSON.stringify(fixture));
const server=await serve(resolve('m4-build/dist'));
const s=new Session({url:server.url,seed:21,wall:Date.UTC(2026,9,22),opTimeout:15000});let p;
const open=async()=>{await p.locator('#workspace_navigation select').first().selectOption('hp-polyjuice');await p.locator('#hp_brewing').waitFor({state:'visible'});};
const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();};
const pick=async(id,value)=>{await p.locator(`[data-hp-select="${id}"]`).selectOption(value);};
const save=async()=> (await s.save()).hp_brewing;
try{
 await s.start();await s.open(fixture);p=s.page;await open();
 for(const [slot,ingredient]of [['lacewing','lacewing_flies'],['leeches','leeches'],['fluxweed','fluxweed'],['knotgrass','knotgrass'],['bicorn','bicorn_horn'],['boomslang','boomslang_skin']]){
  const lot=Object.values(hp.lots).find(l=>l.ingredient===`book.hp.ing.${ingredient}`&&!l.stew);
  await pick(`slot-${slot}`,lot.id);
 }
 const before=JSON.stringify(await save());
 const assessment=p.locator('[data-hp-assessment]');assert.equal(await assessment.getAttribute('data-hp-assessment'),'deviation');
 await assessment.locator(':scope > summary').click();
 const lace=p.locator('[data-hp-evidence="lacewing"]');await lace.locator(':scope > summary').click();
 assert.match(await lace.innerText(),/Stewing duration: not verified/);assert.match(await lace.innerText(),/claim \(Held lot/);
 assert.equal(JSON.stringify(await save()),before,'opening causal inspector changes no lot, purse, clock, draw or knowledge');
 await lace.scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'causal-evidence-1920.png')});
 await p.locator('[data-hp-action="brew"]').click();
 assert.equal(await p.locator('[data-hp-action="brew"]').isDisabled(),true);
 await s.step(1440);await s.step(1445);await p.waitForTimeout(100);
 const ready=await save(),batch=Object.values(ready.batches)[0];assert.equal(batch.grade,'degraded');
 await p.locator('[data-hp-action="sample-ask"]').first().click();
 const sampled=await save();await pick('batch',batch.id);await pick('sample',Object.keys(sampled.samples)[0]);
 await p.locator('[data-hp-action="drink"]').click();
 const used=await save(),duration=used.effect.endsAt-used.effect.startedAt;assert.equal(duration,30);assert.equal(used.batches[batch.id].dosesLeft,2);assert.equal(Object.keys(used.samples).length,0);
 const fine=JSON.parse(await readFile(resolve(out,'../fine/receipt.json'),'utf8'));assert.equal(fine.duration,60);
 const kept=JSON.stringify(used);await p.reload();await play();await open();assert.equal(JSON.stringify(await save()),kept);
 const literal=await p.evaluate(()=>save_to_file());await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await play();await open();assert.equal(JSON.stringify(await save()),kept);
 const errors=s.errors.filter(e=>!(e.kind==='console'&&/status of 404/.test(e.text)));assert.deepEqual(errors,[]);
 await writeFile(join(out,'receipt.json'),JSON.stringify({route:'named controlled comparison fixture, derived from fine ordinary acquired setup; one preparation variant changed synthetically',changed:'fine -> coarse bicorn powder',fineDuration:fine.duration,coarseDuration:duration,inspectorPure:true,staleBrewRefused:true,dosesLeft:2,persistence:'Save/reload/Export/literal Import exact slice',errors},null,2));
 console.log('Coarse comparison, expanded causal inspector, real dose and literal persistence PASS.');
}catch(error){await writeFile(join(out,'failure.txt'),error.stack);await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw error;}
finally{await s.close();server.close();}
