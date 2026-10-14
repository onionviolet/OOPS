import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveStart,validateStart,seededStartRng,START_MERGE_RULES} from '../src/start_records.js';
import {frontierStartWorld as world} from '../src/data/start_layers_frontier.js';
const vanilla={entry:{mode:'lock',layerId:'vanilla'},background:{mode:'lock',layerId:'empty'},possessions:{mode:'lock',layerId:'empty'}};
const choices={entry:vanilla.entry,background:{mode:'roll'},possessions:{mode:'roll'}};
test('every Frontier item has a plain single-sentence pocket history',()=>{
    for(const layers of Object.values(world.layers))for(const layer of layers)for(const item of layer.patch.items || []) {
        const line=layer.patch.pockets?.[item.id];
        assert.equal(typeof line,'string');assert.ok(line.trim());
        assert.match(line,/^[^.!?\u2014]+[.]$/);
    }
});
test('pocket histories keep separate layer origins when bread stacks merge',()=>{
    const r=resolveStart(world,{...vanilla,possessions:{mode:'lock',layerId:'packed-bread'}},'pockets');
    assert.equal(START_MERGE_RULES.pockets,'append');
    assert.deepEqual(r.snapshot.pockets,[
        {axis:'entry',layerId:'vanilla',itemId:'Cheap leather pants',line:world.layers.entry[1].patch.pockets['Cheap leather pants']},
        {axis:'entry',layerId:'vanilla',itemId:'Stale bread',line:world.layers.entry[1].patch.pockets['Stale bread']},
        {axis:'possessions',layerId:'packed-bread',itemId:'Stale bread',line:world.layers.possessions[1].patch.pockets['Stale bread']}
    ]);
    assert.deepEqual(r.snapshot.items,[{id:'Cheap leather pants',quality:40,count:1},{id:'Stale bread',count:7}]);
    assert.equal(r.snapshot.money,102);assert.equal(r.snapshot.location,'Village');assert.equal(r.snapshot.quest,'Lost memory');
    r.snapshot.pockets[0].line='Changed locally.';
    assert.notEqual(resolveStart(world,vanilla,'pockets').snapshot.pockets[0].line,'Changed locally.');
});
test('pockets have one entry per layer and item, including hidden axes and quality variants',()=>{
    const w={id:'pockets',revision:1,axes:['background','entry'],base:{location:'Village',quest:'Lost memory'},layers:{
        background:[{id:'parcel',revision:1,patch:{items:[{id:'bread',count:2},{id:'bread',quality:40,count:1}],
            pockets:{bread:'Crumbs cling to the wrapping.',unused:'This has no item.'}}}],
        entry:[{id:'empty',revision:1,patch:{}}]
    }};
    const r=resolveStart(w,{background:{mode:'unknown'}},'hidden');
    assert.deepEqual(r.hidden,['background']);
    assert.deepEqual(r.snapshot.pockets,[{axis:'background',layerId:'parcel',itemId:'bread',line:'Crumbs cling to the wrapping.'}]);
    assert.deepEqual(resolveStart(world,{...vanilla,entry:{mode:'lock',layerId:'empty'}},'empty').snapshot.pockets,[]);
});
test('start seeds are deterministic, varied and leave world and choices untouched',()=>{
    const before=JSON.stringify({world,choices}),a=resolveStart(world,choices,'alpha');
    assert.deepEqual(a,resolveStart(world,choices,'alpha'));
    assert.ok(new Set(Array.from({length:20},(_,i)=>JSON.stringify(resolveStart(world,choices,String(i)).provenance.layers))).size>1);
    assert.equal(JSON.stringify({world,choices}),before);
    assert.equal(seededStartRng('seed')(),seededStartRng('seed')());
});
test('locked vanilla is native parity and provenance names every revision',()=>{
    const r=resolveStart(world,vanilla,'parity');
    assert.deepEqual({money:r.snapshot.money,items:r.snapshot.items,location:r.snapshot.location,quest:r.snapshot.quest},
        {money:102,items:[{id:'Cheap leather pants',quality:40,count:1},{id:'Stale bread',count:5}],location:'Village',quest:'Lost memory'});
    assert.deepEqual(r.provenance,{worldId:'base.frontier',revision:1,seed:'parity',layers:[{axis:'entry',id:'vanilla',revision:1},{axis:'background',id:'empty',revision:1},{axis:'possessions',id:'empty',revision:1}]});
});
test('unknown resolves normally but stays in the hidden axis list',()=>{
    const r=resolveStart(world,{...choices,background:{mode:'unknown'}},'blind');
    assert.deepEqual(r.hidden,['background']);assert.equal(r.layers.length,3);
    assert.deepEqual(r.snapshot,resolveStart(world,choices,'blind').snapshot);
});
test('locks hold and excludes never coexist over 200 seeds',()=>{
    for(let i=0;i<200;i++) {
        const r=resolveStart(world,choices,String(i));assert.equal(r.provenance.layers[0].id,'vanilla');assert.equal(validateStart(r).valid,true);
        assert.ok(!(r.layers.some(l=>l.id==='runaway') && r.layers.some(l=>l.id==='family-keepsake')));
        assert.equal(resolveStart(world,{...choices,background:{mode:'lock',layerId:'scholars-child'}},String(i)).provenance.layers[1].id,'scholars-child');
    }
});
test('patch rules preserve order and merge by item quality',()=>{
    const layer=(id,patch)=>({id,revision:1,patch});
    const w={id:'test',revision:1,axes:['a','b'],layers:{a:[layer('a',{money:2,location:'first',quest:'first',items:[{id:'bread',count:2}],skills:{reading:2},knowledge:['one'],text:['one']})],
        b:[layer('b',{money:3,location:'last',quest:'last',items:[{id:'bread',count:3},{id:'bread',quality:40,count:1}],skills:{reading:3},knowledge:['two'],text:['two']})]}};
    const s=resolveStart(w,{},'merge').snapshot;
    assert.equal(s.money,5);assert.equal(s.location,'last');assert.equal(s.quest,'last');assert.deepEqual(s.skills,{reading:5});
    assert.deepEqual(s.items,[{id:'bread',count:5},{id:'bread',quality:40,count:1}]);assert.deepEqual(s.text,['one','two']);assert.deepEqual(s.knowledge,['one','two']);
});
test('dead-end guard rerolls the offending axis without changing unrelated rolls',()=>{
    const w=structuredClone(world);
    w.axes.push('door');w.layers.door=[{id:'dead',revision:1,weight:100,patch:{location:null}},{id:'safe',revision:1,weight:1,patch:{}}];
    for(let i=0;i<20;i++) {
        const r=resolveStart(w,choices,String(i)),base=resolveStart(world,choices,String(i));
        assert.deepEqual(r.provenance.layers.slice(0,3),base.provenance.layers);assert.equal(r.provenance.layers[3].id,'safe');
    }
    assert.throws(()=>resolveStart(w,{...choices,door:{mode:'lock',layerId:'dead'}},'blocked'),/missing location/);
    w.layers.door[0].patch={quest:null};
    const rerolled=resolveStart(w,choices,'lead-reroll');
    assert.deepEqual(rerolled.provenance.layers.slice(0,3),resolveStart(world,choices,'lead-reroll').provenance.layers);
    assert.equal(rerolled.provenance.layers[3].id,'safe');
    const r=resolveStart(world,vanilla,'lead');r.snapshot.quest=null;
    assert.equal(validateStart(r).valid,false);r.snapshot.lead='Talk to the elder';assert.equal(validateStart(r).valid,true);
});
test('later locked exclusions reroll an earlier roll while incompatible locks fail',()=>{
    const c={...choices,possessions:{mode:'lock',layerId:'family-keepsake'}};
    for(let i=0;i<30;i++)assert.notEqual(resolveStart(world,c,String(i)).provenance.layers[1].id,'runaway');
    assert.throws(()=>resolveStart(world,{...c,background:{mode:'lock',layerId:'runaway'}},'conflict'),/layer conflict/);
    assert.equal(validateStart(resolveStart(world,{...vanilla,entry:{mode:'lock',layerId:'empty'}},'empty')).valid,true);
    assert.throws(()=>resolveStart(world,{entry:{mode:'lock',layerId:'empty'},background:{mode:'lock',layerId:'farmhand'}},'needs'),/unmet need/);
});
