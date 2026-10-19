// Pure reads and compatibility checks over the existing fact/knowledge/job owners.
import {check} from './basics.js';
import {STEAM_DF_IDS as I, steamDFDefinitions as D, steamDFLegacyKnowledge} from './steam_df_content.js';
import {steamDFNatural as natural, steamDFRecord as record, sameSteamDFData as same, decodeSteamDFJSON as decode,
    steamDFStockWitness, validSteamDFWitness, steamDFSupport, steamDFCurrentReport, steamDFReportTextMatches, steamDFReportEffects} from './steam_df_runtime.js';

const definitions = new Map(D.commands.map(d => [d.id, d]));
const owned = key => typeof key === 'string' && key.startsWith(I.prefix);
const sequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
const basis = {kind: 'observation', attributedTo: I.owner, situationId: I.situation};
const fixedKnowledge = new Map(D.commands.flatMap(d => d.effects.filter(e => e.type === 'knowledge').map(e => [e.key, {d, e}])));

export function steamDFFacts(state, context = {}, registry) {
    const support = steamDFSupport(state, context), receipt = steamDFCurrentReport(state);
    const sample = context.steamDFSample;
    return {'steamDF.enrolled': state.actors?.player?.facts?.[I.enrolled] === true,
        'steamDF.supported': support.supported, 'steamDF.ownerSupported': support.ownerSupported,
        'steamDF.benchSupported': support.benchSupported, 'steamDF.currentPair': receipt.currentPair,
        'steamDF.reportCurrent': receipt.current,
        'steamDF.sampleCurrent': !!sample && natural(sample.amount) && sample.amount === (state.simulation?.owners?.[I.owner]?.[I.item] ?? 0) && same(sample.witness, steamDFStockWitness(state))};
}
function validateSample(sample, state) {
    check(record(sample) && Object.keys(sample).length === 4 && sample.schema === 1 && natural(sample.amount) && natural(sample.sampledAt) && sample.sampledAt <= state.clock &&
        validSteamDFWitness(sample.witness, sample.sampledAt), 'Invalid frozen offered-stock sample.');
    const current = steamDFStockWitness(state);
    check(sample.witness.revision <= current.revision && (sample.witness.revision === current.revision ? same(sample.witness, current) : current.at >= sample.sampledAt),
        'The stock witness cannot precede the accepted sample.');
}
function validateReceipt(receipt, known, state) {
    const exact = receipt?.precision === 'exact';
    const fields = ['schema', 'observerId', 'ownerId', 'itemKey', 'precision', 'sampledAt', 'sampledCause', 'witness', ...(exact ? ['amount'] : ['lower', 'upper'])];
    check(record(receipt) && same(Object.keys(receipt), fields) && receipt.schema === 1 && receipt.observerId === 'player' && receipt.ownerId === I.owner &&
        receipt.itemKey === I.item && ['estimate', 'exact'].includes(receipt.precision) && natural(receipt.sampledAt) && natural(sequence(receipt.sampledCause)) &&
        sequence(receipt.sampledCause) > 0 && sequence(receipt.sampledCause) <= state.sequence && validSteamDFWitness(receipt.witness, receipt.sampledAt), 'Invalid offered-stock report receipt.');
    check(exact ? natural(receipt.amount) : natural(receipt.lower) && natural(receipt.upper) && receipt.lower % 3 === 0 && receipt.upper === Math.min(Number.MAX_SAFE_INTEGER, receipt.lower + 2),
        'Invalid offered-stock report precision.');
    const d = definitions.get(exact ? I.count : I.estimate);
    check(known?.stage === 'seen' && steamDFReportTextMatches(receipt, known.value) && known.cause === receipt.sampledCause && same(known.basis, basis) &&
        natural(known.at) && known.at >= receipt.sampledAt + d.duration && known.at <= state.clock && state.actors.player.completed[d.id] > 0,
        'The report must retain its completed, attributed service knowledge.');
    const current = steamDFStockWitness(state);
    check(receipt.witness.revision <= current.revision && (receipt.witness.revision === current.revision ? same(receipt.witness, current) : current.at >= known.at),
        'The stock witness cannot precede an issued report.');
}

export function validateSteamDFState(state, registry) {
    const s = state.simulation, player = state.actors?.player, ownJobs = [];
    let activated = false;
    for (const [actorId, a] of Object.entries(state.actors || {})) {
        for (const [key, value] of Object.entries(a.facts || {}).filter(([k]) => owned(k))) {
            activated = true;
            check(actorId === 'player' && [I.enrolled, I.report].includes(key) || actorId === I.owner && key === I.witness, 'Unknown offered-stock fact or owner.');
            if (key === I.enrolled) check(value === true, 'Unsupported offered-stock enrollment.');
            if (key === I.report) check(typeof value === 'string' && decode(value), 'The report must be canonical receipt JSON.');
            if (key === I.witness) check(validSteamDFWitness(decode(value), state.clock, {origin: false}), 'Invalid stock-mutation witness.');
        }
        for (const [key, value] of Object.entries(a.completed || {}).filter(([k]) => owned(k))) {
            activated = true;
            check(actorId === 'player' && definitions.has(key) && natural(value) && value > 0 && (key !== I.begin || value === 1), 'Unknown offered-stock completion.');
        }
        for (const family of ['resources', 'sources', 'techniques']) check(!Object.keys(a[family] || {}).some(owned), 'This service owns no separate resources, powers or practice.');
    }
    for (const w of Object.values(state.worlds || {})) check(!Object.keys(w.facts || {}).some(owned), 'A player report is not shared world truth.');
    for (const [actorId, records] of Object.entries(s?.knowledge || {})) for (const [key, known] of Object.entries(records).filter(([k]) => owned(k))) {
        activated = true;
        check(actorId === 'player' && [I.report, ...fixedKnowledge.keys()].includes(key), 'Unknown offered-stock knowledge owner or key.');
        if (key !== I.report) {
            const {d, e} = fixedKnowledge.get(key);
            check(known.stage === e.stage && (known.value === e.value || known.value === steamDFLegacyKnowledge[key]) && same(known.basis, e.basis) && natural(known.at) && known.at <= state.clock &&
                natural(sequence(known.cause)) && sequence(known.cause) > 0 && sequence(known.cause) <= state.sequence && player?.completed?.[d.id] > 0,
                'The workshop statement needs its actual completed action and attribution.');
        }
    }
    for (const j of s?.jobs || []) {
        if (owned(j.commandId)) {ownJobs.push(j); activated = true;}
        else check(j.steamDFSample == null, 'A stock sample belongs only to an admitted report job.');
    }
    for (const p of Object.values(s?.programs || {})) check(!owned(p.commandId), 'Offered-stock service is not an automated routine.');
    for (const family of ['people', 'sites', 'custody', 'events', 'controllers', 'sessions', 'claims', 'situations', 'energies'])
        check(!Object.keys(s?.[family] || {}).some(owned), 'This service creates no parallel people, site or execution owner.');
    for (const family of ['conditions', 'faculties', 'powers', 'progression', 'titles', 'equipment', 'owners'])
        for (const rows of Object.values(s?.[family] || {})) check(!Object.keys(rows || {}).some(owned), 'Unknown offered-stock owned state.');
    if (!activated) return;
    check(s && player?.facts?.['feature_objects.introduced'] === true && s.people?.[I.owner]?.definitionId === I.owner &&
        s.people[I.owner].inventory === 'simulation' && state.actors?.[I.owner]?.worldId === I.world && record(s.owners?.[I.owner]) &&
        s.sites?.[I.site]?.owner === I.owner && s.situations?.[I.situation]?.revision === 1, 'Offered-stock state needs the actual introduced Eda, bench and situation.');
    const enrolled = player.facts[I.enrolled] === true;
    const playerOwned = Object.keys(player.facts).some(owned) || Object.keys(player.completed).some(owned) ||
        Object.keys(s.knowledge?.player || {}).some(owned) || ownJobs.length > 0;
    if (!playerOwned) return; // Existing Eda stock mutation may predate this optional service.
    check(enrolled && player.completed[I.begin] === 1 && s.knowledge?.player?.['steam.df.opening'], 'The optional service needs its explicit completed opening.');
    const savedReport = player.facts[I.report], known = s.knowledge?.player?.[I.report];
    check((savedReport != null) === (known != null), 'Report receipt and attributed knowledge must stay paired.');
    if (savedReport != null) validateReceipt(decode(savedReport), known, state);
    if (player.completed[I.count] || player.completed[I.estimate]) check(known && savedReport, 'Completed report work lost its receipt.');
    for (const j of ownJobs) {
        const d = definitions.get(j.commandId);
        check(d?.steamDFPrecision && j.revision === d.revision && j.actorId === 'player' && j.targetId === I.owner &&
            j.id === `simulation:${j.sequence}` && natural(j.sequence) && j.sequence > 0 && j.sequence <= state.sequence &&
            same(j.participants, ['player', I.owner]) && j.context?.actorId === 'player' && j.context.targetId === I.owner &&
            same(Object.keys(j.context), ['actorId', 'targetId', 'partyIds']) && Array.isArray(j.context.partyIds) &&
            j.siteId === I.site && j.claim === null && j.label === d.label && j.roll === null && j.outcomeId === null &&
            j.cancellation === 'refund' && j.reservationReturns === 1 && same(j.costs, d.costs), 'The saved report differs from its exact admitted service.');
        validateSample(j.steamDFSample, state);
        check(j.due === j.steamDFSample.sampledAt + d.duration && j.due >= state.clock &&
            (same(j.effects, steamDFReportEffects(j.steamDFSample, d, j.id)) || same(j.effects, steamDFReportEffects(j.steamDFSample, d, j.id, {legacy: true}))) &&
            same(j.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: true, location: 'Village', failure: 'refund'}) &&
            s.sites[I.site].reservations[j.id] === 'player', 'The report lost its frozen sample, actual reservation or completion contract.');
        if (registry) check(same(registry.simulation.commands.get(d.id), d), 'Unsupported offered-stock report definition.');
    }
}
