import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {expandWorkspaceModule} from './workspace_layout.js';
import {registerPaletteSource} from './command_palette.js';
import {registerChangeCounter} from './change_badges.js';
import {node, createTabs, syncList, visibleRenderer, plural} from './reference_kit.js';

// SX1: Known things. One searchable reference over what the player has already met: creatures
// fought, books begun, items found and places reached. It reads the records the Bestiary, the
// Anthology, the item log and the location list already keep; it keeps no state of its own and
// never lists a thing the player has not met, so it cannot show a sealed discovery early. People
// stay in the People panel, which owns what the player knows about each of them.

export const KINDS = Object.freeze([
    {id: 'creatures', label: 'Creatures', empty: 'Defeat an enemy and it is recorded here.'},
    {id: 'books', label: 'Books', empty: 'Start reading a book and it is recorded here.'},
    {id: 'items', label: 'Items', empty: 'Pick something up and it is recorded here.'},
    {id: 'places', label: 'Places', empty: 'Travel somewhere new and it is recorded here.'},
]);

// Pure: records in, rows out, so the same projection serves the panel and the palette.
export function projectKnownThings({kills = {}, enemies = {}, bookProgress = {}, bookItems = {}, found = {}, itemTemplates = {}, places = []}) {
    const byName = (a, b) => a.name.localeCompare(b.name);
    const creatures = Object.entries(kills).filter(([, n]) => n > 0).map(([id, n]) => ({key: `creature:${id}`, name: enemies[id]?.name || id, detail: `${plural(n, 'defeat')}`})).sort(byName);
    const books = Object.entries(bookProgress).filter(([, b]) => b && b.accumulated_time > 0).map(([name, b]) => {
        const done = b.required_time > 0 && b.accumulated_time >= b.required_time;
        const pct = b.required_time > 0 ? Math.min(99, Math.floor(100 * b.accumulated_time / b.required_time)) : 0;
        return {key: `book:${name}`, name: bookItems[name]?.name || name, detail: done ? 'Finished' : `${pct}% read`};
    }).sort(byName);
    const items = Object.entries(found).filter(([, row]) => row && row.number > 0).map(([id, row]) => ({key: `item:${id}`, name: itemTemplates[id]?.name || id, detail: `${row.number.toLocaleString()} found`})).sort(byName);
    const placesRows = places.map(p => ({key: `place:${p.id}`, name: p.name, detail: p.detail})).sort(byName);
    return {creatures, books, items, places: placesRows};
}

// The records arrive through the `records` port (AR4): the same tables the Bestiary, the Anthology,
// the item log and the travel buttons read, so this reference cannot disagree with them.
let memo = {at: -Infinity, value: null};
function readRecords() {
    // Discovery and the palette both ask often; one reading serves a short moment.
    const now = performance.now();
    if (memo.value && now - memo.at < 400) return memo.value;
    memo = {at: now, value: readRecordsNow()};
    return memo.value;
}
function readRecordsNow() {
    const r = readPort('records');
    if (!r) return projectKnownThings({});
    const places = [];
    for (const [id, location] of Object.entries(r.locations || {})) {
        let unlocked = false; try { unlocked = !!location.isUnlocked?.(); } catch { unlocked = false; }
        if (unlocked) places.push({id, name: location.name || id, detail: location.parent_location ? `In ${location.parent_location.name}` : 'Region'});
    }
    return projectKnownThings({kills: r.enemy_killcount, enemies: r.enemy_templates, bookProgress: r.book_stats, bookItems: r.item_templates, found: r.item_log?.items, itemTemplates: r.item_templates, places});
}

export const matches = (row, query) => !query || `${row.name} ${row.detail || ''}`.toLowerCase().includes(query.toLowerCase());

const hasAny = () => Object.values(readRecords()).some(rows => rows.length > 0);

function createKnownThingsPanel() {
    const panel = node('section', null, {id: 'known_things_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const intro = node('p', 'Everything you have met, in one place. Search narrows the list; nothing here changes the game.');
    const search = node('input', null, {type: 'search', placeholder: 'Search what you have met', 'aria-label': 'Search known things'});
    const status = node('p', '', {role: 'status', 'aria-live': 'polite'}); status.className = 'reference-empty';
    const list = node('ul', null, {'aria-label': 'Matches'});
    const tabs = createTabs({label: 'Kinds of known things', tabs: KINDS, onSelect: () => render(true)});
    const people = node('button', 'Open People', {type: 'button'}); people.title = 'People you know are kept in the People panel';
    people.onclick = () => expandWorkspaceModule('known-people');
    panel.append(node('h2', 'Known things'), intro, tabs.bar, search, status, list, people);
    let records = readRecords();
    const render = visibleRenderer(panel, () => { records = readRecords(); return {tab: tabs.active(), q: search.value, records}; }, view => {
        const kind = KINDS.find(k => k.id === view.tab), rows = view.records[view.tab] || [], shown = rows.filter(row => matches(row, view.q));
        syncList(list, shown, rows.length ? 'Nothing you have met matches that.' : kind.empty);
        status.textContent = rows.length ? `${shown.length} of ${plural(rows.length, kind.label.toLowerCase().replace(/s$/, ''))}` : '';
    });
    search.addEventListener('input', () => render(true));
    panel.openAt = (tab, query = '') => { tabs.select(tab); search.value = query; render(true); };
    panel.render = render;
    whenPortsReady(() => render(true));
    definePanel({id: 'known-things', title: 'Known things', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: hasAny, eligible: hasAny, emptyText: 'Meet something to see it here'});
    return panel;
}

let panel = null;
registerDomain({id: 'known-things', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createKnownThingsPanel(); }]});

// The palette finds these by name and opens the panel on that row.
registerPaletteSource('known-things', () => {
    const records = readRecords(), out = [];
    for (const kind of KINDS) for (const row of records[kind.id]) out.push({label: row.name, group: 'Known', detail: `${kind.label.replace(/s$/, '')} · ${row.detail}`, run: () => { expandWorkspaceModule('known-things'); panel?.openAt(kind.id, row.name); }});
    return out;
});

// A count of things recorded since the panel was last on screen (GU8), on its More-panels entry.
registerChangeCounter('known-things', {read: () => { if (!readPort('records')) return null; const records = readRecords(); return KINDS.flatMap(kind => records[kind.id].map(row => row.key)); }, showing: () => !!panel?.checkVisibility?.()});
