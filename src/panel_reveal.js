// Panels may skip preview work nobody can see: a container that is not rendered, or
// the body of a closed <details>. A skipped panel renders again in the microtask after
// the DOM change that reveals it (MutationObserver runs before the next paint), so a
// reveal never paints stale terms. Without DOM visibility support everything counts
// as shown and nothing is skipped.
const waiting = new Map();
let observer = null;
export const rendered = element => !element?.isConnected || typeof element.checkVisibility !== 'function' || element.checkVisibility();
// Renders rewrite hidden, class and style with unchanged values on every pass. Such a write
// still queues a record; treating it as a reveal re-ran every waiting check (forced layout)
// and every revealed render, whose own unchanged writes queued the next round: a page-wide
// busy loop. Only a record whose value actually changed can reveal anything.
const changed = r => r.type !== 'attributes' || r.oldValue !== r.target.getAttribute(r.attributeName);
function wake(records) {
    if(records && !records.some(changed)) return;
    for(const [render, shown] of [...waiting]) {
        if(!shown()) continue;
        waiting.delete(render);
        try {render();} catch(error) {console.error('A revealed panel could not refresh.', error);}
    }
    if(!waiting.size) {observer?.disconnect(); observer = null;}
}
// True when the work should run now. Otherwise remembers render until shown() holds.
export function shownOrDeferred(render, shown) {
    if(shown()) {waiting.delete(render); return true;}
    if(typeof MutationObserver !== 'function' || typeof document === 'undefined') return true;
    waiting.set(render, shown);
    if(!observer) {
        observer = new MutationObserver(wake);
        observer.observe(document.documentElement, {subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden', 'open', 'class', 'style']});
    }
    return false;
}
