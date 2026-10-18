// R17 layout spec (UIE20 seed, GU1). The shell's layout decisions as data: which panel lives in
// which region, the parity shell's default order, the companions each context recommends and the
// numbers the fit engine (shell_composition.js) uses for the top row. The workspace host and the
// fit engine read this; neither keeps its own ID lists. Layout only: no game state, no storage.
//
// Adding a panel to a region, or a companion to a context, is a data change here. Stored layouts
// keep their storage keys and panel IDs, so version 1 layouts read unchanged (GU6, UR17).

export const LAYOUT_SPEC = Object.freeze({
    // Version 2 (R21) adds boxes and slots; stored placements carry it (GU6). Version 3 (R22b, SU8)
    // adds the opponent list as a fight companion beside the actions.
    version: 3,
    // The five parity-shell regions in grid order. `panels` are fixed homes; a panel not listed in
    // any region lives in `fallback`. `contextual` homes depend on the context. R21c: the awakened
    // status window lives under You (it shows only once the system awakens).
    regions: Object.freeze({
        player: Object.freeze({panels: ['vitals', 'shell-character', 'status-window']}),
        focus: Object.freeze({panels: ['focus']}),
        inventory: Object.freeze({panels: ['belongings', 'combat-controls', 'shell-inventory-tools']}),
        log: Object.freeze({panels: ['messages', 'shell-log-tools']}),
        actions: Object.freeze({panels: ['records', 'skills', 'opponents']}),
    }),
    fallback: 'actions',
    // The selected item's detail sits beside the actions. R22c (FC4): idle too, as the second column
    // of the split place region (Proto23's list + detail), so Around you stays whole.
    contextual: Object.freeze({'shell-detail': Object.freeze({combat: 'actions', idle: 'actions'})}),
    // R21 (MB1): the boxes a player can move, as groups of panels. A main box has a home region and
    // swaps with the box in the slot it moves to; a companion joins a slot beside that slot's box.
    // `fit` says how a box sizes the top row when it sits there (WX3): 'content' (its content),
    // 'combat' (its content in a fight only), 'fill' (never drives the row; it scrolls). `lead` is
    // the panel whose header carries the box's Move to control.
    boxes: Object.freeze({
        you: Object.freeze({lead: 'vitals', title: 'You', panels: Object.freeze(['vitals', 'shell-character', 'status-window']), home: 'player', fit: 'content'}),
        around: Object.freeze({lead: 'focus', title: 'Around you', panels: Object.freeze(['focus']), home: 'focus', fit: 'combat'}),
        inventory: Object.freeze({lead: 'belongings', title: 'Inventory', panels: Object.freeze(['combat-controls', 'shell-inventory-tools', 'belongings']), home: 'inventory', fit: 'fill'}),
        journal: Object.freeze({lead: 'records', title: 'Journal', panels: Object.freeze(['records']), companion: true, fit: 'fill'}),
        skills: Object.freeze({lead: 'skills', title: 'Skills', panels: Object.freeze(['skills']), companion: true, fit: 'fill'}),
        // R22b (SU1, SU2): in a fight the opponent list takes the second column beside the actions,
        // where the place region had height to spare; Around you keeps the inspected opponent.
        opponents: Object.freeze({lead: 'opponents', title: 'Opponents', panels: Object.freeze(['opponents']), companion: true, fit: 'fill'}),
    }),
    // Named slots a box can move to. The log is not a slot: it keeps its column (UR11). The actions
    // region keeps the place, current work and actions; only companions join it.
    slots: Object.freeze({player: 'Top left', focus: 'Top centre', inventory: 'Bottom left', actions: 'Beside the actions'}),
    // Default order of the shell's panels when no layout is stored. Companions are inserted after
    // `companionsAfter` in the parity shell only.
    shellOrder: Object.freeze(['vitals', 'shell-character', 'status-window', 'combat-controls', 'shell-inventory-tools', 'belongings', 'focus', 'shell-detail', 'time', 'location', 'village-scene', 'current-work', 'combat', 'local-actions', 'pane-navigation', 'messages', 'shell-log-tools']),
    companionsAfter: 'local-actions',
    // Default and dial per context (WX6, CZ4): idle shows Journal beside the actions; a fight shows
    // Skills (Stances) only. R21 (Weibao, 2026-10-17: "We dont need skills always be seen"): Skills
    // left the idle default; its Skills tab, navigation and Move to still reach it. R22b: a fight
    // lists the opponents first, Skills (Stances) under them.
    contexts: Object.freeze({
        idle: Object.freeze({companions: Object.freeze(['records'])}),
        combat: Object.freeze({companions: Object.freeze(['opponents', 'skills'])}),
    }),
    // Top-row fit (WX3). The top row takes what You needs, or the opponent cards in a fight, plus
    // a frame. Caps keep the bottom row useful. Rows that yield (secondary stats) may grow it only
    // to the R14 default, so at laptop sizes they yield before inventory and actions (R11 order).
    topRow: Object.freeze({
        minLines: 10, maxBoardShare: 0.62, bottomLines: 11,
        framePx: 6, frameLines: 0.6,
        elastic: Object.freeze({minPx: 240, lines: 17.5, viewportShare: 0.38, boardShare: 0.55}),
    }),
    // After the start screen closes, re-measure for this long while first content arrives.
    settleMs: 1200,
    // R20 opponent board, sized by count (Part 2 B1, UX17). Each band names its layout, the
    // columns it wants and how the inspected opponent's facts show. Columns narrower than
    // `minColumnEm` fall back to fewer columns: more rows, never smaller text (R2, UR46). The rows
    // show at most `maxVisibleRows` before scrolling inside the board, so a large fight never
    // pushes the top row past what the fit engine allows.
    opponentBoard: Object.freeze({
        bands: Object.freeze([
            Object.freeze({upTo: 1, layout: 'single', columns: 1, facts: 'list'}),
            Object.freeze({upTo: 4, layout: 'rows', columns: 1, facts: 'list'}),
            Object.freeze({upTo: 8, layout: 'grid', columns: 2, facts: 'grid'}),
            Object.freeze({upTo: Infinity, layout: 'dense', columns: 3, facts: 'grid'}),
        ]),
        minColumnEm: 15,
        maxVisibleRows: 8,
        // From five opponents, repeated names group (UX17): the name once as a group label, then one
        // cell per opponent with its own letter, health and selection. Nothing is aggregated.
        groupFrom: 'grid', groupCellEm: 7, groupMaxColumns: 4,
        // R22b (SU2): one row's height in em. Where the board knows its slot's height, one column
        // is kept while every row (labels included) fits, so a tall slot stacks the opponents.
        rowEm: 1.75,
    }),
});

export const contextOf = ({combat}) => combat ? 'combat' : 'idle';

// The box a panel belongs to, if any.
export const boxOf = (id, spec = LAYOUT_SPEC) => Object.keys(spec.boxes).find(box => spec.boxes[box].panels.includes(id)) || null;

// R21: where a box sits under a placement ({boxes: {box: slot}, companions: {box: slot}}) for one
// context. A missing or unknown entry is the default, so an empty placement is the R20 layout.
export function boxRegion(box, placement = null, spec = LAYOUT_SPEC) {
    const def = spec.boxes[box]; if (!def) return null;
    const chosen = def.companion ? placement?.companions?.[box] : placement?.boxes?.[box];
    if (chosen && spec.slots[chosen] && (def.companion || chosen !== 'actions')) return chosen;
    return def.companion ? 'actions' : def.home;
}

// Region for a panel ID in the parity shell.
export function regionFor(id, {combat = false, placement = null} = {}, spec = LAYOUT_SPEC) {
    const contextual = spec.contextual[id];
    if (contextual) { const at = contextual[contextOf({combat})]; return at.startsWith('box:') ? boxRegion(at.slice(4), placement, spec) : at; }
    const box = boxOf(id, spec);
    if (box && placement) return boxRegion(box, placement, spec);
    for (const [region, {panels}] of Object.entries(spec.regions)) if (panels.includes(id)) return region;
    return spec.fallback;
}

// The fit mode of a region from the panels it holds (WX3): any 'content' box drives the row, then
// 'combat'; a region holding only lists ('fill') never drives it.
export function regionFit(panelIds, spec = LAYOUT_SPEC) {
    const fits = panelIds.map(id => spec.boxes[boxOf(id, spec)]?.fit).filter(Boolean);
    return fits.includes('content') ? 'content' : fits.includes('combat') ? 'combat' : 'fill';
}

// Every panel that can be a companion in some context, in spec order.
export function companionPanels(spec = LAYOUT_SPEC) {
    return [...new Set(Object.values(spec.contexts).flatMap(c => c.companions))];
}

// Default order of shell panels; the parity shell inserts its companions.
export function shellOrder({parity}, spec = LAYOUT_SPEC) {
    const order = [...spec.shellOrder];
    if (parity) order.splice(order.indexOf(spec.companionsAfter) + 1, 0, ...companionPanels(spec));
    return order;
}

// Which companions show now, from those available (registered, discovered and not hidden).
export function companionsFor({combat, available}, spec = LAYOUT_SPEC) {
    return spec.contexts[contextOf({combat})].companions.filter(id => available.includes(id));
}

export function topRowHeight({player, focus, combat, board, fontSize, frame = LAYOUT_SPEC.topRow.framePx, elastic = 0, viewport = 0}, spec = LAYOUT_SPEC) {
    const t = spec.topRow, e = t.elastic;
    const elasticCap = Math.min(board * e.boardShare, Math.max(e.minPx, fontSize * e.lines, viewport * e.viewportShare));
    const need = Math.max(player, Math.min(player + elastic, elasticCap), combat ? focus : 0) + frame;
    const low = fontSize * t.minLines, high = Math.min(board * t.maxBoardShare, board - fontSize * t.bottomLines);
    return Math.round(Math.max(low, Math.min(high, need)));
}

// R20: the opponent board's layout for a count at the board's width in text lines (em).
// `groups` are the opponent counts per name in board order; repeated names group from the
// `groupFrom` band on. `visibleRows` counts group labels as rows.
// R22b (SU2): `heightEm`, when given, is the slot's height; while one column fits every row the
// board stacks (R22c: without group labels), and the visible rows follow the slot instead of
// `maxVisibleRows`.
export function boardLayout({count, widthEm, heightEm = 0, groups = [count]}, spec = LAYOUT_SPEC) {
    const b = spec.opponentBoard, index = Math.max(0, b.bands.findIndex(x => count <= x.upTo)), band = b.bands[index];
    const grouped = index >= b.bands.findIndex(x => x.layout === b.groupFrom) && groups.length < count;
    const rowsAt = columns => grouped ? groups.reduce((n, g) => n + 1 + Math.ceil(g / columns), 0) : Math.ceil((count || 1) / columns);
    const fitRows = heightEm > 0 ? Math.max(1, Math.floor(heightEm / b.rowEm)) : 0;
    let columns = grouped ? Math.max(1, Math.min(b.groupMaxColumns, Math.floor(widthEm / b.groupCellEm), Math.max(...groups)))
        : Math.max(1, Math.min(band.columns, Math.floor(widthEm / b.minColumnEm), count || 1));
    // R22c (FC11): a stacked board needs no group labels; rows sort by kind instead.
    if (fitRows && (count || 1) <= fitRows) return {layout: band.layout, grouped: false, columns: 1, facts: band.facts, visibleRows: count || 1, stacked: count > 1};
    if (fitRows && rowsAt(1) <= fitRows) columns = 1;
    const rows = rowsAt(columns);
    return {layout: band.layout, grouped, columns, facts: band.facts, visibleRows: Math.min(rows, fitRows || b.maxVisibleRows), stacked: false};
}

export const frameFor =(fontSize, spec = LAYOUT_SPEC) => spec.topRow.framePx + Math.ceil(fontSize * spec.topRow.frameLines);
