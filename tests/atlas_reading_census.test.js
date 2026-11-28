import test from 'node:test';
import assert from 'node:assert/strict';
import {classify,censusCells,rankGaps,sample} from '../prototypes/world-atlas/census-rules.mjs';
const base={id:'fixture.rule.allocation',label:'T',locator:'en b1 c2 p3',results:[{what:'Allocate earned stat points.'}]};
test('a single located claim is required and private or inferred rows stay outside the census',()=>{
    assert.deepEqual(classify(base),['SM1']);
    for(const change of [{label:'I'},{private:true},{locator:'unknown'},{results:[{what:'Gain stat points.'},{what:'Allocate.'}]},{results:[{sealed:true,what:'Allocate earned stat points.'}]}])
        assert.deepEqual(classify({...base,...change}),[]);
});
test('each family has a positive example and rankings discount exercised laws',()=>{
    const cases=['allocate stat points','experience scales with level gap','shared experience among party members','second class','available skill slots','system patch changed combat','patron grants aid','joint skill requires both members','essence combination determines confluence','artifacts interfere with each other','limited restarts','clones share a mana pool','skill changes name at level','skill evolution choices','skill rarity increases','skills fuse into a new skill','skill consolidation','profession evolves into'];
    const expected=cases.map((_,i)=>i<12?'SM'+(i+1):'EV'+(i-11));
    cases.forEach((name,i)=>assert.ok(classify({...base,name,results:[]}).includes(expected[i]),name));
    const report={worlds:[{world:'a',book:'A',located:100}],matches:expected.map(code=>({...base,world:'a',code}))};
    assert.equal(censusCells(report).length,18);
    assert.equal(rankGaps(report,new Set(['SM1'])).some(row=>row.code==='SM1'),false);
    assert.deepEqual(sample(report.matches),sample([...report.matches].reverse()));
});
