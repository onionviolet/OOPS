// Each invocation owns a fresh browser context and a unique evidence directory.
// Committed fixtures are immutable prerequisites, never another check's output.
const __p00Fs = require('fs'), __p00Path = require('path');
if (!process.env.URL) throw new Error('Set URL to the served native build origin.');
const __p00Base = new URL(process.env.URL);
if (!/^https?:$/.test(__p00Base.protocol)) throw new Error('URL must use HTTP or HTTPS.');
const __p00URL = __p00Base.href.replace(/\/?$/, '/');
const fixtureDir = __p00Path.join(__dirname, 'fixtures');
const __p00ProofRoot = process.env.YAIRPG_PROOF_DIR || require('os').tmpdir();
__p00Fs.mkdirSync(__p00ProofRoot, {recursive: true});
const __p00OutputDir = __p00Fs.mkdtempSync(__p00Path.join(__p00ProofRoot, __p00Path.basename(__filename, '.cjs') + '-'));
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const base=__p00URL,dir=__p00OutputDir,gates=[];
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
const save=async()=>{await p.locator('#save_button').click();return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
const action=async id=>{if(!await p.locator('#p23_combat_options_panel').evaluate(e=>e.open))await p.locator('#p23_combat_options_panel summary').click();await p.locator(`[data-combat-option="${id}"]`).click();};
try{
 const fixture=JSON.parse(fs.readFileSync(path.join(fixtureDir,'tranche2-equipped.json')));fixture.character.xp.total_xp=10000;fixture.levels.person.main_character.total_xp=10000;fixture.character.hp_to_full=0;fixture.pacing_e1.hungerEnabled=false;fixture.pacing_e1.weatherEnabled=false;fixture.availabilities.location['Nearby cave']=1;
 await p.goto(base+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await p.goto(base);await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.waitForFunction(()=>document.getElementById('p23_combat_options_panel'));
 await p.evaluate(()=>window.startTrade('villageTrader'));for(let i=0;i<6;i++)await p.locator('#trader_inventory_div .item_name').getByText('P23 throwing stone',{exact:true}).locator('xpath=ancestor::*[contains(@class,"inventory_item_control")]').click();await p.locator('#accept_trade_button').click();await p.locator('#exit_trade_button').click();await action('throw');await action('break');
 await p.evaluate(()=>window.change_location({location_id:'Nearby cave'}));await p.evaluate(()=>window.change_location({location_id:'Cave room'}));
 await p.waitForFunction(()=>['exchange-break','encounter-break'].includes(JSON.parse(localStorage.getItem('save data')).combatOptions?.phase),{},{timeout:20000});let state=await save();assert.ok(state.native_encounter.enemies.every(e=>e.full.defense>0));assert.ok(state.native_encounter.enemies.some(e=>e.full.health<e.full.max_health));gates.push('paid throw hits an actual native armored target through armor');
 let throwDefeat=false,heldClear=false;
 for(let i=0;i<20&&!heldClear;i++){
   const alive=state.native_encounter.enemies.filter(e=>e.alive),target=alive.at(-1);if(!target)break;
   const stone=Object.entries(state.inventories.person.main_character).find(([key])=>JSON.parse(key).id==='P23 throwing stone');
   const useStone=stone&&target.full.health<=6;
   if(useStone)await action('throw');else await action('clear');
   await action('resume');await action('break');await p.waitForFunction(()=>['exchange-break','encounter-break'].includes(JSON.parse(localStorage.getItem('save data')).combatOptions?.phase),{},{timeout:20000});const next=await save();
   if(useStone&&next.native_encounter.enemies.filter(e=>e.alive).length<alive.length)throwDefeat=true;
   state=next;heldClear=state.combatOptions.phase==='encounter-break';
 }
 assert.ok(throwDefeat,'actual paid throw must defeat an armored target');assert.ok(heldClear,'hold native completed encounter');gates.push('paid native throw defeats an armored target; final exchange holds group completion');
 const groups=state.locations['Cave room']?.enemy_groups_killed||0,beforeXP=state.character.xp.total_xp,gear=JSON.stringify(state.p23_living_gear),file=path.join(dir,'tranche2-victory.save.txt'),dp=p.waitForEvent('download');await p.locator('#save_to_file_button').click();await (await dp).saveAs(file);await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles(file)]);const retained=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(retained.combatOptions.phase,'encounter-break');assert.equal(retained.locations['Cave room']?.enemy_groups_killed||0,groups);assert.equal(retained.character.xp.total_xp,beforeXP);assert.equal(JSON.stringify(retained.p23_living_gear),gear);await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.waitForTimeout(1000);const loaded=await save();assert.equal(loaded.locations['Cave room']?.enemy_groups_killed||0,groups);assert.equal(loaded.character.xp.total_xp,beforeXP);await action('resume');const resumed=await save();assert.equal(resumed.locations['Cave room'].enemy_groups_killed,groups+1);assert.equal(resumed.character.xp.total_xp,beforeXP);gates.push('completed encounter Export/literal Import stays paused; Resume settles group once without duplicate kill XP');
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'tranche2-armored-native.json'),JSON.stringify({status:'PASS',bundleSha256:crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex'),gates,pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
