import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {Session} from '../../scripts/playtest/lib.mjs';

const [url14, url21, out, ...only] = process.argv.slice(2);
if (!url14 || !url21 || !out) throw Error('Pass the 14px gear preview URL, 21px gear preview URL, and capture directory.');
const placements = ['beside', 'below', 'expanded', 'journal'];
assert.ok(only.every(placement => placements.includes(placement)), 'Unknown comparison placement.');
await mkdir(out, {recursive: true});
const results = [];
const viewports = [[1920, 1080], [1800, 1040], [1536, 864]];

await Promise.all([[url14, 14], [url21, 21]].map(async ([base, size]) => {
    const url = new URL(base);
    assert.equal(url.hostname, '127.0.0.1');
    url.searchParams.set('test_hooks', '1');
    const session = await new Session({url: url.href, seed: 7, wall: Date.UTC(2026, 10, 18)}).start();
    try {
        for (const placement of only.length ? only : placements) {
            await session.open();
            const {page} = session;
            const picker = page.locator('#layout-lab select');
            const detail = page.locator('#proto23_item_detail');
            const row = quality => page.locator(`#inventory_content_div > [data-item_quality="${quality}"][data-item_slot="legs"]`);
            const equip = detail.getByRole('button', {name: /^Equip/});
            const close = detail.getByRole('button', {name: 'Close item'});
            async function select(quality) {
                await row(quality).focus();
                await page.keyboard.press('Enter');
                await detail.waitFor({state: 'visible'});
                await page.mouse.move(0, 0);
                await page.locator('.shell-item-preview:popover-open').waitFor({state: 'hidden'});
            }
            async function equipAndReturn(quality) {
                const itemKey = await row(quality).evaluate(node => node.dataset.character_item);
                await equip.click();
                assert.match(await detail.innerText(), /Equipped · legs/);
                assert.ok(await row(quality).evaluate(node => node.classList.contains('equipped_item_control')));
                await close.click();
                await detail.waitFor({state: 'hidden'});
                assert.equal(await page.evaluate(() => document.activeElement?.dataset.character_item), itemKey);
            }

            await picker.selectOption(`item-${placement === 'expanded' ? 'beside' : placement}`);
            await select(40);
            assert.match(await detail.innerText(), /Slot empty/);
            await equipAndReturn(40);
            const journal = page.locator('[data-region="journal"] > [data-module="records"]');
            let journalBefore;
            if (placement === 'journal') {
                await page.setViewportSize({width: 1536, height: 864});
                await page.evaluate(() => document.fonts.ready);
                await page.waitForTimeout(120);
                journalBefore = await journal.boundingBox();
                assert.ok(journalBefore);
            }
            await select(65);
            assert.equal(await row(65).evaluate(node => node.classList.contains('equipped_item_control')), false);
            if (placement === 'expanded') await detail.getByRole('button', {name: /Full item/}).click();
            assert.equal(await page.locator('#center_mode_content #proto23_item_detail').count(), placement === 'expanded' ? 1 : 0);
            assert.equal(await page.locator('[data-region="journal"] #proto23_item_detail').count(), placement === 'journal' ? 1 : 0);
            const comparison = detail.locator('.item-card-versus');
            assert.match(await comparison.innerText(), /Cheap leather pants.*40%/);

            const cdp = await page.context().newCDPSession(page);
            await cdp.send('DOM.enable');
            await cdp.send('CSS.enable');
            const {root: {nodeId}} = await cdp.send('DOM.getDocument');
            for (const [width, height] of viewports) {
                await page.setViewportSize({width, height});
                await page.evaluate(() => document.fonts.ready);
                await page.waitForTimeout(120);
                const {nodeId: itemTitle} = await cdp.send('DOM.querySelector', {nodeId, selector: '#proto23_item_detail .shell-item-title'});
                const {fonts} = await cdp.send('CSS.getPlatformFontsForNode', {nodeId: itemTitle});
                assert.ok(fonts.some(font => font.familyName === `OOPS Gothic Bitmap ${size}`), `${placement} at ${width}px should use the ${size}px bitmap strike`);
                const facts = await page.evaluate(expanded => {
                    const item = document.querySelector('#proto23_item_detail');
                    const actions = document.querySelector('[data-region="actions"] > [data-module="local-actions"]');
                    const title = item.querySelector('.shell-item-title');
                    const body = item.querySelector('.shell-item-description');
                    const changes = [...item.querySelectorAll('.item-card-changes > li, .item-card-row[data-direction]:not([data-direction="same"])')];
                    const equip = item.querySelector('[data-shell-item-action="equip"]');
                    function fits(element) {
                        if (!element?.checkVisibility()) return false;
                        const rect = element.getBoundingClientRect();
                        if (rect.right > innerWidth || rect.bottom > innerHeight || rect.height <= 0) return false;
                        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
                            if (getComputedStyle(parent).overflowY === 'visible') continue;
                            const bounds = parent.getBoundingClientRect();
                            if (rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1) return false;
                        }
                        return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
                    }
                    return {
                        panelWidth: Math.round(item.getBoundingClientRect().width),
                        actionsWidth: expanded ? null : Math.round(actions.getBoundingClientRect().width),
                        visibleChanges: changes.filter(fits).length,
                        changes: changes.length,
                        itemScroll: Math.max(0, body.scrollHeight - body.clientHeight),
                        itemHorizontal: body.scrollWidth - body.clientWidth > 2,
                        compareVisible: fits(item.querySelector('.item-card-versus')),
                        equipVisible: fits(equip),
                        titleVisible: fits(title),
                    };
                }, placement === 'expanded');
                assert.ok(facts.equipVisible && facts.titleVisible);
                assert.ok(facts.changes > 0, 'The fixture must compare gear with different item contributions.');
                const result = {placement, size, width, height, ...facts};
                results.push(result);
                if (width !== 1800) await page.screenshot({path: join(out, `gear-${placement}-${size}-${width}.png`)});
                console.log(JSON.stringify(result));
            }
            await equipAndReturn(65);
            assert.ok(await row(40).evaluate(node => !node.classList.contains('equipped_item_control')));
            if (placement === 'journal') assert.deepEqual(await journal.boundingBox(), journalBefore);
            await cdp.detach();
        }
        assert.deepEqual(session.errors.filter(error => error.kind === 'pageerror'), []);
    } finally {
        await session.close();
    }
}));
results.sort((a, b) => a.size - b.size || a.placement.localeCompare(b.placement) || b.width - a.width);
await writeFile(join(out, 'gear-layout-results.json'), JSON.stringify(results, null, 2) + '\n');
