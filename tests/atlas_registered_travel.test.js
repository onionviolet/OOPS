import test from 'node:test';
import assert from 'node:assert/strict';
import {registeredTravel,nativeTravelReport,selectRegisteredTravel} from '../prototypes/world-atlas/registered-travel.mjs';
import {hpTradeLife} from '../src/world_packs/book_hp_life_data.js';
import {guLeadLife} from '../src/world_packs/book_gu_lead_life.js';
const places=[{id:'a',group:'one',routes:['b','b']},{id:'b',group:'one',routes:[]},{id:'c',group:'two',routes:[]}];
test('registered native and explicit player relocation edges are directed and deduplicated',()=>{
 const command=(id,location,to,actorId='player',actor='player')=>({id,actorId,location,effects:[{type:'relocate',actor,location:to}]});
 const rows=registeredTravel(places,[command('one','b','a'),command('two','b','a'),command('npc','b','a','guard'),command('target','a','b','player','$target'),command('cross','a','c'),command('missing','a','unknown'),command('self','a','a')]);
 assert.deepEqual(rows,[{group:'one',nativeEdges:1,relocationEdges:1,directedEdges:2,commands:2,places:2}]);
});
test('place or district presence does not imply a registered travel edge',()=>{
 assert.deepEqual(registeredTravel([{id:'cast-place',group:'cast',district:'north'}],[]),[]);
 assert.deepEqual(registeredTravel(places.map(p=>({...p,routes:[]})),[{id:'unlocated',actorId:'player',effects:[{type:'relocate',actor:'player',location:'b'}]}]),[]);
});
test('existing host route quotes use dest while native map connections use id',()=>{
 assert.deepEqual(registeredTravel([{id:'a',group:'one',routes:[{dest:'b',id:'walk-command',minutes:5}]},{id:'b',group:'one',routes:[{id:'a',minutes:5}]}],[]),[{group:'one',nativeEdges:2,relocationEdges:0,directedEdges:2,commands:0,places:2}]);
});
test('actual ordinary HP trade walks and RI lead movement definitions contribute without NPC relocation',()=>{
 const hp=registeredTravel(hpTradeLife.locations.map(p=>({...p,group:'hp'})),hpTradeLife.simulation.commands)[0];
 assert.equal(hp.directedEdges,2);assert.equal(hp.commands,2);
 const ri=registeredTravel(guLeadLife.locations.map(p=>({...p,group:'ri'})),guLeadLife.simulation.commands)[0];
 assert.equal(ri.directedEdges,2);assert.equal(ri.commands,2,'the elder movement effect must not add a player path');
});
test('ordinary native projection shares connected and combat-parent edges with standalone refresh',()=>{
 const a={connected_locations:[]},b={parent_location:a};a.connected_locations.push({location:b});
 const report=nativeTravelReport(places,{a,b},[],'2026-11-25T10:00:00Z');assert.equal(report.measuredAt,'2026-11-25T10:00:00Z');assert.equal(report.worlds[0].directedEdges,2);
});
test('embedded travel survives missing, stale or older leaves; a newer bound refresh can override',()=>{
 const report={schema:'atlas-registered-travel/1',measuredAt:'2026-11-25T10:00:00Z',worlds:[]};
 assert.equal(selectRegisteredTravel({registeredTravel:report},null,'new').source,'snapshot');
 assert.equal(selectRegisteredTravel({registeredTravel:report},{...report,snapshotSha256:'old'},'new').status,'measured');
 const older={...report,measuredAt:'2026-11-24T10:00:00Z',snapshotSha256:'new'};assert.equal(selectRegisteredTravel({registeredTravel:report},older,'new').source,'snapshot');
 const newer={...older,measuredAt:'2026-11-26T10:00:00Z'};assert.equal(selectRegisteredTravel({registeredTravel:report},newer,'new').source,'standalone');
});
test('old snapshots accept matching leaves and safely distinguish missing/stale/invalid data',()=>{
 const leaf={schema:'atlas-registered-travel/1',snapshotSha256:'old',worlds:[]};
 assert.equal(selectRegisteredTravel({},leaf,'old').status,'measured');assert.equal(selectRegisteredTravel({},leaf,'new').status,'stale');
 assert.equal(selectRegisteredTravel({},null,'new'),null);assert.equal(selectRegisteredTravel({},{}),null);
 assert.equal(selectRegisteredTravel({registeredTravel:leaf},null,null).status,'measured','an in-memory build has embedded evidence even before snapshot bytes exist');
});
