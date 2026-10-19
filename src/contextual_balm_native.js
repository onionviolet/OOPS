// One bounded insertion into the existing native active_effects owner.
// Prepare and write only staged data; publish is called after durable storage.
import {check, natural} from './basics.js';
import {CONTEXTUAL_BALM_IDS as I, CONTEXTUAL_BALM_NATIVE_EFFECT_REQUEST as EFFECT} from './contextual_balm_content.js';

const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().filter(key => value[key] !== undefined).map(key => [key, canonical(value[key])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

export function prepareContextualBalmNative(before, plan, {activeEffects, itemTemplates, effectTemplates, ActiveEffect, refresh}) {
    const requests = plan.contextualBalmEffectRequests || [];
    if (!requests.length) return {write() {}, publish() {}};
    check(requests.length === 1, 'One actual palm dressing supplies one native effect request.');
    const request = requests[0], receipt = plan.state.simulation?.knowledge?.player?.[I.receipt];
    const oldCount = before.actors?.player?.completed?.[I.dress] || 0;
    check((plan.state.actors?.player?.completed?.[I.dress] || 0) === oldCount + 1 && receipt &&
        request.durableCause === receipt.cause && natural(receipt.at) && receipt.at <= plan.state.clock,
        'The native balm effect needs this transition\'s actual caused dressing completion.');
    for (const [key, value] of Object.entries(EFFECT)) check(same(request[key], value), 'The native balm request changed its item effect contract.');
    const item = itemTemplates[I.itemId], template = effectTemplates[I.effectId];
    check(item && same(item.effects, [{effect: I.effectId, duration: 90}]) &&
        Object.keys(item.recovery_chances || {}).length === 0 && template &&
        Object.entries(EFFECT.template).every(([key, value]) => same(template[key], value)),
        'The existing native Healing balm template changed. Preserve it for a matching reader.');
    check(typeof ActiveEffect === 'function' && typeof refresh === 'function', 'Bind the existing native effect constructor and stat refresh.');
    const old = activeEffects[I.effectId];
    const remaining = plan.effectDurations?.[I.effectId] ?? Math.max(0, (old?.duration || 0) - (plan.state.clock - before.clock));
    check(Number.isFinite(remaining) && remaining >= 0 && request.expectedExistingDuration === remaining,
        'The actual native balm duration changed before publication.');
    const freshRemaining = Math.max(0, 90 - (plan.state.clock - receipt.at));
    check(request.remainingNewDuration == null || request.remainingNewDuration === freshRemaining,
        'The treatment effect must begin at its actual completion minute.');
    const duration = Math.max(remaining, freshRemaining);
    const prepared = duration > 0 ? new ActiveEffect({...structuredClone(template), duration}) : null;
    let written = false;
    return {
        write(envelope) {
            check(envelope.active_effects && typeof envelope.active_effects === 'object', 'Bind the existing saved native effect owner.');
            const saved = envelope.active_effects[I.effectId];
            check((saved?.duration || 0) === remaining, 'The staged native balm duration disagrees with the actual effect clock.');
            if (prepared) envelope.active_effects[I.effectId] = structuredClone(prepared);
            else delete envelope.active_effects[I.effectId];
            written = true;
        },
        publish() {
            check(written, 'Write and persist the native effect envelope before publishing it.');
            if (prepared) activeEffects[I.effectId] = prepared;
            else delete activeEffects[I.effectId];
            refresh();
        }
    };
}
