import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEventBook,learnedDay,knownTo} from '../src/world_events.js';
import {validateKnowledgeBasis} from '../src/causal_situations.js';
// Name-free checks for window 3: the carrier seam on the existing event reader (G10) and the told-not-known grain (G3, G8).
const ctx={presence:()=>null,channels:()=>new Set()};
test('G10: a private delivery by a carrier reaches its named recipient and no bystander, using the existing reader',()=>{
 const book=buildEventBook([{id:'note',key:'note',kind:'public_event',placement:'dated',scope:'private',evidence:'S',when:{day:1},
  present:['sender','lead'],spread:[{route:'carrier',delayDays:0,via:'sender',audience:'recipient'}]}]);
 assert.equal(learnedDay(book,'sender','note',ctx).level,'present');
 assert.equal(learnedDay(book,'lead','note',ctx).level,'present');
 const got=learnedDay(book,'recipient','note',ctx);assert.equal(got.route,'carrier');assert.equal(got.level,'heard');
 assert.equal(learnedDay(book,'bystander','note',ctx),null);
 assert.deepEqual(knownTo(book,'bystander',9,ctx),[]);
});
test('G10: a recipient is not reached while the carrier has not learned the event (no present, no route)',()=>{
 const book=buildEventBook([{id:'note',key:'note',kind:'public_event',placement:'dated',scope:'private',evidence:'S',when:{day:1},
  present:[],spread:[{route:'carrier',delayDays:0,via:'sender',audience:'recipient'}]}]);
 assert.equal(learnedDay(book,'recipient','note',ctx),null);
});
test('G3: a told fact needs a valid attributed basis (kind, teller, situation)',()=>{
 validateKnowledgeBasis({kind:'instruction',attributedTo:'teller',situationId:'s'});
 assert.throws(()=>validateKnowledgeBasis({kind:'reported',attributedTo:'teller',situationId:'s'}));
 assert.throws(()=>validateKnowledgeBasis({kind:'instruction',attributedTo:'teller'}));
});
