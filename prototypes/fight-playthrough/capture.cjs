// Headless capture of the built playthrough page at 1920x1080: stills of key
// steps, page errors, and (with --video) a film of every step held for its reading time.
//   node prototypes/fight-playthrough/build.mjs && node prototypes/fight-playthrough/capture.cjs [--video]
const {pathToFileURL} = require('node:url');
const {resolve} = require('node:path');
const fs = require('node:fs');
const {launchChrome} = require('../../scripts/ui_helpers.cjs');

(async () => {
    const dir = resolve('work/fight-playthrough'), url = pathToFileURL(resolve(dir, 'index.html')).href;
    const frames = JSON.parse(fs.readFileSync(resolve(dir, 'frames.json'), 'utf8')).frames;
    const browser = await launchChrome();
    const errors = [];
    try {
        const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(url);
        const steps = await page.evaluate(() => window.__steps);
        // One still per card, pause, pick and result, plus overflow checks on every step.
        let stills = 0, overflow = [];
        for (let i = 0; i < steps; i++) {
            await page.goto(`${url}?at=${i}`);
            const phase = await page.evaluate(() => document.body.dataset.phase);
            const over = await page.evaluate(() => [...document.querySelectorAll('.panel .body')].filter(b => b.scrollHeight > b.clientHeight + 2 && b.parentElement.id !== 'reports').map(b => b.parentElement.id));
            if (over.length) overflow.push({step: i, phase, over});
            if (['card', 'pause', 'picked', 'result'].includes(phase) || i === 2) { await page.screenshot({path: resolve(dir, `step-${String(i).padStart(2, '0')}-${phase}.png`)}); stills++; }
        }
        console.log(JSON.stringify({steps, frames: frames.length, stills, overflow, errors}));
        await page.close();
        if (process.argv.includes('--video')) {
            // One still per step, each held for the time the page would dwell on it, joined by the system ffmpeg.
            // (Playwright's own recorder needs a separate ffmpeg download, which this avoids.)
            const DWELL = {open: 2.6, run: 1.5, pause: 6.5, picked: 2.6, result: 9, card: 4.2};
            const film = resolve(dir, 'film'); fs.rmSync(film, {recursive: true, force: true}); fs.mkdirSync(film);
            const shot = await browser.newPage({viewport: {width: 1920, height: 1080}});
            shot.on('pageerror', e => errors.push(e.message));
            let list = '', last = '', total = 0;
            for (let i = 0; i < steps; i++) {
                await shot.goto(`${url}?at=${i}`);
                // Lines up to this step read as settled; the newest one is marked by the scene's own emphasis.
                const phase = await shot.evaluate(() => document.body.dataset.phase);
                last = resolve(film, `${String(i).padStart(3, '0')}.png`);
                await shot.screenshot({path: last});
                list += `file '${last}'\nduration ${DWELL[phase]}\n`; total += DWELL[phase];
            }
            fs.writeFileSync(resolve(film, 'list.txt'), `${list}file '${last}'\n`);
            const target = resolve(dir, 'playthrough.mp4');
            require('node:child_process').execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', resolve(film, 'list.txt'),
                '-vf', 'fps=10,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-movflags', '+faststart', target]);
            console.log(JSON.stringify({video: target, seconds: Math.round(total), errors}));
        }
    } finally { await browser.close(); }
    if (errors.length) process.exitCode = 1;
})();
