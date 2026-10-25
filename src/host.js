// Host adapter seam (AD39, EL2). The game page may run inside the Electron host
// (desktop/preload.cjs exposes window.yairpgHost) or a plain browser, where
// every call here does nothing. Calls only report; they never change game
// state (AR3), and nothing here imports Electron or Node (AR4).
let lastCount = -1;
let lastLabel = '';

// Something is waiting for the player: `count` available leads, `label` the
// first one's name. The desktop host shows a Dock badge and, when the window
// is not focused, an OS notification when the count rises.
export function reportAttention(count, label = '') {
    if (count === lastCount && label === lastLabel) return;
    lastCount = count;
    lastLabel = label;
    try { globalThis.window?.yairpgHost?.attention?.(count, label); } catch { /* host gone */ }
}

const projected = new Map();

// Offers a read-only copy of a panel's data to pop-out windows. `build` runs
// only when the host can take it, so the browser build pays nothing.
export function reportProjection(name, build) {
    const host = globalThis.window?.yairpgHost;
    if (!host?.projection) return;
    try {
        const data = build();
        const text = JSON.stringify(data);
        if (projected.get(name) === text) return;
        projected.set(name, text);
        host.projection(name, data);
    } catch { /* host gone */ }
}
