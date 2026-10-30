// Home fixtures (HB1-HB6) for the figure gallery and tests. Each goes through the same adapter the game
// uses (homeOverviewModel then homeFigureSpec) from a hand-written projection in the real shape.
// Invented names only; no canon names (CLR3).
import {homeOverviewModel, homeFigureSpec} from '../../../home_overview_model.js';
import {observerView, observerForProfile} from '../../../observer_view.js';
import {homeKey} from '../../../home_content.js';
import {QI_CRADLE} from '../../../cultivation_items.js';

const fitted = (...ids) => Object.fromEntries(ids.map(([slot, id]) => [slot, {key: homeKey(id), owner: 'player'}]));
const home = (id, name, extra = {}) => ({id, name, tenure: 'owned', owner: 'player', access: true, acquiredAt: 0, paidUntil: null, stock: {}, fixtures: {}, improvements: [], ...extra});
const projection = (homes, {here = homes[0], clock = 600, raining = false, projects = {}, form = 'human', observer = null, extraState = {}} = {}) => ({
    visible: true, ready: true, homes, here,
    context: {body: {form}, clock, raining, resources: {}, money: 40},
    state: {primary: homes[0].id, properties: {}, lodger: null, workers: {}, projects, ledger: [], ...extraState}, observer,
});

// A lived-in cottage after rain: bed and hearth fitted, side room restored, the roof sound, storage half used.
const COTTAGE = home('cottage', 'Willow House', {
    fixtures: fitted(['bed', 'Home plain bed'], ['blanket', 'Home ragwork blanket'], ['hearth', 'Home fitted hearth'], ['tableware', 'Home clay tableware'], ['box', 'Home storage box']),
    improvements: ['restore'], stock: {[homeKey('Rough wood log')]: 12},
    condition: {integrity: 92, wetness: 40, rainMinutes: 0, lastClock: 600},
});
export const HOME_COTTAGE_VIEW = projection([COTTAGE]);

// A woven nest in the wet: open to the weather, soaked lining, structure failing, storage full.
const NEST = home('nest', 'Canopy nest', {
    fixtures: fitted(['bed', 'Home nest lining']), stock: {[homeKey('Home dry grass')]: 4},
    condition: {integrity: 18, wetness: 620, rainMinutes: 90, lastClock: 600},
});
export const HOME_NEST_VIEW = projection([NEST], {form: 'bird', raining: true});

// A rented room with a few hours of lodging left, and a lean-to under construction at a wild site.
const RENTAL = home('rental', 'Riverside rented room', {tenure: 'rented', owner: 'riverside.host', paidUntil: 600 + 200,
    fixtures: {bed: {key: homeKey('Home plain bed'), owner: 'riverside.host'}}});
export const HOME_RENTAL_VIEW = projection([RENTAL], {projects: {shelter: {home: 'shelter', kind: 'build', required: 40, at: 500, materials: {}}}});

// The same manor, read by a seat that is told how the household field works and one that is not (UR80).
const MANOR = home('manor', 'Country manor', {tenure: 'shared', owner: 'arlmere.household',
    fixtures: {...fitted(['bed', 'Home plain bed'], ['hearth', 'Home fitted hearth']), qi: {key: homeKey(QI_CRADLE), owner: 'player'}}});
const withField = observer => projection([MANOR], {observer});
export const HOME_MANOR_FULL_VIEW = withField(observerView({}));
export const HOME_MANOR_LIMITED_VIEW = withField(observerForProfile('lotm.early_tingen.fixture'));

const spec = (view, id) => ({...homeFigureSpec(homeOverviewModel(view)), id});
export const HOME_FIXTURES = [
    spec(HOME_COTTAGE_VIEW, 'home-strip-cottage'),
    spec(HOME_NEST_VIEW, 'home-strip-nest-worn'),
    spec(HOME_RENTAL_VIEW, 'home-strip-rental'),
];
export const SEAT_LIMITED_PAIRS = [{id: 'home-strip-manor', full: spec(HOME_MANOR_FULL_VIEW, 'home-strip-manor-full'), limited: spec(HOME_MANOR_LIMITED_VIEW, 'home-strip-manor-limited')}];
