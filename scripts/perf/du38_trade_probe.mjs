// Normal earned Village opening; in-process native DOM, no browser or granted stock.
import {boot} from '../headless/runner.mjs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sha=s=>createHash('sha256').update(s).digest('hex');
const out=process.argv[2]||'docs/representations/evidence/du38-trade-2026-11-26/after.json';let game;
try{
 game=await boot(null,{seed:87,heroName:'Trade check'});
 await game.click('[data-nearby-verb="talk:villageElder"]');
 for(const id of ['hello','what happened','ask to leave 1','need to','starting gear','sword','equipment','money'])await game.click(`[data-textline="${id}"]`);
 await game.call('end_dialogue');await game.click('.choice_trade');await game.click('[data-trader="villageTrader"]');
 const ready=await game.save(),readyBytes=JSON.stringify(ready);await mkdir('work/du38-trade-20261126',{recursive:true});await writeFile('work/du38-trade-20261126/merchant-ready.json',readyBytes);
 const body=game.document,inventory=body.getElementById('inventory_div'),trade=body.getElementById('trade_div');
 const state=()=>({money:game.internals.character.money,tradeVisible:!game.hiddenReason(trade),inventoryVisible:!game.hiddenReason(inventory),inventoryInsideTrade:trade.contains(inventory),inventoryParent:inventory.parentElement?.className||inventory.parentElement?.id,price:body.getElementById('trade_price_value').textContent,margin:body.getElementById('trader_cost_mult_value').textContent,pendingRows:body.querySelectorAll('.item_to_trade').length,playerRows:body.querySelectorAll('#inventory_content_div > [data-character_item]').length,vendorRows:body.querySelectorAll('#trader_inventory_div > [data-trader_item]').length,carriedHeading:body.querySelector('.trade-carried-heading')?.textContent||null,carriedHeadingVisible:!!body.querySelector('.trade-carried-heading')&&!game.hiddenReason(body.querySelector('.trade-carried-heading')),totalLabel:body.getElementById('trade_price_text').textContent,exitVisible:!game.hiddenReason(body.getElementById('exit_trade_button'))});
 const initial=state();await game.click('[data-trader_item=\'{"id":"Coal"}\']');const buyStaged=state();await game.click('#cancel_trade_button');const cancelled=state();
 await game.click('[data-character_item=\'{"id":"Stale bread"}\']');const sellStaged=state();await game.click('#cancel_trade_button');await game.click('#exit_trade_button');const exited=state();
 const result={setup:'Fresh ordinary PLAY → village elder → native opening/weapon/equipment/money dialogue → Visit a merchant → Dunstan. No granted unlock, inventory or money.',routeIds:['hello','what happened','ask to leave 1','need to','starting gear','sword','equipment','money'],inputSha256:sha(readyBytes),source:{trade:sha(await readFile('src/trade.js')),display:sha(await readFile('src/display.js')),html:sha(await readFile('index.html'))},initial,buyStaged,cancelled,sellStaged,exited,errors:game.errors};
 await mkdir(out.slice(0,out.lastIndexOf('/')),{recursive:true});await writeFile(out,JSON.stringify(result,null,2));process.stdout.write(JSON.stringify(result,null,2)+'\n');
}finally{game?.close();}
