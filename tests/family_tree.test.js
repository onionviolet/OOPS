import test from 'node:test';
import assert from 'node:assert/strict';
import {createChronicle,advanceChronicle,validateChronicle,GAME_YEAR} from '../src/chronicle.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {deriveHeirLeftovers} from '../src/heir_inheritance.js';
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
