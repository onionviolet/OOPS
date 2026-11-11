// The legacy controls in index.html are real buttons now (UR130, UI audit round 45 UIC118).
// Tabs, filters and sort toggles mark their state by `active_selection_button`, set in many
// places; this keeps `aria-pressed` in step with that class so the state is not colour-only
// (UR108). One observer per button watches only its class attribute.
const SELECTION = /(?:_control_button|_sorting_button|_category_button|crafting_(?:main|sub)page_button|skill_stance_control_button)\b/;

export function selectionButtons(doc = document) {
    return [...doc.querySelectorAll('button.ui-native-control')].filter(b => SELECTION.test(b.className) || b.id.startsWith('switch_to_'));
}

export function mountNativeControls(doc = document) {
    const buttons = selectionButtons(doc);
    const sync = b => {const v = String(b.classList.contains('active_selection_button')); if(b.getAttribute('aria-pressed') !== v) b.setAttribute('aria-pressed', v);};
    buttons.forEach(sync);
    const Observer = doc.defaultView?.MutationObserver ?? globalThis.MutationObserver;
    if(typeof Observer === 'function') {
        const observer = new Observer(records => {for(const r of records) sync(r.target);});
        for(const b of buttons) observer.observe(b, {attributes: true, attributeFilter: ['class']});
    }
    return buttons.length;
}

// PX50, UR150: a modal sheet closes when the player presses outside it, the same as Esc or its Close
// button, and that press does not reach what is underneath. A sheet that must not close this way
// (a half-typed form) carries data-no-light-dismiss. One listener for every <dialog> opened with showModal().
export function outsideDialog(dialog, x, y) {
    const r = dialog.getBoundingClientRect();
    return x < r.left || x > r.right || y < r.top || y > r.bottom;
}

export function mountLightDismiss(doc = document) {
    const onDown = event => {
        const dialog = event.target;
        if(dialog?.tagName !== 'DIALOG' || !dialog.open || !dialog.matches(':modal') || dialog.hasAttribute('data-no-light-dismiss')) return;
        if(!outsideDialog(dialog, event.clientX, event.clientY)) return;
        event.preventDefault(); event.stopPropagation();
        // Same path as Esc: owners that listen for 'cancel' (resolve a promise, restore focus) still run.
        const Ev = doc.defaultView?.Event ?? globalThis.Event;
        if(dialog.dispatchEvent(new Ev('cancel', {cancelable: true}))) dialog.close();
    };
    doc.addEventListener('pointerdown', onDown, true);
    return () => doc.removeEventListener('pointerdown', onDown, true);
}
