import test from 'node:test';
import assert from 'node:assert/strict';
import {openFlowSession} from '../scripts/flow_session.mjs';

test('flow setup transfers an open session on success and closes a failed click before it can be returned', async()=>{
    let closed=0;
    const session={start:async()=>{},open:async()=>{},close:async()=>{closed++;}};
    assert.equal(await openFlowSession(session,null),session);assert.equal(closed,0);
    const click=new Error('locator.click: Timeout 6000ms exceeded.\nCall log:\n  element intercepted');
    await assert.rejects(openFlowSession(session,null,async()=>{throw click;}),error=>error===click);
    assert.equal(closed,1);
});

test('flow setup also owns startup/load failures and retains the click error if cleanup fails',async()=>{
    const load=new Error('load failed');let closed=0;
    await assert.rejects(openFlowSession({start:async()=>{},open:async()=>{throw load;},close:async()=>{closed++;}},null),error=>error===load);assert.equal(closed,1);
    await assert.rejects(openFlowSession({start:async()=>{throw load;},open:async()=>{assert.fail('startup failed');},close:async()=>{closed++;}},null),error=>error===load);assert.equal(closed,2);
    const click=new Error('click failed\nCall log retained'),cleanup=new Error('cleanup failed');
    await assert.rejects(openFlowSession({start:async()=>{},open:async()=>{},close:async()=>{throw cleanup;}},null,async()=>{throw click;}),error=>{
        assert.deepEqual(error.errors,[click,cleanup]);assert.equal(error.cause,click);assert.ok(error.message.startsWith(click.message));assert.match(error.message,/cleanup failed/);return true;
    });
});
