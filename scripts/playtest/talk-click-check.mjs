// Talk view check: in the village elder conversation a real pointer click (no force, no DOM .click())
// on the visible "Hello?" topic must go through, and the native line behind it must stay out of
// the way (aria-hidden, clipped) so nothing a player can see is covered or double-listed.
// Harnesses should click `.talk-view [data-topic-id="<id>"]`, not the native `[data-textline]` row.
// node scripts/playtest/talk-click-check.mjs   (exit 0 = pass)
import {Session, buildBundle, serve} from './lib.mjs';

const bundle = await buildBundle(), site = await serve(bundle.dir);
const s = await new Session({url: site.url, opTimeout: 15000, seed: 7, wall: Date.UTC(2026, 9, 30),
    hooks: {beforeOpen: async c => c.route('**/private_packs/manifest.json', r => r.fulfill({json: {schema: 1, packs: []}}))}}).start();
let failed = '';
try {
    await s.open();
    const p = s.page;
    await p.getByRole('button', {name: 'Talk to someone'}).click();
    await p.locator('[data-dialogue="villageElder"]').click();
    await p.waitForTimeout(800);
    const native = await p.evaluate(() => {const n = document.querySelector('[data-textline="hello"]'); return n && {hidden: n.getAttribute('aria-hidden'), clipped: getComputedStyle(n).clipPath};});
    if(!native || native.hidden !== 'true' || native.clipped === 'none') failed = `native hello line is not hidden from sight and assistive tech: ${JSON.stringify(native)}`;
    const topic = p.locator('.talk-view [data-topic-id]').first();
    if(!failed) {
        await topic.click({timeout: 3000});   // actionability checks fail if another element covers it
        await p.waitForTimeout(500);
        const heard = await p.evaluate(() => /Already covered/i.test(document.querySelector('.talk-view')?.innerText || '') && !!document.querySelector('.talk-covered-row'));
        if(!heard) failed = 'the Hello? topic was clicked but the conversation did not record it';
    }
} catch(error) {failed = error.message.split('\n').slice(0, 6).join(' | ');}
finally {await s.close(); site.close(); await bundle.dispose();}
if(failed) {console.error('Talk click check failed: ' + failed); process.exit(1);}
console.log('Talk view: a real click on the Hello? topic goes through; the native line stays hidden.');
