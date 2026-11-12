// Hogwarts duel rows (chat C consumer FC2): the Duelling Club, Chamber of
// Secrets ch11. Data only, run through contest.js. Spells here are contest
// rows that say how a cast meets its target; S owns the spells themselves and
// may map these rows onto its dictionary (SC9). A hit lands on a body
// quantity, not always health: Disarming takes the wand from the hand
// (focus), Tickling takes composure, the Dancing Feet charm takes footing.
// Numbers are dials with reasons, calibrated to the scene's outcomes (AD49).
import {defineContestLaw} from '../contest.js';
import {contestBody} from '../contest_bodies.js';

export const HOGWARTS_QUANTITIES = Object.freeze([
    {id: 'focus', unit: 'wand', min: 0, max: 1},
    {id: 'composure', unit: 'point', min: 0, max: 100},
    {id: 'footing', unit: 'point', min: 0, max: 100},
]);

export const HOGWARTS_CONTEST = defineContestLaw({
    id: 'c.hogwarts', revision: 0, lethal: false,
    // A wizard who cannot stand or stop laughing cannot duel on; without a wand there is nothing to cast (noMeans).
    endings: {composure: 'yielded', footing: 'yielded', noMeans: 'yielded'},
    moves: {
        expelliarmus: {resolver: 'notch', steps: [4, 3], requires: {focus: 1}, notch: 0.5,
            effects: [{verb: 'remove', object: 'focus', amount: 1}, {verb: 'remove', object: 'footing', amount: 30}],
            why: 'The Disarming Charm takes the wand and, cast hard, throws the target off its feet (ch11: Lockhart is blasted backwards).'},
        rictusempra: {resolver: 'notch', steps: [4, 3], requires: {focus: 1}, effects: [{verb: 'remove', object: 'composure', amount: 40}],
            why: 'The Tickling Charm doubles the target over with laughter; one charm does not end a duel, a third would.'},
        tarantallegra: {resolver: 'notch', steps: [4, 3], requires: {focus: 1}, effects: [{verb: 'remove', object: 'footing', amount: 40}],
            why: 'The Dancing Feet charm sets the legs jerking out of control.'},
        shield_guard: {kind: 'guard', target: 'self', steps: [8], requires: {focus: 1}, block: {focus: 2, composure: 1, footing: 1},
            why: 'A held block makes incoming charms on its objects harder to land (EF3 counterplay). Not cast in ch11; kept as a generic guard row.'},
    },
});

const wizard = (id, place) => contestBody(id, place, {vitality: 20, stamina: 10, focus: 1, composure: 100, footing: 100});

/** FC2a: Snape against Lockhart, the demonstration duel. FC2b: Harry against Draco, stopped by Snape. */
export function duellingClub(bout, {place = 'hogwarts.great_hall'} = {}) {
    const bodies = [{id: place, kind: 'place', tags: ['hall']}];
    if (bout === 'snape_lockhart') {
        bodies.push(wizard('snape', place), wizard('lockhart', place));
        return {bodies, place, entrants: [
            {id: 'snape', side: 'snape', body: 'snape', profile: {notch: 3, resist: 2}, speed: 120, moves: ['expelliarmus']},
            {id: 'lockhart', side: 'lockhart', body: 'lockhart', profile: {notch: -1, resist: -1}, speed: 90, moves: ['rictusempra']},
        ], quantities: HOGWARTS_QUANTITIES,
        why: 'Snape is a far stronger duellist than Lockhart (ch11); three notches against minus one is the dial for that gap.'};
    }
    check2(bout === 'harry_draco');
    bodies.push(wizard('harry', place), wizard('draco', place));
    return {bodies, place, limits: {landed: 2}, entrants: [
        {id: 'harry', side: 'harry', body: 'harry', profile: {notch: 0, resist: 0}, speed: 100, moves: ['rictusempra']},
        {id: 'draco', side: 'draco', body: 'draco', profile: {notch: 0, resist: 0}, speed: 100, moves: ['tarantallegra']},
    ], quantities: HOGWARTS_QUANTITIES,
    why: 'Two second-years of about equal skill; the bout is stopped once two charms have landed (ch11: each lands one and Snape ends it).'};
}
function check2(ok) {if (!ok) throw Error('Unknown Duelling Club bout.');}
