// Definition/import/link checks only. No game state, job execution, private
// saves, browser, save/import/failure suite or generated bundle is exercised.
import {createSimulationRegistry} from '../../../../../src/simulation_contracts.js';
import {simulationDefinitions} from '../../../../../src/simulation_content.js';
import {REMAINDER_HOME_IDS as I, REMAINDER_HOME_KEYS as K, remainderHomeDefinitions as D, remainderHomeItemSpecifications, remainderHomeSources} from '../../../../../src/audit_remainder_home_content.js';
import {remainderHomeFacts, validateRemainderHome, exactRemainderHomeJob} from '../../../../../src/audit_remainder_home_facts.js';
import {commitRemainderHomeCommand, remainderHomePresentation, remainderHomeSimulationContexts} from '../../../../../src/audit_remainder_home_host.js';
const assert = (value, message) => {if(!value) throw Error(message);};
const families = [...new Set([...Object.keys(simulationDefinitions), ...Object.keys(D)])];
const merged = Object.fromEntries(families.map(k => [k, [...(simulationDefinitions[k] || []).filter(d => !(D[k] || []).some(x => x.id === d.id)), ...(D[k] || [])]]));
const registry = createSimulationRegistry(merged);
const command = name => D.commands.find(d => d.id === `remainder_home.${name}`);
const amount = (d, field, key, actor = 'player') => d[field].filter(e => e.type === 'item' && e.actor === actor && e.key === key).reduce((sum, e) => sum + e.amount, 0);
for(const d of D.commands) assert(d.group === I.group && d.id.startsWith('remainder_home.') && d.revision === 1, 'A home command escaped the reserved namespace/group/revision.');
for(const name of ['uncovered', 'covered']) {
    const d = command(`trim_${name}`);
    assert(amount(d, 'costs', K.log) === -1 && amount(d, 'effects', K.wet) === 1 && amount(d, 'effects', K.green) === 2 && amount(d, 'costs', K.sharp) === -1 && amount(d, 'effects', K.dull) === 1, 'The disclosed timber and knife transformation changed.');
    assert(d.effects.find(e => e.type === 'item' && e.key === K.dull).reservationReturn === true, 'Knife condition conversion lost its reservation-return marker.');
}
assert(JSON.stringify(command('trim_uncovered').requires).includes('remainderHome.dryWeather') && !JSON.stringify(command('trim_covered').requires).includes('remainderHome.dryWeather'), 'The cover must reach this exact wet-work predicate only.');
assert(amount(command('dry_offcuts'), 'costs', K.green) === -2 && amount(command('dry_offcuts'), 'effects', K.offcut) === 2, 'Offcut drying lost its counted input/output.');
assert(!command('research').effects.some(e => e.type === 'item') && amount(command('build_jig'), 'effects', K.jig) === 1, 'Study must remain separate from actual jig construction.');
for(const name of ['ordinary', 'delicate']) {
    const d = command(`salvage_${name}`);
    assert(amount(d, 'costs', K.offcut) === -2 && amount(d, 'costs', K.jig) === -1 && amount(d, 'effects', K.jig) === 1 && amount(d, 'effects', K.sound) === 1 && d.effects.find(e => e.key === K.jig).reservationReturn === true, 'Salvage must conserve its held physical jig and consume two exact dry offcuts.');
}
assert(D.advancements.length === 2 && D.advancements.every(d => d.track === I.track && d.exclusiveGroup === I.exclusive) && new Set(D.advancements.map(d => d.branch)).size === 2, 'One real mutually exclusive progression choice is required.');
for(const d of D.commands.filter(d => d.advancementId)) {
    const a = D.advancements.find(a => a.id === d.advancementId);
    assert(a && JSON.stringify(d.costs) === JSON.stringify(a.costs), 'Player controls must quote the actual advancement costs.');
}
assert(command('survey_loaded').duration === command('survey_ordinary').duration && command('survey_loaded').costs.find(e => e.type === 'vital').amount === -2 && command('survey_ordinary').costs.find(e => e.type === 'vital').amount === -3, 'Loaded control must change this specific stamina spend.');
assert(command('room.frame').siteId === 'field.assembly' && command('room.finish').siteId === 'field.assembly' && command('room.finish').effects.some(e => e.type === 'claim' && e.operation === 'acquire' && e.key === I.residence), 'The completed real-site room must grant exactly its residence claim.');
assert(!command('room.finish').effects.some(e => e.type === 'spawn') && !command('meet_resident').effects.some(e => e.type === 'item' || e.type === 'resource'), 'Room/meeting must not mint a helper service or stock.');
assert(D.people[0].resources.coins === 0 && remainderHomeSources.length === 1 && D.people[0].id === I.resident && D.controllers[0].actorId === I.resident, 'Resident body, learned operation, funding and controller must be independent.');
const service = command('resident_bind');
assert(service.actorId === I.resident && service.once && amount(service, 'costs', K.log, I.resident) === -1 && amount(service, 'costs', K.kit, I.resident) === -1 && amount(service, 'effects', K.kit, I.resident) === 2, 'The one resident service needs its real own log/tool and exactly one new output plus one tool return.');
assert(new Set(remainderHomeItemSpecifications.map(d => d.id)).size === 3, 'Exactly three original native item descriptors are selected.');
for(const fn of [remainderHomeFacts, validateRemainderHome, exactRemainderHomeJob, commitRemainderHomeCommand, remainderHomePresentation, remainderHomeSimulationContexts]) assert(typeof fn === 'function', 'An integration export did not link.');
console.log(JSON.stringify({status: 'pass', checks: 'syntax separately; imports, immutable definition registry, static conservation and all root-facing links', commands: D.commands.length, advancements: D.advancements.length, people: D.people.length, controllers: D.controllers.length, nativeItems: remainderHomeItemSpecifications.map(d => d.id), mergedRegistryCommands: registry.commands.size, gameplay: 'implemented-unverified; all behavioral suites deferred'}, null, 2));
