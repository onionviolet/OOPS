import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation,loadExpansionState,createContentRegistry} from '../src/expansion_engine.js';
import {expeditionRegistry,initializeExpedition} from '../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand,respondSimulationEvent,waitingSimulationChoice,simulationFacts,previewSimulationResponse} from '../src/simulation.js';
import {storyletCandidates,validateStoryletState,STORYLET_DECKS,storyletTemper} from '../src/storylet_deck.js';
import {storyletEvents} from '../src/storylet_content.js';
import {encodeSaveFile,decodeSaveFile,importSaveFile} from '../src/save_files.js';
const registry=expeditionRegistry;
const skills=()=>Object.fromEntries(['Perception','Pest killing'].map(k=>[k,{xp:0,enabled:true}]));
function fixture(seed=73){
    let state=initializeExpedition(createExpansionState(seed));
    const context={actorId:'player',facts:{location:'Village','village.elderMet':true},external:{money:102},gameplay:{player:{inventory:{},skills:skills(),reputation:{}},oldCraftsman:{inventory:{},skills:{},reputation:{}}}};
    state=enrollSimulation(state,registry,context).state;
    const out=commitSimulationCommand(state,registry,{id:'village.storylets.begin'},context);
    return {...out,context};
}
const advance=(out,minutes)=>{const next=advanceSimulation(out.state,registry,minutes,out.external,out.gameplay,{player:{...out.context,external:out.external,gameplay:out.gameplay}});return {...next,context:out.context};};
const cards=out=>Object.values(out.state.simulation.events).filter(e=>e.storylet);
const factsFor=out=>d=>simulationFacts(out.state,{...out.context,external:out.external,gameplay:out.gameplay,targetId:d.targetId},registry);

test('same save seed and played ticks draw the same competing deck; other seed varies',()=>{
    const a=advance(fixture(73),180),b=advance(fixture(73),180),c=advance(fixture(74),180);
    assert.deepEqual(a.state.simulation.decks,b.state.simulation.decks);assert.deepEqual(cards(a),cards(b));
    assert.notDeepEqual(cards(a).map(e=>e.definitionId),cards(c).map(e=>e.definitionId));
    assert.ok(new Set(cards(a).map(e=>e.definitionId)).size>=5);
    assert.equal(cards(a).filter(e=>e.at===12).length<=1,true);
});
test('previews do not consume draws; cooldown, duplicate open and once filters apply',()=>{
    let out=advance(fixture(),36);const before=structuredClone(out.state.simulation.decks);
    for(let i=0;i<5;i++)storyletCandidates(out.state,registry,'village.daily',factsFor(out));
    assert.deepEqual(out.state.simulation.decks,before);
    for(const event of cards(out))assert.ok(!storyletCandidates(out.state,registry,event.storylet.deck,factsFor(out)).some(c=>c.definition.id===event.definitionId));
    const record=out.state.simulation.decks['village.daily'];record.cards['village.cow_on_the_road']={seen:1,last:out.state.clock};
    assert.ok(!storyletCandidates(out.state,registry,'village.daily',factsFor(out)).some(c=>c.definition.id==='village.cow_on_the_road'));
    out.state.clock+=72;
    assert.ok(storyletCandidates(out.state,registry,'village.daily',factsFor(out)).some(c=>c.definition.id==='village.cow_on_the_road'));
    record.cards['village.stray_dog']={seen:1,last:0};
    assert.ok(!storyletCandidates(out.state,registry,'village.daily',factsFor(out)).some(c=>c.definition.id==='village.stray_dog'));
});
test('requirements gate callbacks and owned rope; only explicit help grants consequences',()=>{
    const out=fixture();let candidates=storyletCandidates(out.state,registry,'village.people',factsFor(out));
    assert.ok(!candidates.some(c=>c.definition.id==='village.roof_gives_way'));
    out.state.actors['storylet.neighbor'].resources.roof_neglect=3;
    candidates=storyletCandidates(out.state,registry,'village.people',factsFor(out));assert.ok(candidates.some(c=>c.definition.id==='village.roof_gives_way'));
    out.state.actors.player.facts['storylet.roof.fixed']=true;
    assert.ok(!storyletCandidates(out.state,registry,'village.people',factsFor(out)).some(c=>c.definition.id==='village.roof_gives_way'));
    out.gameplay.player.inventory[JSON.stringify({id:'Survey rope'})]=1;
    assert.ok(!storyletCandidates(out.state,registry,'village.chances',factsFor(out)).some(c=>c.definition.id==='village.peddler_with_rope'));
});
test('pending nonblocking decision survives restore with exact next draws and expires safely',()=>{
    let out=advance(fixture(),36);const decision=cards(out).find(e=>e.mode==='decision'&&e.status==='open');assert.ok(decision);
    assert.equal(waitingSimulationChoice(out.state),undefined);
    const restored={...out,state:loadExpansionState(JSON.parse(JSON.stringify(out.state)),registry)};
    validateStoryletState(restored.state);assert.deepEqual(cards(restored),cards(out));
    const a=advance(out,48),b=advance(restored,48);assert.deepEqual(a.state.simulation.decks,b.state.simulation.decks);assert.deepEqual(cards(a),cards(b));
    const expired=advance(out,100);assert.ok(expired.state.clock===136);assert.equal(expired.state.simulation.events[decision.id].status,'expired');
    assert.ok(expired.external.money>=out.external.money,'expiry does not spend player coins');
    assert.deepEqual(expired.gameplay.player.inventory,{});
});
test('ordinary decisions still globally pause; opt-out saves have no new deck',()=>{
    const out=fixture();const decision={id:'ordinary',definitionId:'village.shower',actorId:'player',mode:'decision',at:0,expiresAt:null,status:'open',discoveredBy:['player'],responses:[],onExpire:[]};
    out.state.simulation.events.ordinary=decision;assert.equal(waitingSimulationChoice(out.state),decision);
    assert.equal(advance(out,20).state.clock,0);
    let state=initializeExpedition(createExpansionState(12));const ctx=out.context;state=enrollSimulation(state,registry,ctx).state;
    const before=structuredClone(state);validateStoryletState(state);assert.deepEqual(state,before);assert.equal(state.simulation.decks,undefined);
});
test('all 18 cards have validated real effects and a free safe response; costs cannot be preview-farmed',()=>{
    assert.equal(storyletEvents.length,18);assert.equal(STORYLET_DECKS.length,4);
    for(const definition of storyletEvents){
        const out=fixture();out.state.actors['storylet.neighbor'].resources.debt=40;
        if(definition.mode==='ambient'){assert.ok(definition.effects.length);continue;}
        const event={id:'test.event',definitionId:definition.id,actorId:'player',targetId:'storylet.neighbor',mode:definition.mode,at:0,expiresAt:90,status:'open',discoveredBy:['player'],responses:structuredClone(definition.responses),onExpire:definition.onExpire};
        out.state.simulation.events[event.id]=event;
        const free=event.responses.find(r=>!r.costs.length&&!r.requires);assert.ok(free);
        const before=structuredClone(out.state);
        const preview=previewSimulationResponse(out.state,registry,{kind:'event',eventId:event.id,responseId:free.id},out.context);assert.equal(preview.eligible,true,definition.id+': '+preview.reasons);
        assert.deepEqual(out.state,before);
        const response=respondSimulationEvent(out.state,registry,event.id,free.id,out.context);
        assert.equal(response.state.simulation.events[event.id].status,'resolved');assert.notDeepEqual(response.state,out.state);
        assert.throws(()=>respondSimulationEvent(response.state,registry,event.id,free.id,out.context),/unavailable/);
    }
});
test('literal encoding/import preserves pending deck state; corrupt RNG rejects without write',async()=>{
    const out=advance(fixture(),36);const envelope={'game version':'v0.5.5.30','current time':{year:999,month:4,day:1,hour:8,minute:36},'current location':'Village',character:{name:'TEST FIXTURE PROCGEN P3 SOURCE',money:102,xp:{total_xp:0},inventory:{},equipment:{}},skills:{},locations:{},activities:{},dialogues:{},traders:{},expansion:out.state};
    const encoded=encodeSaveFile(JSON.stringify(envelope));const loaded=decodeSaveFile(encoded,'v0.5.5.30');assert.deepEqual(loaded.expansion.simulation.decks,out.state.simulation.decks);
    const storage={writes:0,setItem(){this.writes++;}};
    await importSaveFile(encoded,{currentVersion:'v0.5.5.30',preflight:save=>loadExpansionState(save.expansion,registry),storage,key:'save data'});assert.equal(storage.writes,1);
    envelope.expansion.simulation.decks['village.daily'].rng=0;
    await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify(envelope)),{currentVersion:'v0.5.5.30',preflight:()=>assert.fail('bad state must reject first'),storage,key:'save data'}),/storylet/);assert.equal(storage.writes,1);
});

// VC12: an evening fitted to what the player is doing, and a temper dial.
const evening=(out,facts)=>({...out,context:{...out.context,facts:{...out.context.facts,...facts}}});
const drawn=out=>Object.values(out.state.simulation.decks).reduce((n,d)=>n+d.drawn,0);
test('an evening on watch draws the lantern card; helping opens a paid follow-up; reload keeps the draw',()=>{
    const base=fixture(73);
    assert.ok(!storyletCandidates(base.state,registry,'village.daily',factsFor(evening(base,{'village.watching':true,'day.hour':16}))).some(c=>c.definition.id==='village.watch_lantern'));
    assert.ok(!storyletCandidates(base.state,registry,'village.daily',factsFor(evening(base,{'village.watching':false,'day.hour':18}))).some(c=>c.definition.id==='village.watch_lantern'));
    const watch=evening(base,{'village.watching':true,'day.hour':18});
    // Play the evening in 12-minute steps and answer while the card is open.
    let out=watch,lantern;
    for(let m=0;m<180&&!lantern;m+=12){out=advance(out,12);lantern=cards(out).find(e=>e.definitionId==='village.watch_lantern'&&e.status==='open');}
    assert.ok(lantern,'one played evening draws the fitted card');
    const restored={...out,state:loadExpansionState(JSON.parse(JSON.stringify(out.state)),registry)};
    assert.deepEqual(cards(restored),cards(out));assert.deepEqual(advance(restored,60).state.simulation.decks,advance(out,60).state.simulation.decks);
    assert.ok(!storyletCandidates(out.state,registry,'village.chances',factsFor(out)).some(c=>c.definition.id==='village.lamplighter_wicks'));
    const helped=respondSimulationEvent(out.state,registry,lantern.id,'steady',out.context);
    const next={...out,...helped,context:out.context};
    assert.equal(next.state.actors.player.facts['storylet.lamplighter.known'],true);
    assert.ok(storyletCandidates(next.state,registry,'village.chances',factsFor(next)).some(c=>c.definition.id==='village.lamplighter_wicks'));
    // She is a regular: the ask returns after its day-long cooldown, never twice in one evening.
    assert.ok(!storyletCandidates(next.state,registry,'village.daily',factsFor(next)).some(c=>c.definition.id==='village.watch_lantern'));
    // Relays and standing fit their own evening cards.
    assert.ok(storyletCandidates(base.state,registry,'village.daily',factsFor(evening(base,{'village.relays':1,'day.hour':18}))).some(c=>c.definition.id==='village.mill_cart_word'));
    assert.ok(storyletCandidates(base.state,registry,'village.people',factsFor(evening(base,{'rank.Village':2,'day.hour':18}))).some(c=>c.definition.id==='village.supper_invite'));
    assert.ok(!storyletCandidates(base.state,registry,'village.people',factsFor(evening(base,{'rank.Village':1,'day.hour':18}))).some(c=>c.definition.id==='village.supper_invite'));
});
test('Village temper: usual keeps existing draws; livelier draws more over a fixed-seed 30-day run',()=>{
    const base=fixture(73);assert.equal(storyletTemper(base.state),'usual');
    const tempered=temper=>{const out=commitSimulationCommand(base.state,registry,{id:`village.storylets.temper.${temper}`},base.context);return {...base,...out,context:base.context};};
    const usual=tempered('usual');assert.equal(storyletTemper(usual.state),'usual');
    assert.deepEqual(advance(usual,180).state.simulation.decks,advance(base,180).state.simulation.decks);
    const month=60*24*30,counts=Object.fromEntries(['calm','usual','lively'].map(t=>[t,drawn(advance(tempered(t),month))]));
    assert.ok(counts.lively>counts.usual && counts.usual>counts.calm,JSON.stringify(counts));
    const fresh=initializeExpedition(createExpansionState(5));
    assert.throws(()=>commitSimulationCommand(enrollSimulation(fresh,registry,base.context).state,registry,{id:'village.storylets.temper.lively'},base.context));
});
