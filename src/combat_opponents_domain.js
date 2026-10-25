import {configureCombatReview} from './combat_review_domain.js';
import {combatSubject} from './combat_subject.js';
import {registerDomain} from './domain_registry.js';
// Observer-safe opponent projection (PP5). Publishes only what the native combat view already shows,
// from the same readout, as inherited native disclosure (NX22): not AD8 learned knowledge. No save slice,
// command or clock. No template ids, tags, levels, loot or XP leave this module.
export const DISCLOSURE = 'native-legacy';
const fact = (id, label, value, number, extra) => ({id, label, known: true, value, number, ...extra});
export function opponentFacts(r) {
    const facts = [fact('attack', 'Attack', `${r.attack.power} dmg${r.attack.count > 1 ? ` x${r.attack.count}` : ''}`, r.attack.power, {count: r.attack.count}),
        fact('speed', 'Speed', `${r.speed} /s`, r.speed)];
    if(r.solo) facts.push(r.opposingShield ? fact('hits-you', 'Hit you', '100%', 100, {shield: true}) : fact('hits-you', 'Hit you', `${r.hitPct}%`, r.hitPct));
    else facts.push(fact('attack-rating', 'Attack rating', String(r.attackPoints), r.attackPoints));
    if(r.shield) facts.push(fact('block', 'Block', String(r.block), r.block));
    else if(r.solo) facts.push(fact('evades-you', 'Evade you', `${r.evadePct}%`, r.evadePct));
    else facts.push(fact('evasion-rating', 'Evasion rating', String(r.evasionPoints), r.evasionPoints));
    facts.push(fact('defense', 'Defense', String(r.defense), r.defense));
    if(r.youHitPct !== null) facts.push(fact('you-hit', 'You hit them', `${r.youHitPct}%`, r.youHitPct));
    return facts;
}
export function projectOpponents(combat, readout) {
    if(!combat || combat.is_ended || !combat.attackers?.[0]?.tags?.main_character) return {schema: 1, active: false, disclosure: DISCLOSURE, count: 0, alive: 0, opponents: []};
    const opponents = combat.defenders.map((_, index) => {
        const r = readout(combat, {fighter_index: index, is_attacker: false});
        return {id:combatSubject(combat,combat.defenders[index]), slot: `opponent-${index + 1}`, index, name: r.name, defeated: r.defeated,
            health: {current: r.health.current, max: r.health.max, fraction: Math.min(1, r.health.bar / 100)}, facts: opponentFacts(r)};
    });
    return {schema: 1, active: true, disclosure: DISCLOSURE, count: opponents.length, alive: opponents.filter(o => !o.defeated).length, opponents};
}
let registered = false;
export function registerCombatOpponents({getCombat, readout}) {
    configureCombatReview({getCombat,readout});
    if(registered) return; registered = true;
    registerDomain({id: 'combat-opponents', projection: () => projectOpponents(getCombat(), readout)});
}
