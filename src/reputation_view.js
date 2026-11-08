// W3e: reputation is an audience's account of a subject, never a merged score.
// Each source keeps its writer and save authority. Reporters supply an observer-safe
// projection; no reader of this module is allowed to treat hidden truth as evidence.
import {tieShownView} from './person_ties.js';

export const STANDING_OWNERS = Object.freeze({
    region: {writer: 'gameplay_transactions.js', store: 'hero.reputation'},
    persona: {writer: 'persona_standing.js', store: 'personas'},
    peer: {writer: 'peer_standing_domain.js', store: 'peer_standing'},
    economy: {writer: 'economy_standing_domain.js', store: 'economy_standing'},
    person: {writer: 'simulation_effects.js', store: 'simulation.relationships'},
    memory: {writer: 'person_memory.js', store: 'person_memory'},
    heat: {writer: 'heat.js', store: 'heat'},
    rank: {writer: 'faction_rank.js', store: 'derived from regional reputation'},
});
const reporters = new Map();
export function registerReputationSource({id, worldId, owner, read}) {
    if(!id || !worldId || !STANDING_OWNERS[owner] || typeof read !== 'function') throw Error('Standing needs its world, writer and read projection.');
    reporters.set(id, {worldId, owner, read});
}
// A report: {audienceId, subjectId, label, line, evidence, observed:true}.
// Viewer access must be explicit in the source projection. A report without evidence
// is omitted; zero observed standing is valid and is not interpreted as hostility.
export function reputationView(state, {viewerId = 'player', subjectId = 'player', known = () => false} = {}) {
    const worldId = state?.actors?.[subjectId]?.worldId, rows = [];
    for(const [sourceId, source] of reporters) {
        if(source.worldId !== worldId) continue;
        for(const report of source.read(state, {viewerId, subjectId}) || []) {
            if(report.subjectId !== subjectId || report.observed !== true || !report.evidence || !known(report.audienceId) || !report.line) continue;
            rows.push({...report, sourceId, owner: source.owner});
        }
    }
    return rows;
}
for(const worldId of ['book.hp.lead.world', 'book.lotm.tingen']) registerReputationSource({
    id: `${worldId}.ties`, worldId, owner: 'person',
    read: (state, {viewerId, subjectId}) => viewerId !== 'player' || subjectId !== 'player' ? [] : tieShownView(state).map(t => ({
        audienceId: t.personId, subjectId, label: t.label, line: t.line,
        evidence: `observed meeting with ${t.personId}`, observed: true,
    })),
});
