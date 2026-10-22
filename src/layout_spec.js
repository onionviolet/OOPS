// R17 layout spec (UIE20 seed, GU1). The shell's layout decisions as data: which panel lives in
// which region, the parity shell's default order, the companions each context recommends and the
// numbers the fit engine (shell_composition.js) uses for the top row. The workspace host and the
// fit engine read this; neither keeps its own ID lists. Layout only: no game state, no storage.
//
// Adding a panel to a region, or a companion to a context, is a data change here. Stored layouts
// keep their storage keys and panel IDs, so version 1 layouts read unchanged (GU6, UR17).
//
// UIL1 (UIM1, UIM2, 2026-10-18): version 3 also says what kind of surface each panel is and lists
// the navigation routes. Spec owns where and what kind; the registering module still owns whether
// a panel is discovered or eligible (one authority per fact, AR3).

// A surface field nobody has decided yet. Written out so a gap is visible, never guessed.
export const UNSET = 'unset';
export const SURFACE_TYPES = Object.freeze(['ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8', 'ST9']);
// `type` ST1–ST9 (UI_SURFACE_TYPES), `home` place and keeper, `frequency` how often play needs it,
// `status` proposal or accepted, `gate` the discovery owner ('owner': the registering module's
// discovered()), `reads` UIX2 topics, `contexts` (UIX6), `representations` (UIZ1).
const surface = (type, more = {}) => Object.freeze({
    type, home: more.home ?? UNSET, frequency: more.frequency ?? UNSET, status: more.status ?? UNSET, gate: more.gate ?? 'owner',
    reads: more.reads ? Object.freeze(more.reads) : UNSET, contexts: more.contexts ? Object.freeze(more.contexts) : UNSET,
    representations: Object.freeze(more.representations ?? ['view']),
});
const routed = ['view', 'route'];

export const LAYOUT_SPEC = Object.freeze({
    // Version 2 (R21) adds boxes and slots; stored placements carry it (GU6). Versions 3 (UIL1,
    // surfaces and routes) and 4 (UIL4, contexts) add data only, so earlier placements read unchanged.
    // Version 5 (R22b, SU8) adds the opponent list as a fight companion beside the actions (data only).
    // Version 4 (UIL4) adds the travel and service contexts; placements stored under 2 and 3 read
    // unchanged and a context they lack starts at the spec defaults.
    version: 5,
    placementReads: Object.freeze([2, 3, 4]),
    // The five parity-shell regions in grid order. `panels` are fixed homes; a panel not listed in
    // any region lives in `fallback`. `contextual` homes depend on the context. R21c: the awakened
    // status window lives under You (it shows only once the system awakens).
    regions: Object.freeze({
        player: Object.freeze({label: 'player', panels: ['vitals', 'shell-character', 'condition', 'status-window']}),
        focus: Object.freeze({label: 'Around you', panels: ['focus']}),
        inventory: Object.freeze({label: 'inventory', panels: ['belongings', 'combat-controls', 'shell-inventory-tools']}),
        actions: Object.freeze({label: 'actions', panels: ['records', 'skills', 'opponents']}),
        log: Object.freeze({label: 'log', panels: ['messages', 'shell-log-tools']}),
    }),
    fallback: 'actions',
    // A1: item inspection sits beside the activity area in idle/travel as well as combat,
    // keeping nearby context visible. Expanded services retain their existing inspector home.
    // R22c (FC4): idle too, as the second column of the split place region, so Around you stays whole.
    // A context a panel does not name uses its idle home.
    contextual: Object.freeze({'shell-detail': Object.freeze({combat: 'actions', idle: 'actions', travel: 'actions', service: 'box:around'})}),
    // R21 (MB1): the boxes a player can move, as groups of panels. A main box has a home region and
    // swaps with the box in the slot it moves to; a companion joins a slot beside that slot's box.
    // `fit` says how a box sizes the top row when it sits there (WX3): 'content' (its content),
    // 'combat' (its content in a fight only), 'fill' (never drives the row; it scrolls). `lead` is
    // the panel whose header carries the box's Move to control.
    boxes: Object.freeze({
        you: Object.freeze({lead: 'vitals', title: 'You', panels: Object.freeze(['vitals', 'shell-character', 'status-window']), home: 'player', fit: 'content'}),
        around: Object.freeze({lead: 'focus', title: 'Around you', panels: Object.freeze(['focus']), home: 'focus', fit: 'combat'}),
        inventory: Object.freeze({lead: 'belongings', title: 'Inventory', panels: Object.freeze(['combat-controls', 'shell-inventory-tools', 'belongings']), home: 'inventory', fit: 'fill'}),
        condition: Object.freeze({lead: 'condition', title: 'Condition', panels: Object.freeze(['condition']), companion: true, home: 'player', fit: 'content'}),
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
    shellOrder: Object.freeze(['vitals', 'shell-character', 'condition', 'status-window', 'combat-controls', 'shell-inventory-tools', 'belongings', 'focus', 'shell-detail', 'time', 'location', 'village-scene', 'current-work', 'combat', 'local-actions', 'pane-navigation', 'messages', 'shell-log-tools']),
    companionsAfter: 'local-actions',
    // Default and dial per context (WX6, CZ4): idle shows Journal beside the actions; a fight shows
    // Skills (Stances) only. R21 (Weibao, 2026-10-17: "We dont need skills always be seen"): Skills
    // left the idle default; its Skills tab, navigation and Move to still reach it.
    // UIL4 (UIX6, 2026-10-18): `label` names the context where the player sees it (Reset this
    // layout (travel)); `contextPriority` orders them: the first whose `when` holds wins, so combat
    // beats an open service view, which beats travel, which beats idle. Nothing is stored on entry,
    // so leaving a context returns to the one beneath it with its layout intact (UR23).
    // `when` names its inputs: 'combat' (the combat panel is eligible), 'travel' (the 'travel'
    // layout signal, registered by the journey's owner) and `centerTasks` (the open center view, as
    // center_modes.js publishes it in data-center-task). Defaults are proposals: travel keeps the
    // Journal (its notes carry the journey); service recommends none, because the view needs the
    // room, and a Journal the player places there shows as a strip.
    contexts: Object.freeze({
        idle: Object.freeze({label: 'idle', companions: Object.freeze(['records'])}),
        combat: Object.freeze({label: 'fight', when: Object.freeze({combat: true}), companions: Object.freeze(['opponents', 'skills'])}),
        travel: Object.freeze({label: 'travel', when: Object.freeze({signal: 'travel'}), companions: Object.freeze(['records'])}),
        service: Object.freeze({label: 'service', when: Object.freeze({centerTasks: Object.freeze(['mixing', 'crafting'])}), companions: Object.freeze([])}),
    }),
    contextPriority: Object.freeze(['combat', 'service', 'travel']),
    // UM3/UM8 (2026-10-22): the parity grid as data. A context names its grid (`grid`, default
    // 'standard'); each band applies from `minWidth` (CSS px) and gives its areas, one string per
    // row, and its column shares (fr). The host writes them as CSS variables and CSS keeps one
    // generic rule, so a composition with another region needs no CSS edit. Rows, gaps and the
    // top-row fit stay with shell_composition.js and the stylesheet.
    grids: Object.freeze({
        standard: Object.freeze([
            Object.freeze({minWidth: 1001, areas: Object.freeze(['player player focus log', 'inventory actions actions log']), columns: Object.freeze([336, 110, 446, 379])}),
            // R22b (SU6): at the primary target You takes Inventory's column width; the freed width goes to Around you.
            Object.freeze({minWidth: 1700, areas: Object.freeze(['player focus focus log', 'inventory actions actions log']), columns: Object.freeze([410, 100, 610, 410])}),
            Object.freeze({minWidth: 2800, areas: Object.freeze(['player focus focus log', 'inventory actions actions log']), columns: Object.freeze([420, 200, 700, 460])}),
        ]),
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
    // UIM1: surface fields for every panel the game registers. Types follow the ST table and its
    // TR2 rehoming; shell parts (You, Around you, Inventory, the place, current work) have no ST
    // type yet and stay UNSET until the surface types cover them. Contexts are filled only where
    // a contextual home or the panel's own eligibility fixes them (companions stay in `contexts`); reads use the UIX2 topic names.
    surfaces: Object.freeze({
        'vitals': surface(UNSET, {reads: ['body']}),
        'shell-character': surface(UNSET),
        'condition': surface('ST6', {home: 'Below You; native body and weather readers', frequency: 'continuous', status: 'proposal', reads: ['body', 'time', 'place'], representations: routed}),
        'status-window': surface(UNSET),
        'focus': surface(UNSET),
        'shell-detail': surface(UNSET, {contexts: ['idle', 'combat', 'travel', 'service']}),
        'belongings': surface(UNSET, {reads: ['inventory'], representations: routed}),
        'combat-controls': surface(UNSET),
        'shell-inventory-tools': surface(UNSET),
        'messages': surface('ST9', {representations: ['view', 'log']}),
        'shell-log-tools': surface('ST9'),
        'time': surface(UNSET, {reads: ['time']}),
        'location': surface(UNSET, {reads: ['place']}),
        'village-scene': surface(UNSET, {home: 'Village', reads: ['place']}),
        'current-work': surface(UNSET, {reads: ['work']}),
        'combat': surface(UNSET, {reads: ['combat'], contexts: ['combat']}),
        'stance': surface(UNSET, {reads: ['combat'], contexts: ['combat']}),
        'local-actions': surface('ST1', {reads: ['place'], representations: routed}),
        'practice-actions': surface('ST1'),
        'pane-navigation': surface(UNSET),
        'records': surface('ST6', {representations: routed}),
        'skills': surface(UNSET, {representations: routed}),
        'opponents': surface(UNSET, {contexts: ['combat']}),
        'preparation': surface(UNSET, {representations: routed}),
        'known-people': surface('ST6', {representations: routed}),
        'known-routes': surface('ST6'),
        'memories': surface('ST6'),
        'notebook': surface('ST6'),
        'reading-reference': surface('ST6'),
        'learned-preparations': surface(UNSET),
        'village-neighbors': surface('ST6', {home: 'Village'}),
        'village-travelers': surface('ST6', {home: 'Village', representations: routed}),
        'world-events': surface(UNSET),
        'patrol': surface('ST5'),
        'ledger': surface('ST5', {representations: routed}),
        'projects': surface('ST8', {representations: routed}),
        'herbal-experiments': surface(UNSET),
        'optional-worlds': surface('ST3', {representations: routed}),
        'beginning': surface('ST3', {representations: routed}),
        'continuation': surface(UNSET),
        'equipment-comparison': surface(UNSET),
        'tools': surface(UNSET),
        'homes': surface('ST2', {home: 'Known residences and Village home supplier', frequency: 'on demand', status: 'proposal', reads: ['inventory', 'place', 'time', 'body', 'rights'], representations: routed}),
        'gear-workshop': surface('ST2', {home: 'Native forging station; carried equipment', frequency: 'on demand', status: 'proposal', reads: ['inventory', 'equipment', 'place', 'time'], representations: routed}),
        'lotm': surface('ST2', {home: 'Tingen supervised workroom'}),
        'customization': surface('ST7', {representations: routed}),
        'customization-effects': surface('ST7'),
        'customization-preview': surface(UNSET),
        'customization-rules': surface(UNSET),
        'customization-sites': surface(UNSET),
        // Round 12 (2026-10-19, proposals): reference sections that read existing state. Opened from
        // More panels or the command palette; none adds a route, so the navigation bar keeps its size.
        'known-things': surface('ST6', {home: 'Reference dock; Journal companion space', frequency: 'occasional', status: 'proposal', reads: ['knowledge'], contexts: ['idle', 'travel', 'service']}),
        'statistics': surface('ST6', {home: 'Reference dock; Journal companion space', frequency: 'occasional', status: 'proposal', reads: ['work', 'combat', 'inventory'], contexts: ['idle', 'travel', 'service']}),
        'today': surface('ST5', {home: 'Beside the actions; Journal companion space', frequency: 'frequent', status: 'proposal', reads: ['time', 'place', 'work'], contexts: ['idle', 'travel']}),
        'around-place': surface('ST6', {home: 'Reference dock; session return and completed work notes', frequency: 'occasional', status: 'proposal', reads: ['place', 'inventory', 'knowledge', 'work'], contexts: ['idle', 'travel', 'service']}),
        'carcass-processing': surface('ST4', {home:'Place services; native processing owner',frequency:'frequent',status:'proposal',reads:['inventory','work','place'],contexts:['idle','service']}),
        'region-view': surface('ST2', {home: 'Beside the actions; keeper is the road itself', frequency: 'frequent', status: 'proposal', reads: ['place'], contexts: ['idle', 'travel']}),
        'companions': surface('ST6', {home: 'Side column beside You', frequency: 'occasional', status: 'proposal', reads: ['knowledge', 'time'], contexts: ['idle', 'travel', 'service']}),
        'loadouts': surface('ST4', {home: 'Beside Inventory', frequency: 'occasional', status: 'proposal', reads: ['inventory'], contexts: ['idle', 'service']}),
    }),
    // Center views that are not workspace panels; each opens through its own owner.
    views: Object.freeze({
        crafting: surface(UNSET, {representations: routed}),
        mixing: surface('ST2', {home: 'Village', representations: routed}),
    }),
    // UIM2: the navigation routes in bar order. `target` is a panel or view; `tab` selects a Journal
    // tab after opening; `open` names how the navigation opens it ('here', 'crafting', 'mixing',
    // 'in-place' for R13 Inventory, else expand); `select` is a control clicked after expanding;
    // `pane` is the route's position in the Center views panel, if it has one. Route IDs are stable: quick jump (UR28),
    // log links (UR29) and Back history (UR22) address surfaces by them.
    routes: Object.freeze([
        {id: 'local-actions', label: 'Here', key: 'h', target: 'local-actions', open: 'here', pane: 1},
        {id: 'preparation', label: 'Stats', key: 'e', target: 'preparation', select: 'character_show_stats'},
        {id: 'condition', label: 'Condition', key: 'o', target: 'condition'},
        {id: 'belongings', label: 'Inventory', key: 'i', target: 'belongings', open: 'in-place'},
        {id: 'crafting', label: 'Crafting', key: 'c', target: 'crafting', open: 'crafting', pane: 3},
        {id: 'mixing', label: 'Mixing', key: 'm', target: 'mixing', open: 'mixing', pane: 4},
        {id: 'records:quests', label: 'Journal', key: 'j', target: 'records', tab: 'journal_show_quests'},
        {id: 'records:bestiary', label: 'Bestiary', key: 'b', target: 'records', tab: 'journal_show_bestiary'},
        {id: 'records:books', label: 'Books', key: 'a', target: 'records', tab: 'journal_show_books'},
        {id: 'records:data', label: 'Data', key: 'd', target: 'records', tab: 'journal_show_data'},
        {id: 'records:notebook', label: 'Notebook', key: 'n', target: 'records', tab: 'journal_show_notebook'},
        {id: 'skills', label: 'Skills', key: 'k', target: 'skills', pane: 2},
        {id: 'known-people', label: 'People', key: 'p', target: 'known-people'},
        {id: 'village-travelers', label: 'Travelers', key: 't', target: 'village-travelers'},
        {id: 'projects', label: 'Projects', key: 'r', target: 'projects'},
        {id: 'ledger', label: 'Ledger', key: 'l', target: 'ledger'},
        {id: 'optional-worlds', label: 'Worlds', key: 'w', target: 'optional-worlds'},
        {id: 'beginning', label: 'Beginning', key: 'g', target: 'beginning'},
        {id: 'customization', label: 'Settings', key: 's', target: 'customization'},
    ].map(Object.freeze)),
});

// UIM2: the route table, one entry per route in bar order, each joined to its target's surface.
// Navigation, and later quick jump, log links and Back history, read this instead of a list.
// Object order is the DOM/reading order. The host has no second region list.
export function workspaceRegions(spec = LAYOUT_SPEC) {
    return Object.entries(spec.regions).map(([id, region]) => ({id, label: region.label ?? id}));
}

export function routeTable(spec = LAYOUT_SPEC) {
    return spec.routes.map(route => Object.freeze({...route, surface: spec.surfaces[route.target] || spec.views[route.target] || null}));
}
const tables = new WeakMap();
export function routeById(id, spec = LAYOUT_SPEC) {
    if (!tables.has(spec)) tables.set(spec, new Map(routeTable(spec).map(route => [route.id, route])));
    return tables.get(spec).get(id) || null;
}

// The context for the facts the shell reads: `combat`, `travel` (a boolean signal) and `task` (the
// open center view, if any). Pure; the spec's `when` rules and their order decide (UIL4).
export function contextOf({combat = false, travel = false, task = null} = {}, spec = LAYOUT_SPEC) {
    for (const name of spec.contextPriority) {
        const when = spec.contexts[name].when;
        if ((when.combat && combat) || (when.signal === 'travel' && travel) || (when.centerTasks && task && when.centerTasks.includes(task))) return name;
    }
    return 'idle';
}
export const contextLabel = (context, spec = LAYOUT_SPEC) => spec.contexts[context]?.label || context;

// UM8: the grid for a context at the current width. `atLeast(px)` answers the band's media test,
// so the host can use matchMedia. `shares` are each column's percent of the whole, for CSS that
// sizes against the default tracks (inventory composition).
export function gridTemplate({context = 'idle', atLeast}, spec = LAYOUT_SPEC) {
    const bands = spec.grids[spec.contexts[context]?.grid || 'standard'];
    const band = bands.filter(b => atLeast(b.minWidth)).at(-1) || bands[0];
    const total = band.columns.reduce((a, b) => a + b, 0);
    return {
        areas: band.areas.map(row => `"${row}"`).join(' '),
        columns: band.columns.map(c => `minmax(0,${c}fr)`).join(' '),
        shares: band.columns.map(c => `${(c / total * 100).toFixed(7)}%`),
    };
}

// The box a panel belongs to, if any.
export const boxOf = (id, spec = LAYOUT_SPEC) => Object.keys(spec.boxes).find(box => spec.boxes[box].panels.includes(id)) || null;

// R21: where a box sits under a placement ({boxes: {box: slot}, companions: {box: slot}}) for one
// context. A missing or unknown entry is the default, so an empty placement is the R20 layout.
export function boxRegion(box, placement = null, spec = LAYOUT_SPEC) {
    const def = spec.boxes[box]; if (!def) return null;
    const chosen = def.companion ? placement?.companions?.[box] : placement?.boxes?.[box];
    if (chosen && spec.slots[chosen] && (def.companion || chosen !== 'actions')) return chosen;
    return def.home || 'actions';
}

// Region for a panel ID in the parity shell.
export function regionFor(id, {combat = false, context = null, placement = null} = {}, spec = LAYOUT_SPEC) {
    const contextual = spec.contextual[id];
    if (contextual) { const at = contextual[context || contextOf({combat}, spec)] || contextual.idle; return at.startsWith('box:') ? boxRegion(at.slice(4), placement, spec) : at; }
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
export function companionsFor({combat, context = null, available}, spec = LAYOUT_SPEC) {
    return spec.contexts[context || contextOf({combat}, spec)].companions.filter(id => available.includes(id));
}

export function topRowHeight({player, focus, combat, board, fontSize, frame = LAYOUT_SPEC.topRow.framePx, elastic = 0, viewport = 0, below = null}, spec = LAYOUT_SPEC) {
    const t = spec.topRow, e = t.elastic;
    const elasticCap = Math.min(board * e.boardShare, Math.max(e.minPx, fontSize * e.lines, viewport * e.viewportShare));
    let need = Math.max(player, Math.min(player + elastic, elasticCap), combat ? focus : 0) + frame;
    const low = fontSize * t.minLines, high = Math.min(board * t.maxBoardShare, board - fontSize * t.bottomLines);
    // UIA12 (UR25, UR69): outside a fight, idle place prose and yielding stat rows may use space
    // the bottom row's measured content leaves free, instead of scrolling beside empty rows. Each
    // side keeps frame allowances for borders and the padding under its last line; the bottom row
    // also keeps one spare line. Measured only at stable moments like the rest of the fit (UR52).
    if (below !== null && !combat) need = Math.max(need, Math.min(Math.max(player + elastic + frame, focus + 2 * frame), board - below - 2 * frame - fontSize));
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
