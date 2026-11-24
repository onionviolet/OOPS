import test from 'node:test';
import assert from 'node:assert/strict';
import {projectHouseholdScene} from '../src/household_scene.js';
import {householdReaction} from '../src/absorb_p23/host_joins/tranche_one_ui.js';
test('household picture follows current supported public hearth and animal facts',()=>{
 const context={atHome:true,homeOwned:true,controlled:true,alive:true,hearthOwned:true,animalKnown:true};
 const state={hearth:{fuelMinutes:4,ventilated:true,smoke:0},animal:{mood:'content',bond:12}};
 const before=JSON.stringify(state);assert.equal(projectHouseholdScene(state,context).hearth.fuel,4);
 assert.equal(projectHouseholdScene(state,{...context,animalKnown:false}).animal,null);
 assert.equal(projectHouseholdScene(state,{...context,atHome:false}),null);
 assert.equal(JSON.stringify(state),before,'observing the picture never feeds fuel, changes mood or spends stock');
});

test('household reactions require a committed public change on the same home, including visits at full bond',()=>{
 const before={visible:true,subjectKey:'home-a',scene:{animal:{name:'Moss',bond:100,interactions:10},hearth:{fuel:0,stocked:0}}};
 const after=structuredClone(before);after.scene.animal.interactions++;
 assert.equal(householdReaction(before,before,'pet'),null,'no change earns no success');
 assert.equal(householdReaction(before,after,'pet').symbol,'♡','a successful capped-bond visit still responds');
 assert.equal(householdReaction(before,{...after,subjectKey:'home-b'},'pet'),null);
 assert.equal(householdReaction(before,{...after,visible:false},'pet'),null);
 after.scene.hearth.fuel=20;
 assert.match(householdReaction(before,after,'light').text,/fuel for 20 min/);
 assert.equal(householdReaction(after,after,'light'),null,'a render cannot replay ignition');
 after.scene.hearth.stocked=1;after.scene.hearth.stockCapacity=5;
 assert.match(householdReaction(before,after,'stock_firewood:{"id":"Rough wood log"}').text,/1\/5/);
});

test('scene projects finite local fuel supply without granting state on first inspection',()=>{
 const context={atHome:true,homeOwned:true,controlled:true,alive:true,hearthOwned:true,homeId:'home'};
 const empty=projectHouseholdScene(undefined,context);
 assert.equal(empty.hearth.stocked,0);assert.equal(empty.hearth.autoFeed,false);
 const state={hearth:{fuelMinutes:5,firewood:{logs:['exact-log'],enabled:true}}};
 const view=projectHouseholdScene(state,context);
 assert.equal(view.hearth.stocked,1);assert.equal(view.hearth.stockCapacity,5);assert.equal(view.hearth.autoFeed,true);
 assert.deepEqual(state.hearth.firewood.logs,['exact-log']);
});
