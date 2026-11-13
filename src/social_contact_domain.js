// Social contact owner (proposal under AD32): give a held thing, sit and talk, take a free thing on offer. Imports no world (AR3).
// Worlds declare their people, tastes, day and free stock with registerContactWorld; acts run through the plan(minutes)/commit ports
// (the inquiry.js route), and each gift or talk lands as one dated thought row through mood_thoughts_domain.addMoodThought, written
// only after the commit succeeds. No save slice of its own: the rows live in moodThoughts, the things in the native inventories.
// Readers: readMood (the mood sum) and whatever sums rows by subject (an opinion reader); both meet on {holder, subject: giver}.
import {registerDomain} from './domain_registry.js';
import {check} from './basics.js';
import {stageAcquisition} from './acquisition.js';
import {inventory, writeInventory} from './simulation_effects.js';
import {addMoodThought, readMood} from './mood_thoughts_domain.js';
import {tasteOf, giftThought, talkThought, CONTACT_LIMITS, CONTACT_SOURCES} from './social_contact.js';

const worlds = new Map();
let ports = null;
export const configureSocialContact = operations => { ports = operations; };
// world: {worldId, people: {[personId]: {name, pronoun: {him, he, his}, tastes, birthdayYearDay?, known(state), here(state) -> reason|null}},
//   day(state) -> {day, yearDay} | null, giftable(state, key) -> {id, name, phrase, tags} | null, tempo?(state, personId, minutes, magnitude),
//   takeables?: [{id, label, description, key, minutes, carryMax, here(state) -> reason|null}]}
export function registerContactWorld(world) {
    check(typeof world?.worldId === 'string' && world.people && typeof world.day === 'function' && typeof world.giftable === 'function', 'Invalid contact world.');
    worlds.set(world.worldId, world);
    return world;
}
export const contactWorld = worldId => worlds.get(worldId) || null;
const ready = () => { check(ports?.plan && ports.commit, 'The game is not ready for that yet.'); check(!ports.writable || ports.writable(), 'Use the writable game tab for that.'); };
const worldOf = state => contactWorld(state?.actors?.player?.worldId);
function personOf(state, personId) {
    const w = worldOf(state), p = w?.people?.[personId];
    check(p && state.simulation?.people?.[personId] && state.actors?.[personId], 'That person is not here in this life.');
    check(p.known(state), 'You have not met them yet.');
    return {w, p};
}
const tempoFor = (w, state, personId) => (minutes, magnitude) => w.tempo ? w.tempo(state, personId, minutes, magnitude) : minutes;
const heldGifts = (w, plan) => Object.entries(inventory(plan, 'player')).map(([key, count]) => ({key, count, item: w.giftable(plan.state, key)})).filter(r => r.item && r.count > 0);
const borrowed = (state, key) => Object.values(state.simulation?.custody || {}).some(c => c.holder === 'player' && c.key === key);
const equipped = (state, key) => Object.values(state.simulation?.equipment?.player || {}).includes(key);

// The view for the current world: each known person, the rows they hold about the player now (lines only, no numbers: TIE24), and
// what the player could give or take. Reasons say why an act cannot run (UR70-UR75).
export function contactView() {
    if(!ports?.plan) return null;
    let plan; try { plan = ports.plan(0); } catch { return null; }
    const state = plan.state, w = worldOf(state);
    if(!w) return null;
    const now = state.clock, today = w.day(state);
    const people = Object.entries(w.people).filter(([id, p]) => state.simulation?.people?.[id] && p.known(state)).map(([id, p]) => {
        const away = p.here(state), mood = readMood(id, now), rows = mood.rows.filter(r => r.subject === 'player');
        const gifts = heldGifts(w, plan).filter(g => !borrowed(state, g.key) && !equipped(state, g.key))
            .map(g => ({key: g.key, label: `Give ${p.name} ${g.item.phrase} · ${CONTACT_LIMITS.giftMinutes} min`, count: g.count}));
        const birthday = today && p.birthdayYearDay != null && today.yearDay === p.birthdayYearDay;
        return {id, name: p.name, here: !away, reason: away, birthday, lines: rows.map(r => r.line), gifts,
            talk: {label: `Sit and talk with ${p.name} · ${CONTACT_LIMITS.talk.minutes} min`},
            giftReason: gifts.length ? null : 'You are not carrying anything you could give.'};
    });
    const takeables = (w.takeables || []).map(t => {
        const held = inventory(plan, 'player')[t.key] || 0, away = t.here(state);
        return {id: t.id, label: `${t.label} · ${t.minutes} min`, description: t.description, eligible: !away && held < t.carryMax,
            reason: away || (held >= t.carryMax ? `You already have ${held} in your pockets.` : null)};
    });
    return {worldId: w.worldId, people, takeables};
}

function give({person, key} = {}) {
    ready();
    let plan = ports.plan(0);
    const {w, p} = personOf(plan.state, person);
    const away = p.here(plan.state); check(!away, away);
    const held = heldGifts(w, plan).find(g => g.key === key);
    check(held, 'You are not carrying that.');
    check(!borrowed(plan.state, key), 'That is on loan to you; it is not yours to give.');
    check(!equipped(plan.state, key), 'Take it off before you give it away.');
    plan = ports.plan(CONTACT_LIMITS.giftMinutes);
    const owners = stageAcquisition({from: inventory(plan, 'player'), to: inventory(plan, person)}, {transfers: [{from: 'from', to: 'to', key, count: 1}]});
    writeInventory(plan, 'player', owners.from); writeInventory(plan, person, owners.to);
    (plan.acquisitions ||= []).push({owner: person, key, count: 1});
    const today = w.day(plan.state), birthday = !!today && p.birthdayYearDay != null && today.yearDay === p.birthdayYearDay;
    const taste = tasteOf(p.tastes, held.item.id, held.item.tags || []);
    const row = giftThought({holder: person, tier: taste.tier, phrase: held.item.phrase, pronoun: p.pronoun, birthday, now: plan.state.clock, tempo: tempoFor(w, plan.state, person)});
    ports.commit(plan);
    addMoodThought(row, plan.state.clock); // after the commit: a refused save leaves no feeling behind
    return {tier: taste.tier, basis: taste.basis, birthday, line: row.line};
}
function talk({person} = {}) {
    ready();
    const first = ports.plan(0), {w, p} = personOf(first.state, person);
    const away = p.here(first.state); check(!away, away);
    const plan = ports.plan(CONTACT_LIMITS.talk.minutes), today = w.day(plan.state);
    check(today, 'The day cannot be read just now.');
    const row = talkThought({holder: person, pronoun: p.pronoun, day: today.day, tempo: tempoFor(w, plan.state, person)});
    ports.commit(plan);
    // The day key makes a second talk that day a no-op in the mood core; the new row is there only when this one counted.
    const now = plan.state.clock, until = now + row.minutes;
    addMoodThought(row, now);
    const counted = readMood(person, now).rows.some(r => r.source === CONTACT_SOURCES.talk && r.subject === 'player' && r.until === until);
    return {counted, line: row.line};
}
function take({id} = {}) {
    ready();
    const first = ports.plan(0), w = worldOf(first.state), t = (w?.takeables || []).find(x => x.id === id);
    check(t, 'There is nothing like that on offer here.');
    const away = t.here(first.state); check(!away, away);
    check((inventory(first, 'player')[t.key] || 0) < t.carryMax, 'Your pockets are full of that already.');
    const plan = ports.plan(t.minutes);
    writeInventory(plan, 'player', stageAcquisition({owner: inventory(plan, 'player')}, {grants: [{owner: 'owner', key: t.key, count: 1}]}).owner);
    (plan.acquisitions ||= []).push({owner: 'player', key: t.key, count: 1});
    ports.commit(plan);
    return {id, key: t.key};
}
registerDomain({id: 'socialContact', deps: ['moodThoughts'], initialState: () => null, projection: () => contactView(), commands: {give, talk, take, view: contactView}});
