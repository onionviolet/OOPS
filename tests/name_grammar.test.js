import test from 'node:test';import assert from 'node:assert/strict';
import {generatePersonName,nameGrammars,villageAuthoredNames} from '../src/name_grammar.js';
test('names are deterministic, original culture and vary by seed',()=>{
 const make=seed=>generatePersonName({seed,key:'one'});assert.deepEqual(make(42),make(42));assert.notDeepEqual(make(42),make(43));assert.ok(['hill','river','road'].includes(make(42).culture));
});
test('names reserve authored first names and full names, and generated collisions',()=>{
 const used=[];for(let i=0;i<80;i++){const p=generatePersonName({seed:42,key:String(i),used});assert.ok(!used.includes(p.name));assert.ok(!villageAuthoredNames.includes(p.name.split(' ')[0]));used.push(p.name);}
 const first=generatePersonName({seed:42,key:'x'}),next=generatePersonName({seed:42,key:'x',authored:[first.name.split(' ')[0]]});assert.notEqual(next.name.split(' ')[0],first.name.split(' ')[0]);
});
test('per-world extension and exhaustion are explicit',()=>{
 const grammars={...nameGrammars,other:{revision:1,cultures:[{id:'test',given:['A'],family:['B']}]}};
 assert.equal(generatePersonName({seed:1,key:'x',worldId:'other',grammars}).name,'A B');assert.throws(()=>generatePersonName({seed:1,key:'x',worldId:'other',grammars,used:['A B']}));assert.throws(()=>generatePersonName({seed:1,key:'x',worldId:'unknown'}));
});
