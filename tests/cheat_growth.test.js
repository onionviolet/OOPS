import test from 'node:test';
import assert from 'node:assert/strict';
import {applyStartGrants,defaultCheatState,seedBeginningCheats,awakenCheats,grantCheat,carryCheats,validateCheatState} from '../src/cheat_cards.js';
import {cheatKind,kindSkin,growthTrack,cheatVoice,ringSpiritCard,TIERS} from '../src/cheat_growth.js';
import {cheatProjection} from '../src/cheat_mechanisms.js';
const at={year:999,month:4,day:3,hour:8,minute:0,day_count:3};
const awake=()=>awakenCheats(seedBeginningCheats(defaultCheatState(),{choice:'system-quests',at}),{dayCount:3,at}).state;
test('kind comes from what the cheat is, not its world',()=>{
 const s=awake();assert.equal(cheatKind(s.held['quiet-faculty'].card),'mark');assert.equal(cheatKind(s.held['system-quests'].card),'hologram');
 assert.equal(cheatKind(ringSpiritCard()),'ring-spirit');assert.equal(kindSkin('nonsense').kind,'nonsense');assert.equal(kindSkin('nonsense').frame,'plain');
});
test('growth track names the next step, its cost and keeps future facets undiscovered',()=>{
 const facets=[{id:'a',name:'Alpha',family:'x',held:true},{id:'b',name:'Beta',family:'y',held:false},{id:'c',name:'Gamma',family:'z',held:false}];
 const g=growthTrack({earned:3,points:1,spent:2,facets,milestones:[{met:true,claimed:false}]});
 assert.equal(g.tier.name,'Steady');assert.equal(g.nextTier.remaining,2);assert.equal(g.next.cost,1);assert.equal(g.next.affordable,true);
 assert.deepEqual(g.facets.map(f=>f.state),['unlocked','next','undiscovered']);assert.ok(g.facets.slice(1).every(f=>f.name==='Undiscovered facet'));
 assert.equal(growthTrack({earned:99,facets}).nextTier,null);assert.equal(TIERS.length,5);
});
test('projection carries skin, track and a reliable system voice; faculty itself stays silent',()=>{
 const s={cheats:awake(),locations:{},levels:{person:{main_character:{skill_xp:{}}}}};const p=cheatProjection(s);
 assert.equal(p.skin.kind,'mark');assert.equal(p.growth.tier.name,'Faint');assert.equal(p.companions.length,1);
 assert.equal(p.companions[0].voice.reliable,true);assert.equal(p.companions[0].voice.truth,null);
 assert.deepEqual(cheatProjection(s).companions[0].voice,p.companions[0].voice,'same state, same line');
});
test('an unreliable voice overstates the tier but prints the truth beside it',()=>{
 const g=growthTrack({earned:0,facets:[{id:'a',name:'A',family:'x',held:false}],milestones:[]});
 const v=cheatVoice('ring-spirit',g,{unreliable:true,salt:1});
 assert.equal(v.reliable,false);assert.match(v.text,/steady already/);assert.equal(v.truth,'Actual tier: Faint');
 assert.equal(cheatVoice('mark',g),null);
 const moved=cheatVoice('ring-spirit',growthTrack({earned:4,points:2,facets:g.facets,milestones:[]}),{salt:1});assert.notEqual(moved.text,cheatVoice('ring-spirit',g,{salt:1}).text);
});
test('heir line: a ring spirit and a system return dormant with no points, ordinary cards stay',()=>{
 let c=awake();c=grantCheat(c,ringSpiritCard(),{route:'test',at});c.held['system-quests'].card.state.points=4;
 const next=carryCheats(c,defaultCheatState(),{heir:true});
 for(const id of ['system-quests','ring-spirit']){assert.equal(next.held[id].card.state.awakened,false);assert.equal(next.held[id].card.state.points,0);assert.equal(next.held[id].acquired.route,'heir-line');}
 assert.equal(next.held['ring-spirit'].card.state.unreliable,true);validateCheatState(next);
 const same=carryCheats(c,defaultCheatState());assert.equal(same.held['system-quests'],undefined,'temporal return keeps its snapshot rules');
 const woke=awakenCheats(next,{dayCount:3,at}).state;assert.equal(woke.held['ring-spirit'].messages.length,1);
});
test('seedBeginningCheats grants the ring elder as a start choice, dormant until it wakes',()=>{
 const c=seedBeginningCheats(defaultCheatState(),{choice:'ring-spirit',at});
 assert.equal(c.held['ring-spirit'].card.state.awakened,false);assert.equal(c.held['ring-spirit'].acquired.route,'optional-start');
 assert.equal(seedBeginningCheats(c,{choice:'ring-spirit',at}).held['ring-spirit'].messages.length,0);
 const woke=awakenCheats(c,{dayCount:3,at}).state,p=cheatProjection({cheats:woke,locations:{},levels:{person:{main_character:{skill_xp:{}}}}});
 assert.equal(p.companions[0].voice.reliable,false);
});
test('premise grants resolve to start cards; unknown cheats are reported',()=>{
 const r=applyStartGrants(defaultCheatState(),[{cheat:'ring-spirit',why:'w',cost:'c'},{cheat:'nope'}],{at});
 assert.ok(r.state.held['ring-spirit']);assert.deepEqual(r.unknown,['nope']);
});
