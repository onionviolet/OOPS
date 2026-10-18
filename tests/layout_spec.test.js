import test from 'node:test';
import assert from 'node:assert/strict';
import { LAYOUT_SPEC, regionFor, shellOrder, companionsFor, companionPanels, topRowHeight } from '../src/layout_spec.js';

// R17 is structural (AR9): the spec must reproduce the R16 decisions exactly. The R16 code is kept
// here verbatim as the reference.
function r16ParityRegion(id, combat) {
    // R21c: the status window joins You (R16 sent it to the fallback, where the shell parked it).
    if (['vitals', 'shell-character', 'status-window'].includes(id)) return 'player';
    if (id === 'focus') return 'focus';
    if (id === 'shell-detail') return combat ? 'actions' : 'focus';
    if (['belongings', 'combat-controls', 'shell-inventory-tools'].includes(id)) return 'inventory';
    if (['messages', 'shell-log-tools'].includes(id)) return 'log';
    if (['records', 'skills'].includes(id)) return 'actions';
    return 'actions';
}
const r16Order = companions => ['vitals', 'shell-character', 'status-window', 'combat-controls', 'shell-inventory-tools', 'belongings', 'focus', 'shell-detail', 'time', 'location', 'village-scene', 'current-work', 'combat', 'local-actions', ...companions, 'pane-navigation', 'messages', 'shell-log-tools'];
// Every panel ID registered by the game at R17 start, plus an unknown one.
const IDS = ['vitals', 'time', 'location', 'combat-controls', 'skills', 'records', 'preparation', 'belongings', 'local-actions', 'messages',
    'beginning', 'combat', 'continuation', 'current-work', 'customization', 'customization-effects', 'customization-preview', 'customization-rules', 'customization-sites',
    'equipment-comparison', 'focus', 'herbal-experiments', 'known-people', 'known-routes', 'ledger', 'memories', 'notebook', 'optional-worlds', 'pane-navigation', 'patrol',
    'projects', 'reading-reference', 'shell-character', 'shell-detail', 'shell-inventory-tools', 'shell-log-tools', 'stance', 'status-window', 'village-neighbors',
    'village-scene', 'village-travelers', 'world-events', 'some-future-panel'];

test('every panel lands in the same region as in R16, idle and in a fight', () => {
    for (const combat of [false, true]) for (const id of IDS) assert.equal(regionFor(id, {combat}), r16ParityRegion(id, combat), `${id} combat=${combat}`);
});

test('default shell order matches R16 for the parity shell and the plain shell', () => {
    assert.deepEqual(shellOrder({parity: true}), r16Order(['records', 'skills']));
    assert.deepEqual(shellOrder({parity: false}), r16Order([]));
    assert.deepEqual(companionPanels(), ['records', 'skills']);
});

test('companions and top-row numbers match R16 (R21: Skills left the idle default)', () => {
    assert.deepEqual(companionsFor({combat: false, available: ['skills', 'records', 'x']}), ['records']);
    assert.deepEqual(companionsFor({combat: true, available: ['skills', 'records']}), ['skills']);
    // R16 formula with its literal numbers.
    const r16 = ({player, focus, combat, board, fontSize, frame = 6, elastic = 0, viewport = 0}) => {
        const cap = Math.min(board * 0.55, Math.max(240, fontSize * 17.5, viewport * 0.38));
        const need = Math.max(player, Math.min(player + elastic, cap), combat ? focus : 0) + frame;
        return Math.round(Math.max(fontSize * 10, Math.min(Math.min(board * 0.62, board - fontSize * 11), need)));
    };
    for (const fontSize of [14, 17.5, 21]) for (const board of [500, 688, 1000, 1348]) for (const player of [20, 200, 330, 900])
        for (const elastic of [0, 126]) for (const combat of [false, true]) {
            const args = {player, focus: 390, combat, board, fontSize, elastic, viewport: board + 80, frame: 6 + Math.ceil(fontSize * 0.6)};
            assert.equal(topRowHeight(args), r16(args), JSON.stringify(args));
        }
});

test('a panel can be moved or a companion added by data alone', () => {
    const spec = {...LAYOUT_SPEC, regions: {...LAYOUT_SPEC.regions, log: {panels: ['messages', 'shell-log-tools', 'world-events']}},
        contexts: {...LAYOUT_SPEC.contexts, idle: {companions: ['records', 'skills', 'known-routes']}}};
    assert.equal(regionFor('world-events', {}, spec), 'log');
    assert.deepEqual(companionsFor({combat: false, available: ['known-routes', 'records']}, spec), ['records', 'known-routes']);
    assert.deepEqual(shellOrder({parity: true}, spec).slice(14, 17), ['records', 'skills', 'known-routes']);
});

// R21 (MB1): placement moves boxes between slots; an empty placement is the R20 layout.
test('R21 placement: swaps main boxes, places companions, keeps the log and defaults', async () => {
    const {boxRegion, regionFit} = await import('../src/layout_spec.js');
    const {normalizePlacement, moveBox, resetContext, isDefault, swapCompanions} = await import('../src/shell_layout_edit.js');
    for (const combat of [false, true]) for (const id of IDS) assert.equal(regionFor(id, {combat, placement: {boxes: {}, companions: {}}}), regionFor(id, {combat}), id);
    let p = normalizePlacement(null);
    assert.equal(isDefault(p, 'idle'), true);
    p = moveBox(p, 'idle', 'inventory', 'player');
    assert.equal(boxRegion('inventory', p.contexts.idle), 'player');
    assert.equal(boxRegion('you', p.contexts.idle), 'inventory', 'You swaps into the slot Inventory left');
    assert.equal(regionFor('belongings', {placement: p.contexts.idle}), 'player');
    assert.equal(regionFor('vitals', {combat: true, placement: p.contexts.combat}), 'player', 'the fight layout is separate');
    p = moveBox(p, 'idle', 'you', 'player');
    assert.deepEqual(p.contexts.idle.boxes, {}, 'moving back home clears the entries');
    assert.equal(moveBox(p, 'idle', 'you', 'log').contexts.idle.boxes.you, undefined, 'the log is not a slot (UR11)');
    assert.equal(moveBox(p, 'idle', 'you', 'actions').contexts.idle.boxes.you, undefined, 'main boxes do not join the actions');
    p = moveBox(p, 'idle', 'journal', 'inventory');
    assert.equal(regionFor('records', {placement: p.contexts.idle}), 'inventory');
    p = swapCompanions(p, 'idle'); assert.equal(p.contexts.idle.swap, true);
    p = moveBox(p, 'idle', 'around', 'inventory');
    assert.equal(regionFor('shell-detail', {placement: p.contexts.idle}), 'inventory', 'item detail follows Around you');
    assert.equal(isDefault(resetContext(p, 'idle'), 'idle'), true);
    assert.equal(normalizePlacement({version: 1, spec: 1, contexts: {idle: {boxes: {you: 'focus'}}}}).stale, true, 'an older spec version is dropped (GU6)');
    assert.equal(regionFit(['vitals', 'shell-character']), 'content');
    assert.equal(regionFit(['focus']), 'combat');
    assert.equal(regionFit(['belongings', 'records']), 'fill');
});

// UIL1: v3 keeps every R21 navigation route, label and hotkey, and v2 placements read unchanged.
test('UIL1 route table keeps the R21 routes, labels, hotkeys and tabs in bar order', async () => {
    const {routeTable, routeById} = await import('../src/layout_spec.js');
    const r21 = [['Here','h','local-actions'],['Stats','e','preparation'],['Inventory','i','belongings'],['Crafting','c','crafting'],['Mixing','m','mixing'],
        ['Journal','j','records','journal_show_quests'],['Bestiary','b','records','journal_show_bestiary'],['Books','a','records','journal_show_books'],
        ['Data','d','records','journal_show_data'],['Notebook','n','records','journal_show_notebook'],['Skills','k','skills'],
        ['People','p','known-people'],['Travelers','t','village-travelers'],['Projects','r','projects'],['Ledger','l','ledger'],
        ['Worlds','w','optional-worlds'],['Beginning','g','beginning'],['Settings','s','customization']];
    assert.deepEqual(routeTable().map(r => [r.label, r.key, r.target, ...(r.tab ? [r.tab] : [])]), r21);
    assert.deepEqual(routeTable().filter(r => r.pane).sort((x, y) => x.pane - y.pane).map(r => r.label), ['Here', 'Skills', 'Crafting', 'Mixing'], 'Center views keep their R21 order');
    assert.equal(routeById('records:bestiary').tab, 'journal_show_bestiary');
    assert.equal(routeById('belongings').open, 'in-place');
});

test('UIL1 v3 reads v2 placements unchanged and still drops v1 (GU6)', async () => {
    const {normalizePlacement} = await import('../src/shell_layout_edit.js');
    const v2 = {version: 1, spec: 2, contexts: {idle: {boxes: {inventory: 'player'}, companions: {journal: 'inventory'}, swap: true}, combat: {boxes: {}, companions: {}, swap: false}}};
    const read = normalizePlacement(v2);
    assert.equal(LAYOUT_SPEC.version, 3);
    assert.equal(read.stale, false);
    assert.equal(read.spec, 3);
    assert.deepEqual(read.contexts, v2.contexts);
    assert.equal(regionFor('belongings', {placement: read.contexts.idle}), 'player');
    assert.equal(normalizePlacement({...read}).stale, false, 'a v3 placement reads back');
    assert.equal(normalizePlacement({version: 1, spec: 1, contexts: v2.contexts}).stale, true);
});
