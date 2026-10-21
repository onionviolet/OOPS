import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverTradeRequests} from '../src/shop_restock.js';
test('restock keeps exact subjects, clamps reduced stock and drops unavailable subjects without substitution',()=>{
 const requested=[{item_key:'A',count:4},{item_key:'B',count:2},{item_key:'C',count:1}],stock={A:{count:2},B:{count:3},D:{count:10}};
 const before=structuredClone({requested,stock});
 assert.deepEqual(recoverTradeRequests(requested,stock),[{item_key:'A',count:2},{item_key:'B',count:2}]);
 assert.deepEqual({requested,stock},before);
});
test('empty or malformed stock does not create a pending purchase',()=>{
 for(const count of [0,-1,NaN])assert.deepEqual(recoverTradeRequests([{item_key:'A',count:1}],{A:{count}}),[]);
 assert.deepEqual(recoverTradeRequests([],{A:{count:1}}),[]);
});
