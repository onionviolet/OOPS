import test from "node:test";
import assert from "node:assert/strict";
import {characterBioView} from "../src/character_bio.js";
import {initializeExpedition, expeditionRegistry} from "../src/expedition_content.js";
import {createExpansionState, loadExpansionState} from "../src/expansion_engine.js";

const fresh = () => initializeExpedition(createExpansionState(19));
const view = (state, training = []) => characterBioView({state,registry:expeditionRegistry,training,context:{actorId:"player",worldId:"base.frontier",facts:{location:"Village",agility:8}}});

test("old biographies disclose no unseen source, technique, identity or invented life history", () => {
    const state=fresh(), before=structuredClone(state), bio=view(state);
    assert.deepEqual(bio,{identity:"",life:"",learned:[],heritage:[],conditions:[],techniques:[],influences:[]});
    assert.deepEqual(state,before);
    assert.doesNotMatch(JSON.stringify(bio), /Field eye|Parallel|bloodline/i);
});

test("body training exposes only learned skill levels and their existing effects", () => {
    const state=fresh(), before=structuredClone(state);
    const training=[{id:"Running",label:"Running",visible:true,level:5,effectiveLevel:8,stats:{agility:{flat:3},max_stamina:{multiplier:1.05}},bodyEffect:"Improved stamina efficiency"},
        {id:"Secret",label:"Unseen skill",visible:false,level:12,stats:{strength:{flat:9}}},
        {id:"Untrained",label:"Untrained skill",visible:true,level:0,stats:{strength:{flat:9}}}];
    const bio=view(state,training);assert.equal(bio.influences.length,1);
    assert.match(bio.influences[0].detail,/Agility \+3/);assert.match(bio.influences[0].detail,/Stamina ×1.05/);
    assert.equal(bio.influences[0].cause,"Trained level 5 · Current level 8");assert.deepEqual(state,before);
});

test("lasting discoveries stay separate from temporary briefings and survive reload without rewards", () => {
    const state=fresh();state.actors.player.sources["frontier.field_eye"]={receiptId:"event:1",revision:1,acquiredAt:0,expiresAt:null};
    state.actors.player.sources["village.morning_signs"]={receiptId:"event:2",revision:1,acquiredAt:0,expiresAt:60};
    const before=structuredClone(state), bio=view(state);
    assert.deepEqual(bio.learned.map(row=>row.id),["frontier.field_eye"]);
    assert.match(bio.learned[0].detail,/Route preparation \+1/);
    assert.equal(bio.learned[0].cause,"Discovered trait");assert.deepEqual(state,before);
    const loaded=loadExpansionState(JSON.parse(JSON.stringify(state)),expeditionRegistry);
    assert.deepEqual(view(loaded),bio);
});

test("observed movement does not masquerade as owned or executable movement in Bio", () => {
    const state=fresh();state.actors.player.techniques["frontier.rat_step"]={observed:{enemyId:"Starving wolf rat"},understood:null,owned:null,proficiency:0,executions:0};
    let bio=view(state);assert.equal(bio.techniques[0].detail,"Observed");assert.doesNotMatch(JSON.stringify(bio),/Ready to use|Practice 0\/12/);
    const record=state.actors.player.techniques["frontier.rat_step"];record.understood={};record.owned={};record.proficiency=6;
    bio=view(state);assert.match(bio.techniques[0].detail,/Internalized/);assert.equal(bio.techniques[0].cause,"Ready to use");
});
