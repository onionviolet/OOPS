// UIV1 / UR62: a control that cannot act right now stays where it is, stays reachable, and says why
// in words when it is clicked or focused. A tooltip may repeat the reason, never hold it alone.
// A native `disabled` button cannot be focused or clicked, so it can answer nothing; a locked control
// uses aria-disabled instead and its owner returns early from its own handler after calling `say`.
// The reason is shown in one polite status line pinned under the control. It is position:fixed, so
// showing it never moves a neighbour (UR52), and it clears itself.
let line = null, timer = 0;

function status() {
    if (line?.isConnected) return line;
    line = document.createElement('small');
    line.id = 'ui_locked_reason'; line.className = 'ui-disabled-reason ui-locked-reason';
    line.setAttribute('role', 'status'); line.setAttribute('aria-live', 'polite'); line.hidden = true;
    document.body.append(line);
    return line;
}

/** Show `text` under `anchor` for a few seconds. */
export function sayReason(anchor, text) {
    const node = status(), words = String(text || '').trim();
    if (!words) return;
    if (node.textContent !== words) node.textContent = words;
    const box = anchor?.getBoundingClientRect?.();
    if (box) { node.style.left = `${Math.max(4, Math.round(box.left))}px`; node.style.top = `${Math.round(box.bottom + 4)}px`; }
    node.hidden = false;
    clearTimeout(timer); timer = setTimeout(() => { node.hidden = true; }, 6000);
}

/** Hide the line when focus leaves a locked control. */
export function clearReason() { clearTimeout(timer); if (line) line.hidden = true; }

/** Lock or unlock a button. A truthy `reason` locks it. Writes only a change. */
export function setLocked(button, reason) {
    const why = reason ? String(reason) : '';
    if (why) {
        if (button.getAttribute('aria-disabled') !== 'true') button.setAttribute('aria-disabled', 'true');
        if (button.dataset.disabledReason !== why) button.dataset.disabledReason = why;
        if (!button.dataset.lockedBound) {
            button.dataset.lockedBound = 'true';
            button.addEventListener('focus', () => { if (button.dataset.disabledReason) sayReason(button, button.dataset.disabledReason); });
            button.addEventListener('blur', clearReason);
        }
    } else {
        if (button.hasAttribute('aria-disabled')) button.removeAttribute('aria-disabled');
        if (button.dataset.disabledReason) delete button.dataset.disabledReason;
    }
}

export const lockReason = button => (button?.getAttribute('aria-disabled') === 'true' ? button.dataset.disabledReason || '' : '');
