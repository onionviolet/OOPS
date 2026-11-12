// First wild consumer of the agency contract (AGC, docs/AGENCY_CONTRACT.md): a
// wild Liquor Worm that chooses where to be from hunger, fear and what it knows
// of the places it has visited, on the world substrate (WSC1-WSC14).
//
// Source: the Reverend Insanity Liquor Worm loves wine and is lured by it. The
// numbers are the existing Keeper scene's (gu_keeper_wild.js: wormMealMinutes
// 1440, wormReturnMinutes 60, its border and cellar places), copied as a data
// row rather than imported, so this pack touches no Gu module (PFP10). Today the
// Keeper worm moves on a fixed timer; here the same worm decides.
//
// Choice on the substrate: every input the choice reads is banded and every band
// edge is a watch, so far places settle a day of the worm's life in a handful of
// segments with the same totals as minute-by-minute play (AGC9, PFP12).
import {defineWorkingLaw} from './kernel_working.js';
import {bandOf, bandWatches, chooseWorking, defineAgent, recordChoice} from './agency.js';

export const LIQUOR_WORM_ROW = Object.freeze({
    source: 'gu_keeper_wild.js wormMealMinutes and wormReturnMinutes; RI Liquor Worm (wine lure)',
    mealMinutes: 1440, travelMinutes: 60,
    hungryBelow: {value: 360, why: 'A quarter-day short of a meal and the worm goes looking.'},
    drinkPerMinute: {value: 24, why: 'One cup a minute fills a day of hunger in about an hour, the Keeper scene\'s visit length.'},
});

// `satiety` is declared once, by l.living_body (AR3: a body's satiety belongs to
// living things). This pack reads and writes it without declaring it, so a world
// that loads the worm loads that pack or supplies the same declaration. The worm
// eats one ration a minute, so its ration-minutes are the row's minutes, and its
// fullness is the row's mealMinutes, not the quantity's bound.
export const WILD_QUANTITIES = Object.freeze({
    liquor: Object.freeze({id: 'liquor', unit: 'cup', min: 0, max: 100000}),
});

export const liquorWorm = defineAgent({id: 'a.wild.liquor_worm', revision: 0, label: 'The Liquor Worm',
    wants: {drink: {weight: 1, label: 'drink wine'}, safety: {weight: 0.9, label: 'stay clear of people'}, rest: {weight: 0.1, label: 'lie still'}},
    novelty: 0.5, pressureAt: 0.2});

const qty = (thing, name) => thing?.quantities?.[name] ?? 0;
export const forageLaw = defineWorkingLaw({id: 'a.forage', revision: 0, operations: {
    go: {roles: {mover: 'creature', to: 'place'}, settle: () => ({ok: true})},
    feed: {roles: {eater: 'creature', at: 'place'}, settle: ({bound}) => qty(bound.at, 'liquor') < 1
        ? {ok: false, reason: `It knows of no wine at the ${bound.at.id}.`} : {ok: true}},
    search: {roles: {seeker: 'creature', at: 'place'}, minutes: 30, settle: () => ({ok: true, observed: {searched: true}})},
    stay: {roles: {mover: 'creature'}, settle: () => ({ok: true})},
}});

const roles = {worm: 'creature', site: 'place'};
const steps = (travel, op) => [{op: 'go', bindings: {mover: 'worm', to: 'site'}, minutes: travel},
    {op, bindings: op === 'feed' ? {eater: 'worm', at: 'site'} : {seeker: 'worm', at: 'site'}}];
const method = (cid, travel, op) => ({id: `a.forage.${cid}`, revision: 0, law: forageLaw.ref, roles, steps: steps(travel, op)});

// Candidates from what the worm knows: home, drinking at each place it has seen,
// and any routine it invented earlier (kept in its own state, AGC8).
function candidates(view, id, s, here, people, minutesTo = () => LIQUOR_WORM_ROW.travelMinutes) {
    const travel = to => to === here ? 0 : minutesTo(view, here, to);
    const b = site => ({worm: {kind: 'creature', id}, site: {kind: 'place', id: site}});
    const list = [{id: 'home', label: here === s.home ? 'lies still at home' : 'goes home', law: forageLaw,
        method: {id: 'a.forage.home', revision: 0, law: forageLaw.ref, roles, steps: [{op: 'go', bindings: {mover: 'worm', to: 'site'}, minutes: travel(s.home)}]},
        bindings: b(s.home), serves: () => ({safety: 1, rest: 1}), target: s.home}];
    for (const site of Object.keys(s.beliefs).sort()) {
        if (site === s.home) continue;
        list.push({id: `drink:${site}`, label: `goes to drink at the ${site}`, law: forageLaw, method: method(`drink.${site}`, travel(site), 'feed'),
            bindings: b(site), target: site, serves: () => ({drink: 1, ...(site === here && people ? {safety: -1} : {})}),
            riskWhy: () => 'people are there'});
    }
    for (const r of s.repertoire) {
        list.push({id: r.id, label: `${r.verb}s for wine at the ${r.site}`, law: forageLaw, method: method(r.id.replace(/:/g, '.'), travel(r.site), 'search'),
            bindings: b(r.site), target: r.site, serves: () => ({drink: 0.5})});
    }
    return list;
}

function needs(s, satiety, people) {
    const band = bandOf(satiety, [LIQUOR_WORM_ROW.hungryBelow.value, LIQUOR_WORM_ROW.mealMinutes]);
    const drinking = s.doing?.startsWith('drink:');
    // Hysteresis: hungry below the edge; once drinking, it drinks until full.
    const drink = band === 0 ? {urgency: 1, why: 'it is hungry for wine'} : band === 1 && drinking ? {urgency: 0.3, why: 'it is not yet full'} : {urgency: 0};
    return {drink, safety: people ? {urgency: 1, why: 'people are close'} : {urgency: 0}, rest: {urgency: 1, why: band === 2 ? 'it has drunk its fill' : 'it can lie still in the hills'}};
}

// SPR30: invented routines kept per worm, oldest dropped first.
export const REPERTOIRE_CAP = 4;
const isWorm = h => h.kind === 'body' && h.tags.includes('a.wild.liquor_worm');

// invent(args) -> candidate | null is the NV4 hook, usually agency's
// inventBySearch over a P grammar (PR3, PR6): it calls args.build on drawn parts
// and the worm keeps the routine only if the same quote runs it.
const FULL = LIQUOR_WORM_ROW.mealMinutes, GAIN = LIQUOR_WORM_ROW.drinkPerMinute.value;
const drinking = (view, id) => {
    const s = view.state(id), here = view.placeOf(id);
    return s.doing === `drink:${here}` && !s.arriveAt && view.has(here, 'liquor') && view.amount(here, 'liquor') > 0 &&
        view.amount(id, 'satiety') < FULL;
};

// E10: `travel: {kinds?, minutesPerCost?}` makes the trip take the linked route's cost (times
// minutesPerCost, default 1) when the world links the two places; with no linked way, or without the
// setting, the trip is the row's cross-country travelMinutes.
export function createWildAgencyPack({invent = null, travel = null} = {}) {
    const minutesTo = (view, from, to) => {
        const way = travel && view.distance(from, to, {kinds: travel.kinds});
        return way ? Math.max(1, way.cost * (travel.minutesPerCost ?? 1)) : LIQUOR_WORM_ROW.travelMinutes;
    };
    const choose = (view, id) => {
        const s = view.state(id), here = view.placeOf(id), satiety = view.amount(id, 'satiety');
        const people = view.present(here).some(x => view.holder(x).tags.includes('person'));
        const knows = ref => ref.kind === 'creature' ? {kind: 'creature', id: ref.id, quantities: {satiety}}
            : view.holder(ref.id)?.kind === 'place' ? {kind: 'place', id: ref.id, quantities: {liquor: s.beliefs[ref.id]?.liquor ?? 0}} : null;
        const list = candidates(view, id, s, here, people, minutesTo);
        let fresh = null;
        // Grammar parts {verb, site} become a search routine; a site it already
        // knows, or where it stands, is not new.
        const build = value => {
            const made = {id: `${value.parts.verb}:${value.parts.site}`, verb: value.parts.verb, site: value.parts.site, cause: value.cause};
            if (made.site === here || Object.hasOwn(s.beliefs, made.site)) return null;
            const c = candidates(view, id, {...s, beliefs: {}, repertoire: [made]}, here, people, minutesTo).find(x => x.id === made.id);
            return c ? {...c, made} : null;
        };
        const wrap = invent && (args => {
            const c = invent({...args, here, home: s.home, known: Object.keys(s.beliefs), build});
            if (!c?.made || args.existing.includes(c.id)) return null;
            fresh = c;
            return fresh;
        });
        const choice = chooseWorking({agent: liquorWorm, needs: needs(s, satiety, people), candidates: list, at: view.clock, actor: id, knows, invent: wrap});
        const picked = choice.choice === null ? null : list.find(c => c.id === choice.choice) ?? (fresh?.id === choice.choice ? fresh : null);
        return {choice, picked, fresh};
    };
    return {
        id: 'a.wild_agency', revision: 0,
        quantities: [WILD_QUANTITIES.liquor],
        reads: ['liquor', 'satiety'], writes: ['liquor', 'satiety'],
        laws: [{
            id: 'appetite', appliesTo: isWorm,
            rates: (view, id) => {
                const out = [{holder: id, quantity: 'satiety', perMinute: -1}], here = view.placeOf(id);
                // The last cup only tops it up: a full worm holds one meal.
                if (drinking(view, id)) out.push({holder: here, quantity: 'liquor', perMinute: -1},
                    {holder: id, quantity: 'satiety', perMinute: Math.min(GAIN, FULL - view.amount(id, 'satiety')) + 1});
                return out;
            },
            // Cut the segment where a whole cup no longer fits, so the top-up minute is its own.
            watches: (view, id) => drinking(view, id) ? bandWatches(id, 'satiety', [FULL - GAIN + 1]) : [],
        }, {
            id: 'choose', appliesTo: isWorm,
            watches: (view, id) => {
                const here = view.placeOf(id);
                return [...bandWatches(id, 'satiety', [LIQUOR_WORM_ROW.hungryBelow.value, LIQUOR_WORM_ROW.mealMinutes]),
                    ...(view.has(here, 'liquor') ? bandWatches(here, 'liquor', [1]) : [])];
            },
            horizon: (view, id) => { const s = view.state(id); return s.arriveAt ? s.arriveAt - view.clock : Infinity; },
            decide: (view, id) => {
                let s = view.state(id);
                const ops = [];
                let here = view.placeOf(id);
                if (s.arriveAt && s.arriveAt <= view.clock) {
                    if (s.target !== here) ops.push({op: 'move', holder: id, to: s.target});
                    here = s.target;
                    s = {...s, arriveAt: null};
                }
                if (s.arriveAt) return [];
                // What it sees where it is replaces what it believed (SPR31, route seen).
                const seen = view.has(here, 'liquor') ? {liquor: bandOf(view.amount(here, 'liquor'), [1])} : null;
                if (seen && JSON.stringify(s.beliefs[here]) !== JSON.stringify(seen)) s = {...s, beliefs: {...s.beliefs, [here]: seen}};
                const sView = {...view, state: () => s, placeOf: x => x === id ? here : view.placeOf(x)};
                const {choice, picked, fresh} = choose(sView, id);
                const target = picked?.target ?? here;
                const doing = choice.choice;
                let next = s;
                if (doing !== s.doing || (choice.invented && !s.repertoire.some(r => r.id === choice.invented))) {
                    const made = choice.invented && fresh?.made ? [...s.repertoire, fresh.made].slice(-REPERTOIRE_CAP) : s.repertoire;
                    next = {...s, doing, target, arriveAt: target === here ? null : view.clock + minutesTo(view, here, target),
                        repertoire: made, ring: recordChoice(s.ring, choice)};
                }
                const before = view.state(id);
                if (JSON.stringify(next) === JSON.stringify(before) && !ops.length) return [];
                return [{op: 'state', holder: id, value: next}, ...ops];
            },
        }],
        reactors: [],
    };
}

export function liquorWormState(home) {
    return {home, doing: 'home', target: home, arriveAt: null, beliefs: {}, repertoire: [], ring: []};
}
