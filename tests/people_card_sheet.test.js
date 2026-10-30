import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {initializeExpedition, expeditionRegistry} from '../src/expedition_content.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation} from '../src/simulation.js';

const state = () => enrollSimulation(initializeExpedition(createExpansionState(23)), expeditionRegistry,
    {actorId: 'player', worldId: 'base.frontier', facts: {location: 'Village'}, external: {money: 30}}).state;
const met = {'village.craftsmanMet': true, location: 'Village', calendarMinute: 1440 * 3};

test('the sheet owns where, what you know and what you remember; the card keeps name, bond and a way in (UR73)', async () => {
    const dom = createDom(); dom.loadHTML('<html><body></body></html>');
    globalThis.document = dom.document;
    try {
        const {createPeopleOverview} = await import('../src/people_ui.js');
        const people = createPeopleOverview(); dom.document.body.append(people.panel);
        assert.equal(people.render(state(), met), 1);
        const card = people.panel.querySelector('[data-known-person="oldCraftsman"]');
        const sheet = card.querySelector('[data-person-sheet]');
        // The card itself carries no location paragraph, details block or memory list of its own.
        const own = [...card.children].filter(child => child !== sheet).map(child => child.tagName);
        assert.deepEqual(own.filter(tag => tag !== 'SUMMARY' && !/^(DIV|SPAN)$/.test(tag)), []);
        assert.equal(card.querySelector(':scope > p'), null);
        assert.equal(card.querySelector(':scope > ul'), null);
        // Every one of those lines is in the sheet's Between you, once.
        const text = sheet.textContent;
        assert.equal((text.match(/Last known: Village/g) || []).length, 1);
        assert.match(sheet.querySelector('summary').textContent, /Character sheet/);
        assert.equal(sheet.open, true);
    } finally { delete globalThis.document; }
});
