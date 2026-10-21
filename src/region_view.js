import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {current_location, travel_times} from './runtime_state.js';
import {get_context} from './native_view.js';
import {node, syncList, visibleRenderer, minutesText} from './reference_kit.js';

// SX5: Where I am. The places connected to here, with the travel time to each and whether the
// road is a combat zone. It reads the same connections the travel buttons in Here are built from
// and lists only places the game would offer (canBeStarted), so it shows nothing the buttons do
// not. "Go" clicks the real travel control in Here, so its guards, time cost and confirmation
// stay the native ones; when Here is not showing that control, Go says so instead of acting.

const travelControl = id => [...document.querySelectorAll('#location_actions_div [data-travel]')].find(n => n.dataset.travel === id);

// Pure: a location record in, rows out.
export function projectRegion(location, {reachable = () => true, times = {}} = {}) {
    if (!location) return {here: '', rows: []};
    const rows = [];
    for (const link of location.connected_locations || []) {
        const target = link.location; if (!target || target.is_challenge || !reachable(target)) continue;
        const minutes = times[location.id]?.[target.id] ?? link.travel_time;
        rows.push({key: `go:${target.id}`, id: target.id, name: target.name, detail: `${Number.isFinite(minutes) ? minutesText(minutes) : 'time unknown'} away${target.tags?.safe_zone === false ? ' · combat zone' : ''}`});
    }
    const parent = location.parent_location;
    if (parent) {
        const minutes = times[location.id]?.[parent.id];
        rows.push({key: `back:${parent.id}`, id: parent.id, name: `Back to ${parent.name}`, detail: Number.isFinite(minutes) ? `${minutesText(minutes)} away` : 'the way you came'});
    }
    return {here: location.name || '', rows};
}

function readRegion() {
    let reachable = () => true;
    try { const context = get_context?.(); reachable = target => !!target.canBeStarted?.(context); } catch { reachable = () => true; }
    return projectRegion(current_location, {reachable, times: travel_times});
}

const hasRoads = () => !!current_location?.connected_locations?.length || !!current_location?.parent_location;

function createRegionPanel() {
    const panel = node('section', null, {id: 'region_view_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'place-service';
    const here = node('p', ''), list = node('ul', null, {'aria-label': 'Connected places'}), note = node('p', '', {role: 'status', 'aria-live': 'polite'});
    note.className = 'reference-empty';
    panel.append(node('h2', 'Where I am'), here, list, note);
    let model = {rows: []};
    const render = visibleRenderer(panel, () => { model = readRegion(); return model; }, view => {
        here.textContent = view.here ? `You are at ${view.here}.` : '';
        syncList(list, view.rows, 'No road leads out from here yet.');
        for (const li of list.children) {
            const row = view.rows.find(r => r.key === li.dataset.key); if (!row) continue;
            let go = li.querySelector('button');
            if (!go) { go = node('button', 'Go', {type: 'button'}); li.append(go); }
            go.dataset.target = row.id; go.setAttribute('aria-label', `Go: ${row.name}`);
            go.onclick = () => {
                const control = travelControl(go.dataset.target);
                if (!control) { note.textContent = 'Open Here to travel; the road is shown but its button is not on screen.'; return; }
                note.textContent = ''; control.click();
            };
        }
    });
    panel.render = render;
    definePanel({id: 'region-view', title: 'Where I am', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: hasRoads, eligible: hasRoads, emptyText: 'Roads appear here once you know them'});
    return panel;
}

let panel = null;
registerDomain({id: 'region-view', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createRegionPanel(); }]});
