import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildCastPack,run} from '../scripts/lead_run/build_cast_pack.mjs';
import {buildCrosswalk} from '../scripts/lead_run/build_crosswalk.mjs';
const loc='en b1 c1 p1', slice={from:loc,to:'en b1 c2 p999'};
function fixture() {
    const registry=[
        {id:'lotm.person.fixture-a',kind:'person',label:'Fixture A',firstMention:loc},
        {id:'lotm.person.fixture-b',kind:'person',label:'Fixture B',firstMention:loc},
        {id:'lotm.person.fixture-c',kind:'person',label:'Fixture C',firstMention:loc},
        {id:'lotm.place.fixture-hall',kind:'place',label:'Fixture hall',firstMention:loc},
        {id:'lotm.person.fixture-crowd',kind:'person',label:'Fixture crowd',collective:true,firstMention:loc},
    ];
    const scenes=Array.from({length:12},(_,i)=>({beat:`fixture.${i}`,pov:'lead',locator:loc,place:registry[3].id,
        present:[registry[0].id,...(i<3?[registry[1].id]:[])]}));
    const extras=[{extra:'people',id:registry[0].id,locator:loc,routine:[
        {what:'lunch',place:registry[3].id,days:'every day',locator:loc},
        {what:'work',place:registry[3].id,days:'after lunch',locator:loc},
        {place:registry[3].id,days:'next morning',locator:loc},
    ]},{extra:'services',place:registry[3].id,hours:'weekday daytime',locator:loc,label:'S'}];
    const crosswalk=buildCrosswalk({registry,scenes,extras,world:'lotm',slice}).crosswalk;
    const base={schema:'lotm-cast/1',revision:'fixture.1',people:[],references:[],places:[],schedule:[{id:'authored-slot',place:'authored-place'}],beats:[],anchors:[],
        host:{profile:{blurb:'Authored profile.'}},leadLife:{actorId:'authored'},bindings:{days:[{scene:'fixture'}]},reports:{fixture:{text:'Authored report.'}},
        custom:{nested:['retain this']}};
    return {book:'lotm',slice,registry,scenes,extras,crosswalk,base};
}
test('preserves hand-authored sections, assigns tiers, and emits stable revision diff',()=>{
    const f=fixture(),a=buildCastPack(f),b=buildCastPack(f);
    assert.deepEqual(a,b);
    for(const k of ['schedule','beats','anchors','host','leadLife','bindings','reports','custom']) assert.deepEqual(a.pack[k],f.base[k]);
    assert.deepEqual(a.pack.people.map(p=>p.tier).sort(),['crowd','principal','recurring','role']);
    assert.equal(a.pack.revisionNote.from,'fixture.1');assert.ok(a.pack.revisionNote.added.length);assert.deepEqual(a.pack.revisionNote.removed,[]);
    assert.notEqual(a.pack.revision,f.base.revision);
    const c=buildCastPack({...f,registry:[...f.registry].reverse(),scenes:[...f.scenes].reverse(),extras:[...f.extras].reverse()});
    assert.deepEqual(a,c);
});
test('relative phrases create ordered row edges, hours retain locators, fitness reports old and new',()=>{
    const f=fixture(),{pack,report}=buildCastPack(f);
    const lunch=pack.routines.find(r=>r.what==='lunch'),work=pack.routines.find(r=>r.what==='work');
    assert.ok(pack.orderEdges.some(e=>e.before===lunch.id && e.after===work.id));
    assert.ok(pack.orderEdges.some(e=>e.offsetDays===1));
    assert.equal(pack.worldHours[0].locator,loc);
    assert.ok(report.routines.newUsable>report.routines.oldUsable);
    const metric=buildCrosswalk({...f,world:'lotm'}).report.sliceFitness.routines;
    assert.equal(metric.oldPlaceAndTime.usable,1);assert.equal(metric.usable,3);
});
test('base wins conflicts, id redirects preserve identities, unknown times stay unusable',()=>{
    const f=fixture(),oldTarget=f.crosswalk.mapping[f.registry[0].id].slice(4);
    f.base.people=[{id:'authored-person',indexId:f.registry[0].id,name:'Authored name',tier:'role'}];
    f.extras=[{extra:'people',id:f.registry[0].id,locator:loc,routine:[{place:f.registry[3].id,days:'weekdays',locator:loc}]}];
    const {pack,report}=buildCastPack(f),p=pack.people.find(p=>p.id==='authored-person');
    assert.equal(p.name,'Authored name');assert.equal(p.tier,'role');assert.equal(pack.idMap[oldTarget],p.id);
    assert.ok(pack.revisionNote.changed.includes(p.id));assert.ok(pack.revisionNote.conflicts.some(r=>r.field==='name'));
    assert.equal(report.routines.newUsable,0);
    assert.equal(pack.routines[0].actor,p.id);
    assert.throws(()=>buildCastPack({...f,crosswalk:{...f.crosswalk,slice:{from:loc,to:loc}}}),/mismatch/);
});
test('CLI writes byte-identical private builds and refuses overwriting its base',()=>{
    const dir=mkdtempSync(join(tmpdir(),'r1-fixture-'));
    try {
        const f=fixture();for(const k of ['registry','scenes','extras'])writeFileSync(join(dir,`${k}.jsonl`),f[k].map(JSON.stringify).join('\n')+'\n');
        writeFileSync(join(dir,'crosswalk.json'),JSON.stringify(f.crosswalk));const base=join(dir,'base.json');writeFileSync(base,JSON.stringify(f.base));
        const args=['lotm','--from',slice.from,'--to',slice.to,'--merged',dir,'--base',base,'--out',join(dir,'one.json')];
        run(args);const first=readFileSync(join(dir,'one.json'),'utf8');run(args);assert.equal(first,readFileSync(join(dir,'one.json'),'utf8'));
        assert.throws(()=>run([...args.slice(0,-1),base]),/overwrite/);
    } finally {rmSync(dir,{recursive:true,force:true});}
});

test('relative order cannot borrow hours from a different role/place or from outside the slice',()=>{
    const f=fixture();
    f.extras=[{extra:'people',id:f.registry[0].id,locator:loc,routine:[{place:f.registry[3].id,days:'weekdays',locator:loc}]},
        {extra:'services',place:'lotm.place.other',hours:'morning',locator:loc},
        {extra:'services',place:f.registry[3].id,hours:'morning',locator:'en b1 c3 p1'}];
    assert.equal(buildCastPack(f).report.routines.newUsable,0);
    assert.equal(buildCrosswalk({...f,world:'lotm'}).report.sliceFitness.routines.usable,0);
});

test('per-item locators retain early routines inside a later people record',()=>{
    const f=fixture();f.extras=[{extra:'people',id:f.registry[0].id,locator:'en b1 c3 p1',routine:[
        {place:f.registry[3].id,days:'morning',locator:loc},
        {place:f.registry[3].id,days:'evening',locator:'en b1 c3 p1'}]}];
    const {pack}=buildCastPack(f);assert.equal(pack.routines.length,1);assert.equal(pack.routines[0].locator,loc);
});
