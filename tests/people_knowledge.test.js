import test from "node:test";
import assert from "node:assert/strict";
import {knownPeopleView} from "../src/people_knowledge.js";
import {initializeExpedition, expeditionRegistry} from "../src/expedition_content.js";
import {createExpansionState, loadExpansionState} from "../src/expansion_engine.js";
import {enrollSimulation} from "../src/simulation.js";
import {createChronicle} from "../src/chronicle.js";

const fresh = () => initializeExpedition(createExpansionState(23));
const enrolled = () => enrollSimulation(fresh(), expeditionRegistry, {actorId:"player",worldId:"base.frontier",facts:{location:"Village"},external:{money:30}}).state;

test('book person accounts retain received basis without appraising private cultivation or stock',()=>{
    const state=enrolled(),known=state.simulation.knowledge.player||=( {} );
    known['book.mol.admission']={value:'Ilsa offers bounded guest study.',at:12,stage:'seen',basis:{kind:'observation',attributedTo:'book.mol.ilsa'}};
    known['book.mol.formula']={value:'Nora teaches the paid lamp brief.',at:18,stage:'understood',basis:{kind:'instruction',attributedTo:'book.mol.nora'}};
    const before=knownPeopleView(state);
    assert.deepEqual(before.find(p=>p.id==='book.mol.nora').accounts,[{id:'book.mol.formula',text:'Nora teaches the paid lamp brief.',at:18,basis:'Told to you'}]);
    assert.equal(before.find(p=>p.id==='book.mol.ilsa').accounts[0].basis,'Observed');
    state.actors['book.mol.nora']={resources:{mana:999},sources:{secret:true}};
    state.simulation.people['book.mol.nora']={body:{form:'secret'},location:'Hidden room',life:'dead'};
    state.simulation.knowledge['book.mol.nora']={secret:{value:'Unshared ability'}};
    assert.deepEqual(knownPeopleView(state),before);
    delete known['book.mol.formula'];
    assert.equal(knownPeopleView(state).some(p=>p.id==='book.mol.nora'),false);
});

test("registration and enrollment do not reveal unseen people or their private state", () => {
    assert.deepEqual(knownPeopleView(fresh()), []);
    const state = enrolled();
    state.simulation.relationships.oldCraftsman = {player:{axes:{trust:99,fear:8},memories:[{cause:"private:1",at:0,text:"Secret distrust."}]}};
    state.simulation.knowledge.oldCraftsman = {secret:{stage:"understood",value:"Hidden lineage",at:0,cause:"private:1"}};
    assert.deepEqual(knownPeopleView(state), []);
    const records = knownPeopleView(state, {"village.craftsmanMet":true});
    assert.equal(records.length, 1); assert.deepEqual(records[0].details, []); assert.deepEqual(records[0].memories, []);
    assert.doesNotMatch(JSON.stringify(records), /trust|fear|Secret|lineage|99/);
});

test("a greeting reveals only the person, while inspection and promises add their actual evidence", () => {
    const state = fresh(), facts = {"village.elderMet":true};
    assert.deepEqual(knownPeopleView(state, facts)[0].details, []);
    state.chronicle = createChronicle(0, {year:1,month:1,day:1,hour:8,minute:0,day_count:1});
    state.chronicle.relationships.villageElder.axes.secret = 99;
    assert.deepEqual(knownPeopleView(state, facts)[0].details, []);
    state.chronicle.knowledge.elderClue = true;
    state.chronicle.relationships.villageElder.ties.archiveDuty = true;
    const record = knownPeopleView(state, facts)[0];
    assert.match(record.details.join(" "), /inspecting|pending/);
    assert.doesNotMatch(JSON.stringify(record), /strength|control|99|secret/);
    state.chronicle.elder.revealed = true;
    state.chronicle.relationships.villageElder.ties.dutyKept = true;
    assert.match(knownPeopleView(state, facts)[0].details.join(" "), /witnessed|kept/);
    assert.doesNotMatch(knownPeopleView(state, facts)[0].details.join(" "), /pending/);
});

test("player observations and completed exchanges reveal craftsman details without private axes", () => {
    const state = enrolled();
    state.simulation.knowledge.player = {"craftsman.preferences":{stage:"understood",value:"Questions are welcome after work.",at:0,cause:"known:1"}};
    state.actors.player.facts["sim.commissioned"] = true;
    state.actors.player.completed["village.collect"] = 1;
    const record = knownPeopleView(state)[0];
    assert.deepEqual(record.details, ["Questions are welcome after work."]);
    assert.match(record.memories.map(m => m.text).join(" "), /supplied|collected/);
    state.simulation.people.oldCraftsman.location = "Secret retreat";
    state.simulation.people.oldCraftsman.life = "dead";
    assert.equal(knownPeopleView(state)[0].location, "Last known: Village");
    assert.doesNotMatch(JSON.stringify(knownPeopleView(state)), /Secret retreat|dead/);
});

test("town entry does not reveal the clerk before their briefing", () => {
    const state = fresh(); state.actors.player.facts["town.joined"] = true;
    assert.deepEqual(knownPeopleView(state), []);
    state.actors.player.facts["town.briefed"] = true;
    assert.match(knownPeopleView(state)[0].details[0], /agreed/);
    assert.doesNotMatch(JSON.stringify(knownPeopleView(state)), /accepted|ledger/);
    state.actors.player.facts["town.settled"] = true;
    assert.match(knownPeopleView(state)[0].details[0], /accepted/);
});

test("a hired participant's private return or death does not update the player's record", () => {
    const state = enrolled(), id = "helper:1";
    state.simulation.people[id] = {createdBy:"player",definitionId:"village.route_helper",location:"Secret retreat",life:"dead"};
    state.simulation.relationships[id] = {player:{axes:{fear:99},memories:[{cause:"private:2",at:0,text:"Secret rival."}]}};
    let record = knownPeopleView(state)[0];
    assert.equal(record.location, "Agreed assignment: nearby road");
    assert.deepEqual(record.memories, []);
    assert.doesNotMatch(JSON.stringify(record), /dead|Secret|fear/);
    state.simulation.relationships[id].player.memories.push({cause:"handover:1",at:0,text:"Handed over the completed kit."});
    record = knownPeopleView(state)[0]; assert.match(record.details[0], /Commission delivered/);
    assert.equal(record.location, "Last known: Village");
});

test("reading records is pure and existing native meeting markers survive expansion reload", () => {
    const state = enrolled(), facts = {"village.elderMet":true,"village.craftsmanMet":true};
    state.actors.player.facts["town.briefed"] = true;
    const before = structuredClone(state), records = knownPeopleView(state, facts);
    for(let i=0;i<5;i++) assert.deepEqual(knownPeopleView(state, facts), records);
    assert.deepEqual(state, before);
    const reloaded = loadExpansionState(JSON.parse(JSON.stringify(state)), expeditionRegistry);
    assert.deepEqual(knownPeopleView(reloaded, {...facts,location:"Forest road"}), records);
    assert.equal(reloaded.chronicle, null);
});
