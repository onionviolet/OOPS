// IP2 harness: renders the real school-offices panel in a fresh headless origin at 1920x1080 with a booked month,
// checks the paid top-up button, and that its payload carries early:true. Not the full game: see docs/audits/IMPOSSIBILITIES_2026-10-30.md.
const {spawn} = require('node:child_process');
const {runBrowser} = require('./ui_helpers.cjs');
const port = 8100 + Math.floor(Math.random() * 400);
const srv = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {stdio: 'ignore', detached: false});
(async () => {
    await new Promise(r => setTimeout(r, 800));
    await runBrowser(async browser => {
        const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
        await page.goto(`http://127.0.0.1:${port}/package.json`);
        const out = await page.evaluate(async () => {
            const o = await import('/src/home_school_offices.js');
            const {SCHOOL_ROSTER} = await import('/src/home_school_content.js');
            const id = SCHOOL_ROSTER[0][0];
            const c = {clock: 100, jobs: [], people: {}, staffFacts: {[id]: {'home.schoolOffice.records': true, 'home.schoolOffice.monthReadyAt': 99999}}, staffResources: {}};
            document.body.innerHTML = '';
            const panel = document.createElement('div'); document.body.append(panel);
            const el = (tag, text) => {const e = document.createElement(tag); if (text) e.textContent = text; return e;};
            const actions = [];
            const action = (box, key, label, req) => {const b = el('button', label); b.onclick = () => actions.push(req); box.append(b);};
            o.renderSchoolOffices({panel, c, el, action});
            panel.querySelectorAll('details').forEach(d => d.open = true);
            const buttons = [...panel.querySelectorAll('button')].filter(b => /extra session/.test(b.textContent));
            buttons.forEach(b => b.click());
            return {labels: buttons.map(b => b.textContent), actions, width: window.innerWidth, height: window.innerHeight};
        });
        console.log(JSON.stringify(out));
        if (out.width !== 1920 || out.height !== 1080 || !out.labels.length || !out.actions.every(a => a.early === true && a.type === 'school_month')) throw Error('IP2 browser check failed');
        await page.screenshot({path: '/private/tmp/claude-501/scratch_ip/ip2.png'});
    });
})().then(() => {srv.kill(); console.log('ok');}).catch(e => {srv.kill(); console.error(e); process.exit(1);});
