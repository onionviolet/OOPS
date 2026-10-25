import test from 'node:test';
import assert from 'node:assert/strict';
import {setShopLocks,shopLockState,validateShopLocks,changeShopLock,retainShopStock} from '../src/shop_locks.js';
import {configureShopLocks} from '../src/shop_locks_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
const A='{"id":"Stale bread"}',B='{"id":"Rough wood log"}';
test('kept native stock retains exactly remaining units and real item identity while other slots refresh; consumed slots stay empty',()=>{
 setShopLocks(null);setShopLocks(changeShopLock('merchant',A));const item={getName(){return 'actual native item';}},row={item,count:2},old={[A]:row,[B]:{count:1}},fresh={[A]:{count:9},[B]:{count:4}};const next=retainShopStock('merchant',old,fresh);assert.equal(next[A],row);assert.equal(next[A].item,item);assert.equal(next[B].count,4);assert.equal(fresh[A].count,9);assert.equal(retainShopStock('merchant',{},fresh)[A],undefined);assert.equal(retainShopStock('other',old,fresh)[A].count,9);
 assert.equal(retainShopStock('merchant',{[A]:3},{[A]:4})[A],3,'played-minute owner has ordinary quantity entries');const saved=JSON.parse(JSON.stringify(shopLockState()));validateShopLocks(saved);setShopLocks(saved);assert.deepEqual(retainShopStock('merchant',{},{[A]:4}),{});setShopLocks(changeShopLock('merchant',A));assert.equal(retainShopStock('merchant',{},{[A]:4})[A],4);
});
test('native preference write failure rolls back the keep plan, refuses missing stock and clearing has no inventory effects',()=>{
 setShopLocks(null);const stock={[A]:{count:2}},ports={writable:()=>true,currentTrader:()=> 'merchant',trader:()=>({getTradeInventory:()=>stock}),persist:()=>{throw Error('Quota');},refreshTrade:()=>{}};configureShopLocks(ports);assert.throws(()=>domainRegistry.command('shopLocks','toggle')(A),/Quota/);assert.deepEqual(shopLockState(),{schema:1,owners:{}});assert.throws(()=>domainRegistry.command('shopLocks','toggle')(B),/available/);configureShopLocks({...ports,persist:done=>done()});domainRegistry.command('shopLocks','toggle')(A);assert.deepEqual(shopLockState().owners.merchant,[A]);domainRegistry.command('shopLocks','clear')();assert.equal(shopLockState().owners.merchant,undefined);assert.equal(stock[A].count,2);setShopLocks(null);
});
