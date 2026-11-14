import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, basename} from 'node:path';

// UIC119, UIC148 (UR117, UR135): a number a player reads goes through src/number_format.js, so the same value
// does not read "31.623" in one panel and "32" in the next. Older inline formats are counted here and the count
// only goes down: rewrite one and lower BASELINE; a new `.toFixed(` in a UI module fails.
const BASELINE = 37;
const UI_FILE = /(_ui|_view|_panel|_display)\.js$/;
const walk = dir => readdirSync(dir).flatMap(name => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; });

test('UI modules add no new inline number formats', () => {
    const hits = walk('src').filter(path => path.endsWith('.js') && (UI_FILE.test(basename(path)) || path.includes('/ui/') || ['display.js', 'proto23_shell.js'].includes(basename(path))))
        .map(path => [path, readFileSync(path, 'utf8').split('.toFixed(').length - 1]).filter(([, count]) => count);
    const total = hits.reduce((sum, [, count]) => sum + count, 0);
    assert.ok(total <= BASELINE, `${total} inline .toFixed( calls in UI modules, baseline ${BASELINE}. Use formatGlance, formatCount or formatDuration from src/number_format.js. Files: ${hits.map(([path, count]) => `${path} ${count}`).join(', ')}`);
});
