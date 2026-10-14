import {createSettledTextEffects} from './settled_text_effects.js';
import {createDiscoveryCuePolicy} from './native_discovery_policy.js';

// Native callers emit only actual threshold crossings after settlement, never
// restored rows or inferred DOM/text changes. Resolution rechecks known state.
export function createNativeDiscoveryFeedback({container, readSettings, resolve, eventType = 'native-skill-discovery', anchorAttribute = 'data-skill', singular = 'Discovered', plural = 'skills'}) {
    const policy = createDiscoveryCuePolicy({eventType,singular,plural});
    const effects = createSettledTextEffects({container, readSettings});
    container.classList.add('native-discovery-host');
    let pending = [], scheduled = false, epoch = 0, dismissTimer = null;
    const stop = document.createElement('button');
    stop.type = 'button'; stop.className = 'native-discovery-cancel';
    stop.textContent = '×'; stop.setAttribute('aria-label','Dismiss discovery effect');
    stop.title = 'Dismiss discovery effect'; stop.hidden = true;
    container.append(stop);
    function cancel() {
        epoch++; pending = []; scheduled = false;
        clearTimeout(dismissTimer); dismissTimer = null;
        effects.cancel(); stop.hidden = true;
    }
    stop.addEventListener('click', cancel);
    const gesture = () => effects.gesture();
    container.addEventListener('pointerdown', gesture);
    container.addEventListener('keydown', gesture);
    const flush = token => {
        if (token !== epoch) return;
        scheduled = false;
        const events = pending; pending = [];
        const qualified = events.flatMap(event => {
            const known = resolve(event.id);
            return known ? [{...event, known: true, label: known.label}] : [];
        });
        const receipt = policy.take(qualified);
        if (!receipt || document.hidden) return;
        // A deliberate restore/new-run baseline is a new presentation session.
        // Ordinary cancellation keeps policy identity, so it cannot replay a
        // learned skill; the renderer must not suppress a new session's event.
        receipt.sequence = `${epoch}:${receipt.sequence}`;
        const row = container.querySelector(`[${anchorAttribute}="${CSS.escape(receipt.id)}"]`);
        const anchor = row?.getClientRects().length ? row : row?.closest('[data-skill_category]');
        // Stances, a collapsed panel or a user-hidden view stays in place. The
        // authoritative native log already carries the readable discovery.
        if (!anchor?.getClientRects().length) return;
        const options = readSettings();
        const presented = effects.present(receipt, {anchor});
        stop.hidden = !presented || options.effects === 'off';
        if (!stop.hidden) {
            container.querySelector('.work-ledger-effect')?.append(stop);
            const token = epoch;
            clearTimeout(dismissTimer);
            dismissTimer = setTimeout(() => {if (token === epoch) stop.hidden = true; dismissTimer = null;}, options.effectDefinition?.duration ?? 1800);
        }
    };
    function publish(event) {
        if (event?.type !== eventType || event.settled !== true) return;
        pending.push(event);
        if (!scheduled) {scheduled = true; const token = epoch; queueMicrotask(() => flush(token));}
    }
    const visibility = () => {if (document.hidden) cancel();};
    document.addEventListener('visibilitychange', visibility);
    return {publish, cancel, reset() {cancel(); policy.reset();}, destroy() {
        cancel(); document.removeEventListener('visibilitychange', visibility);
        container.removeEventListener('pointerdown', gesture);
        container.removeEventListener('keydown', gesture);
        effects.destroy(); stop.remove(); container.classList.remove('native-discovery-host');
    }};
}
