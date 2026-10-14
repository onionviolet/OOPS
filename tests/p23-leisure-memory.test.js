import test from 'node:test';
import assert from 'node:assert/strict';
import {createLeisureMemory,validateLeisureMemory,startLeisureRound,settleLeisureRound,respondToEda,revisitEda,rememberNativeDefeat,leisureMemoryView,LEISURE_PERSON} from '../src/absorb_p23/leisure_memory/index.js';
import {appendLifeMilestone,createLifeRecord,lifeRecordView,LIFE_YEAR_MINUTES} from '../src/life_record.js';
import {createChronicle,relationshipChange,validateChronicle} from '../src/chronicle.js';
const context = (extra={}) => ({clock:0,rng:123,worldId:'base.frontier',location:'Village',alive:true,conscious:true,idle:true,money:10,stamina:5,
    personId:LEISURE_PERSON,personKnown:true,personPresent:true,personAlive:true,personMoney:1,...extra});
const restore = s => JSON.parse(JSON.stringify(s));
test('old absent state stays absent and unsupported schemas reject without mutation',()=>{
    assert.equal(validateLeisureMemory(undefined,0),undefined);
    assert.equal(validateLeisureMemory(null,0),null);
    const s={...createLeisureMemory(),schema:99}, before=restore(s);
    assert.throws(()=>startLeisureRound(s,1,context())); assert.deepEqual(s,before);
});
test('paid start freezes native RNG draw; pending reload/import does not reveal or reroll',()=>{
    const s=createLeisureMemory(), c=context(), r=startLeisureRound(s,4,c);
    assert.equal(r.state.pending.seedBefore,123);assert.notEqual(r.rng,c.rng);
    assert.deepEqual(r.effects,[{type:'nativeMoney',amount:-1},{type:'nativeStamina',amount:-1}]);
    assert.equal(s.pending,null);assert.equal(c.rng,123);
    assert.deepEqual(validateLeisureMemory(restore(r.state),0),r.state);
    assert.equal(Object.hasOwn(leisureMemoryView(r.state,c).pending,'face'),false);
    assert.throws(()=>startLeisureRound(r.state,4,{...c,rng:r.rng}));
});
test('two paid rounds use advancing native RNG and settle once each',()=>{
    let s=createLeisureMemory(), c=context();
    for(let i=1;i<=2;i++){
        const r=startLeisureRound(s,1,c);s=restore(r.state);c={...c,rng:r.rng,clock:c.clock+2,money:c.money-1,stamina:c.stamina-1};
        const done=settleLeisureRound(s,i,c);assert.equal(done.effects.filter(x=>x.type==='biography').length,1);
        s=restore(done.state);assert.equal(s.rounds,i);assert.deepEqual(settleLeisureRound(s,i,c).effects,[]);
    }
    assert.equal(s.last.id,2);assert.equal(c.money,8);
});
test('matching target restores only one paid stamina, no minted coins',()=>{
    const first=startLeisureRound(createLeisureMemory(),1,context());
    const target=first.state.pending.face;const r=startLeisureRound(createLeisureMemory(),target,context());
    const done=settleLeisureRound(r.state,1,context({clock:2,rng:r.rng}));
    assert.equal(done.state.last.matched,true);assert.deepEqual(done.effects[0],{type:'nativeStamina',amount:1});
    assert.equal(done.effects.some(x=>x.type==='nativeMoney'),false);
});
test('pending paid result remains settleable after life ends without stamina resurrection',()=>{
    const probe=startLeisureRound(createLeisureMemory(),1,context());
    const r=startLeisureRound(createLeisureMemory(),probe.state.pending.face,context());
    const done=settleLeisureRound(r.state,1,context({clock:2,rng:r.rng,alive:false,conscious:false}));
    assert.equal(done.state.last.matched,true);assert.equal(done.effects.some(x=>x.type==='nativeStamina'),false);
});
test('due time and revision prevent premature settlement or stale payments',()=>{
    const s=createLeisureMemory(), r=startLeisureRound(s,1,context());
    assert.throws(()=>settleLeisureRound(r.state,1,context({clock:1,rng:r.rng})));
    assert.throws(()=>settleLeisureRound(r.state,1,context({clock:2,rng:r.rng}),0));
});
test('resource, location, custody/body and native person controls reject before mutation',()=>{
    for(const bad of [{money:0},{stamina:0},{alive:false},{conscious:false},{idle:false},{location:'Forest'},{worldId:'elsewhere'}]){
        const s=createLeisureMemory();assert.throws(()=>startLeisureRound(s,1,context(bad)));assert.deepEqual(s,createLeisureMemory());
    }
    for(const bad of [{personKnown:false},{personPresent:false},{personAlive:false},{personId:'other'}])
        assert.throws(()=>respondToEda(createLeisureMemory(),'help',context(bad)));
});
test('gift transfers a real coin and changes only a later known local response',()=>{
    const r=respondToEda(createLeisureMemory(),'help',context());
    assert.deepEqual(r.effects.slice(0,2),[{type:'nativeMoney',amount:-1},{type:'personMoney',personId:LEISURE_PERSON,amount:1}]);
    assert.equal(revisitEda(r.state,context({clock:1})).state.offer,'waiting');
    const ready=revisitEda(restore(r.state),context({clock:2}));assert.equal(ready.state.offer,'ready');
    assert.equal(revisitEda(ready.state,context({clock:3})).effects.length,0);
    const round=startLeisureRound(restore(ready.state),3,context({clock:3}));assert.equal(round.state.pending.fee,0);
    const done=settleLeisureRound(round.state,1,context({clock:5,rng:round.rng}));
    assert.equal(startLeisureRound(done.state,3,context({clock:5,rng:round.rng})).state.pending.fee,1);
});
test('refusal remains different and ordinary leisure stays reachable',()=>{
    const r=respondToEda(createLeisureMemory(),'refuse',context());
    assert.equal(r.effects.some(x=>x.type==='nativeMoney'),false);
    const returned=revisitEda(r.state,context({clock:4}));assert.equal(returned.state.offer,'none');
    assert.match(leisureMemoryView(returned.state,context({clock:4})).person.text,/ordinary table/);
    assert.equal(startLeisureRound(returned.state,1,context({clock:4})).state.pending.fee,1);
});
test('kindness can recur after consumed offer without a lifetime cap',()=>{
    let s=createLeisureMemory(),c=context();
    for(let i=0;i<3;i++){
        s=respondToEda(s,'help',c).state;c.clock+=2;s=revisitEda(s,c).state;
        const r=startLeisureRound(s,2,c);c.rng=r.rng;c.clock+=2;
        s=settleLeisureRound(r.state,i+1,c).state;
    }
    assert.equal(s.rounds,3);assert.equal(s.offer,'used');
});
test('absent donor does not grant saved private offer or expose person',()=>{
    const helped=respondToEda(createLeisureMemory(),'help',context());
    const s=revisitEda(helped.state,context({clock:2})).state;
    assert.equal(startLeisureRound(s,1,context({clock:2,personPresent:false})).state.pending.fee,1);
    assert.equal(leisureMemoryView(s,context({clock:2,personKnown:false})).person,null);
});
test('malformed counters, paid draw and forged outcomes reject',()=>{
    const r=startLeisureRound(createLeisureMemory(),4,context());
    for(const patch of [{schema:2},{offer:'ready'},{rounds:-1},{revision:Infinity},{extra:true}])assert.throws(()=>validateLeisureMemory({...r.state,...patch},0));
    for(const patch of [{face:7},{seedAfter:42},{due:1},{id:9},{fee:0}]){
        const bad=restore(r.state);Object.assign(bad.pending,patch);assert.throws(()=>validateLeisureMemory(bad,0));
    }
});
test('native defeat baseline creates no invented past; cause memory is idempotent',()=>{
    const s=createLeisureMemory(7),event={kind:'unconsciousness',cause:'combat',count:8,knownOpponent:'Wolf'};
    const r=rememberNativeDefeat(s,event,context());assert.match(r.effects[0].text,/lost consciousness in combat with Wolf/);
    assert.deepEqual(rememberNativeDefeat(restore(r.state),event,context()).effects,[]);
    assert.throws(()=>rememberNativeDefeat(s,{...event,count:9},context()));
    assert.throws(()=>rememberNativeDefeat(s,{...event,kind:'death'},context()));
    assert.throws(()=>rememberNativeDefeat(s,{...event,knownOpponent:'<hidden>'},context()));
});
test('known-only biography and existing relationship owner accept actual helper facts',()=>{
    const r=respondToEda(createLeisureMemory(),'help',context());
    let record=createLifeRecord();const at=100*LIFE_YEAR_MINUTES;
    for(const e of r.effects.filter(e=>e.type==='biography'))record=appendLifeMilestone(record,{kind:e.kind,text:e.text,year:100,at,worldId:'base.frontier'});
    assert.equal(lifeRecordView(record).count,1);assert.match(lifeRecordView(restore(record)).recent[0].text,/gave Eda one coin/);
    const calendar={year:100,month:1,day:1,hour:0,minute:0,day_count:0};
    const chronicle=createChronicle(0,calendar);const e=r.effects.find(e=>e.type==='relationshipMemory');
    relationshipChange(chronicle,e.personId,{id:e.id,text:e.text,ties:{cupHelp:true}},0);
    validateChronicle(chronicle,0);assert.equal(chronicle.life.endedAt,null);
    assert.equal(chronicle.relationships[LEISURE_PERSON].memories.length,1);
});

test('sponsored practice spends Eda real coin and no-coin donor leaves ordinary play available',()=>{
    const h=respondToEda(createLeisureMemory(),'help',context());
    const ready=revisitEda(h.state,context({clock:2})).state;
    const free=startLeisureRound(ready,1,context({clock:2}));
    assert.deepEqual(free.effects.at(-1),{type:'personMoney',personId:LEISURE_PERSON,amount:-1});
    const paid=startLeisureRound(ready,1,context({clock:2,personMoney:0}));
    assert.equal(paid.state.pending.fee,1);assert.equal(paid.state.offer,'ready');
});
test('response retry with captured revision cannot duplicate a coin transfer',()=>{
    const r=respondToEda(createLeisureMemory(),'help',context(),0);
    assert.throws(()=>respondToEda(r.state,'help',context(),0),/stale revision/);
    assert.equal(r.effects.filter(e=>e.type==='personMoney').length,1);
});
