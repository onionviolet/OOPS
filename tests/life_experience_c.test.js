import test from 'node:test';
import assert from 'node:assert/strict';
import {createChronicle} from '../src/chronicle.js';
import {learnedLifeLessons,lifeVoice,lifeEpitaph,lifeLearningMultiplier} from '../src/life_experience.js';
const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
test('a retained lesson has distinct voice at twelve, forty and eighty without inventing knowledge',()=>{
 const c=createChronicle(0,calendar);assert.deepEqual(learnedLifeLessons(c),[]);
 c.knowledge.routeSignals=true;
 const texts=[12,40,80].map(age=>{c.life.initialAge=age;return lifeVoice(c,'routeSignals')});
 assert.equal(new Set(texts).size,3);assert.match(texts[0],/!/);assert.match(texts[2],/remember/);
});
test('aging bonus stops at adulthood and at death; epitaph depends on actual deeds',()=>{
 const c=createChronicle(0,calendar);assert.equal(lifeLearningMultiplier(c),1.2);
 c.life.initialAge=40;assert.equal(lifeLearningMultiplier(c),1);
 c.life.initialAge=18;c.life.endedAt=1;assert.equal(lifeLearningMultiplier(c),1);
 assert.match(lifeEpitaph(c),/Not every kindness/);
 c.relationships.villageElder.ties.dutyKept=true;assert.match(lifeEpitaph(c),/kept a promise/);
 assert.doesNotMatch(lifeEpitaph(c),/master/);
});
