// Mixing counter evidence: fresh mixing state, then mix and drink along the suggested tries, at 1920x1080.
// Usage: node scripts/playtest/mixing-capture.mjs [outDir]. Headless, fresh origin, mid-game fixture save (the counter is open there).
import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const out = resolve(process.argv[2] || 'docs/representations/evidence/mixing'); await mkdir(out, {recursive: true});
const seed = JSON.parse(await readFile('tests/fixtures/perf/mid.json', 'utf8'));
delete seed.availabilities?.recipe?.undefined; delete seed.availabilities?.recipe?.['recipe/undefined'];
seed.customization = defaultCustomizationState(); seed.customization.profiles.Default.settings.effects = 'full';
const bundle = await buildBundle(), server = await serve(bundle.dir);
const s = new Session({url: server.url, seed: 19, wall: Date.UTC(2026, 9, 25), opTimeout: 15000});
const log = []; const say = m => { log.push(m); console.log(m); };
try {
    await s.start(); await s.open(seed); const p = s.page;
    await p.locator('#village_mixing_open').click();
    const panel = p.locator('#village_mixing_panel'); await panel.waitFor({state: 'visible'});
    const learned = () => p.locator('#mixture_discovery').evaluate(n => n.dataset.text);
    const shot = async name => { await p.locator('#mixture_discovery').evaluate(n => { for (let e = n; e; e = e.parentElement) e.scrollTop = 0; }); await p.screenshot({path: join(out, `${name}-1920x1080.png`)}); };
    say('FRESH\n' + await learned()); await shot('1-fresh');
    const set = async (amounts, process) => {
        for (const [id, n] of Object.entries(amounts)) await p.locator('#mixture_amount_' + id.replaceAll(' ', '_')).fill(String(n));
        await p.locator('#mixture_process').selectOption(process);
    };
    const buy = async id => { for (let i = 0; i < 4; i++) await p.getByRole('button', {name: new RegExp('Buy 1')}).nth(['River bellleaf', 'Emberseed', 'Mellow salt', 'Spring water'].indexOf(id)).click(); };
    for (const id of ['River bellleaf', 'Emberseed', 'Mellow salt', 'Spring water']) await buy(id);
    const mixAndDrink = async (label) => {
        await p.locator('#mixture_craft').click();
        for (let i = 0; i < 20 && !(await p.locator('[data-mixture-product] button', {hasText: /Experiment|Drink/}).count()); i++) { await s.step(30); await p.waitForTimeout(300); }
        await p.locator('[data-mixture-product] button', {hasText: /Experiment|Drink/}).first().click(); await p.waitForTimeout(300);
        say(`AFTER ${label}\n` + await learned());
    };
    // Follow the suggestion each time via "Set up this try".
    for (let step = 1; step <= 4; step++) {
        await p.locator('#mixture_next_set').click();
        say(`TRY ${step}: ` + await p.locator('#mixture_next_try').innerText());
        await mixAndDrink(`try ${step}`);
        await shot(`${step + 1}-after-try-${step}`);
    }
    assert.deepEqual(s.errors.filter(e => e.kind === 'pageerror' || !/404/.test(e.text)), []); // 404s are optional pack manifests the fixture does not ship
    await writeFile(join(out, 'walk.txt'), log.join('\n\n') + '\n'); say('PASS');
} finally { await s.close(); server.close(); await bundle.dispose(); }
