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
export function contentExtent(region) {
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
        if (!leaf || node.closest('[popover]') || getComputedStyle(node).visibility === 'hidden') continue;
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
    let player = 0, elastic = 0, focus = 0, found = false;
    for (const region of [regions.player, regions.focus]) {
        if (!region) continue;
        const ids = [...region.querySelectorAll(':scope > .workspace-module[data-module]')].filter(n => !n.hidden).map(n => n.dataset.module);
        const fit = regionFit(ids);
        if (fit === 'content') { found = true; const parts = elasticParts(region); player = Math.max(player, contentExtent(region) - parts.shown); elastic = Math.max(elastic, parts.want); }
        else if (fit === 'combat' && combat) focus = Math.max(focus, contentExtent(region));
    }
    // No content box on top (You moved down): the row takes its elastic default instead of its
    // minimum, so the boxes moved up keep a useful height.
    if (!found) elastic = Infinity;
    return {player, elastic, focus};
}

export function createShellComposition({root, board, regions, resize}) {
    let frame = 0;
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
        const value = `${topRowHeight({player: top.player, elastic: top.elastic, focus: top.focus, combat, board: height, fontSize, viewport: window.innerHeight, frame: frameFor(fontSize)})}px`;
        if (root.style.getPropertyValue('--shell-top-row') !== value) root.style.setProperty('--shell-top-row', value);
        resize?.measure();
        if (root.dataset.shellFit !== 'true') root.dataset.shellFit = 'true';
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
        destroy() { observer.disconnect(); startObserver.disconnect(); screenObserver.disconnect(); clearTimeout(settle); root.removeEventListener('click', acted); window.removeEventListener('resize', schedule); document.removeEventListener('workspace-presentation-change', schedule); if (frame) cancelAnimationFrame(frame); },
    };
}
