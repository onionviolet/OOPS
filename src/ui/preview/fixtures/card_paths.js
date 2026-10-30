// FIXTURE (labelled one, Round 12 gate 1): an invented cultivation-like realm path, to prove the pathway card draws any world's ladder through
// the same read model. Nothing here is a real world's data.
import {definePath} from '../../../ascension_paths.js';
import {ladderToGraph} from '../../../ascension_graph.js';

export const REALM_PATH = definePath({id: 'fixture.realms', world: 'fixture.sect', label: 'Hollow Reed realms', shape: 'ladder', stages: [
    {id: 'mortal', label: 'Mortal body', crossings: [], grants: []},
    {id: 'gathering', label: 'Gathering', grants: ['Feel the thin air-breath'], crossings: [
        {id: 'breath_form', type: 'insight', label: 'The seated breathing form', fact: 'form', need: true},
        {id: 'reed_tea', type: 'consume', label: 'Reed-root tea, three cups', fact: 'tea', need: 3}]},
    {id: 'rooted', label: 'Rooted', grants: ['A steadier breath', 'Light body'], crossings: [
        {id: 'breath_hours', type: 'quota', label: 'Hours of seated breathing', fact: 'hours', need: 40},
        {id: 'elder_nod', type: 'recognition', label: 'An elder\'s sign-off', fact: 'nod', need: true},
        {id: 'root_trial', type: 'trial', label: 'The rooting rite at the river bend, at dawn', fact: 'rite', need: true, irreversible: true}],
        failure: {signs: 'Breath that will not settle, a cold ache under the ribs', outcome: 'A delay of a season, or a lasting bottleneck injury'}},
    {id: 'lantern', label: 'Lantern', grants: ['Light the inner lantern'], crossings: [
        {id: 'lantern_token', type: 'consume', label: 'A lantern-heart from the sect hall', fact: 'heart', need: true}]},
]});
export const REALM_GRAPH = ladderToGraph(REALM_PATH);
export const REALM_DEFS = {
    byCrossing: {
        breath_form: {provenance: 'fill', routes: [{kind: 'teacher', action: 'ask_elder'}, {kind: 'study', action: 'read_scroll'}]},
        reed_tea: {provenance: 'fill', routes: [{kind: 'gather', action: 'gather_reed'}, {kind: 'purchase', action: 'buy_tea'}]},
        breath_hours: {provenance: 'fill', routes: [{kind: 'practice', action: 'sit_breath'}], short: {signs: 'The breath stays shallow', outcome: 'The rite is refused'}},
        elder_nod: {provenance: 'emergent', level: 3, routes: [{kind: 'service', action: 'serve_hall'}]},
        root_trial: {provenance: 'fill', short: {signs: 'The river runs cold against the skin', outcome: 'A bottleneck injury'}},
        lantern_token: {family: 'token', provenance: 'fill', routes: [{kind: 'win', action: 'enter_contest'}]},
    },
    extras: {to_rooted: [{id: 'no_injury', family: 'condition', label: 'No bottleneck injury carried', fact: 'sound', provenance: 'fill'},
        {id: 'omen', family: 'condition', label: 'A sign at the river bend', fact: 'omen', provenance: 'fill', level: 1}]},
};
export const REALM_ACTIONS = {
    ask_elder: {label: 'Ask the elder for the form', eligible: true, minutes: 20},
    read_scroll: {label: 'Read the sect scroll', eligible: false, reason: 'The archive is closed until noon'},
    gather_reed: {label: 'Gather reed-root at the marsh', eligible: true, minutes: 90},
    sit_breath: {label: 'Sit in breathing', eligible: true, minutes: 60},
    serve_hall: {label: 'Serve in the sect hall', eligible: true, minutes: 120},
    enter_contest: {label: 'Enter the hall contest', eligible: false, reason: 'Not until the autumn contest'},
};
// Three discovery states in one fixture: the next rung known, the one past it named only, the last unknown.
export const REALM_CARD_INPUT = {group: 'Qi realms', name: 'Hollow Reed realms', summary: 'Breath-work that roots the body, then lights a lantern within.',
    graph: REALM_GRAPH, held: ['gathering'], facts: {form: true, tea: 3, hours: 17, nod: false, rite: false, sound: true, heart: false},
    knowledge: {to_lantern: 3}, actions: REALM_ACTIONS, defs: REALM_DEFS};
