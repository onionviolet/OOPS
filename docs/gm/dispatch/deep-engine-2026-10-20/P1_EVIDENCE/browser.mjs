import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {writeFile,mkdir} from 'node:fs/promises';
const root=resolve(process.argv[2]||'/tmp/oops-p1-candidate-20261020');
const evidence=resolve(process.argv[3]||'docs/gm/dispatch/deep-engine-2026-10-20/P1_EVIDENCE');
const {serve}=await import(pathToFileURL(join(root,'scripts/perf/lib.mjs')));
const {Session}=await import(pathToFileURL(join(root,'scripts/playtest/lib.mjs')));
const server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:11,wall:Date.UTC(2026,9,21),opTimeout:15000,hooks:{beforeOpen:context=>context.on('response',r=>{if(r.status()===404)console.log('missing',r.url());})}});
const receipt={viewport:{width:1920,height:1080},setup:'Disposable synthetic current-format fixture. Plain component armor seeded, unlocked Infested field. Actual equip/unequip, native Combat.doCombatAction with fixed explicit strike power and replay checkpoint, native saved item round trip. No natural crafting/acquisition/cadence claim.',checks:[]};
const armorKey=JSON.stringify({components:{internal:'Leather vest',external:'Steel chainmail vest'},quality:100});
let page;
async function moduleAccess(){await page.evaluate(async()=>{window.p1Module=await import(document.querySelector('script[src*="dist/bundle.js"]').src);});}
async function playReload(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(300);await moduleAccess();}
try {
 await mkdir(evidence,{recursive:true});await session.start();await session.open();page=session.page;
 const seed=await session.save();
 seed.inventories.person.main_character[armorKey]={count:1};
 seed.availabilities.location['Infested field']=1;
 await session.open(seed);page=session.page;await moduleAccess();
 console.log('seeded');
 await page.evaluate(()=>change_location({location_id:'Infested field',skip_travel_time:true}));
 await page.waitForTimeout(200);
 const combat=await page.evaluate(()=>({combat:!!p1Module.current_combat,exports:Object.keys(p1Module).filter(k=>/combat/.test(k))}));console.log(combat);
 await page.evaluate(()=>{const c=p1Module.current_combat;c.clearAllAttackLoops();c.is_special_combat=true;c.rngKey='p1:fixed-strike';window.p1Hero=c.attackers[0];window.p1Combat=c;window.p1Checkpoint=c.strikeCheckpoint();c.defenders[0].getFullStats().attack_points=1e9;c.defenders[0].getFullStats().crit_rate=0;});
 const hit=()=>page.evaluate(()=>{const c=p1Combat,h=p1Hero;c.restoreStrikeCheckpoint(p1Checkpoint);const stats=h.getFullStats();stats.health=stats.max_health;h.is_alive=true;c.doCombatAction({fighter_index:0,is_attacker:false,target:h,attack_power:40,target_count:1,attack_count:1});return {loss:stats.max_health-stats.health,defense:stats.defense,taken:stats.damage_taken,share:stats.min_damage_share,resistance:stats.crit_resistance};});
 const bare=await hit();console.log({bare});
 // Real inventory row and native context action.
 await page.locator('.inventory-tabs [data-category="all"]').click();
 await page.locator('#inventory_content_div > [data-character_item]').filter({hasText:'Steel chainmail'}).first().click();
 await page.locator('[data-shell-item-action="equip"]').click();
 const worn=await hit();assert.ok(worn.loss<bare.loss);assert.ok(worn.taken<1&&worn.share<.05&&worn.resistance>0);console.log({worn});
 receipt.bare=bare;receipt.worn=worn;receipt.checks.push('Native equipped armor lowers actual native Combat health loss');
 await page.screenshot({path:join(evidence,'equipped-1920.png'),fullPage:true});
 await page.evaluate(()=>change_location({location_id:'Village',skip_travel_time:true}));
 const saved=await session.save();
 const equipment=saved.equipment||saved.character?.equipment;console.log('equipment serialization',JSON.stringify(equipment));
 receipt.equipment=equipment;
 await page.reload();await playReload();
 const reloaded=await session.save();assert.deepEqual(reloaded.equipment,saved.equipment);
 const literal=await page.evaluate(()=>save_to_file());assert.equal(typeof literal,'string');
 await Promise.all([page.waitForEvent('load'),page.evaluate(encoded=>load_progress(encoded),literal)]);await playReload();
 const imported=await session.save();assert.deepEqual(imported.equipment,saved.equipment);
 // Enter a real encounter to retrieve the live actor from existing public module exports.
 await page.evaluate(()=>change_location({location_id:'Infested field',skip_travel_time:true}));await page.waitForTimeout(150);
 const restored=await page.evaluate(()=>{const c=p1Module.current_combat;c.clearAllAttackLoops();c.is_special_combat=true;c.rngKey='p1:fixed-strike';window.p1Combat=c;window.p1Checkpoint=c.strikeCheckpoint();window.p1Hero=c.attackers[0];c.defenders[0].getFullStats().attack_points=1e9;c.defenders[0].getFullStats().crit_rate=0;const s=p1Hero.getFullStats();return {defense:s.defense,taken:s.damage_taken,share:s.min_damage_share,resistance:s.crit_resistance};});
 for(const k of ['defense','taken','share','resistance'])assert.equal(restored[k],worn[k]);
 receipt.restored=restored;receipt.checks.push('Actual Save/reload/Export/literal Import retains equipped source and derived stats');
 await page.evaluate(()=>unequip_item('torso'));
 const removedHit=await hit();assert.equal(removedHit.loss,bare.loss);receipt.removedHit=removedHit;
 const removed=await page.evaluate(()=>{const s=p1Hero.getFullStats();return {defense:s.defense,taken:s.damage_taken,share:s.min_damage_share,resistance:s.crit_resistance};});
 for(const k of ['defense','taken','share','resistance'])assert.equal(removed[k],bare[k]);
 receipt.removed=removed;receipt.checks.push('Native unequip removes source and restores baseline dimensions');
 const creature=await page.evaluate(key=>{
  const live=p1Module.current_combat,Enemy=live.defenders[0].constructor,Combat=live.constructor;
  const foe=new Enemy({name:'Synthetic armored creature',stats:{health:100,attack:1,agility:1,intuition:1,dexterity:1,defense:0,crit_rate:0},equipment_keys:{torso:key},add_to_bestiary:false});foe.init();
  const c=new Combat({attackers:[p1Hero],defenders:[foe],is_special_combat:true});c.rngKey='p1:creature-fixed';
  const old={ap:p1Hero.getFullStats().attack_points,crit:p1Hero.getFullStats().crit_rate};
  p1Hero.getFullStats().attack_points=1e9;p1Hero.getFullStats().crit_rate=0;
  const hit=()=>{const f=foe.getFullStats();f.health=f.max_health;foe.is_alive=true;c.doCombatAction({fighter_index:0,is_attacker:true,target:foe,attack_power:40,target_count:1,attack_count:1});return {loss:f.max_health-f.health,defense:f.defense,taken:f.damage_taken,share:f.min_damage_share,resistance:f.crit_resistance};};
  const worn=hit();foe.equipment_keys={};foe.init();const removed=hit();
  p1Hero.getFullStats().attack_points=old.ap;p1Hero.getFullStats().crit_rate=old.crit;
  return {worn,removed};
 },armorKey);
 assert.ok(creature.worn.loss<creature.removed.loss);assert.ok(creature.worn.taken<1);assert.equal(creature.removed.taken,1);
 receipt.creature=creature;receipt.checks.push('Pending P2 item-factory hunk: actual native Enemy equipment keys and native Combat strike protect creature; removal restores defaults. Synthetic constructor case, no ordinary Direwolf route claim.');
 receipt.errors=session.errors;assert.deepEqual(session.errors,[]);
 await writeFile(join(evidence,'browser.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
} catch(error){receipt.failure=error.stack;receipt.errors=session.errors;await page?.screenshot({path:join(evidence,'browser-failure.png'),fullPage:true}).catch(()=>{});await writeFile(join(evidence,'browser.json'),JSON.stringify(receipt,null,2)+'\n');throw error;}
finally{await session.close();await server.close();}
