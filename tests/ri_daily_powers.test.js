import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import {meets} from '../src/simulation_contracts.js';
import {dailyPowerControl, riDayControls, recentDayNotes} from '../src/ri_daily_powers.js';
import {RI_GRANARY_FOUND as FOUND,RI_GRANARY_PATCHED as PATCHED,RI_GRANARY_PAID as PAID} from '../src/ri_granary_work.js';
import {RI_ACADEMY_ELDER, RI_DAILY_POWERS, RI_DAY_ITEMS, RI_LEAD_DAY, RI_MOONGLOW_SALE_NOTE, riLeadDayFacts} from '../src/ri_lead_day_facts.js';
import {guLeadDay, guLeadDailyPowers, registerGuLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadLife, riLeadId} from '../src/world_packs/book_gu_lead_life.js';
import {guLeadLeafTreatment} from '../src/world_packs/book_gu_lead_leaf_treatment.js';
import {guLeadHealerWork} from '../src/world_packs/book_gu_lead_healer_work.js';
import {guLeadGranaryWork} from '../src/world_packs/book_gu_lead_granary_work.js';

const hash = data => 'sha256:' + createHash('sha256').update(JSON.stringify(data)).digest('hex');
const [unseen, seen] = guLeadDailyPowers.commands;

test('an immediate granary payment supersedes its equal-clock patch receipt, while next-day findings remain newer',()=>{
 const known={[FOUND]:{at:5,value:'found'},[PATCHED]:{at:25,value:'patched'},[PAID]:{at:25,value:'paid; new work tomorrow'}};
 const state={simulation:{knowledge:{player:known}}};
 assert.equal(recentDayNotes(state)[0],known[PAID]);
 known[FOUND]={at:1470,value:'new opening'};assert.equal(recentDayNotes(state)[0],known[FOUND]);
 known[PATCHED]={at:1490,value:'new patch'};assert.equal(recentDayNotes(state)[0],known[PATCHED]);
});

test('the kitchen task installs alongside the exact existing ordinary-day pin', async () => {
    const base = {contentHash: hash(guLeadLife)};
    const installed = [];
    await registerGuLeadDay({bundledInstantExtension: async raw => { installed.push(raw); }}, base);
    assert.deepEqual(installed, [guLeadDay, guLeadDailyPowers, guLeadLeafTreatment, guLeadHealerWork, guLeadGranaryWork]);
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

test('the day comparison keeps a blocked watch beside both kitchen quotes and prioritizes an unreported watch', () => {
    const id = key => `${RI_LEAD_DAY}.${key}`;
    const action = (key, duration = 0, reasons = []) => ({id: id(key), duration, eligible: !reasons.length, reasons});
    const view = {canWrite: true, actions: [action('sell_meat', 15), action('feed_moonglow'),
        action('patrol', 180, ['Report to the board first.']), action('report'), action('hand_in_eye', 10),
        {id: seen.id, label: seen.label, eligible: true, reasons: []}]};
    const rows = riDayControls(view);
    assert.match(rows.hand.hint, /15 min/);
    assert.match(rows.moonglow.hint, /4 essence · 10 min/);
    assert.equal(rows.patrol.reason, 'Report to the board first.');
    assert.equal(rows.feed_jade, null);
    assert.equal(rows['follow-up'].request.id, id('report'));
    const running = riDayControls({...view, jobs: [{commandId: id('patrol'), id: 'watch:1', remaining: 5, cancellable: true}]});
    assert.deepEqual(running.patrol.request, {type: 'cancel', jobId: 'watch:1'});
    assert.equal(running.patrol.hint, '5 min left');
});
