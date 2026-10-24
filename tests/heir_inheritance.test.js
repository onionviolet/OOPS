import test from 'node:test';
import assert from 'node:assert/strict';
import {createChronicle,commandChronicle,advanceChronicle,validateChronicle,GAME_YEAR} from '../src/chronicle.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {deriveHeirLeftovers,validateHeirLeftovers,heirLeftoverLines,applyHeirLeftovers} from '../src/heir_inheritance.js';
import {LIFE_LESSONS} from '../src/life_experience.js';

const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
const ctx={location:'Village',calendar};
const fresh=()=>({character:{name:'You',money:102,reputation:{Village:0,Slums:0,Town:0}},levels:{person:{main_character:{total_xp:0}}},'current time':calendar,expansion:{chronicle:null},
    inventories:{person:{main_character:{'{"id":"Stale bread"}':{count:5}}},storage:{player:{}}},availabilities:{location:{Shack:0,Village:1}}});
const labels=Object.fromEntries(LIFE_LESSONS.map(l=>[l.id,l.label]));

// A life that wrote, taught, built and left business open, via real chronicle commands.
function richLife() {
    let s={sequence:0,clock:0,chronicle:createChronicle(0,calendar,true),rng:7};
    s.chronicle=advanceChronicle(s.chronicle,10);s.clock=10;
    s=commandChronicle(s,{type:'attend'},ctx).state;
    s=commandChronicle(s,{type:'reflect',lesson:'routeSignals'},ctx).state;
    s=commandChronicle(s,{type:'pledge'},ctx).state;
    const at=50*GAME_YEAR;s.chronicle=advanceChronicle(s.chronicle,at);s.clock=at;
    s=commandChronicle(s,{type:'teach',lesson:'routeSignals'},ctx).state;
    const end=62*GAME_YEAR;s.chronicle=advanceChronicle(s.chronicle,end);s.clock=end;
    return {name:'Ada',character:{name:'Ada',money:340,reputation:{Village:7,Slums:-3,Town:1}},levels:{person:{main_character:{total_xp:9000}}},'current time':calendar,expansion:s,
        inventories:{person:{main_character:{'{"id":"Stale bread"}':{count:2},'{"id":"Old combat manual"}':{count:1}}},storage:{player:{'{"id":"Iron ore"}':{count:12}}}},
        availabilities:{location:{Shack:1}}};
}

test('a life that wrote, taught and built leaves money, goods, chest, home, papers, apprentice and its open promise',()=>{
    const prev=richLife();
    const l=deriveHeirLeftovers(prev,{equippedKeys:['{"id":"Cheap iron sword","quality":80}']});
    validateHeirLeftovers(l);
    assert.equal(l.recipient,'apprentice');assert.equal(l.money,340);assert.equal(l.home,true);
    assert.deepEqual(l.papers,['routeSignals']);assert.deepEqual(l.apprentice,['routeSignals']);
    assert.deepEqual(l.obligations,['archiveDuty']);assert.deepEqual(l.reputation,{Village:3,Slums:-1});
    assert.ok(l.belongings.some(([k,n])=>k.includes('Cheap iron sword')&&n===1));
    assert.deepEqual(l.chest,[['{"id":"Iron ore"}',12]]);assert.equal(l.empty,false);
    const next=buildLifeHeirSave(prev,fresh(),l);
    assert.equal(next.character.money,442);assert.equal(next.inventories.person.main_character['{"id":"Stale bread"}'].count,7);
    assert.equal(next.inventories.person.main_character['{"id":"Old combat manual"}'].count,1);
    assert.equal(next.inventories.storage.player['{"id":"Iron ore"}'].count,12);
    assert.equal(next.availabilities.location.Shack&1,1);assert.deepEqual(next.character.reputation,{Village:3,Slums:-1,Town:0});
    assert.equal(next.levels.person.main_character.total_xp,0);
    const c=next.expansion.chronicle;validateChronicle(c,0);
    assert.deepEqual(c.knowledge,{routeSignals:true},'the apprentice heir already holds what was taught');
    assert.equal(c.relationships.villageElder.ties.archiveDuty,true);assert.equal(c.relationships.villageElder.ties.rememberedPredecessor,'Ada');
    assert.equal(c.relationships.villageElder.ties.dutyKept,undefined);
    assert.ok(heirLeftoverLines(l,labels).some(t=>t.includes('apprentice you taught')));
});

test('an unsettled grievance follows the heir and the existing settlement closes it; the archive line stays claimed',()=>{
    const prev=richLife();const r=prev.expansion.chronicle.relationships.villageElder;r.ties.grievance=true;r.ties.dutyKept=true;r.ties.successor=true;
    prev.expansion.chronicle.events.inheritance.status='resolved';
    const l=deriveHeirLeftovers(prev);assert.deepEqual(l.obligations,['grievance']);assert.equal(l.archiveLine,true);
    const next=buildLifeHeirSave(prev,fresh(),l),c=next.expansion.chronicle;
    assert.equal(c.relationships.villageElder.ties.grievance,true);assert.equal(c.events.inheritance.status,'resolved');
    const s={sequence:0,clock:0,chronicle:c,rng:7};
    assert.throws(()=>commandChronicle(s,{type:'pledge'},ctx),/assault/);
    const settled=commandChronicle(s,{type:'settle'},{...ctx,money:3});assert.equal(settled.moneyDelta,-3);
    assert.equal(settled.state.chronicle.relationships.villageElder.ties.grievance,false);
});

test('a recorded kit debt is paid from the estate before money passes; a shortfall is written off',()=>{
    const prev=richLife();prev.village_career={schema:4,rank:0,shifts:1,completed:1,returned:0,loan:{status:'debt',completed:true},debt:50,lastShift:null,watchcraft:{},recruit:null};
    let l=deriveHeirLeftovers(prev);assert.equal(l.money,290);assert.deepEqual(l.debts,[{id:'kitDebt',owed:50,paid:50,shortfall:0}]);
    const next=buildLifeHeirSave(prev,fresh(),l);assert.equal(next.character.money,392);assert.equal(next.expansion.chronicle.life.experience.inheritance.debtsPaid,50);
    prev.character.money=20;l=deriveHeirLeftovers(prev);assert.equal(l.money,0);assert.deepEqual(l.debts[0],{id:'kitDebt',owed:50,paid:20,shortfall:30});
    assert.ok(heirLeftoverLines(l).some(t=>t.includes('remaining 30 was written off')));
});

test('a life that kept everything in its head leaves a near-empty heir',()=>{
    const s={sequence:0,clock:0,chronicle:advanceChronicle(createChronicle(0,calendar,true),62*GAME_YEAR),rng:7};s.clock=62*GAME_YEAR;
    const prev={character:{name:'Bo',money:0,reputation:{Village:1,Slums:0,Town:0}},'current time':calendar,expansion:s,levels:{},inventories:{person:{main_character:{}},storage:{player:{}}},availabilities:{location:{Shack:0}}};
    const l=deriveHeirLeftovers(prev);
    assert.equal(l.empty,true);assert.equal(l.recipient,'kin');assert.deepEqual(l.reputation,{});assert.deepEqual(l.obligations,[]);
    const f=fresh(),next=buildLifeHeirSave(prev,f,l);
    assert.equal(next.character.money,102);assert.deepEqual(next.inventories,f.inventories);assert.equal(next.availabilities.location.Shack,0);
    assert.deepEqual(next.expansion.chronicle.knowledge,{});
    assert.ok(heirLeftoverLines(l).some(t=>t.includes('almost nothing')));
});

test('an heir saved under the old one-lesson rule stays valid unchanged; invalid inheritance records are rejected',()=>{
    const c=createChronicle(0,calendar,true);c.knowledge={guardLesson:true};
    c.life.experience={reflected:[],taught:[],bequest:null,generation:2,inheritedFrom:{name:'Old',age:80,epitaph:'Here rests a traveler.',lesson:'guardLesson'}};
    const before=structuredClone(c);validateChronicle(c,0);assert.deepEqual(c,before);
    const bad=structuredClone(c);bad.life.experience.inheritance={recipient:'stranger',papers:[],apprentice:[],money:0,belongings:0,chest:0,home:false,obligations:[],archiveLine:false};
    assert.throws(()=>validateChronicle(bad,0),/inheritance record/);
    assert.throws(()=>validateHeirLeftovers({schema:1,recipient:'kin',money:-1}),/Invalid/);
    assert.throws(()=>applyHeirLeftovers(fresh(),{schema:1,recipient:'kin',money:1,belongings:[['x',0]],chest:[],home:false,archiveLine:false,empty:false,papers:[],apprentice:[],obligations:[],reputation:{}}),/goods/);
});

test('inheritance law is a world dial: one saved household yields different heirs under two laws, default unchanged (IM8)',()=>{
    const prev=richLife();
    prev.kin=[{id:'k1',name:'Wren',relation:'child',sex:'f',age:20},{id:'k2',name:'Tam',relation:'child',sex:'m',age:30},{id:'k3',name:'Bo',relation:'child',sex:'m',age:18},{id:'k4',name:'Ivy',relation:'spouse',age:55},{id:'k5',name:'Kit',relation:'child',sex:'m',age:9}];
    const base=deriveHeirLeftovers(prev);
    assert.equal(base.heir,undefined);assert.equal(base.law,undefined);assert.equal(base.recipient,'apprentice');assert.equal(base.home,true);
    const ridge=deriveHeirLeftovers(prev,{law:'ultimogeniture'}),town=deriveHeirLeftovers(prev,{law:'primogeniture'});
    validateHeirLeftovers(ridge);validateHeirLeftovers(town);
    assert.equal(ridge.heir.name,'Bo','youngest adult son; the 9-year-old is not a claimant');
    assert.equal(town.heir.name,'Tam','eldest adult child');
    assert.equal(ridge.recipient,'kin');assert.equal(town.recipient,'apprentice','primogeniture keeps the taught apprentice');
    assert.equal(ridge.lifeEstate.holder,'k4');assert.equal(ridge.home,false,'the widow holds the house for life');assert.equal(ridge.lifeEstate.home,true);
    assert.equal(town.lifeEstate,undefined);assert.equal(town.home,true);
    assert.ok(heirLeftoverLines(ridge,labels).some(t=>t.includes('Life estate')));
    assert.throws(()=>deriveHeirLeftovers(prev,{law:'nope'}),/Unknown inheritance law/);
    const next=buildLifeHeirSave(prev,fresh(),ridge);assert.equal(next.availabilities.location.Shack&1,0);
    const sole=deriveHeirLeftovers({...prev,kin:[{id:'s',name:'Ivy',relation:'spouse',age:50}]},{law:'ultimogeniture'});
    assert.equal(sole.heir.relation,'spouse');assert.equal(sole.lifeEstate,undefined);
});
