import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceHomeCondition,newHomeCondition} from '../src/home_building_model.js';
import {nativeRainAtClock,isRainingAtMinute} from '../src/weather_calendar.js';
import {HOME_WORLD} from '../src/home_content.js';
const calendar=minute=>({day_count:Math.floor(minute/1440),hour:Math.floor(minute%1440/60),minute:minute%60});
const simulate=(home,start,duration,parts,legacy=false)=>{
 const h=structuredClone(home),weatherAt=legacy?at=>({raining:isRainingAtMinute(start+at)}):at=>nativeRainAtClock(calendar(start),0,at);
 let clock=0,i=0;
 while(clock<duration){clock=Math.min(duration,clock+parts[i++%parts.length]);advanceHomeCondition(h,{clock,world:HOME_WORLD,weatherAt});}
 return h.condition;
};
test('native rain uses calendar-coordinate boundaries, source identity and pure absent-calendar fallback',()=>{
 const t=calendar(4*1440-30),before=structuredClone(t);
 assert.deepEqual(nativeRainAtClock(t,100,100),{raining:false,source:'native-rain-calendar',until:130});
 assert.deepEqual(nativeRainAtClock(t,100,130),{raining:true,source:'native-rain-calendar',until:1570});
 assert.deepEqual(nativeRainAtClock(null,0,5),{raining:false,source:'unavailable',until:Infinity});
 assert.deepEqual(t,before);
});
test('F2 rain start/end offsets preserve condition across long, minute and uneven partitions',()=>{
 for(const edge of [4,8])for(const offset of [0,1,30,59])for(const weatherproof of [false,true])for(const id of ['shelter','tent','nest','burrow','cottage']){
  const h={id,weatherproof,condition:{...newHomeCondition(0),integrity:id==='cottage'?79:41,wetness:995,rainMinutes:119}};
  const start=edge*1440-offset,duration=3*1440+91,label=JSON.stringify({edge,offset,weatherproof,id});
  const minute=simulate(h,start,duration,[1]);
  assert.deepEqual(simulate(h,start,duration,[duration]),minute,label+' long');
  assert.deepEqual(simulate(h,start,duration,[7,59,1,103,30]),minute,label+' uneven');
 }
});
test('legacy weather callbacks retain minute accuracy without inventing native interval metadata',()=>{
 const h={id:'shelter',condition:newHomeCondition(0)};
 const result=simulate(h,4*1440-30,60,[60],true);
 assert.equal(result.wetness,60);assert.equal(result.rainMinutes,30);
 assert.deepEqual(result,simulate(h,4*1440-30,60,[1],true));
});
test('wear thresholds, protection and wetness caps have observable exact results',()=>{
 const home={id:'shelter',condition:{...newHomeCondition(0),wetness:990,rainMinutes:119,integrity:1}};
 const exposed=simulate(home,4*1440,2,[2]);assert.equal(exposed.integrity,0);assert.equal(exposed.rainMinutes,1);assert.equal(exposed.wetness,994);
 const protectedHome={...home,weatherproof:true};const protectedResult=simulate(protectedHome,4*1440,2,[2]);assert.equal(protectedResult.integrity,1);assert.equal(protectedResult.rainMinutes,121);assert.equal(protectedResult.wetness,992);
 assert.equal(simulate(home,4*1440,30,[30]).wetness,1000);
 assert.equal(simulate(home,8*1440,2000,[2000]).wetness,0);
});
test('other-world time freezes home condition without catch-up, home-world travel retains passive exposure',()=>{
 const h={id:'shelter',condition:{...newHomeCondition(0),wetness:500,rainMinutes:119}},weatherAt=at=>nativeRainAtClock(calendar(4*1440),0,at);
 advanceHomeCondition(h,{clock:300,world:'book.foreign',weatherAt});
 assert.deepEqual(h.condition,{integrity:100,wetness:500,rainMinutes:119,lastClock:300});
 advanceHomeCondition(h,{clock:301,world:HOME_WORLD,location:'Village',weatherAt});
 assert.deepEqual(h.condition,{integrity:99,wetness:502,rainMinutes:0,lastClock:301});
});
test('missing weather retains safe drying fallback and condition cursor',()=>{
 const h={id:'shelter',condition:{...newHomeCondition(0),wetness:10}};
 advanceHomeCondition(h,{clock:30,world:HOME_WORLD,weatherAt:at=>nativeRainAtClock(null,0,at)});
 assert.deepEqual(h.condition,{integrity:100,wetness:0,rainMinutes:0,lastClock:30});
});
