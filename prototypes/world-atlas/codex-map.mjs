// A bounded projection of /codex summaries. No ledger row text enters this view.
import {boxCanvas, element as el} from './canvas.mjs';

export const DEFAULT_BLOCKERS = 40;
export const MAX_BLOCKERS = 80;
export const MAX_EDGES = 500;
export const MAX_LEDGERS = 30; // more ledgers than this make the map unreadable at fit; the rest are counted, and the text list and codex still reach them
const n = value => Number(value).toLocaleString('en-US');
const idOf = (kind, key) => `${kind}:${key}`;

export function projectBlockerMap(summaries, {limit = DEFAULT_BLOCKERS} = {}) {
    const cap = Math.max(0, Math.min(MAX_BLOCKERS, Math.trunc(limit) || DEFAULT_BLOCKERS));
    const bySlug = new Map();
    for (const summary of summaries) for (const b of summary.blockers || []) {
        if (!b.slug || !Number.isFinite(b.rows) || b.rows <= 0) continue;
        const item = bySlug.get(b.slug) || {slug: b.slug, rows: 0, ledgers: []};
        item.rows += b.rows;
        item.ledgers.push({ledger: summary.ledger, rows: b.rows});
        bySlug.set(b.slug, item);
    }
    const blockers = [...bySlug.values()].sort((a, b) => b.rows - a.rows || a.slug.localeCompare(b.slug)).slice(0, cap);
    const allEdges = blockers.flatMap(b => b.ledgers.map(l => ({from: idOf('ledger', l.ledger), to: idOf('blocker', b.slug), ledger: l.ledger, slug: b.slug, rows: l.rows})));
    const ledgerTotals = new Map();
    for (const e of allEdges) ledgerTotals.set(e.ledger, (ledgerTotals.get(e.ledger) || 0) + e.rows);
    const keptLedgers = new Set([...ledgerTotals].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, MAX_LEDGERS).map(([l]) => l));
    const rankedEdges = allEdges.filter(e => keptLedgers.has(e.ledger))
        .sort((a, b) => b.rows - a.rows || a.slug.localeCompare(b.slug) || a.ledger.localeCompare(b.ledger)).slice(0, MAX_EDGES);
    const edges = rankedEdges.sort((a, b) => a.ledger.localeCompare(b.ledger) || a.slug.localeCompare(b.slug));
    const keptSlugs = new Set(edges.map(e => e.slug));
    const shownBlockers = blockers.filter(b => keptSlugs.has(b.slug));
    const ledgerCounts = new Map();
    for (const e of edges) ledgerCounts.set(e.ledger, (ledgerCounts.get(e.ledger) || 0) + e.rows);
    const ledgers = [...ledgerCounts].map(([ledger, rows]) => ({ledger, rows})).sort((a, b) => b.rows - a.rows || a.ledger.localeCompare(b.ledger));
    const size = (rows, max) => 96 + Math.round(56 * Math.sqrt(rows / Math.max(max, 1)));
    // Ledgers fill two columns on the left, blockers three columns on the right, largest first, so the map stays wide rather than tall.
    const step = 66, ledgerRows = Math.ceil(ledgers.length / 2), blockerRows = Math.ceil(shownBlockers.length / 3), rowsHigh = Math.max(ledgerRows, blockerRows, 1);
    const y = (index, rows) => 85 + (index % rows + (rowsHigh - rows) / 2) * step;
    const nodes = [
        ...ledgers.map((l, i) => ({id: idOf('ledger', l.ledger), type: 'ledger', key: l.ledger, label: l.ledger, subtitle: `${n(l.rows)} blocked rows shown`, rows: l.rows,
            x: 155 + Math.floor(i / ledgerRows) * 250, y: y(i, ledgerRows), w: size(l.rows, ledgers[0]?.rows), h: 48, group: 'ledger'})),
        ...shownBlockers.map((b, i) => ({id: idOf('blocker', b.slug), type: 'blocker', key: b.slug, label: b.slug, subtitle: `${n(b.rows)} rows · ${b.ledgers.length} ledgers`, rows: b.rows,
            x: 900 + Math.floor(i / blockerRows) * 260, y: y(i, blockerRows), w: size(b.rows, shownBlockers[0]?.rows), h: 48, group: 'blocker'})),
    ];
    return {nodes, edges, blockers: shownBlockers, ledgers, totalBlockers: bySlug.size, hiddenLedgers: Math.max(0, ledgerTotals.size - keptLedgers.size), omittedEdges: Math.max(0, allEdges.length - edges.length)};
}

const get = async url => {const response = await fetch(url); if (!response.ok) throw Error(`${response.status} ${response.statusText}`); return response.json();};
const button = (label, action) => {const b = el('button', label); b.type = 'button'; b.onclick = action; return b;};

export async function codexMapView({main, go}) {
    main.replaceChildren(el('p', 'Loading blocker map…'));
    let list, summaries;
    try {
        list = (await get('/codex')).ledgers.filter(l => l.counts?.blocked > 0);
        summaries = await Promise.all(list.map(l => get(`/codex/${encodeURIComponent(l.ledger)}`)));
    } catch (error) {main.replaceChildren(el('p', `Blocker map could not be read: ${error.message}`)); return;}
    const root = el('section', null, 'codex-map'), head = el('div', null, 'codex-map-head'), host = el('div');
    root.setAttribute('aria-label', 'Codex blocker map');
    head.append(el('h2', 'Blocker map'), el('p', 'Ledgers connect to the reasons their rows are blocked. Node size follows blocked row count. Select a blocker to see its ledgers.'));
    root.append(head, host); main.replaceChildren(root);
    let limit = DEFAULT_BLOCKERS;
    function render() {
        const graph = projectBlockerMap(summaries, {limit});
        host.replaceChildren();
        const status = el('p', `Showing ${graph.blockers.length} of ${graph.totalBlockers} blockers, ${graph.ledgers.length} ledgers and ${graph.edges.length} counted links${graph.hiddenLedgers ? `; ${graph.hiddenLedgers} smaller ledgers are left off the map (open them from Codex)` : ''}${graph.omittedEdges ? `; ${graph.omittedEdges} links are outside the map cap` : ''}.`, 'codex-map-status');
        host.append(status);
        if (graph.totalBlockers > DEFAULT_BLOCKERS) {
            const more = button(limit === DEFAULT_BLOCKERS ? `Show more, up to ${MAX_BLOCKERS}` : 'Show top 40', () => {limit = limit === DEFAULT_BLOCKERS ? MAX_BLOCKERS : DEFAULT_BLOCKERS; render();});
            host.append(more);
        }
        if (!graph.nodes.length) {host.append(el('p', 'No blocked rows are recorded in these ledgers.')); return;}
        const nodeById = new Map(graph.nodes.map(node => [node.id, node]));
        const connections = node => graph.edges.filter(e => e.from === node.id || e.to === node.id);
        boxCanvas({parent: host, title: 'Blocked rows by ledger and blocker', nodes: graph.nodes, edges: graph.edges.map(e => ({...e, kind: 'related'})),
            marks: [{key: 'ledger', label: 'Ledger'}, {key: 'blocker', label: 'Blocker'}], kind: 'codex-map', straightEdges: true,
            activate(id, select) {const node = nodeById.get(id); if (node.type === 'ledger') go(`codex/${node.key}`); else select(id);},
            select(id, inspector) {
                const node = nodeById.get(id);
                inspector.append(el('small', node.type === 'ledger' ? 'Ledger' : 'Blocker'), el('h2', node.key), el('p', `${n(node.rows)} blocked rows ${node.type === 'ledger' ? 'shown' : 'across ledgers'}.`));
                if (node.type === 'ledger') inspector.append(button('Open ledger', () => go(`codex/${node.key}`)));
                else {
                    inspector.append(el('h3', 'Ledgers'));
                    const links = el('div', null, 'canvas-links');
                    for (const e of connections(node).sort((a, b) => b.rows - a.rows || a.ledger.localeCompare(b.ledger))) {
                        const row = button(e.ledger, () => go(`codex/${e.ledger}/${encodeURIComponent(node.key)}`));
                        row.append(el('small', `${n(e.rows)} rows`)); links.append(row);
                    }
                    inspector.append(links, el('small', 'Opening a ledger searches for this blocker.'));
                }
            }});
        const fallback = el('details', null, 'codex-map-list');
        fallback.append(el('summary', `Text list · ${graph.nodes.length} nodes`));
        const list = el('ul');
        for (const node of graph.nodes) {
            const li = el('li');
            const action = node.type === 'ledger' ? () => go(`codex/${node.key}`) : () => host.querySelector(`.canvas-box[data-id="${CSS.escape(node.id)}"]`)?.click();
            li.append(button(`${node.type}: ${node.key} · ${n(node.rows)} rows`, action));
            list.append(li);
        }
        fallback.append(list); host.append(fallback);
    }
    render();
}
