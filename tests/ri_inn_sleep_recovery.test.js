import test from 'node:test';
import assert from 'node:assert/strict';
import {beginRiInnSleepRecovery,stageSea} from '../src/ri_lead_sea_domain.js';
import {domainRegistry} from '../src/domain_registry.js';

const SEA='book.ri.lead.primeval',WORLD='book.ri.lead.world';
const domain=domainRegistry.list().find(row=>row.id==='ri_lead_sea');
function state(clock=1000){
 return {clock,actors:{player:{worldId:WORLD}},simulation:{
  people:{player:{body:{id:'earned-body',ownerId:'player',controllerId:'player'}}},
  knowledge:{player:{}},energies:{player:{[SEA]:{reserve:3,policy:{capacity:44}}}}
 }};
}
const settle=s=>stageSea({state:s});

test('legacy inn sleep starts at bedtime, persists and adds no household knowledge',()=>{
 domain.load(null);const s=state();const original=JSON.stringify(s);
 assert.equal(beginRiInnSleepRecovery(s),true);assert.equal(JSON.stringify(s),original);
 assert.deepEqual(domain.save(),{schema:1,at:1000,innSleepBodyId:'earned-body'});
 s.clock=1014;settle(s);assert.equal(s.simulation.energies.player[SEA].reserve,3);
 const saved=domain.save();domain.load(null);domain.load(saved);
 s.clock=1015;settle(s);assert.equal(s.simulation.energies.player[SEA].reserve,4);
 assert.deepEqual(s.simulation.knowledge.player,{});
 s.clock=1030;settle(s);assert.equal(s.simulation.energies.player[SEA].reserve,5);
 settle(s);assert.equal(s.simulation.energies.player[SEA].reserve,5,'same-clock retry adds nothing');
 s.clock=2000;settle(s);assert.equal(s.simulation.energies.player[SEA].reserve,44);
 s.clock=2010;settle(s);assert.equal(domain.save().at,2010,'full reserve banks no elapsed recovery');
});

test('already active recovery keeps its partial anchor when entering the inn bed',()=>{
 domain.load({schema:1,at:990});const s=state();
 s.simulation.knowledge.player['book.ri.lead.first_night_choice.started']={at:990};
 beginRiInnSleepRecovery(s);assert.equal(domain.save().at,990);
 s.clock=1005;settle(s);assert.equal(s.simulation.energies.player[SEA].reserve,4);
 beginRiInnSleepRecovery(s);assert.equal(domain.save().at,1005);
 domain.load({schema:1,at:900});const legacy=state();
 beginRiInnSleepRecovery(legacy);assert.equal(domain.save().at,1000,'inactive old anchor credits no pre-sleep time');
});

test('inn recovery follows the saved body and world, not unrelated bodies or lives',()=>{
 domain.load(null);const s=state();beginRiInnSleepRecovery(s);const saved=domain.save();
 s.clock=1060;s.simulation.people.player.body.id='other-body';settle(s);
 assert.equal(s.simulation.energies.player[SEA].reserve,3);
 domain.load(saved);s.simulation.people.player.body.id='earned-body';s.actors.player.worldId='base.frontier';settle(s);
 assert.equal(s.simulation.energies.player[SEA].reserve,3);
 assert.equal(beginRiInnSleepRecovery(s),false);
 domain.load(null);s.actors.player.worldId=WORLD;s.simulation.people.player.body.controllerId='other';
 assert.equal(beginRiInnSleepRecovery(s),false);assert.equal(domain.save(),undefined);
 domain.load({schema:1,at:1000});s.simulation.people.player.body.controllerId='player';settle(s);
 assert.equal(s.simulation.energies.player[SEA].reserve,3,'old schema1 anchors alone do not enable recovery');
 domain.load(null);
});
