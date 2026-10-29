import test from 'node:test';
import assert from 'node:assert/strict';
import {buildJourneys} from '../scripts/lead_run/build_journeys.mjs';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';
import {defineJourneys} from '../src/cast_journeys.js';

const registry=[{id:'reader.place.a',kind:'place',label:'Old Town'},{id:'reader.place.b',kind:'place',label:'Harbor'}];
const pack={places:[{id:'pack.place.a',indexId:'reader.place.a',name:'Old Town'},{id:'pack.place.b',indexId:'reader.place.b',name:'Harbor'}],placeAliases:[],journeys:{journeys:[]}};
const crosswalk={places:{}};
const paragraphIndex=new Map([['0:1:2','The lead hired a carriage from Old Town to Harbor.']]);

test('emits a source-cited journey with explicit fare and labelled duration fill',()=>{
  const scenes=[{beat:'move',order:1,pov:'lead',place:'Old Town',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{verb:'hire a carriage to Harbor',class:'travel',fare:4}]}];
  const result=buildJourneys({scenes,crosswalk,registry,pack,paragraphIndex});
  assert.equal(result.rows.length,1); const row=result.rows[0];
  assert.equal(row.sourceStepId,'move#1'); assert.equal(row.from,'pack.place.a'); assert.equal(row.to,'pack.place.b');
  assert.equal(row.fare,4); assert.equal(row.minutes,1); assert.match(row.minutesBasis,/fill/); assert.equal(row.source.locator,'zh 第1章 p2');
  assert.deepEqual(defineJourneys({journeys:[row]},{worldId:'book.lotm',group:'book_lotm',situationId:'situation.cast'})[0].journey.to,'pack.place.b');
});

test('omits unknown fare, rejects ambiguous endpoints, and maps the exact row id',()=>{
  const scenes=[{beat:'move',order:1,pov:'lead',place:'Old Town',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{verb:'travel to Harbor',class:'travel'}]}];
  const result=buildJourneys({scenes,crosswalk,registry,pack,paragraphIndex}); const journey=result.rows[0];
  assert.equal(Object.hasOwn(journey,'fare'),false);
  const mapping=buildReplayMapping({scenes,crosswalk,registry,pack:{...pack,journeys:{journeys:[journey]}},fromChapter:1,toChapter:1});
  assert.equal(mapping.rows[0].canonicalControl,journey.id); assert.equal(mapping.rows[0].journeyId,journey.id);
  assert.match(mapping.rows[0].journeyOriginBasis,/inference/);
  const unclear=buildJourneys({scenes:[{...scenes[0],place:'Unknown'}],crosswalk,registry,pack,paragraphIndex});
  assert.equal(unclear.rows.length,0); assert.ok(unclear.rejected.unclearOrigin || unclear.rejected.unresolvedOrigin || unclear.rejected.unclearDestination || unclear.rejected.unresolvedDestination);
});

test('uses a fare only when the source step states a numeric penny fare',()=>{
  const scene={beat:'fare',order:1,pov:'lead',place:'Old Town',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{verb:'ride the carriage to Harbor',class:'travel',inputs:['11 penny fare']} ]};
  const result=buildJourneys({scenes:[scene],crosswalk,registry,pack,paragraphIndex});
  assert.equal(result.rows[0].fare,11);
  const unstated=buildJourneys({scenes:[{...scene,steps:[{verb:'ride the carriage to Harbor',class:'travel',inputs:['paid passage']}]}],crosswalk,registry,pack,paragraphIndex});
  assert.equal(Object.hasOwn(unstated.rows[0],'fare'),false);
});

test('a stated origin overrides an earlier scene and is not parsed as the destination',()=>{
  const scenes=[{beat:'earlier',order:1,pov:'lead',place:pack.places[1].name,evidence:[{locator:'zh 第1章 p1'}],steps:[{verb:'wait'}]},
    {beat:'route',order:2,pov:'lead',place:pack.places[1].name,evidence:[{locator:'zh 第1章 p2'}],steps:[{verb:`travel from ${pack.places[0].name} to ${pack.places[1].name}`,object:'ticket'}]}];
  const result=buildJourneys({scenes,crosswalk,registry,pack,paragraphIndex:new Map([['0:1:2','source']])});
  assert.equal(result.rows.length,1);assert.equal(result.rows[0].from,'pack.place.a');assert.equal(result.rows[0].to,'pack.place.b');
  assert.equal(result.rows[0].sourceStepOrigins['route#1'],'step origin');
});

test('keeps a step without a cited source paragraph out of the pack',()=>{
  const result=buildJourneys({scenes:[{beat:'move',order:1,pov:'lead',place:'Old Town',evidence:[{label:'S',locator:'zh 第1章 p9'}],steps:[{verb:'walk to Harbor',class:'travel'}]}],crosswalk,registry,pack,paragraphIndex});
  assert.equal(result.rows.length,0); assert.equal(result.rejected.unresolvedSource,1);
  assert.deepEqual(result.rejectedRows[0].otherBlockers,['source paragraph']);
});

test('deduplicates route rows while mapping each source step to that route id',()=>{
  const scenes=[1,2].map(order=>({beat:`move-${order}`,order,pov:'lead',place:'Old Town',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{verb:'travel to Harbor',class:'travel'}]}));
  const result=buildJourneys({scenes,crosswalk,registry,pack,paragraphIndex});
  assert.equal(result.rows.length,1); assert.deepEqual(result.rows[0].sourceStepIds,['move-1#1','move-2#1']);
  const mapped=buildReplayMapping({scenes,crosswalk,registry,pack:{...pack,journeys:{journeys:result.rows}},fromChapter:1,toChapter:1});
  assert.deepEqual(mapped.rows.map(row=>row.canonicalControl),[result.rows[0].id,result.rows[0].id]);
});

test('does not merge otherwise identical routes with different stated fares',()=>{
  const scenes=[0,4].map((fare,i)=>({beat:`fare-${i}`,order:i+1,pov:'lead',place:pack.places[0].name,evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{verb:`travel to ${pack.places[1].name}`,fare}]}));
  const result=buildJourneys({scenes,crosswalk,registry,pack,paragraphIndex});
  assert.equal(result.rows.length,2);assert.deepEqual(result.rows.map(row=>row.fare),[0,4]);
});

test('journey origin uses source volume order before shard-local scene order',()=>{
  const scenes=[{beat:'later',order:1,pov:'lead',place:pack.places[1].name,evidence:[{locator:'zh b2 第1章 p2'}],steps:[{verb:`travel to ${pack.places[1].name}`}]},
    {beat:'earlier',order:9,pov:'lead',place:pack.places[0].name,evidence:[{locator:'zh 第1章 p2'}],steps:[{verb:'wait'}]}];
  const result=buildJourneys({scenes,crosswalk,registry,pack,paragraphIndex:new Map([['2:1:2','source'],['0:1:2','source']])});
  assert.equal(result.rows.length,1);
  assert.equal(result.rows[0].from,'pack.place.a'); assert.equal(result.rows[0].to,'pack.place.b');
  assert.match(result.rows[0].originBasis,/inference/);
});
