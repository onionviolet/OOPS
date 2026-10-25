import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateTrancheFourEnvelope} from '../src/absorb_p23/host_joins/tranche_four.js';

// p23-host-joins-step2: original fixture scope retained.
{
const fixture=()=>JSON.parse(readFileSync(new URL('../docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-host-joins/fixtures/tranche1-prelight.json',import.meta.url)));
test('old native envelope stays absent; optional schema rejection does not mutate it',()=>{
 const s=fixture(),before=structuredClone(s);validateTrancheFourEnvelope(s);assert.deepEqual(s,before);
 for(const key of ['field_familiarity_p07','p23_market_life','p23_leisure_memory','absorb_repeat_search']){
  const candidate={...s,[key]:{schema:99}},copy=structuredClone(candidate);assert.throws(()=>validateTrancheFourEnvelope(candidate));assert.deepEqual(candidate,copy);
 }
});

}

