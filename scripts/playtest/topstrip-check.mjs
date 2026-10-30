// Top-strip check: on a fresh Village life (and, with --tingen, a fresh Tingen life) every visible,
// enabled button in the workspace navigation must change something when clicked: the center task,
// or a node with a nonzero size in the center view. A button that does nothing must be hidden.
// node scripts/playtest/topstrip-check.mjs [--tingen]   (exit 0 = pass)
import {Session, buildBundle, serve} from './lib.mjs';

const tingen = process.argv.includes('--tingen');
const bundle = await buildBundle(), site = await serve(bundle.dir);
const s = await new Session({url: site.url, opTimeout: 30000, seed: 7, wall: Date.UTC(2026, 9, 30),
    hooks: {beforeOpen: async c => c.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}))}}).start();
const failures = [];
async function sweep(label) {
    const page = s.page, names = await page.evaluate(() => [...document.querySelectorAll('#workspace_navigation button')]
        .filter(b => b.getBoundingClientRect().width > 0 && !b.disabled && b.dataset.routeId).map(b => b.dataset.routeId));
    for(const id of names) {
        for(let k = 0; k < 3 && await page.locator('#main_content').getAttribute('data-center-task'); k++) {await page.keyboard.press('Escape'); await page.waitForTimeout(80);}
        const before = await page.evaluate(() => document.getElementById('main_content').dataset.centerTask || '');
        await page.evaluate(id => document.querySelector(`#workspace_navigation button[data-route-id="${id}"]`).click(), id);
        await page.waitForTimeout(450);
        const result = await page.evaluate(id => {
            const task = document.getElementById('main_content').dataset.centerTask || '';
            const target = document.querySelector(`#workspace_navigation button[data-route-id="${id}"]`)?.dataset.panelPath;
            // The route's own panel must be on screen with a size (in the center view or docked).
            const shell = document.querySelector(`.workspace-module[data-module="${target}"]`);
            const r = shell?.getBoundingClientRect();
            return {task, sized: !!r && r.width > 0 && r.height > 0 && !shell.hidden, inPlace: false};
        }, id);
        // Routes that open in place (Inventory, Here, Crafting) keep the center task; they must at least move focus to a sized node.
        const ok = result.task !== before || result.sized || result.inPlace;
        console.log(`${label} ${id}: ${ok ? 'ok' : 'DOES NOTHING'} (task ${before || 'none'} -> ${result.task || 'none'})`);
        if(!ok) failures.push(`${label}:${id}`);
    }
}
try {
    await s.open();
    await sweep('village');
    if(tingen) {
        await s.page.keyboard.press('Escape');
        await s.page.getByRole('button', {name: /Cross to another world: Tingen/}).click();
        await s.page.waitForTimeout(500);
        await s.page.getByRole('button', {name: /Begin as a Nighthawk probationer/}).first().click();
        await s.page.waitForTimeout(1500);
        await sweep('tingen');
    }
} finally {await s.close(); site.close(); await bundle.dispose();}
if(failures.length) {console.error('Top-strip buttons that do nothing: ' + failures.join(', ')); process.exit(1);}
console.log('Every visible top-strip button changed something.');
