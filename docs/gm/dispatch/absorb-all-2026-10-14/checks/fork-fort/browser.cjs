global.fetch = undefined; // Node 22 Playwright networking workaround, as wave harness.
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs'), assert = require('assert/strict');
const URL = 'http://127.0.0.1:18704/';
const out = __dirname;
const F = {lead:'Frontier fort route notes',journal:'Frontier fort keeper journal',quest:'frontier.fort.quest',offer:'frontier.fort.offer',search:'frontier.fort.search',prepare:'frontier.fort.prepare',outskirts:'Fort approach',court:'Fort courtyard',dungeon:'Fort dungeon',brace:'Frontier fort bone brace'};
const results=[], pageErrors=[];function pass(id,detail){results.push({id,detail});console.log('PASS',id,JSON.stringify(detail));}
async function play(p){await p.locator('#loading_screen_play_button:not(.none_display)').click();const c=p.locator('#hero_creation_panel_confirmation');if(await c.isVisible())await c.click();await p.locator('#location_name_span').filter({hasText:/Village|Mountain camp|Fort/}).waitFor({state:'visible'});await p.waitForTimeout(250);}
async function save(p){await p.evaluate(()=>saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));}
const inv=s=>s.inventories.person.main_character;
const count=(s,id)=>Object.entries(inv(s)).filter(([k])=>JSON.parse(k).id===id).reduce((a,[,v])=>a+v.count,0);
async function open(b,seed,paused=false){console.log("OPEN",seed?.["current location"]);const ctx=await b.newContext({viewport:{width:1366,height:768}});await ctx.addInitScript(seed=>{if(seed)localStorage.setItem('save data',JSON.stringify(seed));},seed);const p=await ctx.newPage();p.setDefaultTimeout(12000);p.errors=[];p.on('console',msg=>{if(msg.type()==='error')console.log('CONSOLE',msg.text())});p.on('pageerror',e=>{p.errors.push(e.message);pageErrors.push(e.message);console.log('PAGEERROR',e.stack)});await p.goto(URL,{waitUntil:"domcontentloaded"});console.log("DOM");if(paused)await p.locator("#loading_screen_play_button:not(.none_display)").waitFor({state:"visible"});else await play(p);console.log(paused?"PAUSED":"PLAYED");return {ctx,p};}
async function action(p,id){await p.evaluate(id=>start_game_action(id),id);}
async function doneAction(p,id,loc){await p.waitForFunction(({id,loc})=>{saveProgress();return !!(JSON.parse(localStorage.getItem('save data')).availabilities.action[id]&6)}, {id,loc},{timeout:90000,polling:500});await p.evaluate(()=>end_game_action());}
async function travel(p,id,name){await p.evaluate(id=>change_location({location_id:id}),id);await p.waitForFunction(n=>document.getElementById('location_name_span').textContent.startsWith(n),name,{timeout:15000});}
async function read(p,id){await p.evaluate(id=>start_reading(id),id);await p.waitForFunction(id=>{saveProgress();const x=JSON.parse(localStorage.getItem('save data'));return x.books[id]?.accumulated_time >= (id.includes("keeper") ? 8 : 6)},id,{timeout:10000,polling:500});}
async function clear(p,id,parent,name){const before=await save(p),target=(Math.floor((before.locations[id].enemy_groups_killed||0)/4)+1)*4;await travel(p,id,name);await p.waitForFunction(({id,target})=>{saveProgress();return JSON.parse(localStorage.getItem('save data')).locations[id].enemy_groups_killed>=target},{id,target},{timeout:30000,polling:500});await travel(p,parent,'Fort approach');}
async function craft(p,id,category='crafting'){
 await p.evaluate(()=>openCraftingWindow());await p.evaluate(category=>switchCraftingRecipesPage(category),category);
 const row=p.locator(`.recipe_div[data-recipe_id="${id}"]`);await row.click();
 console.log('CRAFT UI',await p.locator('#crafting_window').innerText());
 const button=p.locator('#crafting_window button').filter({hasText:/^Craft 1$/}).first();await button.click();await p.evaluate(()=>closeCraftingWindow());
}
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});let current;
try{
 current=await open(b);let p=current.p;let base=await save(p);
 assert.equal((await p.locator('#location_actions_div').innerText()).includes('watchpost'),false);
 assert.equal(base.quests[F.quest].is_active,false);pass('opening_unchanged','fresh Village has no Fort option or active quest');
 // Generated pre-Fort checkpoint: strip every new definition, retain all other save data.
 const old=structuredClone(base);for(const collection of [old.locations,old.quests,old.books,...Object.values(old.availabilities)])for(const k of Object.keys(collection))if(k.startsWith('frontier.fort.')||k.startsWith('Frontier fort')||k.startsWith('Fort '))delete collection[k];
 console.log("CLOSING");await current.ctx.close();console.log("CLOSED");current=await open(b,old,true);p=current.p;const restored=await save(p);
 assert.equal(restored.character.money,old.character.money);assert.deepEqual(restored.levels.person.main_character,old.levels.person.main_character);assert.deepEqual(inv(restored),inv(old));assert.deepEqual(restored.quests['Lost memory'],old.quests['Lost memory']);assert.equal(restored['current location'],'Village');assert.equal(restored.quests[F.quest].is_active,false);pass('old_save_unaffected','pre-Fort checkpoint retains location, purse, inventory, levels and opening quest; no auto-enrollment');
 const seed=structuredClone(old);seed['current location']='Mountain camp';seed.availabilities.location['Mountain camp']=1;seed.availabilities.location['Mountain path']=1;seed.availabilities.location['Nearby cave']=1;seed.global_flags.is_crafting_unlocked=true;
 seed.character.xp.total_xp=10000000;seed.levels.person.main_character.total_xp=10000000;seed.levels.person.main_character.skill_xp.Combat=100000;seed.levels.person.main_character.skill_xp.Swords=100000;seed.levels.person.main_character.skill_xp['Weapon mastery']=100000;seed.levels.person.main_character.skill_xp.Evasion=100000;seed.levels.person.main_character.skill_xp['Iron skin']=100000;
 seed.character.equipment.weapon={components:{head:'Iron long blade',handle:'Simple wooden short handle'},quality:250,equip_slot:'weapon'};seed.last_rewarded_export=Date.now();
 console.log("CLOSING");await current.ctx.close();console.log("CLOSED");current=await open(b,seed);p=current.p;
 await p.locator('#location_actions_div').getByText('Take an action',{exact:false}).first().click();await p.screenshot({path:out+'/camp.png'});await action(p,F.offer);await doneAction(p,F.offer,'Mountain camp');
 assert.equal(count(await save(p),F.lead),1);await action(p,F.offer);await p.evaluate(()=>end_game_action());assert.equal(count(await save(p),F.lead),1);pass('offer_once','second invocation grants no second book');
 await read(p,F.lead);assert.equal((await save(p)).quests[F.quest].is_active,true);
 await action(p,F.search);await p.waitForTimeout(650);let partial=await save(p);assert.ok(partial.locations['Mountain camp'].actions[F.search].accumulated_progress>0);assert.equal(partial.availabilities.location[F.outskirts]&1,0);
 fs.writeFileSync(out+'/partial.save.json',JSON.stringify(partial));console.log("CLOSING");await current.ctx.close();console.log("CLOSED");current=await open(b,partial);p=current.p;let again=await save(p);assert.equal(again.locations['Mountain camp'].actions[F.search].accumulated_progress,partial.locations['Mountain camp'].actions[F.search].accumulated_progress);assert.deepEqual(again.quests[F.quest],partial.quests[F.quest]);assert.equal(count(again,F.lead),1);pass('partial_reload','mid-search action progress, active quest, book and locked approach retained');
 await action(p,F.search);await doneAction(p,F.search,'Mountain camp');await travel(p,F.outskirts,'Fort approach');
 await action(p,F.prepare);await p.evaluate(()=>end_game_action());assert.equal((await save(p)).availabilities.location[F.dungeon]&1,0);pass('stair_missing_materials','dungeon remains locked without real brace and wool');
 await clear(p,F.court,F.outskirts,'Fort courtyard');let s=await save(p);assert.ok(count(s,'Frontier fort old bone')>=1);assert.ok(count(s,'Frontier fort torn wool')>=1);assert.equal(s.quests[F.quest].task_status[1].is_finished,true);pass('court_drops_and_recipes',{bone:count(s,'Frontier fort old bone'),wool:count(s,'Frontier fort torn wool')});
 await craft(p,'frontier.fort.bone_brace');await craft(p,'frontier.fort.unravel_wool');await craft(p,'frontier.fort.unravel_linen');
 s=await save(p);assert.equal(count(s,F.brace),1);assert.ok(count(s,'Wool')>=2);assert.ok(count(s,'Flax')>=2);
 const woolBefore=count(s,'Wool');await action(p,F.prepare);await doneAction(p,F.prepare,F.outskirts);s=await save(p);assert.equal(count(s,F.brace),0);assert.equal(count(s,'Wool'),woolBefore-2);assert.equal(s.availabilities.location[F.dungeon]&1,1);pass('recipes_and_paid_stair','native recipes settle; stair consumes exactly one brace and two wool');
 await clear(p,F.dungeon,F.outskirts,'Fort dungeon');s=await save(p);assert.equal(count(s,F.journal),1);assert.ok(count(s,'Frontier fort rusted shackle')>=1);await craft(p,'frontier.fort.recycle_shackle','smelting');assert.ok(count(await save(p),'Iron ingot')>=1);
 await read(p,F.journal);s=await save(p);assert.equal(s.quests[F.quest].is_finished,true);pass('dungeon_journal_complete','native dungeon clear, shackle recycling and journal reading finish the quest');
 await p.screenshot({path:out+'/complete.png'});
 await clear(p,F.dungeon,F.outskirts,'Fort dungeon');assert.equal(count(await save(p),F.journal),1);pass('repeat_clear_once','second full dungeon clear does not repeat the journal reward');
 const exported=await p.evaluate(()=>save_to_file());assert.ok(exported);s=await save(p);fs.writeFileSync(out+'/completed.save.txt',exported);
 console.log("CLOSING");await current.ctx.close();console.log("CLOSED");current=await open(b);p=current.p;const imported=p.waitForEvent('framenavigated',{predicate:f=>f===p.mainFrame(),timeout:65000});await p.locator('#saved_file_input').setInputFiles({name:'Fort-test-save.txt',mimeType:'text/plain',buffer:Buffer.from(exported)});await imported;await play(p);
 again=await save(p);assert.equal(again.quests[F.quest].is_finished,true);assert.equal(count(again,F.journal),1);assert.equal(again.locations[F.dungeon].enemy_groups_killed,s.locations[F.dungeon].enemy_groups_killed);pass('literal_file_import','completed quest, once-only journal and repeat-clear count retained');
 await p.reload();await play(p);again=await save(p);assert.equal(again.quests[F.quest].is_finished,true);assert.equal(count(again,F.journal),1);pass('completed_reload_no_replay','finished route survives reload without reward duplication');
 assert.deepEqual(pageErrors,[]);pass('page_errors',pageErrors);
 fs.writeFileSync(out+'/results.json',JSON.stringify({viewport:[1366,768],generatedCheckpoint:true,nativeTimers:true,results},null,2));
}catch(e){console.error('ROUTE FAILURE',e);if(current){const s=await save(current.p);console.log('FAIL_STATE',JSON.stringify({location:s['current location'],deaths:s.total_deaths,quest:s.quests[F.quest],court:s.locations[F.court],dungeon:s.locations[F.dungeon]}));}throw e;}finally{if(current)console.log("CLOSING");await current.ctx.close();console.log("CLOSED");await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
