// Dictionary entries describe one evidenced expression and a proposed
// execution vocabulary. Linguistic clues do not themselves execute effects.
const locators = Object.freeze({
    charms: 'Harry Potter, B1 pp137–138, first Charms lesson',
    broom: 'Harry Potter, B4 p1461, first task',
    cup: 'Harry Potter, B7 p4162, resisted summoning',
    sidecar: 'Harry Potter, B7 p3716, falling sidecar',
    torch: 'Mother of Learning, ch. 2, Life’s Little Problems',
    boundaries: 'Mother of Learning, ch. 11, Limiters',
});
const observed = (source, text) => ({kind: 'observed', source, text});
const inference = (source, text) => ({kind: 'inference', source, text});
const original = text => ({kind: 'original', text});
const role = (name, type) => ({name, type});
const pronunciationSource='https://www.harrypotter.com/fact-file/spells/the-levitation-charm';
const classicalAdjectives='https://dcc.dickinson.edu/grammar/latin/derivation-adjectives';
const segment=(text,kind,evidence)=>({text,kind,evidence});

export const spellDictionary = [
    {
        id: 'hp.levitation', revision: 1, world: 'hogwarts', label: 'Levitation Charm',
        expression: {
            mode: 'spoken',
            grammar: [{part: 0}, {part: 1}, {part: 2}],
            parts: [
                {text: 'Wingardium', role: 'incantation',
                    evidence: observed(locators.charms, 'Attested as part of the phrase. Its independent function is unknown.'),
                    analysis:{
                        revision:1,
                        morphology:[
                            segment('Wing','candidate root',inference(locators.charms,'The English word wing suggests flight.')),
                            segment('ard','candidate stem',inference('https://logeion.uchicago.edu/morpho/arduo','Possibly echoes Latin arduus, steep. The proposed boundary is uncertain.')),
                            segment('ium','candidate ending',inference(locators.charms,'A Latin-looking ending with no established function here.')),
                        ],
                        speech:observed(pronunciationSource,'Lengthen the gar sound.'),
                    }},
                {text: 'Leviosa', role: 'incantation',
                    evidence: observed(locators.charms, 'Attested as the second word of the phrase.'),
                    analysis:{
                        revision:1,
                        morphology:[
                            segment('Levi','candidate stem',inference('https://logeion.uchicago.edu/levis','Possibly echoes levis, light in weight. Latin levō also offers a comparison for raising.')),
                            segment('osa','candidate ending',inference(classicalAdjectives,'Resembles the feminine form of Latin -ōsus, a suffix for being full of something. The spell’s use of the ending is unknown.')),
                        ],
                        speech:observed(pronunciationSource,'Give the o its own distinct beat in Levi-o-sa.'),
                    }},
                {text: 'Swish and flick', role: 'gesture', evidence: observed(locators.charms, 'Taught wand motion.')},
            ],
        },
        roles: [role('target', 'object')],
        means: [{role: 'focus', type: 'wand'}],
        operations: [{operation: 'lift', bindings: {target: 'target'}}, {operation: 'support', bindings: {target: 'target'}}],
        evidence: [
            observed(locators.charms, 'The feather rises and hovers.'),
            observed(locators.sidecar, 'The sidecar rises and remains unsteerable.'),
            inference(locators.sidecar, 'Support and steering should be distinct operations.'),
        ],
    },
    {
        id: 'hp.summoning', revision: 1, world: 'hogwarts', label: 'Summoning Charm',
        expression: {
            mode: 'spoken',
            grammar: [{part: 0}, {binding: 'target', optional: true}],
            parts: [
                {text: 'Accio', role: 'incantation', evidence: observed(locators.broom, 'Attested spoken form.')},
                {text: 'Firebolt', role: 'target reference', evidence: inference(locators.broom, 'The spoken name plausibly selects the object in this example.')},
            ],
        },
        roles: [role('target', 'object'), role('destination', 'place')],
        means: [{role: 'focus', type: 'wand'}],
        operations: [{operation: 'move', bindings: {target: 'target', destination: 'destination'}}],
        evidence: [
            observed(locators.broom, 'The broom approaches Harry from out of sight.'),
            observed(locators.cup, 'A named object can fail to come.'),
            original('The practice exercise binds an unobstructed route to the caster’s position.'),
        ],
    },
    {
        id: 'hp.release', revision: 1, world: 'hogwarts', label: 'Release support',
        expression: {mode:'release', grammar:[{part:0}], parts:[
            {text:'End the charm', role:'technique', evidence:original('Release the support holding the practice board.')},
        ]},
        roles: [role('target','object')],
        means: [],
        operations: [{operation:'release', bindings:{target:'target'}}],
        evidence: [],
    },
    {
        id: 'mol.torch', revision: 1, world: 'cyoria', label: 'Torch invocation',
        expression: {
            mode: 'structured',
            grammar: [{part: 0}, {part: 1}],
            parts: [
                {text: 'Torch invocation', role: 'learned method', evidence: observed(locators.torch, 'A taught way to produce light. The wording is unspecified here.')},
                {text: 'Spell boundary', role: 'structure', evidence: inference(locators.boundaries, 'Use the boundary model to explain what the invocation can sustain.')},
            ],
        },
        roles: [role('area', 'place')],
        means: [{role: 'fuel', type: 'attuned mana'}],
        operations: [{operation: 'illuminate', bindings: {area: 'area'}}],
        evidence: [observed(locators.torch, 'The lesson compares the invocation with directly shaped light.')],
    },
    {
        id: 'mol.direct_light', revision: 1, world: 'cyoria', label: 'Directly shaped light',
        expression: {
            mode: 'direct shaping',
            grammar: [{part: 0}],
            parts: [{text: 'Shape mana by control', role: 'technique', evidence: observed(locators.torch, 'The exercise produces light through unstructured shaping.')}],
        },
        roles: [role('area', 'place')],
        means: [{role: 'fuel', type: 'attuned mana'}],
        operations: [{operation: 'illuminate', bindings: {area: 'area'}}],
        evidence: [observed(locators.torch, 'Direct shaping is presented beside the structured method.')],
    },
    {
        id: 'mol.oblique', revision: 1, world: 'cyoria', label: 'Low-angle formula',
        expression: {mode:'structured', grammar:[{part:0}], parts:[
            {text:'Send the light across the slate', role:'formula', evidence:original('Aim the bounded light along the surface.')},
        ]},
        roles: [role('area','place')],
        means: [{role:'fuel', type:'attuned mana'}],
        operations: [{operation:'illuminate', bindings:{area:'area'}}],
        evidence: [],
    },
];
