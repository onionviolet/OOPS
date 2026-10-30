import test from 'node:test';
import assert from 'node:assert/strict';
import {lotmPathView,setAdvancement} from '../src/book_world_lotm_path.js';
const pack={meta:{},rungs:{seq7:{label:'Sequence 7',formulaRow:'x',crossings:[{id:'dig',type:'digest',label:'Act in the role',fact:'acting7',need:6},{id:'dose',type:'ingest',label:'Hold the dose',fact:'heldMagician',need:true,irreversible:true}],grants:['g'],
 abilities:[]}}};
const facts=over=>({'lotm.enrolled':true,'lotm.home.evernight':true,'lotm.flag.promoted':true,'lotm.flag.ingested':true,'lotm.acting':2,...over});
test('without a pack the ladder ends at the Sequence 8 ceiling', () => {
 const v=lotmPathView({},facts());assert.equal(v.next,'???');assert.equal(v.capped,true);
});
test('with a pack the next rung shows typed blockers with have and need', () => {
 setAdvancement(pack);
 const v=lotmPathView({},facts());
 assert.equal(v.capped,false);assert.equal(v.ready,false);
 assert.deepEqual(v.crossings.map(c=>[c.id,c.type,c.have,c.need,c.met]),[['dig','digest',2,6,false],['dose','ingest',false,true,false]]);
 const done=lotmPathView({},facts({'lotm.acting':6,'lotm.holds.magicianDose':1}));
 assert.equal(done.ready,true);
 setAdvancement(null);
});
