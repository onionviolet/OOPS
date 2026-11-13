// PC95. This incident supplies a pressure dial and an involuntary response.
// The stored-working host owns the threshold, reach, debit and publication.
import {WORLD_QUANTITIES} from '../world_quantities.js';

const placement = {'ballooned': 'ceiling', 'ordinary': 'dining-room'};

export const HP_ACCIDENTAL_LIFT = {
    id: 'hp.accidental-lift', revision: 1, reads: ['form'],
    laws: [{
        id: 'buoyancy',
        appliesTo: holder => holder.kind === 'body' && holder.as.includes('buoyant-incident'),
        decide(view, id) {
            const here = view.placeOf(id);
            if (here !== 'dining-room' && here !== 'ceiling') return [];
            const to = placement[view.property(id, 'form')];
            return to && to !== here ? [{op: 'move', holder: id, to}] : [];
        },
    }],
};

export function coverageCase(id) {
    if (id !== 'marge') throw Error(`Unknown accidental magic case ${id}.`);
    const at = id => ({shape: 'holder', id});
    const form = (direction, to) => ({holder: 'marge', property: 'form', direction, to});
    const position = (direction, to) => ({holder: 'marge', position: true, direction, to});
    const reserve = {holder: 'harry', quantity: 'energy:mana', direction: 'down', to: 4};
    const treatment = {holder: 'responder', quantity: 'stamina', direction: 'down', to: 3};
    return {basis: 'authored',
        world: {holders: [
            {id: 'dining-room', kind: 'place'}, {id: 'ceiling', kind: 'place'}, {id: 'hall', kind: 'place'},
            {id: 'harry', kind: 'body', place: 'dining-room', quantities: {distress: 1, 'energy:mana': 5}},
            {id: 'marge', kind: 'body', as: ['creature', 'buoyant-incident'], place: 'dining-room', properties: {form: 'ordinary'}},
            {id: 'vernon', kind: 'body', place: 'dining-room', properties: {form: 'ordinary'}},
            {id: 'responder', kind: 'body', place: 'ceiling', quantities: {stamina: 5}},
            {id: 'responder-wand', kind: 'thing', place: 'ceiling', properties: {marks: ['grip:responder']}},
        ]},
        engine: {packs: [HP_ACCIDENTAL_LIFT.id],
            shared: {quantities: [...Object.values(WORLD_QUANTITIES),
                {id: 'distress', unit: 'pressure', min: 0, max: 5},
                {id: 'stamina', unit: 'effort', min: 0, max: 5}]},
            host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
        timeline: [
            {id: 'susceptibility', by: 'harry', store: {
                carrier: 'harry', mode: 'once', pulse: 1, draw: {from: '$carrier', quantity: 'energy:mana', per: 1},
                trigger: {kind: 'quantity', holder: '$carrier', quantity: 'distress', op: '>=', value: 3, again: 'pulse'},
                effects: [{sentence: {verb: 'transform', object: 'form'}, details: {target: at('marge'), value: 'ballooned'}}],
            }},
            {id: 'below-threshold', advanceTo: 1, expect: [form('unchanged', 'ordinary')]},
            {id: 'provocation', ops: [{op: 'add', holder: 'harry', quantity: 'distress', amount: 2}]},
            {id: 'restore-before-outburst', restore: true},
            {id: 'outburst', advanceTo: 2, expect: [form('changed', 'ballooned'), reserve]},
            {id: 'lift', advanceTo: 3, expect: [position('changed', 'ceiling')]},
            {id: 'restore-aloft', restore: true},
            {id: 'reverse', working: {family: 'spell', id: 'reverse', payer: 'responder', spells: [{
                sentence: {verb: 'transform', object: 'form', target: 'creature', time: 'instant', carrier: 'wand', cost: 'stamina'},
                target: {id: 'marge'}, grip: {caster: 'responder', implement: 'responder-wand'},
                contact: {links: 0}, minutes: 1, details: {value: 'ordinary', cost: 2},
            }]}},
            {id: 'deflate', advanceTo: 4, expect: [form('changed', 'ordinary'), treatment]},
            {id: 'return-to-floor', advanceTo: 6, expect: [position('changed', 'dining-room'),
                {holder: 'harry', quantity: 'energy:mana', direction: 'unchanged', to: 4}]},
        ], expect: [reserve, treatment, form('unchanged', 'ordinary'), position('unchanged', 'dining-room'),
            {holder: 'vernon', property: 'form', direction: 'unchanged', to: 'ordinary'}],
    };
}
