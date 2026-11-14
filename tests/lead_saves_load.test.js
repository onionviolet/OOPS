// The earned lead saves are private, played checkpoints (gitignored). A tracked change to what a pack compiles to can strand
// every one of them at once: on 2026-11-13 all three leads' saves had stopped loading and nobody had noticed (lead core-flow
// audit, G1). This file boots one late save per lead on the current tree whenever the local checkpoints exist, and skips on a
// checkout without them. When it fails: a pack gained items or places without registrationAdditions (content_packs.js), or a
// structured life's compiled content moved and needs an identityAliases row after an old save is seen to play on
// (structured_native_registration.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {boot, ROOT} from '../scripts/headless/runner.mjs';
import {SCENARIOS, scenarioSave} from '../scripts/headless/scenarios.mjs';

export const LEAD_SAVES = Object.freeze(['lotm-kjw49', 'hp-w11-farewell', 'ri-fang-yuan-class-chair']);

for(const name of LEAD_SAVES) test(`earned lead save ${name} loads and plays an hour on this tree`, async t => {
    const def = SCENARIOS[name];
    assert.ok(def?.file, `${name} is a registered file scenario`);
    if(!existsSync(join(ROOT, def.file))) return t.skip('local private checkpoint not present');
    if(!existsSync(join(ROOT, 'private_packs/manifest.json'))) return t.skip('local private packs not present');
    const g = await boot(JSON.parse(await scenarioSave(name)), {seed: 1});   // a refused save throws here with the loader's reason
    t.after(() => g.close());
    await g.step(60);
    await g.check();
    assert.deepEqual(g.errors, []);
});
