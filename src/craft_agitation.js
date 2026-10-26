// PC15–PC16: ORIGINAL causal agitation, a pure leaf for the staged craft owner.
// Fractions are material truth, not observer knowledge. No inventory, clock or
// random draw lives here. Heat is work delivered, never a second temperature.
const fail = message => { throw new Error(`Agitation: ${message}`); };
const finite = (n, label, min = 0) => {
    if(!Number.isFinite(n) || n < min) fail(`${label} must be finite and >= ${min}.`);
    return n;
};
const positive = (n, label) => { finite(n, label); if(n === 0) fail(`${label} must be positive.`); return n; };
const fraction = (n, label) => { finite(n, label); if(n > 1) fail(`${label} must be <= 1.`); return n; };
const cap = n => Math.max(0, Math.min(1, n));
const fields = ['work', 'homogeneity', 'suspension', 'contact', 'air', 'foam', 'damage', 'heatWork', 'orientedWork'];
const fractions = ['homogeneity', 'suspension', 'contact', 'air', 'foam', 'damage'];
const motions = ['clockwise', 'counterclockwise', 'alternating'];

// Authored pilot values, not physical units or medical/process guidance.
export const frontierAgitationLaw = {
    id: 'frontier.agitation', revision: 1, status: 'ORIGINAL',
    locator: 'PC15–PC16 original Frontier process pilot',
    mixWork: 8, suspensionWork: 5, contactWork: 12, settlePerSecond: 0.005,
    fragileShear: 0.012, foamPerAir: 0.5,
    verbs: {
        stir: {tool: 'paddle', rate: 1, minViscosity: 0, maxViscosity: 20, shear: 1, air: 0.006, heat: 0.02},
        whisk: {tool: 'whisk', rate: 1.5, minViscosity: 0, maxViscosity: 5, shear: 2, air: 0.04, heat: 0.025},
        knead: {tool: 'kneader', rate: 0.7, minViscosity: 4, maxViscosity: 100, shear: 0.5, air: 0.001, heat: 0.03},
        circulate: {tool: 'pump', rate: 1.2, minViscosity: 0, maxViscosity: 12, shear: 0.6, air: 0.001, heat: 0.015},
        agitate: {tool: 'shaker', rate: 0.8, minViscosity: 0, maxViscosity: 15, shear: 1.5, air: 0.02, heat: 0.02},
    },
};

function validateLaw(law) {
    if(!law?.id || !Number.isSafeInteger(law.revision) || law.revision < 1 || !law.locator ||
        !['ORIGINAL', 'SHOWN', 'STATED', 'INFERRED', 'GENERATED'].includes(law.status)) fail('law identity/source required.');
    for(const k of ['mixWork', 'suspensionWork', 'contactWork']) positive(law[k], k);
    for(const k of ['settlePerSecond', 'fragileShear', 'foamPerAir']) finite(law[k], k);
    if(!law.verbs || !Object.keys(law.verbs).length) fail('law needs verbs.');
    for(const [verb, p] of Object.entries(law.verbs)) {
        if(!['stir', 'whisk', 'knead', 'circulate', 'agitate'].includes(verb) || !p.tool) fail('unsupported verb/tool.');
        positive(p.rate, 'rate');
        for(const k of ['minViscosity', 'maxViscosity', 'shear', 'air', 'heat']) finite(p[k], k);
        if(p.minViscosity > p.maxViscosity) fail('viscosity interval is reversed.');
    }
    if(law.orientation) {
        const o = law.orientation;
        if(!['clockwise', 'counterclockwise'].includes(o.direction) || !o.mechanism || !o.locator) fail('oriented law requires mechanism and locator.');
        positive(o.targetWork, 'orientation target');
        positive(o.energyPerWork, 'orientation energy cost');
    }
    if(law.rhythm) {
        if(!law.rhythm.mechanism || !law.rhythm.locator) fail('rhythm requires mechanism and locator.');
        positive(law.rhythm.pulsedEfficiency, 'pulsed efficiency');
    }
    return law;
}

export function createAgitationState(law) {
    validateLaw(law);
    return {law: law.id, revision: law.revision, ...Object.fromEntries(fields.map(k => [k, 0]))};
}
export function validateAgitationState(law, state) {
    validateLaw(law);
    if(state?.law !== law.id || state.revision !== law.revision) fail('unsupported retained law revision.');
    for(const k of fields) fractions.includes(k) ? fraction(state[k], k) :
        k === 'orientedWork' ? (Number.isFinite(state[k]) || fail('orientedWork must be finite.')) : finite(state[k], k);
    return state;
}
function validateBatch(batch) {
    positive(batch?.mass, 'batch mass');
    finite(batch.viscosity, 'viscosity');
    fraction(batch.fragility, 'fragility');
}

// Quote is a pure calculation. Integration re-quotes at commit and debits all
// costs atomically. Seconds × rate represents motion count, not UI click count.
export function quoteAgitation(law, state, batch, action, means) {
    validateAgitationState(law, state); validateBatch(batch);
    const p = law.verbs[action?.verb];
    if(!p) fail('verb has no material-law reader.');
    positive(action.seconds, 'seconds');
    if(!['gentle', 'vigorous'].includes(action.intensity) || !motions.includes(action.direction) ||
        !['steady', 'pulsed'].includes(action.rhythm)) fail('unsupported motion.');
    if(!means?.tools?.includes(p.tool)) fail(`requires ${p.tool}.`);
    if(!['manual', 'powered'].includes(means.drive)) fail('drive required.');
    for(const k of ['stamina', 'energy', 'toolCondition']) finite(means[k], k);
    positive(means.maxLoad, 'tool load');
    positive(means.reach, 'vessel geometry reach');
    if(means.reach > 1) fail('reach exceeds full coverage.');
    if(batch.mass > means.maxLoad) fail('batch exceeds tool load.');
    if(batch.viscosity < p.minViscosity || batch.viscosity > p.maxViscosity) fail('viscosity outside tool working range.');
    const force = action.intensity === 'vigorous' ? 3 : 1;
    const strokes = action.strokes ?? action.seconds * p.rate;
    positive(strokes, 'motion count');
    if(strokes > action.seconds * p.rate) fail('motion count exceeds tool cadence.');
    const rawWork = strokes * force;
    const rhythm = action.rhythm === 'pulsed' && law.rhythm ? law.rhythm.pulsedEfficiency : 1;
    const effectiveWork = rawWork * means.reach * rhythm / (batch.mass * (1 + batch.viscosity / 10));
    const costs = {
        laborSeconds: means.drive === 'manual' ? action.seconds : 0,
        stamina: means.drive === 'manual' ? rawWork * (1 + batch.viscosity / 10) : 0,
        energy: (means.drive === 'powered' ? rawWork : 0) + (law.orientation ? rawWork * law.orientation.energyPerWork : 0),
        toolWear: rawWork * (1 + batch.viscosity / 10) * 0.001,
    };
    for(const [k, v] of Object.entries(costs)) finite(v, k);
    positive(effectiveWork, 'effective work');
    if(costs.stamina > means.stamina) fail('insufficient stamina.');
    if(costs.energy > means.energy) fail('insufficient power.');
    if(costs.toolWear > means.toolCondition) fail('tool would fail under this workload.');
    return {costs, rawWork, effectiveWork};
}

export function applyAgitation(law, state, batch, action, means) {
    const quote = quoteAgitation(law, state, batch, action, means);
    const {rawWork, effectiveWork: work} = quote;
    const p = law.verbs[action.verb];
    const shear = action.intensity === 'vigorous' ? 3 : 1;
    const air = work * p.air;
    const sign = !law.orientation || action.direction === 'alternating' ? 0 :
        action.direction === law.orientation.direction ? 1 : -1;
    const next = {...state,
        work: state.work + rawWork,
        homogeneity: cap(state.homogeneity + work / law.mixWork),
        suspension: cap(state.suspension + work / law.suspensionWork),
        contact: cap(state.contact + work / law.contactWork),
        air: cap(state.air + air), foam: cap(state.foam + air * law.foamPerAir),
        damage: cap(state.damage + work * p.shear * shear * batch.fragility * law.fragileShear),
        heatWork: state.heatWork + rawWork * p.heat,
        orientedWork: state.orientedWork + sign * work,
    };
    validateAgitationState(law, next);
    return {state: next, costs: quote.costs};
}

// Passive settling is called with elapsed game seconds by the sole clock owner.
// No new homogeneity/contact is granted by waiting. Damaged material stays damaged.
export function settleAgitation(law, state, batch, seconds) {
    validateAgitationState(law, state); validateBatch(batch); finite(seconds, 'seconds');
    return {...state, suspension: cap(state.suspension - seconds * law.settlePerSecond / (1 + batch.viscosity))};
}

// An admission boundary averages concentration-like facts by mass. New inputs
// start unmixed, without inheriting earlier work. Integration owns actual mass.
export function admitAgitation(law, state, priorMass, addedMass) {
    validateAgitationState(law, state);
    positive(priorMass, 'prior mass'); positive(addedMass, 'added mass');
    const share = priorMass / positive(priorMass + addedMass, 'combined mass');
    return {...state, ...Object.fromEntries([...fractions, 'orientedWork'].map(k => [k, state[k] * share]))};
}

// Truth readers for product/extraction adapters. They must pass through the
// existing observer projection before appearing in player-facing UI.
export function agitationEffect(law, state) {
    validateAgitationState(law, state);
    return {contact: state.contact * (1 - state.damage),
        uniformity: state.homogeneity * state.suspension,
        intact: 1 - state.damage,
        orientedFlow: law.orientation ? cap(state.orientedWork / law.orientation.targetWork) * (1 - state.damage) : 0};
}
