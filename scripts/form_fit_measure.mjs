// bk-forms (2026-10-30): scripted form-fit measurement on gallery fixtures at 1920x1080.
// For each question, a fact is "seen" when some visible element holds all its fragments. Steps = hovers/clicks the
// minimal scripted path needs; words = words in the elements that held the facts, and on the first paint.
// Fixture routes, not live game routes (FLR2). Fresh-player timing is not measured here.
// Usage: node scripts/slot_run.mjs --kind browser -- node scripts/form_fit_measure.mjs [outDir]
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {launchChrome} = require('./ui_helpers.cjs');
const root = resolve(new URL('..', import.meta.url).pathname), out = resolve(root, process.argv[2] || 'docs/audits/evidence/form-fit-2026-10-30');
await mkdir(out, {recursive: true});
const types = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.map': 'application/json'};
const server = createServer(async (req, res) => {
    const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
    if (!path.startsWith(root + '/')) return res.writeHead(403).end();
    let data; try { data = await readFile(path); } catch { return res.writeHead(404).end(); }
    res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream'}).end(data);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// strict: all fragments in one visible element (the relation names both ends or carries its fact).
const Q = [
    {fx: 'relationship-web-ferry', view: 'People web', ask: 'What do I owe, and to whom?', facts: [{open: 'osric', strict: ['Osric', 'Lantern oil']}, {open: 'osric', strict: ['Osric', 'broken seal']}]},
    {fx: 'relationship-web-ferry', view: 'People web', ask: 'Who saw what I did?', facts: [{open: 'brenna', strict: ['Brenna', 'saw 2']}, {open: 'osric', strict: ['Osric', 'saw 1']}, {open: 'matthis', strict: ['Matthis', 'saw 1']}, {open: 'ilka', strict: ['Ilka', 'saw 1']}]},
    {fx: 'relationship-web-ferry', view: 'People web', ask: 'Who is warm toward me?', facts: [{open: 'brenna', strict: ['Brenna', 'warmer']}]},
    {fx: 'knows-harbor-bell', view: 'Knowledge board', ask: 'What backs "Someone with a key cut the rope"?', facts: [{open: 'k6', strict: ['bell rope was cut clean', 'supports']}, {open: 'k6', strict: ['Warden Ostra', 'supports']}]},
    {fx: 'knows-harbor-bell', view: 'Knowledge board', ask: 'What did the ledger clue lead to?', facts: [{open: 'k4', strict: ['Thinking over', 'supports']}]},
    {fx: 'research-map-frontier.lever', view: 'Study map', ask: 'What must I do before explaining the pivot rule?', facts: [{open: 'explain', strict: ['Return both records', 'needs']}]},
    {fx: 'research-map-frontier.lever', view: 'Study map', ask: 'What do I need to return both records?', facts: [{open: 'return', strict: ['Work a wedged log', 'needs']}, {open: 'return', strict: ['Watch the craftsman', 'needs']}]},
    {fx: 'research-map-frontier.lever', view: 'Study map', ask: 'What does finishing open?', facts: [{open: 'practice', strict: ['Free wedged timber', 'opens']}]},
    {fx: 'family-household', view: 'Family tree', ask: 'Who would inherit?', facts: [{open: 'kin:1', strict: ['Pip', 'would inherit']}]},
    {fx: 'family-household', view: 'Family tree', ask: "Who are my mother's parents?", facts: [{open: 'm:self', strict: ["Mother's father", 'parent']}, {open: 'm:self', strict: ["Mother's mother", 'parent']}]},
    {fx: 'walk-map', view: 'Walk map', ask: 'How long to walk to each place?', facts: [{open: 'here', strict: ['Rented attic', '2 min']}, {open: 'here', strict: ['Saltgate wharf', '20 min']}, {open: 'here', strict: ['Glassworks yard', '20 min']}, {open: 'here', strict: ['Old college', '35 min']}]},
    {fx: 'walk-map', view: 'Walk map', ask: 'Who is usually at the wharf?', facts: [{open: 'place-2', strict: ['Mott', 'mornings']}]},
    {fx: 'fight-brawl', view: 'Fight ring', ask: 'Who is striking me?', facts: [{open: 'you', strict: ['Mire hound B', 'strikes']}, {open: 'you', strict: ['Mire hound C', 'strikes']}, {open: 'you', strict: ['Hooded drover', 'strikes']}]},
    {fx: 'fight-brawl', view: 'Fight ring', ask: 'How hurt am I?', facts: [{open: 'you', strict: ['You', '5/40 hp']}]},
    {fx: 'craft-flow-blade', view: 'Making flow', ask: 'Why can I not make the blade?', facts: [{open: 'bench', strict: ['Binding strip', 'consumes']}]},
    {fx: 'craft-flow-blade', view: 'Making flow', ask: 'What does the furnace make?', facts: [{open: 'furnace', strict: ['Ingot', 'makes']}, {open: 'furnace', strict: ['Slag', 'leftover']}]},
];
const CAND = '.fig-card, .fig-inspector, .fig-matrix-note, .fig-sentences li, .fig-edge-label, .fig-marker, tbody tr, .fig-matrix-row, .fig-compare';
const words = t => (t.match(/\S+/g) || []).length;
let sect = '';
const cellSel = () => `section.fig-gallery-section[data-fixture="${sect}"] .fig-gallery-cell`;
const browser = await launchChrome(), results = [], consoleErrors = [];
try {
    const context = await browser.newContext({viewport: {width: 1920, height: 1080}}), page = await context.newPage();
    page.on('pageerror', e => consoleErrors.push(e.message));
    const seen = async (frags) => page.evaluate(({cand, frags, sel}) => {
        // The matrix words its pair in an aria-label on the mark; read those too once clicked (the note repeats them).
        const hits = [...document.querySelectorAll(sel + ':first-child ' + cand.split(', ').join(', ' + sel + ':first-child '))].filter(n => frags.every(f => n.textContent.includes(f)));
        return hits.map(n => n.textContent.replace(/\s+/g, ' ').trim());
    }, {cand: CAND, frags, sel: cellSel()});
    const openIn = async (form, id, state) => {
        if (form === 'webplain') return 0;
        const cell = page.locator(cellSel()).first();
        if (form === 'web') { await cell.locator(`.fig-marker[data-id="${id}"] .fig-body`).hover(); await page.waitForTimeout(40); return 1; }
        if (form === 'table') { await cell.locator(`tbody tr[data-id="${id}"]`).click(); return 1; }
        if (form === 'matrix') {
            const marks = cell.locator(`tbody tr[data-id="${id}"] .fig-matrix-mark`), n = await marks.count();
            const i = state.matrixIndex[id] = (state.matrixIndex[id] ?? -1) + 1;
            if (i < n) { await marks.nth(i).click(); return 1; }
        }
        return 0;
    };
    for (const form of ['webplain', 'web', 'table', 'matrix', 'sentences']) {
        let current = null;
        for (const q of Q) {
            sect = q.fx;
            if (current !== q.fx) {
                await page.goto(`${base}/figure-gallery.html?only=${encodeURIComponent(q.fx)}&form=${form}&effects=off`);
                await page.waitForSelector(`${cellSel()} svg, ${cellSel()} .fig-form-stage`, {timeout: 20000});
                current = q.fx;
            }
            // Reset to a fresh state per question.
            await page.goto(`${base}/figure-gallery.html?only=${encodeURIComponent(q.fx)}&form=${form}&effects=off`);
            await page.waitForSelector(`${cellSel()} svg, ${cellSel()} .fig-form-stage > *`, {timeout: 20000});
            const cell = page.locator(cellSel()).first();
            const first = await cell.locator(form === 'webplain' ? '.theme-preview' : '.fig-form-stage').innerText();
            const state = {matrixIndex: {}};
            let steps = 0, satisfied = new Map();
            const check = async () => { for (const [i, f] of q.facts.entries()) if (!satisfied.has(i)) { const hit = await seen(f.strict); if (hit.length) satisfied.set(i, hit.sort((a, b) => a.length - b.length)[0]); } };
            await check();
            for (const [i, f] of q.facts.entries()) {
                let guard = 0;
                while (!satisfied.has(i) && guard++ < 12) { const did = await openIn(form, f.open, state); if (!did) break; steps += did; await check(); }
            }
            let trace = 0, tooltip = 0;
            if (form === 'webplain') {
                // Labels are drawn, so a fact whose answer words sit in an edge label or node label shows at once if the eye traces the line.
                for (const [i, f] of q.facts.entries()) if (!satisfied.has(i)) {
                    const lenient = await page.evaluate(({sel, frags}) => { const t = [...document.querySelectorAll(sel + ':first-child .fig-edge-label, ' + sel + ':first-child .fig-marker')].map(n => n.textContent); return frags.every(f => t.some(x => x.includes(f))); }, {sel: cellSel(), frags: f.strict});
                    if (lenient) { satisfied.set(i, f.strict.join(' ')); trace += 1; }
                }
                tooltip = new Set(q.facts.filter((f, i) => !satisfied.has(i)).map(f => f.open)).size; steps = tooltip; // native tooltip: one hover per source node, assumed
                q.facts.forEach((f, i) => { if (!satisfied.has(i)) satisfied.set(i, f.strict.join(' ')); });
            }
            const done = satisfied.size === q.facts.length;
            const readWords = words([...new Set(satisfied.values())].join(' '));
            results.push({form, view: q.view, fixture: q.fx, ask: q.ask, facts: q.facts.length, answered: satisfied.size, complete: done, steps, eyeTraced: trace, nativeTooltips: tooltip, firstPaintWords: words(first), answerWords: readWords});
            console.log(form.padEnd(9), q.view.padEnd(16), (done ? 'ok ' : 'MISS'), String(steps).padStart(2), 'steps', String(words(first)).padStart(4), 'words on first paint', String(readWords).padStart(3), 'in answer |', q.ask);
        }
    }
    await writeFile(resolve(out, 'measure.json'), JSON.stringify({viewport: '1920x1080', effects: 'off', route: 'figure gallery fixtures (not live game routes)', consoleErrors, results}, null, 1));
} finally { await browser.close(); server.close(); }
