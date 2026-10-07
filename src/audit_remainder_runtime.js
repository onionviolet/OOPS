import {installAuditRemainderControllers} from './audit_remainder_state.js';
import {advanceRemainderOffers, retainRemainderOffersWindow} from './audit_remainder_offers_state.js';
import {retainRemainderConsequencesWindows} from './audit_remainder_consequences_facts.js';
import {reconcileRemainderConsequences, remainderConsequencesSimulationContexts} from './audit_remainder_consequences_host.js';
import {syncRemainderCombatFitCompletion} from './audit_remainder_combat_fit_hooks.js';
import {advanceRemainderCombatObjectives} from './audit_remainder_combat_objectives_state.js';
import {remainderHomeSimulationContexts} from './audit_remainder_home_host.js';

export function retainAuditRemainderWindows(state, from, through) {
    if(state.auditRemainder?.schema !== 1) return;
    retainRemainderOffersWindow(state, from, through);
    retainRemainderConsequencesWindows(state, from, through);
}
export function auditRemainderSimulationContexts(state, contexts) {
    if(state.auditRemainder?.schema !== 1) return contexts;
    const id = 'remainder_home.neri';
    const resident = contexts[id] || {...contexts.player, actorId: id, busy: false,
        vitals: state.simulation?.people[id]?.vitals, facts: {...contexts.player?.facts, location: state.simulation?.people[id]?.location}};
    return remainderConsequencesSimulationContexts(state, {...contexts, ...remainderHomeSimulationContexts(state, resident)});
}
export function advanceAuditRemainder(before, out, registry, context = {}) {
    if(out.state.auditRemainder?.schema !== 1) return;
    // New reader gives a committed played boundary one nonce before exact
    // receipt joins. The old readers retain their original sequence behavior.
    if(out.state.clock > before.clock && out.state.sequence === before.sequence) out.state.sequence++;
    installAuditRemainderControllers(out.state, registry);
    advanceRemainderOffers(before, out, registry, context);
    const fit = syncRemainderCombatFitCompletion(out.state);
    if(fit != null) out.state.auditRemainder.modules.combat_fit = fit;
    reconcileRemainderConsequences(out, registry, context);
    advanceRemainderCombatObjectives(before, out, registry, context);
}
