// check:flow's screen checks that need their own logic, kept apart so tests can exercise them (UI finish wave, lane D).
//   drawnTwice  PS301: the same row (a fighter, item, person or action, with the same words and numbers) drawn in two
//               boxes at once. A repeat in one box, or the same words in the log, is the `repeat` check's business.
//   strays      PS195: every panel and action outside the layout registry (src/layout_spec.js). The count only goes
//               down: tests/fixtures/flow_strays.json holds the number the last accepted run found.
// The collectors run inside the page (self-contained: they are serialised); the verdicts are pure.

/** In the page: the rows a player reads, each with the box it is drawn in. */
export function collectRows() {
    const norm = t => t.replace(/\s+/g, ' ').trim().toLowerCase();
    const skip = '#message_box_div, #game_top, #workspace_navigation, #bottom_panel_div, .control-box, dialog, [role=tooltip], [hidden]';
    const boxSel = '.workspace-module, [data-surface-type], details, section, fieldset, .box_div, table, ul, ol';
    const ids = new Map(), idOf = el => { if (!ids.has(el)) ids.set(el, ids.size + 1); return ids.get(el); };
    const rows = [];
    // Buttons, section summaries and rows that hold a button or link. A plain fact line (a cost such as "0 played minutes")
    // repeats across unrelated cards on purpose, and a module's own title in its header is not a row.
    for (const el of document.querySelectorAll('#main_content button, #main_content [role=button], #main_content summary, #main_content li, #main_content tr')) {
        if (!el.offsetParent || el.closest(skip) || el.closest('.workspace-module-header')) continue;
        if (/^(LI|TR)$/.test(el.tagName) && !el.querySelector('button, a[href], [role=button]')) continue;
        const text = norm(el.textContent || '');
        const box = el.parentElement?.closest(boxSel);
        if (text.length < 14 || !box) continue;
        rows.push({box: idOf(box), module: el.closest('.workspace-module')?.dataset.module || '?', text});
    }
    return rows;
}

/** Pure: rows with identical text in two or more distinct boxes. Returns [{text, modules}], one per repeated row. */
export function drawnTwice(rows) {
    const byText = new Map();
    for (const r of rows) {
        const g = byText.get(r.text) || byText.set(r.text, {boxes: new Set(), modules: new Set()}).get(r.text);
        g.boxes.add(r.box); g.modules.add(r.module);
    }
    return [...byText].filter(([, g]) => g.boxes.size >= 2).map(([text, g]) => ({text, modules: [...g.modules]}));
}

/**
 * In the page: what sits outside the layout registry. `known` is {modules, routes} from LAYOUT_SPEC (surfaces and views;
 * route ids). A stray is a visible workspace module the spec has no surface for, a visible route button the spec does not
 * list, or a panel or action that lives in no module and in no part of the shell's own chrome.
 */
export function collectStrays(known) {
    const vis = e => !!e.offsetParent && e.getBoundingClientRect().width > 0;
    const chrome = '.workspace-module, dialog, #game_top, #game_bar, #workspace_navigation, #bottom_panel_div, [popover], .control-box, [role=tooltip], #loading_screen';
    const name = e => e.id ? `#${e.id}` : `${e.localName}${e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : ''}`;
    const out = new Set();
    for (const m of document.querySelectorAll('#main_content .workspace-module[data-module]')) if (vis(m) && !known.modules.includes(m.dataset.module)) out.add(`module ${m.dataset.module}`);
    for (const b of document.querySelectorAll('#workspace_navigation button[data-route-id]')) if (vis(b) && !known.routes.includes(b.dataset.routeId)) out.add(`route ${b.dataset.routeId}`);
    for (const p of document.querySelectorAll('[data-surface-type], .reference-panel, .expedition_panel, [id$="_panel"]')) if (vis(p) && !p.closest(chrome)) out.add(`panel ${name(p)}`);
    for (const a of document.querySelectorAll('body button, body select, body input, body summary, body [role=button]')) {
        if (!vis(a) || a.closest(chrome) || a.closest('[hidden]')) continue;
        out.add(`action ${name(a)} "${(a.textContent || a.value || a.title || '').trim().slice(0, 24)}"`);
    }
    return [...out];
}

/** Pure: the ratchet. `found` is every stray seen on the walk; `baseline` the accepted count and list. */
export function strayVerdict({found, baseline}) {
    const rose = found.length > baseline.count, fell = found.length < baseline.count;
    const added = found.filter(s => !baseline.strays.includes(s));
    return {rose, fell, added, ok: !rose};
}
