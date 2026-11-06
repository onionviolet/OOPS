// AT15 mechanism proof: a fight in Tingen that spends real loaded rounds (FD3 ready stock), resolves each shot on the LOTM notch scale
// (FD2, book_world_lotm_bands.js via shotOdds) and reads the night and fog of the world clock (FD9 lotmLight). It is a proof opener, not
// campaign content: the first canon gunfight is ch103 P054, past the built windows, so the opponent is an original ordinary robber
// and the opener says so. Every number is an authored dial (WPR5/AD49) with its reason.
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {beFirearmFacts, beFirearmKeys, shotOdds, BE_FIREARM_DIALS} from './book_world_lotm_be_firearm.js';
import {winChance} from './book_world_lotm_bands.js';
import {lotmLight} from './book_world_lotm_events.js';
import {registerTempoOpener} from './tempo_starters.js';

export const LOTM_FIGHT_DIALS = Object.freeze({
    fogNotches: {value: 1, why: 'Fog takes about one notch off an aimed shot: the mark blurs past a few yards (Tingen light profile, visibility halved).'},
    range: {value: 'close', why: 'A robbery happens at arm\'s reach: the robber has to be close to threaten.'},
    reloadBatch: {value: 3, why: 'Three rounds at a time under pressure (ch199 P054).'},
    foeHp: {value: 40, why: 'Same tempo health scale as the road rival; the shot bridge decides how many hits drop it.'}
});
// An ordinary adult (no band): the first proof is a clerk with a revolver against a street robber, not against a Beyonder (an untrained shooter at
// short range has about a one-in-ten shot at a Sequence 8 Beyonder on the band scale, which the first walk showed; see the run record).
export const LOTM_PROOF_FOE = Object.freeze({id: 'book.lotm.proof.robber', name: 'A street robber', subject: null,
    body: Object.freeze({attack: 5, agility: 5, dexterity: 5, intuition: 5, attack_speed: .8, defense: 1, crit_rate: .05, crit_multiplier: 1.3, attack_count: 1})});
const PLAYER_MOVES = ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield', 'shoot', 'reload'];

const inLotm = state => state.actors?.player?.worldId === I.world && !!state.lotm;
function readStock(state) {
    const f = {};
    beFirearmFacts(state, f);
    const kinds = ['ordinary', 'silver'];
    const kind = kinds.reduce((best, k) => (f[`lotm.beFirearm.loaded.${k}`] || 0) > (f[`lotm.beFirearm.loaded.${best}`] || 0) ? k : best, kinds[0]);
    return {f, held: !!f['lotm.beFirearm.held'], kind, loaded: f[`lotm.beFirearm.loaded.${kind}`] || 0, carried: f[`lotm.beFirearm.carried.${kind}`] || 0, fired: f['lotm.beFirearm.practiceFired'] || 0};
}
// Pure: the odds of one shot at the proof foe in the current light, on the band scale.
export function lotmShot(state, {kind, fired}) {
    const light = lotmLight(state), o = shotOdds({fired, range: LOTM_FIGHT_DIALS.range.value, target: LOTM_PROOF_FOE.subject, kind});
    const delta = o.delta - (light.fog ? LOTM_FIGHT_DIALS.fogNotches.value : 0);
    return {chance: Math.round(winChance(delta) * 1000) / 1000, downIn: Math.max(1, o.hitsToDown), delta, fog: light.fog, night: light.night};
}
export function lotmFightQuote(state) {
    if(!inLotm(state)) return {visible: false};
    const s = readStock(state);
    if(!s.held) return {visible: false};
    if(state.simulation?.sessions?.player) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
    if(s.loaded < 1) return {visible: true, eligible: false, reason: 'Load the revolver first: the chambers are empty.'};
    const shot = lotmShot(state, s);
    return {visible: true, eligible: true, reason: `${s.loaded} loaded, ${s.carried} carried.${shot.fog ? ' Fog tonight: aimed shots are harder.' : shot.night ? ' It is dark.' : ''}`};
}
export function lotmFightSpec(state, context, {me, vitals, parts, enemyProfile}) {
    const s = readStock(state), shot = lotmShot(state, s), foe = LOTM_PROOF_FOE;
    return {id: 'lotm-proof-robber', title: 'A robber in the street', floor: 1,
        conditions: {light: shot.night ? 'dark' : 'day', ...(shot.fog ? {visibility: 'fog'} : {}), place: 'Tingen street'},
        fighters: [
            {id: 'player', name: 'You', side: 'a', speed: 100, parts, hp: vitals.health, maxHp: vitals.max_health, stamina: vitals.stamina, maxStamina: vitals.max_stamina,
                profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5, moves: PLAYER_MOVES,
                stock: {kind: s.kind, loaded: s.loaded, carried: s.carried, capacity: BE_FIREARM_DIALS.chambers, batch: LOTM_FIGHT_DIALS.reloadBatch.value,
                    keys: {loaded: beFirearmKeys.loaded(s.kind), carried: beFirearmKeys.carried(s.kind)}, start: {loaded: s.loaded, carried: s.carried},
                    vs: {[foe.id]: {chance: shot.chance, downIn: shot.downIn}}}},
            {id: foe.id, name: foe.name, side: 'b', speed: 100, hp: LOTM_FIGHT_DIALS.foeHp.value, maxHp: LOTM_FIGHT_DIALS.foeHp.value, stamina: 10, maxStamina: 10,
                profile: enemyProfile({...foe.body, health: LOTM_FIGHT_DIALS.foeHp.value, max_stamina: 10}, foe.name, foe.id), perception: 5, stealth: 5,
                goals: {survive: .6, aim: .4}}
        ]};
}
registerTempoOpener({id: 'lotm.proof.street', label: 'Face a street robber (proof fight)',
    text: 'Mechanism proof, not a book scene: an ordinary armed robber close up. Your loaded rounds are real and stay spent.',
    quote: lotmFightQuote, spec: lotmFightSpec});
