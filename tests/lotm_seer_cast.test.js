import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const castAvailable = existsSync(new URL('private_packs/lotm-cast/cast.json', root)) &&
    existsSync(new URL('private_packs/manifest.json', root));

test('the installed Seer cast consumes the shared allocation and grants source and spirituality after restore',
    {skip: castAvailable ? false : 'Requires the local LOTM cast pack'}, async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async path => {
            try {
                const value = JSON.parse(readFileSync(new URL(String(path), root), 'utf8'));
                return {ok: true, json: async () => value};
            } catch {
                return {ok: false};
            }
        };
        let castObjectCommands;
        try {
            const {whenCastLoaded} = await import('../src/book_world_lotm_cast_days.js');
            const castHost = await import('../src/book_world_lotm_cast_host.js');
            await whenCastLoaded();
            ({castObjectCommands} = castHost);
        } finally {
            globalThis.fetch = originalFetch;
        }

        const {bare, hostOver, registry, ctx, wait} = await import('./lotm_helpers.js');
        const {applySimulationEffects} = await import('../src/simulation_effects.js');
        const {previewSimulationCommand, commitSimulationCommand} = await import('../src/simulation.js');
        const {validateLotmState} = await import('../src/book_world_lotm_state.js');
        const {validateSimulationState} = await import('../src/simulation_contracts.js');
        const {SEER_BREW_BINDING, SEER_BREW_FACTS} = await import('../src/lotm_seer_brew.js');
        const {BE_SEER_SOURCE, BE_SEER_ENERGY_ID} = await import('../src/book_world_lotm_be_seer.js');
        const {LOTM_INBOX} = await import('../src/book_world_lotm_harm.js');

        function reload(plan) {
            const restored = JSON.parse(JSON.stringify(plan));
            validateLotmState(restored.state);
            validateSimulationState(restored.state.simulation, restored.state, registry.simulation);
            return restored;
        }

        for (const overmeasure of [false, true]) {
            const {host, box} = hostOver(bare());
            host.enroll('be', {independent: true});
            let plan = box.p;
            const cupId = SEER_BREW_BINDING.brewAct + (overmeasure ? '.overmeasure' : '');
            const [measure, brew, drink] = [`${cupId}.procedure.1`, cupId, SEER_BREW_BINDING.consumer]
                .map(id => castObjectCommands.find(def => def.id === id));
            assert.ok(measure && brew && drink);
            const maker = brew.targetId;
            const room = brew.location;
            plan.state.simulation.people.player.location = room;
            plan.state.simulation.people[maker].location = room;
            // Seed the earlier observations. The three commands under test run
            // with their real gates, costs and effects.
            applySimulationEffects(plan, ['book.lotm.kj3o.five.seen', 'book.lotm.kj3p.prep.seen'].map(key =>
                ({type: 'knowledge', actor: 'player', key, value: 'Fixture prerequisite.', stage: 'seen'})),
            {actorId: 'player'}, registry, 'test.seer.prerequisite');
            const preview = def => previewSimulationCommand(plan.state, registry, def.id, ctx(plan, def.targetId));
            assert.equal(preview(drink).eligible, false);

            for (const def of [measure, brew, drink]) {
                // Supply the scene position at each start independently of the
                // broader cast schedule.
                plan.state.simulation.people[maker].location = room;
                const quote = preview(def);
                assert.equal(quote.eligible, true, JSON.stringify(quote.reasons));
                const pending = {...plan, ...commitSimulationCommand(plan.state, registry, {id: def.id},
                    ctx(plan, def.targetId), plan.state.sequence)};
                const direct = wait(structuredClone(pending), def.duration);
                plan = reload(wait(reload(pending), def.duration));
                assert.deepEqual(plan, direct);
                if (def === brew) {
                    assert.equal(plan.state.actors.player.facts[SEER_BREW_FACTS.seer], 57);
                    assert.equal(plan.state.actors.player.facts[SEER_BREW_FACTS.madness], Number(overmeasure));
                    assert.equal(plan.state.actors.player.sources[BE_SEER_SOURCE], undefined);
                    assert.equal(plan.state.simulation.energies?.player?.[BE_SEER_ENERGY_ID], undefined);
                }
            }

            assert.equal(plan.state.actors.player.facts[SEER_BREW_FACTS.seer], 0);
            assert.ok(plan.state.actors.player.sources[BE_SEER_SOURCE]);
            assert.ok(plan.state.simulation.energies.player[BE_SEER_ENERGY_ID]);
            assert.equal(plan.state.actors.player.resources[LOTM_INBOX.loss] ?? 0, Number(overmeasure));
            assert.equal(preview(drink).eligible, false);
        }
    });
