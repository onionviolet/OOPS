// PC95, AR3/AR7: chapter 82 on the engine-world clock. The source rows own
// the reading text; the kernel owns steps and costs, and n.knowledge keeps
// each observer's signal and interpretation. No game registration here.
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {KNOWLEDGE_KINDS, recordsOf} from '../knowledge_record.js';
import {substratePort} from '../world_substrate.js';
import {sharedQuantities} from '../world_quantities.js';
import {BE_SEER_ENERGY, beSeerUse} from '../book_world_lotm_be_seer.js';
import {beDivMethodKey} from '../book_world_lotm_divination_method.js';
import {energyCharge} from '../energy_resources.js';
import {LOTM_DIVINATION_ROWS} from '../lotm_divination_rows.js';

const CASE = 'lotm.bogda.operation';
const ACTOR = 'klein', CLUB = 'divination-club', SHOP = 'lawson-herb-store', GLACIS = 'glacis';
const LEAD = 'lotm.glacis.lawson-lead', TESTIMONY = `${CASE}.bogda-report`, SECOND_ACCOUNT = `${CASE}.glacis-report`;
const SHOP_NOTICE = `${CASE}.shop-notice`, REFERRAL = `${CASE}.followup.pursue-glacis-lead`;
const ADDRESS = 'Lawson’s Folk Herb Store, 18 Vlad Street, East Borough';
const LEAD_ACCOUNT = `Glacis credits a folk medicine from ${ADDRESS} with his recovery.`;
const BOGDA_ACCOUNT = 'Bogda says he recovered after paying ten pounds at Lawson’s.';
const GLACIS_ACCOUNT = 'Glacis again speaks well of Lawson’s medicine.';
const CLOSED_NOTICE = 'The door is shut. A notice says the shop is available to sublet.';
export const LOTM_BOGDA_CONTACTS = Object.freeze({patient: 'bogda', event: CASE,
    ring: 'bogda-ring', notes: 'bogda-birth-notes'});
const TENDENCY = 'lotm_operation_tendency';
export const LOTM_SPIRITUALITY = 'energy:spirituality';
export const LOTM_CONSULTATION_PROPERTIES = [
    {id: 'lotm_seer_active', type: 'flag'},
    {id: 'lotm_held_by', type: 'label'},
    {id: TENDENCY, type: 'label'},
    {id: 'lotm_earlier_account', type: 'label'},
    {id: 'lotm_testimony', type: 'label'},
    {id: 'lotm_shop_notice', type: 'label'},
];

const rows = Object.fromEntries(['tarot', 'dream-divination'].map(method => {
    const id = `lotm.div.${method === 'tarot' ? 'tarot-divination' : method}`;
    return [method, LOTM_DIVINATION_ROWS.queries.find(row => row.id === id)];
}));
const kinds = {
    tarot: {seer: 'body', patient: 'lotm.bogda', event: 'lotm.operation', deck: 'lotm.tarot-deck'},
    'dream-divination': {seer: 'body', patient: 'lotm.bogda', event: 'lotm.operation', ring: 'lotm.bogda-ring', notes: 'lotm.bogda-birth-notes'},
};
const steps = name => rows[name].steps;
const price = energyCharge(BE_SEER_ENERGY, beSeerUse());
const failure = reason => ({ok: false, reason});

function readiness(name, {seer, patient, event, deck, ring, notes}) {
    if (!seer.properties.lotm_seer_active || !seer.properties.mind_memory?.includes(beDivMethodKey(name)))
        return failure('This reading needs the learned method and an active Seer power.');
    if (patient.holder !== LOTM_BOGDA_CONTACTS.patient || event.holder !== CASE)
        return failure('The reading needs Bogda’s proposed operation as its focus.');
    if (name === 'tarot' && (patient.place !== seer.place || deck.place !== seer.place || deck.properties.lotm_held_by !== seer.holder))
        return failure('Bogda and the deck must be here for him to cut the cards.');
    if (name === 'dream-divination' && Object.entries({ring, notes}).some(([role, contact]) =>
        contact.holder !== LOTM_BOGDA_CONTACTS[role] || contact.place !== seer.place || contact.properties.lotm_held_by !== seer.holder))
        return failure('You need to hold Bogda’s ring and the paper with his birth details.');
    if ((seer.quantities[LOTM_SPIRITUALITY] ?? 0) < price)
        return failure('Rest to recover enough Spirituality for this reading.');
    return {ok: true};
}

function recordOp({seer, id, kind, from, value, at, by = seer.holder, subject = CASE, property = TENDENCY}) {
    return {op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: seer.place, by,
        detail: {owner: 'N', knowledge: {to: seer.holder, record: {id, subject: {kind: 'fact', id: subject},
            true: {holder: subject, property}, believed: {value}, source: {kind, by, from, at}}}}};
}

export const LOTM_CONSULTATION_LAW = defineWorkingLaw({id: 'lotm.bogda.consultation', revision: 1, operations: {
    ...Object.fromEntries(Object.entries(kinds).flatMap(([name, roles]) => [
        [`${name}.prepare`, {roles, settle({bound}) {
            const ready = readiness(name, bound);
            return ready.ok ? {ok: true, observed: {report: steps(name)[0].report}} : ready;
        }}],
        [`${name}.attempt`, {roles, settle({bound, at, options}) {
            const ready = readiness(name, bound);
            if (!ready.ok) return ready;
            const {seer, event} = bound, row = rows[name], ask = steps(name)[1];
            // This forecast is a scene input. It is independent of custody and
            // says nothing about what happens if the operation is carried out.
            const supported = event.properties[TENDENCY] === 'adverse';
            const signal = supported ? ask.signal : 'The reading gives you no clear indication.';
            const signalId = `${options.id}.signal`;
            return {ok: true, costs: [{quantity: LOTM_SPIRITUALITY, amount: price, payer: seer.holder}],
                facts: {supported}, observed: {status: supported ? ask.status : 'unanswered', signal},
                effects: [recordOp({seer, id: signalId, kind: 'observation', from: row.id, value: signal, at})]};
        }}],
    ])),
    interpret: {roles: {seer: 'body'}, settle({bound: {seer}, facts, at, options}) {
        const belief = facts.supported ? steps(options.name)[2].belief : 'I have too little to advise on the operation.';
        return {ok: true, observed: {belief}, effects: [recordOp({seer, id: `${options.id}.interpretation`,
            kind: 'inference', from: `${options.id}.signal`, value: belief, at})]};
    }},
}});

function consultationMethod(name, id) {
    const roles = kinds[name];
    const all = Object.fromEntries(Object.keys(roles).map(role => [role, role]));
    return {id: rows[name].id, revision: 1, law: LOTM_CONSULTATION_LAW.ref, roles,
        steps: steps(name).map(({kind, minutes}) => ({op: kind === 'interpret' ? kind : `${name}.${kind}`,
            bindings: kind === 'interpret' ? {seer: 'seer'} : all, minutes, options: {name, id}}))};
}

function bindingsFor(name, holders) {
    return Object.fromEntries(Object.entries(kinds[name]).map(([role, kind]) => [role, {kind, id: holders[role]}]));
}

export function quoteLotmConsultation(engine, name, holders) {
    if (!Object.hasOwn(kinds, name)) throw new Error('Unknown chapter 82 reading.');
    const read = substratePort(engine.world), bindings = bindingsFor(name, holders);
    const bound = Object.fromEntries(Object.entries(bindings).map(([role, ref]) => [role, read(ref)]));
    const missing = Object.keys(bound).find(role => !bound[role]);
    const result = missing ? failure((missing === 'ring' || missing === 'notes')
        ? 'You need to hold Bogda’s ring and the paper with his birth details.'
        : `The reading needs its ${missing} present.`) : readiness(name, bound);
    return {...result, question: rows[name].question, method: rows[name].method, locator: rows[name].locator,
        cost: {quantity: LOTM_SPIRITUALITY, amount: price}, minutes: steps(name).reduce((n, step) => n + step.minutes, 0)};
}

export function startLotmConsultation(engine, name, holders, attemptId) {
    const quote = quoteLotmConsultation(engine, name, holders);
    if (!quote.ok) throw new Error(quote.reason);
    if (typeof attemptId !== 'string' || !/^[a-z][a-z0-9_.-]*$/i.test(attemptId)) throw new Error('A reading needs an attempt id.');
    const id = `${CASE}.${attemptId}`;
    return startEngineWorking(engine, {law: LOTM_CONSULTATION_LAW, id, method: consultationMethod(name, id),
        bindings: bindingsFor(name, holders)});
}

// A chapter 82 follow-up, reading Klein's records alone. Each interpretation
// needs its matching observed signal. Repeating a method adds no second ground.
export function lotmBogdaFollowup(world, actor) {
    const known = recordsOf(world, actor);
    const evidence = Object.entries(rows).flatMap(([name, row]) => {
        const reading = Object.values(known).find(record => {
            const signal = known[record.source.from];
            return record.subject.id === CASE && record.source.kind === 'inference' && record.believed.value === steps(name)[2].belief &&
                signal?.subject.id === CASE && signal.source.kind === 'observation' && signal.source.from === row.id &&
                signal.believed.value === steps(name)[1].signal;
        });
        return reading ? [reading.id] : [];
    });
    const choice = evidence.length === 2 ? 'pursue-glacis-lead' : evidence.length === 1 ? 'seek-another-reading' : 'gather-details';
    return {choice, evidence};
}

const followups = {
    'pursue-glacis-lead': 'You decided to pass on Glacis’s lead before Bogda commits to the operation.',
    'seek-another-reading': 'Give a cautious warning and seek a second reading before offering more specific advice.',
    'gather-details': 'Ask for more details before offering advice.',
};

export function settleLotmBogdaFollowup(engine, actor, choice) {
    const seer = substratePort(engine.world)({kind: 'body', id: actor});
    const followup = lotmBogdaFollowup(engine.world, actor);
    if (!seer || choice !== followup.choice) throw new Error('The current readings do not support that follow-up.');
    const id = `${CASE}.followup.${choice}`;
    if (recordsOf(engine.world, actor)[id]) return engine;
    return applyEngineOps(engine, [recordOp({seer, id, kind: 'inference', from: followup.evidence.at(-1) ?? CASE,
        value: followups[choice], at: engine.world.clock})], id);
}

const liveConfig = {
    packs: ['a.mind', 'n.knowledge'],
    shared: {quantities: sharedQuantities([LOTM_SPIRITUALITY]), properties: LOTM_CONSULTATION_PROPERTIES},
    host: {laws: [LOTM_CONSULTATION_LAW]},
};
const liveBindings = {seer: ACTOR, deck: 'club-tarot', ...LOTM_BOGDA_CONTACTS};
const liveRecordId = (name, kind) => `${CASE}.${name}.${kind}`;
const person = (id, extra = {}) => ({id, kind: 'body', place: CLUB, properties: {mind_awake: true, mind_memory: []}, ...extra});
const objectAtClub = (id, kind, by) => ({id, kind: 'thing', place: CLUB, as: [kind], properties: {lotm_held_by: by}});
const heldBy = (engine, key) => engine.world.holders[liveBindings[key]].properties.lotm_held_by;
const custody = (key, value) => ({op: 'property', holder: liveBindings[key], property: 'lotm_held_by', value});
const klein = world => substratePort(world)({kind: 'body', id: ACTOR});
const learn = (engine, rows, cause) => {
    const seer = klein(engine.world);
    return applyEngineOps(engine, rows.map(row => recordOp({seer, at: engine.world.clock, ...row})), cause);
};

function createGlacisRun() {
    const {patient, event, deck, ring, notes} = liveBindings;
    const initial = createEngineWorld({...liveConfig, holders: [
        {id: CLUB, kind: 'place'}, {id: SHOP, kind: 'place', properties: {lotm_shop_notice: CLOSED_NOTICE}},
        person(ACTOR, {properties: {mind_awake: true, mind_memory: Object.keys(kinds).map(beDivMethodKey), lotm_seer_active: true},
            quantities: {[LOTM_SPIRITUALITY]: BE_SEER_ENERGY.capacity}}),
        person(patient, {as: ['lotm.bogda'], properties: {lotm_testimony: BOGDA_ACCOUNT}}),
        person(GLACIS, {properties: {lotm_earlier_account: LEAD_ACCOUNT, lotm_testimony: GLACIS_ACCOUNT}}),
        {id: event, kind: 'thing', place: CLUB, as: ['lotm.operation'], properties: {[TENDENCY]: 'adverse'}},
        objectAtClub(deck, 'lotm.tarot-deck', ACTOR), objectAtClub(ring, 'lotm.bogda-ring', patient),
        objectAtClub(notes, 'lotm.bogda-birth-notes', patient),
    ]});
    // Previously told to Klein (ch62); held in his memory as attributed testimony.
    return learn(initial, [account(initial, LEAD, GLACIS, 'lotm_earlier_account')], 'glacis.earlier-account');
}

function account(engine, id, witness, property = 'lotm_testimony') {
    return {id, kind: 'instruction', from: witness, by: witness, subject: witness, property,
        value: engine.world.holders[witness].properties[property]};
}

function advanceBy(engine, minutes) {
    const out = advanceEngineWorld(engine, engine.world.clock + minutes);
    if (out.pending) throw new Error('The next action has not settled yet.');
    return out.engine;
}

const returnContact = () => [custody('ring', liveBindings.patient), custody('notes', liveBindings.patient)];
const currentFollowup = engine => lotmBogdaFollowup(engine.world, ACTOR);
const runReading = (engine, name) => advanceBy(startLotmConsultation(engine, name, liveBindings, name),
    quoteLotmConsultation(engine, name, liveBindings).minutes);
const readingDetail = (engine, name, intent) => {
    const {cost, minutes} = quoteLotmConsultation(engine, name, liveBindings);
    return `${intent} · ${cost.amount} Spirituality · ${minutes} min`;
};

// Scope: the ch82 referral and ch95 return visit. The chapter cut presents the
// later conversation without simulating the intervening appointments.
const runActions = {
    tarot: {
        label: 'Lay the Tarot cards',
        detail: engine => readingDetail(engine, 'tarot', 'Ask what lies ahead for Bogda’s operation. He cuts the club’s deck.'),
        reason: engine => quoteLotmConsultation(engine, 'tarot', liveBindings).reason,
        act: engine => runReading(engine, 'tarot'),
    },
    borrow: {
        label: 'Borrow Bogda’s ring', detail: 'Ask for his ring and have him write down his birth details. · 2 min',
        act: engine => applyEngineOps(advanceBy(engine, 2), [custody('ring', ACTOR), custody('notes', ACTOR)], 'bogda.lends-ring'),
    },
    dream: {
        label: 'Ask the question in a dream',
        detail: engine => readingDetail(engine, 'dream-divination', 'Hold the ring and birth note while you ask about the same operation.'),
        reason: engine => quoteLotmConsultation(engine, 'dream-divination', liveBindings).reason,
        act: engine => runReading(engine, 'dream-divination'),
    },
    refer: {
        label: 'Return the ring and give Bogda the lead', detail: 'Give him Lawson’s name and the Vlad Street address from Glacis’s account. · 1 min',
        reason: engine => !recordsOf(engine.world, ACTOR)[LEAD] ? 'You need to recall what Glacis told you.'
            : currentFollowup(engine).choice !== 'pursue-glacis-lead' ? 'You need both readings before giving this advice.' : undefined,
        act(engine) {
            const time = advanceBy(engine, 1);
            const decided = settleLotmBogdaFollowup(time, ACTOR, 'pursue-glacis-lead');
            return applyEngineOps(decided, returnContact(), 'bogda.ring-returned');
        },
    },
    testimony: {
        label: 'Ask Bogda and Glacis what happened', detail: 'On a later Monday, hear Bogda’s account at the club and compare it with Glacis’s. · 8 min',
        act: engine => learn(advanceBy(engine, 8), [account(engine, TESTIMONY, liveBindings.patient),
            account(engine, SECOND_ACCOUNT, GLACIS)], 'lawson.client-accounts'),
    },
    visit: {
        label: 'Visit Lawson’s shop', detail: 'Take a carriage to 18 Vlad Street to see the shop yourself. · 14 min',
        act(engine) {
            const arrived = applyEngineOps(advanceBy(engine, 14), [{op: 'move', holder: ACTOR, to: SHOP}], 'klein.visits-lawson');
            return learn(arrived, [{id: SHOP_NOTICE, kind: 'observation', from: SHOP, subject: SHOP, property: 'lotm_shop_notice',
                value: arrived.world.holders[SHOP].properties.lotm_shop_notice}], 'lawson.shop-notice');
        },
    },
};

function viewGlacisRun(engine) {
    const known = recordsOf(engine.world, ACTOR);
    const saw = (name, kind) => known[liveRecordId(name, kind)]?.believed.value;
    const borrowed = heldBy(engine, 'ring') === ACTOR;
    const next = known[SHOP_NOTICE] ? null : known[TESTIMONY] && known[SECOND_ACCOUNT] ? 'visit' : known[REFERRAL] ? 'testimony'
        : saw('dream-divination', 'interpretation') ? 'refer' : borrowed ? 'dream' : saw('tarot', 'interpretation') ? 'borrow' : 'tarot';
    const action = next && runActions[next];
    const reason = action && action.reason?.(engine);
    return {
        facts: [
            ['Place', known[SHOP_NOTICE] ? ADDRESS : 'Tingen Divination Club'],
            ['Spirituality', `${klein(engine.world).quantities[LOTM_SPIRITUALITY]} of ${BE_SEER_ENERGY.capacity}`],
            ['Ring', borrowed ? 'With you' : 'With Bogda'],
        ],
        actions: action ? [{id: next, label: action.label,
            detail: typeof action.detail === 'function' ? action.detail(engine) : action.detail, ...(reason ? {reason} : {})}] : [],
        history: [saw('tarot', 'signal'), saw('tarot', 'interpretation'), saw('dream-divination', 'signal'), saw('dream-divination', 'interpretation'),
            known[REFERRAL] && 'You return the ring and tell Bogda where to find Lawson.', known[TESTIMONY]?.believed.value,
            known[SECOND_ACCOUNT]?.believed.value].filter(Boolean),
        ...(known[SHOP_NOTICE] ? {result: `${known[SHOP_NOTICE].believed.value} You leave without meeting Lawson.`} : {}),
    };
}

export const kleinGlacisRun = Object.freeze({
    title: 'Klein · The Lawson lead',
    introduction: 'Bogda asks whether his liver operation will go well. You know Tarot and dream divination. Glacis has told you about an herbalist on Vlad Street.',
    create: createGlacisRun,
    restore: serialized => restoreEngineWorld(serialized, liveConfig),
    view: viewGlacisRun,
    act(engine, id) {
        const action = viewGlacisRun(engine).actions.find(item => item.id === id);
        if (!action || action.reason) throw new Error(action?.reason ?? 'You cannot do that at this point in the visit.');
        return runActions[id].act(engine);
    },
});
