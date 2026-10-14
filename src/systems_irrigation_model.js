// Original bounded proposal. These numbers describe a model, never native stock.
const TICKS = 6;
const BED_COUNT = 3;

function simulate(layout, inlet) {
    const water = [0, 0, 0];
    for (let tick = 0; tick < TICKS; tick++) {
        if (layout === 'straight') {
            let remaining = inlet;
            for (let bed = 0; bed < BED_COUNT; bed++) {
                const delivered = Math.min(2, remaining);
                water[bed] += delivered;
                remaining -= delivered;
            }
        } else {
            for (let unit = 0; unit < inlet; unit++) {
                water[(tick * inlet + unit) % BED_COUNT]++;
            }
        }
    }
    const beds = water.map((received, index) => ({
        bed: index + 1,
        water: received,
        usableWater: Math.min(6, received),
        excessWater: Math.max(0, received - 6),
        harvest: Math.max(0, Math.min(6, received) - 3),
    }));
    return {
        ticks: TICKS,
        suppliedWater: TICKS * inlet,
        beds,
        usableWater: beds.reduce((sum, bed) => sum + bed.usableWater, 0),
        excessWater: beds.reduce((sum, bed) => sum + bed.excessWater, 0),
        harvest: beds.reduce((sum, bed) => sum + bed.harvest, 0),
        harvestingBeds: beds.filter(bed => bed.harvest > 0).length,
    };
}

/**
 * Six synchronous ticks over three numeric beds; no RNG, world actors or timers.
 * inlet is represented water per tick. Straight beds take up to two units each,
 * upstream first; branching shares units round-robin. A bed needs four water
 * before yielding, yields one per additional unit and saturates at six water.
 * Exported knowledge is a recommendation under these assumptions, not a claim
 * that a real field or inhabited pocket world has been created or improved.
 */
export function runIrrigationModel(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
        throw new TypeError('Irrigation configuration must be an object.');
    }
    const { layout, inlet } = config;
    if (layout !== 'straight' && layout !== 'branched') {
        throw new RangeError('Irrigation layout must be straight or branched.');
    }
    if (!Number.isInteger(inlet) || inlet < 1 || inlet > 3) {
        throw new RangeError('Irrigation inlet must be an integer from 1 to 3.');
    }
    const straight = simulate('straight', inlet);
    const branched = simulate('branched', inlet);
    const recommendedLayout = branched.harvest > straight.harvest ||
        (branched.harvest === straight.harvest &&
         branched.harvestingBeds > straight.harvestingBeds) ? 'branched' : 'straight';
    return {
        schema: 1,
        modelVersion: 'irrigation-represented-v1',
        representedOnly: true,
        config: { layout, inlet },
        output: layout === 'straight' ? straight : branched,
        knowledge: {
            id: `irrigation-represented-v1:inlet-${inlet}`,
            recommendedLayout,
            inlet,
            comparison: {
                straightHarvest: straight.harvest,
                branchedHarvest: branched.harvest,
            },
            basis: 'Maximum represented harvest; ties favor more harvesting beds.',
            limitation: 'Three numeric beds over six ticks; real soil, weather, inhabitants and native goods are not modeled.',
        },
    };
}
