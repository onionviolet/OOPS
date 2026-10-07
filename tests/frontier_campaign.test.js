import test from "node:test";
import assert from "node:assert/strict";
import {expeditionRegistry as registry,initializeExpedition} from "../src/expedition_content.js";
import {createExpansionState,loadExpansionState,inspectCapabilities} from "../src/expansion_engine.js";
import {commitSimulationCommand,answerSimulationEncounter} from "../src/simulation.js";
import {initializeNativeBattle,commitNativeBattleStrike,withdrawNativeBattle} from "../src/native_battle.js";
import {commitFieldRenewal,previewFieldRenewal,prepareRivalRematch,RIVAL_PURSUIT,ROAD_RIVAL} from "../src/frontier_campaign.js";
import {publishNativeVitals,nativeActionReasons,assertNativeItemDisposition} from "../src/native_gameplay_adapter.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {mitigateCombatDamage,rollCombatStrike,nextAttackTiming} from "../src/combat_math.js";
import {createFieldFixture,joinField,completeFieldProject,fieldCommand,fieldAdvance,fieldContext,fieldReload,wood,kit} from "../scripts/field_fixtures.mjs";

const context=(p,location="Village",extra={})=>fieldContext(p,location,{vitals:{player:{health:30-(p.native?.hpToFull || 0),max_health:30,stamina:30-(p.native?.staminaToFull || 0),max_stamina:30}},...extra});
const setup=()=>{let p=joinField(createFieldFixture());p.gameplay.player.skills.Climbing={xp:0,parent:null,enabled:true,present:false};p=fieldAdvance(fieldCommand(p,"field.learn_focus"),2);p=fieldAdvance(fieldCommand(p,"field.teach_step","Village",{targetId:"oldCraftsman"}),2);p=fieldAdvance(fieldCommand(p,"field.practice_step"),2);return completeFieldProject(p);};
const begin=p=>{p=fieldAdvance(fieldCommand(p,"rival.begin"),3);const requestId=p.state.simulation.pursuits[RIVAL_PURSUIT].request.id;
    return initializeNativeBattle(commitSimulationCommand(p.state,registry,{id:"rival.confront",requestId},context(p,"Village",{targetId:ROAD_RIVAL})));};
const attacker={attackPower:60,stats:{attack_points:10000,attack_count:1,crit_rate:0,crit_multiplier:1,stamina_efficiency:1},shield:0,shieldSkill:0};
const target={stats:{agility:5,intuition:5,defense:1,crit_rate:0},shield:0,shieldSkill:0};
const bindings={player:{category:"person",id:"main_character"},oldCraftsman:{category:"person",id:"oldCraftsman"}};
const envelope=p=>({character:{money:p.external.money},inventories:{person:{main_character:{},oldCraftsman:{}}},levels:{person:{main_character:{},oldCraftsman:{}}},expansion:p.state});

test("old saves do not enroll a rival, upgrade or prestige",()=>{
    const state=initializeExpedition(createExpansionState(71));assert.equal(state.simulation,null);assert.equal(state.actors.player.facts["field.renewed"],false);assert.equal(state.actors.player.facts["rival.resolved"],false);
});
test("native vital publication matches durable health and stamina offsets",()=>{
    const stats={health:10,max_health:10,stamina:5,max_stamina:5};publishNativeVitals({hpToFull:1,staminaToFull:2},{getFullStats:()=>stats});assert.equal(stats.health,9);assert.equal(stats.stamina,3);
});
test("borrowed goods and occupied actors cannot bypass native dispositions",()=>{
    const p=begin(setup());assert.ok(nativeActionReasons(p.state).length);p.state.simulation.custody.loan={holder:"player",owner:ROAD_RIVAL,key:wood,count:1,at:p.state.clock,cause:"test"};
    assert.throws(()=>assertNativeItemDisposition(p.state,wood),/borrowed/);assert.doesNotThrow(()=>assertNativeItemDisposition(p.state,kit));
});
test("native damage, block and evasion calculations use supplied draws",()=>{
    assert.equal(mitigateCombatDamage([10,.2],3),7.2);
    assert.equal(rollCombatStrike({attackPower:2,attacker:attacker.stats,target:{...target.stats,block_chance:1},shield:10,random:()=>.5}).kind,"blocked");
    assert.equal(rollCombatStrike({attackPower:2,attacker:{...attacker.stats,attack_points:0},target:target.stats,random:()=>.5}).kind,"evaded");
});
test("a reloaded native duel retains participant identity and RNG and cannot use scripted answers",()=>{
    const p=begin(setup()),reloaded=fieldReload(p);assert.deepEqual(reloaded.state.simulation.sessions.player.nativeBattle,p.state.simulation.sessions.player.nativeBattle);
    assert.throws(()=>answerSimulationEncounter(p.state,registry,"withdraw",context(p)),/native duel/);
    const hit=()=>commitNativeBattleStrike(p.state,registry,{actorId:"player",targetId:ROAD_RIVAL,attacker,target},context(p));
    const replay=commitNativeBattleStrike(reloaded.state,registry,{actorId:"player",targetId:ROAD_RIVAL,attacker,target},context(reloaded));assert.deepEqual(hit(),replay);
    assert.equal(replay.state.simulation.people[ROAD_RIVAL].vitals.health,1);assert.equal(replay.state.simulation.sessions.player,undefined);assert.equal(replay.state.actors.player.facts["rival.resolved"],true);
});
test("failed strike persistence preserves the old RNG, wounds and native health",()=>{
    const p=begin(setup()),before=structuredClone(p),planned=commitNativeBattleStrike(p.state,registry,{actorId:ROAD_RIVAL,targetId:"player",attacker:{...attacker,attackPower:5},target},context(p));
    assert.ok(planned.native.hpToFull > 0);let bytes=JSON.stringify(envelope(p));const oldBytes=bytes;
    assert.throws(()=>persistExpansionPlan(planned,{createSave:()=>bytes,key:"test",bindings,storage:{setItem(){throw Error("quota");}}}),/quota/);assert.equal(bytes,oldBytes);assert.deepEqual(p,before);
});
test("withdrawal retains wounds; paid recovery permits a real rematch without a second first-win reward",()=>{
    let p=begin(setup());p=withdrawNativeBattle(p.state,registry,context(p));assert.equal(p.state.simulation.pursuits[RIVAL_PURSUIT].status,"withdrawn");
    p.gameplay.player.inventory[kit]=2;p=fieldAdvance(fieldCommand(p,"rival.recover","Village",{targetId:ROAD_RIVAL}),3);assert.equal(p.gameplay.player.inventory[kit],1);
    p=prepareRivalRematch(p.state,registry,context(p));p=fieldAdvance(p,3);assert.equal(p.state.simulation.pursuits[RIVAL_PURSUIT].status,"waiting");assert.equal(p.state.simulation.people[ROAD_RIVAL].vitals.health,26);
});
test("workshop upgrades, rope recipe and two delivery routes reserve/refund real goods and pay once",()=>{
    let p=setup();const logs=p.gameplay.player.inventory[wood],money=p.external.money;
    p=fieldAdvance(fieldCommand(p,"field.dry_rack","Shack"),4);assert.equal(p.gameplay.player.inventory[wood],logs-3);assert.equal(p.external.money,money-2);
    p=fieldAdvance(fieldCommand(p,"field.rack_batch","Shack"),3);assert.equal(p.gameplay.player.inventory[kit],2);
    p=fieldAdvance(fieldCommand(p,"field.study_rope","Shack"),2);p=fieldAdvance(fieldCommand(p,"field.make_rope","Shack"),3);
    p=fieldCommand(p,"field.accept_supply");const before=p.external.money;p=fieldCommand(p,"field.deliver_rope");assert.equal(p.external.money,before+6);assert.equal(p.state.actors.player.facts["field.supplyRoute"],"rope");
    assert.throws(()=>fieldCommand(p,"field.deliver_kits"),/missing|hidden|knowledge/);
});
test("one previewed renewal resets only selected training and fuel, survives reload and cannot reward twice",()=>{
    let p=setup();p=fieldAdvance(fieldCommand(p,"field.dry_rack","Shack"),4);p=fieldCommand(p,"field.accept_supply");p.gameplay.player.inventory[kit]=3;p=fieldCommand(p,"field.deliver_kits");
    p=fieldAdvance(fieldCommand(p,"rival.begin"),3);p.gameplay.player.inventory[kit]=1;p=fieldCommand(p,"rival.settle","Village",{targetId:ROAD_RIVAL});
    const before=structuredClone(p),preview=previewFieldRenewal(p.state,registry,context(p));
    assert.equal(preview.sequence,p.state.sequence);assert.deepEqual(p,before);assert.throws(()=>commitFieldRenewal(p.state,registry,context(p),preview.sequence-1),/preview changed/);
    p=commitFieldRenewal(p.state,registry,context(p),preview.sequence);p=fieldReload(p);
    assert.equal(p.state.simulation.powers.player["field.load_step"].mastery,1);assert.equal(p.state.actors.player.completed["field.practice_step"],undefined);
    assert.equal(p.state.simulation.energies.player["field.focus"].reserve,0);assert.equal(p.state.actors.player.facts["field.dryRack"],true);assert.deepEqual(p.gameplay,before.gameplay);assert.equal(p.external.money,before.external.money);
    assert.ok(p.state.actors.player.sources["frontier.field_legacy"]);assert.ok(inspectCapabilities(p.state,registry,{...context(p),worldId:"base.frontier"})["frontier.preparation"].contributions.some(c=>c.sourceId === "frontier.field_legacy"));assert.throws(()=>commitFieldRenewal(p.state,registry,context(p),p.state.sequence),/prerequisites/);
});

test("native attack timing retains the previous timestamp and clamps drift in both directions",()=>{
    assert.deepEqual(nextAttackTiming(100,117,16,0,10),{variance:1,adjustment:1});
    assert.deepEqual(nextAttackTiming(100,101,16,0,10),{variance:-15,adjustment:-10});
    assert.deepEqual(nextAttackTiming(100,150,16,2,10),{variance:36,adjustment:10});
});
