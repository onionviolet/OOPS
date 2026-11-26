// Rebuild the ordinary Atlas, with its actual registry, then verify curated tracked reading at desktop size.
import assert from 'node:assert/strict';
import {execFileSync, spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdirSync, mkdtempSync, realpathSync, rmSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {launchChrome} from '../../scripts/perf/lib.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const tempRoot = realpathSync(tmpdir()), scratch = mkdtempSync(join(tempRoot, 'atlas-tracked-'));
const snapshot = join(scratch, 'snapshot.json');
const evidence = join(root, 'docs/representations/evidence/atlas-tracked-2026-11-25');
const env = {...process.env, ATLAS_SNAPSHOT: snapshot, ATLAS_PORT: '0'};
delete env.ATLAS_REBUILD;
let server, browser;
try {
    execFileSync(process.execPath, ['prototypes/world-atlas/build.mjs', '--out', snapshot], {cwd: root, env, stdio: 'inherit', windowsHide: true});
    server = spawn(process.execPath, ['prototypes/world-atlas/serve.mjs'], {cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'inherit']});
    const base = await new Promise((resolve, reject) => {
        server.once('error', reject); server.once('exit', code => reject(Error('Atlas stopped: ' + code)));
        server.stdout.setEncoding('utf8').on('data', text => {const match = text.match(/http:\/\/127\.0\.0\.1:\d+/); if (match) resolve(match[0]);});
    });
    browser = await launchChrome();
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/#world/lotm/reading');
    const tracked = page.getByRole('region', {name: 'Verified tracked readings'});
    await tracked.getByText('RA21 · Unused charm maintenance', {exact: true}).waitFor();
    assert.equal(await tracked.locator('details').evaluate(element => element.open), false);
    mkdirSync(evidence, {recursive: true});
    await page.screenshot({path: join(evidence, 'RA21-reading-view.png')});
    await tracked.locator('summary').click();
    await tracked.getByRole('heading', {name: 'What the selected source supports', exact: true}).waitFor();
    assert.match(await tracked.innerText(), /Selected Chinese passages[\s\S]*Stated practice[\s\S]*zh 第127章 p25–p30[\s\S]*Authored interaction[\s\S]*not source observation/);
    await tracked.getByText(/Slumber-only upkeep is agent-verified/).waitFor();
    await tracked.getByRole('link', {name: /READ_AHEAD_USE_2026-11-08.md/}).click();
    await page.reload();
    assert.equal(await tracked.locator('details').evaluate(element => element.open), true);
    await tracked.getByText('zh 第133章 p17–p25 · zh 第133章 p44–p47', {exact: false}).waitFor();
    assert.doesNotMatch(await tracked.innerText(), /[A-Z]:[\\/]|\.epub|OEBPS|\.xhtml/);
    await tracked.getByRole('link', {name: 'Open Slumber making and use', exact: true}).click();
    await page.waitForURL('**/#world/lotm/making/lotm.item.slumber-charm');
    await page.getByText('Slumber charm', {exact: true}).first().waitFor();
    await page.goto(base + '/#world/lotm/reading/tracked%3ARA21');
    await tracked.getByRole('heading', {name: 'Tracked evidence', exact: true}).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    mkdirSync(evidence, {recursive: true});
    await tracked.screenshot({path: join(evidence, 'RA21-desktop.png')});
    assert.deepEqual(errors, []);
    const receipt = {viewport: '1920x1080', route: '#world/lotm/reading/tracked%3ARA21',
        snapshotHash: createHash('sha256').update(readFileSync(snapshot)).digest('hex'),
        state: 'agent-verified, not human-reviewed', sourceInputs: 'actual registry; no synthetic reader rows', errors};
    writeFileSync(join(evidence, 'proof.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(JSON.stringify(receipt));
} finally {
    if (browser) await browser.close();
    if (server?.exitCode === null && server.signalCode === null) {const exited = once(server, 'exit'); server.kill(); await exited;}
    if (dirname(scratch) === tempRoot && basename(scratch).startsWith('atlas-tracked-')) rmSync(scratch, {recursive: true, force: true});
}
