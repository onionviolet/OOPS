import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

// The batched-validation owner in main.js, extracted like stepper_life_commit.test.js does.
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const start=source.indexOf('const BATCH_VALIDATE_MINUTES'),end=source.indexOf('function save_to_localStorage');
const owner=source.slice(start,end);
function host(badFrom=Infinity){
    const checked=[],context=vm.createContext({stepperSaves:null,game_version:'t',expansionError:null,foundationSaveBlocked:false,
        validateSaveEnvelope:e=>{checked.push(e.clock);if(e.clock>=badFrom)throw Error('invalid envelope');}});
    vm.runInContext(owner+'\nglobalThis.api={validateEnvelopeInBatch,settleBatchValidation,reset(){batchValidatedAt=null;batchPendingEnvelope=null;}};',context);
    return {api:context.api,checked,context};
}
test('outside a batch every minute validates, as before',()=>{
    const h=host();for(let m=1;m<=5;m++)h.api.validateEnvelopeInBatch({clock:m},m);
    assert.deepEqual(h.checked,[1,2,3,4,5]);
});
test('inside a batch validation runs at first write, hourly and at close, and the same final envelope is checked',()=>{
    const h=host();h.context.stepperSaves=new Set();h.api.reset();
    for(let m=1;m<=130;m++)h.api.validateEnvelopeInBatch({clock:m},m);
    assert.deepEqual(h.checked,[1,61,121]);
    h.api.settleBatchValidation();assert.deepEqual(h.checked,[1,61,121,130]);
    assert.equal(h.context.foundationSaveBlocked,false);
});
test('a save that fails mid-batch blocks at the next checkpoint, within one in-game hour, and at close',()=>{
    const h=host(40);h.context.stepperSaves=new Set();h.api.reset();
    for(let m=1;m<=39;m++)h.api.validateEnvelopeInBatch({clock:m},m);
    assert.equal(h.context.foundationSaveBlocked,false);
    for(let m=40;m<=60;m++)h.api.validateEnvelopeInBatch({clock:m},m); // deferred, not yet seen
    assert.throws(()=>h.api.validateEnvelopeInBatch({clock:61},61),/invalid envelope/); // first checkpoint after the failure
    // A failure that only the closing check sees still blocks progress.
    const g=host(10);g.context.stepperSaves=new Set();g.api.reset();
    for(let m=1;m<=30;m++)g.api.validateEnvelopeInBatch({clock:m},m);
    assert.throws(()=>g.api.settleBatchValidation(),/invalid envelope/);
    assert.equal(g.context.foundationSaveBlocked,true);assert.match(g.context.expansionError,/saving failed/);
});
