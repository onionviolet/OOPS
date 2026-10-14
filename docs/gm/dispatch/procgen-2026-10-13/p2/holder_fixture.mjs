// Derive a disposable fixture from the earned natural export with real native
// transfer/persistence code. No private save and no manufactured product truth.
import {readFile,writeFile} from 'node:fs/promises';
import {decodeSaveFile,encodeSaveFile,validateSaveEnvelope} from '../../../../../src/save_files.js';
import {stageNativeStorageTransfer} from '../../../../../src/native_storage_transaction.js';
import {stageNativeTrade} from '../../../../../src/native_trade_transaction.js';
import {persistExpansionPlan} from '../../../../../src/expansion_persistence.js';
let save=decodeSaveFile(await readFile('/private/tmp/proc-p2-final.txt','utf8'),'v0.6');
const products=Object.values(save.mixtures.products),key=p=>JSON.stringify({id:'Village mixture',mixture:p.id}),a=key(products.find(p=>p.process==='steep')),b=key(products.find(p=>p.process==='boil'));
const counts=inv=>Object.fromEntries(Object.entries(inv).map(([key,row])=>[key,row.count]));
const context=()=>({state:save.expansion,money:save.character.money,equipment:{player:{}},gameplay:{player:{inventory:counts(save.inventories.person.main_character),skills:Object.fromEntries(Object.entries(save.levels.person.main_character.skill_xp).map(([id,xp])=>[id,{xp,enabled:true,present:true}])),reputation:save.character.reputation}}});
const bindings={player:{category:'person',id:'main_character'}};
function persist(plan,ownershipBindings){persistExpansionPlan(plan,{createSave:()=>JSON.stringify(save),storage:{setItem:(k,text)=>{save=JSON.parse(text);}},key:'fixture',bindings,ownershipBindings,validateEnvelope:s=>validateSaveEnvelope(s,'v0.6')});}
let frame=context();const chest=stageNativeStorageTransfer({...frame,owners:{player:frame.gameplay.player.inventory,chest:counts(save.inventories.storage.player)},request:{direction:'deposit',item_key:a,count:2,expectedCount:frame.gameplay.player.inventory[a],sequence:save.expansion.sequence}});
persist(chest,{chest:{category:'storage',id:'player'}});
const vendor=Object.keys(save.inventories.trader)[0];frame=context();const quote={buy:[],sell:[{item_key:b,count:1}],buyValue:0,sellValue:12,vendorId:vendor,region:'Village'};
const sale=stageNativeTrade({...frame,owners:{player:frame.gameplay.player.inventory,vendor:counts(save.inventories.trader[vendor])},market:save.loot_sold_count,itemLog:save.item_log,quote,currentQuote:quote,getItem:()=>({id:'Village mixture',saturates_market:false})});
persist(sale,{vendor:{category:'trader',id:vendor}});
await writeFile('/private/tmp/proc-p2-holders.txt',encodeSaveFile(JSON.stringify(save)));
await writeFile('/private/tmp/proc-p2-holders-expected.json',JSON.stringify({mixtures:save.mixtures,inventory:save.inventories,exposure:save.active_effects['Village mixture exposure']}));
console.log(JSON.stringify({label:'source -> seeded-native fixture',holderCounts:{carried:save.inventories.person.main_character[a].count,chest:save.inventories.storage.player[a].count,vendor:save.inventories.trader[vendor][b].count}}));
