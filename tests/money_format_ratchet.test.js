import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, basename} from 'node:path';

// UIC190: a price a player compares with the purse reads in the purse's format. moneyText (src/reveal_chain.js) prints
// "10C 4W" once the character knows the coin letters and "104 coins" before, so a template that writes `${n} coins`
// itself drifts from the purse. Older ones are counted here and the count only goes down: route one through moneyText
// and lower BASELINE. A world with its own money (soli, galleons) keeps its own words; this counts only "coin".
const BASELINE = 65;
const UI_FILE = /(_ui|_view|_panel|_display)\.js$/;
const COIN_TEMPLATE = /\$\{[^}]+\} coins?\b/g;
const walk = dir => readdirSync(dir).flatMap(name => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; });

test('UI modules add no new raw coin prices', () => {
    const hits = walk('src').filter(path => path.endsWith('.js') && (UI_FILE.test(basename(path)) || path.includes('/ui/') || ['display.js', 'proto23_shell.js'].includes(basename(path))))
        .map(path => [path, (readFileSync(path, 'utf8').match(COIN_TEMPLATE) || []).length]).filter(([, count]) => count);
    const total = hits.reduce((sum, [, count]) => sum + count, 0);
    assert.ok(total <= BASELINE, `${total} raw "\${n} coins" prices in UI modules, baseline ${BASELINE}. Use moneyText from src/reveal_chain.js. Files: ${hits.map(([path, count]) => `${path} ${count}`).join(', ')}`);
});
