import test from 'node:test';
import assert from 'node:assert/strict';
import {createClockOwner,setClockSpanModeForTests} from '../src/clock_owner.js';

function fixture() {
    const events=[];
    const clock={expansionState:{clock:0,actors:{player:{facts:{}}}},current_game_time:{},
        usesJoinedClock:()=>true,is_night:()=>false,mistglassNextBoundary:(_s,t)=>t,
        waitingSimulationChoice:()=>false,createPlanningReadFrame:()=>({}),
        advanceChroniclePlan:(plan,minutes,travel,frame)=>{
            events.push(['advance',minutes,travel,!!frame]);
            return {...plan,state:{...plan.state,clock:plan.state.clock+minutes}};
        }};
    const save={ownsSave:true,gameplaySnapshot:()=>({}),persistExpansion:plan=>{
        events.push(['persist',plan.state.clock]);clock.expansionState=plan.state;
    }};
    const body={character:{money:7,updateStatsAndDisplay:()=>events.push(['stats'])},nativeLifeEnded:()=>false};
    const world={optionalPackState:{packs:{}},config:{time_speedup_when_sleeping:5},
        backlogNativeClockPaused:()=>false,domainRegistry:{tick:n=>events.push(['tick',n])}};
    const ui={deferWhileHidden:()=>false,renderClockPanels:()=>events.push(['render']),
        log_message:()=>{},refreshCustomization:()=>{},update_displayed_time:()=>{},awakenOptionalStart:()=>{}};
    return {clock,save,body,world,ui,events,advance:createClockOwner({clock,save,body,world,ui})};
}
test('a span publishes once before domain consumers, preserving source and consumed minutes',()=>{
    const f=fixture();
    assert.equal(f.advance(349,'travel'),349);
    assert.deepEqual(f.events,[['advance',349,true,false],['persist',349],['tick',349],['render']]);
    assert.equal(f.clock.expansionState.clock,349);
});
test('live guards and decisions stop advancement without spending or publishing',()=>{
    for(const block of [f=>f.clock.authorityOperationBusy=true,f=>f.clock.authorityBootError=true,
        f=>f.body.nativeLifeEnded=()=>true,f=>f.world.optionalPackState.pendingStructured=true,
        f=>f.save.ownsSave=false,f=>f.save.foundationSaveBlocked=true,f=>f.save.importProbeToken={},
        f=>f.clock.expansionState.simulation={sessions:{player:{}}},
        f=>f.clock.expansionState.chronicle={session:{policy:'manual'}}]) {
        const f=fixture();block(f);assert.equal(f.advance(349),0);assert.deepEqual(f.events,[]);
    }
});
test('job and native boundaries clip the span before durable publication',()=>{
    const f=fixture();f.world.p23Leisure={pending:{due:7}};
    f.clock.mistglassNextBoundary=(_s,t)=>Math.min(3,t);
    assert.equal(f.advance(349),3);
    assert.deepEqual(f.events,[['advance',3,false,false],['persist',3],['tick',3],['render']]);
});
test('natural sleep and rest requests retain their existing clock owner',()=>{
    const f=fixture();f.body.is_sleeping=true;assert.equal(f.advance(),5);
    f.clock.expansionState.p23Reading={current:{kind:'rest'}};
    f.clock.studyContext=()=>({});f.clock.longRestClockRequest=()=>2;
    assert.equal(f.advance(),2);
});
test('failed durable publication cannot tick domains or publish a successful span',()=>{
    const f=fixture();f.save.persistExpansion=()=>{throw Error('fixture storage failure');};
    const original=console.error;console.error=()=>{};
    try {assert.equal(f.advance(349),0);} finally {console.error=original;}
    assert.equal(f.clock.expansionState.clock,0);assert.equal(f.clock.expansionError,'fixture storage failure');
    assert.deepEqual(f.events,[['advance',349,false,false]]);
});
test('existing stepper read-frame phase is passed to the same planner and publisher',()=>{
    const f=fixture(),frame={};f.clock.stepperRenderSuppressed=true;
    f.clock.createPlanningReadFrame=()=>frame;
    f.save.persistExpansion=(plan,_owners,_items,read)=>{assert.equal(read,frame);f.clock.expansionState=plan.state;};
    assert.equal(f.advance(1),1);assert.deepEqual(f.events[0],['advance',1,false,true]);
});

test('test-only dial requests individual minutes through the existing owner',()=>{
    const f=fixture();
    try {
        setClockSpanModeForTests('stepped');assert.equal(f.advance(349),1);
        assert.deepEqual(f.events,[['advance',1,false,false],['persist',1],['tick',1],['render']]);
        assert.throws(()=>setClockSpanModeForTests('unknown'));
    } finally {setClockSpanModeForTests('span');}
    assert.equal(f.advance(349),349);
});
