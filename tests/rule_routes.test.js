import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {globToRegExp, parseRuleFile, loadRoutes, routesFor} from '../scripts/rule_routes.mjs';

test('globs match like the path-rule loader: * stays in a folder, ** crosses folders', () => {
    assert.ok(globToRegExp('src/person_*.js').test('src/person_ties.js'));
    assert.ok(!globToRegExp('src/person_*.js').test('src/world/person_ties.js'));
    assert.ok(globToRegExp('src/**/*.js').test('src/world_packs/book_gu.js'));
    assert.ok(globToRegExp('src/*_standing*.js').test('src/economy_standing_domain.js'));
});

test('a rule file yields its globs and code ranges', () => {
    const r = parseRuleFile('---\npaths:\n  - "src/heat.js"\n---\n\nFollows STN1–STN22 and AD56.\n');
    assert.deepEqual(r.globs, ['src/heat.js']);
    assert.ok(r.ranges.includes('STN1–STN22'));
    assert.ok(r.families.includes('STN'));
    assert.ok(!r.families.includes('AD'));
});

test('each 2026-11-10 rulebook routes from its modules, with no stale glob', () => {
    const routes = loadRoutes();
    const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}).split('\n');
    const expect = {'src/heat.js': 'STN', 'src/canon_pull.js': 'STY', 'src/items.js': 'ITM', 'src/craft_sources.js': 'LVR',
        'src/world_calendar.js': 'TMR', 'src/observer_view.js': 'KNW', 'src/cheat_cards.js': 'CHT', 'src/person_temperament.js': 'MND',
        'src/authority.js': 'AGT', 'src/person_ties.js': 'TIE',
        'src/world_pack_manifest.js': 'WKR', 'src/world_packs/book_hp_pack.js': 'SKR', 'src/travel_legs.js': 'XWR'};
    for (const [path, fam] of Object.entries(expect))
        assert.ok(routesFor(path, routes).some(r => r.families.includes(fam)), `${path} should route to ${fam}`);
    const books = ['relationships', 'livelihoods', 'time', 'knowledge', 'standing', 'story', 'cheats', 'mind', 'items', 'powers-that-act', 'world-kinds', 'source-kinds', 'cross-world'];
    for (const r of routes.filter(r => books.some(b => r.file.endsWith(`/${b}.md`))))
        r.res.forEach((re, i) => assert.ok(files.some(f => re.test(f)), `${r.file}: glob ${r.globs[i]} matches no file`));
});
