// The dependency-free MCP stdio server: protocol shape only, no game.
import test from 'node:test';
import assert from 'node:assert/strict';
import {PassThrough} from 'node:stream';
import {createServer} from '../scripts/mcp/stdio_server.mjs';

const server = createServer({name: 't', version: '1', tools: [
    {name: 'echo', description: 'e', readOnly: true, handler: a => ({text: a.x, data: {x: a.x}})},
    {name: 'boom', description: 'b', handler: () => {throw new Error('bad input');}},
]});

test('initialize, list, call, errors and notifications', async () => {
    assert.equal((await server.handle({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2024-11-05'}})).result.protocolVersion, '2024-11-05');
    assert.equal((await server.handle({jsonrpc: '2.0', id: 2, method: 'initialize', params: {protocolVersion: '1999'}})).result.protocolVersion, '2025-06-18');
    assert.equal(await server.handle({jsonrpc: '2.0', method: 'notifications/initialized'}), null);
    const listed = (await server.handle({jsonrpc: '2.0', id: 3, method: 'tools/list'})).result.tools;
    assert.equal(listed[0].annotations.readOnlyHint, true);
    assert.equal(listed[1].annotations.readOnlyHint, false);
    const ok = (await server.handle({jsonrpc: '2.0', id: 4, method: 'tools/call', params: {name: 'echo', arguments: {x: 'hi'}}})).result;
    assert.deepEqual([ok.isError, ok.content[0].text, ok.structuredContent], [false, 'hi', {x: 'hi'}]);
    const boom = (await server.handle({jsonrpc: '2.0', id: 5, method: 'tools/call', params: {name: 'boom'}})).result;
    assert.deepEqual([boom.isError, boom.content[0].text], [true, 'bad input']);
    assert.equal((await server.handle({jsonrpc: '2.0', id: 6, method: 'tools/call', params: {name: 'nope'}})).error.code, -32602);
    assert.equal((await server.handle({jsonrpc: '2.0', id: 7, method: 'zzz'})).error.code, -32601);
});

test('listen frames lines, answers in order and survives bad JSON', async () => {
    const input = new PassThrough(), output = new PassThrough();
    const lines = [];
    output.setEncoding('utf8').on('data', d => lines.push(...d.split('\n').filter(Boolean).map(l => JSON.parse(l))));
    const done = server.listen(input, output);
    input.write('{"jsonrpc":"2.0","id":1,"method":"ping"}\nnot json\n{"jsonrpc":"2.0","id":2,"met');
    input.write('hod":"ping"}\n');
    input.end();
    await done;
    assert.deepEqual(lines.map(l => l.id ?? 'err'), [1, 'err', 2]);
    assert.equal(lines[1].error.code, -32700);
});
