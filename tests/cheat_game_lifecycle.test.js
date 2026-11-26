import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {cheatGame} from './helpers/cheat_game.mjs';
const reservePort = async () => {
    const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const port=server.address().port;await new Promise(resolve=>server.close(resolve));return port;
};
const assertReleased = async port => {
    const server=createServer();
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
    await new Promise(resolve=>server.close(resolve));
};
test('failed browser launch releases the already listening cheat server and preserves the error',async()=>{
    const port=await reservePort(), failure=Error('reproduced missing Playwright');
    await assert.rejects(cheatGame({port,launch:async()=>{throw failure;}}),error=>error===failure);
    await assertReleased(port);
});
test('failed context setup closes the browser and releases the cheat server even if close fails',async()=>{
    const port=await reservePort(), setup=Error('context setup failure'), cleanup=Error('browser cleanup failure');let closed=0;
    await assert.rejects(cheatGame({port,launch:async()=>({newContext:async()=>{throw setup;},close:async()=>{closed++;throw cleanup;}})}),
        error=>error instanceof AggregateError && error.errors[0]===setup && error.errors[1]===cleanup);
    assert.equal(closed,1);await assertReleased(port);
});
