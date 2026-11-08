// World-local proposal prices, not canon quantities. Canon gives qualitative
// effects in these early scenes; numeric anchors preserve the existing playable dials.
export const hpPowerPrices = Object.freeze({
    id: 'book.hp.lead.power_law', basis: 'assumed: first-year Charms gameplay calibration; canon gives no stamina or failure probability',
    prices: {cost: {magnitude: 1, range: 0.25, duration: 0.01, additionalTargets: 0.5}, failure: {'function.levitate': 0.6}, perMastery: {'function.levitate': 0.1}, strain: null},
    unknown: ['canon stamina cost', 'canon failure probability', 'canon strain'],
    cost: values => values.cost > 0 ? [{type: 'vital', key: 'stamina', amount: -Math.ceil(values.cost)}] : []
});
export const lotmPowerPrices = Object.freeze({
    id: 'book.lotm.be.power_law', basis: 'assumed: existing Seer pool output and strain dials; canon gives no numeric spirituality charge',
    prices: {cost: {'function.open_vision': 1}, control: {'function.open_vision': 1}, failure: null, perMastery: null, strain: {'function.open_vision': 1}},
    unknown: ['canon spirituality amount', 'canon failure probability', 'canon strain amount', 'canon held-vision duration']
});
export const HP_LEVITATION_PARTS = Object.freeze({functions: ['levitate'], magnitude: 1, range: 0, duration: 0, targets: 1, tier: 1});
export const LOTM_SPIRIT_VISION_PARTS = Object.freeze({functions: ['open_vision'], magnitude: 1, range: 0, duration: 60, targets: 1, tier: 9});
export const POWER_CALIBRATION_ANCHORS = Object.freeze({
    hp: [{id: 'first_year_levitation', parts: HP_LEVITATION_PARTS, observed: {cost: 1, failure: 0.6, perMastery: 0.1, strain: null}, basis: 'gameplay dial', locator: 'src/book_world_hp_lessons.js:HP_SPELL_ROWS; canon effect: first Charms lesson'}],
    lotm: [{id: 'seer_spirit_vision', parts: LOTM_SPIRIT_VISION_PARTS, observed: {cost: 1, control: 1, strain: 1, failure: null}, basis: 'gameplay dial', locator: 'src/book_world_lotm_be_seer.js:B1/B3; ch33 P034-P038 qualitative use and exhaustion'}]
});
