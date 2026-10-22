import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry} from '../src/expedition_content.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {beginBodyRecord,bodyFacts,COLD_HARDENED,bodyFacultyActive} from '../src/body_progression.js';

function earn(){
 let p={state:initializeExpedition(createExpansionState(17)),external:{money:20},
  gameplay:{player:{inventory:{},skills:{'Cold resistance':{xp:0,enabled:true,parent:null}},reputation:{Village:0,Town:0}}},
  vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}};
 const context=()=>({actorId:'player',worldId:'base.frontier',external:p.external,gameplay:p.gameplay,vitals:p.vitals,
  facts:{location:'Village','village.elderMet':true,...bodyFacts(p.state)}});
 p=beginBodyRecord(p.state,expeditionRegistry,context());
 for(let i=0;i<3;i++){
  p=commitSimulationCommand(p.state,expeditionRegistry,{id:'body.cold_soak'},context());
  const minutes=p.state.simulation.jobs.find(j=>j.actorId==='player').due-p.state.clock;
  p={...advanceSimulation(p.state,expeditionRegistry,minutes,p.external,p.gameplay,{player:{vitals:p.vitals.player}}),vitals:structuredClone(p.vitals)};
 }
 p=commitSimulationCommand(p.state,expeditionRegistry,{id:'body.harden_cold'},context());
 return loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry);
}

test('replacing both actual body owners cannot activate an old bodily faculty on an untrained body',()=>{
 const s=earn(),earned=structuredClone(s.simulation.people.player.body),knowledge=structuredClone(s.simulation.knowledge.player['body.cold']);
 assert.equal(earned['skin.weathered'],true);
 const current=body=>({id:body.id||'native.player.body',form:body.form||'human',ownerId:'player',controllerId:'player'});
 assert.equal(bodyFacultyActive(s,COLD_HARDENED,current(earned)),true);
 s.simulation.people.player.body={...current(earned),id:'native.replacement.body'};
 const swapped=loadExpansionState(JSON.parse(JSON.stringify(s)),expeditionRegistry);
 assert.equal(bodyFacultyActive(swapped,COLD_HARDENED,current(swapped.simulation.people.player.body)),false);
 assert.deepEqual(swapped.simulation.knowledge.player['body.cold'],knowledge);
 swapped.simulation.people.player.body=earned;
 assert.equal(bodyFacultyActive(swapped,COLD_HARDENED,current(earned)),true);
});

test('unmarked provisional hardening never invents a physical body change',()=>{
 const s=earn();delete s.simulation.people.player.body['skin.weathered'];
 const body=s.simulation.people.player.body;
 assert.equal(bodyFacultyActive(s,COLD_HARDENED,{id:body.id||'native.player.body',form:body.form||'human',ownerId:'player',controllerId:'player'}),false);
 assert.equal(s.simulation.knowledge.player['body.cold'].stage,'understood');
});
