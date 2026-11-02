// Isolated home overview font and figure measurements, using disposable seeded starts.
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {serve} from '../../../../../../scripts/perf/lib.mjs';
import {Session} from '../../../../../../scripts/playtest/lib.mjs';

const server = await serve(resolve(process.argv[2]));
const errors = [];
const session = new Session({url: `${server.url}?test_hooks=1`, seed: 19,
    wall: Date.UTC(2026, 9, 30), opTimeout: 12000,
    hooks: {beforeOpen: c => c.on('pageerror', e => errors.push(e.message))}});
let page;
async function pick(id) {
    await page.getByRole('combobox', {name: 'Other known panels', exact: true}).selectOption(id);
}
const result = {viewport: '1920x1080', cases: [], errors};
try {
    await session.start();
    for (const size of [14, 21]) {
        await session.open(); page = session.page; await pick('homes');
        const start = page.locator('[data-home-action="start:homeowner"]');
        await start.evaluate(n => {for (let p=n.parentElement; p; p=p.parentElement) if (p.tagName === 'DETAILS') p.open=true;});
        await start.click();
        if (size === 21) {
            const seed = await session.save();
            seed.customization.profiles.Default.settings.typography = {font: 'gothic', size};
            await session.open(seed); page = session.page;
        }
        await pick('home-overview');
        await page.locator('#home_overview_panel [data-home-strip] svg .fig-chip text').first().waitFor();
        const values = await page.locator('#home_overview_panel').evaluate(p => {
            const svg=p.querySelector('[data-home-strip] svg');
            const label=svg.querySelector('.fig-chip text');
            const b=label.getBoundingClientRect(), s=svg.getBoundingClientRect();
            const m=label.getScreenCTM();
            return {panelFont:getComputedStyle(p).fontSize, labelFont:getComputedStyle(label).fontSize,
                svgWidth:s.width, viewBoxWidth:svg.viewBox.baseVal.width,
                labelPixelHeight:b.height, svgScaleX:m.a, svgScaleY:m.d};
        });
        result.cases.push({size, ...values});
    }
    if (errors.length) throw new Error(errors.join('\n'));
    await writeFile(process.argv[3], JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result));
} finally {
    await session.close?.();
    await server.close?.();
}
