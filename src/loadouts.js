import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {registerPaletteSource} from './command_palette.js';
import {expandWorkspaceModule} from './workspace_layout.js';
import {node, syncList, visibleRenderer, plural} from './reference_kit.js';

// SX2: Loadouts. Named sets of worn gear. A set remembers which item sits in which slot; equipping
// it goes through the game's own equip path, one slot at a time, so every rule (combat, work,
// living gear, durability instances) applies exactly as it does when you equip by hand. The set
// holds item keys, never copies of items: an item you no longer hold shows as missing and is
// skipped, and equipping reports what it could and could not do.
//
// Default: equipping a set changes only the slots the set names. Dial: "also take off other slots"
// bares the rest through the native unequip path. Limit: MAX_SETS sets of up to 32 characters each.
//
// Save: slice `loadouts` = {schema: 1, sets: [{name, slots: {slot: itemKey}}]}. A save without it
// starts empty (migration: none needed, AR6). It is written with the game's own save, so a set
// made now is kept by the next autosave or by Save.

export const SCHEMA = 1, MAX_SETS = 12, MAX_NAME = 32;
export const fresh = () => ({schema: SCHEMA, sets: []});
const clean = name => String(name ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);

// Throws on a damaged slice; a missing one is handled by migrate.
export function validateLoadouts(slice) {
    if (slice == null) return;
    const bad = reason => { throw new Error(`Invalid loadouts: ${reason}`); };
    if (typeof slice !== 'object' || Array.isArray(slice) || slice.schema !== SCHEMA || !Array.isArray(slice.sets)) bad('shape');
    if (slice.sets.length > MAX_SETS) bad('too many sets');
    const seen = new Set();
    for (const set of slice.sets) {
        if (!set || typeof set.name !== 'string' || clean(set.name) !== set.name || !set.name || seen.has(set.name)) bad('name');
        seen.add(set.name);
        if (!set.slots || typeof set.slots !== 'object' || Array.isArray(set.slots)) bad('slots');
        for (const [slot, key] of Object.entries(set.slots)) if (!/^[a-z_-]{2,20}$/.test(slot) || typeof key !== 'string' || !key) bad('slot entry');
    }
}
export const migrateLoadouts = slice => (slice == null ? fresh() : structuredClone(slice));

// Pure: what equipping `set` would do, given the worn keys and the held keys.
// worn {slot: key|null}, held: array of keys. Returns one row per slot the set names.
const baseKey = key => { try { const data = JSON.parse(key); delete data.e2_instance; return JSON.stringify(data); } catch { return key; } };
export function planLoadout(set, worn, held, {bareOthers = false} = {}) {
    const rows = [];
    const unused = [...held];
    for (const [slot, key] of Object.entries(set.slots)) {
        if (worn[slot] === key) { rows.push({slot, key, action: 'keep'}); continue; }
        let use = unused.indexOf(key);
        // The same item under another durability instance is still that item.
        if (use < 0) use = unused.findIndex(k => baseKey(k) === baseKey(key));
        if (use < 0 && worn[slot] && baseKey(worn[slot]) === baseKey(key)) { rows.push({slot, key, action: 'keep'}); continue; }
        if (use < 0) { rows.push({slot, key, action: 'missing'}); continue; }
        rows.push({slot, key: unused[use], action: 'equip', replaces: worn[slot] || null}); unused.splice(use, 1);
    }
    if (bareOthers) for (const [slot, key] of Object.entries(worn)) if (key && !(slot in set.slots)) rows.push({slot, key, action: 'bare'});
    return rows;
}

let state = fresh();
const listeners = new Set();
const changed = () => { for (const fn of listeners) fn(); };

export function saveCurrentAs(name, slots) {
    const label = clean(name); if (!label) throw new Error('Name the loadout first.');
    if (!Object.keys(slots).length) throw new Error('Wear something first; there is nothing to remember.');
    const index = state.sets.findIndex(s => s.name === label);
    if (index < 0 && state.sets.length >= MAX_SETS) throw new Error(`You can keep ${MAX_SETS} loadouts. Delete one first.`);
    const next = {name: label, slots: {...slots}};
    state = {...state, sets: index < 0 ? [...state.sets, next] : state.sets.map((s, i) => (i === index ? next : s))};
    changed(); return label;
}
export function deleteLoadout(name) { state = {...state, sets: state.sets.filter(s => s.name !== name)}; changed(); }

function readWorn() {
    const equipment = readPort('character')?.getEquipment?.() || {}, worn = {}, names = {};
    for (const [slot, item] of Object.entries(equipment)) if (item) { try { worn[slot] = item.getInventoryKey(); names[worn[slot]] = item.getName?.() || slot; } catch { /* skip an unreadable item */ } }
    return {worn, names};
}
function readHeld() {
    const items = readPort('character')?.getItems?.() || {}, held = [], names = {};
    for (const [key, row] of Object.entries(items)) if (row?.item?.tags?.equippable) { held.push(key); names[key] = row.item.getName?.() || key; }
    return {held, names};
}
const slotLabel = slot => slot.replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase());
const nameOf = (key, names) => names[key] || (() => { try { return JSON.parse(key).id || key; } catch { return key; } })();

// Items-only totals so a swap shows its size: attack from weapons, defense from armour.
function totals(character, keys) {
    let attack = 0, defense = 0;
    const equipment = character?.getEquipment?.() || {}, items = character?.getItems?.() || {};
    for (const key of keys) {
        const item = Object.values(equipment).find(i => i?.getInventoryKey?.() === key) || items[key]?.item; if (!item) continue;
        try { attack += Number(item.getAttack?.()) || 0; } catch { /* not a weapon */ }
        try { defense += Number(item.getDefense?.()) || 0; } catch { /* not armour */ }
    }
    return {attack, defense};
}
const fmt = n => (Math.round(n * 10) / 10).toLocaleString();

const hasGear = () => state.sets.length > 0 || Object.keys(readWorn().worn).length > 0 || readHeld().held.length > 1;

function createLoadoutsPanel() {
    const panel = node('section', null, {id: 'loadouts_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'quick-confirm';
    const intro = node('p', 'Remember what you are wearing, then put it back on in one step. Equipping uses the normal equip rules; an item you no longer hold is skipped and named.');
    const name = node('input', null, {type: 'text', maxlength: String(MAX_NAME), placeholder: 'Name this gear set', 'aria-label': 'Loadout name'});
    const save = node('button', 'Save current gear', {type: 'button'});
    const bare = node('input', null, {type: 'checkbox', id: 'loadouts_bare'}), bareLabel = node('label', 'Also take off slots the set does not name', {for: 'loadouts_bare'});
    const status = node('p', '', {role: 'status', 'aria-live': 'polite'}), list = node('ul', null, {'aria-label': 'Loadouts'});
    status.className = 'reference-empty';
    panel.append(node('h2', 'Loadouts'), intro, name, save, bare, bareLabel, status, list);

    const say = text => { status.textContent = text; };
    save.onclick = () => {
        try { const label = saveCurrentAs(name.value, readWorn().worn); name.value = ''; say(`Saved "${label}". It is kept with your next save.`); } catch (e) { say(e.message); }
    };
    name.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); save.click(); } });

    function equipSet(set) {
        const {worn} = readWorn(), {held} = readHeld(), plan = planLoadout(set, worn, held, {bareOthers: bare.checked});
        const log = {done: 0, kept: 0, missing: [], refused: []};
        for (const row of plan) {
            if (row.action === 'keep') { log.kept++; continue; }
            if (row.action === 'missing') { log.missing.push(slotLabel(row.slot)); continue; }
            if (row.action === 'bare') { readPort('unequip', row.slot); if (readWorn().worn[row.slot]) log.refused.push(slotLabel(row.slot)); else log.done++; continue; }
            readPort('equip', row.key);
            if (readWorn().worn[row.slot] && baseKey(readWorn().worn[row.slot]) === baseKey(row.key)) log.done++; else log.refused.push(slotLabel(row.slot));
        }
        const parts = [`Equipped ${plural(log.done, 'slot')}`];
        if (log.kept) parts.push(`${log.kept} already as set`);
        if (log.missing.length) parts.push(`not held: ${log.missing.join(', ')}`);
        if (log.refused.length) parts.push(`refused, see the log: ${log.refused.join(', ')}`);
        say(`${set.name}: ${parts.join('; ')}.`); render(true);
    }

    const render = visibleRenderer(panel, () => ({sets: state.sets, ...readWorn(), ...readHeld(), bare: bare.checked}), view => {
        const rows = view.sets.map(set => {
            const plan = planLoadout(set, view.worn, view.held);
            const parts = plan.map(r => `${slotLabel(r.slot)}: ${nameOf(r.key, {...view.names})} (${r.action === 'keep' ? 'worn' : r.action === 'equip' ? 'held' : 'not held'})`);
            const character = readPort('character');
            const after = Object.fromEntries(Object.entries(view.worn)); for (const r of plan) if (r.action === 'equip') after[r.slot] = r.key;
            const a = totals(character, Object.values(view.worn)), b = totals(character, Object.values(after));
            return {key: `set:${set.name}`, name: set.name, detail: `${parts.join(' · ')} · items only, attack ${fmt(a.attack)} → ${fmt(b.attack)}, defense ${fmt(a.defense)} → ${fmt(b.defense)}`};
        });
        syncList(list, rows, 'No loadouts yet. Wear what you want to keep, name it above and save.');
        for (const li of list.children) {
            const set = view.sets.find(s => `set:${s.name}` === li.dataset.key); if (!set) continue;
            if (!li.querySelector('[data-loadout-equip]')) {
                const go = node('button', 'Equip', {type: 'button'}), replace = node('button', 'Replace with current gear', {type: 'button'}), del = node('button', 'Delete', {type: 'button'});
                go.dataset.loadoutEquip = ''; replace.dataset.loadoutReplace = ''; del.dataset.loadoutDelete = '';
                li.append(go, replace, del);
            }
            const [go, replace, del] = li.querySelectorAll('button');
            go.setAttribute('aria-label', `Equip ${set.name}`); replace.setAttribute('aria-label', `Replace ${set.name} with current gear`); del.setAttribute('aria-label', `Delete ${set.name}`);
            go.onclick = () => equipSet(set);
            replace.onclick = () => { try { saveCurrentAs(set.name, readWorn().worn); say(`Updated "${set.name}" to what you wear now.`); } catch (e) { say(e.message); } };
            del.onclick = () => { deleteLoadout(set.name); say(`Deleted "${set.name}".`); };
        }
    });
    bare.addEventListener('change', () => render(true));
    panel.render = render; panel.focusSet = setName => { render(true); panel.querySelector(`li[data-key="${CSS.escape(`set:${setName}`)}"] button`)?.focus(); };
    listeners.add(() => render(true));
    whenPortsReady(() => render(true));
    definePanel({id: 'loadouts', title: 'Loadouts', role: 'character', node: panel, home: document.getElementById('main_content'),
        discovered: hasGear, eligible: hasGear, emptyText: 'Wear or carry some gear to keep sets of it'});
    return panel;
}

let panel = null;
registerDomain({id: 'loadouts', deps: [], initialState: fresh,
    save: () => (state.sets.length ? structuredClone(state) : undefined),
    validate: validateLoadouts, migrate: migrateLoadouts,
    load: slice => { state = slice ? structuredClone(slice) : fresh(); changed(); },
    refresh: () => panel?.render(false), panels: [() => { panel = createLoadoutsPanel(); }]});

registerPaletteSource('loadouts', () => state.sets.map(set => ({label: set.name, group: 'Loadouts', detail: 'open this gear set', run: () => { expandWorkspaceModule('loadouts'); panel?.focusSet(set.name); }})));
