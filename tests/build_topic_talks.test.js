import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTopicTalks} from '../scripts/lead_run/build_topic_talks.mjs';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';

const registry=[{id:'reader.person.a',kind:'person',label:'Person A'},{id:'reader.person.b',kind:'person',label:'Person B'},{id:'reader.room',kind:'place',label:'Room'}];
const pack={leadLife:{actorId:'pack.person.a'},people:[{id:'pack.person.a',indexId:'reader.person.a',name:'Person A'},{id:'pack.person.b',indexId:'reader.person.b',name:'Person B'}],places:[{id:'pack.room',indexId:'reader.room',name:'Room'}],placeAliases:[],idMap:{}};
const crosswalk={places:{}};
test('builds source-located topic rows only for an explicit resolvable participant',()=>{
 const scenes=[{beat:'s',order:1,pov:'lead',evidence:[{locator:'zh 第1章 p2'}],place:'Room',present:['reader.person.a','reader.person.b'],steps:[
  {verb:'ask Person B about the route',object:'route',label:'S',minutes:3,outputs:['route answer']},
  {verb:'ask about the plan',class:'socialize',label:'S'},
  {verb:'speak with Person B',label:'S'}]}];
 const result=buildTopicTalks({scenes,crosswalk,registry,pack});
 assert.equal(result.rows.length,2); const row=result.rows[0];
 assert.equal(row.sourceStepId,'s#1'); assert.equal(row.personId,'pack.person.b'); assert.equal(row.minutes,3);
 assert.equal(row.source.locator,'zh 第1章 p2'); assert.equal(row.choices[0].effects[0].type,'knowledge');
 assert.equal(row.choices[0].effects[0].basis.at,'zh 第1章 p2');
 assert.equal(result.rejected.unclearSpeaker,1);
});

test('maps a topic row to its exact canon choice control',()=>{
 const scenes=[{beat:'s',order:1,pov:'lead',evidence:[{locator:'zh 第1章'}],place:'Room',present:['reader.person.a','reader.person.b'],steps:[{verb:'ask Person B about the route',class:'socialize'}]}];
 const talk={id:'topic.s-1',sourceStepId:'s#1',personId:'pack.person.b',place:'pack.room',choices:[{id:'canon'}]};
 const result=buildReplayMapping({scenes,crosswalk,registry,pack:{...pack,topicTalks:{talks:[talk]}},fromChapter:1,toChapter:1});
 assert.equal(result.rows[0].canonicalControl,'topic.s-1.canon'); assert.equal(result.rows[0].topicTalkId,'topic.s-1');
});

test('leaves unresolved people and places as typed gaps',()=>{
 const scenes=[{beat:'s',order:1,pov:'lead',evidence:[{locator:'zh 第1章'}],place:'Unknown',present:['reader.person.a'],steps:[{verb:'ask the visitor'}]}];
 const result=buildTopicTalks({scenes,crosswalk,registry,pack}); assert.equal(result.rows.length,0);
 assert.equal(result.rejected.unresolvedPerson,1);
});

test('uses an explicit paragraph speech cue and keeps duplicate aliases ambiguous',()=>{
 const aliasRegistry=[registry[0],{...registry[1],aliases:['Shared alias']},registry[2],{id:'reader.person.c',kind:'person',label:'Person C',aliases:['Shared alias']}];
 const aliasPack={...pack,people:[...pack.people,{id:'pack.person.c',indexId:'reader.person.c',name:'Person C'}]};
 const scenes=[{beat:'explicit',order:1,pov:'lead',evidence:[{locator:'zh 第1章 p2'}],place:'Room',present:['reader.person.a','reader.person.b'],steps:[{verb:'ask about the route',label:'S'}]},
  {beat:'ambiguous',order:2,pov:'lead',evidence:[{locator:'zh 第1章 p3'}],place:'Room',present:['reader.person.a','reader.person.b','reader.person.c'],steps:[{verb:'ask about the route',label:'S'}]},
  {beat:'alias-still-ambiguous',order:3,pov:'lead',evidence:[{locator:'zh 第1章 p4'}],place:'Room',present:['reader.person.a','reader.person.b'],steps:[{verb:'ask about the route',label:'S'}]}];
 const result=buildTopicTalks({scenes,crosswalk,registry:aliasRegistry,pack:aliasPack,paragraphIndex:new Map([
  ['0:1:2','Person B replied: the route is open.'],['0:1:3','Shared alias replied: the route is open.'],['0:1:4','Shared alias replied: the route is open.']])});
 assert.equal(result.rows.length,1); assert.equal(result.rows[0].personId,'pack.person.b');
 assert.equal(result.rejected.ambiguousPerson,1);
 assert.equal(result.rejected.unclearSpeaker,1);
});
