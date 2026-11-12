import {guCatalogue} from './gu_catalogue.js';
import {resolveGuActivation} from './gu_activation.js';
import {readGuSignals} from './gu_senses.js';

const prefix = 'book.ri.keeper';
export const smokePassage = `${prefix}.smoke_passage`;
export const smokeMouth = `${smokePassage}.mouth`;
export const smokeBend = `${smokePassage}.bend`;
export const smokeExit = `${smokePassage}.exit`;
export const smokeSteward = `${prefix}.steward`;
export const smokeAnnex = `${prefix}.annex`;
const world = `${prefix}.world`;
const key = `${smokePassage}.observations`;
const field = {
    [smokeMouth]: [
        {channel: 'sight', distance: 17, text: 'The straight trail has firm stones.'},
        {channel: 'sight', distance: 23, text: 'A rope marks a side trail.'},
        {channel: 'sight', distance: 46, text: 'A charred pine stands beyond the fork.'},
        {channel: 'sound', distance: 93, text: 'A wolf pack is coming down the straight trail.'},
    ],
    [smokeBend]: [
        {channel: 'sight', distance: 21, text: 'A line of stepping stones crosses the straight channel.'},
        {channel: 'sight', distance: 22, text: 'The side trail ends at a broken bank.'},
        {channel: 'sound', distance: 148, text: 'The wolves have moved away from the channel.'},
        {channel: 'sound', distance: 225, text: 'A second pack is beyond the channel.'},
    ],
};
const routes = {
    mouth: {site: smokeMouth, safe: 'side', wrong: 'wolves', destination: smokeBend},
    bend: {site: smokeBend, safe: 'straight', wrong: 'bank', destination: smokeExit},
};
export const smokeRoutes = routes;
export const smokeStewardDestinations = {start: smokeMouth, reenter: smokeMouth, mouth_side: smokeBend,
    bend_straight: smokeExit, mouth_rally: smokeMouth, bend_rally: smokeBend,
    mouth_send_back: smokeAnnex, bend_send_back: smokeAnnex, mouth_retreat: smokeAnnex,
    bend_retreat: smokeAnnex, return: smokeAnnex};
const sight = {...guCatalogue['lightning-eye'].ability.value,
    effect: {...guCatalogue['lightning-eye'].ability.value.effect, range: 50}};
const sound = guCatalogue['earth-communication-ear-grass'].ability.value;
const observationMinutes = 8;
const modes = {look: ['sight'], listen: ['sound'], combine: ['sight', 'sound']};
export const smokeOperations = Object.keys(routes).flatMap(leg => [...Object.keys(modes), 'wrong'].map(verb => `${leg}_${verb}`));
const done = (state, name) => state.actors.player.completed[`${smokePassage}.${name}`] ?? 0;
const pinned = record => record?.extensions?.some(row => row.id === smokePassage);
const present = (state, site) => state.simulation.people[smokeSteward]?.life === 'alive' &&
    state.simulation.people[smokeSteward].location === site;
const stored = state => 2 * (done(state, 'start') + done(state, 'replenish')) - Object.keys(routes).reduce((sum, leg) =>
    sum + done(state, `${leg}_listen`) + done(state, `${leg}_combine`), 0);

export function smokeOperationSite(operation) {
    return routes[operation.split('_')[0]]?.site;
}

function read(state) {
    const raw = state.worlds[world]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid smoke passage observations.');
    return JSON.parse(raw);
}

export function validateSmokePassage(state, record, eye) {
    const row = read(state);
    const started = done(state, 'start');
    const observations = smokeOperations.some(name => done(state, name));
    const valid = (value, maximum) => value === null || value && Number.isSafeInteger(value.at) &&
        value.at >= record.initializedAt && value.at <= state.clock && Number.isFinite(value.reach) && value.reach > 0 && value.reach <= maximum;
    if ((started || row || observations) && (!pinned(record) || !eye) || started > 1 || !!row !== observations || stored(state) < 0 ||
        (observations && (!started || !field[row.site] || !valid(row.sight, sight.effect.range / 2) || !valid(row.sound, sound.effect.range) ||
            ![null, 'wolves', 'bank'].includes(row.wrong) || (row.wrong !== null) !== (row.sight === null && row.sound === null)))) {
        throw Error('The smoke passage needs its observers, route and paid signals.');
    }
}

export function smokeFacts(state, eye) {
    const reserve = stored(state);
    return {[`${smokePassage}.eye`]: !!eye, [`${smokePassage}.signed`]: done(state, 'start') > 0,
        [`${smokePassage}.reserve`]: reserve, [`${smokePassage}.at_annex`]: present(state, smokeAnnex),
        ...Object.fromEntries(Object.entries(routes).map(([leg, {site}]) => [`${smokePassage}.${leg}_ally`, present(state, site)]))};
}

export function smokeView(state, record) {
    if (!pinned(record) || !done(state, 'start')) return null;
    const location = state.simulation.people.player.location;
    const row = read(state);
    const reach = Object.fromEntries(['sight', 'sound'].filter(channel => row?.site === location && row[channel] &&
        state.clock < row[channel].at + observationMinutes).map(channel => [channel, row[channel].reach]));
    return {ally: present(state, location), reserve: stored(state), site: location === smokeExit ? 'exit' : field[location] ? 'smoke' : 'away',
        expired: row?.site === location && !row.wrong && !Object.keys(reach).length, wrong: row?.site === location ? row.wrong : null,
        clues: readGuSignals(field[location] ?? [], reach).map(({text}) => text)};
}

export function applySmokePassage(state, record, operation, eye) {
    const [leg, verb] = operation.split('_');
    const route = routes[leg];
    const clock = state.clock;
    if (!pinned(record) || !eye || !done(state, 'start') || !route || state.simulation.people.player.location !== route.site) {
        throw Error('Enter the smoke passage with the recovered Eye.');
    }
    const channels = modes[verb] ?? [];
    const previous = read(state);
    const sameSite = previous?.site === route.site && verb !== 'wrong';
    const observations = {sight: sameSite ? previous.sight : null, sound: sameSite ? previous.sound : null};
    if (channels.length) {
        const ears = channels.includes('sound');
        if (ears && (!present(state, route.site) || stored(state) < sound.cost)) throw Error('The steward cannot hear for you here.');
        const stage = (id, kind, rank, operator, ability) => ({gu: {id, kind, rank, fedThrough: clock}, operator, ability});
        const stages = [
            ...(channels.includes('sight') ? [stage(eye, 'lightning-eye', 3, 'player', sight)] : []),
            ...(ears ? [stage(`${smokePassage}.ear_grass`, 'earth-communication-ear-grass', 2, smokeSteward, sound)] : []),
        ];
        const result = resolveGuActivation({day: clock, beats: [{stages, requires: {operators: channels.length, specimens: channels.length}}],
            reserves: {player: {primeval: sight.cost}, [smokeSteward]: {primeval: stored(state)}}});
        if (result.outcome !== 'complete' || result.effects.length !== channels.length) throw Error('The signals did not come through.');
        for (const effect of result.effects) {
            const visual = effect.kind === sight.effect.kind;
            observations[visual ? 'sight' : 'sound'] = {at: clock, reach: visual ? effect.range / 2 : effect.range};
        }
    }
    state.worlds[world].facts[key] = JSON.stringify({site: route.site, ...observations, wrong: verb === 'wrong' ? route.wrong : null});
}
