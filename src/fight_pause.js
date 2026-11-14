// Fight pause rule (proposal, CBD56 and CBD195 in
// docs/COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md). Says why a routine
// fight should stop and ask, read from the shared fight view and from what the
// caller remembers of earlier fights of this kind. It works the same for either
// engine because it reads the view alone. Pure and headless: it keeps no state
// and does not choose a move. Which reasons count is the caller's dial.
import {check, object} from './basics.js';

export const FIGHT_PAUSE_KINDS = Object.freeze(['new foe', 'lower means', 'pick gone']);

const people = view => (view.people ?? []).flatMap(spot => spot.who ?? []);

/**
 * Reasons to pause at the seat's turn, most pressing first; an empty list means carry on.
 * `memory`: {knownFoes: [id or kind], means: {id: amount when this kind of fight was last entered}, lastPick: choice id}.
 * `first` is true at the seat's first turn, when what was brought is compared with last time.
 * `only` limits the kinds that count (the dial of CBD56); by default all do.
 */
export function fightPauseReasons(view, memory = {}, {first = false, only = FIGHT_PAUSE_KINDS} = {}) {
    check(object(view) && object(view.you) && Array.isArray(view.choices), 'A pause check needs a fight view.');
    check(object(memory), 'Pause memory is an object.');
    if (!view.yourTurn) return [];
    const reasons = [];
    if (first && only.includes('new foe') && Array.isArray(memory.knownFoes)) {
        for (const p of people(view)) {
            if (p.relation !== 'foe' || memory.knownFoes.includes(p.kind ?? p.id)) continue;
            reasons.push({kind: 'new foe', subject: p.id, text: `${p.name ?? 'Someone'}: not fought before.`});
        }
    }
    if (first && only.includes('lower means') && object(memory.means)) {
        for (const m of view.you.means ?? []) {
            const then = memory.means[m.id];
            if (!Number.isFinite(then) || !Number.isFinite(m.amount) || m.amount >= then) continue;
            reasons.push({kind: 'lower means', subject: m.id, text: `${m.label ?? 'A means'}: ${m.amount}. Last time here: ${then}.`});
        }
    }
    if (only.includes('pick gone') && typeof memory.lastPick === 'string') {
        const last = view.choices.find(c => c.id === memory.lastPick), policy = view.choices.find(c => c.policy);
        if (last?.blocked && policy?.id !== last.id) reasons.push({kind: 'pick gone', subject: last.id,
            text: `${last.what ?? 'That move'}: no longer possible, ${last.blocked[0].toLowerCase()}${last.blocked.slice(1).replace(/\.$/, '')}.`});
    }
    return reasons;
}

/** What to remember for next time, taken at the seat's first turn: who was met and what was brought. */
export function fightPauseMemory(view, memory = {}) {
    check(object(view) && object(view.you), 'Pause memory needs a fight view.');
    const foes = people(view).filter(p => p.relation === 'foe').map(p => p.kind ?? p.id);
    return {...memory, knownFoes: [...new Set([...(memory.knownFoes ?? []), ...foes])].sort(),
        means: {...(memory.means ?? {}), ...Object.fromEntries((view.you.means ?? []).filter(m => Number.isFinite(m.amount)).map(m => [m.id, m.amount]))}};
}
