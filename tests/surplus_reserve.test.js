import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {villageReserve as rule,quoteReserve,readReserve,emptyReserve} from '../src/surplus_reserve.js';
test('legacy fixture starts without a reserve and a funded reserve survives serialization',()=>{
    const legacy=JSON.parse(readFileSync(new URL('./fixtures/skill-evolution-legacy.json',import.meta.url)));
    assert.deepEqual(readReserve(legacy.surplus_reserve),emptyReserve());
    const first=quoteReserve(rule,emptyReserve(),'first',150);
    assert.equal(first.after,2);assert.equal(first.reason,null);
    const second=quoteReserve(rule,readReserve(JSON.parse(JSON.stringify(first.next))),'first',150);
    assert.ok(second.after-first.after<0.2);
    assert.equal(quoteReserve(rule,second.next,'new life',149).current,0);
    assert.ok(quoteReserve(rule,second.next,'new life',149).reason);
    assert.throws(()=>readReserve({revision:2}));
});
