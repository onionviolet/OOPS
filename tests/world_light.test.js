import test from 'node:test';
import assert from 'node:assert/strict';
import {worldLight,TINGEN_LIGHT} from '../src/world_light.js';
import {lotmLight} from '../src/book_world_lotm_events.js';
test('default profile is native night with no fog', () => {
 assert.deepEqual(worldLight(12/24),{night:false,fog:null,visibility:1});
 assert.deepEqual(worldLight(22/24),{night:true,fog:null,visibility:0.7});
});
test('Tingen night reads fog and reduced visibility; day does not', () => {
 const n=worldLight(23/24,TINGEN_LIGHT),d=worldLight(12/24,TINGEN_LIGHT);
 assert.ok(n.night&&n.fog&&n.visibility<d.visibility);
 assert.equal(d.fog,null);
 assert.ok(worldLight(4.5/24,TINGEN_LIGHT).fog,'fog persists past the night window into the small hours');
});
test('the LOTM events consumer reads the Tingen clock', () => {
 const at=m=>({clock:1000+m,lotm:{initializedAt:1000}});
 assert.ok(lotmLight(at(22*60)).fog);
 assert.equal(lotmLight(at(12*60)).fog,null);
});
