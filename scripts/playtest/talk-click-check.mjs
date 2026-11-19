// Replay Go and Talk with real pointer clicks on a fresh browser origin.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';

const bundle = await buildBundle(), site = await serve(bundle.dir);
const bundleSha256 = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
try {
    for (const here of ['column3', 'place']) {
        const s = await new Session({url: site.url, opTimeout: 20000, seed: 251036, wall: Date.UTC(2026, 9, 30),
            hooks: {beforeOpen: async c => {
                await c.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}));
                await c.addInitScript(mode => localStorage.setItem('yairpg.display.v1', JSON.stringify({'panel.look.here':mode})), here);
            }}}).start();
        try {
            await s.open();
            const p = s.page;
            assert.equal(await p.locator('html').getAttribute('data-look-here'), here);
            const rail = p.locator('#workspace_navigation [data-route-id="local-actions"]');
            assert.equal((await rail.textContent()).trim(), 'Actions');
            if (here === 'column3') await p.locator('[data-nearby-verb="talk:villageElder"]').click();
            else {
                await p.locator('.choice_dialogue').click();
                await p.locator('[data-dialogue="villageElder"]').click();
            }
            const native = await p.locator('[data-textline="hello"]').evaluate(n => ({
                hidden:n.getAttribute('aria-hidden'), clipped:getComputedStyle(n).clipPath,
            }));
            assert.equal(native.hidden, 'true');
            assert.notEqual(native.clipped, 'none');
            await p.locator('.talk-view [data-topic-id]').first().click();
            await p.locator('.talk-view .talk-covered-row').first().waitFor({state:'visible'});
            await p.locator('#center_mode_back').click();

            const travel = async id => {
                const ownVerb = p.locator(`[data-nearby-verb="go:${id}"]`);
                const nativeRoute = p.locator(`[data-travel="${id}"]`);
                if (await ownVerb.isVisible()) await ownVerb.click();
                else {
                    if (!(await nativeRoute.isVisible())) await nativeRoute.locator('xpath=ancestor::*[contains(@class,"location_choice_dropdown")][1]/*[1]').click();
                    await nativeRoute.click();
                }
                await p.waitForFunction(place => window.simulationTestHooks.snapshot()['current location'] === place, id);
                assert.equal((await s.save())['current location'], id);
            };
            await travel('Wild willow stand');
            await travel('Village');
            assert.deepEqual(s.errors.filter(e => e.kind === 'pageerror'), []);
            console.log(JSON.stringify({here, viewport:'1920x1080', talk:'covered', go:'Village → Wild willow stand → Village', bundleSha256}));
        } finally {
            await s.close();
        }
    }
} finally {
    site.close();
    await bundle.dispose();
}
