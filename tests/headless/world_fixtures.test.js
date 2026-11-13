// DEV world fixtures (FRC74): each named state builds from a new game, loads through the real load path with the runner's invariants,
// proves its state, and survives the Options-menu export and import. Slow (a played build can take minutes under load), so it lives in
// tests/headless/ and runs on request: node --test tests/headless/world_fixtures.test.js  (YAIRPG_FIXTURES=name,name narrows it).
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {ROOT} from '../../scripts/headless/runner.mjs';
import {SCENARIOS, scenarioSave} from '../../scripts/headless/scenarios.mjs';
import {WORLD_FIXTURES, verifyWorldFixture} from '../../scripts/headless/world_fixtures.mjs';

const only = process.env.YAIRPG_FIXTURES?.split(',').filter(Boolean);
const packs = def => def.needs.filter(n => !n.includes('optional')).map(n => n.split(' ')[0]);

test('every world fixture is a named scenario, labelled DEV, with a browser view', () => {
    for(const [name, def] of Object.entries(WORLD_FIXTURES)) {
        assert.equal(SCENARIOS[name]?.fixture, name, `${name} is in the scenario library`);
        assert.match(def.summary, /^DEV FIXTURE, (played|COMPOSED)/, `${name} says how it was made`);
        assert.ok(def.view?.sel && def.view.text instanceof RegExp, `${name} names what a browser shows`);
    }
});

for(const [name, def] of Object.entries(WORLD_FIXTURES)) {
    const missing = packs(def).filter(p => !existsSync(join(ROOT, p)));
    const skip = only && !only.includes(name) ? 'not selected' : missing.length ? `needs ${missing.join(', ')}` : false;
    test(`${name} builds, loads, proves and round-trips through export and import`, {skip, timeout: 60 * 60 * 1000}, async () => {
        const text = await scenarioSave(name, {seed: 1});           // built and load-verified once per source stamp
        assert.ok(text && JSON.parse(text)['current time'], 'save text with a calendar');
        const r = await verifyWorldFixture(name, text, {seed: 1, roundTrip: true});
        assert.equal(r.name, name);
    });
}
