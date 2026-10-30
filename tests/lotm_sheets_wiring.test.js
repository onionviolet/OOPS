import test from 'node:test';
import assert from 'node:assert/strict';
import {leadChapterRef,lotmSheetsFor} from '../src/book_world_lotm_sheets.js';
const cast={slice:{firstScene:'s.main.001'},bindings:{addressStarts:[[1,1,'001'],[2,1,'002'],[5,1,'003']],days:[{scene:'s.main.001',day:1,from:0},{scene:'s.main.002',day:1,from:90},{scene:'s.main.003',day:2,from:0}]}};
const state=clock=>({clock,lotm:{initializedAt:0}});
const sheet={id:'p.a',tier:'principal',identities:[{v:{title:'clerk'},from:'b1:1',to:'b1:4',view:'actual'},{v:{title:'secret'},from:'b1:1',gate:'route.x'},{v:{title:'officer'},from:'b1:4'}]};
const pack={schema:1,sheets:{'cast.a':sheet}};
test('the reached chapter follows the day windows', () => {
 assert.equal(leadChapterRef(state(10),cast),'b1:1');
 assert.equal(leadChapterRef(state(100),cast),'b1:2');
 assert.equal(leadChapterRef(state(1500),cast),'b1:5');
 assert.equal(leadChapterRef({clock:5},{...cast,bindings:{}}),null);
});
test('a sheet shows as of the reached chapter and keeps gated entries hidden', () => {
 const early=lotmSheetsFor(state(100),cast,['cast.a','cast.none'],{pack})['cast.a'];
 assert.deepEqual(early.identities.actual.map(e=>e.v.title),['clerk']);
 assert.equal(early.hidden,1);
 const late=lotmSheetsFor(state(1500),cast,['cast.a'],{pack,openGates:['route.x']})['cast.a'];
 assert.deepEqual(late.identities.actual.map(e=>e.v.title).sort(),['officer','secret']);
 assert.deepEqual(lotmSheetsFor(state(100),cast,['cast.a'],{pack:null}),{});
});
