import {registerDomain} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {shopLockState,setShopLocks,validateShopLocks,changeShopLock,keptShopKeys} from './shop_locks.js';
let ports;
export const configureShopLocks=operations=>{ports=operations;};
function change(key,clear=false){
 if(!ports?.writable())throw Error('Use the writable game to change kept stock.');const id=ports.currentTrader?.();if(!id)throw Error('Meet the actual merchant before changing its stock plan.');const stock=ports.trader(id).getTradeInventory();
 if(!clear&&!keptShopKeys(id).includes(key)&&!(stock[key]?.count>0))throw Error('Keep an actual available merchant item.');
 const before=shopLockState(),next=clear?{...before,owners:Object.fromEntries(Object.entries(before.owners).filter(([owner])=>owner!==id))}:changeShopLock(id,key),transaction=beginNativeCraftTransaction({bindings:[{get:shopLockState,set:setShopLocks}]});
 try{setShopLocks(next);ports.persist(()=>transaction.markDurable());}catch(e){if(transaction.status==='pending')transaction.rollback();throw e;}finally{ports.refreshTrade?.();}
 return next;
}
registerDomain({id:'shopLocks',initialState:()=>null,save:()=>Object.keys(shopLockState().owners).length?shopLockState():undefined,validate:validateShopLocks,migrate:s=>s==null?null:structuredClone(s),load:setShopLocks,
 commands:{toggle:key=>change(key),clear:()=>change(null,true)},projection:()=>structuredClone(shopLockState())});
