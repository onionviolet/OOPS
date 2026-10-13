import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRetainedMethods} from '../src/native_realm_traveler.js';
test('native passage references the actual learned Tidemark owner without copying mastery or private knowledge',()=>{
 const power={revision:1,owned:true,mastery:7,executions:3,cause:'simulation:41',fragments:[]};
 const state={simulation:{powers:{player:{'tidemark.counterweight':power}},knowledge:{'other.actor':{private:'hidden'}}}};
 const before=structuredClone(state),refs=nativeRetainedMethods(state);
 assert.deepEqual(refs,[{id:'tidemark.counterweight',revision:1,ownerId:'player',sourceId:null,stage:'learned'}]);
 refs[0].revision=12;assert.deepEqual(state,before);
 for(const value of [undefined,{revision:1,owned:false,fragments:['fragment']},{revision:0,owned:true}]){
  assert.deepEqual(nativeRetainedMethods({simulation:{powers:{player:{'tidemark.counterweight':value}}}}),[]);
 }
 assert.deepEqual(nativeRetainedMethods({}),[]);
});
