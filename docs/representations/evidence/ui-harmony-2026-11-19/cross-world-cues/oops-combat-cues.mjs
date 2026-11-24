import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {buildBundle,serve,Session,sha} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/playtest/lib.mjs';
import {buildWorldFixture} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/headless/world_fixtures.mjs';
const tag=process.argv[2]||'before',out='/tmp/oops-combat-cues/'+tag;await mkdir(out,{recursive:true});
const fixture=async name=>{const path='/tmp/oops-combat-cues/'+name+'.json';try{return JSON.parse(await readFile(path,'utf8'));}catch{const save=JSON.parse(await buildWorldFixture(name,{seed:7}));await writeFile(path,JSON.stringify(save));return save;}};
const ri=await fixture('ri-fang-yuan-wild-gu');
const {boot}=await import('/Users/weiwei/code/yet-another-idle-rpg/scripts/headless/runner.mjs');
let lotm;try{lotm=JSON.parse(await readFile('/tmp/oops-combat-cues/lotm-fresh-start.json','utf8'));}catch{const g=await boot(null,{seed:7});try{await g.fill('#workspace_navigation select[aria-label="Other known panels"]','lotm');await g.click('[data-lotm="pick_be"]');await g.click('[data-lotm="enroll_be"]');lotm=g.snapshot();await writeFile('/tmp/oops-combat-cues/lotm-fresh-start.json',JSON.stringify(lotm));}finally{g.close();}}
for(const id of ['book.ri.lead.moonglow.moonglow_gu','book.ri.lead.river_toad.refined_black_boar_gu'])ri.inventories.person.main_character[JSON.stringify({id})]={count:1};
const bundle=await buildBundle(),server=await serve(bundle.dir),report={tag,bundle:sha(await readFile(bundle.dir+'/bundle.js')),origin:server.url,ri:{},lotm:{}};
const s=await new Session({url:server.url,seed:7,wall:Date.UTC(2026,10,20)}).start();
let p;
const pause=()=>p.waitForTimeout(500);
const openFight=async id=>{const opener=p.locator(`[data-tempo="open:${id}"]`);if(!await opener.first().isVisible()){const nb=p.locator('[data-panel-path="notebook"]:visible').first();if(await nb.count())await nb.click();await p.evaluate(()=>{const n=document.getElementById('tempo_fight_panel');if(n instanceof HTMLDetailsElement)n.open=true;});}await opener.first().dispatchEvent('click');await p.locator('#fight_situation[data-fight-mode="tempo"]').waitFor();await pause();};
const current=()=>p.evaluate(()=>window.simulationTestHooks.snapshot().expansion.simulation.sessions.player?.nativeBattle);
try{
 await s.open(ri);p=s.page;await openFight('ri.wolf.tide');
 const more=p.locator('#fight_situation summary').filter({hasText:/(?:More|Other) moves/});if(await more.count())await more.click();
 const blade=p.locator('#fight_situation [data-fight-option="moonblade"]');assert(await blade.isDisabled());
 await blade.locator('..').focus();await pause();
 report.ri.blocked={label:await blade.innerText(),reason:await blade.locator('..').innerText(),preview:await p.locator('.fight-move-preview').innerText()};
 await p.screenshot({path:out+'/ri-blocked.png'});
 await p.locator('#fight_situation [data-fight-option="boar_fist"]').click();await p.waitForTimeout(1200);
 const b=await current();report.ri.spent={fight:b.fighters.player.means.essence,status:await p.locator('[data-status-slot="reserve"]').innerText(),log:b.log};
 assert.equal(b.fighters.player.means.essence,43);assert.match(report.ri.spent.status,/43\/44/);await p.screenshot({path:out+'/ri-spent.png'});
 await s.open(lotm);p=s.page;await openFight('lotm.lane.knife');
 report.lotm.before={stakes:(await current()).stakes,card:await p.locator('#fight_situation').innerText()};await p.screenshot({path:out+'/tingen-before.png'});
 for(let i=0;i<12;i++){const b=await current();if(!b||b.result||b.stakes?.cue)break;const jab=p.locator('#fight_situation [data-fight-option="jab"]');if(!await jab.isVisible())break;await jab.click();await pause();}
 const end=await current();report.lotm.after={stakes:end?.stakes,card:await p.locator('#fight_situation').innerText(),cueVisible:await p.locator('[data-fight-cue]').isVisible(),log:end?.log};
 assert.ok(end?.stakes?.cue,'the played fight must produce a shift');
 if(tag==='after')assert(await p.locator('[data-fight-cue]').isVisible(),'the escalation reason must be visible with its settings folded');
 await p.screenshot({path:out+'/tingen-after.png'});
 report.pageerrors=s.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(report.pageerrors,[]);report.status='PASS';
}catch(e){report.status='FAIL';report.error=e.stack;if(p)await p.screenshot({path:out+'/failure.png'});throw e;}
finally{await writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await s.close();server.close();await bundle.dispose();}
