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
function plan(seed=72){const state=initializeExpedition(createExpansionState(seed));state.simulation=createSimulationState(72);state.simulation.people.player={life:'alive',inventory:'native',location:'Village'};return {state,gameplay:{player:{inventory:{[key]:4},skills:{Meditation:{xp:0,enabled:true}},reputation:{Village:0}}},external:{money:20}};}
function enrolled(seed=72){const p=plan(seed);p.state.sequence++;stageMistglassTravel(p,'enter');stageMistglassTeaching(p,mistglassContext(p.state,native),expeditionRegistry);return p;}
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

import {stageMistglassSluice,knownMistglassView} from '../src/absorb_p23/host_joins/world_adaptation.js';
test('sluice work debits native condensate, pays native coins once and rejects a stale quote',()=>{
    let p;for(let seed=1;seed<40;seed++){p=enrolled(seed);if(p.state.mistglassRealm.history.id==='keeper-built')break;}advance(p,16);const c=mistglassContext(p.state,native);
    assert.equal(knownMistglassView(p.state,c,key).sluice.cost,2000);
    const stale={...p,state:structuredClone(p.state),external:{...p.external}};stale.state.worldAdaptation.revision++;
    stageMistglassSluice(p,c,expeditionRegistry);
    assert.equal(mistglassReserve(p.state),0);assert.equal(p.external.money,22);assert.equal(p.state.worldAdaptation.sluice.cleared,1);
    validateMistglassEnvelope(envelope(p));
    const saved=structuredClone(p);assert.throws(()=>stageMistglassSluice(p,c,expeditionRegistry),/runs clear/);assert.deepEqual(p,saved);
    const changed=enrolled();changed.state.mistglassRealm.history.id='keeper-built';advance(changed,16);changed.state.simulation.energies.player[P.resourceId].reserve=1000;
    assert.throws(()=>stageMistglassSluice(changed,mistglassContext(changed.state,native),expeditionRegistry),/Needs 2/);
    const noPurse=enrolled();noPurse.state.mistglassRealm.history.id='keeper-built';advance(noPurse,16);delete noPurse.external;
    assert.throws(()=>stageMistglassSluice(noPurse,mistglassContext(noPurse.state,native),expeditionRegistry),/coin owner/);
});

// E5a: a fixed instance past decides who holds the sluice; it is drawn once and saved.
import {mistglassHistoryAccount} from '../src/absorb_p23/host_joins/world_adaptation.js';
test('instance history is drawn once from the save seed, survives reload and changes who the sluice work answers to',()=>{
    const histories=new Map();
    for(let seed=1;seed<40&&histories.size<2;seed++){
        const p=(()=>{const state=initializeExpedition(createExpansionState(seed));state.simulation=createSimulationState(seed);state.simulation.people.player={life:'alive',inventory:'native',location:'Village'};return {state,gameplay:{player:{inventory:{[key]:4},skills:{Meditation:{xp:0,enabled:true}},reputation:{Village:0}}},external:{money:20}};})();
        p.state.sequence++;stageMistglassTravel(p,'enter');const h=p.state.mistglassRealm.history;
        if(!histories.has(h.id))histories.set(h.id,p);
    }
    assert.deepEqual([...histories.keys()].sort(),['keeper-built','mill-race'],'two different histories occur across seeds');
    for(const [id,p] of histories){
        assert.equal(mistglassHistoryAccount(p.state),null,'unknown until heard');
        stageMistglassTeaching(p,mistglassContext(p.state,native),expeditionRegistry);advance(p,16);
        const saved=JSON.parse(JSON.stringify(p.state));validateMistglassEnvelope({expansion:saved,'current location':P.locationId});
        assert.deepEqual(saved.mistglassRealm.history,p.state.mistglassRealm.history,'reload reads, never redraws');
        assert.match(mistglassHistoryAccount(p.state),id==='mill-race'?/mill race/:/grandmother/);
        stageMistglassSluice(p,mistglassContext(p.state,native),expeditionRegistry);
        if(id==='mill-race'){assert.equal(p.external.money,20);assert.equal(p.gameplay.player.reputation.Village,1);}
        else{assert.equal(p.external.money,22);assert.equal(p.gameplay.player.reputation.Village,0);}
        stageMistglassTravel(p,'exit');advance(p,30);p.state.sequence++;stageMistglassTravel(p,'enter');assert.equal(p.state.mistglassRealm.history.id,id,'re-entry keeps the past');
    }
    const legacy=enrolled();delete legacy.state.mistglassRealm.history;validateMistglassEnvelope(envelope(legacy));
    advance(legacy,16);stageMistglassSluice(legacy,mistglassContext(legacy.state,native),expeditionRegistry);assert.equal(legacy.external.money,22,'old realms keep the original keeper wage');
    const bad=enrolled();bad.state.mistglassRealm.history.id='invented';assert.throws(()=>validateMistglassEnvelope(envelope(bad)),/history/);
});
test('D3: a capped purification quote reports its surplus and the saved drill takes it; uncapped and legacy paths are untouched',()=>{
    const quote=(cap,seen)=>(_id,n,report)=>{const kept=Math.min(n,cap);if(n>kept){seen.push(n-kept);report?.(n-kept);}return kept;};
    const run=(cap,method)=>{
        const p=advance(enrolled(),16);if(method)p.state.worldAdaptation.techniques={schema:1,selected:method,minutes:{breath:0,settling:0}};
        stageMistglassTrial(p,mistglassContext(p.state,native),expeditionRegistry,{doseKey:key,quoteXP:quote(cap,[])});p.state.worldAdaptation.pending.roll=0;
        const c=mistglassContext(p.state,native);p.state.clock=28;stageMistglassAdvance(p,c,expeditionRegistry,{quoteXP:quote(cap,[])});validateMistglassEnvelope(envelope(p));return p;};
    const capped=run(10,'breath'),t=capped.state.worldAdaptation.techniques;
    assert.equal(capped.gameplay.player.skills.Meditation.xp,10,'the cap itself is unchanged');
    assert.equal(t.minutes.breath,4);assert.equal(t.insight.last.excess,20);assert.equal(t.insight.minutes*5+t.insight.carry+t.insight.lost,20);
    const open=run(10);assert.equal(open.state.worldAdaptation.techniques.insight.lost,20,'open-mist has no drill: the surplus fades and is counted');
    const free=run(100,'breath');assert.equal(free.state.worldAdaptation.techniques.insight,undefined,'no surplus, no record');
});
