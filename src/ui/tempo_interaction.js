// The cautious handover chooses one non-attacking move; a withdrawal can still fail.
export const HANDOVER_LABEL = 'Let a careful policy take one turn';
export const HANDOVER_TEXT = 'Chooses brace, tend or back away; it does not attack. Backing away can fail and invite a free blow.';

// Fight logs are bounded tails. Compare their overlap so a move and the response
// both reach the status, even when old lines have rolled off the beginning.
export function newTempoLines(previous, current) {
    let overlap = Math.min(previous.length, current.length);
    while (overlap && !previous.slice(-overlap).every((line, i) => line === current[i])) overlap--;
    return current.slice(overlap);
}

// A redraw replaces the controls. Remember their game-owned identity, never a detached node.
export function captureTempoFocus(host, keys) {
    const active = host.ownerDocument.activeElement;
    if (!host.contains(active)) return null;
    const key = keys.find(name => active.dataset?.[name] !== undefined);
    return key ? {key, value: active.dataset[key]} : {};
}

export function restoreTempoFocus(host, previous, fallback) {
    if (!previous) return;
    const equivalent = previous.key && [...host.querySelectorAll('button')].find(button =>
        !button.disabled && button.dataset[previous.key] === previous.value);
    (equivalent || fallback)?.focus({preventScroll: true});
    if (!equivalent) fallback?.scrollIntoView?.({block: 'nearest'});
}
