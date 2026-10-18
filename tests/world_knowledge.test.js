import test from "node:test";
import assert from "node:assert/strict";
import {worldIdentityView} from "../src/world_knowledge.js";
import {createExpansionState, createContentRegistry, loadExpansionState} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition} from "../src/expedition_content.js";

test("old saves and an optional town permit do not disclose authored world or branch identity", () => {
    const state=initializeExpedition(loadExpansionState(createExpansionState(5),expeditionRegistry));
    state.actors.player.facts["town.joined"]=true;
    const before=structuredClone(state), view=worldIdentityView(state,expeditionRegistry);
    assert.equal(view.label,""); assert.equal(view.description,"");
    assert.equal(view.description.includes("YAIRPG"),false); assert.equal(view.description.includes("Parallel"),false);
    assert.deepEqual(state,before);
});

test("world-name and branch discoveries are independent and survive saved reloads", () => {
    const state=initializeExpedition(createExpansionState(5)), facts=state.actors.player.facts;
    facts["world.base.frontier.nameKnown"]=true;
    assert.equal(worldIdentityView(state,expeditionRegistry).label,"Frontier");
    delete facts["world.base.frontier.nameKnown"]; facts["world.base.frontier.branchKnown"]=true;
    assert.equal(worldIdentityView(state,expeditionRegistry).label,"Branch dimension");
    facts["world.base.frontier.nameKnown"]=true;
    const loaded=loadExpansionState(JSON.parse(JSON.stringify(state)),expeditionRegistry);
    assert.equal(worldIdentityView(loaded,expeditionRegistry).label,"Frontier · Branch dimension");
});

test('AD6/AR8: world identity uses the requested observer, without borrowing another actor\'s discoveries', () => {
    const state = initializeExpedition(createExpansionState(5));
    state.actors.observer = structuredClone(state.actors.player);
    state.actors.player.facts['world.base.frontier.nameKnown'] = true;
    const before = structuredClone(state);
    assert.equal(worldIdentityView(state, expeditionRegistry).label, 'Frontier');
    assert.equal(worldIdentityView(state, expeditionRegistry, 'observer').label, '');
    assert.deepEqual(state, before);
    state.actors.observer.facts['world.base.frontier.branchKnown'] = true;
    const discovered = structuredClone(state);
    assert.equal(worldIdentityView(state, expeditionRegistry, 'observer').label, 'Branch dimension');
    assert.equal(worldIdentityView(state, expeditionRegistry).label, 'Frontier');
    assert.deepEqual(state, discovered, 'reading one observer cannot teach another or alter world truth');
});

test("unknown authored identities remain unknown even when a knowledge flag is present", () => {
    const registry=createContentRegistry({worlds:[{id:"base.frontier",label:"Private author label",continuity:"unknown"}]});
    const state=createExpansionState(5); state.actors.player.facts["world.base.frontier.nameKnown"]=true; state.actors.player.facts["world.base.frontier.branchKnown"]=true;
    assert.equal(worldIdentityView(state,registry).label,"");
});

test("one world's learned identity does not reveal a different world's identity", () => {
    const registry=createContentRegistry({worlds:[{id:"base.frontier",publicName:"Frontier",continuity:"branch"},{id:"other.world",publicName:"Secret world",continuity:"original"}]});
    const state=createExpansionState(5); state.worlds["other.world"]={facts:{},resources:{},completed:{}};
    state.actors.player.facts["world.base.frontier.nameKnown"]=true; state.actors.player.facts["world.base.frontier.branchKnown"]=true;
    state.actors.player.worldId="other.world";
    assert.equal(worldIdentityView(state,registry).label,"");
    state.actors.player.facts["world.other.world.branchKnown"]=true;
    assert.equal(worldIdentityView(state,registry).label,"Original continuity");
});
