// Native action-box ownership: dialogue must return the local actions without a clock tick.
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';
test('leaving native dialogue restores one Local life panel and chip on the same minute',async()=>{
 const game=await boot(null,{seed:87});
 try{
  const clock=game.minutes();
  await game.click('[data-nearby-verb="talk:villageElder"]');
  await game.click('[data-topic-id="hello"]');
  await game.click('#center_mode_back');
  assert.equal(game.minutes(),clock,'display restoration does not spend time');
  assert.equal(game.$$('#location_actions_div #local_life_panel').length,1);
  assert.equal(game.$$('.here-chip').filter(n=>n.textContent.startsWith('Local life')).length,1);
  // Another open/back must not duplicate an owner or advance its rewards.
  await game.click('[data-inspect-nearby="villageElder"]');
  await game.click('[data-focus-action="talk:villageElder"]');
  await game.click('#center_mode_back');
  assert.equal(game.$$('#location_actions_div #local_life_panel').length,1);
  assert.equal(game.$$('.here-chip').filter(n=>n.textContent.startsWith('Local life')).length,1);
  assert.equal(game.snapshot().absorb_local_life.watchShifts,0);
  assert.deepEqual(game.errors,[]);
 }finally{game.close();}
});
