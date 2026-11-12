// Proposed engine probes. Source locators are on HP_SPELL_ROWS. The held
// records, channels, magnitudes and resolved bindings are authored data.
import {storeWorking} from '../stored_working.js';
import {WORKING_END_PACK} from '../world_substrate_packs/working_end.js';
import {PRESENCE_PACK} from '../world_substrate_packs/presence.js';

const at = id => ({shape: 'holder', id});
const room = id => ({id, kind: 'place'});
const body = (id, place, properties) => ({id, kind: 'body', place, properties});
const property = (holder, name, direction, to) => ({holder, property: name, direction, to});

function heldScene({seen, holder, working, sentence, effectDetails, field, landing, output, expect}) {
    const place = holder.place ?? holder.id;
    const record = storeWorking({
        carrier: holder.id, mode: 'held', pulse: 1, trigger: {kind: 'time', every: 1},
        charge: {now: 2, max: 3, per: 1},
        effects: [{sentence, details: {target: at(holder.id), ...effectDetails}}],
    }, {id: working, by: 'first-caster', at: 0});
    const lawFields = field ? [{...field, scope: holder.id, source: `stored:${working}`}] : [];
    return {seen, holders: [
        ...(holder.kind !== 'place' ? [room(place)] : []),
        ...(landing ? [room(landing.to)] : []),
        ...(effectDetails?.to ? [room(effectDetails.to)] : []),
        {...holder, state: {[WORKING_END_PACK]: {active: [{
            record, ...(field ? {field: {id: field.id, kind: field.kind, source: lawFields[0].source}} : {}),
            ...(landing ? {landing} : {}), ...(output ? {output} : {}),
        }]}}},
    ], lawFields, engine: {packs: [WORKING_END_PACK]},
    details: {target: at(holder.id), working, place}, expect};
}

const fieldGone = lawField => ({lawField, direction: 'changed', to: null});
const sustained = (verb, object) => ({verb, object, target: 'bound', time: 'sustained'});

const held = {
    'dangling-release': heldScene({
        seen: 'the suspended person drops to the ground',
        holder: body('suspended-person', 'midair', {}), working: 'suspension',
        sentence: sustained('block', 'position'),
        field: {id: 'suspension-field', kind: 'block', params: {verb: 'move', object: 'position'}, until: 3},
        landing: {from: 'midair', to: 'ground'},
        expect: [fieldGone('suspension-field'), {holder: 'suspended-person', position: true, direction: 'changed', to: 'ground'}],
    }),
    'counter-spell': heldScene({
        seen: 'the duellist can stand still once the compulsion ends',
        holder: body('duellist', 'platform', {}), working: 'dancing-compulsion',
        sentence: sustained('move', 'position'), effectDetails: {to: 'dance-spot'},
        field: {id: 'compulsion-field', kind: 'block', params: {verb: 'move', object: 'position'}, until: 3},
        expect: [fieldGone('compulsion-field')],
    }),
    quiet: heldScene({
        seen: 'the announcer returns to ordinary volume',
        holder: {...body('announcer', 'stadium', {}), quantities: {noise: 70}}, working: 'amplification',
        sentence: sustained('add', 'sound'), effectDetails: {amount: 50},
        output: {quantity: 'noise', amount: 50},
        expect: [{holder: 'announcer', quantity: 'noise', direction: 'down', amount: 50, to: 20}],
    }),
};

const sight = 'sight';
const presence = 'presence';
const observer = (id, place) => body(id, place, {senses: [sight, presence]});
export const HP_WORKING_INFO_SCENES = Object.freeze({
    'person-reveal': {
        seen: 'the caster detects somebody in the room',
        holders: [room('room'), observer('searcher', 'room'), observer('bystander', 'room'),
            body('hidden-person', 'room', {concealed: [sight]})],
        engine: {packs: [PRESENCE_PACK]}, by: 'searcher',
        details: {target: at('hidden-person'), channel: presence, presence: true, place: 'room'},
        expect: [property('searcher', 'sensed-presence', 'changed', ['room:presence']),
            property('bystander', 'sensed-presence', 'unchanged', null),
            property('hidden-person', 'concealed', 'unchanged', [sight])],
    },
    disillusion: {
        seen: 'the watcher loses sight of the concealed person',
        holders: [room('camp'),
            {...observer('watcher', 'camp'), properties: {senses: [sight, presence], 'sensed-presence': ['camp:sight']},
                state: {[PRESENCE_PACK]: {contacts: [{target: 'camper', place: 'camp', channel: sight}]}}},
            observer('camper', 'camp')],
        engine: {packs: [PRESENCE_PACK]}, by: 'camper',
        details: {target: at('camper'), channel: sight, presence: true, place: 'camp'},
        expect: [property('watcher', 'sensed-presence', 'changed', []),
            {holder: 'camper', exists: true, direction: 'unchanged', to: true}],
    },
});

// These require the qualified end publication to carry its resolved binding.
export const HP_WORKING_SCENES_PENDING_TRANSPORT = Object.freeze(held);
