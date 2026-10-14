const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='http://127.0.0.1:18834/',dir=__dirname,checkpoint=JSON.parse(fs.readFileSync(path.join(__dirname,'tranche1-prelight.json'))),gates=[];
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const c=await b.newContext({viewport:{width:1366,height:768}});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
const save=async page=>{await page.locator('#save_button').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
const open=async fixture=>{await p.goto(base+'style.css');await p.evaluate(x=>{localStorage.setItem('save data',JSON.stringify(x));},fixture);await p.goto(base);await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.waitForFunction(()=>document.getElementById('p23_household_panel'));};
try{
 // Supported whole native checkpoint, with the existing Effects master switch off.
 const quiet=structuredClone(checkpoint);quiet.customization.profiles[quiet.customization.active].settings.effects='off';
 await open(quiet);assert.equal(await p.evaluate(()=>document.documentElement.dataset.effects),'off');
 const before=await save(p);await p.waitForTimeout(2200);const after=await save(p);assert.ok(after.levels.person.main_character.skill_xp.Famine>before.levels.person.main_character.skill_xp.Famine);
 assert.equal(await p.locator('.work-ledger-effect:not([hidden])').count(),0);gates.push('Effects-off retains passive gameplay with no discovery cue');
 // Another tab on this exact test origin cannot publish a command or played XP.
 const second=await c.newPage();await second.goto(base);await second.locator('#loading_screen_play_button:not(.none_display)').click();
 await second.waitForTimeout(500);await second.locator('#p23_household_panel summary').click();assert.ok(await second.locator('[data-household-action="light"]').isDisabled());await second.close();gates.push('read-only tab cannot light the hearth');
 // Explicitly turning the existing need profile off freezes passive Famine.
 await p.locator('#options_button').click();await p.locator('[data-pacing-option="hungerEnabled"]').uncheck();await p.locator('#options_button').click();const off=await save(p);await p.waitForTimeout(2200);assert.equal((await save(p)).levels.person.main_character.skill_xp.Famine,off.levels.person.main_character.skill_xp.Famine);gates.push('need mode off supplies no passive Famine');
 // The runtime supports only the declared human profile; another native form is
 // unconfigured, not a claim about its source biology or nutritional exemption.
 const other=structuredClone(checkpoint);other.character.bio.race='nekomimi';other.character.hp_to_full=0;other.pacing_e1.fullness=0;
 await open(other);const otherStart=await save(p);await p.waitForTimeout(2200);const otherEnd=await save(p);assert.equal(otherEnd.levels.person.main_character.skill_xp.Famine,otherStart.levels.person.main_character.skill_xp.Famine);gates.push('unconfigured native body form does not gain human-profile Famine');
 // Return to the genuine pre-light checkpoint. Run the real UI handler and
 // failure injection in one task, so an unrelated worker tick cannot race it.
 await open(checkpoint);await p.locator('#p23_household_panel summary').click();await save(p);
 const result=await p.evaluate(()=>{
  const saved=localStorage.getItem('save data'),before=JSON.parse(saved),original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='save data')throw new DOMException('P00 test quota','QuotaExceededError');return original.call(this,k,v);};
  document.querySelector('[data-household-action="light"]').click();Storage.prototype.setItem=original;
  const retained=localStorage.getItem('save data');return {unchanged:retained===saved,fuel:JSON.parse(retained).household.hearth.fuelMinutes,stock:JSON.parse(retained).inventories.person.main_character['{"id":"Rough wood log"}'].count,previousStock:before.inventories.person.main_character['{"id":"Rough wood log"}'].count};
 });assert.equal(result.unchanged,true);assert.equal(result.fuel,0);assert.equal(result.stock,result.previousStock);gates.push('failed durable fuel command leaves all native stored state and stock unchanged');
 await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.locator('#p23_household_panel summary').click();await p.locator('[data-household-action="light"]').click();const retry=await save(p);assert.equal(retry.inventories.person.main_character['{"id":"Rough wood log"}'].count,result.stock-1);assert.ok(retry.household.hearth.fuelMinutes>0);gates.push('failed fuel command can retry after native reload without a lost item');
 const response=await p.request.get(base+'dist/bundle.js');const hash=x=>crypto.createHash('sha256').update(x).digest('hex');assert.equal(hash(await response.body()),hash(fs.readFileSync('dist/bundle.js')));assert.deepEqual(errors,[]);
 await p.screenshot({path:path.join(dir,'tranche1-guards-desktop.png')});fs.writeFileSync(path.join(dir,'tranche1-guards.json'),JSON.stringify({status:'PASS',viewport:[1366,768],bundleSha256:hash(fs.readFileSync('dist/bundle.js')),gates,pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
