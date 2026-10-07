import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, createContentRegistry, commitAction, advanceSimulation, loadExpansionState, evaluateAction, validateExpansionState} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition} from "../src/expedition_content.js";
import {RAT_STEP, RAT_ENEMY} from "../src/technique_content.js";
import {answerTechniquePractice, cancelTechniquePractice, observeNativeTechnique, activePractice} from "../src/techniques.js";
import {applyGameplayEffect} from "../src/gameplay_transactions.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
const fresh = seed => initializeExpedition(createExpansionState(seed));
const gameplay = () => ({player: {inventory: {}, skills: {Perception: {xp: 0, enabled: true},
    Equilibrium: {xp: 0, enabled: true}, Climbing: {xp: 0, enabled: true}}, reputation: {Village: 0}}});
const context = (owned = gameplay(), money = 100, extra = {}) => ({actorId: "player", worldId: "base.frontier", gameplay: owned,
    external: {money}, facts: {location: "Village", agility: 8, ...extra}});
const complete = (state, actionId, ctx = context()) => {
    const p = commitAction(state, expeditionRegistry, actionId, ctx);
    return advanceSimulation(p.state, expeditionRegistry, p.preview.duration, p.external, p.gameplay);
};
const understood = () => {
    const observed = complete(fresh(1), "frontier.rat_step.observe");
    return complete(observed.state, "frontier.rat_step.study", context(observed.gameplay, observed.external.money));
};
const startPractice = p => commitAction(p.state, expeditionRegistry, "frontier.rat_step.active", context(p.gameplay, p.external.money));
const answer = (p, response) => {
    const active = activePractice(p.state.actors.player)[1].practice;
    const result = answerTechniquePractice(p.state, "player", active.id, response, p.state.sequence);
    const owned = structuredClone(p.gameplay);
    if(result.reward) applyGameplayEffect(owned, result.reward, "player");
    validateExpansionState(result.state, expeditionRegistry);
    return {...p, state: result.state, gameplay: owned};
};

test("observation, understanding, practice, ownership and execution are separate saved gates", () => {
    const observed = complete(fresh(1), "frontier.rat_step.observe"), record = observed.state.actors.player.techniques[RAT_STEP];
    assert.equal(record.observed.enemyId, RAT_ENEMY); assert.equal(record.observed.route, "field-observation");
    assert.equal(record.understood, null); assert.equal(record.owned, null);
    assert.equal(evaluateAction(observed.state, expeditionRegistry, "frontier.rat_step.active", context()).eligible, false);
    let p = understood();
    assert.equal(p.state.actors.player.techniques[RAT_STEP].understood.receiptId, "event:2");
    assert.equal(p.external.money, 98); assert.equal(p.state.actors.player.techniques[RAT_STEP].owned, null);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "frontier.rat_step.internalize", context()).eligible, false);
    p = complete(p.state, "frontier.rat_step.idle", context(p.gameplay, p.external.money));
    assert.equal(p.state.actors.player.techniques[RAT_STEP].proficiency, 2);
    p = complete(p.state, "frontier.rat_step.internalize", context(p.gameplay, p.external.money));
    assert.ok(p.state.actors.player.techniques[RAT_STEP].owned);
    p.state.campaign.facts.anchor = true;
    assert.equal(evaluateAction(p.state, expeditionRegistry, "frontier.rat_step.route", context()).eligible, false);
    for(let i=0;i<2;i++) p = complete(p.state, "frontier.rat_step.idle", context(p.gameplay, p.external.money));
    const ready = evaluateAction(p.state, expeditionRegistry, "frontier.rat_step.route", context(p.gameplay, p.external.money));
    assert.equal(ready.eligible, true); assert.equal(ready.duration, 3); assert.equal(ready.outcomes[0].chance, 0.85);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "frontier.rat_step.route", context(p.gameplay, p.external.money,{agility:7})).eligible, false);
    const work = commitAction(p.state, expeditionRegistry, "frontier.rat_step.route", context(p.gameplay, p.external.money));
    const done = advanceSimulation(loadExpansionState(work.state, expeditionRegistry), expeditionRegistry, 3, work.external, work.gameplay);
    assert.equal(done.state.actors.player.techniques[RAT_STEP].executions, 1); assert.equal(done.gameplay.player.skills.Climbing.xp, 20);
    const again = advanceSimulation(done.state, expeditionRegistry, 100, done.external, done.gameplay);
    assert.equal(again.state.actors.player.techniques[RAT_STEP].executions, 1); assert.deepEqual(again.gameplay, done.gameplay);
});

test("active practice freezes RNG, cue identity and reward through partial reload and changed definitions", () => {
    let p = startPractice(understood()), initial = structuredClone(p.state);
    assert.equal(p.external.money, 97); const session = activePractice(p.state.actors.player)[1].practice;
    p = answer(p, session.cues[0].response);
    p.state = loadExpansionState(JSON.parse(JSON.stringify(p.state)), expeditionRegistry);
    assert.equal(activePractice(p.state.actors.player)[1].practice.answers.length, 1);
    assert.equal(p.state.rng, initial.rng);
    const alteredTechniques = [...expeditionRegistry.techniques.values()].map(t=>({...t, revision:2,
        maxProficiency:30, patterns:{feint_first:session.cues.map(c=>({...c,response:"hold"})),recovery_first:session.cues.map(c=>({...c,response:"hold"}))}}));
    const changed = createContentRegistry({worlds:[...expeditionRegistry.worlds.values()], techniques:alteredTechniques,
        actions:[...expeditionRegistry.actions.values()], opportunities:[...expeditionRegistry.opportunities.values()],
        capabilities:[...expeditionRegistry.capabilities.values()], sources:[...expeditionRegistry.sources.values()], rollTables:[...expeditionRegistry.rollTables.values()]});
    p.state = loadExpansionState(p.state, changed);
    assert.deepEqual(activePractice(p.state.actors.player)[1].practice.cues, session.cues);
    p = answer(p, session.cues[1].response); p = answer(p, session.cues[2].response);
    const record = p.state.actors.player.techniques[RAT_STEP];
    assert.equal(record.practice, null); assert.equal(record.proficiency, 3); assert.equal(record.lastPractice.score, 3);
    assert.equal(p.gameplay.player.skills.Equilibrium.xp, 30); assert.equal(p.state.rng, initial.rng);
    assert.throws(()=>answerTechniquePractice(p.state,"player",session.id,"hold",p.state.sequence), /already ended/);
    const saved = loadExpansionState(JSON.parse(JSON.stringify(p.state)), expeditionRegistry);
    assert.equal(saved.actors.player.techniques[RAT_STEP].proficiency, 3); assert.equal(saved.rng, initial.rng);
});

test("mistakes teach, cancellation forfeits one fee without reward and active drills occupy the actor", () => {
    const p = startPractice(understood()), session = activePractice(p.state.actors.player)[1].practice;
    const before = structuredClone(p.state);
    assert.throws(()=>answerTechniquePractice(p.state,"player",session.id,"hold",p.state.sequence-1), /stale/);
    assert.throws(()=>answerTechniquePractice(p.state,"player",session.id,"invalid",p.state.sequence), /Unknown/);
    assert.deepEqual(p.state,before);
    for(const action of ["frontier.inspect","frontier.rat_step.idle","frontier.rat_step.active"]) {
        assert.equal(evaluateAction(p.state,expeditionRegistry,action,context()).eligible,false);
    }
    let wrong = p;
    for(const cue of session.cues) wrong = answer(wrong, cue.response === "hold" ? "advance" : "hold");
    assert.equal(wrong.state.actors.player.techniques[RAT_STEP].proficiency,1); assert.equal(wrong.gameplay.player.skills.Equilibrium.xp,10);
    const cancelled = cancelTechniquePractice(p.state,"player",session.id,p.state.sequence);
    assert.equal(cancelled.actors.player.techniques[RAT_STEP].proficiency,0); assert.equal(cancelled.rng,p.state.rng);
    assert.equal(activePractice(cancelled.actors.player),null); assert.equal(p.external.money,97);
    assert.throws(()=>cancelTechniquePractice(cancelled,"player",session.id,cancelled.sequence),/already ended/);
});

test("native enemy victory records evidence once and does not invent a donor actor or remove an ability", () => {
    const state=fresh(1), before=structuredClone(state);
    assert.equal(observeNativeTechnique(state,expeditionRegistry,"player","Wrong enemy"),null);
    const next=observeNativeTechnique(state,expeditionRegistry,"player",RAT_ENEMY);
    validateExpansionState(next,expeditionRegistry);
    assert.equal(next.actors.player.techniques[RAT_STEP].observed.route,"native-victory");
    assert.equal(next.actors.player.techniques[RAT_STEP].observed.receiptId,"enemy:1");
    assert.deepEqual(Object.keys(next.actors),["player"]); assert.equal(observeNativeTechnique(next,expeditionRegistry,"player",RAT_ENEMY),null);
    assert.equal(evaluateAction(next,expeditionRegistry,"frontier.rat_step.observe",context()).visible,false);
    assert.deepEqual(state,before);
});

test("schemas1/2 migrate additively, frozen old jobs remain intact, and bad technique state rejects", () => {
    const p=commitAction(fresh(1),expeditionRegistry,"frontier.inspect",context());
    for(const schema of [1,2]) {
        const old=structuredClone(p.state);old.schema=schema;delete old.actors.player.techniques;
        const before=structuredClone(old), migrated=loadExpansionState(old,expeditionRegistry);
        assert.equal(migrated.schema,5);assert.deepEqual(migrated.pending,old.pending);assert.deepEqual(migrated.actors.player.techniques,{});
        assert.deepEqual(old,before);
    }
    const practiced=startPractice(understood()).state;
    for(const edit of [s=>s.actors.player.techniques.unknown=structuredClone(s.actors.player.techniques[RAT_STEP]),
        s=>s.actors.player.techniques[RAT_STEP].practice.answers=["invalid"],
        s=>s.actors.player.techniques[RAT_STEP].practice.cues[0].response="invalid",
        s=>s.actors.player.techniques[RAT_STEP].practice.rewards=[0,1,2,3],
        s=>s.actors.player.techniques[RAT_STEP].understood=null]) {
        const broken=structuredClone(practiced);edit(broken);assert.throws(()=>loadExpansionState(broken,expeditionRegistry));
    }
});

test("failed persistence publishes no practice answer, proficiency, cost or chosen pattern", () => {
    const live=understood(), start=startPractice(live), session=activePractice(start.state.actors.player)[1].practice;
    const envelope={character:{money:live.external.money},expansion:live.state,
        inventories:{person:{main_character:{}}},levels:{person:{main_character:{skill_xp:{}}}}};
    const original=JSON.stringify(envelope);
    const options={createSave:()=>original, key:"test",bindings:{player:{category:"person",id:"main_character"}},storage:{setItem(){throw Error("quota");}}};
    assert.throws(()=>persistExpansionPlan(start,options),/quota/);
    assert.equal(JSON.stringify(envelope),original);assert.equal(activePractice(live.state.actors.player),null);
    const partial=answer(start,session.cues[0].response);
    assert.throws(()=>persistExpansionPlan(partial,options),/quota/);
    assert.equal(activePractice(start.state.actors.player)[1].practice.answers.length,0);
    const almost=answer(partial,session.cues[1].response), done=answer(almost,session.cues[2].response);
    assert.throws(()=>persistExpansionPlan(done,options),/quota/);
    assert.equal(almost.state.actors.player.techniques[RAT_STEP].proficiency,0);assert.equal(almost.gameplay.player.skills.Equilibrium.xp,0);
});

test("mastery changes the usable route's outcome and practice stops at its saved cap", () => {
    let p=understood();
    for(let i=0;i<6;i++) p=complete(p.state,"frontier.rat_step.idle",context(p.gameplay,p.external.money));
    p=complete(p.state,"frontier.rat_step.internalize",context(p.gameplay,p.external.money));
    p.state.campaign.facts.anchor=true;
    const route=evaluateAction(p.state,expeditionRegistry,"frontier.rat_step.route",context(p.gameplay,p.external.money));
    assert.equal(route.outcomes[0].chance,1);assert.equal(route.outcomes[1].chance,0);
    assert.equal(evaluateAction(p.state,expeditionRegistry,"frontier.rat_step.idle",context()).visible,false);
    assert.equal(evaluateAction(p.state,expeditionRegistry,"frontier.rat_step.active",context()).eligible,false);
    const done=complete(p.state,"frontier.rat_step.route",context(p.gameplay,p.external.money));
    assert.equal(done.state.worlds['base.frontier'].facts['guide.condition'],'ready');
    assert.equal(done.state.actors.player.techniques[RAT_STEP].executions,1);
});
