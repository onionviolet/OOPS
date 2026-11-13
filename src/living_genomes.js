// Genome rows (GN1, foundation chat L, 2026-11-12; proposal under AD56). Each row is
// world-pack data that heredity.js runs; a kind row names its genome by id. Village
// rows are original. The person genome is lineage_traits.js's own four loci and dials,
// so the household line and the lifecycle share one model (OA5). Numbers are dials.
import {LINEAGE_PROFILES, LOCI} from './lineage_traits.js';
import {validateGenome} from './heredity.js';

const fromLineage = (id, profileId) => {
    const dials = LINEAGE_PROFILES[profileId];
    return {id, family: 'human', mutation: Math.round(dials.mutation * 1000), fickle: Math.round(dials.fickle * 1000),
        mutagens: {}, loci: Object.fromEntries(Object.entries(LOCI).map(([locus, def]) => [locus,
            {mode: def.mode, strong: def.strong, plain: def.plain, ...(def.fickle ? {fickle: true} : {}), affects: def.label}])),
        spread: {heightCm: [150, 190]}, polygenic: {}};
};

export const LIVING_GENOMES = Object.freeze(Object.fromEntries([
    fromLineage('person.household', 'household'),
    {id: 'village.sheep', family: 'ovine', mutation: 8, fickle: 500,
        // A storm over the pen during a brood raises the chance of a changed lamb (GN4, FN5).
        mutagens: {lightning: 300},
        loci: {
            fleece: {mode: 'recessive', strong: 'F', plain: 'f', affects: 'fine wool', shows: {mature: true}},
            coat: {mode: 'incomplete', strong: 'D', plain: 'd', affects: 'dark coat'},
            // A thick winter coat shows only where the cold calls for it (GN2: place).
            winter: {mode: 'dominant', strong: 'W', plain: 'w', affects: 'winter coat', shows: {needs: {quantity: 'cold', min: 1}}},
            vigor: {mode: 'dominant', strong: 'V', plain: 'v', affects: 'quick growth', shows: {suppressedBy: ['starved']}},
        },
        spread: {heightCm: [60, 75]},
        // IH1: wool per batch in tenths of a bundle; moderately heritable, as fleece weight is
        // in real flocks (a contrast, not a book fact). Ceiling 80 is the breed's limit (SB10).
        polygenic: {woolTenths: {mean: 50, sd: 8, heritability: 350, min: 20, max: 80}}},
    {id: 'village.rabbit', family: 'leporid', mutation: 10, fickle: 500, mutagens: {},
        loci: {agouti: {mode: 'dominant', strong: 'A', plain: 'a', affects: 'wild grey coat'},
            lop: {mode: 'recessive', strong: 'L', plain: 'l', affects: 'lop ears'}},
        spread: {weightG: [1200, 2000]}},
].map(row => [row.id, Object.freeze(validateGenome(row))])));

// Headless Village breeding trial. Phase, map and stat ranges are authored
// for a selectively bred line. Ordinary meadow stock keeps its existing row.
export const MEADOW_BREEDING_GENOME = Object.freeze(validateGenome({
    ...LIVING_GENOMES['village.sheep'],
    id: 'village.sheep.breeding-trial',
    mutation: 0,
    linkage: [{loci: ['coat', 'fleece'], crossovers: [0]}],
    ivs: {stats: ['woolYield', 'stamina', 'stride', 'recovery', 'foraging', 'surefootedness'], max: 31, inheritCount: 3},
    polygenic: {},
}));
