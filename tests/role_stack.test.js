import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createPosition} from '../src/progression_path.js';
import {advanceRoles,readRoleStack,quoteRoleChange,settleRoleChange} from '../src/role_stack.js';
import {roleCases} from '../src/data/role_cases.js';
import {roleLadder,villageRoles} from '../src/data/role_stacks.js';
import {enrollWatchcraft,villageRoleView} from '../src/village_roles.js';
import {migrateVillageCareer,practiceWatchcraft,beginVillageShift,villageShiftBonus} from '../src/village_career.js';

const legacy=JSON.parse(readFileSync(new URL('./fixtures/role_stack/legacy-career.json',import.meta.url)));
function change(policy,stack,id,facts={}) {
    return settleRoleChange(policy,stack,id,facts,quoteRoleChange(policy,stack,id,facts).fingerprint);
}
// The test host provides measured level positions. The cited edge determines
// admission and replacement; these unit-sized test gains are not book XP costs.
function bind(book,ids) {
    const levels=Array.from({length:12},(_,i)=>'Level '+(i+1));
    return {...book,roles:Object.fromEntries(ids.map(id=>[id,{activity:id,track:'practice',
        row:roleLadder(id,book.id,id,levels,levels.slice(1).map((_,i)=>i+1))}]))};
}
const start=(policy,id)=>readRoleStack(policy,createPosition(policy.roles[id].row));

test('qualified second slot, independent activity gains, stale terms and lineage evolution',()=>{
    const policy=bind(roleCases[0],['first','second','evolved']);
    policy.changes={...policy.changes,evolve:{from:['first'],to:'evolved',carry:'first'}};
    const one=start(policy,'first'),facts={qualifies:true};
    assert.throws(()=>quoteRoleChange(policy,one,'take-second'));
    const old=quoteRoleChange(policy,one,'take-second',facts);
    const trained=advanceRoles(policy,one,'first',2);
    assert.throws(()=>settleRoleChange(policy,trained,'take-second',facts,old.fingerprint),/Review/);
    const both=change(policy,trained,'take-second',facts);
    const practiced=advanceRoles(policy,both,'second',3);
    assert.deepEqual(practiced.positions.map(p=>p.position),[2,3]);
    const evolved=change(policy,practiced,'evolve',facts);
    assert.deepEqual(evolved.positions.map(p=>[p.path,p.tracks.practice]),[['evolved',2],['second',3]]);
    assert.throws(()=>change(policy,evolved,'take-second',facts));
});
test('Dragoneye replacement enters Firebug at level eight; other class retains its position',()=>{
    const p=bind(roleCases[1],['other','second-class','firebug']);
    const stack=start(p,'other');
    stack.positions.push(createPosition(p.roles['second-class'].row,{position:10,tracks:{practice:10}}));
    const next=change(p,stack,'change-class');
    assert.deepEqual(next.positions.map(r=>[r.path,r.position+1]),[['other',1],['firebug',8]]);
    assert.equal(advanceRoles(p,next,'firebug',1).positions[1].position+1,9);
});
test('Wandering Inn permits merging Warrior and Strategist only with the needed levels',()=>{
    const p=bind(roleCases[2],['warrior','strategist','commander']);
    const stack=start(p,'warrior');
    stack.positions.push(createPosition(p.roles.strategist.row));
    assert.throws(()=>change(p,stack,'merge-commander'));
    assert.throws(()=>change(p,stack,'merge-commander',{sufficientLevels:true}));
    const next=change(p,stack,'merge-commander',{sufficientLevels:true,entry:{position:3}});
    assert.deepEqual(next.positions.map(r=>r.path),['commander']);
    assert.deepEqual(stack.positions.map(r=>r.path),['warrior','strategist']);
});
test('old career and PRG1 position load once, existing practice counts and two-role saves round-trip',()=>{
    const migrated=migrateVillageCareer({village_career:legacy});
    assert.equal(migrated.roles.positions.length,1);
    assert.deepEqual(readRoleStack(villageRoles,migrated.roles.positions[0]),migrated.roles);
    assert.equal(villageRoleView(migrated).waiting,true);
    assert.equal(villageRoleView(migrated).tracks[0].level,2);
    migrated.watchcraft.issued=true;
    migrated.watchcraft.practiceMinutes=4;
    const joined=enrollWatchcraft(migrated,villageRoleView(migrated).fingerprint);
    const current=practiceWatchcraft(joined,{known:true,location:'Village',activity:'meditating',worldId:'base.frontier'});
    assert.deepEqual(villageRoleView(current).tracks.map(t=>t.level),[2,3]);
    assert.equal(villageRoleView(current).waiting,false);
    assert.deepEqual(migrateVillageCareer(JSON.parse(JSON.stringify({village_career:current}))),current);
    assert.equal(villageShiftBonus(beginVillageShift(current,true),true),15);
    assert.equal(villageShiftBonus(beginVillageShift(migrated,true),true),0);
    const invalid=structuredClone(current);invalid.roles.positions[1].position=0;
    assert.throws(()=>migrateVillageCareer({village_career:invalid}));
    assert.throws(()=>readRoleStack(villageRoles,{...migrated.roles,positions:[...migrated.roles.positions,...migrated.roles.positions]}));
});
