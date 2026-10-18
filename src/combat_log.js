// R22 combat log: the event snapshot a combat line carries, its compact wording and the UX18
// equivalence key. Leaf module: reads only the fighters handed to it at emit time, no game state,
// no RNG. The native line text is unchanged; this only shapes the parity presentation.
//
// Snapshot: {encounter, outcome: 'hit'|'miss'|'block'|'defeat', actor, target, amount, hits,
//   critical, partial, direction: 'dealt'|'taken'|'other'}
// participant: {name, you, side: 'ally'|'hostile', slot, letter, hue} (hue: R22b kind hue, hostile only)
// Letters are assigned at encounter start by native slot (R1, W3, IL60): the defender index does
// not change during a wave, and a new wave is a new Combat object, so its serial differs and old
// lines never resolve to the new opponent in the same slot.
import {letterFor,kindHue} from './opponent_board.js';

const serials = new WeakMap();
let nextSerial = 1;
export function encounterSerial(combat) {
    if (!combat || typeof combat !== 'object') return 0;
    if (!serials.has(combat)) serials.set(combat, nextSerial++);
    return serials.get(combat);
}

function participant(fighter, sideFighters, slot, isAttackerSide) {
    const you = !!fighter?.tags?.main_character;
    // A letter only tells fighters apart, so a side of one gets none (the board shows one card).
    const letter = !you && sideFighters?.length > 1 && slot >= 0 ? letterFor(slot) : '';
    const hue = !you && !isAttackerSide ? kindHue((sideFighters || []).map(f => String(f?.name ?? '?')), String(fighter?.name ?? '?')) : null;
    return {name: you ? 'You' : String(fighter?.name ?? '?'), you, side: isAttackerSide ? 'ally' : 'hostile', slot, letter, hue};
}

export function combatLogEvent(combat, {fighter, fighterIndex, isAttacker, target, outcome, amount = null, hits = 1, critical = false, partial = false}) {
    const actorSide = isAttacker ? combat.attackers : combat.defenders, targetSide = isAttacker ? combat.defenders : combat.attackers;
    const actor = participant(fighter, actorSide, fighterIndex, isAttacker);
    const struck = participant(target, targetSide, targetSide.indexOf(target), !isAttacker);
    const direction = actor.side === 'ally' && struck.side === 'hostile' ? 'dealt' : actor.side === 'hostile' && struck.side === 'ally' ? 'taken' : 'other';
    return {encounter: encounterSerial(combat), outcome, actor, target: struck, direction,
        amount: amount == null ? null : Math.ceil(10 * amount) / 10, hits, critical: !!critical, partial: !!partial};
}

// UX18: equivalent means same encounter, same actor and target slots, same outcome, amount, hit
// count, crit and block. A defeat is a transition and never collapses.
export function combatLogKey(event) {
    if (!event || event.outcome === 'defeat') return '';
    const who = p => `${p.side}:${p.you ? 'you' : p.slot}`;
    return [event.encounter, event.outcome, who(event.actor), who(event.target), event.amount ?? '', event.hits, event.critical ? 1 : 0, event.partial ? 1 : 0].join('|');
}

const label = p => p.letter ? `${p.name} ${p.letter}` : p.name;
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

// ×N: one line stands for adjacent equivalent occurrences. Each occurrence keeps its in-game
// time; the button lists them, so the events stay reachable (UX18).
export function addCombatOccurrence(message, time) {
    const list = message.combatOccurrences || (message.combatOccurrences = []);
    list.push(time);
    const n = list.length;
    message.dataset.repeat = String(n);
    if (n < 2) return n;
    let button = message.querySelector(':scope > .log-repeat');
    if (!button) {
        button = document.createElement('button');
        button.type = 'button';button.className = 'log-repeat';button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', () => {
            const open = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(open));
            let times = message.querySelector(':scope > .log-occurrences');
            if (!open) {times?.remove();return;}
            if (!times) {times = document.createElement('ol');times.className = 'log-occurrences';button.after(times);}
            times.replaceChildren(...message.combatOccurrences.map(at => {const li = document.createElement('li');li.textContent = at || 'time not recorded';return li;}));
        });
        const anchor = message.querySelector(':scope > .notice-panel-link, :scope > .message_border');
        message.insertBefore(button, anchor);
    }
    button.textContent = `×${n}`;
    button.setAttribute('aria-label', `Repeated ${n} times. Show when`);
    const times = message.querySelector(':scope > .log-occurrences');
    if (times) times.replaceChildren(...list.map(at => {const li = document.createElement('li');li.textContent = at || 'time not recorded';return li;}));
    return n;
}
