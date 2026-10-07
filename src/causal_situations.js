import {assert, record, stableId, natural, copy} from "./simulation_contracts.js";

// Context describes one existing history. It does not create a native world copy.
export function validateSituationDefinition(d) {
    assert(record(d.context) && ["worldId", "instanceId", "continuityId", "eraId", "regionId"].every(k => stableId(d.context[k])), "Invalid situation context.");
    assert(stableId(d.initialPhase) && Array.isArray(d.phases) && new Set(d.phases).size === d.phases.length && d.phases.every(stableId) && d.phases.includes(d.initialPhase), "Invalid situation phases.");
    assert(record(d.privateTruth) && Object.keys(d.privateTruth).length > 0 && Object.values(d.privateTruth).every(v => ["string", "boolean", "number"].includes(typeof v)), "Invalid private situation truth.");
    assert(Array.isArray(d.participants) && d.participants.length > 0 && new Set(d.participants).size === d.participants.length && d.participants.every(stableId), "Invalid situation participants.");
    assert(d.responseWindow == null || natural(d.responseWindow) && d.responseWindow > 0, "Invalid situation response window.");
}
export function validateSituationEffect(e) {
    assert(stableId(e.situationId) && ["begin", "advance"].includes(e.operation), "Invalid situation effect.");
    if(e.operation === "advance") assert(Array.isArray(e.expected) && e.expected.length > 0 && e.expected.every(stableId) && stableId(e.phase), "Invalid situation transition.");
    if(e.definition) {validateSituationDefinition(e.definition); assert(e.definition.id === e.situationId, "Mismatched frozen situation.");}
}
export function applySituationEffect(state, e, registry, cause) {
    const s = state.simulation, records = s.situations ||= {};
    if(e.operation === "begin") {
        assert(!records[e.situationId], "This situation already exists.");
        const d = e.definition || registry.situations.get(e.situationId); assert(d, "Unknown situation.");
        validateSituationDefinition(d);
        assert(state.worlds[d.context.worldId] && d.participants.every(id => s.people[id] && state.actors[id]?.worldId === d.context.worldId), "Situation participants need the same actual world.");
        s.schema = Math.max(s.schema, 3);
        records[d.id] = {definitionId:d.id, revision:d.revision, context:copy(d.context), privateTruth:copy(d.privateTruth), participants:copy(d.participants),
            phases:copy(d.phases), phase:d.initialPhase, cause, openedAt:state.clock, deadline:d.responseWindow == null ? null : state.clock+d.responseWindow,
            receipts:[{from:null,to:d.initialPhase,at:state.clock,cause}]};
    } else {
        const r = records[e.situationId];
        assert(r && e.expected.includes(r.phase) && r.phases.includes(e.phase) && e.phase !== r.phase, "This situation response is stale or already settled.");
        assert(!r.receipts.some(t => t.cause === cause && t.to === e.phase), "Duplicate situation settlement.");
        r.receipts.push({from:r.phase,to:e.phase,at:state.clock,cause}); r.phase=e.phase;
    }
}
export function validateSituations(s, state, registry, person) {
    if(s.situations == null) return;
    assert(s.schema >= 3 && record(s.situations), "Situations need simulation schema3.");
    for(const [id,r] of Object.entries(s.situations)) {
        assert(stableId(id) && r.definitionId === id && natural(r.revision) && r.revision > 0 && (!registry || registry.situations.has(id)), "Unsupported saved situation.");
        validateSituationDefinition({...r,initialPhase:r.receipts?.[0]?.to});
        assert(state.worlds[r.context.worldId] && natural(r.openedAt) && r.openedAt <= state.clock && (r.deadline === null || natural(r.deadline) && r.deadline > r.openedAt), "Invalid situation time/context.");
        r.participants.forEach(person);
        // A historical context stays fixed even if a participant later travels.
        assert(stableId(r.cause) && Array.isArray(r.receipts) && r.receipts.length > 0 && r.receipts.length <= 32, "Invalid situation receipts.");
        let phase=null, at=r.openedAt; const seen=new Set();
        for(const t of r.receipts) {
            assert(t.from === phase && r.phases.includes(t.to) && natural(t.at) && t.at >= at && t.at <= state.clock && stableId(t.cause) && !seen.has(`${t.cause}:${t.to}`), "Invalid situation causal history.");
            seen.add(`${t.cause}:${t.to}`); phase=t.to; at=t.at;
        }
        assert(r.receipts[0].cause === r.cause && r.receipts[0].at === r.openedAt && phase === r.phase, "Situation phase lacks its receipt.");
    }
}
export function validateKnowledgeBasis(b, person, situations) {
    if(b == null) return;
    assert(record(b) && ["recollection", "observation", "instruction", "inference"].includes(b.kind) && stableId(b.attributedTo) && stableId(b.situationId), "Invalid knowledge attribution.");
    if(person) person(b.attributedTo);
    if(situations) assert(situations[b.situationId], "Knowledge needs its actual situation context.");
}
