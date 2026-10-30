// Backing out of a tempo fight is an attempt with a price (LSD368, revising LSD345): the other side may refuse by its
// own goals, a failed try costs a free blow, and a clean exit can still leave an ally behind, a grudge, or a follower.
// Chances are keyed draws on real factors; numbers are defaults with a dial and an in-world reason.
export const EXIT_DIALS = {
    leaveBase: {value: .55, why: 'Walking away from an even match works a little more often than not.'},
    leaveSpeed: {value: .4, why: 'Being quicker than the fastest pursuer is the main thing that lets someone slip away.'},
    leaveTired: {value: .15, why: 'A winded fighter cannot break away cleanly.'},
    leaveDark: {value: .1, why: 'Darkness helps someone disappear.'},
    leaveBadFooting: {value: .1, why: 'Bad footing slows a turn and a run alike.'},
    leaveResolve: {value: .3, why: 'A foe set on revenge stays on the heels of whoever leaves.'},
    turnPenalty: {value: 4, why: 'Turning your back costs a few moments; the foe gets a free blow in that time.'},
    yieldBase: {value: .4, why: 'Most people will take a surrender if nothing drives them past it.'},
    yieldMercy: {value: .5, why: 'A merciful foe takes the offer.'},
    yieldRevenge: {value: .5, why: 'A foe with a grudge or a bounty refuses.'},
    followRevenge: {value: .5, why: 'Only someone with a reason follows a fighter home.'},
    defaultGoals: {value: {revenge: .2, mercy: .6}, why: 'An ordinary stranger: not out for blood, willing to stop a fight.'}
};
const clamp = (n, lo = .05, hi = .95) => Math.min(hi, Math.max(lo, n));
const goalsOf = f => ({...EXIT_DIALS.defaultGoals.value, ...(f.goals || {})});
const rivals = (b, f) => Object.entries(b.fighters).filter(([, x]) => x.side !== f.side && x.status === 'active');

// The chance a fighter's try to leave succeeds: their speed against the fastest rival, tiredness, light and footing, and rival resolve.
export function leaveChance(b, f, speedOf) {
    const D = EXIT_DIALS, foes = rivals(b, f);
    if(!foes.length) return 1;
    const mine = f.speed * speedOf(f), theirs = Math.max(...foes.map(([, x]) => x.speed * speedOf(x)));
    const resolve = Math.max(...foes.map(([, x]) => goalsOf(x).revenge));
    return clamp(D.leaveBase.value + D.leaveSpeed.value * (mine / theirs - 1) - (f.stamina / Math.max(1, f.maxStamina) < .25 ? D.leaveTired.value : 0) +
        (b.conditions.light === 'dark' ? D.leaveDark.value : 0) - (b.conditions.footing === 'bad' ? D.leaveBadFooting.value : 0) - D.leaveResolve.value * resolve);
}
// The chance the other side takes a surrender, by the goals of whoever is hardest to satisfy.
export function yieldChance(b, f) {
    const D = EXIT_DIALS, foes = rivals(b, f);
    if(!foes.length) return 1;
    return clamp(D.yieldBase.value + D.yieldMercy.value * Math.min(...foes.map(([, x]) => goalsOf(x).mercy)) - D.yieldRevenge.value * Math.max(...foes.map(([, x]) => goalsOf(x).revenge)));
}
// Who follows a clean exit: each rival with a reason, by a keyed draw.
export function followers(b, f, draw) {
    return rivals(b, f).filter(([id, x]) => draw(b, 'follow', id, {leaver: f.name}) < goalsOf(x).revenge * EXIT_DIALS.followRevenge.value * 2).map(([id]) => id);
}
export const validateGoals = g => g === undefined || (g && typeof g === 'object' && ['revenge', 'mercy'].every(k => g[k] === undefined || (Number.isFinite(g[k]) && g[k] >= 0 && g[k] <= 1)));
export function validateExit(e) {
    return e === undefined || (e && typeof e === 'object' && ['withdrawn', 'yielded'].includes(e.kind) && Array.isArray(e.followedBy) && e.followedBy.every(id => typeof id === 'string') &&
        Array.isArray(e.leftBehind) && e.leftBehind.every(id => typeof id === 'string'));
}
