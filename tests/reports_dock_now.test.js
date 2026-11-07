import test from 'node:test';
import assert from 'node:assert/strict';
import {todayDigest, registerLocalClockSource} from '../src/today_strip.js';
import {setCurrentLocation} from '../src/runtime_state.js';
import {dockRows} from '../src/reports_dock.js';

// AT25: the Now row is built from a fresh read of the clock each time, so a 1440-minute step changes its text.
test('the Now row follows the clock after a day-long step', () => {
    let elapsed = 0;
    const off = registerLocalClockSource(() => ({clock: `Day ${Math.floor(elapsed / 1440) + 1} · ${String(Math.floor(elapsed % 1440 / 60)).padStart(2, '0')}:00`, date: ''}));
    setCurrentLocation({name: 'Tingen', activities: {}});
    try {
        const now = () => dockRows({logLines: 0, next: null, today: todayDigest()}).find(r => r.kind === 'clock').text;
        const before = now();
        elapsed += 1440;
        const after = now();
        assert.notEqual(after, before);
        assert.match(before, /Day 1/);
        assert.match(after, /Day 2/);
    } finally { off(); setCurrentLocation(undefined); }
});
