// Cheats page and Changes page. Both read the same routes an agent reads: /cheats, /cheats/rows (at most 100 per page) and /changes.
// The list is the deduped catalogue (one row per CTC id). Its status is shown together with the catalogue's own words and the runtime
// evidence found in src/, as three separate fields, so "implemented" is never read off a doc alone. The Candidates tab is the same list
// with status=candidate: cheat ideas the absorption sweep found in docs that the catalogue does not list. Nothing here writes anything.
import {element as el} from '/canvas.mjs';

const PAGE = 50;
const n = v => Number(v).toLocaleString('en-US');
const get = async url => {const r = await fetch(url); if (!r.ok) throw Error(await r.text() || r.statusText); return r.json();};
const STATUSES = [['', 'All'], ['proposal', 'Proposal'], ['working-default', 'Working default'], ['implemented', 'Implemented']];
const KIND_LABEL = {'catalogue-source': 'Catalogue source', 'library-family': 'Library family', 'cosmology-placement': 'Cosmology placement', 'world-variant': 'By world', 'scenario-lever': 'Scenario lever'};

// Same tokens as codex-views (already in canvas.css); nothing new.
const CSS = `
.cheats{--canvas-ink:#e3e5df;--canvas-muted:#b0b9b2;--canvas-border:#4b5350;color:var(--canvas-ink);margin-top:.65rem;display:grid;gap:.8rem}
.cheats small{color:var(--canvas-muted)}
.cheats-head{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}
.cheats-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:.8rem;align-items:start}
@media(max-width:1000px){.cheats-body{grid-template-columns:minmax(0,1fr)}}
.cheats-col{border:1px solid var(--canvas-border);background:#141615;padding:.6rem;min-width:0;max-height:75vh;overflow:auto}
.cheats-col h3{margin:.1rem 0 .5rem;font-size:1rem}
.cheats-rows{list-style:none;margin:0;padding:0}.cheats-rows li{margin:0}
.cheats-rows button{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;width:100%;text-align:left;margin:.15rem 0;background:#202422;color:inherit;border:1px solid var(--canvas-border)}
.cheats-rows button[aria-pressed=true]{outline:2px solid #e2f1bd;outline-offset:1px}.cheats-rows span{overflow-wrap:anywhere}
.cheats-tools{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem}.cheats-since input{flex:0 1 28rem;width:auto;max-width:100%}.cheats-commits details{display:inline;margin:0 0 0 .4rem}.cheats-commits details[open]{display:block}.cheats-tools input{flex:1 1 9rem;width:auto}
.cheats-pager{display:flex;gap:.5rem;align-items:center;margin-top:.5rem}
.cheats-detail dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:.3rem .8rem;margin:.4rem 0}.cheats-detail dd{margin:0;overflow-wrap:anywhere;color:var(--canvas-ink);font-weight:400}
.cheats-col.cheats-detail{max-height:none;overflow:visible}
.cheats-detail h3{margin:1.1rem 0 .35rem}.cheats-detail h4{margin:.7rem 0 .2rem}.cheats-detail dd p{margin:0 0 .2rem}.cheats-detail dd{min-width:0}
.cheats-detail dt{color:var(--canvas-muted)}.cheats-detail ul{margin:.2rem 0;padding-left:1.1rem}.cheats-detail code{overflow-wrap:anywhere}
.cheats-missing{color:var(--canvas-muted);font-style:italic}
.cheats table{border-collapse:collapse;width:100%}.cheats td,.cheats th{border:1px solid var(--canvas-border);padding:.25rem .5rem;text-align:left;vertical-align:top;overflow-wrap:anywhere}
.cheats td.num{text-align:right;font-variant-numeric:tabular-nums}`;
function style() {
    if (document.getElementById('cheats-style')) return;
    const s = el('style', CSS); s.id = 'cheats-style'; document.head.append(s);
}
const missing = (t = 'not recorded') => el('span', t, 'cheats-missing');
const dl = pairs => {
    const d = el('dl');
    for (const [k, v] of pairs) {d.append(el('dt', k)); const dd = el('dd'); if (v instanceof Node) dd.append(v); else if (v == null || v === '' || (Array.isArray(v) && !v.length)) dd.append(missing()); else dd.textContent = Array.isArray(v) ? v.join(', ') : v; d.append(dd);}
    return d;
};
const where = l => `${l.link ?? l.file}${l.line ? ':' + l.line : ''}`;

export function statusLine(s) {
    const b = s.counts.byStatus;
    return `${n(s.counts.cheats)} cheats · ${n(s.counts.variations)} variations · ${n(s.counts.withDefinition)} with a definition in src · ${n(b.implemented)} implemented · ${n(b['working-default'])} working default · ${n(b.proposal)} proposal · ${n(s.counts.candidates)} candidates`;
}

function showCatalogue(host, r) {
    host.replaceChildren(); host.dataset.key = r.key;
    host.append(el('strong', `${r.id} · ${r.name}`));
    const ev = r.runtime;
    const runtime = el('div');
    if (ev.definition) runtime.append(el('p', `Definition: ${ev.definition.id} in ${ev.definition.file}`));
    for (const c of ev.cards) runtime.append(el('p', `Named in ${c.file}: ${c.id}`));
    for (const c of ev.power) runtime.append(el('p', `Found in ${c.file}: ${c.id}`));
    if (ev.unverifiedIds.length) runtime.append(el('p', `Named by the catalogue, not found as a definition or card: ${ev.unverifiedIds.join(', ')}`));
    if (!runtime.childNodes.length) runtime.append(missing('no runtime id named or found'));
    host.append(dl([
        ['Status', r.status], ['Catalogue says', r.docStatus], ['Runtime evidence', runtime],
        ['Family', r.family ? `${r.family.code}. ${r.family.title}` : null], ['What it does', r.what], ['Backing', r.backing],
        ['Worlds and sources', r.worlds], ['Engine hooks', r.hooks], ['Usual limits', r.limits],
    ]));
    host.append(el('h3', 'Rule references'));
    const rules = r.rules.cht.map(x => `${x.code}${x.text ? ': ' + x.text : ''} (${x.how})`).concat(r.rules.other);
    if (rules.length) {const ul = el('ul'); for (const x of rules) ul.append(el('li', x)); host.append(ul);} else host.append(missing());
    host.append(el('h3', `Variations · ${n(r.variations.length)}`));
    if (!r.variations.length) host.append(missing('none found'));
    for (const kind of Object.keys(KIND_LABEL)) {
        const list = r.variations.filter(v => v.kind === kind); if (!list.length) continue;
        host.append(el('h4', `${KIND_LABEL[kind]} · ${n(list.length)}`));
        const ul = el('ul');
        for (const v of list) {
            const li = el('li', `${v.name}${v.world ? ' (' + v.world + ')' : ''} `);
            li.append(el('code', where(v)), el('small', v.match === 'inferred' ? ` · inferred match ${v.score}` : v.match === 'code' ? ' · names this CTC' : v.anchorFound === false ? ' · anchor not found' : ''));
            ul.append(li);
        }
        host.append(ul);
    }
    host.append(el('h3', 'Catalogue row'), el('p', `${r.locator.file}:${r.locator.line}`), el('p', r.source.text));
}
function showCandidate(host, r) {
    host.replaceChildren(); host.dataset.key = r.key;
    host.append(el('strong', `${r.code ? r.code + ' · ' : ''}${r.name}`));
    host.append(dl([
        ['Status', 'candidate (not in the catalogue)'], ['Found by', r.detector === 'coded' ? 'a coded entry that says cheat' : 'a table with a Cheat column'],
        ['Where', where(r.locator)], ['Heading', r.locator.heading], ['Also in', r.alsoAt.length ? r.alsoAt.map(where).join('; ') : null], ['Docs carrying it', n(r.docsCount)],
        ['Worlds', r.worlds], ['Closest catalogue row', r.resembles ? `${r.resembles.id} ${r.resembles.name} (inferred, overlap ${r.resembles.score})` : null],
    ]));
    host.append(el('h3', 'Row text'), el('p', r.excerpt));
}

export async function cheatsView({main, tab = 'list', focus = null, go}) {
    style();
    main.replaceChildren();
    const root = el('section', null, 'cheats'); root.setAttribute('aria-label', 'Cheat log');
    main.append(root);
    const loading = el('p', 'Loading the cheat log…', 'cheats-missing'); root.append(loading);
    let sum;
    try {sum = await get('/cheats');} catch (e) {loading.replaceWith(el('p', 'The cheat log is not available: ' + e.message)); return;}
    loading.remove();
    const candidates = tab === 'candidates';
    const view = {status: candidates ? 'candidate' : '', world: '', q: focus || '', offset: 0, selected: null};
    const head = el('div', null, 'cheats-head');
    head.append(el('strong', candidates ? `${n(sum.counts.candidates)} candidates: cheat ideas found in docs that the catalogue does not list yet` : statusLine(sum)));
    const sweep = sum.sweep;
    const stamp = el('small', `Absorption sweep: ${n(sweep.docsScanned)} docs mention cheats, ${n(sweep.tables)} tables read, ${n(sweep.namedRows)} named rows, ${n(sweep.codedRows)} coded rows · input ${sum.builtFrom?.hash ?? 'unknown'}${sum.unlinkedDefinitions.length ? ' · definitions no row names: ' + sum.unlinkedDefinitions.join(', ') : ''}`);

    const listCol = el('div', null, 'cheats-col'), detailCol = el('div', null, 'cheats-col cheats-detail');
    const tools = el('div', null, 'cheats-tools'), search = el('input'), world = el('input'), count = el('small'), list = el('ul', null, 'cheats-rows'), pager = el('div', null, 'cheats-pager');
    search.type = 'search'; search.placeholder = 'Search name, id, text'; search.setAttribute('aria-label', 'Search cheats'); search.value = view.q;
    world.type = 'search'; world.placeholder = 'World'; world.setAttribute('aria-label', 'Filter by world'); world.setAttribute('list', 'cheats-worlds');
    const dlist = el('datalist'); dlist.id = 'cheats-worlds';
    for (const w of sum.worlds) {const o = el('option'); o.value = w.world; dlist.append(o);}
    tools.append(search, world, dlist);
    const statusBar = el('div', null, 'cheats-tools');
    if (!candidates) for (const [value, label] of STATUSES) {
        const b = el('button', label); b.type = 'button'; b.dataset.status = value; b.setAttribute('aria-pressed', String(value === view.status));
        b.onclick = () => {view.status = value; view.offset = 0; load();}; statusBar.append(b);
    }
    listCol.append(el('h3', candidates ? `Candidates · ${n(sum.counts.candidates)}` : `Cheats · ${n(sum.counts.cheats)}`), tools, statusBar, count, list, pager);
    const detailHost = el('div'); detailCol.append(el('h3', 'Detail'), detailHost);
    detailHost.append(el('p', candidates ? 'Choose a candidate to see where it was found.' : 'Choose a cheat to see every variation and its source.', 'cheats-missing'));

    let token = 0;
    async function load() {
        const mine = ++token;
        for (const b of statusBar.children) b.setAttribute('aria-pressed', String(b.dataset.status === view.status));
        const params = new URLSearchParams({offset: view.offset, limit: PAGE, status: view.status, q: view.q, world: view.world});
        let page;
        try {page = await get('/cheats/rows?' + params);} catch (e) {if (mine === token) count.textContent = 'Rows could not be read: ' + e.message; return;}
        if (mine !== token) return;
        list.replaceChildren();
        const end = page.offset + page.rows.length;
        count.textContent = page.total ? `${n(page.offset + 1)}-${n(end)} of ${n(page.total)} matching` : 'Nothing matches.';
        for (const r of page.rows) {
            const li = el('li'), b = el('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(r.key === view.selected));
            b.append(el('span', r.kind === 'candidate' ? `${r.code ? r.code + ' ' : ''}${r.name}` : `${r.id} ${r.name}`),
                el('small', r.kind === 'candidate' ? `in ${n(r.docsCount)} doc${r.docsCount === 1 ? '' : 's'}` : r.status));
            const open = () => {view.selected = r.key; for (const x of list.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b)); (r.kind === 'candidate' ? showCandidate : showCatalogue)(detailHost, r);};
            b.onclick = open; li.append(b); list.append(li);
            if (focus && r.id === focus && view.selected !== r.key) open();
        }
        pager.replaceChildren();
        const prev = el('button', 'Previous'), next = el('button', 'Next'); prev.type = next.type = 'button';
        prev.disabled = page.offset === 0; next.disabled = end >= page.total;
        prev.onclick = () => {view.offset = Math.max(0, page.offset - PAGE); load();}; next.onclick = () => {view.offset = end; load();};
        pager.append(prev, next);
    }
    let timer; const later = () => {clearTimeout(timer); timer = setTimeout(() => {view.q = search.value; view.world = world.value; view.offset = 0; load();}, 200);};
    search.oninput = later; world.oninput = later;
    root.append(head, stamp, el('div', null, 'cheats-body'));
    root.lastChild.append(listCol, detailCol);
    await load();
}

// ---- Changes ----
export async function changesView({main}) {
    style();
    main.replaceChildren();
    const root = el('section', null, 'cheats'); root.setAttribute('aria-label', 'Atlas changes');
    main.append(root);
    const bar = el('div', null, 'cheats-tools cheats-since'), input = el('input'), go = el('button', 'Show changes'), out = el('div');
    input.type = 'text'; input.placeholder = 'Since: ISO date or commit (empty = previous snapshot)'; input.setAttribute('aria-label', 'Since');
    go.type = 'button'; bar.append(input, go);
    root.append(bar, out);
    async function load() {
        out.replaceChildren(el('p', 'Loading changes…'));
        let d;
        try {d = await get('/changes' + (input.value.trim() ? '?since=' + encodeURIComponent(input.value.trim()) : ''));} catch (e) {out.replaceChildren(el('p', 'Changes could not be read: ' + e.message)); return;}
        out.replaceChildren();
        out.append(el('p', `Since ${d.since.label}. Head ${d.head}${d.builtAt ? ' · snapshot built ' + d.builtAt : ''}.`));
        if (d.note) out.append(el('p', d.note, 'cheats-missing'));
        if (d.deltas == null && !d.note) out.append(missing('Count changes appear after the next snapshot build; this one has no earlier snapshot to compare with.'));
        else out.append(el('h3', 'Count changes'));
        if (d.deltas == null) {/* nothing to compare yet */}
        else if (!d.deltas.length) out.append(missing('No count moved between the previous snapshot and this one.'));
        else {
            const t = el('table'), h = el('tr'); for (const c of ['Count', 'From', 'To', 'Change']) h.append(el('th', c)); t.append(h);
            for (const x of d.deltas.slice(0, 60)) {const tr = el('tr'); tr.append(el('td', x.key), el('td', x.from == null ? 'new' : n(x.from), 'num'), el('td', x.to == null ? 'gone' : n(x.to), 'num'), el('td', (x.change > 0 ? '+' : '') + n(x.change), 'num')); t.append(tr);}
            out.append(t);
        }
        const label = Object.fromEntries(d.groups.map(g => [g.id, g.label]));
        out.append(el('h3', `Commits · ${n(d.commits.length)}`));
        if (!d.commits.length) out.append(missing('No commit touched these inputs.'));
        const ul = el('ul', null, 'cheats-commits');
        for (const c of d.commits) {
            const li = el('li', `${c.hash.slice(0, 9)} ${c.date.slice(0, 10)} ${c.subject} `);
            li.append(el('small', `· ${c.groups.map(g => label[g]).join(', ')}`));
            const det = el('details'); det.append(el('summary', `Files (${n(c.files.length)})`)); const fl = el('ul'); for (const f of c.files) fl.append(el('li', f)); det.append(fl); li.append(det); ul.append(li);
        }
        out.append(ul, el('h3', `Uncommitted in these inputs · ${n(d.working.length)}`));
        if (!d.working.length) out.append(missing('Clean.'));
        const wl = el('ul'); for (const w of d.working) wl.append(el('li', `${w.status} ${w.path} · ${w.groups.map(g => label[g]).join(', ')}`)); out.append(wl);
    }
    go.onclick = load; input.onkeydown = e => {if (e.key === 'Enter') load();};
    await load();
}
