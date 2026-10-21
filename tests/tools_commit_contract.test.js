import test from 'node:test';
import assert from 'node:assert/strict';
import {equipmentDurability as durability} from '../src/absorb_e2/durability.js';
import {configureToolsDomain, setToolsState, toolsState, quoteRepair, executeRepair, cancelRepair, validateTools} from '../src/tools_domain.js';
import {domainRegistry} from '../src/domain_registry.js';

function fixture() {
    durability.load({enabled:true}); setToolsState(null);
    const make = key => durability.bindFromKey(key, {tags:{equippable:true,tool:true},id:'Iron pickaxe',equip_slot:'pickaxe',base_bonus_skill_levels:{Mining:3},inventory_key:key,getInventoryKey(){return this.inventory_key;},getName(){return 'Iron pickaxe';}});
    const tool = durability.prepareEquip(make('{"id":"Iron pickaxe"}'), make), key=tool.getInventoryKey();
    durability.setCondition(key,10);
    const actor={items:{},equipment:{pickaxe:tool},getItems(){return this.items;},getEquipment(){return this.equipment;}};
    const stock={'Iron ingot':3}, rng={log:[]}, messages=[];
    let clock=100, location='Village', idle=true, writable=true, custody=false, failure='', saved, level=5, roll=.1;
    const ports={actor:()=>actor,skillLevel:()=>level,stationTier:()=>1,location:()=>location,clock:()=>clock,count:id=>stock[id]||0,
        itemOwners:()=>[stock,rng], assertSpend:id=>{if(custody && id===key)throw Error('Return borrowed goods.');},
        addItem:(id,n)=>{stock[id]=(stock[id]||0)+n;},removeItem:(id,n)=>{stock[id]-=n;},
        persist:done=>{if(failure==='write')throw Error('disk full');saved=snapshot();done();if(failure==='observer')throw Error('post-durable observer');},
        refresh:()=>{if(failure==='refresh')throw Error('display');},blocked:()=>'',writable:()=>writable,idle:()=>idle,
        random:k=>{rng.log.push(k);return roll;},logMessage:m=>{messages.push(m);if(failure==='log')throw Error('log display');}};
    configureToolsDomain(ports);
    const snapshot=()=>structuredClone({tools:toolsState(),durability:durability.serialize(),stock,rng});
    const tick=m=>{clock+=m;domainRegistry.list().find(d=>d.id==='tools').tick(m);};
    return {tool,key,actor,stock,rng,messages,snapshot,tick,quote:()=>quoteRepair({key}),start:()=>executeRepair(quoteRepair({key})),saved:()=>saved,
        clock:()=>clock,at:v=>{location=v;},idle:v=>{idle=v;},writable:v=>{writable=v;},custody:v=>{custody=v;},fail:v=>{failure=v;},level:v=>{level=v;},roll:v=>{roll=v;}};
}

test('P4 stale condition/history/location/custody refuses before spending; exact copies never retarget',()=>{
    for(const change of [f=>durability.setCondition(f.key,10.001),f=>setToolsState({schema:1,instances:{[f.key]:{max:100,repairs:1,failures:0}},job:null}),f=>f.at('Shack'),f=>f.custody(true),f=>{f.actor.equipment={};}]) {
        const f=fixture(),q=f.quote();change(f);const before=f.snapshot();
        assert.throws(()=>executeRepair(q));assert.deepEqual(f.snapshot(),before);
    }
    const f=fixture(),q=f.quote();
    const secondKey=f.key.replace('e2.1','e2.2');f.actor.equipment.pickaxe={...f.tool,getInventoryKey:()=>secondKey};
    assert.throws(()=>executeRepair(q),/carried or equipped/);assert.equal(f.stock['Iron ingot'],3);
    const g=fixture();g.start();assert.equal(g.stock['Iron ingot'],2);assert.throws(()=>g.start(),/current repair/);
});

test('P4 failed start and cancel writes roll back reservations; cancellation refunds once',()=>{
    const f=fixture(),before=f.snapshot();f.fail('write');assert.throws(()=>f.start(),/disk full/);assert.deepEqual(f.snapshot(),before);
    f.fail('');f.start();const pending=f.snapshot();f.fail('write');assert.throws(cancelRepair,/disk full/);assert.deepEqual(f.snapshot(),pending);
    f.fail('');cancelRepair();assert.equal(f.stock['Iron ingot'],3);assert.throws(cancelRepair,/No repair/);assert.equal(f.stock['Iron ingot'],3);
});

test('P4 failed completion restores condition, history, job and draw; retry uses the already committed clock once',()=>{
    for(const roll of [.1,.99]) {
        const f=fixture();f.roll(roll);f.start();const pending=f.snapshot(),total=toolsState().job.total;
        f.fail('write');assert.throws(()=>f.tick(total),/disk full/);assert.deepEqual(f.snapshot(),pending);assert.equal(f.messages.length,1);
        f.fail('');f.tick(0);assert.equal(toolsState().job,null);assert.equal(f.rng.log.length,1);
        assert.equal(toolsState().instances[f.key][roll<.5?'repairs':'failures'],1);assert.deepEqual(f.saved(),f.snapshot());
        const finished=f.snapshot();f.tick(0);f.tick(4);assert.deepEqual(f.snapshot(),finished);
    }
});

test('P4 post-durable observer/display failures never undo or repeat accepted cost/refund/result',()=>{
    for(const failure of ['observer','refresh','log']) {
        const f=fixture();f.fail(failure);assert.throws(()=>f.start());assert.equal(f.stock['Iron ingot'],2);assert.ok(toolsState().job);
        f.fail('');assert.throws(()=>f.start(),/current repair/);
        f.fail(failure);assert.throws(cancelRepair);assert.equal(f.stock['Iron ingot'],3);assert.equal(toolsState().job,null);
        f.fail('');assert.throws(cancelRepair,/No repair/);f.start();const total=toolsState().job.total;
        f.fail(failure);assert.throws(()=>f.tick(total));assert.equal(toolsState().job,null);assert.equal(f.rng.log.length,1);
        f.fail('');f.tick(0);assert.equal(f.rng.log.length,1);assert.equal(toolsState().instances[f.key].repairs,1);
    }
});

test('P4 progress, paused intervals and pending/finished JSON roundtrip preserve frozen quote and segmented time',()=>{
    const run=parts=>{
        const f=fixture();f.start();const total=toolsState().job.total;
        f.at('Shack');f.tick(20);assert.equal(toolsState().job.minutesLeft,total);
        f.at('Village');f.idle(false);f.tick(5);assert.equal(toolsState().job.minutesLeft,total);
        f.idle(true);f.tick(3);assert.equal(toolsState().job.minutesLeft,total-3);
        const pending=JSON.parse(JSON.stringify(f.snapshot()));validateTools(pending.tools);pending.tools.job.target=Object.fromEntries(Object.entries(pending.tools.job.target).reverse());setToolsState(pending.tools);durability.load(pending.durability);
        assert.deepEqual(f.saved(),pending);f.level(50); // Accepted result band remains frozen.
        for(const share of parts)f.tick((total-3)*share);
        assert.equal(toolsState().job,null);const finished=JSON.parse(JSON.stringify(f.snapshot()));validateTools(finished.tools);
        setToolsState(finished.tools);durability.load(finished.durability);f.tick(0);assert.deepEqual(f.snapshot(),finished);
        return finished;
    };
    assert.deepEqual(run([1]),run([.25,.25,.5]));
});

test('P4 changed accepted target/custody pauses without applying old result; cancellation remains available',()=>{
    for(const change of [f=>durability.setCondition(f.key,20),f=>f.custody(true)]) {
        const f=fixture();f.start();const total=toolsState().job.total;change(f);f.tick(total);
        assert.equal(toolsState().job.minutesLeft,total);assert.equal(f.rng.log.length,0);
        assert.ok(domainRegistry.project('tools').repairBlocked);cancelRepair();assert.equal(f.stock['Iron ingot'],3);
    }
    const f=fixture();f.start();f.writable(false);assert.throws(cancelRepair,/writable/);assert.equal(f.stock['Iron ingot'],2);
});

test('P4 schema-1 pending jobs without new optional bindings remain loadable, malformed bindings refuse',()=>{
    const f=fixture();f.start();const old=structuredClone(toolsState());delete old.job.target;delete old.job.lastClock;
    validateTools(old);setToolsState(old);f.tick(old.job.total);assert.equal(toolsState().job,null);
    for(const patch of [{lastClock:-1},{target:{condition:200,max:100,repairs:0,failures:0,uses:0}},{minutesLeft:99999}])
        assert.throws(()=>validateTools({...old,job:{...old.job,...patch}}),/Invalid tool repair binding/);
});


test('P4 a rejected partial-work write retries its consumed interval; zero-time projection cannot add work',()=>{
    const f=fixture();f.start();const before=f.snapshot();
    f.tick(0);assert.deepEqual(f.snapshot(),before);
    for(let i=0;i<3;i++)domainRegistry.project('tools');assert.deepEqual(f.snapshot(),before);
    f.fail('write');assert.throws(()=>f.tick(4),/disk full/);assert.deepEqual(f.snapshot(),before);
    f.fail('');f.tick(0);assert.equal(toolsState().job.minutesLeft,before.tools.job.minutesLeft-4);
    assert.equal(f.rng.log.length,0);assert.deepEqual(f.saved(),f.snapshot());
    const caughtUp=f.snapshot();f.tick(0);assert.deepEqual(f.snapshot(),caughtUp);
});
