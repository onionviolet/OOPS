import {BASE_MIN_DAMAGE_SHARE, effectiveDamageTaken, effectiveCritChance} from "./gear_dimensions.js";

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
// Order: flat defense and the chip floor first, then the percent layer (ESD1). The
// defaults reproduce the original math exactly.
export function mitigateCombatDamage(values, defense = 0, {floorShare = BASE_MIN_DAMAGE_SHARE, taken = 1} = {}) {
    return values.map(val => val < 1 ? Math.max(Math.ceil(10*val*taken)/10,0)
        : Math.ceil(10*Math.max(val-defense,val*floorShare,1)*taken)/10).reduce((sum,val) => sum+val,0);
}

// Actual actor snapshots share these defensive layers. Callers keep local guard,
// shield and world policy in the supplied stats/defense modifier.
export function mitigateCombatDamageFromStats(values, stats, defenseModifier = 0, armorPenetration = 0, typeMultiplier = 1) {
    // Native points bypass that many points of nonnegative flat armor. Guard
    // modifiers, shields, the chip floor and percent resistance keep their laws.
    const armor=stats.defense??0,penetration=Number.isFinite(armorPenetration)?Math.max(0,armorPenetration):0;
    // typeMultiplier is the damage_types.js scalar (attack mix x defender per-type modifier); 1 is the original math.
    const mitigated = mitigateCombatDamage(values, armor-Math.min(Math.max(0,armor),penetration) + defenseModifier, {
        floorShare: stats.min_damage_share,
        taken: effectiveDamageTaken(stats.damage_taken),
    });
    return scaleByType(mitigated, typeMultiplier);
}
// The damage_types.js scalar applied after the percent layer; shared with the "Could down you" bound so they cannot drift.
export function scaleByType(mitigated, typeMultiplier = 1) {
    return typeMultiplier === 1 || !Number.isFinite(typeMultiplier) ? mitigated : Math.round(10*mitigated*Math.max(0,typeMultiplier))/10;
}

// Every caller passes a draw from a saved stream; an unseeded call fails loudly
// instead of silently breaking replay.
const unseeded = () => {throw new Error("Combat rolls need a saved random stream.");};

export function rollBaseCombatDamage(attackPower, count, modifier = 1, random = unseeded) {
    return Array.from({length:count},() => Math.round(10*modifier*attackPower*(1.2-random()*.4))/10).sort((a,b)=>b-a);
}

export function nextAttackTiming(previous, now, interval, accumulator, limit) {
    const variance=accumulator+(now-previous)-interval;
    return {variance,adjustment:Math.max(-limit,Math.min(limit,variance))};
}

export function rollCombatStrike({attackPower, attacker, target, shield, shieldSkill = 0,
    hitModifier = 1, evasionModifier = 1, damageModifier = 1, random = unseeded}) {
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
    const critted = effectiveCritChance(attacker.crit_rate, target.crit_resistance) > random();
    if(critted) values = values.map(v => v*attacker.crit_multiplier);
    return {kind:"hit",values,critted,partiallyBlocked};
}
