import test from 'node:test';
import assert from 'node:assert/strict';
import {addInventoryRequirementFacts} from '../src/inventory_requirement_facts.js';
import {evaluateRule} from '../src/rules.js';
const key=JSON.stringify({id:'Synthetic parcel'}), count='target.item.'+key;
const none={fact:count,op:'eq',value:0};

test('empty actual inventory supports a zero-cargo predicate without provisioning stock',()=>{
    const inventory={}, facts={};
    addInventoryRequirementFacts(facts,none,{'target.item.':inventory});
    assert.equal(evaluateRule(none,facts).met,true);
    assert.deepEqual(inventory,{});
});
test('current stock overrides a stale count for admission and completion',()=>{
    const inventory={[key]:4}, facts={[count]:0};
    addInventoryRequirementFacts(facts,{any:[none,{fact:count,op:'lte',value:2}]},{'target.item.':inventory});
    assert.equal(facts[count],4);assert.equal(evaluateRule(none,facts).met,false);
    delete inventory[key];
    addInventoryRequirementFacts(facts,none,{'target.item.':inventory});
    assert.equal(evaluateRule(none,facts).met,true);
});
test('absent inventory, malformed keys and unrelated knowledge remain unknown',()=>{
    const facts={};
    addInventoryRequirementFacts(facts,[none,{fact:'target.item.invalid',op:'eq',value:0},{fact:'target.secret',op:'eq',value:false}],{'target.item.':null});
    assert.deepEqual(facts,{});
    addInventoryRequirementFacts(facts,{fact:'target.item.invalid',op:'eq',value:0},{'target.item.':{}});
    assert.deepEqual(facts,{});assert.equal(evaluateRule(none,facts).known,false);
});

test('canonical predicates count owned copies while exact instance predicates stay exact',()=>{
    const instance=JSON.stringify({id:'Synthetic parcel',e2_instance:'e2_1'});
    const exact='target.item.'+instance;
    const inventory={[key]:2,[instance]:1},facts={[count]:99,[exact]:99};
    addInventoryRequirementFacts(facts,[none,{fact:exact,op:'eq',value:1}],{'target.item.':inventory});
    assert.equal(facts[count],3);assert.equal(facts[exact],1);
    delete inventory[key];
    addInventoryRequirementFacts(facts,none,{'target.item.':inventory});
    assert.equal(facts[count],1);
});

test('loss of actual inventory removes selected stale counts without changing unrelated facts',()=>{
    const facts={[count]:4,'knowledge.report.seen':true};
    addInventoryRequirementFacts(facts,none,{'target.item.':undefined});
    assert.equal(Object.hasOwn(facts,count),false);
    assert.equal(facts['knowledge.report.seen'],true);
});
