// ORIGINAL staged-process kinetics, distinct from craft_resolver summed heat and
// per-operation availability. Integration owns custody, vessel facts and debits.
export const THERMAL_REVISION = 'original.process.thermal@1';
const fail = message => { throw new Error(message); };
const finite = (n, name, min = 0) => {
    if (!Number.isFinite(n) || n < min) fail(`Invalid ${name}.`);
    return n;
};
const positive = (n, name) => { finite(n, name); if (!n) fail(`Invalid ${name}.`); return n; };

function apparatus(view) {
    positive(view.capacity, 'vessel capacity');
    if (view.surfaceArea !== undefined) positive(view.surfaceArea, 'vessel surface area');
    positive(view.heatTransfer, 'vessel heat transfer');
    finite(view.thermalMass, 'vessel thermal mass');
    finite(view.containment ?? 0, 'vessel containment');
    return view;
}
function lawCheck(law) {
    if (law.revision !== THERMAL_REVISION) fail('Unsupported thermal revision.');
    finite(law.ambient, 'ambient', -273);
    if (law.extraction.min >= law.extraction.max) fail('Invalid extraction window.');
    finite(law.extraction.min, 'extraction minimum', -273);
    finite(law.extraction.max, 'extraction maximum', -273);
    finite(law.degradation.above, 'degradation threshold', -273);
    positive(law.extraction.seconds, 'extraction time');
    positive(law.degradation.seconds, 'degradation time');
    return law;
}

/** Shared vessel view is borrowed, never stored or mutated here. Units are authored
 * volume, mass, heat capacity, area, energy and game seconds, not real chemistry. */
export function quoteThermalBatch({law, vessel, load, maker, program}) {
    lawCheck(law); apparatus(vessel);
    const mass = positive(load.mass, 'batch mass'), volume = positive(load.volume, 'batch volume');
    const specificHeat = positive(load.specificHeat, 'batch specific heat');
    const hold = finite(program.holdSeconds, 'hold duration');
    const start = finite(program.startTemperature ?? law.ambient, 'start temperature', -273);
    const target = finite(program.targetTemperature, 'target temperature', -273);
    const source = finite(program.sourceTemperature, 'source temperature', -273);
    const containment = finite(load.containment ?? 0, 'required containment');
    const reasons = [];
    if (volume > vessel.capacity) reasons.push('Batch exceeds vessel capacity.');
    if (containment > (vessel.containment ?? 0)) reasons.push('Vessel cannot contain this process.');
    if (load.requiredClosure && load.requiredClosure !== vessel.closure) reasons.push('Vessel closure cannot support this process.');
    const heatCapacity = vessel.thermalMass + mass * specificHeat;
    // Explicit area permits differently shaped vessels. Legacy apparatus without
    // area uses ORIGINAL similar-shape geometry derived from actual capacity.
    const surfaceArea = vessel.surfaceArea ?? Math.cbrt(vessel.capacity) ** 2;
    const conductance = surfaceArea * vessel.heatTransfer;
    const rate = conductance / heatCapacity;
    if (!(source > target && target > start)) reasons.push('Heating source cannot reach the requested target.');
    const warmSeconds = source > target && target > start ? Math.log((source - start) / (source - target)) / rate : 0;
    // Burner maintains its declared source temperature; larger loads warm longer.
    const durationSeconds = warmSeconds + hold;
    const burnRate = positive(maker.heater.fuelPerSecond, 'heater fuel burn rate');
    if (source > finite(maker.heater.maxTemperature, 'heater maximum temperature', -273)) reasons.push('Heating source exceeds available tool capability.');
    if (conductance > positive(maker.heater.maxConductance, 'heater transfer capacity')) reasons.push('Heater cannot support this vessel heat transfer.');
    const fuel = durationSeconds * burnRate;
    for (const [name, value] of Object.entries({heatCapacity, conductance, rate, warmSeconds, durationSeconds, fuel})) finite(value, name);
    positive(rate, 'thermal rate');
    const agitationWork = mass * finite(program.agitationPerMass ?? 0, 'agitation demand');
    const workCapacity = finite(maker.workCapacity, 'maker work capacity');
    const competence = finite(maker.competence, 'maker competence');
    const required = finite(program.requiredCompetence ?? 0, 'required competence');
    if (competence < required) reasons.push('Maker lacks the required thermal control.');
    if (agitationWork > workCapacity) reasons.push('Agitation workload exceeds available maker capacity.');
    if (!(maker.tools ?? []).includes(program.heaterTool)) reasons.push('Required heating tool is unavailable.');
    if (!(maker.tools ?? []).includes(program.agitationTool) && agitationWork > 0) reasons.push('Required agitation tool is unavailable.');
    if (finite(maker.fuelStock, 'fuel stock') < fuel) reasons.push('Insufficient fuel stock.');
    // Same quote for quick/guided/deep, player/helper. Caller identity grants nothing.
    return {ok: reasons.length === 0, reasons, revision: law.revision,
        mass, volume, heatCapacity, surfaceArea, conductance, rate, warmSeconds, durationSeconds,
        costs: {fuel, agitationWork}, sourceTemperature: source, startTemperature: start,
        burnSeconds: durationSeconds, fuelPerSecond: burnRate};
}

/** Time inside a threshold window along a monotone exponential temperature curve. */
function above(start, source, rate, seconds, threshold) {
    if (!seconds) return 0;
    const end = source + (start - source) * Math.exp(-rate * seconds);
    if (Math.min(start, end) >= threshold) return seconds;
    if (Math.max(start, end) <= threshold) return 0;
    const crossing = Math.log((start - source) / (threshold - source)) / rate;
    return end > start ? seconds - crossing : crossing;
}
function trajectory(law, start, source, rate, seconds) {
    return {temperature: source + (start - source) * Math.exp(-rate * seconds),
        extractionSeconds: above(start, source, rate, seconds, law.extraction.min) - above(start, source, rate, seconds, law.extraction.max),
        degradationSeconds: above(start, source, rate, seconds, law.degradation.above)};
}

export function createThermalState(law, quote, {fuel = quote.costs.fuel} = {}) {
    lawCheck(law);
    if (!quote.ok || quote.revision !== law.revision) fail('Thermal admission refused.');
    finite(fuel, 'committed fuel');
    if (fuel > quote.costs.fuel) fail('Committed fuel exceeds quote.');
    return {revision: law.revision, elapsedSeconds: 0, temperature: quote.startTemperature,
        extractionSeconds: 0, degradationSeconds: 0, fuelSpent: 0,
        segment: {at: 0, temperature: quote.startTemperature, extractionSeconds: 0, degradationSeconds: 0,
            fuelSpent: 0, rate: quote.rate, source: quote.sourceTemperature,
            fuelPerSecond: quote.fuelPerSecond, burnSeconds: fuel / quote.fuelPerSecond}};
}

/** Recompute from the last intervention anchor, never integrate tick approximations.
 * Fuel exhausts at a finite boundary even if the clock settles a long absence. */
export function advanceThermal(law, state, elapsedSeconds) {
    lawCheck(law);
    if (state.revision !== law.revision) fail('Unsupported thermal state revision.');
    finite(elapsedSeconds, 'elapsed time');
    validateThermalState(state);
    const s = state.segment, time = state.elapsedSeconds + elapsedSeconds - s.at;
    const burning = Math.min(time, s.burnSeconds);
    const hot = trajectory(law, s.temperature, s.source, s.rate, burning);
    const cool = trajectory(law, hot.temperature, law.ambient, s.rate, time - burning);
    return {...state, elapsedSeconds: state.elapsedSeconds + elapsedSeconds,
        temperature: cool.temperature,
        extractionSeconds: s.extractionSeconds + hot.extractionSeconds + cool.extractionSeconds,
        degradationSeconds: s.degradationSeconds + hot.degradationSeconds + cool.degradationSeconds,
        fuelSpent: s.fuelSpent + burning * s.fuelPerSecond};
}

/** Extinguish/cool retains all irreversible residence and spent fuel. Unburned
 * fuel remains custody-owned; this function neither refunds nor mints it. */
export function stopThermal(law, state) {
    const settled = advanceThermal(law, state, 0);
    return {...settled, segment: {at: settled.elapsedSeconds, temperature: settled.temperature,
        extractionSeconds: settled.extractionSeconds, degradationSeconds: settled.degradationSeconds,
        fuelSpent: settled.fuelSpent, rate: settled.segment.rate, source: law.ambient,
        fuelPerSecond: settled.segment.fuelPerSecond, burnSeconds: 0}};
}

/** Consumer adapter partitions an integer active pool without deleting mass.
 * 'unextracted' and 'degraded' must go to residue/waste in the owning process. */
export function thermalYield(law, state, activeAmount, admission = {extractionSeconds: 0, degradationSeconds: 0}) {
    lawCheck(law);
    validateThermalState(state);
    if (!Number.isSafeInteger(activeAmount) || activeAmount < 0) fail('Invalid active amount.');
    for (const k of ['extractionSeconds', 'degradationSeconds']) {
        finite(admission[k], `admission ${k}`);
        if (admission[k] > state[k]) fail('Admission residence is ahead of process.');
    }
    // Integration stores these baselines per actually admitted portion. Late
    // additions cannot receive the residence of earlier material.
    const extracted = Math.floor(activeAmount * -Math.expm1(-(state.extractionSeconds - admission.extractionSeconds) / law.extraction.seconds));
    const usable = Math.floor(extracted * Math.exp(-(state.degradationSeconds - admission.degradationSeconds) / law.degradation.seconds));
    return {usable, degraded: extracted - usable, unextracted: activeAmount - extracted};
}

/** Reheating is a fresh admitted paid segment, preserving prior residence and
 * damage. Caller settles to its current clock before quoting at this temperature. */
export function resumeThermal(law, state, quote, options) {
    const settled = advanceThermal(law, state, 0);
    if (quote.startTemperature !== settled.temperature) fail('Stale thermal start temperature.');
    const fresh = createThermalState(law, quote, options);
    return {...settled, segment: {...fresh.segment, at: settled.elapsedSeconds,
        extractionSeconds: settled.extractionSeconds, degradationSeconds: settled.degradationSeconds,
        fuelSpent: settled.fuelSpent}};
}

/** Structural save validation for this revision. Custody validates apparatus,
 * inventory, active law identity and clock reference outside this leaf. */
export function validateThermalState(state) {
    if (state?.revision !== THERMAL_REVISION) fail('Unsupported thermal state revision.');
    for (const k of ['elapsedSeconds', 'extractionSeconds', 'degradationSeconds', 'fuelSpent']) finite(state[k], k);
    finite(state.temperature, 'temperature', -273);
    const s = state.segment;
    if (!s || s.at > state.elapsedSeconds) fail('Invalid thermal anchor.');
    for (const k of ['at', 'extractionSeconds', 'degradationSeconds', 'fuelSpent', 'burnSeconds']) finite(s[k], k);
    for (const k of ['temperature', 'source']) finite(s[k], k, -273);
    positive(s.rate, 'thermal rate'); positive(s.fuelPerSecond, 'fuel rate');
    if (state.extractionSeconds > state.elapsedSeconds || state.degradationSeconds > state.elapsedSeconds || s.extractionSeconds > s.at || s.degradationSeconds > s.at) fail('Thermal residence exceeds elapsed time.');
    if (s.extractionSeconds > state.extractionSeconds || s.degradationSeconds > state.degradationSeconds || s.fuelSpent > state.fuelSpent) fail('Invalid thermal history.');
    return state;
}
