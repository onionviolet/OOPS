import test from 'node:test';
import assert from 'node:assert/strict';
import {HARM_RUNGS,HARM_WORLDS,injurePart,healPart,actionModifiers,harmView,
    validateHarm,setHarmState,harmState} from '../src/harm_state.js';
import {domainRegistry} from '../src/domain_registry.js';

const rules=HARM_WORLDS['book.lotm.tingen'];
const clean=()=>({schema:1,backlash:{}});
const save=harm=>({expansion:{actors:{player:{worldId:rules.world}}},harm});
const injure=(s,id,rung='wounded')=>injurePart(s,rules,id,{rung,cause:'Impact'}).state;
const domain=domainRegistry.list().find(d=>d.id==='harm');

test('hurt hands grade craft accuracy and force; extreme injury blocks by part',()=>{
    for(const rung of HARM_RUNGS){
        const state=injure(clean(),'hands',rung), result=actionModifiers(save(state),'craft');
        assert.equal(result.allowed,['shaken','bruised','wounded'].includes(rung));
        for(const axis of ['accuracy','force','fineWork']){
            const m=result.modifiers.find(m=>m.axis===axis);
            assert.ok(m.mult>0 && m.mult<1);assert.match(m.cause,/Hands/);assert.match(m.cause,new RegExp(rung,'i'));
        }
        assert.equal(result.blockedBy?.part ?? null,result.allowed?null:'hands');
        assert.equal(actionModifiers(save(state),'rest').allowed,true);
        assert.deepEqual(actionModifiers(save(state),'rest').modifiers,[]);
    }
});

test('applying parts multiply shared axes and retain every cause',()=>{
    let state=injure(clean(),'hands');state=injure(state,'eyes','bruised');state=injure(state,'legs','shaken');
    const result=actionModifiers(save(state),'fight');assert.equal(result.allowed,true);
    const accuracy=result.modifiers.find(m=>m.axis==='accuracy');
    assert.equal(accuracy.mult,0.5*0.75);assert.match(accuracy.cause,/Hands/);assert.match(accuracy.cause,/Eyes/);
    assert.equal(result.modifiers.find(m=>m.axis==='speed').mult,0.9);
    assert.equal(result.modifiers.find(m=>m.axis==='force').mult,0.5);
    assert.equal(result.modifiers.filter(m=>m.axis==='accuracy').length,1);
});

test('backlash and parts combine while existing stage gates remain authoritative',()=>{
    const state=injure({schema:1,backlash:{power:3}},'eyes');
    const result=actionModifiers(save(state),'study');
    assert.equal(result.allowed,true);
    const precision=result.modifiers.find(m=>m.axis==='precision');
    assert.equal(precision.mult,0.9*0.5);assert.match(precision.cause,/Power strain: Strained; Eyes: Wounded/);
    state.backlash.power=6;
    assert.deepEqual(actionModifiers(save(state),'research').blockedBy,{carrier:'power',reason:'Power strain: Slipping'});
    state.backlash.power=9;assert.equal(actionModifiers(save(state),'rest').allowed,true);
    assert.throws(()=>actionModifiers(save(state),'missing'),/class/);
});

test('injuring is immutable and cannot lower severity or erase accumulated care',()=>{
    const state=injure(clean(),'hands','maimed'), before=structuredClone(state);
    assert.deepEqual(injure(state,'hands','bruised'),before);assert.deepEqual(state,before);
    const cared=healPart(state,rules,'hands',{minutes:30}).state;
    assert.equal(cared.parts.hands.care,30);
    assert.deepEqual(injure(cared,'hands','maimed'),cared);
    const worse=injure(cared,'hands','dying');assert.equal(worse.parts.hands.care,undefined);
    assert.throws(()=>injurePart(state,rules,'unknown',{rung:'wounded'}),/part/);
    assert.throws(()=>injurePart(state,rules,'hands',{rung:'unknown'}),/rung/);
    assert.throws(()=>injurePart(state,rules,'hands',{rung:'bruised',cause:''}),/cause/);
});

test('accumulated care survives JSON and treatment plus training recover faster',()=>{
    const original=injure(clean(),'hands','maimed'), before=structuredClone(original);
    let state=healPart(original,rules,'hands',{minutes:100}).state;
    state=JSON.parse(JSON.stringify(state));validateHarm(state);
    state=healPart(state,rules,'hands',{minutes:140}).state;
    assert.equal(state.parts.hands.rung,'wounded');assert.equal(state.parts.hands.care,0);
    const treated=healPart(original,rules,'hands',{minutes:60,treated:true}).state;
    const trained=healPart(original,rules,'hands',{minutes:60,treated:true,trained:true}).state;
    assert.equal(treated.parts.hands.rung,'wounded');assert.equal(trained.parts.hands.rung,'wounded');
    assert.ok(trained.parts.hands.care>treated.parts.hands.care);
    assert.equal(healPart(original,rules,'hands',{minutes:160,treated:true,trained:true}).state.parts,undefined);
    assert.deepEqual(original,before);
    for(const options of [{minutes:-1},{minutes:Infinity},{minutes:1,treated:1},{minutes:1,trained:'yes'}])
        assert.throws(()=>healPart(original,rules,'hands',options),/recovery/);
    assert.deepEqual(healPart(clean(),rules,'hands',{minutes:10}).state,clean());
});

test('clean states omit parts and save; populated states round-trip independently',()=>{
    setHarmState({schema:1,backlash:{},parts:{}});assert.equal(domain.save(),undefined);
    const state=healPart(injure(clean(),'hands'),rules,'hands',{minutes:30}).state;
    setHarmState(state);const saved=JSON.parse(JSON.stringify(domain.save()));
    domain.load(domain.migrate(saved));assert.deepEqual(harmState(),state);
    saved.parts.hands.care=99;assert.equal(harmState().parts.hands.care,30);
    setHarmState(healPart(state,rules,'hands',{minutes:1e6}).state);assert.equal(domain.save(),undefined);
    setHarmState({schema:1,backlash:{power:3},parts:{}});assert.equal(domain.save().parts,undefined);
});

test('part validation rejects hostile keys, invalid care, extra fields and oversized maps',()=>{
    for(const id of ['__proto__','constructor','prototype','bad key']){
        const state=JSON.parse(`{"schema":1,"backlash":{},"parts":{"${id}":{"rung":"wounded"}}}`);
        assert.throws(()=>validateHarm(state),/part/);
        assert.throws(()=>injurePart(clean(),rules,id,{rung:'wounded'}),/part/);
    }
    for(const part of [{rung:'missing'},{rung:'wounded',care:-1},{rung:'wounded',care:Infinity},
        {rung:'wounded',care:1_000_001},{rung:'wounded',cause:''},{rung:'wounded',extra:1},
        {rung:'wounded',cause:'a'.repeat(121)},Object.create({rung:'wounded'})])
        assert.throws(()=>validateHarm({schema:1,backlash:{},parts:{hands:part}}));
    const parts=Object.fromEntries(Array.from({length:64},(_,i)=>['part'+i,{rung:'shaken'}]));
    validateHarm({schema:1,backlash:{},parts});parts.extra={rung:'shaken'};
    assert.throws(()=>validateHarm({schema:1,backlash:{},parts}),/parts/);
    assert.throws(()=>validateHarm({schema:1,backlash:{},parts:[]}),/parts/);
});

test('harmView returns detached labels, graded axes and recovery on both world defaults',()=>{
    const state=injure(clean(),'hands');
    for(const world of [rules.world,'unbound.world']){
        const full=save(state);full.expansion.actors.player.worldId=world;
        const part=harmView(full).parts[0];
        assert.deepEqual({id:part.id,label:part.label,rung:part.rung,rungLabel:part.rungLabel},
            {id:'hands',label:'Hands',rung:'wounded',rungLabel:'Wounded'});
        assert.deepEqual(part.recovers,{rest:0.25,treated:1,trained:1.5});
        part.modifiers[0].mult=0;assert.equal(harmView(full).parts[0].modifiers[0].mult,0.5);
    }
    for(const world of [rules,HARM_WORLDS.default])for(const row of Object.values(world.parts)){
        assert.ok(row.reason);assert.ok(row.recoveryReason);assert.ok(row.blocksAt.reason);
        assert.ok(['maimed','dying'].includes(row.blocksAt.rung));
        for(const axes of Object.values(row.axes))for(const modifier of axes)assert.ok(modifier.reason);
    }
});
