// G18 follow-up (2026-11-14): late LOTM saves took ~37 s to show PLAY because display polls
// were too costly and stale interval ticks from the boot fired back to back afterwards.
import test from 'node:test';
import assert from 'node:assert/strict';
import {coalescedInterval} from '../src/timer_coalesce.js';
import {managementWorldHere} from '../src/management/host.js';
import {I} from '../src/management/shared.js';

test('interval ticks that queued while the page was busy run once', () => {
    let fire, now = 0, runs = 0;
    const set = coalescedInterval((tick) => {fire = tick; return 7;}, () => now);
    assert.equal(set(() => runs++, 250), 7, 'returns the underlying id, so clearInterval still works');
    fire(); assert.equal(runs, 1);
    now = 20000; for(let i = 0; i < 80; i++) fire(); // 80 ticks queued during a 20 s boot arrive together
    assert.equal(runs, 2, 'a backlog collapses to one run');
    now += 250; fire(); now += 250; fire();
    assert.equal(runs, 4, 'on-time ticks all run');
    const one = coalescedInterval((cb, t) => cb, () => 0)(() => 'x', 0);
    assert.equal(one(), 'x', 'a zero period is passed through untouched');
});

test('the courtyard panel answers "found?" without its world context outside its world', async () => {
    const {createDom} = await import('../scripts/headless/dom.mjs');
    const dom = createDom(); dom.loadHTML('<html><body><div id="main_content"></div></body></html>');
    for(const k of ['document','window','Node','HTMLElement','MutationObserver','Event','CustomEvent'])if(dom.window?.[k]&&!globalThis[k])try{globalThis[k]=dom.window[k];}catch{}
    globalThis.document = dom.document; globalThis.MutationObserver ??= class {observe(){} disconnect(){}}; globalThis.IntersectionObserver ??= class {observe(){} disconnect(){}};
    const {createManagementPanel} = await import('../src/management/ui.js');
    const {knownWorkspaceModules} = await import('../src/workspace_layout.js');
    const {createExpansionState} = await import('../src/expansion_engine.js');
    const {initializeExpedition, expeditionRegistry} = await import('../src/expedition_content.js');
    const state = initializeExpedition(createExpansionState(17));
    state.actors.player.worldId = 'book.lotm';
    assert.equal(managementWorldHere(state), false);
    let reads = 0;
    createManagementPanel({registry: expeditionRegistry, command() {}, peek: () => ({state, inDialogue: false, inCombat: false}),
        read: () => {reads++; return {state, context: {facts: {location: 'Village'}}};}});
    const before = reads; knownWorkspaceModules(); knownWorkspaceModules();
    assert.equal(reads, before, 'the layout poll never builds the courtyard context away from its world');
    assert.ok(!knownWorkspaceModules().some(m => m.id === 'management'), 'and the panel is not found there');
    state.actors.player.worldId = I.world;
    assert.ok(knownWorkspaceModules().some(m => m.id === 'management'), 'in its world, at the Village, it is found from the full read');
    assert.ok(reads > before);
});
