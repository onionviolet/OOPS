import test from 'node:test';
import assert from 'node:assert/strict';
import {itemRecipeStatus} from '../src/crafting_visibility.js';

test('recipe stock projection separates owned, usable and blocked input without changing availability',()=>{
    const recipe={isUnlocked:()=>true,materials:[{material_id:'ore',count:2}],get_availability:()=>({available_ammount:2,materials:[{count:5,items:[
        {item:{getInventoryKey:()=>'{"id":"free"}'},count:3},
        {item:{getInventoryKey:()=>'{"id":"held"}'},count:2},
    ]}]})};
    const result=itemRecipeStatus({recipe,stationTier:1,findMaterial:()=>({count:5,items:[]}),isMaterialKnown:()=>true,canConsume:key=>!key.includes('held')});
    assert.equal(result.requirements[0].owned,5);assert.equal(result.requirements[0].usable,3);assert.equal(result.requirements[0].blocked,2);
    assert.equal(result.requirements[0].held_back,true);assert.equal(result.available,false);assert.equal(result.amount,0);
    assert.equal(result.requirements[0].stockKnown,true);
});
