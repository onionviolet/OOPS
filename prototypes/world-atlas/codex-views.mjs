// Codex page: one coverage ledger as a coverage bar, a blocker list and a searchable, paged row list with a detail panel.
// Data comes from /codex/<ledger> (aggregates) and /codex/<ledger>/rows (at most 100 rows per page, C2); the ledger text
// never rides in /data (C1). Row keys are `<ledger>:<id>`. The ladder rungs are shown as separate fields and a rung the
// ledger does not record reads "not recorded here", never a guess from another rung (D1).
import {element as el} from '/canvas.mjs';

const PAGE = 50; // mounted rows per page; the server caps at 100
const n = v => Number(v).toLocaleString('en-US');
const FAMILY_LABEL = {runs: 'run', expressed: 'expressed', catalogued: 'catalogued', blocked: 'blocked', notAThing: 'not a thing'};
const FAMILIES = Object.keys(FAMILY_LABEL);
const get = async url => {const r = await fetch(url); if (!r.ok) throw Error(await r.text() || r.statusText); return r.json();};

// Colours already in canvas.css (.box-canvas variables, .canvas-box states); nothing new. State is also written in text.
const CSS = `
.codex{--canvas-ink:#e3e5df;--canvas-muted:#b0b9b2;--canvas-border:#4b5350;color:var(--canvas-ink);margin-top:.65rem;display:grid;gap:.8rem}
.codex small{color:var(--canvas-muted)}
.codex-head{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}.codex-head select{max-width:100%}
.codex-bar{display:flex;height:1.4rem;border:1px solid var(--canvas-border);background:#202422}
.codex-bar i{display:block;min-width:2px}.codex-bar i[data-f=runs]{background:#2a6139}.codex-bar i[data-f=expressed]{background:#ace79e}.codex-bar i[data-f=catalogued]{background:#3b463d}.codex-bar i[data-f=blocked]{background:#d9ad89}.codex-bar i[data-f=notAThing]{background:#141615}
.codex-legend{display:flex;gap:.3rem 1rem;flex-wrap:wrap;margin:0;padding:0;list-style:none}.codex-legend li{margin:0}.codex-legend b{font-variant-numeric:tabular-nums}
.codex-body{display:grid;grid-template-columns:minmax(14rem,1fr) minmax(0,2fr) minmax(16rem,1fr);gap:.8rem;align-items:start}
@media(max-width:1000px){.codex-body{grid-template-columns:minmax(0,1fr)}}
.codex-col{border:1px solid var(--canvas-border);background:#141615;padding:.6rem;min-width:0;max-height:70vh;overflow:auto}
.codex-col h3{margin:.1rem 0 .5rem;font-size:1rem}
.codex-blockers,.codex-rows{list-style:none;margin:0;padding:0}.codex-blockers li,.codex-rows li{margin:0}
.codex-blockers button,.codex-rows button{display:flex;gap:.5rem;justify-content:space-between;width:100%;text-align:left;margin:.15rem 0;background:#202422;color:inherit;border:1px solid var(--canvas-border)}
.codex-blockers button[aria-pressed=true],.codex-rows button[aria-pressed=true]{outline:2px solid #e2f1bd;outline-offset:1px}
.codex-rows button{display:grid;grid-template-columns:minmax(0,1fr) auto}.codex-rows span{overflow-wrap:anywhere}
.codex-tools{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem}.codex-tools input{flex:1 1 10rem;width:auto}
.codex-pager{display:flex;gap:.5rem;align-items:center;margin-top:.5rem}
.codex-detail dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:.3rem .8rem;margin:.4rem 0}.codex-detail dd{margin:0;overflow-wrap:anywhere;color:var(--canvas-ink);font-weight:400}
.codex-detail dt{color:var(--canvas-muted)}.codex-detail ul{margin:.2rem 0;padding-left:1.1rem}
.codex-missing{color:var(--canvas-muted);font-style:italic}`;

function style() {
    if (document.getElementById('codex-style')) return;
    const s = el('style', CSS); s.id = 'codex-style'; document.head.append(s);
}

export function coverageLine(a) {
    // "16 of 1,466 run": over every row, with not-a-thing named so the denominator is honest.
    return `${n(a.counts.runs)} of ${n(a.rows)} run · ${n(a.counts.expressed)} expressed · ${n(a.counts.blocked)} blocked · ${n(a.counts.notAThing)} not a thing`;
}

export async function codexView({main, data, controls, ledger = 'gu_kinds', go}) {
    style();
    main.replaceChildren();
    const root = el('section', null, 'codex'), body = el('div', null, 'codex-body');
    root.setAttribute('aria-label', 'Coverage codex');
    main.append(root);
    let list, sum;
    try {list = (await get('/codex')).ledgers;} catch (e) {root.append(el('p', 'The codex is not available: ' + e.message)); return;}
    if (!list.some(l => l.ledger === ledger)) ledger = list[0]?.ledger;
    try {sum = await get('/codex/' + ledger);} catch (e) {root.append(el('p', 'This ledger could not be read: ' + e.message)); return;}

    // Ledger picker, coverage bar, legend.
    const head = el('div', null, 'codex-head'), pick = el('select'), label = el('label', 'Ledger ');
    pick.setAttribute('aria-label', 'Ledger');
    for (const l of list) {const o = el('option', `${l.ledger} (${n(l.rows)})`); o.value = l.ledger; o.selected = l.ledger === ledger; pick.append(o);}
    pick.onchange = () => go('codex/' + pick.value);
    label.append(pick);
    head.append(label, el('strong', coverageLine(sum)));
    const bar = el('div', null, 'codex-bar');
    bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', coverageLine(sum));
    const legend = el('ul', null, 'codex-legend');
    for (const f of FAMILIES) {
        const c = sum.counts[f];
        if (c) {const seg = el('i'); seg.dataset.f = f; seg.style.width = (100 * c / sum.rows) + '%'; seg.title = `${FAMILY_LABEL[f]}: ${n(c)}`; bar.append(seg);}
        const li = el('li'); li.append(el('b', n(c) + ' '), document.createTextNode(FAMILY_LABEL[f])); legend.append(li);
    }
    const stamp = el('small', `${n(sum.things)} things (rows that are not "not a thing") · input ${sum.builtFrom?.hash ?? 'unknown'}${sum.invalid ? ' · ' + sum.invalid + ' rows with no state' : ''}`);

    // Blockers: sorted by rows unblocked. Choosing one filters the row list to that slug.
    const blockCol = el('div', null, 'codex-col'), rowCol = el('div', null, 'codex-col'), detailCol = el('div', null, 'codex-col codex-detail');
    blockCol.append(el('h3', `Blockers · ${n(sum.blockers.length)}`));
    const blockList = el('ul', null, 'codex-blockers');
    blockCol.append(blockList);
    const detailHost = el('div'); detailCol.append(el('h3', 'Row detail'), detailHost);
    detailHost.append(el('p', 'Choose a row to see its ladder fields and source.', 'codex-missing'));

    const view = {state: '', q: '', offset: 0, selected: null};
    const search = el('input'), clear = el('button', 'All states'), count = el('small'), rowList = el('ul', null, 'codex-rows'), pager = el('div', null, 'codex-pager');
    search.type = 'search'; search.placeholder = 'Search id, label, mechanism, source'; search.setAttribute('aria-label', 'Search rows');
    clear.type = 'button';
    const tools = el('div', null, 'codex-tools'); tools.append(search, clear);
    rowCol.append(el('h3', 'Rows'), tools, count, rowList, pager);

    const blockButtons = new Map();
    for (const b of sum.blockers) {
        const btn = el('button'); btn.type = 'button'; btn.setAttribute('aria-pressed', 'false');
        const also = b.alsoInCount ? ` · also in ${n(b.alsoInCount)} ledger${b.alsoInCount > 1 ? 's' : ''} (${n(b.alsoRows)} rows)` : '';
        btn.title = (b.alsoIn.length ? 'Also in: ' + b.alsoIn.map(o => `${o.ledger} ${n(o.rows)}`).join(', ') : 'Only in this ledger') + '\nNext: ' + b.nextAction.text + ' Owner: ' + b.nextAction.owner + (b.nextAction.gated ? ' (spend gated by Weibao)' : '');
        btn.append(el('span', b.slug), el('b', n(b.rows)));
        btn.setAttribute('aria-label', `${b.slug}, ${n(b.rows)} rows${also}`);
        btn.onclick = () => {view.state = view.state === b.slug ? '' : b.slug; view.offset = 0; load();};
        const li = el('li'); li.append(btn, el('small', (also.replace(/^ · /, '') || 'only in this ledger') + ' · next: ' + b.nextAction.kind.replace('-', ' ') + (b.nextAction.gated ? ' (gated)' : '')));
        blockList.append(li); blockButtons.set(b.slug, btn);
    }
    if (!sum.blockers.length) blockList.append(el('li', 'No blocked rows in this ledger.'));

    let token = 0;
    async function load() {
        const mine = ++token;
        for (const [slug, b] of blockButtons) b.setAttribute('aria-pressed', String(slug === view.state));
        clear.hidden = !view.state;
        clear.textContent = view.state ? 'Clear filter: ' + view.state : 'All states';
        const params = new URLSearchParams({offset: view.offset, limit: PAGE, state: view.state, q: view.q});
        let page;
        try {page = await get(`/codex/${ledger}/rows?${params}`);} catch (e) {if (mine === token) count.textContent = 'Rows could not be read: ' + e.message; return;}
        if (mine !== token) return;
        rowList.replaceChildren();
        const end = page.offset + page.rows.length;
        count.textContent = page.total ? `${n(page.offset + 1)}-${n(end)} of ${n(page.total)} matching rows` : 'No rows match.';
        for (const r of page.rows) {
            const li = el('li'), b = el('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(r.key === view.selected));
            b.append(el('span', r.label ? `${r.label} (${r.id})` : r.id), el('small', r.state));
            b.onclick = () => {view.selected = r.key; for (const x of rowList.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b)); show(r);};
            li.append(b); rowList.append(li);
        }
        pager.replaceChildren();
        const prev = el('button', 'Previous'), next = el('button', 'Next');
        prev.type = next.type = 'button';
        prev.disabled = page.offset === 0; next.disabled = end >= page.total;
        prev.onclick = () => {view.offset = Math.max(0, page.offset - PAGE); load();};
        next.onclick = () => {view.offset = end; load();};
        pager.append(prev, next);
    }
    clear.onclick = () => {view.state = ''; view.offset = 0; load();};
    let timer; search.oninput = () => {clearTimeout(timer); timer = setTimeout(() => {view.q = search.value; view.offset = 0; load();}, 200);};

    function show(r) {
        detailHost.replaceChildren(); detailHost.dataset.key = r.key;
        const missing = () => el('span', 'not recorded here', 'codex-missing');
        const dl = el('dl');
        const add = (k, v) => {dl.append(el('dt', k)); const dd = el('dd'); if (v instanceof Node) dd.append(v); else if (v == null || v === '') dd.append(missing()); else dd.textContent = v; dl.append(dd);};
        detailHost.append(el('strong', r.key));
        if (r.label) detailHost.append(el('p', r.label));
        add('State', r.state || null);
        add('Blocker', r.blocker);
        add('Mechanisms', r.mechanisms.join(', ') || null);
        add('Test', r.test);
        add('Typed (old label)', r.typed);
        detailHost.append(dl, el('h3', 'Evidence ladder'));
        const lad = el('dl');
        const rung = (k, v) => {lad.append(el('dt', k)); const dd = el('dd'); if (v == null) dd.append(missing()); else dd.textContent = v; lad.append(dd);};
        rung('1 Case success (row state)', r.ladder.caseState);
        rung('   case reference', r.ladder.case ? `${r.ladder.case.module} · ${r.ladder.case.id}` : null);
        rung('2 Module reachability', r.ladder.moduleReachable);
        rung('3 Player-action proof', r.ladder.playerAction);
        rung('4 Persistence proof', r.ladder.persistence);
        detailHost.append(lad);
        detailHost.append(el('h3', 'Source locator'));
        if (r.locators.length) {const ul = el('ul'); for (const l of r.locators) ul.append(el('li', l)); detailHost.append(ul);} else detailHost.append(missing());
        if (r.derived) detailHost.append(el('h3', 'Derived'), el('pre', JSON.stringify(r.derived, null, 1)));
        if (r.note) detailHost.append(el('h3', 'Note'), el('p', r.note));
        const [ledger, ...idParts] = r.key.split(':'), id = idParts.join(':');
        // WA23: the move's recipe slots by variant. Unnamed slots stay open; order shows only when the source states it.
        if (ledger === 'gu_moves') {
            const slotHost = el('div');
            detailHost.append(el('h3', 'Recipe slots'), slotHost);
            fetch(`/codex/gu_moves/slots?id=${encodeURIComponent(id)}`).then(res => res.json()).then(s => {
                if (detailHost.dataset.key !== r.key) return;
                if (!s.variants?.length) {slotHost.append(el('p', 'No slot evidence for this move yet.', 'codex-missing')); return;}
                for (const v of s.variants) {
                    const d = el('details'); d.open = s.variants.length === 1;
                    d.append(el('summary', `${v.variant || 'main'} · ${v.slots.length} slots`));
                    const ul = el('ul');
                    for (const t of v.slots) {
                        const who = t.role === 'unnamed' ? `open slot (${t.name})` : `${t.role}: ${t.name}`;
                        const gu = t.gu ? ` → gu_kinds:${t.gu}` : '';
                        const order = t.orderStated ? ` · order ${t.order}` : ' · order not stated';
                        ul.append(el('li', `${who}${gu} · ${t.resolution} · ${t.tier} · ${t.locator}${order}`));
                    }
                    d.append(ul); slotHost.append(d);
                }
                slotHost.append(el('p', 'Slots are machine-extracted; most are unchecked. Use Check this passage for a second read.', 'codex-missing'));
            }).catch(e => slotHost.append(el('p', `Slots failed: ${e.message}`, 'codex-missing')));
        }
        // WA24: what the local text already says about this row, before anyone pays for a read. Text stays on this page.
        if (['gu_kinds', 'gu_moves'].includes(ledger)) {
            const out = el('div'), btn = el('button', 'Check this passage');
            btn.type = 'button';
            btn.onclick = async () => {
                btn.disabled = true; out.replaceChildren(el('p', 'Searching the local text…', 'codex-missing'));
                try {
                    const res = await fetch(`/codex/${ledger}/check-passage?id=${encodeURIComponent(id)}`);
                    const c = await res.json();
                    if (!res.ok) throw new Error(c.error || res.statusText);
                    out.replaceChildren();
                    const cd = el('dl'), put = (k, v) => {cd.append(el('dt', k), el('dd', v == null ? 'not recorded' : String(v)));};
                    put('Terms', (c.terms || []).join(', '));
                    put('Chapters searched', c.chapterRange ? `${c.chapterRange[0]}–${c.chapterRange[1]}` : 'whole text');
                    put('Counts', Object.entries(c.counts || {}).map(([k, v]) => `${k} ${v}`).join(' · '));
                    // Tier records are objects; show their fields as words, a nested locator as itself, never raw JSON.
                    const fields = o => o == null ? null : Object.entries(o).filter(([, v]) => v != null && v !== '' && !(typeof v === 'object' && !Object.keys(v).length))
                        .map(([k, v]) => `${k} ${typeof v === 'object' ? (v.locator ?? v.food ?? Object.values(v).join(' / ')) : v}`).join(' · ');
                    put('Chapter tier', fields(c.evidence?.chapterTier));
                    put('Wiki tier', fields(c.evidence?.wikiTier));
                    const fr = c.evidence?.fulltextRanks;
                    put('Full-text ranks', fr ? `rank ${fr.rank ?? '?'} by ${fr.basis ?? 'unstated basis'} of ${fr.mentions ?? '?'} mentions${fr.wikiRank != null ? `; wiki says ${fr.wikiRank}` : ''}` : null);
                    out.append(cd);
                    if (fr?.at?.length) {
                        const t = el('table'), head = el('tr');
                        for (const h of ['Locator', 'Rank', 'Pattern']) head.append(el('th', h));
                        t.append(head);
                        for (const a of fr.at.slice(0, 12)) {const tr = el('tr'); for (const v of [a.locator, a.rank, a.pattern]) tr.append(el('td', String(v ?? ''))); t.append(tr);}
                        out.append(t);
                    }
                    out.append(el('p', 'Tags are a heuristic for a second reader: unverified.', 'codex-missing'));
                    const ul = el('ul');
                    for (const m of (c.matches || []).slice(0, 8)) ul.append(el('li', `${m.locator} · ${m.tag} (unverified) · ${m.term}: ${m.text}`));
                    if (ul.childNodes.length) out.append(ul); else out.append(el('p', 'No matches in the local text.', 'codex-missing'));
                } catch (e) {out.replaceChildren(el('p', `Check failed: ${e.message}`, 'codex-missing'));}
                btn.disabled = false;
                out.scrollIntoView?.({block: 'start', behavior: 'smooth'});
            };
            detailHost.append(el('h3', 'Check this passage'), btn, out);
        }
    }

    body.append(blockCol, rowCol, detailCol);
    for (const a of sum.actions) stamp.append(document.createTextNode(` · ${n(a.rows)} expressed: ${a.text}`));
    root.append(head, bar, legend, stamp, body);
    await load();
}
