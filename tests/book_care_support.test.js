import test from 'node:test';
import assert from 'node:assert/strict';
import {bookCareEffectsSupported, bookCareSupportedBody, bookCareCondition, bookCareFacts, projectBookCareEffects} from '../src/book_care_facts.js';
import {BOOK_CARE_IDS as I, bookCareCommand, bookCareDefinitions} from '../src/book_care_content.js';
import {PARADISE_IDS as P, PARADISE_LOCATIONS as L} from '../src/book_world_paradise_ids.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {bodyConditions} from '../src/body_progression.js';

// Named synthetic fixed-body fixture. No player saves or source-canon stats.
export function retainedCareFixture() {
    const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
    const state={clock:10,sequence:1,actors:{player:{worldId:P.hub,facts:{[I.prefix+'enrolled']:true},completed:{[I.hubBegin]:1}}},
        bookWorldCampaign:{schema:1,bodyPolicy:'same_native_body',nativeRevision:7,activeVisitId:'care.test.visit',
            visits:[{id:'care.test.visit',status:'active',actorId:'player',endpoint:{worldId:P.hub}}]},
        simulation:{people:{player:{life:'alive',inventory:'native',location:L.hub,body}},conditions:{player:{}},knowledge:{player:{}}}};
    const context={actorId:'player',nativeAlive:true,paradiseNative:{bound:true,revision:7,body:structuredClone(body)},
        vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}};
    const registry={simulation:{conditions:new Map([...bookCareDefinitions.conditions,...bodyConditions].map(d=>[d.id,d]))}};
    const plan={state,vitals:context.vitals};
    const strain=bookCareCommand('book.care.hub.pack_hurried').effects.filter(e=>e.type==='condition');
    applySimulationEffects(plan,strain,context,registry,'simulation:1');
    return {state,context,registry,plan};
}
const effect=f=>projectBookCareEffects(f.state,f.registry,f.context)['simulation:'+I.strain];

test('native stat-reader body/alive frame keeps strain without requesting its own projected vitals',()=>{
    const f=retainedCareFixture();
    f.context={nativeAlive:true,nativeBody:structuredClone(f.state.simulation.people.player.body)};
    assert.equal(effect(f).effects.stats.dexterity.multiplier,0.9);
});

test('native binding loss suppresses existing strain exactly as the care/work support reader does',()=>{
    for(const change of [f=>{f.context.paradiseNative.bound=false;},f=>{f.context.paradiseNative.revision++;}]) {
        const f=retainedCareFixture(),record=structuredClone(f.state.simulation.conditions.player[I.strain]);
        assert.equal(effect(f).effects.stats.dexterity.multiplier,0.9);
        change(f);
        assert.equal(bookCareSupportedBody(f.state,f.context),false);
        assert.equal(bookCareEffectsSupported(f.state,f.context),false);
        assert.deepEqual(projectBookCareEffects(f.state,f.registry,f.context),{});
        assert.deepEqual(f.state.simulation.conditions.player[I.strain],record,'suppression preserves the carrier record');
        f.context.paradiseNative.bound=true;f.context.paradiseNative.revision=7;
        assert.equal(effect(f).effects.stats.stamina_efficiency.multiplier,0.92);
    }
});

test('body identity, world visit, life and actual faculties suppress expression without migrating the condition',()=>{
    for(const change of [f=>{f.state.simulation.people.player.body.id='borrowed.body';},
        f=>{f.context.paradiseNative.body.id='borrowed.body';},f=>{f.state.actors.player.worldId='base.frontier';},
        f=>{f.state.bookWorldCampaign.visits[0].status='ended';},f=>{f.state.simulation.people.player.life='dead';},
        f=>{f.context.paradiseNative.body.hands=0;},f=>{f.context.nativeAlive=false;}]) {
        const f=retainedCareFixture();change(f);
        assert.deepEqual(projectBookCareEffects(f.state,f.registry,f.context),{});
        assert.ok(bookCareCondition(f.state,I.strain));
    }
});

test('full HP retains the functional strain, and authored time-only recovery removes it independently of vitals',()=>{
    const f=retainedCareFixture();
    assert.equal(bookCareFacts(f.state,f.context)['bookCare.handsUsable'],false);
    assert.ok(effect(f));
    const before=structuredClone(f.context.vitals);
    const rest=bookCareCommand('book.care.hub.rest');
    assert.equal(rest.duration,4);assert.deepEqual(rest.costs,[]);
    applySimulationEffects(f.plan,rest.effects.filter(e=>e.type==='condition'),f.context,f.registry,'simulation:2');
    assert.equal(bookCareFacts(f.state,f.context)['bookCare.handsUsable'],true);
    assert.equal(effect(f),undefined);assert.deepEqual(f.context.vitals,before);
});

test('expiry equality and batch versus stepped JSON reload agree, including unsupported elapsed time',()=>{
    const f=retainedCareFixture(),expiry=f.state.simulation.conditions.player[I.strain].expiresAt;
    f.state.clock=expiry-1;assert.equal(effect(f).duration,1);
    const batch=structuredClone(f); // registry Maps survive structured cloning
    batch.state.clock=expiry;assert.equal(effect(batch),undefined);
    let stepped=retainedCareFixture();stepped.context.paradiseNative.bound=false;
    while(stepped.state.clock<expiry) {
        stepped.state=JSON.parse(JSON.stringify(stepped.state));stepped.state.clock++;
        assert.equal(effect(stepped),undefined);
    }
    stepped.context.paradiseNative.bound=true;
    assert.equal(effect(stepped),undefined,'restoring support cannot renew expired preparation or harm');
    assert.deepEqual(stepped.state,batch.state);
});
