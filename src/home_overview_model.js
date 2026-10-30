// Home overview model (HB1-HB6, docs/representations/HOMES_AND_BASES.md): one pure read of the existing
// home projection (projectHomes) into what a player decides from, in words: rooms and fittings, upkeep,
// storage, household, construction and weather. No new state and no engine rule: every number is the
// owner's (conditionOf, homeCapacity, homeComfort, projectProgress). The observer filters what is shown
// (UR80); a seat that may not see the household field never sees the field chamber row.
import {DOMICILE_FURNITURE as F, HOME_PLACES as P, HOME_IMPROVEMENTS as I} from './home_content.js';
import {registerCapability} from './seat_profiles.js';
import {HOME_WORKERS} from './home_workers.js';
import {homeCapacity, homeComfort, homeUsable} from './home_model.js';
import {conditionOf, homeSupportsRest, projectProgress, HOME_EXPOSURE} from './home_building_model.js';

export const HOME_FIELD_CAPABILITY = 'home.household_field';
// World-mechanism knowledge: a seat that is not told how the household field works never sees its chamber (UR80).
registerCapability({id: HOME_FIELD_CAPABILITY, audience: 'world-mechanism'});
const fixtureOf = key => { try { return F[JSON.parse(key).id] || null; } catch { return null; } };
// A room group names what a player expects in a home; the slots are the engine's own fitting slots.
export const FITTING_GROUPS = Object.freeze([
    {id: 'sleep', label: 'Sleep', slots: ['bed', 'blanket', 'pillow']},
    {id: 'hearth', label: 'Hearth', slots: ['hearth']},
    {id: 'table', label: 'Table', slots: ['tableware']},
    {id: 'study', label: 'Study and practice', slots: ['shelf', 'incense']},
    {id: 'storage', label: 'Storage', slots: ['basket', 'box']},
    {id: 'play', label: 'Companion corner', slots: ['toy']},
    {id: 'field', label: 'Field chamber', slots: ['qi'], capability: HOME_FIELD_CAPABILITY},
]);
const MINUTES_DAY = 1440;
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
export function timeWords(minutes) {
    if (minutes <= 0) return 'none left';
    if (minutes < 60) return plural(minutes, 'minute');
    if (minutes < MINUTES_DAY) return plural(Math.round(minutes / 60), 'hour');
    return plural(Math.round(minutes / MINUTES_DAY), 'day');
}
const soundWord = n => n >= 80 ? 'sound' : n >= 50 ? 'worn' : n > 20 ? 'failing' : 'unfit to sleep in';
const dampWord = n => n >= 500 ? 'soaked' : n >= 150 ? 'damp' : 'dry';

function groupsFor(home, form, sees) {
    const place = P[home.id], homeForm = place.forms[0];
    return FITTING_GROUPS.filter(g => {
        if (g.capability && !sees({capability: g.capability})) return false;
        if (g.id === 'play' && !home.household?.animal) return false;
        if (g.id === 'field' && !home.fixtures.qi) return false;
        return Object.values(F).some(f => g.slots.includes(f.slot) && f.forms.includes(homeForm));
    });
}

/**
 * homeOverviewModel(view, {homeId}) -> model | {empty}
 * view is projectHomes() plus `observer` (observerView). Returns every fact as words.
 */
export function homeOverviewModel(view, {homeId} = {}) {
    const observer = view.observer, sees = request => (observer ? observer.sees(request) : true);
    if (!view.visible || !view.homes.length) {
        return {empty: view.visible ? 'No home yet. The Village home supplier rents and sells places to live; a wild site lets you build one from gathered material.' : 'Your known homes are elsewhere.', homes: []};
    }
    const c = view.context, id = view.homes.some(h => h.id === homeId) ? homeId : (view.here?.id || view.state.primary || view.homes[0].id);
    const h = view.homes.find(x => x.id === id), place = P[h.id], q = conditionOf(h);
    const usable = homeUsable(h, c), local = view.here?.id === h.id;
    const model = {
        id: h.id, empty: null,
        homes: view.homes.map(x => ({id: x.id, name: x.name, here: view.here?.id === x.id, main: view.state.primary === x.id})),
        header: {name: h.name, tenure: `${h.tenure}${h.owner === 'player' ? ' · title yours' : ''}`, here: local, usable,
            where: local ? 'You are here.' : `Away: ${place.location}.`, comfort: homeComfort(h)},
    };

    // Fittings: one step per group; the note says what stands there. Sleep also reads the roof.
    const fittings = groupsFor(h, c.body.form, sees).map(g => {
        const fitted = g.slots.filter(s => h.fixtures[s]).map(s => fixtureOf(h.fixtures[s].key)?.name).filter(Boolean);
        const step = {id: g.id, label: g.label, state: fitted.length ? 'done' : 'empty', note: fitted.length ? fitted.join(', ') : 'nothing fitted'};
        if (g.id === 'sleep' && !homeSupportsRest(h) && !place.legacy) { step.state = 'broken'; step.note = `${step.note}; the shelter is too worn to rest in`; }
        else if (g.id === 'sleep' && q.wetness >= 500) { step.state = 'strained'; step.note = `${step.note}; bedding is soaked and gives no rest bonus`; }
        if (g.id === 'storage') {
            const used = Object.values(h.stock).reduce((a, b) => a + b, 0), cap = homeCapacity(h);
            step.state = used >= cap ? 'strained' : 'done'; step.note = `${used} of ${cap} units used${fitted.length ? '; ' + fitted.join(', ') : ''}`;
        }
        return step;
    });
    model.fittings = fittings;

    // Rooms: only a home that allows homeowner work lists its rooms (the owned cottage today).
    const roomsAllowed = h.tenure === 'owned' && h.id === 'cottage';
    model.rooms = roomsAllowed ? Object.entries(I).map(([rid, room]) => ({
        id: rid, label: room.name,
        state: h.improvements.includes(rid) ? 'done' : 'empty',
        note: h.improvements.includes(rid) ? 'built' : 'not built yet',
    })) : [];

    // Upkeep: soundness, dampness, prepaid lodging. A home with no tracked condition says so, not "100%".
    const upkeep = [];
    if (!place.legacy) upkeep.push({id: 'soundness', label: 'Structure', value: q.integrity, max: 100, words: `${q.integrity} of 100 · ${soundWord(q.integrity)}`, warn: q.integrity < 50},
        {id: 'dampness', label: 'Dampness', value: Math.floor(q.wetness / 10), max: 100, words: `${Math.floor(q.wetness / 10)} of 100 · ${dampWord(q.wetness)}`, warn: q.wetness >= 150});
    if (place.period) {
        const left = Math.max(0, h.paidUntil - c.clock);
        upkeep.push({id: 'lodging', label: 'Prepaid lodging', value: Math.min(left, place.period), max: place.period, words: `${timeWords(left)} left · ${place.price} coins a day`, warn: left < 360});
    }
    model.upkeep = upkeep;
    const used = Object.values(h.stock).reduce((a, b) => a + b, 0), cap = homeCapacity(h);
    model.storage = {used, cap, words: `${used} of ${cap} units used`, warn: used >= cap};

    // Weather: what rain does to this home, from the owner's exposure table. Not a forecast.
    const exposed = HOME_EXPOSURE[h.id] || 0;
    model.weather = {raining: c.raining === true,
        words: `${c.raining ? 'Raining now. ' : 'Dry now. '}${exposed ? (h.weatherproof ? 'Weatherproofed: rain wears this home half as fast.' : 'Open to the weather: rain wets it and slowly wears it down.') : 'A sound roof; rain does not wear it.'}`};

    // Household: who lives or works here, as recorded.
    const household = [];
    const lodger = view.state.lodger;
    if (lodger?.home === h.id) household.push({id: 'lodger', text: `A lodger has the guest room: ${timeWords(Math.max(0, lodger.paidUntil - c.clock))} prepaid.`});
    for (const [wid, a] of Object.entries(view.state.workers || {})) if (a.home === h.id && HOME_WORKERS[wid]) household.push({id: 'worker:' + wid, text: `${HOME_WORKERS[wid]} rooms here on the ${a.shift} rota.`});
    const animal = h.household?.animal;
    if (animal?.adopted) household.push({id: 'companion', text: `A companion lives here and seems ${animal.mood || 'settled'}.`});
    else if (animal) household.push({id: 'companion', text: 'A stray visits; it has not settled yet.'});
    model.household = household;

    // Construction: a project for this home, with real progress and the material in custody.
    model.construction = Object.values(view.state.projects || {}).filter(p => p.home === h.id).map(p => {
        const done = projectProgress(p, c);
        return {id: `${p.home}:${p.kind}`, kind: p.kind, value: Math.min(done, p.required), max: p.required,
            words: `${{build: 'Building', repair: 'Repairing', weatherproof: 'Weatherproofing'}[p.kind]}: ${Math.min(done, p.required)} of ${p.required} work done`};
    });
    model.sites = Object.values(view.state.projects || {}).filter(p => p.home !== h.id && !view.homes.some(x => x.id === p.home)).map(p => `${P[p.home]?.name || 'A new home'}: ${p.kind} under way elsewhere.`);

    // Next steps: only things this view can name from the same data; the action itself lives in Homes.
    const next = [];
    if (!place.legacy && !homeSupportsRest(h)) next.push({id: 'repair', text: 'Repair the structure before resting here.'});
    else if (!place.legacy && q.integrity < 60) next.push({id: 'repair', text: 'The structure is wearing; repair it before it fails.'});
    if (place.period && h.paidUntil - c.clock < 360) next.push({id: 'renew', text: 'Lodging runs out soon; renew it to keep access.'});
    if (usable && !h.fixtures.bed && fittings.some(f => f.id === 'sleep')) next.push({id: 'bed', text: 'Fit a bed to rest properly here.'});
    if (!local) next.push({id: 'travel', text: `Travel to ${place.location} to use this home.`});
    model.next = next.slice(0, 3);
    return model;
}

/** Figure spec: the room strip. Horizontal tracks: fittings, then rooms when the home has them. */
export function homeFigureSpec(model) {
    if (model.empty) return null;
    const done = list => list.filter(s => s.state === 'done').length;
    const tracks = [{id: 'fittings', label: 'Fittings', orient: 'horizontal', progress: `${done(model.fittings)} of ${model.fittings.length} fitted`, steps: model.fittings}];
    if (model.rooms.length) tracks.push({id: 'rooms', label: 'Rooms', orient: 'horizontal', progress: `${done(model.rooms)} of ${model.rooms.length} built`, steps: model.rooms});
    return {id: `home-strip-${model.id}`, title: `${model.header.name}: rooms and fittings`, summary: `${model.header.comfort.label}. ${model.header.where}`, size: 720, tracks,
        notes: model.fittings.filter(f => f.state === 'broken' || f.state === 'strained').map(f => ({state: f.state, text: `${f.label}: ${f.note}`})),
        legend: [{state: 'done', label: 'fitted or built'}, {state: 'empty', label: 'not yet'}, {state: 'strained', label: 'works, with a problem'}, {state: 'broken', label: 'cannot be used'}]};
}
