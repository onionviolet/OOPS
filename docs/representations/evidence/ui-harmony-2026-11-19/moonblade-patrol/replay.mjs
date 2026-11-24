import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {Session} from '../../../../../scripts/playtest/lib.mjs';
const require=createRequire(import.meta.url),{serveCheckout,openPanel}=require('../../../../../scripts/fixture_browser.cjs');
const root=process.cwd(),out=root+'/docs/representations/evidence/ui-harmony-2026-11-19/moonblade-patrol';
const server=await serveCheckout(root+'/.lane-builds/moonblade-patrol');
const s=await new Session({url:server.base+'/?test_hooks=1',seed:7,wall:Date.UTC(2026,10,20),opTimeout:12000}).start();
const checkpoint=JSON.parse(await readFile(root+'/docs/research/novels/reverend-insanity/private/fang-yuan-moonglow-evidence/completed-checkpoint.json','utf8'));
const report={bundle:createHash('sha256').update(await readFile(root+'/.lane-builds/moonblade-patrol/dist/bundle.js')).digest('hex'),route:'Earned ri-fang-yuan-moonglow checkpoint, unchanged inventory/feed history; ordinary-day extension adopted by click',checks:[]};
const key=id=>JSON.stringify({id}),item=(v,id)=>v.inventories.person.main_character[key(id)]?.count||0;
const quantities=v=>({essence:v.expansion.simulation.energies.player['book.ri.lead.primeval']?.reserve,petals:item(v,'book.ri.lead.dorm.petals'),stones:item(v,'book.ri.lead.refinement.primeval_stone'),eye:item(v,'book.ri.lead.ear_grass.cached_wolf_eyes'),pelt:item(v,'book.ri.lead.day.wolf_pelt'),merit:item(v,'book.ri.lead.ear_grass.merit')});
try{
await s.open(checkpoint);let p=s.page;
const shot=async n=>{await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out+'/'+n+'.png'});};
const action=async n=>{await openPanel(p,'beginning');const b=p.locator(`[data-structured-action="book.ri.lead.day.${n}"]`);for(const d of await b.locator('xpath=ancestor::details').all()){if(!await d.evaluate(x=>x.open))await d.locator(':scope > summary').click();} await b.click();};
const opener=async()=>{await openPanel(p,'notebook');await p.waitForTimeout(100);await p.locator('[data-notebook-view="people"]').click();const d=p.locator('#tempo_fight_panel');if(!await d.evaluate(x=>x.open))await d.locator('summary').click();await p.locator('[data-tempo="open:ri.wolf.tide"]').click();await p.locator('#fight_situation').waitFor();};
const move=async id=>{await p.locator(`#fight_situation [data-fight-option="${id}"]`).click();};
await openPanel(p,'beginning');await p.locator('[data-structured-extension="book.ri.lead.day"]').click();
await p.waitForTimeout(600);
await opener();assert.equal(await p.locator('[data-fight-option="moonblade"]').isDisabled(),true);await shot('hungry-fight');
await move('jab');console.log('hungry after jab',await p.locator('#fight_situation').innerText());
await move('withdraw');console.log('hungry after withdraw',await p.locator('#fight_situation').innerText());await shot('hungry-exit');
report.hungryAfter=quantities(await s.save());report.checks.push('Hungry Moonblade blocked; ordinary jab and withdraw clicked');
// Restore only the earned route plus its ordinarily adopted extension. Separate fresh browser context.
await s.open(checkpoint);p=s.page;await openPanel(p,'beginning');await p.locator('[data-structured-extension="book.ri.lead.day"]').click();
await action('buy_petals');await s.step(20);report.afterBuy=quantities(await s.save());
await action('feed_moonglow');report.afterFeed=quantities(await s.save());await shot('fed-day');
console.log('fed quantities',report.afterFeed);
await action('patrol');await s.step(180);await action('report');
console.log('report state',JSON.stringify((await s.save()).expansion.simulation.knowledge.player['book.ri.lead.day.patrol']));
const patrolSave=await s.save();report.afterPatrol=quantities(patrolSave);await shot('patrol-report');await s.open(patrolSave);p=s.page;
await opener();console.log('fed fight',await p.locator('#fight_situation').innerText());await shot('fed-fight');assert.match(await p.locator('[data-fight-option="jab"]').innerText(),/3 beats/);assert.match(await p.locator('[data-fight-option="moonblade"]').innerText(),/5 beats.*4 essence/);
report.fedStart=quantities(await s.save());
await move('moonblade');const during=await s.save();report.firstCast={ordinaryReserve:quantities(during).essence,liveEssence:during.expansion.simulation.sessions.player.nativeBattle.fighters.player.means.essence};assert.equal(report.firstCast.liveEssence,report.fedStart.essence-4);console.log('fed after blade',await p.locator('#fight_situation').innerText());await shot('fed-spend');
for(let i=0;i<12;i++){const b=p.locator('[data-fight-option="moonblade"]');if(!await b.count()||!await b.isVisible()||!await b.isEnabled())break;await b.click();}
console.log('end',await p.locator('#fight_situation').innerText());
console.log('buttons',await p.locator('#fight_situation button').evaluateAll(xs=>xs.map(x=>({text:x.textContent,data:{...x.dataset}}))));
const ended=await s.save();report.fedEnd=quantities(ended);report.account=ended.expansion.actors.player.facts['tempo.lastAccount'];await shot('fed-aftermath');
assert.equal(report.afterBuy.stones,653);assert.equal(report.afterBuy.petals,18);assert.equal(report.afterFeed.petals,16);
assert.equal(report.fedEnd.essence,10);assert.equal(report.fedEnd.eye,2);assert.equal(report.fedEnd.merit,0);
await action('hand_in_eye');await s.step(10);report.afterBoard=quantities(await s.save());assert.equal(report.afterBoard.eye,1);assert.equal(report.afterBoard.merit,10);
await action('sell_pelt');await s.step(15);report.afterHideSale=quantities(await s.save());assert.equal(report.afterHideSale.pelt,1);assert.equal(report.afterHideSale.stones,654);
await action('sell_meat');await s.step(15);report.afterMeatSale=quantities(await s.save());assert.equal(report.afterMeatSale.stones,655);await shot('board-and-stalls');
report.checks.push('One stone bought ten petals; feeding consumed two; compressed patrol returned parts and wound; three fed Moonblades spent 12 essence; kill added parts without merit; board consumed eye for ten merit; hide and meat each sold for one stone.');

report.errors=s.errors;await writeFile(out+'/report.json',JSON.stringify(report,null,2));
}catch(e){await s.page.screenshot({path:out+'/failure.png'});throw e;}finally{await s.close();server.close();}
