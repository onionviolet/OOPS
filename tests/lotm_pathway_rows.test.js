import test from 'node:test';
import assert from 'node:assert/strict';
import {pathwayRows} from '../src/book_world_lotm_rows.js';
import {pathwayDoses,flagOf} from '../src/book_world_lotm_pathways.js';
import {LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';

// Exercise the current shared envelope seam. Real pathway journeys live in their system tests.
for(const row of pathwayRows)test(`${row.potion}: next dose releases at its actual assessment or exam, and is conserved`,()=>{
 const flags={};const stock={};
 const check=()=>pathwayDoses(row,{state:{},f:flags,count:(owner,key)=>owner==='main_character'?(stock[key]||0):0,reserved:()=>0,assert:assert.ok});
 const set=(name)=>{flags[`book.lotm.${flagOf(row,name)}`]=true;};
 check();set('allocated');assert.throws(check,/allocated/);
 stock[K[row.holds.base]]=1;check();set('ingested');assert.throws(check,/allocated/);
 stock[K[row.holds.base]]=0;set('assessed');
 if(row.exam){if(row.exam.legacyRelease)set('exam.required');check();set('examined');}
 assert.throws(check,/released/);stock[K[row.holds.next]]=1;check();
 stock[K[row.holds.next]]=2;assert.throws(check,/released/);
 stock[K[row.holds.next]]=1;set('promoted');assert.throws(check,/released/);
 stock[K[row.holds.next]]=0;check();
});
