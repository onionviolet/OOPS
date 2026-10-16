import test from 'node:test';
import assert from 'node:assert/strict';
import {lintStoryContent} from '../scripts/lint_story_spine.mjs';
import {readVillageSupplyTables,readVillageObtainability} from '../scripts/village_supply_tables.mjs';
import {buildVillageObtainability} from '../src/village_obtainability.js';
import {VILLAGE_ASKS,askFee} from '../src/village_traveler_asks.js';
import {travelerSourceHint} from '../src/traveler_source_hint.js';
import {runSeededStory} from '../scripts/run_story_spine.mjs';
test('lint rejects world-unreachable asks and fees outside difficulty band, including authored overrides',()=>{
 assert.deepEqual(lintStoryContent(),[]);const a=VILLAGE_ASKS.road_mender[0];
 assert.ok(lintStoryContent({asks:{road_mender:[{...a,item:'no world route'}]}}).some(f=>f.code==='UNREACHABLE_ASK'));
 assert.ok(lintStoryContent({asks:{road_mender:[{...a,reward:1}]}}).some(f=>f.code==='MISPRICED_ASK'));
 const index=readVillageObtainability(),quote={item:a.item,quantity:1,band:'unknown',...askFee(index[a.item],1,'ready')};
 assert.ok(lintStoryContent({quotes:[quote]}).some(f=>f.code==='MISPRICED_ASK'));
});
test('unknown clue leaks no hidden source; discovered trader/gather/drop hints project only knowledge',()=>{
 const t=readVillageSupplyTables(),before=structuredClone(t),a=VILLAGE_ASKS.road_mender[3],goal={...a,quantity:1,band:'unknown'};
 let index=buildVillageObtainability(t),hint=travelerSourceHint(goal,index);assert.equal(hint.band,'unknown');assert.equal(hint.line,a.clue);assert.ok(!hint.line.includes('Wolf rat'));
 t.drops=t.drops.map(r=>({...r,known:r.source==='Wolf rat',available:false}));index=buildVillageObtainability(t);hint=travelerSourceHint(goal,index);assert.match(hint.line,/Wolf rat/);assert.equal(hint.band,'stretch');
 const rope={...VILLAGE_ASKS.river_walker[1],quantity:1,band:'unknown'};assert.ok(!travelerSourceHint(rope,index).line.includes('market'));
 t.stock=t.stock.map(r=>({...r,known:true,available:true}));index=buildVillageObtainability(t);hint=travelerSourceHint(rope,index,{money:0});assert.match(hint.line,/Village market/);assert.equal(hint.band,'stretch');assert.equal(travelerSourceHint(rope,index,{money:16}).band,'ready');
 assert.deepEqual(buildVillageObtainability(before),readVillageObtainability());
});
test('new replay includes resolved contracts and streams exactly; legacy runner remains available',()=>{
 const a=runSeededStory(43,{minutes:180}),b=runSeededStory(43,{minutes:180,reload:true,chunk:60});assert.deepEqual(a.projection,b.projection);assert.equal(a.projection.request.revision,2);
 const old=runSeededStory(43,{minutes:180,revision:1});assert.equal(old.projection.request.revision,1);assert.equal(old.projection.request.quantity,1);
});
