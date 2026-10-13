import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// R15 G1 browser run: while any one-player living-world job ran (rough kit, balm dressing, hand rest),
// every Work Ledger panel render read workLedgerContext(), whose busy check called
// expeditionOccupiesPlayer(). That helper logs its reason, so Reports filled with repeated
// "Finish your living-world work or decision first." lines nobody had asked for.
// Read-only context must use the silent reason; player actions keep their own logged check.
test('work ledger read context checks native occupation without logging a report', () => {
    const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
    const start = main.indexOf('function workLedgerContext(');
    const body = main.slice(start, main.indexOf('\n}', start));
    assert.ok(start > 0, 'workLedgerContext moved');
    assert.match(body, /nativeOccupationReason\(\)/);
    assert.doesNotMatch(body, /expeditionOccupiesPlayer\(\)/);
    const logger = main.slice(main.indexOf('function expeditionOccupiesPlayer('), main.indexOf('function expeditionOccupiesPlayer(') + 200);
    assert.match(logger, /if\(reason\) log_message\(reason, "notification"\)/);
});
