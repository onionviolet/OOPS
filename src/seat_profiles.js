import {PERSPECTIVE_CONTROLS} from './perspective_controls.js';

export const SEATS = Object.freeze(['be', 'beside', 'follow', 'bystander', 'ordinary']);
// B1 reserves this id for the player-facing lead life. It is derived from the
// existing entry profile and is never copied into saved state.
export const BE_PROFILE_ID = 'book.lead.be@1';

const tags = Object.freeze({
    be: new Set(['in-world', 'system']),
    beside: new Set(['in-world', 'system', 'crossing', 'other-seat']),
    follow: new Set(['in-world', 'system', 'crossing', 'other-seat']),
    bystander: new Set(['in-world', 'system', 'crossing', 'other-seat']),
    ordinary: null,
});
const audiences = Object.freeze({
    be: new Set(['world-general', 'seat-only', 'world-mechanism', 'harness']),
    beside: new Set(['world-general']),
    follow: new Set(['world-general']),
    bystander: new Set(['world-general']),
    ordinary: null,
});
const controls = new Map(PERSPECTIVE_CONTROLS.map(row => [row.id, row]));
const routeControls = new Map(PERSPECTIVE_CONTROLS
    .filter(row => row.kind === 'menu' && row.anchor.startsWith('[data-route-id="'))
    .map(row => [row.anchor.slice(16, -2), row.id]));
const capabilities = new Map();
const knownAudiences = new Set(['world-general', 'seat-only', 'world-mechanism', 'harness']);
const warned = new Set();

function unknown(id) {
    if (warned.has(id)) return;
    warned.add(id);
    if (typeof console !== 'undefined' && typeof console.warn === 'function') console.warn(`[seat_profiles] Unknown control or capability: ${id}`);
}

export function registerCapability({id, audience, panel} = {}) {
    if (typeof id !== 'string' || !id || !knownAudiences.has(audience)) throw new TypeError('Capability needs an id and a known audience.');
    const row = Object.freeze({id, audience, panel: panel ?? null});
    capabilities.set(id, row);
    return row;
}

export function seatOf(state) {
    const entry = state?.lotm?.entryProfile ?? state?.entryProfile;
    if (!entry) return 'ordinary';
    if (entry === BE_PROFILE_ID) return 'be';
    // Existing LOTM entry profiles are the four original beside starts. Keep
    // this adapter name-free and treat unknown book profiles as beside by default.
    if (typeof entry === 'string' && entry.startsWith('lotm.early_tingen.')) return 'beside';
    return 'ordinary';
}

// What a seat is shown, as data: null means unrestricted. Read through
// observer_view.js; UI modules never branch on the seat itself.
export function seatScope(seat) {
    const known = SEATS.includes(seat) ? seat : 'ordinary';
    return Object.freeze({seat: known, tags: tags[known] && [...tags[known]], audiences: audiences[known] && [...audiences[known]]});
}

export function seatAllows(state, request = {}) {
    const seat = seatOf(state);
    if (request.capability !== undefined) {
        const id = typeof request.capability === 'string' ? request.capability : request.capability?.id;
        const capability = capabilities.get(id);
        if (!capability) { unknown(id ?? '(missing capability id)'); return true; }
        return audiences[seat] === null || audiences[seat].has(capability.audience);
    }
    if (request.control !== undefined) {
        const id = typeof request.control === 'string' ? request.control : request.control?.id;
        const control = controls.get(id);
        if (!control) { unknown(id ?? '(missing control id)'); return true; }
        if (tags[seat] === null || tags[seat].has(control.tag)) {
            return seat !== 'be' || control.tag !== 'system' || control.kind === 'menu';
        }
        return false;
    }
    throw new TypeError('seatAllows needs a control or capability.');
}

export function controlForRoute(routeId) {
    return routeControls.get(routeId) ?? null;
}

// Shared shell panels are projected in the active world. Unknown registrations
// stay unclassified until their owner supplies a perspective; a be life cannot
// infer that an unrelated panel belongs to it.
const currentWorldPanels=new Set(['lotm','village-scene','focus','opponents','pane-navigation','shell-character','shell-detail','shell-inventory-tools','shell-log-tools','vitals','location','time','messages','current-work','combat-controls','local-actions','preparation','belongings','condition','combat','stance','notebook','known-people','records','equipment-comparison']);
const systemPanels=new Set(['customization','settings']);
const crossingPanels=new Set(['continuation','optional-worlds','beginning','village-travelers']);
export function panelPerspective(state,panel){
 if(panel.perspective==='current-world')return state?.actors?.player?.worldId||'unclassified';
 if(panel.perspective)return panel.perspective;
 if(systemPanels.has(panel.id))return 'system';
 if(crossingPanels.has(panel.id))return 'crossing';
 if(currentWorldPanels.has(panel.id))return state?.actors?.player?.worldId||'unclassified';
 return 'unclassified';
}
export function seatAllowsPanel(state,panel){
 if(seatOf(state)!=='be')return true;
 const perspective=panelPerspective(state,panel);
 return perspective==='system'||perspective===state?.actors?.player?.worldId;
}
export const seatKnownPanels=(state,panels)=>panels.filter(panel=>seatAllowsPanel(state,panel));
