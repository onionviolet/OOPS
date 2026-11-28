import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteReset,resolveResetFields} from '../src/reset_rules.js';
import {resetCases} from '../src/data/reset_cases.js';
test('a floor, puzzle, realm, school layer and short scenario have separate scopes',()=>{
 for(const row of resetCases){
    const holder=row.remembers?.[0]??'traveler';
    const q=quoteReset(row,{trigger:row.triggers[0],holder});
    assert.deepEqual(q.resets,row.resets);assert.equal(q.remembers,row.remembers==null?null:true);
    const fields=resolveResetFields(q,{current:{[row.keeps[0]]:'earned',other:'unknown'},anchor:{[row.resets[0]]:'original'}});
    assert.deepEqual(fields,{[row.resets[0]]:'original',[row.keeps[0]]:'earned'});
    assert.deepEqual(quoteReset(row,{trigger:'unrelated',holder}),{offered:false});
 }
 const puzzle=resetCases[1];
 const solved=quoteReset(puzzle,{endedBy:'levelSolved'});
 assert.deepEqual(solved,{offered:false,ended:true});
 assert.deepEqual(resolveResetFields(solved,{current:{},anchor:{}}),{});
 const short=resetCases.at(-1);
 assert.equal(quoteReset(short,{trigger:'scenarioTimeout',endedBy:'checkpointDissolves',holder:'bystander'}).remembers,false);
 assert.equal(quoteReset(short,{trigger:'earlyStop',endedBy:'checkpointDissolves'}).ended,true);
});
