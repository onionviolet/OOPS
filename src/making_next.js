// MKC5/MKC33 (making crafts ideaboard, proposal): a bench's Next part says where a made thing can go now. Pure and derived
// from the current state on every draw, so nothing is saved and a reload re-derives it. A route the life has not found
// stays visible as "Not yet" with its reason beside it (MKC3, UR128); it never opens a panel the workspace would refuse.
import {expandWorkspaceModule, openWorkspaceModule, workspaceModuleFound} from './workspace_layout.js';
import {routeById} from './layout_spec.js';

// A route the layout spec opens in place (Inventory) opens where it sits; benches and Here open as the center view, as their routes do.
const inPlace = id => routeById(id)?.open === 'in-place';

/** The live routes: Here is always reachable; any other panel opens only once the workspace has found it. */
export const workspaceRoutes = Object.freeze({
    found: id => id === 'local-actions' || workspaceModuleFound(id),
    open: id => inPlace(id) ? openWorkspaceModule(id) : expandWorkspaceModule(id),
});

/** One Next row. route: {label, fact, panel, reason}; routes: {found(id), open(id)}. */
export function nextRow({label, fact = '', panel, reason = ''}, routes) {
    const data = {benchNext: panel};
    if (routes.found(panel)) return {label, fact, run: () => routes.open(panel), data};
    return {label: `Not yet: ${label.charAt(0).toLowerCase()}${label.slice(1)}`, fact, from: reason, state: 'blocked', disabled: true, data};
}

export const nextRows = (routesWanted, routes) => routesWanted.filter(Boolean).map(r => nextRow(r, routes));
