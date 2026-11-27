import test from 'node:test';
import assert from 'node:assert/strict';
import {charmMaterialActs,charmMaterialFacts,CHARM_MATERIAL_APPROVAL,CHARM_MATERIAL_ISSUE,CHARM_MATERIAL_ORDER,CHARM_MATERIAL_PAYER} from '../src/lotm_charm_materials.js';
import {SLUMBER_ROW,silverCharmActs} from '../src/lotm_silver_charms.js';
import {LOTM_CRAFT_ROWS} from '../src/lotm_craft_rows.js';
import {tingenSilverWorkshop} from '../src/lotm_amulet_crafting.js';
import {defineLotmActs} from '../src/lotm_act_engine.js';
import {LOTM_IDS} from '../src/book_world_lotm_ids.js';
const options={worldId:LOTM_IDS.world,actorId:'player',group:'book_lotm',situationId:LOTM_IDS.situation};
const compiled=()=>{const data=charmMaterialActs(tingenSilverWorkshop);return defineLotmActs(data.rows,data.bindings,options);};

test('ordinary approval creates a real order; office collection consumes it and returns the actual existing craft materials',()=>{
    const {commands,unbound}=compiled();assert.deepEqual(unbound,[]);
    const approve=commands.find(command=>command.id===CHARM_MATERIAL_APPROVAL+'.approve');
    const collect=commands.find(command=>command.id===CHARM_MATERIAL_ISSUE+'.collect');
    assert.equal(approve.location,'lotm.place.night-watch-reception');assert.equal(approve.duration,5);
    assert.deepEqual(approve.costs,[]);
    assert.equal(approve.effects.find(effect=>effect.type==='item').key,CHARM_MATERIAL_ORDER);
    assert.equal(collect.costs.find(effect=>effect.type==='item').key,CHARM_MATERIAL_ORDER);
    assert.equal(collect.costs.find(effect=>effect.type==='item').amount,-1);
    assert.deepEqual(collect.effects.filter(effect=>effect.type==='item').map(effect=>[JSON.parse(effect.key).id,effect.amount]),
        [['book.lotm.slumber_silver',1],['book.lotm.slumber_supplies',1]]);
    assert.ok(!collect.costs.some(effect=>effect.type==='resource'));
    assert.equal(collect.effects.find(effect=>effect.key===CHARM_MATERIAL_PAYER).value,'office');
    assert.match(collect.effects.find(effect=>effect.type==='knowledge').key,/^book\.lotm\./);
});

test('the local capacity is a dial depleted by completed approvals, independent of held or sold tickets',()=>{
    const state={actors:{player:{completed:{}}}};
    assert.equal(charmMaterialFacts(state)['charm.slumber.officeCredit'],1);
    state.actors.player.completed[CHARM_MATERIAL_APPROVAL+'.approve']=1;
    assert.equal(charmMaterialFacts(state)['charm.slumber.officeCredit'],0);
    assert.equal(charmMaterialFacts(state,{allocationPackets:3})['charm.slumber.officeCredit'],2);
    assert.equal(charmMaterialFacts(state,{allocationPackets:0})['charm.slumber.officeCredit'],0);
    assert.match(compiled().commands[0].requires.reason,/own money/);
});

test('personal purchase retains its price, delay and material keys and identifies its own payer',()=>{
    const source=LOTM_CRAFT_ROWS.rows.find(row=>row.id===SLUMBER_ROW);
    const data=silverCharmActs(source,tingenSilverWorkshop);
    const {commands}=defineLotmActs(data.rows,data.bindings,options);
    const purchase=commands.find(command=>command.id===SLUMBER_ROW+'-supplies.prepare');
    assert.equal(purchase.duration,35);
    assert.equal(purchase.costs.find(effect=>effect.type==='resource').amount,-96);
    assert.equal(purchase.effects.find(effect=>effect.key===CHARM_MATERIAL_PAYER).value,'personal');
    const office=compiled().commands.find(command=>command.id===CHARM_MATERIAL_ISSUE+'.collect');
    assert.deepEqual(purchase.effects.filter(effect=>effect.type==='item').map(effect=>effect.key),office.effects.filter(effect=>effect.type==='item').map(effect=>effect.key));
    const inscribe=commands.find(command=>command.id===SLUMBER_ROW+'.inscribe');
    assert.deepEqual(new Set(inscribe.costs.filter(effect=>effect.type==='item').map(effect=>effect.key)),new Set(office.effects.filter(effect=>effect.type==='item').map(effect=>effect.key)));
});
