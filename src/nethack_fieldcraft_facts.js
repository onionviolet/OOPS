// Pure live eligibility and state contract. Deliberately no simulation.js import:
// the shared executor recomputes these facts at admission and job settlement.
import {sameJson as same} from './basics.js';
import {NETHACK_FIELDCRAFT_IDS as I, NETHACK_FIELDCRAFT_KEYS as K, nethackFieldcraftDefinitions} from './nethack_fieldcraft_content.js';
import {originalFrontierFacts} from './original_frontier_facts.js';
import {assert, natural, record} from './simulation_contracts.js';
const count = n => natural(n) ? n : 0;
const prefix = 'nethack_fieldcraft.';
const definitions = new Map(nethackFieldcraftDefinitions.commands.map(d => [d.id, d]));
export function stampNethackFieldcraftJob(state, job) {
    if(definitions.get(job.commandId)?.duration) job.nethackFieldcraftWork = {schema: 1, startedAt: state.clock};
}
function validateFieldcraftJob(state, job) {
    const d = definitions.get(job.commandId);
    const participants = [...new Set(['player', ...(d?.participants || []).map(id => id === '$target' ? d.targetId : id)])];
    assert(d?.duration && job.actorId === 'player' && job.revision === d.revision &&
        job.targetId === (d.targetId || null) && job.siteId === d.siteId && job.claim === (d.claim || null) &&
        job.label === d.label && job.roll === null && job.outcomeId === null &&
        job.cancellation === 'refund' && job.reservationReturns === 1 &&
        same(job.costs, d.costs) && same(job.effects, d.effects) && same(job.participants, participants) &&
        same(job.context, {actorId: 'player', targetId: d.targetId || null, partyIds: state.simulation.party}) &&
        same(job.completionSupport, {schema: 1, requires: d.completionRequires,
            coLocated: !!d.completionCoLocated, location: 'Village', failure: 'refund'}) &&
        state.simulation.sites[d.siteId]?.reservations[job.id] === 'player',
        'The saved fieldcraft work differs from its admitted costs, effects, participants or support.');
    // Older accepted work has no start stamp. Keep its exact terms and bounded
    // remaining time; all newly accepted work retains its exact due time.
    assert(natural(job.due) && job.due >= state.clock && job.due <= state.clock + d.duration,
        'Unsupported fieldcraft work duration.');
    if(job.nethackFieldcraftWork != null) {
        const w = job.nethackFieldcraftWork;
        assert(record(w) && same(Object.keys(w).sort(), ['schema', 'startedAt']) && w.schema === 1 &&
            natural(w.startedAt) && w.startedAt <= state.clock && job.due === w.startedAt + d.duration,
            'Fieldcraft work lost its actual start and due time.');
    }
}
const encumbered = (s, actor, key) => Object.values(s?.custody || {}).some(c => c.holder === actor && c.key === key);
const owned = (state, context, actor, key) => {
    const s = state.simulation, stock = s?.people?.[actor]?.inventory === 'simulation' ? s.owners?.[actor] : context.gameplay?.[actor]?.inventory;
    return count(stock?.[key]) > 0 && !encumbered(s, actor, key) && !Object.values(context.equipment?.[actor] || s?.equipment?.[actor] || {}).includes(key);
};
const occupied = (state, actor) => state.simulation?.jobs?.some(j => (j.participants || [j.actorId]).includes(actor)) ||
    Object.entries(state.simulation?.sessions || {}).some(([id, s]) => (s.participants || [id]).includes(actor)) ||
    state.pending?.some(j => j.context?.actorId === actor) || Object.values(state.actors?.[actor]?.techniques || {}).some(t => t.practice);
export function nethackFieldcraftFacts(state, context = {}, registry) {
    const s = state.simulation, a = state.actors?.player, p = s?.people?.player;
    const location = context.facts?.location || p?.location;
    const enabled = state.referenceGameplay?.schema === 1;
    const opened = enabled && state.referenceGameplay?.fieldcraft?.schema === 1 && a?.facts?.[`${prefix}opened`] === true;
    const stock = context.gameplay?.player?.inventory, v = context.vitals?.player;
    const nativeReady = !!stock && Object.values(stock).every(natural) && !!v &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(v[k]) && v[k] >= 0) && v.health <= v.max_health && v.stamina <= v.max_stamina;
    const frontier = a ? originalFrontierFacts(state, context, registry) : {};
    const supported = enabled && context.nativeAlive === true && (context.actorId || 'player') === 'player' && a?.worldId === I.world && location === 'Village' && p?.life === 'alive' &&
        nativeReady && !state.realmPrototype?.activeVisitId && !s?.sessions?.player && !state.chronicle?.session && state.chronicle?.life?.endedAt == null;
    const eda = s?.people?.[I.eda], ea = state.actors?.[I.eda], dog = s?.people?.[I.dog], da = state.actors?.[I.dog];
    const edaSupported = !!eda && eda.life === 'alive' && ea?.worldId === a?.worldId && eda.location === location && eda.body?.hands >= 2 && eda.vitals?.health > 1 && ea?.facts?.['feature_objects.willing'] === true;
    const dogPresent = opened && !!dog && dog.life === 'alive' && da?.worldId === I.world && da.worldId === a?.worldId && dog.location === 'Village' && dog.location === location && dog.vitals?.health > 0;
    const satiety = count(da?.resources?.satiety), lessons = count(da?.resources?.lessons), stamina = dog?.vitals?.stamina || 0;
    const scent = s?.conditions?.[I.eda]?.[I.scent];
    const facts = {
        'fieldcraft.opened': opened,
        'fieldcraft.canMeet': enabled && state.referenceGameplay?.workshop?.schema === 1 && a?.completed?.['reference_gameplay.open'] === 1 &&
            a?.facts?.['feature_objects.introduced'] === true && !opened,
        'fieldcraft.supported': supported,
        'fieldcraft.handsUsable': nativeReady && frontier['originalFrontier.playerHandsUsable'] === true,
        'fieldcraft.edaSupported': edaSupported,
        'fieldcraft.edaAttentionAvailable': !occupied(state, I.eda),
        'fieldcraft.dogPresent': dogPresent,
        'fieldcraft.dogWilling': opened && da?.facts?.[`${prefix}willing`] === true,
        'fieldcraft.dogSupported': dogPresent && dog.body?.legs >= 4 && dog.body?.jaws >= 1 && da?.facts?.[`${prefix}willing`] === true,
        'fieldcraft.dogAttentionAvailable': !occupied(state, I.dog),
        'fieldcraft.dogSatiety': opened ? satiety : 0,
        'fieldcraft.dogStamina': opened ? stamina : 0,
        'fieldcraft.dogLessons': opened ? lessons : 0,
        'fieldcraft.canFeed': dogPresent && dog.body?.jaws >= 1 && satiety < 4,
        'fieldcraft.feedAmount': Math.max(0, Math.min(2, 4 - satiety)),
        'fieldcraft.identified': opened && s?.knowledge?.player?.[I.oil]?.stage === 'understood',
        'fieldcraft.scented': opened && supported && edaSupported && scent?.intensity === 1 && scent.expiresAt > state.clock,
        'fieldcraft.pinAvailable': opened && owned(state, context, I.eda, K.pin),
        'fieldcraft.pinRemaining': opened ? count(s?.owners?.[I.eda]?.[K.pin]) : 0,
        'fieldcraft.stock.vial': opened && owned(state, context, I.eda, K.vial),
        'fieldcraft.stock.ration': opened && owned(state, context, I.eda, K.ration),
    };
    for(const variant of ['vial', 'ration', 'pin', 'dull', 'fineDull']) facts[`fieldcraft.own.${variant}`] = nativeReady && owned(state, context, 'player', K[variant]);
    return facts;
}
export function validateNethackFieldcraft(state, registry) {
    const value = state.referenceGameplay?.fieldcraft, s = state.simulation, pf = state.actors?.player?.facts || {}, completed = state.actors?.player?.completed || {};
    const namespace = object => Object.keys(object || {}).some(k => k.startsWith(prefix));
    const related = !!state.actors?.[I.dog] || !!s?.people?.[I.dog] || Object.values(state.actors || {}).some(a => namespace(a.facts) || namespace(a.completed)) ||
        Object.values(s?.knowledge || {}).some(namespace) || Object.values(s?.conditions || {}).some(namespace) ||
        (s?.jobs || []).some(j => j.commandId?.startsWith(prefix) || (j.participants || []).includes(I.dog));
    if(value == null) {assert(!related, 'Fieldcraft activation lost its explicit meeting receipt.'); return;}
    for(const job of s?.jobs || []) {
        if(job.commandId?.startsWith(prefix)) validateFieldcraftJob(state, job);
        else assert(job.nethackFieldcraftWork == null, 'A fieldcraft work stamp belongs only to fieldcraft.');
    }
    assert([9, 10, 11].includes(state.schema) && state.referenceGameplay?.schema === 1 && record(value) && value.schema === 1 && Object.keys(value).every(k => ['schema', 'openedAt', 'openedSequence'].includes(k)), 'Unsupported fieldcraft receipt.');
    assert(natural(value.openedAt) && value.openedAt <= state.clock && natural(value.openedSequence) && value.openedSequence > 0 && value.openedSequence <= state.sequence &&
        pf[`${prefix}opened`] === true && completed[I.open] === 1 && state.referenceGameplay.workshop?.schema === 1 && completed['reference_gameplay.open'] === 1,
        'Invalid explicit fieldcraft opening completion.');
    const dog = s?.people?.[I.dog], da = state.actors?.[I.dog];
    assert(dog?.definitionId === I.dog && dog.definitionRevision === 1 && dog.inventory === 'simulation' && dog.createdBy === 'player' && dog.bornAt === value.openedAt &&
        da?.worldId === I.world && dog.location === 'Village' && record(s?.owners?.[I.dog]) && !s.party?.includes(I.dog), 'Fieldcraft needs its actual local workshop dog.');
    assert(s?.people?.[I.eda]?.definitionId === I.eda && s?.sites?.[I.site]?.owner === I.eda, 'Fieldcraft lost the actual fitter or bench.');
    const r = da.resources, v = dog.vitals;
    assert(record(r) && Object.keys(r).every(k => ['satiety', 'lessons'].includes(k)) && natural(r.satiety) && r.satiety <= 4 && natural(r.lessons) && r.lessons <= 2,
        'Invalid finite dog care or learning counters.');
    assert(record(v) && v.max_health === 10 && v.max_stamina === 4 && Number.isFinite(v.health) && v.health >= 0 && v.health <= 10 &&
        Number.isFinite(v.stamina) && v.stamina >= 0 && v.stamina <= 4 && record(dog.body) && natural(dog.body.legs) && dog.body.legs <= 4 && natural(dog.body.jaws) && dog.body.jaws <= 1 && typeof da.facts[`${prefix}willing`] === 'boolean', 'Invalid workshop dog body or vital bounds.');
    assert(r.lessons === count(completed[I.train]), 'Dog lessons need actual completed training.');
    const directed = s.relationships?.[I.dog]?.player;
    assert(count(directed?.axes?.scent_lessons) === r.lessons && (r.lessons === 0 || s.knowledge?.[I.dog]?.[`${prefix}lesson`]?.stage === 'understood'), 'Training lost its dog-directed learning receipt.');
    const manual = count(completed[`${prefix}recover_manual`]), assisted = count(completed[`${prefix}recover_dog`]);
    assert(manual + assisted <= 2 && count(directed?.axes?.pin_retrievals) === assisted, 'Recovery exceeded actual finite fitting pins or lost directed dog memory.');
    for(const [key, limit] of [[K.pin, 2], [K.vial, 3], [K.ration, 4]]) assert(count(s.owners?.[I.eda]?.[key]) <= limit, 'Fieldcraft stock exceeded its once-only provision.');
    const identity = s.knowledge?.player?.[I.oil];
    const applications = count(completed[`${prefix}assay`]) + count(completed[`${prefix}trial_dull`]) + count(completed[`${prefix}trial_fineDull`]);
    assert(count(completed[`${prefix}assay`]) <= 1 && (!!identity === (applications > 0)), 'Substance identity needs an actual firsthand assay or useful application.');
    if(identity) assert(identity.stage === 'understood' && identity.basis?.kind === 'observation' && identity.basis.attributedTo === 'player' && natural(identity.at) && identity.at <= state.clock, 'Invalid bench discovery provenance.');
    const field = s.conditions?.[I.eda]?.[I.scent];
    if(field) {
        const receipt = s.knowledge?.player?.[`${prefix}scent`];
        assert(identity && count(completed[`${prefix}scent`]) > 0 && field.intensity === 1 && natural(field.expiresAt) && field.expiresAt <= state.clock + 12 &&
            receipt?.cause === field.cause && receipt.at + 12 === field.expiresAt && receipt.basis?.kind === 'observation' && receipt.basis.attributedTo === 'player', 'Unsupported reed-oil scent lifetime or provenance.');
    }
    if(registry) assert(registry.simulation?.people?.get(I.dog)?.revision === 1 && registry.simulation.commands?.get(I.open)?.revision === 1 && registry.simulation.conditions?.has(I.scent), 'Fieldcraft content is unavailable.');
}
