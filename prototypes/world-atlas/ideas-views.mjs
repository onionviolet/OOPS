// Ideas page. It reads the same routes an agent reads: /ideas, /ideas/rows (at most 100 per page), /ideas/row, /ideas/families, /ideas/boards and
// /ideas/residue (contract at the top of ideas.mjs). Three lists share one detail pane: ideas (search and filters), boards (with residue counts) and
// the family tree (family > board). Status is the board's own word; "proposal (AD32)" means the board stated nothing. Nothing here writes anything.
import {element as el} from '/canvas.mjs';

const PAGE = 50;
const n = v => Number(v).toLocaleString('en-US');
const get = async url => {const r = await fetch(url); if (!r.ok) throw Error(await r.text() || r.statusText); return r.json();};
const STATUSES = [['', 'All'], ['proposal', 'Proposal'], ['sent', 'Sent'], ['decided', 'Decided'], ['accepted', 'Accepted'], ['built', 'Built'], ['retired', 'Retired'], ['superseded', 'Superseded'], ['working-default', 'Working default']];
const TABS = [['ideas', 'Ideas'], ['boards', 'Boards'], ['families', 'Family tree']];
const hash = {idea: id => 'ideas/' + encodeURIComponent(id), cheat: id => 'cheats/list/' + id, ledger: key => 'codex/' + key.split(':')[0], world: id => 'world/' + id};

// Same tokens as cheats-views and codex-views; nothing new.
const CSS = `
.ideas{--canvas-ink:#e3e5df;--canvas-muted:#b0b9b2;--canvas-border:#4b5350;color:var(--canvas-ink);margin-top:.65rem;display:grid;gap:.8rem}
.ideas small{color:var(--canvas-muted)}
.ideas-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:.8rem;align-items:start}
@media(max-width:1000px){.ideas-body{grid-template-columns:minmax(0,1fr)}}
.ideas-col{border:1px solid var(--canvas-border);background:#141615;padding:.6rem;min-width:0;max-height:75vh;overflow:auto}
.ideas-col h3{margin:.1rem 0 .5rem;font-size:1rem}
.ideas-rows{list-style:none;margin:0;padding:0}.ideas-rows li{margin:0}
.ideas-rows button,.ideas-link{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;width:100%;text-align:left;margin:.15rem 0;background:#202422;color:inherit;border:1px solid var(--canvas-border)}
.ideas-rows button[aria-pressed=true]{outline:2px solid #e2f1bd;outline-offset:1px}.ideas-rows span{overflow-wrap:anywhere}
.ideas-tools{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;align-items:center}.ideas-tools input[type=search]{flex:1 1 9rem;width:auto}
.ideas-pager{display:flex;gap:.5rem;align-items:center;margin-top:.5rem}
.ideas-detail dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:.3rem .8rem;margin:.4rem 0}.ideas-detail dd{margin:0;overflow-wrap:anywhere;color:var(--canvas-ink);font-weight:400}
.ideas-detail dt{color:var(--canvas-muted)}.ideas-detail ul{margin:.2rem 0;padding-left:1.1rem}.ideas-detail code{overflow-wrap:anywhere}
.ideas-chips{display:flex;gap:.35rem;flex-wrap:wrap}.ideas-chips button{width:auto;display:inline-block;margin:.1rem 0;background:#202422;color:inherit;border:1px solid var(--canvas-border)}
.ideas-missing{color:var(--canvas-muted);font-style:italic}
.ideas details{margin:.2rem 0}.ideas summary{cursor:pointer}
.ideas table{border-collapse:collapse;width:100%}.ideas td,.ideas th{border:1px solid var(--canvas-border);padding:.25rem .5rem;text-align:left;vertical-align:top;overflow-wrap:anywhere}`;
function style() {
    if (document.getElementById('ideas-style')) return;
    const s = el('style', CSS); s.id = 'ideas-style'; document.head.append(s);
}
const missing = (t = 'none recorded') => el('span', t, 'ideas-missing');
const dl = pairs => {
    const d = el('dl');
    for (const [k, v] of pairs) {d.append(el('dt', k)); const dd = el('dd'); if (v instanceof Node) dd.append(v); else if (v == null || v === '' || (Array.isArray(v) && !v.length)) dd.append(missing()); else dd.textContent = Array.isArray(v) ? v.join(', ') : v; d.append(dd);}
    return d;
};
const chip = (label, fn, title) => {const b = el('button', label); b.type = 'button'; if (title) b.title = title; b.onclick = fn; return b;};
const where = l => `${l.file}${l.line ? ':' + l.line : ''}`;
const crumb = r => r ? `${r.code ?? r.id} ${r.title}` : '';

export function statusLine(s) {
    const c = s.counts, st = c.byStatus;
    return `${n(c.ideas)} ideas on ${n(c.ideaBoards)} boards (${n(c.registeredBoards)} registered in the indexes) · ${n(c.families)} code families · ${n(c.collisions.families)} families with a collision · ${n(c.panels)} panels · ${n(c.residueLines)} residue lines · built ${n(st.built || 0)} · accepted ${n(st.accepted || 0)} · sent ${n(st.sent || 0)}`;
}

export async function ideasView({main, focus = null, go}) {
    style();
    main.replaceChildren();
    const root = el('section', null, 'ideas'); root.setAttribute('aria-label', 'Idea registry');
    main.append(root);
    let sum;
    const loading = el('p', 'Reading every ideaboard… the first load after a doc change takes about 15 seconds.', 'ideas-missing'); root.append(loading);
    try {sum = await get('/ideas');} catch (e) {loading.replaceWith(el('p', 'The idea registry is not available: ' + e.message)); return;}
    loading.remove();
    const view = {tab: 'ideas', q: '', board: '', family: '', status: '', kind: 'idea', links: '', showLocal: false, registeredOnly: true, offset: 0, selected: null, familyQ: ''};

    root.append(el('strong', statusLine(sum)));
    root.append(el('small', `Sweep: ${n(sum.sweep.docsScanned)} docs read, ${n(sum.sweep.docsCoded)} with coded ideas, ${n(sum.sweep.unboarded)} with fewer than three (not boards) · input ${sum.builtFrom?.hash ?? 'unknown'}. Status is the board's own word; "proposal (AD32)" means it stated none.`));

    const listCol = el('div', null, 'ideas-col'), detailCol = el('div', null, 'ideas-col ideas-detail');
    const tabs = el('div', null, 'ideas-tools'), tools = el('div', null, 'ideas-tools'), statusBar = el('div', null, 'ideas-tools'), count = el('small'), list = el('ul', null, 'ideas-rows'), pager = el('div', null, 'ideas-pager');
    const search = el('input'), local = el('input'), reg = el('input'), localLabel = el('label'), regLabel = el('label');
    search.type = 'search'; search.setAttribute('aria-label', 'Search ideas'); search.value = view.q;
    local.type = reg.type = 'checkbox'; reg.checked = true;
    localLabel.append(local, document.createTextNode(' Include single-letter codes (F1, T3: local to one doc)'));
    regLabel.append(reg, document.createTextNode(' Registered boards only'));
    const filters = el('div', null, 'ideas-chips');
    const detailHost = el('div'); detailCol.append(el('h3', 'Detail'), detailHost);
    detailHost.append(el('p', 'Choose an idea, board or family to see where it lives and what it links to.', 'ideas-missing'));
    listCol.append(tabs, tools, filters, statusBar, count, list, pager);
    for (const [value, label] of STATUSES) {const b = chip(label, () => {view.status = value; view.offset = 0; load();}); b.dataset.status = value; statusBar.append(b);}
    tools.append(search, localLabel, regLabel);

    let token = 0;
    function chips() {
        filters.replaceChildren();
        for (const [k, label] of [['board', 'board'], ['family', 'family'], ['links', 'links to']]) if (view[k]) filters.append(chip(`${label}: ${view[k]} ×`, () => {view[k] = ''; view.offset = 0; load();}, 'Clear this filter'));
    }
    function setTab(t) {view.tab = t; view.offset = 0; for (const b of tabs.children) b.setAttribute('aria-pressed', String(b.dataset.tab === t)); load();}
    for (const [id, label] of TABS) {const b = chip(label, () => setTab(id)); b.dataset.tab = id; tabs.append(b);}

    // ---- detail ----
    async function showIdea(id) {
        view.selected = id; detailHost.replaceChildren(el('p', 'Loading…', 'ideas-missing'));
        let d; try {d = await get('/ideas/row?id=' + encodeURIComponent(id));} catch (e) {detailHost.replaceChildren(el('p', 'Not found: ' + e.message)); return;}
        const r = d.row, host = detailHost; host.replaceChildren(); host.dataset.key = r.key;
        host.append(el('strong', `${r.code ? r.code + ' · ' : ''}${r.title}`));
        const parent = r.parent?.kind === 'idea' && d.parent ? chip(crumb(d.parent), () => go(hash.idea(d.parent.id))) : r.parent ? el('span', `round: ${r.parent.name}`) : null;
        host.append(dl([
            ['Id', r.id], ['Status', r.status ? `${r.statusLabel}${r.statusSource === 'heading' ? ' (from its section heading)' : ''}` : null], ['As the board wrote it', r.statusRaw],
            ['Board', r.kind === 'panel' ? r.boardTitle : chip(`${r.boardTitle} (${r.board})`, () => {view.board = r.board; view.offset = 0; setTab('ideas');}, 'Filter the list to this board')],
            ['Family', r.kind === 'panel' ? null : chip(r.family + (r.local ? ' (local)' : ''), () => {view.family = r.family; view.offset = 0; view.showLocal = view.showLocal || r.local; local.checked = view.showLocal; setTab('ideas');})],
            ['Source', `${where(r.locator)}${r.locator.heading ? ' · ' + r.locator.heading : ''}`], ['Format', r.format], ['Round or section', r.round], ['Parent', parent],
            ['Same code twice in this board', r.dupInBoard ? 'yes: check which is the definition' : null],
        ]));
        if (r.nextAction) host.append(el('h3', 'Next action'), el('p', `${r.nextAction.kind}${r.nextAction.gated ? ' (needs Weibao)' : ''} · owner ${r.nextAction.owner}`), el('p', r.nextAction.text));
        host.append(el('h3', `Children · ${n(d.children.length)}`));
        if (!d.children.length) host.append(missing('none'));
        const cl = el('ul'); for (const c of d.children.slice(0, 60)) {const li = el('li'); li.append(chip(crumb(c), () => go(hash.idea(c.id))), el('small', ` ${c.status}`)); cl.append(li);} host.append(cl);
        if (r.kind === 'panel') {
            host.append(el('h3', `Mentioned by · ${n(r.mentionedBy.length)}`));
            const ml = el('ul'); for (const id2 of r.mentionedBy.slice(0, 60)) {const li = el('li'); li.append(chip(id2, () => go(hash.idea(id2)))); ml.append(li);} host.append(r.mentionedBy.length ? ml : missing('no idea names it'));
        } else {
            const L = r.links; host.append(el('h3', 'Links'));
            const block = (label, nodes) => {host.append(el('h4', `${label} · ${n(nodes.length)}`)); if (!nodes.length) host.append(missing()); else {const u = el('ul'); for (const x of nodes) {const li = el('li'); li.append(x); u.append(li);} host.append(u);}};
            block('Other ideas', L.ideas.flatMap(i => i.ids.length ? i.ids.map(id2 => chip(`${i.code} → ${id2}${i.ambiguous ? ' (code exists on several boards)' : ''}`, () => go(hash.idea(id2)))) : [el('span', i.code)]));
            block('Rules (not ideas)', L.rules.map(x => el('span', `${x.code} · ${x.file}${x.line ? ':' + x.line : ' (owner file; code line not found)'}`)));
            block('Worlds', L.worlds.map(w => chip(w, () => go(hash.world(w)))));
            block('Ledger rows', L.ledgers.map(k => chip(k, () => go(hash.ledger(k)), 'Opens the ledger; the row id is shown here, the codex page takes no row focus')));
            block('Cheats', L.cheats.map(c => chip(c, () => go(hash.cheat(c)))));
            block('Source files', L.src.map(f => el('code', f)));
            block('Panels', L.panels.map(p => chip(p, () => go(hash.idea(p)))));
        }
        host.append(el('h3', `Mentioned by · ${n(d.linkedFromTotal)}`));
        if (!d.linkedFrom.length) host.append(missing('no row links here'));
        const fl = el('ul'); for (const x of d.linkedFrom) {const li = el('li'); li.append(chip(crumb(x), () => go(hash.idea(x.id))), el('small', ` ${x.board}`)); fl.append(li);} host.append(fl);
        if (d.linkedFromTotal > d.linkedFrom.length) host.append(chip(`Show all ${n(d.linkedFromTotal)} in the list`, () => {view.links = r.id; view.board = ''; view.family = ''; view.offset = 0; setTab('ideas');}));
        if (r.excerpt) host.append(el('h3', 'Row text'), el('p', r.excerpt));
    }
    async function showBoard(b) {
        view.selected = 'board:' + b.slug; detailHost.replaceChildren(); detailHost.append(el('strong', b.title));
        detailHost.append(dl([['Slug', b.slug], ['File', b.file], ['Kind', b.kind], ['Ideas', n(b.ideas)], ['Rules (not ideas)', n(b.rules)], ['Families', b.families], ['Listed in', b.registers], ['Residue lines', n(b.residue)]]));
        detailHost.append(chip('List its ideas', () => {view.board = b.slug; view.offset = 0; setTab('ideas');}));
        detailHost.append(el('h3', `Rounds and sections · ${n(b.rounds.length)}${b.rounds.length >= 60 ? '+' : ''}`));
        const rl = el('ul'); for (const x of b.rounds) rl.append(el('li', `${x.name} · ${n(x.count)}${x.line ? ' · line ' + x.line : ''}`)); detailHost.append(b.rounds.length ? rl : missing());
        if (b.residue) {
            detailHost.append(el('h3', `Residue · ${n(b.residue)} lines that start with a code and did not parse`));
            const box = el('div', 'Loading…'); detailHost.append(box);
            try {
                const res = await get('/ideas/residue?board=' + encodeURIComponent(b.slug)), u = el('ul');
                for (const x of res.lines.slice(0, 40)) u.append(el('li', `line ${x.line} · ${x.reason} · ${x.text}`));
                box.replaceChildren(u); if (res.lines.length > 40) box.append(el('small', `…and ${n(res.lines.length - 40)} more at /ideas/residue?board=${b.slug}`));
            } catch (e) {box.textContent = 'Residue could not be read: ' + e.message;}
        }
    }
    function showFamily(f) {
        view.selected = 'family:' + f.prefix; detailHost.replaceChildren(); detailHost.append(el('strong', `${f.prefix} · ${f.kind} family`));
        detailHost.append(dl([['Ideas', n(f.ideas)], ['Rules (not ideas)', n(f.rules)], ['Boards', n(f.boards.length)], ['Flags', f.flags.join(', ')]]));
        detailHost.append(chip('List its ideas', () => {view.family = f.prefix; view.board = ''; view.showLocal = view.showLocal || f.local; local.checked = view.showLocal; view.offset = 0; setTab('ideas');}));
        if (f.collidingCodes.length) {
            detailHost.append(el('h3', `Same code on several boards · ${n(f.collidingCodes.length)}`));
            const u = el('ul'); for (const c of f.collidingCodes.slice(0, 60)) u.append(el('li', `${c.code}: ${c.boards.join(', ')}`)); detailHost.append(u);
        }
    }

    // ---- lists ----
    let families = null;
    async function load() {
        const mine = ++token; chips();
        for (const b of statusBar.children) b.setAttribute('aria-pressed', String(b.dataset.status === view.status));
        statusBar.hidden = filters.hidden = view.tab !== 'ideas'; regLabel.hidden = view.tab !== 'boards'; localLabel.hidden = view.tab === 'boards';
        search.placeholder = view.tab === 'boards' ? 'Search board name, file, family' : view.tab === 'families' ? 'Search a prefix' : 'Search code, title, board, round, text';
        list.replaceChildren(); pager.replaceChildren();
        if (view.tab === 'families') return loadFamilies(mine);
        const boards = view.tab === 'boards';
        let page;
        try {
            page = boards ? await get('/ideas/boards?' + new URLSearchParams({offset: view.offset, limit: PAGE, q: view.q, tier: reg.checked ? 'registered' : ''}))
                : await get('/ideas/rows?' + new URLSearchParams({offset: view.offset, limit: PAGE, q: view.q, board: view.board, family: view.family, status: view.status, links: view.links, local: view.showLocal || view.family.length === 1 ? '' : 'hide'}));
        } catch (e) {if (mine === token) count.textContent = 'Rows could not be read: ' + e.message; return;}
        if (mine !== token) return;
        const rows = boards ? page.boards : page.rows, end = page.offset + rows.length;
        count.textContent = page.total ? `${n(page.offset + 1)}-${n(end)} of ${n(page.total)} matching` : 'Nothing matches.';
        for (const r of rows) {
            const li = el('li'), b = el('button'); b.type = 'button';
            const key = boards ? 'board:' + r.slug : r.key; b.setAttribute('aria-pressed', String(key === view.selected));
            b.append(el('span', boards ? r.title : `${r.code} ${r.title}`), el('small', boards ? `${n(r.ideas)} ideas${r.rules ? ' · ' + n(r.rules) + ' rules' : ''}${r.residue ? ' · ' + n(r.residue) + ' residue' : ''}` : r.statusLabel));
            b.onclick = () => {for (const x of list.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b)); boards ? showBoard(r) : go(hash.idea(r.id));};
            li.append(b); list.append(li);
        }
        const prev = el('button', 'Previous'), next = el('button', 'Next'); prev.type = next.type = 'button';
        prev.disabled = page.offset === 0; next.disabled = end >= page.total;
        prev.onclick = () => {view.offset = Math.max(0, page.offset - PAGE); load();}; next.onclick = () => {view.offset = end; load();};
        pager.append(prev, next);
    }
    async function loadFamilies(mine) {
        try {families ||= (await get('/ideas/families')).families;} catch (e) {count.textContent = 'Families could not be read: ' + e.message; return;}
        if (mine !== token) return;
        const q = view.q.trim().toLowerCase();
        const hits = families.filter(f => (view.showLocal || !f.local) && (!q || f.prefix.toLowerCase().includes(q)));
        count.textContent = `${n(hits.length)} families${view.showLocal ? '' : ' (single-letter families hidden)'}; the first 80 are drawn`;
        for (const f of hits.slice(0, 80)) {
            const li = el('li'), det = el('details'), sum2 = el('summary', `${f.prefix} · ${n(f.ideas)} ideas${f.rules ? ' · ' + n(f.rules) + ' rules' : ''} · ${n(f.boards.length)} board${f.boards.length === 1 ? '' : 's'}${f.flags.filter(x => x !== 'local').length ? ' · ' + f.flags.filter(x => x !== 'local').join(', ') : ''}`);
            sum2.onclick = () => showFamily(f); det.append(sum2);
            const u = el('ul'); for (const b of f.boards.slice(0, 40)) {const l2 = el('li'); l2.append(chip(`${b.board} · ${n(b.count)} ${b.kind}`, () => {view.board = b.board; view.family = f.prefix; view.showLocal = view.showLocal || f.local; local.checked = view.showLocal; view.offset = 0; setTab('ideas');})); u.append(l2);}
            det.append(u); li.append(det); list.append(li);
        }
    }
    let timer; const later = () => {clearTimeout(timer); timer = setTimeout(() => {view.q = search.value; view.offset = 0; load();}, 200);};
    search.oninput = later;
    local.onchange = () => {view.showLocal = local.checked; view.offset = 0; load();};
    reg.onchange = () => {view.offset = 0; load();};
    root.append(el('div', null, 'ideas-body'));
    root.lastChild.append(listCol, detailCol);
    if (focus) {
        try {const d = await get('/ideas/row?id=' + encodeURIComponent(focus)); view.board = d.row.board === 'src:definePanel' ? '' : d.row.board; view.kind = 'idea'; view.showLocal = true; local.checked = true;} catch { /* unknown id: show the plain list */ }
    }
    for (const b of tabs.children) b.setAttribute('aria-pressed', String(b.dataset.tab === view.tab));
    await load();
    if (focus) await showIdea(focus);
}
