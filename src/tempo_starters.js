// World-neutral registry of tempo-fight openers (FD17, AT15). A world registers an opener; the tempo host lists the ones whose quote
// is visible and begins the fight from the opener's spec. Leaf module: no world imports, no DOM, no save slice.
// An opener is {id, label, text, quote(state, context) -> {visible, eligible, reason}, spec(state, context, helpers) -> beginTempoFight spec,
// after(plan, result)?}. helpers are host-supplied ({me, vitals, parts, enemyProfile(body, name)}), so a world never reads the native actor itself.
const openers = new Map();
export function registerTempoOpener(opener) {
    if(!opener || typeof opener.id !== 'string' || typeof opener.label !== 'string' || typeof opener.quote !== 'function' || typeof opener.spec !== 'function') throw Error('Invalid tempo opener.');
    openers.set(opener.id, Object.freeze({...opener}));
}
export const tempoOpeners = () => [...openers.values()];
export const tempoOpener = id => openers.get(id) || null;
