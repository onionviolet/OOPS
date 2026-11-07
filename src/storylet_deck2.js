// Storylet deck schema 2 (FD16 layer 3, LANE_B_EVENTS). A pure leaf: no save field, no clock of its own, no Math.random.
// Schema 1 (storylet_deck.js, the four Village decks) is untouched; this is an additive second shape for decks that are DERIVED,
// not stored: the draw for a slot is a function of (seed, deck id, slot index) and of the cards drawn in earlier slots, so the same
// seed and the same clock give the same card on every read, reload and replay.
//
// deck = {id, slotMinutes, quiet, cooldown, dry:{after, relief, floor}, cards}
// card = {id, text, cooldown?, needs?, plus?}   needs/plus read a facts object the caller supplies per slot:
//   needs:{fact: value | [values] | predicate}  all must match, else the card cannot be drawn this slot (weight 0)
//   plus:[{when:{...same matcher}, add?, mult?}] add first, then mult, so a state can lift or damp a card
//   base weight is `weight` (default 1).
// Dials (default, reason):
//   quiet 3        the weight of "nothing happens". Ordinary hours stay quiet; a pile of eligible cards still fires most slots.
//   cooldown 12    slots a card sits out after it is drawn (3 days at 6-hour slots): no repeat inside the window.
//   dry {after:3, relief:.5, floor:.15}  after 3 empty slots in a row the quiet weight halves per further empty slot, never below 15% of
//                  itself, so a long dry spell ends without ever forcing a card (a pity dial, not a guarantee).
import {hashStreamSeed, mix32} from './hash_rng.js';

export const DECK2_SCHEMA = 2;
const matchOne = (want, have) => typeof want === 'function' ? !!want(have) : Array.isArray(want) ? (Array.isArray(have) ? want.some(w => have.includes(w)) : want.includes(have)) :
    Array.isArray(have) ? have.includes(want) : have === want;
export const matches = (when, facts) => Object.entries(when || {}).every(([k, want]) => matchOne(want, facts[k]));

export function validateDeck2(deck) {
    const bad = m => { throw Error(`Invalid storylet deck 2 (${deck?.id}): ${m}`); };
    if(!deck || typeof deck.id !== 'string' || !deck.id) bad('needs an id');
    if(!Number.isInteger(deck.slotMinutes) || deck.slotMinutes < 1) bad('slotMinutes');
    if(!(deck.quiet >= 0) || !Number.isInteger(deck.cooldown) || deck.cooldown < 0) bad('quiet or cooldown');
    if(!deck.dry || !(deck.dry.relief > 0 && deck.dry.relief <= 1) || !(deck.dry.floor >= 0 && deck.dry.floor <= 1) || !Number.isInteger(deck.dry.after)) bad('dry');
    const ids = new Set();
    for(const c of deck.cards || []) {
        if(!c.id || ids.has(c.id) || typeof c.text !== 'string' || !c.text) bad(`card ${c.id}`);
        ids.add(c.id);
    }
    return deck;
}
// Slot weight of one card for this slot's facts (0 when it cannot be drawn).
export function cardWeight(card, facts) {
    if(!matches(card.needs, facts)) return 0;
    let w = card.weight ?? 1, mult = 1;
    for(const p of card.plus || []) if(matches(p.when, facts)) { w += p.add ?? 0; mult *= p.mult ?? 1; }
    return Math.max(0, w * mult);
}
export const quietWeight = (deck, dry) => deck.quiet * (dry > deck.dry.after ? Math.max(deck.dry.floor, deck.dry.relief ** (dry - deck.dry.after)) : 1);
const unit = (seed, deckId, slot) => mix32(hashStreamSeed(seed, `deck2:${deckId}:${slot}`)) / 0x100000000;

// One slot's draw given the running history. Returns {cardId|null, roll, total, weights(top 3), dry}.
export function drawSlot(deck, seed, slot, facts, history) {
    const weights = deck.cards.flatMap(c => {
        const last = history.last[c.id];
        if(last !== undefined && slot - last < (c.cooldown ?? deck.cooldown)) return [];
        const w = cardWeight(c, facts);
        return w > 0 ? [{id: c.id, weight: w}] : [];
    });
    const quiet = quietWeight(deck, history.dry), total = quiet + weights.reduce((n, c) => n + c.weight, 0), roll = unit(seed, deck.id, slot);
    let cursor = roll * total, cardId = null;
    for(const c of weights) { cursor -= c.weight; if(cursor < 0) { cardId = c.id; break; } }
    return {slot, cardId, roll, total, dry: history.dry, weights: [...weights].sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id)).slice(0, 3)};
}
const caches = new Map();
// The deck's draws for slots [0..upto], in order. `factsAt(slot)` must be a pure function of the slot (and of state that does not move
// between reads); results are memoised per (seed, deck, facts signature) and extended, so a feed read costs one slot, not the whole run.
export function runDeck2(deck, seed, upto, factsAt, signature = '') {
    const key = `${seed}|${deck.id}|${signature}`;
    let run = caches.get(key);
    if(!run) { run = {draws: [], history: {last: {}, dry: 0}}; caches.set(key, run); if(caches.size > 16) caches.delete(caches.keys().next().value); }
    while(run.draws.length <= upto) {
        const slot = run.draws.length, d = drawSlot(deck, seed, slot, factsAt(slot), run.history);
        if(d.cardId) { run.history.last[d.cardId] = slot; run.history.dry = 0; } else run.history.dry++;
        run.draws.push(d);
    }
    return run.draws.slice(0, upto + 1);
}
