// Native frontier tuning. These are continuous responses to the opponent's stats.
export const counterTraits = Object.freeze({
    seam: {name:'Seam seeker', hook:'on_connectedstrike', owner:'attacker', stat:'defense', scale:3, low:true, change:.18, counter:'Armor reduces the extra damage from a landed bite.'},
    brace: {name:'Braced hide', hook:'on_strike', owner:'defender', stat:'strength', compare:'dexterity', change:-.2, counter:'Dexterity offsets the hide’s resistance to strength.'},
    pursuit: {name:'Long pursuit', hook:'on_connectedstrike', owner:'attacker', stat:'agility', scale:12, low:true, change:.16, counter:'Agility reduces the extra damage of a pursuing strike.'},
    feint: {name:'False retreat', hook:'on_strike', owner:'attacker', stat:'intuition', scale:10, low:true, change:.14, counter:'Intuition helps read the feint.'},
    roll: {name:'Rolling guard', hook:'on_strike', owner:'defender', stat:'dexterity', compare:'strength', change:-.18, counter:'Strength helps drive a precise strike through the guard.'},
});
