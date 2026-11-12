import assert from 'node:assert/strict';
import test from 'node:test';
import {blackthornDepartureMishap, resolveTingenMishap} from '../src/lotm_amulet_protection.js';
import {amuletTrialCommands, settledAmuletEffects, TINGEN_AMULET_ID, TRIAL_AMULET_ID, TRIAL_AMULET_NOTE} from '../src/lotm_amulet_crafting.js';
import {replayCheck} from '../src/check_resolver.js';
import {loadNative} from './helpers/native_loader.mjs';

const worldId = 'book.lotm.tingen', commandId = 'book.lotm.kj3ap.carve-first';
const key = JSON.stringify({id:TINGEN_AMULET_ID});
function trial(age = 0) {
    const gameTime=23564+age;
    return {
        state:{clock:gameTime,actors:{player:{worldId,completed:{[commandId]:1}}},
            simulation:{knowledge:{player:{[commandId+'.seen']:{stage:'seen',at:23564,cause:'simulation:41',
                basis:{kind:'observation',attributedTo:'player'}}}}}},
        equipment:{player:{amulet:key}},
        incident:{kind:'ordinary-avoidable',id:'loose-step',target:11},
        drawAddress:{root:7,worldId,lifeId:'player',gameTime,eventId:'loose-step'}
    };
}

test('worn silver can avert a marginal mishap with the same draw, then wanes', () => {
    const input=trial();
    const bare=resolveTingenMishap({...input,equipment:{player:{}}});
    input.incident.target=bare.result.raw+1;
    const missed=resolveTingenMishap({...input,equipment:{player:{}}});
    const protectedResult=resolveTingenMishap(input);
    assert.equal(missed.result.raw,protectedResult.result.raw);
    assert.equal(missed.result.success,false);
    assert.equal(protectedResult.result.success,true);
    assert.equal(protectedResult.result.bonus,2);
    assert.deepEqual(replayCheck(protectedResult.receipt).result,protectedResult.result);
    assert.equal(resolveTingenMishap(trial(200*1440)).result.bonus,1);
    assert.equal(resolveTingenMishap(trial(365*1440)).result.bonus,0);
    assert.throws(()=>resolveTingenMishap({...input,incident:{...input.incident,kind:'ritual-backlash'}}),/ordinary avoidable/);
});

test('Blackthorn departure settles the marginal roll into a physical cost or an observed save note', () => {
    const {state,equipment} = trial();
    Object.assign(state,{clock:23586,rng:50271532});
    state.simulation.people={player:{location:'lotm.place.cast-0785d86b800a41be64ed',body:{id:'native.player.body'}}};
    state.simulation.situations={'book.lotm.tingen.canon_beside':{}};
    const missed = blackthornDepartureMishap(state,{});
    const saved = blackthornDepartureMishap(state,equipment);
    assert.equal(missed.receipt.result.raw,saved.receipt.result.raw);
    assert.deepEqual(missed.effects[0],{type:'vital',actor:'player',key:'stamina',amount:-2});
    assert.deepEqual(saved.effects.map(e=>e.type),['knowledge']);
    assert.match(saved.value,/amulet feels briefly warm/);
    state.simulation.knowledge.player[saved.receipt.check.id]={value:saved.value};
    assert.equal(blackthornDepartureMishap(state,equipment),null);
});

test('the native item factory and durability preserve the exact key accepted by the gift jobs', async () => {
    const n=await loadNative(`import './src/data/expedition_items.js';
      export {getItemFromKey,item_templates} from './src/items.js';
      export {equipmentDurability as durability} from './src/absorb_e2/durability.js';`,{logLevel:'error'});
    const amulet=n.getItemFromKey(key);
    assert.equal(amulet.equip_slot,'amulet');
    assert.equal(amulet.getInventoryKey(),key);
    assert.equal(n.item_templates[TINGEN_AMULET_ID].getInventoryKey(),key);
    n.durability.setEnabled(true);
    assert.equal(n.durability.prepareEquip(amulet,n.getItemFromKey).getInventoryKey(),key);
});

test('a worn back-first amulet uses the observation of its own binding', () => {
    const input = trial(400*1440);
    input.equipment.player.amulet = JSON.stringify({id:TRIAL_AMULET_ID});
    assert.equal(resolveTingenMishap(input).result.bonus,0);
    input.state.simulation.knowledge.player[TRIAL_AMULET_NOTE]={at:input.state.clock};
    assert.equal(resolveTingenMishap(input).result.bonus,2);
    input.state.simulation.knowledge.player[TRIAL_AMULET_NOTE].at-=365*1440;
    assert.equal(resolveTingenMishap(input).result.bonus,0);
});

test('repeat binding preserves the legacy anchor and gives each worn piece its own age', () => {
    const input=trial(400*1440);
    const known=input.state.simulation.knowledge.player;
    const command=amuletTrialCommands('book.lotm.tingen.canon_beside').find(c=>c.id.endsWith('.reverse'));
    assert.equal(command.once,false);
    const job={id:'simulation:51',commandId:command.id,costs:command.costs,effects:command.effects};
    known[TRIAL_AMULET_NOTE]={at:23564};
    const old=settledAmuletEffects(job,{...input.state,clock:23564});
    const recent=settledAmuletEffects({...job,id:'simulation:52'},input.state);
    assert.notEqual(old[0].key,recent[0].key);
    assert.notEqual(recent[0].key,settledAmuletEffects({...job,id:'simulation:53'},input.state)[0].key);
    assert.equal(recent[1].key,TRIAL_AMULET_NOTE+'.latest');
    assert.equal(command.effects[0].key,JSON.stringify({id:TRIAL_AMULET_ID}));
    for(const [key,bonus] of [[old[0].key,0],[recent[0].key,2],[command.effects[0].key,0]]){
        input.equipment.player.amulet=key;
        assert.equal(resolveTingenMishap(input).result.bonus,bonus);
    }
});
