// Native Node DOM acceptance. No browser or supplied late-life save.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {boot, bundleGame, ROOT} from './runner.mjs';
const prefix = 'book.su.lead', id = n => `${prefix}.${n}`;
const out = resolve(process.argv[2] || join(ROOT, 'docs/representations/evidence/paradise-opening-2026-11-26'));
let game, receipt;
try {
    game = await boot(null, {seed: 9, heroName: 'Su entry proof'});
    await game.clickText('Beginning');
    await game.fill('[data-structured-choice="life"]', prefix);
    await game.clickText('Confirm arrival');
    const act = async n => {
        const selector = `[data-structured-action="${id(n)}"]`;
        if (game.hiddenReason(game.$(selector))) await game.clickText('Beginning');
        return game.click(selector);
    };
    const snap = () => game.snapshot().expansion;
    const initialBody = snap().simulation.people.player.body.id;
    assert.equal(snap().actors.player.worldId, id('world'));
    assert.equal(snap().simulation.people.player.body.chestWounded, true);
    for (const action of ['inspect_wounds', 'ask_knife', 'ask_terms', 'sign', 'treatment']) await act(action);
    await game.save();await game.reload();
    assert.equal(snap().simulation.people.player.body.id, initialBody);
    assert.equal(snap().simulation.people.player.body.chestWounded, false);
    for (const action of ['awakening', 'transfer', 'read_arrival', 'open_brand']) await act(action);
    const issued = snap().simulation.situations[id('trial_time')];
    await act('read_personal');await game.step(1);
    await act('read_trial');await game.step(1);
    const state = snap(), before = state.simulation.situations[id('trial_time')];
    assert.equal(before.openedAt, issued.openedAt);
    assert.equal(before.deadline - state.clock, 4318);
    assert.ok(state.simulation.knowledge.player[id('trial')]);
    assert.ok(state.simulation.knowledge.player[id('personal')]);
    assert.equal(state.bookWorldCampaign, undefined);
    const selected = s => ({body: s.simulation.people.player.body, location: s.simulation.people.player.location,
        trial: s.simulation.situations[id('trial_time')], facts: s.actors.player.facts,
        knowledge: s.simulation.knowledge.player, clock: s.clock});
    const persisted = selected(state);
    await game.save();await game.reload();assert.deepEqual(selected(snap()), persisted);
    const exported = await game.exportFile();await game.importFile(exported);
    assert.deepEqual(selected(snap()), persisted);
    const bundle = await bundleGame();
    receipt = {schema: 'paradise-opening-native/1', date: '2026-11-26', runtime: 'Native Node DOM; not desktop browser',
        bundleSha256: createHash('sha256').update(await readFile(bundle)).digest('hex'),
        setup: 'Fresh ordinary Village, Beginning picker, Su Xiao, Confirm arrival. No supplied save or time/skill grant.',
        route: ['inspect wounds', 'ask knife', 'ask Hunter duties', 'sign', 'treatment', 'Save/reload',
            'forced awakening', 'transfer', 'world notice', 'mark menu', 'personal panel one minute', 'trial panel one minute'],
        observed: {sameBody: true, woundsClosedAfterTreatment: true, trialIssuedAt: before.openedAt,
            clock: state.clock, deadline: before.deadline, remainingMinutes: 4318, trialRead: true, personalRead: true,
            separateContractorState: true, noCompletedMissionClaim: true},
        persistence: {saveReloadDuringRecruitment: true, saveReloadAfterPanels: true, literalExportImport: true},
        scope: 'Source-qualified opening, authored optional early signature and one-minute readings. Frontier possessions remain separate. No campaign completion, extraction, source currency conversion or desktop claim.'};
} finally {await game?.close();}
await mkdir(out, {recursive: true});
await writeFile(join(out, 'native-proof.json'), JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify(receipt));
