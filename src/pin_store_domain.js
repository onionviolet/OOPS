// Pins domain (PSA29, GA5): owns the namespaced `pins` slice (cheat pins and the manifest revisions they were saved
// against) and answers every pin read. Canon and exception pins are manifest content (src/pin_store.js registerManifest),
// never saved. A fresh store writes no slice key, so saves without pins keep their bytes. Dev-only panel: sets a
// cheat pin from the debug view, kept visibly apart from canon pins.
import {registerDomain, domainRegistry} from './domain_registry.js';
import * as P from './pin_store.js';
import './gu_rank_pins.js';
import {testHooksEnabled} from './simulation_clock.js';
import {definePanel} from './panel_kit.js';
import {node} from './reference_kit.js';

let state = P.freshPins(), panel = null;
const render = () => panel?.render?.();
export const readPinNow = addr => P.readPin(state, addr);
export const pinsState = () => structuredClone(state);
export const commands = {
    read: addr => P.readPin(state, addr),
    list: () => P.listPins(state),
    drift: () => P.manifestDrift(state),
    setCheat(addr, value, note) { state = P.setCheat(state, addr, value, note); render(); return P.readPin(state, addr); },
    clearCheat(addr) { state = P.clearCheat(state, addr); render(); },
};
registerDomain({id: 'pins', deps: [], initialState: () => null,
    save: () => P.isFresh(state) ? undefined : structuredClone(P.validate(state)),
    validate: slice => { if (slice != null) P.validate(slice); },
    migrate: slice => P.migrate(slice),
    load: slice => { state = slice ?? P.freshPins(); render(); },
    refresh: render,
    projection: () => ({state, rows: P.listPins(state), drift: P.manifestDrift(state)}),
    commands,
    panels: [() => { panel = createPanel(); }]});

// Debug view: two text boxes and two buttons, only where test hooks or dev mode are on (the same gate as the engine's timers).
function createPanel() {
    if (typeof document === 'undefined' || !testHooksEnabled) return null;
    const root = node('section', null, {id: 'dev_pins_panel', class: 'reference-panel'});
    root.dataset.surfaceType = 'reference';
    const space = node('input', null, {type: 'text', 'aria-label': 'Pin space', value: 'gu.rank'}), key = node('input', null, {type: 'text', 'aria-label': 'Pin id'}),
        value = node('input', null, {type: 'text', 'aria-label': 'Pin value (JSON)'}), status = node('p', '', {role: 'status'}),
        set = node('button', 'Set cheat pin', {type: 'button'}), clear = node('button', 'Clear cheat pin', {type: 'button'}), list = node('ul', null, {'aria-label': 'Pins'});
    const address = () => P.pinAddress(space.value.trim(), key.value.trim());
    const act = fn => () => { try { status.textContent = fn(); } catch (error) { status.textContent = error.message; } render(); };
    set.onclick = act(() => { const pin = commands.setCheat(address(), JSON.parse(value.value), 'set from the debug view'); return `Cheat pin set: ${JSON.stringify(pin.value)}`; });
    clear.onclick = act(() => { commands.clearCheat(address()); return 'Cheat pin cleared.'; });
    root.append(node('h2', 'Dev pins'), node('p', 'Canon pins hold their addresses; a cheat pin is a separate layer.'), space, key, value, set, clear, status, list);
    root.render = () => list.replaceChildren(...P.listPins(state).map(p => {
        const li = node('li', `${p.layer === 'cheat' ? 'Cheat' : p.kind === 'exception' ? 'Exception' : 'Canon'} · ${JSON.parse(p.address).join(' / ')} = ${JSON.stringify(p.value)} · ${p.reason}`);
        li.dataset.pinLayer = p.layer; return li;
    }));
    definePanel({id: 'dev-pins', title: 'Dev pins', role: 'records', node: root, home: document.getElementById('main_content'),
        access: () => true, discovered: () => true, eligible: () => true, emptyText: 'Dev pins are off'});
    return root;
}
