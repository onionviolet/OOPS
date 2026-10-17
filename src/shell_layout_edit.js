import {LAYOUT_SPEC, boxRegion} from './layout_spec.js';

// R21 shell layout editing (MB1). Placement says which slot each box sits in, per context (idle,
// combat). It is a browser-local layout preference beside the stored shell layout (UR58: owner is
// this browser; reset per context), versioned with the layout spec (GU6). Manual placement beats
// the automatic composition (WX11): a companion the player placed outside the actions shows there
// in that context. The game save is untouched.

export const PLACEMENT_VERSION = 1;
const CONTEXTS = ['idle', 'combat'];
const empty = () => ({boxes: {}, companions: {}, swap: false});

export function normalizePlacement(raw, spec = LAYOUT_SPEC) {
    const out = {version: PLACEMENT_VERSION, spec: spec.version, contexts: {}};
    const fresh = raw?.version === PLACEMENT_VERSION && raw.spec === spec.version;
    for (const context of CONTEXTS) {
        const from = fresh ? raw.contexts?.[context] : null, to = empty();
        for (const [box, slot] of Object.entries(from?.boxes || {})) if (spec.boxes[box] && !spec.boxes[box].companion && spec.slots[slot] && slot !== 'actions') to.boxes[box] = slot;
        for (const [box, slot] of Object.entries(from?.companions || {})) if (spec.boxes[box]?.companion && (spec.slots[slot] || slot === 'hidden')) to.companions[box] = slot;
        to.swap = !!from?.swap;
        out.contexts[context] = to;
    }
    out.stale = !!raw && !fresh;
    return out;
}

// Move a box to a slot. A main box swaps with the main box already there, so every slot keeps one
// main box; a companion just joins the slot.
export function moveBox(placement, context, box, slot, spec = LAYOUT_SPEC) {
    const next = structuredClone(placement), at = next.contexts[context], def = spec.boxes[box];
    if (!def || !(spec.slots[slot] || (def.companion && slot === 'hidden'))) return next;
    if (def.companion) { at.companions[box] = slot; return next; }
    if (slot === 'actions') return next;
    const from = boxRegion(box, at, spec);
    const other = Object.keys(spec.boxes).find(b => !spec.boxes[b].companion && b !== box && boxRegion(b, at, spec) === slot);
    at.boxes[box] = slot; if (other) at.boxes[other] = from;
    for (const b of Object.keys(at.boxes)) if (at.boxes[b] === spec.boxes[b].home) delete at.boxes[b];
    return next;
}
export function swapCompanions(placement, context) { const next = structuredClone(placement); next.contexts[context].swap = !next.contexts[context].swap; return next; }
export function resetContext(placement, context) { const next = structuredClone(placement); next.contexts[context] = empty(); return next; }
export const isDefault = (placement, context) => { const at = placement.contexts[context]; return !Object.keys(at.boxes).length && !Object.keys(at.companions).length && !at.swap; };

export function readPlacement(key) { try { return normalizePlacement(JSON.parse(localStorage.getItem(key))); } catch { return normalizePlacement(null); } }
export function writePlacement(key, placement) { try { const {stale, ...rest} = placement; localStorage.setItem(key, JSON.stringify(rest)); return true; } catch { return false; } }

// "Move to" control for a box's lead panel header, shown while editing. `current` is its slot.
export function moveControl(box, spec = LAYOUT_SPEC) {
    const def = spec.boxes[box], label = document.createElement('label'), select = document.createElement('select');
    label.className = 'shell-move-control'; label.textContent = 'Move to ';
    select.dataset.workspaceAction = 'shell-move'; select.dataset.box = box; select.setAttribute('aria-label', `Move ${def.title} to`);
    for (const [slot, name] of Object.entries(spec.slots)) {
        if (!def.companion && slot === 'actions') continue;
        const option = document.createElement('option'); option.value = slot; option.textContent = def.companion && slot !== 'actions' ? `Under ${name.toLowerCase()} box` : name; select.append(option);
    }
    if (def.companion) { const hide = document.createElement('option'); hide.value = 'hidden'; hide.textContent = 'Hidden here'; select.append(hide); }
    label.append(select);
    return {label, select};
}
