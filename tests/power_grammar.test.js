import test from 'node:test';
import assert from 'node:assert/strict';
import {composePower, pricePower, fitPowerPrices, powerFeatures} from '../src/power_grammar.js';
import {hpPowerPrices, lotmPowerPrices, HP_LEVITATION_PARTS, POWER_CALIBRATION_ANCHORS} from '../src/power_grammar_worlds.js';
import {hpLeadPowerLaw, hpLeadSpellCommands, hpLeadSpellFacts, hpLeadChanceFact, HP_LEAD_FEATHER_KEY, hpLeadSpellIssueEffects} from '../src/hp_lead_spells.js';
import {lotmBePowerLaw, lotmBeSpellCommands} from '../src/lotm_be_spells.js';
import {HP_LEVITATION} from '../src/world_packs/book_hp_lead_life_data.js';
import {BE_SEER_ENERGY, BE_SEER_ENERGY_ID, BE_SEER_SOURCE} from '../src/book_world_lotm_be_seer.js';
import {createExpansionState, createContentRegistry} from '../src/expansion_engine.js';
import {enrollSimulation, commitSimulationCommand} from '../src/simulation.js';

const parts = {...HP_LEVITATION_PARTS};
test('parts change price without an ability price; unknown laws remain unknown', () => {
    assert.equal(pricePower(parts, hpLeadPowerLaw).values.cost, 1);
    assert.equal(pricePower({...parts, magnitude: 3, range: 2, duration: 5, targets: 2}, hpLeadPowerLaw).values.cost, 4.05);
    assert.equal(pricePower({functions: ['open_vision'], magnitude: 1, range: 0, duration: 60, targets: 1, tier: 9}, lotmBePowerLaw).values.failure, null);
    assert.throws(() => powerFeatures({...parts, targets: 1.5}), /targets/);
    assert.throws(() => powerFeatures({...parts, duration: Infinity}), /duration/);
    assert.throws(() => pricePower({...parts, functions: ['unknown']}, hpLeadPowerLaw), /implementation/);
    assert.throws(() => composePower({parts, cost: []}, hpLeadPowerLaw), /derives/);
});

test('calibration fits prices, exposes conflicting anchors and labels empty tiers assumed', () => {
    const observations = [
        {id: 'a', parts, observed: {cost: 2}, basis: 'canon'},
        {id: 'b', parts: {...parts, magnitude: 2}, observed: {cost: 4}, basis: 'canon'}];
    const fitted = fitPowerPrices(hpPowerPrices, observations, {tiers: [1, 7]});
    assert.ok(Math.abs(fitted.prices.cost.magnitude - 2) < 1e-6);
    assert.equal(fitted.fits.cost.underdetermined, true, 'unobserved dimensions keep prior prices');
    assert.equal(fitted.fits.cost.rank, 1);
    assert.equal(fitted.byTier[0].status, 'canon-anchored');
    assert.equal(fitted.byTier[1].status, 'assumed');
    assert.equal(fitted.byTier[1].maxError, null);
    const conflict = fitPowerPrices(hpPowerPrices, [...observations, {id: 'conflict', parts, observed: {cost: 8}, basis: 'canon'}]);
    assert.ok(conflict.rows.some(r => r.outlier));
    assert.ok(conflict.byTier[0].maxError > 0);
    assert.equal(fitPowerPrices(lotmPowerPrices, POWER_CALIBRATION_ANCHORS.lotm).fits.failure.status, 'unmodelled');
    assert.equal(fitPowerPrices(hpPowerPrices, POWER_CALIBRATION_ANCHORS.hp).byTier[0].status, 'dial-anchored');
});

function fixture(command, simulation) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}, {id: command.worldId, label: 'School'}], simulation});
    const state = createExpansionState(7); state.actors.player.worldId = command.worldId; state.worlds[command.worldId] = {facts: {}, resources: {}, completed: {}};
    const context = {actorId: 'player', worldId: command.worldId, facts: {location: command.location}, vitals: {player: {health: 100, stamina: 100, max_health: 100, max_stamina: 100}}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}, external: {}};
    const plan = enrollSimulation(state, registry, context);
    return {registry, plan, context: {...context, gameplay: plan.gameplay, vitals: plan.vitals ?? context.vitals}};
}

test('the new charm transfers the supplied feather on success; failure keeps it and both tries teach', () => {
    const cmd = hpLeadSpellCommands[1];
    for(const chance of [0, 1]) {
        const {registry, plan, context} = fixture(cmd, {commands: [cmd], powers: [{id: HP_LEVITATION, revision: 1, label: 'Levitation', model: 'practice', capacity: 1, cooldown: 0}],
            people: [{id: 'book.hp.lead.ron', revision: 1, label: 'Ron', worldId: cmd.worldId, location: cmd.location, inventory: 'simulation'}],
            onEnroll: [{type: 'power', powerId: HP_LEVITATION, operation: 'learn'}, ...hpLeadSpellIssueEffects]});
        plan.state.simulation.people.player.location = cmd.location;
        plan.state.actors.player.facts['hp.lead.atSchool'] = true;
        context.facts[hpLeadChanceFact(cmd.id)] = chance;
        const done = commitSimulationCommand(plan.state, registry, {id: cmd.id}, context);
        assert.equal(done.state.simulation.powers.player[HP_LEVITATION].mastery, 1);
        assert.equal(done.vitals.player.stamina, 98);
        assert.equal(done.gameplay.player.inventory[HP_LEAD_FEATHER_KEY] ?? 0, chance);
        assert.equal(done.state.simulation.owners['book.hp.lead.ron'][HP_LEAD_FEATHER_KEY] ?? 0, 1 - chance);
    }
    assert.ok(Object.hasOwn(hpLeadSpellFacts({}), hpLeadChanceFact(cmd.id)), 'existing host fact collection includes new cast');
});

test('Cogitation is a timed command into the existing energy recovery owner', () => {
    const cmd = lotmBeSpellCommands[1];
    assert.equal(cmd.duration, 10);
    assert.deepEqual(cmd.costs, [], 'recovery does not charge a use');
    const energy = cmd.effects.find(e => e.type === 'energy');
    assert.deepEqual(energy, {type: 'energy', energyId: BE_SEER_ENERGY_ID, operation: 'recover', amount: 1, cooling: BE_SEER_ENERGY.strainLimit});
    assert.equal(cmd.effects.at(-1).sourceId, BE_SEER_SOURCE);
    assert.equal(cmd.effects.at(-1).operation, 'develop');
    assert.ok(cmd.requires.all.some(r => r.fact === 'lotm.beSeer.supported'));
});
