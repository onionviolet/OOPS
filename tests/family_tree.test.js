import test from 'node:test';
import assert from 'node:assert/strict';
import {commandChronicle,recordArchiveDuty,relationshipChange,createChronicle,advanceChronicle,validateChronicle,GAME_YEAR} from '../src/chronicle.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {deriveHeirLeftovers,heirLeftoverLines} from '../src/heir_inheritance.js';
import {projectFamilyTree,familyTreeRows} from '../src/family_tree.js';

const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
const endedLife=(name,chronicle,kin)=>{
    const end=62*GAME_YEAR;chronicle=advanceChronicle(chronicle,end);
    return {name,character:{name,money:10,reputation:{Village:0}},levels:{person:{main_character:{total_xp:0}}},'current time':calendar,
        expansion:{sequence:0,clock:end,chronicle,rng:7},inventories:{person:{main_character:{}},storage:{player:{}}},availabilities:{location:{}},...(kin?{kin}:{})};
};
const fresh=()=>({character:{name:'You',money:0,reputation:{Village:0}},levels:{person:{main_character:{total_xp:0}}},'current time':calendar,expansion:{chronicle:null},
    inventories:{person:{main_character:{}},storage:{player:{}}},availabilities:{location:{Village:1}}});

test('an heir and a relative appear on one tree, and the tree survives a save round trip',()=>{
    const prev=endedLife('Ada',createChronicle(0,calendar,true),[{name:'Bram',relation:'spouse',age:60},{name:'Cy',relation:'bogus'}]);
    const next=buildLifeHeirSave(prev,fresh());
    const c=next.expansion.chronicle;validateChronicle(c,0);
    const tree=projectFamilyTree(JSON.parse(JSON.stringify(c)),'You');
    const rows=familyTreeRows(tree);
    assert.deepEqual(rows.map(r=>r.name),['Ada','Bram','You (this life)']);
    assert.match(rows[2].detail,/took the estate as next of kin/);
    assert.equal(rows[2].depth,1);
});

test('lineage is frozen and grows one generation per heir; apprentice lines are labelled',()=>{
    const first=buildLifeHeirSave(endedLife('Ada',createChronicle(0,calendar,true)),fresh()).expansion.chronicle;
    const frozen=JSON.stringify(first.life.experience.lineage);
    const second=buildLifeHeirSave(endedLife('Bea',first),fresh()).expansion.chronicle;
    assert.equal(JSON.stringify(first.life.experience.lineage),frozen);
    assert.deepEqual(second.life.experience.lineage.ancestors.map(a=>[a.name,a.generation]),[['Bea',2],['Ada',1]]);
    assert.equal(familyTreeRows(projectFamilyTree(second)).length,3);
    const withKin=buildLifeHeirSave(endedLife('Cal',second,[{name:'Dee',relation:'child',age:30}]),fresh()).expansion.chronicle;
    const third=buildLifeHeirSave(endedLife('Eve',withKin),fresh()).expansion.chronicle;
    assert.deepEqual(familyTreeRows(projectFamilyTree(third)).map(r=>r.name),['Ada','Bea','Cal','Dee','Eve','You (this life)']);
});

test('a first life has no tree; a tampered lineage is rejected',()=>{
    assert.equal(projectFamilyTree(createChronicle(0,calendar,true)).hasFamily,false);
    const c=buildLifeHeirSave(endedLife('Ada',createChronicle(0,calendar,true)),fresh()).expansion.chronicle;
    c.life.experience.lineage.ancestors[0].via='bogus';
    assert.throws(()=>validateChronicle(c,0));
});

test('a relative recorded in the chronicle relationships survives a JSON round trip into the heir tree',()=>{
    let c=createChronicle(0,calendar,true);
    c=relationshipChange(c,'bram',{id:'wed',ties:{kinRelation:'spouse',kinName:'Bram',kinAge:60},text:'Wed.'},0)??c;
    const prev=JSON.parse(JSON.stringify(endedLife('Ada',c)));
    const heir=buildLifeHeirSave(prev,fresh()).expansion.chronicle;
    assert.deepEqual(familyTreeRows(projectFamilyTree(heir)).map(r=>r.name),['Ada','Bram','You (this life)']);
});

test('taking in a ward is story-gated, costs five coins, shows on the living tree and carries to the heir and its preview',()=>{
    let s={sequence:0,clock:10,chronicle:advanceChronicle(createChronicle(0,calendar,true),10),rng:7};
    const ctx={location:'Village',calendar,money:20};
    assert.throws(()=>commandChronicle(s,{type:'take_in'},ctx),/only after you keep/);
    s=commandChronicle(s,{type:'pledge'},ctx).state;
    recordArchiveDuty(s.chronicle,10,'r1');
    assert.throws(()=>commandChronicle(s,{type:'take_in'},{...ctx,money:4}),/five coins/);
    const r=commandChronicle(s,{type:'take_in'},ctx);
    assert.equal(r.moneyDelta,-5);s=r.state;validateChronicle(s.chronicle,s.clock);
    assert.throws(()=>commandChronicle(s,{type:'take_in'},ctx),/already shares/);
    assert.deepEqual(familyTreeRows(projectFamilyTree(JSON.parse(JSON.stringify(s.chronicle)))).map(x=>x.name),['You (this life)','Wren']);
    const prev=endedLife('Ada',s.chronicle);
    const l=deriveHeirLeftovers(JSON.parse(JSON.stringify(prev)));
    assert.deepEqual(l.kin.map(k=>k.name),['Wren']);
    assert.ok(heirLeftoverLines(l).some(x=>/Kin left behind: Wren \(child\)/.test(x)));
    const heir=buildLifeHeirSave(prev,fresh(),l).expansion.chronicle;
    assert.deepEqual(familyTreeRows(projectFamilyTree(heir)).map(x=>x.name),['Ada','Wren','You (this life)']);
});

test('the estate preview names kin and caps the list like goods',()=>{
    const kin=Array.from({length:8},(_,i)=>({name:'K'+i,relation:'child',age:5}));
    const base={schema:1,recipient:'kin',money:0,belongings:[],chest:[],home:false,reputation:{},papers:[],apprentice:[],obligations:[],debts:[],archiveLine:false,empty:true};
    const line=heirLeftoverLines({...base,kin}).find(x=>/^Kin left behind/.test(x));
    assert.match(line,/K0 \(child\).*K5 \(child\), and 2 more\./);assert.doesNotMatch(line,/K6/);
    assert.equal(heirLeftoverLines(base).some(x=>/Kin left/.test(x)),false);
});
