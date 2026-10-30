// Gathering fixtures (GS1-GS6) for the figure gallery and tests. They go through the same read, model and adapter the
// game uses (readGatherSites, gatheringModel, gatheringFigureSpec) from a source table built with defineSourceTable.
// Invented names only (CLR3). The cases the live village does not have (a season map, hour and tool gates, odds,
// freshness) live here, labelled as fixtures, never as live data.
import {defineSourceTable, nodeKey} from '../../../craft_sources.js';
import {frontierCatalogue} from '../../../craft_content_frontier.js';
import {readGatherSites} from '../../../gathering_read.js';
import {gatheringModel, gatheringFigureSpec} from '../../../gathering_model.js';
import {observerView, observerForProfile} from '../../../observer_view.js';

const CAL = {worldId: 'fixture.world', profileId: 'local.cycle', profileRevision: 1, minutesPerHour: 60, hoursPerDay: 24, seasonTags: {Bloom: 'spring'}};
export const FIXTURE_SEASONS = [{id: 'Bloom', label: 'Bloom'}, {id: 'LongLight', label: 'Long light'}, {id: 'Fall', label: 'Fall'}, {id: 'Still', label: 'Still'}];
export const fixtureTable = defineSourceTable(frontierCatalogue, {id: 'fixture.gather', revision: 1, sources: [
    {id: 'reed-bank', name: 'Reed bank', kind: 'gather', capacity: 12, regenPerDay: 6, calendar: CAL, variants: {reedherb: 2},
        yields: [{family: 'reedherb', weight: 6, qty: [1, 3]}, {id: 'cut-reeds', family: 'reedherb', weight: 3, qty: [2, 4], tool: 'sickle'}, {id: 'dawn-dew', material: 'Spring water', weight: 2, hours: [4, 8]}],
        rare: {permille: 40, every: 25, yields: [{family: 'reedherb', qty: [1, 1], season: 'spring'}]}},
    {id: 'blossom-bed', name: 'Blossom bed', kind: 'gather', capacity: 8, regenPerDay: 2, calendar: CAL, variants: {bitterroot: 2},
        yields: [{id: 'blossom-root', family: 'bitterroot', weight: 1, qty: [1, 2], season: 'spring'}]},
    {id: 'salt-crust', name: 'Salt crust', kind: 'gather', capacity: 20, regenPerDay: 10, variants: {riversalt: 1}, yields: [{family: 'riversalt', qty: [1, 4]}]},
]});
const coordinate = (at, seasonId) => ({worldId: CAL.worldId, instanceId: 'local.one', profileId: CAL.profileId, profileRevision: 1, at, minuteWithinDay: at % 1440, seasonId, minutesPerHour: 60, hoursPerDay: 24});
const node = (id, stock, harvests, at = 0, calendar = true) => ({[nodeKey('fixture.world', 'bank', id, calendar ? 'local.one' : undefined)]: {stock, updatedAt: at, harvests, misses: 3,
    ...(calendar ? {calendar: {worldId: CAL.worldId, instanceId: 'local.one', profileId: CAL.profileId, profileRevision: 1, minutesPerDay: 1440}} : {})}});
const sites = (clock, seasonId, nodes, ids, actor = {}) => readGatherSites(fixtureTable, {sourceIds: ids, nodes, world: 'fixture.world', location: 'bank', clock, calendar: coordinate(clock, seasonId), actor});
const season = (id, progress) => ({id, list: FIXTURE_SEASONS, progress});

// Bloom, mid-morning, with a sickle: the dew has closed; the blossom is open; the Salt crust is new, so its yield is unknown.
const BLOOM_AT = 600 + 1440, bloomNodes = {...node('reed-bank', 9, 4, BLOOM_AT), ...node('blossom-bed', 8, 1, BLOOM_AT), ...node('salt-crust', 20, 0, BLOOM_AT, false)};
export const GATHER_BLOOM_VIEW = {visible: true, place: 'Willow bank', sites: sites(BLOOM_AT, 'Bloom', bloomNodes, ['reed-bank', 'blossom-bed', 'salt-crust'], {tools: ['sickle']}),
    now: {can: true, reason: ''}, season: season('Bloom', 0.4), weather: {words: 'Rain floods the lower reeds for a day; gathering waits.'}, insight: false, larder: []};
// Fall, afternoon, no sickle, bed gathered before: the dew has closed, the blossom is out of season, the bank is nearly bare.
const FALL_AT = 900 + 1440 * 200, fallNodes = {...node('reed-bank', 0, 6, FALL_AT), ...node('blossom-bed', 8, 2, FALL_AT)};
export const GATHER_FALL_VIEW = {visible: true, place: 'Willow bank', sites: sites(FALL_AT, 'Fall', fallNodes, ['reed-bank', 'blossom-bed']),
    now: {can: false, reason: 'The reeds are cut to the root; regrowth uses played time.'}, season: season('Fall', 0.7), weather: null, insight: false, larder: []};
// A world with no seasons: one site, no band, nothing said about seasons (AD46).
export const GATHER_PLAIN_VIEW = {visible: true, place: 'River flat', sites: sites(500, null, node('salt-crust', 14, 3, 500 - 420, false), ['salt-crust']),
    now: {can: true, reason: ''}, season: null, weather: null, insight: false, larder: []};
// The same bank read by a continuing-insight view (a cheat, marked), with freshness for carried herbs. Seat pair shows the rare row by seat (UR80).
const insightView = observer => ({...GATHER_BLOOM_VIEW, insight: true, observer, larder: [{name: 'Cut reeds', spent: 20 * 60, life: 24 * 60}, {name: 'Dew phial', spent: 30 * 60, life: 24 * 60}]});
export const GATHER_INSIGHT_FULL_VIEW = insightView(observerView({}));
export const GATHER_INSIGHT_LIMITED_VIEW = insightView(observerForProfile('lotm.early_tingen.fixture'));

const spec = (view, id, title) => gatheringFigureSpec(gatheringModel(view), {id, title});
export const GATHERING_FIXTURES = [
    spec(GATHER_BLOOM_VIEW, 'gather-bloom', 'Gathering: a season band, gates and stock'),
    spec(GATHER_FALL_VIEW, 'gather-fall', 'Gathering: depleted and out of season'),
    spec(GATHER_PLAIN_VIEW, 'gather-plain', 'Gathering: a world with no seasons'),
    spec(GATHER_INSIGHT_FULL_VIEW, 'gather-insight', 'Gathering: odds and freshness (revealed by cheat)'),
];
