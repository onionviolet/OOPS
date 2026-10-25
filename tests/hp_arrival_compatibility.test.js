import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import golden from '../docs/gm/dispatch/hp-arrival-2026-10-25/golden-d7.json' with {type:'json'};
import {createHpLifeContent} from '../src/book_world_hp_content.js';
import {createContentRegistry,createExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {beginStructuredCampaign,planStructuredSelection} from '../src/structured_pack_runtime.js';
import {requireStructuredContent,validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';

const sha256=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const itemKey=id=>JSON.stringify({id});
const bindings={player:{category:'person',id:'main_character'}};

function setup(profile) {
    const raw=createHpLifeContent(profile);
    const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]});
    const compiled=compileStructuredPack(raw,registry);
    mergeStructuredPack(compiled,registry);
    const definition={...compiled.definition,contentHash:'sha256:'+sha256(raw),starts:compiled.definition.starts.map(start=>({...start,snapshotHash:'sha256:'+sha256(start)}))};
    const state=createExpansionState(123);
    const context={registry,actorId:'player',worldId:'base.frontier',external:{money:42},gameplay:{player:{inventory:{},skills:{Literacy:{enabled:true,xp:0}},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},facts:{location:'Village'},busy:false};
    const selection=planStructuredSelection(state,definition,context);
    const begun=beginStructuredCampaign(selection.plan.state,definition,context,null,selection.selection);
    const jobContext={...context,worldId:definition.world.id,gameplay:begun.plan.gameplay,external:begun.plan.external,facts:{location:begun.plan.state.simulation.people.player.location},targetId:profile==='school'?definition.simulation.people[0].id:undefined};
    return {raw,registry,definition,state,context,plan:begun.plan,record:begun.record,jobContext};
}

function saveEnvelope(f,plan) {
    const save={character:{money:42},expansion:plan.state,content_packs:{schema:1,packs:{},structured:f.record},'current location':plan.state.simulation.people.player.location,inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}};
    writeGameplayToEnvelope(save,plan.gameplay,bindings);
    return save;
}

test('D7 raw HP life definitions and every command definition retain their exact JSON SHA-256',()=>{
    for(const profile of ['school','trade']) {
        const raw=createHpLifeContent(profile),expected=golden.profiles[profile];
        assert.equal(sha256(raw),expected.rawLifeDefinitionSha256,`${profile} raw life definition`);
        assert.deepEqual(Object.fromEntries(raw.simulation.commands.map(command=>[command.id,sha256(command)])),expected.commands,`${profile} command definitions`);
    }
});

test('both D7 lives save and reload an in-flight job against the exact definition without losing cargo or native money',()=>{
    for(const profile of ['school','trade']) {
        const f=setup(profile),commandId=profile==='school'?'book.hp.school.lesson_charms':'book.hp.trade.repair';
        const started=commitSimulationCommand(f.plan.state,f.registry,{id:commandId},{...f.jobContext,gameplay:f.plan.gameplay});
        assert.equal(started.state.simulation.jobs.length,1,`${profile} job is in flight`);
        assert.equal(started.external.money,42,'native money remains outside the HP life');
        const save=saveEnvelope(f,started);
        validateStructuredEnvelope(save);
        requireStructuredContent(save.content_packs.structured,new Map([[f.definition.id,f.definition]]));
        const loaded=loadExpansionState(JSON.parse(JSON.stringify(save.expansion)),f.registry);
        assert.deepEqual(loaded,save.expansion,`${profile} D7 expansion reload`);
        assert.deepEqual(loaded.simulation.jobs,started.state.simulation.jobs,`${profile} reservation/job survives reload`);
        assert.equal(save.character.money,42,'native save money is unchanged');
        if(profile==='school') {
            assert.equal(started.gameplay.player.inventory[itemKey('book.hp.school.paper')],5,'one sheet is reserved by the in-flight lesson');
        } else {
            const totalGlass=plan=>{
                const key=itemKey('book.hp.trade.glass_shards'),inventory=plan.gameplay.player.inventory[key]||0;
                const owners=Object.values(plan.state.simulation.owners||{}).reduce((n,owner)=>n+(owner[key]||0),0);
                return inventory+owners;
            };
            assert.equal(totalGlass(f.plan),8,'initial personal and merchant fragment cargo');
            assert.equal(totalGlass(started),7,'one fragment set is reserved by the in-flight repair');
            assert.equal(started.state.actors.player.resources['book.hp.trade.coins']+started.state.actors['book.hp.trade.merchant'].resources['book.hp.trade.coins'],32,'local trade money is conserved across player and merchant');
            assert.equal(started.external.money,42,'frontier money is conserved independently');
        }
    }
});
