// Panels may skip preview work nobody can see: a container that is not rendered, or
// the body of a closed <details>. A skipped panel renders again before the next paint
// after the DOM change that reveals it, so a reveal never paints stale terms. Without
// DOM visibility support everything counts as shown and nothing is skipped.
//
// Waiting panels are rechecked once per animation frame, not on every DOM change or
// every render call. Each visibility check forces a style recalculation, and the
// workspace's :has() rules make each one walk the whole board (~3,000 elements on a
// crowded save). In the frame callback the check shares the recalculation the frame
// does anyway. Without requestAnimationFrame (tests, no DOM) the check runs at once.
const waiting = new Map();
let observer = null;
export const rendered = element => !element?.isConnected || typeof element.checkVisibility !== 'function' || element.checkVisibility();
// Renders rewrite hidden, class and style with unchanged values on every pass. Such a write
// still queues a record; treating it as a reveal re-ran every waiting check (forced layout)
// and every revealed render, whose own unchanged writes queued the next round: a page-wide
// busy loop. Only a record whose value actually changed can reveal anything.
const changed = r => r.type !== 'attributes' || r.oldValue !== r.target.getAttribute(r.attributeName);
const frame = () => typeof document !== 'undefined' && typeof globalThis.requestAnimationFrame === 'function';
let scheduled = false;
// A hidden document runs no frames; its pending check runs on the first visible frame,
// still before that frame paints.
function schedule() {
    if(!frame()) {recheck(); return;}
    if(scheduled) return;
    scheduled = true;
    globalThis.requestAnimationFrame(() => {scheduled = false; recheck();});
}
function wake(records) {
    if(records && !records.some(changed)) return;
    schedule();
}
function recheck() {
    for(const [render, shown] of [...waiting]) {
        if(!shown()) continue;
        waiting.delete(render);
        try {render();} catch(error) {console.error('A revealed panel could not refresh.', error);}
    }
    if(!waiting.size) {observer?.disconnect(); observer = null;}
}
// True when the work should run now. Otherwise remembers render until shown() holds.
export function shownOrDeferred(render, shown) {
    // Already waiting: the frame recheck decides, which also catches reveals the
    // attribute observer cannot see (a moved node, a stylesheet change).
    if(waiting.has(render) && frame()) {waiting.set(render, shown); schedule(); return false;}
    if(shown()) {waiting.delete(render); return true;}
    if(typeof MutationObserver !== 'function' || typeof document === 'undefined') return true;
    waiting.set(render, shown);
    if(!observer) {
        observer = new MutationObserver(wake);
        observer.observe(document.documentElement, {subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden', 'open', 'class', 'style']});
    }
    return false;
}
