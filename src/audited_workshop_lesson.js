// Original reversible ToME P3 proposal. Plain content and pure projections only;
// the existing simulation publisher owns settlement, inventory, jobs and time.
import {FEATURE_OBJECT_IDS as O} from './feature_expansion_objects.js';
import {REFERENCE_GAMEPLAY_IDS as R, REFERENCE_GAMEPLAY_KEYS as K} from './reference_gameplay_content.js';

export const AUDITED_LESSON_IDS = Object.freeze({group: 'audit_lesson', commandType: 'audit_workshop',
    offer: 'audit_lesson.ask', sleeve: 'audit_lesson.choose_sleeve', lesson: 'audit_lesson.choose_lesson',
    defer: 'audit_lesson.defer', resin: 'audit_lesson.set_resin', knowledge: 'audit_lesson.resin_setting'});
const I = AUDITED_LESSON_IDS, prefix = 'audit_lesson.';
const assert = (ok, message) => {if(!ok) throw new Error(message);};
const natural = value => Number.isSafeInteger(value) && value >= 0;
const count = value => natural(value) ? value : 0;
const record = value => value != null && typeof value === 'object' && !Array.isArray(value);
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const af = (key, value = true) => ({type: 'fact', scope: 'actor', actor: 'player', key: `${prefix}${key}`, value});
const item = (key, amount, reservationReturn = false) => ({type: 'item', actor: 'player', key, amount,
    ...(reservationReturn ? {reservationReturn: true} : {})});
const stamina = actor => ({type: 'vital', actor, key: 'stamina', amount: -1});
const money = {type: 'resource', native: true, actor: 'player', key: 'money', amount: -1};
const coins = {type: 'resource', actor: R.teacher, key: 'coins', amount: 1};
const know = (key, value, actor = 'player', stage = 'seen', attributedTo = R.teacher, kind = 'instruction') => ({type: 'knowledge',
    actor, key: `${prefix}${key}`, stage, value, basis: {kind, attributedTo, situationId: O.situation}});
const live = eq('auditLesson.supported', true, 'Return to Village with your living supported body, usable hands and local clock.');
const opened = eq('auditLesson.workshopOpened', true, 'Hear Eda\'s existing measured-cooling offer first; this reward creates no workshop stock.');
const earned = eq('auditLesson.earned', true, 'Actually install the inspected sealing insert and complete at least one funded two-kit order.');
const eda = eq('auditLesson.edaSupported', true, 'Eda must be willing, living, available and here in Village.');
const available = eq('auditLesson.unredeemed', true, 'Ask Eda about the earned choice first. Only one successfully delivered branch can be chosen.');
const method = eq('auditLesson.methodSupported', true, 'Your acquired Measured cooling source, active faculty and understood method must still support this application.');
const teacher = eq('auditLesson.teacherSupported', true, 'Eda needs her own current active cooling source, teaching ability, body and willingness.');
const tool = eq('auditLesson.charged', true, 'Use your actual owned, unequipped and unencumbered charged sleeve, or this job\'s exact reserved sleeve.');
const application = eq('auditLesson.applicationKnown', true, 'Complete the focused controlled resin-setting lesson before using this method.');
const command = d => ({revision: 1, worldId: O.world, actorId: 'player', group: I.group, commandType: I.commandType,
    location: 'Village', costs: [], effects: [], ...d});
const contact = {targetId: R.teacher, participants: ['$target'], coLocated: true};
const branch = choice => [af('choice', choice), af('redeemed')];
const lessonSupport = all(live, opened, earned, available, eda, teacher, method, tool);
const resinSupport = all(live, opened, method, application, tool);

export const auditedLessonDefinitions = {commands: [
    command({id: I.offer, label: 'Ask Eda about your earned workshop choice', once: true, ...contact,
        visibleWhen: all(earned, eq('auditLesson.offered', false)), requires: all(live, opened, earned, eda),
        effects: [af('offered'),
            know('offer', 'Eda acknowledges your completed sealing insert and funded two-kit delivery. Choose one actual remaining charged sleeve, or a focused controlled resin-setting lesson. The lesson still needs your acquired active cooling method, your own charged sleeve, one salt, one coin and both people\'s effort. Asking supplies no stock, power or learning; you may leave the choice open.'),
            know('offer_record', 'I offered one additional workshop choice after the traveler completed the real seal and a funded two-kit order. A sleeve must come from my remaining actual stock. The alternative is paid focused instruction, not a gift of power.', R.teacher)],
        description: 'A free conversation after committed local work. It records the offer without accepting a branch, creating stock or changing the ordinary order payment.'}),
    command({id: I.sleeve, label: 'Choose one actual stocked charged sleeve · forego the focused lesson', once: true, ...contact,
        visibleWhen: available, requires: {...all(live, opened, earned, available, eda,
            eq('auditLesson.sleeveStock', true, 'Eda has no remaining owned, unequipped and unencumbered charged sleeve. This choice cannot create a replacement.')),
            reason: 'Return to willing, available Eda with your unredeemed earned offer. She must still own a remaining unequipped, unencumbered charged sleeve; exhausted stock cannot produce this reward.'},
        costs: [{type: 'transfer', from: R.teacher, to: 'player', key: K.charged, count: 1}],
        effects: [...branch('sleeve'),
            know('sleeve', 'Eda handed you one actual charged sleeve from her own remaining unencumbered stock. You chose the object and gave up this earned focused lesson. No cooling knowledge, mastery, payment or replacement stock was granted.'),
            know('sleeve_record', 'I transferred one actual charged sleeve from my own stock as the traveler\'s single earned choice. The focused lesson alternative is closed; this creates no new supply or obligation.', R.teacher)],
        description: 'One actual native-key item changes owner atomically. The choice becomes redeemed only with the committed transfer. Eda\'s stock must still exist when you choose it.'}),
    command({id: I.lesson, label: 'Choose controlled resin-setting instruction · 1 coin + 1 salt + 3 min', once: true, ...contact,
        duration: 3, cancellation: 'refund', siteId: R.site, completionRequires: lessonSupport,
        completionCoLocated: true, completionFailure: 'refund', visibleWhen: available, requires: lessonSupport,
        costs: [item(K.charged, -1), item(K.salt, -1), money, stamina('player'), stamina(R.teacher)],
        effects: [item(K.charged, 1, true), coins, ...branch('lesson'),
            know('resin_setting', 'Eda supervised a focused controlled resin-setting lesson using your existing Measured cooling method and actual charged sleeve. One salt packet and both people\'s effort were spent; one native coin entered her purse. Your sleeve remains charged and yours. You gave up the earned spare sleeve. This narrow method supports a two-minute resin job with the same sap, charge and empty-sleeve result; it grants no source, mastery or other cooling function.', 'player', 'understood'),
            know('lesson_record', 'I completed the paid controlled resin-setting lesson with my own active cooling ability, attention and effort. I received one actual native coin; the traveler\'s sleeve was returned still charged. The earned spare-sleeve alternative is closed.', R.teacher)],
        description: 'Choosing starts refundable paid practice. Reserve your own charged sleeve, one salt, one native coin and one stamina from each person. Completion rechecks the unredeemed offer, exact held sleeve, methods, bodies, willingness and contact. Only successful settlement consumes salt, pays Eda and teaches this narrow application.'}),
    command({id: I.defer, label: 'Leave the earned choice open', ...contact, visibleWhen: available,
        requires: all(live, opened, available, eda), effects: [
            know('deferred', 'You left Eda\'s earned workshop choice undecided. No object, instruction, payment or debt changed hands. You can ask to choose later if the actual stock or lesson support is available.'),
            know('deferred_record', 'The traveler left the workshop choice open. I delivered no reward, spent no stock and accepted no payment.', R.teacher)],
        description: 'A free refusal for now. Repeating it gives no benefit and reserves no future sleeve or teacher attention.'}),
    command({id: I.resin, label: 'Set one sap with controlled cooling · 1 stamina + 2 min', powerId: R.cooling,
        duration: 2, cancellation: 'refund', siteId: R.site, visibleWhen: application, requires: resinSupport,
        completionRequires: resinSupport, completionFailure: 'refund',
        costs: [item(K.charged, -1), item(K.sap, -1), stamina('player')],
        effects: [item(K.empty, 1, true), item(K.resin, 1),
            know('resin', 'You used the learned controlled resin-setting application to discharge one actual sleeve and set one Tree sap into one Set repair resin in two played minutes. The same conserved sleeve is now empty and remains yours. No extra resin, charge or mastery was awarded.', 'player', 'seen', 'player', 'observation')],
        description: 'A new narrow recipe after the completed lesson. It spends the same sap, sleeve charge and one stamina as the ordinary three-minute method, and returns the same empty sleeve plus one set resin. Eda need not attend your later work. The original recipe and frozen old jobs keep their original timing.'}),
]};

const definitions = new Map(auditedLessonDefinitions.commands.map(d => [d.id, d]));
function sameData(a, b) {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => sameData(v, b[i]));
    if(!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && sameData(a[k], b[k]));
}
function exactJob(state, job) {
    const d = definitions.get(job?.commandId);
    return !!d?.duration && job.revision === 1 && job.actorId === 'player' && job.targetId === (d.targetId || null) &&
        /^simulation:[1-9][0-9]*$/.test(job.id) && natural(job.sequence) && job.sequence <= state.sequence &&
        job.id === `simulation:${job.sequence}` && natural(job.due) && job.due >= d.duration && job.due - d.duration <= state.clock &&
        job.cancellation === 'refund' && job.reservationReturns === 1 && job.siteId === R.site && job.claim === null &&
        state.simulation?.sites?.[R.site]?.reservations?.[job.id] === 'player' &&
        sameData(job.participants, d.targetId ? ['player', R.teacher] : ['player']) &&
        job.context?.actorId === 'player' && job.context.targetId === (d.targetId || null) &&
        sameData(job.costs, d.costs) && sameData(job.effects, d.effects) &&
        sameData(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: 'Village', failure: 'refund'});
}
function availableActor(state, id, ownJob) {
    const s = state.simulation, a = state.actors?.[id];
    return !(state.pending || []).some(j => j.context?.actorId === id) &&
        !Object.values(a?.techniques || {}).some(t => !!t.practice) &&
        !(s?.jobs || []).some(j => j.id !== ownJob?.id && (j.participants || [j.actorId]).includes(id)) &&
        !Object.entries(s?.sessions || {}).some(([actor, session]) => (session.participants || [actor]).includes(id)) &&
        !Object.values(s?.pursuits || {}).some(p => p.actorId === id && ['investigating', 'moving', 'searching', 'waiting', 'sheltered'].includes(p.status));
}
function activeMethod(state, actor) {
    const a = state.actors?.[actor], s = state.simulation, source = a?.sources?.[R.cooling], faculty = s?.faculties?.[actor]?.[R.cooling];
    return !!source && (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.awakened === true &&
        faculty.active === true && faculty.suppressed !== true && s?.powers?.[actor]?.[R.cooling]?.owned === true;
}
function unencumbered(state, context, actor, key) {
    const equipment = state.simulation?.people?.[actor]?.inventory === 'native' ? context.equipment?.[actor] || state.simulation?.equipment?.[actor] : state.simulation?.equipment?.[actor];
    return !Object.values(equipment || {}).includes(key) &&
        !Object.values(state.simulation?.custody || {}).some(c => (c.holder === actor || c.owner === actor) && c.key === key);
}
const paidDeeds = state => count(state.actors?.player?.completed?.['feature_objects.install_seal']) === 1 &&
    count(state.actors?.player?.completed?.['feature_objects.deliver_kits']) >= 1 && state.actors?.player?.facts?.['feature_objects.sealed'] === true;

// Pure current-state projection. No import of simulation.js or host adapters,
// no stock/receipt creation, no clock change and no cached eligibility quote.
export function auditedLessonFacts(state, context = {}, registry) {
    const s = state.simulation, player = state.actors?.player, person = s?.people?.player, f = player?.facts || {};
    const stock = context.gameplay?.player?.inventory, vitals = context.vitals?.player;
    const nativeReady = record(stock) && Object.values(stock).every(natural) && record(vitals) &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(vitals[k]) && vitals[k] >= 0) &&
        vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const location = context.facts?.location || person?.location;
    const enabled = [9, 10, 11].includes(state.schema) && state.referenceGameplay?.schema === 1;
    const offered = enabled && f[`${prefix}offered`] === true && count(player?.completed?.[I.offer]) === 1;
    const redeemed = f[`${prefix}redeemed`] === true || count(player?.completed?.[I.sleeve]) > 0 || count(player?.completed?.[I.lesson]) > 0;
    // The scheduler supplies the popped completion job transiently. A pending
    // job may also explain its own reservation while rendering a work record.
    const candidate = context.auditWorkshopReservation || (s?.jobs || []).find(j => [I.lesson, I.resin].includes(j.commandId) && j.actorId === 'player');
    const ownJob = exactJob(state, candidate) ? candidate : null;
    const supported = enabled && (context.actorId || 'player') === 'player' && person?.life === 'alive' && person.inventory === 'native' &&
        player?.worldId === O.world && location === 'Village' && nativeReady && vitals.health > 1 &&
        context.facts?.['reference.workshop.supported'] === true && context.facts?.['reference.workshop.handsUsable'] === true &&
        !state.realmPrototype?.activeVisitId && !s?.sessions?.player && !state.chronicle?.session && state.chronicle?.life?.endedAt == null;
    const edaPerson = s?.people?.[R.teacher], edaActor = state.actors?.[R.teacher];
    const edaSupported = enabled && edaPerson?.definitionId === R.teacher && edaPerson.life === 'alive' && edaPerson.inventory === 'simulation' &&
        edaActor?.worldId === player?.worldId && edaPerson.location === location && edaPerson.body?.hands >= 2 && edaPerson.vitals?.health > 1 &&
        edaActor.facts?.['feature_objects.willing'] === true && availableActor(state, R.teacher, ownJob);
    const methodSupported = enabled && activeMethod(state, 'player') && s?.knowledge?.player?.['reference_gameplay.method']?.stage === 'understood';
    const charged = nativeReady && unencumbered(state, context, 'player', K.charged) &&
        (count(stock[K.charged]) >= 1 || !!ownJob);
    const applicationKnown = offered && f[`${prefix}choice`] === 'lesson' && f[`${prefix}redeemed`] === true &&
        count(player?.completed?.[I.lesson]) === 1 && s?.knowledge?.player?.[I.knowledge]?.stage === 'understood';
    return {'auditLesson.supported': supported, 'auditLesson.workshopOpened': enabled && state.referenceGameplay?.workshop?.schema === 1 &&
            f['reference_gameplay.opened'] === true && count(player?.completed?.[R.open]) === 1,
        'auditLesson.earned': enabled && paidDeeds(state), 'auditLesson.offered': offered, 'auditLesson.unredeemed': offered && !redeemed,
        'auditLesson.edaSupported': edaSupported, 'auditLesson.teacherSupported': edaSupported && activeMethod(state, R.teacher),
        'auditLesson.methodSupported': methodSupported, 'auditLesson.charged': charged, 'auditLesson.applicationKnown': applicationKnown,
        'auditLesson.sleeveStock': edaPerson?.inventory === 'simulation' && count(s?.owners?.[R.teacher]?.[K.charged]) >= 1 &&
            unencumbered(state, context, R.teacher, K.charged)};
}

function receipt(state, actor, key, stage, attributedTo, kind) {
    const r = state.simulation?.knowledge?.[actor]?.[`${prefix}${key}`];
    assert(record(r) && r.stage === stage && typeof r.value === 'string' && r.value.length > 0 && natural(r.at) && r.at <= state.clock &&
        /^simulation:[1-9][0-9]*$/.test(r.cause) && Number(r.cause.split(':')[1]) <= state.sequence &&
        r.basis?.kind === kind && r.basis.attributedTo === attributedTo && r.basis.situationId === O.situation,
    'Earned workshop knowledge needs its committed action and actual attributed account.');
    return r;
}
function pairedReceipt(state, key, edaKey, stage = 'seen') {
    const p = receipt(state, 'player', key, stage, R.teacher, 'instruction');
    const e = receipt(state, R.teacher, edaKey, 'seen', R.teacher, 'instruction');
    assert(p.cause === e.cause && p.at === e.at, 'The earned workshop accounts lost their shared settlement provenance.');
    return p;
}

// Opt-in expansion9/10 content only. Missing facts/knowledge/jobs are inert;
// existing typed owners and immutable revision1 definitions provide the schema.
export function validateAuditedLesson(state, registry) {
    const s = state.simulation, player = state.actors?.player, f = player?.facts || {}, completed = player?.completed || {};
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(prefix));
    const related = jobs.length || Object.values(state.actors || {}).some(a =>
        Object.keys(a.facts || {}).some(k => k.startsWith(prefix)) || Object.keys(a.completed || {}).some(k => k.startsWith(prefix))) ||
        Object.values(s?.knowledge || {}).some(k => Object.keys(k).some(id => id.startsWith(prefix)));
    if(!related) return;
    assert([9, 10, 11].includes(state.schema) && state.referenceGameplay?.schema === 1 && state.referenceGameplay.workshop?.schema === 1 && s?.schema === 4,
        'Earned workshop choices require explicit existing expansion9/10 workshop enrollment. Preserve the original save.');
    assert(s.people?.[R.teacher]?.definitionId === R.teacher && s.people[R.teacher].inventory === 'simulation' &&
        s.sites?.[R.site]?.owner === R.teacher && s.situations?.[O.situation], 'The earned choice lost its actual fitter, stock owner, bench or local context.');
    for(const [actor, a] of Object.entries(state.actors || {})) for(const key of Object.keys(a.facts || {}).filter(k => k.startsWith(prefix)))
        assert(actor === 'player' && ['offered', 'choice', 'redeemed'].map(k => `${prefix}${k}`).includes(key), 'Unsupported earned workshop actor fact.');
    for(const [actor, a] of Object.entries(state.actors || {})) for(const [id, value] of Object.entries(a.completed || {}).filter(([id]) => id.startsWith(prefix)))
        assert(actor === 'player' && definitions.has(id) && natural(value), 'Unsupported earned workshop completion or owner.');
    const ask = count(completed[I.offer]), sleeve = count(completed[I.sleeve]), lesson = count(completed[I.lesson]), uses = count(completed[I.resin]), deferred = count(completed[I.defer]);
    assert(ask === 1 && sleeve <= 1 && lesson <= 1 && sleeve + lesson <= 1 && f[`${prefix}offered`] === true && paidDeeds(state),
        'An earned offer needs the player\'s actual completed seal and funded delivery, and allows only one successful choice.');
    const seal = s.situations[O.situation].receipts.find(r => r.to === 'sealed');
    const delivery = s.knowledge?.player?.['feature_objects.kitDelivery'];
    const installation = s.knowledge?.player?.['feature_objects.installed'];
    const witness = s.knowledge?.[R.teacher]?.['feature_objects.installation'];
    assert(natural(completed['feature_objects.deliver_kits']) && completed['feature_objects.deliver_kits'] <= 2 &&
        delivery?.basis?.attributedTo === R.teacher && seal && installation?.cause === seal.cause && witness?.cause === seal.cause,
    'Earned deeds lost their actual funded order, installed part or witnessed sealing receipt.');
    const offer = pairedReceipt(state, 'offer', 'offer_record');
    // The ordinary second funded order may overwrite its latest account after
    // this offer. Preserve that valid later work instead of treating it as the
    // prerequisite's first delivery. The offer's frozen start guard owns that.
    assert(offer.at >= seal.at && Number(offer.cause.split(':')[1]) > Number(seal.cause.split(':')[1]) &&
        (completed['feature_objects.deliver_kits'] === 2 || offer.at >= delivery.at && Number(offer.cause.split(':')[1]) > Number(delivery.cause.split(':')[1])),
    'The explicit reward offer must follow both committed local deeds.');
    const redeemed = sleeve + lesson === 1;
    assert((f[`${prefix}redeemed`] === true) === redeemed && (f[`${prefix}redeemed`] == null || f[`${prefix}redeemed`] === true) &&
        (redeemed ? f[`${prefix}choice`] === (sleeve ? 'sleeve' : 'lesson') : f[`${prefix}choice`] == null),
    'Only a committed sleeve transfer or focused lesson may redeem the single choice.');
    const allowedKnowledge = {player: ['offer', 'deferred', 'sleeve', 'resin_setting', 'resin'], [R.teacher]: ['offer_record', 'deferred_record', 'sleeve_record', 'lesson_record']};
    for(const [actor, known] of Object.entries(s.knowledge || {})) for(const key of Object.keys(known).filter(k => k.startsWith(prefix)))
        assert(allowedKnowledge[actor]?.includes(key.slice(prefix.length)), 'Unsupported earned workshop knowledge or owner.');
    const has = (actor, key) => !!s.knowledge?.[actor]?.[`${prefix}${key}`];
    assert(has('player', 'sleeve') === (sleeve === 1) && has(R.teacher, 'sleeve_record') === (sleeve === 1) &&
        has('player', 'resin_setting') === (lesson === 1) && has(R.teacher, 'lesson_record') === (lesson === 1) &&
        has('player', 'resin') === (uses > 0) && has('player', 'deferred') === (deferred > 0) && has(R.teacher, 'deferred_record') === (deferred > 0),
    'Cancelled, refused or incomplete work cannot carry a delivered object, learned application or material-result account.');
    if(sleeve || lesson) {
        const r = sleeve ? pairedReceipt(state, 'sleeve', 'sleeve_record') : pairedReceipt(state, 'resin_setting', 'lesson_record', 'understood');
        assert(r.at >= offer.at && Number(r.cause.split(':')[1]) > Number(offer.cause.split(':')[1]), 'The reward must settle after its explicit earned offer.');
    }
    if(deferred) {const r = pairedReceipt(state, 'deferred', 'deferred_record'); assert(r.at >= offer.at && r.cause !== offer.cause, 'Refusal must follow the explicit offer.');}
    if(uses) {
        assert(lesson === 1 && sleeve === 0, 'Controlled resin setting needs the successfully chosen narrow lesson.');
        const r = receipt(state, 'player', 'resin', 'seen', 'player', 'observation'), learned = s.knowledge.player[I.knowledge];
        assert(r.at >= learned.at && Number(r.cause.split(':')[1]) > Number(learned.cause.split(':')[1]), 'The material result must follow completed focused instruction.');
    }
    for(const j of jobs) {
        assert(exactJob(state, j) && j.due >= state.clock && j.sequence > Number(offer.cause.split(':')[1]), 'Unsupported earned workshop revision, duration, held costs, output or completion guards.');
        assert(j.commandId === I.lesson ? !redeemed : j.commandId === I.resin && lesson === 1,
            'Pending earned work conflicts with the retained single-choice receipt.');
    }
    assert(jobs.length <= 1, 'Earned workshop work cannot reserve overlapping branches.');
    if(registry) for(const d of definitions.values()) assert(sameData(registry.simulation?.commands?.get(d.id), d), 'Earned workshop revision1 definitions changed or are unavailable.');
}
