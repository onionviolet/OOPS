import test from 'node:test';
import assert from 'node:assert/strict';
import {registerReplayAdapter, canonicalJSON} from '../scripts/replay/replay_core.mjs';
import {exploreBranches, formatReport, statVariant} from '../scripts/replay/branch_explorer.mjs';
import {hashStreamSeed} from '../src/seeded_streams.js';

// A toy engine: one open event, three responses, one keyed roll on the save's stream root.
// It exercises the explorer, not the game; the real-engine example run lives in the dev note.
const newSave = () => ({state: {clock: 0, rng: 1, streams: {root: 1}, simulation: {events: {'occurrence:1': {status: 'open'}}},
        campaign: {facts: {}, completed: {}}}, external: {money: 10}, gameplay: {player: {skills: {Charm: {xp: 0}}}}});
registerReplayAdapter({
    id: 'toy.branch',
    newSave,
    load: save => JSON.parse(JSON.stringify(save)),
    save: run => JSON.parse(JSON.stringify(run)),
    clock: run => run.state.clock,
    apply(run, cmd) {
        const next = JSON.parse(JSON.stringify(run));
        if(cmd.k === 'advance') next.state.clock += cmd.minutes;
        else if(cmd.k === 'respond') {
            if(cmd.responseId === 'bad') throw Error('illegal');
            const luck = hashStreamSeed(next.state.streams.root, cmd.responseId) % 2;
            next.state.simulation.events[cmd.eventId].status = 'resolved';
            const gain = cmd.responseId === 'talk' ? 5 + next.gameplay.player.skills.Charm.xp + luck : 1;
            next.external.money += gain;
            if(cmd.responseId === 'talk') next.state.campaign.facts['beat.talked'] = true;
        } else throw Error('unknown');
        return next;
    },
    candidates: () => ['talk', 'pass', 'bad'].map(responseId => ({cmd: {k: 'respond', eventId: 'occurrence:1', responseId}})),
});

test('every choice x seed x stat variant is tabulated, causes named, beats reported', () => {
    const save = newSave();
    const before = canonicalJSON(save);
    const r = exploreBranches({adapter: 'toy.branch', save, seeds: [1, 2, 3, 4, 5, 6],
        variants: [{label: 'base'}, statVariant('gameplay.player.skills.Charm.xp', 3)], follow: [{k: 'advance', minutes: 60}]});
    assert.equal(canonicalJSON(save), before, 'input save is never mutated');
    assert.equal(r.inputUnchanged, true);
    // 3 candidates x 6 seeds x 2 variants; the illegal one is counted, not thrown.
    assert.equal(r.branches, 36);
    assert.equal(r.applied, 24);
    assert.equal(r.rejected, 12);
    assert.equal(r.distribution.money.kind, 'number');
    assert.ok(r.distribution.money.max > r.distribution.money.min);
    // money moves with the choice and with the stat; the seed matters only inside "talk".
    assert.deepEqual(r.drivers.money, {choice: true, seed: true, variant: true});
    assert.deepEqual(r.drivers['skill.Charm.xp'], {choice: false, seed: false, variant: true}, 'the edited stat shows up as variant-driven only');
    assert.deepEqual(r.beats['fact:beat.talked'], {added: 12, removed: 0});
    assert.ok(formatReport(r).includes('beats moved: fact:beat.talked'));
});

test('a seed that changes nothing is reported as such, and the same arguments reproduce the table', () => {
    const save = newSave();
    const args = {adapter: 'toy.branch', save, seeds: [1, 2, 3, 4], branch: {kind: 'choices', filter: c => c.cmd.responseId === 'pass'}};
    const a = exploreBranches(args), b = exploreBranches(args);
    assert.equal(canonicalJSON(a), canonicalJSON(b));
    assert.equal(a.distinctOutcomes, 1, 'pass ignores the roll');
    assert.deepEqual(Object.keys(a.distribution).filter(k => a.drivers[k].seed), []);
});
