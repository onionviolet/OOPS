// COV15 gallery fixtures: one per read-model bridge (src/read_models), each fed an invented engine record so the gallery runs the same
// path the live view runs. Invented names only (CLR3). Registers itself into FIGURE_FIXTURES on import.
import {defineRitual, gradeRitual, ritualDial} from '../../../ritual_conditions.js';
import {benchWithRite} from '../../../read_models/rite_state_bridge.js';
import {withPursuitRange} from '../../../read_models/chase_range_bridge.js';
import {studyProjectFromLearn} from '../../../read_models/study_bridge.js';
import {placeHistorySpec} from '../../../read_models/place_history_bridge.js';
import {riteCircleSpec} from '../../rite_figure.js';
import {chaseSituation} from '../../combat_situation.js';
import {researchLadderSpec, researchMapSpec} from '../../../research_view.js';
import {buildEventBook} from '../../../world_events.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

const eq = fact => ({fact, op: 'eq', value: true});
const tags = physical => ({physical, functional: [], symbolic: []});

// Rite: graded by the shared mechanism over invented facts; the seat has learned both conditions, so the figure draws.
const RITE = defineRitual({id: 'fx.lantern', world: 'fx', formula: 'fx.lantern', scale: 'solitary', label: 'Rite of the Low Lantern', conditions: [
    {id: 'flame', label: 'A lantern that never gutters', principle: {id: 'steady', text: 'a flame that holds', wants: tags(['flame'])}, exact: {rule: eq('flame.true'), text: 'you hold a storm lantern'},
        substitutes: [{id: 'candle', rule: eq('flame.candle'), tags: tags(['flame']), text: 'a stub of candle, which gutters'}]},
    {id: 'hour', label: 'Before the first bird', principle: {id: 'dark', text: 'the world still asleep', wants: tags(['night'])}, exact: {rule: eq('hour.true'), text: 'it is the small hours'}, substitutes: []}]});
const graded = gradeRitual(RITE, {'flame.candle': true}, ritualDial('fx'));
export const RITE_BRIDGE_BENCH = benchWithRite({id: 'lantern_5', name: 'Lantern Warden', seq: 5, pathway: 'Lantern', status: 'brewable', minutes: 600, slots: [], formulaKnown: true, brewing: false, ready: false, left: 0, doses: 0},
    graded, {label: RITE.label, known: new Set(RITE.conditions.map(c => c.id))});
const riteSpec = riteCircleSpec(RITE_BRIDGE_BENCH);

// Chase: routes from the pursuit policy; the pursuer has made contact and named the weighbridge, so the range track draws.
const CHASE = {definitionId: 'fx.tollman', label: 'The tollman follows', status: 'contact', text: 'Someone asks to meet you at the weighbridge.', expiresAt: 610};
const ROUTES = [{from: 'Weighbridge', to: 'Mill lane', minutes: 12}, {from: 'Mill lane', to: 'Ferry steps', minutes: 25}, {from: 'Weighbridge', to: 'Ferry steps', minutes: 90}];
const chase = {...withPursuitRange(chaseSituation(CHASE), {routes: ROUTES, here: 'Ferry steps', pursuerSeenAt: 'Weighbridge', labelOf: p => p}), id: 'fx-chase-range'};
const chaseUnseen = {...withPursuitRange(chaseSituation({...CHASE, status: 'following', definitionId: 'fx.tollman2'}), {routes: ROUTES, here: 'Ferry steps', pursuerSeenAt: null, labelOf: p => p}), id: 'fx-chase-unseen'};

// Research: a learnable ability mid-practice, from a learnView-shaped record.
const LEARN = {id: 'fx.glimmer', stage: 'practicing', canLearn: false, refusedBy: [], gates: [{label: 'Watched a glimmer cast', met: true}, {label: 'Had the thread explained', met: true}],
    mastery: 2, masteryNeeded: 5, practiceMinutes: 45, sign: 'A faint warmth behind the eyes.'};
const project = studyProjectFromLearn(LEARN, {label: 'Glimmer', opensLabel: 'Cast a glimmer', known: new Set(['fx.glimmer'])});
const ladder = {...researchLadderSpec(project, {size: 640}), id: 'fx-study-bridge-ladder'}, map = {...researchMapSpec(project, {size: 720}), id: 'fx-study-bridge-map'};

// Place history: events at one place across two eras; the seat was there for the first and heard of the second.
const rec = (id, extra) => ({id, key: id, kind: 'public_event', placement: 'dated', scope: 'public', evidence: 'S', lineKey: `fx.${id}`, place: 'quay', ...extra});
const book = buildEventBook([rec('flood', {when: {day: 2}}), rec('fair', {when: {day: 40, endDay: 42}}), rec('future', {when: {day: 90}}), rec('secret', {when: {day: 4}, scope: 'private'}),
    rec('toll', {when: {day: 20}, spread: [{route: 'word', delayDays: 3}]})]);
const WORDS = {'fx.flood': 'The river took the lower quay.', 'fx.fair': 'A lamp fair filled the quay.', 'fx.toll': 'A toll was set on the ferry.'};
const history = {...placeHistorySpec(book, 'seat', 'quay', 41, {presence: (p, d) => ([2, 40, 41, 42].includes(d) ? 'quay' : null), channels: () => new Set(['word'])},
    {eras: [{id: 'early', label: 'The early years', fromDay: 0, toDay: 30}, {id: 'recent', label: 'This season', fromDay: 31, toDay: 100}], textOf: k => WORDS[k] ?? null, placeLabel: p => (p === 'quay' ? 'The Low Quay' : null)}), id: 'fx-place-history'};

export const BRIDGE_FIXTURES = [riteSpec, chase, chaseUnseen, ladder, map, history].filter(Boolean);
FIGURE_FIXTURES.push(...BRIDGE_FIXTURES);
