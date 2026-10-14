import test from 'node:test';
import assert from 'node:assert/strict';
import {computeAway} from '../src/away_ledger.js';

const MIN=60000,T0=1700000000000;
const input=(minutes,extra={})=>({lastSeen:T0,now:T0+minutes*MIN,capMinutes:480,
    activity:{id:'meditate',xpPerMinute:2},...extra});
test('whole minutes earn XP while fractions carry across calls',()=>{
    const a=computeAway(input(1.5));
    assert.deepEqual(a,{appliedMinutes:1,overflowMinutes:0,bankedMinutes:0,gains:{xp:2},
        stoppedBy:null,remainderMs:30000,nextLastSeen:T0+90000});
    const b=computeAway(input(2,{lastSeen:a.nextLastSeen,remainderMs:a.remainderMs}));
    assert.equal(b.appliedMinutes,1);assert.equal(b.remainderMs,0);
    const c=computeAway(input(2,{lastSeen:b.nextLastSeen,remainderMs:b.remainderMs}));
    assert.equal(c.appliedMinutes,0);
});
test('cap drops or banks excess game minutes without replaying them',()=>{
    for(const overflow of ['drop','bank']) {
        const r=computeAway(input(600.5,{overflow,bankedMinutes:10}));
        assert.equal(r.appliedMinutes,480);assert.equal(r.overflowMinutes,120);
        assert.equal(r.bankedMinutes,overflow==='bank' ? 130 : 10);
        assert.equal(r.gains.xp,960);assert.equal(r.remainderMs,30000);
        const next=computeAway(input(600.5,{lastSeen:r.nextLastSeen,remainderMs:r.remainderMs,
            bankedMinutes:r.bankedMinutes,overflow}));
        assert.equal(next.appliedMinutes,0);assert.equal(next.bankedMinutes,r.bankedMinutes);
    }
});
test('earliest barrier leaves time pending, including eventual cap overflow',()=>{
    const a=computeAway(input(600.5,{overflow:'bank',barriers:[{at:200,id:'late'},{at:100,id:'event'}]}));
    assert.equal(a.appliedMinutes,100);assert.equal(a.stoppedBy,'event');
    assert.equal(a.nextLastSeen,T0+100*MIN);assert.equal(a.remainderMs,0);
    assert.equal(a.overflowMinutes,0);assert.equal(a.bankedMinutes,0);
    const b=computeAway(input(600.5,{lastSeen:a.nextLastSeen,remainderMs:a.remainderMs,overflow:'bank'}));
    assert.equal(b.appliedMinutes,480);assert.equal(b.bankedMinutes,20);assert.equal(b.remainderMs,30000);
});
test('ratio and carried fractions conserve time through a fractional barrier',()=>{
    const a=computeAway(input(3,{gameMinutesPerRealMinute:2,remainderMs:30000,
        barriers:[{at:1.5,id:'event'}]}));
    assert.equal(a.appliedMinutes,1.5);assert.equal(a.nextLastSeen,T0+15000);
    assert.equal(a.remainderMs,0);
    const b=computeAway(input(3,{lastSeen:a.nextLastSeen,remainderMs:a.remainderMs,gameMinutesPerRealMinute:2}));
    assert.equal(b.appliedMinutes,4);assert.equal(b.remainderMs,45000);
    assert.equal(a.appliedMinutes+b.appliedMinutes+b.remainderMs/MIN*2,7);
});
test('zero barrier preserves carry; equal or beyond endpoint barriers do not stop',()=>{
    const a=computeAway(input(10,{remainderMs:30000,barriers:[{at:0,id:'immediate'}]}));
    assert.equal(a.appliedMinutes,0);assert.equal(a.nextLastSeen,T0);assert.equal(a.remainderMs,30000);
    for(const at of [10,11])assert.equal(computeAway(input(10,{barriers:[{at,id:'later'}]})).stoppedBy,null);
    assert.equal(computeAway(input(10,{capMinutes:0})).overflowMinutes,10);
});
test('clock reversal preserves cursor, carry and bank without awarding XP',()=>{
    assert.deepEqual(computeAway(input(-5,{remainderMs:30000,bankedMinutes:12})),
        {appliedMinutes:0,overflowMinutes:0,bankedMinutes:12,gains:{xp:0},
            stoppedBy:'clock-back',remainderMs:30000,nextLastSeen:T0});
});
test('diminishing XP applies only past threshold; no activity earns no XP',()=>{
    const activity={id:'meditate',xpPerMinute:2,diminishAfter:120,diminishFactor:0.5};
    assert.equal(computeAway(input(200,{activity})).gains.xp,320);
    assert.equal(computeAway(input(100,{activity})).gains.xp,200);
    assert.equal(computeAway(input(200,{activity:{...activity,diminishFactor:0}})).gains.xp,240);
    assert.equal(computeAway(input(200,{activity:null})).gains.xp,0);
    assert.equal(computeAway({lastSeen:T0,now:T0+MIN,capMinutes:480}).gains.xp,0);
});
test('frozen inputs remain unchanged and repeated calls return independent results',()=>{
    const activity=Object.freeze({id:'meditate',xpPerMinute:2});
    const barriers=Object.freeze([Object.freeze({at:8,id:'late'}),Object.freeze({at:5,id:'first'})]);
    const original=Object.freeze(input(10,{activity,barriers})),before=JSON.stringify(original);
    const a=computeAway(original),b=computeAway(original);
    assert.deepEqual(a,b);a.gains.xp=99;assert.equal(b.gains.xp,10);
    assert.equal(JSON.stringify(original),before);
});
test('invalid numeric inputs and policies fail clearly',()=>{
    for(const extra of [{now:NaN},{lastSeen:Infinity},{capMinutes:-1},{gameMinutesPerRealMinute:0},
        {gameMinutesPerRealMinute:Infinity},{bankedMinutes:-1},{remainderMs:MIN},{overflow:'other'},
        {barriers:[{at:-1,id:'bad'}]},{activity:{xpPerMinute:NaN}}])
        assert.throws(()=>computeAway(input(10,extra)),/Invalid/);
});
