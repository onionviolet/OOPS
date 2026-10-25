import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRepeatSearch as normalize,replenishRepeatSearch as offer,repeatSearchAction as action,advanceRepeatSearch as advance,repeatSearchView as view} from '../src/absorb_p23/repeat_search/repeat_search.js';
import {normalizeLocalLife,localLifeAction} from '../src/absorb_c2/local_life.js';
const frame=(clock=0,more={})=>({worldId:'base.frontier',location:'Village',alive:true,idle:true,clock,...more});
const event=(ordinal,clock)=>({kind:'village-runner-departed',ordinal,clock});
const reload=s=>JSON.parse(JSON.stringify(s));
test('P14 absent saves preserve finite C2 finds and start without fabricated stock',()=>{
    assert.equal(normalize().remaining,0);
    const c2=normalizeLocalLife({searches:{Village:{found:true},Shack:{found:true}}});
    assert.equal(localLifeAction(c2,{...frame(),calendarMinute:720},'look').ok,false);
    assert.equal(c2.searches.Shack.found,true);
    assert.match(view(undefined,frame()).summary,/next supply runner departure/);
});
test('P14 depletion, stopped feedback, real next occurrence and reload settle each offer once',()=>{
    let s=offer(undefined,frame(10),event(1,10)).state;
    s=action(reload(s),frame(10)).state;
    s=advance(s,frame(14)).state;assert.equal(s.progress,4);
    const paid=advance(reload(s),frame(15));assert.deepEqual(paid.native.items,[{item_id:'Linen cloth',count:1}]);
    assert.equal(paid.state.looking,false);assert.match(view(paid.state,frame(15)).summary,/No offered linen scraps remain/);
    assert.equal(action(paid.state,frame(15)).ok,false);
    assert.deepEqual(advance(reload(paid.state),frame(99)).native.items,[]);
    assert.equal(offer(reload(paid.state),frame(15),event(1,15)).state.remaining,0);
    s=offer(reload(paid.state),frame(100),event(2,100)).state;
    assert.equal(s.remaining,1);s=action(reload(s),frame(100)).state;
    const again=advance(s,frame(105));assert.equal(again.native.items[0].count,1);assert.equal(again.state.claims,2);
    assert.equal(offer(reload(again.state),frame(105),event(2,105)).state.remaining,0);
});
test('P14 offers do not accumulate and large clock jumps never pay a batch',()=>{
    let s=offer(undefined,frame(1),event(1,1)).state;
    s=offer(s,frame(999),event(900,999)).state;assert.equal(s.remaining,1);
    s=action(s,frame(999)).state;const p=advance(s,frame(100000));assert.equal(p.native.items[0].count,1);
    assert.deepEqual(advance(p.state,frame(100001)).native.items,[]);
});
test('P14 failed native persistence can discard a plan without losing or duplicating stock',()=>{
    const raw=offer(undefined,frame(1),event(1,1)).state,copy=structuredClone(raw);
    const started=action(raw,frame(1)).state;
    const candidate=advance(started,frame(6));assert.equal(candidate.native.items.length,1);
    assert.deepEqual(raw,copy);assert.equal(started.remaining,1);
    assert.deepEqual(advance(started,frame(6)),candidate);
});
test('P14 views are pure; wrong world, busy, dead, movement and backward/repeated clocks cannot harvest',()=>{
    const raw=offer(undefined,frame(10),event(1,10)).state,copy=structuredClone(raw);
    view(raw,frame(1000));assert.deepEqual(raw,copy);
    for(const more of [{worldId:'elsewhere'},{location:'Shack'},{alive:false},{idle:false}]) {
        assert.equal(action(raw,frame(10,more)).ok,false);
        const stopped=advance(action(raw,frame(10)).state,frame(15,more));
        assert.equal(stopped.state.looking,false);assert.deepEqual(stopped.native.items,[]);
    }
    const s=action(raw,frame(10)).state;
    assert.deepEqual(advance(s,frame(9)).state,s);assert.deepEqual(advance(s,frame(10)).state,s);
    assert.equal(action(raw,frame(9)).ok,false);
    assert.equal(offer(raw,frame(9),event(2,9)).state.departure,1);
    assert.equal(offer(raw,frame(10,{worldId:'elsewhere'}),event(2,10)).state.departure,1);
});
test('P14 malformed optional state/event rejects before mutation',()=>{
    const good=normalize();
    for(const raw of [null,[],false,{...good,schema:2},{...good,departure:-1},{...good,remaining:1},{...good,claims:1},
        {...good,looking:true},{...good,progress:5},{...good,lastClock:-1},{...good,remaining:true}]) assert.throws(()=>normalize(raw));
    assert.throws(()=>offer(good,frame(),event(0,0)));assert.deepEqual(good,normalize());
});
test('P14 same-clock departure from Village cancels accrued progress before return',()=>{
    let s=action(offer(undefined,frame(10),event(1,10)).state,frame(10)).state;
    s=advance(s,frame(14)).state;assert.equal(s.progress,4);
    s=advance(s,frame(14,{location:'Shack'})).state;
    assert.equal(s.progress,0);assert.equal(s.looking,false);
    assert.deepEqual(advance(s,frame(15)).native.items,[]);
});
