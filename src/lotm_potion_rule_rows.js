// Volume 1 source data, without engine registration or state mutation (MR10/MR13, AR2/AR3, AD38).
// S = shown, T = told, I = inferred. Field paths override parent evidence tags.
// Empty ingredient arrays mean the cited passages do not disclose a recipe.
// Owners below are integration requests, not implemented consumption or state changes.
const step = (id, text) => ({id, text, minutes: null});
const ingredient = (name, evidence, quantity = null) => ({name, quantity, evidence});
const pending = (owner, value) => ({type: 'owner-needed', owner, value});
const fact = (name, reason) => ({fact: `actor.lotm.potion.${name}`, op: 'eq', value: true, reason});
const authorship = [
    'Identifiers, English labels, field structure and owner bindings are authored proposals.',
    'Durations are unstated and remain null; no strength, probability or consumption quantity is invented.',
];
const aidEvidence = (method, use) => ({
    id: 'I', label: 'I', sourceIds: 'S', locators: 'S', ingredients: 'T',
    method, 'method.*.id': 'I', 'method.*.minutes': 'I', use,
    effects: 'I', proposals: 'I',
});
const ruleEvidence = mechanism => ({
    id: 'I', label: 'I', sourceIds: 'S', locators: 'S', condition: 'I',
    mechanism, effects: 'I', proposals: 'I',
});

export const LOTM_AID_PREPARATIONS = {schema: 1, rows: [
    {
        id: 'lotm.aid.amanda-distillate', label: 'Amanda distillate',
        sourceIds: ['lotm.rule.amanda-distillate', 'lotm.potion.amanda-distillate', 'lotm.item.amanda-distillate'],
        locators: ['zh 第14章 p48', 'zh 第183章 p37', 'zh 第185章 p25'],
        ingredients: [ingredient('Night-scented grass', 'T'), ingredient('Deep-sleep flower', 'T'), ingredient('Chamomile', 'T')],
        method: [
            step('distill', 'Mix the three herbs, distill and extract the hydrosol; proportions and apparatus are not given.'),
            step('vaporize', 'Drip the prepared distillate into the candle flame and let its scent spread.'),
        ],
        use: {context: 'Calming preparation and assistance during mediumship', target: 'People exposed to the scent; the spirit approached during mediumship',
            effect: 'The candle releases a gentle scent; tension and anger subside in the observed scene. Daly describes using it to relax a spirit for contact.',
            conditions: ['Exposure to the vaporized preparation; the mediumship account concerns a resisting living person.']},
        evidence: {...aidEvidence('T', 'S'), 'method.1.text': 'S', 'use.effect.mediumship': 'T'},
        proposals: [...authorship, 'The ingredient names are English renderings; no botanical species or substitution is assigned.'],
        effects: [pending('inventory-consumption', 'Account for distillate applied to the flame.'), pending('mood-state', 'Resolve observed calming after scent exposure.'), pending('spirit-state', 'Resolve relaxation as an aid to mediumship.')],
    },
    {
        id: 'lotm.aid.eye-of-spirit', label: 'Eye of Spirit preparation',
        sourceIds: ['lotm.rule.eye-of-spirit', 'lotm.potion.eye-of-spirit', 'lotm.potion.spirit-eye', 'lotm.item.eye-of-spirit-potion'],
        locators: ['zh 第14章 p51', 'zh 第183章 p37', 'zh 第185章 p28', 'zh 第185章 p39'],
        ingredients: [ingredient('Dragon-pattern tree bark and leaves', 'T'), ingredient('Poplar bark and leaves', 'T'), ingredient('Langqi wine', 'T')],
        method: [
            step('sun-dry', 'Sun-dry the bark and leaves for seven days.'),
            step('boil', 'Boil three times.'),
            step('soak', 'Soak in Langqi wine; accompany preparation with incantations whose words and placement are unstated.'),
            step('apply', 'Drip the amber preparation into the candle flame.'),
        ],
        use: {context: 'Preparing a spirit for mediumship', target: 'The intended spirit and people exposed to the scent',
            effect: 'A wine scent spreads; the subject loses focus and drops his cards while remaining seated. The practitioner also feels disoriented.',
            conditions: ['The lead first works to lower the subject\'s remaining defenses; he uses the candle representing himself.']},
        limits: ['The observed subject remains seated rather than collapsing.'],
        evidence: {...aidEvidence('T', 'S'), 'method.3.text': 'S', limits: 'S'},
        proposals: [...authorship, 'Dragon-pattern tree and Langqi wine are English renderings, not identified real-world species or substitutes.', 'Seven days and three boils are told source quantities, not authored pacing.'],
        effects: [pending('inventory-consumption', 'Account for preparation applied to the flame.'), pending('spirit-state', 'Resolve the subject becoming drowsy and the practitioner experiencing disorientation.')],
    },
    {
        id: 'lotm.aid.ritual-oil-bath', label: 'Ritual oil in bathwater',
        sourceIds: ['lotm.potion.ritual-oil-drowsing'], locators: ['zh 第64章 p17'],
        ingredients: [],
        method: [step('add', 'Add a few drops of prepared ritual oil to the bathwater.')],
        use: {context: 'Bathing', target: 'The bather', effect: 'A calm, pleasant fragrance spreads and the bather describes feeling relaxed.', conditions: ['The oil is added to the bathwater.']},
        evidence: {...aidEvidence('S', 'S'), ingredients: 'I'},
        proposals: [...authorship, 'Ingredients are empty because the passage names a prepared oil without disclosing its recipe; the method records application.'],
        effects: [pending('inventory-consumption', 'Account for drops of ritual oil used.'), pending('mood-state', 'Resolve relaxation associated with the scented bath.')],
    },
    {
        id: 'lotm.aid.craggy-oil', label: 'Craggy Oil',
        sourceIds: ['lotm.potion.kragh-oil', 'lotm.rule.craggy-oil'], locators: ['zh 第141章 p8'],
        ingredients: [],
        method: [step('inhale', 'Unstopper the prepared oil bottle and hold it near the nose to inhale its sharp scent.')],
        use: {context: 'Staying alert or facing decay odors', target: 'The person inhaling the scent',
            effect: 'The sharp scent brings the lead out of sleepiness. The narration describes the oil as helping against foul decay odors.', conditions: ['Inhale the bottled preparation.']},
        evidence: {...aidEvidence('S', 'S'), ingredients: 'I', 'use.effect.odor-counteraction': 'T'},
        proposals: [...authorship, 'Ingredients are undisclosed. A smell resembling mint and disinfectant does not establish either as an ingredient; the method records use.'],
        effects: [pending('inventory-consumption', 'Resolve any expenditure from opening and inhaling the oil; the passage supplies no amount.'), pending('body-state', 'Resolve alertness and relief from foul odors without inventing a potency or duration.')],
    },
    {
        id: 'lotm.aid.folk-herbal-remedy', label: 'Folk herbal remedy',
        sourceIds: ['lotm.potion.rosen-herb-remedy', 'lotm.potion.rosen-herbal-decoction'], locators: ['zh 第82章 p99'],
        ingredients: [ingredient('Bundled herbs of unspecified varieties', 'T'), ingredient('Water', 'T'), ingredient('Fresh rooster blood', 'T', 'Ten drops per brew')],
        method: [
            step('boil', 'Boil the bundled herbs with sufficient water; the seller gives no water measure.'),
            step('blood', 'After boiling, add ten drops of fresh rooster blood and drink immediately.'),
            step('repeat', 'Use the herb bundle for three brews and doses, as the seller instructs.'),
        ],
        use: {context: 'The seller\'s treatment instructions for the buyer\'s liver illness', target: 'The buyer taking the remedy',
            effect: 'The seller predicts improvement after the three brews; these instructions do not demonstrate a cure.', conditions: ['Follow the described boiling, blood addition and immediate drinking instructions.']},
        evidence: aidEvidence('T', 'T'),
        proposals: [...authorship, 'Ten drops and three brews are told source quantities. This is not one brew divided into three portions.'],
        effects: [pending('inventory-consumption', 'Track the three uses of the herb bundle, water and fresh blood.'), pending('body-health', 'Resolve the claimed treatment through a health owner; do not grant a demonstrated cure.')],
    },
    {
        id: 'lotm.aid.calm-potion', label: 'Calm potion before mediumship',
        sourceIds: ['lotm.potion.calm', 'lotm.potion.calm-potion', 'lotm.item.calm-potion'],
        locators: ['zh 第183章 p53', 'zh 第185章 p45'],
        ingredients: [], method: [step('drink', 'Drink the prepared Calm potion before proceeding with mediumship.')],
        use: {context: 'Maintaining awareness during mediumship with a confused spirit', target: 'The practitioner',
            effect: 'Daly recommends it for clear thought and rationality. In the observed use, the lead drinks it after scent-induced disorientation and promptly regains clear awareness.',
            conditions: ['Take the prepared potion; the cited scene places its use before the formal invocation.']},
        evidence: {...aidEvidence('S', 'T'), ingredients: 'I', 'use.effect.observed-recovery': 'S'},
        proposals: [...authorship, 'Ingredients are empty because the cited passages mention a stored formula and prepared stock without revealing the recipe; the method records use.'],
        effects: [pending('inventory-consumption', 'Account for the prepared potion drunk.'), pending('mind-state', 'Resolve clear awareness during mediumship, without a numerical resistance grant.')],
    },
]};

export const LOTM_POTION_RULES = {schema: 1, rows: [
    {
        id: 'lotm.potionrule.procurement-attention', label: 'Recognizing auxiliary purchases',
        sourceIds: ['lotm.rule.audience-potion-aux', 'lotm.item.sequence-potion'], locators: ['zh 第117章 p44'],
        condition: {all: [fact('procurement.separate-auxiliary-purchases', 'Auxiliaries are bought in separate transactions.'), fact('procurement.observer-knows-formula', 'The observer knows the formula and can recognize its materials.')]},
        mechanism: 'Separating purchases can still leave a recognizable ingredient pattern. Attention varies with an observer\'s formula knowledge and access to the purchases; the speaker reports noticing this buyer despite the separation.',
        effects: [pending('procurement-attention', 'Resolve recognition and attention from an informed observer, without prohibiting a purchase.')],
        evidence: ruleEvidence('T'), proposals: [...authorship, 'Boolean condition facts are proposed host bindings, not a detection probability.'],
    },
    {
        id: 'lotm.potionrule.remains-main-material', label: 'Characteristic as main potion material',
        sourceIds: ['lotm.rule.remains-as-potion', 'lotm.potion.remains-advancement', 'lotm.rule.remains-promotion'],
        locators: ['zh 第207章 p14', 'zh 第212章 p51'],
        condition: {all: [fact('material.normally-deceased-characteristic', 'The characteristic comes from a normally deceased Beyonder.'), fact('material.corresponding-potion', 'Match the characteristic to its corresponding potion.')]},
        mechanism: 'A normally deceased Beyonder\'s characteristic can supply the corresponding potion\'s main material. It lacks the auxiliaries, so preparation still depends on finding the corresponding auxiliary ingredients; this account distinguishes normal death from loss of control.',
        effects: [pending('potion-brewing', 'Resolve characteristic substitution for the main material while retaining the auxiliary requirements.')],
        evidence: ruleEvidence('T'), proposals: [...authorship, 'This row supplies no characteristic grant, advancement command or separate digestion model.'],
    },
    {
        id: 'lotm.potionrule.related-pathway-substitution', label: 'High-sequence pathway substitution',
        sourceIds: ['lotm.potion.post5-swap', 'lotm.potion.steam-church-swap', 'lotm.potion.diviner-seq4-merge'],
        locators: ['zh 第145章 p8', 'zh 第145章 p9', 'zh 第145章 p11'],
        condition: {all: [fact('advancement.high-sequence', 'The account concerns higher-sequence advancement rather than arbitrary low-sequence mixing.')]},
        mechanism: 'Some closely related pathways are reported to permit high-sequence substitution, while other combinations remain incompatible. Compatibility varies by pathway pairing and sequence: Sleepless and Corpse Collector are described as interchangeable after Sequence 5, and Generalist and Mystery Pryer at higher levels. The lead regards the report as needing verification. He conjectures that the Seer abilities converge at Sequence 4 and could obstruct substitution there; that conjecture is not a demonstrated restriction.',
        effects: [pending('potion-advancement', 'Resolve compatibility for the specific pathway pair and sequence; do not infer a universal swap permission from these examples.')],
        evidence: {...ruleEvidence('T'), 'mechanism.seer-convergence': 'I'},
        proposals: [...authorship, 'High-sequence is a host fact without an invented universal numerical cutoff; the source gives a cutoff for the named Sleepless/Corpse Collector example.'],
    },
    {
        id: 'lotm.potionrule.low-sequence-brewing', label: 'Measured low-sequence brewing',
        sourceIds: ['lotm.potion.sequence-brewing-general'], locators: ['zh 第31章 p41'],
        condition: {all: [fact('brewing.below-sequence-seven', 'Old Neil limits his simple brewing account to sequences below 7 in rank, such as 8 and 9.')]},
        mechanism: 'Old Neil describes brewing below Sequence 7 as adding accurately measured ingredients in the formula\'s order and stirring. In that stated range, special flame, additional ritual, incantations and the brewer\'s spirituality are unnecessary. The dial is sequence and formula: this explanation does not establish the preparation of higher potions.',
        effects: [pending('potion-brewing', 'Resolve measured, ordered addition and stirring through the formula owner; no additional fire or ritual requirement is supplied for this stated range.')],
        evidence: ruleEvidence('T'), proposals: [...authorship, 'The boolean fact encodes the stated sequence range; it is not an authored time or skill threshold.'],
    },
    {
        id: 'lotm.potionrule.animal-ingestion', label: 'Animal potion outcomes',
        sourceIds: ['lotm.potion.animal-sequence9'], locators: ['zh 第60章 p60'],
        condition: {all: [fact('recipient.ordinary-animal', 'The account concerns an ordinary animal taking a potion.')]},
        mechanism: 'Alger says an ordinary animal generally cannot learn meditation immediately and is likely to die or collapse into a monster. Surviving animals are said to be able to become supernatural; improved intelligence additionally depends on the potion improving thought. Outcome varies with survival and the potion\'s mental effects; the passage supplies no probability.',
        effects: [pending('potion-ingestion', 'Resolve death, monstrous collapse or supernatural survival through the ingestion owner.'), pending('mind-state', 'Resolve improved intelligence when the potion supports thought enhancement and the animal survives.')],
        evidence: ruleEvidence('T'), proposals: [...authorship, 'Likely failure and exceptional survival remain qualitative, without invented odds.'],
    },
]};

// Required host inputs, not starting possessions, abilities or state grants.
export const LOTM_POTION_RULE_FACTS = [...new Set(
    LOTM_POTION_RULES.rows.flatMap(row => row.condition?.all.map(predicate => predicate.fact) ?? [])
)];

// Pure potion effects and existing formula, digestion, promotion-risk duplicates are excluded, not gaps.
export const LOTM_POTION_RULE_GAPS = [
    {id: 'lotm.rule.alger-brew-attempt', reason: 'A strange bottle and a red eruption do not establish a brewing failure cause; no reproducible destabilization rule is justified.'},
    {id: 'lotm.item.clown-potion', reason: 'The advancement-examination award is a specific institutional entitlement requiring a reward/procurement owner, outside these preparation and material rules.'},
    {id: 'lotm.potion.diviner', reason: 'The ordinary-material properties account needs a composition owner and concrete properties; it is not a Seer potion recipe or a new resolved preparation here.'},
    {id: 'lotm.rule.mummy-powder-decoction', reason: 'The claimed sexual effect is hearsay without demonstrated preparation or outcome; the requested hearsay-only exclusion applies.'},
];
