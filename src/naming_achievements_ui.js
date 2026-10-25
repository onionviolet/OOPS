import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, visibleRenderer} from './reference_kit.js';
import {createNativeDiscoveryFeedback} from './native_discovery_feedback.js';
import {equipmentDurability as durability} from './absorb_e2/durability.js';
import {streamSeed} from './seeded_streams.js';
import {generateThingName} from './name_grammar.js';
import {emptyNaming, validateNaming, namingState, setNamingState, quoteNaming, executeNaming, applyNamedIdentity, opportunities, NAME_MAX} from './naming_act.js';
import {achievement_catalog, achievementView, readProfile, unlockEarned} from './achievements.js';
import {title_catalog} from './titles.js';

// G6 surface (AR2, AR4): one domain owns the `naming` save slice and one Character-area panel shows the
// naming act and the profile achievements. Target: desktop/laptop; mobile deferred (UR standing priority).
// Achievements are profile-level (localStorage), never in the save; they unlock from refresh, not a timer (AR3).
const storage = () => { try { return globalThis.localStorage; } catch { return null; } };
const instanceOf = item => { try { return JSON.parse(item.getInventoryKey()).e2_instance || null; } catch { return null; } };

function gear() {
    const eq = readPort('character')?.getEquipment?.() || {};
    return Object.entries(eq).flatMap(([slot, item]) => { const instance = item && instanceOf(item); return instance ? [{slot, item, instance, base: item.__baseGetName ? item.__baseGetName() : item.getName()}] : []; });
}
const request = (row, name, bestow = true) => ({instance: row.instance, name, bestow, uses: durability.uses(row.item), armor: !!row.item.components?.internal,
    seed: streamSeed(readPort('expansion'), 'text', `naming:${row.instance}`), counters: readPort('counters') || {}});

function facts() {
    const c = readPort('counters') || {}, named = Object.values(namingState().named);
    return {counters: c, titlesHeld: readPort('character')?.titles ? Object.keys(readPort('character').titles).filter(id => title_catalog.some(t => t.id === id)).length : 0,
        named: named.length, relics: named.filter(r => r.tier !== 'named').length};
}

function createPanel() {
    const panel = node('section', null, {id: 'naming_panel', class: 'reference-panel expedition_panel'});
    const intro = node('p', 'Name a piece of gear you carry. A name is yours; wear and use are what earn a piece a quality.');
    const opp = node('p', '', {'data-naming-opportunities': ''}), list = node('ul', null, {'aria-label': 'Gear you can name'});
    const status = node('p', '', {role: 'status', 'aria-live': 'polite'}), toast = node('p', '', {role: 'status', 'aria-live': 'polite', 'data-achievement-toast': ''}), achTitle = node('h3', 'Achievements'), ach = node('ul', null, {'aria-label': 'Achievements'});
    const achNote = node('p', 'Kept on this device for you, across lives. Achievements grant no power by themselves.');
    panel.append(node('h2', 'Naming and achievements'), intro, opp, list, status, achTitle, toast, achNote, ach);
    const feedback = createNativeDiscoveryFeedback({container: panel, readSettings: () => readPort('presentation') || {}, eventType: 'native-achievement-discovery',
        anchorAttribute: 'data-achievement-id', singular: 'Achievement unlocked', plural: 'achievements',
        resolve: id => { const a = achievement_catalog.find(x => x.id === id); return a && readProfile(storage()).unlocked[id] ? {label: a.name} : null; }});
    let rows = [];
    const render = visibleRenderer(panel, () => ({gear: gear().map(g => ({i: g.instance, n: g.base, named: namingState().named[g.instance]?.name || ''})), opp: opportunities(namingState(), readPort('counters') || {}),
        ach: storage() ? achievementView(readProfile(storage())) : []}), view => {
        opp.textContent = `Naming opportunities: ${view.opp.available} available (${view.opp.used} used of ${view.opp.earned} earned). More come with crafting and fighting.`;
        rows = gear();
        list.replaceChildren(...(rows.length ? rows.map(row => {
            const li = node('li'), input = node('input', null, {type: 'text', maxlength: String(NAME_MAX), 'aria-label': `Name for ${row.base}`, placeholder: 'A name'});
            input.value = namingState().named[row.instance]?.name || '';
            const suggest = node('button', 'Suggest', {type: 'button'}), go = node('button', namingState().named[row.instance] ? 'Rename' : 'Name it', {type: 'button'}), preview = node('span', '', {class: 'naming_preview'});
            const quote = () => quoteNaming(namingState(), request(row, input.value));
            const refresh = () => { const q = quote(); preview.textContent = q.eligible ? ` ${q.relic.clauses.map(c => c.text).join(' ')}` : ` ${q.reason}`; go.disabled = !q.eligible; };
            input.addEventListener('input', refresh); refresh();
            suggest.onclick = () => { const used = Object.values(namingState().named).map(r => r.name);
                input.value = generateThingName({seed: request(row, '').seed, key: row.instance, kind: 'item', used}).name; refresh(); };
            go.onclick = () => { try {
                const q = quote(); const rec = executeNaming(namingState(), q, quote);
                applyNamedIdentity(row.item, rec); { const held = readPort('character')?.getItems?.()?.[row.item.getInventoryKey()]?.item; if (held && held !== row.item) applyNamedIdentity(held, rec); } const hero = readPort('character');
                // The hero may rebuild its equipped object when stats refresh; name whichever object is worn now.
                const wornNow = () => { const cur = hero?.getEquipment?.()[row.slot]; if (cur && cur !== row.item) applyNamedIdentity(cur, rec); };
                wornNow(); hero?.updateStatsAndDisplay?.(); wornNow(); hero?.updateStatsAndDisplay?.(); readPort('refreshGear');
                status.textContent = `${rec.name} is named.`; check(); render(true);
            } catch (e) { status.textContent = e.message; } };
            li.append(node('b', row.base), document.createTextNode(' '), input, suggest, go, preview);
            return li;
        }) : [node('li', 'Equip something and it can be named here.')]));
        ach.replaceChildren(...view.ach.map(a => { const li = node('li', `${a.held ? '✓ ' : ''}${a.name}: ${a.text}`, {class: a.held ? 'title_held' : 'title_locked'}); li.dataset.achievementId = a.id; return li; }));
    });
    function check() {
        const s = storage(); if (!s) return;
        const earned = unlockEarned(s, facts());
        if (earned.length) { for (const id of earned) readPort('logAchievement', `Achievement unlocked: ${achievement_catalog.find(a => a.id === id).name}. ${achievement_catalog.find(a => a.id === id).text}`);
            toast.textContent = `Achievement unlocked: ${earned.map(id => achievement_catalog.find(a => a.id === id).name).join(', ')}.`; render(true);
            for (const id of earned) feedback.publish({type: 'native-achievement-discovery', id, settled: true}); }
    }
    panel.render = render; panel.check = check;
    whenPortsReady(() => { render(true); check(); });
    definePanel({id: 'naming', title: 'Naming and achievements', role: 'character', node: panel, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true, emptyText: 'Nothing to name yet'});
    return panel;
}

let panel = null;
registerDomain({id: 'naming', deps: [], initialState: emptyNaming, save: () => namingState(), validate: slice => { if (slice !== undefined) validateNaming(slice); },
    load: slice => setNamingState(validateNaming(slice)), refresh: () => { panel?.check(); panel?.render(false); }, panels: [() => { panel = createPanel(); }]});
