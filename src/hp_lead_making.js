// Harry Potter lead life: the first-year Potions class makes a real potion through the shared craft engine (slice W1a).
// Proposal (AD32); nothing here is accepted direction. Governing lines: AD38 (things work by how they work) and MR6
// (the world supplies a catalogue, a law and rows; the shared engine resolves the product, no world code in the engine).
//
// Canon (book 1, the Potions lesson): the Cure for Boils needs dried nettles, crushed snake fangs, stewed horned slugs and
// porcupine quills; the quills go in after the cauldron is taken off the fire. Neville adds them while it is still on the
// fire, the potion turns acid green, burns through the cauldron and the spill gives the class boils.
// Authored (not canon): the quantities (2/1/1/1), the minutes, the axis numbers, the item descriptions and the flask facts.
//
// Default, dial and reason. Default: following the written steps gives a flask of the cure. Dial: how soon the quills go in
// is a process step with a different reading (the law below), so a world with a hotter or colder method changes the ops or
// numbers, not the engine. Reason: quills react with whatever cure is dissolved while the liquid is still on the fire.
// Not a blanket rule: a different brew in this world can use quills early on purpose.
//
import {defineCastMaking} from './cast_making_adapter.js';
import {MAKING_TRAITS} from './making_traits.js';

const P = 'book.hp.lead';
const itemKey = name => JSON.stringify({id: `${P}.item.${name}`});
const KNOW = `${P}.potions.recipe.cure_boils`;
const FLASK_FACT = 'hp.lead.potions.flask';
const SITUATION = `${P}.situation`;
const basis = {kind: 'observation', attributedTo: 'player', situationId: SITUATION};

export const HP_LEAD_MAKING_KEYS = Object.freeze({
    nettles: itemKey('dried_nettles'), fangs: itemKey('snake_fangs'), slugs: itemKey('horned_slugs'), quills: itemKey('porcupine_quills'),
    cure: itemKey('cure_boils_flask'), corrosive: itemKey('corrosive_flask'),
});
const K = HP_LEAD_MAKING_KEYS;

const slots = [
    {id: 'nettles', role: 'base', select: {material: 'Dried nettles'}, qty: [2, 2]},
    {id: 'fangs', role: 'active', select: {material: 'Crushed snake fangs'}, qty: [1, 1]},
    {id: 'slugs', role: 'solvent', select: {material: 'Stewed horned slugs'}, qty: [1, 1]},
    {id: 'quills', role: 'additive', select: {material: 'Porcupine quills'}, qty: [1, 1]},
];
const inputs = [
    {key: K.nettles, material: 'Dried nettles', qty: 2, label: 'dried nettles'},
    {key: K.fangs, material: 'Crushed snake fangs', qty: 1, label: 'crushed snake fangs'},
    {key: K.slugs, material: 'Stewed horned slugs', qty: 1, label: 'stewed horned slugs'},
    {key: K.quills, material: 'Porcupine quills', qty: 1, label: 'porcupine quills'},
];
const written = [{op: 'simmer', level: 1}, {op: 'take_off_fire', level: 1}, {op: 'add_quills_cool', level: 1}];
const early = [{op: 'simmer', level: 1}, {op: 'add_quills_hot', level: 1}];
const recipeFor = (name, process) => ({id: `${P}.recipe.${name}`, revision: 1, name: 'Cure for Boils', law: `${P}.law.potions@1`, slots,
    process: process.map(s => ({op: s.op, levels: [1, 1]}))});

const row = ({name, label, description, report, minutes, process, product, use}) => ({
    id: `${P}.make.${name}`, revision: 1, label, description, report, place: `${P}.school_hall`, minutes,
    knowledgeKey: KNOW, law: `${P}.law.potions@1`, recipe: recipeFor(name, process), inputs: structuredClone(inputs), process, stations: [],
    procedure: {steps: process.map((s,i)=>({id:s.op,minutes: i===0?30:process.length===2?10:5,
        ...(s.op==='add_quills_cool'||s.op==='add_quills_hot'?{condition:{fact:'actor.hp.lead.potions.onFire',op:'eq',value:s.op==='add_quills_hot',reason:s.op==='add_quills_hot'?'Keep the cauldron over the fire.':'Take the cauldron off the fire first.'}}:{}),
        ...(s.op==='simmer'||s.op==='take_off_fire'?{effects:[{type:'fact',scope:'actor',actor:'player',key:'hp.lead.potions.onFire',value:s.op==='simmer'}]}:{}),
        label: ({simmer:'Simmer the nettles, fangs and slugs',take_off_fire:'Take the cauldron off the fire',add_quills_cool:'Add the quills off the fire',add_quills_hot:'Add the quills over the fire'})[s.op]}))},
    product, use,
});

export const HP_LEAD_MAKING = Object.freeze({
    schema: 1,
    catalogue: {
        id: `${P}.potions`, revision: 1,
        axes: [{id: 'cure', kind: 'fraction', label: 'the cure'}, {id: 'sting', kind: 'fraction', label: 'quill sting'},
            {id: 'acid', kind: 'fraction', label: 'green burn'}],
        tags: MAKING_TRAITS,
        materials: [
            {id: 'Dried nettles', revision: 1, tags: ['material.plant','preparation.dried'], properties: {cure: 300}},
            {id: 'Crushed snake fangs', revision: 1, tags: ['material.animal','preparation.crushed'], properties: {cure: 250}},
            {id: 'Stewed horned slugs', revision: 1, tags: ['material.animal','preparation.stewed'], properties: {cure: 200}},
            {id: 'Porcupine quills', revision: 1, tags: ['material.animal','function.heat_reactive'], properties: {sting: 500}},
        ],
    },
    laws: [{
        id: `${P}.law.potions`, revision: 1, carrier: 'Cauldron flask',
        ops: [{id: 'simmer', label: 'Simmer over the fire'}, {id: 'take_off_fire', label: 'Take the cauldron off the fire'},
            {id: 'add_quills_cool', label: 'Add the quills off the fire'}, {id: 'add_quills_hot', label: 'Add the quills on the fire'}],
        // Quills dropped into liquid that is still hot eat the cure and turn it to acid. Off the fire they are inert.
        reactions: [{id: 'quills_burn', after: 'add_quills_hot', limit: 1000, reactants: {sting: 1, cure: 1}, products: {acid: 2}}],
        outputs: [{id: 'cure', route: 'oral', effect: 'boil_cure', axis: 'cure', per: 100},
            {id: 'acid', route: 'oral', effect: 'corrosion', axis: 'acid', per: 100}],
    }],
    rows: [
        row({name: 'cure_boils', label: 'Brew the Cure for Boils · 40 min',
            description: 'Follow the written steps: simmer, take the cauldron off the fire, then add the quills.',
            report: 'You brewed the Cure for Boils by the written steps, quills in after the fire was out.', minutes: 40, process: written,
            product: {key: K.cure, label: 'Flask of Cure for Boils'},
            use: {label: 'Hand in your flask · 5 min', description: 'Ladle some of the cure into a flask and take it to the front of the class.', report: 'You handed in your flask.', minutes: 5,
                effects: [{type: 'fact', scope: 'actor', key: FLASK_FACT, value: 'cure'},
                    {type: 'knowledge', key: `${P}.potions.flask_last`, stage: 'seen', basis: {...basis},
                        value: 'Your potion came out a clear, steady colour. The master gave it a sniff and moved on.'}]}}),
        row({name: 'cure_boils_quills_early', label: 'Brew the Cure for Boils, quills in early · 40 min',
            description: 'Simmer it, then drop the quills in while the cauldron is still on the fire.',
            report: 'You dropped the quills in while the cauldron was still on the fire.', minutes: 40, process: early,
            product: {key: K.corrosive, label: 'Flask of green sludge'},
            use: {label: 'Hand in your flask · 5 min', description: 'Take the flask to the front of the class.', report: 'You handed in your flask.', minutes: 5,
                effects: [{type: 'fact', scope: 'actor', key: FLASK_FACT, value: 'corrosive'},
                    {type: 'knowledge', key: `${P}.potions.flask_last`, stage: 'seen', basis: {...basis},
                        value: 'The potion turned acid green and hissed through the bottom of the cauldron. The master was not pleased.'}]}}),
    ],
});

export const hpLeadMakingCommands = defineCastMaking(HP_LEAD_MAKING, {
    worldId: `${P}.world`, group: 'structured_local', situationId: SITUATION,
    requires: {fact: 'actor.hp.lead.atSchool', op: 'eq', value: true},
});

const item = (key, label, description, value = 1) => ({id: JSON.parse(key).id, label, description, value});
export const hpLeadMakingItems = Object.freeze([
    item(K.nettles, 'Dried nettles', 'A few dried stinging nettles, brittle and grey-green.'),
    item(K.fangs, 'Crushed snake fangs', 'Snake fangs ground to a pale grit in a small paper twist.'),
    item(K.slugs, 'Stewed horned slugs', 'Horned slugs stewed soft, in a jar that smells of wet cellars.'),
    item(K.quills, 'Porcupine quills', 'A bundle of pale porcupine quills, sharp at both ends.'),
    item(K.cure, 'Flask of Cure for Boils', 'A flask of the first-year cure, clear and steady.', 2),
    item(K.corrosive, 'Flask of green sludge', 'A flask of acid-green sludge. Do not leave it on anything you like.', 0),
]);

// Appended to the Potions lesson. One set of ingredients, exactly what one brew consumes, and the written steps as a note
// at the rows' knowledge key so they become eligible. The note is the master's board; it does not say which mistake costs what.
export const hpPotionsIssueEffects = Object.freeze([
    ...inputs.map(i => ({type: 'item', actor: 'player', key: i.key, amount: i.qty})),
    {type: 'knowledge', actor: 'player', key: KNOW, stage: 'seen', basis: {...basis},
        value: 'The board lists the Cure for Boils: simmer the nettles, fangs and slugs, take the cauldron off the fire, then add the quills.'},
]);
