import test from 'node:test';
import assert from 'node:assert/strict';
import {shardSchema, systemText, lintExtra, enQuoteIssues} from '../scripts/lead_run/batch_lib.mjs';
import {parseShard} from '../scripts/lead_run/lint_lead_run.mjs';

const shard = parseShard('=== Chapter 7 | book 2\np1: The courier waits.');
const locator = 'en b2 c7 p1';
const look = {text: 'Folded green cuffs.', label: 'S', locator};
const person = {id: 'courier', looks: [look], traits: [], role: 'Night courier', prominence: 'minor'};
const issues = row => lintExtra({people: [row]}, shard, '1.6').map(i => i.code);

test('1.6 adds sourced descriptions only to people and retains predecessor schemas', () => {
    for (const version of ['1.3', '1.4', '1.5'])
        assert.equal(shardSchema('people', {version}).properties.people.items.properties.looks, undefined);
    for (const pass of ['scenes', 'full', 'census', 'texture', 'rules'])
        assert.deepEqual(shardSchema(pass, {version: '1.6'}), shardSchema(pass, {version: '1.5'}));
    const schema = shardSchema('people', {version: '1.6'}).properties.people.items;
    assert.ok(schema.required.includes('prominence'));
    assert.match(systemText('people', {version: '1.6'}), /one-scene/);
    assert.deepEqual(issues(person), []);
    assert.deepEqual(issues({...person, looks: [], role: undefined, prominence: 'mention'}), []);
});

test('description lint checks per-field budgets, labels, scope and copied language', () => {
    for (const entry of [{label: 'U'}, {locator: 'en b1 c7 p1'}, {locator: 'en b2 c7 p8'}, {locator: undefined}])
        assert.ok(issues({...person, looks: [{...look, ...entry}]}).includes('looks'));
    assert.ok(issues({...person, traits: Array(9).fill(look)}).includes('traits-length'));
    assert.ok(issues({...person, role: 'a\nb'}).includes('role'));
    assert.ok(issues({...person, prominence: 'unknown'}).includes('prominence'));
    const copied = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen';
    const copiedMap = parseShard('=== Chapter 7 | book 2\np1: ' + copied + '.');
    assert.ok(lintExtra({people: [{...person, role: copied.toUpperCase()}]}, copiedMap, '1.6')
        .some(issue => issue.code === 'description-quote'));
    assert.ok(enQuoteIssues({people: [{...person, looks: [{...look, text: copied}]}]}, copied).length);
    assert.deepEqual(lintExtra({people: [{}]}, shard, '1.5'), []);
});
