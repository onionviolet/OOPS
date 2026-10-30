// IP7 harness: real primordial host + real panel on a fresh origin at 1920x1080. Takes a mission, finishes it,
// then checks the rush button is offered, enabled, charges the fee and starts a second mission the same day.
// definePanel needs the game's panel directory, so this mounts the panel's own node; not the full game.
const {spawn} = require('node:child_process');
const {runBrowser} = require('./ui_helpers.cjs');
const port = 8500 + Math.floor(Math.random() * 400);
const srv = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {stdio: 'ignore'});
(async () => {
    await new Promise(r => setTimeout(r, 800));
    await runBrowser(async browser => {
        const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.goto(`http://127.0.0.1:${port}/package.json`);
        const out = await page.evaluate(async () => {
            document.body.innerHTML = '<div id="main_content"></div>';
            const {createPrimordialHost} = await import('/src/book_world_primordial_host.js');
            const {createPrimordialPanel} = await import('/src/book_world_primordial_ui.js');
            let t = 1000000; const host = createPrimordialHost({now: () => t});
            const p = createPrimordialPanel({read: () => host.view(), request: id => host.request(id), askRule: () => host.askHowCreditIsWeighed(), startShift: o => host.startShift(o), repay: n => host.repay(n), buy: id => host.buy(id)});
            const q = s => document.querySelector(s);
            q('[data-primordial-start-task]').click(); t += 8 * 60; host.tick(); p.render();
            const rush = q('[data-primordial-rush-task]');
            const before = host.view().cp, label = rush?.textContent, enabled = rush && !rush.disabled;
            rush?.click(); p.render();
            return {label, enabled, before, after: host.view().cp, shift: !!host.view().shift, note: document.body.innerText.includes('rush posting')};
        });
        console.log(JSON.stringify(out), JSON.stringify(errors));
        if(!out.label || !out.enabled || !out.shift || out.after !== out.before - 2 || errors.length) throw Error('IP7 browser check failed');
        await page.screenshot({path: '/private/tmp/claude-501/scratch_ip/ip7.png'});
    });
})().then(() => {srv.kill(); console.log('ok');}).catch(e => {srv.kill(); console.error(e); process.exit(1);});
