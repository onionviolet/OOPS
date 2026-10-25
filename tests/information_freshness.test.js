import test from 'node:test';
import assert from 'node:assert/strict';
import {informationFreshness} from '../src/information_freshness.js';
import {defaultCheatState,seedBeginningCheats,grantCheat} from '../src/cheat_cards.js';
import {moduleCard} from '../src/cheat_definitions.js';
import {calendarMinutes} from '../src/world_rhythm.js';
const time={year:999,month:4,day:1,hour:8,minute:12},at=calendarMinutes(time)-12;
test('Freshness Sense ages observer records without consulting or refreshing current truth',()=>{
 let cheats=seedBeginningCheats(defaultCheatState(),{at:0});for(const id of ['freshness-sense','true-appraisal'])cheats=grantCheat(cheats,moduleCard(id),{route:'test',at:0});
 cheats.held['true-appraisal'].card.state.readings.push({species:'Wolf rat',at});const s={cheats,'current time':time,expansion:{actors:{player:{worldId:'base.frontier'}}},harvest:{privateTruth:'changed'}};
 const before=structuredClone(s);assert.deepEqual(informationFreshness(s),[{label:'Wolf rat observation',at,ageMinutes:12}]);assert.deepEqual(s,before);
 s.harvest.privateTruth='different';assert.equal(informationFreshness(s)[0].ageMinutes,12);s['current time']={...time,minute:22};assert.equal(informationFreshness(s)[0].ageMinutes,22);assert.equal(cheats.held['true-appraisal'].card.state.readings[0].at,at);
 s.expansion.actors.player.worldId='book.paradise.hub';assert.equal(informationFreshness(s)[0].ageMinutes,null);delete s.cheats.held['freshness-sense'];assert.deepEqual(informationFreshness(s),[]);
});
