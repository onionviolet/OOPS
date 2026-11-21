import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import {meets} from '../src/simulation_contracts.js';
import {dailyPowerControl} from '../src/ri_daily_powers.js';
import {RI_ACADEMY_ELDER, RI_DAILY_POWERS, RI_DAY_ITEMS, RI_MOONGLOW_SALE_NOTE, riLeadDayFacts} from '../src/ri_lead_day_facts.js';
import {guLeadDay, guLeadDailyPowers, registerGuLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadLife, riLeadId} from '../src/world_packs/book_gu_lead_life.js';

const hash = data => 'sha256:' + createHash('sha256').update(JSON.stringify(data)).digest('hex');
const [unseen, seen] = guLeadDailyPowers.commands;

test('the kitchen task installs alongside the exact existing ordinary-day pin', async () => {
    const base = {contentHash: hash(guLeadLife)};
    const installed = [];
    await registerGuLeadDay({bundledInstantExtension: async raw => { installed.push(raw); }}, base);
    assert.deepEqual(installed, [guLeadDay, guLeadDailyPowers]);
    assert.equal(hash(installed[0]), 'sha256:2e57df6181879c0e92a4f76b5dc37267e28f329811dbbca170839db9ca8cadf6');
    assert.deepEqual(installed[1].dependsOn, [guLeadDay.id]);
});

test('a paid short cut uses the ordinary sale’s actual meat and price, with a co-located sight witness', () => {
    const location = riLeadId('academy');
    const worldId = riLeadId('world');
    const state = {clock: 60, actors: {player: {worldId}, [RI_ACADEMY_ELDER]: {worldId}},
        simulation: {people: {player: {location}, [RI_ACADEMY_ELDER]: {location, life: 'alive'}}}};
    const visible = () => {
        const facts = {...riLeadDayFacts(state), [`item.${JSON.stringify({id: RI_DAY_ITEMS.moonglow})}`]: 1};
        return guLeadDailyPowers.commands.filter(command => meets(command.visibleWhen, facts));
    };
    assert.deepEqual(visible(), [seen]);
    state.simulation.people[RI_ACADEMY_ELDER].location = riLeadId('spring');
    assert.deepEqual(visible(), [unseen]);
    state.simulation.people[RI_ACADEMY_ELDER].location = location;
    state.actors[RI_ACADEMY_ELDER].worldId = 'base.frontier';
    assert.deepEqual(visible(), [unseen]);
    const handSale = guLeadDay.commands.find(command => command.id.endsWith('.sell_meat'));
    for (const command of [seen, unseen]) {
        assert.deepEqual(command.costs.filter(effect => effect.type === 'item'), handSale.costs);
        assert.deepEqual(command.effects.filter(effect => effect.type === 'item'), handSale.effects.filter(effect => effect.type === 'item'));
        assert.ok(command.duration < handSale.duration);
        assert.equal(command.costs.find(effect => effect.type === 'energy').energyId, riLeadId('primeval'));
    }
    assert.ok(seen.effects.some(effect => effect.actor === RI_ACADEMY_ELDER && effect.key === RI_MOONGLOW_SALE_NOTE));
    assert.ok(unseen.effects.every(effect => effect.actor !== RI_ACADEMY_ELDER));
});

test('the Hero control follows the native quote, and points at the actual reserved job while working', () => {
    const base = {canWrite: true, actions: [{id: seen.id, label: seen.label, eligible: true, reasons: []}]};
    assert.deepEqual(dailyPowerControl(base)?.request, {type: 'action', id: seen.id});
    assert.equal(dailyPowerControl({...base, canWrite: false})?.enabled, false);
    const running = dailyPowerControl({...base, jobs: [{id: 'simulation:1', commandId: seen.id, remaining: 4, cancellable: true}]});
    assert.deepEqual(running.request, {type: 'cancel', jobId: 'simulation:1'});
    assert.match(running.hint, /4 min/);
});
