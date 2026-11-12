// Proposal (AD32, PFP3/PFP22): compare supplied property capacities with a load.
// Fixture caller: tests/process_law.test.js; thresholds and property names are data.
import {check, object} from './basics.js';

export function applyLoad(thing, load, thresholds) {
    check(object(thing?.properties) && object(load) && object(thresholds), 'A load needs properties and threshold rows.');
    const capacities = {};
    for (const axis of ['force', 'shock']) {
        const row = thresholds[axis], demand = load[axis];
        check(object(row) && typeof row.property === 'string' && Number.isFinite(row.perUnit) && row.perUnit >= 0 &&
            Number.isFinite(demand) && demand >= 0, `Invalid ${axis} load or threshold.`);
        const value = thing.properties[row.property] ?? 0;
        check(Number.isFinite(value) && value >= 0, `Invalid capacity property ${row.property}.`);
        capacities[axis] = value * row.perUnit;
        check(Number.isFinite(capacities[axis]), `Invalid ${axis} capacity.`);
    }
    const bent = load.force > capacities.force, broke = load.shock > capacities.shock;
    return {held: !bent && !broke, bent, broke,
        cause: `Force ${load.force} against ${thresholds.force.property} capacity ${capacities.force}. ` +
            `Shock ${load.shock} against ${thresholds.shock.property} capacity ${capacities.shock}.`};
}
