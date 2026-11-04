// H7 first slice: Mara, the road rival, remembers each contest and carries a margin her looks do not show.
// Memory rides the player's saved actor facts (already persisted); the fight reads it at the start of the next contest.
// Appraisal is a gate on what the player is TOLD, never on what is true (AD7): the margin applies either way.
// Dials are defaults with a reason; a world or a later rival can change them.
export const RIVAL_FACTS = Object.freeze({duels: 'rival.duels', wins: 'rival.wins', losses: 'rival.losses', withdrawn: 'rival.withdrawn'});
export const RIVAL_DIALS = Object.freeze({
    hiddenAttack: {value: 1.3, why: 'A scout who works the road for a living is stronger than a stranger would guess; she keeps it quiet.'},
    revengePerLoss: {value: .2, why: 'Being beaten on the road leaves a grudge that grows with each defeat.'},
    mercyPerLoss: {value: .15, why: 'A beaten rival is less ready to stop when she finally has the upper hand.'},
    swaggerPerWin: {value: .1, why: 'Beating you makes her surer of herself and quicker to close the matter.'},
    studyPerDuel: {value: 2, why: 'Each contest teaches her how you open: she notices more.'},
    studyCap: {value: 6, why: 'There is a limit to what watching teaches.'}
});
const n = (facts, key) => Number.isFinite(facts?.[key]) ? facts[key] : 0;
export const rivalHistory = facts => ({duels: n(facts, RIVAL_FACTS.duels), wins: n(facts, RIVAL_FACTS.wins), losses: n(facts, RIVAL_FACTS.losses),
    withdrawn: n(facts, RIVAL_FACTS.withdrawn), last: facts?.['rival.lastResult'] || null});
// Fact effects written when a contest ends. `result` is the player's result: won, lost or withdrawn.
export function rivalMemoryEffects(facts, result) {
    const h = rivalHistory(facts), put = (key, value) => ({type: 'fact', scope: 'actor', key, value});
    return [put(RIVAL_FACTS.duels, h.duels + 1),
        ...(result === 'won' ? [put(RIVAL_FACTS.wins, h.wins + 1)] : result === 'lost' ? [put(RIVAL_FACTS.losses, h.losses + 1)] : [put(RIVAL_FACTS.withdrawn, h.withdrawn + 1)])];
}
// The means that let the player see her real strength. Each is something the player did or has; none is a permission list.
export function appraisalMeans(facts) {
    const h = rivalHistory(facts), means = [];
    if(h.duels > 0) means.push({id: 'felt-her-hand', text: 'You have crossed blades with her.'});
    if(facts?.['rival.resolved']) means.push({id: 'rival-insight', text: 'Beating her taught you how she moves.'});
    return means;
}
export const hiddenMargin = () => RIVAL_DIALS.hiddenAttack.value;
// What the road contest panel says about her before it begins: memory line and appraisal line (the gate).
export function rivalBrief(facts) {
    const h = rivalHistory(facts), means = appraisalMeans(facts), pct = Math.round((hiddenMargin() - 1) * 100);
    const memory = !h.duels ? 'Mara has not met you in a contest.' : h.last === 'won'
        ? `Mara remembers losing to you${h.wins > 1 ? ` ${h.wins} times` : ''} and wants it back.` : h.last === 'lost'
        ? `Mara remembers beating you${h.losses > 1 ? ` ${h.losses} times` : ''} and expects to do it again.` : 'Mara remembers you walked away from the last contest.';
    const appraisal = means.length ? `Appraised (${means[0].text.replace(/\.$/, '').toLowerCase()}): she strikes about ${pct}% harder than she looks.`
        : 'She reads as an ordinary scout. You cannot tell more without seeing her fight or finding another way to take her measure.';
    return {memory, appraisal, appraised: means.length > 0, means: means.map(m => m.id), history: h};
}
// The real body she fights with, and the goals and wits her memory gives her.
export function rivalCombatant(body, facts) {
    const h = rivalHistory(facts), D = RIVAL_DIALS;
    const real = {...body, attack: Math.ceil((body.attack ?? 0) * D.hiddenAttack.value)};
    const clamp = v => Math.min(.95, Math.max(.05, v));
    const goals = {revenge: clamp(.2 + D.revengePerLoss.value * h.wins + D.swaggerPerWin.value * h.losses),
        mercy: clamp(.6 - D.mercyPerLoss.value * h.wins - D.swaggerPerWin.value * h.losses)};
    return {body: real, goals, perceptionBonus: Math.min(D.studyCap.value, D.studyPerDuel.value * h.duels)};
}
