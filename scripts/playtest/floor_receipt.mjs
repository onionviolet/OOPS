// Pure helpers for the scripted floor runner (scripts/playtest/floor_run.mjs): scenario
// validation, locator selectors and the receipt summary. No browser, so it is unit-testable.
const OPS = new Set(['nav', 'click', 'wait', 'expect', 'step', 'shot', 'roundtrip']);

/** Returns a list of problems; empty means the scenario is runnable. */
export function validateScenario(sc) {
    const bad = [];
    if(!sc || typeof sc !== 'object') return ['scenario is not an object'];
    if(!sc.name || typeof sc.name !== 'string') bad.push('missing name');
    if(!Array.isArray(sc.steps) || !sc.steps.length) return [...bad, 'steps must be a non-empty array'];
    sc.steps.forEach((s, i) => {
        if(!OPS.has(s?.op)) {bad.push(`step ${i}: unknown op ${JSON.stringify(s?.op)}`); return;}
        const target = ['selector', 'ref', 'text', 'textRe'].filter(k => s[k] !== undefined);
        if(s.op === 'nav' && !s.id) bad.push(`step ${i}: nav needs id`);
        if(s.op === 'click' && !target.length) bad.push(`step ${i}: click needs selector, ref, text or textRe`);
        if(s.op === 'expect' && !target.length) bad.push(`step ${i}: expect needs selector, ref, text or textRe`);
        if(s.op === 'step' && !(s.minutes > 0)) bad.push(`step ${i}: step needs minutes > 0`);
        if(s.op === 'wait' && s.ms === undefined && !target.length) bad.push(`step ${i}: wait needs ms or a target`);
        if(s.op === 'shot' && !/^[\w.-]+$/.test(s.name || '')) bad.push(`step ${i}: shot needs a filename-safe name`);
        if(s.ref !== undefined && !/^[\w-]+=.+$/.test(s.ref)) bad.push(`step ${i}: ref must look like key=value`);
    });
    return bad;
}

/** ref "lotm=enroll" means data-lotm="enroll". */
export function refSelector(ref) {
    const [k, ...rest] = ref.split('=');
    return `[data-${k}="${rest.join('=').replace(/"/g, '\\"')}"]`;
}

/** Builds the receipt from raw run data. ok means every step passed, no page errors, and the roundtrip (if run) matched. */
export function summarizeReceipt({scenario, bundle, viewport = '1920x1080', steps, errors = [], roundtrip = null, evidence = null}) {
    const passed = steps.filter(s => s.ok).length;
    const roundtripOk = roundtrip ? roundtrip.reload === true && roundtrip.import === true && roundtrip.export === true : null;
    return {
        scenario, bundle, viewport, evidence,
        stepsPassed: passed, stepsTotal: steps.length,
        errors, roundtrip, steps,
        ok: steps.length > 0 && passed === steps.length && errors.length === 0 && roundtripOk !== false,
    };
}

/** One-line verdict for logs and handoffs; sealed text never appears because steps carry only ops and ok flags. */
export function receiptLine(r) {
    const rt = r.roundtrip ? ` roundtrip ${r.roundtrip.reload && r.roundtrip.export && r.roundtrip.import ? 'ok' : 'FAILED'}` : '';
    const failed = r.steps.find(s => !s.ok);
    return `${r.ok ? 'PASS' : 'FAIL'} ${r.scenario} bundle ${r.bundle} steps ${r.stepsPassed}/${r.stepsTotal} errors ${r.errors.length}${rt}` +
        (failed ? ` first failure step ${failed.i} (${failed.op}): ${failed.error}` : '');
}
