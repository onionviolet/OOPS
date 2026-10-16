// R17 Step 0 preview (UIE22, UIE24, NX40). Mounts the real workspace host, layout spec and fit
// engine with the real shell CSS, plus real factory panels over hand-made fixtures. No game
// startup, no save, no simulation: storage is in memory (installed by ui-preview.html before this
// module loads, PV3) and import-time timers and storage writes are counted (PV4). Panels still drawn
// by display.js or proto23_shell.js are labelled placeholders until their rounds convert them.
import {mountWorkspace, registerWorkspaceModule, updateWorkspace} from '../../workspace_layout.js';
import {createVillageWorkspace} from '../../village_workspace.js';
import {createWorkspaceViews} from '../../workspace_views.js';
import {applyCustomizationProfile, defaultCustomizationState} from '../../customization_profiles.js';
import {LAYOUT_SPEC, regionFor} from '../../layout_spec.js';
import {FIXTURES} from './fixtures.js';

const probe = window.__preview;
probe.importTimers = probe.timers; probe.importWrites = probe.writes; probe.phase = 'mount';

const params = new URLSearchParams(location.search);
const fixtureId = FIXTURES[params.get('fixture')] ? params.get('fixture') : 'village';
const size = [14, 17.5, 21].includes(Number(params.get('size'))) ? Number(params.get('size')) : 14;
const fixture = FIXTURES[fixtureId];
const el = (tag, attrs = {}, text = '') => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
// The preview owns its page: its bar and the shell root are created here, not looked up (UR8).
const bar = el('nav', {id: 'preview_bar', 'aria-label': 'Preview controls'});
const root = el('div', {id: 'main_content'});
document.body.append(bar, root);

// Legacy nodes that real panels still read (NX42), filled from the fixture and kept out of view.
const legacy = el('div', {id: 'preview_legacy', hidden: ''});
for (const [id, text] of Object.entries(fixture.legacy || {})) legacy.append(el('div', {id}, text));
document.body.append(legacy);

// Titles and critical flags as the game registers these panels (main.js, proto23_shell.js).
const PANELS = {
    vitals: {title: 'Character vitals', critical: true}, 'shell-character': {title: 'You'}, 'shell-inventory-tools': {title: 'Inventory tools'},
    belongings: {title: 'Belongings'}, 'local-actions': {title: 'Local actions', critical: true, nodeId: 'location_related_div', className: 'box_div'},
    'pane-navigation': {title: 'Center views'}, records: {title: 'Journal & received accounts'}, skills: {title: 'Skills & practice'},
    messages: {title: 'Reports'}, 'shell-log-tools': {title: 'Log tools'},
};
const placeholders = [];
for (const [id, {rows, note}] of Object.entries(fixture.placeholders)) {
    const meta = PANELS[id] || {title: id};
    // Native id and class where the shell CSS or the text-size path keys on them.
    const node = el('section', {'data-preview-placeholder': id, ...(meta.nodeId ? {id: meta.nodeId} : {}), ...(meta.className ? {class: meta.className} : {})});
    const label = el('p', {class: 'preview-placeholder-label', title: `${note}. Drawn by display.js / proto23_shell.js in the game; converts when its round touches it.`});
    label.append(el('strong', {}, meta.title), el('span', {}, ` · placeholder · ${note}`));
    node.append(label);
    for (let i = 0; i < rows; i++) node.append(el('div', {class: 'preview-skeleton-row', 'aria-hidden': 'true'}));
    root.append(node);
    registerWorkspaceModule({id, title: meta.title, node, home: root, critical: !!meta.critical});
    placeholders.push(id);
}

// Real factory panels (NX37): the same create…({read, act}) calls the game makes, over fixtures.
const acted = [];
createVillageWorkspace({read: () => fixture.village, act: id => { acted.push(id); }});
createWorkspaceViews({read: () => fixture.work, combatKnown: () => false});
const real = ['village-scene', 'focus', 'current-work'];

// The start screen does not exist here; tell the fit engine the opening moment has passed.
document.documentElement.dataset.startScreen = 'closed';
mountWorkspace({root});

// PV8: the real text-size path. The game applies the presentation profile to Local actions and the
// shell copies its computed size to --shell-context-size (proto23_shell.js); the same here, from the
// default profile with only the size changed, never stored preferences.
const state = defaultCustomizationState(); state.profiles.Default.settings.typography.size = size;
const local = document.getElementById('location_related_div');
applyCustomizationProfile(state, {moduleNodes: {'local-actions': local}});
const style = getComputedStyle(local);
for (const [key, value] of Object.entries({'--shell-context-size': style.fontSize, '--shell-context-font': style.fontFamily, '--shell-user-fill': style.getPropertyValue('--custom-background'), '--shell-user-text': style.getPropertyValue('--custom-text'), '--shell-user-accent': style.getPropertyValue('--custom-accent')})) root.style.setProperty(key, value);
root.dataset.shellCustomPalette = local.dataset.customPalette || 'false';
updateWorkspace();

// Status bar: what is real, what is a placeholder, and the safety counters.
const fixtureSelect = el('select', {'aria-label': 'Fixture'});
for (const [id, f] of Object.entries(FIXTURES)) { const o = el('option', {value: id}, f.title); if (id === fixtureId) o.selected = true; fixtureSelect.append(o); }
const sizeSelect = el('select', {'aria-label': 'Text size'});
for (const s of [14, 17.5, 21]) { const o = el('option', {value: String(s)}, `${s}px text`); if (s === size) o.selected = true; sizeSelect.append(o); }
const go = () => { location.search = `?fixture=${fixtureSelect.value}&size=${sizeSelect.value}`; };
fixtureSelect.onchange = go; sizeSelect.onchange = go;
const status = el('output', {id: 'preview_status', 'aria-live': 'polite'});
bar.append(el('strong', {}, 'Shell preview'), fixtureSelect, sizeSelect, status);
const report = () => {
    const regions = Object.fromEntries(real.map(id => [id, regionFor(id)]));
    probe.report = {fixture: fixtureId, size, spec: LAYOUT_SPEC.version, real, regions, placeholders, importTimers: probe.importTimers, importWrites: probe.importWrites, acted: [...acted]};
    status.textContent = `real: place header, Around you, current work · dashed = placeholder (${placeholders.length}) · spec v${LAYOUT_SPEC.version} · import timers ${probe.importTimers} · storage writes ${probe.importWrites} (in memory)`;
};
// The game's nav reports its height for the board's offset (workspace_navigation.js); same here.
new ResizeObserver(() => document.documentElement.style.setProperty('--workspace-nav-height', bar.offsetHeight + 'px')).observe(bar);
report();
probe.ready = true;
document.dispatchEvent(new CustomEvent('ui-preview-ready'));
