// G1: "the story leans this way". A reference panel over the canonPull slice: one line of lean words
// per pulled beat (id only) as a flat bar, and the deviation lines from the chronicle. No ring, no beat content.
import {registerDomain, domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, syncList, visibleRenderer} from './reference_kit.js';
import {PULL_SLICE, deviationChronicle} from './canon_pull.js';
import {canonPullRead, PULL_DECLINED} from './canon_pull_host.js';

const LEAN_FILL = {'holds firm': 90, leans: 65, loosening: 35, drifting: 12};
const declined = () => readPort('expansion')?.actors?.player?.facts?.[PULL_DECLINED] === true;
const sliceNow = () => domainRegistry.project(PULL_SLICE);
const active = () => { const s = sliceNow(); return !!s && (s.beats?.day > 0 || s.records.length > 0); };

export function canonPullView(slice = sliceNow(), isDeclined = declined()) {
    const read = canonPullRead(slice, {declined: isDeclined});
    return {headline: read.headline, rows: read.upcoming.map(u => ({id: u.id, label: u.label, lean: u.lean, pressed: u.pressed, fill: LEAN_FILL[u.lean]})),
        deviations: deviationChronicle(slice).map(d => ({key: `${d.beat}@${d.day}`, text: d.text}))};
}

function createPanel() {
    const panel = node('section', null, {id: 'canon_pull_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const headline = node('p', '', {role: 'status', 'data-pull-headline': ''}), rows = node('ul', null, {'aria-label': 'How the story leans'}), dev = node('ul', null, {'aria-label': 'Where the story bent'});
    panel.append(node('h2', 'The story'), headline, rows, node('h3', 'Where it bent'), dev);
    const render = visibleRenderer(panel, canonPullView, v => {
        headline.textContent = v.headline ?? 'Nothing is pulling at your days yet.';
        rows.replaceChildren(...v.rows.map(r => {
            const li = node('li', null, {'data-pull-beat': r.id}), bar = node('span', null, {role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(r.fill), 'aria-label': `${r.label} ${r.lean}`});
            bar.style.cssText = 'display:block;height:6px;border-radius:3px;background:var(--ui-border,#456);margin:4px 0;position:relative;overflow:hidden';
            const fill = node('span'); fill.style.cssText = `display:block;height:100%;width:${r.fill}%;background:var(--ui-accent,#6cf)`;
            bar.append(fill); li.append(node('span', `${r.label} · ${r.lean}${r.pressed ? ' · pressed' : ''}`), bar);
            return li;
        }));
        syncList(dev, v.deviations.map(d => ({key: d.key, name: d.text})), 'Nothing has bent yet.');
    });
    panel.render = render;
    whenPortsReady(() => render(true));
    definePanel({id: 'canon-pull', title: 'The story', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: active, eligible: active, emptyText: 'The story has not started pulling at your days'});
    return panel;
}

let panel = null;
registerDomain({id: 'canon_pull_panel', deps: [PULL_SLICE], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createPanel(); }]});
