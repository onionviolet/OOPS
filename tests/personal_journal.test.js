import test from 'node:test';
import assert from 'node:assert/strict';
import {writeJournal,validateJournal,discoveredAtlas,characterCard} from '../src/personal_journal.js';
test('journal retains literal prose and atlas never lists locked destinations or edges',()=>{
 const text='今天\n<my words> & "unchanged"\n  final spaces  ',j=writeJournal(text);assert.equal(validateJournal(JSON.parse(JSON.stringify(j))).text,text);
 assert.throws(()=>writeJournal('x'.repeat(20001)),/Invalid/);
 const a={id:'a',name:'Known',isUnlocked:()=>true},b={id:'b',name:'Hidden',isUnlocked:()=>false},c={id:'c',name:'Heard',isUnlocked:()=>true};a.connected_locations=[{location:b},{location:c}];c.parent_location=a;
 assert.deepEqual(discoveredAtlas({a,b,c}),[{id:'c',name:'Heard',routes:['a']},{id:'a',name:'Known',routes:['c']}]);
 const card=characterCard({name:'<Hero & friend>',world:'Frontier',stats:{health:20,max_health:60,stamina:10,max_stamina:40,strength:12,agility:8,dexterity:10},stage:1,knownPlaces:2});assert.match(card,/&lt;Hero &amp; friend&gt;/);assert.doesNotMatch(card,/<Hero/);assert.match(card,/20\/60/);
});
