import test from 'node:test';
import assert from 'node:assert/strict';
import {scopedRestart,RESTART_SCOPES} from '../src/harm_restart_scope.js';
import {beginContinuation,planContinuation,validateContinuation,COMPATIBLE_MASTERY,nativeMoment} from '../src/continuation_state.js';
import {validateExpansionState} from '../src/expansion_engine.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../src/book_world_lotm_content.js';
import {commitProto23Command} from '../src/proto23_world_host.js';
import {PROTO23_IDS as P,PROTO23_FOOTPRINTS,PROTO23_NATIVE_STOCK,proto23Definitions} from '../src/proto23_world_content.js';
import {proto23CalendarAt,proto23QuestProjection} from '../src/proto23_world_native.js';
import {createChronicle,advanceChronicle} from '../src/chronicle.js';
import {validateSaveEnvelope,encodeSaveFile,decodeSaveFile,importSaveFile} from '../src/save_files.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {defaultCheatState,seedBeginningCheats} from '../src/cheat_cards.js';
import {bare,registry,vit,run,wait} from './lotm_helpers.js';
const VERSION='v0.6.0',W='book.lotm.tingen';
const copy=x=>structuredClone(x),encode=bag=>Object.fromEntries(Object.entries(bag).map(([k,count])=>[k,{count}]));
let serial=0;
const cmd=(s,command)=>planContinuation(s,command,{expectedSequence:s.continuation.sequence,token:`scope-${++serial}`});
function fixture({chronicle=false}={}) {
    let p=bare();
    p.state.simulation.people.player.body={id:'native.player.body',form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'};
    for(const id of ['proto23.chart','proto23.enroll'])p=commitProto23Command(p.state,registry,{type:'proto23',id},
        {actorId:'player',nativeAlive:true,external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village','village.elderMet':true},
            proto23Native:{body:p.state.simulation.people.player.body}});
    enrollLotmBranch(p.state);
    p.state.proto23Village.nativeRevision=1;
    const save={'game version':VERSION,'current time':{year:1,month:1,day:1,hour:8,minute:0,day_count:1},saved_at:10,
        'current location':p.state.simulation.people.player.location,
        character:{name:'Scope fixture',money:50,xp:{total_xp:0},equipment:{},bio:{race:'human'},hp_to_full:0},
        levels:{person:{main_character:{total_xp:0,skill_xp:Object.fromEntries(COMPATIBLE_MASTERY.map(id=>[id,0]))}}},
        inventories:{person:{main_character:{}},proto23_world:{[P.stock]:encode(PROTO23_NATIVE_STOCK[P.stock])},trader:{[P.shop]:encode(PROTO23_NATIVE_STOCK[P.shop])}},
        npcs:{},npc_equipment:{},locations:{},availabilities:{location:{},person:{},trader:{[P.shop]:0},quest:{}},
        quests:{seat:{done:false}},options:{},expansion:p.state,harm:{schema:1,backlash:{power:0}}};
    for(const d of proto23Definitions.people) {
        save.npcs[d.id]={};save.npc_equipment[d.id]={};save.levels.person[d.id]={total_xp:0,skill_xp:{}};
        save.inventories.person[d.id]={};
    }
    for(const [id,stock] of Object.entries(LOTM_NATIVE_STOCK))save.inventories.person[id]=encode(stock);
    save.proto23_village_native={schema:1,definitionRevision:1,revision:1,initializedAt:p.state.proto23Village.initializedAt,
        worldOwners:PROTO23_FOOTPRINTS.map(f=>({worldId:f.worldId,instanceId:f.instanceId,calendar:proto23CalendarAt(0),
            stockOwner:f.native.stockOwner,shopOwner:f.native.shopOwner,peopleIds:proto23Definitions.people.filter(d=>d.worldId===f.worldId).map(d=>d.id),questId:f.native.questId}))};
    for(const f of PROTO23_FOOTPRINTS) {
        for(const id of f.native.locations)save.locations[id]={};
        save.quests[f.native.questId]=proto23QuestProjection(p.state,f.worldId);
    }
    if(chronicle)save.expansion.chronicle=createChronicle(save.expansion.clock,save['current time']);
    validateSaveEnvelope(copy(save),VERSION);
    return beginContinuation(save,'scoped-restart');
}
function changed(options) {
    let s=fixture(options);
    s.character.money=1;s.character.hp_to_full=23;s.quests.seat.done=true;s.harm.backlash.power=9;
    s.expansion.worlds[W].resources.replayed=99;
    s.expansion.actors.player.resources['book.lotm.fixture']=12;
    s.expansion.simulation.people.player.body.hands=1;
    s.expansion.worlds['base.frontier'].resources.retained=42;
    s.expansion.proto23Village.receipts.push({id:'proto23.enroll',at:s.expansion.clock,sequence:s.expansion.sequence});
    s.expansion.simulation.knowledge.player['other.world.record']={stage:'seen',value:'Retained',at:s.expansion.clock,cause:'fixture.record'};
    s.options={font:2};s.cheats=seedBeginningCheats(defaultCheatState(),{at:1});
    for(const skill of COMPATIBLE_MASTERY)s.levels.person.main_character.skill_xp[skill]=100;
    s.continuation.memories=[{lifeId:'life-1',event:{text:'Remembered',at:nativeMoment(s)}}];
    return cmd(s,'die:loss_of_control');
}

test('LOTM restart rewinds its seat and keeps Village, other worlds and the restore carry table',()=>{
    const s=changed(),before=copy(s),anchor=s.continuation.lives['life-1'].initial;
    const next=cmd(s,'restart:initial');assert.deepEqual(s,before);
    for(const key of ['character','harm','quests'])assert.deepEqual(next[key],anchor[key]);
    assert.deepEqual(next.expansion.worlds[W],anchor.expansion.worlds[W]);
    assert.deepEqual(next.expansion.lotm,anchor.expansion.lotm);
    assert.deepEqual(next.expansion.actors.player,anchor.expansion.actors.player);
    assert.deepEqual(next.expansion.simulation.people.player,anchor.expansion.simulation.people.player);
    for(const key of ['proto23Village'])assert.deepEqual(next.expansion[key],s.expansion[key]);
    assert.deepEqual(next.expansion.worlds['base.frontier'],s.expansion.worlds['base.frontier']);
    assert.deepEqual(next.expansion.worlds[P.world],s.expansion.worlds[P.world]);
    assert.deepEqual(next.expansion.simulation.knowledge.player['other.world.record'],s.expansion.simulation.knowledge.player['other.world.record']);
    for(const key of ['cheats','options'])assert.deepEqual(next[key],s[key]);
    for(const skill of COMPATIBLE_MASTERY)assert.equal(next.levels.person.main_character.skill_xp[skill],100);
    assert.deepEqual(next.continuation.memories,s.continuation.memories);
    assert.deepEqual(next.continuation.deaths.slice(0,-1),s.continuation.deaths);
    assert.equal(next.continuation.deaths.at(-1).kind,'restart');
    assert.equal(next.continuation.lives['life-1'].ended,undefined);
    validateLotmState(next.expansion);validateExpansionState(next.expansion,undefined,{full:true});validateContinuation(next.continuation);
});

test('an admitted in-flight lesson restarts with a future deadline on the live clock',()=>{
    const base=fixture();delete base.continuation;
    let p={state:base.expansion,external:{money:base.character.money},gameplay:Object.fromEntries(
        Object.entries(base.inventories.person).map(([id,bag])=>[id==='main_character'?'player':id,
            {inventory:Object.fromEntries(Object.entries(bag).map(([key,v])=>[key,v.count])),skills:{},reputation:{}}]))};
    for(const id of ['report_in','accept_allocation','ingest','lesson'])p=run(p,id);
    const envelope=plan=>{
        const s=copy(base);s.expansion=copy(plan.state);s.character.money=plan.external.money;
        s['current time'].minute=plan.state.clock;
        for(const [id,g] of Object.entries(plan.gameplay))s.inventories.person[id==='player'?'main_character':id]=encode(g.inventory);
        return s;
    };
    const enrolled=beginContinuation(envelope(p),'lesson-scope'),anchor=copy(enrolled.continuation.lives['life-1'].initial);
    p=wait(p,10);let s=envelope(p);s.continuation=enrolled.continuation;
    validateSaveEnvelope(copy(s),VERSION);
    s=cmd(s,'die:loss_of_control');const next=cmd(s,'restart:initial');
    const job=next.expansion.simulation.jobs.find(j=>j.commandId==='book.lotm.lesson');
    assert.ok(job);assert.equal(job.due-next.expansion.clock,anchor.expansion.simulation.jobs[0].due-anchor.expansion.clock);
    validateLotmState(next.expansion);validateExpansionState(next.expansion,undefined,{full:true});validateSaveEnvelope(copy(next),VERSION);
});

test('JSON save, persistence writer, reload, export and import use real validators',async()=>{
    const next=cmd(changed(),'restart:initial');let saved;
    persistExpansionPlan({state:next.expansion,external:{money:next.character.money},replacementEnvelope:next},
        {createSave:()=>JSON.stringify(next),storage:{setItem(k,v){saved=v;}},key:'fixture',validateEnvelope:s=>validateSaveEnvelope(s,VERSION)});
    const loaded=JSON.parse(saved);validateLotmState(loaded.expansion);validateExpansionState(loaded.expansion,undefined,{full:true});validateContinuation(loaded.continuation);
    assert.deepEqual(decodeSaveFile(encodeSaveFile(saved),VERSION),validateSaveEnvelope(copy(loaded),VERSION));
    let imported;
    await importSaveFile(encodeSaveFile(saved),{currentVersion:VERSION,preflight:s=>{
        validateLotmState(s.expansion);validateExpansionState(s.expansion,undefined,{full:true});validateContinuation(s.continuation);
    },storage:{setItem(k,v){imported=JSON.parse(v);}},key:'fixture'});
    assert.deepEqual(imported,validateSaveEnvelope(copy(loaded),VERSION));
});

test('shared clock and bound chronicle calendar stay live while seat deadlines keep their duration',()=>{
    let s=fixture({chronicle:true});const anchor=s.continuation.lives['life-1'].initial;
    s.expansion.clock+=20;s['current time'].minute=20;s.expansion.chronicle=advanceChronicle(s.expansion.chronicle,s.expansion.clock);
    // Controlled idle-time fixture: keep retained scheduled work in the future.
    for(const check of Object.values(s.expansion.simulation.checks))check.due+=20;
    for(const controller of Object.values(s.expansion.simulation.controllers))controller.due+=20;
    validateSaveEnvelope(copy(s),VERSION);
    s=cmd(s,'die:loss_of_control');const next=cmd(s,'restart:initial');
    assert.equal(next.expansion.clock,s.expansion.clock);assert.deepEqual(next['current time'],s['current time']);
    assert.deepEqual(next.expansion.simulation.causes,s.expansion.simulation.causes);
    validateSaveEnvelope(copy(next),VERSION);
    // A pure scope fixture makes the relative deadline rule observable without
    // inventing an admitted gameplay command or changing any content definition.
    const a=copy(anchor),live=copy(s);a.expansion.simulation.conditions.player={fixture:{nextTick:a.expansion.clock+3,expiresAt:a.expansion.clock+5}};
    const projected=scopedRestart(live,a,W);
    assert.equal(projected.expansion.simulation.conditions.player.fixture.nextTick,live.expansion.clock+3);
    assert.equal(projected.expansion.simulation.conditions.player.fixture.expiresAt,live.expansion.clock+5);
});

test('retained owners activated after the anchor keep native projections, bodies and stock',()=>{
    const s=changed(),anchor=copy(s.continuation.lives['life-1'].initial);
    delete anchor.expansion.proto23Village;delete anchor.expansion.worlds[P.world];delete anchor.proto23_village_native;
    for(const d of proto23Definitions.people) {
        delete anchor.expansion.actors[d.id];delete anchor.expansion.simulation.people[d.id];
        delete anchor.npcs[d.id];delete anchor.npc_equipment[d.id];delete anchor.levels.person[d.id];delete anchor.inventories.person[d.id];
    }
    anchor.inventories.proto23_world={};anchor.inventories.trader={};anchor.locations={};delete anchor.quests[P.quest];
    s.continuation.lives['life-1'].initial=anchor;
    const next=cmd(s,'restart:initial');
    assert.deepEqual(next.proto23_village_native,s.proto23_village_native);
    assert.deepEqual(next.inventories.proto23_world,s.inventories.proto23_world);
    validateSaveEnvelope(copy(next),VERSION);
});

test('retained active visits refuse clearly and leave the source and anchor untouched',()=>{
    for(const owner of ['proto23Village','motherOfLearning','mistglassRealm','realmPrototype','featureDestination','nestedCampaign','bookWorldCampaign']) {
        const s=changed();s.expansion[owner]={...s.expansion[owner],activeVisitId:'fixture.visit'};const before=copy(s);
        assert.throws(()=>cmd(s,'restart:initial'),new RegExp(`retained ${owner}.*active visit`));assert.deepEqual(s,before);
    }
});

test('Frontier restart keeps whole-save semantics and legacy continuation JSON still validates',()=>{
    const s=fixture();s.expansion.actors.player.worldId='base.frontier';
    s.continuation.lives['life-1'].initial.expansion.actors.player.worldId='base.frontier';
    const anchor=copy(s.continuation.lives['life-1'].initial);s.expansion.worlds['base.frontier'].resources.later=1;
    const next=cmd(cmd(s,'die:age'),'restart:initial');assert.deepEqual(next.expansion,anchor.expansion);
    const legacy=copy(s.continuation);delete legacy.deaths;delete legacy.lives['life-1'].ended;
    validateContinuation(JSON.parse(JSON.stringify(legacy)));
    assert.equal(RESTART_SCOPES['base.frontier'].mode,'whole');assert.equal(RESTART_SCOPES.default.mode,'scoped');
});
