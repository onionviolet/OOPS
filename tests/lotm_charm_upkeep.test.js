import test from 'node:test';
import assert from 'node:assert/strict';
import {charmCohorts,charmStrength,charmUpkeepFacts,settledCharmCohorts,charmLedgerKey,CHARM_REVIEW_MINUTES,CHARM_MENTOR_ID} from '../src/lotm_charm_upkeep.js';
import {SLUMBER_ROW,SLUMBER_UPKEEP,silverCharmActs,settledSilverCharmEffects} from '../src/lotm_silver_charms.js';
import {LOTM_CRAFT_ROWS} from '../src/lotm_craft_rows.js';
import {tingenSilverWorkshop} from '../src/lotm_amulet_crafting.js';
import {defineLotmActs} from '../src/lotm_act_engine.js';
import {LOTM_IDS} from '../src/book_world_lotm_ids.js';
const key=JSON.stringify({id:'book.lotm.slumber_charm'}), config={rowId:SLUMBER_ROW,key,slug:'slumber'};
const state=(rows=[],clock=CHARM_REVIEW_MINUTES)=>({clock,sequence:7,actors:{player:{facts:{[charmLedgerKey('slumber')]:rows}}},
    simulation:{people:{player:{location:'room'},[CHARM_MENTOR_ID]:{life:'alive',location:'room'}},conditions:{}}});
const job=commandId=>({commandId,id:'simulation:8',actorId:'player'});

test('a fading charm retains a positive, graduated use and its unrecorded legacy counterpart keeps current behavior',()=>{
    assert.equal(charmStrength({at:CHARM_REVIEW_MINUTES},CHARM_REVIEW_MINUTES).minutes,5);
    assert.equal(charmStrength({at:CHARM_REVIEW_MINUTES/2},CHARM_REVIEW_MINUTES).minutes,4);
    assert.equal(charmStrength({at:0},CHARM_REVIEW_MINUTES).minutes,2);
    assert.equal(charmStrength({at:0},CHARM_REVIEW_MINUTES*5).minutes,2);
    const legacy=charmCohorts(state(),{[key]:1},key,'slumber');
    assert.equal(legacy[0].at,null);
    assert.deepEqual(charmStrength(legacy[0],CHARM_REVIEW_MINUTES),{minutes:5,state:'unrecorded',needsUpkeep:true});
});

test('sale/drop clips outgoing oldest stock, incoming transfers stay unrecorded, and a reserved charm is preserved',()=>{
    const s=state([{id:'old',at:0},{id:'middle',at:100},{id:'new',at:200}]);
    assert.deepEqual(charmCohorts(s,{[key]:1},key,'slumber'),[{id:'new',at:200}]);
    assert.deepEqual(charmCohorts(s,{},key,'slumber'),[]);
    const incoming=charmCohorts(s,{[key]:4},key,'slumber');
    assert.equal(incoming.length,4); assert.equal(incoming[0].at,null);
    assert.deepEqual(charmCohorts(s,{[key]:1},key,'slumber',{reserved:1}),[{id:'old',at:0},{id:'new',at:200}]);
    assert.equal(s.actors.player.facts[charmLedgerKey('slumber')].length,3,'a quote does not mutate saved facts');
});

test('completion maintains one reserved original cohort and later use removes it',()=>{
    const s=state([{id:'physical-silver-1',at:0}]);
    const renewed=settledCharmCohorts(job(SLUMBER_UPKEEP+'.renew'),s,{},config);
    assert.deepEqual(JSON.parse(renewed.effects[0].value),[{id:'physical-silver-1',at:s.clock}]);
    s.actors.player.facts[charmLedgerKey('slumber')]=renewed.effects[0].value;
    assert.equal(charmStrength(JSON.parse(renewed.effects[0].value)[0],s.clock).minutes,5);
    assert.deepEqual(JSON.parse(settledCharmCohorts(job(SLUMBER_ROW+'-use.activate'),s,{},config).effects[0].value),[]);
    assert.equal(settledCharmCohorts(job('unrelated'),s,{},config),null);
});

test('readiness rechecks native stock, fresh state and actual awake mentor presence',()=>{
    const s=state([{id:'aged',at:0}]),context={gameplay:{player:{inventory:{[key]:1}}}};
    assert.deepEqual(charmUpkeepFacts(s,context,config),{'charm.slumber.needsUpkeep':true,'charm.slumber.mentorAvailable':true});
    assert.equal(charmUpkeepFacts(s,{...context,charmPresence:()=>()=>null},config)['charm.slumber.mentorAvailable'],false);
    s.simulation.conditions[CHARM_MENTOR_ID]={'book.lotm.charm-slumber':{expiresAt:s.clock+1}};
    assert.equal(charmUpkeepFacts(s,context,config)['charm.slumber.mentorAvailable'],false);
    assert.equal(charmUpkeepFacts(s,{gameplay:{player:{inventory:{}}}},config)['charm.slumber.needsUpkeep'],false);
    s.actors.player.facts[charmLedgerKey('slumber')]=[{id:'fresh',at:s.clock}];
    assert.equal(charmUpkeepFacts(s,context,config)['charm.slumber.needsUpkeep'],false);
});

test('native act binding reserves and returns exactly one charm, spends spirituality and checks mentor at completion',()=>{
    const source=LOTM_CRAFT_ROWS.rows.find(row=>row.id===SLUMBER_ROW);
    const {rows,bindings}=silverCharmActs(source,tingenSilverWorkshop);
    const compiled=defineLotmActs(rows,bindings,{worldId:LOTM_IDS.world,actorId:'player',group:'book_lotm',situationId:LOTM_IDS.situation});
    assert.deepEqual(compiled.unbound,[]);
    const renew=compiled.commands.find(command=>command.id===SLUMBER_UPKEEP+'.renew');
    assert.equal(renew.duration,10); assert.equal(renew.cancellation,'refund');
    assert.equal(renew.costs.find(effect=>effect.type==='item').amount,-1);
    assert.equal(renew.effects.find(effect=>effect.type==='item').amount,1);
    assert.equal(renew.costs.find(effect=>effect.type==='energy').operation,'use');
    assert.equal(renew.effects.find(effect=>effect.type==='knowledge').key,'book.lotm.history.slumber.renewed','Klein’s existing Notebook consumes the success report');
    assert.match(JSON.stringify(renew.completionRequires),/mentorAvailable/);
    assert.ok(!renew.effects.some(effect=>effect.type==='resource'),'no fee or money reward is invented');
});
