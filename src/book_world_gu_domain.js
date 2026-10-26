// Read/validate existing owners. No saved slice, stock writer, tick or timer.
import {registerDomain} from './domain_registry.js';
import {energyCharge} from './energy_resources.js';
import {guAcademyLife as life, guId as id, guKey as key, GU_DAY, GU_FRESHNESS, GU_INITIAL_PETALS} from './world_packs/book_gu_life.js';
const check = (ok, message) => {if(!ok)throw Error(message);};
const count = (rows, itemId, native = false) => Object.entries(rows || {}).reduce((n, [k, row]) => n + (JSON.parse(k).id === itemId ? native ? row.count : row : 0), 0);

export function validateGuEnvelope(save) {
    const state = save?.expansion, record = save?.content_packs?.structured;
    if(record?.packId !== life.id) {
        check(state?.actors?.player?.worldId !== life.world.id, 'Moonlight Gu life needs its beginning receipt.');
        return;
    }
    const s = state.simulation, gu = s.people[id('moonlight')], title = s.claims[id('gu_title')];
    check(gu?.body?.id === id('gu_body') && gu.body.ownerId === id('moonlight') && ['alive', 'dead'].includes(gu.life), 'The living Gu identity has changed.');
    check(title?.status === 'held' && [id('keeper'), 'player'].includes(title.owner) && gu.body.controllerId === (title.owner === 'player' ? 'player' : id('moonlight')), 'Gu title and refined control disagree.');
    check(Number.isInteger(gu.vitals?.health) && gu.vitals.health >= 0 && gu.vitals.health <= 4 && gu.vitals.max_health === 4 && (gu.life === 'alive' ? gu.vitals.health > 0 : gu.vitals.health === 0), 'Invalid Gu care condition.');
    const expectedCount = Math.floor((state.clock - record.initializedAt) / GU_DAY);
    for(const event of life.simulation.events) {
        const c = s.checks[event.id];
        check(c && c.interval === GU_DAY && c.count === expectedCount && c.due === record.initializedAt + (c.count + 1) * GU_DAY && c.definitionId == null && c.actorId == null && c.targetId == null, 'Gu daily care deadline is missing or changed.');
    }
    const freshness = s.conditions[id('moonlight')]?.[id('fresh_petals')], expires = record.initializedAt + GU_FRESHNESS;
    check(state.clock < expires ? freshness?.expiresAt === expires && freshness.intensity === 1 : !freshness, 'The opening petal lot freshness has changed.');
    let remaining = Object.values(s.owners).reduce((n, rows) => n + count(rows, id('petals')), 0);
    for(const owners of Object.values(save.inventories || {})) for(const rows of Object.values(owners)) remaining += count(rows, id('petals'), true);
    const meals = s.checks[id('care.c_meal')].occurrences || 0;
    check(remaining + 4 * meals === GU_INITIAL_PETALS, 'Opening petal stock and eaten meals disagree.');
}

export function guCareStatus(state, definition, record, context) {
    if(definition.id !== life.id || !state.simulation?.knowledge?.player?.[id('gu_known')])return [];
    const s = state.simulation, gu = s.people[id('moonlight')], check = s.checks[id('care.a_reset')];
    const fresh = s.conditions[id('moonlight')]?.[id('fresh_petals')];
    const expiry = fresh?.expiresAt ?? record.initializedAt + GU_FRESHNESS;
    const energy = s.energies.player?.[id('primeval')], charge = energy && energyCharge(energy.policy, {output: 1});
    const prepared = count(s.owners[id('moonlight')], id('petals'));
    const loose = count(context.gameplay?.player?.inventory, id('petals'));
    return [
        {label: 'Moonlight Gu care', value: gu.life === 'dead' ? `Dead · care has ended. ${prepared} prepared petals and ${loose} loose petals remain unused. This Gu no longer eats or activates.` : `Alive · care condition ${gu.vitals.health}/4 · ${prepared} prepared petals · ${loose} loose petals. Four fresh petals per day; next care deadline in ${Math.max(0, check.due - state.clock)} played minutes.`},
        {label: 'Opening food freshness', value: state.clock >= expiry ? 'The opening petal lot has spoiled. Assigning it again cannot refresh it.' : `This entire opening lot expires in ${expiry - state.clock} played minutes. Prepared and loose petals share that deadline.`},
        {label: 'Primeval activation budget', value: `${energy.reserve}/${energy.policy.capacity} ${energy.policy.label} · ${gu.life === 'dead' ? 'This Gu is dead; the reserve cannot activate it.' : `${charge} per taught Moonblade · reserve supports ${Math.floor(energy.reserve / charge)} activations when the Gu, method and targets are ready. Food is a separate budget.`}`}
    ];
}
registerDomain({id: 'gu_care', validate: (_slice, envelope) => validateGuEnvelope(envelope)});
