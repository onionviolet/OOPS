import test from 'node:test';
import assert from 'node:assert/strict';
import {lotmCommands} from '../src/book_world_lotm_actions.js';
import {lessonEffects} from '../src/lesson.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';
// FD11: the control lesson builds its knowledge effect through lesson.js (LOTM is the seam's second world). The expected
// literal below is the pre-move hand-written effect, so a drift in key, stage, basis, text or order fails here.
const TEXT='You can now deliberately look at one material in front of you and end the sight. It costs spirituality and tires you; it shows presence at the material, not identity, safety or future. Ending the sight stops new cost; it does not undo fatigue.';
test('control lesson effects equal the pre-move literal, in order, and match lessonEffects',()=>{
 const c=lotmCommands.find(x=>x.id==='book.lotm.lesson');
 const legacy=[{type:'power',actor:'player',powerId:I.method,operation:'learn'},{type:'fact',scope:'actor',actor:'player',key:'book.lotm.methodLearned',value:true},
  {type:'knowledge',actor:'player',key:'book.lotm.method',stage:'understood',value:TEXT,basis:{kind:'instruction',attributedTo:'player',situationId:I.situation}}];
 assert.deepEqual(c.effects,legacy);
 assert.equal(JSON.stringify(c.effects),JSON.stringify(legacy));
 assert.deepEqual(c.effects.slice(2),lessonEffects({key:'book.lotm.method',value:TEXT,situationId:I.situation}));
});
