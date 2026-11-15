// The crossing is hidden until something opens it (round 19, PS196; proposal). An always-there door makes every life feel
// temporary, so "Cross to another world" shows only after an in-world unlock, at death, or with Menu › Worlds › "Cross
// freely" (off by default; AD22, Weibao is the player). Walks and fixtures run with ?test_hooks=1 and get it on (PS202);
// a stored choice wins over that, so a probe can still see the default.
const KEY = 'yairpg.crossFreely.v1';

/** Pure: whether every crossing shows, from the stored choice ('on', 'off' or null) and the test-hooks flag. */
export const crossFreelyFrom = (stored, testHooks) => stored === 'on' || (stored !== 'off' && !!testHooks);

export function crossFreely() {
    try { return crossFreelyFrom(localStorage.getItem(KEY), new URLSearchParams(location.search).get('test_hooks') === '1'); } catch { return false; }
}
export const CROSS_FREELY_EVENT = 'yairpg:cross-freely';
export function setCrossFreely(on) { try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* storage blocked: the default stands */ } globalThis.dispatchEvent?.(new Event(CROSS_FREELY_EVENT)); }

/** The Menu's Worlds row: one checkbox, labelled in player words. */
export function crossFreelyControl() {
    const row = document.createElement('label'); row.className = 'game-bar-menu-setting'; row.dataset.setting = 'cross-freely';
    const box = document.createElement('input'); box.type = 'checkbox'; box.checked = crossFreely();
    box.addEventListener('change', () => setCrossFreely(box.checked));
    row.title = 'Show every crossing to another world at all times. Off: a crossing shows once the life finds a way.';
    row.append(box, ' Worlds: cross freely');
    return row;
}
