// Interrupted-operation record (audit M3, detail pass J9/CW14). Leaf.
// Default: an interruption names where it stopped, whether anything was
// partly done, what is kept and who is told. Dial: a world sets what counts as
// kept and who hears; "none" is a valid partialEffect. Reason: a stopped
// operation leaves a trace that later play can read, instead of vanishing.
// wait_until.js and agreed_duty_continuation.js could adopt the builder later.
export function validateInterruptedOperation(r) {
    const errors = [];
    if (!r || typeof r !== 'object') return ['record must be an object'];
    if (!r.operation || typeof r.operation !== 'string') errors.push('operation is required');
    if (!r.stopPoint || typeof r.stopPoint !== 'string') errors.push('stopPoint is required');
    if (typeof r.partialEffect !== 'string') errors.push('partialEffect must be a string ("none" for nothing)');
    for (const k of ['kept', 'toldTo'])
        if (!Array.isArray(r[k]) || r[k].some(x => typeof x !== 'string' || !x)) errors.push(`${k} must be a list`);
    if (typeof r.reason !== 'string') errors.push('reason must be a string');
    return errors;
}

export function interruptedOperation({operation, stopPoint, partialEffect = 'none', kept = [], toldTo = [], reason = ''}) {
    const r = {operation, stopPoint, partialEffect, kept: [...kept], toldTo: [...toldTo], reason};
    const errors = validateInterruptedOperation(r);
    if (errors.length) throw new Error(`Invalid interrupted operation: ${errors.join('; ')}`);
    return r;
}
