import { LAYOUT_SPEC, topRowHeight, companionsFor, frameFor, regionFit } from './layout_spec.js';

// R16c whole-screen composition for the parity shell (WX3–WX7, CZ3–CZ5). Two decisions, both made
// only at stable moments (presentation, text size, viewport, a context change such as entering or
// leaving a fight, an explicit layout action), never on ticks, so a pending
// click never moves (UR52):
// 1. the top row follows its content instead of a fixed number of text lines;
// 2. which companion panels show beside the actions. A panel discovered mid-fight waits for the
//    next stable moment instead of pushing the actions aside.
// Layout-only: reads geometry and registry visibility, writes one CSS variable and two data
// attributes on the shell root.

// Attributes on the shell root that mark a context or size change.
const STABLE_ATTRIBUTES = ['data-shell-companions-placed', 'data-shell-companion-swap', 'data-parity', 'data-parity-combat', 'data-layout-context', 'data-parity-item', 'data-shell-stats-open', 'data-shell-worn', 'data-enemy-cards', 'data-density', 'data-presentation', 'data-parity-expanded', 'data-opponent-board', 'style'];
const LEAF = /^(BUTTON|SELECT|INPUT|TEXTAREA|IMG|SVG|CANVAS|PROGRESS|SUMMARY)$/;

// Bottom of the lowest visible text or control inside a region, as if every inner scroll
// container were at its top. Containers stretched to fill their frame are ignored, so the result
// is the content's own height.
export function contentExtent(region, skip = null) {
    const top = region.getBoundingClientRect().top;
    let bottom = top;
    // R20: a part that scrolls inside a declared size ([data-fit-clip], the opponent board's visible
    // rows from layout_spec) counts at that size, even while the region squeezes it; content below
    // it moves down by the difference. So the measure does not depend on the current squeeze.
    const clips = [...region.querySelectorAll('[data-fit-clip]')].filter(c => c.getClientRects().length).map(clip => {
        const r = clip.getBoundingClientRect(), max = parseFloat(getComputedStyle(clip).maxHeight);
        const want = Math.min(clip.scrollHeight, Number.isFinite(max) ? max : Infinity);
        let above = 0; for (let up = clip.parentElement; up && up !== region; up = up.parentElement) above += up.scrollTop;
        return {clip, bottom: r.bottom, limit: r.top + above + want, extra: Math.max(0, want - clip.clientHeight)};
    });
    for (const node of region.querySelectorAll('*')) {
        const rect = node.getBoundingClientRect();
        if (!rect.height || !rect.width) continue;
        const leaf = LEAF.test(node.tagName) || !node.firstElementChild || [...node.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
        if (!leaf || node.closest('[popover]') || (skip && node.closest(skip)) || getComputedStyle(node).visibility === 'hidden') continue;
        // A closed disclosure still reports geometry for its hidden content; only its summary shows.
        // Disclosure content (Gear, readouts) scrolls inside its panel and does not size the row;
        // only the summary counts. A closed disclosure also reports geometry for hidden content.
        let hidden = false;
        for (let box = node.closest('details'); box && !hidden && region.contains(box); box = box.parentElement?.closest('details')) hidden = !box.querySelector(':scope > summary')?.contains(node);
        if (hidden) continue;
        let scrolled = 0;
        for (let up = node.parentElement; up && up !== region; up = up.parentElement) scrolled += up.scrollTop;
        let end = rect.bottom + scrolled;
        for (const c of clips) end = c.clip.contains(node) ? Math.min(end, c.limit) : rect.top >= c.bottom - 1 ? end + c.extra : end;
        bottom = Math.max(bottom, end);
    }
    return Math.ceil(bottom - top);
}

// A region whose panels stack, each with its own scroll (Ready now above Around you): its content is the sum of each
// panel's full height, read as the sum of the panel's own parts at their scroll heights (a header, a list that scrolls, a
// More button). A single lowest-line read misses rows that overflow behind the next panel.
const natural = n => {
    const cs = getComputedStyle(n), edge = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((s, k) => s + (parseFloat(cs[k]) || 0), 0);
    return edge + [...n.children].filter(c => c.getClientRects().length).reduce((sum, c) => { const m = getComputedStyle(c);
        return sum + Math.max(c.scrollHeight, c.getBoundingClientRect().height) + (parseFloat(m.marginTop) || 0) + (parseFloat(m.marginBottom) || 0); }, 0);
};
export function stackedExtent(region) {
    const parts = [...region.children].filter(n => n.getClientRects().length && getComputedStyle(n).display !== 'none');
    // A panel stretched to fill (flex-grow) counts by its lines only, or the measure would read the stretch back as content.
    const own = n => (parseFloat(getComputedStyle(n).flexGrow) || 0) > 0 ? intrinsicExtent(n) : Math.max(intrinsicExtent(n), natural(n));
    return parts.length > 1 ? parts.reduce((sum, n) => sum + own(n), 0) : intrinsicExtent(region);
}

// Parts pinned to a region's bottom edge by a stretching sibling (the action-region nav bar, the
// Around you closing hint) sit wherever the region ends. They count by their own height, not
// their position; otherwise each measure reads the last size back as content and ratchets.
const PINNED = '[data-module="pane-navigation"], .nearby-context-view > p:last-child';
export function intrinsicExtent(region) {
    const pinned = [...region.querySelectorAll(PINNED)].filter(n => n.getClientRects().length);
    return contentExtent(region, PINNED) + pinned.reduce((sum, n) => sum + n.getBoundingClientRect().height, 0);
}

// A panel that yields rows to the space it gets (You's secondary stats) declares the height it
// would like in full as data-fit-want. `shown` is what it occupies now, `want` its full height.
// R17a fix (F1): the fit removes `shown` from the measured content and offers up to `want` again,
// so the result no longer depends on how many rows happened to show when it measured. Before, each
// measure counted the visible rows as fixed content, and under load the row ratcheted upward.
export function elasticParts(region) {
    let shown = 0, want = 0;
    for (const elastic of region.querySelectorAll('[data-fit-want]')) { shown += elastic.hidden ? 0 : elastic.getBoundingClientRect().height; want += Number(elastic.dataset.fitWant) || 0; }
    return {shown: Math.floor(shown), want: Math.ceil(want)};
}

// The decisions live in the layout spec (R17, GU1); this module is the fit engine that measures
// and applies them. Re-exported so callers and tests keep one import.
export { topRowHeight, companionsFor } from './layout_spec.js';

// The top-row inputs from the two top regions by their fit modes: `player` is the largest
// content-fit extent (less its elastic rows), `focus` the largest combat-fit extent.
export function topTerms(regions, combat) {
    let player = 0, elastic = 0, focus = 0, idleFocus = 0, found = false;
    for (const region of [regions.player, regions.focus]) {
        if (!region) continue;
        const ids = [...region.querySelectorAll(':scope > .workspace-module[data-module]')].filter(n => !n.hidden).map(n => n.dataset.module);
        const fit = regionFit(ids);
        if (fit === 'content') { found = true; const parts = elasticParts(region); player = Math.max(player, contentExtent(region) - parts.shown); elastic = Math.max(elastic, parts.want); }
        else if (fit === 'combat') { if (combat) focus = Math.max(focus, contentExtent(region)); else idleFocus = Math.max(idleFocus, stackedExtent(region)); }
    }
    // No content box on top (You moved down): the row takes its elastic default instead of its
    // minimum, so the boxes moved up keep a useful height.
    if (!found) elastic = Infinity;
    return {player, elastic, focus, idleFocus};
}

// Centre split (stacked panels, picked by Weibao 2026-11-15; PS97, PS99). The top row's height comes from the You column,
// and the centre's first region (Ready now, then This place) used to share it: a quiet place showed a tall, nearly empty box
// above a squeezed action list, and a busy one scrolled while the list below sat short. Outside a fight, with the default
// boxes and no hand-set sizes, the centre's first region takes its content's height instead:
//   'short': shorter than the top row; the action panels start right under it.
//   'tall': taller than the top row, up to `cap`; the action panels start lower, and You and Inventory keep their row.
// Pure: returns {row, form} in px, or null for the shared row. Dials: `minLines` (the region never shrinks below this),
// `spareLines` (a short split must move the edge at least this much; a little shorter than the row just fills it). Measured at the
// same stable moments as the row itself (UR52, UR144).
export function centreRow({want, topRow, fontSize, cap = Infinity, minLines = 4, spareLines = 3}) {
    if (!(want > 0) || !(topRow > 0)) return null;
    const row = Math.ceil(Math.max(want, fontSize * minLines)), spare = fontSize * spareLines;
    if (row <= topRow - spare) return {row, form: 'short'};
    // Taller than the row by any real amount: the region takes its height, or its panels would squeeze inside it. Only
    // the short form keeps a margin, since a region a little shorter than the row loses nothing by filling it.
    const tall = Math.floor(Math.min(row, cap));
    return tall > topRow + 2 ? {row: tall, form: 'tall'} : null;
}

export function createShellComposition({root, board, regions, resize}) {
    let frame = 0, heldRow = false, settling = 0;
    const measure = () => {
        frame = 0;
        const started = performance.now();
        if (root.dataset.parity !== 'r3' || !regions.player?.isConnected) { resize?.measure(); delete root.dataset.shellFit; delete root.dataset.shellCompanions; return; }
        resize?.prepare();
        const height = board.getBoundingClientRect().height;
        if (!height) return;
        const fontSize = parseFloat(getComputedStyle(regions.player).getPropertyValue('--shell-context-size')) || parseFloat(getComputedStyle(regions.focus).fontSize) || 14;
        const combat = root.dataset.parityCombat === 'true';
        // R21 (MB1): a box can move between the top regions; each region drives the row by its
        // fit mode, so a list moved up scrolls instead of growing the row. The default placement
        // (You top left, Around you top centre) gives the R20 numbers.
        const top = topTerms(regions, combat);
        const available = [...regions.actions.querySelectorAll(':scope > .workspace-module[data-module]')].filter(n => !n.hidden).map(n => n.dataset.module);
        // R21: companions the player placed beside the actions show even where the context would not
        // recommend them (WX11).
        const placed = (root.dataset.shellCompanionsPlaced || '').split(' ').filter(id => id && available.includes(id));
        const companions = [...new Set([...companionsFor({combat, context: root.dataset.layoutContext || null, available}), ...placed])].join(' ');
        if (root.dataset.shellCompanions !== companions) root.dataset.shellCompanions = companions;
        // The frame allowance covers region borders plus the padding and borders below the last
        // text line (opponent card lists, stat rows), which the extent does not see.
        // The bottom row's own content (actions, inventory) bounds what the top row may borrow.
        const below = Math.max(0, ...[regions.actions, regions.inventory].filter(r => r?.isConnected).map(intrinsicExtent));
        const value = `${topRowHeight({player: top.player, elastic: top.elastic, focus: combat ? top.focus : top.idleFocus, combat, board: height, fontSize, viewport: window.innerHeight, frame: frameFor(fontSize), below})}px`;
        // UR144: while a centre view is open the top row keeps its home height, so the inventory below
        // You does not ride up and down with each view. After it closes, Around you redraws lazily (it skips
        // renders while hidden), so the row waits a settle window before fitting again.
        const current = root.style.getPropertyValue('--shell-top-row');
        if (root.dataset.centerTask && current) { heldRow = true; clearTimeout(settling); settling = 0; }
        else if (heldRow) { if (!settling) settling = setTimeout(() => { settling = 0; heldRow = false; schedule(); }, LAYOUT_SPEC.settleMs); }
        // A one-pixel change is a measuring ratchet (You's yielding rows answering the row they sit in), not new content: the
        // row keeps its height, so the frame does not flicker between two sizes while the start settles (UR144).
        else if (current !== value && !(current && Math.abs(parseFloat(current) - parseFloat(value)) <= 1)) root.style.setProperty('--shell-top-row', value);
        // The centre split follows the row it sits in; while a centre view holds the row, the split waits with it.
        if (!root.dataset.centerTask && !heldRow) {
            const own = id => [...(regions[id]?.querySelectorAll(':scope > .workspace-module[data-module]') || [])].filter(n => !n.hidden).map(n => n.dataset.module);
            const defaults = !combat && regionFit(own('focus')) === 'combat' && own('focus').includes('focus') && regionFit(own('player')) === 'content'
                && !board.style.getPropertyValue('grid-template-rows') && !board.style.getPropertyValue('grid-template-areas');
            const topRow = parseFloat(root.style.getPropertyValue('--shell-top-row')), gap = parseFloat(getComputedStyle(board).rowGap) || 0;
            // The action list keeps at least its bottom-row floor under a tall centre region.
            const cap = height - gap - fontSize * LAYOUT_SPEC.topRow.bottomLines;
            const split = defaults ? centreRow({want: stackedExtent(regions.focus) + 2 * frameFor(fontSize), topRow, fontSize, cap}) : null;
            // The middle row is the difference between the two edges less the board's own row gap, so You and Inventory sit
            // exactly where the two-row grid puts them and opening a centre view moves neither (UR144).
            if (split) {
                const first = split.form === 'short' ? split.row : topRow, rest = Math.abs(topRow - split.row) - gap;
                root.style.setProperty('--shell-centre-row', `${first}px`); root.style.setProperty('--shell-centre-rest', `${rest}px`);
                if (root.dataset.centreSplit !== split.form) root.dataset.centreSplit = split.form;
            } else if (root.dataset.centreSplit) { delete root.dataset.centreSplit; root.style.removeProperty('--shell-centre-row'); root.style.removeProperty('--shell-centre-rest'); }
        }
        if (root.dataset.shellFit !== 'true') root.dataset.shellFit = 'true';
        resize?.measure();
        // GU2: each measure is timed so checks can confirm it stays within a frame.
        performance.measure('shell-composition', {start: started, end: performance.now()});
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    // Renders rewrite these attributes with unchanged values on every tick; only a real change
    // counts. Of the root's inline style, only the text size is a stable-moment signal.
    let textSize = root.style.getPropertyValue('--shell-context-size');
    const observer = new MutationObserver(records => {
        const size = root.style.getPropertyValue('--shell-context-size');
        const sizeChanged = size !== textSize; textSize = size;
        if (sizeChanged || records.some(r => r.attributeName !== 'style' && r.oldValue !== root.getAttribute(r.attributeName))) schedule();
    });
    observer.observe(root, {attributes: true, attributeFilter: STABLE_ATTRIBUTES, attributeOldValue: true});
    window.addEventListener('resize', schedule);
    // Hide, restore, expand and other layout buttons are explicit actions: re-compose after them.
    const acted = event => { if (event.target.closest?.('[data-workspace-action]')) setTimeout(schedule); };
    root.addEventListener('click', acted);
    document.addEventListener('workspace-presentation-change', schedule);
    // Arriving somewhere is a stable moment too: Around you now holds another place's people and ways out.
    document.addEventListener('game-place-change', schedule);
    // A panel arriving in or leaving a region (Ready now) is one too.
    document.addEventListener('shell-content-change', schedule);
    // Closing the start screen, and the character rows that arrive over the next few renders, is
    // a stable moment too: re-measure for a short settle window, then stop listening.
    let settle = 0;
    const startObserver = new MutationObserver(() => { if (settle) schedule(); });
    const arm = () => {
        if (document.documentElement.dataset.startScreen !== 'closed' || settle) return;
        startObserver.observe(regions.player, {childList: true, subtree: true});
        startObserver.observe(regions.actions, {childList: true, attributes: true, subtree: true, attributeFilter: ['hidden']});
        settle = setTimeout(() => startObserver.disconnect(), LAYOUT_SPEC.settleMs); schedule();
    };
    const screenObserver = new MutationObserver(() => { arm(); if (settle) screenObserver.disconnect(); });
    screenObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-start-screen']});
    arm(); if (settle) screenObserver.disconnect();
    schedule();
    return {
        measure: schedule,
        destroy() { observer.disconnect(); startObserver.disconnect(); screenObserver.disconnect(); clearTimeout(settle); root.removeEventListener('click', acted); window.removeEventListener('resize', schedule); document.removeEventListener('workspace-presentation-change', schedule); document.removeEventListener('game-place-change', schedule); document.removeEventListener('shell-content-change', schedule); if (frame) cancelAnimationFrame(frame); },
    };
}
