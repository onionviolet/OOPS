// R22 combat log: the event snapshot a combat line carries, its compact wording and the UX18
// equivalence key. Leaf module: reads only the fighters handed to it at emit time, no game state,
// no RNG. The native line text is unchanged; this only shapes the parity presentation.
//
// Snapshot: {encounter, outcome: 'hit'|'miss'|'block'|'defeat', actor, target, amount, hits,
//   critical, partial, direction: 'dealt'|'taken'|'other'}
// participant: {name, you, side: 'ally'|'hostile', slot, letter, hue, ordinal, kindCount} (hue: R22b
//   kind hue, hostile only; ordinal of kindCount: R22c position among same-named fighters)
// Letters are assigned at encounter start by native slot (R1, W3, IL60): the defender index does
// not change during a wave, and a new wave is a new Combat object, so its serial differs and old
// lines never resolve to the new opponent in the same slot.
import {letterFor,kindHue} from './opponent_board.js';

import {encounterSerial,combatSubject} from './combat_subject.js';
export {encounterSerial};

function participant(fighter, sideFighters, slot, isAttackerSide) {
    const you = !!fighter?.tags?.main_character;
    // A letter only tells fighters apart, so a side of one gets none (the board shows one card).
    const letter = !you && sideFighters?.length > 1 && slot >= 0 ? letterFor(slot) : '';
    const names = (sideFighters || []).map(f => String(f?.name ?? '?')), name = String(fighter?.name ?? '?');
    const hue = !you && !isAttackerSide ? kindHue(names, name) : null;
    const kindCount = names.filter(n => n === name).length, ordinal = names.slice(0, Math.max(0, slot)).filter(n => n === name).length + 1;
    return {name: you ? 'You' : name, you, side: isAttackerSide ? 'ally' : 'hostile', slot, letter, hue, ordinal, kindCount};
}

export function combatLogEvent(combat, {fighter, fighterIndex, isAttacker, target, outcome, amount = null, hits = 1, critical = false, partial = false}) {
    const actorSide = isAttacker ? combat.attackers : combat.defenders, targetSide = isAttacker ? combat.defenders : combat.attackers;
    const actor = participant(fighter, actorSide, fighterIndex, isAttacker);
    const struck = participant(target, targetSide, targetSide.indexOf(target), !isAttacker);
    actor.subject = combatSubject(combat,fighter);struck.subject = combatSubject(combat,target);
    const direction = actor.side === 'ally' && struck.side === 'hostile' ? 'dealt' : actor.side === 'hostile' && struck.side === 'ally' ? 'taken' : 'other';
    return {encounter: encounterSerial(combat), outcome, actor, target: struck, direction,
        amount: amount == null ? null : Math.ceil(10 * amount) / 10, hits, critical: !!critical, partial: !!partial};
}

// UX18: equivalent means same encounter, same actor and target slots, same outcome, amount, hit
// count, crit and block. A defeat is a transition and never collapses. R22c (FC13): with opponent
// letters off (`byKind`), fighters of one kind compare by name, so lines that read the same merge;
// each occurrence still keeps which one it was (occurrenceLabel).
export function combatLogKey(event, {byKind = false} = {}) {
    if (!event || event.outcome === 'defeat') return '';
    const who = p => `${p.side}:${p.you ? 'you' : byKind ? `name:${p.name}` : p.slot}`;
    return [event.encounter, event.outcome, who(event.actor), who(event.target), event.amount ?? '', event.hits, event.critical ? 1 : 0, event.partial ? 1 : 0].join('|');
}

const label = p => p.letter ? `${p.name} ${p.letter}` : p.name;
// R22c: which opponent an occurrence was, without letters ("Wolf rat 2 of 3").
export function occurrenceLabel(event) {
    const p = [event.actor, event.target].find(x => x && !x.you && x.side === 'hostile');
    return p && p.kindCount > 1 ? `${p.name} ${p.ordinal} of ${p.kindCount}` : '';
}
// The hostile slot a line is about, for hover links between Reports and the board.
export const hostileSubject = event => [event.actor,event.target].find(p=>p?.side==='hostile')?.subject || null;
export const hostileSlot = event => [event.actor, event.target].find(x => x && x.side === 'hostile' && x.slot >= 0)?.slot ?? null;
// Wording without DOM, for tests and accessible names.
export function combatLogText(event) {
    const a = event.actor, t = event.target, you = p => p.you ? 'you' : label(p), verb = (p, plain, third) => p.you ? plain : third;
    const extra = [event.hits > 1 ? `${event.hits} hits` : '', event.partial ? 'part blocked' : ''].filter(Boolean).join(', ');
    switch (event.outcome) {
        case 'hit': return `${label(a)} ${verb(a, event.critical ? 'crit' : 'hit', event.critical ? 'crits' : 'hits')} ${you(t)} for ${event.amount}${extra ? ` (${extra})` : ''}`;
        case 'miss': return `${label(a)} ${verb(a, 'miss', 'misses')} ${you(t)}`;
        case 'block': return `${label(t)} ${verb(t, 'block', 'blocks')} ${you(a)}`;
        case 'defeat': return `${label(t)} defeated`;
        default: return '';
    }
}

function nameNode(p, lowerYou) {
    const span = document.createElement('span');
    span.className = 'log-name';span.dataset.side = p.side;
    if (p.you) {span.dataset.you = 'true';span.textContent = lowerYou ? 'you' : 'You';return span;}
    if (p.hue != null) span.dataset.kindHue = String(p.hue);
    if (p.kindCount > 1) span.title = `${p.name}, ${p.ordinal} of ${p.kindCount}`;
    span.append(p.name);
    if (p.letter) {const letter = document.createElement('span');letter.className = 'log-letter';letter.textContent = p.letter;span.append(' ', letter);}
    return span;
}
function valueNode(event) {
    const span = document.createElement('span');
    span.className = 'log-value';
    // Same roles the regex decoration used: loss when the hero side takes it, damage otherwise.
    span.dataset.valueRole = event.target.side === 'ally' ? 'loss' : 'damage';
    if (event.critical) span.dataset.critical = 'true';
    span.textContent = String(event.amount);
    return span;
}
// Fills the compact branch of a log line. The native text stays in the original branch and the
// title, so nothing the classic presentation said is lost.
export function renderCombatLine(compact, event) {
    const a = event.actor, t = event.target, verb = (p, plain, third) => p.you ? plain : third;
    const parts = [];
    switch (event.outcome) {
        case 'hit': {
            parts.push(nameNode(a), ` ${verb(a, event.critical ? 'crit' : 'hit', event.critical ? 'crits' : 'hits')} `, nameNode(t, true), ' for ', valueNode(event));
            const extra = [event.hits > 1 ? `${event.hits} hits` : '', event.partial ? 'part blocked' : ''].filter(Boolean).join(', ');
            if (extra) parts.push(` (${extra})`);
            break;
        }
        case 'miss': parts.push(nameNode(a), ` ${verb(a, 'miss', 'misses')} `, nameNode(t, true));break;
        case 'block': parts.push(nameNode(t), ` ${verb(t, 'block', 'blocks')} `, nameNode(a, true));break;
        case 'defeat': parts.push(nameNode(t), ' defeated');break;
        default: return false;
    }
    compact.replaceChildren(...parts);
    return true;
}

// The count is exact; only the latest detail window is retained. An opened list is a
// fixed snapshot so incoming hits cannot move the reader's place or focused control.
export const COMBAT_OCCURRENCE_WINDOW = 100;
export function addCombatOccurrence(message, time) {
    const doc = message.ownerDocument || document;
    const list = message.combatOccurrences || (message.combatOccurrences = []);
    list.push(time);
    if (list.length > COMBAT_OCCURRENCE_WINDOW) list.shift();
    const n = (message.combatOccurrenceTotal || 0) + 1;
    message.combatOccurrenceTotal = n;
    message.dataset.repeat = String(n);
    if (n < 2) return n;
    let button = message.querySelector(':scope > .log-repeat');
    if (!button) {
        button = doc.createElement('button');
        button.type = 'button';button.className = 'log-repeat';button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', () => {
            const open = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(open));
            const existing = message.querySelector(':scope > .log-occurrences');
            existing?.remove();
            if (!open) return;
            const times = doc.createElement('div');times.className = 'log-occurrences';
            const entries = doc.createElement('ol');
            const end = message.combatOccurrenceTotal, first = end - message.combatOccurrences.length + 1;
            entries.setAttribute('start', String(first));
            const caption = doc.createElement('p');
            caption.textContent = `Snapshot: occurrences ${first}–${end} of ${end}. Latest ${COMBAT_OCCURRENCE_WINDOW} time labels retained per group; older labels are discarded. Close and reopen for the latest. Times are game HH:MM, not full dates.`;
            times.append(caption);
            for (const at of message.combatOccurrences) {
                const li = doc.createElement('li');li.textContent = at || 'time not recorded';entries.append(li);
            }
            times.append(entries);
            button.after(times);
        });
        const anchor = message.querySelector(':scope > .notice-panel-link, :scope > .message_border');
        message.insertBefore(button, anchor);
    }
    button.textContent = `×${n}`;
    button.setAttribute('aria-label', `Repeated ${n} times. Toggle recent time snapshot; latest ${COMBAT_OCCURRENCE_WINDOW} retained`);
    return n;
}
