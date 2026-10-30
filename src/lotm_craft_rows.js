// Volume 1 craft source data (MR10/MR13, AR2/AR3, AD38, WPR5).
// S = shown, T = told, I = inferred/authored. Specific field paths override parents.
// Pure rows: owner-needed effects request integration, not inventory or gameplay changes.
// Locators cite extraction anchors; neighboring source paragraphs supply context.
const input = name => ({name, quantity: null, evidence: 'S'});
const step = (id, kind, text) => ({id, kind, text, minutes: null});
const pending = (owner, value) => ({type: 'owner-needed', owner, value});
const eligibility = (...pairs) => ({all: pairs.map(([name, reason]) => ({
    fact: `actor.lotm.craft.${name}`, op: 'eq', value: true, reason,
}))});
const proposals = [
    'Identifiers, English labels, eligibility predicates, grouping and owner bindings are authored proposals, not grants of starting knowledge or stock.',
    'Quantities, yields and execution durations remain null where unstated; no invented strength, success odds or recipe proportions.',
];
const evidence = {
    id: 'I', label: 'I', sourceIds: 'S', locators: 'S', eligibility: 'I',
    inputs: 'S', steps: 'S', 'steps.*.id': 'I', 'steps.*.kind': 'I',
    'steps.*.minutes': 'I', product: 'S', limits: 'I', effects: 'I', proposals: 'I',
};
const charmSourceIds = ['lotm.craft.charm-making', 'lotm.craft.charm-recharge'];
const charmInputs = () => [input('Semi-finished silver sheet'), input('Herbs for the corresponding ritual'), input('Natural minerals for the corresponding ritual')];
const charmEligibility = () => eligibility(
    ['ritual-charm-method', 'The lead learns charm-making and practices ritual-assisted inscription; this predicate describes that method, not every possible maker.'],
    ['spirituality-channeling', 'The maker channels spirituality during ritual work and again during activation.'],
);
const charmSteps = (shape, use) => [
    step('prepare', 'prepare', `Acquire the silver, herbs and mineral materials for the intended ritual; use a ${shape} silver piece for this demonstrated variant.`),
    step('inscribe', 'craft', 'Use ritual assistance to inscribe the corresponding words and symbols; the exact inscriptions and ritual recipe are not disclosed.'),
    step('activate', 'use', use),
];
const charmLimits = [
    'The charm burns during activation; a spent charm is distinct from an unused charm whose spirituality has faded.',
    'The shopping trip costs one pound and fifteen soli; the later average of six to eight soli per charm excludes labor. Neither establishes a fixed recipe price.',
    'Exact ingredient quantities, ritual instructions and effect duration are undisclosed.',
];
const recharge = () => ({
    mechanism: 'Low-grade charms lose spirituality over time; the account describes remaking them every two weeks and taking unused charms to Old Neil for recharging.',
    limits: 'The recharge procedure, material cost and restored charge are not stated; the two-week account is a maintenance interval, not a measured effect duration.',
});

export const LOTM_CRAFT_ROWS = {schema: 1, rows: [
    {
        id: 'lotm.craft.slumber-charm', label: 'Slumber charm',
        sourceIds: ['lotm.craft.slumber-charm', ...charmSourceIds],
        locators: ['zh 第127章 p27', 'zh 第127章 p30', 'zh 第128章 p70', 'zh 第133章 p17', 'zh 第133章 p47', 'zh 第198章 p3', 'zh 第198章 p15'],
        eligibility: charmEligibility(), inputs: charmInputs(),
        steps: charmSteps('rectangular', 'Speak the chosen short activation word, imbue the charm with spirituality and throw it toward the intended area; it burns to release its effect.'),
        product: {name: 'Inscribed rectangular silver slumber charm', mechanism: 'Activation releases a sleep-inducing calm around the burning charm. Exposure and the target\'s response vary the result: nearby allies and the user can fall asleep too, while the cited opponent begins recovering from sleep. Throwing it away from the user reduces exposure.'},
        recharge: recharge(), limits: [...charmLimits, 'The observed area includes part of a bedroom; it does not establish a numeric radius or guaranteed sleep duration.'],
        evidence: {...evidence, recharge: 'T', 'limits.0': 'S', 'limits.1': 'T', 'limits.3': 'S'},
        proposals: [...proposals],
        effects: [pending('inventory-consumption', 'Account for craft materials and the charm consumed by burning.'), pending('body-state', 'Resolve sleep for exposed targets, allies and user through their actual response.'), pending('item-charge', 'Resolve unused-charm spiritual decay and maintenance without treating a burned charm as rechargeable.')],
    },
    {
        id: 'lotm.craft.soothing-charm', label: 'Soothing charm',
        sourceIds: ['lotm.craft.soothing-charm', ...charmSourceIds],
        locators: ['zh 第127章 p27', 'zh 第127章 p30', 'zh 第128章 p70', 'zh 第133章 p17', 'zh 第133章 p47', 'zh 第198章 p34', 'zh 第198章 p38'],
        eligibility: charmEligibility(), inputs: charmInputs(),
        steps: charmSteps('triangular', 'Speak the short activation word, channel spirituality and throw the charm; it burns with an icy-blue flame and spreads a calming effect.'),
        product: {name: 'Inscribed triangular silver soothing charm', mechanism: 'The burning charm spreads a calming darkness. In the demonstrated encounter it eases anxiety and slows the affected person\'s self-strangling movement, while the user also becomes calm. Exposure and the affected being\'s state vary the response; the teaching describes soothing several kinds of spirits and lesser influence on more hostile spirits.'},
        recharge: recharge(), limits: [...charmLimits, 'The observed calming is not a demonstrated cure for the cause of the distress.'],
        evidence: {...evidence, recharge: 'T', 'product.mechanism.spirit-teaching': 'T', 'limits.0': 'S', 'limits.1': 'T'},
        proposals: [...proposals],
        effects: [pending('inventory-consumption', 'Account for materials and the charm consumed by burning.'), pending('mind-state', 'Resolve the observed calming of those exposed.'), pending('spirit-state', 'Resolve the taught spirit-soothing response without assigning an invented strength.'), pending('item-charge', 'Resolve unused-charm maintenance separately from consumed items.')],
    },
    {
        id: 'lotm.craft.dream-charm', label: 'Dream charm',
        sourceIds: ['lotm.rule.dream-charm-making', 'lotm.rule.dream-charm-use', ...charmSourceIds],
        locators: ['zh 第127章 p27', 'zh 第127章 p30', 'zh 第128章 p70', 'zh 第133章 p17', 'zh 第133章 p20', 'zh 第133章 p47'],
        eligibility: charmEligibility(), inputs: charmInputs(),
        steps: charmSteps('semicircular', 'With the subject asleep, speak the selected short activation word, channel spirituality, set the charm down and enter meditation as it burns.'),
        product: {name: 'Inscribed semicircular silver dream charm', mechanism: 'Burning the activated charm surrounds the practitioner and sleeping subject with a quiet darkness that helps the practitioner enter the subject\'s dream. A sleeping subject and the practitioner\'s meditation supply the demonstrated route; target state and spiritual response vary access, with no measured general success rate.'},
        recharge: recharge(), limits: [...charmLimits, 'This performed route starts with a sleeping subject; it does not demonstrate inducing sleep or universal access to dreams.'],
        evidence: {...evidence, recharge: 'T', 'limits.0': 'S', 'limits.1': 'T'},
        proposals: [...proposals],
        effects: [pending('inventory-consumption', 'Account for craft materials and the burned charm.'), pending('dream-access', 'Resolve the practitioner entering the sleeping subject\'s dream through the demonstrated meditation route.'), pending('item-charge', 'Resolve unused-charm decay and recharging.')],
    },
    {
        id: 'lotm.craft.protective-talisman', label: 'Engraved protective talisman',
        sourceIds: ['lotm.craft.protective-talisman', 'lotm.craft.silver-talisman-carving', 'lotm.craft.talisman', 'lotm.craft.talisman-finishing-blessing'],
        locators: ['zh 第69章 p19', 'zh 第69章 p44', 'zh 第81章 p17', 'zh 第83章 p42', 'zh 第83章 p48', 'zh 第84章 p6', 'zh 第84章 p10'],
        eligibility: eligibility(['talisman-inscription', 'Use the learned carving method and the corresponding words and symbols.'], ['spirituality-channeling', 'For the visibly effective method, spirituality flows through the knife tip during carving.']),
        inputs: [input('Semi-finished silver ornament'), input('Carving knife, used as a tool')],
        steps: [
            step('carve', 'craft', 'Carve the incantation and symbolic signs while channeling spirituality through the knife tip; complete the inscription on both faces.'),
            step('finish', 'finish', 'Finish the blessing inscription and decorative pattern on the semi-finished ornament.'),
        ],
        product: {name: 'Silver protective talisman with blessing and symbols', mechanism: 'The inscribed ornament carries a protective request associated with a power source and corresponding material. Inscription correctness, channeled spirituality and ritual assistance vary its effect: the teaching contrasts weak examples with a more effective spiritually carved talisman, but gives no measured protection outcome.'},
        limits: ['Requests for protection from misfortune, illness and other concerns correspond to different power sources and materials in the teaching.', 'No activation procedure, recharge process or measured protection duration is supplied.'],
        evidence: {...evidence, 'product.mechanism': 'T', 'limits.0': 'T'}, proposals: [...proposals],
        effects: [pending('inventory-crafting', 'Turn the ornament into the inscribed talisman and retain the carving tool.'), pending('protection', 'Resolve the requested protection through its power source; the cited gift scene does not prove a prevented misfortune.')],
    },
    {
        id: 'lotm.craft.holy-night-powder', label: 'Holy Night powder',
        sourceIds: ['lotm.craft.holy-night-powder'],
        locators: ['zh 第102章 p33', 'zh 第105章 p2'],
        eligibility: eligibility(['holy-night-method', 'The lead mixes the powder after buying materials; this describes access to that preparation knowledge.'], ['spirituality-channeling', 'The demonstrated barrier use imbues the powder with spirituality before scattering.']),
        inputs: ['Deep-sleep flower', 'Dragon-blood grass', 'Dark-red sandalwood', 'Mint', 'Other unspecified herbs', 'Small metal bottle for storage'].map(input),
        steps: [
            step('gather', 'prepare', 'Gather the named herbs and the additional undisclosed ingredients; proportions are unstated.'),
            step('mix', 'craft', 'Mix the herbs into Holy Night powder and store it in the metal bottle.'),
            step('scatter', 'use', 'Channel spirituality into a portion of the powder and scatter it while circling the intended area.'),
        ],
        product: {name: 'Bottled Holy Night powder', mechanism: 'Spirituality imbued into scattered powder supports a spiritual wall around the circled area in the demonstrated ritual. The scattering route and ritual purpose vary the enclosure; the passage demonstrates a prepared barrier rather than a standalone effect from uncharged powder.'},
        limits: ['The full recipe, proportions, yield and preparation time are undisclosed.', 'The ordinary-shop sourcing locator in the typed row belongs to a later-volume collision and is excluded from this volume 1 row.'],
        evidence: {...evidence}, proposals: [...proposals, 'Ingredient names are English renderings, not identified botanical species or a complete recipe.'],
        effects: [pending('inventory-crafting', 'Account for herbs transformed into stored powder and portions expended in use.'), pending('spiritual-wall', 'Resolve the circled barrier and its actual ritual purpose.')],
    },
    {
        id: 'lotm.craft.ritual-essence-oil', label: 'Distilled ritual essence oil',
        sourceIds: ['lotm.craft.ritual-essence-oil', 'lotm.craft.ritual-oil-distillation'],
        locators: ['zh 第64章 p12', 'zh 第64章 p13'],
        eligibility: eligibility(['botanical-distillation', 'Audrey draws on experience preparing oils and hydrosols and follows supplied instructions.']),
        inputs: ['Moon flower', 'Golden mint', 'Deep-sleep flower', 'Golden bergamot', 'Rock rose', 'Bottle for the extracted oil'].map(input),
        steps: [
            step('select', 'prepare', 'Select the five botanicals for the supplied ritual-oil instructions.'),
            step('distill', 'craft', 'Distill and extract the ritual essence oil, then bottle it; apparatus settings and proportions are not described.'),
            step('set-out', 'finish', 'Place the prepared bottle beside the bath for the ritual preparation.'),
        ],
        product: {name: 'Bottled five-botanical ritual essence oil', mechanism: 'The made oil feeds the bath preparation recorded by lotm.aid.ritual-oil-bath, where drops in warm water give a pleasant scent and the bather reports relaxation. Amount and exposure vary the preparation; the source supplies no independent supernatural potency or fixed duration.'},
        limits: ['Ratios, yield, apparatus and extraction duration are undisclosed.', 'This recipe is distinct from Full Moon oil and Amanda distillate.'],
        evidence: {...evidence, 'product.mechanism': 'I'}, proposals: [...proposals, 'The bath-use binding references the existing aid owner; that aid is not duplicated here.'],
        effects: [pending('inventory-crafting', 'Account for botanicals and bottling without inventing an output quantity.'), pending('aid-preparations', 'Supply the made oil to lotm.aid.ritual-oil-bath; its application and relaxation remain with the existing aid row.')],
    },
    {
        id: 'lotm.craft.full-moon-oil', label: 'Full Moon oil',
        sourceIds: ['lotm.craft.full-moon-oil'], locators: ['zh 第173章 p33'],
        eligibility: eligibility(['full-moon-preparation', 'This scene identifies the prepared oil and its ingredients but does not show its manufacture; the predicate is an unresolved method input.']),
        inputs: [input('Dragon-pattern tree bark'), input('Moon flower')],
        steps: [
            step('make', 'craft', 'Prepare Full Moon oil from dragon-pattern tree bark and moon flower; the source names the made mixture but leaves the manufacturing operation undisclosed.'),
            step('apply', 'use', 'Set the oil out with the other ritual materials and add it to the candle flames during altar preparation.'),
        ],
        product: {name: 'Prepared Full Moon oil', mechanism: 'The oil is dripped into ritual candle flames alongside hydrosol and herbal materials in an altar setup. Its contribution depends on the ritual and accompanying materials; the scene shows their combined use without isolating an effect or potency attributable to this oil.'},
        limits: ['The making step records an undisclosed transformation, not a demonstrated distillation procedure.', 'No ratios, apparatus, yield, duration or isolated oil effect are supplied.'],
        evidence: {...evidence, 'steps.0.text': 'T', 'product.mechanism': 'S'},
        proposals: [...proposals, 'No distillation method is transferred from the separate five-botanical oil or Amanda preparation.'],
        effects: [pending('inventory-crafting', 'Resolve the undisclosed oil-making operation before this row becomes an executable recipe.'), pending('ritual-preparation', 'Consume prepared oil in the altar setup alongside lotm.aid.amanda-distillate; the Amanda preparation stays with its existing owner.')],
    },
    {
        id: 'lotm.craft.pure-water', label: 'Repeatedly distilled water',
        sourceIds: ['lotm.craft.pure-water'],
        locators: ['zh 第168章 p25', 'zh 第168章 p27', 'zh 第168章 p28'],
        eligibility: eligibility(['alchemy-apparatus', 'The demonstrated route uses equipment in the alchemy room.']),
        inputs: [{name: 'Water', quantity: null, evidence: 'I'}, input('Alchemy-room distillation apparatus, used as a tool')],
        steps: [
            step('distill', 'craft', 'Use the alchemy-room apparatus to distill the water repeatedly; the number of passes is unstated.'),
            step('measure', 'use', 'Measure the required pure water into the potion preparation; the cited Clown formula calls for eighty milliliters.'),
        ],
        product: {name: 'Pure water for potion preparation', mechanism: 'Repeated distillation supplies the pure-water ingredient used as a liquid component in potion preparation. The intended formula varies the required amount; eighty milliliters belongs to the cited Clown formula, while the distillation step gives no batch yield or number of passes.'},
        limits: ['Energy cost, apparatus detail and preparation duration are not stated.', 'The auxiliary mixture shows no obvious transformation before supernatural ingredients are added; pure water is not presented as an independent supernatural effect.'],
        evidence: {...evidence, 'inputs.0.evidence': 'I', 'product.mechanism': 'T', 'limits.1': 'S'},
        proposals: [...proposals, 'Formula demand is not a claim about the amount of raw water or distillation yield.'],
        effects: [pending('inventory-crafting', 'Transform the water through distillation, retain apparatus and leave unstated yield unresolved.'), pending('potion-preparation', 'Supply pure water to the intended formula without granting a completed potion.')],
    },
]};

// Host-supplied facts, not abilities granted by importing these data.
export const LOTM_CRAFT_FACTS = [...new Set(LOTM_CRAFT_ROWS.rows.flatMap(row => row.eligibility.all.map(predicate => predicate.fact)))];

export const LOTM_CRAFT_GAPS = [
    {id: 'lotm.craft.sun-flame-charm', reason: 'The cited plan does not establish completed manufacture, a recipe or an observed product effect.'},
    {id: 'lotm.craft.yang-yan-talisman', reason: 'Alias of the planned sun-flame charm; the cited slice does not establish completed manufacture.'},
    {id: 'lotm.craft.covert-entry-search', reason: 'Entry and search tradecraft produces no made object in this slice.'},
    {id: 'lotm.rule.covert-search-method', reason: 'Methodical search belongs to an investigation owner, not a craft-product row.'},
    {id: 'lotm.craft.surveillance-tailing', reason: 'Commissioned observation yields a report, without demonstrating a craft made directly by the lead.'},
    {id: 'lotm.rite.nail-blood-charm', reason: 'A consumed token is shown, but its purpose, target and supernatural effect are unstated.'},
    {id: 'lotm.craft.hunter-bullets', reason: 'Material suitability is discussed without a recipe or performed ammunition manufacture.'},
    {id: 'lotm.craft.matchbox-gluing', reason: 'Supplies and completed boxes do not establish the actual making procedure.'},
];
