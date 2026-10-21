import test from 'node:test';
import assert from 'node:assert/strict';
import {checkContentAuthoring,authorInstance} from '../scripts/check_content_authoring.mjs';
import {workshop} from './fixtures/deep_engine_authoring/workshop.mjs';
import {compileStructuredPack} from '../src/structured_pack_definitions.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {requireStructuredContent,validateStructuredEnvelope} from '../src/structured_pack_state.js';

test('author path contextualizes unsupported effects before activation or spending',async()=>{
    const raw=workshop();raw.simulation.commands[0].effects=[{type:'invented_effect',amount:3}];
    const bytes=JSON.stringify(raw),report=await checkContentAuthoring(raw,{source:'new-work.json'});
    assert.deepEqual(report.commands,[]);
    assert.equal(report.diagnostics[0].source,'new-work.json');
    assert.equal(report.diagnostics[0].path,'$.simulation.commands.0.effects[0]');
    assert.equal(report.diagnostics[0].subjectId,'author_workshop.paid');
    assert.match(report.diagnostics[0].message,/Unsupported simulation effect/);
    assert.equal(JSON.stringify(raw),bytes);
});

test('accepted native-resource adapter mismatch is caught by executable author feedback',async()=>{
    const raw=workshop();raw.simulation.commands[0].effects[0].key='unsupported_meter';
    assert.doesNotThrow(()=>compileStructuredPack(raw));
    const report=await checkContentAuthoring(raw,{source:'bad-native.json'});
    assert.equal(report.diagnostics[0].code,'consumer-dormant');
    assert.equal(report.diagnostics[0].path,'$.simulation.commands[0]');
    assert.match(report.diagnostics[0].message,/Unsupported native resource/);
    assert.equal(report.commands.find(c=>c.id==='author_workshop.paid').status,'dormant');
});

test('valid authored commands reach separate native coin and capped stamina readers',async()=>{
    const report=await checkContentAuthoring(workshop());
    assert.deepEqual(report.diagnostics,[]);
    const [paid,rest]=report.commands;
    assert.equal(paid.execution.after.money,99);
    assert.equal(paid.completion.after.money,102);
    assert.equal(paid.completion.after.stamina,10);
    assert.equal(rest.execution.after.money,98);
    assert.equal(rest.execution.after.stamina,14);
    assert.equal(report.nativeConnected,false); // Pure adapter proof is not a native browser verdict.
});

test('paid snapshot and observed beginning retain revision while future instances use new defaults',()=>{
    const old=authorInstance(workshop()),future=authorInstance(workshop(2,7));
    const started=commitSimulationCommand(old.plan.state,old.registry,{id:'author_workshop.paid'},old.context);
    assert.equal(started.external.money,99);
    assert.equal(started.state.simulation.jobs[0].revision,1);
    const save={character:{money:99},expansion:started.state,'current location':old.record.locationId,
        content_packs:{schema:1,packs:{},structured:old.record},inventories:{person:{main_character:{}}}};
    validateStructuredEnvelope(save);
    const retained=JSON.parse(JSON.stringify(save)),bytes=JSON.stringify(retained);
    assert.throws(()=>requireStructuredContent(retained.content_packs.structured,new Map([[future.definition.id,future.definition]])),/exact beginning/);
    assert.throws(()=>requireStructuredContent(retained.content_packs.structured,new Map()),/preserved/);
    assert.equal(JSON.stringify(retained),bytes);
    requireStructuredContent(retained.content_packs.structured,new Map([[old.definition.id,old.definition]]));
    // The job owns its frozen effects, even when the command registry is newer.
    const finished=advanceSimulation(retained.expansion,future.registry,2,started.external,started.gameplay,
        {player:{...old.context,vitals:old.plan.vitals.player}});
    assert.equal(finished.external.money,102);
    const next=commitSimulationCommand(future.plan.state,future.registry,{id:'author_workshop.paid'},future.context);
    const settled=advanceSimulation(next.state,future.registry,2,next.external,next.gameplay,
        {player:{...future.context,vitals:future.plan.vitals.player}});
    assert.equal(settled.external.money,106);
    assert.equal(future.record.revision,2);assert.notEqual(old.record.contentHash,future.record.contentHash);
});

test('world-pack dormant diagnostics remain visible and are never called executable',async()=>{
    const report=await checkContentAuthoring({format:'yairpg.world-pack',formatVersion:99,id:'test.invalid'});
    assert.equal(report.coverage,'dormant');assert.deepEqual(report.commands,[]);
    assert.equal(report.diagnostics[0].code,'format-version');
});
