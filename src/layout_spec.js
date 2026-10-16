// R17 layout spec (UIE20 seed, GU1). The shell's layout decisions as data: which panel lives in
// which region, the parity shell's default order, the companions each context recommends and the
// numbers the fit engine (shell_composition.js) uses for the top row. The workspace host and the
// fit engine read this; neither keeps its own ID lists. Layout only: no game state, no storage.
//
// Adding a panel to a region, or a companion to a context, is a data change here. Stored layouts
// keep their storage keys and panel IDs, so version 1 layouts read unchanged (GU6, UR17).

export const LAYOUT_SPEC = Object.freeze({
    version: 1,
    // The five parity-shell regions in grid order. `panels` are fixed homes; a panel not listed in
    // any region lives in `fallback`. `contextual` homes depend on the context.
    regions: Object.freeze({
        player: Object.freeze({panels: ['vitals', 'shell-character']}),
        focus: Object.freeze({panels: ['focus']}),
        inventory: Object.freeze({panels: ['belongings', 'combat-controls', 'shell-inventory-tools']}),
        log: Object.freeze({panels: ['messages', 'shell-log-tools']}),
        actions: Object.freeze({panels: ['records', 'skills']}),
    }),
    fallback: 'actions',
    // The selected item's detail sits beside the actions in a fight and in Focus otherwise.
    contextual: Object.freeze({'shell-detail': Object.freeze({combat: 'actions', idle: 'focus'})}),
    // Default order of the shell's panels when no layout is stored. Companions are inserted after
    // `companionsAfter` in the parity shell only.
    shellOrder: Object.freeze(['vitals', 'shell-character', 'combat-controls', 'shell-inventory-tools', 'belongings', 'focus', 'shell-detail', 'time', 'location', 'village-scene', 'current-work', 'combat', 'local-actions', 'pane-navigation', 'messages', 'shell-log-tools']),
    companionsAfter: 'local-actions',
    // Default and dial per context (WX6, CZ4): idle shows Journal and Skills beside the actions;
    // a fight shows Skills (Stances) only.
    contexts: Object.freeze({
        idle: Object.freeze({companions: Object.freeze(['records', 'skills'])}),
        combat: Object.freeze({companions: Object.freeze(['skills'])}),
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
});

export const contextOf = ({combat}) => combat ? 'combat' : 'idle';

// Region for a panel ID in the parity shell.
export function regionFor(id, {combat = false} = {}, spec = LAYOUT_SPEC) {
    const contextual = spec.contextual[id];
    if (contextual) return contextual[contextOf({combat})];
    for (const [region, {panels}] of Object.entries(spec.regions)) if (panels.includes(id)) return region;
    return spec.fallback;
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

export const frameFor = (fontSize, spec = LAYOUT_SPEC) => spec.topRow.framePx + Math.ceil(fontSize * spec.topRow.frameLines);
