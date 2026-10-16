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
// The audit remainder nonce counts played minutes. Each minute window (w, w+1]
// gets one bump before exact receipt joins unless something else already
// bumped the sequence in that window, so a quote from before the minute goes
// stale. advanceSimulation keeps one window anchor for the whole call and
// calls this before every clock move; the event-free minutes it skips each
// get their one bump here. That makes the sequence identical however the
// played time is split into calls.
export function auditRemainderNonceWindow(state) {
    return {clock: state.clock, sequence: state.sequence};
}
export function enterAuditRemainderMinute(state, window, to) {
    if(state.auditRemainder?.schema !== 1 || to <= state.clock) return;
    state.sequence += to - state.clock - 1;
    window.clock = to - 1; window.sequence = state.sequence;
}
export function advanceAuditRemainder(before, out, registry, context = {}, window = auditRemainderNonceWindow(before)) {
    if(out.state.auditRemainder?.schema !== 1) return;
    // New reader gives a committed played minute one nonce before exact
    // receipt joins. The old readers retain their original sequence behavior.
    if(out.state.clock > window.clock && out.state.sequence === window.sequence) out.state.sequence++;
    installAuditRemainderControllers(out.state, registry);
    advanceRemainderOffers(before, out, registry, context);
    const fit = syncRemainderCombatFitCompletion(out.state);
    if(fit != null) out.state.auditRemainder.modules.combat_fit = fit;
    reconcileRemainderConsequences(out, registry, context);
    advanceRemainderCombatObjectives(before, out, registry, context);
}
