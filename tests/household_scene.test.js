import test from 'node:test';
import assert from 'node:assert/strict';
import {projectHouseholdScene} from '../src/household_scene.js';
test('household picture follows current supported public hearth and animal facts',()=>{
 const context={atHome:true,homeOwned:true,controlled:true,alive:true,hearthOwned:true,animalKnown:true};
 const state={hearth:{fuelMinutes:4,ventilated:true,smoke:0},animal:{mood:'content',bond:12}};
 const before=JSON.stringify(state);assert.equal(projectHouseholdScene(state,context).hearth.fuel,4);
 assert.equal(projectHouseholdScene(state,{...context,animalKnown:false}).animal,null);
 assert.equal(projectHouseholdScene(state,{...context,atHome:false}),null);
 assert.equal(JSON.stringify(state),before,'observing the picture never feeds fuel, changes mood or spends stock');
});
