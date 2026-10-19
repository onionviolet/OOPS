import {sameStructural as same} from './basics.js';
import {worldCompletionCropClockSupported} from './world_completion_crop_clock.js';
import {worldCompletionMaterialsValidationDefinitions} from './world_completion_materials_content.js';
// Pure current-owner projections and bounded invariants. No executor/host/UI
// import, inventory mirror, new clock or reconstruction of spent stock.
import {assert, natural, record} from './simulation_contracts.js';
import {REMAINDER_CONSEQUENCES_IDS as I, REMAINDER_CONSEQUENCES_KEYS as K, remainderConsequencesDefinitions as D} from './audit_remainder_consequences_content.js';
import {NESTED_IDS as N, NESTED_LOCATIONS as L, NESTED_MISSIONS} from './feature_expansion_nested_content.js';

const P = I.facts;
const terminalPlots = new Set(['covered', 'early', 'neglected', 'expired']);
const terminalCollections = new Set(['deferred', 'refused', 'expired', 'restored']);
const definition = id => D.commands.find(d => d.id === id);
const count = (state, actor, id) => state.actors?.[actor]?.completed?.[id] || 0;
const frontierPresent = state => state.actors?.player?.worldId === I.frontier && !state.realmPrototype?.activeVisitId;
const saltPresent = state => {
    const d = state.nestedCampaign, visit = d?.visits?.find(v => v.id === d.activeVisitId && v.status === 'active');
    return state.actors?.player?.worldId === N.salt && visit?.endpoint?.worldId === N.salt;
};
const checkFor = (state, eventId) => Object.values(state.simulation?.checks || {}).find(c => c.definitionId === eventId);
const dueOpen = (state, id) => checkFor(state, id)?.due > state.clock;
const caused = (state, receipt) => receipt && natural(receipt.at) && receipt.at <= state.clock &&
    /^(simulation|occurrence|reconcile_remainder_consequences):[1-9][0-9]*$/.test(receipt.cause || '') && Number(receipt.cause.split(':')[1]) <= state.sequence;

// The three witnesses must refer to the same committed hostile cause. A
// preview, generic private fact, prior export or merely depleted water fails.
export function remainderConsequencesSeizure(state) {
    const s = state.simulation, player = state.actors?.player;
    const known = s?.knowledge?.player?.['nested.chain.welfare.decision'];
    const receipt = s?.situations?.['nested.chain.welfare']?.receipts?.find(r => r.to === 'seized');
    const memory = s?.relationships?.player?.[N.foreman]?.memories?.find(m => m.cause === receipt?.cause && m.text === 'Forced the outlet and left a water loss.');
    return !!(count(state, 'player', 'nested.chain.welfare.hostile') === 1 &&
        player?.facts?.['nested.chain.welfare.disposition'] === 'seized' && receipt && memory &&
        known?.cause === receipt.cause && known.at === receipt.at && known.basis?.attributedTo === N.foreman &&
        known.basis?.situationId === 'nested.chain.welfare' && known.basis?.kind === 'observation' && caused(state, known));
}

export function remainderConsequencesFacts(state, context = {}) {
    const s = state.simulation, player = state.actors?.player, f = player?.facts || {};
    const location = context.actorId === 'player' || !context.actorId ? context.facts?.location || s?.people?.player?.location : s?.people?.player?.location;
    const usable = id => {
        const p = s?.people?.[id], v = context.vitals?.[id] || p?.vitals;
        return p?.life === 'alive' && p.body?.mobile !== false && (p.body?.hands ?? (id === 'player' ? 2 : 0)) >= 2 && (v?.health ?? 0) > 1;
    };
    const tender = ['body.sore_hands', 'body.scraped_hands'].some(id => {
        const c = s?.conditions?.player?.[id]; return c && (c.expiresAt == null || c.expiresAt > state.clock) && c.intensity > 0;
    });
    const front = frontierPresent(state), salt = saltPresent(state);
    const native = !!state.nestedCampaign && context.nestedNative?.bound === true && context.nestedNative.revision === state.nestedCampaign.nativeRevision;
    const iona = s?.people?.[I.iona], nell = s?.people?.[I.steward], corin = s?.people?.[I.collector];
    const friction = s?.conditions?.[I.iona]?.[I.friction];
    const exchanged = s?.claims?.[I.exchangeClaim]?.status === 'settled' && ['interrupted', 'considerate'].includes(f[`${P}iona.response`]);
    const plot = s?.situations?.[I.plot], right = s?.claims?.[I.plotRight];
    const bed = s?.sites?.[I.bed];
    const originalRepair = f['nested.chain.welfare.repairDue'] === true;
    const history = state.nestedCampaign?.history || [];
    const later = history.some(m => m.stage === 'settled' && NESTED_MISSIONS.find(d => d.id === m.id)?.worldId === N.salt);
    return {
        [`${P}frontierSupported`]: front && context.nativeAlive === true && s?.people?.player?.inventory === 'native' && usable('player'),
        [`${P}frontierClockSupported`]: front && s?.people?.player?.inventory === 'native' && worldCompletionCropClockSupported(state,context),
        [`${P}atVillage`]: location === 'Village', [`${P}atLanding`]: location === L.salt,
        [`${P}playerHands`]: usable('player') && !tender,
        [`${P}ionaPresent`]: front && location === 'Village' && iona?.location === 'Village' && usable(I.iona) &&
            state.actors?.[I.iona]?.worldId === I.frontier && state.actors[I.iona].facts?.['exchange.willing'] === true,
        [`${P}ionaExchanged`]: exchanged,
        [`${P}ionaFriction`]: exchanged && f[`${P}iona.response`] === 'interrupted' && !!friction && friction.intensity > 0 &&
            (friction.expiresAt == null || friction.expiresAt > state.clock),
        [`${P}ionaSoundStock`]: (s?.owners?.[I.iona]?.[K.sound] || 0) > 0,
        [`${P}plotAllocated`]: !!plot && f[`${P}plot.allocated`] === true,
        [`${P}bedPresent`]: !!bed && bed.owner === I.steward && bed.capacity === 1 && nell?.definitionId === I.steward,
        [`${P}plotRight`]: right?.owner === 'player' && right.status === 'held' && f[`${P}plot.allocated`] === true,
        [`${P}stewardPresent`]: front && location === 'Village' && nell?.location === 'Village' && usable(I.steward),
        [`${P}seedStock`]: (s?.owners?.[I.steward]?.[K.seed] || 0) === 1,
        [`${P}seedBought`]: f[`${P}plot.seedBought`] === true && count(state, 'player', `${I.prefix}plot_buy_seed`) === 1,
        [`${P}frostOpen`]: plot?.phase === 'warned' && dueOpen(state, I.frost),
        [`${P}saltSupported`]: salt && native,
        [`${P}laterSaltVisit`]: salt && later,
        [`${P}seizureSupported`]: remainderConsequencesSeizure(state) && originalRepair,
        [`${P}foremanPresent`]: salt && native && state.actors?.[N.foreman]?.worldId === N.salt &&
            s?.people?.[N.foreman]?.inventory === 'native' && s.people[N.foreman].location === L.enginehouse && usable(N.foreman),
        [`${P}collectionCommissioned`]: f[`${P}collection.commissioned`] === true,
        [`${P}collectorSupported`]: salt && corin?.definitionId === I.collector && state.actors?.[I.collector]?.worldId === N.salt && usable(I.collector) &&
            state.actors[I.collector].facts?.[`${P}collection.willing`] === true,
        [`${P}collectorArrived`]: state.actors?.[I.collector]?.facts?.[`${P}collection.arrived`] === true,
        [`${P}collectorAtLanding`]: salt && corin?.location === L.salt && corin.life === 'alive' && state.actors?.[I.collector]?.facts?.[`${P}collection.arrived`] === true,
        [`${P}collectionNoticed`]: f[`${P}collection.noticed`] === true && !!s?.knowledge?.player?.[`${P}collection.notice`],
        [`${P}collectionOpen`]: f[`${P}collection.closed`] !== true && dueOpen(state, I.collectionExpiry),
        [`${P}collectionClosed`]: f[`${P}collection.closed`] === true,
        [`${P}waterRepairDue`]: originalRepair && remainderConsequencesSeizure(state),
        [`${P}futureTradeClosed`]: f[`${P}collection.futureTradeClosed`] === true,
    };
}

// Root joins this into the existing before-increment seam. These are shifted
// original deadlines, never a second elapsed counter. Actual absence freezes
// this lane's local work, observation checks and fixed-pair friction only.
export function retainRemainderConsequencesWindows(state, from, through) {
    if(!state.auditRemainder || !state.simulation || through <= from) return;
    const s = state.simulation, delta = through - from;
    const unsupported = world => world === I.frontier ? !frontierPresent(state) : world === N.salt ? !saltPresent(state) : false;
    for(const c of Object.values(s.checks)) {
        const d = D.events.find(d => d.id === c.definitionId);
        if(d && unsupported([I.warning, I.frost].includes(d.id) ? I.frontier : N.salt)) c.due += delta;
    }
    for(const j of s.jobs) if(j.commandId.startsWith(I.prefix) && unsupported(definition(j.commandId)?.worldId)) j.due += delta;
    for(const [id, c] of Object.entries(s.controllers)) if((c.definitionId || '').startsWith(I.prefix) || id.startsWith(I.prefix)) {
        if(unsupported(state.actors?.[c.actorId]?.worldId)) c.due += delta;
    }
    const friction = s.conditions?.[I.iona]?.[I.friction];
    if(friction?.expiresAt != null && friction.expiresAt > from && !frontierPresent(state)) friction.expiresAt += delta;
}

// A completed ordinary or lane material restitution closes the same demand.
// Root applies this returned effect list through the existing staged executor
// with one reconcile_remainder_consequences:<sequence> cause before events.
export function planRemainderConsequencesReconciliation(state) {
    const s = state.simulation, f = state.actors?.player?.facts || {}, c = s?.claims?.[I.collectionClaim];
    if(!c || f['nested.chain.welfare.repairDue'] !== false || f['nested.chain.welfare.restituted'] !== true ||
        state.worlds?.[N.salt]?.facts?.['nested.saltworks.repaired'] !== true) return [];
    const actual = s.knowledge?.player?.[`${P}collection.restitution`] || s.knowledge?.player?.['nested.chain.welfare.restitution'];
    if(!caused(state, actual) || !(count(state, 'player', `${I.prefix}collection_restore`) === 1 || count(state, 'player', 'nested.chain.welfare.restitute') === 1)) return [];
    if(c.status === 'settled') return f[`${P}collection.futureTradeClosed`] === true ? [
        {type: 'fact', actor: 'player', scope: 'actor', key: `${P}collection.futureTradeClosed`, value: false},
        {type: 'fact', actor: 'player', scope: 'actor', key: `${P}collection.originalRestitution`, value: true},
        {type: 'knowledge', actor: 'player', key: `${P}collection.reopened`, stage: 'seen',
            value: 'Your existing completed material restitution reopened this collection’s future-trade terms. The previous refusal or expiry, actual local fee, forced outlet and finite resident spending remain recorded.',
            basis: {kind: 'observation', attributedTo: N.foreman, situationId: 'nested.chain.welfare'}},
    ] : [];
    if(f[`${P}collection.closed`] === true) return [];
    const effects = [];
    if(s.situations?.[I.collection]?.phase === 'notified') effects.push({type: 'situation', situationId: I.collection, operation: 'advance', expected: ['notified'], phase: 'restored'});
    effects.push({type: 'claim', actor: N.foreman, key: I.collectionClaim, operation: 'settle'},
        {type: 'fact', actor: 'player', scope: 'actor', key: `${P}collection.closed`, value: true},
        {type: 'fact', actor: 'player', scope: 'actor', key: `${P}collection.branch`, value: 'restored'},
        {type: 'fact', actor: 'player', scope: 'actor', key: `${P}collection.futureTradeClosed`, value: false},
        {type: 'knowledge', actor: 'player', key: `${P}collection.result`, stage: 'seen',
            value: 'Your completed actual material restitution settled the retained water account and ended this one funded collection demand. The old forcing, resident commissioning credit, collector route and any prior payment remain recorded; no export, mission payout or new supply was awarded.',
            basis: {kind: 'observation', attributedTo: N.foreman, situationId: 'nested.chain.welfare'}});
    return effects;
}

// Run after every lane command and after shared job/event/controller work.
// Removing obsolete one-shot probes cannot produce a crop, payment or refund.
export function pruneRemainderConsequencesChecks(state) {
    const s = state.simulation;
    if(!s) return 0;
    const plot = s.situations?.[I.plot]?.phase, closed = state.actors?.player?.facts?.[`${P}collection.closed`] === true;
    let n = 0;
    for(const [id, c] of Object.entries(s.checks)) if(([I.warning, I.frost].includes(c.definitionId) && terminalPlots.has(plot)) ||
        ([I.notice, I.collectionExpiry].includes(c.definitionId) && closed)) {delete s.checks[id]; n++;}
    return n;
}

// Root binds this at the common command-preview seam and native nested shop
// quote/commit seam. Its narrow consequence leaves movement, withdrawal,
// mission settlement, recovery and existing material restitution available.
export function remainderConsequencesExistingCommandGate(state, commandId) {
    if(state.auditRemainder?.schema !== 1 || state.actors?.player?.facts?.[`${P}collection.futureTradeClosed`] !== true) return [];
    const saltShop = `nested.buy.${N.saltShop}.`;
    const restricted = commandId.startsWith(saltShop) || ['nested.saltworks.paid_haul', 'nested.life.brin.open', 'nested.life.brin.work', 'nested.life.brin.buy_spare'].includes(commandId);
    return restricted ? ['The witnessed collection closed future Saltworks supply trade and Brin’s funded paid work. Actual material restitution can reopen these local terms.'] : [];
}

const actorFields = {
    player: { 'iona.response': ['interrupted', 'considerate'], 'iona.repaired': 'boolean', 'plot.allocated': 'boolean',
        'plot.source': ['association_saved_seed_allocation'], 'plot.seedBought': 'boolean', 'plot.planted': 'boolean', 'plot.warned': 'boolean',
        'plot.branch': [...terminalPlots], 'plot.yield': [1, 3, 5], 'collection.commissioned': 'boolean', 'collection.noticed': 'boolean',
        'collection.closed': 'boolean', 'collection.branch': [...terminalCollections], 'collection.feePaid': [2],
        'collection.futureTradeClosed': 'boolean', 'collection.materialRestitution': 'boolean', 'collection.originalRestitution': 'boolean'},
    [I.collector]: {'collection.willing': 'boolean', 'collection.arrived': 'boolean', 'collection.returned': 'boolean', 'collection.cancelledBeforeRoute': 'boolean'},
};
const commandCount = (state, id) => count(state, definition(id)?.actorId || 'player', id);
const receiptFromEffect = (state, commandId, key, actor = 'player') => {
    const expected = definition(commandId)?.effects.find(e => e.type === 'knowledge' && e.actor === actor && e.key === key);
    const actual = state.simulation?.knowledge?.[actor]?.[key];
    assert(expected && actual && caused(state, actual) && actual.stage === expected.stage && actual.value === expected.value && same(actual.basis, expected.basis), 'The local consequence lost its actual declared attributed receipt.');
    return actual;
};
function validateJobs(state, registry) {
    for(const j of state.simulation.jobs.filter(j => j.commandId.startsWith(I.prefix))) {
        const d = definition(j.commandId), participants = [...new Set([d?.actorId, ...(d?.participants || []).map(id => id === '$target' ? d.targetId : id)])];
        const costs = (j.costs || []).map(e => {const n = {...e}; if(n.actor == null) n.actor = d.actorId; return n;});
        const expectedCosts = d?.costs.map(e => ({...e, actor: e.actor || d.actorId}));
        const effects = (j.effects || []).map(e => {const n = {...e}; delete n.template; delete n.definition; return n;});
        assert(d && d.duration > 0 && j.actorId === d.actorId && j.targetId === (d.targetId || null) && j.revision === 1 &&
            j.reservationReturns === 1 && j.cancellation === 'refund' && same(costs, expectedCosts) && same(effects, d.effects) &&
            same(j.context, {actorId: d.actorId, targetId: d.targetId || null, partyIds: j.context?.partyIds}) && Array.isArray(j.context.partyIds) &&
            same(j.participants, participants) && same(j.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: d.location, failure: 'refund'}) &&
            j.siteId === (d.siteId || null) && natural(j.due) && j.due >= state.clock && commandCount(state, d.id) === 0,
            'A local consequence job lost its exact supported body, frozen inputs, output or refundable boundary.');
        for(const e of j.effects) {
            if(e.type === 'spawn') assert(same(e.template, D.people.find(p => p.id === e.definitionId)), 'The accepted collector must retain its exact finite actor template.');
            if(e.type === 'situation' && e.operation === 'begin') assert(same(e.definition, D.situations.find(p => p.id === e.situationId)), 'The accepted plot must retain its finite situation terms.');
        }
        if(registry) assert(same(registry.simulation.commands.get(d.id), d), 'Unsupported consequence command semantics.');
    }
}

export function validateRemainderConsequences(state, registry) {
    const s = state.simulation, f = state.actors?.player?.facts || {};
    assert(!Object.hasOwn(state.auditRemainder?.modules || {}, 'consequences'), 'Consequences use existing typed owners, not an unsupported parallel module record.');
    const active = Object.values(state.actors || {}).some(a => Object.keys(a.facts || {}).some(k => k.startsWith(P)) || Object.keys(a.completed || {}).some(k => k.startsWith(I.prefix))) ||
        Object.values(s?.knowledge || {}).some(k => Object.keys(k).some(id => id.startsWith(P) || id.startsWith('exchange.remainder.'))) ||
        Object.keys(s?.claims || {}).some(k => k.startsWith(I.prefix)) || s?.people?.[I.steward] || s?.people?.[I.collector] ||
        Object.values(s?.conditions || {}).some(cs => Object.hasOwn(cs, I.friction)) || (s?.jobs || []).some(j => j.commandId.startsWith(I.prefix)) ||
        Object.values(s?.checks || {}).some(c => (c.definitionId || '').startsWith(I.prefix)) || Object.values(s?.events || {}).some(e => e.definitionId.startsWith(I.prefix)) ||
        Object.entries(s?.controllers || {}).some(([id, c]) => id.startsWith(I.prefix) || (c.definitionId || '').startsWith(I.prefix));
    if(!active) return true;
    assert(state.schema === 11 && state.auditRemainder?.schema === 1 && s?.schema >= 4, 'New consequences require explicit expansion11/auditRemainder1; absence grants nothing to older saves.');
    for(const [actor, a] of Object.entries(state.actors)) {
        for(const [key, value] of Object.entries(a.facts || {}).filter(([key]) => key.startsWith(P))) {
            const type = actorFields[actor]?.[key.slice(P.length)];
            assert(type && (type === 'boolean' ? typeof value === 'boolean' : type.includes(value)), 'Unsupported bounded consequence actor field or owner.');
        }
        for(const [id, n] of Object.entries(a.completed || {}).filter(([id]) => id.startsWith(I.prefix))) assert(definition(id)?.actorId === actor && n === 1, 'A finite consequence completion must retain its actual actor and occur once.');
    }
    if(registry) for(const family of ['people', 'sites', 'conditions', 'situations', 'commands', 'events', 'controllers']) for(const d of D[family] || []) assert(same(registry.simulation[family]?.get(d.id), d), 'Unsupported registered consequence definition or revision.');
    validateJobs(state, registry);
    const declaredKnowledge = new Map();
    for(const owner of [...D.commands, ...D.events]) for(const effect of owner.effects || []) if(effect.type === 'knowledge') {
        const id = `${effect.actor}:${effect.key}`;
        declaredKnowledge.set(id, [...(declaredKnowledge.get(id) || []), effect]);
    }
    if(state.simulation.schema>=5)for(const d of worldCompletionMaterialsValidationDefinitions().commands.filter(d=>['world.completion.materials.cover_offcuts','world.completion.materials.cover_measured'].includes(d.id)))for(const e of d.effects||[])if(e.type==='knowledge'&&e.actor==='player'&&e.key===P+'plot.result')declaredKnowledge.set('player:'+e.key,[...(declaredKnowledge.get('player:'+e.key)||[]),e]);
    const reconciled = new Set(['player:' + P + 'collection.result', 'player:' + P + 'collection.reopened']);
    for(const [actor, entries] of Object.entries(s.knowledge)) for(const [key, actual] of Object.entries(entries).filter(([key]) => key.startsWith(P) || key.startsWith('exchange.remainder.'))) {
        const expected = declaredKnowledge.get(`${actor}:${key}`);
        assert((expected || reconciled.has(`${actor}:${key}`)) && caused(state, actual) && actual.stage === 'seen', 'Unsupported consequence knowledge key, owner or caused receipt.');
        if(expected && !reconciled.has(`${actor}:${key}`)) assert(expected.some(e => actual.value === e.value && same(actual.basis, e.basis)), 'Consequence observation must retain its exact authored witness and content.');
    }
    const allowedClaims = new Set([I.exchangeClaim, I.concession, I.plotRight, I.harvest, I.collectionClaim]);
    for(const id of Object.keys(s.claims).filter(id => id.startsWith(I.prefix))) assert(allowedClaims.has(id), 'Unsupported finite consequence claim.');

    const exchanged = f[`${P}iona.response`], exchange = s.claims[I.exchangeClaim], friction = s.conditions?.[I.iona]?.[I.friction];
    if(exchanged) {
        const id = `${I.prefix}iona_${exchanged === 'interrupted' ? 'interrupt' : 'considerate'}`, r = receiptFromEffect(state, id, 'exchange.remainder.exchange');
        assert(commandCount(state, id) === 1 && commandCount(state, `${I.prefix}iona_${exchanged === 'interrupted' ? 'considerate' : 'interrupt'}`) === 0 && exchange?.owner === 'player' && exchange.status === 'settled', 'Only one actual witnessed pair exchange is permitted.');
        const remembered = s.relationships?.[I.iona]?.player?.memories.find(m => m.cause === r.cause);
        assert(remembered && remembered.at === r.at, 'Iona must retain the caused directional memory independently of its temporary condition.');
        if(friction) assert(exchanged === 'interrupted' && friction.cause === r.cause && friction.intensity === 1 && natural(friction.expiresAt) && friction.expiresAt >= r.at + 8 && !f[`${P}iona.repaired`], 'Only the exact Iona/player interruption can carry this finite temporary friction.');
        if(f[`${P}iona.repaired`]) assert(commandCount(state, `${I.prefix}iona_repair`) === 1 && !friction && receiptFromEffect(state, `${I.prefix}iona_repair`, 'exchange.remainder.repair'), 'Pair repair requires its actual later conversation and removes no history.');
    } else assert(!exchange && !friction, 'Unwitnessed or older memories acquire no friction or concession.');
    for(const [actor, cs] of Object.entries(s.conditions)) if(Object.hasOwn(cs, I.friction)) assert(actor === I.iona, 'The temporary friction cannot affect another pair or expose another person.');
    if(s.claims[I.concession]) assert(s.claims[I.concession].owner === 'player' && s.claims[I.concession].status === 'settled' && commandCount(state, `${I.prefix}iona_concession`) === 1 && receiptFromEffect(state, `${I.prefix}iona_concession`, 'exchange.remainder.concession'), 'The one optional concession needs its actual paid stocked sale.');
    if(f['exchange.accepted'] === true) {
        const obligation = s.claims['exchange.parcel_payment'], phase = s.situations?.['exchange.parcel']?.phase;
        assert(obligation?.owner === 'player' && obligation.status === (phase === 'accepted' ? 'held' : 'settled'), 'Recent friction cannot erase the accepted parcel obligation or reserved payment.');
    }

    const plot = s.situations?.[I.plot];
    if(plot) {
        assert(f[`${P}plot.allocated`] === true && commandCount(state, `${I.prefix}plot_terms`) === 1 && f[`${P}plot.source`] === 'association_saved_seed_allocation' &&
            s.people[I.steward]?.definitionId === I.steward && s.people[I.steward].inventory === 'simulation' && s.sites[I.bed]?.owner === I.steward && s.sites[I.bed].capacity === 1 &&
            s.claims[I.plotRight]?.owner === 'player' && s.claims[I.plotRight].status === 'held', 'An actual finite planted allocation needs Nell, her owned bed and the retained local right.');
        receiptFromEffect(state, `${I.prefix}plot_terms`, `${P}plot.terms`);
        assert(state.actors[I.steward]?.resources?.coins === (f[`${P}plot.seedBought`] ? 2 : 0) + (f[`${P}plot.planted`] ? 1 : 0) &&
            (s.owners[I.steward]?.[K.seed] || 0) === (f[`${P}plot.seedBought`] ? 0 : 1), 'Nell’s actual packet and purse must conserve the one declared planting allocation and paid water.');
        if(f[`${P}plot.seedBought`]) assert(commandCount(state, `${I.prefix}plot_buy_seed`) === 1 && receiptFromEffect(state, `${I.prefix}plot_buy_seed`, `${P}plot.purchase`), 'Actual planting supply must be purchased once from Nell’s finite packet.');
        const planting = s.knowledge.player?.[`${P}plot.planting`];
        if(plot.phase !== 'allocated') assert(f[`${P}plot.planted`] === true && f[`${P}plot.seedBought`] === true && commandCount(state, `${I.prefix}plot_plant`) === 1 && receiptFromEffect(state, `${I.prefix}plot_plant`, `${P}plot.planting`) && caused(state, planting) &&
            s.claims[I.harvest]?.owner === 'player' && s.claims[I.harvest].status === (terminalPlots.has(plot.phase) ? 'settled' : 'held'), 'Only actual supplied planting creates the one native herb harvest claim.');
        else assert(!s.claims[I.harvest] && !f[`${P}plot.planted`], 'An unplanted bed cannot own an actual crop.');
        if(terminalPlots.has(plot.phase)) {
            const yields = {covered: 5, early: 3, neglected: 1, expired: 1}, r = s.knowledge.player?.[`${P}plot.result`];
            assert(f[`${P}plot.branch`] === plot.phase && f[`${P}plot.yield`] === yields[plot.phase] && caused(state, r) && plot.receipts.at(-1).cause === r.cause && plot.receipts.at(-1).at === r.at,
                'The plot must converge on one caused branch, its declared native yield and one settled harvest.');
            const branches = ['plot_cover', 'plot_early', 'plot_neglect'];
            assert(branches.reduce((n, id) => n + commandCount(state, `${I.prefix}${id}`), 0)+['world.completion.materials.cover_offcuts','world.completion.materials.cover_measured'].reduce((n,id)=>n+commandCount(state,id),0) === (plot.phase === 'expired' ? 0 : 1), 'A finite crop cannot complete two player harvest branches.');
        } else assert(!f[`${P}plot.branch`] && !f[`${P}plot.yield`] && !s.knowledge.player?.[`${P}plot.result`], 'An unfinished crop cannot carry an awarded harvest.');
    } else assert(!s.people[I.steward] && !f[`${P}plot.allocated`] && !s.claims[I.plotRight] && !s.claims[I.harvest], 'Old or absent plot state cannot provision Nell or supplies.');

    const collection = s.situations?.[I.collection], collectionClaim = s.claims[I.collectionClaim], collector = s.people[I.collector];
    if(f[`${P}collection.commissioned`]) {
        assert(remainderConsequencesSeizure(state) && commandCount(state, I.commission) === 1 && collectionClaim?.owner === N.foreman && collector?.definitionId === I.collector && collector.inventory === 'simulation', 'Only the actual locally attributed seizure can fund this one retained collection actor.');
        receiptFromEffect(state, I.commission, `${P}collection.commission`, N.foreman);
        assert(collectionClaim.status === (f[`${P}collection.closed`] ? 'settled' : 'held'), 'The finite collection demand must preserve the commissioning owner and closure.');
        const a = state.actors[I.collector], walking = s.jobs.some(j => j.commandId === `${I.prefix}collection_walk`), walked = commandCount(state, `${I.prefix}collection_walk`) === 1;
        const cancelled = commandCount(state, `${I.prefix}collection_cancel_before_route`) === 1;
        assert(a.resources['nested.credit'] === (walked || walking || cancelled ? 0 : 1) && a.resources.routeAgenda === (walked || walking ? 0 : 1), 'Corin’s one commissioning credit and route agenda must be real reserved/spent/refunded means, never replenished.');
        const returning = s.jobs.some(j => j.commandId === `${I.prefix}collection_return`), returned = commandCount(state, `${I.prefix}collection_return`) === 1;
        assert(collector.body?.hands === 2 && collector.body.mobile === true && collector.vitals.max_stamina === 4 &&
            collector.vitals.stamina === 4 - (walking || walked ? 2 : 0) - (returning || returned ? 1 : 0), 'The collector must spend its own finite route body effort and cannot refill during this case.');
        if(walked) assert(a.facts[`${P}collection.arrived`] === true && receiptFromEffect(state, `${I.prefix}collection_walk`, `${P}collection.route`, I.collector), 'The collection needs the actual funded movement receipt.');
        else assert(!collection && !a.facts[`${P}collection.arrived`], 'A collector without completed movement cannot make a landing demand.');
        if(returned) assert(f[`${P}collection.closed`] === true && collector.life === 'departed' && collector.location === L.enginehouse && a.facts[`${P}collection.returned`] === true, 'The spent collector must finish its declared return without respawning.');
        if(cancelled) assert(!walked && !walking && f[`${P}collection.closed`] === true && collector.life === 'departed' && collector.location === L.enginehouse && a.facts[`${P}collection.cancelledBeforeRoute`] === true &&
            receiptFromEffect(state, `${I.prefix}collection_cancel_before_route`, `${P}collection.cancelled`, I.collector), 'An unused route payment must return once under its actual completed cancellation receipt.');
    } else assert(!collector && !collection && !collectionClaim, 'A private suspicion, preview or absent old case cannot launch a collector.');
    if(collection) {
        assert(f[`${P}collection.noticed`] === true && caused(state, s.knowledge.player?.[`${P}collection.notice`]), 'A landing demand must be locally observed before player responses.');
        if(terminalCollections.has(collection.phase)) assert(f[`${P}collection.closed`] === true && f[`${P}collection.branch`] === collection.phase && caused(state, s.knowledge.player?.[`${P}collection.result`]), 'One observed collection retains one actual response or timeout.');
        else assert(!f[`${P}collection.closed`], 'An active observed collection cannot silently carry closed terms.');
    }
    if(f[`${P}collection.feePaid`]) assert(commandCount(state, `${I.prefix}collection_fee`) === 1 && f[`${P}collection.feePaid`] === 2, 'A deferral must retain its actual two-credit committed payment.');
    if(f[`${P}collection.materialRestitution`]) assert(commandCount(state, `${I.prefix}collection_restore`) === 1 && f['nested.chain.welfare.restituted'] === true && f['nested.chain.welfare.repairDue'] === false &&
        state.worlds[N.salt].facts['nested.saltworks.repaired'] === true, 'Collection restitution must consume actual materials into the existing water-duty owner.');
    if(f[`${P}collection.originalRestitution`]) assert(count(state, 'player', 'nested.chain.welfare.restitute') === 1 && f['nested.chain.welfare.restituted'] === true &&
        f['nested.chain.welfare.repairDue'] === false && f[`${P}collection.futureTradeClosed`] === false && caused(state, s.knowledge.player?.[`${P}collection.reopened`]), 'Original material restitution must reopen only its actual local trade consequence.');
    if(f[`${P}collection.futureTradeClosed`]) assert(f[`${P}collection.closed`] === true && ['refused', 'expired'].includes(f[`${P}collection.branch`]) && !f[`${P}collection.materialRestitution`], 'Closed trade needs the disclosed actual refusal or expiry; it cannot survive actual restitution.');

    const checks = Object.entries(s.checks).filter(([, c]) => D.events.some(d => d.id === c.definitionId));
    assert(checks.length <= 4 && new Set(checks.map(([, c]) => c.definitionId)).size === checks.length, 'A local consequence has at most one actual timer for each finite event.');
    const sources = {[I.warning]: plantingReceipt(state), [I.frost]: s.knowledge.player?.[`${P}plot.warning`],
        [I.notice]: s.knowledge[I.collector]?.[`${P}collection.route`], [I.collectionExpiry]: s.knowledge.player?.[`${P}collection.notice`]};
    for(const [id, c] of checks) assert(c.actorId === 'player' && caused(state, sources[c.definitionId]) && c.cause === sources[c.definitionId].cause &&
        id === `event:${c.cause}:${c.definitionId}:player` && c.interval === 1 && c.count >= 0 && c.due >= state.clock &&
        c.targetId === ([I.notice].includes(c.definitionId) ? I.collector : null), 'Each consequence timer must come from its actual once-only planting, warning or paid local route.');
    return true;
}
function plantingReceipt(state) {return state.simulation?.knowledge?.player?.[`${P}plot.planting`];}
