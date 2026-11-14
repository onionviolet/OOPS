const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const {resolve} = require('node:path');
const {launchChrome} = require('../../scripts/ui_helpers.cjs');

(async () => {
    const browser = await launchChrome();
    try {
        const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const url = pathToFileURL(resolve('work/wang-er-duel/index.html')).href;
        await page.goto(url);
        const text = id => page.locator(id).innerText();
        const status = () => text('#status');
        const wait = value => page.waitForFunction(value => document.querySelector('#status').textContent === value, value);
        const blade = page.locator('[data-move="moonlight_gu"]');
        await wait('Waiting for your move');
        await page.screenshot({path: 'work/wang-er-duel/board.png'});
        const offsets = await page.locator('.actor').evaluateAll(actors => actors.map(actor => {
            const pin = document.querySelector(`.position-pin[data-position="${actor.dataset.position}"]`);
            const center = element => {
                const box = element.getBoundingClientRect();
                return box.left + box.width / 2;
            };
            return Math.abs(center(actor) - center(pin));
        }));
        assert.ok(offsets.every(offset => offset < 1), 'each actor aligns to its ground pin');
        await page.locator('#text-mode').click();
        assert.match(await text('#text-scene [data-position="6"]'), /Position 6.*Hunter 2.*Hunter 3/);
        await page.locator('#board-mode').click();
        assert.match(await blade.innerText(), /4 essence/);
        assert.equal(await page.locator('[data-move="close_fist"]').isDisabled(), true);
        await page.locator('button[data-actor="wang_er"]').click();
        assert.equal(await page.locator('#target').inputValue(), 'wang_er');
        await page.locator('button[data-actor="hunter_1"]').click();
        await blade.click();
        await page.locator('#text-mode').click();
        assert.match(await text('#text-scene'), /Moonblade → Hunter 1/);
        const snapshot = await text('#clock');
        await page.locator('#board-mode').click();
        await page.locator('#text-mode').click();
        assert.equal(await text('#clock'), snapshot);
        await wait('Waiting for your move');
        assert.match(await text('#log'), /Fang Yuan casts at Hunter 1/);
        assert.match(await text('#vitals'), /12/);
        await page.locator('#auto').click();
        await page.locator('#board-mode').click();
        await page.waitForFunction(() => document.querySelector('#policy-note').textContent.startsWith('Auto chose'));
        await page.locator('#manual').click();
        await wait('Waiting for your move');
        assert.match(await text('#log'), /drops the bow/);
        await page.screenshot({path: 'work/wang-er-duel/mid-fight.png'});
        await page.locator('#text-mode').click();
        assert.match(await text('#text-scene [data-position="5"]'), /Position 5.*Wang Er.*Dropped bow/);
        await page.screenshot({path: 'work/wang-er-duel/text.png'});
        await page.locator('#auto').click();
        await wait('Fang Yuan wins');
        const result = await Promise.all([text('#log'), text('#vitals'), text('#clock')]);
        await page.locator('#reset').click();
        await page.locator('#auto').click();
        await wait('Fang Yuan wins');
        assert.deepEqual(await Promise.all([text('#log'), text('#vitals'), text('#clock')]), result);
        await page.locator('#reset').click();
        await page.locator('#board-mode').click();
        await page.locator('#motion').uncheck();
        await page.locator('#auto').click();
        await wait('Fang Yuan wins');
        assert.deepEqual(await Promise.all([text('#log'), text('#vitals'), text('#clock')]), result);
        assert.deepEqual(errors, []);
        console.log('1920×1080: live view switching during a pending cast, manual/auto handoff, target selection, bow drop, and identical text/board outcomes with motion off.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
