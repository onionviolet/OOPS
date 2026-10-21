import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../src/display.js', import.meta.url), 'utf8');
const start = source.indexOf('function log_loot(');
const end = source.indexOf('\n/**', start);
assert.ok(start >= 0 && end > start, 'log_loot source is available for the focused probe');
const logLootSource = source.slice(start, end);

function format({recent, total, dynamic = true, summary = false}) {
    const emitted = [];
    const items = {
        A: {getName: () => 'Potion'},
        B: {getName: () => 'Potion'},
        C: {getName: () => 'Herb'},
    };
    runInNewContext(`${logLootSource}\nlog_loot({loot_list, is_dynamic, is_a_summary});`, {
        item_templates: items,
        getItemFromKey: key => ({getName: () => key === 'wood' || key === 'stone' ? 'Potion' : key}),
        create_item_tooltip_content: ({item}) => `tip:${item.getName()}`,
        log_message: (...args) => emitted.push(args),
        loot_list: {recent, total},
        is_dynamic: dynamic,
        is_a_summary: summary,
    });
    return emitted[0];
}

const entry = (identity, count, field = 'item_id') => ({[field]: identity, item_count: count});

test('dynamic loot joins gains by identity across alternating acquisitions', () => {
    const message = format({
        recent: {B: entry('B', 3)},
        total: {A: entry('A', 5), B: entry('B', 3)},
    });
    assert.equal(message[0], 'Gained "Potion" x5, "Potion" x3(+3)');
    assert.deepEqual(Array.from(message[2].subjects, subject => subject.name), ['Potion', 'Potion']);
});

test('dynamic loot handles subset and reordered recent acquisitions', () => {
    const message = format({
        recent: {C: entry('C', 2), A: entry('A', 1)},
        total: {A: entry('A', 7), B: entry('B', 4), C: entry('C', 2)},
    });
    assert.equal(message[0], 'Gained "Potion" x7(+1), "Potion" x4, "Herb" x2(+2)');
});

test('item keys retain distinct same-name items and non-dynamic summary wording', () => {
    const message = format({
        recent: {wood: entry('wood', 2, 'item_key'), stone: entry('stone', 3, 'item_key')},
        total: {stone: entry('stone', 8, 'item_key'), wood: entry('wood', 5, 'item_key')},
        dynamic: true,
    });
    assert.equal(message[0], 'Gained "Potion" x8(+3), "Potion" x5(+2)');
    assert.deepEqual(Array.from(message[2].subjects, subject => subject.html), ['tip:Potion', 'tip:Potion']);

    const summary = format({recent: {wood: entry('wood', 2, 'item_key')}, total: {}, dynamic: false, summary: true});
    assert.equal(summary[0], 'Gained in total: "Potion" x2');
    assert.equal(summary[1], 'total_gathered_loot');
});
