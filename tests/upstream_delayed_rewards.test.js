import test from 'node:test';
import assert from 'node:assert/strict';
import {readDelayedRewards,settleDelayedRewards} from '../src/delayed_rewards.js';

const temple={temple_ritual:{delay:7,source:{source_type:'textline',source_name:'templePriest',inform_textline:false}}};

test('legacy envelope starts without upstream delayed dialogue rewards',()=>{
    assert.deepEqual(readDelayedRewards(),{});
    assert.throws(()=>readDelayedRewards({unknown:temple.temple_ritual}),/Invalid delayed reward/);
    assert.throws(()=>readDelayedRewards({temple_ritual:{...temple.temple_ritual,delay:-1}}),/Invalid delayed reward/);
});

test('staged temple reward resumes at the saved minute, settles once and agrees with a clock span',()=>{
    const first=settleDelayedRewards(readDelayedRewards(temple),3);
    assert.equal(first.next.temple_ritual.delay,4);
    assert.deepEqual(first.unlocks,[]);
    const restored=readDelayedRewards(JSON.parse(JSON.stringify(first.next)));
    const settled=settleDelayedRewards(restored,4);
    assert.deepEqual(settled,settleDelayedRewards(temple,7));
    assert.deepEqual(settled,{next:{},unlocks:[{dialogue:'temple priest',lines:['restore']}]});
    assert.deepEqual(settleDelayedRewards(settled.next,1),{next:{},unlocks:[]});
});
