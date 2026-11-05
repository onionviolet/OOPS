import test from 'node:test';
import assert from 'node:assert/strict';
import {hitsToDown,winChance,contest,NOTCH_DIALS} from '../src/notch_contest.js';
import * as lotm from '../src/book_world_lotm_bands.js';

test('the notch core runs with another world\'s dials and stays world-neutral',()=>{
 const steep={gain:2,logistic:2};
 assert.equal(winChance(0,steep),0.5);
 assert.ok(winChance(1,steep)>winChance(1,NOTCH_DIALS),'a steeper dial makes a one-notch edge count more');
 assert.equal(hitsToDown(3,1,steep),4);
 assert.equal(hitsToDown(-2,0,steep),1,'never below one hit');
 assert.deepEqual(contest(1,()=>0.99,steep).win,false);
 assert.equal(contest(1,()=>0,steep).win,true);
});
test('LOTM bands read the same formulas through their own dials',()=>{
 for(const d of [-3,0,2])assert.equal(lotm.winChance(d),winChance(d,lotm.BAND_DIALS));
 assert.equal(lotm.hitsToDown(4),hitsToDown(4,0,lotm.BAND_DIALS));
});
