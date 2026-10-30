// Gathering model (GS1-GS6, docs/representations/GATHERING_AND_SEASONS.md): one pure read of the gather-site list
// (readGatherSites) into what a player decides from, in words, then into a figure spec built from the shared
// non-node forms: a gather-site table, a season band, chip rows for what each site gives, and bar rows for exact
// odds (insight view only) and freshness. No world ids, no season names and no number of seasons live here: a
// view with no season shows no band at all (AD46). Every fact is in words; marks and bars only repeat them (UR37).
import {registerCapability} from './seat_profiles.js';

export const GATHER_RARE_CAPABILITY = 'gather.rare_finds';
// Rare-find odds and the pity counter are mechanism knowledge: a seat that is not told them never sees the row (UR80).
registerCapability({id: GATHER_RARE_CAPABILITY, audience: 'world-mechanism'});

const KIND_WORD = {gather: 'Gather', mine: 'Mine', fish: 'Fish', hunt: 'Hunt', salvage: 'Salvage', tap: 'Tap', other: 'Work'};
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const spoken = id => cap(String(id).replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2'));
/** Default dial: yield odds in words. 50% and 20% are the bands; a world can tune them. */
export const oddsWord = permille => permille >= 500 ? 'often' : permille >= 200 ? 'sometimes' : permille > 0 ? 'seldom' : 'not now';

export function durationWords(minutes) {
    if (minutes < 60) return plural(Math.max(1, Math.round(minutes)), 'minute');
    if (minutes < 1440) return plural(Math.round(minutes / 60), 'hour');
    return plural(Math.round(minutes / 1440), 'day');
}
const gateWords = reason => reason.replace(/^only (\d+:\d+)-(\d+:\d+)$/, 'only $1 to $2');
const qtyWords = ([lo, hi]) => lo === hi ? `${lo} per find` : `${lo} to ${hi} per find`;

function regrow(site) {
    if (!site.regenPerDay) return 'does not regrow';
    const left = site.capacity - site.stock;
    const rate = `regrows ${site.regenPerDay} a ${site.dayMinutes === 1440 ? 'day' : 'local day'}`;
    if (left <= 0) return rate;
    return `${rate}, full in about ${durationWords(left * site.dayMinutes / site.regenPerDay)}`;
}

/**
 * gatheringModel(view) -> model | {empty}
 * view: {visible, place, sites (readGatherSites), now: {can, reason}|null, season: {id, list:[{id,label}], progress?}|null,
 *   weather: {words}|null, insight: boolean, larder: [{name, spent, life}], observer, nameOf?(yield)}
 */
export function gatheringModel(view) {
    const sees = request => (view.observer ? view.observer.sees(request) : true);
    if (!view.visible || !view.sites?.length) return {empty: view.visible ? 'Nothing here can be gathered.' : 'Your gathering places are elsewhere.', sites: []};
    // Default: the yield's own id (it defaults to the material or family id); regional variants are never named before they are held.
    const nameOf = view.nameOf || (y => spoken(y.id));
    const season = view.season?.id && view.season.list?.length ? {id: view.season.id, list: view.season.list, progress: view.season.progress ?? null,
        index: Math.max(0, view.season.list.findIndex(s => s.id === view.season.id))} : null;
    const sites = view.sites.map(site => {
        const yields = site.gathered ? site.yields.map(y => ({id: y.id, label: nameOf(y), qty: qtyWords(y.qty), odds: oddsWord(y.permille), permille: y.permille,
            openNow: !y.blocked.length, gates: y.blocked.map(gateWords), tool: y.tool, openSeasons: y.openSeasons})) : [];
        const depleted = !site.unavailable && site.stock <= 0;
        const open = yields.some(y => y.openNow);
        let now, state;
        if (site.unavailable) { now = 'Cannot be read right now'; state = 'unknown'; }
        else if (depleted) { now = `Depleted: ${regrow(site)}`; state = 'strained'; }
        else if (!site.gathered) { now = 'Open'; state = undefined; }
        else if (open) { now = 'Open now'; state = 'done'; }
        else { const why = [...new Set(yields.flatMap(y => y.gates))]; now = `Waiting: ${why.join('; ') || 'nothing takeable'}`; state = 'strained'; }
        return {id: site.id, name: site.name, kind: KIND_WORD[site.kind] || 'Work', stock: site.stock, capacity: site.capacity, fill: site.capacity ? site.stock / site.capacity : 0,
            stockWords: `${site.stock} of ${site.capacity} left`, regrow: regrow(site), gathered: site.gathered, yields, now, state,
            gives: site.gathered ? yields.map(y => y.label).join(', ') : 'not gathered here yet, so unknown',
            rare: site.gathered && site.rare && sees({capability: GATHER_RARE_CAPABILITY}) ? {permille: site.rare.permille, every: site.rare.every, misses: site.rare.misses} : null};
    });
    return {
        empty: null, place: view.place || '', sites, season,
        now: view.now || null, weather: view.weather?.words || null, insight: !!view.insight,
        fresh: (view.larder || []).filter(r => r.life > 0).map(r => ({name: r.name, left: Math.max(0, r.life - r.spent), life: r.life,
            words: r.spent > r.life ? 'spoiled' : `about ${durationWords(r.life - r.spent)} of freshness left`, spoiled: r.spent > r.life})),
        glance: `${plural(sites.length, 'site')} here${season ? ` · ${season.list[season.index].label}` : ''}${view.now ? ` · ${view.now.can ? 'you can gather now' : 'you cannot gather now'}` : ''}`,
    };
}

const SEASON_STATE = {current: 'current', other: 'pending'};

/** gatheringFigureSpec(model) -> a figure spec of non-node forms. A table row per site; a band only when the world has seasons. */
export function gatheringFigureSpec(model, {id = 'gathering', title = 'Gathering here', size = 900} = {}) {
    const spec = {id, title, size, summary: model.glance, tables: [], bands: [], chips: [], bars: [], notes: [], legend: []};
    spec.tables.push({id: `${id}-sites`, label: 'Sites here', barLabel: 'Stock', columns: [{label: 'Site', weight: 1.1}, {label: 'Stock', weight: 1.5}, {label: 'Gives', weight: 1.4}, {label: 'Right now', weight: 1.7}],
        rows: model.sites.map(s => ({id: s.id, cells: [`${s.kind}: ${s.name}`, s.regrow ? `${s.stockWords}; ${s.regrow}` : s.stockWords, s.gives, s.now], state: s.state,
            bar: Math.min(1, Math.max(0, s.fill)), barNote: s.stockWords}))});
    if (model.season) {
        const {list, index, progress} = model.season, lanes = ['Year'], spans = list.map((s, i) => ({from: i, to: i + 1, label: s.label, state: i === index ? SEASON_STATE.current : SEASON_STATE.other}));
        for (const site of model.sites) for (const y of site.yields) {
            if (!y.openSeasons || !y.openSeasons.length) continue;
            lanes.push(y.label);
            const lane = lanes.length - 1, ids = list.map(s => s.id);
            for (const sid of y.openSeasons) { const i = ids.indexOf(sid); if (i >= 0) spans.push({from: i, to: i + 1, lane, label: `${y.label} open`, state: i === index ? 'done' : 'pending'}); }
        }
        const band = {id: `${id}-seasons`, label: 'Seasons', lanes, axis: {from: 0, to: list.length, ticks: list.map((s, i) => ({at: i, label: s.label}))}, spans};
        if (progress != null) band.axis.mark = {at: index + Math.min(0.99, Math.max(0, progress)), label: 'now'};
        spec.bands.push(band);
    }
    for (const s of model.sites) if (s.yields.length) spec.chips.push({id: `${id}-gives-${s.id}`, label: `${s.name}: what it gives`, items: s.yields.map(y => ({label: y.label, state: y.openNow ? 'done' : 'strained',
        note: [y.qty, ...(model.insight ? [] : [y.odds]), ...y.gates].join('; ')}))});
    if (model.insight) {
        const rows = model.sites.flatMap(s => s.yields.map(y => ({label: `${s.name}: ${y.label}`, value: y.permille, max: 1000, words: y.openNow ? `about ${Math.round(y.permille / 10)}% of finds` : `closed: ${y.gates.join('; ')}`, state: y.openNow ? 'done' : 'strained'})));
        for (const s of model.sites) if (s.rare) rows.push({label: `${s.name}: rare find`, value: s.rare.permille, max: 1000, words: `about ${(s.rare.permille / 10).toFixed(1)}% a find${s.rare.every ? `, certain by find ${s.rare.every}` : ''}`, state: 'guessed'});
        if (rows.length) spec.bars.push({id: `${id}-odds`, label: 'Exact odds (revealed by cheat)', rows});
    }
    if (model.fresh.length) spec.bars.push({id: `${id}-fresh`, label: 'Freshness', rows: model.fresh.map(r => ({label: r.name, value: r.left, max: r.life, words: r.words, state: r.spoiled ? 'broken' : r.left < r.life / 4 ? 'strained' : 'done'}))});
    if (model.weather) spec.notes.push({text: model.weather});
    if (model.now && !model.now.can && model.now.reason) spec.notes.push({state: 'strained', text: model.now.reason});
    spec.legend = [{state: 'done', label: 'open now'}, {state: 'strained', label: 'waiting or depleted'}, ...(model.season ? [{state: 'current', label: 'this season'}] : [])];
    return spec;
}
