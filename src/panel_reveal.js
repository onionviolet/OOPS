// Panels may skip preview work nobody can see: a container that is not rendered, or
// the body of a closed <details>. A skipped panel renders again in the microtask after
// the DOM change that reveals it (MutationObserver runs before the next paint), so a
// reveal never paints stale terms. Without DOM visibility support everything counts
// as shown and nothing is skipped.
const waiting = new Map();
let observer = null;
export const rendered = element => !element?.isConnected || typeof element.checkVisibility !== 'function' || element.checkVisibility();
function wake() {
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
        observer.observe(document.documentElement, {subtree: true, attributes: true, attributeFilter: ['hidden', 'open', 'class', 'style']});
    }
    return false;
}
