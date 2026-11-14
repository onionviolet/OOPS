// First caller of the social contact owner (social_contact_domain.js): Harry and his friends at Hogwarts, lead life (proposal, AD32).
// Ron is the one school friend with a person record in this life; others join this table when their records exist (CX1).
// No pack change: the base definition is content-hashed and the school continuations pin that hash, so the food on offer is an
// optional item catalogue (items.js) and the acts run through the domain's plan/commit ports, not native commands.
import {registerContactWorld} from './social_contact_domain.js';
import {resolveWorldCalendar} from './world_calendar.js';
import {temperamentFromTraits} from './person_temperament.js';
import {HP_LEAD_MAKING_KEYS} from './hp_lead_making.js';
import {HP_LEAD_FEATHER_ID} from './hp_lead_spells.js';
import {getHpLeadMirror} from './book_world_hp_lead_mirror.js';
import {getHpLeadFlamel} from './book_world_hp_lead_flamel.js';
import {getHpLeadNorbert} from './book_world_hp_lead_norbert.js';
import {getHpLeadFinale} from './book_world_hp_lead_finale.js';
import {getHpLeadHalloween} from './book_world_hp_lead_halloween.js';
import {HP_TABLE_FOOD} from './hp_table_food_items.js';

const P = 'book.hp.lead', WORLD = `${P}.world`, HALL = `${P}.school_hall`, RON = `${P}.ron`;
const idOf = key => { try { return JSON.parse(key)?.id ?? null; } catch { return null; } };
const making = id => idOf(HP_LEAD_MAKING_KEYS[id]);

// How things Harry may hold read mid-sentence. Unknown things are not offered as gifts (the panel lists only what reads properly).
const PHRASES = new Map([
    [HP_LEAD_FEATHER_ID, 'your practice feather'],
    [making('nettles'), 'a twist of dried nettles'], [making('fangs'), 'a paper of crushed snake fangs'],
    [making('slugs'), 'a jar of stewed horned slugs'], [making('quills'), 'a bundle of porcupine quills'],
    [making('cure'), 'a flask of Cure for Boils'], [making('corrosive'), 'a flask of green sludge'],
    [`${P}.w9_flamel.frog`, 'your last Chocolate Frog'], [`${P}.w9_flamel.card`, 'Dumbledore’s wizard card'],
    ...HP_TABLE_FOOD.map(f => [f.id, f.phrase])]);
const TAGS = new Map(HP_TABLE_FOOD.map(f => [f.id, Object.keys(f.tags)]));
const extensionItems = () => [getHpLeadHalloween, getHpLeadMirror, getHpLeadFlamel, getHpLeadNorbert, getHpLeadFinale].flatMap(get => get()?.items || []);

// Ron's tastes. Source labels per SKR21: "stated" and "shown" are book 1 (Philosopher's Stone) with the chapter; "original" is ours.
//   Chocolate Frog · love · shown, ch. 6 (his eyes go to the pile on the train; he leaps at Goyle when Goyle reaches for them).
//   Famous Wizard card · like · shown, ch. 6 (he collects them and offers Harry his spares).
//   Sweets and cakes · like · shown, ch. 6 (he and Harry eat their way through all of Harry's pasties, cakes and sweets).
//   Corned beef · dislike · stated, ch. 6 ("she always forgets"). No corned beef can be had in this life yet, so no row uses it.
//   Peppermint humbug · neutral · original (on the feast table, ch. 7; his view of them is not given).
//   Stewed horned slugs · dislike, flask of green sludge · hate · original (nobody's idea of a present).
export const RON_TASTES = Object.freeze({
    items: Object.freeze({[`${P}.w9_flamel.frog`]: 'love', [`${P}.w9_flamel.card`]: 'like', [`${P}.food.peppermint_humbug`]: 'neutral',
        [making('slugs')]: 'dislike', [making('corrosive')]: 'hate'}),
    tags: Object.freeze([Object.freeze({tag: 'sweet', tier: 'like'})])});
// Ron's birthday, 1 March: from the author's own website, not stated in the books. The lead clock's day 0 is 31 July
// (book_world_hp_school_calendar.js), so 1 March is day 213 of each 365-day year (non-leap, as that file counts).
export const RON_BIRTHDAY_YEAR_DAY = 213;

const known = (state, key) => !!state?.simulation?.knowledge?.player?.[key];
const playerAt = state => state?.simulation?.people?.player?.location ?? state?.actors?.player?.location;
const atHall = state => playerAt(state) === HALL ? null : 'Go to the Great Hall first.';

export const HP_CONTACT = registerContactWorld({worldId: WORLD,
    people: {[RON]: {name: 'Ron', pronoun: {him: 'him', he: 'he', his: 'his'}, tastes: RON_TASTES, birthdayYearDay: RON_BIRTHDAY_YEAR_DAY,
        known: state => known(state, `${P}.ron_known`),
        here: state => playerAt(state) && playerAt(state) === state?.simulation?.people?.[RON]?.location ? null : 'Ron is in the Great Hall; go there first.'}},
    day(state) {
        let view = null; try { view = resolveWorldCalendar(state); } catch { view = null; }
        const day = Number.isSafeInteger(view?.absoluteLocalDay) ? view.absoluteLocalDay : Number.isSafeInteger(state?.clock) ? Math.floor(state.clock / 1440) : null; // rule-lint: allow fallback only when resolveWorldCalendar has no answer; identical to the old reading
        return day == null ? null : {day, yearDay: day % 365};
    },
    giftable(state, key) {
        const id = idOf(key);
        if(!id || !PHRASES.has(id)) return null;
        const ext = extensionItems().find(i => i.id === id), food = HP_TABLE_FOOD.find(f => f.id === id);
        return {id, name: food?.name ?? ext?.label ?? id, phrase: PHRASES.get(id), tags: TAGS.get(id) || []};
    },
    // A grudging person keeps a slight longer, an ungrateful one lets thanks fade sooner (MND2, as Dunn's rows do).
    tempo(state, id, minutes, magnitude) { const t = temperamentFromTraits(state?.simulation?.people?.[id]?.traits); return minutes * (magnitude < 0 ? t.harmFade : t.helpFade); },
    takeables: HP_TABLE_FOOD.map(f => ({id: `take.${f.id}`, label: `Save ${f.phrase} from the house table`, description: f.description,
        key: JSON.stringify({id: f.id}), minutes: 5, carryMax: 2, here: atHall}))});
