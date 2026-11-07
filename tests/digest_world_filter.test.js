// AT26: an occurrence a Frontier definition pinned to base.frontier is not news in another world's life.
import test from 'node:test';
import assert from 'node:assert/strict';
import {eventFeed} from '../src/event_feed.js';
import {returnDigest} from '../src/return_digest.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';

const shower = (state, id = 'occurrence:1') => {
    state.simulation = {knowledge: {player: {}}, people: {}, log: [], ...state.simulation, events: {[id]: {id, definitionId: 'village.shower', actorId: 'player', discoveredBy: ['player'], at: 100, status: 'expired',
        mode: 'offer', expiresAt: 150, label: 'A short shower reaches the Village workbench', responses: [{id: 'wait'}]}}};
    state.clock = 3000;
    return state;
};
const fresh = () => shower(initializeExpedition(createExpansionState(7)));
const texts = feed => feed.news.map(n => n.text).join('|');

test('a Frontier life still hears its own shower line', () => {
    const state = fresh();
    assert.match(texts(eventFeed(state, registry)), /short shower/);
    const d = returnDigest(state, registry, {seenAt: 0});
    assert.match(d.text, /short shower/);
});
test('a LOTM life gets no Frontier weather line in Events or the While you were away digest', () => {
    const state = fresh();
    state.actors.player.worldId = 'book.lotm';
    assert.doesNotMatch(texts(eventFeed(state, registry)), /shower/);
    const d = returnDigest(state, registry, {seenAt: 0});
    assert.doesNotMatch(d.text, /shower/);
});
test('an occurrence whose definition pins no world still shows wherever the player is', () => {
    const state = fresh();
    state.simulation.events['occurrence:1'].definitionId = 'not.registered';
    state.actors.player.worldId = 'book.lotm';
    assert.match(texts(eventFeed(state, registry)), /short shower/);
});
