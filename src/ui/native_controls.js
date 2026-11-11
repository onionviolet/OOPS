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
