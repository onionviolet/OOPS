// Reverend Insanity contest rows (chat C consumers FC1 and FC3). Data only: the
// moves, entrants and scenes run through contest.js with no code of their own.
// Canon structure is cited by chapter; every number is a dial with its reason
// (AD49: canon outcomes are the fixed points the dials are calibrated to, and
// tests/contest_consumers.test.js checks them across seeds).
// G owns Gu law and may adopt these rows into its world pack (SC5, SC9): the
// contest only says how the moves meet, not what a Gu is.
import {check} from '../basics.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {defineContestLaw} from '../contest.js';
import {contestBody} from '../contest_bodies.js';
import {guWorkingLaw, guMethods, guMoveMethod, guRef, asBoundGu} from '../gu_working_law.js';
import {guCatalogue} from '../gu_catalogue.js';

// G's own Gu workings entering a contest unchanged (SC9): the bridge binds the entrant's carried Gu, runs G's
// method on G's law, reads G's `damage` effects as effect sentences and debits what G's activation spent.
export const GU_CONTEST_DIALS = Object.freeze({
    bladeForce: {value: 14, why: 'Vitality one unit of Gu damage magnitude removes from an unarmoured body; a direct hit can drop a mortal hunter. Localized contact can route most of a hit into a limb.'},
});
const carried = actor => Object.fromEntries((actor.profile.gu ?? []).map(g => [g.id, g]));
export function guBridge(method) {
    return {
        law: guWorkingLaw, method,
        bindings: actor => {
            const byKind = Object.fromEntries((actor.profile.gu ?? []).map(g => [g.kind, g.id]));
            return Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, kind === 'operator'
                ? {kind: 'operator', id: actor.id}
                : guRef(byKind[guRoleKind(method, role)] ?? `${actor.id}.missing.${role}`)]));
        },
        facts: actor => ({reserves: {[actor.id]: {primeval: actor.quantities.primeval_essence ?? 0}}}),
        ports: actor => ({read: ref => ref.kind === 'operator' ? ref
            : carried(actor)[ref.id] ? asBoundGu({fedThrough: 1e9, alive: true, holder: actor.id, ...carried(actor)[ref.id]}) : null}),
        effects: rows => rows.filter(row => row.kind === 'damage')
            .map(row => ({verb: 'remove', object: 'vitality', amount: Math.round(row.magnitude * GU_CONTEST_DIALS.bladeForce.value)})),
        spent: (actor, facts) => ({primeval_essence: (actor.quantities.primeval_essence ?? 0) - (facts.reserves?.[actor.id]?.primeval ?? 0)}),
    };
}
// Which Gu kind fills a role: a move record names it per role; a single activation binds the method's own kind.
function guRoleKind(method, role) {
    const move = Object.values(guCatalogue).map(row => row.move?.value).find(m => m && `gu.move.${m.id}` === method.id);
    if (move) return move.roles.find(r => r.id === role)?.kind;
    return method.id.replace(/^gu\./, '').replace(/\.activate$/, '');
}

// Use the same timing and aim for the single-Gu comparison. Cost and force come
// from the bound Gu. The fixture uses the same ten-unit reach for both Gu.
const guBlade = kind => ({
    resolver: 'layers', type: 'slashing', steps: [6, 4], aim: 1.15, lethal: true,
    reach: 10, projectile: true, advance: 2, moveEvasion: 4, headOpening: 1.5,
    bridge: guBridge(guMethods(kind).activate),
    why: 'A thrown crescent of light. Timing and aim are authored contest dials.',
});

export const GU_ESSENCE = Object.freeze({id: 'primeval_essence', unit: 'part', min: 0, max: 1_000_000});

export const GU_CONTEST = defineContestLaw({
    id: 'c.gu_world', revision: 0, lethal: true,
    moves: {
        // Moonlight Gu's moonblade. Four prepared parts a throw (book_gu_lead_early_duel.js, ch65-70 acts).
        moonblade: {resolver: 'layers', type: 'slashing', steps: [6, 4], costs: {primeval_essence: 4}, power: 14, aim: 1.15, lethal: true,
            why: 'A thrown crescent of moonlight: a short gathering, then the cut. Power and aim are dials that let one blade drop a mortal hunter or a crippled wolf.'},
        // With Moonglow the blade reaches further and cuts harder (wolf front ch122-123 uses the stronger essence with Moonglow).
        moonglow_blade: {resolver: 'layers', type: 'slashing', steps: [6, 4], costs: {primeval_essence: 4}, power: 20, aim: 1.3, lethal: true,
            why: 'Moonglow brightens the blade: more reach and bite for the same four parts.'},
        bow_shot: {resolver: 'strike', steps: [9, 6], costs: {arrows: 1}, power: 9, lethal: true,
            tool: 'bow', minReach: 2, reach: 20, projectile: true,
            why: 'Draw and loose: a hunter\'s arrow. Slower than a thrown blade, about as deadly to an unarmoured body.'},
        // G's Moonlight Gu activation and the Little Light Moonblade killer move, run on G's law (ch22, ch34, ch70).
        moonlight_gu: guBlade('moonlight'),
        moonglow_gu: guBlade('moonglow'),
        little_light_moonblade: {resolver: 'layers', type: 'slashing', steps: [8, 4], aim: 1.3, lethal: true,
            bridge: guBridge(guMoveMethod(guCatalogue.moonlight.move.value)),
            why: 'Little Light doubles the blade\'s size and reach; one more beat to gather (ch70).'},
        drop_bow: {kind: 'drop', steps: [1], tool: 'bow', minReach: 2, ammunition: 'arrows'},
        close_in: {kind: 'advance', steps: [4], advance: 1},
        slip_past: {kind: 'cross', steps: [8], reach: 1, moveEvasion: 12, seekGlare: true},
        close_fist: {resolver: 'strike', steps: [4], power: 3, reach: 1, partRequired: 'hands', freeHand: 'bow'},
        fist: {resolver: 'strike', steps: [6], power: 3, why: 'A bare fist: quick and weak.'},
        bite: {resolver: 'strike', steps: [7], power: 3, lethal: true, why: 'A lunge and bite. Crippled wolves bite weakly (ch122: a crippled pack, not a healthy one).'},
    },
    dials: {kiteCrowd: {value: 2, why: 'On broken mountain ground a pack closes two at a time on a man who keeps moving; calibrated so the crippled pack hurts Fang Yuan by about the six health the scene costs (ch122-123).'}},
});

const body = (id, place, vitality, extra = {}) => contestBody(id, place, {vitality, stamina: 10, ...extra});

/** FC1: Fang Yuan against Wang Er and the hunters at the pit (vol. 1 ch66). */
export function wangErDuel({place = 'qing_mao.hunting_ground', essence = 16, attackGu = 'moonlight', sunlight = 90} = {}) {
    check(attackGu === 'moonlight' || attackGu === 'moonglow', 'Unknown attack Gu for the pit fixture.');
    const bodies = [
        {id: place, kind: 'place', tags: ['forest'], quantities: {'light:sun': sunlight}},
        body('fang_yuan', place, 30, {primeval_essence: essence}),
        body('wang_er', place, 18, {arrows: 1}),
        body('hunter_1', place, 14), body('hunter_2', place, 14), body('hunter_3', place, 14),
    ];
    const hunter = id => ({id, side: 'hunters', body: id, position: id === 'hunter_1' ? 3 : 6,
        profile: {attack: 8, evasion: 8, ...(id === 'hunter_1' && {exposedPart: 'hands'})},
        moves: ['close_fist', 'wait'], speed: 95,
        wants: {yieldAtSideHurt: 0.2, yieldPosture: 'kneeling', acceptsSurrender: false, guards: false},
        why: 'Ordinary hunters drop to their knees after seeing their companion wounded (ch66: two kneel after the first blade).'});
    const blade = attackGu === 'moonglow'
        ? {move: 'moonglow_gu', rank: 2}
        : {move: 'moonlight_gu', rank: 1};
    const entrants = [
        {id: 'fang_yuan', side: 'fang_yuan', body: 'fang_yuan', speed: 110, perception: 8, position: 0,
            profile: {attack: 16, evasion: 14, gu: [{id: 'fy.blade', kind: attackGu, rank: blade.rank}]},
            moves: ['slip_past', blade.move, 'close_fist', 'close_in'], wants: {acceptsSurrender: true}},
        {id: 'wang_er', side: 'hunters', body: 'wang_er', profile: {attack: 14, evasion: 12}, speed: 100, perception: 7, position: 5, held: {bow: 'wang_er.bow'},
            moves: ['bow_shot', 'drop_bow', 'close_fist', 'close_in'], wants: {fleeAt: 0, yieldAt: 0, acceptsSurrender: false},
            why: 'Wang Er stands and fights, bow first, then fists (ch66).'},
        hunter('hunter_1'), hunter('hunter_2'), hunter('hunter_3'),
    ];
    return {bodies, place, entrants, sunDirection: 1, quantities: [GU_ESSENCE, WORLD_QUANTITIES.light, {id: 'arrows', unit: 'arrow', min: 0, max: 1000}]};
}

/** FC3: a crippled lightning wolf pack against Fang Yuan before the wolf tide (vol. 2 ch122-123). */
export function crippledPackHunt({place = 'qing_mao.wolf_front', wolves = 20, essence = 20, cohortId = 'qing_mao.lightning_wolves'} = {}) {
    const bodies = [{id: place, kind: 'place', tags: ['mountain']}, body('fang_yuan', place, 30, {primeval_essence: essence})];
    const entrants = [{id: 'fang_yuan', side: 'fang_yuan', body: 'fang_yuan', profile: {attack: 16, evasion: 14}, speed: 120,
        perception: 8, moves: ['moonglow_blade', 'fist'], wants: {acceptsSurrender: false, kite: true},
        why: 'He cuts while moving out of reach, so he is faster than a crippled wolf (ch122-123).'}];
    for (let i = 1; i <= wolves; i += 1) {
        const id = `wolf_${String(i).padStart(2, '0')}`;
        bodies.push(body(id, place, 9));
        entrants.push({id, side: 'pack', body: id, profile: {attack: 10, evasion: 6}, speed: 80, perception: 6,
            moves: ['bite'], wants: {acceptsSurrender: false, pursues: true}, lifecycle: {cohortId}});
    }
    return {bodies, place, entrants, quantities: [GU_ESSENCE],
        sides: {pack: {breakAt: 0.25, why: 'The wolves keep working together until too many fall; then the survivors pull away (ch122-123). A quarter is the dial.'}}};
}
