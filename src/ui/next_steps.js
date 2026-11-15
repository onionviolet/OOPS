// Results name the next step (play surface PS55, with PS60's links; proposals under AD56). When a Reports line names
// something that a ready or near row uses (a material just gathered, food just bought, meat just cut), the line ends with
// "Next:" and up to two links to where that row is done. The rows come from ready_rows.js, the same list the hub on Here
// shows, so no second lookup table exists and a feature joins by declaring `uses` on its rows.
//
// The links open the place where the act is done (the panel, the bench) through the centre controller, so Back returns
// to where the player was (PS56). A row with no place of its own and only an act is offered as the act itself.
// Matching is by whole words, case-insensitive. Lines are never rewritten: the Next part is its own span, which the
// Reports tail and the day strip leave out of what they keep. Pure view; nothing is saved.
import {collectReady} from '../ready_rows.js';

const NEXT_SHOWN = 2;
const words = text => String(text || '').toLowerCase();
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Pure: the rows a line's text points at, ready first (the list is already ordered), at most NEXT_SHOWN.
export function nextFor(text, rows) {
    const line = words(text);
    if (!line) return [];
    const hit = r => r.state !== 'rest' && (r.uses || []).some(u => { const w = words(u).trim(); return w.length > 2 && new RegExp(`(^|[^a-z])${escape(w)}([^a-z]|$)`).test(line); });
    return rows.filter(hit).slice(0, NEXT_SHOWN);
}

// The "Next:" part for any result line: a Reports line here, or a panel's own result line ("Done: Buy a bag of Moon Orchid
// petals") that the panel appends it to. Null when nothing ready or close uses what the line names.
export function nextLinks(text, rows = collectReady()) {
    let list = [];
    try { list = nextFor(text, rows); } catch { list = []; }
    if (!list.length || typeof document === 'undefined') return null;
    const span = document.createElement('span'); span.className = 'report-next';
    span.append(document.createTextNode(' Next: '));
    list.forEach((r, i) => {
        if (i) span.append(document.createTextNode(' · '));
        const b = document.createElement('button'); b.type = 'button'; b.className = 'report-next__go';
        b.textContent = r.state === 'near' && r.gap ? `${r.label} (${r.gap})` : r.label;
        b.title = r.open ? `${r.label}. Opens where it is done.` : `${r.label}. Does it now.`;
        b.onclick = () => { try { if (r.open) r.open(); else r.act?.(); } catch { /* the panel's own result line says what went wrong */ } };
        span.append(b);
    });
    return span;
}

export function mountNextSteps({stream = () => document.getElementById('message_box_div'), rows = collectReady} = {}) {
    const host = stream();
    if (!host || typeof MutationObserver === 'undefined') return null;
    const textOf = node => { const own = node.querySelector(':scope > .log-original'); return (own || node).textContent; };
    const eligible = node => node.nodeType === 1 && node.classList.contains('message_common') && !node.classList.contains('report-earlier')
        && node.dataset.logLabel !== 'Combat' && !node.querySelector('.report-next');
    // Rows are read once per batch, and only the newest few lines of a batch are looked at: catching up a long absence
    // writes hundreds of lines in one go, and reading every feature's rows per line stalled the page at PLAY.
    const BATCH_LOOKED_AT = 3;
    function decorate(nodes) {
        const fresh = nodes.filter(eligible).slice(-BATCH_LOOKED_AT);
        if (!fresh.length) return;
        let list = [];
        try { list = rows(); } catch { list = []; }
        if (!list.some(r => r.state !== 'rest' && r.uses?.length)) return;
        for (const node of fresh) { const span = nextLinks(textOf(node), list); if (span) node.append(span); }
    }
    let queued = [], pending = false;
    const flush = () => { pending = false; const batch = queued; queued = []; decorate(batch); };
    const observer = new MutationObserver(list => {
        for (const m of list) for (const n of m.addedNodes) queued.push(n);
        if (queued.length > 50) queued = queued.slice(-50);
        if (!pending) { pending = true; setTimeout(flush, 0); }
    });
    observer.observe(host, {childList: true});
    return {decorate: node => decorate([node]), dispose() { observer.disconnect(); }};
}
