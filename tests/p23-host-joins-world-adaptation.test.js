import test from 'node:test';
import assert from 'node:assert/strict';
import {createSimulationState} from '../src/simulation_contracts.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {expeditionRegistry,initializeExpedition} from '../src/expedition_content.js';
import {mistglassProfile as P} from '../src/absorb_p23/world_adaptation/index.js';
import {registerMistglassNative,mistglassContext,stageMistglassTravel,stageMistglassTeaching,stageMistglassAdvance,stageMistglassTrial,mistglassReserve,mistglassNextBoundary,validateMistglassEnvelope,stageMistglassRestock} from '../src/absorb_p23/host_joins/world_adaptation.js';
registerMistglassNative(expeditionRegistry);
const key=JSON.stringify({id:P.doseItemId});
const native={body:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player'},alive:true,location:P.locationId,optIn:true};
function plan(){const state=initializeExpedition(createExpansionState(72));state.simulation=createSimulationState(72);state.simulation.people.player={life:'alive',inventory:'native',location:'Village'};return {state,gameplay:{player:{inventory:{[key]:4},skills:{Meditation:{xp:0,enabled:true}},reputation:{}}},external:{money:20}};}
function enrolled(){const p=plan();p.state.sequence++;stageMistglassTravel(p,'enter');stageMistglassTeaching(p,mistglassContext(p.state,native),expeditionRegistry);return p;}
function advance(p,t){const c=mistglassContext(p.state,native);p.state.clock=t;stageMistglassAdvance(p,c,expeditionRegistry);return p;}
function envelope(p){return {expansion:p.state,'current location':p.nativeLocation};}
test('old absence stays absent; real retained world enrollment owns native energy',()=>{
    const p=plan();validateMistglassEnvelope(envelope(p));assert.equal(p.state.worldAdaptation,undefined);assert.equal(mistglassReserve(p.state),undefined);
    p.state.sequence++;stageMistglassTravel(p,'enter');assert.equal(p.state.worldAdaptation,undefined);
    stageMistglassTeaching(p,mistglassContext(p.state,native),expeditionRegistry);assert.equal(mistglassReserve(p.state),0);validateMistglassEnvelope(envelope(p));
    assert.equal(p.state.mistglassRealm.instance.worldId,P.worldId);assert.equal(p.state.mistglassRealm.visits[0].status,'active');
});
test('played fractional accrual and saved seeded trial debit actual gameplay dose',()=>{
    const p=advance(enrolled(),16);assert.equal(mistglassReserve(p.state),2000);
    const before=structuredClone(p.state.streams);stageMistglassTrial(p,mistglassContext(p.state,native),expeditionRegistry,{doseKey:key});
    assert.equal(p.gameplay.player.inventory[key],3);assert.equal(mistglassReserve(p.state),0);assert.notDeepEqual(p.state.streams,before);
    assert.equal(p.state.worldAdaptation.pending.dueAt,28);assert.equal(mistglassNextBoundary(p.state,100),28);validateMistglassEnvelope(envelope(p));
    const saved=structuredClone(p);assert.throws(()=>stageMistglassTrial(p,mistglassContext(p.state,native),expeditionRegistry,{doseKey:key}),/already pending/);assert.deepEqual(p,saved);
});
test('success commits native Meditation XP once and rawness blocks the next exposure segment',()=>{
    for(const roll of [0,9999]){
        const p=advance(enrolled(),16);stageMistglassTrial(p,mistglassContext(p.state,native),expeditionRegistry,{doseKey:key});p.state.worldAdaptation.pending.roll=roll;
        advance(p,28);validateMistglassEnvelope(envelope(p));const xp=p.gameplay.player.skills.Meditation.xp;
        assert.equal(xp,roll===0?30:0);stageMistglassAdvance(p,mistglassContext(p.state,native),expeditionRegistry);assert.equal(p.gameplay.player.skills.Meditation.xp,xp);
        if(roll){const reserve=mistglassReserve(p.state);assert.equal(mistglassNextBoundary(p.state,50),34);advance(p,34);assert.equal(mistglassReserve(p.state),reserve);advance(p,35);assert.equal(mistglassReserve(p.state),reserve+125);}
    }
});
test('unsupported families and unbound resources reject without native mutation',()=>{
    const p=enrolled(),before=structuredClone(p);p.state.worldAdaptation.schema=2;assert.throws(()=>validateMistglassEnvelope(envelope(p)),/schema/);p.state=before.state;
    p.state.worldAdaptation.instanceId='other';assert.throws(()=>validateMistglassEnvelope(envelope(p)),/retained/);
    p.state=structuredClone(before.state);delete p.state.worldAdaptation;assert.throws(()=>validateMistglassEnvelope(envelope(p)),/together/);
});
test('native merchant refresh stages same owner stock after sixty played minutes',()=>{
    const p=enrolled();assert.equal(stageMistglassRestock(p),false);assert.equal(stageMistglassRestock(p,{forceInitial:true}),true);assert.deepEqual(p.ownership['p23.mistglass.keeper'],{[key]:4});
    advance(p,59);assert.equal(stageMistglassRestock(p),false);advance(p,60);assert.equal(stageMistglassRestock(p),true);assert.equal(p.state.mistglassRealm.lastRestock,60);
});
test('native passage closes retained visit; same-clock new context interrupts without refund',()=>{
    const p=advance(enrolled(),16);stageMistglassTrial(p,mistglassContext(p.state,native),expeditionRegistry,{doseKey:key});stageMistglassTravel(p,'exit');
    stageMistglassAdvance(p,mistglassContext(p.state,{...native,location:'Village'}),expeditionRegistry);
    assert.equal(p.state.worldAdaptation.last.reason,'interrupted');assert.equal(p.gameplay.player.inventory[key],3);assert.equal(p.state.mistglassRealm.activeVisitId,null);validateMistglassEnvelope(envelope(p));
});
