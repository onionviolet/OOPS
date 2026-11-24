import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {Session} from '../../scripts/playtest/lib.mjs';

const [origin, screenshotDir] = process.argv.slice(2);
if (!origin) throw Error('Pass the URL from serve.mjs --fixture mid.');
const url = new URL(origin);
assert.equal(url.hostname, '127.0.0.1', 'Use the isolated preview origin.');
url.searchParams.set('test_hooks', '1');
const session = await new Session({url: url.href, seed: 7, wall: Date.UTC(2026, 10, 18)}).start();
try {
    if (screenshotDir) await mkdir(screenshotDir, {recursive: true});
    await session.open();
    const {page} = session;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const {root: {nodeId}} = await cdp.send('DOM.getDocument');
    const picker = page.locator('#layout-lab select');
    const item = page.getByText('Cheap leather pants', {exact: true}).first();
    await item.click();
    await page.mouse.move(0, 0);
    await page.locator('.shell-item-preview:popover-open').waitFor({state: 'hidden'});

    const probes = {
        'Stat label': '#proto23_character .shell-stat-record span',
        'Stat value': '#proto23_character .shell-stat-record strong',
        'Inventory row': '#inventory_content_div .item_name',
        'Item action': '#proto23_item_detail button',
        'Place prose': '#village_scene .scene-place-lead',
        'Reports heading': '[data-module="messages"] .workspace-module-header strong',
        'Preview picker': '#layout-lab',
    };
    for (const width of [1920, 1366]) {
        await page.setViewportSize({width, height: width === 1920 ? 1080 : 768});
        for (const layout of ['', 'item-below']) {
            await picker.selectOption(layout);
            await page.evaluate(() => document.fonts.ready);
            for (const [label, selector] of Object.entries(probes)) {
                const target = page.locator(selector).filter({visible: true}).first();
                const {size, synthesis} = await target.evaluate(element => {
                    element.dataset.layoutFontProbe = '';
                    const style = getComputedStyle(element);
                    return {size: parseFloat(style.fontSize), synthesis: style.fontSynthesis};
                });
                const {nodeId: probe} = await cdp.send('DOM.querySelector', {nodeId, selector: '[data-layout-font-probe]'});
                const {fonts} = await cdp.send('CSS.getPlatformFontsForNode', {nodeId: probe});
                await target.evaluate(element => delete element.dataset.layoutFontProbe);
                const expected = label === 'Place prose' || label === 'Reports heading' ? /^OOPS Gothic Bitmap / : new RegExp(`^OOPS Gothic Bitmap ${size}$`);
                assert.ok(fonts.some(font => expected.test(font.familyName)), `${label} at ${width}: ${fonts.map(font => font.familyName).join(', ')}`);
                if (['Stat label', 'Stat value', 'Inventory row', 'Item action', 'Preview picker'].includes(label)) {
                    assert.equal(synthesis, 'none', `${label} at ${width}: synthetic font styles`);
                }
            }
            if (screenshotDir) await page.screenshot({path: join(screenshotDir, `gothic-${width}-${layout || 'current'}.png`)});
        }
        console.log(`Verified Gothic glyphs in both layouts at ${width}px.`);
    }
    assert.deepEqual(session.errors.filter(error => error.kind === 'pageerror'), []);
} finally {
    await session.close();
}
