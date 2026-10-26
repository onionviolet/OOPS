// Local preview delivery proof, isolated from the player's app and saves.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {mkdtemp, mkdir, readFile, writeFile, rm, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
const {launchChrome} = createRequire(import.meta.url)('../ui_helpers.cjs');
const out = 'docs/gm/dispatch/carry-out-queue-2026-10-26/evidence/primary-adoption';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const root = await mkdtemp(path.join(tmpdir(), 'oops-lane-proof-'));
const outputs = ['one', 'two'].map(name => path.join(root, name));
const servers = [];
let browser;
await mkdir(out, {recursive: true});
const receipt = {route: 'fresh browser launch, no save fixture', viewport: '1920x1080', lanes: []};
const watched = ['index.html', 'dist/bundle.js', 'dist/bundle.js.map'];
const before = await Promise.all(watched.map(async file => hash(await readFile(file))));
try {
  await Promise.all(outputs.map(output => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['build.js'], {env: {...process.env, BUILD_OUT: output}, stdio: 'ignore'});
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`build exit ${code}`)));
  })));
  browser = await launchChrome();
  for (const [index, output] of outputs.entries()) {
    const server = createServer(async (req, res) => {
      try {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        let file = path.resolve(output, '.' + pathname);
        if (!file.startsWith(output + '/') && file !== output) { res.writeHead(403).end(); return; }
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
        const types = {'.js':'text/javascript', '.css':'text/css', '.html':'text/html', '.png':'image/png', '.woff2':'font/woff2'};
        res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
        res.end(await readFile(file));
      } catch {res.writeHead(404).end();}
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    servers.push(server);
    const origin = `http://127.0.0.1:${server.address().port}`;
    const context = await browser.newContext({viewport:{width:1920, height:1080}});
    const page = await context.newPage();
    const errors = [], failed = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {if(response.status() >= 400) failed.push({url:response.url(), status:response.status()});});
    await page.goto(origin + '/?test_hooks=1');
    await page.getByText('PLAY', {exact:true}).click();
    if (await page.getByText('Confirm', {exact:true}).isVisible()) await page.getByText('Confirm', {exact:true}).click();
    await page.waitForFunction(() => window.simulationTestHooks);
    await page.evaluate(() => simulationTestHooks.pause());
    const versionedBundle = await page.evaluate(() => performance.getEntriesByType('resource').find(entry => entry.name.includes('/dist/bundle.js?version='))?.name);
    const bundleHash = hash(await readFile(path.join(output, 'dist/bundle.js')));
    assert.ok(versionedBundle.startsWith(origin + '/dist/bundle.js?version='));
    assert.ok(versionedBundle.endsWith(bundleHash.slice(0, 12)));
    assert.equal(hash(Buffer.from(await (await fetch(versionedBundle)).arrayBuffer())), bundleHash);
    assert.deepEqual(errors, []);
    assert.deepEqual(failed, []);
    await page.screenshot({path:`${out}/lane-${index + 1}.png`});
    receipt.lanes.push({origin, bundleHash, versionedBundle, errors, failed});
    await context.close();
  }
  assert.deepEqual(await Promise.all(watched.map(async file => hash(await readFile(file)))), before);
  receipt.sourceOutputsUnchanged = true;
  await writeFile(`${out}/result.json`, JSON.stringify(receipt, null, 2) + '\n');
  console.log('PASS: two concurrent builds, independent served bundle hashes, fresh 1920x1080 browser launches, no page/HTTP errors, primary outputs unchanged.');
} finally {
  await browser?.close();
  await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))));
  await rm(root, {recursive:true, force:true});
}
