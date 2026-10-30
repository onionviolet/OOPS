import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
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
    const crosswalk=buildCrosswalk({registry,scenes,extras,['wor'+'ld']:'lotm',slice}).crosswalk;
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
    const metric=buildCrosswalk({...f,['wor'+'ld']:'lotm'}).report.sliceFitness.routines;
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
    assert.equal(buildCrosswalk({...f,['wor'+'ld']:'lotm'}).report.sliceFitness.routines.usable,0);
});

test('per-item locators retain early routines inside a later people record',()=>{
    const f=fixture();f.extras=[{extra:'people',id:f.registry[0].id,locator:'en b1 c3 p1',routine:[
        {place:f.registry[3].id,days:'morning',locator:loc},
        {place:f.registry[3].id,days:'evening',locator:'en b1 c3 p1'}]}];
    const {pack}=buildCastPack(f);assert.equal(pack.routines.length,1);assert.equal(pack.routines[0].locator,loc);
});

test('enterable rooms get walks and a desk corner attaches without a walk',()=>{
    const f=fixture(), parent='lotm.place.fixture-building', room='lotm.place.fixture-room', desk='lotm.place.fixture-desk-corner';
    f.registry.push({id:parent,kind:'place',label:'Fixture building',firstMention:loc},
        {id:room,kind:'place',label:'Fixture room',firstMention:loc},
        {id:desk,kind:'place',label:'Fixture desk corner',firstMention:loc});
    f.scenes[0].place=room;f.scenes[1].place=desk;
    f.extras.push({extra:'places',id:parent,within:'lotm.place.fixture-district',label:'S',locator:loc,routes:[]},
        {extra:'places',id:room,within:parent,label:'S',locator:loc,routes:[]},
        {extra:'places',id:desk,within:room,label:'S',locator:loc,routes:[]});
    const {pack}=buildCastPack(f),place=pack.places.find(p=>p.indexId===room),corner=pack.places.find(p=>p.indexId===desk);
    assert.equal(place.parent,parent);assert.equal(place.kind,'room');assert.equal(place.travel.district,'evernight');
    assert.equal(place.travel.provenance,'fill');assert.match(place.travel.basis,/unresolved/);
    assert.equal(corner.parent,place.id);assert.equal(corner.kind,'sub-place');assert.equal(corner.anchorOnly,true);assert.equal(corner.travel,undefined);
});

test('new street gets a district and an explicitly labelled fill travel default',()=>{
    const f=fixture(),street='lotm.place.fixture-street';
    f.registry.push({id:street,kind:'place',label:'Fixture street',firstMention:loc});
    f.scenes[0].place=street;
    f.extras.push({extra:'places',id:street,within:'lotm.place.evernight',label:'T',locator:loc,routes:[]});
    const {pack}=buildCastPack(f),place=pack.places.find(p=>p.indexId===street);
    assert.equal(place.district,'evernight');
    assert.equal(place.travel.district,'evernight');assert.equal(place.travel.minutes,2);
    assert.equal(place.travel.provenance,'fill');assert.equal(place.travel.minutesProvenance,'fill');
});

test('an authored base place wins over a generated conflict',()=>{
    const f=fixture(),id=f.registry[3].id;
    f.base.places=[{id:'authored-hall',indexId:id,name:'Authored hall',openingHours:[],travel:{district:'evernight'}}];
    const {pack}=buildCastPack(f);
    assert.equal(pack.places.filter(p=>p.indexId===id).length,1);
    assert.equal(pack.places.find(p=>p.id==='authored-hall').name,'Authored hall');
});

test('places-only regeneration retains the prior pack systems and adds only place rows',()=>{
    const f=fixture(),street='lotm.place.fixture-street';
    f.registry.push({id:street,kind:'place',label:'Fixture street',firstMention:loc});f.scenes[0].place=street;
    f.base.people=[{id:'kept-person',name:'Kept'}];f.base.routines=[{id:'kept-routine',actor:'kept-person'}];
    f.base.worldHours=[{id:'kept-hours'}];f.base.householdActs=[{id:'fixture-household-act',options:['keep']}];f.base.buildSourceIdentity={schema:'cast-pack-build/1'};
    const {pack,report}=buildCastPack({...f,placesOnly:true});
    assert.deepEqual(pack.people,f.base.people);assert.deepEqual(pack.routines,f.base.routines);assert.deepEqual(pack.worldHours,f.base.worldHours);assert.deepEqual(pack.householdActs,f.base.householdActs);
    assert.ok(pack.places.some(p=>p.indexId===street));assert.equal(report.people,1);assert.equal(report.routines.total,0);
    assert.match(pack.revision,/\.r2-places-/);
});

test('source route minutes keep their destination and locator',()=>{
    const f=fixture(),street='lotm.place.fixture-street';f.registry.push({id:street,kind:'place',label:'Fixture street',firstMention:loc});f.scenes[0].place=street;
    f.extras.push({extra:'places',id:street,within:'lotm.place.evernight',label:'S',locator:loc,routes:[{to:'lotm.place.fixture-hall',minutes:12}]});
    const place=buildCastPack(f).pack.places.find(p=>p.indexId===street);
    assert.equal(place.travel.minutes,12);assert.equal(place.travel.minutesProvenance,'canon');assert.equal(place.travel.routeTo,'lotm.place.fixture-hall');assert.equal(place.travel.routeLocator,loc);
});

test('place seed keeps prior generated addresses while live base wins and household acts stay intact',()=>{
    const f=fixture(),street='lotm.place.fixture-street';
    f.base.places=[{id:'authored-hall',indexId:f.registry[3].id,name:'Live hall',openingHours:[],label:'S',locator:loc}];
    f.base.householdActs=[{id:'live-act'}];
    const placeSeed={places:[{id:'seed-hall',indexId:f.registry[3].id,name:'Older hall',openingHours:[],label:'S',locator:loc},
        {id:'seed-street',indexId:street,name:'Fixture street',openingHours:[],label:'S',locator:loc}]};
    const {pack}=buildCastPack({...f,placeSeed,placesOnly:true});
    assert.deepEqual(pack.places.find(p=>p.id==='authored-hall'),f.base.places[0]);
    assert.equal(pack.places.find(p=>p.id==='seed-street').travel.provenance,'fill');
    assert.deepEqual(pack.householdActs,f.base.householdActs);
});

test('whole-book mode adds registry identities without rewriting base people or inventing unsupported walks',()=>{
    const f=fixture();f.registry[1].aliases=['Source alias'];
    f.base.people=[{id:'kept-person',indexId:f.registry[0].id,name:'Authored'}];
    const {pack}=buildCastPack({...f,wholeBook:true});
    assert.deepEqual(pack.people.find(p=>p.id==='kept-person'),f.base.people[0]);
    const added=pack.people.find(p=>p.indexId===f.registry[1].id);
    assert.deepEqual(added.aliases,['Source alias']);
    assert.equal(pack.places.find(p=>p.indexId===f.registry[3].id).travel,undefined);
    assert.ok(pack.lifePlaceHints.some(h=>h.actor==='kept-person'&&h.kind==='work'));
});

test('whole-book ID collision keeps the authored row and adds a distinct source identity',()=>{
    const f=fixture(),sourceId=f.registry[1].id;
    f.base.people=[{id:sourceId,name:'Authored identity'}];
    const {pack}=buildCastPack({...f,wholeBook:true});
    assert.equal(pack.people.find(p=>p.id===sourceId).name,'Authored identity');
    const source=pack.people.find(p=>p.indexId===sourceId);
    assert.ok(source);assert.notEqual(source.id,sourceId);assert.equal(source.name,'Fixture B');
});

test('whole-book chapter band reuses slice routine ids, timing, hours and usability',()=>{
    const f=fixture(),start='en b1 c31 p1',end='en b1 c60 p999';
    f.slice={from:start,to:end};
    f.extras[0].locator='en b1 c90 p1';
    for(const slot of f.extras[0].routine) slot.locator=start;
    f.extras[0].routine.push({place:f.registry[3].id,days:'evening',locator:'en b1 c61 p1'});
    f.extras[0].routine.push({place:f.registry[3].id,days:'weekdays',locator:end});
    f.extras[1].locator=start;
    f.extras.push({...f.extras[1],hours:'evening',locator:'en b1 c61 p1'},
        {...f.extras[1],extra:'rules',place:'lotm.place.other',role:'other-role',hours:'night',locator:start});
    f.crosswalk=buildCrosswalk({...f,world:f.book}).crosswalk;
    const expected=buildCastPack(f),actual=buildCastPack({...f,wholeBook:true});
    for(const section of ['routines','orderEdges','worldHours'])
        assert.equal(JSON.stringify(actual.pack[section]),JSON.stringify(expected.pack[section]));
    assert.equal(actual.report.routines.total,4);
    assert.equal(actual.report.routines.newUsable,4);
    assert.equal(actual.report.routines.unresolvedPlace,0);
    assert.equal(actual.pack.worldHours.length,2);
    assert.ok(actual.pack.routines.every(r=>r.roleHours.length===1));
    assert.ok(actual.pack.routines.some(r=>r.band));
    assert.ok(actual.pack.orderEdges.some(e=>e.offsetDays===1));
    assert.ok(actual.pack.routines.every(r=>[start,end].includes(r.locator)));
    assert.ok(actual.pack.people.some(p=>p.indexId===f.registry[1].id));
});

test('whole-book band reports unknown places as gaps without dangling routines or edges',()=>{
    const f=fixture();f.slice={from:'en b1 c31 p1',to:'en b1 c60 p999'};
    f.extras=[{extra:'people',id:f.registry[0].id,locator:loc,routine:[
        {place:'lotm.place.unknown',days:'after lunch',locator:f.slice.from},
        {place:f.registry[3].id,days:'morning',locator:f.slice.from},
    ]}];
    f.crosswalk=buildCrosswalk({...f,world:f.book}).crosswalk;
    const {pack,report}=buildCastPack({...f,wholeBook:true});
    assert.equal(pack.routines.length,1);assert.equal(pack.orderEdges.length,0);
    assert.equal(report.routines.total,1);assert.equal(report.routines.newUsable,1);
    assert.equal(report.routines.unresolvedPlace,1);
    assert.equal(pack.revisionNote.gaps.length,1);
    assert.equal(pack.revisionNote.gaps[0].reason,'unresolved-place');
    assert.equal(pack.revisionNote.gaps[0].locator,f.slice.from);
});

test('chapter 1-24 default output stays byte-identical to the pre-band compiler',()=>{
    const f=fixture();f.slice={from:loc,to:'en b1 c24 p999'};
    f.crosswalk=buildCrosswalk({...f,world:f.book}).crosswalk;
    assert.equal(createHash('sha256').update(JSON.stringify(buildCastPack(f))).digest('hex'),
        'ced0928e384c5a210d00e5b78a15d194ecde1a8bc87644188a6e292061cb927b');
    f.extras.push({extra:'people',id:f.registry[0].id,locator:'en b1 c25 p1',routine:[]});
    f.crosswalk=buildCrosswalk({...f,world:f.book}).crosswalk;
    const ordinary=buildCastPack(f).pack,whole=buildCastPack({...f,wholeBook:true}).pack;
    for(const section of ['routines','orderEdges','worldHours'])
        assert.equal(JSON.stringify(whole[section]),JSON.stringify(ordinary[section]));
});

test('whole-book range covering every source locator keeps base routines and hours unchanged',()=>{
    const f=fixture();f.base.routines=[{id:'kept-routine'}];f.base.orderEdges=[{id:'kept-edge'}];f.base.worldHours=[{id:'kept-hours'}];
    const {pack,report}=buildCastPack({...f,wholeBook:true});
    for(const section of ['routines','orderEdges','worldHours']) assert.deepEqual(pack[section],f.base[section]);
    assert.equal(report.routines.total,0);assert.equal(report.routines.unresolvedPlace,undefined);
});
