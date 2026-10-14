import test from 'node:test';
import assert from 'node:assert/strict';
import {structuredReachabilityHints} from '../src/structured_reachability.js';
import {structuredActionCosts} from '../src/structured_pack_runtime.js';
test('visible action hints describe missing control and treatment without predicate IDs',()=>{
 const d={abilities:[{commandId:'act',control:{fact:'actor.private-control',op:'gte',value:3}}],expeditions:[{prepareId:'act',injuryKey:'private-injury'}]};
 const hints=structuredReachabilityHints(d,{id:'act'},{'actor.private-control':1,'actor.private-injury':1});
 assert.match(hints.join(' '),/1 \/ 3/);assert.match(hints.join(' '),/Treat/);assert.doesNotMatch(hints.join(' '),/private-/);
 assert.deepEqual(structuredReachabilityHints(d,{id:'act'},{'actor.private-control':3,'actor.private-injury':0}),[]);
});
test('refused visible actions retain fixed player input quotes without rewards or other actor costs',()=>{
 const d={items:[{id:'cloth',label:'Known cloth'}]};
 assert.deepEqual(structuredActionCosts({eligible:false,costs:[{type:'item',key:JSON.stringify({id:'cloth'}),amount:-2},{type:'item',actor:'other',key:JSON.stringify({id:'cloth'}),amount:-9}]},d),['2 × Known cloth']);
});
