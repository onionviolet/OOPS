import {check as assert, natural, object, sameJson as same} from '../../basics.js';
import {PROFILE_ID, ENEMY_ID, AREA_ID, WORLD_ID, readProfileState,
    enemySpecification, beginAttempt, planSettlement, createTrainingEnemy,
    createTrainingZone} from '../encounter_profiles/profile.js';
import {PROTO23_LOCATIONS, PROTO23_OPTIONAL_NATIVE_LOCATIONS} from '../../proto23_world_ids.js';
import {validateNativeEncounter} from '../../seeded_streams.js';

const exact = (v, fields) => object(v) && Object.keys(v).length === fields.length && fields.every(k => Object.hasOwn(v, k));
export const trainingEncounterKey = attempt => `${PROFILE_ID}:${attempt}`;
export const trainingEnemyKey = attempt => `${trainingEncounterKey(attempt)}:enemy:0`;

// Optional locations extend admission, never the original schema-1 footprint or
// its finite stock/person/quest owners. Older saves need no new location record.
export function registerTrainingProfile({locations, enemyTemplates, Enemy, CombatZone}) {
    assert(PROTO23_OPTIONAL_NATIVE_LOCATIONS.includes(AREA_ID), 'Missing optional native training place binding.');
    assert(!locations[AREA_ID] && !enemyTemplates[ENEMY_ID], 'Training IDs already have an owner.');
    const parent = locations[PROTO23_LOCATIONS.dojo];
    const placeholder = beginAttempt(undefined, {seed: 0, worldId: WORLD_ID, locationId: AREA_ID, nativeEligible: true});
    enemyTemplates[ENEMY_ID] = new Enemy(enemySpecification(placeholder));
    const zone = createTrainingZone({CombatZone, parentLocation: parent});
    zone.getAvailabilityComponent().is_unlocked = false;
    zone.tags.proto23_world = true;
    zone.tags.training = true;
    // Root factory admission supplies all real encounters. Do not invoke the
    // random zone factory, including through native test/duel helpers.
    zone.get_next_enemies = () => {throw Error('Select the actual dojo training rung before creating its encounter.');};
    locations[AREA_ID] = zone;
    parent.connected_locations.push({location: zone, travel_time: 1, custom_text: 'Optional reed-circle rung: use its training controls'});
    return zone;
}

export function trainingEnemy(raw, Enemy, saved) {
    const profile = readProfileState(raw), p = profile.pending;
    assert(p && !p.settled, 'A live saved training attempt is required.');
    const enemy = createTrainingEnemy(profile, Enemy);
    enemy.templateKey = ENEMY_ID;
    enemy.rngKey = trainingEnemyKey(p.attempt);
    enemy.encounterKey = trainingEncounterKey(p.attempt);
    enemy.tags.training = true;
    enemy.is_alive = true;
    enemy.init();
    // Never restore level/rank/XP from the single bestiary placeholder.
    if (saved) {Object.assign(enemy.getFullStats(), saved.full); enemy.is_alive = saved.alive;}
    return enemy;
}

export function initialTrainingEncounter(raw, Enemy) {
    const enemy = trainingEnemy(raw, Enemy);
    return {schema: 1, locationId: AREA_ID, key: enemy.encounterKey,
        turns: {attackers: [0], defenders: [0]}, loops: {},
        enemies: [{template: ENEMY_ID, key: enemy.rngKey, stats: {...enemy.stats}, full: {...enemy.getFullStats()}, alive: true}]};
}

export function validateTrainingEnvelope(save) {
    const hasProfile = Object.hasOwn(save, 'p23EncounterProfile');
    const encounter = save.native_encounter, at = save['current location'];
    if (!hasProfile) {
        assert(!Object.hasOwn(save, 'p23EncounterReceipt') && at !== AREA_ID &&
            !encounter?.enemies?.some(e => e.template === ENEMY_ID), 'Training needs its deliberately selected optional profile.');
        assert(!save.availabilities?.location?.[AREA_ID], 'An absent training profile cannot unlock its native rung.');
        return true;
    }
    const profile = readProfileState(save.p23EncounterProfile), p = profile.pending;
    const state = save.expansion, d = state?.proto23Village;
    assert(d && state.actors?.player && state.simulation?.people?.player, 'Training requires the retained independent visitor branch.');
    assert(object(save.locations?.[AREA_ID]) && save.availabilities?.location?.[AREA_ID] === 1,
        'Selected training needs its actual unlocked native zone owner.');
    assert((save.locations[AREA_ID].enemy_groups_killed || 0) === profile.completed,
        'Training completions and the native cleared-group owner disagree.');
    if (p) {
        assert(!p.settled && at === AREA_ID && state.actors.player.worldId === WORLD_ID &&
            state.simulation.people.player.location === AREA_ID && d.activeVisitId !== null,
            'A pending training attempt must occupy its actual retained place.');
        validateNativeEncounter(encounter, AREA_ID);
        assert(encounter && encounter.key === trainingEncounterKey(p.attempt) && encounter.enemies.length === 1,
            'Pending training needs its exact saved native encounter.');
        const row = encounter.enemies[0], specification = enemySpecification(profile);
        const stats = {...specification.stats, max_health: specification.stats.health};
        assert(row.template === ENEMY_ID && row.key === trainingEnemyKey(p.attempt) && row.alive === true &&
            row.full.health > 0 && row.full.max_health === stats.health && same(row.stats, stats),
            'Training template, native health or authored level stats disagree.');
        assert(p.exchange <= encounter.turns.defenders[0], 'Training exchange exceeds its native defender cursor.');
        assert(save.expansion?.streams, 'Pending training requires saved native streams.');
    } else {
        assert(at !== AREA_ID && !encounter?.enemies?.some(e => e.template === ENEMY_ID),
            'Retired training cannot retain an unbound native encounter.');
    }
    const receipt = save.p23EncounterReceipt;
    if (receipt !== undefined) {
        assert(exact(receipt, ['schema','eventId','attempt','seed','level','clock','completed','dropChanceModifier','loot',...(receipt.tower===undefined?[]:['tower'])]) &&
            receipt.schema === 1 && natural(receipt.attempt) && receipt.attempt > 0 && receipt.attempt < profile.nextAttempt &&
            natural(receipt.clock) && receipt.clock <= state.clock && receipt.completed === profile.completed && profile.completed > 0 &&
            Number.isFinite(receipt.dropChanceModifier) && receipt.dropChanceModifier >= 0 && Array.isArray(receipt.loot), 'Invalid native training receipt.');
        const before = beginAttempt({schema: 1, nextAttempt: receipt.attempt, completed: receipt.completed - 1, pending: null},
            {seed: receipt.seed,...(receipt.tower?{tower:receipt.tower}:{}), worldId: WORLD_ID, locationId: AREA_ID, nativeEligible: true});
        const plan = planSettlement(before, {eventId: receipt.eventId, rank: receipt.level, defeated: true,
            dropChanceModifier: receipt.dropChanceModifier, worldId: WORLD_ID, locationId: AREA_ID, nativeEligible: true});
        assert(same(plan.loot, receipt.loot), 'Training receipt differs from its saved deterministic settlement.');
    } else assert(profile.completed === 0, 'Completed training requires its native settlement receipt.');
    return true;
}
