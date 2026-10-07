export function get_hit_chance(attack_points, evasion_points) {
    let result = attack_points/(attack_points+evasion_points);

    if(result >= 0.80) {
        result = 0.971+(result-0.8)**1.4;
    } else if(result >= 0.70) {
        result = 0.846+(result-0.7)**0.9;
    } else if(result >= 0.6) {
        result = 0.688+(result-0.6)**0.8;
    } else if(result >= 0.50) {
        result = 0.53+(result-0.5)**0.8;
    } else if(result >= 0.40) {
        result = 0.331+(result-0.4)**0.7;
    } else if(result >= 0.3) {
        result = 0.173 + (result-0.3)**0.8;
    } else if(result >= 0.20) {
        result = 0.073 + (result-0.2);
    } else if(result >= 0.10) {
        result = 0.01 + (result-0.1)**1.2;
    } else {
        result = 0;
    }

    return result;
}


// Used by native Combat and saved NPC battles. The caller owns draws and effects.
export function mitigateCombatDamage(values, defense = 0) {
    return values.map(val => val < 1 ? Math.max(Math.ceil(10*val)/10,0)
        : Math.ceil(10*Math.max(val-defense,val*.05,1))/10).reduce((sum,val) => sum+val,0);
}

export function rollBaseCombatDamage(attackPower, count, modifier = 1, random = Math.random) {
    return Array.from({length:count},() => Math.round(10*modifier*attackPower*(1.2-random()*.4))/10).sort((a,b)=>b-a);
}

export function nextAttackTiming(previous, now, interval, accumulator, limit) {
    const variance=accumulator+(now-previous)-interval;
    return {variance,adjustment:Math.max(-limit,Math.min(limit,variance))};
}

export function rollCombatStrike({attackPower, attacker, target, shield, shieldSkill = 0,
    hitModifier = 1, evasionModifier = 1, damageModifier = 1, random = Math.random}) {
    let values = rollBaseCombatDamage(attackPower,attacker.attack_count || 1,damageModifier,random);
    let partiallyBlocked = false;
    if(shield) {
        if(target.block_chance > random()) {
            values = values.map(v => v*(1-shieldSkill/100));
            if(shield > values[0]) return {kind:"blocked",values:[],critted:false,partiallyBlocked:false};
            values = values.map(v => Math.max(0,v-shield)); partiallyBlocked = true;
        }
    } else if(get_hit_chance(attacker.attack_points*hitModifier,target.agility*evasionModifier*Math.sqrt(target.intuition ?? 1)) < random()) {
        return {kind:"evaded",values:[],critted:false,partiallyBlocked:false};
    }
    const critted = attacker.crit_rate > random();
    if(critted) values = values.map(v => v*attacker.crit_multiplier);
    return {kind:"hit",values,critted,partiallyBlocked};
}
