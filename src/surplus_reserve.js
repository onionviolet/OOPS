export const villageReserve = {world:'base.frontier', installment:50, keep:100, exponent:0.08, strength:2};
export const emptyReserve = () => ({revision:1, life:'', paid:0});
export function readReserve(saved = emptyReserve()) {
    if (saved?.revision !== 1 || typeof saved.life !== 'string' || !Number.isSafeInteger(saved.paid) || saved.paid < 0 ||
        (saved.paid && !saved.life)) throw Error('Invalid recovery reserve.');
    return {...saved};
}
export function reserveBonus(rule, paid) {
    return rule.strength * (paid / rule.installment) ** rule.exponent;
}
export function quoteReserve(rule, saved, life, money) {
    const paid = saved.life === life ? saved.paid : 0;
    const next = {revision:1, life, paid:paid + rule.installment};
    const current = reserveBonus(rule, paid), after = reserveBonus(rule, next.paid);
    return {next, current, after, cost:rule.installment,
        reason:money - rule.installment < rule.keep ? `Keep at least ${rule.keep} coins available.` : null};
}
