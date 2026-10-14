// Test-only instrumentation: expose real loader/serializer without a production debug API.
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
const require = createRequire(import.meta.url);
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
export async function cheatGame() {
    const root = new URL('../../', import.meta.url);
    const source = await readFile(new URL('src/main.js', root), 'utf8');
    const bundle = await build({entryPoints: [new URL('src/main.js', root).pathname],
        plugins: [{name: 'cheat-test-access', setup(build) {
            build.onLoad({filter: /[/\\]src[/\\]main\.js$/}, () => ({contents: source + `
                globalThis.__cheatTest = {create_save, load, read: () => structuredClone(cheatState),
                  set: value => {cheatState=validateCheatState(value);}};`, loader: 'js', resolveDir: new URL('src/', root).pathname}));
        }}], bundle: true, write: false, format: 'esm', platform: 'browser', target: 'es2022'});
    const server = createServer(async (req, res) => {
        try {
            const pathname = new URL(req.url, 'http://localhost').pathname;
            const file = new URL('.' + pathname, root);
            if(!file.href.startsWith(root.href)) {res.writeHead(403).end(); return;}
            const data = pathname === '/dist/bundle.js' ? bundle.outputFiles[0].contents : await readFile(pathname === '/' ? new URL('index.html', root) : file);
            res.setHeader('Content-Type', pathname.endsWith('.js') ? 'text/javascript' : pathname.endsWith('.css') ? 'text/css' : pathname === '/' ? 'text/html' : 'application/octet-stream');
            res.end(data);
        } catch {res.writeHead(404).end();}
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    const context = await browser.newContext({viewport: {width: 1366, height: 768}});
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`, {waitUntil: 'domcontentloaded'});
    await page.locator('#loading_screen_play_button:not(.none_display)').click();
    await page.waitForTimeout(1200);
    if(await page.locator('#hero_creation_panel_confirmation').isVisible()) await page.locator('#hero_creation_panel_confirmation').click();
    await page.waitForFunction(() => !!globalThis.__cheatTest);
    return {page, errors, close: async () => {await browser.close(); await new Promise(resolve => server.close(resolve));}};
}
