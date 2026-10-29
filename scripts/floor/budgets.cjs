'use strict';

function budgetViolations(receipt, budgets) {
    return Object.entries(budgets || {}).flatMap(([metric, maximum]) => {
        const actual = receipt?.[metric];
        if (typeof maximum !== 'number' || !Number.isFinite(maximum)) throw new TypeError(`Budget ${metric} must be a finite number`);
        if (typeof actual !== 'number' || !Number.isFinite(actual)) return [`${metric}: receipt value is missing or not finite`];
        return actual > maximum ? [`${metric}: ${actual} exceeds budget ${maximum}`] : [];
    });
}

module.exports = {budgetViolations};
