import {registerDomain, domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, visibleRenderer} from './reference_kit.js';
import {createNativeDiscoveryFeedback} from './native_discovery_feedback.js';
import {readProfile, unlockEarned} from './achievements.js';
import {deed_catalog, deedFacts, deedView, observedRoutes} from './deeds.js';
import {residenceState} from './home_domain.js';

// Deeds surface (G6 widened, AR2/AR4): one Records panel over the profile store achievements.js owns. No save slice:
// the domain only reads on refresh and unlocks into the profile (localStorage, outside the save, survives a new run).
// Target: desktop 1920x1080; mobile deferred (standing UI priority). Unlocks come from refresh, not a timer (AR3).
const storage = () => { try { return globalThis.localStorage; } catch { return null; } };
const stamp = at => { if (!at) return ''; const d = new Date(at); return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10); };

export function liveDeedFacts() {
    return deedFacts({expansion: readPort('expansion'), residences: (() => { try { return residenceState(); } catch { return null; } })(),
        beatLedger: domainRegistry.project('beatLedger'), canonPull: domainRegistry.project('canonPull'),
        continuation: readPort('continuation'), lifeRecord: readPort('lifeRecord'), routes: observedRoutes()});
}

function createPanel() {
    const panel = node('section', null, {id: 'deeds_panel', class: 'reference-panel expedition_panel'});
    const intro = node('p', 'What you have done, across every life and world. Deeds are kept on this device and grant no power.');
    const toast = node('p', '', {role: 'status', 'aria-live': 'polite', 'data-deed-toast': ''}), body = node('div', null, {'data-deed-groups': ''});
    panel.append(node('h2', 'Deeds'), intro, toast, body);
    const feedback = createNativeDiscoveryFeedback({container: panel, readSettings: () => readPort('presentation') || {}, eventType: 'native-deed-discovery',
        anchorAttribute: 'data-deed-id', singular: 'Deed done', plural: 'deeds',
        resolve: id => { const d = deed_catalog.find(x => x.id === id); return d && readProfile(storage()).unlocked[id] ? {label: d.name} : null; }});
    const render = visibleRenderer(panel, () => ({groups: storage() ? deedView(readProfile(storage())) : []}), view => {
        body.replaceChildren(...view.groups.map(g => {
            const done = g.rows.filter(r => r.held).length, list = node('ul', null, {'aria-label': g.label});
            list.append(...g.rows.map(r => {
                const li = node('li', null, {class: r.held ? 'title_held' : 'title_locked'}); li.dataset.deedId = r.id;
                li.append(node('b', `${r.held ? '✓ ' : ''}${r.name}`), document.createTextNode(`: ${r.text}`), ...(r.held && stamp(r.at) ? [node('span', ` (${stamp(r.at)})`, {class: 'deed_when'})] : []));
                return li;
            }));
            if (g.unfound) list.append(node('li', g.unfound === 1 ? 'One more deed here shows itself when you do it.' : `${g.unfound} more deeds here show themselves when you do them.`, {class: 'title_locked'}));
            const section = node('section', null, {'data-deed-group': g.id}); section.append(node('h3', `${g.label} (${done} done)`), list);
            return section;
        }));
    });
    function check() {
        const s = storage(); if (!s) return;
        const earned = unlockEarned(s, liveDeedFacts(), Date.now(), deed_catalog);
        if (!earned.length) return;
        const rows = earned.map(id => deed_catalog.find(d => d.id === id));
        for (const d of rows) readPort('logAchievement', `Deed done: ${d.name}. ${d.text}`);
        toast.textContent = `Deed done: ${rows.map(d => d.name).join(', ')}.`; render(true);
        for (const id of earned) feedback.publish({type: 'native-deed-discovery', id, settled: true});
    }
    panel.render = render; panel.check = check;
    whenPortsReady(() => { render(true); check(); });
    definePanel({id: 'deeds', title: 'Deeds', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true});
    return panel;
}

let panel = null;
registerDomain({id: 'deeds', deps: [], initialState: () => null, save: () => undefined,
    refresh: () => { panel?.check(); panel?.render(false); }, panels: [() => { panel = createPanel(); }]});
