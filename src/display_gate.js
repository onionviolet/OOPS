// Display work follows what can be seen (O21, proposed AR23; docs/audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md round 4).
// A panel that renders on every tick asks its gate first. On screen, or with no way to tell
// (no IntersectionObserver, as in Node tests), it always renders. Off screen it renders when
// its key changed (callers pass the world's command sequence, so a command or event shows at
// once), when the workspace layout changed, or at the slow fallback, so a panel that reveals
// itself because time passed still appears. Display only: no game state, save or clock (AR3).
// Dial: `hiddenEvery` (default 3 s) is how stale an off-screen panel may get from time alone.
export const HIDDEN_EVERY_MS = 3000;

const gates = new Set();
let listening = false;
function listen() {
    if(listening || typeof document === 'undefined') return;
    listening = true;
    // A tab, layout or panel move can put a panel on screen without a command.
    document.addEventListener('workspace-presentation-change', () => {for(const gate of gates) gate.reopen();});
}

export function createDisplayGate(element, {hiddenEvery = HIDDEN_EVERY_MS, onShow = null, now = () => performance.now(),
    Observer = globalThis.IntersectionObserver} = {}) {
    let seen = null, lastKey, lastRun = -Infinity, open = true;
    const observer = typeof Observer === 'function' && element ? new Observer(entries => {
        const wasSeen = seen;
        seen = entries[entries.length - 1].isIntersecting;
        if(seen && wasSeen === false) {open = true; onShow?.();}
    }) : null;
    observer?.observe(element);
    const gate = {
        // True when the caller should render now. `key` changes when the world changed by more than time.
        due(key, force = false) {
            const run = force || open || !observer || seen !== false || key !== lastKey || now() - lastRun >= hiddenEvery;
            if(run) {open = false; lastKey = key; lastRun = now();}
            return run;
        },
        reopen() {open = true;},
        get onScreen() {return seen;},
        destroy() {observer?.disconnect(); gates.delete(gate);},
    };
    gates.add(gate); listen();
    return gate;
}

// Writes only when the text differs, so an unchanged redraw makes no DOM mutation for
// observers (the shared action-component sweep) to react to.
export function setText(element, text) {
    if(element.textContent !== text) element.textContent = text;
}
