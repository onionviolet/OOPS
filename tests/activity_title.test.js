import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activityTitles as worlds,readActivity,scoreActivity,dominantTitle} from '../src/activity_title.js';
test('legacy fixture is empty, recent work overtakes old work and batching preserves the result',()=>{
 const old=JSON.parse(readFileSync(new URL('./fixtures/skill-evolution-legacy.json',import.meta.url)));
 const start=readActivity(old.activity_title),rule=worlds['base.frontier'];
 const fought=scoreActivity(rule,start,'a','combat',720);
 const worked=scoreActivity(rule,fought,'a','work',720);
 assert.equal(dominantTitle(rule,worked),'Village hand');
 assert.equal(dominantTitle(worlds['book.lotm.tingen'],worked),'Office regular');
 const split=scoreActivity(rule,scoreActivity(rule,fought,'a','work',360),'a','work',360);
 assert.ok(Math.abs(split.scores.work-worked.scores.work)<1e-8);
 assert.deepEqual(readActivity(JSON.parse(JSON.stringify(worked))),worked);
 assert.equal(scoreActivity(rule,worked,'b','rest',1).scores.work,undefined);
 assert.throws(()=>readActivity({...worked,revision:2}));
});
