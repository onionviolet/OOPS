import test from 'node:test';
import assert from 'node:assert/strict';
import {configureTempoFight, placePanel, ENCOUNTER_SLOT, PANEL_ID} from '../src/tempo_fight_domain.js';
import {neutralWritable} from '../src/native_tool_domains.js';
import {domainRegistry} from '../src/domain_registry.js';
import {registerTempoOpener} from '../src/tempo_starters.js';

// AR17 / AT15 T1: the tempo host takes the save-state write port, never the Frontier harvest port.
const WORLD = 'book.lotm';
registerTempoOpener({id: 'test.host.opener', label: 'Draw the revolver', text: '', spec: () => ({}),
    quote: state => state.actors.player.worldId === WORLD ? {visible: true, eligible: true, reason: '6 loaded, 14 carried.'} : {visible: false}});
const state = {actors: {player: {worldId: WORLD, facts: {}}}, simulation: {sessions: {}, people: {}}};
const ports = writable => ({root: () => state, campaignContext: () => ({busy: false}), writable});
const opener = () => domainRegistry.project('tempo_fight')?.openers?.find(o => o.id === 'test.host.opener');

test('a LOTM-world opener quote is eligible when the write port does not check the world', () => {
    const operations = {tradeWritable: () => true, writable: () => false};
    configureTempoFight(ports(neutralWritable(operations)));
    assert.equal(opener().eligible, true);
    assert.equal(opener().reason, '6 loaded, 14 carried.');
});
test('a Frontier-only port still refuses outside Frontier (failure scenario)', () => {
    const frontierOnly = () => state.actors.player.worldId === 'base.frontier';
    configureTempoFight(ports(neutralWritable({writable: frontierOnly})));
    assert.equal(opener().eligible, false);
});
test('neutralWritable prefers the trade port and falls back to the given port', () => {
    assert.equal(neutralWritable({tradeWritable: () => true, writable: () => false})(), true);
    assert.equal(neutralWritable({writable: () => false})(), false);
});

// Slot placement: duck-typed nodes, no DOM needed.
const fake = (connected = true) => { const n = {isConnected: connected, parentElement: null, id: PANEL_ID, open: false, append(c) { c.parentElement = n; }}; return n; };
test('the panel moves into a connected encounter slot, drops its id, and stays put on re-check', () => {
    const root = fake(), slot = fake(), fallback = fake();
    assert.equal(placePanel(root, null, fallback), 'fallback');
    assert.equal(root.parentElement, fallback); assert.equal(root.id, PANEL_ID);
    assert.equal(placePanel(root, slot, fallback), 'slot');
    assert.equal(root.parentElement, slot); assert.equal(root.id, ''); assert.equal(root.open, true);
    root.open = false;
    assert.equal(placePanel(root, slot, fallback), 'slot'); assert.equal(root.open, false, 're-check does not reopen');
});
test('a missing or disconnected slot returns the panel to its old host with its id', () => {
    const root = fake(), slot = fake(), fallback = fake();
    placePanel(root, slot, fallback);
    slot.isConnected = false;
    assert.equal(placePanel(root, slot, fallback), 'fallback');
    assert.equal(root.parentElement, fallback); assert.equal(root.id, PANEL_ID);
    assert.equal(placePanel(fake(), null, null), 'none');
});
test('the slot selector is neutral, not a data-lotm attribute', () => { assert.equal(ENCOUNTER_SLOT, '[data-shared-slot="encounter"]'); });
