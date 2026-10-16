// Pure opt-in check proposals. The caller atomically installs costs + receipt.
import {address, drawU32, hash64, compareCodePoints} from './gen_kit.js';
import {CHECK_ENGINE, CHECK_BUDGET, shape, text, integer, checkDieFace, prepareCheck, scoreDice, chooseScore, applyCheckPolicy} from './check_contract.js';

function validateAddress(a) {
    address(a);
    shape(a, ['root', 'worldId', 'lifeId', 'gameTime', 'eventId'], ['root', 'worldId', 'lifeId', 'gameTime', 'eventId']);
    if (![a.worldId, a.lifeId, a.eventId].every(text) || !integer(a.gameTime, 0, Number.MAX_SAFE_INTEGER))
        throw TypeError('Draw address needs world, life, event and integer gameTime.');
    if (!integer(a.root, 0, 0xffffffff) && !text(a.root)) throw TypeError('Invalid draw root.');
}
// Reject the tiny incomplete tail of uint32 space, then use equal buckets.
// Uniform dice conditional on completion, rather than multiply-high's tiny bias.
// Exhaustion refuses before returning any cost proposal; no biased fallback.
function die(root, base, sides) {
    for (let attempt = 0; attempt < CHECK_BUDGET.attemptsPerDie; attempt++) {
        const key = address(base, {attempt}), draw = drawU32(root, key);
        const value = checkDieFace(draw, sides);
        if (value !== null) return {value, address: key, draw, attempt};
    }
    throw RangeError('Check draw budget exhausted; no result or spend committed.');
}
export function resolveCheck(profile, check, drawAddress) {
    const plan = prepareCheck(profile, check);
    validateAddress(drawAddress);
    const rolls = [];
    const roll = phase => {
        const candidates = Array.from({length: plan.mode === 'normal' ? 1 : 2}, (_, candidate) => {
            const dice = Array.from({length: profile.dice.count}, (_, slot) => die(drawAddress.root,
                address(CHECK_ENGINE, profile.id, profile.revision, check.id, drawAddress, {phase, candidate, slot}), profile.dice.sides));
            return {dice, score: scoreDice(profile, dice.map(d => d.value))};
        });
        const selected = chooseScore(profile, plan.mode, candidates.map(c => c.score));
        rolls.push({phase, mode: plan.mode, candidates, selected});
        return candidates[selected].score;
    };
    const first = plan.gate.met ? roll('initial') : null;
    // Fixed draw envelope: completion must not depend on whether a conditional
    // reroll triggers. Otherwise the retry cap would slightly bias completed
    // checks toward branches that require fewer dice. Receipts retain unused
    // prepared dice as author truth; only the policy can spend/use them.
    const hasReroll = plan.gate.met && plan.check.spends.some(s => s.modifier.kind === 'reroll');
    const prepared = hasReroll ? roll('reroll') : null;
    if (hasReroll) rolls[1].used = false;
    const settled = applyCheckPolicy(plan, first, () => { rolls[1].used = true; return prepared; });
    const top = settled.modifiers.map(m => ({id: m.id, weight: Math.abs(m.value ?? 1), reason: m.reason}))
        .sort((a, b) => b.weight - a.weight || compareCodePoints(a.id, b.id)).slice(0, 4);
    top.unshift({id: profile.id, weight: 1, reason: `${profile.family}: ${settled.result.degree}`});
    const receipt = {schema: 1, engine: CHECK_ENGINE, profileRef: `${profile.id}@${profile.revision}`,
        inputFingerprint: hash64(CHECK_ENGINE, address(plan.profile, plan.check, drawAddress)),
        profile: plan.profile, check: plan.check, drawAddress: structuredClone(drawAddress), dice: rolls,
        modifiers: settled.modifiers, spent: settled.spent, remaining: settled.remaining, result: settled.result,
        reasons: [...plan.gate.reasons], top};
    return {result: structuredClone(settled.result), resources: structuredClone(settled.remaining), receipt};
}
export function replayCheck(receipt) {
    if (receipt?.schema !== 1 || receipt.engine !== CHECK_ENGINE) throw TypeError('Unsupported check receipt.');
    const replay = resolveCheck(receipt.profile, receipt.check, receipt.drawAddress);
    if (address(replay.receipt) !== address(receipt)) throw Error('Check receipt replay mismatch.');
    return replay;
}
// For a decision made after seeing the roll. Existing die slots stay fixed.
// Call only on a pending receipt; install the new proposal once, never both.
export function spendAfterCheck(receipt, spend) {
    replayCheck(receipt);
    if (spend?.timing !== 'after') throw TypeError('Expected an after-roll spend.');
    return resolveCheck(receipt.profile, {...receipt.check, spends: [...receipt.check.spends, spend]}, receipt.drawAddress);
}
