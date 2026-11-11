// Headless Chrome at 1920x1080 on a rebuilt bundle from a fresh origin: close the game, let three wall hours pass, reopen,
// see the bank and its recap, spend an hour of it, save, reload (TMR5, TMR10). Evidence goes to the output folder.
//   node tests/away_bank_browser.mjs <output directory>
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {Session, buildBundle, serve} from '../scripts/playtest/lib.mjs';

const out = resolve(process.argv[2] || 'away-bank-evidence');
await mkdir(out, {recursive: true});
const bundle = await buildBundle(), server = await serve(bundle.dir), url = server.url;
const W0 = Date.UTC(2026, 10, 10, 12), HOUR = 3600000, checks = [];
const ok = (label, value) => {assert.ok(value, label); checks.push(label); console.log('PASS ' + label);};
const bank = page => page.evaluate(() => window.simulationTestHooks.project('awayBank'));
try {
    const first = await new Session({url, seed: 7, wall: W0}).start();
    await first.open();
    await first.step(30);
    const saved = await first.save();
    ok('a fresh origin banks nothing', !(await bank(first.page))?.bankedMinutes);
    await first.close();

    const second = await new Session({url, seed: 7, wall: W0 + 3 * HOUR}).start();
    try {
        await second.open(saved);
        const p = second.page, before = await bank(p);
        ok('three wall hours away bank about 180 minutes', before.bankedMinutes >= 179 && before.bankedMinutes <= 181);
        ok('the recap says what was banked', before.lastReturn?.minutes >= 179);
        const clock0 = await p.evaluate(() => window.simulationTestHooks.clock());
        const button = p.locator('#away_bank_spend');
        await button.waitFor({state: 'visible'});
        await p.screenshot({path: join(out, 'before-spend.png')});
        await button.click();
        await p.waitForFunction(() => /Spent \d+ banked minutes|Stopped after/.test(document.body.innerText) || window.simulationTestHooks.project('awayBank').lastSpend, null, {timeout: 120000});
        const after = await bank(p), clock1 = await p.evaluate(() => window.simulationTestHooks.clock());
        ok('spending moved the one clock by the hour it consumed', clock1 - clock0 === 60);
        ok('the bank was debited what the clock consumed', after.bankedMinutes === before.bankedMinutes - 60);
        ok('the spend says what happened', /Spent 60 banked minutes/.test(after.lastSpend));
        await p.screenshot({path: join(out, 'after-spend.png')});
        const kept = await second.save();
        ok('the saved bank slice holds the remainder', kept.awayBank.bankedMinutes === after.bankedMinutes);
        await p.reload();
        await p.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 60000});
        const reloaded = await bank(p);
        ok('reload keeps the remainder and grants nothing extra', reloaded.bankedMinutes === after.bankedMinutes);
        const real = second.errors.filter(e => e.kind === 'pageerror' || !/Failed to load resource/.test(e.text)); // optional pack files 404 by design
        if(real.length) console.log(JSON.stringify(real, null, 1));
        ok('no page errors', real.length === 0);
        await p.screenshot({path: join(out, 'after-reload.png')});
    } finally {await second.close();}
    await writeFile(join(out, 'checks.json'), JSON.stringify(checks, null, 2));
} finally {server.close(); await bundle.dispose();}
console.log(`${checks.length} checks passed`);
