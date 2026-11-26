// The spine (UI directions B and F, adopted by Weibao 2026-11-14; play surface PS53). One status line under the
// top bar in every view: the place, the time, the weather, the reserve that matters in this world, the work under
// way and the save state. Under it, the day strip (src/ui/day_strip.js) shows today's hours.
//
// One authority per fact (AR3, DSG11): the line computes none of these. Each owner keeps rendering its own node and
// places it here: the place view its name, calendar and conditions (village_workspace.js), the current-work panel its
// work line (workspace_views.js), the game bar its save state (game_bar.js). Moving a node, not copying its text,
// keeps the temperature button's focus and preview handlers. The one fact read here is the reserve, from the
// existing energy projection (energy_resources.js energyView), because no panel owns a reserve line yet.
//
// Reserve, a proposal with its dial: the player's energies in this world (Fang Yuan's primeval essence, a caster's
// pool), at most two. Money stays in the Inventory heading, which already shows the purse; a world that wants its
// purse here can register a reader with setReserveReader. Nothing is stored in the save.
import {readPort} from '../ui_ports.js';
import {energyView} from '../energy_resources.js';
import {centerModes} from '../center_modes.js';

const SLOTS = ['place', 'when', 'weather', 'reserve', 'today', 'work', 'save'];
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

// Pure: the reserve words for a list of energy views. Full pools read as "Primeval essence 40/40".
export function reserveWords(energies = []) {
    return energies.filter(e => e && e.label && Number.isFinite(e.reserve) && Number.isFinite(e.capacity) && e.capacity > 0)
        .slice(0, 2).map(e => `${e.label} ${e.reserve}/${e.capacity}`).join(' · ');
}
let reserveReader = () => { const state = readPort('expansion'); return state ? reserveWords(energyView(state, 'player')) : ''; };
export function setReserveReader(fn) { reserveReader = typeof fn === 'function' ? fn : reserveReader; }

let line = null;
let workJump=null;
export function setWorkStatusJump(open){workJump=typeof open==='function'?open:null;}
const slots = new Map();
export const statusLineMounted = () => !!line?.isConnected;

// An owner hands its node to a slot. Returns false when the line is not mounted (outside the one-bar shell), so the
// owner keeps the node where it was.
export function placeInStatus(name, node) {
    const slot = slots.get(name);
    if (!slot || !node || !line?.isConnected) return false;
    if (node.parentNode !== slot) slot.replaceChildren(node);
    return true;
}
// An owner sets a slot's words (the place name, the work line). `idle` dims it.
export function setStatusText(name, text, {idle = false, title = ''} = {}) {
    const slot = slots.get(name);
    if (!slot || !line?.isConnected) return false;
    const words = String(text ?? '');
    if (slot.textContent !== words) {
        const arrived = name === 'place' && slot.textContent !== '';
        slot.textContent = words;
        // A new place is a stable moment for the frame (the centre split re-measures Around you).
        if (arrived) document.dispatchEvent(new CustomEvent('game-place-change', {detail: {place: words}}));
    }
    if (slot.dataset.idle !== String(idle)) slot.dataset.idle = String(idle);
    if (title && slot.title !== title) slot.title = title;
    slot.hidden = !words;
    return true;
}

// Mount inside the game bar. `bar` is the header; the spine sits as its second and third rows.
export function mountStatusLine({bar}) {
    if (line?.isConnected) return {node: line.parentNode};
    const spine = el('div', 'game-spine'); spine.id = 'game_spine';
    line = el('div', 'game-status'); line.id = 'game_status'; line.setAttribute('role', 'group'); line.setAttribute('aria-label', 'Where and when');
    for (const name of SLOTS) {
        const slot = el(name === 'work' ? 'button' : 'span', `game-status-${name}`);
        slot.dataset.statusSlot = name;
        if (name === 'work') {
            slot.type = 'button';
            // Work under way names what runs and the time left; selecting it shows Doing now (the running activity's own
            // block, else the Current work panel) on Here.
            const target = () => document.getElementById('action_status_div') || document.getElementById('workspace_current_work');
            slot.addEventListener('click', () => {
                if(workJump?.()===true)return;
                if (!target()?.checkVisibility()) centerModes().showHere();
                requestAnimationFrame(() => target()?.scrollIntoView({block: 'nearest'}));
            });
        }
        slots.set(name, slot); line.append(slot);
    }
    spine.append(line);
    bar.append(spine);
    // The day strip mounts in the place view first (main.js runs it before the bar exists); the spine adopts it, and
    // hands it back while the one-bar shell is off so the strip never leaves the page with a detached bar.
    const adoptStrip = () => {
        const strip = document.getElementById('day_strip'), home = document.getElementById('village_scene');
        if (!strip) return;
        if (spine.isConnected) { if (strip.parentNode !== spine) spine.append(strip); }
        else if (home && strip.parentNode !== home) home.prepend(strip);
    };
    const tick = () => { adoptStrip(); setStatusText('reserve', reserveReader(), {title: 'What your powers draw on, as it stands now.'}); };
    tick();
    const timer = setInterval(tick, 1000);
    // Rules that step aside for the line (PS71: the place panel's own header) key off this, not a document-wide :has().
    document.documentElement.dataset.statusLine = 'on';
    return {node: spine, tick, destroy() { clearInterval(timer); spine.remove(); line = null; slots.clear(); delete document.documentElement.dataset.statusLine; }};
}
