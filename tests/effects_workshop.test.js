// PSA24: the effect packs reach a played life through one capability run. Each act must change the world
// by the owning pack's law and the whole run must save, reload and settle the same.
import assert from 'node:assert/strict';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {effectsWorkshopRun as run} from '../src/world_packs/effects_workshop.js';
import {serializeEngineWorld} from '../src/engine_world.js';
import {DEFAULT_ENTRY, reachableFrom} from '../scripts/reachable.mjs';

const reload = engine => run.restore(JSON.parse(JSON.stringify(serializeEngineWorld(engine))));
const SAYS = {vapor: /breathed in 3 units/, splash: /swollen for 30 minutes/, aperture: /rose by 24000 motes/, ward: /ward took 4 of 4/,
    breath: /breath fell from 3 to 0/, fire: /fuel went from 3 to 0/, focus: /conjured thing ended/, potion: /vitality \+3/,
    gu: /vitality \+3/, spell: /vitality \+2/, formula: /Seer \(Fool 9\).*power: bind thing/, search: /wordings fit/, tend: /brewer could be tended/};

test('every act of the workshop shows its pack, one act at a time on a fresh world, and survives a reload', () => {
    const acts = run.view(run.create()).actions.map(a => a.id);
    assert.deepEqual(acts.sort(), Object.keys(SAYS).sort());
    for (const id of acts) {
        const after = run.act(reload(run.create()), id);
        const view = run.view(reload(after));
        assert.match(view.result, SAYS[id], id);
        assert.equal(view.actions.find(a => a.id === id).reason, 'You have seen this.');
    }
});

test('the whole run in order is the same after a reload at every step', () => {
    let straight = run.create(), reloaded = run.create();
    for (const {id} of run.view(straight).actions) {
        straight = run.act(straight, id);
        reloaded = run.act(reload(reloaded), id);
    }
    assert.deepEqual(serializeEngineWorld(reload(reloaded)), serializeEngineWorld(straight));
    assert.equal(run.view(straight).history.length, 13);
});

test('an act cannot be repeated', () => {
    const once = run.act(run.create(), 'ward');
    assert.deepEqual(serializeEngineWorld(run.act(once, 'ward')), serializeEngineWorld(once));
});

test('the effect packs are reachable from main.js', () => {
    const reached = reachableFrom(DEFAULT_ENTRY), root = fileURLToPath(new URL('..', import.meta.url));
    for (const f of ['src/world_packs/brew_effects_pack.js', 'src/world_packs/gu_effect_pack.js', 'src/world_packs/hp_effect_pack.js',
        'src/world_packs/lotm_derived_cases.js', 'src/kernel_search.js', 'src/effect_checks.js',
        ...['breathing', 'brew_splash', 'brew_vapor', 'fiendfyre', 'gu_aperture', 'layered_protection', 'spell_sustain'].map(n => `src/world_substrate_packs/${n}.js`)]) {
        assert.equal(reached.has(join(root, f)), true, f);
    }
});
