// FD16 layers 1 and 3 for Tingen: the derived quiet-hours deck and two scheduled calendar days (storylet_deck2.js, book_world_lotm_deck.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import {eventFeed} from '../src/event_feed.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {runDeck2, drawSlot, cardWeight, quietWeight, validateDeck2, DECK2_SCHEMA} from '../src/storylet_deck2.js';
import {TINGEN_DECK, TINGEN_CARDS, tingenDraws, tingenDeckNews, slotFacts, calendarEventsOn, TINGEN_WEEK} from '../src/book_world_lotm_deck.js';
import {createStreams} from '../src/seeded_streams.js';
import {STORYLET_DECKS} from '../src/storylet_deck.js';

const none = {heat: () => null, positions: () => []};
const tingen = (seed = 7, days = 20) => {
    const s = initializeExpedition(createExpansionState(seed));
    s.actors.player.worldId = 'book.lotm.tingen';
    s.streams = createStreams(seed);
    s.lotm = {initializedAt: 1000};
    s.clock = 1000 + days * 1440 + 600;
    return s;
};
const ids = draws => draws.map(d => d.cardId);

test('same seed and day give the same draws; a different seed gives a different run', () => {
    const a = ids(tingenDraws(tingen(7), none)), b = ids(tingenDraws(tingen(7), none)), c = ids(tingenDraws(tingen(8), none));
    assert.deepEqual(a, b);
    assert.notDeepEqual(a, c);
    // Stepping the clock in chunks does not change what was drawn for earlier slots (no per-tick state to drift).
    const early = ids(tingenDraws({...tingen(7, 5)}, none));
    assert.deepEqual(early, a.slice(0, early.length));
    assert.ok(a.some(Boolean) && a.some(x => x === null), 'a mix of cards and quiet slots');
});

test('cooldown: no card repeats inside its window, over many seeds', () => {
    for(let seed = 1; seed <= 25; seed++) {
        const last = {};
        for(const [slot, d] of tingenDraws(tingen(seed, 60), none).entries()) {
            if(!d.cardId) continue;
            const cd = TINGEN_CARDS.find(c => c.id === d.cardId).cooldown ?? TINGEN_DECK.cooldown;
            if(last[d.cardId] !== undefined) assert.ok(slot - last[d.cardId] >= cd, `${d.cardId} repeated after ${slot - last[d.cardId]} slots (seed ${seed})`);
            last[d.cardId] = slot;
        }
    }
});

test('weights follow state: fog cards only on fog slots, market cards only on market day, service cards only on service day', () => {
    const fogIds = new Set(['tingen.coal_smoke_fog', 'tingen.cab_in_the_dark']);
    let sawFog = false, sawMarket = false, sawService = false;
    for(let seed = 1; seed <= 25; seed++) for(const [slot, d] of tingenDraws(tingen(seed, 60), none).entries()) {
        const f = slotFacts(slot);
        if(fogIds.has(d.cardId)) { sawFog = true; assert.ok(f.fog, `fog card ${d.cardId} in a clear slot`); }
        if(d.cardId === 'tingen.market_noise' || d.cardId === 'tingen.street_singer') { sawMarket = true; assert.ok(f.market); }
        if(d.cardId === 'tingen.service_hats') { sawService = true; assert.ok(f.service && f.slotOfDay === 1); }
    }
    assert.ok(sawFog && sawMarket && sawService, 'each gated family is reachable');
    const card = id => TINGEN_CARDS.find(c => c.id === `tingen.${id}`);
    assert.equal(cardWeight(card('coal_smoke_fog'), slotFacts(2)), 0);          // 12:00-18:00, no fog
    assert.ok(cardWeight(card('coal_smoke_fog'), slotFacts(3)) > 0);            // evening fog
    // heat lifts the constable, a civil post lifts the clerks, service day lifts the bell
    const nightFacts = {...slotFacts(0), heat: 0, position: []};
    assert.ok(cardWeight(card('constable_lantern'), {...nightFacts, heat: 2}) > 4 * cardWeight(card('constable_lantern'), nightFacts));
    const morning = slotFacts(1 + 4 * 1); // day 2, morning (a workday)
    assert.ok(cardWeight(card('clerks_hurry'), {...morning, position: ['Civil staff']}) > cardWeight(card('clerks_hurry'), {...morning, position: []}));
    assert.ok(cardWeight(card('church_bell'), slotFacts(1 + 4 * (TINGEN_WEEK.service - 1))) > 5 * cardWeight(card('church_bell'), slotFacts(1)));
});

test('dry-spell dial: the quiet weight falls after a run of empty slots and never below its floor', () => {
    const d = TINGEN_DECK;
    assert.equal(quietWeight(d, 0), d.quiet);
    assert.equal(quietWeight(d, d.dry.after), d.quiet);
    assert.ok(quietWeight(d, d.dry.after + 2) < quietWeight(d, d.dry.after + 1));
    assert.equal(quietWeight(d, 99), d.quiet * d.dry.floor);
    // A deck with one always-eligible card: after a dry run the card is drawn more often than with the dial off.
    const one = validateDeck2({id: 'test.dry', slotMinutes: 60, quiet: 20, cooldown: 0, dry: {after: 2, relief: .5, floor: .05}, cards: [{id: 'c', text: 't', cooldown: 0}]});
    const off = {...one, dry: {after: 9999, relief: 1, floor: 1}};
    const count = deck => runDeck2(deck, 5, 399, () => ({}), deck.dry.after + deck.id).filter(x => x.cardId).length;
    assert.ok(count(one) > count(off));
});

test('schema 2 is additive: schema 1 decks are the same four Village decks and the Tingen deck is not one of them', () => {
    assert.equal(DECK2_SCHEMA, 2);
    assert.deepEqual(STORYLET_DECKS.map(d => d.id), ['village.daily', 'village.people', 'village.chances', 'village.threats']);
    assert.ok(!STORYLET_DECKS.some(d => d.id === TINGEN_DECK.id));
    assert.throws(() => validateDeck2({...TINGEN_DECK, cards: [TINGEN_CARDS[0], TINGEN_CARDS[0]]}));
    assert.ok(TINGEN_CARDS.length >= 10 && TINGEN_CARDS.length <= 15);
});

test('the deck reaches the Events list in a Tingen life, with the market and service days from the clock', () => {
    const state = tingen(7, 20);
    const feed = eventFeed(state, registry);
    const rows = tingenDeckNews(state, none);
    assert.ok(rows.length > 0);
    const text = feed.news.map(n => n.text).join('|');
    assert.ok(rows.some(r => text.includes(r.text)) || feed.news.length === 8);
    assert.deepEqual(rows.map(r => r.id), tingenDeckNews(state, none).map(r => r.id));
    // calendar days: scheduled by dow, never drawn
    const market = 1000 + (TINGEN_WEEK.market - 1) * 1440 + 9 * 60;
    const early = {...state, clock: market - 120};
    assert.ok(!tingenDeckNews(early, none).some(r => r.id.startsWith('tingen:cal:market')));
    assert.ok(tingenDeckNews({...state, clock: market}, none).some(r => r.id === 'tingen:cal:market@d3'));
    assert.deepEqual(calendarEventsOn(TINGEN_WEEK.service).map(e => e.id), ['service']);
    assert.deepEqual(calendarEventsOn(1), []);
    for(const r of tingenDeckNews(state, none)) assert.match(r.id, /^tingen:(deck|cal):/);
});

test('failure scenario: a Frontier life, or a world without the Tingen owner, gets no Tingen cards', () => {
    const frontier = initializeExpedition(createExpansionState(7));
    frontier.clock = 5000;
    assert.deepEqual(tingenDeckNews(frontier, none), []);
    assert.ok(!eventFeed(frontier, registry).news.some(n => n.id.startsWith('tingen:')));
    const crossed = tingen(7, 20); crossed.actors.player.worldId = 'base.frontier';          // crossed back: stale lotm slice, wrong world
    assert.deepEqual(tingenDeckNews(crossed, none), []);
    assert.ok(!eventFeed(crossed, registry).news.some(n => n.id.startsWith('tingen:')));
    const noOwner = tingen(7, 20); delete noOwner.lotm;                                      // Tingen world id but no optional owner
    assert.deepEqual(tingenDeckNews(noOwner, none), []);
});

test('the feed read changes no state', () => {
    const state = tingen(7, 12), before = JSON.stringify(state);
    eventFeed(state, registry);
    assert.equal(JSON.stringify(state), before);
});
