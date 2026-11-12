// X v0 (GL4, PG3, MD2). The caller supplies a defined region, its world
// instance, and evidence scoped to one adjacent plot at a fixed place.
import {check} from './basics.js';
import {address, drawU32, hash64, indexFromU32} from './gen_kit.js';
import {WORLD_QUANTITIES} from './world_quantities.js';

const GENERATOR = 'x.procedural_places';
const REVISION = 0;
const text = value => typeof value === 'string' && value.trim().length > 0;

/**
 * One plot per anchor, one holder and at most one draw per call. The host
 * chooses when to call. Terrain accepts one reading or two corroborating
 * readings; a different reading alongside wet soil leaves it ineligible.
 * `residue` gives the W account key and an inclusive prior-deposit range.
 * The receipt is engine truth stored in W holder state. Observation and
 * route authoring belong to the caller.
 */
export function generateWetField({root, region, instance, anchorId, evidence}) {
    const skip = reason => ({value: null, receipt: {generator: GENERATOR, revision: REVISION, reason, draws: 0}});
    const anchor = region?.places?.find(place => place.id === anchorId);
    if (!anchor || !text(region.world) || !text(region.id) || !text(region.era) || !text(instance)) {
        return skip('unknown-context');
    }

    const terrain = evidence?.terrain;
    if (!Array.isArray(terrain) || !terrain.length || !text(evidence.source)) return skip('unknown-terrain');
    if (terrain.length > 2 || !Array.from(terrain).every(fact => fact === 'wet-soil')) {
        return skip('ineligible-terrain');
    }

    const scope = [region.world, instance, region.era, region.id, anchor.id, 'adjacent-field'];
    // Identity belongs to the plot, even when the generation revision changes.
    const {hi, lo} = hash64(GENERATOR, address(...scope));
    const id = `x.field.${hi.toString(16).padStart(8, '0')}${lo.toString(16).padStart(8, '0')}`;
    if (region.places.some(place => place.id === id)) return skip('fixed-place');

    const {key, min, max} = evidence.residue ?? {};
    const family = WORLD_QUANTITIES.residue;
    check(typeof key === 'string' && /^[a-z0-9][a-z0-9_.-]*$/i.test(key) &&
        Number.isSafeInteger(min) && Number.isSafeInteger(max) &&
        min >= family.min && max <= family.max && min <= max, 'Invalid wet field residue range.');

    const drawAddress = address(GENERATOR, REVISION, ...scope, 'initial-residue', key);
    const amount = min + indexFromU32(drawU32(root, drawAddress), max - min + 1);
    const receipt = {
        generator: GENERATOR, revision: REVISION, address: drawAddress, draws: 1,
        cause: 'wet-soil', source: evidence.source,
    };
    return {
        value: {
            id, kind: 'place', quantities: {[`${family.id}:${key}`]: amount},
            state: {[GENERATOR]: receipt},
        },
        receipt,
    };
}
