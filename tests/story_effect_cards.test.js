// PWC129: story cards carry effects; the director surfaces them and the one path (landEffect) lands them on the household.
import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeExpedition} from '../src/expedition_content.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {createStreams} from '../src/seeded_streams.js';
import {TINGEN_EFFECT_CARDS, CARD_BY_ID, tingenDirected, tingenDeckNews} from '../src/book_world_lotm_deck.js';
import {createHousehold, landCard, deliverWindows, freshStoryEffects, validateStoryEffects} from '../src/story_effect_cards.js';
import {validateDeck2} from '../src/storylet_deck2.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureUiPorts} from '../src/ui_ports.js';
import {configureStoryEffects} from '../src/story_effects_domain.js';
import {thoughtRows} from '../src/mood_thoughts_domain.js';

const none = {heat: () => null, positions: () => []};
const tingen = (seed, days) => {
    const s = initializeExpedition(createExpansionState(seed));
    s.actors.player.worldId = 'book.lotm.tingen';
    s.streams = createStreams(seed);
    s.lotm = {initializedAt: 1000};
    s.clock = 1000 + days * 1440 + 600;
    return s;
};
const slot = (state) => Math.floor((state.clock - 1000) / 360);

test('an effect card needs a row and a sentence; a plain card is unchanged', () => {
    assert.throws(() => validateDeck2({id: 'x', slotMinutes: 360, quiet: 1, cooldown: 1, dry: {after: 1, relief: .5, floor: .1}, cards: [{id: 'a', text: 't', effect: {row: 'r'}}]}), /effect/);
});

test('every effect card lands through landEffect and moves the household in the way its text says', () => {
    for(const card of TINGEN_EFFECT_CARDS) {
        const out = landCard(createHousehold(), card, 0);
        assert.equal(out.status, 'landed', card.id);
        assert.ok(card.effect.line.length > 0 && !/vitality|remove|add /i.test(card.effect.line + card.text), `${card.id} player text has no engine words`);
        assert.ok(out.delta !== 0, `${card.id} changed nothing`);
        assert.equal(Math.sign(out.delta), Math.sign(card.effect.thought.magnitude), `${card.id} mood follows the body`);
    }
});

test('across a season three or more card-delivered effects land for every seed, each once', () => {
    for(const seed of [1, 2, 3, 4, 5]) {
        const state = tingen(seed, 90), directed = tingenDirected(state, none), upto = slot(state);
        const first = deliverWindows({...freshStoryEffects(), through: -1}, directed, CARD_BY_ID, upto);
        assert.ok(first.landed.length >= 3, `seed ${seed}: ${first.landed.length} effects`);
        assert.ok(first.landed.every(r => r.status === 'landed' && r.line), `seed ${seed}: all land`);
        const again = deliverWindows(first.record, directed, CARD_BY_ID, upto);
        assert.equal(again.landed.length, 0, 'nothing lands twice after the cursor');
        // A reload that lost the last windows replays them to the same world.
        const partial = deliverWindows({...freshStoryEffects(), through: -1}, directed, CARD_BY_ID, Math.floor(upto / 2));
        const rest = deliverWindows(partial.record, directed, CARD_BY_ID, upto);
        assert.deepEqual(rest.record.world, first.record.world);
    }
});

test('a record with no cursor starts at the present: an old life gets no backlog', () => {
    const state = tingen(2, 60), directed = tingenDirected(state, none);
    const out = deliverWindows(undefined, directed, CARD_BY_ID, slot(state));
    assert.equal(out.landed.length, 0);
    assert.equal(out.record.through, slot(state));
    validateStoryEffects(structuredClone(out.record));
    assert.throws(() => validateStoryEffects({version: 9, log: []}), /unsupported/);
});

test('the surfaced card also reads in the Events list with its own text and no row id', () => {
    const state = tingen(3, 90), shown = tingenDeckNews(state, none).map(n => n.text).join('\n');
    assert.ok(!/hp\.potion|gu:/.test(shown));
    assert.ok(tingenDirected(state, none).some(o => o.surfaced?.id.startsWith('tingen.fx.')));
});

test('the domain lands on the tick, writes Reports and a mood thought, saves the cursor and survives a reload', () => {
    const lines = [];
    configureStoryEffects({logMessage: line => lines.push(line)});
    let state = tingen(1, 0);
    configureUiPorts({expansion: () => state});
    domainRegistry.initialize();
    domainRegistry.tick(10);                       // first tick: cursor set, no backlog
    assert.equal(domainRegistry.project('storyEffects').through, slot(state));
    state = tingen(1, 90);
    domainRegistry.tick(60);
    const view = domainRegistry.project('storyEffects');
    assert.ok(lines.length >= 3, `landed ${lines.length}`);
    assert.ok(view.landed.every(r => r.row && r.status === 'landed'));
    const total = lines.length;
    assert.ok(thoughtRows().rows.some(r => r.source.startsWith('tingen.fx.')));
    const envelope = domainRegistry.save({});
    assert.ok(envelope.storyEffects.world);
    domainRegistry.validate(structuredClone(envelope));
    domainRegistry.load(structuredClone(envelope));
    domainRegistry.tick(60);
    assert.equal(lines.length, total, 'a reload and a tick land nothing again');
});

test('effects stay occasional: a season brings some, never one a window', () => {
    for(const seed of [1, 2, 3]) {
        const state = tingen(seed, 90), n = tingenDirected(state, none).filter(o => o.surfaced?.id.startsWith('tingen.fx.')).length;
        assert.ok(n >= 3 && n <= 30, `seed ${seed}: ${n}`);
    }
});
