import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {build} from 'esbuild';
import {serve,Session} from './lib.mjs';

const out=resolve(process.argv[2]||'docs/gm/dispatch/gear-depth-2026-10-21/g3');await mkdir(out,{recursive:true});
const scratch=await mkdtemp(join(tmpdir(),'yair-g3-'));
// Fixture exports exist only in this disposable bundle. No production dev mode.
await build({stdin:{resolveDir:process.cwd(),contents:`import * as game from './src/main.js';
import * as trade from './src/trade.js';import NPCRegistry from './src/data/npcs.js';
import templates from './src/data/inventory_templates.js';import {TradeItem,TradeItemGroup} from './src/models/trade_item.js';
import {locations} from './src/data/locations.js';import {character} from './src/data/character.js';
import * as items from './src/items.js';import * as display from './src/display.js';
globalThis.g3={game,trade,NPCRegistry,templates,TradeItem,TradeItemGroup,locations,character,items,display};`},bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:join(scratch,'bundle.js'),logLevel:'error'});
const server=await serve(scratch),s=new Session({url:server.url,seed:71,wall:Date.UTC(2026,9,21),opTimeout:12000});
const result={fixture:'Fresh disposable origin; funded buyer, authored high-quality shop fixture and unlocked existing encounter. Native shop, trade, combat, inventory and save consumers execute unchanged.',checks:[]};
let phase='launch';
async function reopen(){await s.page.waitForFunction(()=>!!window.simulationTestHooks);await s.page.evaluate(()=>simulationTestHooks.pause());await s.page.locator('#loading_screen_play_button').click();await s.page.waitForTimeout(400);}
try{
 await s.start();await s.open();const p=s.page;
 phase='shop setup';
 const key=await p.evaluate(()=>{
  const g=g3,shop=g.NPCRegistry.get('villageTrader').getTraderComponent();
  g.character.money=10000000;shop.getAvailabilityComponent().is_unlocked=true;
  g.templates.g3=[new g.TradeItemGroup({items:[new g.TradeItem({item_name:'Wolf leather armor',count:[2],quality:[170,170]})]})];
  shop.inventory_template='g3';shop.last_refresh=-1;window.startTrade('villageTrader');
  return Object.keys(shop.getTradeInventory()).find(key=>JSON.parse(key).affixes?.length);
 });assert(key,'native restock generated affixed armor');result.checks.push('shop generation resolves affixes into carried stock keys');
 const stock=await p.evaluate(()=>Object.keys(g3.NPCRegistry.get('villageTrader').getTraderComponent().getTradeInventory()));
 await p.evaluate(()=>{window.exitTrade();window.startTrade('villageTrader');});
 assert.deepEqual(await p.evaluate(()=>Object.keys(g3.NPCRegistry.get('villageTrader').getTraderComponent().getTradeInventory())),stock);result.checks.push('closing and reopening shop does not reroll stock');
 phase='native purchase';await p.evaluate(key=>g3.trade.add_to_buying_list({item_key:key,count:1}),key);
 await p.locator('#accept_trade_button').click();
 assert.equal(await p.evaluate(key=>g3.character.getItems()[key]?.count,key),1);
 await p.screenshot({path:join(out,'shop.png')});
 result.checks.push('native accept trade transfers exact affixed key and removes one vendor unit');
 await p.evaluate(key=>g3.trade.add_to_selling_list({item_key:key,count:1}),key);await p.locator('#accept_trade_button').click();
 assert.equal(await p.evaluate(key=>g3.character.getItems()[key]?.count||0,key),0);
 await p.evaluate(key=>g3.trade.add_to_buying_list({item_key:key,count:1}),key);await p.locator('#accept_trade_button').click();
 assert.equal(await p.evaluate(key=>g3.character.getItems()[key]?.count,key),1);
 result.checks.push('last-unit sale and repurchase preserve rolled identity without stale-preview errors');
 await p.evaluate(()=>window.exitTrade());
 phase='equipped native encounter';
 await p.evaluate(()=>{const g=g3,z=g.locations['Forest den'];z.getAvailabilityComponent().is_unlocked=true;
 z.enemy_groups_list=[];z.enemies_list=['Direwolf'];z.enemy_group_size=[1,1];
 g.game.change_location({location_id:'Forest den',skip_travel_time:true});});
 await p.waitForFunction(()=>g3.game.current_combat?.defenders?.some(e=>Object.keys(e.getEquipment()).length));
 const dropped=await p.evaluate(()=>{const g=g3,c=g.game.current_combat,e=c.defenders.find(e=>Object.keys(e.getEquipment()).length);
 e.equipment_drop_chance=1;e.getFullStats().health=1;e.getFullStats().agility=.001;e.getFullStats().intuition=.001;
 const key=e.getEquipment().torso.getInventoryKey(),before=g.character.getItems()[key]?.count||0;
 for(let i=0;i<10&&e.is_alive;i++)c.doCombatAction({fighter_index:0,is_attacker:true,target:e,attack_power:1000000,target_count:1,attack_count:1});
 return {key,before,after:g.character.getItems()[key]?.count||0,defeated:!e.is_alive,health:e.getFullStats().health,ended:c.is_ended,log:[...document.querySelectorAll('.message_critical')].map(n=>n.textContent).join(' | ')};});
 result.combat=dropped;assert(dropped.defeated,JSON.stringify(dropped));assert.equal(dropped.after,dropped.before+1);result.checks.push('actual native combat defeat awards worn affixed key through normal loot consumer');
 await p.evaluate(()=>g3.game.change_location({location_id:'Village',skip_travel_time:true}));
 phase='persistence';const keys=[key,dropped.key];
 const observe=()=>p.evaluate(keys=>keys.map(key=>({key,count:g3.character.getItems()[key]?.count,affixes:g3.character.getItems()[key]?.item.affixes})),keys);
 const expected=await observe();await s.save();await p.reload();await reopen();assert.deepEqual(await observe(),expected);
 const exported=await p.evaluate(()=>save_to_file());await Promise.all([p.waitForEvent('load'),p.evaluate(text=>load_progress(text),exported)]);await reopen();assert.deepEqual(await observe(),expected);
 result.checks.push('Save/reload/Export/literal Import preserve acquired keys, counts and affixes');
 assert.deepEqual(s.errors,[]);result.status='PASS';
}catch(e){result.status='FAIL';result.phase=phase;result.error=e.stack;throw e;}
finally{result.errors=s.errors;await writeFile(join(out,'browser.json'),JSON.stringify(result,null,2)+'\n');await s.close();server.close();await rm(scratch,{recursive:true,force:true});}
console.log(JSON.stringify(result));
