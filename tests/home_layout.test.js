import test from 'node:test';
import assert from 'node:assert/strict';
import {freshLayout,bedDelta,planMove,fieldOf,validateLayouts,migrateLayouts,emptyLayouts,LAYOUT_DIALS,VEINS} from '../src/home_layout.js';
import {observeToday,projectFortunes} from '../src/household_fortunes_domain.js';
import {layoutBedDelta} from '../src/home_layout_domain.js';
import '../src/home_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
const W='base.frontier',fx={bed:{key:'b'},hearth:{key:'h'},bookcase:{key:'c'}};
const at=(bed,hearth)=>({...freshLayout('manor'),at:{bed,hearth,bookcase:[1,2]}});
test('G22: smoke makes a hearth beside the bed a costed choice; a middling gap wins',()=>{
    const d=h=>bedDelta(at([0,0],h),fx,'manor',W);
    assert.ok(d([1,0])<-0.2,'hearth at the pillow: smoke hurts');
    assert.ok(d([2,1])>d([3,2])&&d([2,1])>0,'a couple of steps off: warm without smoke');
    assert.equal(planMove(at([0,0],[3,2]),fx,'manor',W,{slot:'hearth',x:1,y:0}).fee,2);
});
test('default stand and unknown worlds change nothing',()=>{
    assert.ok(Math.abs(bedDelta(freshLayout('manor'),fx,'manor',W))<0.05);
    assert.equal(bedDelta(at([0,0],[1,0]),fx,'manor','somewhere.else'),0);
    assert.equal(bedDelta(null,fx,'manor',W),0);
});
test('a removed fixture is ignored, not an error',()=>{
    assert.ok(bedDelta(at([0,0],[1,0]),{bed:{key:'b'}},'manor',W)>=0,'no hearth, no smoke');
    assert.equal(bedDelta(at([0,0],[1,0]),{hearth:{key:'h'}},'manor',W),0);
});
test('moves reject occupied, outside and uninstalled cells',()=>{
    const l=at([0,0],[3,2]);
    assert.match(planMove(l,fx,'manor',W,{slot:'hearth',x:0,y:0}).reason,/already stands/);
    assert.match(planMove(l,fx,'manor',W,{slot:'hearth',x:9,y:0}).reason,/outside/);
    assert.match(planMove(l,{bed:1},'manor',W,{slot:'hearth',x:2,y:0}).reason,/not installed/);
});
test('a qi world dial lifts a bed over a vein (dial, not default)',()=>{
    VEINS.manor=[[2,0]];const saved=LAYOUT_DIALS[W].qi.weight.value;
    try{assert.equal(bedDelta(at([2,0],[3,2]),fx,'manor',W)<0.2,true);LAYOUT_DIALS[W].qi.weight.value=0.6;
        assert.ok(bedDelta(at([2,0],[3,2]),fx,'manor',W)>0.2);assert.ok(fieldOf(at([0,0],[3,2]),fx,'manor',W).qi[0][2]>0);}
    finally{LAYOUT_DIALS[W].qi.weight.value=saved;delete VEINS.manor;}
});
test('validation throws on bad shape only; migration drops foreign slices',()=>{
    const ok={...emptyLayouts(),homes:{manor:freshLayout('manor')}};validateLayouts(ok);validateLayouts(null);
    for(const bad of [{...ok,family:'x'},{...ok,homes:{manor:{...ok.homes.manor,at:{bed:[9,9]}}}},{...ok,homes:{manor:{...ok.homes.manor,at:{bed:[0,0],hearth:[0,0]}}}},{...ok,homes:{castle:ok.homes.manor}}])assert.throws(()=>validateLayouts(bad));
    assert.equal(migrateLayouts({family:'other'}),null);assert.deepEqual(migrateLayouts(ok).homes.manor,ok.homes.manor);
});
test('no layout slice: fortunes read exactly the old bed score',()=>{
    domainRegistry.list().find(d=>d.id==='home_layout').load(null);
    const manor={id:'manor',access:true,fixtures:fx,condition:{integrity:70,wetness:0,rainMinutes:0}};
    assert.equal(layoutBedDelta('manor',W,fx),0);
    assert.equal(observeToday({world:W},manor).bed,0.7);
    domainRegistry.list().find(d=>d.id==='home_layout').load({...emptyLayouts(),homes:{manor:at([0,0],[1,0])}});
    assert.ok(observeToday({world:W},manor).bed<0.5,'smoke lowers the bed score once a layout exists');
    assert.equal(observeToday({world:'x'},manor).bed,0.7);
    domainRegistry.list().find(d=>d.id==='home_layout').load(null);
});
