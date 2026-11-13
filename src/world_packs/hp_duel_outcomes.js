// PC95: spell release and movement use the engine minute. Convert that
// settled minute into contest ticks for publication, with no contest stepping.
import {beginContest, defaultChoice, defineContestLaw, settleContestExit, TICKS_PER_SECOND} from '../contest.js';
import {advanceEngineWorld, applyEngineOps} from '../engine_world.js';
import {cancelSpellCast} from '../spell_law.js';
import {linkDistance, linkExits, worldLinks} from '../world_substrate.js';
import {canStartDuelCast, castAtDuellingClub, duelShieldOpening, prepareDuelGuard,
    startDuellingClub, withdrawFromDisarmDrill} from './hp_duelling_club.js';

const moves = {
    ...Object.fromEntries(['disarm', 'dance', 'tickle'].map(id => [id, {resolver: 'notch', steps: [1]}])),
    shield: {kind: 'guard', target: 'self', steps: [1], block: {}},
};
export const DUEL_OUTCOME_LAW = defineContestLaw({id: 'hogwarts.disarm-outcome', revision: 1, moves});
const ticks = engine => engine.world.clock * 60 * TICKS_PER_SECOND;

function requireOpen(state) {
    if (state.record.result) throw Error('The exchange has ended.');
}

export function castInDuelOutcome(state, cast) {
    requireOpen(state);
    return {...state, engine: castAtDuellingClub(state.engine, cast)};
}

export function withdrawFromDuelOutcome(state) {
    requireOpen(state);
    const engine = withdrawFromDisarmDrill(state.engine);
    return {...state, engine: applyEngineOps(engine, [
        {op: 'property', holder: 'draco', property: 'duel_yield_offered', value: null},
    ], 'withdraw-offer')};
}

export function startDuelOutcome({acceptsSurrender = true, pursues = false} = {}) {
    const engine = startDuellingClub({students: true, disarmDrill: 'pursuit'});
    const record = beginContest(DUEL_OUTCOME_LAW, {id: 'student-disarm', seed: 0, place: 'east-platform',
        entrants: [
            {id: 'draco', side: 'draco', body: 'draco', moves: ['shield', 'dance', 'tickle']},
            {id: 'harry', side: 'harry', body: 'harry', moves: ['shield', 'disarm'], wants: {acceptsSurrender, pursues}},
        ]}, engine.world);
    return {engine, record};
}

// The opening drill tries each attack once. A defense can be chosen again
// when a later impact needs it. Its engine minute supplies a stable ID.
function idleCast(state, actor) {
    const {engine, record} = state;
    const id = spell => spell === 'shield' ? `idle.${actor}.shield.${engine.world.clock}` : `idle.${actor}.${spell}`;
    const incoming = duelShieldOpening(engine, actor);
    const guarding = incoming && prepareDuelGuard(engine, actor);
    const choice = defaultChoice(DUEL_OUTCOME_LAW, record, engine.world, actor, {
        incoming,
        canUse: spell => !engine.records.workings[id(spell)] &&
            (spell === 'shield' ? !!guarding : canStartDuelCast(engine, actor, spell)),
    });
    if (!choice || !Object.hasOwn(moves, choice.move)) return state;
    return castInDuelOutcome(choice.move === 'shield' ? {...state, engine: guarding} : state,
        {id: id(choice.move), actor, spellId: choice.move, target: choice.target});
}

export function offerDuelSurrender(state) {
    const {engine, record} = state;
    const draco = engine.world.holders.draco;
    if (record.result || record.entrants.draco.yieldRefused || draco.place !== 'east-platform' || !draco.properties.mind_awake)
        throw Error('Draco cannot offer surrender here.');
    return {...state, engine: applyEngineOps(engine, [
        {op: 'property', holder: 'draco', property: 'duel_yield_offered', value: true},
        {op: 'property', holder: 'draco', property: 'agency_goal', value: null},
    ], 'offer-surrender')};
}

function settleExit(state, kind) {
    const {engine} = state;
    const {record, world} = settleContestExit(DUEL_OUTCOME_LAW, state.record, engine.rules, engine.world,
        {entrant: 'draco', kind, at: ticks(engine)});
    let next = {...engine, world};
    if (kind === 'escape' && record.pursuits.some(intent => intent.by === 'harry' && intent.of === 'draco')) {
        const departure = world.chain.findLast(event => event.kind === 'departed' && event.by === 'draco' &&
            event.at === world.clock && event.detail?.to === 'doorway');
        const harry = world.holders.harry;
        if (departure && harry.properties.mind_awake === true && linkDistance(worldLinks(world), harry.place, departure.place,
            {kinds: ['sightline'], maxLinks: 1})) {
            next = applyEngineOps(next, [{op: 'property', holder: 'harry', property: 'duel_pursuit_lead',
                value: departure.detail.to}], 'witness-departure');
        }
    }
    if (record.result) for (const [id, {payer, record: working}] of Object.entries(next.records.workings)) {
        if (Object.hasOwn(record.entrants, payer) && working.method.id.startsWith('hogwarts.duel.'))
            next = cancelSpellCast(next, {id, actor: payer}).engine;
    }
    return {engine: next, record};
}

/** Follow the last witnessed lead by one open path. Motion settles on the
 * engine clock and rechecks that path when the actor actually crosses. */
export function followDuelPursuit(state) {
    const {engine, record} = state;
    const {world} = engine;
    const harry = world.holders.harry;
    const lead = harry.properties.duel_pursuit_lead;
    if (!record.pursuits.some(intent => intent.by === 'harry' && intent.of === 'draco') || !lead)
        throw Error('Harry has no witnessed route to follow.');
    if (harry.place === lead) return state;
    const links = worldLinks(world), options = {kinds: ['path']};
    const route = linkDistance(links, harry.place, lead, options);
    const first = route && linkExits(links, harry.place, options).find(exit => exit.link === route.route[0]);
    if (!first) throw Error('The route to the last sighting is closed.');
    return {...state, engine: applyEngineOps(engine, [
        {op: 'property', holder: 'harry', property: 'agency_goal', value: first.to},
    ], 'follow-sighting')};
}

export function answerDuelSurrender(state) {
    const {engine, record} = state;
    if (record.result) return state;
    if (engine.world.holders.draco.properties.duel_yield_offered !== true) throw Error('There is no offer to answer.');
    return settleExit({...state, engine: applyEngineOps(engine, [
        {op: 'property', holder: 'draco', property: 'duel_yield_offered', value: null},
    ], 'answer-surrender')}, 'yield');
}

export function advanceDuelOutcome(state, to, {idle = []} = {}) {
    let {engine, record} = state;
    while (!record.result && engine.world.clock < to) {
        if (engine.world.holders.draco.properties.duel_yield_offered !== true)
            for (const actor of Object.keys(record.entrants)) if (idle.includes(actor))
                ({engine, record} = idleCast({engine, record}, actor));
        const result = advanceEngineWorld(engine, engine.world.clock + 1);
        engine = result.engine;
        if (result.pending) return {engine, record, pending: true};
        if (engine.world.holders.draco.place === 'doorway') ({engine, record} = settleExit({engine, record}, 'escape'));
    }
    if (engine.world.clock === to) return {engine, record, pending: false};
    const result = advanceEngineWorld(engine, to);
    return {engine: result.engine, record, pending: result.pending};
}
